#!/usr/bin/env node
// Advisory audit of the auto-inserted "Used in" backlink graph.
//
// Companion to scripts/insert-used-in-backlinks.mjs. That script emits an
// <aside class="related"> on each concept section listing the concepts that
// declare this one as a prereq — the reverse adjacency of the concept DAG.
// This script analyses that same reverse adjacency (derived from
// concepts/*.json, not scraped from HTML, because the JSON is the source of
// truth) and reports quality signals about the resulting backlink graph.
//
// Advisory only. Always exits 0. Not wired into CI — run on demand.
//
// Metrics:
//   1. Backlink count per concept. Count of downstream consumers (concepts
//      that list this concept in their prereqs). Distribution: min, p50, p90,
//      max.
//   2. Dead-end concepts. Concepts with zero downstream consumers. Expected
//      for leaves at the edge of the DAG (e.g. capstones) but a large pool
//      of non-capstone dead-ends suggests under-connection.
//   3. Hub concepts. Concepts with very high backlink count (≥ p95). Natural
//      hubs like `group` or `continuity` are expected; anything surprising
//      there may be too generic.
//   4. Self-topic vs. cross-topic ratio per concept. Fraction of backlinks
//      that come from the same topic page vs. other topics. A low
//      cross-topic ratio on a hub means the concept isn't being invoked
//      beyond its home page.
//   5. Orphaned hub. Concept with many consumers but zero cross-topic reach
//      (all consumers live on the same topic page).
//
// Output: summary stats, top 10 hubs, top 10 dead-ends, top 10 orphaned
// hubs. Keep it short — it's advisory, the operator skims it.
//
// CLI: node scripts/audit-backlink-quality.mjs
// Zero external dependencies.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');

// ----- Load concept graph (same approach as insert-used-in-backlinks.mjs) -----
const indexPath = join(conceptsDir, 'index.json');
const topics = JSON.parse(readFileSync(indexPath, 'utf8')).topics;

// conceptId -> { topic, title }
const ownerOf = new Map();
// topic -> topic title
const topicTitle = new Map();
// all concepts in declaration order
const allConcepts = [];

for (const topic of topics) {
  const p = join(conceptsDir, `${topic}.json`);
  if (!existsSync(p)) continue;
  const d = JSON.parse(readFileSync(p, 'utf8'));
  topicTitle.set(topic, d.title || topic);
  for (const c of d.concepts || []) {
    if (ownerOf.has(c.id)) continue; // first-wins, matches inserter semantics
    ownerOf.set(c.id, { topic, title: c.title });
    allConcepts.push({ id: c.id, topic, title: c.title, prereqs: c.prereqs || [] });
  }
}

// ----- Build reverse adjacency: conceptId -> Array<consumer> -----
// Only count prereqs that resolve to an owned concept id (mirrors the
// inserter, which silently drops unknown ids).
const reverse = new Map();
for (const c of allConcepts) {
  for (const p of c.prereqs) {
    if (!ownerOf.has(p)) continue;
    if (!reverse.has(p)) reverse.set(p, []);
    reverse.get(p).push({ id: c.id, topic: c.topic, title: c.title });
  }
}

// ----- Per-concept stats -----
// For every concept (including dead-ends), collect:
//   total        = # of downstream consumers
//   sameTopic    = # of consumers living on the same topic page
//   crossTopic   = # of consumers living on a different topic page
//   crossRatio   = crossTopic / total  (NaN for dead-ends)
const stats = allConcepts.map((c) => {
  const consumers = reverse.get(c.id) || [];
  let sameTopic = 0;
  for (const cons of consumers) if (cons.topic === c.topic) sameTopic++;
  const crossTopic = consumers.length - sameTopic;
  return {
    id: c.id,
    topic: c.topic,
    title: c.title,
    total: consumers.length,
    sameTopic,
    crossTopic,
    crossRatio: consumers.length > 0 ? crossTopic / consumers.length : null,
  };
});

