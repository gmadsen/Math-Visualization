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
//     spans) are handled by the shared `forEachSectionProse` walker, which
//     returns per-text-node `masked` strings with KaTeX math spans replaced
//     by spaces.
//   - Only <p> text inside the owning <section> counts as section prose
//     (matching the pre-refactor regex-based behavior).
//   - Transitive prereq closure is computed via BFS over the global prereq
//     DAG; if the target is already reachable from the source, no suggestion
//     is emitted (the edge is implied).
//
// Depends only on the shared content-model + audit-utils modules.

import { loadContentModel, forEachSectionProse } from './lib/content-model.mjs';
import {
  buildTitleRegex,
  TITLE_BLOCKLIST,
  MIN_TITLE_LEN,
} from './lib/audit-utils.mjs';

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
// Load content model.

const model = await loadContentModel();
const { topics, concepts, topicIds } = model;

// ─────────────────────────────────────────────────────────────────────────
// Build vocab of "candidate targets": concepts with titles long enough and
// not blocklisted. Longest-first so multi-word titles outrank prefixes.

const vocab = [];
for (const c of concepts.values()) {
  if (!c.title || !c.anchor) continue;
  const titleTrim = c.title.trim();
  const titleLower = titleTrim.toLowerCase();
  if (titleTrim.length < MIN_TITLE_LEN) continue;
  if (TITLE_BLOCKLIST.has(titleLower)) continue;
  vocab.push({
    id: c.id,
    title: titleTrim,
    titleLower,
    topic: c.topic,
    page: c.page,
    anchor: c.anchor,
    regex: buildTitleRegex(titleTrim, { global: true }),
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
  const src = concepts.get(id);
  if (!src) {
    transitiveCache.set(id, seen);
    return seen;
  }
  const queue = [...(src.prereqs || [])];
  while (queue.length > 0) {
    const next = queue.shift();
    if (seen.has(next)) continue;
    seen.add(next);
    const n = concepts.get(next);
    if (!n) continue;
    for (const p of n.prereqs || []) {
      if (!seen.has(p)) queue.push(p);
    }
  }
  transitiveCache.set(id, seen);
  return seen;
}

// ─────────────────────────────────────────────────────────────────────────
// Section-prose extraction. Walks the concept's parsed <section> element,
// collecting `masked` text from every prose TextNode whose nearest
// ancestor within the section is a <p>. Non-<p> prose (e.g. list items)
// is intentionally skipped to preserve pre-refactor semantics.

function extractSectionProse(sectionEl) {
  if (!sectionEl) return '';
  const parts = [];
  forEachSectionProse(sectionEl, (_textNode, { masked, parent }) => {
    // Walk up from the text-node parent to find the nearest element tag.
    // If the first `<p>` we see (before leaving the section) is an ancestor,
    // this text belongs to a <p>. forEachSectionProse already filters out
    // heading/code/aside/widget/etc. subtrees, so we only need the <p> check.
    let el = parent;
    while (el && el !== sectionEl) {
      const tag = (el.rawTagName || el.tagName || '').toLowerCase();
      if (tag === 'p') {
        parts.push(masked);
        return;
      }
      el = el.parentNode;
    }
  });
  // Join with spaces (not \n) so multi-word titles split across inline tags
  // like `<strong>…</strong>` still match cleanly and the reported `phrase`
  // stays on a single line.
  return parts.join(' ');
}

// ─────────────────────────────────────────────────────────────────────────
// Scan.

const suggestions = []; // { sourceId, sourceTopic, targetId, targetTopic, phrase }

// Known wrong-direction false positives (the phrase match in blurb/prose
// actually describes the target depending on the source, not vice versa).
// Keys are "<sourceId>|<targetId>".
const KNOWN_WRONG_DIRECTION = new Set([
  'gluing-affines|scheme-morphisms', // scheme-morphisms depends on gluing-affines
]);

for (const topicId of topicIds) {
  if (TOPIC_FILTER && topicId !== TOPIC_FILTER) continue;
  const topic = topics.get(topicId);
  if (!topic) continue;
  for (const conceptId of topic.conceptIds) {
    const src = concepts.get(conceptId);
    if (!src) continue;
    if (!src.anchor) continue;
    const directPrereqs = new Set(src.prereqs);
    const transitive = transitivePrereqs(conceptId);

    // Build text corpus: blurb + section prose.
    const sectionEl = topic.sections.get(src.anchor) || src.section || null;
    const sectionText = extractSectionProse(sectionEl);
    const corpus = (src.blurb || '') + '\n' + sectionText;
    if (!corpus.trim()) continue;

    // Longest-first match; once a title matches, record the exact character
    // range in a local mask so shorter title matches inside the same span
    // don't double-fire.
    const corpusMask = new Uint8Array(corpus.length);
    // Collect candidates for this source concept (dedupe by target id).
    const seenTargets = new Set();

    for (const v of vocab) {
      if (v.topic === topicId) continue; // only CROSS-topic titles
      if (v.id === conceptId) continue;
      if (directPrereqs.has(v.id)) continue;
      if (transitive.has(v.id)) continue; // already reachable
      if (seenTargets.has(v.id)) continue;
      // Reverse-direction cycle suppression: if the target already depends
      // (transitively) on the source, suggesting source → target would create
      // a cycle. The phrase match in this case is the target name appearing
      // in the source's prose because the source IS what the target depends on.
      const targetClosure = transitivePrereqs(v.id);
      if (targetClosure.has(conceptId)) continue;

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

      if (KNOWN_WRONG_DIRECTION.has(`${conceptId}|${v.id}`)) continue;

      suggestions.push({
        sourceId: conceptId,
        sourceTopic: topicId,
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
  const src = concepts.get(sourceId);
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
