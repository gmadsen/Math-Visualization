#!/usr/bin/env node
// Idempotently inject a breadcrumb strip (section + prev/next) into every
// topic page's top nav.
//
// Source-of-truth flip: this script now mutates `content/<topic>.json`, not
// `<topic>.html`.  Each topic JSON carries a `rawHead` string (the page <head>
// region) and a `rawBodyPrefix` string (the body opener including <body>,
// <nav class="toc">, hero, sidetoc, etc.).  These map exactly to the regions
// where the breadcrumb head/nav/lineage fences live.  After this script
// rewrites the JSON, `test-roundtrip.mjs --fix` propagates the change to the
// HTML.
//
// Source for the section map: index.html. We parse each
// <div class="sec">…</div> section label together with the
// <a class="card" href="./<slug>.html"> anchors inside its following
// <div class="grid"> to build a section map:
//
//   { "<slug>": { section, title, prev, next }, … }
//
// and inline that same map at the top of every topic page via a tiny
// <script> tag (in `doc.rawHead`):
//
//   <script>window.__MV_SECTION_MAP = { … };</script>
//   <script src="./js/breadcrumb.js"></script>
//
// near the head (just before the <script src="./js/progress.js"> tag), and a
//
//   <div class="breadcrumb"></div>
//
// mount point inside <nav class="toc">, immediately after the "← Notebook"
// anchor (in `doc.rawBodyPrefix`). breadcrumb.js populates the mount at
// runtime.  A separate `lineage-mount` fence in `doc.rawBodyPrefix`
// immediately after </nav> hosts the lineage strip.
//
// All three injections are wrapped in comment fences so re-runs are
// idempotent:
//
//   <!-- breadcrumb-head-auto-begin -->…<!-- breadcrumb-head-auto-end -->
//   <!-- breadcrumb-nav-auto-begin  -->…<!-- breadcrumb-nav-auto-end  -->
//   <!-- lineage-mount-auto-begin   -->…<!-- lineage-mount-auto-end   -->
//
// Modes:
//   default      Audit only. Prints a per-topic list of out-of-sync JSONs.
//                Exits 0 (audit mode does not fail CI — the --fix step is the
//                remediator; this mode exists so humans can see drift).
//   --fix        Strip any existing fenced blocks from the JSON's rawHead /
//                rawBodyPrefix, re-insert fresh ones derived from index.html.
//                Writes only if bytes changed (saveTopicContent's contract).
//   --verbose    With --fix, print a short per-topic summary.
//
// Skips index.html, pathway.html, progress.html, mindmap.html (these are
// SPECIAL and never get a breadcrumb).  Also skips any slug in
// concepts/index.json whose content/<slug>.json is missing.
//
// Zero external dependencies.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  makeFence,
  stripFence,
  insertBeforeAnchor,
} from './lib/html-injector.mjs';
import {
  loadTopicContent,
  saveTopicContent,
} from './lib/json-block-writer.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');

const argv = process.argv.slice(2);
const FIX = argv.includes('--fix');
const VERBOSE = argv.includes('--verbose') || argv.includes('-v');

// SPECIAL pages — these have no content/<topic>.json and no breadcrumb.
const SKIP_SLUGS = new Set(['index', 'pathway', 'progress', 'mindmap']);

const HEAD = makeFence('breadcrumb-head');
const NAV  = makeFence('breadcrumb-nav');
const LINEAGE_FENCE = makeFence('lineage-mount', 'html');

// ----------------------------------------------------------------------------
// HTML entity decoder for short plain-text strings (section labels and
// card titles). The hand-authored index.html only uses the four core
// entities plus &#39;; this handles all of them. Anything richer (named
// entities, decimal/hex codepoints) would need a real HTML parser.
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

// 1. Parse index.html → section map.
// ----------------------------------------------------------------------------

const indexHtmlPath = join(repoRoot, 'index.html');
const indexHtml = readFileSync(indexHtmlPath, 'utf8');

// Walk the document linearly. Every <div class="sec">LABEL</div> opens a new
// section; we then collect every <a class="card …" href="./SLUG.html"> that
// appears in the *next* <div class="grid"> block (up to its matching </div>).
//
// The "Sections" sec near the bottom has no cards — naturally skipped.

