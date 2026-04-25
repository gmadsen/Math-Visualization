// Unified content-model loader for audit scripts.
//
// Reads every piece of notebook content ONCE and returns a normalized
// in-memory model:
//
//   - concepts/index.json                     → registered topic list
//   - concepts/capstones.json                 → capstone list (raw)
//   - concepts/<topic>.json  (per topic)      → concept entries
//   - quizzes/<topic>.json   (per topic)      → quiz banks (optional)
//   - <topic>.html            (per topic)     → parsed HTML + section map
//
// A single call to loadContentModel() populates:
//
//   {
//     repoRoot, conceptsDir, quizzesDir,
//     topicIds:     string[],                           // registered order
//     capstones:    object[],                           // raw capstone entries
//     topics:       Map<topicId, TopicEntry>,
//     concepts:     Map<conceptId, ConceptEntry>,
//     byPrereq:     Map<conceptId, Set<conceptId>>,    // reverse adjacency
//     crossTopicEdges: Array<{ fromTopic, fromConcept, toTopic, toConcept }>,
//     quizBanks:    Map<topicId, QuizBank | null>,
//     quizByConcept:Map<conceptId, { v1, hard, expert, title }>,
//     ownerOf:      Map<conceptId, { topic, title, anchor, page }>,
//   }
//
// Parsing is memoized: a subsequent loadContentModel() call returns the same
// object. Pass { refresh: true } to rebuild.
//
// Depends only on node-html-parser (already vendored in scripts/node_modules).

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const __filename = fileURLToPath(import.meta.url);
// scripts/lib/content-model.mjs → repo root is two levels up.
const repoRoot = resolve(dirname(__filename), '..', '..');
const conceptsDir = join(repoRoot, 'concepts');
const quizzesDir = join(repoRoot, 'quizzes');

// ─────────────────────────────────────────────────────────────────────────
// Memoization.

let _cached = null;

/**
 * Load (or return cached) normalized content model.
 *
 * @param {object} [opts]
 * @param {boolean} [opts.refresh]  Force a fresh parse.
 */
export async function loadContentModel(opts = {}) {
  if (_cached && !opts.refresh) return _cached;
  _cached = buildModel();
  return _cached;
}

/**
 * Drop the in-module cache. Mostly useful for tests.
 */
export function resetContentModel() {
  _cached = null;
}

// ─────────────────────────────────────────────────────────────────────────
// Core loader.

