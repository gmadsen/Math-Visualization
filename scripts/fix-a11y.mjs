#!/usr/bin/env node
// Backfill accessibility attributes the audit surfaces but does not fix.
//
// Complements scripts/audit-accessibility.mjs — that script enumerates
// violations but makes no edits. This one handles the two highest-volume
// categories mechanically:
//
//   1. Content-page <svg> without <title>/<desc>/aria-label.
//      For every <svg> inside a <div class="widget"> (but NOT inside a
//      <div class="thumb">), insert <title>{titleText}</title> as the first
//      child. titleText is derived from the enclosing widget's
//      <{span|div} class="ttl">, falling back to the enclosing <section>'s
//      <h2> text, falling back to "Widget illustration".
//
//   2. <input id="X"> whose nearby <label> has no for= attribute.
//      Visible inputs (type != hidden/submit/reset/button) without
//      aria-label, aria-labelledby, or an enclosing <label> and whose id is
//      not already the target of some label's for= attribute get their
//      "nearby" label wired up. Nearby = same <div class="row"> OR within
//      300 characters before or after the input tag.
//
// Modes:
//   node scripts/fix-a11y.mjs          audit mode. Per-file counts, totals.
//                                      Exit 0 (advisory — audit-accessibility
//                                      script already gates).
//   node scripts/fix-a11y.mjs --fix    apply the backfill. Idempotent — a
//                                      second run produces 0 changes.
//
// Zero dependencies.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const argv = process.argv.slice(2);
const FIX = argv.includes('--fix');

// Pages the accessibility audit intentionally skips landing-level scaffolds
// for — but for this fix we want to operate on every repo HTML. Naked SVG
// and missing-label checks are equally valid on index.html / pathway.html
// etc. The audit already scans them; we match its scope.
const htmlFiles = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html'))
  .sort();

