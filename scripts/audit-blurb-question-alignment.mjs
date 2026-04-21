#!/usr/bin/env node
// Audit alignment between concept blurbs and their owning quiz banks.
//
// Advisory pass over the notebook: for each concept in concepts/<topic>.json,
// tokenize its `blurb` + `title` and compare that bag of content-words to the
// tokens harvested from the concept's quiz questions (v1, hard, expert tiers)
// in quizzes/<topic>.json. Flag concepts whose blurb names topics the quiz
// bank never touches, and flag individual questions that share zero technical
// terms with the owning blurb.
//
// Coverage metric: fraction of blurb content-tokens (stemmed, stop-word- and
// bland-filtered) that appear in AT LEAST ONE of the concept's questions.
//
// Tokenizer is the same shape as audit-stale-blurbs.mjs — lowercased
// alphanumeric runs, min-length 5, stop-word filtered, lightly stemmed.
//
// CLI:
//   node scripts/audit-blurb-question-alignment.mjs
//   node scripts/audit-blurb-question-alignment.mjs --threshold 0.5
//   node scripts/audit-blurb-question-alignment.mjs --verbose
//
// Always exits 0 (advisory audit, not a CI gate).
//
// Zero external dependencies.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');
const quizzesDir = join(repoRoot, 'quizzes');

// ─────────────────────────────────────────────────────────────────────────
// CLI.

const argv = process.argv.slice(2);
const VERBOSE = argv.includes('--verbose');