function parseIndexSections(html) {
  const sections = [];
  // Match any <div class="sec" ...>LABEL</div>. LABEL may contain entities.
  const secRe = /<div\s+class=["']sec["'](?:\s+[^>]*)?>([\s\S]*?)<\/div>/gi;
  const secPositions = [];
  let sm;
  while ((sm = secRe.exec(html))) {
    const labelRaw = sm[1].trim();
    const label = decodeEntities(labelRaw);
    secPositions.push({
      label,
      startIdx: sm.index,
      endIdx: sm.index + sm[0].length,
    });
  }
  // For each sec, the scope is [this.endIdx, nextSec.startIdx or EOF).
  for (let i = 0; i < secPositions.length; i++) {
    const start = secPositions[i].endIdx;
    const scopeEnd = i + 1 < secPositions.length
      ? secPositions[i + 1].startIdx
      : html.length;
    const scope = html.slice(start, scopeEnd);
    // collect <a class="card …" href="./SLUG.html">
    const cardRe = /<a\s+class=["']card[^"']*["']\s+href=["']\.\/([^"'\/#?]+)\.html["'][^>]*>([\s\S]*?)<\/a>/gi;
    const cards = [];
    let cm;
    while ((cm = cardRe.exec(scope))) {
      const slug = cm[1];
      // extract <div class="tt">Title<span...>...</span></div> — title is the
      // text before any <span>. This also handles cases with no level badge.
      const ttRe = /<div\s+class=["']tt["'][^>]*>([\s\S]*?)<\/div>/i;
      const ttm = cm[2].match(ttRe);
      let title = slug;
      if (ttm) {
        // strip inner <span>…</span> (level badges) and tags, then decode
        // entities so a card titled "Adèles &amp; idèles" stores as
        // "Adèles & idèles" (breadcrumb.js uses textContent which would
        // otherwise render the literal "&amp;").
        title = decodeEntities(
          ttm[1].replace(/<span[\s\S]*?<\/span>/gi, '').replace(/<[^>]+>/g, '').trim()
        );
        if (!title) title = slug;
      }
      cards.push({ slug, title });
    }
    if (cards.length > 0) {
      sections.push({ label: secPositions[i].label, cards });
    }
  }
  return sections;
}

const sections = parseIndexSections(indexHtml);

// Build the flat section map.
//
// prev/next are relative to each section's in-order card list (the order in
// index.html — that's the curriculum order, not alphabetical; "alphabetical"
// in the design brief was shorthand for "in the order the cards appear").
const sectionMap = {};
for (const sec of sections) {
  for (let i = 0; i < sec.cards.length; i++) {
    const c = sec.cards[i];
    const prev = i > 0 ? sec.cards[i - 1].slug : null;
    const next = i + 1 < sec.cards.length ? sec.cards[i + 1].slug : null;
    sectionMap[c.slug] = {
      section: sec.label,
      title: c.title,
      prev,
      next,
    };
  }
}

// Serialize the section map with stable key ordering. JSON.stringify with
// sorted keys keeps the injected block byte-stable between runs (idempotent).
function stableStringify(obj) {
  // Sort keys at each object level. Keep arrays as-is.
  const sorter = (value) => {
    if (Array.isArray(value)) return value.map(sorter);
    if (value && typeof value === 'object') {
      const out = {};
      for (const k of Object.keys(value).sort()) out[k] = sorter(value[k]);
      return out;
    }
    return value;
  };
  return JSON.stringify(sorter(obj));
}

const sectionMapJson = stableStringify(sectionMap);

// ----------------------------------------------------------------------------
// 2. Construct the head-script and nav-mount blocks.
// ----------------------------------------------------------------------------

function buildHeadBlock() {
  return (
    HEAD.begin + '\n' +
    '<script>window.__MV_SECTION_MAP = ' + sectionMapJson + ';</script>\n' +
    '<script src="./js/breadcrumb.js"></script>\n' +
    '<script src="./js/glossary-popover.js" defer></script>\n' +
    '<link rel="stylesheet" media="print" href="./css/print.css">\n' +
    '<link rel="stylesheet" href="./css/theme-light.css">\n' +
    '<script src="./js/theme-toggle.js"></script>\n' +
    '<script src="./concepts/bundle.js" defer></script>\n' +
    '<script src="./js/topic-hotkeys.js" defer></script>\n' +
    '<script src="./js/topic-lineage.js" defer></script>\n' +
    HEAD.end
  );
}

function buildNavBlock() {
  // Note: the lineage mount used to sit inside the sticky <nav>, but when
  // the strip expanded it inflated the sticky bar and overlapped the
  // content below (main has a fixed top-padding assuming a thin nav).
  // The mount now lives OUTSIDE the nav as a sibling so it takes a
  // natural block slot in document flow and pushes content down.
  return (
    NAV.begin +
    '<div class="breadcrumb"></div>' +
    '<span class="mv-theme-slot"></span>' +
    NAV.end
  );
}

function buildLineageBlock() {
  return (
    LINEAGE_FENCE.begin +
    '<div id="mv-lineage-mount" class="lineage-strip" hidden></div>' +
    LINEAGE_FENCE.end
  );
}

// ----------------------------------------------------------------------------
// 3. Per-topic patch logic (operates on JSON string fields).
// ----------------------------------------------------------------------------

// Strip any existing breadcrumb-head fence from rawHead. The head fence
// consumes a single trailing newline (we re-insert ours with a matching
// trailing newline so idempotency holds) and any leading indent on the
// fence line.
function stripHeadFence(rawHead) {
  const r = stripFence(rawHead, 'breadcrumb-head', {
    trim: { leadingIndent: true, trailingNewline: true },
  });
  return { html: r.html, removed: r.removed };
}

// Strip nav + lineage fences from rawBodyPrefix.  The nav fence is inline
// (no surrounding-whitespace stripping) — it sits glued to the back-link
// anchor.  The lineage fence sits on a fresh line after </nav> with a
// preceding '\n' that we want to consume along with the fence so
// re-insertion is byte-stable.
function stripBodyPrefixFences(rawBodyPrefix) {
  const a = stripFence(rawBodyPrefix, 'breadcrumb-nav');
  const b = stripFence(a.html, 'lineage-mount', {
    trim: { leadingNewline: true },
  });
  return { html: b.html, removed: a.removed + b.removed };
}

// Insert the head block just before the <script src="./js/progress.js"> tag.
// Falls back to just before </head> if that script tag is absent. Always
// places the block on its own line.
function insertHeadBlock(rawHead) {
  const progRe = /<script\s+src=["']\.\/js\/progress\.js["']\s*><\/script>/i;
  const anchor = progRe.test(rawHead) ? progRe : /<\/head>/i;
  return insertBeforeAnchor(rawHead, anchor, buildHeadBlock());
}

// Insert the nav block inside <nav class="toc"> immediately after the
// "← Notebook" anchor. Inline (no own line) so the rendered HTML matches
// the canonical layout `<a>...</a><!-- ...nav... --><div>...`.
function insertNavBlock(rawBodyPrefix) {
  const navOpenRe = /<nav\s+class=["']toc["'][^>]*>/i;
  const nm = navOpenRe.exec(rawBodyPrefix);
  if (!nm) return null;
  const navBodyStart = nm.index + nm[0].length;
  // first anchor after navBodyStart — should be "← Notebook"
  const anchorRe = /<a\b[\s\S]*?<\/a>/i;
  const slice = rawBodyPrefix.slice(navBodyStart);
  const am = slice.match(anchorRe);
  if (!am) return null;
  const insertAt = navBodyStart + am.index + am[0].length;
  // sanity: make sure this anchor is the back-link (points at ./index.html).
  if (!/href=["']\.\/index\.html["']/.test(am[0])) {
    return null;
  }
  return rawBodyPrefix.slice(0, insertAt) + buildNavBlock() + rawBodyPrefix.slice(insertAt);
}

// Insert the lineage mount block immediately after the closing </nav>,
// outside the sticky bar so it takes a natural block slot in document flow.
// Layout: `</nav>\n<!-- lineage... -->...<!-- ...end -->`.
function insertLineageBlock(rawBodyPrefix) {
  const navCloseRe = /<\/nav>/i;
  const nm = navCloseRe.exec(rawBodyPrefix);
  if (!nm) return null;
  const insertAt = nm.index + nm[0].length;
  return rawBodyPrefix.slice(0, insertAt) + '\n' + buildLineageBlock() + rawBodyPrefix.slice(insertAt);
}

// Compute desired (rawHead, rawBodyPrefix) after fix. Returns null if a
// required anchor is missing on either field.
function computeDesired(doc) {
  const headStripped = stripHeadFence(doc.rawHead).html;
  const newHead = insertHeadBlock(headStripped);
  if (newHead === null) return null;

  const bodyStripped = stripBodyPrefixFences(doc.rawBodyPrefix).html;
  let newBody = insertNavBlock(bodyStripped);
  if (newBody === null) return null;
  newBody = insertLineageBlock(newBody);
  if (newBody === null) return null;

  return { rawHead: newHead, rawBodyPrefix: newBody };
}

// ----------------------------------------------------------------------------
// 4. Enumerate topic JSONs.
// ----------------------------------------------------------------------------

const indexPath = join(conceptsDir, 'index.json');
const topics = JSON.parse(readFileSync(indexPath, 'utf8')).topics;

const topicList = [];
for (const topic of topics) {
  if (SKIP_SLUGS.has(topic)) continue;
  const jsonPath = join(repoRoot, 'content', `${topic}.json`);
  if (!existsSync(jsonPath)) continue;
  topicList.push({ slug: topic, jsonPath });
}

// ----------------------------------------------------------------------------
// 5. Audit / fix.
// ----------------------------------------------------------------------------

const outOfSync = [];
let touched = 0;
let skippedNoProg = 0;
let skippedNoNav = 0;

for (const t of topicList) {
  const doc = loadTopicContent(t.slug, repoRoot);
  const desired = computeDesired(doc);

  if (desired === null) {
    // Couldn't compute — either no progress.js anchor or no nav.toc.  Keep
    // audit and fix mode aligned: never write, surface as drift.
    if (!/<script\s+src=["']\.\/js\/progress\.js["']/.test(doc.rawHead) &&
        !/<\/head>/i.test(doc.rawHead)) {
      skippedNoProg++;
    }
    if (!/<nav\s+class=["']toc["']/.test(doc.rawBodyPrefix)) skippedNoNav++;
    outOfSync.push(`${t.slug}.json: cannot inject (missing progress.js anchor or nav.toc in JSON)`);
    continue;
  }

  if (desired.rawHead !== doc.rawHead || desired.rawBodyPrefix !== doc.rawBodyPrefix) {
    if (FIX) {
      doc.rawHead = desired.rawHead;
      doc.rawBodyPrefix = desired.rawBodyPrefix;
      const wrote = saveTopicContent(t.slug, doc, repoRoot);
      if (wrote) {
        touched++;
        if (VERBOSE) {
          const entry = sectionMap[t.slug];
          const sec = entry ? entry.section : '(not registered)';
          const prev = entry && entry.prev ? entry.prev : '—';
          const next = entry && entry.next ? entry.next : '—';
          console.log(`  ${t.slug}.json  [${sec}]  prev=${prev}  next=${next}`);
        }
      }
    } else {
      outOfSync.push(`${t.slug}.json`);
    }
  }
}

// ----------------------------------------------------------------------------
// 6. Report.
// ----------------------------------------------------------------------------

console.log(
  `inject-breadcrumb: ${topicList.length} topic JSON(s), ${Object.keys(sectionMap).length} slug(s) in section map`
);

if (FIX) {
  console.log(`  topic JSONs rewritten: ${touched}`);
  if (skippedNoProg > 0) console.log(`  topics skipped (no progress.js anchor): ${skippedNoProg}`);
  if (skippedNoNav > 0) console.log(`  topics skipped (no nav.toc): ${skippedNoNav}`);
  if (outOfSync.length > 0) {
    console.log('');
    console.log('WARNINGS:');
    for (const line of outOfSync) console.log(`  - ${line}`);
  }
  console.log('');
  console.log('OK: breadcrumb injection complete (JSON written; run test-roundtrip.mjs --fix to propagate to HTML).');
  process.exit(0);
}

// Audit mode. Always exits 0 — this is a diagnostic.
if (outOfSync.length === 0) {
  console.log('OK: every topic JSON carries an up-to-date breadcrumb injection.');
  process.exit(0);
}
console.log('');
console.log(`OUT OF SYNC (${outOfSync.length} topic JSON(s)):`);
for (const line of outOfSync) console.log(`  - ${line}`);
console.log('');
console.log('Re-run with --fix to apply.');
process.exit(0);