// ─────────────────────────────────────────────────────────────────────────
// Helpers.

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

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Strip HTML tags and collapse whitespace — used to derive title text from
// .ttl or <h2> markup. KaTeX source like "$\int_0^1 f$" is preserved (screen
// readers announce raw math notation, which is fine for alt-text fallback).
function stripTags(s) {
  return s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// Depth-balanced <div class="..."> extractor. Given `html`, the index of an
// already-matched opening tag (at `openStart`, tag ends at `openEnd`), returns
// the position of the matching </div> (start of the closer). Returns -1 on
// runaway.
function matchDivClose(html, openEnd) {
  const divOpenRe = /<div\b[^>]*>/gi;
  const divCloseRe = /<\/div\s*>/gi;
  divOpenRe.lastIndex = openEnd;
  divCloseRe.lastIndex = openEnd;
  let depth = 1;
  let safety = 0;
  while (depth > 0) {
    if (++safety > 100000) return -1;
    const savedOpen = divOpenRe.lastIndex;
    const savedClose = divCloseRe.lastIndex;
    const o = divOpenRe.exec(html);
    const c = divCloseRe.exec(html);
    if (!c) return -1;
    if (o && o.index < c.index) {
      depth++;
      divCloseRe.lastIndex = Math.max(savedClose, o.index + o[0].length);
    } else {
      depth--;
      if (depth === 0) return c.index;
      divOpenRe.lastIndex = Math.max(savedOpen, c.index + c[0].length);
    }
  }
  return -1;
}

// Return array of { outerStart, outerEnd, openEnd, innerEnd, body } for every
// <div class="widget"> on the page.
function findWidgets(html) {
  const widgets = [];
  const re = /<div\b[^>]*\bclass=["'][^"']*\bwidget\b[^"']*["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const openStart = m.index;
    const openEnd = m.index + m[0].length;
    const closeStart = matchDivClose(html, openEnd);
    if (closeStart === -1) continue;
    widgets.push({
      outerStart: openStart,
      outerEnd: closeStart + '</div>'.length,
      openEnd,
      innerEnd: closeStart,
      body: html.slice(openEnd, closeStart),
    });
    re.lastIndex = closeStart;
  }
  return widgets;
}

// <div class="thumb"> ranges on the landing pages. Naked <svg> inside thumbs
// stays naked — landing cards are decorative.
function findThumbRanges(html) {
  const ranges = [];
  const re = /<div\b[^>]*\bclass=["'][^"']*\bthumb\b[^"']*["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const openEnd = m.index + m[0].length;
    const closeStart = matchDivClose(html, openEnd);
    if (closeStart === -1) continue;
    ranges.push([m.index, closeStart + '</div>'.length]);
    re.lastIndex = closeStart;
  }
  return ranges;
}

function inRanges(idx, ranges) {
  for (const [a, b] of ranges) if (idx >= a && idx < b) return true;
  return false;
}

// Find every <section id="..."> on the page. Returns array of { start, end, h2 }
// where `end` is the position of the matching </section>, and `h2` is the
// inner text of the section's first <h2>, or "".
function findSectionsWithH2(html) {
  const out = [];
  const re = /<section\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(html))) {
    const openStart = m.index;
    const openEnd = m.index + m[0].length;
    // Find matching </section>. Sections don't nest in this codebase but
    // we use a depth-balanced walk anyway.
    const openRe = /<section\b[^>]*>/gi;
    const closeRe = /<\/section\s*>/gi;
    openRe.lastIndex = openEnd;
    closeRe.lastIndex = openEnd;
    let depth = 1;
    let safety = 0;
    let end = html.length;
    while (depth > 0) {
      if (++safety > 100000) break;
      const savedOpen = openRe.lastIndex;
      const savedClose = closeRe.lastIndex;
      const o = openRe.exec(html);
      const c = closeRe.exec(html);
      if (!c) break;
      if (o && o.index < c.index) {
        depth++;
        closeRe.lastIndex = Math.max(savedClose, o.index + o[0].length);
      } else {
        depth--;
        if (depth === 0) { end = c.index; break; }
        openRe.lastIndex = Math.max(savedOpen, c.index + c[0].length);
      }
    }
    const body = html.slice(openEnd, end);
    const h2m = body.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i);
    const h2 = h2m ? stripTags(h2m[1]) : '';
    out.push({ start: openStart, end: end + '</section>'.length, h2 });
    re.lastIndex = end + '</section>'.length;
  }
  return out;
}

function sectionAt(sections, idx) {
  for (const s of sections) if (idx >= s.start && idx < s.end) return s;
  return null;
}

