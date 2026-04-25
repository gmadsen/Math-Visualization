#!/usr/bin/env node
// Concept-graph health audit — evidence for the next architectural move.
//
// Advisory only; exit 0 always. Writes two files:
//   audits/graph-health.tsv       — per-concept rows
//   audits/graph-health-summary.md — aggregate counts + recommendations
// Prints the summary to stdout.
//
// Questions it answers:
//   1. Which concepts are referenced in multiple topics' prose (multi-topic
//      candidates — evidence for concept-as-source-of-truth migration)?
//   2. Which concepts have implicit prereqs — terms appearing in their own
//      prose without being declared as dependencies?
//   3. What terms appear as proper-noun phrases across topics but are not
//      declared concepts (graph gaps / missing nodes)?
//   4. Which concepts bundle multiple ideas in their blurb (atomicity
//      candidates to split)?
//   5. Which concepts are graph orphans (zero edges in or out)?

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContentModel, forEachSectionProse } from './lib/content-model.mjs';
import { escapeRe, TITLE_BLOCKLIST, MIN_TITLE_LEN } from './lib/audit-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const model = await loadContentModel();

// ----- 1. Build the title alternation regex (one pass per prose text) -----

// Sort titles longest-first so "functor of points" matches before "functor".
const matchable = [];
for (const [id, c] of model.concepts) {
  if (!c.title || c.title.length < MIN_TITLE_LEN) continue;
  if (TITLE_BLOCKLIST.has(c.title.toLowerCase())) continue;
  matchable.push({ id, title: c.title, topic: c.topic });
}
matchable.sort((a, b) => b.title.length - a.title.length);

const alt = matchable.map((m) => escapeRe(m.title)).join('|');
const combinedRe = new RegExp(`\\b(${alt})\\b`, 'gi');

// Lookup from normalized title to concept id (first-hit in the sorted-desc order wins).
const titleToId = new Map();
for (const { id, title } of matchable) {
  const norm = title.toLowerCase();
  if (!titleToId.has(norm)) titleToId.set(norm, id);
}

// ----- 2. Collect prose per topic + per concept-section -----

// topicProse[topicId] = concatenated masked prose of every section in the topic
// conceptProse[conceptId] = masked prose of this concept's owning section only
const topicProse = new Map();
const conceptProse = new Map();

for (const [tid, topic] of model.topics) {
  let all = '';
  for (const [anchor, section] of topic.sections) {
    let sectionText = '';
    forEachSectionProse(section, (_, { masked }) => {
      sectionText += ' ' + masked;
    });
    // map anchor back to concept id
    const conceptForAnchor = [...model.concepts.values()].find(
      (c) => c.topic === tid && c.anchor === anchor
    );
    if (conceptForAnchor) conceptProse.set(conceptForAnchor.id, sectionText);
    all += ' ' + sectionText;
  }
  topicProse.set(tid, all);
}

// ----- 3. For each concept: incoming / outgoing / topic_spread / implicit -----

const rows = [];

for (const [id, c] of model.concepts) {
  const incoming = model.byPrereq.get(id)?.size || 0;
  const outgoing = (c.prereqs || []).length;

  // topic_spread: how many distinct topics mention this concept's title in prose
  const titleLower = (c.title || '').toLowerCase();
  let topic_spread = 0;
  if (titleLower.length >= MIN_TITLE_LEN && !TITLE_BLOCKLIST.has(titleLower)) {
    const perTitleRe = new RegExp(`\\b${escapeRe(c.title)}\\b`, 'i');
    for (const [tid, text] of topicProse) {
      if (tid === c.topic) continue; // ignore own topic
      if (perTitleRe.test(text)) topic_spread++;
    }
  }

  // implicit_prereqs: concepts whose titles appear in THIS concept's section prose
  // but aren't in the declared prereqs list (and aren't self)
  const declared = new Set(c.prereqs || []);
  const implicit = new Set();
  const ownText = conceptProse.get(id) || '';
  if (ownText) {
    combinedRe.lastIndex = 0;
    let m;
    while ((m = combinedRe.exec(ownText)) !== null) {
      const matchedId = titleToId.get(m[1].toLowerCase());
      if (!matchedId) continue;
      if (matchedId === id) continue;
      if (declared.has(matchedId)) continue;
      implicit.add(matchedId);
    }
  }

  // blurb atomicity
  const blurb = c.blurb || '';
  const sentenceCount = Math.max(
    1,
    (blurb.match(/[.!?](?:\s|$)/g) || []).length
  );

  // recommendation — mutually non-exclusive in reality, but pick the dominant signal
  let recommendation = 'keep';
  if (incoming === 0 && outgoing === 0) recommendation = 'orphan-candidate';
  else if (topic_spread >= 3) recommendation = 'extract-multi-topic';
  else if (implicit.size >= 3) recommendation = `add-prereqs:${implicit.size}`;
  else if (sentenceCount >= 3 && blurb.length > 200) recommendation = 'split-blurb';

  rows.push({
    id,
    title: c.title,
    topic: c.topic,
    incoming,
    outgoing,
    topic_spread,
    implicit_prereqs: implicit.size,
    blurb_sentences: sentenceCount,
    blurb_chars: blurb.length,
    recommendation,
    implicit_list: [...implicit].slice(0, 8).join('|'), // cap for TSV width
  });
}

