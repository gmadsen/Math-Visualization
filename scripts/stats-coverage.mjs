#!/usr/bin/env node
// Coverage + type stats for widgets and quizzes.
//
// Advisory; always exits 0. Writes audits/coverage-stats.md and prints a
// subject-level summary to stdout. Useful for:
//   - knowing at a glance how many widgets per subject, by family/dimension/gesture
//   - knowing quiz coverage by type + tier per subject and per topic
//   - surfacing concepts that lack a widget or a hard-tier quiz
//
// CLI:
//   node scripts/stats-coverage.mjs                  full report
//   node scripts/stats-coverage.mjs --subject <id>   filter to one subject
//   node scripts/stats-coverage.mjs --topic <slug>   filter to one topic
//
// Zero extra deps — reads content/*.json, widgets/<slug>/schema.json's top-
// level `meta` block (if any), and the shared content model.

import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContentModel } from './lib/content-model.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const contentDir = join(repoRoot, 'content');
const widgetsDir = join(repoRoot, 'widgets');

// ----- CLI -----
const argv = process.argv.slice(2);
let subjectFilter = null;
let topicFilter = null;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--subject') subjectFilter = argv[++i];
  else if (argv[i] === '--topic') topicFilter = argv[++i];
}

// ----- Load widget registry metadata -----
const widgetMeta = new Map(); // slug -> { family, dimension, gesture, role }
if (existsSync(widgetsDir)) {
  for (const d of readdirSync(widgetsDir)) {
    const sp = join(widgetsDir, d, 'schema.json');
    if (!existsSync(sp)) continue;
    try {
      const s = JSON.parse(readFileSync(sp, 'utf8'));
      if (s && s.meta) widgetMeta.set(d, s.meta);
    } catch {
      /* ignore unreadable schemas */
    }
  }
}

// ----- Load content model -----
const model = await loadContentModel();

// ----- Walk content blocks + quiz banks, bucket everything -----

// Per-topic tallies.
const perTopic = new Map();
for (const tid of model.topicIds) {
  perTopic.set(tid, {
    topic: tid,
    section: model.sectionOf(tid),
    conceptCount: 0,
    widgets: {
      total: 0,
      byFamily: new Map(),
      byDimension: new Map(),
      byGesture: new Map(),
      byRole: new Map(),
      registryDriven: 0,
      inline: 0,
    },
    quizzes: {
      total: 0,
      byType: new Map(),
      byTier: { v1: 0, hard: 0, expert: 0 },
    },
  });
}

// Concept counts come from model.concepts.
for (const c of model.concepts.values()) {
  const row = perTopic.get(c.topic);
  if (row) row.conceptCount++;
}

const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);

// Widgets live in content/*.json as block entries. Metadata source priority:
//   1. block.meta (if present on the block itself)
//   2. widgetMeta.get(block.slug) (for registry-driven blocks)
//   3. unknown
// Registry-wide per-slug instance count. Includes every topic that uses
// the slug. Slugs registered under widgets/<slug>/ but not yet adopted
// in any topic stay at 0 — flagged below as infrastructure-only.
const slugCounts = new Map(); // slug -> { count, topics: Set<topicId> }
for (const slug of widgetMeta.keys()) {
  slugCounts.set(slug, { count: 0, topics: new Set() });
}

for (const f of readdirSync(contentDir)) {
  if (!f.endsWith('.json')) continue;
  const tid = f.replace(/\.json$/, '');
  const row = perTopic.get(tid);
  if (!row) continue;
  const j = JSON.parse(readFileSync(join(contentDir, f), 'utf8'));
  for (const s of j.sections || []) {
    for (const b of s.blocks || []) {
      if (b.type !== 'widget') continue;
      row.widgets.total++;
      if (b.slug) {
        row.widgets.registryDriven++;
        if (!slugCounts.has(b.slug)) slugCounts.set(b.slug, { count: 0, topics: new Set() });
        const sc = slugCounts.get(b.slug);
        sc.count++;
        sc.topics.add(tid);
      } else {
        row.widgets.inline++;
      }
      const meta = (b.meta || (b.slug && widgetMeta.get(b.slug))) || {};
      bump(row.widgets.byFamily, meta.family || 'unknown');
      bump(row.widgets.byDimension, meta.dimension || 'unknown');
      bump(row.widgets.byGesture, meta.gesture || 'unknown');
      bump(row.widgets.byRole, meta.role || 'unknown');
    }
  }
}

// Quizzes come from the quizByConcept structure in the model — each concept
// has v1/hard/expert arrays; each question carries a `type`.
for (const c of model.concepts.values()) {
  const row = perTopic.get(c.topic);
  if (!row) continue;
  const q = model.quizByConcept.get(c.id);
  if (!q) continue;
  for (const tier of ['v1', 'hard', 'expert']) {
    const arr = q[tier] || [];
    row.quizzes.total += arr.length;
    row.quizzes.byTier[tier] += arr.length;
    for (const question of arr) bump(row.quizzes.byType, question.type || 'unknown');
  }
}

