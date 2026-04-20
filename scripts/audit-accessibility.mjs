#!/usr/bin/env node
// Lightweight accessibility audit for topic HTML pages + index.html + pathway.html.
//
// Advisory only (always exits 0). Zero dependencies: regex + string walks, runs
// from stock node. Style matches scripts/smoke-test.mjs.
//
// Checks:
//   1. Heading order  — parse <h1>…<h6>; flag any skip (h2 → h4 etc.).
//   2. SVG labeling   — any <svg> outside <div class="thumb"> should carry
//                       <title>, <desc>, aria-label, or role="img".
//   3. Buttons/inputs — <button> must have text content or aria-label; visible
//                       <input> must have an associated <label> (for/id) or
//                       aria-label / aria-labelledby.
//   4. Images alt     — every <img> must carry an alt= attribute (empty OK).
//   5. Link text      — flag generic link text ("click here", "here", "link",
//                       "read more", "this"); allow "← Notebook" and
//                       unicode-arrow anchors.
//   6. <html lang>    — flag if <html> has no lang= attribute.
//   7. Viewport meta  — flag if <meta name="viewport" …> missing.
//   8. Color-only prose — flag prose substrings like "the green line" that
//                         lean on color alone; rough heuristic.
//
// CLI: node scripts/audit-accessibility.mjs
// Exit: 0 always.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

// ────────────────────────────────────────────────────────────────────────────
// Helpers.

function read(path) {
  try { return readFileSync(path, 'utf8'); } catch { return null; }
}

// Extract attribute value from a tag-opening string, e.g. '<a href="x" id="y">'.
function attr(tag, name) {
  const re = new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');
  const m = tag.match(re);
  if (!m) return null;
  return m[2] ?? m[3] ?? m[4] ?? '';
}
function hasAttr(tag, name) {
  const re = new RegExp(`\\s${name}(\\s|=|>|/)`, 'i');
  return re.test(tag);
}

