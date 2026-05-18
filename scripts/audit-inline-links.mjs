#!/usr/bin/env node
// Audit (and optionally insert) inline prereq links in topic-page prose.
//
// Semantics:
//   - Every concept across the notebook has a human-readable `title` in
//     concepts/bundle.js. When a topic page's prose mentions another concept's
//     title in plain text, it is a missed cross-reference: the reader can't
//     click through. This script scans prose for such mentions and, in --fix
//     mode, wraps the first occurrence per section in an
//     <a href="<topic>.html#<anchor>" data-auto-inline-link="1">…</a>.
//
//   - Self-links are suppressed (don't link a concept to its own owner topic).
//
//   - False positives are worse than false negatives. The matcher is
//     deliberately conservative:
//       * whole-word case-insensitive match;
//       * longest-title-first ordering (so "direct limit" beats "limit");
//       * very short titles (≤ 4 chars) and an English-common-word blocklist
//         are suppressed entirely;
//       * matches inside <a>, <aside>, <code>, <pre>, heading tags, widgets,
//         KaTeX spans ($…$, $$…$$, \(…\), \[…\]), or already-fenced auto
//         anchors are skipped (delegated to forEachSectionProse + the
//         audit-utils skip mask);
//       * **at most one anchor per concept per page** (cross-section
//         dedupe — the per-section variant pre-#226 wrapped the same
//         concept 3× on capstone-cohomology-story);
//       * if the page already contains any link to the same target anchor
//         (anywhere), the concept is skipped entirely for that page;
//       * **per-page blocklist** in audits/inline-links-blocklist.json
//         suppresses (page, concept-id) pairs that human review rejected
//         as wrong-target / inappropriate-level / awkward-position.
//
// Idempotency fence: auto-inserted anchors carry data-auto-inline-link="1".
// --fix first strips every such anchor on the page (unwrapping to its text
// content), then re-inserts from scratch. Re-running --fix is a no-op after
// the first pass. Hand-authored anchors are never touched.
//
// Injected anchors carry two extra data attributes consumed by the client-side
// glossary popover (js/glossary-popover.js):
//   data-concept-id="<id>"   canonical concept id (for MVProgress lookups and
//                             title lookup via window.__MVConcepts)
//   data-blurb="<blurb>"     HTML-escaped 1–2 sentence summary, rendered
//                             by KaTeX in the popover body so $...$ math
//                             survives.
//
// JSON-source invariant. As of 2026-04-24 content/<topic>.json is the
// source of truth and test-roundtrip --fix overwrites HTML from JSON. To
// survive that wipe, --fix dispatches based on whether the page has a
// content/<topic>.json:
//   - JSON-sourced pages: inserts are applied to the source raw block
//     via offset-mapping (see scripts/lib/render-doc.mjs). The HTML is
//     then re-rendered by test-roundtrip on the next rebuild step.
//   - Hand-authored pages (capstone story pages, pathway, etc.):
//     inserts go directly to the HTML file (legacy path).
//
// CLI:
//   node scripts/audit-inline-links.mjs
//       Audit mode. Print candidates grouped by page/section. Exits 0.
//
//   node scripts/audit-inline-links.mjs --fix
//       Apply inserts to every topic page (JSON-aware).
//
//   node scripts/audit-inline-links.mjs --strict
//       Same as audit mode but exit nonzero if any candidate remains, OR
//       any wrap on disk carries a `data-concept-id` that no longer
//       resolves to a known concept. This is the CI-gate form;
//       rebuild.mjs --no-fix passes --strict via the step's extraArgs.
//
//   node scripts/audit-inline-links.mjs --page <topic.html>
//       Restrict to one page (combine with --fix for a pilot).

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadContentModel,
  forEachSectionProse,
} from './lib/content-model.mjs';
import {
  TITLE_BLOCKLIST,
  MIN_TITLE_LEN,
  buildTitleRegex,
  buildSkipMask,
  buildSectionMap,
  parseTopicHtmlSafe,
  recoverDroppedNodes,
} from './lib/audit-utils.mjs';
import {
  loadTopicContent,
  saveTopicContent,
} from './lib/json-block-writer.mjs';
import { renderDocWithRanges, findRangeAt } from './lib/render-doc.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

// ─────────────────────────────────────────────────────────────────────────
// CLI.

