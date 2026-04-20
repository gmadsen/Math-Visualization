#!/usr/bin/env node
// Audit hex color literals in widget markup.
//
// House rule (AGENTS.md "Color tokens, never hex"): widget markup must reach for
// var(--yellow), var(--blue), var(--cyan), etc., not raw #rrggbb. Inlined hex
// breaks theme swaps and the color-mix border rules on .callback / .related /
// .changelog.
//
// This script scans every topic HTML file (plus index.html and pathway.html)
// for hex literals inside style-bearing contexts — style="...", fill="...",
// stroke="...", stop-color="...", and the contents of <style> blocks — and
// reports each with the nearest palette variable (RGB-distance).
//
// Skip zones:
//   - inside <!-- ... --> comments (historical notes)
//   - inside the :root{...} palette definition itself (hex is allowed there)
//   - inside <details class="changelog"> ... </details> (historical)
//   - inside <script> blocks (too much JS-literal noise; palette substitution
//     is rarely safe inside hand-written SVG strings). Errs on the
//     report-less side to keep signal high; widgets that build SVG via
//     document.createElementNS should use var(--…) in attrs, and those do
//     show up inside the inline style/fill attributes we do scan.
//
// CLI:
//   node scripts/audit-color-vars.mjs          # audit mode, always exits 0
//   node scripts/audit-color-vars.mjs --fix    # stub: not implemented, exits 2
//
// Zero dependencies — regex + string walks, mirrors smoke-test.mjs style.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const args = process.argv.slice(2);
const FIX = args.includes('--fix');

if (FIX) {
  console.log('audit-color-vars: --fix is not yet implemented.');
  console.log('Mechanical substitution of hex → var(--…) is unsafe in general');
  console.log('(gradient stops, SVG icon palettes, and design-system accents');
  console.log('near but not at a palette slot all need human judgement).');
  console.log('Run without --fix to see the offender report and plan a hand pass.');
  process.exit(2);
}

// Canonical palette. Values copied verbatim from category-theory.html :root
// (lines 29–34 at audit time). Any drift there should be reflected here.
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

// ---- helpers ----

function hexToRgb(hex) {
  let h = hex.replace(/^#/, '').toLowerCase();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return null;
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return null;
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}
function rgbDist(a, b) {
  const dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

const PALETTE_RGB = Object.entries(PALETTE).map(([name, hex]) => ({
  name, hex, rgb: hexToRgb(hex),
}));

function nearestPalette(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  let best = null;
  for (const p of PALETTE_RGB) {
    const d = rgbDist(rgb, p.rgb);
    if (!best || d < best.dist) best = { name: p.name, hex: p.hex, dist: d };
  }
  return best;
}

// Return the line number (1-based) that `index` lies on.
function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) {
    if (text.charCodeAt(i) === 10) line++;
  }
  return line;
}

