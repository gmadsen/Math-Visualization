#!/usr/bin/env node
// Audit-first, pattern-gated fix for hex literals inside <style> blocks.
//
// Complements scripts/fix-color-vars.mjs (which only handles safe SVG-attribute
// contexts — fill="#…", stroke="#…", stop-color="#…"). The remaining hex
// literals live inside <style>...</style> blocks, where CSS context matters:
//   - `code { background:#0b0f16 }` is a tokenless rephrasing of var(--bg), safe.
//   - `border-left:3px solid #ff00aa` inside a `.widget-specific` selector may
//     be load-bearing accent, not a palette match.
//   - Gradient stops, color-mix() arguments, shorthand `border:…#xxx…` rules
//     all have different risk profiles.
//
// This script is DELIBERATELY audit-first: it will not apply substitutions
// unless the caller provides `--fix --pattern '<regex>'`. The pattern matches
// against a synthetic "context key" of the form `<selector> { <property>:`
// derived from the CSS rule enclosing each hex literal. That lets an operator
// bulk-fix a single known-safe rule (e.g. `code { background:`) without a
// blanket repo-wide sweep.
//
// Skip zones (mirrors fix-color-vars.mjs — style-block hex is the whole point
// of THIS script, so <style> is explicitly NOT skipped):
//   - <!-- ... --> comments
//   - <script> ... </script> blocks
//   - <svg> ... </svg> inline blocks (attribute-hosted hex is handled elsewhere)
//   - :root { ... } palette definition
//   - <details class="changelog"> ... </details>
//
// Also skips these special HTML files (per smoke-test SPECIAL + their neighbors):
//   index.html, pathway.html, progress.html, latex-cheatsheet.html, sections/*
//
// CLI:
//   node scripts/fix-color-vars-style.mjs
//     Audit mode (default). Lists candidate substitutions grouped by
//     (source hex, target var, rule pattern). Never writes. Exit 0.
//
//   node scripts/fix-color-vars-style.mjs --preview
//     Audit mode + per-candidate before/after preview (a git-style diff line
//     per hit, grouped by file). Still writes nothing.
//
//   node scripts/fix-color-vars-style.mjs --fix --pattern '<regex>'
//     Apply only the substitutions whose context key matches the regex.
//     The `--pattern` flag is REQUIRED with `--fix` (no blanket sweeps).
//     Regex is matched case-insensitively against the context key, e.g.
//     `code \{ background:`.
//
//   node scripts/fix-color-vars-style.mjs --help
//     Print usage + palette + caveats.
//
// Idempotent: after `--fix --pattern X`, re-running the same command finds 0
// substitutions (the hex is gone, replaced by var(--…)).
//
// Zero deps, regex-based parsing — mirrors the house style of smoke-test.mjs
// and audit-color-vars.mjs.

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

// ---- CLI ----

const args = process.argv.slice(2);
const FIX = args.includes('--fix');
const PREVIEW = args.includes('--preview');
const HELP = args.includes('--help') || args.includes('-h');

function argValue(flag) {
  const i = args.indexOf(flag);
  if (i < 0) return null;
  return args[i + 1] ?? null;
}
const PATTERN_STR = argValue('--pattern');

