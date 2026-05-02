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
import { matchClose } from './lib/html-walk.mjs';

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

// Depth-balanced <div> matcher: returns the offset of the `<` of the matching
// </div>, or -1 on runaway. Thin shim over scripts/lib/html-walk.mjs's
// matchClose() preserved for the call-site shape (returns offset, not range).
function matchDivClose(html, openEnd) {
  const r = matchClose(html, openEnd, 'div');
  return r ? r.closeStart : -1;
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
// where `end` is one past the matching </section>, and `h2` is the inner text
// of the section's first <h2>, or "".
function findSectionsWithH2(html) {
  const out = [];
  const re = /<section\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(html))) {
    const openStart = m.index;
    const openEnd = m.index + m[0].length;
    const close = matchClose(html, openEnd, 'section');
    const innerEnd = close ? close.closeStart : html.length;
    const outerEnd = close ? close.closeEnd : html.length;
    const body = html.slice(openEnd, innerEnd);
    const h2m = body.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i);
    const h2 = h2m ? stripTags(h2m[1]) : '';
    out.push({ start: openStart, end: outerEnd, h2 });
    re.lastIndex = outerEnd;
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
//
// `sectionsOverride` is used when processing fragments from
// content/<topic>.json, where the <section> opener may live in a different
// `raw` block than the widget. Caller supplies a synthetic section spanning
// the whole fragment with the right h2 so the title fallback still works.
function backfillSvgs(html, sectionsOverride = null) {
  const thumbs = findThumbRanges(html);
  const inert = findInertRanges(html);
  // Drop widgets that fall inside <script>/<!-- --> ranges — those <svg>s are
  // either commented out or template-string demos, not real DOM.
  const widgets = findWidgets(html).filter((w) => !inRanges(w.outerStart, inert));
  const sections =
    sectionsOverride !== null ? sectionsOverride : findSectionsWithH2(html);

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
  const inert = findInertRanges(html);
  const widgets = findWidgets(html).filter((w) => !inRanges(w.outerStart, inert));
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

// Build the set of byte ranges to ignore when searching for inputs/labels:
// <script>…</script> blocks and <!-- … --> comments. Inputs/labels inside
// JS template strings or commented-out demo markup are not real DOM.
function findInertRanges(html) {
  const ranges = [];
  const scriptRe = /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi;
  let m;
  while ((m = scriptRe.exec(html))) ranges.push([m.index, m.index + m[0].length]);
  const commentRe = /<!--[\s\S]*?-->/g;
  while ((m = commentRe.exec(html))) ranges.push([m.index, m.index + m[0].length]);
  return ranges;
}

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
  const inert = findInertRanges(html);
  const labels = findLabels(html).filter((l) => !inRanges(l.openStart, inert));
  const rowRanges = findRowRanges(html);
  const forIds = labelForIds(labels);
  const candidates = labels.filter((l) => !l.forId);

  // Collect all <input …> we care about.
  const inputRe = /<input\b([^>]*)\/?>/gi;
  const allInputs = [];
  let im;
  while ((im = inputRe.exec(html))) {
    if (inRanges(im.index, inert)) continue;
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
  const inert = findInertRanges(html);
  const labels = findLabels(html).filter((l) => !inRanges(l.openStart, inert));
  const forIds = labelForIds(labels);
  const inputRe = /<input\b([^>]*)\/?>/gi;
  let n = 0;
  let im;
  while ((im = inputRe.exec(html))) {
    if (inRanges(im.index, inert)) continue;
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
// JSON-mode processing.
//
// Topic pages have `content/<topic>.json` as their source of truth; the
// rebuild chain's `test-roundtrip --fix` step renders HTML from JSON, so
// any patches applied directly to HTML get wiped on the next rebuild.
// For topic pages we walk the JSON's html-bearing strings (rawHead,
// rawBodyPrefix, each section's raw blocks, rawBodySuffix) and patch them
// in place, then write the JSON back.
//
// Returns { changed, stats, h2 } where stats matches the HTML-mode shape.
function patchFragment(html, sectionH2) {
  const sectionsOverride =
    sectionH2 != null
      ? [{ start: 0, end: html.length, h2: sectionH2 }]
      : null;
  const r1 = backfillSvgs(html, sectionsOverride);
  const r2 = backfillLabels(r1.changedHtml);
  return {
    newHtml: r2.changedHtml,
    changed: r2.changedHtml !== html,
    stats: {
      svgInserted: r1.stats.inserted || 0,
      svgReal: r1.stats.real || 0,
      svgFallback: r1.stats.fallback || 0,
      svgSkippedLabeled: r1.stats.skippedLabeled || 0,
      labelsWired: r2.stats.wired || 0,
      labelsNoCandidate: r2.stats.noCandidate || 0,
    },
  };
}

function bumpJsonStats(totals, r) {
  totals.svgInserted += r.svgInserted;
  totals.svgReal += r.svgReal;
  totals.svgFallback += r.svgFallback;
  totals.svgSkipped += r.svgSkippedLabeled;
  totals.labelsWired += r.labelsWired;
  totals.labelsSkipped += r.labelsNoCandidate;
}

// Pull <h2> text out of a section's raw blocks (first block usually carries
// the <section><h2> opener). Strip the leading "1. " ordinal so the synthetic
// title matches what findSectionsWithH2 produces.
function extractSectionH2(blocks) {
  for (const b of blocks) {
    if (b.type !== 'raw' || typeof b.html !== 'string') continue;
    const m = b.html.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i);
    if (m) return stripTags(m[1]).replace(/^\d+\.\s*/, '');
  }
  return null;
}

function processContentJson(jsonPath) {
  const before = readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(before);

  const stats = {
    nakedBefore: 0,
    missingBefore: 0,
    svgInserted: 0,
    svgReal: 0,
    svgFallback: 0,
    svgSkippedLabeled: 0,
    labelsWired: 0,
    labelsNoCandidate: 0,
  };

  const visit = (html, sectionH2) => {
    if (typeof html !== 'string') return html;
    stats.nakedBefore += countNakedSvgs(html);
    stats.missingBefore += countMissingLabels(html);
    if (!FIX) return html;
    const r = patchFragment(html, sectionH2);
    stats.svgInserted += r.stats.svgInserted;
    stats.svgReal += r.stats.svgReal;
    stats.svgFallback += r.stats.svgFallback;
    stats.svgSkippedLabeled += r.stats.svgSkippedLabeled;
    stats.labelsWired += r.stats.labelsWired;
    stats.labelsNoCandidate += r.stats.labelsNoCandidate;
    return r.newHtml;
  };

  data.rawHead = visit(data.rawHead, null);
  data.rawBodyPrefix = visit(data.rawBodyPrefix, null);
  if (Array.isArray(data.sections)) {
    for (const sec of data.sections) {
      if (!sec || !Array.isArray(sec.blocks)) continue;
      const h2 = extractSectionH2(sec.blocks);
      for (const block of sec.blocks) {
        if (block.type === 'raw') {
          block.html = visit(block.html, h2);
        } else if (block.type === 'widget' && !block.slug && typeof block.html === 'string') {
          // Inline (artifact-style) widget block: { type: 'widget', id, html,
          // script } with no registry slug. The naked-SVG fix applies to its
          // markup just like a raw block. Registry-driven widgets (with slug)
          // are rendered by widgets/<slug>/index.mjs and need a11y fixed there
          // instead.
          block.html = visit(block.html, h2);
        }
      }
    }
  }
  data.rawBodySuffix = visit(data.rawBodySuffix, null);

  let touched = false;
  if (FIX) {
    const after = JSON.stringify(data, null, 2) + '\n';
    if (after !== before) {
      writeFileSync(jsonPath, after);
      touched = true;
    }
  }

  return { ...stats, touched };
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

// Build the set of topic slugs (those with content/<topic>.json). For these,
// patches go to the JSON; HTML is regenerated by the roundtrip step.
const contentDir = join(repoRoot, 'content');
const topicSlugs = new Set(
  readdirSync(contentDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.slice(0, -'.json'.length))
);

for (const file of htmlFiles) {
  const slug = file.slice(0, -'.html'.length);

  if (topicSlugs.has(slug)) {
    // JSON-mode: patch content/<slug>.json.
    const jsonPath = join(contentDir, `${slug}.json`);
    const r = processContentJson(jsonPath);
    totals.nakedSvgs += r.nakedBefore;
    totals.missingLabels += r.missingBefore;
    if (FIX) {
      bumpJsonStats(totals, r);
      if (r.touched) totals.pagesTouched++;
      const nakedAfter = r.nakedBefore - r.svgInserted;
      const missingAfter = r.missingBefore - r.labelsWired;
      if (r.nakedBefore || r.missingBefore || r.svgInserted || r.labelsWired) {
        perFile.push({
          file,
          nakedBefore: r.nakedBefore,
          nakedAfter,
          missingBefore: r.missingBefore,
          missingAfter,
          svgInserted: r.svgInserted,
          wired: r.labelsWired,
        });
      }
    } else if (r.nakedBefore || r.missingBefore) {
      perFile.push({
        file,
        nakedBefore: r.nakedBefore,
        missingBefore: r.missingBefore,
        nakedAfter: r.nakedBefore,
        missingAfter: r.missingBefore,
        wired: 0,
        svgInserted: 0,
      });
    }
    continue;
  }

  // HTML-mode: landing/utility pages without a content JSON (index.html,
  // pathway.html, mindmap.html, etc.) — operate on the HTML directly. These
  // are not part of the roundtrip set so the patches persist.
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
