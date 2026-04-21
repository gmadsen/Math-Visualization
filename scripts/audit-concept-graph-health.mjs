#!/usr/bin/env node
// Meta-audit: aggregate per-topic health signals into a single scorecard.
//
// This script is a read-only, advisory pass that joins five existing audits
// into one per-topic table so that topics needing attention (stale blurbs,
// dead-end concepts, missing cross-topic edges, static widgets, sparse quiz
// coverage) pop out at a glance.
//
// Design goals:
//   - Zero deps, standalone: reimplement the relevant metrics here rather
//     than shell-out to the other audits. Regex patterns and parsing
//     strategies are reused from the source audits, but all computation is
//     local to this script so it cannot drift if the other scripts change
//     their output format.
//   - Always exits 0 (advisory). Not wired into CI.
//
// CLI:
//   node scripts/audit-concept-graph-health.mjs
//       Print scorecard table across every topic.
//
//   node scripts/audit-concept-graph-health.mjs --topic <id>
//       Show the scorecard for just one topic.
//
//   node scripts/audit-concept-graph-health.mjs --json
//       Emit a machine-readable JSON summary (no table).
//
// Per-topic metrics:
//   1. Concept count      — total, v1 quizzes, hard quizzes, hints.
//   2. Stale blurbs       — LENGTH/MATCH/RECALL/OFFPAGE/DUP flag count
//                           (heuristics from audit-stale-blurbs.mjs).
//   3. Backlink quality   — dead-ends, hubs, orphaned hubs (from the
//                           reverse adjacency of concepts/*.json, same
//                           approach as audit-backlink-quality.mjs).
//   4. Cross-topic prereq — suggestion count (full list via the dedicated
//                           audit). Uses the same title-matching approach
//                           as audit-cross-topic-prereqs.mjs.
//   5. Widget interact    — interactive/total ratio (same method as
//                           audit-widget-interactivity.mjs).
//
// Health buckets per metric:
//   Blurbs     0 flags 🟢,  1-3 🟡,  4+ 🔴
//   Dead-ends  0-1     🟢,  2-3  🟡,  4+ 🔴
//   Prereqs    0       🟢,  1-2  🟡,  3+ 🔴
//   Widgets    all-i   🟢,  1-2 static 🟡,  3+ 🔴
//
// Summary at the bottom reports total topics per overall health bucket
// (worst single-metric bucket per topic).

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
let TOPIC_FILTER = null;
let JSON_OUT = false;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--topic') {
    TOPIC_FILTER = argv[++i];
    if (!TOPIC_FILTER || TOPIC_FILTER.startsWith('--')) {
      console.error('audit-concept-graph-health: --topic requires a topic id');
      process.exit(2);
    }
  } else if (a === '--json') {
    JSON_OUT = true;
  } else if (a === '--help' || a === '-h') {
    console.log(
      'Usage: node scripts/audit-concept-graph-health.mjs [--topic <id>] [--json]'
    );
    process.exit(0);
  } else {
    console.error(`audit-concept-graph-health: unknown argument "${a}"`);
    process.exit(2);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Load concept graph & quiz banks.

const indexPath = join(conceptsDir, 'index.json');
const topics = JSON.parse(readFileSync(indexPath, 'utf8')).topics;

const topicData = new Map(); // topic -> concepts JSON
const quizData = new Map();  // topic -> quizzes JSON (or null)
const pageHtml = new Map();  // topic -> HTML string (or null)

// conceptId -> { topic, title, anchor, page, prereqs, blurb }
const byId = new Map();
// all concepts in declaration order
const allConcepts = [];

for (const topic of topics) {
  const p = join(conceptsDir, `${topic}.json`);
  if (!existsSync(p)) continue;
  const d = JSON.parse(readFileSync(p, 'utf8'));
  topicData.set(topic, d);

  const page = d.page || `${topic}.html`;
  const pagePath = join(repoRoot, page);
  if (existsSync(pagePath)) {
    pageHtml.set(topic, readFileSync(pagePath, 'utf8'));
  } else {
    pageHtml.set(topic, null);
  }

  const qp = join(quizzesDir, `${topic}.json`);
  if (existsSync(qp)) {
    try {
      quizData.set(topic, JSON.parse(readFileSync(qp, 'utf8')));
    } catch {
      quizData.set(topic, null);
    }
  } else {
    quizData.set(topic, null);
  }

  for (const c of d.concepts || []) {
    if (byId.has(c.id)) continue;
    byId.set(c.id, {
      topic,
      title: c.title,
      anchor: c.anchor,
      page,
      prereqs: c.prereqs || [],
      blurb: c.blurb || '',
    });
    allConcepts.push({
      id: c.id,
      topic,
      title: c.title,
      anchor: c.anchor,
      prereqs: c.prereqs || [],
      blurb: c.blurb || '',
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Shared helpers.

function escapeRe(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function findSectionBody(html, anchor) {
  const idRe = new RegExp(
    `<([a-zA-Z][a-zA-Z0-9]*)([^>]*\\sid=["']${escapeRe(anchor)}["'][^>]*)>`,
    'i',
  );
  const m = idRe.exec(html);
  if (!m) return null;
  const innerStart = m.index + m[0].length;
  const nextBoundaryRe = /<(?:section|h2|h3|h4)\b[^>]*\sid=["'][^"']+["']/gi;
  nextBoundaryRe.lastIndex = innerStart;
  const nb = nextBoundaryRe.exec(html);
  const nextCloseRe = /<\/section>/gi;
  nextCloseRe.lastIndex = innerStart;
  const nc = nextCloseRe.exec(html);
  let innerEnd;
  if (nb && (!nc || nb.index < nc.index)) innerEnd = nb.index;
  else if (nc) innerEnd = nc.index;
  else innerEnd = html.length;
  return { body: html.slice(innerStart, innerEnd), innerStart, innerEnd };
}

// ─────────────────────────────────────────────────────────────────────────
// 1. Concept count + quiz coverage per topic.

function tallyQuizzes(topic) {
  const d = quizData.get(topic);
  if (!d || !d.quizzes) return { v1: 0, hard: 0, expert: 0, hints: 0 };
  let v1 = 0, hard = 0, expert = 0, hints = 0;
  for (const [, bank] of Object.entries(d.quizzes)) {
    if (Array.isArray(bank.questions) && bank.questions.length > 0) v1++;
    if (Array.isArray(bank.hard) && bank.hard.length > 0) hard++;
    if (Array.isArray(bank.expert) && bank.expert.length > 0) expert++;
    for (const q of [...(bank.questions || []), ...(bank.hard || []), ...(bank.expert || [])]) {
      if (q && typeof q.hint === 'string' && q.hint.trim()) hints++;
    }
  }
  return { v1, hard, expert, hints };
}

// ─────────────────────────────────────────────────────────────────────────
// 2. Stale-blurb flags (mirrors audit-stale-blurbs.mjs).

const MIN_BLURB = 20;
const MAX_BLURB = 280;
const MIN_TOKEN_LEN = 5;
const TOP_SECTION_TERMS = 5;
const TOP_SECTION_TERMS_NEEDED = 1;
const OFFPAGE_MIN_TECH_TOKENS = 3;

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
  'therefore', 'whenever', 'because', 'consider', 'let', 'take',
  'note', 'observe', 'recall', 'here', 'above', 'below', 'thus',
  'suppose', 'assume', 'define', 'defined', 'denote', 'denoted',
  'called', 'namely', 'really', 'simply', 'clearly', 'similarly',
  'example', 'examples', 'theorem', 'theorems', 'lemma', 'lemmas',
  'proof', 'proofs', 'remark', 'remarks', 'corollary', 'corollaries',
  'standard', 'general', 'generally', 'specific', 'specifically',
  'since', 'because',
  'section', 'sections', 'widget', 'widgets', 'picture', 'pictures',
  'slider', 'button', 'click', 'below', 'above', 'diagram', 'diagrams',
  'click', 'drag', 'figure', 'figures', 'write', 'writes', 'writing',
  'reader', 'readers', 'first', 'second', 'third', 'finally', 'often',
  'whose', 'where', 'which', 'whose', 'these', 'those', 'everything',
  'something', 'nothing', 'anything', 'always', 'never', 'really',
]);

const BLAND = new Set([
  'object', 'arrow', 'structure',
  'notion', 'idea', 'concept', 'result', 'setting', 'proper', 'properly',
  'standard', 'natural', 'naturally', 'trivial', 'trivially',
  'useful', 'usefully', 'simple', 'simply',
  'carry', 'carrie', 'produc', 'provide', 'exhibit', 'describe', 'illustrate',
  'reflect', 'record', 'package', 'share', 'yield', 'promote', 'combine',
  'connect', 'distinguish', 'expres', 'extend', 'reduce', 'refine',
  'capture', 'recover', 'suffice', 'require', 'satisfy', 'enforce',
  'replace', 'present', 'contain', 'create', 'appear', 'arise', 'treat',
  'work', 'form', 'use', 'used', 'using', 'make', 'makes', 'allow', 'allows',
  'give', 'gives', 'show', 'shows', 'turn', 'turns', 'put', 'puts',
  'exactly', 'roughly', 'essentially', 'basically', 'precisely',
  'class', 'classes', 'pattern', 'patterns', 'visible', 'particular',
  'common', 'general', 'specific', 'unique', 'distinct', 'certain',
  'large', 'larger', 'small', 'smaller', 'finite', 'infinite', 'partial',
  'total', 'complete', 'correct', 'simple', 'rigorous', 'explicit',
  'concrete', 'abstract', 'direct', 'indirect', 'reverse', 'forward',
  'single', 'double', 'pair', 'triple', 'quadruple',
  'versu', 'against', 'along', 'within', 'beside',
  'modern', 'classical', 'recent', 'current', 'historical',
  'important', 'essential', 'major', 'minor', 'basic', 'core', 'central',
  'sketch', 'outline', 'overview', 'introduction', 'preview', 'summary',
  'language', 'framework', 'tool', 'tools', 'perspective', 'viewpoint',
  'component', 'componentwise', 'element', 'elementwise', 'entry', 'item',
  'step', 'steps', 'case', 'cases', 'kind', 'kinds', 'type', 'types',
  'side', 'sides', 'half', 'whole', 'part', 'parts', 'bit', 'piece',
  'above', 'below', 'alongside', 'among',
  'value', 'values', 'input', 'output', 'setting', 'settings',
  'readout', 'control', 'widget', 'slider', 'toggle',
]);

function stripTagBalanced(body, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}\\s*>`, 'gi');
  return body.replace(re, ' ');
}

function extractProseTokens(sectionBody) {
  let b = sectionBody;
  for (const t of ['script', 'style', 'svg', 'aside', 'pre', 'code']) {
    b = stripTagBalanced(b, t);
  }
  // Widget divs — balance-scan.
  const openRe = /<div\b[^>]*\bclass=["'][^"']*\bwidget\b[^"']*["'][^>]*>/gi;
  let out = '';
  let cursor = 0;
  let m;
  while ((m = openRe.exec(b))) {
    out += b.slice(cursor, m.index);
    let depth = 1;
    const divO = /<div\b[^>]*>/gi;
    const divC = /<\/div\s*>/gi;
    divO.lastIndex = m.index + m[0].length;
    divC.lastIndex = m.index + m[0].length;
    let end = b.length;
    while (depth > 0) {
      divO.lastIndex = Math.max(divO.lastIndex, divC.lastIndex - 1);
      const o = divO.exec(b);
      const c = divC.exec(b);
      if (!c) break;
      if (o && o.index < c.index) {
        depth++;
        divC.lastIndex = o.index + o[0].length;
      } else {
        depth--;
        if (depth === 0) {
          end = c.index + c[0].length;
          break;
        }
        divO.lastIndex = c.index + c[0].length;
      }
    }
    cursor = end;
    openRe.lastIndex = end;
  }
  out += b.slice(cursor);
  b = out;

  b = b.replace(/\$\$[\s\S]*?\$\$/g, ' ');
  b = b.replace(/(^|[^\\])\$[^$\n]*?\$/g, '$1 ');
  b = b.replace(/\\\([\s\S]*?\\\)/g, ' ');
  b = b.replace(/\\\[[\s\S]*?\\\]/g, ' ');
  return b.replace(/<[^>]+>/g, ' ');
}

function extractWeightedTerms(sectionBody) {
  const weighted = [];
  const grab = (re) => {
    let m;
    while ((m = re.exec(sectionBody))) {
      const txt = m[1].replace(/<[^>]+>/g, ' ').trim();
      if (txt) weighted.push(txt.toLowerCase());
    }
  };
  grab(/<em\b[^>]*>([\s\S]*?)<\/em>/gi);
  grab(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi);
  grab(/<code\b[^>]*>([\s\S]*?)<\/code>/gi);
  return weighted;
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
  for (const t of tokenize(text)) {
    const s = stem(t);
    if (BLAND.has(s)) continue;
    bag.set(s, (bag.get(s) || 0) + 1);
  }
  return bag;
}

function normalizeBlurb(blurb) {
  let b = blurb || '';
  b = b.replace(/\$\$[\s\S]*?\$\$/g, ' ');
  b = b.replace(/(^|[^\\])\$[^$\n]*?\$/g, '$1 ');
  b = b.replace(/\\\([\s\S]*?\\\)/g, ' ');
  b = b.replace(/\\\[[\s\S]*?\\\]/g, ' ');
  return b;
}

// Build global technical vocabulary (concept titles) for OFFPAGE check.
const globalVocab = new Set();
for (const c of allConcepts) {
  for (const t of tokenize(c.title || '')) {
    const s = stem(t);
    if (!BLAND.has(s)) globalVocab.add(s);
  }
}
for (const topic of topicData.keys()) {
  for (const tok of topic.split(/[^a-z0-9]+/i)) {
    if (tok.length >= MIN_TOKEN_LEN) {
      const s = stem(tok.toLowerCase());
      if (!BLAND.has(s)) globalVocab.add(s);
    }
  }
}

// Duplicate-blurb map.
const blurbSeen = new Map();
for (const c of allConcepts) {
  const key = (c.blurb || '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (!key) continue;
  if (!blurbSeen.has(key)) blurbSeen.set(key, []);
  blurbSeen.get(key).push({ topic: c.topic, id: c.id });
}

function countBlurbFlagsForTopic(topic) {
  const html = pageHtml.get(topic);
  const d = topicData.get(topic);
  if (!d) return 0;
  let flags = 0;
  for (const c of d.concepts || []) {
    const blurb = (c.blurb || '').trim();
    const codes = new Set();

    if (blurb.length < MIN_BLURB || blurb.length > MAX_BLURB) codes.add('LENGTH');

    const dupKey = blurb.toLowerCase().replace(/\s+/g, ' ');
    if (dupKey && (blurbSeen.get(dupKey) || []).length > 1) codes.add('DUP');

    if (html && c.anchor) {
      const sect = findSectionBody(html, c.anchor);
      if (sect) {
        const weighted = extractWeightedTerms(sect.body);
        const proseText = extractProseTokens(sect.body);
        const proseBag = toBag(proseText);
        for (const phrase of weighted) {
          for (const tok of tokenize(phrase)) {
            const s = stem(tok);
            if (BLAND.has(s)) continue;
            proseBag.set(s, (proseBag.get(s) || 0) + 3);
          }
        }
        if (proseBag.size > 0) {
          const blurbBag = toBag(normalizeBlurb(blurb));
          const titleBag = toBag(c.title || '');

          if (blurbBag.size > 0) {
            let overlap = 0;
            for (const k of blurbBag.keys()) if (proseBag.has(k)) overlap++;
            if (overlap === 0) codes.add('MATCH');
          }

          const topTerms = [...proseBag.entries()]
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
            .slice(0, TOP_SECTION_TERMS)
            .map(([k]) => k);
          let hits = 0;
          for (const t of topTerms) {
            if (blurbBag.has(t) || titleBag.has(t)) hits++;
          }
          if (topTerms.length >= TOP_SECTION_TERMS && hits < TOP_SECTION_TERMS_NEEDED) {
            codes.add('RECALL');
          }

          let offPage = 0;
          for (const k of blurbBag.keys()) {
            if (proseBag.has(k)) continue;
            if (titleBag.has(k)) continue;
            if (!globalVocab.has(k)) continue;
            offPage++;
          }
          if (offPage >= OFFPAGE_MIN_TECH_TOKENS) codes.add('OFFPAGE');
        }
      }
    }
    flags += codes.size;
  }
  return flags;
}

// ─────────────────────────────────────────────────────────────────────────
// 3. Backlink-quality metrics (mirrors audit-backlink-quality.mjs).

const reverse = new Map(); // conceptId -> consumers[]
for (const c of allConcepts) {
  for (const p of c.prereqs) {
    if (!byId.has(p)) continue;
    if (!reverse.has(p)) reverse.set(p, []);
    reverse.get(p).push({ id: c.id, topic: c.topic });
  }
}

const backlinkStats = new Map(); // conceptId -> { total, sameTopic, crossTopic }
for (const c of allConcepts) {
  const consumers = reverse.get(c.id) || [];
  let sameTopic = 0;
  for (const cons of consumers) if (cons.topic === c.topic) sameTopic++;
  backlinkStats.set(c.id, {
    total: consumers.length,
    sameTopic,
    crossTopic: consumers.length - sameTopic,
  });
}

function percentile(sortedAsc, q) {
  if (sortedAsc.length === 0) return 0;
  const rank = Math.min(
    sortedAsc.length - 1,
    Math.max(0, Math.ceil((q / 100) * sortedAsc.length) - 1),
  );
  return sortedAsc[rank];
}

const globalCounts = [...backlinkStats.values()]
  .map((s) => s.total)
  .sort((a, b) => a - b);
const HUB_THRESHOLD = Math.max(3, percentile(globalCounts, 95));
const ORPHAN_THRESHOLD = Math.max(3, percentile(globalCounts, 90));

function backlinkSignalsForTopic(topic) {
  const d = topicData.get(topic);
  if (!d) return { deadEnds: 0, hubs: 0, orphanedHubs: 0 };
  let deadEnds = 0, hubs = 0, orphanedHubs = 0;
  for (const c of d.concepts || []) {
    const s = backlinkStats.get(c.id);
    if (!s) continue;
    if (s.total === 0) deadEnds++;
    if (s.total >= HUB_THRESHOLD) hubs++;
    if (s.total >= ORPHAN_THRESHOLD && s.crossTopic === 0) orphanedHubs++;
  }
  return { deadEnds, hubs, orphanedHubs };
}

// ─────────────────────────────────────────────────────────────────────────
// 4. Cross-topic prereq suggestions (mirrors audit-cross-topic-prereqs.mjs).

const MIN_TITLE_LEN = 5;
const TITLE_BLOCKLIST = new Set([
  'sets', 'rank', 'limit', 'limits', 'functor', 'functors', 'group', 'groups',
  'ring', 'rings', 'field', 'fields', 'space', 'spaces', 'map', 'maps',
  'action', 'order', 'norm', 'degree', 'product', 'products', 'sum', 'sums',
  'number', 'numbers', 'point', 'points', 'line', 'lines', 'curve', 'curves',
  'surface', 'surfaces', 'trace', 'root', 'roots', 'base', 'basis', 'image',
  'kernel', 'range', 'domain', 'series', 'form', 'forms', 'module', 'modules',
  'ideal', 'ideals', 'genus', 'class', 'classes', 'algebra', 'algebras',
  'category', 'scheme', 'schemes', 'sheaf', 'sheaves', 'topology', 'manifold',
  'manifolds', 'function', 'functions', 'measure', 'measures', 'operator',
  'operators', 'set', 'integral', 'integrals', 'derivative', 'derivatives',
  'partition', 'partitions', 'period', 'periods', 'weight', 'level', 'index',
  'index.html', 'residue', 'residues',
]);

function escapeForRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildTitleRegex(title) {
  return new RegExp(
    '\\b' +
      title
        .split(/\s+/)
        .map((w) => escapeForRegex(w).replace(/[-‐-―]/g, '[-\\u2010-\\u2015]'))
        .join('\\s+') +
      '\\b',
    'gi',
  );
}

const vocab = [];
for (const [id, c] of byId) {
  if (!c.title || !c.anchor) continue;
  const titleLower = c.title.trim().toLowerCase();
  if (c.title.trim().length < MIN_TITLE_LEN) continue;
  if (TITLE_BLOCKLIST.has(titleLower)) continue;
  vocab.push({
    id,
    title: c.title.trim(),
    topic: c.topic,
    regex: buildTitleRegex(c.title.trim()),
  });
}
vocab.sort((a, b) => b.title.length - a.title.length);

const transitiveCache = new Map();
function transitivePrereqs(id) {
  if (transitiveCache.has(id)) return transitiveCache.get(id);
  const seen = new Set();
  const src = byId.get(id);
  if (!src) {
    transitiveCache.set(id, seen);
    return seen;
  }
  const queue = [...(src.prereqs || [])];
  while (queue.length > 0) {
    const next = queue.shift();
    if (seen.has(next)) continue;
    seen.add(next);
    const n = byId.get(next);
    if (!n) continue;
    for (const p of n.prereqs || []) {
      if (!seen.has(p)) queue.push(p);
    }
  }
  transitiveCache.set(id, seen);
  return seen;
}

// Skip-zone mask for a topic page (lifted from audit-cross-topic-prereqs.mjs,
// trimmed to just the bits we need for <p>-prose extraction).

function buildSkipMask(html) {
  const mask = new Uint8Array(html.length);
  const containerMask = new Uint8Array(html.length);

  const bodyM = html.match(/<body\b[^>]*>/i);
  if (bodyM) {
    const end = bodyM.index + bodyM[0].length;
    for (let i = 0; i < end; i++) {
      mask[i] = 1;
      containerMask[i] = 1;
    }
  }

  function maskBalanced(tagName) {
    const openRe = new RegExp(`<${tagName}\\b[^>]*?>`, 'gi');
    const closeRe = new RegExp(`</${tagName}\\s*>`, 'gi');
    const opens = [];
    let m;
    while ((m = openRe.exec(html))) opens.push(m.index + m[0].length);
    const closes = [];
    while ((m = closeRe.exec(html))) closes.push(m.index);
    const events = [];
    for (const o of opens) events.push({ at: o, kind: 'open' });
    for (const c of closes) events.push({ at: c, kind: 'close' });
    events.sort((a, b) => a.at - b.at);
    const outerStack = [];
    let depth = 0;
    for (const ev of events) {
      if (ev.kind === 'open') {
        if (depth === 0) outerStack.push(ev.at);
        depth++;
      } else {
        depth--;
        if (depth === 0) {
          const start = outerStack.pop();
          if (start !== undefined) {
            for (let i = start; i < ev.at && i < mask.length; i++) {
              mask[i] = 1;
              containerMask[i] = 1;
            }
          }
        }
        if (depth < 0) depth = 0;
      }
    }
  }

  for (const t of ['script', 'style', 'head', 'svg', 'pre', 'code', 'aside']) {
    maskBalanced(t);
  }
  for (let i = 1; i <= 6; i++) maskBalanced('h' + i);
  maskBalanced('a');

  {
    const widgetOpenRe = /<div\b[^>]*\bclass=["'][^"']*\bwidget\b[^"']*["'][^>]*>/gi;
    let m;
    while ((m = widgetOpenRe.exec(html))) {
      const start = m.index;
      let depth = 1;
      const divOpenRe = /<div\b[^>]*>/gi;
      const divCloseRe = /<\/div\s*>/gi;
      divOpenRe.lastIndex = m.index + m[0].length;
      divCloseRe.lastIndex = m.index + m[0].length;
      let end = html.length;
      while (depth > 0) {
        divOpenRe.lastIndex = Math.max(divOpenRe.lastIndex, divCloseRe.lastIndex - 1);
        const o = divOpenRe.exec(html);
        const c = divCloseRe.exec(html);
        if (!c) break;
        if (o && o.index < c.index) {
          depth++;
          divCloseRe.lastIndex = o.index + o[0].length;
        } else {
          depth--;
          if (depth === 0) {
            end = c.index + c[0].length;
            break;
          }
          divOpenRe.lastIndex = c.index + c[0].length;
        }
      }
      for (let i = start; i < end && i < mask.length; i++) {
        mask[i] = 1;
        containerMask[i] = 1;
      }
    }
  }

  // KaTeX math spans.
  function escapedAt(s, i) {
    let n = 0;
    for (let j = i - 1; j >= 0 && s[j] === '\\'; j--) n++;
    return n % 2 === 1;
  }
  {
    let i = 0;
    while (i < html.length - 1) {
      if (html[i] === '$' && html[i + 1] === '$' && !escapedAt(html, i)) {
        const start = i;
        let j = i + 2;
        while (j < html.length - 1) {
          if (html[j] === '$' && html[j + 1] === '$' && !escapedAt(html, j)) {
            for (let k = start; k < j + 2 && k < mask.length; k++) mask[k] = 1;
            i = j + 2;
            break;
          }
          j++;
        }
        if (j >= html.length - 1) break;
      } else {
        i++;
      }
    }
  }
  {
    let i = 0;
    while (i < html.length) {
      if (
        html[i] === '$' &&
        html[i + 1] !== '$' &&
        !escapedAt(html, i) &&
        !mask[i]
      ) {
        const start = i;
        let j = i + 1;
        while (j < html.length) {
          if (html[j] === '$' && html[j + 1] !== '$' && !escapedAt(html, j)) {
            for (let k = start; k < j + 1 && k < mask.length; k++) mask[k] = 1;
            i = j + 1;
            break;
          }
          j++;
        }
        if (j >= html.length) break;
      } else {
        i++;
      }
    }
  }
  for (const [openL, openR, closeL, closeR] of [
    ['\\', '(', '\\', ')'],
    ['\\', '[', '\\', ']'],
  ]) {
    let i = 0;
    while (i < html.length - 1) {
      if (html[i] === openL && html[i + 1] === openR) {
        const start = i;
        let j = i + 2;
        while (j < html.length - 1) {
          if (html[j] === closeL && html[j + 1] === closeR) {
            for (let k = start; k < j + 2 && k < mask.length; k++) mask[k] = 1;
            i = j + 2;
            break;
          }
          j++;
        }
        if (j >= html.length - 1) break;
      } else {
        i++;
      }
    }
  }

  {
    const tagRe = /<[^>]*>/g;
    let m;
    while ((m = tagRe.exec(html))) {
      for (let i = m.index; i < m.index + m[0].length && i < mask.length; i++) {
        mask[i] = 1;
      }
    }
  }
  return { mask, containerMask };
}

function extractProseRegion(html, mask, containerMask, innerStart, innerEnd) {
  const openRe = /<p\b[^>]*>/gi;
  openRe.lastIndex = innerStart;
  const parts = [];
  let m;
  while ((m = openRe.exec(html)) && m.index < innerEnd) {
    const pStart = m.index + m[0].length;
    if (containerMask[m.index]) continue;
    const closeRe = /<\/p\s*>/gi;
    closeRe.lastIndex = pStart;
    const cm = closeRe.exec(html);
    if (!cm) break;
    const pEnd = Math.min(cm.index, innerEnd);
    let buf = '';
    for (let i = pStart; i < pEnd; i++) {
      buf += mask[i] ? ' ' : html[i];
    }
    parts.push(buf);
  }
  return parts.join('\n');
}

// Precompute skip masks per topic page.
const pageMask = new Map();
for (const [topic, html] of pageHtml) {
  if (!html) continue;
  pageMask.set(topic, buildSkipMask(html));
}

function countCrossTopicSuggestionsForTopic(topic) {
  const d = topicData.get(topic);
  if (!d) return 0;
  const html = pageHtml.get(topic);
  const ctx = html ? pageMask.get(topic) : null;
  let count = 0;
  for (const c of d.concepts || []) {
    if (!c.anchor) continue;
    const src = byId.get(c.id);
    if (!src) continue;
    const directPrereqs = new Set(src.prereqs);
    const transitive = transitivePrereqs(c.id);

    let sectionText = '';
    if (html && ctx) {
      const range = findSectionBody(html, c.anchor);
      if (range) {
        sectionText = extractProseRegion(
          html,
          ctx.mask,
          ctx.containerMask,
          range.innerStart,
          range.innerEnd,
        );
      }
    }
    const corpus = (c.blurb || '') + '\n' + sectionText;
    if (!corpus.trim()) continue;

    const corpusMask = new Uint8Array(corpus.length);
    const seenTargets = new Set();
    for (const v of vocab) {
      if (v.topic === topic) continue;
      if (v.id === c.id) continue;
      if (directPrereqs.has(v.id)) continue;
      if (transitive.has(v.id)) continue;
      if (seenTargets.has(v.id)) continue;

      const re = new RegExp(v.regex.source, 'gi');
      let mm;
      let found = null;
      while ((mm = re.exec(corpus))) {
        const idx = mm.index;
        const len = mm[0].length;
        let blocked = false;
        for (let k = 0; k < len; k++) {
          if (corpusMask[idx + k]) { blocked = true; break; }
        }
        if (blocked) continue;
        const pre = corpus[idx - 1] || '';
        const post = corpus[idx + len] || '';
        if (pre === '$' || post === '$') continue;
        found = { idx, len };
        break;
      }
      if (!found) continue;
      for (let k = 0; k < found.len; k++) corpusMask[found.idx + k] = 1;
      seenTargets.add(v.id);

      // Known wrong-direction false positives (same list as source audit).
      if (c.id === 'gluing-affines' && v.id === 'scheme-morphisms') continue;

      count++;
    }
  }
  return count;
}

// ─────────────────────────────────────────────────────────────────────────
// 5. Widget interactivity ratio (mirrors audit-widget-interactivity.mjs).

const COMMON_CLASSES = new Set([
  'widget', 'hd', 'ttl', 'hint', 'readout', 'row', 'note', 'ok', 'bad',
  'small', 'quiz', 'callback', 'related', 'changelog', 'sub', 'hero', 'toc',
  'sidetoc', 'card', 'tt', 'desc', 'tag', 'level', 'prereq', 'advanced',
  'capstone', 'ink', 'mute', 'line', 'panel', 'panel2', 'yellow', 'blue',
  'green', 'pink', 'violet', 'cyan', 'active', 'axis', 'grid', 'tick', 'label',
]);

const EVENT_VERBS_RE = /\b(addEventListener|removeEventListener|make3DDraggable|requestAnimationFrame)\b/;
const INLINE_HANDLER_ATTR_RE =
  /\bon(?:click|input|change|pointerdown|pointermove|pointerup|pointercancel|mousedown|mousemove|mouseup|mouseover|mouseout|mouseenter|mouseleave|keydown|keyup|keypress|wheel|touchstart|touchmove|touchend|focus|blur|submit|dblclick|contextmenu)\s*=\s*["']/i;

function extractWidgets(html) {
  const widgets = [];
  const widgetOpenRe = /<div\b[^>]*\bclass=["'][^"']*\bwidget\b[^"']*["'][^>]*>/gi;
  let om;
  while ((om = widgetOpenRe.exec(html))) {
    const openStart = om.index;
    const openEnd = om.index + om[0].length;
    const divOpenRe = /<div\b[^>]*>/gi;
    const divCloseRe = /<\/div\s*>/gi;
    divOpenRe.lastIndex = openEnd;
    divCloseRe.lastIndex = openEnd;
    let depth = 1;
    let end = html.length;
    let safety = 0;
    while (depth > 0) {
      if (++safety > 100000) break;
      const savedOpen = divOpenRe.lastIndex;
      const savedClose = divCloseRe.lastIndex;
      const o = divOpenRe.exec(html);
      const c = divCloseRe.exec(html);
      if (!c) break;
      if (o && o.index < c.index) {
        depth++;
        divCloseRe.lastIndex = Math.max(savedClose, o.index + o[0].length);
      } else {
        depth--;
        if (depth === 0) {
          end = c.index + c[0].length;
          break;
        }
        divOpenRe.lastIndex = Math.max(savedOpen, c.index + c[0].length);
      }
    }
    widgets.push({ outerStart: openStart, outerEnd: end });
    widgetOpenRe.lastIndex = end;
  }
  return widgets;
}

function extractSelectors(widgetHtml) {
  const ids = new Set();
  const classes = new Set();
  const idRe = /\bid=["']([a-zA-Z0-9_\-:.]+)["']/g;
  let m;
  while ((m = idRe.exec(widgetHtml))) ids.add(m[1]);
  const classRe = /\bclass=["']([^"']+)["']/g;
  while ((m = classRe.exec(widgetHtml))) {
    for (const name of m[1].trim().split(/\s+/)) {
      if (!name) continue;
      if (COMMON_CLASSES.has(name)) continue;
      classes.add(name);
    }
  }
  return { ids: [...ids], classes: [...classes] };
}

function extractScriptBodies(html) {
  const bodies = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    if (/\bsrc\s*=/.test(attrs)) continue;
    bodies.push(m[2]);
  }
  return bodies;
}

function scriptReferencesSelector(scriptText, selector, kind) {
  const selEsc = escapeForRegex(selector);
  const prefix = kind === 'id' ? '#' : '.';
  const dollarRe = new RegExp(`\\$\\(\\s*["'\`]\\s*${escapeForRegex(prefix)}${selEsc}\\b`);
  if (dollarRe.test(scriptText)) return true;
  if (kind === 'id') {
    const gbiRe = new RegExp(`getElementById\\(\\s*["'\`]${selEsc}["'\`]\\s*\\)`);
    if (gbiRe.test(scriptText)) return true;
  }
  const qsRe = new RegExp(
    `querySelector(?:All)?\\(\\s*["'\`][^"'\`]*${escapeForRegex(prefix)}${selEsc}\\b[^"'\`]*["'\`]\\s*\\)`,
  );
  if (qsRe.test(scriptText)) return true;
  if (kind === 'class') {
    const gcRe = new RegExp(`getElementsByClassName\\(\\s*["'\`]${selEsc}["'\`]\\s*\\)`);
    if (gcRe.test(scriptText)) return true;
  }
  const bareRe = new RegExp(`["'\`]\\s*${escapeForRegex(prefix)}${selEsc}\\b`);
  if (bareRe.test(scriptText) && EVENT_VERBS_RE.test(scriptText)) return true;
  return false;
}

function widgetRatioForTopic(topic) {
  const html = pageHtml.get(topic);
  if (!html) return { total: 0, interactive: 0 };
  const widgets = extractWidgets(html);
  const scripts = extractScriptBodies(html);
  let interactive = 0;
  for (const w of widgets) {
    const body = html.slice(w.outerStart, w.outerEnd);
    if (INLINE_HANDLER_ATTR_RE.test(body)) {
      interactive++;
      continue;
    }
    const { ids, classes } = extractSelectors(body);
    let hit = false;
    for (const s of scripts) {
      for (const id of ids) {
        if (scriptReferencesSelector(s, id, 'id')) { hit = true; break; }
      }
      if (hit) break;
      for (const cls of classes) {
        if (scriptReferencesSelector(s, cls, 'class')) { hit = true; break; }
      }
      if (hit) break;
    }
    if (hit) interactive++;
  }
  return { total: widgets.length, interactive };
}

// ─────────────────────────────────────────────────────────────────────────
// Health bucket helpers.

function bucketBlurbs(n)  { return n === 0 ? 'green' : (n <= 3 ? 'yellow' : 'red'); }
function bucketDead(n)    { return n <= 1 ? 'green' : (n <= 3 ? 'yellow' : 'red'); }
function bucketPrereqs(n) { return n === 0 ? 'green' : (n <= 2 ? 'yellow' : 'red'); }
function bucketWidgets(total, interactive) {
  if (total === 0) return 'na';
  const stat = total - interactive;
  return stat === 0 ? 'green' : (stat <= 2 ? 'yellow' : 'red');
}
const EMOJI = { green: '🟢', yellow: '🟡', red: '🔴', na: '⬜' };
function worst(buckets) {
  const order = ['green', 'yellow', 'red'];
  let best = -1;
  for (const b of buckets) {
    if (b === 'na') continue;
    const rank = order.indexOf(b);
    if (rank > best) best = rank;
  }
  return best === -1 ? 'na' : order[best];
}

// ─────────────────────────────────────────────────────────────────────────
// Build per-topic scorecards.

const scorecards = [];
for (const topic of topics) {
  if (!topicData.has(topic)) continue;
  if (TOPIC_FILTER && topic !== TOPIC_FILTER) continue;

  const d = topicData.get(topic);
  const conceptCount = (d.concepts || []).length;
  const quiz = tallyQuizzes(topic);
  const blurbs = countBlurbFlagsForTopic(topic);
  const back = backlinkSignalsForTopic(topic);
  const prereqs = countCrossTopicSuggestionsForTopic(topic);
  const widgets = widgetRatioForTopic(topic);

  const buckets = {
    blurbs: bucketBlurbs(blurbs),
    deadEnds: bucketDead(back.deadEnds),
    prereqs: bucketPrereqs(prereqs),
    widgets: bucketWidgets(widgets.total, widgets.interactive),
  };
  const overall = worst(Object.values(buckets));

  scorecards.push({
    topic,
    title: d.title || topic,
    conceptCount,
    quiz,
    blurbs,
    backlinks: back,
    crossTopicPrereqs: prereqs,
    widgets,
    buckets,
    overall,
  });
}

// ─────────────────────────────────────────────────────────────────────────
// JSON output path.

if (JSON_OUT) {
  const totals = { green: 0, yellow: 0, red: 0, na: 0 };
  for (const s of scorecards) totals[s.overall]++;
  console.log(
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalTopics: scorecards.length,
        bucketTotals: totals,
        hubThreshold: HUB_THRESHOLD,
        orphanThreshold: ORPHAN_THRESHOLD,
        topics: scorecards,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

// ─────────────────────────────────────────────────────────────────────────
// Pretty-printed scorecard.

console.log(`concept-graph-health — ${scorecards.length} topic(s)`);
console.log('');
console.log('LEGEND: 🟢 healthy · 🟡 minor · 🔴 attention · ⬜ n/a');
console.log('');

function pad(s, n) {
  s = String(s);
  if (s.length >= n) return s;
  return s + ' '.repeat(n - s.length);
}

// Column widths (visual). Emoji glyphs count as width 2 in most terminals but
// JavaScript .length still reports them as 2 UTF-16 code units, so padding by
// code-unit length happens to align correctly in practice.
const COL_TOPIC = 30;
const COL_CONCEPTS = 9;
const COL_QUIZZES = 10;
const COL_BLURBS = 12;
const COL_BACKLINKS = 18;
const COL_PREREQS = 10;
const COL_WIDGETS = 12;

const header =
  pad('TOPIC', COL_TOPIC) +
  pad('CONCEPTS', COL_CONCEPTS) +
  pad('QUIZZES', COL_QUIZZES) +
  pad('BLURBS', COL_BLURBS) +
  pad('BACKLINKS', COL_BACKLINKS) +
  pad('PREREQS', COL_PREREQS) +
  pad('WIDGETS', COL_WIDGETS);
console.log(header);
console.log('─'.repeat(COL_TOPIC + COL_CONCEPTS + COL_QUIZZES + COL_BLURBS + COL_BACKLINKS + COL_PREREQS + COL_WIDGETS));

for (const s of scorecards) {
  const topic = pad(s.topic, COL_TOPIC);
  const concepts = pad(String(s.conceptCount), COL_CONCEPTS);
  const quizzes = pad(`${s.quiz.v1}/${s.conceptCount}`, COL_QUIZZES);
  const blurbs = pad(`${EMOJI[s.buckets.blurbs]} ${s.blurbs}`, COL_BLURBS);
  const backlinks = pad(
    `${EMOJI[s.buckets.deadEnds]} ${s.backlinks.deadEnds} dead${s.backlinks.orphanedHubs ? `·${s.backlinks.orphanedHubs}orph` : ''}`,
    COL_BACKLINKS,
  );
  const prereqs = pad(`${EMOJI[s.buckets.prereqs]} ${s.crossTopicPrereqs}`, COL_PREREQS);
  const widgets = pad(
    s.widgets.total === 0
      ? `${EMOJI.na} 0/0`
      : `${EMOJI[s.buckets.widgets]} ${s.widgets.interactive}/${s.widgets.total}`,
    COL_WIDGETS,
  );
  console.log(topic + concepts + quizzes + blurbs + backlinks + prereqs + widgets);
}

console.log('');

// Summary totals.
const totals = { green: 0, yellow: 0, red: 0, na: 0 };
for (const s of scorecards) totals[s.overall]++;
const summaryBits = [];
if (totals.green)  summaryBits.push(`${totals.green} 🟢`);
if (totals.yellow) summaryBits.push(`${totals.yellow} 🟡`);
if (totals.red)    summaryBits.push(`${totals.red} 🔴`);
if (totals.na)     summaryBits.push(`${totals.na} ⬜`);
console.log(`Summary: ${summaryBits.join(' · ')}`);

// Aggregate cross-checks (sanity hooks: these match the totals the dedicated
// audits would print).
const totalDeadEnds = scorecards.reduce((n, s) => n + s.backlinks.deadEnds, 0);
const totalBlurbFlags = scorecards.reduce((n, s) => n + s.blurbs, 0);
const totalPrereqSugg = scorecards.reduce((n, s) => n + s.crossTopicPrereqs, 0);
const totalWidgets = scorecards.reduce((n, s) => n + s.widgets.total, 0);
const totalInteractive = scorecards.reduce((n, s) => n + s.widgets.interactive, 0);
console.log(
  `Totals: ${totalBlurbFlags} blurb flag(s) · ${totalDeadEnds} dead-end(s) · ${totalPrereqSugg} cross-topic suggestion(s) · ${totalInteractive}/${totalWidgets} interactive widgets`,
);
console.log(`Hub thresholds (p95/p90): n≥${HUB_THRESHOLD} / orphan n≥${ORPHAN_THRESHOLD}`);
console.log('');
console.log('Advisory — no CI gate. Run dedicated audits for per-concept details.');

process.exit(0);
