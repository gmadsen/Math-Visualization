#!/usr/bin/env node
// Audit cross-page "See also" callbacks.
//
// Semantics:
//   - Every concept entry in concepts/<topic>.json has a bare-id `prereqs` array.
//     Some of those ids belong to other topics (cross-topic edges). Each such
//     edge should manifest on the host topic's HTML page as an
//     <aside class="callback"> block inside the section that owns the concept,
//     linking to `<other-topic>.html#<anchor>` with the target concept's title.
//
//   - A prereq id that resolves to a concept in the *same* topic file is an
//     intra-page link; no callback needed (the sidetoc already covers it).
//
// Modes:
//   default           Scan + print a report; exit 1 if any missing callback.
//   --fix             Regenerate canonical fenced <aside class="callback"> blocks
//                     in `content/<topic>.json` (the source of truth) for topics
//                     that have one, falling back to direct HTML mutation for
//                     the 15 legacy HTML-only topics.  Idempotent.
//   --dry-run         Alias for default (scan-only).
//
// Re-runnable: safe to run repeatedly. Treats the union of existing
// <a href="other.html#anchor"> inside the section as covered.
//
// Source-of-truth flip (2026-04-24): every <topic>.html is regenerated from
// its `content/<topic>.json` by `test-roundtrip.mjs --fix` later in the
// rebuild chain. Mutating HTML for those topics is a no-op (the next
// roundtrip overwrites it). Therefore the --fix path mutates JSON when a
// `content/<slug>.json` exists, falling back to HTML for the 15 unmigrated
// topics.
//
// Consumes the shared content model (scripts/lib/content-model.mjs) to avoid
// re-parsing concept JSON and HTML pages. Section-element lookup uses the
// pre-parsed DOM (sections map / getElementById); host-range offsets are
// derived from element `.range` metadata so the HTML --fix writer can still
// do byte-identical raw-HTML string splicing.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse as parseHtml } from 'node-html-parser';
import { escapeRe } from './lib/audit-utils.mjs';
import { loadContentModel } from './lib/content-model.mjs';
import {
  loadTopicContent,
  saveTopicContent,
  upsertFencedBlock,
  updateCss,
  findSection as findJsonSection,
} from './lib/json-block-writer.mjs';

const argv = process.argv.slice(2);
const FIX = argv.includes('--fix');

const model = await loadContentModel();
const { repoRoot, topics, concepts, ownerOf } = model;

// ----- Collect cross-topic edges per (host topic, host section anchor) -----
// key = `${hostTopic}::${hostAnchor}` -> Array<{ page, anchor, title, id }>
const needed = new Map();
let totalEdges = 0;
for (const topic of topics.values()) {
  for (const conceptId of topic.conceptIds) {
    const c = concepts.get(conceptId);
    if (!c || !c.anchor) continue;
    if (c.topic !== topic.id) continue; // first-writer-wins — skip overrides
    const key = `${topic.id}::${c.anchor}`;
    for (const p of c.prereqs) {
      const owner = ownerOf.get(p);
      if (!owner) continue; // broken prereqs are validator's job
      if (owner.topic === topic.id) continue; // same-page, skip
      if (!needed.has(key)) needed.set(key, []);
      const arr = needed.get(key);
      if (!arr.some((e) => e.page === owner.page && e.anchor === owner.anchor)) {
        arr.push({
          page: owner.page,
          anchor: owner.anchor,
          title: owner.title,
          id: p,
        });
        totalEdges++;
      }
    }
  }
}

// ----- Sort link lists deterministically -----
for (const arr of needed.values()) {
  arr.sort((a, b) => (a.page + a.anchor).localeCompare(b.page + b.anchor));
}

// ----- Scan pages -----
const missingReport = [];
let insertedCount = 0;
let existingCount = 0;

