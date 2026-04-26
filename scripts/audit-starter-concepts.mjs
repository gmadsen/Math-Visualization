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

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeSectionStats, topicSectionFromSectionsJson } from './lib/section-stats.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');
const auditsDir = join(repoRoot, 'audits');

// Load every topic's concepts (and the canonical levels map).
const indexJson = JSON.parse(readFileSync(join(conceptsDir, 'index.json'), 'utf8'));

// Topics whose first concept legitimately has no prereqs — they're the
// foundations the rest of the corpus rests on. Derived from the canonical
// `levels` map in concepts/index.json (single source of truth shared with
// pathway.html). validate-concepts.mjs guards drift between `topics` and
// `levels`, so any topic missing from `levels` surfaces in CI.
const PREREQ_TOPICS = new Set(
  Object.entries(indexJson.levels || {})
    .filter(([, lvl]) => lvl === 'prereq')
    .map(([t]) => t)
);

// Arc-of-new-topics (capstone arc + Stacks-Project arc + cocartesian-fibrations).
// PLAN.md notes these were scaffolded with no cross-topic prereqs by design.
// TODO: this set is heterogeneous (mixes capstone-level and standard-level
// topics that share a "scaffolded recently, prereqs incomplete" property), so
// it doesn't derive cleanly from `levels`. Promote to a `newArc` field on
// concepts/index.json once the THIN-NEW backfill is far enough along that
// the static list can shrink to zero entries instead of being maintained
// in two places.
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

// --- Per-section structural stats ---
// Single source of truth: scripts/lib/section-stats.mjs. mindmap.html
// reads the same numbers via __MVConcepts.sectionStats (precomputed at
// bundle-build time using the same lib). This audit emits the table
// into audits/starter-concepts.md.
const sectionsJson = JSON.parse(readFileSync(join(conceptsDir, 'sections.json'), 'utf8'));
const SECTION_ORDER = sectionsJson.sections.map((s) => s.title);
const TOPIC_SECTION = topicSectionFromSectionsJson(sectionsJson);

// Drift detection: any topic in concepts/index.json that's missing from
// concepts/sections.json contributes to its absence from the per-section
// stats below — its concepts add to the global denominator (via
// topicData) but not to any section's tally, silently skewing density.
// Surface the orphans up-front so the corpus owner notices.
{
  const orphanTopics = [];
  for (const t of indexJson.topics) {
    if (!TOPIC_SECTION[t]) orphanTopics.push(t);
  }
  if (orphanTopics.length > 0) {
    console.warn(
      `audit-starter-concepts: ${orphanTopics.length} topic(s) in concepts/index.json missing from concepts/sections.json — these contribute to no section's stats: ${orphanTopics.join(', ')}`
    );
  }
}
const { stats: sectionStatsObj } = computeSectionStats({
  topics: topicData,
  topicSection: TOPIC_SECTION,
  sectionOrder: SECTION_ORDER,
});
// Map shape used by the table renderer below.
const sectionStats = new Map();
for (const sec of SECTION_ORDER) {
  const r = sectionStatsObj[sec] || { concepts: 0, intra: 0, crossOut: 0, crossIn: 0 };
  sectionStats.set(sec, { concepts: r.concepts, intra: r.intra, crossOut: r.crossOut, crossIn: r.crossIn });
}

// --- Stdout report (kept for CLI usage) ---
console.log(`audit-starter-concepts: ${topicData.size} topic(s) scanned`);
console.log('');

console.log(`EMPTY (${empties.length}) — concepts with no prereqs in non-foundation topics:`);
if (empties.length === 0) {
  console.log('  (none)');
} else {
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

// --- Markdown snapshot for PR review ---
function escapeMd(s) {
  return String(s == null ? '' : s).replace(/\|/g, '\\|');
}
const lines = [];
lines.push('# Concept-graph structural audit');
lines.push('');
lines.push('Snapshot from `scripts/audit-starter-concepts.mjs`. Updated on every');
lines.push('`rebuild.mjs` run. Always advisory (does not gate CI).');
lines.push('');
lines.push('## Per-section structural stats');
lines.push('');
lines.push('Density = cross-topic out-edges per concept. Foundations should have 0');
lines.push('out-edges (purely a source); other sections vary based on whether they');
lines.push('reach into upstream foundations or stay within their own cluster.');
lines.push('');
lines.push('| section | concepts | intra edges | cross out | cross in | density |');
lines.push('|---|---:|---:|---:|---:|---:|');
for (const sec of SECTION_ORDER) {
  const r = sectionStats.get(sec);
  const density = r.concepts > 0 ? r.crossOut / r.concepts : 0;
  lines.push(`| ${escapeMd(sec)} | ${r.concepts} | ${r.intra} | ${r.crossOut} | ${r.crossIn} | ${density.toFixed(3)} |`);
}
lines.push('');
lines.push(`## EMPTY — concepts with no prereqs (${empties.length})`);
lines.push('');
lines.push('Concepts whose `prereqs` field is `[]` and whose owning topic is *not*');
lines.push('a foundation/prereq topic. Almost always indicates a missing cross-');
lines.push('topic upstream wiring; pathway.html will surface the concept as "ready"');
lines.push('at brand-new progress alongside genuine entry points like');
lines.push('`sets-functions` and `algebraic-structures`.');
lines.push('');
if (empties.length === 0) {
  lines.push('_Currently clean — no advanced concept lists `prereqs: []`._');
} else {
  lines.push('| topic | concept | title |');
  lines.push('|---|---|---|');
  const sortedEmpty = empties.slice().sort((a, b) => a.topic.localeCompare(b.topic) || a.id.localeCompare(b.id));
  for (const e of sortedEmpty) {
    lines.push(`| ${escapeMd(e.topic)} | \`${escapeMd(e.id)}\` | ${escapeMd(e.title)} |`);
  }
}
lines.push('');
lines.push(`## THIN-NEW — new-arc concepts with intra-topic-only prereqs (${thin.length})`);
lines.push('');
lines.push('New-arc topics (capstone arc + Stacks-Project arc + cocartesian-fibrations)');
lines.push('whose concepts list `prereqs` but every entry stays inside the same topic.');
lines.push('Often transitively reachable from foundations via siblings, but the direct');
lines.push('cross-topic dependencies should be wired in for clarity (audit-callbacks');
lines.push('uses these to populate "See also" asides).');
lines.push('');
if (thin.length === 0) {
  lines.push('_Currently clean — every new-arc concept lists at least one cross-topic prereq._');
} else {
  lines.push('| topic | concept | title | current prereqs |');
  lines.push('|---|---|---|---|');
  const sortedThin = thin.slice().sort((a, b) => a.topic.localeCompare(b.topic) || a.id.localeCompare(b.id));
  for (const e of sortedThin) {
    lines.push(`| ${escapeMd(e.topic)} | \`${escapeMd(e.id)}\` | ${escapeMd(e.title)} | ${e.prereqs.map((p) => `\`${escapeMd(p)}\``).join(', ')} |`);
  }
}
lines.push('');
lines.push(`Foundations excluded from the EMPTY check: ${[...PREREQ_TOPICS].sort().map((t) => `\`${t}\``).join(', ')}.`);
lines.push('');

mkdirSync(auditsDir, { recursive: true });
const outPath = join(auditsDir, 'starter-concepts.md');
writeFileSync(outPath, lines.join('\n'));
console.log('');
console.log(`wrote ${outPath}`);

process.exit(0);
