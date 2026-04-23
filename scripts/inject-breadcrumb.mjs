#!/usr/bin/env node
// Idempotently inject a breadcrumb strip (section + prev/next) into every
// topic page's top nav.
//
// Source of truth: index.html. We parse each <div class="sec">…</div> section
// label together with the <a class="card" href="./<slug>.html"> anchors inside
// its following <div class="grid"> to build a section map:
//
//   { "<slug>": { section, title, prev, next }, … }
//
// and inline that same map at the top of every topic page via a tiny
// <script> tag, then inject:
//
//   <script>window.__MV_SECTION_MAP = { … };</script>
//   <script src="./js/breadcrumb.js"></script>
//
// near the head (just before the <script src="./js/progress.js"> tag), and a
//
//   <div class="breadcrumb"></div>
//
// mount point inside <nav class="toc">, immediately after the "← Notebook"
// anchor. breadcrumb.js populates the mount at runtime.
//
// Both injections are wrapped in comment fences so re-runs are idempotent:
//
//   <!-- breadcrumb-head-auto-begin -->…<!-- breadcrumb-head-auto-end -->
//   <!-- breadcrumb-nav-auto-begin  -->…<!-- breadcrumb-nav-auto-end  -->
//
// Modes:
//   default      Audit only. Prints a per-page list of out-of-sync pages.
//                Exits 0 (audit mode does not fail CI — the --fix step is the
//                remediator; this mode exists so humans can see drift).
//   --fix        Strip any existing fenced blocks, re-insert fresh ones
//                derived from index.html. Writes every topic HTML.
//   --verbose    With --fix, print a short per-page summary.
//
// Skips index.html, pathway.html, progress.html (these are SPECIAL and never
// get a breadcrumb). Also skips any slug in concepts/index.json whose file is
// missing.
//
// Zero external dependencies.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  makeFence,
  stripFence,
  insertBeforeAnchor,
  writeIfChanged,
} from './lib/html-injector.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');

const argv = process.argv.slice(2);
const FIX = argv.includes('--fix');
const VERBOSE = argv.includes('--verbose') || argv.includes('-v');

const SKIP_PAGES = new Set(['index.html', 'pathway.html', 'progress.html']);

const HEAD = makeFence('breadcrumb-head');
const NAV  = makeFence('breadcrumb-nav');

// ----------------------------------------------------------------------------
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
    // decode a couple of common entities; labels are short plain text anyway.
    const label = labelRaw
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"');
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
        // strip inner <span>…</span> (level badges) and tags.
        title = ttm[1].replace(/<span[\s\S]*?<\/span>/gi, '').replace(/<[^>]+>/g, '').trim();
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
  return (
    NAV.begin +
    '<div class="breadcrumb"></div>' +
    '<span class="mv-theme-slot"></span>' +
    '<div id="mv-lineage-mount" class="lineage-strip" hidden></div>' +
    NAV.end
  );
}

// ----------------------------------------------------------------------------
// 3. Per-topic patch logic.
// ----------------------------------------------------------------------------

// Strip any existing fenced block (both variants) from html. The head fence
// consumes a single trailing newline (we re-insert ours with a matching
// trailing newline so idempotency holds). The nav fence is inline — no
// surrounding whitespace is stripped.
function stripFences(html) {
  const a = stripFence(html, 'breadcrumb-head', {
    trim: { leadingIndent: true, trailingNewline: true },
  });
  const b = stripFence(a.html, 'breadcrumb-nav');
  return { html: b.html, removed: a.removed + b.removed };
}

