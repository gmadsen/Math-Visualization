#!/usr/bin/env node
// Audit likely responsive-design issues across topic HTML pages plus
// index.html and pathway.html.
//
// Scope (seven regex-based checks):
//   1. Viewport meta — <meta name="viewport" content="width=device-width,
//      initial-scale=1"> (or equivalent) must exist.
//   2. Hardcoded wide widths — `width:` / `max-width:` / `min-width:` with
//      a pixel value > 640px outside a @media query. Same for width="…"
//      HTML attributes on <svg>, <div>, <img>.
//   3. SVG without viewBox — <svg> elements that lack viewBox= can't scale.
//      Skip trivial inline arrow defs (tiny svgs used inside <defs>).
//   4. Missing `max-width: 100%` on media — explicit pixel width on <img>
//      or <svg> without a max-width of any kind in the attribute/style.
//   5. Overflow hazards — `white-space: nowrap` on wide prose blocks,
//      `overflow: hidden` without `overflow-x: auto`.
//   6. Media-query presence — informational totals per page. Pages with 0
//      media queries on complex layouts are suspect.
//   7. Narrow-viewport text size — `font-size:` with a pixel value > 24px
//      outside @media, not on h1/h2, can overflow small screens.
//
// CLI:
//   node scripts/audit-responsive.mjs
//
// Advisory — always exits 0. Output is grouped by file, with violation
// excerpts plus totals per check at the end.
//
// Zero dependencies: regex + string checks, stock node.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

// ─────────────────────────────────────────────────────────────────────────
// Target file list: every .html at the repo root.

const htmlFiles = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html'))
  .sort();

// ─────────────────────────────────────────────────────────────────────────
// Helpers.

// Slice `html` into the set of character ranges covered by @media rules.
// Returns an array of { start, end } half-open intervals in document-char
// coordinates. Used so other checks can skip anything inside a media query.
function mediaRanges(html) {
  const ranges = [];
  const mediaRe = /@media\b/gi;
  let m;
  while ((m = mediaRe.exec(html))) {
    const openParen = html.indexOf('{', m.index);
    if (openParen === -1) continue;
    // Walk brace depth from the opening brace until it returns to zero.
    let depth = 1;
    let i = openParen + 1;
    while (i < html.length && depth > 0) {
      const ch = html[i];
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
      i++;
    }
    ranges.push({ start: m.index, end: i });
  }
  return ranges;
}
function inAnyRange(offset, ranges) {
  for (const r of ranges) if (offset >= r.start && offset < r.end) return true;
  return false;
}

// Collect ranges that match any of a set of open/close pairs so checks can
// ignore matches inside comments, <script>, <pre>, etc.
function pairRanges(html, openRe, closeStr) {
  const ranges = [];
  let m;
  while ((m = openRe.exec(html))) {
    const end = html.indexOf(closeStr, m.index + m[0].length);
    if (end === -1) break;
    ranges.push({ start: m.index, end: end + closeStr.length });
  }
  return ranges;
}

// Count line number for a given offset (for nicer output).
function lineOf(html, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < html.length; i++) if (html[i] === '\n') line++;
  return line;
}

// Return a one-line excerpt containing `offset`, trimmed and capped.
function excerptAt(html, offset, width = 120) {
  let s = offset;
  while (s > 0 && html[s - 1] !== '\n') s--;
  let e = offset;
  while (e < html.length && html[e] !== '\n') e++;
  let line = html.slice(s, e).trim();
  if (line.length > width) line = line.slice(0, width - 1) + '…';
  return line;
}

// ─────────────────────────────────────────────────────────────────────────
// Check definitions.

const CHECKS = [
  'viewport-meta',
  'wide-width',
  'svg-no-viewbox',
  'media-no-max-width',
  'overflow-hazard',
  'media-queries',
  'large-font',
];

const totals = Object.fromEntries(CHECKS.map((c) => [c, 0]));
const perFile = new Map(); // file -> { violations: [{ check, line, msg, excerpt }], mediaCount }

function addViolation(file, check, line, msg, excerpt) {
  const info = perFile.get(file);
  info.violations.push({ check, line, msg, excerpt });
  totals[check]++;
}

// ─────────────────────────────────────────────────────────────────────────
// Per-file audit.

