#!/usr/bin/env node
// Print the prose-only view of a topic (or one concept's section) for
// quality passes that don't need to wade through SVG/script bytes.
//
// Usage:
//   node scripts/read-prose.mjs <topic-slug>
//   node scripts/read-prose.mjs <topic-slug> <concept-id>
//
// Output is the raw `raw`-block HTML for the requested scope, with widget
// bodies and quiz placeholders replaced by single-line `[widget: <slug-or-id>]`
// / `[quiz: <concept-id>]` markers, plus brief `<script>…</script>` blocks
// removed. KaTeX delimiters and prose markup are preserved.
//
// Use cases: cross-topic notation/style passes, blurb drift, prose review.
//
// Exits 1 on missing topic or unknown concept id; 0 on success.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const argv = process.argv.slice(2);
if (argv.length < 1 || argv.length > 2) {
  console.error('usage: node scripts/read-prose.mjs <topic-slug> [<concept-id>]');
  process.exit(2);
}
const [topicSlug, conceptId] = argv;

const jsonPath = join(repoRoot, 'content', `${topicSlug}.json`);
if (!existsSync(jsonPath)) {
  console.error(`read-prose: content/${topicSlug}.json not found`);
  process.exit(1);
}
const data = JSON.parse(readFileSync(jsonPath, 'utf8'));

// Resolve concept-id → section-id via concepts/<topic>.json (anchor field).
let scopeSectionId = null;
if (conceptId) {
  const cPath = join(repoRoot, 'concepts', `${topicSlug}.json`);
  if (!existsSync(cPath)) {
    console.error(`read-prose: concepts/${topicSlug}.json not found — cannot resolve concept id`);
    process.exit(1);
  }
  const cDoc = JSON.parse(readFileSync(cPath, 'utf8'));
  const concept = (cDoc.concepts || []).find((c) => c.id === conceptId);
  if (!concept) {
    console.error(`read-prose: concept id "${conceptId}" not found in concepts/${topicSlug}.json`);
    process.exit(1);
  }
  scopeSectionId = concept.anchor;
  if (!scopeSectionId) {
    console.error(`read-prose: concept "${conceptId}" has no anchor; cannot scope output`);
    process.exit(1);
  }
}

// Strip widget chrome inside a raw HTML fragment. Replaces each
// `<div class="widget">…</div>` (depth-balanced) with `[widget]`. Also
// removes inline `<script>…</script>` blocks. Quiz placeholders are left
// alone — they'll be turned into `[quiz: id]` separately.
function stripWidgets(html) {
  // Drop <script>…</script>.
  let out = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '');

  // Walk for <div class="widget">…</div>, depth-balanced.
  const widgetOpen = /<div\b[^>]*\bclass=["'][^"']*\bwidget\b[^"']*["'][^>]*>/gi;
  let m;
  const replacements = [];
  while ((m = widgetOpen.exec(out))) {
    const openStart = m.index;
    const openEnd = m.index + m[0].length;
    const divOpen = /<div\b[^>]*>/gi;
    const divClose = /<\/div\s*>/gi;
    divOpen.lastIndex = openEnd;
    divClose.lastIndex = openEnd;
    let depth = 1;
    let safety = 0;
    let closeIdx = -1;
    while (depth > 0) {
      if (++safety > 100000) break;
      const o = divOpen.exec(out);
      const c = divClose.exec(out);
      if (!c) break;
      if (o && o.index < c.index) {
        depth++;
        divClose.lastIndex = c.index;
      } else {
        depth--;
        if (depth === 0) { closeIdx = c.index + c[0].length; break; }
        divOpen.lastIndex = c.index + c[0].length;
      }
    }
    if (closeIdx === -1) continue;
    replacements.push({ start: openStart, end: closeIdx });
    widgetOpen.lastIndex = closeIdx;
  }
  // Apply from end → start.
  replacements.sort((a, b) => b.start - a.start);
  for (const { start, end } of replacements) {
    out = out.slice(0, start) + '[widget]' + out.slice(end);
  }

  // Drop empty `<div class="quiz" data-concept="..."></div>` placeholders too
  // — the quiz-block emitter handles them, this just covers stragglers in
  // raw blocks.
  out = out.replace(
    /<div\b[^>]*\bclass=["'][^"']*\bquiz\b[^"']*["'][^>]*>\s*<\/div>/gi,
    '[quiz]'
  );

  // Collapse 3+ blank lines that arise from stripping.
  out = out.replace(/(\r?\n){3,}/g, '\n\n');
  return out.trim();
}

// Render one block to a prose-only string.
function renderBlock(block) {
  if (block.type === 'raw') return stripWidgets(block.html || '');
  if (block.type === 'widget') {
    const id = block.slug || block.id || '';
    return id ? `[widget: ${id}]` : '[widget]';
  }
  if (block.type === 'widget-script') return ''; // pure JS — drop
  if (block.type === 'quiz') {
    const id = block.conceptId || block.concept || '';
    return id ? `[quiz: ${id}]` : '[quiz]';
  }
  return '';
}

// Stream output: per section, emit a header and the joined block prose.
const sections = data.sections || [];
const targetSections = scopeSectionId
  ? sections.filter((s) => s.id === scopeSectionId)
  : sections;

if (scopeSectionId && targetSections.length === 0) {
  console.error(`read-prose: section "${scopeSectionId}" not found in content/${topicSlug}.json`);
  process.exit(1);
}

console.log(`# topic: ${topicSlug}`);
if (scopeSectionId) console.log(`# concept: ${conceptId} → section #${scopeSectionId}`);
console.log('');

for (const sec of targetSections) {
  console.log(`<!-- section: ${sec.id} -->`);
  const parts = (sec.blocks || []).map(renderBlock).filter(Boolean);
  console.log(parts.join('\n\n'));
  console.log('');
}
