#!/usr/bin/env node
// Unit tests for scripts/audit-doc-drift.mjs's corpus-snapshot gate.
//
// `checkCorpusSnapshot()` is the structural-prevention layer this PR adds
// to keep PLAN.md / README.md / AGENTS.md numerical claims from drifting
// silently. Three concerns:
//   1. `computeCorpusTruth(rootDir)` walks concepts/ + quizzes/ and returns
//      a fixed shape. A regression that breaks the prereq-counting loop
//      (or quiz-tier counting) would silently zero out drift detection.
//   2. `detectSnapshotDrift({planText, ...})` is the regex-matching layer.
//      A regression where one of the snapshot regexes silently fails to
//      match means future drift goes uncaught (the audit reports nothing
//      and exits clean).
//   3. The two layers compose into the CI gate; verify both work alone
//      and the wrapper catches injected drift.

import { mkdirSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  computeCorpusTruth,
  detectSnapshotDrift,
} from './audit-doc-drift.mjs';

const failures = [];
function check(name, cond, detail) {
  if (cond) {
    console.log(`  ok  ${name}`);
  } else {
    failures.push(`${name}${detail ? ': ' + detail : ''}`);
    console.log(`  FAIL ${name}${detail ? ' — ' + detail : ''}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Build a synthetic repo root with a controlled corpus.

function makeFakeRepo() {
  const root = mkdtempSync(join(tmpdir(), 'mvnb-doc-drift-'));
  mkdirSync(join(root, 'concepts'));
  mkdirSync(join(root, 'quizzes'));
  writeFileSync(join(root, 'concepts', 'index.json'), JSON.stringify({
    topics: ['alpha', 'beta'],
  }));
  writeFileSync(join(root, 'concepts', 'sections.json'), JSON.stringify({
    sections: [
      { id: 's1', title: 'One', topics: ['alpha'] },
      { id: 's2', title: 'Two', topics: ['beta'] },
    ],
  }));
  writeFileSync(join(root, 'concepts', 'capstones.json'), JSON.stringify({
    capstones: [{ id: 'cap-1', title: 'Capstone' }],
  }));
  // alpha: 2 concepts, alpha-2 prereqs alpha-1. beta: 1 concept, prereqs alpha-1 (cross-topic).
  writeFileSync(join(root, 'concepts', 'alpha.json'), JSON.stringify({
    concepts: [
      { id: 'alpha-1', title: 'A1', anchor: 'a1', prereqs: [], blurb: '' },
      { id: 'alpha-2', title: 'A2', anchor: 'a2', prereqs: ['alpha-1'], blurb: '' },
    ],
  }));
  writeFileSync(join(root, 'concepts', 'beta.json'), JSON.stringify({
    concepts: [
      { id: 'beta-1', title: 'B1', anchor: 'b1', prereqs: ['alpha-1'], blurb: '' },
    ],
  }));
  // Quizzes: alpha-1 has v1+hard, alpha-2 has v1 only, beta-1 has v1+hard+expert.
  writeFileSync(join(root, 'quizzes', 'alpha.json'), JSON.stringify({
    quizzes: {
      'alpha-1': { questions: [{}, {}, {}], hard: [{}] },
      'alpha-2': { questions: [{}, {}] },
    },
  }));
  writeFileSync(join(root, 'quizzes', 'beta.json'), JSON.stringify({
    quizzes: {
      'beta-1': { questions: [{}], hard: [{}, {}], expert: [{}] },
    },
  }));
  return root;
}

// ─────────────────────────────────────────────────────────────────────────
// computeCorpusTruth shape + arithmetic.

{
  const root = makeFakeRepo();
  const truth = computeCorpusTruth(root);
  check('truth: topic count = 2', truth.topics === 2, `got ${truth.topics}`);
  check('truth: section count = 2', truth.sections === 2, `got ${truth.sections}`);
  check('truth: capstone count = 1', truth.capstones === 1, `got ${truth.capstones}`);
  check('truth: concept count = 3', truth.concepts === 3, `got ${truth.concepts}`);
  check('truth: prereq edge count = 2', truth.prereqs === 2, `got ${truth.prereqs}`);
  check('truth: cross-topic edge count = 1', truth.crossTopic === 1, `got ${truth.crossTopic}`);
  check('truth: v1 quiz count = 6', truth.v1 === 6, `got ${truth.v1}`);
  check('truth: hard quiz count = 3', truth.hard === 3, `got ${truth.hard}`);
  check('truth: expert quiz count = 1', truth.expert === 1, `got ${truth.expert}`);
  // alpha-2 lacks hard; beta-1 has hard. So 3 concepts, 2 with hard → 1 lacking.
  check('truth: lackingHard = 1', truth.lackingHard === 1, `got ${truth.lackingHard}`);
}

// Missing-files path: returns null, doesn't throw.
{
  const root = mkdtempSync(join(tmpdir(), 'mvnb-doc-drift-empty-'));
  const truth = computeCorpusTruth(root);
  check('truth: missing concept files returns null', truth === null,
    JSON.stringify(truth));
}

// ─────────────────────────────────────────────────────────────────────────
// detectSnapshotDrift — regex layer.

const TRUTH_FAKE = {
  topics: 5, sections: 2, capstones: 1, concepts: 10, prereqs: 12,
  crossTopic: 3, v1: 30, hard: 8, expert: 0, lackingHard: 4,
};

// Clean state: zero drift.
{
  const planText = `
- 5 topics, 10 concepts, 12 prereq edges (3 cross-topic), 1 capstones
- Quiz tiers: v1 = 30, hard = 8, expert = 0
- (4 concepts lack hard tier)
`;
  const readmeText = `pick any of the 1 capstones … the entire 10-concept graph`;
  const agentsText = `The 2 sections:`;
  const drifts = detectSnapshotDrift({ planText, readmeText, agentsText, truth: TRUTH_FAKE });
  check('clean snapshot: zero drifts', drifts.length === 0,
    `${drifts.length} drift(s): ${drifts.map(d => d.label).join(',')}`);
}

// Drifted: every numeric is wrong; every match should fire.
{
  const planText = `
- 9 topics, 99 concepts, 99 prereq edges (9 cross-topic), 9 capstones
- Quiz tiers: v1 = 99, hard = 99, expert = 9
- (9 concepts lack hard tier)
`;
  const readmeText = `pick any of the 9 capstones … the entire 99-concept graph`;
  const agentsText = `The 9 sections:`;
  const drifts = detectSnapshotDrift({ planText, readmeText, agentsText, truth: TRUTH_FAKE });
  // Expected drift labels:
  const expected = new Set([
    'topic count', 'concept count', 'prereq edges', 'cross-topic edges', 'capstone count',
    'v1 quiz count', 'hard quiz count', 'expert quiz count',
    'concepts lacking hard tier',
    'capstone count', 'concept-graph size',
    'section count',
  ]);
  // capstone count appears in both PLAN and README: total 12 distinct labels-by-file.
  check('drifted snapshot: PLAN topic count flagged',
    drifts.some(d => d.file === 'PLAN.md' && d.label === 'topic count'));
  check('drifted snapshot: PLAN v1 quiz count flagged',
    drifts.some(d => d.file === 'PLAN.md' && d.label === 'v1 quiz count'));
  check('drifted snapshot: PLAN concepts lacking hard flagged',
    drifts.some(d => d.file === 'PLAN.md' && d.label === 'concepts lacking hard tier'));
  check('drifted snapshot: README capstone count flagged',
    drifts.some(d => d.file === 'README.md' && d.label === 'capstone count'));
  check('drifted snapshot: README concept-graph size flagged',
    drifts.some(d => d.file === 'README.md' && d.label === 'concept-graph size'));
  check('drifted snapshot: AGENTS section count flagged',
    drifts.some(d => d.file === 'AGENTS.md' && d.label === 'section count'));
  check('drifted snapshot: at least 9 drifts reported',
    drifts.length >= 9, `${drifts.length} drift(s)`);
}

// Partial drift: only one number wrong; only that one should fire.
{
  const planText = `
- 5 topics, 99 concepts, 12 prereq edges (3 cross-topic), 1 capstones
- Quiz tiers: v1 = 30, hard = 8, expert = 0
- (4 concepts lack hard tier)
`;
  const drifts = detectSnapshotDrift({ planText, readmeText: '', agentsText: '', truth: TRUTH_FAKE });
  check('single-drift: exactly one finding',
    drifts.length === 1, `${drifts.length} drifts: ${drifts.map(d => d.label).join(',')}`);
  check('single-drift: it is the concept count',
    drifts[0] && drifts[0].label === 'concept count' && Number(drifts[0].claim) === 99,
    JSON.stringify(drifts[0]));
}

// Missing PLAN.md snapshot line: zero drifts (reported nothing to compare).
{
  const planText = `Random other prose with no snapshot line.`;
  const drifts = detectSnapshotDrift({ planText, readmeText: '', agentsText: '', truth: TRUTH_FAKE });
  check('missing snapshot line: zero drifts (no false positive)',
    drifts.length === 0, `${drifts.length} drift(s)`);
}

console.log('');
if (failures.length === 0) {
  console.log(`test-doc-drift: all assertions passed.`);
  process.exit(0);
} else {
  console.error(`test-doc-drift: ${failures.length} failure(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
