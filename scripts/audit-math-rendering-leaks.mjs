#!/usr/bin/env node
// Audit math-rendering hazards that the structural validators (validate-katex,
// audit-concept-latex) do NOT catch. Three classes, in descending severity:
//
//   CLASS A — HTML tag-open inside math (CONTENT LOSS, reader-visible).
//     A raw `<` followed by a letter, `/`, or `!` inside a `$…$` / `$$…$$` /
//     `\(…\)` / `\[…\]` span. When that text is HTML-parsed, the tokenizer reads
//     `<x` as a start-tag and swallows everything up to the next `>` as bogus
//     attributes — deleting prose, not merely leaking a literal `$`. Seen in
//     prose (`$i<n$` truncated a theorem statement), quiz `explain`, etc.
//     Safe: `<` + digit / space / `\` (not a tag-open), and a bare `>` (literal
//     in text). Fix: `\lt` / `\gt` (universal, dual-path safe) or `&lt;`/`&gt;`
//     in single-parse static prose.
//
//   CLASS B — renderMathInElement() that can't see single-`$` (silent no-op).
//     KaTeX auto-render defaults to `$$`, `\(`, `\[` only — NOT single `$`. A
//     `renderMathInElement(el, …)` call whose options omit a `left:'$'`
//     delimiter silently leaves `$…$` in that element un-rendered. Advisory:
//     many such calls only ever receive `\(…\)` or static content, so this is a
//     review list, not a hard error.
//
//   CLASS C — LaTeX inside an SVG <text> node (can't render at all).
//     KaTeX cannot typeset inside SVG <text>; a `$…$` or `\command` there shows
//     as raw source. Advisory.
//
// Scope: registered topics only (concepts/index.json order). Class A also
// covers quiz banks (q / explain / choices / hint, plus hard & expert tiers)
// and concept title/blurb. Exits 0 (advisory) unless `--strict`, which exits 1
// if any CLASS A hit exists (the only reader-visible-bug class). `--write`
// dumps audits/math-rendering-leaks.md.
//
// Zero runtime deps beyond the shared content model + span extractor.

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContentModel } from './lib/content-model.mjs';
import { extractSpans } from './lib/math-spans.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');
const WRITE = process.argv.includes('--write');

// `<` immediately followed by a letter, `/`, or `!` is an HTML tag-open /
// end-tag / markup-declaration. `<` + digit / space / `\` is harmless.
const TAG_OPEN = /<[a-zA-Z/!]/;
// A backslash command, used to spot LaTeX leaking into SVG <text>.
const TEX_CMD = /\\[a-zA-Z]/;

const classA = []; // { file, where, span, ch }
const classB = []; // { file, snippet }
const classC = []; // { file, text }

// ── CLASS A helpers ─────────────────────────────────────────────────────────

// For small, ISOLATED strings (one quiz/concept field) the precise extractor is
// safe — a single field rarely carries a stray odd `$` to desync the pairing.
function tagOpenHits(str) {
  const { spans } = extractSpans(str);
  const hits = [];
  for (const sp of spans) {
    const m = sp.body.match(TAG_OPEN);
    if (m) hits.push({ span: sp.open + sp.body + sp.close, ch: m[0] });
  }
  return hits;
}

// For the large concatenated prose blob (a whole topic .html) extractSpans is
// the WRONG tool: one stray `$` (a literal "$5", a `$` the script-strip missed)
// flips parity and pairs `$`s across blocks, swallowing real `</p>`/`<div>`
// markup into a bogus "span". Bounded, newline-aware regexes can't do that — a
// `$…$` body excludes `$` and `\n`, so a match stays inside one inline span.
const PROSE_DELIMS = [
  /(?<!\$)\$([^$\n]{1,300})\$(?!\$)/g, // $…$ inline (single-line, not $$)
  /\$\$([\s\S]{1,500}?)\$\$/g,         // $$…$$ display
  /\\\(([\s\S]{1,300}?)\\\)/g,         // \(…\) inline
  /\\\[([\s\S]{1,400}?)\\\]/g,         // \[…\] display
];

function scanProseString(str, file, where) {
  for (const re of PROSE_DELIMS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(str))) {
      const mm = m[1].match(TAG_OPEN);
      if (mm) {
        const span = m[0].length > 90 ? m[0].slice(0, 88) + '…' : m[0];
        classA.push({ file, where, span: span.replace(/\s+/g, ' '), ch: mm[0] });
      }
    }
  }
}

// Recursively visit every string in a quiz/concept JSON value, tracking a dotted
// path so a hit points at the exact field.
function walkJsonStrings(node, path, visit) {
  if (typeof node === 'string') { visit(node, path); return; }
  if (Array.isArray(node)) {
    node.forEach((v, i) => walkJsonStrings(v, `${path}[${i}]`, visit));
    return;
  }
  if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      walkJsonStrings(v, path ? `${path}.${k}` : k, visit);
    }
  }
}

// ── CLASS B helper ──────────────────────────────────────────────────────────

