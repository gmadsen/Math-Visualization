#!/usr/bin/env node
// Re-orders <a class="card"> blocks inside each <div class="grid"> in
// index.html by pedagogical tier — prereq → (intermediate, no badge) →
// advanced → capstone. Within each tier, applies a topological sort
// over the topic-level dependency graph restricted to the same section
// so a topic that is a within-section prereq for another topic comes
// first.
//
// Tier is detected via the level-badge span class:
//   <span class="level prereq">     → tier 0
//   (no level badge)                → tier 1
//   <span class="level advanced">   → tier 2
//   <span class="level capstone">   → tier 3
//
// Topic dependency: topic A depends on topic B if any concept in A has
// a prereq concept owned by B. Cross-topic edges from the content model
// are aggregated to the topic level; within-tier ties (no edge between
// the two topics) fall back to the original document order so already-
// logical sequencing stays put.
//
// Idempotent: running twice produces the same output. Run via:
//   node scripts/reorder-section-cards.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContentModel } from './lib/content-model.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const path = resolve(repoRoot, 'index.html');

const TIERS = { prereq: 0, default: 1, advanced: 2, capstone: 3 };

function tierOf(cardHtml) {
  const m = cardHtml.match(/<span class="level\s+(prereq|advanced|capstone)">/);
  return m ? TIERS[m[1]] : TIERS.default;
}

function slugOf(cardHtml) {
  // <a class="card …" href="./<slug>.html"> — pull the slug for graph lookup.
  const m = cardHtml.match(/href="\.\/([\w-]+)\.html/);
  return m ? m[1] : null;
}

// Builds the topic-level dependency adjacency restricted to a candidate set.
// Returns a Map<topic, Set<topic>> of `topic → topics it depends on`. Used
// by toposortWithFallback to drive the tier-internal ordering.
function topicDepsForSubset(crossTopicEdges, subsetSlugs) {
  const subset = new Set(subsetSlugs);
  const deps = new Map();
  for (const slug of subsetSlugs) deps.set(slug, new Set());
  for (const e of crossTopicEdges) {
    // Edge schema (content-model.mjs L211-216): fromTopic = topic of the
    // CONSUMER concept (the one carrying the prereq), toTopic = topic of
    // the PREREQ-OWNER concept. The consumer depends on the prereq owner,
    // so deps[fromTopic] gains toTopic.
    if (!subset.has(e.fromTopic) || !subset.has(e.toTopic)) continue;
    if (e.fromTopic === e.toTopic) continue;
    deps.get(e.fromTopic).add(e.toTopic);
  }
  return deps;
}

// Khan-style topological sort with a stable original-order tiebreak. The
// concept graph as a whole is a DAG (validate-concepts enforces it), but
// the TOPIC-level projection is not — there are corpus-level pairs like
// (homological, category-theory) that share concepts in both directions
// across topic boundaries. When the cycle path triggers, we fall back to
// the original-index tiebreak rather than throwing (so a 2-cycle inside
// one tier doesn't corrupt the entire index.html), but we warn so the
// signal is visible.
function toposortWithFallback(items, deps) {
  // items: array of { slug, idx } in original order. deps: Map<slug,Set<slug>>.
  const remaining = new Map(items.map((it) => [it.slug, it]));
  const inDegree = new Map();
  for (const it of items) {
    let d = 0;
    for (const dep of deps.get(it.slug) || []) {
      if (remaining.has(dep)) d++;
    }
    inDegree.set(it.slug, d);
  }
  const out = [];
  const cycleVictims = [];
  while (remaining.size > 0) {
    // Pick the lowest-original-index item among those with in-degree 0.
    // If none have in-degree 0 (cycle), fall back to the lowest-original-
    // index item overall to make progress.
    let best = null;
    for (const it of remaining.values()) {
      if (inDegree.get(it.slug) === 0) {
        if (!best || it.idx < best.idx) best = it;
      }
    }
    if (!best) {
      // Cycle / orphan — pick lowest index unconditionally.
      for (const it of remaining.values()) {
        if (!best || it.idx < best.idx) best = it;
      }
      cycleVictims.push(best.slug);
    }
    out.push(best);
    remaining.delete(best.slug);
    // Decrement in-degree of items that depended on `best`.
    for (const it of remaining.values()) {
      if ((deps.get(it.slug) || new Set()).has(best.slug)) {
        inDegree.set(it.slug, inDegree.get(it.slug) - 1);
      }
    }
  }
  if (cycleVictims.length > 0) {
    console.warn(
      `reorder-section-cards: topic-level cycle detected; tiebreak fired on: ${cycleVictims.join(', ')}`
    );
  }
  return out;
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

function reorderGrid(gridBody, crossTopicEdges) {
  const parsed = parseGrid(gridBody);
  if (!parsed.cards.length) return gridBody;
  // Indexed view of cards with tier + slug.
  const indexed = parsed.cards.map((c, i) => ({
    leading: c.leading,
    body: c.body,
    slug: slugOf(c.body),
    tier: tierOf(c.body),
    idx: i,
  }));
  // Group by tier, topo-sort within each tier on the within-section
  // dependency subgraph, then concatenate.
  const allSlugs = indexed.map((it) => it.slug).filter(Boolean);
  const tierBuckets = new Map(); // tier → array of items in original order
  for (const it of indexed) {
    if (!tierBuckets.has(it.tier)) tierBuckets.set(it.tier, []);
    tierBuckets.get(it.tier).push(it);
  }
  const sortedTiers = Array.from(tierBuckets.keys()).sort((a, b) => a - b);
  const final = [];
  for (const t of sortedTiers) {
    const tierItems = tierBuckets.get(t);
    // Slugs in THIS tier — that's the subset we topo-sort over so
    // cross-tier edges (e.g. an advanced topic that depends on a prereq
    // tier topic) don't constrain the tier-internal ordering. The tier
    // sort itself already encodes the prereq → advanced gradient.
    const tierSlugs = tierItems.map((it) => it.slug).filter(Boolean);
    const deps = topicDepsForSubset(crossTopicEdges, tierSlugs);
    const ordered = toposortWithFallback(tierItems, deps);
    for (const it of ordered) final.push(it);
  }
  // Reassemble — preserving each card's captured leading whitespace.
  const reassembled = final.map((c) => c.leading + c.body).join('');
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

function transform(html, crossTopicEdges) {
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
    const next = reorderGrid(body, crossTopicEdges);
    if (next !== body) count++;
    out += next;
    cursor = closeIdx;
  }
  return { out, count };
}

const model = await loadContentModel();
const original = readFileSync(path, 'utf8');
const { out, count } = transform(original, model.crossTopicEdges);
if (out === original) {
  console.log('reorder-section-cards: no changes');
  process.exit(0);
}
writeFileSync(path, out);
console.log(`reorder-section-cards: reordered ${count} grid block(s)`);
