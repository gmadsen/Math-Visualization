#!/usr/bin/env node
// Build one focused landing page per section under sections/<slug>.html.
//
// Semantics:
//   - index.html groups 56 topic cards under 7 section headers (`.sec` divs).
//     For readers studying just one area, each section gets its own mini-index
//     page that mirrors the main grid but contains only that section's cards.
//
//   - Each generated page copies index.html's <head> verbatim (KaTeX loader,
//     :root tokens, full <style> block) so styling stays in lock-step, then
//     rewrites relative asset/link paths from ./ → ../ because the page is one
//     level deeper.
//
//   - The generated body is fenced by
//       <!-- section-index-auto-begin --> ... <!-- section-index-auto-end -->
//     so re-runs replace it wholesale (idempotent).
//
//   - After writing every section page, append a compact "Sections" row to
//     index.html itself, fenced by
//       <!-- section-links-auto-begin --> ... <!-- section-links-auto-end -->
//     placed immediately above the closing <footer>.
//
// Mirrors the file-level style of scripts/audit-callbacks.mjs. Zero dependencies.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const indexPath = join(repoRoot, 'index.html');
const sectionsDir = join(repoRoot, 'sections');

// --fix writes; default mode compares desired vs on-disk bytes and exits 1
// on drift. CI (`rebuild.mjs --no-fix`) must stay read-only so committed
// section-index drift surfaces as a build failure rather than being silently
// regenerated and passing.
const FIX = process.argv.includes('--fix');
const driftedFiles = [];

// ----- 1-sentence description per section (sourced from sections.json) -----
// Each entry in concepts/sections.json carries a `description` field; we
// build a lookup keyed by display title. Sections without a description
// surface a build-time warning rather than a hard error so a new section
// can be wired in without blocking the build on prose.
const sectionsJsonPath = join(repoRoot, 'concepts', 'sections.json');
const SECTION_BLURBS = (() => {
  let data;
  try {
    data = JSON.parse(readFileSync(sectionsJsonPath, 'utf8'));
  } catch (e) {
    console.error(
      `build-section-indexes: failed to read concepts/sections.json — ${e.message}.\n` +
      `  Run \`node scripts/validate-schema.mjs\` first for a schema-aware error.`
    );
    process.exit(1);
  }
  const out = Object.create(null);
  for (const sec of data.sections || []) {
    if (sec && sec.title) out[sec.title] = sec.description || '';
  }
  return out;
})();

