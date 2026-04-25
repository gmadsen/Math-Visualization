#!/usr/bin/env node
// Color-variable audit + fix for hex literals in topic HTML.
//
// House rule (AGENTS.md "Color tokens, never hex"): widget markup and embedded
// CSS must reach for var(--yellow), var(--blue), var(--cyan), etc., not raw
// #rrggbb. Inlined hex breaks theme swaps and the color-mix border rules on
// .callback / .related / .changelog.
//
// This script consolidates three retired scripts:
//   - audit-color-vars.mjs       (audit-only, both contexts)
//   - fix-color-vars.mjs         (rewrite safe SVG paint attrs)
//   - fix-color-vars-style.mjs   (rewrite hex inside <style> blocks)
//
// Modes:
//
//   node scripts/color-vars.mjs
//     Audit mode. Report hex literals in widget markup (paint attrs) + inside
//     <style> blocks. Exits 1 if any offenders are found, 0 if clean.
//
//   node scripts/color-vars.mjs --fix
//     Rewrite palette-exact hex → var(--accent) in safe SVG paint attrs
//     (fill="#…" / stroke="#…" / stop-color="#…") AND inside <style> blocks
//     that match a --pattern regex (if supplied). Without --pattern, only
//     the attribute rewrite runs — style-block rewrites need an explicit
//     pattern because CSS context is risk-sensitive.
//
//   node scripts/color-vars.mjs --fix --pattern '<regex>'
//     Same as --fix plus style-block substitutions whose "context key"
//     (`<selector> { <property>:`) matches <regex>, case-insensitive.
//
//   node scripts/color-vars.mjs --help
//     Print usage + palette + caveats.
//
// Scan scope:
//   - Audit mode: every .html at the repo root.
//   - Fix mode (attrs): every .html at the repo root.
//   - Fix mode (style blocks): every .html at the repo root EXCEPT the
//     SPECIAL-ish pages (index, pathway, progress, latex-cheatsheet) where
//     CSS is bespoke.
//
// Skip zones (audit + attr-fix): HTML comments, :root{} palette definition,
// <details class="changelog">, <script> blocks.
// Skip zones (style-fix): HTML comments, :root{}, <script>, <svg>,
// <details class="changelog">.  (<style> is the target, so NOT skipped.)
//
// Idempotent: after --fix, a second run finds 0 rewritable candidates
// (hex literals are gone). Audit after --fix reports whatever remains.

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

// ─────────────────────────────────────────────────────────────────────────
// CLI.

const args = process.argv.slice(2);
const FIX = args.includes('--fix');
const HELP = args.includes('--help') || args.includes('-h');

function argValue(flag) {
  const i = args.indexOf(flag);
  if (i < 0) return null;
  return args[i + 1] ?? null;
}
const PATTERN_STR = argValue('--pattern');

// Canonical palette — mirrors category-theory.html :root. Keep in sync.
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

function printHelp() {
  console.log(`color-vars — unified hex → var(--…) auditor/fixer.

USAGE
  node scripts/color-vars.mjs
    Audit mode. Report hex in paint attrs + inside <style> blocks.
    Exits 1 if any offenders are found.

  node scripts/color-vars.mjs --fix
    Rewrite palette-exact hex → var(--…) in SVG paint attrs only.
    (Style-block rewrites require --pattern — see below.)

  node scripts/color-vars.mjs --fix --pattern '<regex>'
    Also rewrite hex inside <style> blocks whose context key
    (\`<selector> { <property>:\`) matches <regex> (case-insensitive).
    Only exact (d=0) and near-miss (0 < d < 15) palette hits are written;
    loose hits (d ≥ 15) are reported but never written.

  node scripts/color-vars.mjs --help
    This text.

CONTEXT KEY (for --pattern)
  Each style-block candidate has a context key of the form
    <selector> { <property>:
  for example:
    code { background:
    h2 { color:
    .widget .hd .ttl { color:

SAFETY RAILS
  --fix without --pattern skips the style-block rewrite entirely (no blanket
  style-block sweeps). :root{}, <script>, <svg>, <!-- -->, and
  <details class="changelog"> are always skipped.
  Attribute rewrites are limited to fill / stroke / stop-color attrs whose
  value is JUST a palette-exact hex token (so compound style="fill:#abc;…"
  strings are left alone).

PALETTE
${Object.entries(PALETTE).map(([k, v]) => `  ${k.padEnd(10)} ${v}`).join('\n')}
`);
}