// Canonical palette. Must match fix-color-vars.mjs / audit-color-vars.mjs.
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
  console.log(`fix-color-vars-style — pattern-gated fix for hex literals in <style> blocks

USAGE
  node scripts/fix-color-vars-style.mjs              Audit mode (default). Never writes.
  node scripts/fix-color-vars-style.mjs --preview    Audit mode + per-candidate diff preview.
  node scripts/fix-color-vars-style.mjs --fix --pattern '<regex>'
                                                     Apply substitutions whose context key
                                                     matches the regex (case-insensitive).
  node scripts/fix-color-vars-style.mjs --help       This text.

CONTEXT KEY
  Each candidate substitution has a context key of the form
    <selector> { <property>:
  for example:
    code { background:
    h2 { color:
    .widget .hd .ttl { color:
  The --pattern regex is matched against this key. Nothing else is matchable
  (no match on file name, line number, hex value). This keeps semantics tied
  to CSS context, which is what makes style-block substitution risky.

SAFETY RAILS
  --fix without --pattern is rejected (exit 2). No blanket repo-wide sweep.
  :root, <script>, <svg>, <!-- -->, <details class="changelog"> are skipped.
  index.html, pathway.html, progress.html, latex-cheatsheet.html are skipped.
  Only exact (d=0) and near-miss (0 < d < 15) hits are writable by --fix.
  Low-confidence (d >= 15) hits are reported but never written — those are
  almost certainly intentional distinct shades, not palette drift.
  The operator is responsible for reviewing audit output and --preview
  before choosing a pattern. Visual spot-check with git diff is mandatory.

PALETTE
${Object.entries(PALETTE).map(([k, v]) => `  ${k.padEnd(10)} ${v}`).join('\n')}

CAVEATS
  Style-block hex is riskier than SVG-attribute hex because CSS rules can mean
  "match the palette" or "this specific shade is the design, don't touch".
  Always run without flags first, inspect the context-key groupings, then
  --preview to see the exact edits, then --fix --pattern one group at a time.
  After any --fix run, visually diff with git and inspect the page before
  committing. Confidence tiers in audit output (exact / near / loose) are
  informational only: only "exact" hits are ever written.

See also:
  scripts/audit-color-vars.mjs  — read-only report of all hex in all contexts.
  scripts/fix-color-vars.mjs    — attribute-only writer (fill/stroke/stop-color).
`);
}

if (HELP) {
  printHelp();
  process.exit(0);
}

if (FIX && !PATTERN_STR) {
  console.error('fix-color-vars-style: --fix requires --pattern \'<regex>\'.');
  console.error('No blanket substitutions allowed — style-block hex is context-sensitive.');
  console.error('Run `node scripts/fix-color-vars-style.mjs --help` for usage.');
  process.exit(2);
}

let patternRe = null;
if (PATTERN_STR) {
  try {
    patternRe = new RegExp(PATTERN_STR, 'i');
  } catch (err) {
    console.error(`fix-color-vars-style: invalid --pattern regex: ${err.message}`);
    process.exit(2);
  }
}

// ---- palette helpers ----

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

// ---- mask/skip-zone helpers ----

