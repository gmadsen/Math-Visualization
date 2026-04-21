#!/usr/bin/env node
// Advisory audit of concept coupling "strength" — how deeply downstream
// consumers actually lean on each concept, not just how many declare it as a
// prereq.
//
// Companion to scripts/audit-backlink-quality.mjs. That script ranks concepts
// by raw consumer count (|reverse-prereq edges|). This one scores each
// (concept C, consumer D) pair and sums the scores per concept to surface the
// true backbone: concepts used *deeply* in their consumers' prose and
// assessments, not merely name-dropped in a prereq list.
//
// Advisory only. Always exits 0. Not wired into CI.
//
// ─────────────────────────────────────────────────────────────────────────
// Metric definition
//
// For each concept C and each consumer D (D has C as a prereq), compute:
//
//   coupling_score(C, D) =
//       1                    // base prereq edge
//     + 1 if D.blurb         mentions C.title     (weak reference)
//     + 2 if D's section     mentions C.title ≥2  (strong prose reference)
//     + 3 if D's hard-tier   mentions C.title ≥1  (deep pedagogical coupling)
//
//   strength(C)  = Σ  coupling_score(C, D)  over all consumers D
//   avg_depth(C) = strength(C) / consumer_count(C)    (undefined if n=0)
//
// Interpretations:
//   - High strength + high consumer count     → structural backbone.
//   - Low  strength + high consumer count     → shallow-cited prereq.
//   - High avg_depth + low consumer count     → niche but deeply integrated.
//
// ─────────────────────────────────────────────────────────────────────────
// CLI
//   node scripts/audit-backlink-strength.mjs            # default top 20
//   node scripts/audit-backlink-strength.mjs --top N    # top N
//
// Zero dependencies: regex + string scans only.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');
const quizzesDir = join(repoRoot, 'quizzes');

// ─────────────────────────────────────────────────────────────────────────
// CLI

