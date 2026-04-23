#!/usr/bin/env node
// Advisory audit of the auto-inserted "Used in" backlink graph.
//
// Companion to scripts/inject-used-in-backlinks.mjs. That script emits an
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

import { loadContentModel } from './lib/content-model.mjs';

const model = await loadContentModel();
const { topicIds, topics, concepts, byPrereq, ownerOf } = model;

// Replay the "first-wins in registered-topic order" iteration used by the
// original script so output ordering is preserved byte-for-byte.
const allConcepts = [];
for (const topicId of topicIds) {
  const topic = topics.get(topicId);
  if (!topic) continue;
  for (const conceptId of topic.conceptIds) {
    const c = concepts.get(conceptId);
    if (!c || c.topic !== topicId) continue; // first-wins: only owner emits
    allConcepts.push(c);
  }
}

// ----- Per-concept stats -----
// For every concept (including dead-ends), collect:
//   total        = # of downstream consumers
//   sameTopic    = # of consumers living on the same topic page
//   crossTopic   = # of consumers living on a different topic page
//   crossRatio   = crossTopic / total  (NaN for dead-ends)
const stats = allConcepts.map((c) => {
  const consumerIds = byPrereq.get(c.id) || new Set();
  let sameTopic = 0;
  for (const consId of consumerIds) {
    const owner = ownerOf.get(consId);
    if (owner && owner.topic === c.topic) sameTopic++;
  }
  const total = consumerIds.size;
  const crossTopic = total - sameTopic;
  return {
    id: c.id,
    topic: c.topic,
    title: c.title,
    total,
    sameTopic,
    crossTopic,
    crossRatio: total > 0 ? crossTopic / total : null,
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
  `audit-backlink-quality: ${allConcepts.length} concept(s) across ${topics.size} topic(s)`
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