if (HELP) {
  printHelp();
  process.exit(0);
}

let patternRe = null;
if (PATTERN_STR) {
  try {
    patternRe = new RegExp(PATTERN_STR, 'i');
  } catch (err) {
    console.error(`color-vars: invalid --pattern regex: ${err.message}`);
    process.exit(2);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Palette helpers.

function normHex(hex) {
  let h = hex.replace(/^#/, '').toLowerCase();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return null;
  if (!/^[0-9a-f]{6}$/.test(h)) return null;
  return '#' + h;
}
function hexToRgb(hex) {
  const n = normHex(hex);
  if (!n) return null;
  const k = parseInt(n.slice(1), 16);
  return [(k >> 16) & 0xff, (k >> 8) & 0xff, k & 0xff];
}
function rgbDist(a, b) {
  const dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

const PALETTE_RGB = Object.entries(PALETTE).map(([name, hex]) => ({
  name, hex: normHex(hex), rgb: hexToRgb(hex),
}));
const HEX_TO_VAR = new Map();
for (const p of PALETTE_RGB) HEX_TO_VAR.set(p.hex, p.name);

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

function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) {
    if (text.charCodeAt(i) === 10) line++;
  }
  return line;
}

// ─────────────────────────────────────────────────────────────────────────
// Skip-zone masking. Offsets preserved (spaces replace content; newlines
// kept so line numbering is accurate).

function maskCommon(html, { includeStyle = false, includeSvg = false } = {}) {
  const chars = html.split('');
  function mask(start, end) {
    for (let i = start; i < end && i < chars.length; i++) {
      if (chars[i] !== '\n') chars[i] = ' ';
    }
  }
  const patterns = [
    /<!--[\s\S]*?-->/g,
    /:root\s*\{[\s\S]*?\}/g,
    /<details\s+class=["']changelog["'][\s\S]*?<\/details>/gi,
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
  ];
  if (includeStyle) patterns.push(/<style\b[^>]*>[\s\S]*?<\/style>/gi);
  if (includeSvg)   patterns.push(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi);
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html))) mask(m.index, m.index + m[0].length);
  }
  return chars.join('');
}

// ─────────────────────────────────────────────────────────────────────────
// AUDIT: find hex literals in paint attrs and <style> bodies.

function findAuditOffenders(html) {
  // Skip <script> / :root / <details class="changelog"> / <!-- --> — but NOT
  // <style> (so hex inside CSS is reported).
  const masked = maskCommon(html, { includeStyle: false });
  const out = [];
  const hexRe = '#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\\b';

  // A. paint attributes: style / fill / stroke / stop-color / …
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

  // B. <style> block contents (:root already masked).
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

  // De-dupe by offset.
  const seen = new Set();
  return out.filter((o) => {
    if (seen.has(o.index)) return false;
    seen.add(o.index);
    return true;
  });
}

// ─────────────────────────────────────────────────────────────────────────
// FIX-ATTR: palette-exact rewrites in SVG paint attrs (fill / stroke /
// stop-color). Walks masked text (styles masked so we don't accidentally
// rewrite CSS hex here).