function buildModel() {
  // 1. Topic list.
  const indexPath = join(conceptsDir, 'index.json');
  const topicIds = JSON.parse(readFileSync(indexPath, 'utf8')).topics || [];

  // 2. Capstones (raw).
  const capstonesPath = join(conceptsDir, 'capstones.json');
  const capstones = existsSync(capstonesPath)
    ? JSON.parse(readFileSync(capstonesPath, 'utf8')).capstones || []
    : [];

  // 2a. Sections (topic -> subject mapping).
  const sectionsPath = join(conceptsDir, 'sections.json');
  const sectionsRaw = existsSync(sectionsPath)
    ? JSON.parse(readFileSync(sectionsPath, 'utf8')).sections || []
    : [];
  // topic id -> { id, title } of its owning section
  const sectionByTopic = new Map();
  for (const s of sectionsRaw) {
    if (!s || !s.id) continue;
    const entry = { id: s.id, title: s.title || s.id };
    for (const t of s.topics || []) sectionByTopic.set(t, entry);
  }

  // 3. Walk each topic: concept file + quiz file + HTML.
  const topics = new Map();
  const concepts = new Map();
  const quizBanks = new Map();
  const quizByConcept = new Map();
  const ownerOf = new Map();

  for (const topicId of topicIds) {
    const conceptPath = join(conceptsDir, `${topicId}.json`);
    if (!existsSync(conceptPath)) {
      // Registered but missing content file — skip gracefully.
      topics.set(topicId, {
        id: topicId,
        page: `${topicId}.html`,
        conceptIds: [],
        html: null,
        sections: new Map(),
      });
      quizBanks.set(topicId, null);
      continue;
    }
    const conceptDoc = JSON.parse(readFileSync(conceptPath, 'utf8'));
    const page = conceptDoc.page || `${topicId}.html`;

    // Parse the HTML page if present.
    const pagePath = join(repoRoot, page);
    let htmlRoot = null;
    const sections = new Map();
    if (existsSync(pagePath)) {
      const raw = readFileSync(pagePath, 'utf8');
      htmlRoot = parse(raw, {
        // Preserve whitespace inside <pre> etc.
        blockTextElements: {
          script: true,
          noscript: true,
          style: true,
          pre: true,
        },
      });
    }

    // Concept records.
    const conceptIds = [];
    for (const c of conceptDoc.concepts || []) {
      if (!c || !c.id) continue;
      conceptIds.push(c.id);
      const sectionEl = htmlRoot && c.anchor
        ? htmlRoot.querySelector(`section#${cssEscape(c.anchor)}`) ||
          htmlRoot.getElementById?.(c.anchor) ||
          null
        : null;
      if (sectionEl && c.anchor) sections.set(c.anchor, sectionEl);

      // First writer wins — matches audit-callbacks.mjs semantics.
      if (!concepts.has(c.id)) {
        concepts.set(c.id, {
          id: c.id,
          title: c.title || c.id,
          anchor: c.anchor || null,
          prereqs: Array.isArray(c.prereqs) ? c.prereqs.slice() : [],
          blurb: c.blurb || '',
          topic: topicId,
          page,
          section: sectionEl,
        });
        ownerOf.set(c.id, {
          topic: topicId,
          title: c.title || c.id,
          anchor: c.anchor || null,
          page,
        });
      }
    }

    topics.set(topicId, {
      id: topicId,
      page,
      conceptIds,
      html: htmlRoot,
      sections,
    });

    // Quiz bank (optional).
    const quizPath = join(quizzesDir, `${topicId}.json`);
    if (existsSync(quizPath)) {
      const bank = JSON.parse(readFileSync(quizPath, 'utf8'));
      quizBanks.set(topicId, bank);
      const qs = (bank && bank.quizzes) || {};
      for (const [conceptId, entry] of Object.entries(qs)) {
        if (!entry) continue;
        quizByConcept.set(conceptId, {
          v1: Array.isArray(entry.questions) ? entry.questions : [],
          hard: Array.isArray(entry.hard) ? entry.hard : [],
          expert: Array.isArray(entry.expert) ? entry.expert : [],
          title: entry.title || '',
        });
      }
    } else {
      quizBanks.set(topicId, null);
    }
  }

  // 4. Derived: reverse adjacency (byPrereq) and cross-topic edges.
  const byPrereq = new Map();
  const crossTopicEdges = [];
  for (const c of concepts.values()) byPrereq.set(c.id, new Set());

  for (const c of concepts.values()) {
    for (const prereqId of c.prereqs) {
      // Reverse adjacency: prereqId → set of concepts that depend on it.
      if (!byPrereq.has(prereqId)) byPrereq.set(prereqId, new Set());
      byPrereq.get(prereqId).add(c.id);

      // Cross-topic edge test.
      const owner = ownerOf.get(prereqId);
      if (!owner) continue; // broken prereqs are validator's job.
      if (owner.topic !== c.topic) {
        crossTopicEdges.push({
          fromTopic: c.topic,
          fromConcept: c.id,
          toTopic: owner.topic,
          toConcept: prereqId,
        });
      }
    }
  }

  return {
    repoRoot,
    conceptsDir,
    quizzesDir,
    topicIds,
    capstones,
    sections: sectionsRaw,
    topics,
    concepts,
    byPrereq,
    crossTopicEdges,
    quizBanks,
    quizByConcept,
    ownerOf,
    // topic id -> { id, title } of its owning subject section, or null.
    sectionOf(topicId) {
      return sectionByTopic.get(topicId) || null;
    },
  };
}

// Minimal CSS identifier escaper for anchors that might contain a leading
// digit or other selector-hostile chars. Anchors in this repo are kebab-case
// so this is mostly defensive.
function cssEscape(s) {
  return String(s).replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
}

// ─────────────────────────────────────────────────────────────────────────
// Prose-iteration helper.
//
// Walk a parsed section element, invoking `callback(textNode, text)` for each
// prose-bearing TEXT_NODE. Skip the subtrees of:
//
//   - <script>, <style>, <svg>, <code>, <pre>, <aside>
//   - any <h1>…<h6>  (headings themselves are not prose bodies)
//   - elements with class `widget`
//   - elements with class `katex`                  (rendered math)
//   - <a>                                           (already linked, caller
//                                                    usually wants un-linked
//                                                    prose only)
//   - any node inside a `$…$`/`$$…$$`/`\(…\)`/`\[…\]` delimiter pair
//     within a single TextNode — the whole TextNode text is passed through
//     verbatim, but the helper exposes a `masked` string with those math
//     regions replaced by spaces so callers can run title regexes against it
//     without worrying about LaTeX collisions.
//
// Callback signature: (textNode, { text, masked, parent }) => void
//
// `text`   — raw TextNode text (unchanged).
// `masked` — same length, with math-delimited spans turned to spaces.
// `parent` — HTMLElement ancestor that actually contained the text.

