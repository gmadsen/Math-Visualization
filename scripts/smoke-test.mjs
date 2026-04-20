#!/usr/bin/env node
// Smoke test for topic HTML pages.
//
// For every .html in repo root (minus index/pathway), checks:
//   - <title> present and non-empty
//   - "← Notebook" backlink to ./index.html
//   - KaTeX CSS + auto-render JS included
//   - js/progress.js included (mastery store)
//   - If the page has <div class="quiz" data-concept="..."> placeholders:
//       * js/quiz.js included
//       * quizzes/bundle.js included
//       * MVQuiz.init('<topic>') called
//       * quizzes/<topic>.json bank exists on disk
//       * every placeholder's data-concept resolves to a key in the bank
//   - Widget count (<svg> or class="widget") > 0 on content pages
//   - Quiz bank exists but page has no placeholders → warning (orphan bank)
//
// Exit 0 if clean, 1 if any error. Warnings never flip the exit code.
//
// Zero dependencies: parses with regex + string checks, runs from stock node.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

// Pages we don't smoke-test the same way (index is the landing grid, pathway is the DAG).
const SPECIAL = new Set(['index.html', 'pathway.html']);

const errors = []; // [{ page, msg }]
const warnings = [];
const perPage = new Map(); // page -> { checks: [{ok,msg}], widgets }

const push = (arr, page, msg) => arr.push({ page, msg });

function read(path) {
  try { return readFileSync(path, 'utf8'); }
  catch (e) { return null; }
}