// ----- Per-concept coverage: does each concept have a widget in its section? -----

const conceptHasWidget = new Map(); // conceptId -> bool
for (const f of readdirSync(contentDir)) {
  if (!f.endsWith('.json')) continue;
  const tid = f.replace(/\.json$/, '');
  const topic = model.topics.get(tid);
  if (!topic) continue;
  const j = JSON.parse(readFileSync(join(contentDir, f), 'utf8'));
  // Match widget blocks to concepts via the containing section's id (= anchor).
  // The content-json "section.id" is the anchor. Find the concept whose .anchor matches.
  for (const s of j.sections || []) {
    const conceptForSection = [...model.concepts.values()].find(
      (c) => c.topic === tid && c.anchor === s.id
    );
    if (!conceptForSection) continue;
    const hasWidget = (s.blocks || []).some((b) => b.type === 'widget');
    if (hasWidget) conceptHasWidget.set(conceptForSection.id, true);
  }
}

const conceptsMissingWidget = [];
const conceptsMissingHard = [];
for (const c of model.concepts.values()) {
  if (!conceptHasWidget.get(c.id)) conceptsMissingWidget.push(c);
  const q = model.quizByConcept.get(c.id);
  if (!q || !q.hard || q.hard.length === 0) conceptsMissingHard.push(c);
}

// ----- Roll up to per-subject tallies -----

const perSubject = new Map(); // subjectId -> aggregate
for (const s of model.sections) {
  perSubject.set(s.id, {
    id: s.id,
    title: s.title,
    topicCount: s.topics.length,
    conceptCount: 0,
    widgets: {
      total: 0,
      byFamily: new Map(),
      byDimension: new Map(),
      byGesture: new Map(),
      registryDriven: 0,
      inline: 0,
    },
    quizzes: {
      total: 0,
      byType: new Map(),
      byTier: { v1: 0, hard: 0, expert: 0 },
    },
  });
}
for (const row of perTopic.values()) {
  if (!row.section) continue;
  const sub = perSubject.get(row.section.id);
  if (!sub) continue;
  sub.conceptCount += row.conceptCount;
  sub.widgets.total += row.widgets.total;
  sub.widgets.registryDriven += row.widgets.registryDriven;
  sub.widgets.inline += row.widgets.inline;
  for (const [k, v] of row.widgets.byFamily) sub.widgets.byFamily.set(k, (sub.widgets.byFamily.get(k) || 0) + v);
  for (const [k, v] of row.widgets.byDimension) sub.widgets.byDimension.set(k, (sub.widgets.byDimension.get(k) || 0) + v);
  for (const [k, v] of row.widgets.byGesture) sub.widgets.byGesture.set(k, (sub.widgets.byGesture.get(k) || 0) + v);
  sub.quizzes.total += row.quizzes.total;
  sub.quizzes.byTier.v1 += row.quizzes.byTier.v1;
  sub.quizzes.byTier.hard += row.quizzes.byTier.hard;
  sub.quizzes.byTier.expert += row.quizzes.byTier.expert;
  for (const [k, v] of row.quizzes.byType) sub.quizzes.byType.set(k, (sub.quizzes.byType.get(k) || 0) + v);
}

// ----- Format output -----

function fmtMap(m) {
  if (!m.size) return '_(none)_';
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');
}

function makeSubjectSection(sub) {
  return `### ${sub.title}

- Topics: **${sub.topicCount}**, concepts: **${sub.conceptCount}**
- Widgets: **${sub.widgets.total}** (registry-driven: ${sub.widgets.registryDriven}, inline: ${sub.widgets.inline})
  - by family: ${fmtMap(sub.widgets.byFamily)}
  - by dimension: ${fmtMap(sub.widgets.byDimension)}
  - by gesture: ${fmtMap(sub.widgets.byGesture)}
- Quizzes: **${sub.quizzes.total}** (v1: ${sub.quizzes.byTier.v1}, hard: ${sub.quizzes.byTier.hard}, expert: ${sub.quizzes.byTier.expert})
  - by type: ${fmtMap(sub.quizzes.byType)}
`;
}

function makeTopicSection(row) {
  return `- \`${row.topic}\` (${row.section ? row.section.title : 'unassigned'}) — concepts=${row.conceptCount}, widgets=${row.widgets.total} (slug=${row.widgets.registryDriven}), quiz=${row.quizzes.total} (v1=${row.quizzes.byTier.v1}, hard=${row.quizzes.byTier.hard}, expert=${row.quizzes.byTier.expert})`;
}