function findAttrSubstitutions(html) {
  const masked = maskCommon(html, { includeStyle: true });
  const out = [];
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

function applySubstitutions(html, subs) {
  // Right-to-left keeps offsets stable.
  const sorted = [...subs].sort((a, b) => a.start - b.start);
  let out = html;
  for (let i = sorted.length - 1; i >= 0; i--) {
    const s = sorted[i];
    out = out.slice(0, s.start) + s.replacement + out.slice(s.end);
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────
// FIX-STYLE: palette-close rewrites inside <style> blocks, gated by
// --pattern. Exact + near-miss (d < 15) only; loose (d ≥ 15) never written.

function maskStyleSkipZones(html) {
  // Like maskCommon but DOESN'T mask <style> (we need to scan it).
  return maskCommon(html, { includeStyle: false, includeSvg: true });
}

function maskCssComments(cssBody) {
  const chars = cssBody.split('');
  const re = /\/\*[\s\S]*?\*\//g;
  let m;
  while ((m = re.exec(cssBody))) {
    for (let i = m.index; i < m.index + m[0].length; i++) {
      if (chars[i] !== '\n') chars[i] = ' ';
    }
  }
  return chars.join('');
}

function parseCssRules(cssBody) {
  const masked = maskCssComments(cssBody);
  const rules = [];
  let i = 0;
  let selStart = 0;
  while (i < masked.length) {
    const ch = masked[i];
    if (ch === '{') {
      let depth = 1;
      let j = i + 1;
      while (j < masked.length && depth > 0) {
        const c = masked[j];
        if (c === '{') depth++;
        else if (c === '}') depth--;
        if (depth > 0) j++;
      }
      const selector = cssBody.slice(selStart, i).trim();
      if (selector.startsWith('@')) {
        const inner = cssBody.slice(i + 1, j);
        const subRules = parseCssRules(inner);
        for (const r of subRules) {
          rules.push({
            selector: `${selector} :: ${r.selector}`,
            bodyStart: (i + 1) + r.bodyStart,
            bodyEnd: (i + 1) + r.bodyEnd,
          });
        }
      } else {
        rules.push({ selector, bodyStart: i + 1, bodyEnd: j });
      }
      i = j + 1;
      selStart = i;
      continue;
    }
    i++;
  }
  return rules;
}

function findPropertyFor(ruleBody, hexOffset) {
  let colon = -1;
  for (let i = hexOffset - 1; i >= 0; i--) {
    const c = ruleBody[i];
    if (c === ':') { colon = i; break; }
    if (c === ';' || c === '{' || c === '}') break;
  }
  if (colon < 0) return null;
  let start = colon - 1;
  while (start >= 0 && /\s/.test(ruleBody[start])) start--;
  let end = start + 1;
  while (start >= 0 && /[-a-zA-Z0-9]/.test(ruleBody[start])) start--;
  start++;
  if (start >= end) return null;
  const property = ruleBody.slice(start, end);
  if (!property) return null;
  return { property: property.toLowerCase(), propStart: start };
}

function confidenceOf(dist) {
  if (dist === 0) return 'exact';
  if (dist < 15) return 'near';
  return 'loose';
}

const HEX_RE_G = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;

function findStyleCandidates(html) {
  const masked = maskStyleSkipZones(html);
  const out = [];
  const styleRe = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let sm;
  while ((sm = styleRe.exec(masked))) {
    const bodyStartInFile = sm.index + sm[0].indexOf('>') + 1;
    const bodyLen = sm[0].lastIndexOf('</style>') - sm[0].indexOf('>') - 1;
    if (bodyLen < 0) continue;
    const body = masked.slice(bodyStartInFile, bodyStartInFile + bodyLen);
    const rules = parseCssRules(body);
    for (const rule of rules) {
      const ruleBody = body.slice(rule.bodyStart, rule.bodyEnd);
      HEX_RE_G.lastIndex = 0;
      let hm;
      while ((hm = HEX_RE_G.exec(ruleBody))) {
        const hexToken = hm[0];
        const norm = normHex(hexToken);
        if (!norm) continue;
        const hexOffsetInBody = rule.bodyStart + hm.index;
        const fileOffset = bodyStartInFile + hexOffsetInBody;
        const prop = findPropertyFor(ruleBody, hm.index);
        const selector = rule.selector;
        const property = prop ? prop.property : '(unknown)';
        const contextKey = `${selector} { ${property}:`;
        const near = nearestPalette(norm);
        const conf = confidenceOf(near ? near.dist : 999);
        const varName = near && (conf === 'exact' || conf === 'near')
          ? HEX_TO_VAR.get(near.hex)
          : null;
        out.push({
          start: fileOffset,
          end: fileOffset + hexToken.length,
          original: hexToken,
          replacement: varName ? `var(${varName})` : null,
          hex: norm,
          varName,
          property,
          selector,
          contextKey,
          confidence: conf,
          dist: near ? near.dist : null,
          suggestHex: near ? near.hex : null,
          line: lineAt(html, fileOffset),
        });
      }
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────
// File selection.

// For style-block rewrites, skip special-ish pages where CSS is bespoke.
const STYLE_SKIP_FILES = new Set([
  'index.html',
  'pathway.html',
  'progress.html',
  'latex-cheatsheet.html',
]);

const htmlFiles = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html'))
  .sort();

// ─────────────────────────────────────────────────────────────────────────
// Main.

if (FIX) {
  // ---- FIX MODE ----

  let totalAttrSubs = 0;
  let totalStyleSubs = 0;
  const attrPerFile = [];
  const stylePerFile = [];

  for (const file of htmlFiles) {
    const abs = join(repoRoot, file);
    let html;
    try { html = readFileSync(abs, 'utf8'); } catch { continue; }

    const attrSubs = findAttrSubstitutions(html);

    let styleSubs = [];
    if (patternRe && !STYLE_SKIP_FILES.has(file)) {
      const styleCands = findStyleCandidates(html);
      styleSubs = styleCands
        .filter((c) => c.confidence === 'exact' || c.confidence === 'near')
        .filter((c) => c.replacement !== null)
        .filter((c) => patternRe.test(c.contextKey));
    }

    // Apply both substitution sets in one right-to-left pass (offsets are
    // from the ORIGINAL html, so merging the lists is safe).
    const combined = [...attrSubs, ...styleSubs];
    if (combined.length > 0) {
      const patched = applySubstitutions(html, combined);
      writeFileSync(abs, patched, 'utf8');
    }

    if (attrSubs.length > 0) attrPerFile.push({ file, count: attrSubs.length });
    if (styleSubs.length > 0) stylePerFile.push({ file, count: styleSubs.length });
    totalAttrSubs += attrSubs.length;
    totalStyleSubs += styleSubs.length;
  }

  console.log(`color-vars [FIX]: scanned ${htmlFiles.length} HTML file(s)`);
  console.log(`  SVG paint-attr substitutions applied: ${totalAttrSubs}`);
  console.log(`  <style>-block substitutions applied:   ${totalStyleSubs}`);
  if (!patternRe) {
    console.log('  (no --pattern supplied; style-block pass skipped.');
    console.log('   Run with --fix --pattern \'<regex>\' to include it.)');
  } else {
    console.log(`  --pattern: ${JSON.stringify(PATTERN_STR)}`);
  }
  if (attrPerFile.length > 0) {
    console.log('');
    console.log('Attribute rewrites by file:');
    for (const p of attrPerFile.sort((a, b) => b.count - a.count)) {
      console.log(`  ${p.file.padEnd(40)} ${String(p.count).padStart(4)}`);
    }
  }
  if (stylePerFile.length > 0) {
    console.log('');
    console.log('Style-block rewrites by file:');
    for (const p of stylePerFile.sort((a, b) => b.count - a.count)) {
      console.log(`  ${p.file.padEnd(40)} ${String(p.count).padStart(4)}`);
    }
  }
  process.exit(0);
}

// ---- AUDIT MODE ----

const perFile = new Map(); // file -> array of offender rows
let grandTotal = 0;
const allOffenders = [];

for (const file of htmlFiles) {
  const abs = join(repoRoot, file);
  let html;
  try { html = readFileSync(abs, 'utf8'); } catch { continue; }

  const hits = findAuditOffenders(html);
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

console.log(`color-vars: scanned ${htmlFiles.length} HTML file(s)\n`);

const filesWithHits = [...perFile.entries()]
  .filter(([, arr]) => arr.length > 0)
  .sort((a, b) => b[1].length - a[1].length);

if (filesWithHits.length === 0) {
  console.log('OK: no hex color literals found in widget markup or <style> blocks.');
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
process.exit(1);