// Find the "block" owned by a concept anchor. The anchor can be either a top-level
// <section id="anchor"> or a sub-heading like <h3 id="anchor"> inside a section.
//
// Returns { innerStart, innerEnd, body }, shape-compatible with the prior
// regex-based implementation:
//   innerStart = offset just after the element carrying id="anchor"
//   innerEnd   = offset of the next heading-with-id (<h2|h3|h4 id=...>) or
//                nested <section id=...> after this anchor, or the enclosing
//                </section>, whichever comes first.
//   body       = raw-HTML slice between the two.
//
// Uses the pre-parsed DOM from loadContentModel() to locate the anchor
// element and the next boundary element, then derives byte offsets from
// element `.range` metadata so downstream --fix splicing stays byte-exact.
// `conceptAnchors` (Set<string> | null) gates which heading/section ids count
// as concept-boundaries while slicing the body. When non-null, only ids in
// the set are treated as boundaries — decorative <h3 id="..."> sub-headings
// (not registered concept anchors) are skipped over so callbacks placed AFTER
// such a sub-heading still land in the slice. Callers must pass the registered
// concept-anchor set for the topic; passing null falls back to the legacy
// permissive behaviour (any id-bearing boundary tag) for backwards compat.
function findSection(topic, rawHtml, anchor, conceptAnchors) {
  // 1. Resolve the element that carries id="anchor".
  let anchorEl = topic.sections.get(anchor) || null;
  if (!anchorEl && topic.html && typeof topic.html.getElementById === 'function') {
    anchorEl = topic.html.getElementById(anchor);
  }
  if (!anchorEl || !anchorEl.range) return null;

  // 2. innerStart = position just after the element's opening tag.
  const [elStart] = anchorEl.range;
  const gt = rawHtml.indexOf('>', elStart);
  if (gt < 0) return null;
  const innerStart = gt + 1;

  // 3. Find the next boundary element.
  //    - If anchorEl is <section>: the next concept-boundary is a nested
  //      <h2|h3|h4 id=...> or <section id=...> inside it (walk descendants).
  //    - If anchorEl is <h2|h3|h4>: walk its *following siblings* inside the
  //      same parent <section>, looking for the next heading-with-id or
  //      nested section-with-id.
  //    Fallback for both: end of enclosing <section> (just before </section>).
  //
  // When `conceptAnchors` is supplied, only nodes whose `id` is in that set
  // count as boundaries — decorative <h3 id="..."> sub-headings (not
  // registered as concept anchors) are skipped over. Without this filter,
  // intra-section headings would prematurely truncate the body slice and
  // cause false-negative "missing link" reports when a callback aside is
  // placed AFTER such a sub-heading.
  const tag = (anchorEl.rawTagName || '').toLowerCase();
  const isConceptBoundary = (n) => {
    if (!n || n.nodeType !== 1 || !n.id || !n.range) return false;
    const t = (n.rawTagName || '').toLowerCase();
    if (t !== 'h2' && t !== 'h3' && t !== 'h4' && t !== 'section') return false;
    if (conceptAnchors && !conceptAnchors.has(n.id)) return false;
    return true;
  };
  let boundaryStart = -1;

  if (tag === 'section') {
    // Walk descendants for the first boundary that's actually a registered
    // concept anchor (when conceptAnchors is supplied) or any heading/section
    // with id (legacy fallback). querySelectorAll preserves document order.
    const cands = anchorEl.querySelectorAll('h2[id],h3[id],h4[id],section[id]');
    for (const cand of cands) {
      if (cand === anchorEl) continue;
      if (!isConceptBoundary(cand)) continue;
      boundaryStart = cand.range[0];
      break;
    }
  } else {
    // Heading anchor: scan following siblings for a concept-boundary.
    const parent = anchorEl.parentNode;
    if (parent && Array.isArray(parent.childNodes)) {
      const kids = parent.childNodes;
      const idx = kids.indexOf(anchorEl);
      for (let i = idx + 1; i < kids.length; i++) {
        const n = kids[i];
        if (!isConceptBoundary(n)) continue;
        boundaryStart = n.range[0];
        break;
      }
    }
  }

  // 4. Close fallback: end of enclosing <section> (minus </section>).
  let sectionEnd = -1;
  const enclosing = tag === 'section' ? anchorEl : findEnclosingSection(anchorEl);
  if (enclosing && enclosing.range) {
    const [, rEnd] = enclosing.range;
    const closeTag = `</${(enclosing.rawTagName || 'section').toLowerCase()}>`;
    const closeStart = rawHtml.lastIndexOf(closeTag, rEnd);
    if (closeStart >= 0 && closeStart >= innerStart) sectionEnd = closeStart;
  }

  let innerEnd;
  if (boundaryStart >= 0 && (sectionEnd < 0 || boundaryStart < sectionEnd)) {
    innerEnd = boundaryStart;
  } else if (sectionEnd >= 0) {
    innerEnd = sectionEnd;
  } else {
    innerEnd = rawHtml.length;
  }

  return {
    innerStart,
    innerEnd,
    body: rawHtml.slice(innerStart, innerEnd),
  };
}

function findEnclosingSection(el) {
  let cur = el && el.parentNode;
  while (cur) {
    if ((cur.rawTagName || '').toLowerCase() === 'section') return cur;
    cur = cur.parentNode;
  }
  return null;
}

// Build an ad-hoc topic-like view ({ html, sections }) from a raw HTML string.
// Used after --fix mutates a page so findSection() gets fresh element offsets
// aligned with the new rawHtml.
function reparseTopicView(rawHtml) {
  const root = parseHtml(rawHtml, {
    blockTextElements: { script: true, noscript: true, style: true, pre: true },
  });
  const sections = new Map();
  for (const sec of root.querySelectorAll('section[id]')) {
    if (sec.id) sections.set(sec.id, sec);
  }
  return { html: root, sections };
}