function scanScriptForBareRenderCalls(scriptText, file) {
  // Find each renderMathInElement( … ) call and inspect the options object that
  // follows the target argument for a single-`$` delimiter. Crude but effective:
  // grab the ~220 chars after the call site and check for `left:'$'` (or
  // `left:"$"`) without an adjacent second `$` (i.e. a single-`$` pairing).
  const re = /renderMathInElement\s*\(/g;
  let m;
  while ((m = re.exec(scriptText))) {
    const tail = scriptText.slice(m.index, m.index + 240);
    // Has it any delimiters config at all?
    const hasDelimKey = /delimiters\s*:/.test(tail);
    // A single-`$` left delimiter: left:'$' not immediately followed by another $.
    const hasSingleDollar = /left\s*:\s*(['"])\$\1/.test(tail);
    if (!hasDelimKey || !hasSingleDollar) {
      const snippet = tail.replace(/\s+/g, ' ').slice(0, 120);
      classB.push({ file, snippet });
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

const model = await loadContentModel();

for (const topicId of model.topicIds) {
  const topic = model.topics.get(topicId);

  // CLASS A + B + C from the rendered topic HTML.
  const htmlPath = join(repoRoot, `${topicId}.html`);
  if (existsSync(htmlPath)) {
    const html = readFileSync(htmlPath, 'utf8');
    // Strip <script>/<style> bodies: inside them the HTML tokenizer is in
    // script/style-data state, so `<` is NOT a tag-open — scanning their JS
    // (full of `i<n` loops, `$`-helpers) would be all false positives.
    const prose = html
      .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style\b[\s\S]*?<\/style>/gi, ' ');
    scanProseString(prose, `${topicId}.html`, 'prose');

    // CLASS B: scan the (un-stripped) <script> bodies for bare render calls.
    let sm;
    const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    while ((sm = scriptRe.exec(html))) {
      scanScriptForBareRenderCalls(sm[1], `${topicId}.html`);
    }
  }

  // CLASS C: SVG <text> nodes carrying LaTeX (parsed DOM).
  if (topic && topic.html) {
    for (const t of topic.html.querySelectorAll('text')) {
      const txt = t.textContent || '';
      if (txt.includes('$') || TEX_CMD.test(txt)) {
        classC.push({ file: `${topicId}.html`, text: txt.trim().slice(0, 80) });
      }
    }
  }

  // CLASS A from the quiz bank (rendered via innerHTML / textContent).
  const bank = model.quizBanks.get(topicId);
  if (bank) {
    walkJsonStrings(bank, '', (str, path) => {
      for (const h of tagOpenHits(str)) {
        classA.push({ file: `quizzes/${topicId}.json`, where: path, span: h.span, ch: h.ch });
      }
    });
  }
}

// CLASS A from concept graph (title/blurb -> SVG labels, hover cards, dropdowns).
for (const c of model.concepts.values()) {
  for (const [field, str] of [['title', c.title], ['blurb', c.blurb]]) {
    if (!str) continue;
    for (const h of tagOpenHits(str)) {
      classA.push({ file: `concepts/${c.topic}.json`, where: `${c.id}.${field}`, span: h.span, ch: h.ch });
    }
  }
}
for (const cap of model.capstones) {
  for (const [field, str] of [['title', cap.title], ['blurb', cap.blurb]]) {
    if (!str) continue;
    for (const h of tagOpenHits(str)) {
      classA.push({ file: 'concepts/capstones.json', where: `${cap.id || cap.topic}.${field}`, span: h.span, ch: h.ch });
    }
  }
}

// ── Report ────────────────────────────────────────────────────────────────

const lines = [];
const log = (s = '') => lines.push(s);

log('# Math-rendering leak audit');
log('');
log(`CLASS A (HTML tag-open in math — content loss): ${classA.length}`);
log(`CLASS B (renderMathInElement missing single-$): ${classB.length}`);
log(`CLASS C (LaTeX in SVG <text>): ${classC.length}`);
log('');

if (classA.length) {
  log('## CLASS A — HTML tag-open inside math  (READER-VISIBLE BUG)');
  log('A raw `<letter` inside a math span is parsed as a start-tag and swallows');
  log('following prose. Fix with `\\lt`/`\\gt` (quiz banks, dual-path) or');
  log('`&lt;`/`&gt;` (single-parse static prose).');
  log('');
  for (const h of classA.sort((a, b) => (a.file + a.where).localeCompare(b.file + b.where))) {
    log(`  ${h.file}  ${h.where}  «${h.ch}»  ${h.span}`);
  }
  log('');
}

if (classB.length) {
  log('## CLASS B — renderMathInElement() without a single-$ delimiter  (advisory)');
  log('Silent no-op on `$…$`. Many are benign (only ever fed `\\(…\\)` or static');
  log('content). Review each; add a `{left:\'$\',right:\'$\'}` delimiter if it ever');
  log('receives `$…$` dynamic text.');
  log('');
  for (const h of classB.sort((a, b) => a.file.localeCompare(b.file))) {
    log(`  ${h.file}  …${h.snippet}`);
  }
  log('');
}

if (classC.length) {
  log('## CLASS C — LaTeX inside SVG <text>  (advisory)');
  log('KaTeX cannot render inside SVG <text>; convert to Unicode or move to an');
  log('HTML overlay / <foreignObject>.');
  log('');
  for (const h of classC.sort((a, b) => a.file.localeCompare(b.file))) {
    log(`  ${h.file}  "${h.text}"`);
  }
  log('');
}

const report = lines.join('\n');
console.log(report);

if (WRITE) {
  const out = join(repoRoot, 'audits', 'math-rendering-leaks.md');
  writeFileSync(out, report + '\n');
  console.log(`\nwrote ${out}`);
}

if (STRICT && classA.length) {
  console.error(`\naudit-math-rendering-leaks: ${classA.length} CLASS A (content-loss) hit(s) — failing under --strict.`);
  process.exit(1);
}
process.exit(0);
