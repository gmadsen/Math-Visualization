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
} from './lib/content-model.mjs';
import {
  TITLE_BLOCKLIST,
  MIN_TITLE_LEN,
  buildTitleRegex,
} from './lib/audit-utils.mjs';
import {
  findCandidatesInPage as findCandidatesInPageLib,
  makeIsWritable as makeIsWritableLib,
  stripAutoLinks,
  escAttr,
  buildAnchorHtml,
} from './lib/inline-links-detect.mjs';
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

// Thin wrapper around the lib's findCandidatesInPage that supplies the
// module-level vocab + blocklist. The lib version takes them as explicit
// parameters so scripts/test-inline-links-detect.mjs can exercise the
// algorithm against a synthetic vocabulary without loading the real
// corpus model.
function findCandidatesInPage(html, pageTopic, pageName, isWritable) {
  return findCandidatesInPageLib(html, pageTopic, pageName, vocab, blocklist, isWritable);
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

function stripAutoLinksFromDoc(doc, pageName) {
  // Wrap the per-field strip so we can surface a warning when an
  // unexpected location (widget body, frame field) actually had bytes
  // mutated. silent-failure-hunter on PR #227 flagged that a hand-paste
  // into a widget script template literal would be silently unwrapped.
  function stripIn(label, s) {
    if (typeof s !== 'string') return s;
    const next = stripAutoLinks(s);
    if (next !== s && label !== 'raw-block' && label !== 'quiz-block') {
      console.warn(
        `audit-inline-links: ${pageName || '?'} — stripped auto-link anchor(s) from ` +
        `unexpected location "${label}". If this anchor was hand-authored, ` +
        `move it to a raw block or remove the data-auto-inline-link="1" attribute.`
      );
    }
    return next;
  }
  doc.rawHead = stripIn('rawHead', doc.rawHead);
  doc.rawBodyPrefix = stripIn('rawBodyPrefix', doc.rawBodyPrefix);
  doc.rawBodySuffix = stripIn('rawBodySuffix', doc.rawBodySuffix);
  for (const section of doc.sections) {
    for (const block of section.blocks) {
      // raw / quiz: html is verbatim.
      // inline widget (no slug): html + optional script are verbatim too —
      // strip both defensively in case a hand-paste copied an auto-link
      // anchor into a widget block. Registry-driven widgets (with slug)
      // render from params, so they have no html/script bytes to strip.
      if ((block.type === 'raw' || block.type === 'quiz') &&
          typeof block.html === 'string') {
        block.html = stripIn(block.type === 'raw' ? 'raw-block' : 'quiz-block', block.html);
      } else if (block.type === 'widget' && !block.slug) {
        if (typeof block.html === 'string')   block.html   = stripIn('inline widget.html', block.html);
        if (typeof block.script === 'string') block.script = stripIn('inline widget.script', block.script);
      } else if (block.type === 'widget-script' && !block.ref &&
                 typeof block.html === 'string') {
        block.html = stripIn('inline widget-script.html', block.html);
      }
    }
  }
}

async function applyFixToJson(doc, pageTopic, pageName) {
  // Strip first so candidate detection sees clean prose.
  stripAutoLinksFromDoc(doc, pageName);

  const { html, ranges } = await renderDocWithRanges(doc);

  // isWritable: tell findCandidatesInPage to drop matches that land in
  // widget-block bytes WITHOUT consuming the per-page dedupe slot, so a
  // later raw-block mention of the same concept can still wrap. Also
  // catches boundary-span / invariant-violation cases at detection time
  // rather than as a silent post-hoc skip.
  const isWritable = makeIsWritable(ranges);

  const candidates = [...findCandidatesInPage(html, pageTopic, pageName, isWritable)];
  // Sort descending by offset — splicing earliest offsets first would shift
  // later candidates' positions inside their source block.
  candidates.sort((a, b) => b.globalIdx - a.globalIdx);

  // isWritable above already filtered out widget-byte / boundary-span /
  // out-of-range matches, so every surviving candidate's range is one of
  // the writable kinds (raw/quiz block, rawHead, rawBodyPrefix,
  // rawBodySuffix). The branches below are mutually exhaustive of those
  // kinds; an unexpected range kind would mean isWritable and applyFix
  // disagree, which is a programmer error worth surfacing.
  let applied = 0;
  let skipped = 0;
  for (const cand of candidates) {
    const range = findRangeAt(ranges, cand.globalIdx);
    if (!range || cand.globalIdx + cand.length > range.end) {
      console.warn(
        `audit-inline-links: ${pageName} concept "${cand.concept.id}" — ` +
        `isWritable/applyFix predicate mismatch at offset ${cand.globalIdx} (skipped)`
      );
      skipped++;
      continue;
    }
    const offsetInRange = cand.globalIdx - range.start;
    const anchor = buildAnchorHtml(cand.concept, cand.phrase);
    if (range.kind === 'block') {
      const block = range.block;
      const html = block.html;
      block.html = html.slice(0, offsetInRange) + anchor + html.slice(offsetInRange + cand.length);
      applied++;
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
        `isWritable accepted but applyFix saw unknown range kind "${range.kind}" (skipped)`
      );
      skipped++;
    }
  }

  return { applied, skipped };
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

  const hasJsonSource = existsSync(contentJsonPath(pageTopic));
  let reportHtml = html;
  let reportIsWritable = null; // unused on HTML-direct pages (everything writable)

  if (FIX) {
    if (hasJsonSource) {
      // JSON-aware path: write to content/<topic>.json so test-roundtrip
      // doesn't wipe the change on the next rebuild.
      const doc = loadTopicContent(pageTopic, repoRoot);
      const { applied, skipped } = await applyFixToJson(doc, pageTopic, page);
      const wrote = saveTopicContent(pageTopic, doc, repoRoot);
      if (wrote) pagesTouched++;
      totalInserted += applied;
      totalSkipped += skipped;
      // Render the post-fix doc in-memory and keep the ranges so the
      // recheck below can apply the same isWritable filter applyFixToJson
      // used at write time. Without this, widget-byte-only matches would
      // resurface in the recheck and falsely trip --strict in CI even
      // though they're correctly un-fixable.
      const { html: rendered, ranges } = await renderDocWithRanges(doc);
      reportHtml = rendered;
      reportIsWritable = makeIsWritable(ranges);
    } else {
      // Legacy HTML-direct path for hand-authored pages with no JSON source
      // (capstone story pages, etc.). The HTML IS the source of truth here.
      const { html: newHtml, inserts } = applyFixToHtml(html, pageTopic, page);
      if (newHtml !== html) {
        writeFileSync(pagePath, newHtml);
        pagesTouched++;
      }
      totalInserted += inserts;
      reportHtml = newHtml;
    }
  } else if (hasJsonSource) {
    // Audit mode on a JSON-sourced page: load the JSON purely to build the
    // ranges, so audit-mode candidate detection also drops widget-byte
    // matches via isWritable. Without this, --no-fix mode (CI) would flag
    // unfixable widget-byte candidates and --strict would fail spuriously.
    const doc = loadTopicContent(pageTopic, repoRoot);
    const { html: rendered, ranges } = await renderDocWithRanges(doc);
    reportHtml = rendered;
    reportIsWritable = makeIsWritable(ranges);
  }

  // Report what remains on the (post-fix or pre-fix) page. We do NOT
  // strip first — findCandidatesInPage uses existingLinkTargets to skip
  // concepts already linked to (which includes any just-inserted
  // anchors), so a healthy --fix run reports 0 candidates. Stripping
  // first would silently re-discover the same anchors as candidates and
  // inflate the count (codex-bot finding on PR #226).
  const cands = [...findCandidatesInPage(reportHtml, pageTopic, page, reportIsWritable)];
  if (cands.length > 0) perPage.set(page, cands);
  for (const c of cands) conceptsSeen.add(c.concept.id);
}

