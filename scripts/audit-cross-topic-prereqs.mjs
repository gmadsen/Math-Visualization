#!/usr/bin/env node
// Advisory audit: suggest missing cross-topic prereq edges.
//
// Semantics:
//   For every concept, scan its own `blurb` (from concepts/<topic>.json) plus
//   the prose of its owning <section> on the topic HTML page. If that combined
//   text mentions the `title` of a concept owned by a DIFFERENT topic, and
//   that concept is not already listed (directly or transitively) in the
//   source's `prereqs`, report it as a candidate cross-topic prereq edge.
//
//   This is advisory output — the script always exits 0 and edits nothing.
//   The user decides which suggestions are real missing edges.
//
// CLI:
//   node scripts/audit-cross-topic-prereqs.mjs
//       Scan every concept in every topic file; print grouped suggestions.
//
//   node scripts/audit-cross-topic-prereqs.mjs --limit N
//       Cap the number of suggestions printed (after sorting by source concept).
//
//   node scripts/audit-cross-topic-prereqs.mjs --topic <id>
//       Restrict to one concept file (topic id, e.g. `modular-forms`).
//
// Design notes:
//   - Concept-title matching reuses the guardrails from audit-inline-links.mjs:
//     longest-first, whole-word, case-insensitive, MIN_TITLE_LEN cutoff, plus
//     a blocklist of common English / overloaded math words. Skip zones (head,
//     script, style, svg, pre, code, aside, h1-h6, widgets, anchors, math
//     spans, tag interiors) are masked out just like the inline-links audit.
//   - Only <p> text inside the owning <section> counts as section prose.
//   - Transitive prereq closure is computed via BFS over the global prereq
//     DAG; if the target is already reachable from the source, no suggestion
//     is emitted (the edge is implied).
//
// Zero dependencies.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');

// ─────────────────────────────────────────────────────────────────────────
// CLI.

const argv = process.argv.slice(2);
let LIMIT = null;
let TOPIC_FILTER = null;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--limit') {
    const v = parseInt(argv[++i], 10);
    if (!Number.isFinite(v) || v <= 0) {
      console.error('audit-cross-topic-prereqs: --limit requires a positive integer');
      process.exit(2);
    }
    LIMIT = v;
  } else if (a === '--topic') {
    TOPIC_FILTER = argv[++i];
    if (!TOPIC_FILTER || TOPIC_FILTER.startsWith('--')) {
      console.error('audit-cross-topic-prereqs: --topic requires a topic id');
      process.exit(2);
    }
  } else if (a === '--help' || a === '-h') {
    console.log('Usage: node scripts/audit-cross-topic-prereqs.mjs [--limit N] [--topic <id>]');
    process.exit(0);
  } else {
    console.error(`audit-cross-topic-prereqs: unknown argument "${a}"`);
    process.exit(2);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Configuration (shared with audit-inline-links.mjs).

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

// ─────────────────────────────────────────────────────────────────────────
// Load concept graph.

const indexPath = join(conceptsDir, 'index.json');
const topics = JSON.parse(readFileSync(indexPath, 'utf8')).topics;

// conceptId -> { topic, title, anchor, page, prereqs, blurb }
const byId = new Map();
// topic -> { page, concepts: [full entry] }
const topicData = new Map();

for (const topic of topics) {
  const p = join(conceptsDir, `${topic}.json`);
  if (!existsSync(p)) continue;
  const d = JSON.parse(readFileSync(p, 'utf8'));
  topicData.set(topic, d);
  const page = d.page || `${topic}.html`;
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
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Build vocab of "candidate targets": concepts with titles long enough and
// not blocklisted. Longest-first so multi-word titles outrank prefixes.

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildTitleRegex(title) {
  const pattern =
    '\\b' +
    title
      .split(/\s+/)
      .map((w) => escapeRe(w).replace(/[-‐-―]/g, '[-\\u2010-\\u2015]'))
      .join('\\s+') +
    '\\b';
  return new RegExp(pattern, 'gi');
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
    titleLower,
    topic: c.topic,
    page: c.page,
    anchor: c.anchor,
    regex: buildTitleRegex(c.title.trim()),
  });
}
vocab.sort((a, b) => b.title.length - a.title.length);

