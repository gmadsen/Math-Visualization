#!/usr/bin/env node
// Injector: load js/tour-banner.js on every topic page that is a tour stop.
//
// The tour-guide banner only appears on pages a reader can reach via a tour —
// i.e. the stop pages (parsed from tours.html, same set inject-featured-in-
// tours uses). This adds a deferred `<script src="./js/tour-banner.js">` to
// each such page's <head>. The script no-ops unless the reader actually arrived
// via a tour (URL ?tour= or the sessionStorage handoff), so the cost on a
// normal visit is just the tiny deferred file.
//
//   - Audit mode (no flag): verifies the loader is present on every stop page
//     (and absent elsewhere). Exits 1 on mismatch — the CI guard.
//   - --fix: writes a fenced block into content/<topic>.json's rawHead, just
//     before </head>, so test-roundtrip.mjs --fix propagates to <topic>.html.
//     Idempotent; drops the loader if a page stops being a stop.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadTopicContent, saveTopicContent } from './lib/json-block-writer.mjs';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const FIX = process.argv.includes('--fix');

const BEGIN = '<!-- tour-banner-loader-auto-begin -->';
const END = '<!-- tour-banner-loader-auto-end -->';
const LOADER = `${BEGIN}\n<script defer src="./js/tour-banner.js"></script>\n${END}`;
const FENCE_RE = new RegExp(`\\n*${BEGIN}[\\s\\S]*?${END}\\n*`, 'g');

// Distinct stop pages across all tours (parsed from tours.html).
function stopPages() {
  const src = readFileSync(join(repoRoot, 'tours.html'), 'utf8');
  const re = /<span class="stop-title"><a href="\.\/([a-zA-Z0-9_-]+\.html)/g;
  const pages = new Set();
  let m;
  while ((m = re.exec(src))) pages.add(m[1]);
  return pages;
}

// rawHead with the loader fence inserted once. Anchored ABOVE the display-prefs
// head fence (not before </head>): inject-display-prefs requires its own fence
// to sit immediately before </head> and byte-checks it, so the loader must not
// take that slot. Falls back to before </head> only if that fence is absent.
const DP_HEAD_FENCE = '<!-- display-prefs-head-auto-begin -->';
function withLoader(rawHead) {
  const stripped = rawHead.replace(FENCE_RE, '\n');
  if (stripped.includes(DP_HEAD_FENCE)) {
    return stripped.replace(DP_HEAD_FENCE, `${LOADER}\n${DP_HEAD_FENCE}`);
  }
  if (!/<\/head>/.test(stripped)) return null; // unexpected; skip
  return stripped.replace(/\n?<\/head>/, `\n${LOADER}\n</head>`);
}
function withoutLoader(rawHead) {
  return rawHead.replace(FENCE_RE, '\n');
}

const pages = stopPages();
const topics = JSON.parse(readFileSync(join(repoRoot, 'concepts', 'index.json'), 'utf8')).topics || [];
const issues = [];
let changed = 0;

for (const topic of topics) {
  const isStop = pages.has(`${topic}.html`);
  const contentPath = join(repoRoot, 'content', `${topic}.json`);
  const htmlPath = join(repoRoot, `${topic}.html`);

  if (FIX) {
    if (!existsSync(contentPath)) { if (isStop) issues.push(`content/${topic}.json: missing but a tour stop`); continue; }
    const doc = loadTopicContent(topic, repoRoot);
    if (typeof doc.rawHead !== 'string') { issues.push(`content/${topic}.json: no rawHead`); continue; }
    const before = doc.rawHead;
    const next = isStop ? withLoader(doc.rawHead) : withoutLoader(doc.rawHead);
    if (next === null) { issues.push(`content/${topic}.json: no </head> in rawHead`); continue; }
    if (next !== before) { doc.rawHead = next; saveTopicContent(topic, doc, repoRoot); changed++; }
  } else {
    if (!existsSync(htmlPath)) { if (isStop) issues.push(`${topic}.html: a tour stop but missing`); continue; }
    const html = readFileSync(htmlPath, 'utf8');
    const present = /src="\.\/js\/tour-banner\.js"/.test(html);
    if (isStop && !present) issues.push(`${topic}.html: tour stop without the tour-banner loader (run --fix)`);
    else if (!isStop && present) issues.push(`${topic}.html: has the tour-banner loader but is not a tour stop (run --fix)`);
  }
}

if (FIX) {
  console.log(`inject-tour-banner: ${changed} topic file(s) updated (${pages.size} stop pages)`);
  if (issues.length) { for (const i of issues) console.error(`  [!] ${i}`); process.exit(1); }
} else if (issues.length) {
  console.error(`inject-tour-banner: ${issues.length} issue(s)`);
  for (const i of issues) console.error(`  [!] ${i}`);
  console.error('  Fix: node scripts/inject-tour-banner.mjs --fix && node scripts/rebuild.mjs');
  process.exit(1);
} else {
  console.log(`inject-tour-banner: ok (${pages.size} stop pages carry the loader)`);
}
