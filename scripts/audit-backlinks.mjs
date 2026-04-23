#!/usr/bin/env node
// Combined advisory audit of the concept-graph reverse adjacency (backlinks).
//
// Two sections, each previously its own script:
//
//   1. "Backlink structure" — raw consumer counts (reverse-prereq edge count)
//      per concept, with distribution stats and top hubs / dead-ends / orphaned
//      hubs. Previously: scripts/audit-backlink-quality.mjs.
//
//   2. "Backlink coupling depth" — weighted coupling score per (C, D) pair
//      (base edge + blurb mention + prose mention + hard-quiz mention),
//      summed per concept. Previously: scripts/audit-backlink-strength.mjs.
//
// Both analyses read the shared content-model reverse adjacency (byPrereq).
// Advisory only. Always exits 0. Not wired into CI.
//
// CLI:
//   node scripts/audit-backlinks.mjs            # default top 20 in section 2
//   node scripts/audit-backlinks.mjs --top N    # top N in section 2

import { loadContentModel, forEachSectionProse } from './lib/content-model.mjs';
import { buildTitleRegex } from './lib/audit-utils.mjs';

// ─────────────────────────────────────────────────────────────────────────
// CLI

const argv = process.argv.slice(2);
let TOP_N = 20;
{
  const idx = argv.indexOf('--top');
  if (idx !== -1) {
    const v = Number(argv[idx + 1]);
    if (!Number.isFinite(v) || v <= 0) {
      console.error('audit-backlinks: --top requires a positive integer');
      process.exit(2);
    }
    TOP_N = Math.floor(v);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Load the shared content model.

const model = await loadContentModel();
const {
  topicIds,
  topics,
  concepts,
  byPrereq,
  ownerOf,
  quizByConcept,
} = model;

// Preserve the declaration-order list of concepts (first-writer-wins on
// duplicates, topic iteration in registered order — matches the original
// loader semantics of both source audits).
const allConceptsQuality = []; // first-hit; owner emits
for (const topicId of topicIds) {
  const topic = topics.get(topicId);
  if (!topic) continue;
  for (const conceptId of topic.conceptIds) {
    const c = concepts.get(conceptId);
    if (!c || c.topic !== topicId) continue; // first-wins: only owner emits
    allConceptsQuality.push(c);
  }
}

const allConceptsStrength = [];
{
  const seen = new Set();
  for (const topicId of topicIds) {
    const topic = topics.get(topicId);
    if (!topic) continue;
    for (const cid of topic.conceptIds) {
      if (seen.has(cid)) continue;
      const c = concepts.get(cid);
      if (!c) continue;
      seen.add(cid);
      allConceptsStrength.push(c);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Shared helpers.

function percentile(sortedAsc, q) {
  if (sortedAsc.length === 0) return 0;
  // nearest-rank, clamped.
  const rank = Math.min(
    sortedAsc.length - 1,
    Math.max(0, Math.ceil((q / 100) * sortedAsc.length) - 1)
  );
  return sortedAsc[rank];
}

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

function padLeft(s, n) {
  s = String(s);
  return s.length >= n ? s : ' '.repeat(n - s.length) + s;
}

// ═════════════════════════════════════════════════════════════════════════
// Section 1: Backlink structure (ex audit-backlink-quality.mjs).
// ═════════════════════════════════════════════════════════════════════════

// ----- Per-concept stats -----
// For every concept (including dead-ends), collect:
//   total        = # of downstream consumers
//   sameTopic    = # of consumers living on the same topic page
//   crossTopic   = # of consumers living on a different topic page
//   crossRatio   = crossTopic / total  (NaN for dead-ends)
const stats = allConceptsQuality.map((c) => {
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

function fmtQualityConcept(s) {
  const ratioStr =
    s.total === 0 ? '-' : `${s.crossTopic}/${s.total} cross-topic`;
  return `${pad(s.id, 36)} ${pad(`[${s.topic}]`, 30)} n=${pad(s.total, 3)} ${ratioStr}`;
}

// ─────────────────────────────────────────────────────────────────────────
// Print Section 1.

console.log(
  `audit-backlink-quality: ${allConceptsQuality.length} concept(s) across ${topics.size} topic(s)`
);
console.log('');
console.log('Backlink count distribution (downstream consumers per concept):');
console.log(
  `  min=${dist.min}  p50=${dist.p50}  p90=${dist.p90}  p95=${dist.p95}  max=${dist.max}  mean=${dist.mean.toFixed(2)}`
);
console.log(
  `  dead-ends (n=0): ${deadEnds.length} / ${allConceptsQuality.length} (${((100 * deadEnds.length) / Math.max(1, allConceptsQuality.length)).toFixed(1)}%)`
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
  for (const s of hubs.slice(0, showN)) console.log(`  ${fmtQualityConcept(s)}`);
}

console.log('');
console.log(`Top ${showN} dead-ends (alphabetical; expected for leaves/capstones):`);
if (deadEnds.length === 0) {
  console.log('  (none — every concept has a consumer)');
} else {
  const sortedDeadEnds = deadEnds
    .slice()
    .sort((a, b) => a.topic.localeCompare(b.topic) || a.id.localeCompare(b.id));
  for (const s of sortedDeadEnds.slice(0, showN)) console.log(`  ${fmtQualityConcept(s)}`);
  if (sortedDeadEnds.length > showN) {
    console.log(`  … and ${sortedDeadEnds.length - showN} more`);
  }
}

console.log('');
console.log(`Top ${showN} orphaned hubs (many consumers, no cross-topic reach):`);
if (orphanedHubs.length === 0) {
  console.log('  (none — every hub has at least one cross-topic consumer)');
} else {
  for (const s of orphanedHubs.slice(0, showN)) console.log(`  ${fmtQualityConcept(s)}`);
  if (orphanedHubs.length > showN) {
    console.log(`  … and ${orphanedHubs.length - showN} more`);
  }
}

console.log('');
console.log('OK: backlink-quality audit complete (advisory).');

// ═════════════════════════════════════════════════════════════════════════
// Section 2: Backlink coupling depth (ex audit-backlink-strength.mjs).
// ═════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────
// Title-in-prose matching.
//
// Mirrors audit-inline-links.mjs: whole-word case-insensitive match, tolerant
// to varied whitespace, unicode hyphens interchangeable. The prereq edge
// already restricts us to specific (C, D) pairs, so we skip the
// blocklist/min-length filter used by the inline-link inserter.

function countMatches(text, title) {
  if (!text || !title) return 0;
  const re = buildTitleRegex(title, { global: true });
  const matches = text.match(re);
  return matches ? matches.length : 0;
}

// ─────────────────────────────────────────────────────────────────────────
// Section-prose extraction.

const proseCache = new Map(); // conceptId -> prose string

function extractSectionProseFor(concept) {
  if (proseCache.has(concept.id)) return proseCache.get(concept.id);
  const out = buildSectionProse(concept);
  proseCache.set(concept.id, out);
  return out;
}

function buildSectionProse(concept) {
  const sectionEl = concept.section;
  if (!sectionEl) return '';

  const perP = new Map(); // pElement -> string buffer
  const pOrder = [];

  forEachSectionProse(sectionEl, (_textNode, { masked, parent }) => {
    const pEl = nearestAncestorTag(parent, 'p', sectionEl);
    if (!pEl) return;
    if (!perP.has(pEl)) {
      perP.set(pEl, '');
      pOrder.push(pEl);
    }
    perP.set(pEl, perP.get(pEl) + masked);
  });

  const blocks = [];
  for (const pEl of pOrder) {
    const collapsed = perP.get(pEl).replace(/\s+/g, ' ').trim();
    if (collapsed) blocks.push(collapsed);
  }
  return blocks.join(' ');
}

function nearestAncestorTag(node, tagName, stopAt) {
  let cur = node;
  while (cur && cur !== stopAt) {
    const tag = (cur.rawTagName || cur.tagName || '').toLowerCase();
    if (tag === tagName) return cur;
    cur = cur.parentNode || null;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// Hard-tier quiz text extraction.

function extractHardQuizText(conceptId) {
  const entry = quizByConcept.get(conceptId);
  if (!entry) return '';
  const hard = entry.hard;
  if (!Array.isArray(hard) || hard.length === 0) return '';
  const parts = [];
  for (const q of hard) {
    if (typeof q.q === 'string') parts.push(q.q);
    if (Array.isArray(q.choices)) {
      for (const ch of q.choices) if (typeof ch === 'string') parts.push(ch);
    }
    if (Array.isArray(q.items)) {
      for (const it of q.items) if (typeof it === 'string') parts.push(it);
    }
    if (typeof q.explain === 'string') parts.push(q.explain);
    if (typeof q.hint === 'string') parts.push(q.hint);
  }
  return parts.join(' \n ');
}

// ─────────────────────────────────────────────────────────────────────────
// Per-edge coupling score.

function couplingScore(C, D) {
  let score = 1; // base prereq edge

  // +1: blurb of D mentions title of C.
  if (countMatches(D.blurb, C.title) >= 1) score += 1;

  // +2: D's section prose mentions C.title ≥ 2 times.
  const prose = extractSectionProseFor(D);
  if (countMatches(prose, C.title) >= 2) score += 2;

  // +3: D's hard-tier quiz bank mentions C.title ≥ 1 time.
  const hardText = extractHardQuizText(D.id);
  if (countMatches(hardText, C.title) >= 1) score += 3;

  return score;
}

// ─────────────────────────────────────────────────────────────────────────
// Compute per-concept strength.

const perConcept = allConceptsStrength.map((C) => {
  const downstreamIds = byPrereq.get(C.id) || new Set();
  const consumers = [];
  for (const D of allConceptsStrength) if (downstreamIds.has(D.id)) consumers.push(D);

  let total = 0;
  for (const D of consumers) total += couplingScore(C, D);
  const avgDepth = consumers.length > 0 ? total / consumers.length : 0;
  return {
    id: C.id,
    topic: C.topic,
    title: C.title,
    consumers: consumers.length,
    strength: total,
    avgDepth,
  };
});

// Distributions restricted to concepts with ≥ 1 consumer.
const withConsumers = perConcept.filter((s) => s.consumers > 0);
const strengthSorted = withConsumers
  .map((s) => s.strength)
  .sort((a, b) => a - b);
const avgDepthSorted = withConsumers
  .map((s) => s.avgDepth)
  .sort((a, b) => a - b);

const strDist = {
  n: strengthSorted.length,
  p50: percentile(strengthSorted, 50),
  p90: percentile(strengthSorted, 90),
};
const depthDist = {
  p50: percentile(avgDepthSorted, 50),
  p90: percentile(avgDepthSorted, 90),
};

// Rankings.
const byStrength = perConcept
  .slice()
  .sort(
    (a, b) =>
      b.strength - a.strength ||
      b.consumers - a.consumers ||
      a.id.localeCompare(b.id)
  );
const byConsumers = perConcept
  .slice()
  .sort(
    (a, b) =>
      b.consumers - a.consumers ||
      b.strength - a.strength ||
      a.id.localeCompare(b.id)
  );

const topStrengthIds = new Set(byStrength.slice(0, TOP_N).map((s) => s.id));
const topConsumerIds = new Set(byConsumers.slice(0, TOP_N).map((s) => s.id));
const onlyInStrength = byStrength
  .slice(0, TOP_N)
  .filter((s) => !topConsumerIds.has(s.id));
const onlyInConsumers = byConsumers
  .slice(0, TOP_N)
  .filter((s) => !topStrengthIds.has(s.id));

function fmtStrengthRow(s) {
  return (
    `  ${pad(s.id, 36)} ${pad(`(${s.topic})`, 32)} ` +
    `consumers=${padLeft(s.consumers, 3)}  ` +
    `total_strength=${padLeft(s.strength, 4)}  ` +
    `avg_depth=${s.avgDepth.toFixed(2)}`
  );
}

const topicTitleCount = topicIds.filter((t) => topics.has(t)).length;

// ─────────────────────────────────────────────────────────────────────────
// Print Section 2.

console.log(
  `audit-backlink-strength: ${allConceptsStrength.length} concept(s) across ${topicTitleCount} topic(s)`
);
console.log('');
console.log(
  `Metric: coupling(C,D) = 1 (base) + 1 (D.blurb mentions C.title) + 2 (D's section prose mentions C.title ≥2) + 3 (D's hard quiz mentions C.title)`
);
console.log(
  `        strength(C) = Σ over consumers D.   avg_depth(C) = strength/consumers.`
);
console.log('');
console.log(
  `Distribution over ${strDist.n} concept(s) with ≥1 consumer:`
);
console.log(
  `  total_strength  p50=${strDist.p50}  p90=${strDist.p90}`
);
console.log(
  `  avg_depth       p50=${depthDist.p50.toFixed(2)}  p90=${depthDist.p90.toFixed(2)}`
);

console.log('');
console.log(`Top ${TOP_N} concepts by total coupling strength:`);
if (byStrength.length === 0) {
  console.log('  (no concepts)');
} else {
  for (const s of byStrength.slice(0, TOP_N)) console.log(fmtStrengthRow(s));
}

console.log('');
console.log(
  `Top ${TOP_N} concepts by raw consumer count (for comparison with audit-backlink-quality):`
);
for (const s of byConsumers.slice(0, TOP_N)) console.log(fmtStrengthRow(s));

console.log('');
console.log(`Divergence between the two rankings (top-${TOP_N}):`);
if (onlyInStrength.length === 0 && onlyInConsumers.length === 0) {
  console.log('  (rankings agree — strength-top-N ≡ consumer-top-N)');
} else {
  console.log(
    `  In strength-top-${TOP_N} but not consumer-top-${TOP_N}  (deeply coupled, not the most cited):`
  );
  if (onlyInStrength.length === 0) console.log('    (none)');
  for (const s of onlyInStrength) console.log(fmtStrengthRow(s));
  console.log('');
  console.log(
    `  In consumer-top-${TOP_N} but not strength-top-${TOP_N}  (widely cited, shallowly coupled):`
  );
  if (onlyInConsumers.length === 0) console.log('    (none)');
  for (const s of onlyInConsumers) console.log(fmtStrengthRow(s));
}

console.log('');
console.log('OK: backlink-strength audit complete (advisory).');
process.exit(0);