// Extract the widget's title text: inner text of the first
// <span class="ttl"> or <div class="ttl"> inside the widget body.
function widgetTitle(widgetBody) {
  const re = /<(?:span|div)\s+[^>]*\bclass=["'][^"']*\bttl\b[^"']*["'][^>]*>([\s\S]*?)<\/(?:span|div)>/i;
  const m = widgetBody.match(re);
  if (!m) return '';
  return stripTags(m[1]);
}

// Derive accessible title for an SVG inside a widget on a page.
function deriveTitle(widget, section) {
  const fromWidget = widgetTitle(widget.body);
  if (fromWidget) return fromWidget;
  if (section && section.h2) return section.h2.replace(/^\d+\.\s*/, '');
  return 'Widget illustration';
}

// ─────────────────────────────────────────────────────────────────────────
// SVG title backfill.
//
// Returns { changedHtml, stats: { inserted, fallback, skippedLabeled } }.
function backfillSvgs(html) {
  const thumbs = findThumbRanges(html);
  const widgets = findWidgets(html);
  const sections = findSectionsWithH2(html);

  // We patch from end → start so offsets don't invalidate.
  const patches = [];
  let insertedReal = 0;
  let insertedFallback = 0;
  let skippedLabeled = 0;

  for (const w of widgets) {
    // Skip widgets that happen to sit inside a thumb (shouldn't occur, but cheap).
    if (inRanges(w.outerStart, thumbs)) continue;

    // Find every <svg …>…</svg> inside this widget's body.
    const svgRe = /<svg\b([^>]*)>([\s\S]*?)<\/svg>/gi;
    let m;
    while ((m = svgRe.exec(w.body))) {
      const absStart = w.openEnd + m.index;
      // Skip if in thumb (paranoia).
      if (inRanges(absStart, thumbs)) continue;

      const openTag = `<svg${m[1]}>`;
      const inner = m[2];

      // Labeled already — skip.
      if (hasAttr(openTag, 'aria-label')) { skippedLabeled++; continue; }
      if (hasAttr(openTag, 'aria-labelledby')) { skippedLabeled++; continue; }
      if (/<title\b/i.test(inner)) { skippedLabeled++; continue; }
      if (/<desc\b/i.test(inner)) { skippedLabeled++; continue; }

      const section = sectionAt(sections, w.outerStart);
      const fromWidget = widgetTitle(w.body);
      const fromH2 = section && section.h2 ? section.h2.replace(/^\d+\.\s*/, '') : '';
      const titleText = fromWidget || fromH2 || 'Widget illustration';
      if (fromWidget) insertedReal++;
      else insertedFallback++;

      const insertAt = absStart + openTag.length;
      const titleTag = `<title>${escapeHtml(titleText)}</title>`;
      patches.push({ at: insertAt, text: titleTag });
    }
  }

  if (patches.length === 0) {
    return { changedHtml: html, stats: { inserted: 0, fallback: 0, skippedLabeled } };
  }

  // Apply from end to start.
  patches.sort((a, b) => b.at - a.at);
  let out = html;
  for (const p of patches) out = out.slice(0, p.at) + p.text + out.slice(p.at);

  return {
    changedHtml: out,
    stats: {
      inserted: insertedReal + insertedFallback,
      real: insertedReal,
      fallback: insertedFallback,
      skippedLabeled,
    },
  };
}

// Audit-only variant: count naked SVGs without editing.
function countNakedSvgs(html) {
  const thumbs = findThumbRanges(html);
  const widgets = findWidgets(html);
  let n = 0;
  for (const w of widgets) {
    if (inRanges(w.outerStart, thumbs)) continue;
    const svgRe = /<svg\b([^>]*)>([\s\S]*?)<\/svg>/gi;
    let m;
    while ((m = svgRe.exec(w.body))) {
      const absStart = w.openEnd + m.index;
      if (inRanges(absStart, thumbs)) continue;
      const openTag = `<svg${m[1]}>`;
      const inner = m[2];
      if (hasAttr(openTag, 'aria-label')) continue;
      if (hasAttr(openTag, 'aria-labelledby')) continue;
      if (/<title\b/i.test(inner)) continue;
      if (/<desc\b/i.test(inner)) continue;
      n++;
    }
  }
  return n;
}

// ─────────────────────────────────────────────────────────────────────────
// Input label backfill.
//
// Plan:
//   - Collect every <label>…</label> pair: { openStart, openEnd, closeStart,
//     closeEnd, forId, inner }.
//   - Collect every <input …> tag we care about (id set, visible type, not
//     already labeled through aria-*, for=, or wrapping label).
//   - For each such input, find a "nearby" label: first a label already in
//     the same <div class="row">; else any label whose span [openStart,
//     closeEnd] intersects [input - 300, input + 300]; pick the closest
//     candidate that does NOT already carry for= (unused).
//   - Add for="<id>" to that label.

// Find every <label …>…</label>. Labels don't nest in this codebase but we
// use a greedy-safe walk (no nested label support; just sequential pairs).
function findLabels(html) {
  const out = [];
  const re = /<label\b([^>]*)>([\s\S]*?)<\/label\s*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const openStart = m.index;
    const openTagLen = m[0].indexOf('>') + 1;
    const openEnd = openStart + openTagLen;
    const closeEnd = m.index + m[0].length;
    const closeStart = closeEnd - '</label>'.length;
    out.push({
      openStart,
      openEnd,
      closeStart,
      closeEnd,
      openTag: m[0].slice(0, openTagLen),
      forId: attr(m[0].slice(0, openTagLen), 'for') || null,
      inner: m[2],
    });
  }
  return out;
}