// Carve out skip zones: replace every character in a skipped region with ' '
// so regex offsets still line up with the original string. Returns the masked
// string (same length) for scanning.
function maskSkipZones(html) {
  const chars = html.split('');

  function mask(start, end) {
    for (let i = start; i < end && i < chars.length; i++) {
      if (chars[i] !== '\n') chars[i] = ' ';
    }
  }

  // 1. HTML comments <!-- ... -->
  {
    const re = /<!--[\s\S]*?-->/g;
    let m;
    while ((m = re.exec(html))) mask(m.index, m.index + m[0].length);
  }

  // 2. :root { ... } palette definition (first occurrence inside a <style>)
  {
    const re = /:root\s*\{[\s\S]*?\}/g;
    let m;
    while ((m = re.exec(html))) mask(m.index, m.index + m[0].length);
  }

  // 3. <details class="changelog"> ... </details>
  {
    const re = /<details\s+class=["']changelog["'][\s\S]*?<\/details>/gi;
    let m;
    while ((m = re.exec(html))) mask(m.index, m.index + m[0].length);
  }

  // 4. <script> ... </script> blocks
  {
    const re = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
    let m;
    while ((m = re.exec(html))) mask(m.index, m.index + m[0].length);
  }

  return chars.join('');
}

// Find hex literals inside style-bearing contexts. Returns an array of
// { hex, index } where index is the offset of the '#' in the original html
// (equivalently, in the masked text — mask preserves offsets).
function findOffenders(masked) {
  const out = [];
  const hexRe = '#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\\b';

  // A. inside attribute contexts: style / fill / stroke / stop-color /
  //    stroke-width-of-nothing... restrict to the attributes that actually
  //    carry paint.
  //
  //    Example matches:
  //      style="fill:#ff00aa;stroke:#abc"
  //      fill="#ffd866"
  //      stop-color="#58c4dd"
  //
  //    We match the whole attribute value, then walk it for hex tokens so
  //    multi-hex style="..." attrs all get reported.
  const attrRe = /\b(style|fill|stroke|stop-color|flood-color|lighting-color|color)\s*=\s*"([^"]*)"/gi;
  let m;
  while ((m = attrRe.exec(masked))) {
    const valStart = m.index + m[0].indexOf('"') + 1;
    const value = m[2];
    const innerRe = new RegExp(hexRe, 'g');
    let im;
    while ((im = innerRe.exec(value))) {
      out.push({
        hex: '#' + im[1].toLowerCase(),
        index: valStart + im.index,
        context: `${m[1].toLowerCase()}=`,
      });
    }
  }

  // B. inside <style>...</style> contents (but :root was already masked out,
  //    so palette definitions don't leak).
  const styleRe = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  while ((m = styleRe.exec(masked))) {
    const bodyStart = m.index + m[0].indexOf('>') + 1;
    const body = m[1];
    const innerRe = new RegExp(hexRe, 'g');
    let im;
    while ((im = innerRe.exec(body))) {
      out.push({
        hex: '#' + im[1].toLowerCase(),
        index: bodyStart + im.index,
        context: '<style>',
      });
    }
  }

  // De-dupe by (index): an offset can't be reported by two scanners.
  const seen = new Set();
  return out.filter((o) => {
    if (seen.has(o.index)) return false;
    seen.add(o.index);
    return true;
  });
}

// ---- main ----

const htmlFiles = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html'))
  .sort();

const perFile = new Map(); // file -> array of offenders
let grandTotal = 0;
const allOffenders = []; // flat list for the "top N" view

for (const file of htmlFiles) {
  const abs = join(repoRoot, file);
  let html;
  try { html = readFileSync(abs, 'utf8'); }
  catch { continue; }

  const masked = maskSkipZones(html);
  const hits = findOffenders(masked);

  const enriched = hits.map((h) => {
    const near = nearestPalette(h.hex);
    return {
      file, hex: h.hex, line: lineAt(html, h.index), context: h.context,
      suggest: near ? `var(${near.name})` : '(no palette match)',
      suggestHex: near ? near.hex : null,
      dist: near ? near.dist : null,
    };
  });

  perFile.set(file, enriched);
  grandTotal += enriched.length;
  for (const e of enriched) allOffenders.push(e);
}

// ---- report ----

console.log(`audit-color-vars: scanned ${htmlFiles.length} HTML file(s)\n`);

const filesWithHits = [...perFile.entries()]
  .filter(([, arr]) => arr.length > 0)
  .sort((a, b) => b[1].length - a[1].length);

if (filesWithHits.length === 0) {
  console.log('OK: no hex color literals found in widget markup. Palette clean.');
  process.exit(0);
}

for (const [file, hits] of filesWithHits) {
  console.log(`${file}  (${hits.length})`);
  for (const h of hits) {
    const dist = h.dist === null ? 'n/a' : h.dist.toFixed(1);
    console.log(
      `  L${String(h.line).padStart(5)}  ${h.context.padEnd(12)} ${h.hex.padEnd(8)} -> ${h.suggest} (d=${dist})`,
    );
  }
  console.log('');
}

// Top-10 by smallest distance (most confident suggestions).
const top = allOffenders
  .filter((o) => o.dist !== null)
  .sort((a, b) => a.dist - b.dist)
  .slice(0, 10);

console.log('TOP 10 closest matches (most confident substitutions):');
for (const h of top) {
  console.log(
    `  ${h.file}:L${h.line}  ${h.hex} -> ${h.suggest} (d=${h.dist.toFixed(1)})`,
  );
}
console.log('');

console.log(`totals: ${grandTotal} hex literal(s) across ${filesWithHits.length} file(s).`);
console.log('This is a report only — audit-color-vars always exits 0.');
process.exit(0);
