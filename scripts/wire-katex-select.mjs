#!/usr/bin/env node
// wire-katex-select.mjs — ensure every topic page that has <option>…$tex$…</option>
// loads js/katex-select.js in its <head>.
//
// Native <select> popups can't render HTML, so raw KaTeX source leaks into the
// dropdown. js/katex-select.js replaces such selects with a KaTeX-aware custom
// dropdown. This script wires it in idempotently — running twice is a no-op.
//
// Anchor: the script tag is inserted on the line AFTER <script src="./js/quiz.js"></script>
// which every topic page already loads.
//
// Usage:
//   node scripts/wire-katex-select.mjs           # audit (exit 1 if any page needs wiring)
//   node scripts/wire-katex-select.mjs --fix     # write changes in place

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FIX = process.argv.includes('--fix');

// Pages that don't need enhancement even if they contain "$…$" elsewhere.
// (Only pages with <option>…$…$…</option> need this.)
const OPTION_TEX_RE = /<option\b[^>]*>[\s\S]*?\$[^$]+\$[\s\S]*?<\/option>/;

// Anchor: the quiz.js loader line, which every topic page already has.
const ANCHOR = '<script src="./js/quiz.js"></script>';
const INJECT = '<script src="./js/katex-select.js"></script>';

function listHtmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) continue;               // top-level pages only
    if (entry.endsWith('.html')) out.push(full);
  }
  return out.sort();
}

const results = { scanned: 0, needsWiring: [], wired: [], skippedNoAnchor: [], alreadyWired: [] };

for (const file of listHtmlFiles(ROOT)) {
  results.scanned++;
  const src = readFileSync(file, 'utf8');
  if (!OPTION_TEX_RE.test(src)) continue;        // no LaTeX options, skip

  const rel = file.slice(ROOT.length + 1);
  if (src.includes(INJECT)) {
    results.alreadyWired.push(rel);
    continue;
  }
  if (!src.includes(ANCHOR)) {
    results.skippedNoAnchor.push(rel);
    continue;
  }
  results.needsWiring.push(rel);

  if (FIX) {
    const patched = src.replace(ANCHOR, `${ANCHOR}\n${INJECT}`);
    writeFileSync(file, patched);
    results.wired.push(rel);
  }
}

const color = (s, c) => (process.stdout.isTTY ? `\x1b[${c}m${s}\x1b[0m` : s);

console.log(`Scanned ${results.scanned} top-level HTML files.`);
console.log(`  Already wired:   ${results.alreadyWired.length}`);
console.log(`  Needs wiring:    ${results.needsWiring.length}`);
console.log(`  Missing anchor:  ${results.skippedNoAnchor.length}`);

if (results.skippedNoAnchor.length) {
  console.log(color('\nPages missing the quiz.js anchor (cannot auto-wire):', 33));
  for (const f of results.skippedNoAnchor) console.log('  · ' + f);
}

if (FIX) {
  if (results.wired.length) {
    console.log(color(`\nWired ${results.wired.length} page(s):`, 32));
    for (const f of results.wired) console.log('  + ' + f);
  } else {
    console.log(color('\nNothing to wire — all set.', 32));
  }
  process.exit(results.skippedNoAnchor.length ? 1 : 0);
} else {
  if (results.needsWiring.length) {
    console.log(color(`\n${results.needsWiring.length} page(s) need wiring. Re-run with --fix:`, 31));
    for (const f of results.needsWiring) console.log('  - ' + f);
    process.exit(1);
  }
  if (results.skippedNoAnchor.length) process.exit(1);
  console.log(color('\nAll pages with LaTeX options are already wired.', 32));
  process.exit(0);
}