const argv = process.argv.slice(2);
let TOP_N = 20;
{
  const idx = argv.indexOf('--top');
  if (idx !== -1) {
    const v = Number(argv[idx + 1]);
    if (!Number.isFinite(v) || v <= 0) {
      console.error('audit-backlink-strength: --top requires a positive integer');
      process.exit(2);
    }
    TOP_N = Math.floor(v);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Load concept graph (mirrors audit-backlink-quality.mjs).

const indexPath = join(conceptsDir, 'index.json');
const topics = JSON.parse(readFileSync(indexPath, 'utf8')).topics;

// conceptId -> { id, topic, title, anchor, prereqs, blurb }
const byId = new Map();
// topic -> topic title
const topicTitle = new Map();
// topic -> page filename
const topicPage = new Map();
// all concepts in declaration order
const allConcepts = [];

for (const topic of topics) {
  const p = join(conceptsDir, `${topic}.json`);
  if (!existsSync(p)) continue;
  const d = JSON.parse(readFileSync(p, 'utf8'));
  topicTitle.set(topic, d.title || topic);
  topicPage.set(topic, d.page || `${topic}.html`);
  for (const c of d.concepts || []) {
    if (byId.has(c.id)) continue;
    const entry = {
      id: c.id,
      topic,
      title: c.title || c.id,
      anchor: c.anchor || null,
      prereqs: c.prereqs || [],
      blurb: c.blurb || '',
    };
    byId.set(c.id, entry);
    allConcepts.push(entry);
  }
}

// Reverse adjacency: conceptId -> Array<consumer>.
const reverse = new Map();
for (const c of allConcepts) {
  for (const pid of c.prereqs) {
    if (!byId.has(pid)) continue;
    if (!reverse.has(pid)) reverse.set(pid, []);
    reverse.get(pid).push(c);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Load topic HTMLs (lazy cache).

const htmlCache = new Map();
function loadTopicHtml(topic) {
  if (htmlCache.has(topic)) return htmlCache.get(topic);
  const pagePath = join(repoRoot, topicPage.get(topic));
  let html = null;
  if (existsSync(pagePath)) {
    try {
      html = readFileSync(pagePath, 'utf8');
    } catch {
      html = null;
    }
  }
  htmlCache.set(topic, html);
  return html;
}

// Load quiz bank (lazy cache).
const quizCache = new Map();
function loadTopicQuiz(topic) {
  if (quizCache.has(topic)) return quizCache.get(topic);
  const quizPath = join(quizzesDir, `${topic}.json`);
  let data = null;
  if (existsSync(quizPath)) {
    try {
      data = JSON.parse(readFileSync(quizPath, 'utf8'));
    } catch {
      data = null;
    }
  }
  quizCache.set(topic, data);
  return data;
}

// ─────────────────────────────────────────────────────────────────────────
// Title-in-prose matching.
//
// Mirrors audit-inline-links.mjs:
//   - whole-word case-insensitive match;
//   - tolerant to varied whitespace between words;
//   - unicode hyphens interchangeable.
//
// We do *not* apply the blocklist / min-length filter here: the prereq edge
// already restricts us to specific (C, D) pairs, so false positives from
// generic English are far less of a concern than in the inline-link inserter.

function titleRegex(title, { global } = { global: false }) {
  const pattern =
    '\\b' +
    title
      .split(/\s+/)
      .map((w) =>
        w
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          .replace(/[-‐-―]/g, '[-\\u2010-\\u2015]')
      )
      .join('\\s+') +
    '\\b';
  return new RegExp(pattern, global ? 'gi' : 'i');
}

function countMatches(text, title) {
  if (!text || !title) return 0;
  const re = titleRegex(title, { global: true });
  const matches = text.match(re);
  return matches ? matches.length : 0;
}

// ─────────────────────────────────────────────────────────────────────────
// Skip-zone + <p>-only prose extraction (borrowed from audit-inline-links.mjs,
// trimmed to return the plain-text inside eligible <p> blocks only).

function maskRegion(mask, start, end) {
  for (let i = start; i < end && i < mask.length; i++) mask[i] = true;
}

function buildSkipMask(html) {
  const mask = new Uint8Array(html.length);
  const containerMask = new Uint8Array(html.length);

  const bodyM = html.match(/<body\b[^>]*>/i);
  if (bodyM) {
    maskRegion(mask, 0, bodyM.index + bodyM[0].length);
    maskRegion(containerMask, 0, bodyM.index + bodyM[0].length);
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
            maskRegion(mask, start, ev.at);
            maskRegion(containerMask, start, ev.at);
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

  // <div class="widget"> balanced-scan
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
        divOpenRe.lastIndex = Math.max(
          divOpenRe.lastIndex,
          divCloseRe.lastIndex - 1
        );
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
      maskRegion(mask, start, end);
      maskRegion(containerMask, start, end);
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
            maskRegion(mask, start, j + 2);
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
            maskRegion(mask, start, j + 1);
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
            maskRegion(mask, start, j + 2);
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

  // Mask every HTML tag interior.
  {
    const tagRe = /<[^>]*>/g;
    let m;
    while ((m = tagRe.exec(html))) {
      maskRegion(mask, m.index, m.index + m[0].length);
    }
  }

  return { mask, containerMask };
}

function buildSectionMap(html) {
  const sections = [];
  const openRe = /<section\b([^>]*)>/gi;
  const closeRe = /<\/section\s*>/gi;
  const tokens = [];
  let m;
  while ((m = openRe.exec(html))) {
    const attrs = m[1];
    const idM = attrs.match(/\bid=["']([^"']+)["']/);
    tokens.push({
      at: m.index,
      kind: 'open',
      id: idM ? idM[1] : null,
      endTag: m.index + m[0].length,
    });
  }
  while ((m = closeRe.exec(html))) {
    tokens.push({ at: m.index, kind: 'close', endTag: m.index + m[0].length });
  }
  tokens.sort((a, b) => a.at - b.at);
  const stack = [];
  for (const t of tokens) {
    if (t.kind === 'open') {
      stack.push({ id: t.id, start: t.endTag });
    } else {
      const top = stack.pop();
      if (top) sections.push({ id: top.id, start: top.start, end: t.at });
    }
  }
  return sections;
}

// Return the concatenated prose (plain text from unmasked characters inside
// eligible <p> blocks) within the <section id="<anchor>"> region of the
// topic HTML. Returns '' if the section can't be located.
function extractSectionProse(html, sectionAnchor) {
  if (!html || !sectionAnchor) return '';

  const sections = buildSectionMap(html);
  // Pick the outermost section whose id matches; there should be exactly
  // one, but prefer the first in document order just in case.
  let target = null;
  for (const s of sections) {
    if (s.id === sectionAnchor) {
      target = s;
      break;
    }
  }
  if (!target) return '';

  const { mask, containerMask } = buildSkipMask(html);

  // Enumerate <p> openers inside [target.start, target.end).
  let out = '';
  const openRe = /<p\b[^>]*>/gi;
  openRe.lastIndex = target.start;
  let m;
  while ((m = openRe.exec(html))) {
    if (m.index >= target.end) break;
    const innerStart = m.index + m[0].length;
    if (containerMask[m.index]) continue;
    const closeRe = /<\/p\s*>/gi;
    closeRe.lastIndex = innerStart;
    const cm = closeRe.exec(html);
    if (!cm) continue;
    const innerEnd = Math.min(cm.index, target.end);

    // Extract characters that are NOT masked (i.e. eligible prose).
    let buf = '';
    for (let i = innerStart; i < innerEnd; i++) {
      if (!mask[i]) buf += html[i];
    }
    // Collapse whitespace.
    buf = buf.replace(/\s+/g, ' ').trim();
    if (buf) {
      if (out) out += ' ';
      out += buf;
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────
// Quiz-text extraction (hard tier only).

function extractHardQuizText(topic, conceptId) {
  const bank = loadTopicQuiz(topic);
  if (!bank || !bank.quizzes) return '';
  const entry = bank.quizzes[conceptId];
  if (!entry) return '';
  const hard = entry.hard;
  if (!Array.isArray(hard) || hard.length === 0) return '';
  const parts = [];
  for (const q of hard) {
    if (typeof q.q === 'string') parts.push(q.q);
    if (Array.isArray(q.choices)) {
      for (const ch of q.choices) if (typeof ch === 'string') parts.push(ch);
    }
    if (Array.isArray(q.items)) {
      for (const it of q.items) if (typeof it === 'string') parts.push(it);
    }
    if (typeof q.explain === 'string') parts.push(q.explain);
    if (typeof q.hint === 'string') parts.push(q.hint);
  }
  return parts.join(' \n ');
}

// ─────────────────────────────────────────────────────────────────────────
// Per-edge coupling score.

function couplingScore(C, D) {
  let score = 1; // base prereq edge

  // +1: blurb of D mentions title of C.
  if (countMatches(D.blurb, C.title) >= 1) score += 1;

  // +2: D's section prose mentions C.title ≥ 2 times.
  const html = loadTopicHtml(D.topic);
  const prose = extractSectionProse(html, D.anchor);
  if (countMatches(prose, C.title) >= 2) score += 2;

  // +3: D's hard-tier quiz bank mentions C.title ≥ 1 time.
  const hardText = extractHardQuizText(D.topic, D.id);
  if (countMatches(hardText, C.title) >= 1) score += 3;

  return score;
}

// ─────────────────────────────────────────────────────────────────────────
// Compute per-concept strength.

const perConcept = allConcepts.map((C) => {
  const consumers = reverse.get(C.id) || [];
  let total = 0;
  for (const D of consumers) total += couplingScore(C, D);
  const avgDepth = consumers.length > 0 ? total / consumers.length : 0;
  return {
    id: C.id,
    topic: C.topic,
    title: C.title,
    consumers: consumers.length,
    strength: total,
    avgDepth,
  };
});

// ─────────────────────────────────────────────────────────────────────────
// Distribution helpers.

function percentile(sortedAsc, q) {
  if (sortedAsc.length === 0) return 0;
  const rank = Math.min(
    sortedAsc.length - 1,
    Math.max(0, Math.ceil((q / 100) * sortedAsc.length) - 1)
  );
  return sortedAsc[rank];
}

// Distributions restricted to concepts with ≥ 1 consumer (dead-ends skew
// zero and drown the signal).
const withConsumers = perConcept.filter((s) => s.consumers > 0);
const strengthSorted = withConsumers
  .map((s) => s.strength)
  .sort((a, b) => a - b);
const avgDepthSorted = withConsumers
  .map((s) => s.avgDepth)
  .sort((a, b) => a - b);

const strDist = {
  n: strengthSorted.length,
  p50: percentile(strengthSorted, 50),
  p90: percentile(strengthSorted, 90),
};
const depthDist = {
  p50: percentile(avgDepthSorted, 50),
  p90: percentile(avgDepthSorted, 90),
};

// Rankings.
const byStrength = perConcept
  .slice()
  .sort(
    (a, b) =>
      b.strength - a.strength ||
      b.consumers - a.consumers ||
      a.id.localeCompare(b.id)
  );
const byConsumers = perConcept
  .slice()
  .sort(
    (a, b) =>
      b.consumers - a.consumers ||
      b.strength - a.strength ||
      a.id.localeCompare(b.id)
  );

// Divergence: concepts in top-N by strength but NOT in top-N by consumers,
// and vice versa.
const topStrengthIds = new Set(byStrength.slice(0, TOP_N).map((s) => s.id));
const topConsumerIds = new Set(byConsumers.slice(0, TOP_N).map((s) => s.id));
const onlyInStrength = byStrength
  .slice(0, TOP_N)
  .filter((s) => !topConsumerIds.has(s.id));
const onlyInConsumers = byConsumers
  .slice(0, TOP_N)
  .filter((s) => !topStrengthIds.has(s.id));

// ─────────────────────────────────────────────────────────────────────────
// Output.

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}
function padLeft(s, n) {
  s = String(s);
  return s.length >= n ? s : ' '.repeat(n - s.length) + s;
}

function fmtRow(s) {
  return (
    `  ${pad(s.id, 36)} ${pad(`(${s.topic})`, 32)} ` +
    `consumers=${padLeft(s.consumers, 3)}  ` +
    `total_strength=${padLeft(s.strength, 4)}  ` +
    `avg_depth=${s.avgDepth.toFixed(2)}`
  );
}

console.log(
  `audit-backlink-strength: ${allConcepts.length} concept(s) across ${topicTitle.size} topic(s)`
);
console.log('');
console.log(
  `Metric: coupling(C,D) = 1 (base) + 1 (D.blurb mentions C.title) + 2 (D's section prose mentions C.title ≥2) + 3 (D's hard quiz mentions C.title)`
);
console.log(
  `        strength(C) = Σ over consumers D.   avg_depth(C) = strength/consumers.`
);
console.log('');
console.log(
  `Distribution over ${strDist.n} concept(s) with ≥1 consumer:`
);
console.log(
  `  total_strength  p50=${strDist.p50}  p90=${strDist.p90}`
);
console.log(
  `  avg_depth       p50=${depthDist.p50.toFixed(2)}  p90=${depthDist.p90.toFixed(2)}`
);

console.log('');
console.log(`Top ${TOP_N} concepts by total coupling strength:`);
if (byStrength.length === 0) {
  console.log('  (no concepts)');
} else {
  for (const s of byStrength.slice(0, TOP_N)) console.log(fmtRow(s));
}

console.log('');
console.log(
  `Top ${TOP_N} concepts by raw consumer count (for comparison with audit-backlink-quality):`
);
for (const s of byConsumers.slice(0, TOP_N)) console.log(fmtRow(s));

console.log('');
console.log(`Divergence between the two rankings (top-${TOP_N}):`);
if (onlyInStrength.length === 0 && onlyInConsumers.length === 0) {
  console.log('  (rankings agree — strength-top-N ≡ consumer-top-N)');
} else {
  console.log(
    `  In strength-top-${TOP_N} but not consumer-top-${TOP_N}  (deeply coupled, not the most cited):`
  );
  if (onlyInStrength.length === 0) console.log('    (none)');
  for (const s of onlyInStrength) console.log(fmtRow(s));
  console.log('');
  console.log(
    `  In consumer-top-${TOP_N} but not strength-top-${TOP_N}  (widely cited, shallowly coupled):`
  );
  if (onlyInConsumers.length === 0) console.log('    (none)');
  for (const s of onlyInConsumers) console.log(fmtRow(s));
}

console.log('');
console.log('OK: backlink-strength audit complete (advisory).');
process.exit(0);
