#!/usr/bin/env node
// Substitute exact-match hex literals with var(--…) in SVG attribute contexts.
//
// Complements scripts/audit-color-vars.mjs by handling the cleanest slice of
// its 1462-hit report: hex values that (a) appear inside a safe SVG paint
// attribute (fill / stroke / stop-color) and (b) match a palette slot exactly
// (RGB distance 0). Near-misses and <style>-block hex are explicitly out of
// scope — those need human judgement.
//
// Skip zones (mirrors audit-color-vars.mjs where applicable):
//   - <!-- ... --> comments
//   - <style> ... </style> blocks           (v1 scope: don't touch)
//   - :root { ... } palette definition      (redundant w/ <style> but defensive)
//   - <details class="changelog"> ... </details>
//
// Idempotent by construction: the regex scans for hex tokens, and after
// substitution fill="#ffd866" becomes fill="var(--yellow)" — no hex left to
// match. Running a second --fix finds 0 substitutions.
//
// CLI:
//   node scripts/fix-color-vars.mjs          # audit-mode: print per-file counts, exit 0
//   node scripts/fix-color-vars.mjs --fix    # apply substitutions in place, exit 0

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const args = process.argv.slice(2);
const FIX = args.includes('--fix');

// Canonical palette. Values copied from category-theory.html :root block.
// Must match audit-color-vars.mjs — if either drifts, they both need updating.
const PALETTE = {
  '--bg':     '#0f1218',
  '--panel':  '#161b24',
  '--panel2': '#1c2230',
  '--ink':    '#e8ecf1',
  '--mute':   '#9aa4b2',
  '--line':   '#2a3242',
  '--yellow': '#ffd866',
  '--blue':   '#58c4dd',
  '--green':  '#83c167',
  '--pink':   '#e07a5f',
  '--violet': '#b39ddb',
  '--cyan':   '#7de0d6',
};

// Normalize to lowercase 6-digit form so #FFD866 and #fd866 both hit the same
// slot. #ffd866 stays #ffd866; #abc expands to #aabbcc.
function normHex(hex) {
  let h = hex.replace(/^#/, '').toLowerCase();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return null;
  if (!/^[0-9a-f]{6}$/.test(h)) return null;
  return '#' + h;
}

// hex → var-name map for O(1) exact-match lookup.
const HEX_TO_VAR = new Map();
for (const [name, hex] of Object.entries(PALETTE)) {
  const n = normHex(hex);
  if (n) HEX_TO_VAR.set(n, name);
}

// ---- skip-zone masking (same idea as audit) ----

// Replace each char in a skipped region with a space so subsequent regex
// offsets still align with the original string. Newlines preserved so line
// numbering downstream would stay correct (not that we print lines here).
function maskSkipZones(html) {
  const chars = html.split('');

  function mask(start, end) {
    for (let i = start; i < end && i < chars.length; i++) {
      if (chars[i] !== '\n') chars[i] = ' ';
    }
  }

  const patterns = [
    /<!--[\s\S]*?-->/g,                                          // HTML comments
    /<style\b[^>]*>[\s\S]*?<\/style>/gi,                         // <style> blocks
    /:root\s*\{[\s\S]*?\}/g,                                     // :root palette (defensive)
    /<details\s+class=["']changelog["'][\s\S]*?<\/details>/gi,   // changelog footer
  ];

  for (const re of patterns) {
    let m;
    while ((m = re.exec(html))) mask(m.index, m.index + m[0].length);
  }

  return chars.join('');
}

// Scan the masked text for attribute-hosted hex tokens we can safely rewrite,
// returning { start, end, original, replacement } in source-order.
//
// end is exclusive, measured against the ORIGINAL html (mask preserves offsets).
function findSubstitutions(masked) {
  const out = [];
  // Match fill / stroke / stop-color with either "…" or '…' quoting, where
  // the value is JUST a hex token (optional whitespace). This avoids touching
  // compound style="fill:#abc;stroke:#def" strings (those live inside style=,
  // not on their own attribute, and frequently mix hex + var + color names
  // in ways this v1 shouldn't disturb).
  const attrRe = /\b(fill|stroke|stop-color)\s*=\s*(["'])\s*(#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6})\s*\2/g;
  let m;
  while ((m = attrRe.exec(masked))) {
    const full = m[0];
    const attr = m[1].toLowerCase();
    const quote = m[2];
    const hexToken = m[3];
    const norm = normHex(hexToken);
    if (!norm) continue;
    const varName = HEX_TO_VAR.get(norm);
    if (!varName) continue; // not an exact palette match — skip
    const replacement = `${attr}=${quote}var(${varName})${quote}`;
    out.push({
      start: m.index,
      end: m.index + full.length,
      original: full,
      replacement,
      hex: norm,
      varName,
    });
  }
  return out;
}

// Apply substitutions to the original html. Walking right-to-left keeps
// offsets stable without needing to re-index after each splice.
function applySubstitutions(html, subs) {
  let out = html;
  for (let i = subs.length - 1; i >= 0; i--) {
    const s = subs[i];
    out = out.slice(0, s.start) + s.replacement + out.slice(s.end);
  }
  return out;
}

// ---- main ----

// Scope: every top-level .html in the repo root. The audit already covers
// exactly this set; matching it keeps the pre/post totals directly comparable.
const htmlFiles = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html'))
  .sort();

const perFile = [];       // [{ file, count, byVar: Map }]
let grandTotal = 0;
const varTotals = new Map();

for (const file of htmlFiles) {
  const abs = join(repoRoot, file);
  let html;
  try { html = readFileSync(abs, 'utf8'); } catch { continue; }

  const masked = maskSkipZones(html);
  const subs = findSubstitutions(masked);

  const byVar = new Map();
  for (const s of subs) {
    byVar.set(s.varName, (byVar.get(s.varName) || 0) + 1);
    varTotals.set(s.varName, (varTotals.get(s.varName) || 0) + 1);
  }

  perFile.push({ file, count: subs.length, byVar, subs, html, abs });
  grandTotal += subs.length;

  if (FIX && subs.length > 0) {
    const patched = applySubstitutions(html, subs);
    writeFileSync(abs, patched, 'utf8');
  }
}

// ---- report ----

const mode = FIX ? 'FIX' : 'AUDIT';
console.log(`fix-color-vars [${mode}]: scanned ${htmlFiles.length} HTML file(s)`);
console.log(`  substitutions ${FIX ? 'applied' : 'available'}: ${grandTotal}`);
console.log('');

const active = perFile.filter((p) => p.count > 0).sort((a, b) => b.count - a.count);

if (active.length === 0) {
  console.log('No exact-match SVG-attribute hex literals found. Palette clean (for this slice).');
  process.exit(0);
}

console.log('By file:');
for (const p of active) {
  const parts = [...p.byVar.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([v, n]) => `${v}×${n}`)
    .join(' ');
  console.log(`  ${p.file.padEnd(40)} ${String(p.count).padStart(4)}  (${parts})`);
}
console.log('');

console.log('By palette slot:');
const sortedVars = [...varTotals.entries()].sort((a, b) => b[1] - a[1]);
for (const [v, n] of sortedVars) {
  console.log(`  ${v.padEnd(10)} ${n}`);
}
console.log('');

if (!FIX) {
  console.log('Re-run with --fix to apply these substitutions in place.');
}
process.exit(0);