// ─────────────────────────────────────────────────────────────────────────
// Transitive prereq closure per concept.
//
// BFS over the prereq DAG starting from a concept's direct prereqs. Returns a
// Set of every concept id reachable that way (excluding the source itself).

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

// ─────────────────────────────────────────────────────────────────────────
// Skip-zone masking for topic HTML prose. Lifted from audit-inline-links.mjs
// (trimmed: we only need `mask` and `containerMask` for <p> filtering).

function maskRegion(mask, start, end) {
  for (let i = start; i < end && i < mask.length; i++) mask[i] = 1;
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

  // <div class="widget"> — balance-scan divs.
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
  // $$…$$
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
  // $…$
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
  // \(…\) and \[…\]
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

// ─────────────────────────────────────────────────────────────────────────
// Section-owning range for a concept.
//
// We treat the range from the element carrying id="<anchor>" up to the next
// id-bearing heading/section boundary (or </section>) as the concept's
// "section". This mirrors findSection() in audit-callbacks.mjs.

function findSectionRange(html, anchor) {
  const idRe = new RegExp(
    `<([a-zA-Z][a-zA-Z0-9]*)([^>]*\\sid=["']${escapeRe(anchor)}["'][^>]*)>`,
    'i'
  );
  const m = idRe.exec(html);
  if (!m) return null;
  const innerStart = m.index + m[0].length;
  const nextBoundaryRe = /<(?:section|h2|h3|h4)\b[^>]*\sid=["'][^"']+["']/gi;
  nextBoundaryRe.lastIndex = innerStart;
  const nextBoundaryM = nextBoundaryRe.exec(html);
  const nextCloseRe = /<\/section>/gi;
  nextCloseRe.lastIndex = innerStart;
  const nextCloseM = nextCloseRe.exec(html);
  let innerEnd;
  if (nextBoundaryM && (!nextCloseM || nextBoundaryM.index < nextCloseM.index)) {
    innerEnd = nextBoundaryM.index;
  } else if (nextCloseM) {
    innerEnd = nextCloseM.index;
  } else {
    innerEnd = html.length;
  }
  return { innerStart, innerEnd };
}

// Extract concatenated <p> text from within a range, restricted to <p> spans
// whose opener sits OUTSIDE any skip container. We also null out masked
// offsets so that math/code/widget/etc. text cannot contribute to matching.
//
// Returns a string of length (innerEnd - innerStart) where skip-zone bytes
// are replaced with spaces. Matching is then performed with a global regex
// over this string.

function extractProseRegion(html, mask, containerMask, innerStart, innerEnd) {
  // Walk <p> openers inside the range.
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
    // Slice the <p> body, replacing masked bytes with spaces so titles can't
    // match across a skip zone nor inside one.
    let buf = '';
    for (let i = pStart; i < pEnd; i++) {
      buf += mask[i] ? ' ' : html[i];
    }
    parts.push(buf);
  }
  return parts.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────
// Scan.

const suggestions = []; // { sourceId, sourceTopic, targetId, targetTopic, phrase }
const pageTextCache = new Map(); // topic -> { html, mask, containerMask }

function getPageContext(topic) {
  if (pageTextCache.has(topic)) return pageTextCache.get(topic);
  const d = topicData.get(topic);
  if (!d) return null;
  const page = d.page || `${topic}.html`;
  const pagePath = join(repoRoot, page);
  if (!existsSync(pagePath)) {
    pageTextCache.set(topic, null);
    return null;
  }
  const html = readFileSync(pagePath, 'utf8');
  const { mask, containerMask } = buildSkipMask(html);
  const ctx = { html, mask, containerMask };
  pageTextCache.set(topic, ctx);
  return ctx;
}

for (const [topic, d] of topicData) {
  if (TOPIC_FILTER && topic !== TOPIC_FILTER) continue;
  const ctx = getPageContext(topic);
  for (const c of d.concepts || []) {
    if (!c.anchor) continue;
    const src = byId.get(c.id);
    if (!src) continue;
    const directPrereqs = new Set(src.prereqs);
    const transitive = transitivePrereqs(c.id);

    // Build text corpus: blurb + section prose.
    let sectionText = '';
    if (ctx) {
      const range = findSectionRange(ctx.html, c.anchor);
      if (range) {
        sectionText = extractProseRegion(
          ctx.html,
          ctx.mask,
          ctx.containerMask,
          range.innerStart,
          range.innerEnd
        );
      }
    }
    const corpus = (c.blurb || '') + '\n' + sectionText;
    if (!corpus.trim()) continue;

    // Longest-first match; once a title matches, record the exact character
    // range in a local mask so shorter title matches inside the same span
    // don't double-fire.
    const corpusMask = new Uint8Array(corpus.length);
    // Collect candidates for this source concept (dedupe by target id).
    const seenTargets = new Set();

    for (const v of vocab) {
      if (v.topic === topic) continue; // only CROSS-topic titles
      if (v.id === c.id) continue;
      if (directPrereqs.has(v.id)) continue;
      if (transitive.has(v.id)) continue; // already reachable
      if (seenTargets.has(v.id)) continue;

      const re = new RegExp(v.regex.source, 'gi');
      let mm;
      let found = null;
      while ((mm = re.exec(corpus))) {
        const idx = mm.index;
        const len = mm[0].length;
        // Skip if any char in range is already claimed by a longer title.
        let blocked = false;
        for (let k = 0; k < len; k++) {
          if (corpusMask[idx + k]) { blocked = true; break; }
        }
        if (blocked) continue;
        // Skip if immediately adjacent to `$` (math-prose neighborhood).
        const pre = corpus[idx - 1] || '';
        const post = corpus[idx + len] || '';
        if (pre === '$' || post === '$') continue;
        found = { idx, len, phrase: mm[0] };
        break;
      }
      if (!found) continue;

      // Claim the range so shorter titles don't match inside it.
      for (let k = 0; k < found.len; k++) corpusMask[found.idx + k] = 1;
      seenTargets.add(v.id);

      suggestions.push({
        sourceId: c.id,
        sourceTopic: topic,
        targetId: v.id,
        targetTopic: v.topic,
        phrase: found.phrase,
      });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Report.

// Stable order: group by source topic, then by source concept id, then by
// target id.
suggestions.sort((a, b) => {
  if (a.sourceTopic !== b.sourceTopic) return a.sourceTopic.localeCompare(b.sourceTopic);
  if (a.sourceId !== b.sourceId) return a.sourceId.localeCompare(b.sourceId);
  return a.targetId.localeCompare(b.targetId);
});

const shown = LIMIT ? suggestions.slice(0, LIMIT) : suggestions;

// Group for pretty printing.
const bySource = new Map();
for (const s of shown) {
  if (!bySource.has(s.sourceId)) bySource.set(s.sourceId, []);
  bySource.get(s.sourceId).push(s);
}

for (const [sourceId, list] of bySource) {
  const src = byId.get(sourceId);
  const srcTopic = src ? src.topic : '?';
  console.log(`${sourceId} (${srcTopic})`);
  for (const s of list) {
    console.log(
      `  → suggested prereq: ${s.targetId} (${s.targetTopic}) — matched phrase "${s.phrase}"`
    );
  }
}

console.log('');
console.log(
  `audit-cross-topic-prereqs: ${suggestions.length} suggestion(s) across ${bySource.size} source concept(s)` +
    (LIMIT && suggestions.length > shown.length
      ? ` (showing first ${shown.length})`
      : '')
);

// Advisory: always exit 0.
process.exit(0);