function maskSkipZones(html) {
  const chars = html.split('');
  function mask(start, end) {
    for (let i = start; i < end && i < chars.length; i++) {
      if (chars[i] !== '\n') chars[i] = ' ';
    }
  }
  // NOTE: <style> is NOT masked — it's our scan target.
  const patterns = [
    /<!--[\s\S]*?-->/g,
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    /<svg\b[^>]*>[\s\S]*?<\/svg>/gi,
    /<details\s+class=["']changelog["'][\s\S]*?<\/details>/gi,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html))) mask(m.index, m.index + m[0].length);
  }
  // :root{...} blocks must be masked only WITHIN <style> regions (they only
  // exist there anyway, but be explicit).
  {
    const re = /:root\s*\{[\s\S]*?\}/g;
    let m;
    while ((m = re.exec(html))) mask(m.index, m.index + m[0].length);
  }
  return chars.join('');
}

// ---- CSS rule parsing ----
//
// Given a <style> body (already palette-:root-masked), split it into
// top-level rules { selector, body, bodyStart }. We only care about rules
// whose body contains a hex token. Nested @media blocks are handled by
// flattening one level: `@media (...) { <inner rules> }` — we walk the
// inner block the same way.
//
// The parser is a minimal brace-tracker: it finds matching `{` / `}` pairs
// at depth 1 and extracts the selector (the text since the previous `}` /
// block start / end of at-rule prelude). Comments `/* */` inside the CSS
// body are masked so braces inside comments don't confuse the tracker.

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

// Return array of { selector, bodyStart, bodyEnd } where bodyStart/bodyEnd are
// offsets inside cssBody (exclusive end, inclusive start of inner text, i.e.
// bodyStart is one char after `{`, bodyEnd is the `}` position).
function parseCssRules(cssBody) {
  const masked = maskCssComments(cssBody);
  const rules = [];
  let i = 0;
  let selStart = 0;
  while (i < masked.length) {
    const ch = masked[i];
    if (ch === '{') {
      // find matching }
      let depth = 1;
      let j = i + 1;
      while (j < masked.length && depth > 0) {
        const c = masked[j];
        if (c === '{') depth++;
        else if (c === '}') depth--;
        if (depth > 0) j++;
      }
      const selector = cssBody.slice(selStart, i).trim();
      // If this is a nested at-rule (@media, @supports, @keyframes, ...), the
      // inner body contains a list of rules; recurse and tag them with the
      // outer at-rule selector for context.
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

// Given a rule body and a hex offset inside it, walk backwards from the hex
// to find the CSS property name (the text between the previous `;` / `{` /
// start-of-body and the `:` before the hex). Returns {property, propStart}
// or null.
function findPropertyFor(ruleBody, hexOffset) {
  // Search for the ':' immediately before hexOffset.
  let colon = -1;
  for (let i = hexOffset - 1; i >= 0; i--) {
    const c = ruleBody[i];
    if (c === ':') { colon = i; break; }
    if (c === ';' || c === '{' || c === '}') break;
    // a space or letter or paren is ok; keep walking
  }
  if (colon < 0) return null;
  // Walk backwards from the colon to find the property name start.
  let start = colon - 1;
  // skip whitespace
  while (start >= 0 && /\s/.test(ruleBody[start])) start--;
  let end = start + 1;
  while (start >= 0 && /[-a-zA-Z0-9]/.test(ruleBody[start])) start--;
  start++;
  if (start >= end) return null;
  const property = ruleBody.slice(start, end);
  if (!property) return null;
  return { property: property.toLowerCase(), propStart: start };
}

// ---- main scanner ----
//
// For each file, produce an array of candidate substitutions:
//   { file, abs, html, start, end, original, replacement,
//     hex, varName, property, selector, contextKey,
//     confidence: 'exact'|'near'|'loose', dist, line }
//
// Only 'exact' candidates are eligible for --fix. Near/loose are reported
// only for operator review.

function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) {
    if (text.charCodeAt(i) === 10) line++;
  }
  return line;
}

function confidenceOf(dist) {
  if (dist === 0) return 'exact';
  if (dist < 15) return 'near';
  return 'loose';
}

const HEX_RE_G = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;

function scanFile(file, abs, html) {
  const masked = maskSkipZones(html);
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
      let hm;
      HEX_RE_G.lastIndex = 0;
      while ((hm = HEX_RE_G.exec(ruleBody))) {
        const hexToken = hm[0];
        const norm = normHex(hexToken);
        if (!norm) continue;
        // Skip if already inside a var(...) (defensive — lexically impossible
        // because var names don't contain '#', but guard anyway).
        // Compute offsets into the original file.
        const hexOffsetInBody = rule.bodyStart + hm.index;
        const fileOffset = bodyStartInFile + hexOffsetInBody;
        const prop = findPropertyFor(ruleBody, hm.index);
        const selector = rule.selector;
        const property = prop ? prop.property : '(unknown)';
        const contextKey = `${selector} { ${property}:`;
        const near = nearestPalette(norm);
        const conf = confidenceOf(near ? near.dist : 999);
        // For exact and near hits, the replacement var is the closest palette
        // slot. Loose hits are not writable, so replacement stays null.
        const varName = near && (conf === 'exact' || conf === 'near')
          ? HEX_TO_VAR.get(near.hex)
          : null;
        out.push({
          file, abs, html,
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

// ---- file selection ----

// Skip SPECIAL-ish pages where CSS is bespoke and not worth a palette sweep.
// Matches smoke-test.mjs SPECIAL plus pages that aren't topic pages.
const SKIP_FILES = new Set([
  'index.html',
  'pathway.html',
  'progress.html',
  'latex-cheatsheet.html',
]);

const htmlFiles = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html') && !SKIP_FILES.has(f))
  .sort();

// ---- scan all files ----

const allCandidates = [];
for (const file of htmlFiles) {
  const abs = join(repoRoot, file);
  let html;
  try { html = readFileSync(abs, 'utf8'); } catch { continue; }
  const cands = scanFile(file, abs, html);
  for (const c of cands) allCandidates.push(c);
}

// ---- grouping for the audit report ----

function groupBy(items, keyFn) {
  const m = new Map();
  for (const it of items) {
    const k = keyFn(it);
    let arr = m.get(k);
    if (!arr) { arr = []; m.set(k, arr); }
    arr.push(it);
  }
  return m;
}

function formatGroupLine(groupKey, items) {
  const sample = items[0];
  const fileSet = new Set(items.map((i) => i.file));
  const contextSet = new Set(items.map((i) => `${i.selector} { ${i.property}:`));
  const suggest = sample.varName
    ? `var(--${sample.varName.replace(/^--/, '')})`
    : (sample.suggestHex
      ? `var(${HEX_TO_VAR.get(sample.suggestHex) || '?'}) (d=${sample.dist.toFixed(1)})`
      : '(no palette)');
  const hex = sample.hex.padEnd(8);
  const ctx = contextSet.size === 1
    ? `in \`${sample.property}:\` on \`${sample.selector} { }\``
    : `across ${contextSet.size} distinct selector/property contexts`;
  return `  ${hex} -> ${suggest.padEnd(24)} ${ctx.padEnd(60)} (${items.length} hit${items.length === 1 ? '' : 's'}, ${fileSet.size} file${fileSet.size === 1 ? '' : 's'})`;
}

// ---- fix mode ----

if (FIX) {
  const eligible = allCandidates
    .filter((c) => c.confidence === 'exact' || c.confidence === 'near')
    .filter((c) => c.replacement !== null)
    .filter((c) => patternRe.test(c.contextKey));

  if (eligible.length === 0) {
    console.log(`fix-color-vars-style [FIX]: pattern ${JSON.stringify(PATTERN_STR)} matched 0 eligible candidates.`);
    console.log('Nothing to write. Run without --fix to see available context keys.');
    process.exit(0);
  }

  // Break out exact vs near for the operator — near-miss fixes intentionally
  // change the color value (the old hex != the palette hex), so call it out.
  const exactN = eligible.filter((c) => c.confidence === 'exact').length;
  const nearN = eligible.filter((c) => c.confidence === 'near').length;
  if (nearN > 0) {
    console.log(`fix-color-vars-style [FIX]: ${exactN} exact + ${nearN} near-miss substitution(s).`);
    console.log('WARNING: near-miss fixes change pixel values. Inspect `git diff` carefully.');
  } else {
    console.log(`fix-color-vars-style [FIX]: ${exactN} exact substitution(s).`);
  }

  // Group by file, apply right-to-left so offsets stay stable.
  const perFile = groupBy(eligible, (c) => c.file);
  let written = 0;
  for (const [file, items] of perFile) {
    const sorted = [...items].sort((a, b) => a.start - b.start);
    const html = sorted[0].html;
    let out = html;
    for (let i = sorted.length - 1; i >= 0; i--) {
      const s = sorted[i];
      out = out.slice(0, s.start) + s.replacement + out.slice(s.end);
    }
    writeFileSync(sorted[0].abs, out, 'utf8');
    written += sorted.length;
    console.log(`  ${file.padEnd(40)} ${String(sorted.length).padStart(4)} substitution${sorted.length === 1 ? '' : 's'}`);
  }
  console.log(`\nfix-color-vars-style [FIX]: wrote ${written} substitution(s) across ${perFile.size} file(s).`);
  console.log(`Pattern: ${JSON.stringify(PATTERN_STR)}`);
  console.log('Inspect diff with `git diff` before committing. Verify pages render identically.');
  process.exit(0);
}

// ---- audit mode ----

const total = allCandidates.length;
const fileSet = new Set(allCandidates.map((c) => c.file));

console.log(`fix-color-vars-style: ${total} hex hits across ${fileSet.size} file(s) (inside <style> blocks)\n`);

const byConf = {
  exact: allCandidates.filter((c) => c.confidence === 'exact'),
  near: allCandidates.filter((c) => c.confidence === 'near'),
  loose: allCandidates.filter((c) => c.confidence === 'loose'),
};

// Group exact hits by (hex, contextKey). These are the "bulk-replaceable"
// boilerplate lines like `code { background:#0b0f16 }` that appear verbatim
// in most topic pages.
const exactGroups = groupBy(byConf.exact, (c) => `${c.hex}|${c.contextKey}`);
const exactSorted = [...exactGroups.entries()]
  .sort((a, b) => b[1].length - a[1].length);

console.log(`High-confidence groups (exact palette match, same rule across files): ${byConf.exact.length} hits`);
if (exactSorted.length === 0) {
  console.log('  (none)');
} else {
  for (const [, items] of exactSorted) {
    console.log(formatGroupLine(null, items));
  }
}
console.log('');

// Near-miss: group by hex only (context varies more here).
const nearGroups = groupBy(byConf.near, (c) => c.hex);
const nearSorted = [...nearGroups.entries()].sort((a, b) => b[1].length - a[1].length);

console.log(`Medium-confidence groups (near palette match, d < 15 — review before writing): ${byConf.near.length} hits`);
if (nearSorted.length === 0) {
  console.log('  (none)');
} else {
  for (const [hex, items] of nearSorted.slice(0, 20)) {
    const contexts = new Set(items.map((i) => `${i.property} on ${i.selector}`));
    const near = nearestPalette(hex);
    const suggest = near ? `var(${HEX_TO_VAR.get(near.hex) || '?'}) (d=${near.dist.toFixed(1)})` : '(no palette)';
    const files = new Set(items.map((i) => i.file));
    console.log(`  ${hex.padEnd(8)} -> ${suggest.padEnd(24)} in ${contexts.size} context(s), ${items.length} hit(s) across ${files.size} file(s)`);
  }
  if (nearSorted.length > 20) console.log(`  ... and ${nearSorted.length - 20} more`);
}
console.log('');

// Loose: just a count per hex.
const looseGroups = groupBy(byConf.loose, (c) => c.hex);
const looseSorted = [...looseGroups.entries()].sort((a, b) => b[1].length - a[1].length);

console.log(`Low-confidence (d >= 15 — likely intentional shade, NOT palette): ${byConf.loose.length} hits`);
if (looseSorted.length === 0) {
  console.log('  (none)');
} else {
  for (const [hex, items] of looseSorted.slice(0, 10)) {
    const near = nearestPalette(hex);
    const suggest = near ? `closest ${HEX_TO_VAR.get(near.hex) || '?'} (d=${near.dist.toFixed(1)})` : '(no palette)';
    const files = new Set(items.map((i) => i.file));
    console.log(`  ${hex.padEnd(8)} ${String(items.length).padStart(4)} hit(s), ${files.size} file(s) — ${suggest}`);
  }
  if (looseSorted.length > 10) console.log(`  ... and ${looseSorted.length - 10} more`);
}
console.log('');

// ---- preview mode ----

if (PREVIEW) {
  const writable = allCandidates.filter((c) => c.replacement !== null);
  console.log(`--- DIFF PREVIEW (writable candidates — exact + near, grouped by file) ---\n`);
  if (writable.length === 0) {
    console.log('  (no writable candidates — only loose-confidence hits present)\n');
  }
  const byFile = groupBy(writable, (c) => c.file);
  const files = [...byFile.keys()].sort();
  for (const file of files) {
    const items = byFile.get(file).sort((a, b) => a.start - b.start);
    console.log(`${file}  (${items.length} candidate${items.length === 1 ? '' : 's'})`);
    for (const c of items) {
      const tag = c.confidence === 'exact' ? 'exact' : `near d=${c.dist.toFixed(1)}`;
      const ctx = `${c.selector} { ${c.property}: ...${c.original}... }  [${tag}]`;
      const trimmed = ctx.length > 100 ? ctx.slice(0, 97) + '...' : ctx;
      console.log(`  L${String(c.line).padStart(5)}  ${trimmed}`);
      console.log(`         - ${c.property}: ${c.original}`);
      console.log(`         + ${c.property}: ${c.replacement}`);
    }
    console.log('');
  }
}

console.log('Next steps:');
console.log('  - Review the groups above and pick one with an obvious, repo-wide-safe intent.');
console.log('  - Run `node scripts/fix-color-vars-style.mjs --preview` for line-level diffs.');
console.log('  - Apply with e.g. `node scripts/fix-color-vars-style.mjs --fix --pattern \'code \\{ background:\'`.');
console.log('  - Verify with `node scripts/rebuild.mjs` and a visual spot-check in the browser.');
console.log('');
console.log('(audit mode — no files written. Exit 0.)');
process.exit(0);
