#!/usr/bin/env node
// Re-orders <a class="card"> blocks inside each <div class="grid"> in
// index.html by pedagogical tier — prereq → (intermediate, no badge) →
// advanced → capstone. Within each tier, preserves the original order
// (stable sort) so subject matter that is already logically sequenced
// stays put.
//
// Tier is detected via the level-badge span class:
//   <span class="level prereq">     → tier 0
//   (no level badge)                → tier 1
//   <span class="level advanced">   → tier 2
//   <span class="level capstone">   → tier 3
//
// Idempotent: running twice produces the same output. Run via:
//   node scripts/reorder-section-cards.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const path = resolve(repoRoot, 'index.html');

const TIERS = { prereq: 0, default: 1, advanced: 2, capstone: 3 };

function tierOf(cardHtml) {
  const m = cardHtml.match(/<span class="level\s+(prereq|advanced|capstone)">/);
  return m ? TIERS[m[1]] : TIERS.default;
}

// Walks the body of one .grid block and returns { head, cards, tail } where
// `cards` is an array of card HTML strings (each preserving its leading
// whitespace), `head` is the run of whitespace+text between `<div class="grid">`
// and the first card, and `tail` is the trailing whitespace before the
// closing `</div>`.
function parseGrid(gridBody) {
  // Find each <a class="card ..." ...> ... </a> as one chunk.
  const re = /([ \t]*\n*\s*)(<a class="card[^"]*"[\s\S]*?<\/a>\s*)/g;
  const cards = [];
  let firstStart = -1;
  let lastEnd = 0;
  let m;
  while ((m = re.exec(gridBody)) !== null) {
    if (firstStart < 0) firstStart = m.index;
    cards.push({ leading: m[1], body: m[2] });
    lastEnd = re.lastIndex;
  }
  const head = firstStart < 0 ? gridBody : gridBody.slice(0, firstStart);
  const tail = firstStart < 0 ? '' : gridBody.slice(lastEnd);
  return { head, cards, tail };
}

function reorderGrid(gridBody) {
  const parsed = parseGrid(gridBody);
  if (!parsed.cards.length) return gridBody;
  // Stable sort by tier, preserving in-tier order.
  const indexed = parsed.cards.map((c, i) => ({
    leading: c.leading,
    body: c.body,
    tier: tierOf(c.body),
    idx: i,
  }));
  indexed.sort((a, b) => (a.tier - b.tier) || (a.idx - b.idx));
  // Reassemble: re-stitch each card with its captured leading whitespace.
  const reassembled = indexed.map((c) => c.leading + c.body).join('');
  return parsed.head + reassembled + parsed.tail;
}

function findMatchingDivClose(html, openIdx) {
  // openIdx points at the start of `<div class="grid">`. Walk forward
  // tracking <div ...> depth so we find the close that balances this open
  // (cards have many internal <div> elements).
  const openTag = '<div class="grid">';
  let depth = 1;
  let i = openIdx + openTag.length;
  while (i < html.length) {
    const nextOpen = html.indexOf('<div', i);
    const nextClose = html.indexOf('</div>', i);
    if (nextClose < 0) return -1;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 4;
    } else {
      depth--;
      if (depth === 0) return nextClose;
      i = nextClose + 6;
    }
  }
  return -1;
}

function transform(html) {
  let count = 0;
  let cursor = 0;
  const openTag = '<div class="grid">';
  let out = '';
  while (cursor < html.length) {
    const openIdx = html.indexOf(openTag, cursor);
    if (openIdx < 0) {
      out += html.slice(cursor);
      break;
    }
    out += html.slice(cursor, openIdx + openTag.length);
    const closeIdx = findMatchingDivClose(html, openIdx);
    if (closeIdx < 0) {
      // Unbalanced HTML beyond this grid — refusing to write a partial /
      // truncated index.html because it would corrupt the file silently.
      // This is a hard structural invariant violation; bail.
      const lineNum = html.slice(0, openIdx).split('\n').length;
      throw new Error(
        `reorder-section-cards: unbalanced <div> after <div class="grid"> at line ${lineNum}; ` +
        `aborting without writing to keep index.html intact.`
      );
    }
    const body = html.slice(openIdx + openTag.length, closeIdx);
    const next = reorderGrid(body);
    if (next !== body) count++;
    out += next;
    cursor = closeIdx;
  }
  return { out, count };
}

const original = readFileSync(path, 'utf8');
const { out, count } = transform(original);
if (out === original) {
  console.log('reorder-section-cards: no changes');
  process.exit(0);
}
writeFileSync(path, out);
console.log(`reorder-section-cards: reordered ${count} grid block(s)`);