for (const file of htmlFiles) {
  const abs = join(repoRoot, file);
  let html;
  try { html = readFileSync(abs, 'utf8'); }
  catch { continue; }

  perFile.set(file, { violations: [], mediaCount: 0 });
  const ranges = mediaRanges(html);

  // Skip-zones: inside comments, <script>, and <pre> blocks many checks
  // produce false positives ("<svg" in a code comment, "width:" in JS
  // strings). Precompute their ranges and union into `skipRanges`.
  const commentRanges = pairRanges(html, /<!--/g, '-->');
  const scriptRanges = pairRanges(html, /<script\b[^>]*>/gi, '</script>');
  const preRanges = pairRanges(html, /<pre\b[^>]*>/gi, '</pre>');
  const skipRanges = [...commentRanges, ...scriptRanges, ...preRanges];
  const inSkip = (off) => inAnyRange(off, skipRanges);

  // Global CSS rule `svg{...max-width:100%...}` (or a variant) means every
  // <svg> with a viewBox scales fine regardless of its pixel width="..."
  // attribute. Detect once per file so Check 4 can exempt them.
  const hasGlobalSvgCap = /\bsvg\s*\{[^}]*\bmax-width\s*:\s*100%/i.test(html);

  // Check 1 — viewport meta.
  const vmRe = /<meta\s+[^>]*name=["']viewport["'][^>]*>/i;
  const vmMatch = html.match(vmRe);
  if (!vmMatch) {
    addViolation(file, 'viewport-meta', 1,
      'missing <meta name="viewport" content="..."> in <head>', '');
  } else {
    const content = (vmMatch[0].match(/content=["']([^"']+)["']/i) || [])[1] || '';
    const hasDW = /\bwidth\s*=\s*device-width\b/i.test(content);
    const hasIS = /\binitial-scale\s*=\s*1(\.0+)?\b/.test(content);
    if (!hasDW || !hasIS) {
      const idx = html.indexOf(vmMatch[0]);
      addViolation(file, 'viewport-meta', lineOf(html, idx),
        `viewport meta misconfigured (content="${content}")`, vmMatch[0]);
    }
  }

  // Check 2 — hardcoded wide widths (> 640px).
  //   2a. CSS declarations: width: / max-width: / min-width: Npx.
  //   Limit px values to <= 4 digits to avoid matching z-index-like numbers.
  const cssWidthRe = /\b(width|max-width|min-width)\s*:\s*(\d{3,4})px/gi;
  let mm;
  while ((mm = cssWidthRe.exec(html))) {
    const px = parseInt(mm[2], 10);
    if (px <= 640) continue;
    if (inAnyRange(mm.index, ranges)) continue;
    if (inSkip(mm.index)) continue;
    addViolation(file, 'wide-width', lineOf(html, mm.index),
      `${mm[1]}: ${px}px outside @media (> 640px)`,
      excerptAt(html, mm.index));
  }
  //   2b. HTML width="NNN" attributes on <svg>, <div>, <img>.
  const attrRe = /<(svg|div|img)\b[^>]*\bwidth\s*=\s*["']?(\d{3,4})["']?/gi;
  while ((mm = attrRe.exec(html))) {
    const px = parseInt(mm[2], 10);
    if (px <= 640) continue;
    if (inSkip(mm.index)) continue;
    // Skip width="100%" etc (matched only digit form, so safe, but also skip
    // things that are clearly viewBox-coordinate widths when a viewBox is
    // also declared nearby — those are SVG drawing spaces, not CSS pixels).
    // Heuristic: if the same tag has a viewBox attribute too, it's a
    // resizable SVG, not a fixed-pixel element — skip.
    const tagEnd = html.indexOf('>', mm.index);
    const tag = tagEnd === -1 ? html.slice(mm.index, mm.index + 200)
                              : html.slice(mm.index, tagEnd + 1);
    if (/\bviewBox\s*=/i.test(tag)) continue;
    addViolation(file, 'wide-width', lineOf(html, mm.index),
      `<${mm[1].toLowerCase()}> width="${px}" (> 640px) without viewBox`,
      excerptAt(html, mm.index));
  }

  // Check 3 — <svg> without viewBox.
  //   Scan every <svg …> opening tag. Skip:
  //     - tags inside <defs>…</defs>
  //     - very short svgs embedded inline with explicit width/height <= 24
  //       (arrow markers, icon glyphs).
  // Collect <defs>…</defs> ranges so we can skip them.
  const defsRanges = [];
  const defsRe = /<defs\b[^>]*>[\s\S]*?<\/defs>/gi;
  while ((mm = defsRe.exec(html))) defsRanges.push({ start: mm.index, end: mm.index + mm[0].length });

  const svgRe = /<svg\b[^>]*>/gi;
  while ((mm = svgRe.exec(html))) {
    if (inAnyRange(mm.index, defsRanges)) continue;
    if (inSkip(mm.index)) continue;
    const tag = mm[0];
    if (/\bviewBox\s*=/i.test(tag)) continue;
    // Tiny-icon exemption: both width and height attrs present and <= 24.
    const wMatch = tag.match(/\bwidth\s*=\s*["']?(\d+)/i);
    const hMatch = tag.match(/\bheight\s*=\s*["']?(\d+)/i);
    if (wMatch && hMatch && parseInt(wMatch[1], 10) <= 24 && parseInt(hMatch[1], 10) <= 24) continue;
    addViolation(file, 'svg-no-viewbox', lineOf(html, mm.index),
      '<svg> without viewBox — won\'t scale responsively',
      excerptAt(html, mm.index));
  }

  // Check 4 — <img>/<svg> with explicit pixel width but no max-width.
  //   Key exemption: <svg> tags that carry a viewBox are scale-invariant
  //   when the page has a global `svg{max-width:100%}` stylesheet rule
  //   (the house-style default, lifted from category-theory.html). Under
  //   that regime, width="620" on an <svg viewBox="..."> is a drawing-space
  //   size, not a CSS pixel size — flagging it is pure noise.
  const mediaTagRe = /<(img|svg)\b[^>]*>/gi;
  while ((mm = mediaTagRe.exec(html))) {
    if (inSkip(mm.index)) continue;
    const tag = mm[0];
    const tagName = mm[1].toLowerCase();
    // width= in px (attribute form, numeric) or CSS `width:Npx` in style.
    const attrW = tag.match(/\bwidth\s*=\s*["']?(\d{2,4})\b/i);
    const styleW = tag.match(/style\s*=\s*["'][^"']*\bwidth\s*:\s*(\d{2,4})px/i);
    if (!attrW && !styleW) continue;
    // Does it have any form of max-width? (attribute or in style)
    const hasMaxWidth = /\bmax-width\s*[:=]/i.test(tag);
    // Skip tags with 100%-style widths in inline style.
    const styleAny = tag.match(/style\s*=\s*["']([^"']*)["']/i);
    const styleStr = styleAny ? styleAny[1] : '';
    if (/\bwidth\s*:\s*100\s*%/i.test(styleStr)) continue;
    if (hasMaxWidth) continue;
    // Global CSS cap exemption (SVGs only): if the stylesheet declares
    // svg{max-width:100%} and this svg has a viewBox, it scales.
    if (tagName === 'svg' && hasGlobalSvgCap && /\bviewBox\s*=/i.test(tag)) continue;
    // Thumb/icon exemption: small SVGs (both dimensions ≤ 120px) with a
    // viewBox can never exceed a phone viewport and are clearly decorative
    // thumbs, not content diagrams — skip them.
    if (tagName === 'svg' && /\bviewBox\s*=/i.test(tag)) {
      const hMatch = tag.match(/\bheight\s*=\s*["']?(\d+)/i);
      if (attrW && hMatch &&
          parseInt(attrW[1], 10) <= 120 &&
          parseInt(hMatch[1], 10) <= 120) continue;
    }
    addViolation(file, 'media-no-max-width', lineOf(html, mm.index),
      `<${tagName}> has fixed pixel width without max-width`,
      excerptAt(html, mm.index));
  }

  // Check 5 — overflow hazards.
  //   5a. white-space: nowrap on a "wide prose" selector. Skip when the
  //       rule clearly targets a narrow element (table cell, nav chip,
  //       pill, badge, tab, toc entry): those are meant to stay on one
  //       line and have no prose-overflow risk.
  const nowrapRe = /white-space\s*:\s*nowrap/gi;
  const narrowTargetRe = /\b(td|th|tr|nav|\.toc|\.sidetoc|\.pill|\.tag|\.badge|\.chip|\.tab|\.crumb|\.breadcrumb|\.label|\.pager|\.kbd)\b/i;
  while ((mm = nowrapRe.exec(html))) {
    if (inAnyRange(mm.index, ranges)) continue;
    if (inSkip(mm.index)) continue;
    // Grab the selector (scan back to '{').
    let b = mm.index;
    while (b > 0 && html[b] !== '{') b--;
    let a = b - 1;
    while (a > 0 && html[a] !== '}' && html[a] !== '>' && b - a < 240) a--;
    const selector = html.slice(a + 1, b).trim();
    if (selector && narrowTargetRe.test(selector)) continue;
    addViolation(file, 'overflow-hazard', lineOf(html, mm.index),
      'white-space: nowrap — may overflow narrow viewports',
      excerptAt(html, mm.index));
  }
  //   5b. overflow: hidden on a block that does not also declare
  //       overflow-x: auto|scroll within a small window. Heuristic: look
  //       at 120 chars of context (same rule-body) for overflow-x:.
  const oflowRe = /overflow\s*:\s*hidden\b/gi;
  while ((mm = oflowRe.exec(html))) {
    if (inAnyRange(mm.index, ranges)) continue;
    if (inSkip(mm.index)) continue;
    const ctx = html.slice(Math.max(0, mm.index - 120), Math.min(html.length, mm.index + 120));
    if (/overflow-x\s*:\s*(auto|scroll)/i.test(ctx)) continue;
    if (/overflow-y\s*:\s*(auto|scroll)/i.test(ctx)) continue;
    addViolation(file, 'overflow-hazard', lineOf(html, mm.index),
      'overflow: hidden without overflow-x: auto — horizontal content may be clipped',
      excerptAt(html, mm.index));
  }

  // Check 6 — media-query count (informational; zero-flag for complex pages).
  const mqCount = (html.match(/@media\b/gi) || []).length;
  perFile.get(file).mediaCount = mqCount;
  // Flag pages with 0 media queries explicitly — those are the "suspect"
  // ones per spec. Informational, counts toward totals.
  if (mqCount === 0) {
    addViolation(file, 'media-queries', 1,
      'page declares 0 @media rules — no responsive breakpoints',
      '');
  }

  // Check 7 — large pixel font-size outside @media, not on h1/h2.
  //   Look for declarations in <style> blocks. Grab the selector that
  //   precedes the rule body via a back-scan for the most recent `{`.
  const fontRe = /font-size\s*:\s*(\d{2,3})px/gi;
  while ((mm = fontRe.exec(html))) {
    const px = parseInt(mm[1], 10);
    if (px <= 24) continue;
    if (inAnyRange(mm.index, ranges)) continue;
    if (inSkip(mm.index)) continue;
    // Find selector by scanning back for the opening `{` of this rule.
    let b = mm.index;
    while (b > 0 && html[b] !== '{') b--;
    // Then back up further across whitespace to grab the selector text up
    // to the previous `}` or `>` (end of previous rule or end of <style>
    // opening tag).
    let a = b - 1;
    while (a > 0 && html[a] !== '}' && html[a] !== '>' && b - a < 240) a--;
    const selector = html.slice(a + 1, b).trim().toLowerCase();
    // Skip explicit h1/h2 selectors.
    const heading = /(^|[\s,>+~])(h1|h2)(\s*[,{:]|$)/.test(selector)
                 || /^(h1|h2)\b/.test(selector);
    if (heading) continue;
    // Skip if declaration is inside a style="..." inline attr on an <h1>/<h2>.
    // Back-scan for the opening tag.
    let t = mm.index;
    while (t > 0 && html[t] !== '<' && mm.index - t < 200) t--;
    if (html[t] === '<') {
      const tagStart = html.slice(t, mm.index);
      if (/^<\s*h[12]\b/i.test(tagStart)) continue;
    }
    addViolation(file, 'large-font', lineOf(html, mm.index),
      `font-size: ${px}px outside @media, not on h1/h2 — may overflow narrow screens`,
      excerptAt(html, mm.index));
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Report.

console.log(`audit-responsive: scanned ${htmlFiles.length} page(s)\n`);

let totalViolations = 0;
for (const file of htmlFiles) {
  const info = perFile.get(file);
  if (!info || info.violations.length === 0) continue;
  totalViolations += info.violations.length;
  // Group violations by check for readable output.
  const groups = new Map();
  for (const v of info.violations) {
    if (!groups.has(v.check)) groups.set(v.check, []);
    groups.get(v.check).push(v);
  }
  console.log(`── ${file}  (media-queries: ${info.mediaCount}, ${info.violations.length} finding(s))`);
  for (const check of CHECKS) {
    const list = groups.get(check);
    if (!list || list.length === 0) continue;
    console.log(`   [${check}] ${list.length}`);
    for (const v of list.slice(0, 6)) {
      const loc = `L${v.line}`.padStart(6);
      const ex = v.excerpt ? `  ${v.excerpt}` : '';
      console.log(`     ${loc}  ${v.msg}${ex ? '\n            ' + v.excerpt : ''}`);
    }
    if (list.length > 6) console.log(`            … +${list.length - 6} more`);
  }
  console.log('');
}

console.log('── Totals per check');
for (const c of CHECKS) {
  console.log(`   ${c.padEnd(22)} ${totals[c]}`);
}
console.log(`   ${'TOTAL'.padEnd(22)} ${totalViolations}`);
console.log('\naudit-responsive: advisory mode — exiting 0.');
process.exit(0);
