#!/usr/bin/env node
// Audit cross-page <head>-boilerplate consistency.
//
// For every topic HTML file in the repo root (excluding index.html,
// pathway.html, progress.html, latex-cheatsheet.html, and review.html if it
// exists), extract the <head> block and the opening <html>/<body> tags and
// compare against the canonical shape established by category-theory.html.
//
// Checks (all advisory — this script only ever exits 0):
//   1.  KaTeX CSS <link> present (katex.min.css).
//   2.  KaTeX auto-render JS present (auto-render script tag).
//   3.  KaTeX auto-render config script with a `delimiters: [...]` block.
//   4.  <script src=".../js/progress.js"> present.
//   5.  <script src=".../js/quiz.js"> present (required only if the page has
//       any <div class="quiz">).
//   6.  <script src=".../quizzes/bundle.js"> (required only if the page has
//       quizzes).
//   7.  <script src=".../concepts/bundle.js"> (needed for glossary popovers).
//   8.  Breadcrumb injection fence <!-- breadcrumb-head-auto-begin --> present.
//   9.  <meta name="viewport"> present with a content attribute.
//   10. <html lang="en"> attribute.
//   11. data-section and data-level attributes on <body> (injected by
//       scripts/inject-page-metadata.mjs).
//
// Output: a list of pages with gaps and the specific checks they fail, then a
// summary line. Exit 0 regardless.
//
// Zero dependencies: regex + string checks only.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

// Pages that are not topic pages — skip them.
//
// Topic pages follow a strict head/body contract (KaTeX delimiter config,
// concepts/bundle.js, breadcrumb fence, data-section/data-level on <body>,
// progress.js for quizzes). Non-topic pages legitimately deviate: meta
// pages (index, pathway, mindmap, search, widgets, progress) don't have
// per-topic breadcrumb context and don't need concept-graph data; capstone
// story pages are stand-alone narratives that load their own KaTeX
// (in-body) and skip the bundle/breadcrumb scaffolding by design.
const SPECIAL = new Set([
  'index.html',
  'pathway.html',
  'progress.html',
  'latex-cheatsheet.html',
  'review.html',
  'mindmap.html',
  'search.html',
  'tags.html',
  'widgets.html',
  'capstone-bsd-story.html',
  'capstone-flt-story.html',
  'capstone-satotate-story.html',
]);

// ---- Helpers ----------------------------------------------------------------

function headBlock(html) {
  const m = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
  return m ? m[1] : '';
}

function htmlTag(html) {
  const m = html.match(/<html\b[^>]*>/i);
  return m ? m[0] : '';
}

function bodyTag(html) {
  const m = html.match(/<body\b[^>]*>/i);
  return m ? m[0] : '';
}

function hasKatexCss(head) {
  return /<link[^>]+href="[^"]*katex(?:[^"]*)?\.min\.css"/i.test(head);
}

function hasKatexAutoRenderJs(head) {
  // auto-render script (not just katex.min.js).
  return /<script[^>]+src="[^"]*katex[^"]*auto-render[^"]*\.js"/i.test(head);
}

function hasKatexDelimitersConfig(head) {
  // Either (a) a <script> block referencing renderMathInElement with a
  // delimiters array, or (b) an onload="renderMathInElement(..., delimiters:
  // [...])" inlined on the auto-render script tag.
  const scripts = head.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || [];
  for (const s of scripts) {
    if (/renderMathInElement/.test(s) && /delimiters\s*:\s*\[/.test(s)) return true;
  }
  return false;
}

function hasProgressJs(head) {
  return /<script[^>]+src="\.?\/?js\/progress\.js"/i.test(head);
}

function hasQuizJs(head) {
  return /<script[^>]+src="\.?\/?js\/quiz\.js"/i.test(head);
}

function hasQuizBundle(head) {
  return /<script[^>]+src="\.?\/?quizzes\/bundle\.js"/i.test(head);
}

function hasConceptsBundle(head) {
  return /<script[^>]+src="\.?\/?concepts\/bundle\.js"/i.test(head);
}

function hasBreadcrumbFence(head) {
  return /<!--\s*breadcrumb-head-auto-begin\s*-->/i.test(head);
}

function hasViewportMeta(head) {
  return /<meta[^>]+name=["']viewport["'][^>]*\bcontent=["'][^"']+["']/i.test(head);
}

function hasHtmlLangEn(tag) {
  return /\blang=["']en["']/i.test(tag);
}

function hasDataSection(tag) {
  return /\bdata-section=["'][^"']+["']/i.test(tag);
}

function hasDataLevel(tag) {
  return /\bdata-level=["'][^"']+["']/i.test(tag);
}

function hasQuizPlaceholders(html) {
  return /<[^>]*class="[^"]*\bquiz\b[^"]*"[^>]*\bdata-concept="/i.test(html);
}

// ---- Gather pages -----------------------------------------------------------

const htmlFiles = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html') && !SPECIAL.has(f))
  .sort();

// ---- Run checks -------------------------------------------------------------

const perPage = []; // { file, gaps: [string...] }

for (const file of htmlFiles) {
  const abs = join(repoRoot, file);
  let html;
  try { html = readFileSync(abs, 'utf8'); }
  catch { continue; }

  const head = headBlock(html);
  const htmlOpen = htmlTag(html);
  const bodyOpen = bodyTag(html);
  const hasQuizzes = hasQuizPlaceholders(html);

  const gaps = [];

  if (!hasKatexCss(head))            gaps.push('missing KaTeX CSS link (katex.min.css)');
  if (!hasKatexAutoRenderJs(head))   gaps.push('missing KaTeX auto-render script');
  if (!hasKatexDelimitersConfig(head)) gaps.push('missing KaTeX auto-render config with delimiters: [...]');
  if (!hasProgressJs(head))          gaps.push('missing js/progress.js script tag');
  if (hasQuizzes) {
    if (!hasQuizJs(head))            gaps.push('missing js/quiz.js script tag (page has quizzes)');
    if (!hasQuizBundle(head))        gaps.push('missing quizzes/bundle.js script tag (page has quizzes)');
  }
  if (!hasConceptsBundle(head))      gaps.push('missing concepts/bundle.js script tag');
  if (!hasBreadcrumbFence(head))     gaps.push('missing breadcrumb-head-auto-begin fence');
  if (!hasViewportMeta(head))        gaps.push('missing <meta name="viewport">');
  if (!hasHtmlLangEn(htmlOpen))      gaps.push('missing <html lang="en">');
  if (!hasDataSection(bodyOpen))     gaps.push('missing data-section on <body>');
  if (!hasDataLevel(bodyOpen))       gaps.push('missing data-level on <body>');

  perPage.push({ file, gaps });
}

// ---- Report -----------------------------------------------------------------

const pagesWithGaps = perPage.filter((p) => p.gaps.length > 0);
const total = perPage.length;

console.log(`audit-cross-page-consistency: ${pagesWithGaps.length} page(s) with gaps\n`);

if (pagesWithGaps.length === 0) {
  console.log(`all ${total} pages match the canonical shape.`);
  process.exit(0);
}

for (const { file, gaps } of pagesWithGaps) {
  console.log(`${file}:`);
  for (const g of gaps) console.log(`  ✗ ${g}`);
}

console.log(`\nSummary: ${pagesWithGaps.length}/${total} pages have ≥ 1 gap`);

process.exit(0);