function hasKatexCss(html) {
  return /<link[^>]+href="[^"]*katex[^"]*\.css"/i.test(html);
}
function hasKatexJs(html) {
  return /<script[^>]+src="[^"]*katex[^"]*\.js"/i.test(html)
      && /auto-render/i.test(html);
}
function hasProgressJs(html) {
  return /<script[^>]+src="\.?\/?js\/progress\.js"/i.test(html);
}
function hasQuizJs(html) {
  return /<script[^>]+src="\.?\/?js\/quiz\.js"/i.test(html);
}
function hasQuizBundle(html) {
  return /<script[^>]+src="\.?\/?quizzes\/bundle\.js"/i.test(html);
}
function mvQuizInitTopic(html) {
  const m = html.match(/MVQuiz\.init\(\s*['"]([a-zA-Z0-9_\-]+)['"]\s*\)/);
  return m ? m[1] : null;
}
function hasNotebookBacklink(html) {
  return /←\s*Notebook/.test(html) || /← Index/.test(html);
}
function titleText(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : '';
}
function quizPlaceholders(html) {
  // <div class="quiz" data-concept="xxx"> — also allow additional classes/attrs around it
  const re = /<[^>]*class="[^"]*\bquiz\b[^"]*"[^>]*\bdata-concept="([^"]+)"/g;
  const ids = [];
  let m;
  while ((m = re.exec(html))) ids.push(m[1]);
  return ids;
}
function countWidgets(html) {
  // rough proxy: count <svg opening tags + class="widget" occurrences (diagrams + widget frames)
  const svgs = (html.match(/<svg\b/g) || []).length;
  const widgets = (html.match(/class="[^"]*\bwidget\b[^"]*"/g) || []).length;
  return { svgs, widgets };
}

// Load quiz banks. These live under quizzes/*.json.
const quizzesDir = join(repoRoot, 'quizzes');
const quizBanks = new Map(); // topic -> Set of concept ids
if (existsSync(quizzesDir)) {
  for (const f of readdirSync(quizzesDir)) {
    if (!f.endsWith('.json')) continue;
    const topic = f.replace(/\.json$/, '');
    try {
      const raw = readFileSync(join(quizzesDir, f), 'utf8');
      const d = JSON.parse(raw);
      const ids = new Set(Object.keys(d.quizzes || {}));
      quizBanks.set(topic, ids);
    } catch (e) {
      push(errors, `quizzes/${f}`, `parse error: ${e.message}`);
    }
  }
}

// Load concept graphs. These live under concepts/<topic>.json (excluding
// index.json / capstones.json). Each concept carries an `anchor` field that
// pathway.html turns into a `topic.html#anchor` deep-link; an anchor that
// doesn't correspond to an `id="..."` in the topic HTML is a silent 404.
const conceptsDir = join(repoRoot, 'concepts');
const conceptGraphs = new Map(); // topic -> { page, concepts: [{ id, anchor, prereqs }] }
const conceptOwnerById = new Map(); // concept id -> owning topic (for cross-topic detection)
if (existsSync(conceptsDir)) {
  for (const f of readdirSync(conceptsDir)) {
    if (!f.endsWith('.json')) continue;
    if (f === 'index.json' || f === 'capstones.json') continue;
    const topic = f.replace(/\.json$/, '');
    try {
      const raw = readFileSync(join(conceptsDir, f), 'utf8');
      const d = JSON.parse(raw);
      conceptGraphs.set(topic, {
        page: d.page || `${topic}.html`,
        concepts: (d.concepts || []).map((c) => ({
          id: c.id,
          anchor: c.anchor,
          prereqs: Array.isArray(c.prereqs) ? c.prereqs.slice() : [],
        })),
      });
      for (const c of d.concepts || []) {
        if (c.id && !conceptOwnerById.has(c.id)) conceptOwnerById.set(c.id, topic);
      }
    } catch (e) {
      push(errors, `concepts/${f}`, `parse error: ${e.message}`);
    }
  }
}

// Cross-cutting: any file that renders in-browser or in GitHub's markdown viewer
// can be silently broken by NUL-byte padding. Scan the non-topic files up front.
const allRenderedFiles = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html') || f.endsWith('.md'));
for (const f of allRenderedFiles) {
  const raw = readFileSync(join(repoRoot, f));
  const nuls = raw.reduce((n, b) => (b === 0 ? n + 1 : n), 0);
  if (nuls > 0) push(errors, f, `file contains ${nuls} NUL byte(s) — breaks rendering`);
}

// List .html files in repo root, excluding SPECIAL.
const htmlFiles = readdirSync(repoRoot)
  .filter((f) => f.endsWith('.html') && !SPECIAL.has(f))
  .sort();

if (htmlFiles.length === 0) {
  console.log('smoke-test: no topic HTML files found.');
  process.exit(0);
}

const pagesWithIssues = [];

for (const file of htmlFiles) {
  const topic = file.replace(/\.html$/, '');
  const abs = join(repoRoot, file);
  const html = read(abs);
  if (html === null) {
    push(errors, file, 'unreadable');
    continue;
  }

  const checks = [];
  const fail = (msg) => { push(errors, file, msg); checks.push({ level: 'error', msg }); };
  const warn = (msg) => { push(warnings, file, msg); checks.push({ level: 'warn', msg }); };

  // File completeness — catch truncated writes (e.g. 0xNN bytes padding or cut-mid-line).
  if (!/<\/html>\s*$/i.test(html)) fail('file missing closing </html> — likely truncated');
  if (/\x00/.test(html))           fail('file contains NUL bytes — likely truncated/padded');

  // Title
  const title = titleText(html);
  if (!title) fail('missing <title>');

  // Backlink
  if (!hasNotebookBacklink(html)) fail('missing "← Notebook" backlink');

  // KaTeX
  if (!hasKatexCss(html)) fail('missing KaTeX CSS <link>');
  if (!hasKatexJs(html))  fail('missing KaTeX auto-render <script>');

  // Widgets
  const { svgs, widgets } = countWidgets(html);
  if (svgs === 0 && widgets === 0) warn('no <svg> or .widget elements found');

  // Concept anchors — pathway.html deep-links to `${page}#${anchor}`; a missing
  // id="..." silently breaks that jump.
  const graph = conceptGraphs.get(topic);
  if (graph) {
    for (const c of graph.concepts) {
      if (!c.anchor) {
        fail(`concept '${c.id}' in concepts/${topic}.json has no anchor field`);
        continue;
      }
      const re = new RegExp(`id="${c.anchor.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}"`);
      if (!re.test(html)) {
        fail(`concept '${c.id}' anchor "#${c.anchor}" has no matching id="..." on ${file}`);
      }
    }
  }

  // Quiz wiring
  const placeholders = quizPlaceholders(html);
  const initTopic = mvQuizInitTopic(html);
  const bank = quizBanks.get(topic);

  if (placeholders.length > 0) {
    if (!hasProgressJs(html)) fail('has quiz placeholders but missing js/progress.js include');
    if (!hasQuizJs(html))     fail('has quiz placeholders but missing js/quiz.js include');
    if (!hasQuizBundle(html)) fail('has quiz placeholders but missing quizzes/bundle.js include');
    if (!initTopic)           fail('has quiz placeholders but no MVQuiz.init(...) call');
    if (initTopic && initTopic !== topic) {
      fail(`MVQuiz.init('${initTopic}') does not match topic '${topic}'`);
    }
    if (!bank) {
      fail(`has quiz placeholders but quizzes/${topic}.json is missing`);
    } else {
      for (const id of placeholders) {
        if (!bank.has(id)) fail(`quiz placeholder data-concept="${id}" not in quizzes/${topic}.json`);
      }
    }
  } else {
    if (bank && bank.size > 0) {
      warn(`quizzes/${topic}.json bank exists (${bank.size} quizzes) but page has no .quiz placeholders`);
    }
    if (initTopic) fail(`MVQuiz.init('${initTopic}') present but page has no .quiz placeholders`);
  }

  // Changelog footer guard — every topic page should have exactly one
  // <details class="changelog"> block, seeded/rebuilt by
  // scripts/insert-changelog-footer.mjs.
  const changelogCount = (html.match(/<details\s+class=["']changelog["']/gi) || []).length;
  if (changelogCount === 0) fail('missing <details class="changelog"> footer — run scripts/insert-changelog-footer.mjs');
  if (changelogCount > 1) fail(`found ${changelogCount} <details class="changelog"> footers — expected exactly 1`);

  // Callback guard — pages whose concepts have cross-topic prereqs should
  // carry at least one <aside class="callback"> block. Specific anchor checks
  // are done by scripts/audit-callbacks.mjs; here we just catch a fully-stripped
  // page so the insertion pass can't silently rot.
  if (graph) {
    let hasCrossTopicPrereq = false;
    for (const c of graph.concepts) {
      for (const p of c.prereqs || []) {
        const owner = conceptOwnerById.get(p);
        if (owner && owner !== topic) { hasCrossTopicPrereq = true; break; }
      }
      if (hasCrossTopicPrereq) break;
    }
    if (hasCrossTopicPrereq) {
      const callbackCount = (html.match(/<aside\s+class=["']callback["']/gi) || []).length;
      if (callbackCount === 0) {
        fail('has cross-topic prereqs but no <aside class="callback"> block — run scripts/audit-callbacks.mjs --fix');
      }
    }
  }

  perPage.set(file, { title, checks, svgs, widgets, placeholders: placeholders.length });
  if (checks.some((c) => c.level === 'error')) pagesWithIssues.push(file);
}

// Orphan banks: quiz bank with no matching topic HTML at all.
for (const topic of quizBanks.keys()) {
  const file = `${topic}.html`;
  if (!htmlFiles.includes(file)) {
    push(warnings, `quizzes/${topic}.json`, `quiz bank has no matching ${file}`);
  }
}

// Report.
console.log(`smoke-test: ${htmlFiles.length} page(s), ${quizBanks.size} quiz bank(s)\n`);

// Per-page line.
for (const file of htmlFiles) {
  const info = perPage.get(file);
  if (!info) continue;
  const hasErr = info.checks.some((c) => c.level === 'error');
  const hasWarn = info.checks.some((c) => c.level === 'warn');
  const status = hasErr ? 'FAIL' : hasWarn ? 'WARN' : 'OK  ';
  const widgetTag = `svg=${info.svgs} widgets=${info.widgets}`;
  const quizTag = info.placeholders > 0 ? `quiz=${info.placeholders}` : 'quiz=-';
  console.log(`  ${status}  ${file.padEnd(42)} ${widgetTag.padEnd(22)} ${quizTag}`);
  for (const c of info.checks) {
    const prefix = c.level === 'error' ? '└─' : '└?';
    console.log(`         ${prefix} ${c.msg}`);
  }
}

console.log('');
if (errors.length) {
  console.log(`ERRORS (${errors.length}):`);
  for (const { page, msg } of errors) console.log(`  - ${page}: ${msg}`);
  console.log('');
}
if (warnings.length) {
  console.log(`WARNINGS (${warnings.length}):`);
  for (const { page, msg } of warnings) console.log(`  - ${page}: ${msg}`);
  console.log('');
}

if (errors.length === 0) {
  console.log('OK: all pages pass smoke test.');
  process.exit(0);
} else {
  console.log(`FAIL: ${errors.length} error(s) across ${pagesWithIssues.length} page(s).`);
  process.exit(1);
}
