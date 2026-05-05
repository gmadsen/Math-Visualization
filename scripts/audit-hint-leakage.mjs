#!/usr/bin/env node
// Audit "leaky hints" in quiz banks.
//
// A hint should point at the relevant principle WITHOUT giving away the
// answer. Recurring failure modes flagged on PR after PR:
//
//   1. KEYWORD FINGERPRINT (mcq, multi-select, ordering, matching)
//      Hint mentions an operative token that appears in the correct
//      choice but in NONE of the wrong choices — a single-word tell.
//
//   2. PARAPHRASE / SYNONYM (mcq, numeric)
//      Hint shares too many operative tokens with the question's
//      `explain` field — the explanation paraphrased into the hint.
//
//   3. WALKS DERIVATION (numeric)
//      Hint contains a number that's a small algebraic transform of
//      the answer (answer, answer/2, answer*2, answer±1) and is more
//      than ~6 words — i.e. a step-by-step walk-through.
//
//   4. MULTI-SELECT COUNT LEAK
//      Hint contains "all of", "all four", "every option", "select
//      all", etc. — directly leaking the cardinality of the answer.
//
//   5. MATCHING ENUMERATION
//      Hint > 20 words and names ≥ 3 operative tokens from the `right`
//      array — effectively enumerating the pairings.
//
//   6. ORDERING RECIPE
//      Hint quotes leading verbs from ≥ 3 ordering items in source
//      order — i.e. dictating the permutation.
//
// CLI:
//   node scripts/audit-hint-leakage.mjs
//   node scripts/audit-hint-leakage.mjs --verbose
//   node scripts/audit-hint-leakage.mjs --topic <slug>   # restrict scan
//
// Always exits 0 (advisory). Output is a per-file report plus a
// corpus-wide total.

import { loadContentModel } from './lib/content-model.mjs';

// ─────────────────────────────────────────────────────────────────────────
// CLI.

const argv = process.argv.slice(2);
const VERBOSE = argv.includes('--verbose');

let TOPIC_FILTER = null;
{
  const i = argv.indexOf('--topic');
  if (i !== -1 && i + 1 < argv.length) TOPIC_FILTER = argv[i + 1];
}

// ─────────────────────────────────────────────────────────────────────────
// Tokenization (operative tokens only).

const MIN_TOKEN_LEN = 4;

const STOP = new Set([
  // English filler
  'the', 'and', 'but', 'for', 'nor', 'yet', 'with', 'from', 'into', 'onto',
  'this', 'that', 'these', 'those', 'their', 'there', 'them', 'they',
  'when', 'where', 'while', 'whether', 'which', 'whose',
  'have', 'having', 'been', 'being', 'were', 'will', 'would', 'could',
  'should', 'might', 'shall', 'does', 'doing', 'done', 'each',
  'some', 'such', 'same', 'more', 'most', 'many', 'much', 'also',
  'than', 'then', 'thus', 'hence', 'because', 'since', 'about', 'after',
  'before', 'below', 'above', 'every', 'other', 'under', 'until', 'within',
  'without', 'between', 'among', 'against', 'along', 'around', 'beyond',
  'during', 'always', 'never', 'often',
  // hint-prose filler (the literal scaffolding hints tend to use)
  'consider', 'recall', 'note', 'observe', 'think', 'thinking', 'asks',
  'looking', 'look', 'reread', 'identify', 'determine', 'check', 'test',
  'apply', 'compute', 'sort', 'list', 'first', 'second', 'third',
  'definition', 'theorem', 'corollary', 'lemma', 'proof', 'proposition',
  'remark', 'example', 'examples',
  'hint', 'answer', 'answers', 'choice', 'choices', 'option', 'options',
  'fail', 'fails', 'failed', 'wrong', 'right', 'correct', 'correctly',
  'incorrect', 'true', 'false', 'each', 'both', 'either', 'neither',
  'something', 'nothing', 'anything', 'everything', 'someone',
  // generic math filler
  'satisfies', 'satisfy', 'satisfied', 'holds', 'hold', 'holding', 'gives',
  'give', 'given', 'shows', 'show', 'showing', 'imply', 'implies', 'because',
  'whose', 'where', 'what', 'when', 'which', 'used', 'using', 'use',
  'made', 'make', 'makes', 'making', 'turn', 'turns', 'turning',
  'find', 'finds', 'finding', 'into', 'over', 'onto', 'down', 'back',
  'just', 'only', 'still', 'rather', 'instead', 'simply', 'really',
  'fact', 'facts', 'case', 'cases', 'kind', 'kinds', 'sort', 'sorts',
  'side', 'sides', 'half', 'whole', 'part', 'parts', 'piece',
  'value', 'values', 'input', 'output', 'result', 'results',
]);

