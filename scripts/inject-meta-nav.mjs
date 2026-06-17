#!/usr/bin/env node
// Injector: one canonical cross-page nav row on every secondary meta page.
//
// The meta pages (pathway, tours, history, whos-who, open-problems, tags,
// mindmap, search) each hand-rolled their nav row after the "← Notebook"
// backlink, in THREE incompatible shapes: a `<span class="nav-links">` (pathway,
// mindmap, …), bare loose `<a href="./x.html">` siblings (whos-who, open-
// problems, tags), and some mixed both. They had drifted — most omitted
// whos-who + open-problems, and those two pages had no lateral nav at all. A
// container-anchored injector (#528) couldn't handle the variants. This one
// anchors on the backlink and does a maximal-munch strip of WHATEVER old nav
// follows it — whitespace, a nav-links span, and loose `./<page>.html` links —
// stopping at the first element that is neither (the `<span class="mv-theme-
// slot">` theme toggle, an in-page `#anchor` link, or page content), all of
// which are preserved. Then it inserts the canonical row. So it normalizes the
// markup AND keeps it in sync in a single pass, regardless of container.
//
//   - Audit mode (no flag): exits 1 if any page's nav differs from canonical
//     (missing, stale, duplicated, or wrong accent) — a CI guard.
//   - --fix: rewrites the row. Writes meta-page HTML directly (these are NOT
//     topic pages, so they're outside the content/<topic>.json round-trip).
//
// index.html is intentionally excluded — it's the "Notebook" home the backlink
// points to and carries its own richer nav/footer.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const FIX = process.argv.includes('--fix');

// Canonical order + labels. Each page that carries the row is also a link in it.
// Scope = the 9 "explore" meta surfaces. Utility pages some rows used to list
// (latex-cheatsheet, progress, review) are deliberately NOT here: they're
// personal-state/reference pages that live on index.html's own nav (one click
// via the "← Notebook" backlink), and adding them would push every page's bar
// past 10 links. Consolidating to these 9 is the consistency goal.
const NAV = [
  ['pathway.html', 'Pathway'],
  ['tours.html', 'Tours'],
  ['history.html', 'History'],
  ['whos-who.html', "Who's who"],
  ['open-problems.html', 'Open problems'],
  ['counterexamples.html', 'Counterexamples'],
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

// The "← Notebook" backlink anchor — attribute-order-agnostic (some pages put
// class before href), no `g` flag so .match returns the first (in-nav) one.
const BACKLINK_RE = /(<a\b[^>]*href="\.\/index\.html"[^>]*>\s*←\s*Notebook\s*<\/a>)/;

// Maximal munch of the OLD nav immediately after the backlink: runs of
// whitespace, any `<span class="nav-links">…</span>`, and loose `./page.html`
// anchors. Stops at the theme-slot span (class !== nav-links), `#anchor` links
// (href doesn't start with ./), or content — none of which match here.
const OLD_NAV_RE = /^(?:\s+|<span class="nav-links">[\s\S]*?<\/span>|<a\b[^>]*\shref="\.\/[a-zA-Z0-9_-]+\.html"[^>]*>[\s\S]*?<\/a>)+/;

// The byte-exact desired state for a page, or null if it has no backlink.
function desired(html, page) {
  const m = html.match(BACKLINK_RE);
  if (!m) return null;
  const at = m.index + m[0].length;
  const tail = html.slice(at);
  const old = (tail.match(OLD_NAV_RE) || [''])[0];
  return html.slice(0, at) + rowFor(page) + tail.slice(old.length);
}

const issues = [];
let changed = 0;

for (const page of PAGES) {
  const file = join(repoRoot, page);
  if (!existsSync(file)) { issues.push(`${page}: file missing`); continue; }
  const html = readFileSync(file, 'utf8');
  const want = desired(html, page);
  if (want === null) { issues.push(`${page}: no "← Notebook" backlink to anchor the nav row`); continue; }

  if (FIX) {
    if (want !== html) { writeFileSync(file, want); changed++; }
  } else if (want !== html) {
    // Drift: the rendered nav doesn't match canonical (missing/stale/duplicate/
    // wrong-accent). The byte-exact compare catches all of them at once.
    issues.push(`${page}: nav row differs from canonical (run --fix)`);
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
