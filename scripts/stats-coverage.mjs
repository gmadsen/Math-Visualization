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

// A widget's effective gesture. `slider-svg-2d` carries the coarse slug gesture
// "slider" in its registry meta, but hosts a heterogeneous `params.controls`
// array (slider / select / numinput / button / span), so counting every
// instance as "slider" over-reports sliders and hides ~100 select-driven and
// ~30 numinput-driven widgets (the #380 follow-up). When a block declares a
// typed `controls` array, classify by what it actually contains — slider-first,
// since a widget with a slider IS a slider widget; one with only a select/input
// is not. `span` is a readout, never a gesture. Slugs with no `controls` array
// (clickable-diagram's verbatim controlsLiteral, button-stepper, …) keep their
// registry meta gesture.
//
// We key strictly on `controls[].type` and only the slider-svg-2d vocabulary
// (slider/select/numinput/button). `surface-viewer` also carries a `controls`
// array but keys each entry as `.kind` (orbit/zoom/…), so its entries yield
// `undefined` here and fall through to its meta gesture ("drag") by design — the
// unrecognised-type fall-through is what keeps this scoped to slider-svg-2d
// without hard-coding the slug.
function effectiveGesture(b, meta) {
  const controls = b.params && Array.isArray(b.params.controls) ? b.params.controls : null;
  if (controls && controls.length) {
    const types = new Set(controls.map((c) => c && c.type));
    if (types.has('slider')) return 'slider';
    if (types.has('select')) return 'select';
    if (types.has('numinput')) return 'input';
    if (types.has('button')) return 'button';
  }
  return meta.gesture || 'unknown';
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
      bump(row.widgets.byGesture, effectiveGesture(b, meta));
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

// ----- Per-concept coverage: does each concept have a widget in its span? -----
//
// A concept is credited with a toy if a `widget` block appears within its
// content SPAN — from its anchor to the next concept anchor in reading order —
// not merely when `anchor === section.id`. The old section-id-equality rule had
// two failure modes that mis-stated coverage:
//   - h3-anchored sub-concepts (anchor is an <h3 id> inside a larger section,
//     e.g. `discriminant`, `paths`) were NEVER credited, even with a widget
//     sitting right beside their prose.
//   - concepts SHARING a section's id with a sibling were credited via the
//     sibling's widget even when their own sub-region had none.
// Walking the block stream and tracking the most-recent concept anchor fixes
// both: a widget credits whichever concept's span it falls in. Anchor-sharing
// siblings (two concepts with the same anchor) are both credited. Non-concept
// ids (decorative sub-headings, element ids) don't end a span.
const conceptHasWidget = new Map(); // conceptId -> bool
for (const f of readdirSync(contentDir)) {
  if (!f.endsWith('.json')) continue;
  const tid = f.replace(/\.json$/, '');
  const topic = model.topics.get(tid);
  if (!topic) continue;
  const j = JSON.parse(readFileSync(join(contentDir, f), 'utf8'));

  const topicConcepts = [...model.concepts.values()].filter((c) => c.topic === tid);
  const anchorSet = new Set(topicConcepts.map((c) => c.anchor));

  // Reading-order event stream: each concept-anchor occurrence opens a new
  // span; each widget block credits the open span's concept(s).
  let currentAnchor = null;
  const creditCurrent = () => {
    if (!currentAnchor) return;
    for (const c of topicConcepts) {
      if (c.anchor === currentAnchor) conceptHasWidget.set(c.id, true);
    }
  };
  for (const s of j.sections || []) {
    if (s.id && anchorSet.has(s.id)) currentAnchor = s.id;
    for (const b of s.blocks || []) {
      if (b.type === 'widget') {
        creditCurrent();
      } else if (b.type === 'raw' && typeof b.html === 'string') {
        for (const m of b.html.matchAll(/\bid="([^"]+)"/g)) {
          if (anchorSet.has(m[1])) currentAnchor = m[1];
        }
      }
    }
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
- Concepts lacking a widget in their span: **${conceptsMissingWidget.length}** (anchor→next-anchor reading-order span; see "Coverage gaps" for the list)
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

### Concepts missing a widget in their span (top 20)

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

- ${conceptsMissingWidget.length} concepts lack a widget in their span
- ${conceptsMissingHard.length} concepts lack a hard-tier quiz

Full report: audits/coverage-stats.md
`);

process.exit(0);