let THRESHOLD = 0.30;
{
  const i = argv.indexOf('--threshold');
  if (i !== -1 && i + 1 < argv.length) {
    const v = parseFloat(argv[i + 1]);
    if (!Number.isNaN(v) && v >= 0 && v <= 1) THRESHOLD = v;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Thresholds / params (mirrors audit-stale-blurbs.mjs).

const MIN_TOKEN_LEN = 5;

const STOP = new Set([
  'about', 'above', 'after', 'again', 'against', 'along', 'among', 'around',
  'because', 'before', 'below', 'between', 'beyond', 'during', 'every',
  'other', 'under', 'until', 'which', 'while', 'within', 'without',
  'their', 'there', 'these', 'those', 'where', 'whether',
  'would', 'could', 'should', 'might', 'shall',
  'being', 'been', 'have', 'having', 'does', 'doing', 'made', 'make',
  'some', 'such', 'same', 'more', 'most', 'many', 'much', 'also',
  'into', 'onto', 'from', 'this', 'that', 'with', 'than', 'then',
  'given', 'thus', 'hence', 'moreover', 'furthermore', 'however',
  'therefore', 'whenever', 'consider', 'take',
  'note', 'observe', 'recall', 'here',
  'suppose', 'assume', 'define', 'defined', 'denote', 'denoted',
  'called', 'namely', 'really', 'simply', 'clearly', 'similarly',
  'example', 'examples', 'theorem', 'theorems', 'lemma', 'lemmas',
  'proof', 'proofs', 'remark', 'remarks', 'corollary', 'corollaries',
  'standard', 'general', 'generally', 'specific', 'specifically',
  'since',
  'section', 'sections', 'widget', 'widgets', 'picture', 'pictures',
  'slider', 'button', 'click', 'diagram', 'diagrams',
  'drag', 'figure', 'figures', 'write', 'writes', 'writing',
  'reader', 'readers', 'first', 'second', 'third', 'finally', 'often',
  'whose', 'everything',
  'something', 'nothing', 'anything', 'always', 'never',
]);

const BLAND = new Set([
  'object', 'arrow', 'structure',
  'notion', 'idea', 'concept', 'result', 'setting', 'proper', 'properly',
  'natural', 'naturally', 'trivial', 'trivially',
  'useful', 'usefully',
  'carry', 'carrie', 'produc', 'provide', 'exhibit', 'describe', 'illustrate',
  'reflect', 'record', 'package', 'share', 'yield', 'promote', 'combine',
  'connect', 'distinguish', 'expres', 'extend', 'reduce', 'refine',
  'capture', 'recover', 'suffice', 'require', 'satisfy', 'enforce',
  'replace', 'present', 'contain', 'create', 'appear', 'arise', 'treat',
  'work', 'form', 'use', 'used', 'using', 'allow', 'allows',
  'give', 'gives', 'show', 'shows', 'turn', 'turns',
  'exactly', 'roughly', 'essentially', 'basically', 'precisely',
  'class', 'classes', 'pattern', 'patterns', 'visible', 'particular',
  'common', 'unique', 'distinct', 'certain',
  'large', 'larger', 'small', 'smaller', 'partial',
  'total', 'complete', 'correct', 'simple', 'rigorous', 'explicit',
  'concrete', 'abstract', 'direct', 'indirect', 'reverse', 'forward',
  'single', 'double', 'pair', 'triple', 'quadruple',
  'versu',
  'modern', 'classical', 'recent', 'current', 'historical',
  'important', 'essential', 'major', 'minor', 'basic', 'core', 'central',
  'sketch', 'outline', 'overview', 'introduction', 'preview', 'summary',
  'language', 'framework', 'tool', 'tools', 'perspective', 'viewpoint',
  'component', 'componentwise', 'element', 'elementwise', 'entry', 'item',
  'step', 'steps', 'case', 'cases', 'kind', 'kinds', 'type', 'types',
  'side', 'sides', 'half', 'whole', 'part', 'parts', 'bit', 'piece',
  'alongside',
  'value', 'values', 'input', 'output',
  'readout', 'control', 'toggle',
  // question-answer-prose boilerplate (avoid spurious "question covers X")
  'which', 'select', 'compute', 'answer', 'choose', 'correct', 'correctly',
  'incorrect', 'true', 'false', 'follow', 'following', 'statement',
  'statements', 'option', 'options', 'above', 'below', 'none',
]);

// ─────────────────────────────────────────────────────────────────────────
// Load concept graph + quiz bank.

const indexPath = join(conceptsDir, 'index.json');
const topics = JSON.parse(readFileSync(indexPath, 'utf8')).topics;

const topicData = new Map(); // topic -> concepts JSON
const quizData = new Map();  // topic -> quiz JSON

for (const topic of topics) {
  const cp = join(conceptsDir, `${topic}.json`);
  const qp = join(quizzesDir, `${topic}.json`);
  if (existsSync(cp)) {
    topicData.set(topic, JSON.parse(readFileSync(cp, 'utf8')));
  }
  if (existsSync(qp)) {
    quizData.set(topic, JSON.parse(readFileSync(qp, 'utf8')));
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Tokenization helpers (identical shape to audit-stale-blurbs.mjs).

function stripMath(s) {
  let b = s || '';
  b = b.replace(/\$\$[\s\S]*?\$\$/g, ' ');
  b = b.replace(/(^|[^\\])\$[^$\n]*?\$/g, '$1 ');
  b = b.replace(/\\\([\s\S]*?\\\)/g, ' ');
  b = b.replace(/\\\[[\s\S]*?\\\]/g, ' ');
  // LaTeX control sequences like \mathbb, \frac, etc. — drop the backslash
  // name so the letters don't leak into the token stream.
  b = b.replace(/\\[a-zA-Z]+/g, ' ');
  return b;
}

function tokenize(text) {
  const raw = text.toLowerCase().split(/[^a-z0-9]+/);
  const out = [];
  for (const t of raw) {
    if (!t) continue;
    if (t.length < MIN_TOKEN_LEN) continue;
    if (/^\d+$/.test(t)) continue;
    if (STOP.has(t)) continue;
    out.push(t);
  }
  return out;
}

function stem(tok) {
  if (tok.length > 5 && tok.endsWith('ies')) return tok.slice(0, -3) + 'y';
  if (tok.length > 4 && tok.endsWith('ves')) return tok.slice(0, -3) + 'f';
  if (tok.length > 6 && tok.endsWith('sses')) return tok.slice(0, -2);
  if (tok.length > 5 && tok.endsWith('s') && !tok.endsWith('ss')) {
    tok = tok.slice(0, -1);
  }
  if (tok.length > 7 && tok.endsWith('ization')) return tok.slice(0, -7);
  if (tok.length > 6 && tok.endsWith('ation')) return tok.slice(0, -5);
  if (tok.length > 6 && tok.endsWith('tion')) return tok.slice(0, -4);
  if (tok.length > 6 && tok.endsWith('sion')) return tok.slice(0, -4);
  if (tok.length > 6 && tok.endsWith('ness')) return tok.slice(0, -4);
  if (tok.length > 6 && tok.endsWith('ment')) return tok.slice(0, -4);
  if (tok.length > 6 && tok.endsWith('ing')) return tok.slice(0, -3);
  if (tok.length > 6 && tok.endsWith('ed')) return tok.slice(0, -2);
  return tok;
}

function toBag(text) {
  const bag = new Map();
  for (const t of tokenize(stripMath(text))) {
    const s = stem(t);
    if (BLAND.has(s)) continue;
    bag.set(s, (bag.get(s) || 0) + 1);
  }
  return bag;
}

// Flatten a single question into a single text blob we can tokenize.
// Includes q, explain, hint, choices, items, title (if any).
function questionText(qObj) {
  const parts = [];
  if (qObj.q) parts.push(qObj.q);
  if (qObj.explain) parts.push(qObj.explain);
  if (qObj.hint) parts.push(qObj.hint);
  if (Array.isArray(qObj.choices)) parts.push(qObj.choices.join(' '));
  if (Array.isArray(qObj.items)) parts.push(qObj.items.join(' '));
  return parts.join(' ');
}

// ─────────────────────────────────────────────────────────────────────────
// Scan.

const rows = []; // per-concept results
const offTopicQuestions = []; // questions with zero overlap with blurb

for (const [topic, d] of topicData) {
  const qbank = quizData.get(topic);
  const quizzes = qbank && qbank.quizzes ? qbank.quizzes : {};

  for (const c of d.concepts || []) {
    const id = c.id;
    const bankEntry = quizzes[id];
    if (!bankEntry) continue; // no quiz yet; nothing to align against

    // Build blurb bag from blurb + title.
    const blurbText = [c.blurb || '', c.title || ''].join(' ');
    const blurbBag = toBag(blurbText);

    // Collect all tiers' questions.
    const tiers = [];
    if (Array.isArray(bankEntry.questions)) {
      for (const q of bankEntry.questions) tiers.push({ tier: 'v1', q });
    }
    if (Array.isArray(bankEntry.hard)) {
      for (const q of bankEntry.hard) tiers.push({ tier: 'hard', q });
    }
    if (Array.isArray(bankEntry.expert)) {
      for (const q of bankEntry.expert) tiers.push({ tier: 'expert', q });
    }

    if (tiers.length === 0) continue;

    // For each blurb token, tally how many questions mention it.
    const perTokenQuestionCount = new Map(); // stem -> count of questions it hits
    for (const k of blurbBag.keys()) perTokenQuestionCount.set(k, 0);

    // Per-question bags so we can flag off-topic questions.
    const questionBags = tiers.map((entry) => {
      const bag = toBag(questionText(entry.q));
      for (const k of perTokenQuestionCount.keys()) {
        if (bag.has(k)) perTokenQuestionCount.set(k, perTokenQuestionCount.get(k) + 1);
      }
      return { ...entry, bag };
    });

    // Coverage: fraction of blurb tokens that appear in ≥1 question.
    const total = blurbBag.size;
    const hit = total === 0
      ? 0
      : [...perTokenQuestionCount.values()].filter((n) => n > 0).length;
    const coverage = total === 0 ? 1 : hit / total;

    const missing = [...perTokenQuestionCount.entries()]
      .filter(([, n]) => n === 0)
      .map(([k]) => k)
      .sort();

    const covered = [...perTokenQuestionCount.entries()]
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

    rows.push({
      topic,
      id,
      title: c.title || id,
      coverage,
      totalBlurbTokens: total,
      covered,     // [stem, count]
      missing,     // [stem]
      questionCount: tiers.length,
    });

    // Off-topic questions: any whose bag shares ZERO stems with blurbBag.
    if (blurbBag.size > 0) {
      for (let i = 0; i < questionBags.length; i++) {
        const entry = questionBags[i];
        let overlap = 0;
        for (const k of entry.bag.keys()) if (blurbBag.has(k)) overlap++;
        if (overlap === 0) {
          const qStr = (entry.q.q || '').replace(/\s+/g, ' ').trim();
          offTopicQuestions.push({
            topic,
            id,
            tier: entry.tier,
            index: i,
            excerpt: qStr.slice(0, 100) + (qStr.length > 100 ? '…' : ''),
          });
        }
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Report.

const flagged = rows.filter((r) => r.coverage < THRESHOLD && r.totalBlurbTokens > 0);
flagged.sort((a, b) => a.coverage - b.coverage || a.topic.localeCompare(b.topic));

// Coverage distribution — percentiles over concepts that had at least one
// blurb token (excluding concepts with no blurb content to measure).
const meas = rows.filter((r) => r.totalBlurbTokens > 0).map((r) => r.coverage);
meas.sort((a, b) => a - b);

function pct(p) {
  if (meas.length === 0) return null;
  const idx = Math.min(meas.length - 1, Math.max(0, Math.floor(p * (meas.length - 1))));
  return meas[idx];
}

const p10 = pct(0.10);
const p50 = pct(0.50);
const p90 = pct(0.90);
const mean = meas.length === 0 ? 0 : meas.reduce((a, b) => a + b, 0) / meas.length;

console.log(
  `audit-blurb-question-alignment: ${flagged.length} concept(s) below coverage threshold ${THRESHOLD.toFixed(2)}`,
);
console.log(
  `  measured concepts:        ${meas.length}`,
);
console.log(
  `  coverage p10 / p50 / p90: ${p10 !== null ? p10.toFixed(2) : 'n/a'} / ${p50 !== null ? p50.toFixed(2) : 'n/a'} / ${p90 !== null ? p90.toFixed(2) : 'n/a'}`,
);
console.log(
  `  coverage mean:            ${mean.toFixed(2)}`,
);
console.log(
  `  off-topic questions:      ${offTopicQuestions.length}`,
);
console.log('');

if (flagged.length > 0) {
  console.log('Below-threshold concepts (sorted by coverage ascending):');
  console.log('');
  for (const r of flagged) {
    console.log(
      `${r.topic}/${r.id} — ${r.coverage.toFixed(2)} coverage (${r.questionCount} question${r.questionCount === 1 ? '' : 's'})`,
    );
    const blurbList = [...r.covered.map(([k]) => k), ...r.missing].sort();
    console.log(`  blurb mentions:    ${blurbList.join(', ') || '(none)'}`);
    const coveredList = r.covered.map(([k, n]) => `${k} (${n}x)`).join(', ');
    console.log(`  questions cover:   ${coveredList || '(none)'}`);
    console.log(`  missing:           ${r.missing.join(', ') || '(none)'}`);
    if (VERBOSE) {
      // Find the topic object for the extra title/blurb pretty-print.
      const d = topicData.get(r.topic);
      const c = (d.concepts || []).find((x) => x.id === r.id);
      if (c) {
        console.log(`  title:             ${c.title}`);
        console.log(`  blurb:             ${(c.blurb || '').slice(0, 140)}${(c.blurb || '').length > 140 ? '…' : ''}`);
      }
    }
    console.log('');
  }
}

if (offTopicQuestions.length > 0) {
  // Group by (topic, id) and show compactly.
  const groupMap = new Map();
  for (const q of offTopicQuestions) {
    const k = `${q.topic}/${q.id}`;
    if (!groupMap.has(k)) groupMap.set(k, []);
    groupMap.get(k).push(q);
  }
  console.log(`Off-topic questions (zero term overlap with owning blurb) — ${offTopicQuestions.length} total:`);
  console.log('');
  const keys = [...groupMap.keys()].sort();
  for (const k of keys) {
    const qs = groupMap.get(k);
    console.log(`${k}  (${qs.length} question${qs.length === 1 ? '' : 's'})`);
    for (const q of qs) {
      console.log(`  - [${q.tier} #${q.index}] ${q.excerpt}`);
    }
  }
  console.log('');
}

console.log('Advisory — no CI gate. Review flagged concepts and decide whether the blurb or quiz bank needs adjustment.');
process.exit(0);