// ----- Distribution helpers -----
function percentile(sortedAsc, q) {
  if (sortedAsc.length === 0) return 0;
  // nearest-rank, clamped.
  const rank = Math.min(
    sortedAsc.length - 1,
    Math.max(0, Math.ceil((q / 100) * sortedAsc.length) - 1)
  );
  return sortedAsc[rank];
}

const counts = stats.map((s) => s.total).sort((a, b) => a - b);
const dist = {
  n: counts.length,
  min: counts[0] ?? 0,
  p50: percentile(counts, 50),
  p90: percentile(counts, 90),
  p95: percentile(counts, 95),
  max: counts[counts.length - 1] ?? 0,
  mean: counts.length ? counts.reduce((s, x) => s + x, 0) / counts.length : 0,
};

// Dead-end pool: concepts with zero consumers.
const deadEnds = stats.filter((s) => s.total === 0);

// Hub threshold: anything at or above p95 (but require ≥ 3 to avoid
// trivial-tail noise on small graphs).
const hubThreshold = Math.max(3, dist.p95);
const hubs = stats
  .filter((s) => s.total >= hubThreshold)
  .sort((a, b) => b.total - a.total || a.id.localeCompare(b.id));

// Orphaned hub: "many" consumers (≥ p90, and ≥ 3 to avoid noise) but zero
// cross-topic reach.
const orphanThreshold = Math.max(3, dist.p90);
const orphanedHubs = stats
  .filter((s) => s.total >= orphanThreshold && s.crossTopic === 0)
  .sort((a, b) => b.total - a.total || a.id.localeCompare(b.id));

// ----- Formatting -----
function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

function fmtConcept(s) {
  const ratioStr =
    s.total === 0 ? '-' : `${s.crossTopic}/${s.total} cross-topic`;
  return `${pad(s.id, 36)} ${pad(`[${s.topic}]`, 30)} n=${pad(s.total, 3)} ${ratioStr}`;
}

// ----- Report -----
console.log(
  `audit-backlink-quality: ${allConcepts.length} concept(s) across ${topicTitle.size} topic(s)`
);
console.log('');
console.log('Backlink count distribution (downstream consumers per concept):');
console.log(
  `  min=${dist.min}  p50=${dist.p50}  p90=${dist.p90}  p95=${dist.p95}  max=${dist.max}  mean=${dist.mean.toFixed(2)}`
);
console.log(
  `  dead-ends (n=0): ${deadEnds.length} / ${allConcepts.length} (${((100 * deadEnds.length) / Math.max(1, allConcepts.length)).toFixed(1)}%)`
);
console.log(
  `  hubs (n≥${hubThreshold}): ${hubs.length}   orphaned hubs (n≥${orphanThreshold}, cross=0): ${orphanedHubs.length}`
);

const showN = 10;

console.log('');
console.log(`Top ${showN} hubs (by consumer count):`);
if (hubs.length === 0) {
  console.log('  (none — graph too small or flat)');
} else {
  for (const s of hubs.slice(0, showN)) console.log(`  ${fmtConcept(s)}`);
}

console.log('');
console.log(`Top ${showN} dead-ends (alphabetical; expected for leaves/capstones):`);
if (deadEnds.length === 0) {
  console.log('  (none — every concept has a consumer)');
} else {
  const sortedDeadEnds = deadEnds
    .slice()
    .sort((a, b) => a.topic.localeCompare(b.topic) || a.id.localeCompare(b.id));
  for (const s of sortedDeadEnds.slice(0, showN)) console.log(`  ${fmtConcept(s)}`);
  if (sortedDeadEnds.length > showN) {
    console.log(`  … and ${sortedDeadEnds.length - showN} more`);
  }
}

console.log('');
console.log(`Top ${showN} orphaned hubs (many consumers, no cross-topic reach):`);
if (orphanedHubs.length === 0) {
  console.log('  (none — every hub has at least one cross-topic consumer)');
} else {
  for (const s of orphanedHubs.slice(0, showN)) console.log(`  ${fmtConcept(s)}`);
  if (orphanedHubs.length > showN) {
    console.log(`  … and ${orphanedHubs.length - showN} more`);
  }
}

console.log('');
console.log('OK: backlink-quality audit complete (advisory).');
process.exit(0);