// Thin wrapper around the lib's makeIsWritable that supplies findRangeAt
// from scripts/lib/render-doc.mjs. The lib version takes findRangeAt as
// a parameter so it can stay test-importable without pulling render-doc
// into the unit-test surface (the test mocks ranges with its own
// findRangeAt). Local code keeps the same single-arg call shape.
function makeIsWritable(ranges) {
  return makeIsWritableLib(ranges, findRangeAt);
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
    // Should be 0 in normal operation. Non-zero means isWritable and the
    // applyFix range-kind dispatch disagree — see the per-page warnings.
    console.log(`  candidates skipped (isWritable/applyFix mismatch): ${totalSkipped}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Resolvability check: every existing wrap should carry a `data-concept-id`
// that resolves to a known concept. Stale ids mean a rename or deletion
// silently broke the popover's title/mastery lookup.
//
// For JSON-sourced pages, we scan the rendered output of the in-memory
// post-fix doc (not the on-disk HTML), so a same-rebuild JSON rename is
// reflected before test-roundtrip writes the new HTML. Otherwise --strict
// would fail spuriously on a stale HTML snapshot of a just-renamed concept.
//
// The anchor matcher is two-pass and attribute-order-agnostic: find every
// `<a … data-auto-inline-link="1" …>` tag, then extract `data-concept-id`
// from its attribute list regardless of position. Prevents a future
// reordering in buildAnchorHtml from silently breaking the scan.

const knownConceptIds = new Set(vocab.map((v) => v.id));
const staleByPage = new Map(); // page -> Set<id>
const anchorTagRe = /<a\b[^>]*\bdata-auto-inline-link=["']1["'][^>]*>/g;
const conceptIdAttrRe = /\bdata-concept-id=["']([^"']+)["']/;
async function scanForStale(page, html) {
  let m;
  while ((m = anchorTagRe.exec(html))) {
    const tag = m[0];
    const idMatch = tag.match(conceptIdAttrRe);
    if (!idMatch) continue;
    const id = idMatch[1];
    if (knownConceptIds.has(id)) continue;
    if (!staleByPage.has(page)) staleByPage.set(page, new Set());
    staleByPage.get(page).add(id);
  }
}
for (const page of pages) {
  const pagePath = join(repoRoot, page);
  if (!existsSync(pagePath)) continue;
  const pageTopic = topicOfPage(page);
  if (existsSync(contentJsonPath(pageTopic))) {
    // JSON-sourced: render the current JSON in-memory so any rename
    // applied earlier in this run is visible. The on-disk HTML is
    // still stale until test-roundtrip catches up.
    const doc = loadTopicContent(pageTopic, repoRoot);
    const { html: rendered } = await renderDocWithRanges(doc);
    await scanForStale(page, rendered);
  } else {
    await scanForStale(page, readFileSync(pagePath, 'utf8'));
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