// ----- 4. Dangling terms: proper-noun phrases in prose not matching any concept title -----

// Match 2–3 word Title Case phrases. Exclude single words (too noisy).
const properNounRe = /\b[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,2}\b/g;
const knownTitlesLower = new Set([...titleToId.keys()]);

const danglingByTerm = new Map(); // normalized-term -> Set of topics
for (const [tid, text] of topicProse) {
  let m;
  properNounRe.lastIndex = 0;
  while ((m = properNounRe.exec(text)) !== null) {
    const term = m[0];
    const norm = term.toLowerCase();
    if (knownTitlesLower.has(norm)) continue;
    if (!danglingByTerm.has(norm)) danglingByTerm.set(norm, { term, topics: new Set() });
    danglingByTerm.get(norm).topics.add(tid);
  }
}

const danglingMulti = [...danglingByTerm.values()]
  .filter((d) => d.topics.size >= 2)
  .sort((a, b) => b.topics.size - a.topics.size);

// ----- 5. Aggregate counts -----

const totalEdges = rows.reduce((s, r) => s + r.outgoing, 0);
const totalImplicit = rows.reduce((s, r) => s + r.implicit_prereqs, 0);
const multiTopicCount = rows.filter((r) => r.topic_spread >= 3).length;
const atomicitySplits = rows.filter(
  (r) => r.blurb_sentences >= 3 && r.blurb_chars > 200
).length;
const orphans = rows.filter((r) => r.incoming === 0 && r.outgoing === 0).length;

// ----- 6. Write TSV (sorted by implicit then topic_spread, both desc) -----

mkdirSync(join(repoRoot, 'audits'), { recursive: true });

const tsvHeader =
  'id\ttitle\ttopic\tincoming\toutgoing\ttopic_spread\timplicit_prereqs\tblurb_sentences\tblurb_chars\trecommendation\timplicit_list\n';
const tsvRows = rows
  .slice()
  .sort((a, b) => {
    if (b.topic_spread !== a.topic_spread) return b.topic_spread - a.topic_spread;
    if (b.implicit_prereqs !== a.implicit_prereqs)
      return b.implicit_prereqs - a.implicit_prereqs;
    return b.incoming - a.incoming;
  })
  .map(
    (r) =>
      `${r.id}\t${r.title}\t${r.topic}\t${r.incoming}\t${r.outgoing}\t${r.topic_spread}\t${r.implicit_prereqs}\t${r.blurb_sentences}\t${r.blurb_chars}\t${r.recommendation}\t${r.implicit_list}`
  );
writeFileSync(join(repoRoot, 'audits/graph-health.tsv'), tsvHeader + tsvRows.join('\n') + '\n');

// ----- 7. Write summary markdown + stdout -----

const recommendationLines = [];
if (multiTopicCount >= 100)
  recommendationLines.push(
    `- ✅ **multi-topic ≥ 100** (${multiTopicCount}): concept-as-source-of-truth migration is warranted. A meaningful fraction of the graph is already multi-topic in effect; formalizing it matches the proof-checker vision.`
  );
if (totalImplicit >= 200)
  recommendationLines.push(
    `- ✅ **implicit_prereqs ≥ 200** (${totalImplicit}): edge enrichment first. The existing graph has too many missing dependencies to benefit from restructuring.`
  );
if (danglingMulti.length >= 50)
  recommendationLines.push(
    `- ✅ **dangling_terms ≥ 50** (${danglingMulti.length}): add nodes before restructuring. The graph has identifiable gaps — proper-noun phrases that recur across topics without being defined as concepts.`
  );
if (
  multiTopicCount < 100 &&
  totalImplicit < 200 &&
  danglingMulti.length < 50
)
  recommendationLines.push(
    `- All three signals are below their thresholds. Current architecture is adequate; expand by decomposing under-built topics (41 of 58 still at the 5-concept scaffolding default).`
  );

const topMultiTopic = rows
  .filter((r) => r.topic_spread >= 3)
  .sort((a, b) => b.topic_spread - a.topic_spread)
  .slice(0, 15);
const topImplicit = rows
  .filter((r) => r.implicit_prereqs > 0)
  .sort((a, b) => b.implicit_prereqs - a.implicit_prereqs)
  .slice(0, 15);
const topAtomicity = rows
  .filter((r) => r.blurb_sentences >= 3 && r.blurb_chars > 200)
  .sort((a, b) => b.blurb_chars - a.blurb_chars)
  .slice(0, 10);