// Corpus totals.
const totalWidgets = [...perTopic.values()].reduce((s, r) => s + r.widgets.total, 0);
const totalRegistry = [...perTopic.values()].reduce((s, r) => s + r.widgets.registryDriven, 0);
const totalInline = [...perTopic.values()].reduce((s, r) => s + r.widgets.inline, 0);
const totalQuizzes = [...perTopic.values()].reduce((s, r) => s + r.quizzes.total, 0);
const totalConcepts = [...perTopic.values()].reduce((s, r) => s + r.conceptCount, 0);
const tierTotals = { v1: 0, hard: 0, expert: 0 };
const typeTotals = new Map();
for (const r of perTopic.values()) {
  tierTotals.v1 += r.quizzes.byTier.v1;
  tierTotals.hard += r.quizzes.byTier.hard;
  tierTotals.expert += r.quizzes.byTier.expert;
  for (const [k, v] of r.quizzes.byType) typeTotals.set(k, (typeTotals.get(k) || 0) + v);
}

// Optional filters for the detail sections.
const subjects = [...perSubject.values()].filter(
  (s) => !subjectFilter || s.id === subjectFilter
);
const topics = [...perTopic.values()].filter(
  (r) =>
    (!topicFilter || r.topic === topicFilter) &&
    (!subjectFilter || (r.section && r.section.id === subjectFilter))
);

const summary = `# Coverage + type stats — widgets & quizzes

## Corpus totals

- Topics: **${model.topicIds.length}**, concepts: **${totalConcepts}**
- Widgets: **${totalWidgets}** (registry-driven: ${totalRegistry}, inline: ${totalInline})
- Quizzes: **${totalQuizzes}** (v1: ${tierTotals.v1}, hard: ${tierTotals.hard}, expert: ${tierTotals.expert})
- Quiz types: ${fmtMap(typeTotals)}
- Concepts lacking a widget in their section: **${conceptsMissingWidget.length}**
- Concepts lacking a hard-tier quiz: **${conceptsMissingHard.length}**

## Per-slug registry adoption

Every slug registered under \`widgets/<slug>/\`, with its current adoption
across \`content/<topic>.json\`. Slugs at **0 instances** are
infrastructure-only — they ship a renderer and a fixture, but no topic
page has wired one in yet.

| slug | family | gesture | dimension | instances | topics |
|---|---|---|---|---:|---|
${[...slugCounts.entries()]
  .sort(([, a], [, b]) => b.count - a.count || (a.count === 0 ? 0 : 0))
  .map(([slug, sc]) => {
    const meta = widgetMeta.get(slug) || {};
    const topicList = sc.topics.size === 0
      ? '_(none — fixture-only)_'
      : [...sc.topics].sort().join(', ');
    return `| \`${slug}\` | ${meta.family || '—'} | ${meta.gesture || '—'} | ${meta.dimension || '—'} | ${sc.count} | ${topicList} |`;
  })
  .join('\n')}

## Per-subject

${subjects.map(makeSubjectSection).join('\n')}
## Per-topic

${topics.map(makeTopicSection).join('\n')}

## Coverage gaps

### Concepts missing a widget in their owning section (top 20)

${
  conceptsMissingWidget.length === 0
    ? '_(none)_'
    : conceptsMissingWidget
        .slice(0, 20)
        .map((c) => `- \`${c.id}\` (${c.topic})`)
        .join('\n')
}

### Concepts missing a hard-tier quiz (top 20)

${
  conceptsMissingHard.length === 0
    ? '_(none)_'
    : conceptsMissingHard
        .slice(0, 20)
        .map((c) => `- \`${c.id}\` (${c.topic})`)
        .join('\n')
}
`;

mkdirSync(join(repoRoot, 'audits'), { recursive: true });
writeFileSync(join(repoRoot, 'audits/coverage-stats.md'), summary);

// Stdout: only the subject-level summary (the full report lives in audits/).
console.log(`# Coverage + type stats

## Corpus totals

- ${model.topicIds.length} topics, ${totalConcepts} concepts, ${totalWidgets} widgets, ${totalQuizzes} quizzes
- Registry-driven widgets: ${totalRegistry} (${((100 * totalRegistry) / Math.max(1, totalWidgets)).toFixed(1)}%)
- Quiz tiers: v1=${tierTotals.v1}, hard=${tierTotals.hard}, expert=${tierTotals.expert}
- Quiz types: ${fmtMap(typeTotals)}

## Per-subject summary

${subjects.map(makeSubjectSection).join('\n')}
## Coverage gaps

- ${conceptsMissingWidget.length} concepts lack a widget in their section
- ${conceptsMissingHard.length} concepts lack a hard-tier quiz

Full report: audits/coverage-stats.md
`);

process.exit(0);
