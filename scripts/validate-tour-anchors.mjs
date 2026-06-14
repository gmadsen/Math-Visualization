#!/usr/bin/env node
// Validator: every internal link in tours.html must resolve.
//
// Motivation: tours.html is a hand-authored sequence of deep links into topic
// pages — `<a href="./topic.html#anchor">`. Topic pages are regenerated from
// content/<topic>.json, so a section `id` can be renamed or dropped out from
// under a tour stop. The link still *works* (it just lands at the top of the
// page instead of the intended section), so the rot is silent — the PLAN bullet
// cited `L-functions#elliptic` as one that had drifted. Nothing else checks
// these, because the content model never reads tours.html.
//
// This gate parses tours.html, extracts every internal `./<page>.html[#anchor]`
// link (tour-stop links, bridge-prose cross-references, and footnotes alike),
// and verifies:
//   1. <page>.html exists on disk.
//   2. when an #anchor is present, some id="<anchor>" exists in that page.
//
// Exit 0 clean, 1 on any unresolved link. Bespoke raw-byte reader by design:
// tours.html is a meta page the content model does not expose, and meta pages
// (index.html, pathway.html, …) are valid link targets too.
//
// The core is exported as a pure function (findUnresolvedLinks) so the unit
// test (scripts/test-validate-tour-anchors.mjs) can exercise it without the
// filesystem.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// All internal links of the form ./<page>.html or ./<page>.html#<anchor>.
// Anchored to a leading `./` so external/CDN links never match.
const LINK_RE = /href="\.\/([a-zA-Z0-9_-]+\.html)(?:#([a-zA-Z0-9_:.-]+))?"/g;

// Collect every id="..." on a page.
export function extractIds(html) {
  const ids = new Set();
  const re = /\sid="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) ids.add(m[1]);
  return ids;
}

// Pure core. `idsFor(page)` returns a Set<id> for an existing page, or null if
// the page does not exist. Returns { issues, checked }.
export function findUnresolvedLinks(toursSrc, idsFor) {
  const issues = [];
  const seen = new Set();
  let checked = 0;
  let m;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(toursSrc))) {
    const [, page, anchor] = m;
    const key = `${page}#${anchor || ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    checked++;
    const ids = idsFor(page);
    if (ids === null) {
      issues.push(`${page} — linked from tours.html but the file does not exist`);
      continue;
    }
    if (anchor && !ids.has(anchor)) {
      issues.push(`${page}#${anchor} — no matching id="${anchor}" on the page (the tour stop lands at the top instead)`);
    }
  }
  return { issues, checked };
}

// Run from the CLI (not when imported by the test).
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
  let toursSrc;
  try {
    toursSrc = readFileSync(join(repoRoot, 'tours.html'), 'utf8');
  } catch (e) {
    console.error(`validate-tour-anchors: cannot read tours.html (${e.message})`);
    process.exit(1);
  }
  // Cache id-sets per page so a page linked N times is read + scanned once.
  const idCache = new Map();
  const idsFor = (page) => {
    if (idCache.has(page)) return idCache.get(page);
    const file = join(repoRoot, page);
    const ids = existsSync(file) ? extractIds(readFileSync(file, 'utf8')) : null;
    idCache.set(page, ids);
    return ids;
  };
  const { issues, checked } = findUnresolvedLinks(toursSrc, idsFor);
  if (issues.length) {
    console.error(`validate-tour-anchors: ${issues.length} unresolved link(s) of ${checked} checked`);
    for (const i of issues) console.error(`  [!] ${i}`);
    console.error('  Fix: update the href in tours.html to a current section id, or restore the id on the target page.');
    process.exit(1);
  }
  console.log(`validate-tour-anchors: ok (${checked} distinct internal links resolve)`);
}