// LaTeX commands (\foo) and their bare letter forms ("foo") — let through
// short ones like "lim", "exp", "log" because they're often the operative
// math content. Strip multi-letter \foo when it's purely structural
// (\mathbb, \mathrm, \frac, \cdot, etc.).
const LATEX_STRUCTURAL = new Set([
  'mathbb', 'mathrm', 'mathcal', 'mathfrak', 'mathbf', 'mathit', 'mathsf',
  'frac', 'cdot', 'ldots', 'cdots', 'vdots', 'dots',
  'left', 'right', 'big', 'bigg', 'large', 'small',
  'text', 'textit', 'textbf', 'textsf', 'rm', 'bf', 'it', 'sf',
  'begin', 'end', 'displaystyle', 'scriptstyle',
  'circ', 'bullet', 'star', 'ast',
  'quad', 'qquad', 'hspace', 'vspace',
  'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta',
  'iota', 'kappa', 'lambda', 'nu', 'pi', 'rho', 'sigma', 'tau',
  'phi', 'chi', 'psi', 'omega', 'mu', 'xi',
  'partial', 'nabla', 'infty',
  'subset', 'subseteq', 'supset', 'supseteq', 'cup', 'cap',
  'leftarrow', 'rightarrow', 'leftrightarrow', 'mapsto', 'longmapsto',
  'longrightarrow', 'longleftarrow',
  'sum', 'prod', 'int', 'oint', 'iint', 'iiint',
  'leq', 'geq', 'neq', 'approx', 'sim', 'cong', 'equiv',
  'forall', 'exists', 'wedge', 'vee', 'lnot', 'iff',
  'colon', 'mid',
]);

function stripMath(s) {
  let b = s || '';
  b = b.replace(/\$\$[\s\S]*?\$\$/g, ' ');
  b = b.replace(/(^|[^\\])\$[^$\n]*?\$/g, '$1 ');
  b = b.replace(/\\\([\s\S]*?\\\)/g, ' ');
  b = b.replace(/\\\[[\s\S]*?\\\]/g, ' ');
  return b;
}

// Pull operative tokens from prose. We DROP latex control words first.
function operativeTokens(text) {
  if (!text) return [];
  let s = text.toLowerCase();
  // Drop latex control sequences entirely.
  s = s.replace(/\\[a-z]+/gi, ' ');
  // Drop the math-delimited regions too — operative math symbols inside
  // are already noise from a token-overlap standpoint.
  s = stripMath(s);
  const raw = s.split(/[^a-z0-9]+/);
  const out = [];
  for (const t of raw) {
    if (!t) continue;
    if (t.length < MIN_TOKEN_LEN) continue;
    if (/^\d+$/.test(t)) continue;
    if (STOP.has(t)) continue;
    if (LATEX_STRUCTURAL.has(t)) continue;
    out.push(stem(t));
  }
  return out;
}