const SKIP_TAGS = new Set([
  'script', 'style', 'svg', 'code', 'pre', 'aside',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'a',
]);

const SKIP_CLASS_TOKENS = new Set(['widget', 'katex']);

export function forEachSectionProse(sectionElement, callback) {
  if (!sectionElement || typeof callback !== 'function') return;
  walkProse(sectionElement, callback);
}

function walkProse(node, cb) {
  if (!node) return;
  // TextNode nodeType === 3
  if (node.nodeType === 3) {
    const text = node.rawText != null ? node.rawText : String(node.text || '');
    if (!text || !text.trim()) return;
    cb(node, {
      text,
      masked: maskMathDelimiters(text),
      parent: node.parentNode || null,
    });
    return;
  }
  // ELEMENT_NODE === 1 (HTMLElement)
  if (node.nodeType !== 1) return;

  const tag = (node.rawTagName || node.tagName || '').toLowerCase();
  if (SKIP_TAGS.has(tag)) return;

  // Class-based skips.
  if (node.classList && typeof node.classList.contains === 'function') {
    for (const c of SKIP_CLASS_TOKENS) {
      if (node.classList.contains(c)) return;
    }
  }

  for (const child of node.childNodes || []) {
    walkProse(child, cb);
  }
}

/**
 * Replace math-delimited spans ($…$, $$…$$, \(…\), \[…\]) in a text string
 * with runs of spaces so downstream regex matches can ignore them. Length-
 * preserving so callers can correlate indices back to the source string.
 */
export function maskMathDelimiters(text) {
  const buf = text.split('');
  const n = buf.length;

  function escapedAt(i) {
    let count = 0;
    for (let j = i - 1; j >= 0 && buf[j] === '\\'; j--) count++;
    return count % 2 === 1;
  }

  // $$ … $$
  for (let i = 0; i < n - 1; ) {
    if (buf[i] === '$' && buf[i + 1] === '$' && !escapedAt(i)) {
      let j = i + 2;
      while (j < n - 1) {
        if (buf[j] === '$' && buf[j + 1] === '$' && !escapedAt(j)) {
          for (let k = i; k < j + 2; k++) buf[k] = ' ';
          i = j + 2;
          break;
        }
        j++;
      }
      if (j >= n - 1) break;
    } else {
      i++;
    }
  }

  // $ … $  (single-dollar, not already blanked)
  for (let i = 0; i < n; ) {
    if (buf[i] === '$' && !escapedAt(i)) {
      let j = i + 1;
      while (j < n) {
        if (buf[j] === '$' && !escapedAt(j)) {
          for (let k = i; k < j + 1; k++) buf[k] = ' ';
          i = j + 1;
          break;
        }
        j++;
      }
      if (j >= n) break;
    } else {
      i++;
    }
  }

  // \( … \)  and  \[ … \]
  for (const [openR, closeR] of [['(', ')'], ['[', ']']]) {
    for (let i = 0; i < n - 1; ) {
      if (buf[i] === '\\' && buf[i + 1] === openR) {
        let j = i + 2;
        while (j < n - 1) {
          if (buf[j] === '\\' && buf[j + 1] === closeR) {
            for (let k = i; k < j + 2; k++) buf[k] = ' ';
            i = j + 2;
            break;
          }
          j++;
        }
        if (j >= n - 1) break;
      } else {
        i++;
      }
    }
  }

  return buf.join('');
}

// ─────────────────────────────────────────────────────────────────────────
// Direct-invocation self-check: `node scripts/lib/content-model.mjs`.

if (import.meta.url === `file://${process.argv[1]}`) {
  const model = await loadContentModel();
  const missingQuiz = [...model.quizBanks.entries()]
    .filter(([, v]) => v == null)
    .map(([k]) => k);
  const missingSections = [];
  for (const c of model.concepts.values()) {
    if (c.anchor && !c.section) missingSections.push(`${c.topic}#${c.anchor} (${c.id})`);
  }
  console.log(`topics: ${model.topics.size}`);
  console.log(`concepts: ${model.concepts.size}`);
  console.log(`quizBanks: ${[...model.quizBanks.values()].filter(Boolean).length}`);
  console.log(`cross-topic edges: ${model.crossTopicEdges.length}`);
  console.log(`capstones: ${model.capstones.length}`);
  console.log(`topics missing quiz file: ${missingQuiz.length}${missingQuiz.length ? ' (' + missingQuiz.join(', ') + ')' : ''}`);
  console.log(`concepts whose anchor has no matching <section>: ${missingSections.length}`);
  if (missingSections.length && missingSections.length <= 20) {
    for (const s of missingSections) console.log(`  - ${s}`);
  }
}