// Extract every <li>...</li> from an existing callback aside, keyed by
// the href in its first <a>. Used so the regenerator can re-emit them
// verbatim — preserving both the link target AND any "— context" prose
// authors typed in by hand.
function extractCallbackLis(existingAside) {
  const liByHref = new Map();
  const liOrder = [];
  let warning = null;
  if (!existingAside || typeof existingAside !== 'string') {
    return { liByHref, liOrder, warning };
  }
  // Capture every <li>...</li>, then on each, extract the first href.
  const liRe = /<li>[\s\S]*?<\/li>/gi;
  let m;
  while ((m = liRe.exec(existingAside)) !== null) {
    const liHtml = m[0].trim();
    const hrefMatch = /<a\s+[^>]*href=["']([^"']+)["']/i.exec(liHtml);
    if (!hrefMatch) continue;
    const href = hrefMatch[1].trim();
    if (!liByHref.has(href)) {
      liByHref.set(href, liHtml);
      liOrder.push(href);
    }
  }
  // Fidelity check — count opening <li> tags vs matched closed-pair blocks.
  // An unclosed `<li>` (typo, mid-edit save) would be silently dropped by
  // the regex above, narrowing the very prose-loss the additive rebuild
  // was meant to prevent. Surface the discrepancy so callers can warn.
  const openCount = (existingAside.match(/<li[\s>]/gi) || []).length;
  const matchedCount = liByHref.size + (liOrder.length - liByHref.size);
  // matchedCount equals number of <li>...</li> pairs we processed (some
  // may have been deduped by href; that's ok). openCount may legitimately
  // be smaller too if the same <li> renders mixed-form content. We only
  // flag when openings clearly exceed pairs — that's the unclosed case.
  const pairCount = (existingAside.match(/<\/li>/gi) || []).length;
  if (openCount > pairCount) {
    warning =
      `aside has ${openCount} <li> openings but only ${pairCount} </li> closes — ` +
      `${openCount - pairCount} unclosed item(s) will be silently dropped from the regenerated aside`;
  }
  return { liByHref, liOrder, warning };
}

// Canonical-but-additive regenerator. Behavior:
//   - If `existingAside` carries any <li> entries (prereq-derived OR
//     hand-authored "See also" with prose), re-emit them verbatim
//     in their original order. This preserves "Bézout's theorem — the
//     prototype intersection-number computation, recovered in §4 from
//     the Chow ring of P^2." style annotations and the hand-curated
//     non-prereq cross-references that historically lived in callback
//     asides alongside the prereq-derived links.
//   - For every prereq link in `links` that doesn't already match an
//     existing <li>'s href, append a bare `<li><a>title</a></li>` at
//     the end of the list.
//   - Match by both `./page.html#anchor` and the bare `page.html#anchor`
//     forms so historic encodings are respected.
//
// Net: the aside grows monotonically. Prereq additions surface as new
// <li>s; prereq removals are a no-op (the link stays — humans curate
// removals). This was the source of the P0 prose-loss regression: the
// previous version regenerated the aside from scratch, dropping every
// hand-authored entry that wasn't backed by a prereq edge.
function buildCallbackHtml(links, existingAside, warningSink) {
  const { liByHref, liOrder, warning } = extractCallbackLis(existingAside);
  if (warning && warningSink && typeof warningSink.push === 'function') {
    warningSink.push(warning);
  }
  // Helper: for a prereq link, produce both candidate href forms.
  const hrefForms = (l) => [`./${l.page}#${l.anchor}`, `${l.page}#${l.anchor}`];
  // Build indented <li>s in this order: existing first, then new.
  const lines = [];
  for (const href of liOrder) lines.push('    ' + liByHref.get(href));
  for (const l of links) {
    const [href1, href2] = hrefForms(l);
    if (liByHref.has(href1) || liByHref.has(href2)) continue;
    lines.push(`    <li><a href="${href1}">${l.title}</a></li>`);
  }
  return `<aside class="callback">
  <div class="ttl">See also</div>
  <ul>
${lines.join('\n')}
  </ul>
</aside>`;
}

// CSS rule injected once per page into <style> block.
//
// Note: the border-left color uses `color-mix(in srgb, var(--cyan) 45%,
// transparent)` rather than the older `rgba(88,196,221,0.55)` literal.
// 69 of 73 topics already store this form in their JSON rawHead; the four
// outliers (algebra, naive-set-theory, point-set-topology, real-analysis)
// get normalized to this canonical form on the first --fix run after the
// CSS-fence migration.
const CALLBACK_CSS = `  aside.callback{
    margin:1.2rem 0;padding:.7rem 1rem;
    background:rgba(88,196,221,0.05);
    border-left:3px solid color-mix(in srgb, var(--cyan) 45%, transparent);
    border-radius:0 6px 6px 0;
    font-size:.93rem;
  }
  aside.callback .ttl{
    font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;
    color:var(--mute,#8c9aa6);margin-bottom:.3rem;font-weight:600;
  }
  aside.callback ul{margin:0;padding-left:1.1rem}
  aside.callback ul li{margin:.15rem 0}
  aside.callback a{color:inherit}`;