// Find <div class="row"> ranges (depth-balanced) — used as a "nearness" frame.
function findRowRanges(html) {
  const ranges = [];
  const re = /<div\b[^>]*\bclass=["'][^"']*\brow\b[^"']*["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const openEnd = m.index + m[0].length;
    const closeStart = matchDivClose(html, openEnd);
    if (closeStart === -1) continue;
    ranges.push([m.index, closeStart + '</div>'.length]);
    re.lastIndex = closeStart;
  }
  return ranges;
}

// Find a `<label>` that already contains the input span (wrapping form).
function isInsideLabel(inputStart, labels) {
  return labels.some(
    (l) => inputStart >= l.openEnd && inputStart < l.closeStart
  );
}

// Gather the set of ids that are already targets of a label for= attribute.
function labelForIds(labels) {
  const s = new Set();
  for (const l of labels) if (l.forId) s.add(l.forId);
  return s;
}

function rowContaining(idx, rowRanges) {
  for (let i = 0; i < rowRanges.length; i++) {
    const [a, b] = rowRanges[i];
    if (idx >= a && idx < b) return [a, b];
  }
  return null;
}

// Return the label (from `candidates`, i.e. labels with no for=) to wire to
// this input, or null if no suitable candidate.
//
// Scoring: prefer a label in the same row if exactly one qualifies; otherwise
// pick the candidate whose closeEnd is closest to the input start (and within
// 300 chars), provided no other input sits between them.
function pickLabelFor(input, candidates, allInputs, rowRanges) {
  const row = rowContaining(input.start, rowRanges);
  let pool = candidates;
  if (row) {
    const inRow = candidates.filter(
      (l) => l.openStart >= row[0] && l.closeEnd <= row[1]
    );
    if (inRow.length === 1) {
      // One label, one input in the row? that's the canonical pattern.
      // If there are multiple inputs in this row, fall through to distance
      // ranking so we don't mis-wire.
      const inputsInRow = allInputs.filter(
        (x) => x.start >= row[0] && x.start < row[1]
      );
      if (inputsInRow.length === 1) return inRow[0];
      pool = inRow;
    } else if (inRow.length > 1) {
      pool = inRow;
    }
  }

  // Distance ranking — closest label within 300 chars, no other input between.
  let best = null;
  let bestDist = Infinity;
  for (const l of pool) {
    // Distance: label closer to input by edge-to-edge.
    let dist;
    if (l.closeEnd <= input.start) dist = input.start - l.closeEnd;
    else if (l.openStart >= input.end) dist = l.openStart - input.end;
    else continue; // overlapping: weird, skip
    if (dist > 300) continue;

    // Reject if another input sits strictly between label and input. That
    // label probably belongs to the other input.
    const lo = Math.min(l.closeEnd, input.start);
    const hi = Math.max(l.openStart, input.end);
    const interloper = allInputs.some(
      (x) => x !== input && x.start > lo && x.end < hi
    );
    if (interloper) continue;

    if (dist < bestDist) {
      bestDist = dist;
      best = l;
    }
  }
  return best;
}

