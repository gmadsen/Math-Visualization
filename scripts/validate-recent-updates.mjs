#!/usr/bin/env node
// Validator: the COMMITTED recent-updates.{js,json} must be loadable.
//
// Motivation (PR #518 near-miss): a git stash/rebase collision left
// `<<<<<<< Updated upstream` conflict markers committed in recent-updates.js,
// and CI passed anyway. index.html and updates.html load recent-updates.js as
// a plain <script>, and GitHub Pages serves the COMMITTED bytes — so a syntax
// error there is a hard failure on the deployed landing page. CI missed it
// because build-recent-updates.mjs unconditionally regenerates both files,
// overwriting the broken committed bytes with fresh-correct ones before any
// later step could read them.
//
// This gate therefore runs in the rebuild chain BEFORE build-recent-updates,
// so it validates the committed artifact (== the deployed bytes in a clean CI
// checkout) rather than the builder's fresh output. Read the on-disk file as
// it stands; do not regenerate first.
//
// Checks:
//   1. Neither file contains git conflict markers.
//   2. recent-updates.js parses as JS (node --check) and assigns
//      window.MV_RECENT_UPDATES to an object with an `entries` array.
//   3. recent-updates.json is valid JSON with an `entries` array.
//   4. The two agree on entry count (the .json is the .js's mirror).
//
// Exit 0 clean, 1 on any failure. Bespoke raw-byte reader by design — these
// are generated browser artifacts the content model never sees.

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const jsPath = join(repoRoot, 'recent-updates.js');
const jsonPath = join(repoRoot, 'recent-updates.json');
const issues = [];

// Conflict markers at line start — the exact shape git writes.
const CONFLICT = /^(<{7}|={7}|>{7}|\|{7})/m;

function readOr(path, label) {
  try { return readFileSync(path, 'utf8'); }
  catch (e) { issues.push(`${label}: cannot read (${e.message})`); return null; }
}

const jsSrc = readOr(jsPath, 'recent-updates.js');
const jsonSrc = readOr(jsonPath, 'recent-updates.json');

for (const [src, label] of [[jsSrc, 'recent-updates.js'], [jsonSrc, 'recent-updates.json']]) {
  if (src && CONFLICT.test(src)) issues.push(`${label}: contains an unresolved git conflict marker`);
}

// 2. JS: syntax-check + structural assertion (loaded under a window stub).
let jsEntries = null;
if (jsSrc && !CONFLICT.test(jsSrc)) {
  try {
    execFileSync(process.execPath, ['--check', jsPath], { stdio: 'pipe' });
  } catch (e) {
    issues.push(`recent-updates.js: syntax error — ${String(e.stderr || e).split('\n').find(Boolean)}`);
  }
  try {
    const win = {};
    new Function('window', jsSrc)(win);
    const data = win.MV_RECENT_UPDATES;
    if (!data || typeof data !== 'object') issues.push('recent-updates.js: did not assign window.MV_RECENT_UPDATES to an object');
    else if (!Array.isArray(data.entries)) issues.push('recent-updates.js: window.MV_RECENT_UPDATES.entries is not an array');
    else jsEntries = data.entries.length;
  } catch (e) {
    issues.push(`recent-updates.js: threw while assigning the global — ${e.message}`);
  }
}

// 3. JSON: parse + structural assertion.
let jsonEntries = null;
if (jsonSrc && !CONFLICT.test(jsonSrc)) {
  try {
    const data = JSON.parse(jsonSrc);
    if (!Array.isArray(data.entries)) issues.push('recent-updates.json: `entries` is not an array');
    else jsonEntries = data.entries.length;
  } catch (e) {
    issues.push(`recent-updates.json: invalid JSON — ${e.message}`);
  }
}

// 4. Mirror agreement.
if (jsEntries != null && jsonEntries != null && jsEntries !== jsonEntries) {
  issues.push(`entry-count mismatch: recent-updates.js has ${jsEntries}, recent-updates.json has ${jsonEntries} — regenerate with node scripts/build-recent-updates.mjs`);
}

if (issues.length) {
  console.error(`validate-recent-updates: ${issues.length} issue(s)`);
  for (const i of issues) console.error(`  [!] ${i}`);
  console.error('  Fix: node scripts/build-recent-updates.mjs (regenerate), or resolve the conflict markers.');
  process.exit(1);
}
console.log(`validate-recent-updates: ok (${jsEntries} entries, js+json mirror consistent)`);
