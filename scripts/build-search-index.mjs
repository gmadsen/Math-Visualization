#!/usr/bin/env node
// Build a flat client-side search index across every topic page in the notebook.
//
// Walks:
//   • each registered topic (from concepts/index.json) — extracts <title> and every
//     <section id="..."> heading from its HTML
//   • concepts/<topic>.json — one record per concept (title + blurb + anchor)
//   • quizzes/<topic>.json — one record per question (v1, hard, expert tiers)
//
// Skips SPECIAL pages (index, pathway, progress, review, latex-cheatsheet, search,
// sections/*): those aren't topic pages and don't belong in the search corpus.
//
// Writes search-index.json at the repo root — consumed by search.html over file://.
//
// Usage:  node scripts/build-search-index.mjs
// Output: search-index.json (overwritten)

import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');
const quizzesDir = join(repoRoot, 'quizzes');

// ── helpers ───────────────────────────────────────────────────────────────

// Strip HTML tags & decode a handful of common entities. Good enough for
// heading text and quiz prompts — KaTeX sources come through as raw strings
// (e.g. "$\\mathbb{Z}/7$"), which is desirable for substring search.
function stripHtml(s) {
  if (typeof s !== 'string') return '';
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract <title>…</title> content from an HTML string.
function extractTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? stripHtml(m[1]) : '';
}

// Extract every <section id="…"> and its first heading (h1|h2|h3) text.
// Returns array of { id, heading }.
function extractSections(html) {
  const out = [];
  // Greedy-enough: look for opening tag, capture id, then find the next h1..h3 text.
  const re = /<section\s+[^>]*\bid\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/section>/gi;
  let m;
  while ((m = re.exec(html))) {
    const id = m[1];
    const body = m[2];
    const hm = body.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
    const heading = hm ? stripHtml(hm[1]) : '';
    if (heading) out.push({ id, heading });
  }
  return out;
}

// Flatten a quiz question into a single searchable text blob: q + explain + hint.
// Callers decide which fields to expose in the record itself.
function flattenQuestion(q) {
  const parts = [];
  if (q.q) parts.push(stripHtml(q.q));
  if (q.explain) parts.push(stripHtml(q.explain));
  if (q.hint) parts.push(stripHtml(q.hint));
  return parts.join(' ');
}

// ── walk ──────────────────────────────────────────────────────────────────

const indexRaw = readFileSync(join(conceptsDir, 'index.json'), 'utf8');
const topicList = JSON.parse(indexRaw).topics;

const records = [];
let topicCount = 0, sectionCount = 0, conceptCount = 0, questionCount = 0;

for (const topic of topicList) {
  const htmlPath = join(repoRoot, `${topic}.html`);
  let html = '';
  try {
    html = readFileSync(htmlPath, 'utf8');
  } catch (e) {
    console.warn(`build-search-index: missing ${topic}.html — skipping`);
    continue;
  }

  const pageUrl = `${topic}.html`;
  const pageTitleRaw = extractTitle(html);
  // Most titles are "Foo — interactive intro" / "Foo — something"; strip suffix.
  const pageTitle = pageTitleRaw.split(/\s+[—–-]\s+/)[0] || pageTitleRaw || topic;

  // Load concepts map first so section extraction can cross-reference anchors.
  const conceptsPath = join(conceptsDir, `${topic}.json`);
  let conceptsData = null;
  try {
    conceptsData = JSON.parse(readFileSync(conceptsPath, 'utf8'));
  } catch (e) {
    console.warn(`build-search-index: no concepts/${topic}.json — continuing with HTML only`);
  }

  const conceptByAnchor = new Map();
  if (conceptsData && Array.isArray(conceptsData.concepts)) {
    for (const c of conceptsData.concepts) {
      if (c.anchor) conceptByAnchor.set(c.anchor, c);
    }
  }

  // Topic record.
  records.push({
    type: 'topic',
    topic,
    title: pageTitle,
    url: pageUrl
  });
  topicCount++;

  // Section records — one per <section id="…"> heading, but skip ones that are
  // already covered by a concept record (same anchor) to avoid near-duplicate
  // hits in the results list.
  const sections = extractSections(html);
  for (const s of sections) {
    if (conceptByAnchor.has(s.id)) continue;
    records.push({
      type: 'section',
      topic,
      title: s.heading,
      url: `${pageUrl}#${s.id}`
    });
    sectionCount++;
  }

  // Concept records — from concepts/<topic>.json.
  if (conceptsData && Array.isArray(conceptsData.concepts)) {
    for (const c of conceptsData.concepts) {
      records.push({
        type: 'concept',
        topic,
        id: c.id,
        title: c.title || '',
        blurb: stripHtml(c.blurb || ''),
        url: `${pageUrl}${c.anchor ? '#' + c.anchor : ''}`
      });
      conceptCount++;
    }
  }

  // Question records — from quizzes/<topic>.json, across all three tiers.
  const quizPath = join(quizzesDir, `${topic}.json`);
  let quizData = null;
  try {
    quizData = JSON.parse(readFileSync(quizPath, 'utf8'));
  } catch (e) {
    quizData = null;
  }
  if (quizData && quizData.quizzes) {
    for (const [conceptId, bank] of Object.entries(quizData.quizzes)) {
      const concept = conceptsData && Array.isArray(conceptsData.concepts)
        ? conceptsData.concepts.find((c) => c.id === conceptId)
        : null;
      const anchor = concept && concept.anchor ? concept.anchor : '';
      const url = anchor ? `${pageUrl}#${anchor}` : pageUrl;
      const tiers = [
        ['v1', bank.questions],
        ['hard', bank.hard],
        ['expert', bank.expert]
      ];
      for (const [tier, arr] of tiers) {
        if (!Array.isArray(arr)) continue;
        for (const q of arr) {
          const text = flattenQuestion(q);
          if (!text) continue;
          records.push({
            type: 'question',
            topic,
            concept: conceptId,
            tier,
            q: stripHtml(q.q || ''),
            text,
            url
          });
          questionCount++;
        }
      }
    }
  }
}

const outPath = join(repoRoot, 'search-index.json');
writeFileSync(outPath, JSON.stringify(records));

const sizeKB = Math.round(statSync(outPath).size / 1024);
console.log(
  `wrote ${outPath} — ${records.length} records ` +
  `(${topicCount} topic, ${sectionCount} section, ${conceptCount} concept, ${questionCount} question) · ${sizeKB} KB`
);
