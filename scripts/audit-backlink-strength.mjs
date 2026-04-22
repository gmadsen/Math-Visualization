#!/usr/bin/env node
// Advisory audit of concept coupling "strength" — how deeply downstream
// consumers actually lean on each concept, not just how many declare it as a
// prereq.
//
// Companion to scripts/audit-backlink-quality.mjs. That script ranks concepts
// by raw consumer count (|reverse-prereq edges|). This one scores each
// (concept C, consumer D) pair and sums the scores per concept to surface the
// true backbone: concepts used *deeply* in their consumers' prose and
// assessments, not merely name-dropped in a prereq list.
//
// Advisory only. Always exits 0. Not wired into CI.
//
// ─────────────────────────────────────────────────────────────────────────
// Metric definition
//
// For each concept C and each consumer D (D has C as a prereq), compute:
//
//   coupling_score(C, D) =
//       1                    // base prereq edge
//     + 1 if D.blurb         mentions C.title     (weak reference)
//     + 2 if D's section     mentions C.title ≥2  (strong prose reference)
//     + 3 if D's hard-tier   mentions C.title ≥1  (deep pedagogical coupling)
//
//   strength(C)  = Σ  coupling_score(C, D)  over all consumers D
//   avg_depth(C) = strength(C) / consumer_count(C)    (undefined if n=0)
//
// Interpretations:
//   - High strength + high consumer count     → structural backbone.
//   - Low  strength + high consumer count     → shallow-cited prereq.
//   - High avg_depth + low consumer count     → niche but deeply integrated.
//
// ─────────────────────────────────────────────────────────────────────────
// CLI
//   node scripts/audit-backlink-strength.mjs            # default top 20
//   node scripts/audit-backlink-strength.mjs --top N    # top N

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
      console.error('audit-backlink-strength: --top requires a positive integer');
      process.exit(2);
    }
    TOP_N = Math.floor(v);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Load unified content model.

const model = await loadContentModel();
const {
  topicIds: registeredTopics,
  topics,
  concepts,
  byPrereq,
  quizByConcept,
} = model;

// Preserve the declaration-order list of concepts (first-writer-wins on
// duplicates, topic iteration in registered order — matches the original
// loader semantics).
const allConcepts = [];
const seenConceptIds = new Set();
for (const topicId of registeredTopics) {
  const topic = topics.get(topicId);
  if (!topic) continue;
  for (const cid of topic.conceptIds) {
    if (seenConceptIds.has(cid)) continue;
    const c = concepts.get(cid);
    if (!c) continue;
    seenConceptIds.add(cid);
    allConcepts.push(c);
  }
}

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
//
// Original implementation scanned raw HTML, taking characters inside eligible
// <p> blocks only, with skip-mask covering <a>/<h*>/widgets/math spans/etc.
// We reproduce that behavior on top of the parsed DOM:
//
//   - forEachSectionProse already skips <script>/<style>/<svg>/<code>/<pre>/
//     <aside>/<h1..6>/<a>/.widget/.katex subtrees, and exposes a math-masked
//     variant of each TextNode's text.
//   - We further restrict to TextNodes whose ancestor chain contains a <p>.
//   - Per-<p> text is joined with ' ' and whitespace-collapsed, matching the
//     original's `buf.replace(/\s+/g,' ').trim()` + ` ` join between blocks.

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

  // Group masked TextNode texts by their nearest <p> ancestor. TextNodes with
  // no <p> ancestor (or not inside this section's body) are ignored — the
  // original only extracted from <p> blocks.
  const perP = new Map(); // pElement -> string buffer
  const pOrder = []; // preserve document order

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

const perConcept = allConcepts.map((C) => {
  // byPrereq gives a Set<conceptId> of downstream consumers (reverse edges).
  // Resolve to concept records; iterate in allConcepts order for determinism.
  const downstreamIds = byPrereq.get(C.id) || new Set();
  const consumers = [];
  for (const D of allConcepts) if (downstreamIds.has(D.id)) consumers.push(D);

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

// ─────────────────────────────────────────────────────────────────────────
// Distribution helpers.

function percentile(sortedAsc, q) {
  if (sortedAsc.length === 0) return 0;
  const rank = Math.min(
    sortedAsc.length - 1,
    Math.max(0, Math.ceil((q / 100) * sortedAsc.length) - 1)
  );
  return sortedAsc[rank];
}

// Distributions restricted to concepts with ≥ 1 consumer (dead-ends skew
// zero and drown the signal).
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

// Divergence: concepts in top-N by strength but NOT in top-N by consumers,
// and vice versa.
const topStrengthIds = new Set(byStrength.slice(0, TOP_N).map((s) => s.id));
const topConsumerIds = new Set(byConsumers.slice(0, TOP_N).map((s) => s.id));
const onlyInStrength = byStrength
  .slice(0, TOP_N)
  .filter((s) => !topConsumerIds.has(s.id));
const onlyInConsumers = byConsumers
  .slice(0, TOP_N)
  .filter((s) => !topStrengthIds.has(s.id));

// ─────────────────────────────────────────────────────────────────────────
// Output.

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}
function padLeft(s, n) {
  s = String(s);
  return s.length >= n ? s : ' '.repeat(n - s.length) + s;
}

function fmtRow(s) {
  return (
    `  ${pad(s.id, 36)} ${pad(`(${s.topic})`, 32)} ` +
    `consumers=${padLeft(s.consumers, 3)}  ` +
    `total_strength=${padLeft(s.strength, 4)}  ` +
    `avg_depth=${s.avgDepth.toFixed(2)}`
  );
}

const topicTitleCount = registeredTopics.filter((t) => topics.has(t)).length;

console.log(
  `audit-backlink-strength: ${allConcepts.length} concept(s) across ${topicTitleCount} topic(s)`
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
  for (const s of byStrength.slice(0, TOP_N)) console.log(fmtRow(s));
}

console.log('');
console.log(
  `Top ${TOP_N} concepts by raw consumer count (for comparison with audit-backlink-quality):`
);
for (const s of byConsumers.slice(0, TOP_N)) console.log(fmtRow(s));

console.log('');
console.log(`Divergence between the two rankings (top-${TOP_N}):`);
if (onlyInStrength.length === 0 && onlyInConsumers.length === 0) {
  console.log('  (rankings agree — strength-top-N ≡ consumer-top-N)');
} else {
  console.log(
    `  In strength-top-${TOP_N} but not consumer-top-${TOP_N}  (deeply coupled, not the most cited):`
  );
  if (onlyInStrength.length === 0) console.log('    (none)');
  for (const s of onlyInStrength) console.log(fmtRow(s));
  console.log('');
  console.log(
    `  In consumer-top-${TOP_N} but not strength-top-${TOP_N}  (widely cited, shallowly coupled):`
  );
  if (onlyInConsumers.length === 0) console.log('    (none)');
  for (const s of onlyInConsumers) console.log(fmtRow(s));
}

console.log('');
console.log('OK: backlink-strength audit complete (advisory).');
process.exit(0);