// Strip HTML tags from a string — rough, used for button / link visible text.
function stripTags(s) {
  return s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// Short snippet around an index, for human-friendly output.
function snippet(html, idx, len = 90) {
  const start = Math.max(0, idx - 10);
  const end = Math.min(html.length, idx + len);
  return html.slice(start, end).replace(/\s+/g, ' ').trim();
}

// Walk every <tag ...>…</tag> pair and yield inner/outer ranges. Handles nesting.
function* findPairs(html, tagName) {
  const openRe = new RegExp(`<${tagName}\\b([^>]*)>`, 'gi');
  const closeRe = new RegExp(`</${tagName}\\s*>`, 'gi');
  let m;
  while ((m = openRe.exec(html))) {
    const openStart = m.index;
    const openEnd = openRe.lastIndex;
    const attrs = m[1];
    // Self-closing (rare for these tags, but tolerate).
    if (attrs.trimEnd().endsWith('/')) {
      yield { tag: m[0], attrs, innerStart: openEnd, innerEnd: openEnd, outerEnd: openEnd, selfClose: true };
      continue;
    }
    closeRe.lastIndex = openEnd;
    // Balance nested opens.
    const nestedOpenRe = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
    nestedOpenRe.lastIndex = openEnd;
    let depth = 1;
    let innerEnd = -1;
    let outerEnd = -1;
    while (depth > 0) {
      const nextClose = closeRe.exec(html);
      if (!nextClose) break;
      nestedOpenRe.lastIndex = openEnd;
      let opensBefore = 0;
      let om;
      while ((om = nestedOpenRe.exec(html)) && om.index < nextClose.index) {
        if (om.index >= openEnd) opensBefore += 1;
      }
      depth = 1 + opensBefore - (1); // start depth 1, already consumed initial open
      // Simpler: count opens after openEnd strictly before nextClose.index:
      let nestedOpens = 0;
      const no2 = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
      no2.lastIndex = openEnd;
      let nm;
      while ((nm = no2.exec(html)) && nm.index < nextClose.index) nestedOpens += 1;
      if (nestedOpens === 0) {
        innerEnd = nextClose.index;
        outerEnd = closeRe.lastIndex;
        break;
      }
      // Skip ahead past `nestedOpens` closes in total (consume them).
      let skipped = 1;
      while (skipped < nestedOpens + 1) {
        const more = closeRe.exec(html);
        if (!more) break;
        skipped += 1;
        innerEnd = more.index;
        outerEnd = closeRe.lastIndex;
      }
      if (skipped === nestedOpens + 1) break;
    }
    if (innerEnd === -1) {
      innerEnd = html.length;
      outerEnd = html.length;
    }
    yield {
      tag: m[0],
      attrs,
      innerStart: openEnd,
      innerEnd,
      outerStart: openStart,
      outerEnd,
      selfClose: false,
    };
    openRe.lastIndex = outerEnd;
  }
}

// Find ranges of <div class="thumb"> … </div> (balanced on <div>).
function findThumbRanges(html) {
  const ranges = [];
  const re = /<div\s+[^>]*class="[^"]*\bthumb\b[^"]*"[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const start = m.index;
    let depth = 1;
    let i = re.lastIndex;
    const openRe = /<div\b[^>]*>/gi;
    const closeRe = /<\/div\s*>/gi;
    openRe.lastIndex = i;
    closeRe.lastIndex = i;
    while (depth > 0) {
      openRe.lastIndex = i;
      closeRe.lastIndex = i;
      const no = openRe.exec(html);
      const nc = closeRe.exec(html);
      if (!nc) { i = html.length; break; }
      if (no && no.index < nc.index) {
        depth += 1;
        i = openRe.lastIndex;
      } else {
        depth -= 1;
        i = closeRe.lastIndex;
      }
    }
    ranges.push([start, i]);
    re.lastIndex = i;
  }
  return ranges;
}

function inRanges(idx, ranges) {
  for (const [a, b] of ranges) if (idx >= a && idx < b) return true;
  return false;
}

// ────────────────────────────────────────────────────────────────────────────
// Individual checks. Each returns an array of { msg, excerpt }.

function checkHeadingOrder(html) {
  const violations = [];
  const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let prev = 0;
  let m;
  while ((m = re.exec(html))) {
    const level = parseInt(m[1], 10);
    const text = stripTags(m[2]).slice(0, 60);
    if (prev !== 0 && level > prev + 1) {
      violations.push({
        msg: `heading skip: h${prev} → h${level}`,
        excerpt: `"${text}"`,
      });
    }
    prev = level;
  }
  return violations;
}

function checkSvgLabeling(html) {
  const violations = [];
  const thumbs = findThumbRanges(html);
  // Walk svgs with simple regex but confirm inner content for title/desc.
  const svgRe = /<svg\b([^>]*)>([\s\S]*?)<\/svg>/gi;
  let m;
  while ((m = svgRe.exec(html))) {
    const idx = m.index;
    if (inRanges(idx, thumbs)) continue;
    const open = `<svg${m[1]}>`;
    const inner = m[2];
    if (hasAttr(open, 'aria-label')) continue;
    if (/role\s*=\s*["']img["']/i.test(open)) continue;
    if (/<title\b/i.test(inner)) continue;
    if (/<desc\b/i.test(inner)) continue;
    if (hasAttr(open, 'aria-labelledby')) continue;
    if (hasAttr(open, 'aria-hidden')) continue;
    violations.push({
      msg: 'svg without <title>/<desc>/aria-label/role="img"',
      excerpt: snippet(html, idx, 80),
    });
  }
  return violations;
}

function checkButtons(html) {
  const violations = [];
  const btnRe = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
  let m;
  while ((m = btnRe.exec(html))) {
    const open = `<button${m[1]}>`;
    const inner = m[2];
    const visible = stripTags(inner);
    if (visible.length > 0) continue;
    if (hasAttr(open, 'aria-label') && attr(open, 'aria-label')?.trim()) continue;
    if (hasAttr(open, 'aria-labelledby')) continue;
    if (hasAttr(open, 'title') && attr(open, 'title')?.trim()) continue;
    violations.push({
      msg: 'button with no visible text or aria-label',
      excerpt: snippet(html, m.index, 80),
    });
  }
  return violations;
}

function checkInputs(html) {
  const violations = [];
  // Gather id → has associated <label for="id">.
  const labelFors = new Set();
  const lblRe = /<label\b([^>]*)>/gi;
  let lm;
  while ((lm = lblRe.exec(html))) {
    const f = attr(`<label${lm[1]}>`, 'for');
    if (f) labelFors.add(f);
  }
  // Also catch wrapping <label>…<input …></label> by noting input indices inside label pairs.
  const wrappingLabelRanges = [];
  const wrapRe = /<label\b[^>]*>([\s\S]*?)<\/label>/gi;
  let wm;
  while ((wm = wrapRe.exec(html))) {
    wrappingLabelRanges.push([wm.index, wrapRe.lastIndex]);
  }

  const inputRe = /<input\b([^>]*)\/?>/gi;
  let im;
  while ((im = inputRe.exec(html))) {
    const open = `<input${im[1]}>`;
    const type = (attr(open, 'type') || 'text').toLowerCase();
    if (type === 'hidden' || type === 'submit' || type === 'reset' || type === 'button') continue;
    const id = attr(open, 'id');
    const hasFor = id && labelFors.has(id);
    const hasAria = (hasAttr(open, 'aria-label') && attr(open, 'aria-label')?.trim())
                   || hasAttr(open, 'aria-labelledby');
    const hasTitle = hasAttr(open, 'title') && attr(open, 'title')?.trim();
    const wrapped = inRanges(im.index, wrappingLabelRanges);
    if (hasFor || hasAria || hasTitle || wrapped) continue;
    violations.push({
      msg: `<input type="${type}"> without associated label / aria-label`,
      excerpt: snippet(html, im.index, 80),
    });
  }
  return violations;
}

function checkImages(html) {
  const violations = [];
  const re = /<img\b([^>]*)\/?>/gi;
  let m;
  while ((m = re.exec(html))) {
    const open = `<img${m[1]}>`;
    if (!hasAttr(open, 'alt')) {
      violations.push({
        msg: '<img> missing alt attribute',
        excerpt: snippet(html, m.index, 80),
      });
    }
  }
  return violations;
}

function checkLinkText(html) {
  const violations = [];
  const generics = new Set([
    'click here', 'here', 'link', 'this link', 'read more',
    'more', 'this', 'learn more', 'go', 'go here', 'click',
  ]);
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const inner = m[2];
    const visible = stripTags(inner).toLowerCase();
    if (!visible) continue;
    // Allow "← Notebook", unicode arrows (← → ↑ ↓), or phrases containing arrows.
    if (/[←→↑↓⇒⇐⇑⇓]/.test(visible)) continue;
    if (generics.has(visible)) {
      violations.push({
        msg: `generic link text: "${visible}"`,
        excerpt: snippet(html, m.index, 100),
      });
    }
  }
  return violations;
}

function checkLang(html) {
  const violations = [];
  const m = html.match(/<html\b([^>]*)>/i);
  if (!m) {
    violations.push({ msg: 'no <html> tag found', excerpt: '' });
    return violations;
  }
  if (!hasAttr(`<html${m[1]}>`, 'lang')) {
    violations.push({ msg: '<html> missing lang attribute', excerpt: snippet(html, m.index, 60) });
  }
  return violations;
}

function checkViewport(html) {
  const violations = [];
  if (!/<meta\s+[^>]*name\s*=\s*["']viewport["']/i.test(html)) {
    violations.push({ msg: 'missing <meta name="viewport" …>', excerpt: '' });
  }
  return violations;
}

function checkColorOnly(html) {
  const violations = [];
  // Only scan prose: strip <script>, <style>, KaTeX math, svg, pre, code.
  let prose = html;
  prose = prose.replace(/<script\b[\s\S]*?<\/script>/gi, ' ');
  prose = prose.replace(/<style\b[\s\S]*?<\/style>/gi, ' ');
  prose = prose.replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ');
  prose = prose.replace(/<pre\b[\s\S]*?<\/pre>/gi, ' ');
  prose = prose.replace(/<code\b[\s\S]*?<\/code>/gi, ' ');
  prose = prose.replace(/\$\$[\s\S]*?\$\$/g, ' ');
  prose = prose.replace(/\$[^$\n]*\$/g, ' ');
  prose = prose.replace(/\\\([\s\S]*?\\\)/g, ' ');
  prose = prose.replace(/\\\[[\s\S]*?\\\]/g, ' ');

  // Find "the <COLOR> <NOUN>" where NOUN is a visual object and no other
  // disambiguator appears nearby.
  const colorWords = '(?:red|green|yellow|blue|orange|purple|violet|cyan|pink|magenta)';
  // Nouns that identify a visual element whose identity hinges on color alone.
  const nouns = '(?:line|curve|region|area|arrow|dot|point|circle|square|bar|node|vertex|edge|plot|graph|box|triangle|shape|mark|marker|segment)';
  const re = new RegExp(`\\bthe\\s+${colorWords}\\s+${nouns}s?\\b`, 'gi');
  let m;
  while ((m = re.exec(prose))) {
    // Excerpt with a bit of surrounding context for eyeballing.
    violations.push({
      msg: 'color-only reference',
      excerpt: snippet(prose, m.index, 100),
    });
  }
  return violations;
}

// ────────────────────────────────────────────────────────────────────────────
// Orchestration.

const CHECKS = [
  { key: 'heading-order',  label: 'Heading order',        fn: checkHeadingOrder },
  { key: 'svg-labeling',   label: 'SVG labeling',         fn: checkSvgLabeling  },
  { key: 'buttons',        label: 'Button accessible name', fn: checkButtons    },
  { key: 'inputs',         label: 'Input label',          fn: checkInputs       },
  { key: 'images',         label: 'Image alt',            fn: checkImages       },
  { key: 'link-text',      label: 'Generic link text',    fn: checkLinkText     },
  { key: 'lang',           label: '<html lang>',          fn: checkLang         },
  { key: 'viewport',       label: 'Viewport meta',        fn: checkViewport     },
  { key: 'color-only',     label: 'Color-only prose',     fn: checkColorOnly    },
];

const htmlFiles = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html'))
  .sort();

if (htmlFiles.length === 0) {
  console.log('audit-accessibility: no HTML files found.');
  process.exit(0);
}

const totals = Object.fromEntries(CHECKS.map((c) => [c.key, 0]));
const perFile = new Map();
let filesWithAny = 0;

for (const file of htmlFiles) {
  const abs = join(repoRoot, file);
  const html = read(abs);
  if (html === null) continue;
  const findings = {};
  let fileTotal = 0;
  for (const c of CHECKS) {
    const v = c.fn(html);
    if (v.length) {
      findings[c.key] = v;
      totals[c.key] += v.length;
      fileTotal += v.length;
    }
  }
  if (fileTotal > 0) {
    filesWithAny += 1;
    perFile.set(file, findings);
  }
}

// Report grouped by file.
console.log(`audit-accessibility: ${htmlFiles.length} file(s) scanned, ${filesWithAny} with findings (advisory)\n`);

for (const file of htmlFiles) {
  const findings = perFile.get(file);
  if (!findings) continue;
  const count = Object.values(findings).reduce((n, v) => n + v.length, 0);
  console.log(`── ${file}  (${count} finding${count === 1 ? '' : 's'})`);
  for (const c of CHECKS) {
    const v = findings[c.key];
    if (!v) continue;
    console.log(`   [${c.label}]`);
    for (const item of v) {
      console.log(`     - ${item.msg}`);
      if (item.excerpt) console.log(`       … ${item.excerpt}`);
    }
  }
  console.log('');
}

// Totals.
console.log('Totals by check:');
const maxLabel = Math.max(...CHECKS.map((c) => c.label.length));
let grand = 0;
for (const c of CHECKS) {
  const n = totals[c.key];
  grand += n;
  console.log(`  ${c.label.padEnd(maxLabel)}  ${String(n).padStart(5)}`);
}
console.log(`  ${'─'.repeat(maxLabel)}  ${'─'.repeat(5)}`);
console.log(`  ${'TOTAL'.padEnd(maxLabel)}  ${String(grand).padStart(5)}`);
console.log('\n(advisory — exit 0)');
process.exit(0);