const argv = process.argv.slice(2);
const FIX = argv.includes('--fix');
const STRICT = argv.includes('--strict');
let PAGE_FILTER = null;
{
  const idx = argv.indexOf('--page');
  if (idx !== -1) {
    PAGE_FILTER = argv[idx + 1];
    if (!PAGE_FILTER || PAGE_FILTER.startsWith('--')) {
      console.error('audit-inline-links: --page requires a filename');
      process.exit(2);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Load concept vocabulary via the shared content model.

const model = await loadContentModel();

// vocab = [{ title, titleLower, regex, id, topic, page, anchor, blurb }, …],
// sorted longest-first so multi-word titles beat shorter prefixes. Topic
// iteration order mirrors concepts/index.json (registeredTopics) which
// matches bundle.js key order — identical to the legacy path.
const vocab = [];

for (const topicId of model.topicIds) {
  const topic = model.topics.get(topicId);
  if (!topic) continue;
  const page = topic.page || `${topicId}.html`;
  for (const conceptId of topic.conceptIds) {
    const c = model.concepts.get(conceptId);
    if (!c || !c.title || !c.anchor) continue;
    // Each concept lives in exactly one topic in the model; iterating a
    // topic's conceptIds in order walks every concept once.
    if (c.topic !== topicId) continue;
    const title = c.title.trim();
    const titleLower = title.toLowerCase();
    if (title.length < MIN_TITLE_LEN) continue;
    if (TITLE_BLOCKLIST.has(titleLower)) continue;
    vocab.push({
      title,
      titleLower,
      regex: buildTitleRegex(title),
      id: c.id,
      topic: topicId,
      page,
      anchor: c.anchor,
      blurb: typeof c.blurb === 'string' ? c.blurb : '',
    });
  }
}
vocab.sort((a, b) => b.title.length - a.title.length);

// ─────────────────────────────────────────────────────────────────────────
// Per-page blocklist.
//
// audits/inline-links-blocklist.json shape:
//   {
//     "version": 1,
//     "blocks": {
//       "<page.html>": { "<concept-id>": "<why-blocked comment>", … },
//       …
//     }
//   }
// The comment is for the human reader of the JSON; the script only consults
// the keys. If the file is missing the blocklist is empty (audit still runs).

const blocklistPath = resolve(repoRoot, 'audits', 'inline-links-blocklist.json');
const blocklist = new Map(); // page -> Set<concept-id>
if (existsSync(blocklistPath)) {
  try {
    const raw = JSON.parse(readFileSync(blocklistPath, 'utf8'));
    if (!raw || typeof raw !== 'object' || raw === null) {
      console.warn(`audit-inline-links: blocklist at ${blocklistPath} is not a JSON object — ignoring`);
    } else if (!('blocks' in raw)) {
      console.warn(`audit-inline-links: blocklist at ${blocklistPath} has no "blocks" key — ignoring`);
    } else if (typeof raw.blocks !== 'object' || Array.isArray(raw.blocks) || raw.blocks === null) {
      console.warn(`audit-inline-links: blocklist "blocks" field must be a plain object — ignoring`);
    } else {
      for (const [page, entries] of Object.entries(raw.blocks)) {
        if (Array.isArray(entries)) {
          // Legacy array form: ["concept-id-1", ...]
          blocklist.set(page, new Set(entries.filter((x) => typeof x === 'string')));
        } else if (entries && typeof entries === 'object') {
          // Documented form: { "concept-id": "rationale", ... }
          blocklist.set(page, new Set(Object.keys(entries)));
        } else {
          console.warn(
            `audit-inline-links: blocklist entry "${page}" must be an array or object, ` +
            `got ${typeof entries} — ignoring this page's blocks`
          );
        }
      }
    }
  } catch (e) {
    console.warn(`audit-inline-links: failed to parse blocklist at ${blocklistPath}: ${e.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Page discovery.

const SPECIAL = new Set(['index.html', 'pathway.html']);
function listTopicPages() {
  return readdirSync(repoRoot)
    .filter((f) => f.endsWith('.html') && !SPECIAL.has(f))
    .sort();
}

// Map each page back to its topic slug (so we can self-link-skip).
function topicOfPage(page) {
  return page.replace(/\.html$/, '');
}

// ─────────────────────────────────────────────────────────────────────────
// Candidate detection.
//
// For each <p> in the page's parsed DOM, walk its prose TextNodes via the
// shared forEachSectionProse helper — which prunes widget/katex classes plus
// <script>/<style>/<svg>/<code>/<pre>/<aside>, headings, and <a> subtrees
// for us. Inside each TextNode, run the vocab regex against the math-masked
// text; byte offsets come from the parser's per-node `.range` so --fix splices
// land at exactly the same source positions the previous regex path used.
//
// We still consult the audit-utils `buildSkipMask` as a defensive double
// check: the tag-interior and container masks veto candidates that would
// cross an HTML tag. In practice a TextNode's range never overlaps markup,
// but the double check is cheap and closes any parser edge case.
//
// Constraints:
//   - Skip self-links: concept's owner topic === current page topic.
//   - Skip if the page already contains any <a href> pointing to the target
//     anchor (regardless of section) — the author already linked it once,
//     further mentions are intentional.
//   - At most one candidate per (section, concept-id).
//   - Don't match immediately adjacent to `$` (math-prose neighborhood noise).

function sectionForOffset(sections, offset) {
  let best = null;
  for (const s of sections) {
    if (offset >= s.start && offset < s.end) {
      if (!s.id) continue;
      if (!best || s.start > best.start) best = s;
    }
  }
  return best ? best.id : null;
}

// `isWritable(globalIdx, length)` — optional predicate the JSON-aware
// caller passes to teach detection which offsets back-port to a source
// raw block. When provided, matches landing on non-writable bytes (widget
// renders) are skipped WITHOUT consuming the cross-section dedupe slot,
// so the same concept can still be wrapped in a later raw-block mention
// on the same page. Without this hook the per-page dedupe would
// silently lock out a legitimate wrap whenever a widget-block first-match
// happens to fire (code-reviewer finding on PR #226).
function* findCandidatesInPage(html, pageTopic, pageName, isWritable) {
  const parseOptions = {
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
      pre: true,
    },
  };
  const parseResult = parseTopicHtmlSafe(html, parseOptions);
  const root = parseResult.root;
  if (parseResult.missingIds.length > 0) {
    console.warn(
      `  note: parser dropped ${parseResult.missingIds.length} section(s) ` +
      `(${parseResult.missingIds.join(', ')}); recovering via subtree re-parse.`
    );
  }
  const recoveredParagraphs = recoverDroppedNodes(parseResult, 'p', parseOptions);
  const { mask } = buildSkipMask(html);
  const sections = buildSectionMap(html);

  // Collect existing link targets on the whole page so we can suppress
  // concepts already linked by hand.
  const existingLinkTargets = new Set();
  {
    const linkRe = /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi;
    let m;
    while ((m = linkRe.exec(html))) {
      const href = m[1];
      const cleaned = href.replace(/^\.\//, '').split('?')[0];
      existingLinkTargets.add(cleaned);
    }
  }

  // Track concept-ids already emitted on this page (cross-section dedupe;
  // upgrade from the per-section variant per pedagogy review on #225).
  const emittedConceptIds = new Set();

  // Resolve the per-page blocklist for this page name.
  const pageBlocks = (pageName && blocklist.get(pageName)) || null;

  // Enumerate <p> elements in document order. Each <p>'s TextNodes are
  // visited via forEachSectionProse (which prunes skip-class and skip-tag
  // subtrees). We keep a per-<p> local mask so a shorter title cannot wrap
  // text already claimed by a longer title in the same paragraph.
  // Recovered paragraphs (from parser-dropped sections) are merged in source
  // order so the rest of the file's "document-order" convention holds even
  // when a dropped section sits mid-document.
  const paragraphs = [...root.querySelectorAll('p'), ...recoveredParagraphs]
    .filter((p) => p && p.range)
    .sort((a, b) => a.range[0] - b.range[0]);

  for (const p of paragraphs) {
    if (!p || !p.range) continue;
    const pStart = p.range[0];
    const pEnd = p.range[1];
    const sectionId = sectionForOffset(sections, pStart);

    // Collect prose TextNodes inside this paragraph, in source order.
    const proseNodes = [];
    forEachSectionProse(p, (textNode, info) => {
      if (!textNode || !textNode.range) return;
      proseNodes.push({ node: textNode, text: info.text, masked: info.masked });
    });
    if (proseNodes.length === 0) continue;

    const localMask = new Uint8Array(pEnd - pStart);

    for (const v of vocab) {
      if (v.topic === pageTopic) continue; // self-link suppression
      const anchorKey = `${v.page}#${v.anchor}`;
      if (existingLinkTargets.has(anchorKey)) continue;
      // Page-level blocklist veto (rejected by human review on a prior --fix).
      if (pageBlocks && pageBlocks.has(v.id)) continue;
      // Cross-section dedupe: one anchor per concept per page.
      if (emittedConceptIds.has(v.id)) continue;

      // Walk each TextNode in this paragraph; first admissible match wins.
      let found = null;
      scan: for (const { node, masked } of proseNodes) {
        const nodeStart = node.range[0];
        const nodeEnd = node.range[1];
        let searchFrom = 0;
        while (searchFrom < masked.length) {
          const re = new RegExp(v.regex.source, 'i');
          const m = masked.slice(searchFrom).match(re);
          if (!m) break;
          const localIdxInNode = searchFrom + m.index;
          const globalIdx = nodeStart + localIdxInNode;
          const len = m[0].length;
          // Defensive: the match must lie entirely inside this TextNode and
          // must not cross any bytes the audit-utils skip mask flags.
          let skip = false;
          if (globalIdx + len > nodeEnd) skip = true;
          if (!skip) {
            for (let k = 0; k < len; k++) {
              if (mask[globalIdx + k]) {
                skip = true;
                break;
              }
            }
          }
          // Don't overlap a prior (longer-title) wrap in this same paragraph.
          if (!skip) {
            const pLocal = globalIdx - pStart;
            for (let k = 0; k < len; k++) {
              if (localMask[pLocal + k]) {
                skip = true;
                break;
              }
            }
          }
          // Neighborhood guard: "$X$ is a scheme" style — don't link right
          // next to a dollar-sign.
          if (!skip) {
            const preCh = globalIdx > 0 ? html[globalIdx - 1] : '';
            const postCh = html[globalIdx + len] || '';
            if (preCh === '$' || postCh === '$') skip = true;
          }
          if (skip) {
            searchFrom = localIdxInNode + Math.max(1, len);
            continue;
          }
          found = { globalIdx, len, text: m[0] };
          break scan;
        }
      }

      if (!found) continue;

      // JSON-aware writability check. If the match lands inside a widget
      // block (which can't be back-ported), drop it WITHOUT marking dedupe
      // — that way a later raw-block mention of the same concept can still
      // win. The HTML-direct path passes no isWritable, so this is a no-op
      // there (everything is writable in a hand-authored HTML page).
      if (typeof isWritable === 'function' &&
          !isWritable(found.globalIdx, found.len)) {
        continue;
      }

      // Reserve this range in the paragraph-local mask so shorter vocab
      // entries can't re-wrap inside it.
      const pLocal = found.globalIdx - pStart;
      for (let k = 0; k < found.len; k++) localMask[pLocal + k] = 1;

      emittedConceptIds.add(v.id);

      yield {
        section: sectionId,
        concept: v,
        phrase: found.text,
        globalIdx: found.globalIdx,
        length: found.len,
      };
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// --fix: strip + re-insert.

function stripAutoLinks(html) {
  // <a … data-auto-inline-link="1" …>INNER</a> → INNER
  // Allow any attribute order, any quoting.
  const re = /<a\b[^>]*\bdata-auto-inline-link=["']1["'][^>]*>([\s\S]*?)<\/a>/gi;
  return html.replace(re, (_m, inner) => inner);
}

// Escape a string for embedding inside an HTML double-quoted attribute value.
// We cover &, <, >, " and ' for safety; blurbs come from concepts/*.json and
// routinely contain e.g. "<", apostrophes, and ampersands.
function escAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildAnchorHtml(concept, phrase) {
  const href = `./${concept.page}#${concept.anchor}`;
  const idAttr = ` data-concept-id="${escAttr(concept.id)}"`;
  const blurbAttr = concept.blurb
    ? ` data-blurb="${escAttr(concept.blurb)}"`
    : '';
  return (
    `<a href="${href}" data-auto-inline-link="1"` +
    idAttr +
    blurbAttr +
    `>${phrase}</a>`
  );
}

function applyFixToHtml(html, pageTopic, pageName) {
  // Strip first so candidate detection sees "clean" prose. All DOM node
  // ranges below are taken from the parsed `working` string, not the input.
  let working = stripAutoLinks(html);

  const inserts = [];
  for (const cand of findCandidatesInPage(working, pageTopic, pageName)) {
    inserts.push(cand);
  }
  // Sort descending by offset so splicing doesn't shift later offsets.
  inserts.sort((a, b) => b.globalIdx - a.globalIdx);
  for (const ins of inserts) {
    const anchor = buildAnchorHtml(ins.concept, ins.phrase);
    working =
      working.slice(0, ins.globalIdx) + anchor + working.slice(ins.globalIdx + ins.length);
  }
  return { html: working, inserts: inserts.length };
}

// ─────────────────────────────────────────────────────────────────────────
// JSON-aware --fix: strip auto-links from rawHead/rawBodyPrefix/rawBodySuffix
// and from each raw/quiz block's html, then render the doc, find candidates
// against the rendered HTML, and splice each candidate back into its source
// block via offset mapping.
//
// Why offset mapping rather than content-addressed replace: the rendered
// HTML's byte positions are O(1) lookups against the cumulative block
// ranges, and the splice is unambiguous (one position, one length). A
// content-addressed substring search inside a raw block would need a
// uniqueness check (the same phrase may appear multiple times in one
// block) that mirrors exactly what offset mapping already gives for free.

function stripAutoLinksFromDoc(doc) {
  doc.rawHead = stripAutoLinks(doc.rawHead);
  doc.rawBodyPrefix = stripAutoLinks(doc.rawBodyPrefix);
  doc.rawBodySuffix = stripAutoLinks(doc.rawBodySuffix);
  for (const section of doc.sections) {
    for (const block of section.blocks) {
      // raw / quiz: html is verbatim.
      // inline widget (no slug): html + optional script are verbatim too —
      // strip both defensively in case a hand-paste copied an auto-link
      // anchor into a widget block. Registry-driven widgets (with slug)
      // render from params, so they have no html/script bytes to strip.
      if ((block.type === 'raw' || block.type === 'quiz') &&
          typeof block.html === 'string') {
        block.html = stripAutoLinks(block.html);
      } else if (block.type === 'widget' && !block.slug) {
        if (typeof block.html === 'string')   block.html   = stripAutoLinks(block.html);
        if (typeof block.script === 'string') block.script = stripAutoLinks(block.script);
      } else if (block.type === 'widget-script' && !block.ref &&
                 typeof block.html === 'string') {
        block.html = stripAutoLinks(block.html);
      }
    }
  }
}

async function applyFixToJson(doc, pageTopic, pageName) {
  // Strip first so candidate detection sees clean prose.
  stripAutoLinksFromDoc(doc);

  const { html, ranges } = await renderDocWithRanges(doc);

  // isWritable: tell findCandidatesInPage to drop matches that land in
  // widget-block bytes WITHOUT consuming the per-page dedupe slot, so a
  // later raw-block mention of the same concept can still wrap. Also
  // catches boundary-span / invariant-violation cases at detection time
  // rather than as a silent post-hoc skip.
  function isWritable(globalIdx, length) {
    const r = findRangeAt(ranges, globalIdx);
    if (!r) return false;
    if (globalIdx + length > r.end) return false;
    if (r.kind === 'block') {
      const b = r.block;
      return (b.type === 'raw' || b.type === 'quiz') &&
             typeof b.html === 'string';
    }
    // rawHead / rawBodyPrefix / rawBodySuffix are writable strings.
    return true;
  }

  const candidates = [...findCandidatesInPage(html, pageTopic, pageName, isWritable)];
  // Sort descending by offset — splicing earliest offsets first would shift
  // later candidates' positions inside their source block.
  candidates.sort((a, b) => b.globalIdx - a.globalIdx);

  let applied = 0;
  const skipDetails = { invariantViolation: 0, boundarySpan: 0, widgetBytes: 0, unknownKind: 0 };
  for (const cand of candidates) {
    const range = findRangeAt(ranges, cand.globalIdx);
    if (!range) {
      // findRangeAt returned null — renderer/findRangeAt out of sync. Should
      // never happen; if it does it's an invariant violation worth surfacing.
      console.warn(
        `audit-inline-links: ${pageName} concept "${cand.concept.id}" — ` +
        `offset ${cand.globalIdx} fell outside every block range (invariant violation)`
      );
      skipDetails.invariantViolation++;
      continue;
    }
    // Defensive: candidate must lie wholly inside the range.
    if (cand.globalIdx + cand.length > range.end) {
      console.warn(
        `audit-inline-links: ${pageName} concept "${cand.concept.id}" — ` +
        `candidate spans the boundary of a ${range.kind} block (skipped)`
      );
      skipDetails.boundarySpan++;
      continue;
    }

    const offsetInRange = cand.globalIdx - range.start;
    const anchor = buildAnchorHtml(cand.concept, cand.phrase);

    if (range.kind === 'block') {
      const block = range.block;
      if ((block.type === 'raw' || block.type === 'quiz') &&
          typeof block.html === 'string') {
        const html = block.html;
        block.html = html.slice(0, offsetInRange) + anchor + html.slice(offsetInRange + cand.length);
        applied++;
      } else {
        // widget / widget-script render is computed from params; can't
        // back-port a text mutation safely. Warn so a human can decide
        // whether to add a per-page blocklist entry or live with the gap.
        console.warn(
          `audit-inline-links: ${pageName} concept "${cand.concept.id}" — ` +
          `matched inside a ${block.type} block (slug="${block.slug || block.ref || '?'}"); ` +
          `can't back-port to widget params — skipped`
        );
        skipDetails.widgetBytes++;
      }
    } else if (range.kind === 'rawHead') {
      doc.rawHead = doc.rawHead.slice(0, offsetInRange) + anchor + doc.rawHead.slice(offsetInRange + cand.length);
      applied++;
    } else if (range.kind === 'rawBodyPrefix') {
      doc.rawBodyPrefix = doc.rawBodyPrefix.slice(0, offsetInRange) + anchor + doc.rawBodyPrefix.slice(offsetInRange + cand.length);
      applied++;
    } else if (range.kind === 'rawBodySuffix') {
      doc.rawBodySuffix = doc.rawBodySuffix.slice(0, offsetInRange) + anchor + doc.rawBodySuffix.slice(offsetInRange + cand.length);
      applied++;
    } else {
      console.warn(
        `audit-inline-links: ${pageName} concept "${cand.concept.id}" — ` +
        `unknown range kind "${range.kind}" (skipped)`
      );
      skipDetails.unknownKind++;
    }
  }

  const skipped =
    skipDetails.invariantViolation + skipDetails.boundarySpan +
    skipDetails.widgetBytes + skipDetails.unknownKind;
  return { applied, skipped, skipDetails };
}

// ─────────────────────────────────────────────────────────────────────────
// Main.

const pages = listTopicPages().filter(
  (p) => !PAGE_FILTER || p === PAGE_FILTER
);
if (PAGE_FILTER && pages.length === 0) {
  console.error(`audit-inline-links: --page "${PAGE_FILTER}" not found`);
  process.exit(2);
}

const perPage = new Map(); // page -> Array<candidate>
const conceptsSeen = new Set();
let pagesTouched = 0;
let totalInserted = 0;
let totalSkipped = 0;

function contentJsonPath(topic) {
  return resolve(repoRoot, 'content', `${topic}.json`);
}

for (const page of pages) {
  const pagePath = join(repoRoot, page);
  if (!existsSync(pagePath)) continue;
  const pageTopic = topicOfPage(page);
  const html = readFileSync(pagePath, 'utf8');

  if (FIX) {
    const hasJsonSource = existsSync(contentJsonPath(pageTopic));
    let postFixHtml; // rendered or on-disk HTML reflecting post-fix state
    if (hasJsonSource) {
      // JSON-aware path: write to content/<topic>.json so test-roundtrip
      // doesn't wipe the change on the next rebuild.
      const doc = loadTopicContent(pageTopic, repoRoot);
      const { applied, skipped } = await applyFixToJson(doc, pageTopic, page);
      const wrote = saveTopicContent(pageTopic, doc, repoRoot);
      if (wrote) pagesTouched++;
      totalInserted += applied;
      totalSkipped += skipped;
      // Render the post-fix doc in-memory so the report below sees the
      // post-fix state (the HTML on disk is stale until test-roundtrip).
      const { html: rendered } = await renderDocWithRanges(doc);
      postFixHtml = rendered;
    } else {
      // Legacy HTML-direct path for hand-authored pages with no JSON source
      // (capstone story pages, etc.). The HTML IS the source of truth here.
      const { html: newHtml, inserts } = applyFixToHtml(html, pageTopic, page);
      if (newHtml !== html) {
        writeFileSync(pagePath, newHtml);
        pagesTouched++;
      }
      totalInserted += inserts;
      postFixHtml = newHtml;
    }
    // Report what would remain on the post-fix page. We do NOT strip first —
    // findCandidatesInPage uses existingLinkTargets to skip concepts already
    // linked to (which includes the just-inserted anchors), so a healthy fix
    // reports 0 candidates. Stripping first would silently re-discover the
    // same anchors as candidates and inflate the count (codex-bot finding on
    // PR #226).
    const cands = [...findCandidatesInPage(postFixHtml, pageTopic, page)];
    if (cands.length > 0) perPage.set(page, cands);
    for (const c of cands) conceptsSeen.add(c.concept.id);
  } else {
    const cands = [...findCandidatesInPage(html, pageTopic, page)];
    if (cands.length > 0) perPage.set(page, cands);
    for (const c of cands) conceptsSeen.add(c.concept.id);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Report.

let totalCandidates = 0;
const sortedPages = [...perPage.keys()].sort();

for (const page of sortedPages) {
  const cands = perPage.get(page);
  console.log(`${page}  (${cands.length} candidate${cands.length === 1 ? '' : 's'})`);
  // Group by section.
  const bySection = new Map();
  for (const c of cands) {
    const sec = c.section || '<no-section>';
    if (!bySection.has(sec)) bySection.set(sec, []);
    bySection.get(sec).push(c);
  }
  const sectionKeys = [...bySection.keys()].sort();
  for (const sec of sectionKeys) {
    console.log(`  #${sec}`);
    for (const c of bySection.get(sec)) {
      totalCandidates++;
      console.log(
        `    "${c.phrase}" → ${c.concept.page}#${c.concept.anchor}   (concept: ${c.concept.id})`
      );
    }
  }
}

console.log('');
console.log(
  `audit-inline-links: ${totalCandidates} candidate(s) across ${sortedPages.length} page(s), ${conceptsSeen.size} unique concept(s)`
);
if (FIX) {
  console.log(`  pages touched: ${pagesTouched}`);
  console.log(`  anchors inserted: ${totalInserted}`);
  if (totalSkipped > 0) {
    console.log(`  candidates skipped (widget bytes, can't back-port): ${totalSkipped}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Resolvability check: every existing wrap on disk should carry a
// `data-concept-id` that resolves to a known concept. Stale ids mean a
// rename or deletion silently broke the popover's title/mastery lookup.

const knownConceptIds = new Set(vocab.map((v) => v.id));
const staleByPage = new Map(); // page -> Set<id>
{
  const idRe = /<a\b[^>]*\bdata-auto-inline-link=["']1["'][^>]*\bdata-concept-id=["']([^"']+)["']/g;
  for (const page of pages) {
    const pagePath = join(repoRoot, page);
    if (!existsSync(pagePath)) continue;
    const html = readFileSync(pagePath, 'utf8');
    let m;
    while ((m = idRe.exec(html))) {
      const id = m[1];
      if (knownConceptIds.has(id)) continue;
      if (!staleByPage.has(page)) staleByPage.set(page, new Set());
      staleByPage.get(page).add(id);
    }
  }
}

let totalStale = 0;
if (staleByPage.size > 0) {
  console.log('');
  console.log('Stale data-concept-id wraps (concept no longer in the bundle):');
  for (const page of [...staleByPage.keys()].sort()) {
    const ids = [...staleByPage.get(page)].sort();
    totalStale += ids.length;
    console.log(`  ${page}: ${ids.join(', ')}`);
  }
  console.log('');
  console.log(`  ${totalStale} stale wrap(s) across ${staleByPage.size} page(s)`);
}

// Exit code: --strict fails on any leftover candidate or any stale id.
// Audit-mode without --strict (and --fix mode in success) exits 0.
if (STRICT && (totalCandidates > 0 || totalStale > 0)) {
  console.log('');
  if (totalCandidates > 0) {
    console.log(`audit-inline-links --strict: FAIL — ${totalCandidates} candidate(s) un-wrapped (run with --fix)`);
  }
  if (totalStale > 0) {
    console.log(`audit-inline-links --strict: FAIL — ${totalStale} stale data-concept-id(s) (rename in concepts/ or rerun --fix)`);
  }
  process.exit(1);
}
process.exit(0);
