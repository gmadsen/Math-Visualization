#!/usr/bin/env node
// Injector: a single canonical cross-page nav row on every secondary meta page.
//
// The meta pages (pathway, tours, history, whos-who, open-problems, tags,
// mindmap, search) each hand-rolled their own `<span class="nav-links">` link
// row after the "← Notebook" backlink. They drifted: the row on most pages
// listed only 6 destinations and OMITTED whos-who + open-problems, and those
// two pages had no row at all — so once a reader reached who's-who there was no
// lateral path to the other meta pages. This centralizes the row: one ordered
// list, injected idempotently, with the current page's link marked `accent`.
//
//   - Audit mode (no flag): verifies every meta page carries the exact
//     canonical row (current page accented). Exits 1 on any drift — a CI guard.
//   - --fix: replaces the existing nav-links span (or inserts one after the
//     "← Notebook" anchor). Writes the meta-page HTML directly; these are
//     hand-authored pages, NOT topic pages, so they are not part of the
//     content/<topic>.json round-trip and won't be overwritten by it.
//
// index.html is intentionally excluded — it is the "Notebook" home the backlink
// points to and carries its own richer footer/nav.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const FIX = process.argv.includes('--fix');

// Canonical order + labels. Each page that carries the row is also a link in it.
const NAV = [
  ['pathway.html', 'Pathway'],
  ['tours.html', 'Tours'],
  ['history.html', 'History'],
  ['whos-who.html', "Who's who"],
  ['open-problems.html', 'Open problems'],
  ['tags.html', 'Themes'],
  ['mindmap.html', 'Mindmap'],
  ['search.html', 'Search'],
];
const PAGES = NAV.map((n) => n[0]);

function rowFor(currentPage) {
  const links = NAV.map(([href, label]) => {
    const cls = href === currentPage ? 'nav-link accent' : 'nav-link';
    return `<a class="${cls}" href="./${href}">${label}</a>`;
  }).join('');
  return `<span class="nav-links">${links}</span>`;
}

// The "← Notebook" backlink anchor, used as the insertion point. Tolerates
// whitespace/newlines around the label (some pages wrap it across lines).
const BACKLINK_RE = /(<a\b[^>]*href="\.\/index\.html"[^>]*>\s*←\s*Notebook\s*<\/a>)/;
// An existing nav-links span (possibly right after the backlink, possibly with
// whitespace between). Non-greedy to the first </span> — the inner <a>s carry
// no </span>, so this captures exactly the row.
const EXISTING_ROW_RE = /\s*<span class="nav-links">[\s\S]*?<\/span>/;

const issues = [];
let changed = 0;

for (const page of PAGES) {
  const file = join(repoRoot, page);
  if (!existsSync(file)) { issues.push(`${page}: file missing`); continue; }
  const html = readFileSync(file, 'utf8');
  const want = rowFor(page);

  if (FIX) {
    const m = html.match(BACKLINK_RE);
    if (!m) { issues.push(`${page}: no "← Notebook" backlink to anchor the nav row`); continue; }
    // Strip any existing row immediately following the backlink, then re-insert.
    const afterIdx = m.index + m[0].length;
    const head = html.slice(0, afterIdx);
    let tail = html.slice(afterIdx);
    tail = tail.replace(EXISTING_ROW_RE, ''); // drop the old row if present (leading ws included)
    const next = `${head}${want}${tail}`;
    if (next !== html) { writeFileSync(file, next); changed++; }
  } else {
    // Audit: the canonical row must be present verbatim, with this page accented.
    if (!html.includes(want)) {
      issues.push(`${page}: nav row missing or stale (expected this page accented + all ${NAV.length} links)`);
    }
  }
}

if (FIX) {
  console.log(`inject-meta-nav: ${changed}/${PAGES.length} meta page(s) updated`);
  if (issues.length) { for (const i of issues) console.error(`  [!] ${i}`); process.exit(1); }
} else if (issues.length) {
  console.error(`inject-meta-nav: ${issues.length} issue(s)`);
  for (const i of issues) console.error(`  [!] ${i}`);
  console.error('  Fix: node scripts/inject-meta-nav.mjs --fix');
  process.exit(1);
} else {
  console.log(`inject-meta-nav: ok (${PAGES.length} meta pages share the canonical nav row)`);
}
