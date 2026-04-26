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
function findSection(topic, rawHtml, anchor) {
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
  const tag = (anchorEl.rawTagName || '').toLowerCase();
  let boundaryStart = -1;

  if (tag === 'section') {
    // First descendant heading-with-id or nested section-with-id.
    const cand = anchorEl.querySelector('h2[id],h3[id],h4[id],section[id]');
    if (cand && cand !== anchorEl && cand.range) {
      boundaryStart = cand.range[0];
    }
  } else {
    // Heading anchor: scan following siblings for a concept-boundary.
    const parent = anchorEl.parentNode;
    if (parent && Array.isArray(parent.childNodes)) {
      const kids = parent.childNodes;
      const idx = kids.indexOf(anchorEl);
      for (let i = idx + 1; i < kids.length; i++) {
        const n = kids[i];
        if (!n || n.nodeType !== 1) continue;
        const t = (n.rawTagName || '').toLowerCase();
        if ((t === 'h2' || t === 'h3' || t === 'h4' || t === 'section') && n.id && n.range) {
          boundaryStart = n.range[0];
          break;
        }
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
  if (!existingAside || typeof existingAside !== 'string') {
    return { liByHref, liOrder };
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
  return { liByHref, liOrder };
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
function buildCallbackHtml(links, existingAside) {
  const { liByHref, liOrder } = extractCallbackLis(existingAside);
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
const CALLBACK_CSS = `  aside.callback{
    margin:1.2rem 0;padding:.7rem 1rem;
    background:rgba(88,196,221,0.05);
    border-left:3px solid rgba(88,196,221,0.55);
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
function insertCallback(topic, html, anchor, links) {
  const sec = findSection(topic, html, anchor);
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

// Replace the FIRST un-fenced <aside class="callback"> ... </aside> inside
// `section`'s raw blocks with `replacementHtml` (verbatim — caller is
// responsible for fence wrapping).  Preserves byte position: the
// replacement lands exactly where the historic aside lived, including the
// surrounding leading/trailing newlines that the regex captures.
//
// Returns:
//   { replaced, blockIndex }   — replaced=true on success
//   { replaced: false }        — no un-fenced aside was found
function replaceFirstUnfencedAsideInPlace(section, replacementHtml) {
  if (!Array.isArray(section.blocks)) return { replaced: false };
  for (let i = 0; i < section.blocks.length; i++) {
    const b = section.blocks[i];
    if (!b || b.type !== 'raw' || typeof b.html !== 'string') continue;
    if (b.html.includes('callback-auto-begin')) continue;
    const m = UNFENCED_CALLBACK_RE.exec(b.html);
    if (!m) continue;
    // Splice the replacement in.  Preserve one leading / one trailing
    // newline so the rendered output looks like the historic version.
    const before = b.html.slice(0, m.index);
    const after = b.html.slice(m.index + m[0].length);
    const lead = m[0].startsWith('\n') ? '\n' : '';
    const trail = m[0].endsWith('\n') ? '\n' : '';
    b.html = before + lead + replacementHtml + trail + after;
    return { replaced: true, blockIndex: i };
  }
  return { replaced: false };
}

// Replace an EXISTING fenced callback block in-place, regardless of whether
// it lives inside its own raw block or is co-mingled with other content
// (the latter happens when the first --fix run did an in-place replacement
// of an un-fenced aside that sat next to the backlinks fence + section
// close).  Preserves the surrounding bytes of the host raw block exactly.
//
// Returns:
//   { replaced: true, changed: bool }   when an existing fenced block was
//                                       found.  changed=false on byte-equal
//                                       no-op (idempotent re-run).
//   { replaced: false }                 when no fenced callback block exists
function replaceFencedCallbackInPlace(section, fencedReplacement) {
  if (!Array.isArray(section.blocks)) return { replaced: false };
  const fencedRe =
    /<!--\s*callback-auto-begin\s*-->[\s\S]*?<!--\s*callback-auto-end\s*-->/;
  for (let i = 0; i < section.blocks.length; i++) {
    const b = section.blocks[i];
    if (!b || b.type !== 'raw' || typeof b.html !== 'string') continue;
    const m = fencedRe.exec(b.html);
    if (!m) continue;
    if (m[0] === fencedReplacement) {
      return { replaced: true, changed: false };
    }
    b.html = b.html.slice(0, m.index) + fencedReplacement + b.html.slice(m.index + m[0].length);
    return { replaced: true, changed: true };
  }
  return { replaced: false };
}

// CSS that lives in rawHead's <style> block.  Same bytes as the HTML path so
// the two write paths produce equivalent styling.
const CALLBACK_CSS_RULE = CALLBACK_CSS;

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
//   Pass 2.  For sections that still need callbacks, prefer in-place
//            replacement of an existing un-fenced aside by the new fenced
//            equivalent.  This is BYTE-EXACT in the rendered HTML region
//            the aside used to occupy — important for the handful of pages
//            where a nested <script> closes the <section> element early at
//            parse time (e.g. category-theory#cat, dirichlet-series#perron),
//            otherwise the audit's HTML-side parser would not see the new
//            callback inside the parsed section boundary.
//
//            If no un-fenced aside exists, fall back to upsertFencedBlock
//            with the canonical position picker (before-fence:backlinks if
//            backlinks live in their own block, else before-quiz, else
//            before-section-end).  Idempotent re-runs land in this branch
//            (no un-fenced aside left) and upsertFencedBlock returns 'noop'.
//
//   Pass 3.  ensureCss for the aside.callback rule.
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
    const fencedHtml = wrapCallbackFence(buildCallbackHtml(links, existingAside));

    // Idempotency / in-place mutation: if the section already has a fenced
    // callback block (anywhere — including INLINE inside a larger raw
    // block, the steady state after the first --fix that did an in-place
    // replacement of a co-mingled un-fenced aside), do a substring replace.
    // upsertFencedBlock would wholesale-replace the host raw block here,
    // losing surrounding backlinks-fence and </section> bytes.
    const fencedReplace = replaceFencedCallbackInPlace(found.section, fencedHtml);
    if (fencedReplace.replaced) {
      if (fencedReplace.changed) replaced++;
      continue;
    }

    // No fenced callback block — try in-place replacement of an existing
    // un-fenced aside (the historic state coming out of pre-flip JSON
    // extracts).
    const inPlace = replaceFirstUnfencedAsideInPlace(found.section, fencedHtml);
    if (inPlace.replaced) {
      replaced++;
      continue;
    }

    // No aside at all — pick a position and insert a new block.
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

    const r = upsertFencedBlock(doc, anchor, 'callback', buildCallbackHtml(links), {
      position,
    });
    if (r.action === 'inserted') inserted++;
    else if (r.action === 'replaced') replaced++;
  }

  // Pass 3: ensure the aside.callback CSS rule lives in rawHead.  We don't
  // use the generic ensureCss writer here because the display-prefs
  // injector requires its fenced CSS to be the LAST rule before </style>;
  // ensureCss would splice ours after that region and trigger a permanent
  // ping-pong between the two injectors.  Instead, splice IN FRONT OF the
  // display-prefs fence when present, otherwise before </style>.
  if (typeof doc.rawHead === 'string' && !/aside\.callback\s*\{/.test(doc.rawHead)) {
    const head = doc.rawHead;
    const dpFence = '/* display-prefs-css-auto-begin */';
    let insertAt = head.indexOf(dpFence);
    if (insertAt < 0) insertAt = head.search(/<\/style>/i);
    if (insertAt >= 0) {
      doc.rawHead = head.slice(0, insertAt) + CALLBACK_CSS_RULE + '\n  ' + head.slice(insertAt);
    }
  }

  return { stripped, inserted, replaced, missingSections };
}

// Wrap a callback-aside HTML in the canonical fence comments.  Mirrors what
// upsertFencedBlock would write so the in-place replacement path produces
// the exact same bytes.
function wrapCallbackFence(asideHtml) {
  return `<!-- callback-auto-begin -->\n${asideHtml}\n<!-- callback-auto-end -->`;
}

// Compute missing links for each anchor. Returns:
//   { anchor, id, missing: string[] | null }
//   `missing` = null when the section element itself can't be found.
function computeMissing(view, html, hostKeys) {
  const results = [];
  for (const { anchor, id, links } of hostKeys) {
    const sec = findSection(view, html, anchor);
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
  const scan = computeMissing(topic, html, hostKeys);
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
        const r = insertCallback(view, html, anchor, links);
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
      for (const { anchor, id, missing } of computeMissing(afterView, html, hostKeys)) {
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