function backfillLabels(html) {
  const labels = findLabels(html);
  const rowRanges = findRowRanges(html);
  const forIds = labelForIds(labels);
  const candidates = labels.filter((l) => !l.forId);

  // Collect all <input …> we care about.
  const inputRe = /<input\b([^>]*)\/?>/gi;
  const allInputs = [];
  let im;
  while ((im = inputRe.exec(html))) {
    const start = im.index;
    const end = im.index + im[0].length;
    const openTag = im[0];
    const type = (attr(openTag, 'type') || 'text').toLowerCase();
    const id = attr(openTag, 'id');
    allInputs.push({ start, end, openTag, type, id });
  }

  // Filter to inputs we want to fix.
  const toFix = [];
  let skippedNoId = 0;
  let skippedLabeled = 0;
  let skippedHidden = 0;
  for (const input of allInputs) {
    if (
      input.type === 'hidden' ||
      input.type === 'submit' ||
      input.type === 'reset' ||
      input.type === 'button'
    ) { skippedHidden++; continue; }

    // Already labeled?
    if (hasAttr(input.openTag, 'aria-label') && attr(input.openTag, 'aria-label')?.trim()) {
      skippedLabeled++; continue;
    }
    if (hasAttr(input.openTag, 'aria-labelledby')) { skippedLabeled++; continue; }
    if (isInsideLabel(input.start, labels)) { skippedLabeled++; continue; }
    if (input.id && forIds.has(input.id)) { skippedLabeled++; continue; }

    if (!input.id) { skippedNoId++; continue; }

    toFix.push(input);
  }

  // Pick label for each and build patches. Each patch adds for="<id>" to a
  // label's opening tag. Guard against two inputs claiming the same label
  // (first come, first served — the second input is skipped and logged).
  const claimedLabels = new Set();
  const patches = [];
  let wired = 0;
  let noCandidate = 0;

  for (const input of toFix) {
    // Refresh candidate list each time, dropping already-claimed ones.
    const avail = candidates.filter(
      (l) => !claimedLabels.has(l.openStart)
    );
    const pick = pickLabelFor(input, avail, allInputs, rowRanges);
    if (!pick) { noCandidate++; continue; }
    claimedLabels.add(pick.openStart);
    wired++;

    // Build replacement for the label's open tag: insert for="<id>" just
    // before the closing '>'.
    const openTag = pick.openTag;
    const lastGt = openTag.lastIndexOf('>');
    const isSelfClosing = openTag[lastGt - 1] === '/';
    const before = openTag.slice(0, isSelfClosing ? lastGt - 1 : lastGt).replace(/\s+$/, '');
    const after = openTag.slice(isSelfClosing ? lastGt - 1 : lastGt);
    const newOpenTag = `${before} for="${input.id}"${after}`;
    patches.push({ at: pick.openStart, oldLen: openTag.length, text: newOpenTag });
  }

  if (patches.length === 0) {
    return {
      changedHtml: html,
      stats: { wired: 0, noCandidate, skippedLabeled, skippedHidden, skippedNoId },
    };
  }

  patches.sort((a, b) => b.at - a.at);
  let out = html;
  for (const p of patches) out = out.slice(0, p.at) + p.text + out.slice(p.at + p.oldLen);

  return {
    changedHtml: out,
    stats: { wired, noCandidate, skippedLabeled, skippedHidden, skippedNoId },
  };
}

// Audit-only variant: count inputs the audit would flag.
function countMissingLabels(html) {
  const labels = findLabels(html);
  const forIds = labelForIds(labels);
  const inputRe = /<input\b([^>]*)\/?>/gi;
  let n = 0;
  let im;
  while ((im = inputRe.exec(html))) {
    const openTag = im[0];
    const type = (attr(openTag, 'type') || 'text').toLowerCase();
    if (type === 'hidden' || type === 'submit' || type === 'reset' || type === 'button') continue;
    if (hasAttr(openTag, 'aria-label') && attr(openTag, 'aria-label')?.trim()) continue;
    if (hasAttr(openTag, 'aria-labelledby')) continue;
    if (isInsideLabel(im.index, labels)) continue;
    const id = attr(openTag, 'id');
    if (id && forIds.has(id)) continue;
    n++;
  }
  return n;
}

// ─────────────────────────────────────────────────────────────────────────
// Main.

const totals = {
  svgInserted: 0,
  svgReal: 0,
  svgFallback: 0,
  svgSkipped: 0,
  labelsWired: 0,
  labelsSkipped: 0,
  nakedSvgs: 0,
  missingLabels: 0,
  pagesTouched: 0,
};

const perFile = [];