function stem(tok) {
  if (tok.length > 5 && tok.endsWith('ies')) return tok.slice(0, -3) + 'y';
  if (tok.length > 4 && tok.endsWith('ves')) return tok.slice(0, -3) + 'f';
  if (tok.length > 6 && tok.endsWith('sses')) return tok.slice(0, -2);
  if (tok.length > 5 && tok.endsWith('s') && !tok.endsWith('ss')) tok = tok.slice(0, -1);
  if (tok.length > 7 && tok.endsWith('ization')) return tok.slice(0, -7);
  if (tok.length > 6 && tok.endsWith('ation')) return tok.slice(0, -5);
  if (tok.length > 6 && tok.endsWith('tion')) return tok.slice(0, -4);
  if (tok.length > 6 && tok.endsWith('ness')) return tok.slice(0, -4);
  if (tok.length > 6 && tok.endsWith('ment')) return tok.slice(0, -4);
  if (tok.length > 6 && tok.endsWith('ing')) return tok.slice(0, -3);
  if (tok.length > 6 && tok.endsWith('ed')) return tok.slice(0, -2);
  return tok;
}

function tokenSet(text) {
  return new Set(operativeTokens(text));
}

function wordCount(s) {
  if (!s) return 0;
  // Strip math then count whitespace-separated runs.
  const t = stripMath(s).replace(/\\[a-z]+/gi, ' ').trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

// ─────────────────────────────────────────────────────────────────────────
// Heuristic 1: KEYWORD FINGERPRINT.
//
// For mcq/multi-select/ordering/matching, find tokens that the hint shares
// with the correct choice/item AND with NONE of the wrong choices. That's
// a fingerprint — a single tell-tale word.

function detectFingerprint(q, hintBag) {
  if (q.type === 'mcq') {
    if (!Array.isArray(q.choices) || typeof q.answer !== 'number') return null;
    const correctIdx = q.answer;
    const correct = q.choices[correctIdx];
    if (!correct) return null;
    const correctTokens = tokenSet(correct);
    const wrongUnion = new Set();
    for (let i = 0; i < q.choices.length; i++) {
      if (i === correctIdx) continue;
      for (const t of operativeTokens(q.choices[i])) wrongUnion.add(t);
    }
    const fingerprints = [];
    for (const t of correctTokens) {
      if (!hintBag.has(t)) continue;
      if (wrongUnion.has(t)) continue;
      fingerprints.push(t);
    }
    return fingerprints;
  }
  if (q.type === 'multi-select') {
    if (!Array.isArray(q.choices) || !Array.isArray(q.answer)) return null;
    const ansSet = new Set(q.answer);
    const correctTokens = new Set();
    for (let i = 0; i < q.choices.length; i++) {
      if (!ansSet.has(i)) continue;
      for (const t of operativeTokens(q.choices[i])) correctTokens.add(t);
    }
    const wrongUnion = new Set();
    for (let i = 0; i < q.choices.length; i++) {
      if (ansSet.has(i)) continue;
      for (const t of operativeTokens(q.choices[i])) wrongUnion.add(t);
    }
    // Guard: if every choice is "correct" (multi-select select-all), the
    // wrongUnion is empty and the fingerprint pass below would flag every
    // operative token in the hint as a leak. The count-leak heuristic
    // catches the real risk in that case ("all four are textbook").
    if (wrongUnion.size === 0) return [];
    const fingerprints = [];
    for (const t of correctTokens) {
      if (!hintBag.has(t)) continue;
      if (wrongUnion.has(t)) continue;
      fingerprints.push(t);
    }
    return fingerprints;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// Heuristic 2: PARAPHRASE — hint and explain share too many operative
// tokens for a short hint to be plausibly independent of the explanation.

function detectParaphrase(q, hintBag) {
  if (!q.explain) return null;
  const hintWords = wordCount(q.hint);
  if (hintWords === 0 || hintWords > 30) return null;
  const explainBag = tokenSet(q.explain);
  let shared = 0;
  for (const t of hintBag) if (explainBag.has(t)) shared++;
  if (shared > 4) return shared;
  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// Heuristic 3: WALKS DERIVATION — numeric hint with the answer (or a
// small algebraic transform) hard-coded into the prose.

function extractNumbers(s) {
  if (!s) return [];
  // Only scan outside math regions — math regions are where the question
  // legitimately quotes constants. We're hunting for hint prose like
  // "divide both sides by 2 to get the answer".
  const t = stripMath(s).replace(/\\[a-z]+/gi, ' ');
  const ms = t.match(/-?\d+(?:\.\d+)?/g);
  if (!ms) return [];
  return ms.map((x) => Number(x)).filter((n) => Number.isFinite(n));
}

function approxEq(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  if (a === b) return true;
  const tol = Math.max(1e-6, Math.abs(b) * 0.01);
  return Math.abs(a - b) <= tol;
}

function detectDerivationWalk(q) {
  if (q.type !== 'numeric') return null;
  if (typeof q.answer !== 'number') return null;
  if (!q.hint) return null;
  const hintWords = wordCount(q.hint);
  if (hintWords <= 6) return null;
  const nums = extractNumbers(q.hint);
  if (nums.length === 0) return null;
  const ans = q.answer;
  const transforms = [
    { name: 'answer', val: ans },
    { name: 'answer/2', val: ans / 2 },
    { name: 'answer*2', val: ans * 2 },
    { name: 'answer-1', val: ans - 1 },
    { name: 'answer+1', val: ans + 1 },
  ];
  // Skip bogus "0" / "1" / "2" matches when the answer itself is one of
  // those — too noisy.
  if (Math.abs(ans) <= 2) return null;
  for (const n of nums) {
    for (const tr of transforms) {
      if (approxEq(n, tr.val)) {
        return tr.name;
      }
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// Heuristic 4: COUNT LEAK.
//
// For multi-select: "all four", "select all", etc. directly leak the
// cardinality. For mcq: "three of these are textbook" / "three of the four
// fail" leaks the answer by counting the OTHERS — it points squarely at the
// odd-one-out, which is either the correct answer or its negation.

const COUNT_LEAK_PATTERNS = [
  /\ball of (?:these|them|the (?:above|options|choices))\b/i,
  /\ball (?:four|three|five|six|two)\b/i,
  /\bevery (?:option|choice|one|item)\b/i,
  /\bnone of (?:these|them|the (?:above|options))\b/i,
  /\bselect all\b/i,
  /\bselect every\b/i,
  /\bselect none\b/i,
  /\bselect (?:exactly )?(?:two|three|four|five)\b/i,
  /\b(?:two|three|four|five) (?:are|of (?:the|these) (?:are )?)?(?:textbook|true|correct|valid|standard)\b/i,
  /\ball (?:are|of (?:the|these) are) (?:textbook|true|correct|valid|standard)\b/i,
];

// MCQ-only patterns that leak "the answer is the odd one out". These
// describe the wrong-choice population to point at the right one.
const MCQ_COUNT_PATTERNS = [
  /\b(?:two|three|four) of (?:the (?:four|five) )?(?:these|options|choices|them) (?:are |give |describe |fail|encode )/i,
  /\bthree of these (?:are|give|describe|fail|encode|state|name)/i,
  /\btwo of (?:the )?(?:choices|options|these) (?:fail|are|give|describe|encode|miss|reverse)/i,
  /\b(?:two|three) of the four\b/i,
  /\b(?:two|three) (?:options|choices) (?:fail|miss|reverse|are wrong)/i,
  /\b(?:one|only one) of (?:the )?(?:four|three|five|these|choices|options) (?:is correct|matches|fits|works|holds|is the right)/i,
];

function detectCountLeak(q) {
  if (!q.hint) return null;
  if (q.type === 'multi-select') {
    for (const re of COUNT_LEAK_PATTERNS) {
      const m = q.hint.match(re);
      if (m) return m[0];
    }
    return null;
  }
  if (q.type === 'mcq') {
    for (const re of MCQ_COUNT_PATTERNS) {
      const m = q.hint.match(re);
      if (m) return m[0];
    }
    return null;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// Heuristic 5: MATCHING ENUMERATION — long hint that drops 3+ operative
// tokens from the `right` array.

function detectMatchingEnum(q, hintBag) {
  if (q.type !== 'matching') return null;
  if (!Array.isArray(q.right)) return null;
  const hintWords = wordCount(q.hint);
  if (hintWords <= 20) return null;
  let hits = 0;
  const seen = new Set();
  const hitTokens = [];
  for (const r of q.right) {
    const tokens = tokenSet(r);
    let matchedThisRow = false;
    for (const t of tokens) {
      if (hintBag.has(t) && !seen.has(t)) {
        if (!matchedThisRow) hits++;
        matchedThisRow = true;
        seen.add(t);
        hitTokens.push(t);
      }
    }
  }
  if (hits >= 3) return { hits, tokens: hitTokens.slice(0, 5) };
  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// Heuristic 6: ORDERING RECIPE — hint quotes leading verbs from 3+
// items in source order. Approximate by looking for the FIRST operative
// token of each item, in `items` order, inside the hint.

function detectOrderingRecipe(q, hintBag) {
  if (q.type !== 'ordering') return null;
  if (!Array.isArray(q.items)) return null;
  const hintWords = wordCount(q.hint);
  if (hintWords <= 15) return null;
  // Take leading operative token of each item.
  const leads = [];
  for (const it of q.items) {
    const toks = operativeTokens(it);
    if (toks.length > 0) leads.push(toks[0]);
    else leads.push(null);
  }
  // Find the hint's order of `leads` matches.
  const hintToks = operativeTokens(q.hint);
  const hintIndex = new Map(); // tok -> first position
  hintToks.forEach((t, i) => {
    if (!hintIndex.has(t)) hintIndex.set(t, i);
  });
  // For each lead token present in the hint, record its position.
  const hits = [];
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    if (!lead) continue;
    const pos = hintIndex.get(lead);
    if (pos !== undefined) hits.push({ itemIdx: i, lead, pos });
  }
  if (hits.length < 3) return null;
  // Are at least 3 of them in source order? Sort by position and check
  // whether their itemIdx sequence is monotone increasing.
  hits.sort((a, b) => a.pos - b.pos);
  let monotone = 0;
  let last = -1;
  let monotoneRun = 0;
  for (const h of hits) {
    if (h.itemIdx > last) {
      monotoneRun++;
      monotone = Math.max(monotone, monotoneRun);
    } else {
      monotoneRun = 1;
    }
    last = h.itemIdx;
  }
  if (monotone >= 3) return { hits: hits.length, monotone };
  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// Per-question scan.

function scanQuestion(q, qid) {
  if (!q || !q.hint) return [];
  const hintBag = tokenSet(q.hint);
  const flags = [];

  // 1. fingerprint
  const fps = detectFingerprint(q, hintBag);
  if (fps && fps.length > 0) {
    const sample = fps.slice(0, 3).map((t) => `"${t}"`).join(', ');
    flags.push({
      kind: 'fingerprint',
      msg: `hint fingerprints ${sample} (only in correct ${q.type === 'multi-select' ? 'choices' : 'choice'})`,
    });
  }

  // 2. paraphrase
  const para = detectParaphrase(q, hintBag);
  if (para !== null) {
    flags.push({
      kind: 'paraphrase',
      msg: `hint shares ${para} operative tokens with explain (paraphrase)`,
    });
  }

  // 3. derivation walk
  const walk = detectDerivationWalk(q);
  if (walk) {
    flags.push({
      kind: 'derivation',
      msg: `hint walks derivation: contains ${walk} value`,
    });
  }

  // 4. count leak
  const cl = detectCountLeak(q);
  if (cl) {
    flags.push({
      kind: 'count-leak',
      msg: `hint has "${cl}" — count leak`,
    });
  }

  // 5. matching enumeration
  const me = detectMatchingEnum(q, hintBag);
  if (me) {
    const sample = me.tokens.slice(0, 3).map((t) => `"${t}"`).join(', ');
    flags.push({
      kind: 'matching-enum',
      msg: `hint names ${me.hits} right-side rows (e.g. ${sample}) — matching enumeration`,
    });
  }

  // 6. ordering recipe
  const or = detectOrderingRecipe(q, hintBag);
  if (or) {
    flags.push({
      kind: 'ordering-recipe',
      msg: `hint quotes ${or.monotone}+ ordering items in source order — ordering recipe`,
    });
  }

  return flags;
}

// ─────────────────────────────────────────────────────────────────────────
// Main scan.

const model = await loadContentModel();

const fileResults = []; // { topic, leaky: [...], totalQuestions }
let totalLeaky = 0;
let totalQuestions = 0;
let totalBanks = 0;
let cleanFiles = 0;

const topicIds = TOPIC_FILTER ? [TOPIC_FILTER] : model.topicIds.slice().sort();

for (const topic of topicIds) {
  const bank = model.quizBanks.get(topic);
  if (!bank) continue;
  totalBanks++;
  const quizzes = (bank && bank.quizzes) || {};
  const leaky = [];
  let qCount = 0;

  for (const [conceptId, entry] of Object.entries(quizzes)) {
    if (!entry) continue;
    const tiers = [
      { name: 'v1', arr: entry.questions },
      { name: 'hard', arr: entry.hard },
      { name: 'expert', arr: entry.expert },
    ];
    for (const tier of tiers) {
      if (!Array.isArray(tier.arr)) continue;
      tier.arr.forEach((q, idx) => {
        qCount++;
        const flags = scanQuestion(q, `${conceptId}-${tier.name}-${idx}`);
        if (flags.length > 0) {
          leaky.push({
            conceptId,
            tier: tier.name,
            index: idx,
            type: q.type,
            flags,
            hint: q.hint,
          });
        }
      });
    }
  }

  totalQuestions += qCount;
  totalLeaky += leaky.length;
  fileResults.push({ topic, leaky, totalQuestions: qCount });
  if (leaky.length === 0 && qCount > 0) cleanFiles++;
}

// ─────────────────────────────────────────────────────────────────────────
// Report.

const dirty = fileResults.filter((f) => f.leaky.length > 0);
dirty.sort((a, b) => b.leaky.length - a.leaky.length || a.topic.localeCompare(b.topic));

for (const f of dirty) {
  console.log(`quizzes/${f.topic}.json:`);
  for (const row of f.leaky) {
    const id = `${row.conceptId}` + (row.tier === 'v1' ? `-q${row.index + 1}` : `-${row.tier}-q${row.index + 1}`);
    const msgs = row.flags.map((fl) => fl.msg).join('; ');
    console.log(`  ${id} (${row.type}) — ${msgs}`);
    if (VERBOSE) {
      const h = row.hint.replace(/\s+/g, ' ').trim();
      console.log(`    hint: ${h.slice(0, 140)}${h.length > 140 ? '…' : ''}`);
    }
  }
  console.log(`TOTAL: ${f.leaky.length} leaky hint${f.leaky.length === 1 ? '' : 's'} in 1 file (out of ${f.totalQuestions} questions)`);
  console.log('');
}

const totalFiles = fileResults.filter((f) => f.totalQuestions > 0).length;
console.log(
  `audit-hint-leakage: ${totalLeaky} leaky hint${totalLeaky === 1 ? '' : 's'} across ${totalFiles} bank${totalFiles === 1 ? '' : 's'} (${cleanFiles} file${cleanFiles === 1 ? '' : 's'} clean).`,
);
console.log(`  total questions scanned: ${totalQuestions}`);
console.log(`  leak rate:               ${totalQuestions > 0 ? ((totalLeaky / totalQuestions) * 100).toFixed(1) : '0.0'}%`);
console.log('');
console.log('Advisory — no CI gate. Review flagged hints and decide whether each truly leaks or is a false positive.');

process.exit(0);
