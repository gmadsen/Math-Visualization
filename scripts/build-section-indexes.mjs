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

// ----- 1-sentence description per section (keyed by display title) -----
const SECTION_BLURBS = {
  'Foundations':
    'Sets, functions, quotients, countability — the common background for everything else.',
  'Algebra':
    'Groups, rings, fields, categories, and the homological machinery that connects them.',
  'Analysis':
    'Limits, convergence, measure, Banach/Hilbert spaces, and operator-algebraic traces.',
  'Geometry & topology':
    'From metric spaces and the fundamental group to Riemannian curvature and Lie groups.',
  'Number theory':
    'Reciprocity laws, p-adic completions, local/global duality, and the road to class field theory.',
  'Modular forms & L-functions':
    'Automorphic forms on the upper half-plane, Hecke algebras, L-function continuation, Galois representations, and the automorphic–arithmetic dictionary.',
  'Algebraic geometry':
    'Projective varieties, schemes, sheaves, moduli spaces, and the arithmetic capstones that tie it all together.',
};

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
function rewriteHead(headInner) {
  return headInner
    .replace(/href="\.\/(?!\/)/g, 'href="../')
    .replace(/src="\.\/(?!\/)/g, 'src="../');
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
  writeFileSync(outPath, out);

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
  writeFileSync(indexPath, newIndex);
}

// ----- Summary -----
const totalCards = summary.reduce((a, s) => a + s.cardCount, 0);
console.log(`build-section-indexes: wrote ${summary.length} page(s), ${totalCards} card(s) distributed`);
for (const s of summary) {
  console.log(`  - sections/${s.slug}.html  (${s.cardCount} card${s.cardCount === 1 ? '' : 's'}) — ${s.title}`);
}
if (emptySections.length > 0) {
  console.log(`  empty sections: ${emptySections.join(', ')}`);
} else {
  console.log('  no empty sections.');
}
console.log('  index.html: Sections row appended/refreshed above the existing <footer>.');

process.exit(0);
