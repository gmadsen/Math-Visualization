#!/usr/bin/env node
// Audit "starter" concepts — concepts with `prereqs: []` — and flag any
// that aren't owned by a foundation/prereq topic. Those almost certainly
// need cross-topic upstream wiring; otherwise pathway.html surfaces them
// as "ready" at brand-new progress alongside genuine entry points like
// `sets-functions` and `algebraic-structures`, which lies about the
// learning order.
//
// Two reports:
//   1. EMPTY:     concepts with `prereqs: []` outside the prereq-topic set.
//   2. THIN-NEW:  concepts whose `prereqs` are non-empty but stay entirely
//                 inside their own topic, AND whose owning topic is one of
//                 the 15 new arc topics (where cross-topic wiring is
//                 known-incomplete). Helpers for the next prereq pass.
//
// Advisory: always exits 0 (informational, not a CI gate). A future flag
// could promote it to a hard check.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');

// Topics whose first concept legitimately has no prereqs — they're the
// foundations the rest of the corpus rests on. Mirrors the TOPIC_LEVEL
// "prereq" classification in pathway.html.
const PREREQ_TOPICS = new Set([
  'naive-set-theory',
  'algebra',
  'real-analysis',
  'complex-analysis',
  'point-set-topology',
  'algebraic-topology',
  'projective-plane',
]);

// Arc-of-new-topics (capstone arc + Stacks-Project arc + cocartesian-fibrations).
// PLAN.md notes these were scaffolded with no cross-topic prereqs by design.
const NEW_ARC_TOPICS = new Set([
  // capstone arc
  'elementary-topos-theory',
  'heyting-algebras-toposes',
  'grothendieck-topologies-sites',
  'simplicial-sets-and-nerve',
  'infinity-categories',
  'infinity-topoi',
  // Stacks-Project arc
  'derived-categories',
  'algebraic-spaces',
  'intersection-theory-chow',
  'etale-fundamental-group',
  'algebraic-curves-higher-genus',
  'group-schemes',
  'deformation-theory',
  'algebraic-de-rham-cohomology',
  // ∞-cats fill
  'cocartesian-fibrations',
]);

// Load every topic's concepts.
const indexJson = JSON.parse(readFileSync(join(conceptsDir, 'index.json'), 'utf8'));
const topicData = new Map();
for (const t of indexJson.topics) {
  const p = join(conceptsDir, `${t}.json`);
  try {
    topicData.set(t, JSON.parse(readFileSync(p, 'utf8')));
  } catch {}
}

// Build a global concept-id → topic map.
const ownerOf = new Map();
for (const [t, d] of topicData) {
  for (const c of d.concepts || []) ownerOf.set(c.id, t);
}

// --- Pass 1: empty-prereq concepts outside prereq topics ---
const empties = [];
for (const [t, d] of topicData) {
  if (PREREQ_TOPICS.has(t)) continue;
  for (const c of d.concepts || []) {
    if (!c.prereqs || c.prereqs.length === 0) {
      empties.push({ topic: t, id: c.id, title: c.title });
    }
  }
}

// --- Pass 2: concepts with all prereqs intra-topic, in new-arc topics ---
const thin = [];
for (const [t, d] of topicData) {
  if (!NEW_ARC_TOPICS.has(t)) continue;
  for (const c of d.concepts || []) {
    const prereqs = c.prereqs || [];
    if (prereqs.length === 0) continue; // covered by Pass 1
    const allInOwnTopic = prereqs.every((p) => {
      const owner = ownerOf.get(p);
      return owner === t;
    });
    if (allInOwnTopic) {
      thin.push({ topic: t, id: c.id, title: c.title, prereqs });
    }
  }
}

// --- Report ---
console.log(`audit-starter-concepts: ${topicData.size} topic(s) scanned`);
console.log('');

console.log(`EMPTY (${empties.length}) — concepts with no prereqs in non-foundation topics:`);
if (empties.length === 0) {
  console.log('  (none)');
} else {
  // Group by topic for readability.
  const byTopic = new Map();
  for (const e of empties) {
    if (!byTopic.has(e.topic)) byTopic.set(e.topic, []);
    byTopic.get(e.topic).push(e);
  }
  for (const [t, arr] of [...byTopic.entries()].sort()) {
    console.log(`  ${t}:`);
    for (const e of arr) console.log(`    - ${e.id}  "${e.title}"`);
  }
}
console.log('');

console.log(`THIN-NEW (${thin.length}) — new-arc concepts with only intra-topic prereqs:`);
if (thin.length === 0) {
  console.log('  (none)');
} else {
  const byTopic = new Map();
  for (const e of thin) {
    if (!byTopic.has(e.topic)) byTopic.set(e.topic, []);
    byTopic.get(e.topic).push(e);
  }
  for (const [t, arr] of [...byTopic.entries()].sort()) {
    console.log(`  ${t}:`);
    for (const e of arr) console.log(`    - ${e.id}  "${e.title}"  prereqs=${JSON.stringify(e.prereqs)}`);
  }
}
console.log('');
console.log(`Foundations excluded: ${[...PREREQ_TOPICS].sort().join(', ')}`);
console.log(`(advisory; always exits 0)`);
process.exit(0);