// ----- 7b. Per-topic scorecard (folded in from retired audit-concept-graph-health.mjs) -----
// Roll up the per-concept rows into a per-topic view. Signals aggregated here
// are a subset of the retired script's scorecard — specifically the ones that
// fall out of THIS audit's row data without re-parsing pages or quiz banks.
// Retained: concept count, dead-end count (incoming=0), orphan count, total
// implicit-prereq flags, multi-topic candidate count. Dropped (because the
// data is available from dedicated audits): stale-blurb flags,
// widget-interactivity ratios, cross-topic prereq suggestions.

const perTopic = new Map(); // tid -> { concepts, deadEnds, orphans, implicit, multiTopic }
for (const r of rows) {
  if (!perTopic.has(r.topic)) {
    perTopic.set(r.topic, { concepts: 0, deadEnds: 0, orphans: 0, implicit: 0, multiTopic: 0 });
  }
  const t = perTopic.get(r.topic);
  t.concepts++;
  if (r.incoming === 0) t.deadEnds++;
  if (r.incoming === 0 && r.outgoing === 0) t.orphans++;
  t.implicit += r.implicit_prereqs;
  if (r.topic_spread >= 3) t.multiTopic++;
}

function scorecardBucket(implicit, deadEnds) {
  // Crude health: 🟢 if no implicit flags and ≤1 dead-end, 🟡 if <5 implicit
  // and <4 dead-ends, else 🔴. Matches the spirit of the retired script's
  // per-metric buckets without over-calibrating.
  if (implicit === 0 && deadEnds <= 1) return 'green';
  if (implicit < 5 && deadEnds < 4) return 'yellow';
  return 'red';
}
const EMOJI = { green: '🟢', yellow: '🟡', red: '🔴' };

const scorecardRows = [...perTopic.entries()]
  .map(([tid, s]) => ({
    topic: tid,
    ...s,
    bucket: scorecardBucket(s.implicit, s.deadEnds),
  }))
  .sort((a, b) => {
    const order = { red: 0, yellow: 1, green: 2 };
    return order[a.bucket] - order[b.bucket] || a.topic.localeCompare(b.topic);
  });

const bucketTotals = { green: 0, yellow: 0, red: 0 };
for (const s of scorecardRows) bucketTotals[s.bucket]++;

const summary = `# Concept graph health — summary

- Total concepts: **${rows.length}**
- Total prereq edges: **${totalEdges}**
- Implicit prereq candidates (total across all concepts): **${totalImplicit}**
- Multi-topic candidates (title appears in prose of ≥ 3 other topics): **${multiTopicCount}**
- Atomicity-split candidates (blurb ≥ 3 sentences AND > 200 chars): **${atomicitySplits}**
- Dangling proper-noun phrases (in ≥ 2 topics, no matching concept): **${danglingMulti.length}**
- Orphan concepts (zero edges in or out): **${orphans}**

## Decision framework

${recommendationLines.join('\n')}

## Top 15 multi-topic candidates

${
  topMultiTopic.length === 0
    ? '_(none)_'
    : topMultiTopic
        .map(
          (r) => `- \`${r.id}\` (${r.topic}) — title appears in prose of **${r.topic_spread}** other topics`
        )
        .join('\n')
}

## Top 15 implicit-prereq flags

${
  topImplicit.length === 0
    ? '_(none)_'
    : topImplicit
        .map(
          (r) =>
            `- \`${r.id}\` (${r.topic}) — ${r.implicit_prereqs} missing: ${r.implicit_list.split('|').slice(0, 5).join(', ')}`
        )
        .join('\n')
}

## Top 20 dangling proper-noun phrases (by topic count)

${
  danglingMulti.length === 0
    ? '_(none)_'
    : danglingMulti
        .slice(0, 20)
        .map((d) => `- "${d.term}" — in **${d.topics.size}** topics`)
        .join('\n')
}

## Top 10 atomicity-split candidates

${
  topAtomicity.length === 0
    ? '_(none)_'
    : topAtomicity
        .map((r) => `- \`${r.id}\` (${r.topic}) — ${r.blurb_sentences} sentences, ${r.blurb_chars} chars`)
        .join('\n')
}

## Per-topic scorecard

Compact roll-up of the rows above. Bucket: 🟢 healthy (no implicit flags, ≤1 dead-end), 🟡 minor, 🔴 attention. Summary: ${bucketTotals.green} 🟢 · ${bucketTotals.yellow} 🟡 · ${bucketTotals.red} 🔴.

| topic | concepts | dead-ends | orphans | implicit | multi-topic | bucket |
|---|---:|---:|---:|---:|---:|:---:|
${scorecardRows
  .map(
    (s) =>
      `| \`${s.topic}\` | ${s.concepts} | ${s.deadEnds} | ${s.orphans} | ${s.implicit} | ${s.multiTopic} | ${EMOJI[s.bucket]} |`
  )
  .join('\n')}
`;

writeFileSync(join(repoRoot, 'audits/graph-health-summary.md'), summary);
console.log(summary);
process.exit(0);