// ----- Utilities -----
function slugify(title) {
  // "Geometry & topology" -> "geometry-and-topology"
  // "Modular forms & L-functions" -> "modular-forms-and-l-functions"
  return title
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function decodeEntities(s) {
  // Minimal: we only need &amp; for display titles in index.html (e.g. "Geometry &amp; topology").
  return s.replace(/&amp;/g, '&');
}

// ----- Parse index.html into <head> + sections{title, cards[]} -----
const indexHtml = readFileSync(indexPath, 'utf8');

const headMatch = indexHtml.match(/<head>([\s\S]*?)<\/head>/i);
if (!headMatch) {
  console.error('FAIL: could not locate <head>…</head> in index.html');
  process.exit(1);
}
const origHeadInner = headMatch[1];

// Rewrite the <head> for the sections/ subdirectory. KaTeX is on a CDN, so
// the only relative paths are defensive rewrites for ./<something>.
// Apply to href="./…" and src="./…" uniformly.
//
// Also neutralize the index.html collapsible-section affordance on these
// pages: each section landing only contains ONE `.sec` header (its own), so
// the cursor:pointer + chevron + hover styles offer no real action and the
// click handler that drives them lives in index.html only. Overriding the
// styles here keeps the index-side affordance intact while making the
// section pages render as plain headers.
const SECTION_PAGE_OVERRIDES = '\n<style>\n' +
  '  /* Section pages contain a single .sec header — neutralize the\n' +
  '     collapsible affordance copied from index.html. */\n' +
  '  .sec{cursor:default;user-select:auto}\n' +
  '  .sec:hover{border-bottom-color:var(--line);background:transparent;\n' +
  '    border-left-width:3px;padding-left:0.95rem}\n' +
  '  .sec::before{content:none}\n' +
  '</style>\n';

function rewriteHead(headInner) {
  return headInner
    .replace(/href="\.\/(?!\/)/g, 'href="../')
    .replace(/src="\.\/(?!\/)/g, 'src="../') + SECTION_PAGE_OVERRIDES;
}

// Retitle (keep everything else in <head> untouched).
function retitle(headInner, sectionTitle) {
  return headInner.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${sectionTitle} · Interactive Mathematics Notebook</title>`
  );
}

// Collect all `.sec` headers and their absolute offsets.
const secRe = /<div class="sec">([\s\S]*?)<\/div>/g;
const secHeaders = [];
let m;
while ((m = secRe.exec(indexHtml)) !== null) {
  secHeaders.push({ title: decodeEntities(m[1].trim()), start: m.index, headerEnd: m.index + m[0].length });
}

if (secHeaders.length === 0) {
  console.error('FAIL: no <div class="sec"> headers found in index.html');
  process.exit(1);
}

// For each section, the associated cards live inside the very next
// <div class="grid">…</div> block. That grid is closed by the next </div>
// at its own nesting level. Because cards are built with <a>…</a> (not <div>),
// the first top-level </div> after the opening <div class="grid"> closes it.
function extractGridBlock(html, afterOffset) {
  const openRe = /<div class="grid">/g;
  openRe.lastIndex = afterOffset;
  const om = openRe.exec(html);
  if (!om) return null;
  const gridInnerStart = om.index + om[0].length;

  // Walk forward counting nested <div>…</div>. Cards use <a class="card …">,
  // but their internal .thumb/.body are <div>s — so a naive first-</div> scan
  // would close too early. Track depth across <div> opens and closes.
  let depth = 1;
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = gridInnerStart;
  let gridInnerEnd = -1;
  let gridBlockEnd = -1;
  let t;
  while ((t = tagRe.exec(html)) !== null) {
    if (t[0].startsWith('</')) {
      depth--;
      if (depth === 0) {
        gridInnerEnd = t.index;
        gridBlockEnd = t.index + t[0].length;
        break;
      }
    } else {
      depth++;
    }
  }
  if (gridInnerEnd === -1) return null;
  return {
    gridOpenStart: om.index,
    gridInnerStart,
    gridInnerEnd,
    gridBlockEnd,
    innerHtml: html.slice(gridInnerStart, gridInnerEnd),
  };
}

// Count cards in a grid by <a class="card …"> occurrences.
function countCards(innerHtml) {
  const cre = /<a\s+class="card\b/g;
  let n = 0;
  while (cre.exec(innerHtml) !== null) n++;
  return n;
}

// Rewrite card hrefs: href="./foo.html" -> href="../foo.html".
// Only rewrites strings starting with "./"; leaves http(s):// alone.
function rewriteCardHrefs(innerHtml) {
  return innerHtml.replace(/href="\.\/(?!\/)/g, 'href="../');
}

const parsedSections = secHeaders.map((h, i) => {
  const next = secHeaders[i + 1];
  const searchFrom = h.headerEnd;
  const grid = extractGridBlock(indexHtml, searchFrom);
  if (!grid) return { ...h, cards: '', cardCount: 0, empty: true };
  // Sanity: grid must start before the next `.sec` header.
  if (next && grid.gridOpenStart >= next.start) {
    return { ...h, cards: '', cardCount: 0, empty: true };
  }
  return {
    ...h,
    cards: grid.innerHtml,
    cardCount: countCards(grid.innerHtml),
    empty: countCards(grid.innerHtml) === 0,
  };
});

// ----- Build each sections/<slug>.html -----
mkdirSync(sectionsDir, { recursive: true });

const summary = [];
const emptySections = [];

for (const sec of parsedSections) {
  const slug = slugify(sec.title);
  const blurb = SECTION_BLURBS[sec.title] || '';
  if (!blurb) {
    console.warn(`  warn: no blurb mapping for section "${sec.title}" — using empty string`);
  }

  const headInner = retitle(rewriteHead(origHeadInner), sec.title);
  const cardsInner = rewriteCardHrefs(sec.cards);

  // Compose body between fences.
  const body = [
    '<body>',
    '<!-- section-index-auto-begin -->',
    '<main>',
    '  <nav class="section-nav" style="font-size:0.88rem;margin:0 0 1.6rem;color:var(--mute)">',
    '    <a href="../index.html" style="color:var(--violet)">← Full index</a>',
    '    &nbsp;·&nbsp;',
    '    <a href="../pathway.html" style="color:var(--violet)">Pathway explorer →</a>',
    '  </nav>',
    '  <section class="hero">',
    `    <h1>${sec.title}</h1>`,
    `    <p class="sub">${blurb}</p>`,
    '  </section>',
    '',
    `  <div class="sec">${sec.title}</div>`,
    '  <div class="grid">',
    cardsInner.replace(/\n?\s*$/, ''),
    '  </div>',
    '',
    '  <footer>',
    '    Dark palette &amp; pedagogical spirit after 3Blue1Brown. Math typeset with <a href="https://katex.org">KaTeX</a>. Interactive widgets are hand-written SVG + JS.',
    '  </footer>',
    '</main>',
    '<!-- section-index-auto-end -->',
    '</body>',
    '</html>',
  ].join('\n');

  const out = `<!doctype html>\n<html lang="en">\n<head>${headInner}</head>\n${body}\n`;

  const outPath = join(sectionsDir, `${slug}.html`);
  const existing = existsSync(outPath) ? readFileSync(outPath, 'utf8') : null;
  if (existing !== out) {
    if (FIX) {
      writeFileSync(outPath, out);
    } else {
      driftedFiles.push(`sections/${slug}.html`);
    }
  }

  summary.push({ slug, title: sec.title, cardCount: sec.cardCount, path: outPath });
  if (sec.empty) emptySections.push(sec.title);
}

// ----- Append/replace "Sections" row in index.html -----
const sectionLinksHtml = [
  '  <!-- section-links-auto-begin -->',
  '  <div class="sec" style="margin-top:3rem">Sections</div>',
  '  <p class="sub" style="text-align:left;font-size:0.92rem;margin:0 0 1rem">',
  summary
    .map(
      (s, i) =>
        `    <a href="./sections/${s.slug}.html">${s.title}</a>${i < summary.length - 1 ? ' · ' : ''}`
    )
    .join('\n'),
  '  </p>',
  '  <!-- section-links-auto-end -->',
].join('\n');

let newIndex = indexHtml;
const fenceRe = /\s*<!-- section-links-auto-begin -->[\s\S]*?<!-- section-links-auto-end -->\s*/;
if (fenceRe.test(newIndex)) {
  newIndex = newIndex.replace(fenceRe, '\n' + sectionLinksHtml + '\n\n  ');
} else {
  // Insert just above the existing <footer>.
  const footerRe = /(\n\s*)(<footer\b)/;
  const fm = newIndex.match(footerRe);
  if (!fm) {
    console.error('FAIL: could not locate <footer> in index.html to anchor section-links row');
    process.exit(1);
  }
  const insertAt = fm.index + fm[1].length;
  newIndex =
    newIndex.slice(0, insertAt) +
    sectionLinksHtml +
    '\n\n  ' +
    newIndex.slice(insertAt);
}

if (newIndex !== indexHtml) {
  if (FIX) {
    writeFileSync(indexPath, newIndex);
  } else {
    driftedFiles.push('index.html');
  }
}

// ----- Summary -----
const totalCards = summary.reduce((a, s) => a + s.cardCount, 0);
const verb = FIX ? 'wrote' : 'checked';
console.log(`build-section-indexes: ${verb} ${summary.length} page(s), ${totalCards} card(s) distributed`);
for (const s of summary) {
  console.log(`  - sections/${s.slug}.html  (${s.cardCount} card${s.cardCount === 1 ? '' : 's'}) — ${s.title}`);
}
if (emptySections.length > 0) {
  console.log(`  empty sections: ${emptySections.join(', ')}`);
} else {
  console.log('  no empty sections.');
}
console.log(`  index.html: Sections row ${FIX ? 'appended/refreshed' : 'compared'} above the existing <footer>.`);

if (driftedFiles.length > 0) {
  console.error(
    `\nbuild-section-indexes: ${driftedFiles.length} file(s) drifted from desired bytes:`
  );
  for (const f of driftedFiles) console.error(`  - ${f}`);
  console.error('Re-run with --fix to apply.');
  process.exit(1);
}

process.exit(0);