// Insert the head block just before the <script src="./js/progress.js"> tag.
// Falls back to just before </head> if that script tag is absent. Always
// places the block on its own line: if the char immediately before the
// insertion point is not '\n' we prepend one so the layout is
//
//   ...previous line
//   <!-- breadcrumb-head-auto-begin -->
//   <script>…</script>
//   <script src="./js/breadcrumb.js"></script>
//   <!-- breadcrumb-head-auto-end -->
//   <script src="./js/progress.js"></script>
function insertHeadBlock(html) {
  const progRe = /<script\s+src=["']\.\/js\/progress\.js["']\s*><\/script>/i;
  const anchor = progRe.test(html) ? progRe : /<\/head>/i;
  return insertBeforeAnchor(html, anchor, buildHeadBlock());
}

// Insert the nav block inside <nav class="toc"> immediately after the
// "← Notebook" anchor.
function insertNavBlock(html) {
  // Find <nav class="toc"> … then find the first <a …> … </a> after it.
  const navOpenRe = /<nav\s+class=["']toc["'][^>]*>/i;
  const nm = navOpenRe.exec(html);
  if (!nm) return null;
  const navBodyStart = nm.index + nm[0].length;
  // first anchor after navBodyStart — should be "← Notebook"
  const anchorRe = /<a\b[\s\S]*?<\/a>/i;
  const slice = html.slice(navBodyStart);
  const am = slice.match(anchorRe);
  if (!am) return null;
  const insertAt = navBodyStart + am.index + am[0].length;
  // sanity: make sure this anchor is the back-link (points at ./index.html).
  // The visible label is usually "← Notebook" but a few pages use "← Index".
  if (!/href=["']\.\/index\.html["']/.test(am[0])) {
    // Only inject when the first anchor is unmistakably the back-link.
    return null;
  }
  return html.slice(0, insertAt) + buildNavBlock() + html.slice(insertAt);
}

// Return the desired end state for html (after fix).
function computeDesired(origHtml) {
  const { html: stripped } = stripFences(origHtml);
  let next = insertHeadBlock(stripped);
  if (next === null) return null;
  next = insertNavBlock(next);
  if (next === null) return null;
  return next;
}

// ----------------------------------------------------------------------------
// 4. Enumerate topic pages.
// ----------------------------------------------------------------------------

const indexPath = join(conceptsDir, 'index.json');
const topics = JSON.parse(readFileSync(indexPath, 'utf8')).topics;

const pageList = [];
for (const topic of topics) {
  const file = `${topic}.html`;
  if (SKIP_PAGES.has(file)) continue;
  const p = join(repoRoot, file);
  if (!existsSync(p)) continue;
  pageList.push({ slug: topic, file, path: p });
}

// ----------------------------------------------------------------------------
// 5. Audit / fix.
// ----------------------------------------------------------------------------

const outOfSync = [];
let touched = 0;
let skippedNoProg = 0;
let skippedNoNav = 0;

for (const page of pageList) {
  const orig = readFileSync(page.path, 'utf8');
  const desired = computeDesired(orig);
  if (desired === null) {
    // Couldn't compute — either no progress.js tag or no nav.toc.
    // We still want audit mode to note this; skip writing in fix mode.
    if (!FIX) {
      outOfSync.push(`${page.file}: cannot derive injection (missing <script src="./js/progress.js"> or <nav class="toc">)`);
    } else {
      if (!/<script\s+src=["']\.\/js\/progress\.js["']/.test(orig)) skippedNoProg++;
      if (!/<nav\s+class=["']toc["']/.test(orig)) skippedNoNav++;
      outOfSync.push(`${page.file}: cannot inject (missing progress.js tag or nav.toc)`);
    }
    continue;
  }
  if (desired !== orig) {
    if (FIX) {
      writeIfChanged(page.path, orig, desired);
      touched++;
      if (VERBOSE) {
        const entry = sectionMap[page.slug];
        const sec = entry ? entry.section : '(not registered)';
        const prev = entry && entry.prev ? entry.prev : '—';
        const next = entry && entry.next ? entry.next : '—';
        console.log(`  ${page.file}  [${sec}]  prev=${prev}  next=${next}`);
      }
    } else {
      outOfSync.push(page.file);
    }
  }
}

// ----------------------------------------------------------------------------
// 6. Report.
// ----------------------------------------------------------------------------

console.log(
  `inject-breadcrumb: ${pageList.length} topic page(s), ${Object.keys(sectionMap).length} slug(s) in section map`
);

if (FIX) {
  console.log(`  pages rewritten: ${touched}`);
  if (skippedNoProg > 0) console.log(`  pages skipped (no progress.js tag): ${skippedNoProg}`);
  if (skippedNoNav > 0) console.log(`  pages skipped (no nav.toc): ${skippedNoNav}`);
  if (outOfSync.length > 0) {
    console.log('');
    console.log('WARNINGS:');
    for (const line of outOfSync) console.log(`  - ${line}`);
  }
  console.log('');
  console.log('OK: breadcrumb injection complete.');
  process.exit(0);
}

// Audit mode. Always exits 0 — this is a diagnostic.
if (outOfSync.length === 0) {
  console.log('OK: every topic page carries an up-to-date breadcrumb injection.');
  process.exit(0);
}
console.log('');
console.log(`OUT OF SYNC (${outOfSync.length} page(s)):`);
for (const line of outOfSync) console.log(`  - ${line}`);
console.log('');
console.log('Re-run with --fix to apply.');
process.exit(0);