function ensureCallbackCss(html) {
  if (/aside\.callback\s*\{/.test(html)) return html;
  // insert just before </style> of the first <style> block
  const styleCloseRe = /<\/style>/i;
  const m = styleCloseRe.exec(html);
  if (!m) return html;
  return html.slice(0, m.index) + CALLBACK_CSS + '\n' + html.slice(m.index);
}

// Insert callback block inside a section's body at the best spot:
//   - if a <div class="quiz" data-concept="..."> is present, insert BEFORE it
//   - else, insert right before </section>
function insertCallback(topic, html, anchor, links, conceptAnchors) {
  const sec = findSection(topic, html, anchor, conceptAnchors);
  if (!sec) return { html, note: `section #${anchor} not found` };
  const body = sec.body;

  // already-present links? filter out anything already linked inside this section.
  const presentHrefs = new Set();
  for (const hm of body.matchAll(/<a[^>]+href=["']([^"']+)["']/g)) {
    presentHrefs.add(hm[1]);
  }
  const missingLinks = links.filter((l) => {
    const target = `./${l.page}#${l.anchor}`;
    const bare = `${l.page}#${l.anchor}`;
    return !presentHrefs.has(target) && !presentHrefs.has(bare);
  });

  // Also: if the section already has an <aside class="callback">, merge with it
  const existingAsideRe = /<aside\s+class=["']callback["'][^>]*>([\s\S]*?)<\/aside>/i;
  const asideMatch = body.match(existingAsideRe);

  if (missingLinks.length === 0) return { html, note: 'already covered' };

  if (asideMatch) {
    // Merge into existing aside: append missing <li>s before </ul>
    const asideStart = sec.innerStart + asideMatch.index;
    const asideEnd = asideStart + asideMatch[0].length;
    const asideHtml = asideMatch[0];
    const ulCloseIdx = asideHtml.lastIndexOf('</ul>');
    if (ulCloseIdx < 0) return { html, note: `malformed existing aside in #${anchor}` };
    const newLis = missingLinks
      .map((l) => `    <li><a href="./${l.page}#${l.anchor}">${l.title}</a></li>`)
      .join('\n');
    const newAside = asideHtml.slice(0, ulCloseIdx) + newLis + '\n  ' + asideHtml.slice(ulCloseIdx);
    const newHtml = html.slice(0, asideStart) + newAside + html.slice(asideEnd);
    return { html: newHtml, note: `merged ${missingLinks.length} link(s) into existing aside` };
  }

  // Find insertion point: the position of the first <div class="quiz" data-concept=...
  // inside the section body, else position of </section>.
  const quizRe = /<div[^>]*class=["'][^"']*\bquiz\b[^"']*["'][^>]*\bdata-concept=["'][^"']+["'][^>]*>[^<]*<\/div>/;
  const qm = body.match(quizRe);
  let insertAt;
  if (qm) {
    insertAt = sec.innerStart + qm.index;
  } else {
    insertAt = sec.innerEnd;
  }

  const callback = buildCallbackHtml(missingLinks) + '\n\n';
  const newHtml = html.slice(0, insertAt) + callback + html.slice(insertAt);
  return { html: newHtml, note: `inserted ${missingLinks.length} link(s)` };
}

// --------------------------------------------------------------------------
// JSON-mutation path (preferred when content/<topic>.json exists).
//
// Strategy:
//   1. Strip every un-fenced <aside class="callback">…</aside> from raw blocks
//      across the topic's sections (one-time migration; pre-flip extracts
//      embed it as raw HTML).  If a raw block becomes empty/whitespace-only
//      after the strip, drop it.
//   2. For each section that needs callbacks, upsertFencedBlock() with the
//      canonical link list.  Position 'before-quiz' when a quiz block exists,
//      else 'before-section-end'.
//   3. ensureCss() guarantees the aside.callback rule is present in rawHead.
//
// Returns true iff the JSON document was mutated (i.e. needs to be saved).
// --------------------------------------------------------------------------

// Match an un-fenced <aside class="callback">...</aside>, including any
// adjacent leading newline and the trailing whitespace up to (but not
// including) the next non-whitespace token.  This intentionally swallows the
// blank-line padding that the historic extractor left around the aside so
// the strip + reinsert round-trip doesn't accumulate stray blank lines.
const UNFENCED_CALLBACK_RE =
  /\n?[ \t]*<aside\s+class=["']callback["'][^>]*>[\s\S]*?<\/aside>[ \t]*\n?/i;

// Strip every un-fenced <aside class="callback"> ... </aside> from `section.blocks`.
// Returns:
//   { strips, anchorIndex, anchorSubstr }
//     strips        — count of substring strips performed.
//     anchorIndex   — index of the FIRST raw block where an un-fenced aside
//                     was stripped (or -1 if none).
//     anchorSubstr  — the byte string the strip would replace if you wanted
//                     to inject a replacement INTO the same raw block at the
//                     same offset.  For replace-in-place callers this is
//                     irrelevant; use stripAndReplaceInBlock() instead which
//                     does the substitution atomically.
function stripUnfencedAsides(section) {
  if (!Array.isArray(section.blocks)) return { strips: 0, anchorIndex: -1 };
  let strips = 0;
  let anchorIndex = -1;

  let i = 0;
  while (i < section.blocks.length) {
    const b = section.blocks[i];
    if (!b || b.type !== 'raw' || typeof b.html !== 'string') {
      i++; continue;
    }
    if (b.html.includes('callback-auto-begin')) {
      i++; continue;
    }
    let html = b.html;
    let m;
    let local = 0;
    while ((m = UNFENCED_CALLBACK_RE.exec(html))) {
      html = html.slice(0, m.index) + html.slice(m.index + m[0].length);
      local++;
    }
    if (local === 0) { i++; continue; }
    strips += local;
    if (anchorIndex === -1) anchorIndex = i;
    if (html.trim() === '') {
      section.blocks.splice(i, 1);
    } else {
      b.html = html;
      i++;
    }
  }
  return { strips, anchorIndex };
}

// Find any existing <aside class="callback">…</aside> currently present in
// the section's raw blocks (fenced or un-fenced), and return its HTML.
// Used by the regenerator to harvest per-prereq prose annotations before
// rebuilding the canonical aside, so hand-authored "— context" suffixes
// on `<li>` items are preserved across `--fix` runs.
function findExistingCallbackAsideHtml(section) {
  if (!Array.isArray(section.blocks)) return null;
  const asideRe = /<aside\s+class=["']callback["'][\s\S]*?<\/aside>/i;
  for (const b of section.blocks) {
    if (!b || b.type !== 'raw' || typeof b.html !== 'string') continue;
    const m = asideRe.exec(b.html);
    if (m) return m[0];
  }
  return null;
}

// CSS that lives in rawHead's <style> block.  Same bytes as the HTML path so
// the two write paths produce equivalent styling.
const CALLBACK_CSS_RULE = CALLBACK_CSS;

// Migration regex (one-shot, first --fix run only).  Matches the canonical
// un-fenced `aside.callback` block previously emitted by this script — i.e.
// the rule body that runs from `aside.callback { … }` through the
// `aside.callback a{color:inherit}` terminator.  After the migration each
// page's rawHead carries the rule wrapped in a `/* callback-css-auto-begin
// */ … /* callback-css-auto-end */` fence, after which `updateCss` becomes
// the source of truth and the migration regex no longer matches anything.
const UNFENCED_CALLBACK_CSS_RE =
  /aside\.callback\s*\{[\s\S]*?\}\s*aside\.callback a\{color:inherit\}/;

// Mutate `doc` (in place) to apply the canonical fenced-callback regeneration
// for `hostKeys`. `hostKeys` is the same shape as the HTML path:
// [{ anchor, id, links }].
//
// Returns { stripped, inserted, replaced, missingSections }:
//   stripped        — total un-fenced aside strips across all sections
//   inserted        — count of upsertFencedBlock calls returning 'inserted'
//   replaced        — count returning 'replaced'
//   missingSections — anchors referenced in hostKeys but not present in JSON
//
// Strategy:
//
//   Pass 1.  For sections whose cross-topic edges all went away (or never
//            existed), strip any leftover un-fenced <aside class="callback">
//            so stale links don't outlive the prereq edge that warranted
//            them.
//
//   Pass 2.  For sections that still need callbacks, run a single
//            upsertFencedBlock with the canonical position picker
//            (before-fence:backlinks if backlinks live in their own block,
//            else before-quiz, else before-section-end).  upsertFencedBlock
//            now auto-explodes any host raw block whose fenced callback is
//            co-mingled with surrounding bytes (commit 8cf323c), so the
//            cascade through replaceFencedCallbackInPlace and
//            replaceFirstUnfencedAsideInPlace that this pass used to need
//            is no longer required — the writer preserves every surrounding
//            byte (backlinks fence, </section>, prose) verbatim.
//
//   Pass 3.  updateCss('callback-css', CALLBACK_CSS_RULE) — wraps the
//            aside.callback rule in a CSS-comment fence and idempotently
//            maintains it.  On the first --fix run, a one-shot migration
//            detects the canonical un-fenced rule previously written by
//            this script and replaces it in-place with the fenced form so
//            updateCss has something to update.
function applyJsonFix(doc, hostKeys) {
  let stripped = 0;
  let inserted = 0;
  let replaced = 0;
  const missingSections = [];

  // Note: we do NOT proactively strip un-fenced asides from sections that
  // no longer need callbacks.  Sub-anchor concepts (e.g.
  // algebraic-topology#paths) live inside a parent JSON section
  // (#intro) whose section.id doesn't match the concept anchor, so they
  // would land in missingSections and their existing un-fenced aside (which
  // IS still valid content) would have been wiped here.  Leaving stale
  // un-fenced asides on cross-edge-removed sections is acceptable: they
  // continue to render valid hrefs until a future fix-pass picks them up.
  const fidelityWarnings = [];
  for (const { anchor, links } of hostKeys) {
    const found = findJsonSection(doc, anchor);
    if (!found) {
      missingSections.push(anchor);
      continue;
    }
    // Harvest any existing callback aside (fenced or un-fenced) so
    // hand-authored per-prereq prose annotations survive the canonical
    // regeneration. Without this, regen produces bare
    // `<li><a>title</a></li>` skeletons and any "— context here" suffix
    // is lost forever.
    const existingAside = findExistingCallbackAsideHtml(found.section);
    const sectionWarnings = [];
    const inner = buildCallbackHtml(links, existingAside, sectionWarnings);
    for (const w of sectionWarnings) {
      fidelityWarnings.push(`#${anchor}: ${w}`);
    }

    // Position picker — only consulted when no fenced callback block
    // currently exists in the section.  upsertFencedBlock auto-explodes a
    // host raw block whose fenced callback is co-mingled with surrounding
    // bytes, so the legacy in-place replace cascade is no longer required.
    const blocks = found.section.blocks;
    const backlinksOwnBlock = blocks.findIndex(
      (b) => b && b.type === 'raw' && typeof b.html === 'string' &&
        /^\s*<!--\s*backlinks-auto-begin\s*-->/.test(b.html),
    );
    const hasQuiz = blocks.some((b) => b && b.type === 'quiz');
    let position;
    if (backlinksOwnBlock >= 0) position = 'before-fence:backlinks';
    else if (hasQuiz) position = 'before-quiz';
    else position = 'before-section-end';

    const r = upsertFencedBlock(doc, anchor, 'callback', inner, { position });
    if (r.action === 'inserted') inserted++;
    else if (r.action === 'replaced') replaced++;
  }

  // Pass 3: maintain the aside.callback CSS rule inside a CSS-comment
  // fence in `doc.rawHead`.  Two-stage:
  //
  //   3a. One-shot migration.  If the rule is currently un-fenced (the
  //       canonical block previously emitted by this script), replace
  //       it in-place with the fenced equivalent so updateCss can target
  //       it.  This preserves the rule's existing position relative to
  //       the display-prefs CSS fence (which the display-prefs injector
  //       requires to remain the LAST rule before </style>); without
  //       this in-place migration step, updateCss would splice a fresh
  //       fence at the </style> boundary, triggering a permanent
  //       ping-pong between the two injectors.
  //   3b. updateCss('callback-css', CALLBACK_CSS_RULE).  Idempotent on
  //       subsequent runs — the fence already exists in the spot 3a
  //       chose, and updateCss replaces only the inner CSS body.
  if (typeof doc.rawHead === 'string') {
    const cssFenceBegin = '/* callback-css-auto-begin */';
    const m = UNFENCED_CALLBACK_CSS_RE.exec(doc.rawHead);
    const alreadyFenced = doc.rawHead.indexOf(cssFenceBegin) >= 0;
    if (m && !alreadyFenced) {
      // 3a: wrap-in-place. Build the same byte sequence updateCss would
      // produce so step 3b is a no-op on the same run.
      const wrapped =
        `${cssFenceBegin}\n${CALLBACK_CSS_RULE}\n/* callback-css-auto-end */`;
      doc.rawHead =
        doc.rawHead.slice(0, m.index) + wrapped +
        doc.rawHead.slice(m.index + m[0].length);
    }
    // 3b: idempotent maintenance.  Skip when rawHead has neither a fence
    // nor an un-fenced rule (e.g. the rare topic with no aside.callback
    // CSS at all) so we don't spuriously splice it before </style>.
    if (
      doc.rawHead.indexOf(cssFenceBegin) >= 0 ||
      UNFENCED_CALLBACK_CSS_RE.test(doc.rawHead)
    ) {
      updateCss(doc, 'callback-css', CALLBACK_CSS_RULE);
    }
  }

  // Pass 4: stale-aside drift detection.
  //
  //   4a. Whole-section drift — sections NOT in hostKeys (no current
  //       cross-topic prereqs requiring a callback) that nonetheless
  //       carry an <aside class="callback">.  Possible causes: a prereq
  //       edge was deleted but the aside wasn't cleaned up, or a
  //       sub-anchor concept (paths, simply-connected, discriminant)
  //       lives inside a parent section whose id won't match any
  //       hostKey anchor — usually the latter and ignorable.
  //   4b. Per-href drift — sections that DO have a hostKey entry but
  //       whose existing callback aside still carries `<li>` items
  //       linking to hrefs that aren't in the current prereq set.
  //       Heuristic: a `<li><a href="…">title</a></li>` with no prose
  //       suffix after `</a>` is prereq-derived; one with prose after
  //       `</a>` is hand-authored "See also" and stays.
  //
  //   Neither is auto-stripped: the additive `buildCallbackHtml`
  //   preserves stale `<li>`s by design.  The point is the WARNING so a
  //   human can clean up.
  const hostKeyAnchors = new Set(hostKeys.map((k) => k.anchor));
  const staleHits = [];
  for (const section of doc.sections || []) {
    if (hostKeyAnchors.has(section.id)) continue;
    if (!Array.isArray(section.blocks)) continue;
    for (const b of section.blocks) {
      if (!b || b.type !== 'raw' || typeof b.html !== 'string') continue;
      if (/<aside\s+class=["']callback["']/i.test(b.html)) {
        staleHits.push(section.id);
        break;
      }
    }
  }
  // 4b: per-href drift inside live hostKey sections.
  for (const { anchor, links } of hostKeys) {
    const found = findJsonSection(doc, anchor);
    if (!found) continue;
    const asideHtml = findExistingCallbackAsideHtml(found.section);
    if (!asideHtml) continue;
    // Build the set of current prereq hrefs (both `./page.html#anchor` and
    // bare `page.html#anchor` forms) so the comparison is encoding-agnostic.
    const currentHrefs = new Set();
    for (const l of links) {
      currentHrefs.add(`./${l.page}#${l.anchor}`);
      currentHrefs.add(`${l.page}#${l.anchor}`);
    }
    const staleHrefs = [];
    const liRe = /<li>([\s\S]*?)<\/li>/gi;
    let m;
    while ((m = liRe.exec(asideHtml)) !== null) {
      const liInner = m[1].trim();
      // Match the first <a href="…">…</a> in the <li>.
      const aMatch = /^<a\s+[^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?<\/a>(.*)$/i.exec(liInner);
      if (!aMatch) continue;
      const href = aMatch[1].trim();
      const tail = aMatch[2].trim();
      // Bare prereq link: nothing after </a>.  Hand-authored "See also":
      // prose suffix (e.g. "— context here") follows the </a>.
      if (tail.length > 0) continue;
      if (currentHrefs.has(href)) continue;
      staleHrefs.push(href);
    }
    if (staleHrefs.length > 0) {
      fidelityWarnings.push(
        `#${anchor}: ${staleHrefs.length} stale <li> link(s) (no longer in prereqs): ${staleHrefs.join(', ')}`,
      );
    }
  }
  return { stripped, inserted, replaced, missingSections, staleAsides: staleHits, fidelityWarnings };
}

// Compute missing links for each anchor. Returns:
//   { anchor, id, missing: string[] | null }
//   `missing` = null when the section element itself can't be found.
function computeMissing(view, html, hostKeys, conceptAnchors) {
  const results = [];
  for (const { anchor, id, links } of hostKeys) {
    const sec = findSection(view, html, anchor, conceptAnchors);
    if (!sec) { results.push({ anchor, id, missing: null, links }); continue; }
    const presentHrefs = new Set();
    for (const hm of sec.body.matchAll(/<a[^>]+href=["']([^"']+)["']/g)) {
      presentHrefs.add(hm[1]);
    }
    const missing = links.filter((l) => {
      const t1 = `./${l.page}#${l.anchor}`;
      const t2 = `${l.page}#${l.anchor}`;
      return !presentHrefs.has(t1) && !presentHrefs.has(t2);
    });
    results.push({ anchor, id, missing, links });
  }
  return results;
}

// ----- Main -----
let pagesTouched = 0;
let jsonPagesTouched = 0;
let htmlPagesTouched = 0;
let hadMissing = false;
const pagesWithMissing = new Set();

for (const topic of topics.values()) {
  const page = topic.page;
  const pagePath = join(repoRoot, page);
  let html;
  try {
    html = readFileSync(pagePath, 'utf8');
  } catch {
    missingReport.push(`${page}: file missing`);
    continue;
  }
  const origHtml = html;

  // Collect host keys with cross-topic edges for this topic.
  // Note: multiple concepts can share the same anchor (e.g. complex-analysis
  // section #contour hosts contour-integral, cauchy-theorem, and
  // cauchy-integral-formula).  In that case `needed` already aggregates the
  // links set per anchor, so the entries would be duplicates of one another.
  // The HTML --fix path tolerates dups (it idempotently checks present
  // hrefs); the JSON --fix path mutates and would re-process the same
  // section repeatedly.  Dedupe by anchor up front.
  // Pre-build the set of registered concept anchors for this topic so
  // findSection can distinguish real concept-boundaries from decorative h3s.
  // Passed explicitly to every helper that needs it — no view-attribute
  // fallback, no mutation of the memoized `topic`.
  const conceptAnchors = new Set();
  for (const conceptId of topic.conceptIds) {
    const c = concepts.get(conceptId);
    if (c && c.anchor) conceptAnchors.add(c.anchor);
  }

  const hostKeys = [];
  const seenAnchors = new Set();
  for (const conceptId of topic.conceptIds) {
    const c = concepts.get(conceptId);
    if (!c || !c.anchor || c.topic !== topic.id) continue;
    if (seenAnchors.has(c.anchor)) continue;
    const key = `${topic.id}::${c.anchor}`;
    if (needed.has(key)) {
      seenAnchors.add(c.anchor);
      hostKeys.push({ anchor: c.anchor, id: c.id, links: needed.get(key) });
    }
  }

  // Initial scan against the un-mutated page (for the no --fix report and
  // also for the existing-count tally).
  const scan = computeMissing(topic, html, hostKeys, conceptAnchors);
  const localMissing = [];
  for (const { anchor, id, missing, links } of scan) {
    if (missing === null) {
      localMissing.push(`  section #${anchor} (concept "${id}") not found`);
    } else if (missing.length > 0) {
      localMissing.push(`  section #${anchor} (concept "${id}") missing ${missing.length} callback link(s): ${missing.map((l) => `${l.page}#${l.anchor}`).join(', ')}`);
    } else {
      existingCount += links.length;
    }
  }

  if (FIX) {
    // Prefer the JSON-mutation path when content/<topic>.json exists.
    // Otherwise fall back to the HTML path for the legacy HTML-only topics.
    const jsonPath = resolve(repoRoot, 'content', `${topic.id}.json`);
    if (existsSync(jsonPath)) {
      // JSON path.
      const doc = loadTopicContent(topic.id, repoRoot);
      const result = applyJsonFix(doc, hostKeys);
      insertedCount += result.inserted + result.replaced;
      // Sub-anchor concepts (3 in the corpus today: paths, simply-connected,
      // discriminant) carry their `anchor` field as an <h3 id> nested inside
      // a parent <section id> whose JSON section.id is the parent. There's
      // no clean way to write the canonical fenced block at the sub-anchor
      // level inside the JSON model, so the existing un-fenced aside on the
      // parent section is left in place — it still renders the callback
      // links in the produced HTML. Surface as a warning, not a hard fail:
      // the audit-only path (which scans HTML, not JSON) catches genuine
      // missing-link regressions, so CI's `rebuild --no-fix` is still strict.
      for (const anchor of result.missingSections) {
        console.warn(`  ⚠ ${page}: skipping sub-anchor #${anchor} — JSON has no matching section, existing HTML aside on parent section preserved`);
      }
      // Drift signal: section has a callback aside but its concept no
      // longer requires one. Could be (a) a prereq edge was deleted but
      // the aside wasn't cleaned up, (b) a sub-anchor concept whose
      // parent section is rendering both — usually case (b) and
      // ignorable. Don't auto-strip; just surface the list.
      if (result.staleAsides && result.staleAsides.length > 0) {
        console.warn(`  ⚠ ${page}: section(s) with callback aside but no current cross-topic prereqs: ${result.staleAsides.join(', ')} — review whether to remove`);
      }
      if (result.fidelityWarnings && result.fidelityWarnings.length > 0) {
        for (const w of result.fidelityWarnings) {
          console.warn(`  ⚠ ${page} ${w}`);
        }
      }
      const wrote = saveTopicContent(topic.id, doc, repoRoot);
      if (wrote) {
        jsonPagesTouched++;
        pagesTouched++;
      }
      // No need to re-audit HTML — the rendered HTML is produced by the
      // later test-roundtrip --fix step.  We trust the JSON mutation: the
      // canonical fenced block contains exactly the links we want.
    } else {
      // HTML path (legacy / unmigrated topics).
      if (hostKeys.length > 0) html = ensureCallbackCss(html);
      // Iterate in reverse anchor order so later-doc inserts don't shift
      // earlier-doc anchors. Re-parse the DOM whenever `html` has been
      // mutated so element ranges stay aligned with the current `html`
      // string.
      let view = html === origHtml ? topic : reparseTopicView(html);
      let viewHtml = html;
      for (const { anchor, links } of hostKeys.slice().reverse()) {
        if (viewHtml !== html) { view = reparseTopicView(html); viewHtml = html; }
        const r = insertCallback(view, html, anchor, links, conceptAnchors);
        html = r.html;
        const m = r.note && r.note.match(/^(inserted|merged) (\d+)/);
        if (m) insertedCount += parseInt(m[2], 10);
      }
      if (html !== origHtml) {
        writeFileSync(pagePath, html);
        htmlPagesTouched++;
        pagesTouched++;
      }
      // Re-audit after fix.
      const afterView = html === origHtml ? topic : reparseTopicView(html);
      for (const { anchor, id, missing } of computeMissing(afterView, html, hostKeys, conceptAnchors)) {
        if (missing === null) {
          missingReport.push(`${page}: section #${anchor} (concept "${id}") not found`);
          hadMissing = true;
          pagesWithMissing.add(page);
        } else if (missing.length > 0) {
          hadMissing = true;
          pagesWithMissing.add(page);
          missingReport.push(`${page}: section #${anchor} (concept "${id}") still missing ${missing.length} link(s) after --fix`);
        }
      }
    }
  } else if (localMissing.length > 0) {
    hadMissing = true;
    pagesWithMissing.add(page);
    missingReport.push(`${page}:\n${localMissing.join('\n')}`);
  }
}

// ----- Report -----
console.log(`audit-callbacks: ${topics.size} topic(s), ${totalEdges} cross-topic edge(s)`);
if (FIX) {
  console.log(`  pages touched: ${pagesTouched} (json: ${jsonPagesTouched}, html: ${htmlPagesTouched})`);
  console.log(`  links inserted/replaced: ${insertedCount}`);
}
console.log(`  links already present: ${existingCount}`);
console.log('');

if (missingReport.length === 0) {
  console.log('OK: every cross-topic prereq is reflected by a callback link on its host section.');
  process.exit(0);
}

console.log(`MISSING (${pagesWithMissing.size} page(s)):`);
for (const line of missingReport) console.log(`  - ${line}`);
console.log('');
if (hadMissing) {
  console.log(`FAIL: ${pagesWithMissing.size} page(s) missing callback links.`);
  process.exit(1);
}
process.exit(0);
