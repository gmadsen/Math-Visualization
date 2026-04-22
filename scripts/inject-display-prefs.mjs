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

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');

const argv = process.argv.slice(2);
const FIX = argv.includes('--fix');
const VERBOSE = argv.includes('--verbose') || argv.includes('-v');

const SKIP_PAGES = new Set(['index.html', 'pathway.html', 'progress.html']);

const CSS_BEGIN  = '/* display-prefs-css-auto-begin */';
const CSS_END    = '/* display-prefs-css-auto-end */';
const HEAD_BEGIN = '<!-- display-prefs-head-auto-begin -->';
const HEAD_END   = '<!-- display-prefs-head-auto-end -->';

// ----------------------------------------------------------------------------
// Block builders.
// ----------------------------------------------------------------------------

function buildCssBlock() {
  return (
    CSS_BEGIN + '\n' +
    '  html[data-hide-widgets] .widget { display: none !important; }\n' +
    '  html[data-hide-quizzes] .quiz { display: none !important; }\n' +
    '  ' + CSS_END
  );
}

function buildHeadBlock() {
  return (
    HEAD_BEGIN + '\n' +
    '<script src="./js/display-prefs.js"></script>\n' +
    HEAD_END
  );
}

// ----------------------------------------------------------------------------
// Fence strippers. Each consumes up to one trailing newline so the re-insert
// with a matching trailing newline is byte-stable.
// ----------------------------------------------------------------------------

function stripFences(html) {
  let out = html;
  let removed = 0;
  const patterns = [
    // CSS fence. Leading whitespace on the same line (if any) is consumed so
    // indentation stays clean when we re-insert at the same position.
    /[ \t]*\/\*\s*display-prefs-css-auto-begin\s*\*\/[\s\S]*?\/\*\s*display-prefs-css-auto-end\s*\*\/\n?/g,
    // Head fence.
    /[ \t]*<!--\s*display-prefs-head-auto-begin\s*-->[\s\S]*?<!--\s*display-prefs-head-auto-end\s*-->\n?/g,
  ];
  for (const re of patterns) {
    out = out.replace(re, () => {
      removed++;
      return '';
    });
  }
  return { html: out, removed };
}

// ----------------------------------------------------------------------------
// Insertion helpers.
// ----------------------------------------------------------------------------

// Insert the CSS block immediately before the first </style> we find. The
// block is placed on its own line with the same indent the closing tag uses.
function insertCssBlock(html) {
  const styleCloseRe = /<\/style>/i;
  const m = styleCloseRe.exec(html);
  if (!m) return null;
  const insertAt = m.index;
  // Walk back over the leading whitespace on the </style> line to find the
  // indentation used by the stylesheet and decide whether to inject a newline
  // before our block.
  let lineStart = insertAt;
  while (lineStart > 0 && (html[lineStart - 1] === ' ' || html[lineStart - 1] === '\t')) {
    lineStart--;
  }
  const indent = html.slice(lineStart, insertAt); // whitespace before </style>
  const needsLeadingNewline = lineStart > 0 && html[lineStart - 1] !== '\n';
  const pre = needsLeadingNewline ? '\n' : '';
  const block = buildCssBlock();
  // Preserve the existing indent on the closing </style> line by re-inserting
  // `indent` after our block.
  return html.slice(0, lineStart) + pre + '  ' + block + '\n' + indent + html.slice(insertAt);
}

// Insert the head script block immediately before </head>. Indentation flush
// to column 0 matches the surrounding <script src="..."> lines.
function insertHeadBlock(html) {
  const headCloseRe = /<\/head>/i;
  const m = headCloseRe.exec(html);
  if (!m) return null;
  const insertAt = m.index;
  let lineStart = insertAt;
  while (lineStart > 0 && (html[lineStart - 1] === ' ' || html[lineStart - 1] === '\t')) {
    lineStart--;
  }
  const needsLeadingNewline = lineStart > 0 && html[lineStart - 1] !== '\n';
  const pre = needsLeadingNewline ? '\n' : '';
  const block = buildHeadBlock();
  return html.slice(0, lineStart) + pre + block + '\n' + html.slice(lineStart);
}

// Return the desired end state for html (after fix), or null if the file does
// not contain the required anchors (<style>...</style> and <head>...</head>).
function computeDesired(origHtml) {
  const { html: stripped } = stripFences(origHtml);
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
      writeFileSync(page.path, desired);
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
