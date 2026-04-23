#!/usr/bin/env node
// Idempotently inject the display-prefs runtime (js/display-prefs.js) and its
// supporting CSS rules into every topic HTML at the repo root.
//
// Two fenced blocks per page:
//
//   1. Inside <style>...</style>, just before the closing </style>:
//        /* display-prefs-css-auto-begin */
//        html[data-hide-widgets] .widget { display: none !important; }
//        html[data-hide-quizzes] .quiz { display: none !important; }
//        /* display-prefs-css-auto-end */
//
//   2. Inside <head>...</head>, just before </head>:
//        <!-- display-prefs-head-auto-begin -->
//        <script src="./js/display-prefs.js"></script>
//        <!-- display-prefs-head-auto-end -->
//
// Both blocks are rebuilt from scratch on each --fix run after stripping any
// prior fence so repeated runs produce byte-identical output (idempotent).
//
// Modes:
//   default      Audit only. Prints the list of pages missing either fence.
//                Exits 1 when anything is out of sync; 0 when clean.
//   --fix        Strip and re-insert both fences on every topic HTML. Writes.
//   --verbose    With --fix, print a one-line summary per touched page.
//
// Skips index.html, pathway.html, progress.html (same SPECIAL set as other
// inject scripts). Driven by concepts/index.json — slugs whose .html is
// missing are silently skipped.
//
// Zero external dependencies.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  makeFence,
  stripFence,
  insertBeforeAnchor,
  insertBeforeAnchorKeepingIndent,
  writeIfChanged,
} from './lib/html-injector.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');

const argv = process.argv.slice(2);
const FIX = argv.includes('--fix');
const VERBOSE = argv.includes('--verbose') || argv.includes('-v');

const SKIP_PAGES = new Set(['index.html', 'pathway.html', 'progress.html']);

// ----------------------------------------------------------------------------
// Block builders.
// ----------------------------------------------------------------------------

function buildCssBlock() {
  const { begin, end } = makeFence('display-prefs-css', 'css');
  return (
    begin + '\n' +
    '  html[data-hide-widgets] .widget { display: none !important; }\n' +
    '  html[data-hide-quizzes] .quiz { display: none !important; }\n' +
    '  .mv-display-toggles { display: inline-flex; gap: .25rem; }\n' +
    '  .mv-display-toggle { background: transparent; border: 1px solid var(--line, #333); border-radius: 4px; padding: 2px 6px; cursor: pointer; font-size: 1rem; line-height: 1; color: inherit; }\n' +
    '  .mv-display-toggle:hover { background: var(--panel, rgba(255,255,255,0.05)); }\n' +
    '  .mv-display-toggle--off { opacity: 0.4; }\n' +
    '  ' + end
  );
}

function buildHeadBlock() {
  const { begin, end } = makeFence('display-prefs-head');
  return (
    begin + '\n' +
    '<script src="./js/display-prefs.js"></script>\n' +
    end
  );
}

// ----------------------------------------------------------------------------
// Insertion helpers.
// ----------------------------------------------------------------------------

// Insert the CSS block immediately before the first </style> we find. The
// block is placed on its own line with the same indent the closing tag uses.
function insertCssBlock(html) {
  return insertBeforeAnchorKeepingIndent(html, /<\/style>/i, buildCssBlock(), '  ');
}

// Insert the head script block immediately before </head>. Indentation flush
// to column 0 matches the surrounding <script src="..."> lines.
function insertHeadBlock(html) {
  return insertBeforeAnchor(html, /<\/head>/i, buildHeadBlock());
}

// Return the desired end state for html (after fix), or null if the file does
// not contain the required anchors (<style>...</style> and <head>...</head>).
function computeDesired(origHtml) {
  // Strip any existing fenced block; each strip consumes leading indent and a
  // trailing newline so re-insertion is byte-stable.
  const { html: stripped1 } = stripFence(origHtml, 'display-prefs-css', {
    style: 'css',
    trim: { leadingIndent: true, trailingNewline: true },
  });
  const { html: stripped } = stripFence(stripped1, 'display-prefs-head', {
    trim: { leadingIndent: true, trailingNewline: true },
  });
  let next = insertCssBlock(stripped);
  if (next === null) return null;
  next = insertHeadBlock(next);
  if (next === null) return null;
  return next;
}

// ----------------------------------------------------------------------------
// Enumerate topic pages.
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
// Audit / fix loop.
// ----------------------------------------------------------------------------

const outOfSync = [];
const failed = [];
let touched = 0;

for (const page of pageList) {
  const orig = readFileSync(page.path, 'utf8');
  const desired = computeDesired(orig);
  if (desired === null) {
    failed.push(`${page.file}: cannot inject (missing <style>…</style> or </head>)`);
    continue;
  }
  if (desired !== orig) {
    if (FIX) {
      writeIfChanged(page.path, orig, desired);
      touched++;
      if (VERBOSE) console.log(`  ${page.file}`);
    } else {
      outOfSync.push(page.file);
    }
  }
}

// ----------------------------------------------------------------------------
// Report.
// ----------------------------------------------------------------------------

console.log(`inject-display-prefs: ${pageList.length} topic page(s)`);

if (FIX) {
  console.log(`  pages rewritten: ${touched}`);
  if (failed.length > 0) {
    console.log('');
    console.log('WARNINGS:');
    for (const line of failed) console.log(`  - ${line}`);
  }
  console.log('');
  console.log('OK: display-prefs injection complete.');
  process.exit(0);
}

// Audit mode.
if (outOfSync.length === 0 && failed.length === 0) {
  console.log('OK: every topic page carries an up-to-date display-prefs injection.');
  process.exit(0);
}
if (outOfSync.length > 0) {
  console.log('');
  console.log(`OUT OF SYNC (${outOfSync.length} page(s)):`);
  for (const line of outOfSync) console.log(`  - ${line}`);
}
if (failed.length > 0) {
  console.log('');
  console.log(`UNINJECTABLE (${failed.length} page(s)):`);
  for (const line of failed) console.log(`  - ${line}`);
}
console.log('');
console.log('Re-run with --fix to apply.');
process.exit(1);
