#!/usr/bin/env node
// Keep `index.html`'s hero-tagline counts honest — topic and concept totals
// should reflect the actual corpus, not hand-edited numbers that drift.
//
// The hero tagline in `<section class="hero">` looks like:
//
//   <div class="hero-tagline" aria-label="Notebook scope">
//     <span><span class="tg-num">56</span> topics</span>
//     <span class="dot">&middot;</span>
//     <span><span class="tg-num">324</span> concepts</span>
//     <span class="dot">&middot;</span>
//     <span>pathway-graph explorer</span>
//   </div>
//
// This script walks the `.hero-tagline` block, finds the two `.tg-num`
// spans, and rewrites their inner text to the live counts derived from
// `concepts/index.json` (topics) and every `concepts/<topic>.json`
// (concepts). Idempotent — re-run produces no diff once synchronized.
//
// CLI:
//   node scripts/inject-index-stats.mjs        — audit (exit 1 if stale)
//   node scripts/inject-index-stats.mjs --fix  — rewrite in place
//
// Zero external deps.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const FIX = process.argv.slice(2).includes('--fix');
const indexPath = join(repoRoot, 'index.html');
const conceptsDir = join(repoRoot, 'concepts');

if (!existsSync(indexPath)) {
  console.error('inject-index-stats: index.html not found');
  process.exit(2);
}

// ----- Compute live counts -----

const registry = JSON.parse(readFileSync(join(conceptsDir, 'index.json'), 'utf8'));
const topicIds = Array.isArray(registry.topics) ? registry.topics : [];
const topicCount = topicIds.length;

let conceptCount = 0;
for (const t of topicIds) {
  const p = join(conceptsDir, `${t}.json`);
  if (!existsSync(p)) continue;
  try {
    const j = JSON.parse(readFileSync(p, 'utf8'));
    if (Array.isArray(j.concepts)) conceptCount += j.concepts.length;
  } catch {
    /* parse errors are validate-concepts.mjs's job */
  }
}

// ----- Patch hero-tagline -----

const html = readFileSync(indexPath, 'utf8');

const taglineRe =
  /(<div class="hero-tagline"[^>]*>)([\s\S]*?)(<\/div>)/;
const taglineMatch = html.match(taglineRe);
if (!taglineMatch) {
  console.error('inject-index-stats: <div class="hero-tagline"> not found in index.html');
  process.exit(2);
}

const open = taglineMatch[1];
const inner = taglineMatch[2];
const close = taglineMatch[3];

// Tagline body has two adjacent `<span class="tg-num">N</span> topics` and
// `<span class="tg-num">N</span> concepts` fragments. Rewrite both.
const topicRe = /(<span class="tg-num">)(\d+)(<\/span>\s*topics)/;
const conceptRe = /(<span class="tg-num">)(\d+)(<\/span>\s*concepts)/;

let newInner = inner;
let oldTopicN = null;
let oldConceptN = null;

newInner = newInner.replace(topicRe, (_, a, n, b) => {
  oldTopicN = parseInt(n, 10);
  return `${a}${topicCount}${b}`;
});
newInner = newInner.replace(conceptRe, (_, a, n, b) => {
  oldConceptN = parseInt(n, 10);
  return `${a}${conceptCount}${b}`;
});

if (oldTopicN === null || oldConceptN === null) {
  console.error(
    'inject-index-stats: could not locate both `.tg-num` spans for topics and concepts'
  );
  process.exit(2);
}

const topicDrift = oldTopicN !== topicCount;
const conceptDrift = oldConceptN !== conceptCount;
const changed = topicDrift || conceptDrift;

if (!changed) {
  console.log(
    `inject-index-stats: in sync (${topicCount} topics, ${conceptCount} concepts)`
  );
  process.exit(0);
}

if (!FIX) {
  if (topicDrift)
    console.error(
      `  index.html hero-tagline: topics ${oldTopicN} → ${topicCount} (drift)`
    );
  if (conceptDrift)
    console.error(
      `  index.html hero-tagline: concepts ${oldConceptN} → ${conceptCount} (drift)`
    );
  console.error(`inject-index-stats: drift detected — run with --fix`);
  process.exit(1);
}

const newHtml = html.replace(taglineRe, `${open}${newInner}${close}`);
writeFileSync(indexPath, newHtml, 'utf8');

const bits = [];
if (topicDrift) bits.push(`topics ${oldTopicN} → ${topicCount}`);
if (conceptDrift) bits.push(`concepts ${oldConceptN} → ${conceptCount}`);
console.log(`inject-index-stats: updated index.html hero-tagline (${bits.join(', ')})`);
process.exit(0);