for (const file of htmlFiles) {
  const abs = join(repoRoot, file);
  const html = readFileSync(abs, 'utf8');
  const nakedBefore = countNakedSvgs(html);
  const missingBefore = countMissingLabels(html);
  totals.nakedSvgs += nakedBefore;
  totals.missingLabels += missingBefore;

  if (!FIX) {
    if (nakedBefore || missingBefore) {
      perFile.push({ file, nakedBefore, missingBefore, nakedAfter: nakedBefore, missingAfter: missingBefore, wired: 0, svgInserted: 0 });
    }
    continue;
  }

  // Fix mode.
  const r1 = backfillSvgs(html);
  const r2 = backfillLabels(r1.changedHtml);
  const newHtml = r2.changedHtml;

  const svgInserted = r1.stats.inserted || 0;
  const svgReal = r1.stats.real || 0;
  const svgFallback = r1.stats.fallback || 0;
  const wired = r2.stats.wired || 0;
  const noCandidate = r2.stats.noCandidate || 0;

  totals.svgInserted += svgInserted;
  totals.svgReal += svgReal;
  totals.svgFallback += svgFallback;
  totals.svgSkipped += r1.stats.skippedLabeled || 0;
  totals.labelsWired += wired;
  totals.labelsSkipped += noCandidate;

  if (newHtml !== html) {
    writeFileSync(abs, newHtml);
    totals.pagesTouched++;
  }

  const nakedAfter = countNakedSvgs(newHtml);
  const missingAfter = countMissingLabels(newHtml);
  if (nakedBefore || missingBefore || svgInserted || wired) {
    perFile.push({
      file,
      nakedBefore,
      nakedAfter,
      missingBefore,
      missingAfter,
      svgInserted,
      wired,
      noCandidate,
    });
  }
}

// ─── Report ────────────────────────────────────────────────────────────────
if (!FIX) {
  console.log(`fix-a11y: audit mode — ${htmlFiles.length} file(s) scanned`);
  console.log('');
  if (perFile.length === 0) {
    console.log('  (no findings)');
  } else {
    const nameW = Math.max(...perFile.map((p) => p.file.length), 10);
    console.log(
      '  ' + 'page'.padEnd(nameW) + '  ' + 'naked svg'.padStart(9) + '  ' + 'inputs'.padStart(7)
    );
    console.log('  ' + '-'.repeat(nameW) + '  ---------  -------');
    for (const p of perFile) {
      console.log(
        '  ' +
          p.file.padEnd(nameW) +
          '  ' +
          String(p.nakedBefore).padStart(9) +
          '  ' +
          String(p.missingBefore).padStart(7)
      );
    }
  }
  console.log('');
  console.log(`  totals:  naked <svg>: ${totals.nakedSvgs}   inputs missing label: ${totals.missingLabels}`);
  console.log('');
  console.log('(advisory — exit 0; run with --fix to backfill)');
  process.exit(0);
}

// FIX report.
console.log(`fix-a11y --fix: ${htmlFiles.length} file(s) scanned, ${totals.pagesTouched} touched`);
console.log('');
if (perFile.length === 0) {
  console.log('  (nothing to fix)');
} else {
  const nameW = Math.max(...perFile.map((p) => p.file.length), 10);
  console.log(
    '  ' +
      'page'.padEnd(nameW) +
      '  ' +
      'svg+'.padStart(5) +
      '  ' +
      'svg→'.padStart(5) +
      '  ' +
      'lbl+'.padStart(5) +
      '  ' +
      'lbl→'.padStart(5)
  );
  console.log('  ' + '-'.repeat(nameW) + '  -----  -----  -----  -----');
  for (const p of perFile) {
    console.log(
      '  ' +
        p.file.padEnd(nameW) +
        '  ' +
        String(p.svgInserted).padStart(5) +
        '  ' +
        String(p.nakedAfter).padStart(5) +
        '  ' +
        String(p.wired).padStart(5) +
        '  ' +
        String(p.missingAfter).padStart(5)
    );
  }
}
console.log('');
console.log(`  svg <title> inserted: ${totals.svgInserted}  ` +
  `(real: ${totals.svgReal}, fallback: ${totals.svgFallback}, ` +
  `already labeled: ${totals.svgSkipped})`);
console.log(`  <label for=> wired:   ${totals.labelsWired}  ` +
  `(no candidate: ${totals.labelsSkipped})`);
console.log('');
process.exit(0);
