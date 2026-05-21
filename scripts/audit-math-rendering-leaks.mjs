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
// Scope:
//   - CLASS A prose + CLASS B inline-script scans run over EVERY top-level
//     `*.html` (topics AND index/pathway/updates/capstone-story pages) — the
//     tokenizer eats `<x` in math identically regardless of page role, and the
//     non-topic pages are the most prose-heavy with the least other validation.
//   - CLASS B also scans the shared runtime under `js/*.js` (`js/quiz.js`,
//     `js/widget-*.js`, …): a missing single-`$` delimiter there silently
//     no-ops `$…$` across every page that loads the file.
//   - CLASS A also covers quiz banks (q / explain / choices / hint, plus hard &
//     expert tiers) and concept/capstone title+blurb.
//   - CLASS C (SVG <text>) stays topic-scoped — that's where widgets live.
// Exits 0 (advisory) unless `--strict`, which exits 1 if any CLASS A hit exists
// (the only reader-visible-bug class). `--write` dumps
// audits/math-rendering-leaks.md. `--fix` rewrites every CLASS A hazard at its
// source — `&lt;` in content/<topic>.json prose (single HTML parse), `\lt ` in
// quiz/concept JSON (KaTeX source, dual-path safe) — then exits; re-run after
// `rebuild.mjs` to confirm CLASS A is clear.
//
// Zero runtime deps beyond the shared content model + span extractor.

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContentModel } from './lib/content-model.mjs';
import { extractSpans } from './lib/math-spans.mjs';
import { loadTopicContent, saveTopicContent } from './lib/json-block-writer.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STRICT = process.argv.includes('--strict');
const WRITE = process.argv.includes('--write');
// `--fix` rewrites each CLASS A hazard at its source (content/quiz/concept JSON)
// instead of reporting it — see the "── --fix" section below.
const FIX = process.argv.includes('--fix');

// `<` immediately followed by a letter, `/`, or `!` is an HTML tag-open /
// end-tag / markup-declaration. `<` + digit / space / `\` is harmless.
const TAG_OPEN = /<[a-zA-Z/!]/;
// A backslash command, used to spot LaTeX leaking into SVG <text>.
const TEX_CMD = /\\[a-zA-Z]/;

const classA = []; // { file, where, span, ch }
const classB = []; // { file, snippet }
const classC = []; // { file, text }
const desync = []; // { file, where, err } — unbalanced delimiters: Class A scan may be incomplete here

// ── CLASS A helpers ─────────────────────────────────────────────────────────

// For small, ISOLATED strings (one quiz/concept field) the precise extractor is
// usually safe — a single field rarely carries a stray odd `$`. But when it
// DOES (an unclosed `$`, a literal "$5" mid-sentence), `extractSpans` mis-pairs
// or aborts and a real `<x` hazard can slip through un-scanned. We surface that
// (via the returned `errors`) as an advisory rather than silently dropping it,
// so the field gets a human eyeball.
function tagOpenHits(str) {
  const { spans, errors } = extractSpans(str);
  const hits = [];
  for (const sp of spans) {
    const m = sp.body.match(TAG_OPEN);
    if (m) hits.push({ span: sp.open + sp.body + sp.close, ch: m[0] });
  }
  return { hits, errors };
}

// For the large concatenated prose blob (a whole topic .html) extractSpans is
// the WRONG tool: one stray `$` (a literal "$5", a `$` the script-strip missed)
// flips parity and pairs `$`s across blocks, swallowing real `</p>`/`<div>`
// markup into a bogus "span". Bounded, newline-aware regexes can't do that — a
// `$…$` body excludes `$` and `\n`, so a match stays inside one inline span.
// Two more guards keep the DISPLAY regexes (which must allow `$`/`\n` in the
// body) honest:
//   - `(?<!\\)` on each opener rejects an ESCAPED delimiter — `$\$$` (inline
//     math showing a literal `$`) otherwise reads as a spurious `$$` opener and
//     captures the following prose (incl. real `<strong>` tags) as a bogus
//     display block. The single-char lookbehind covers the corpus's `\$`/`\(`
//     usage; a doubled `\\$$` (literal backslash then display) is nonexistent.
//   - The caps only stop a stray/unclosed delimiter from running away; at 4000
//     they sit well above the longest real block, so a genuinely long block
//     with a tag-open is NOT dropped as a false negative once `--strict` gates.
// Each entry pairs a span matcher with a `wrap(body)` that rebuilds the span
// from its delimiters — the matcher's capture group 1 is the body, so the
// `--fix` pass can rewrite a body and re-emit the exact delimiters.
const DELIMS = [
  { re: /(?<!\$)\$([^$\n]{1,600})\$(?!\$)/g, wrap: (b) => `$${b}$` },   // $…$ inline (single-line, not $$)
  { re: /(?<!\\)\$\$([\s\S]{1,4000}?)\$\$/g, wrap: (b) => `$$${b}$$` }, // $$…$$ display (opener not an escaped \$)
  { re: /(?<!\\)\\\(([\s\S]{1,600}?)\\\)/g, wrap: (b) => `\\(${b}\\)` }, // \(…\) inline
  { re: /(?<!\\)\\\[([\s\S]{1,4000}?)\\\]/g, wrap: (b) => `\\[${b}\\]` }, // \[…\] display
];
const PROSE_DELIMS = DELIMS.map((d) => d.re);

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
    // Skip mentions inside a `//` line comment (doc prose describing the call,
    // not a call site — e.g. "via renderMathInElement (if …)"). Cheap: is there
    // a `//` between this line's start and the match? (A `//` inside a same-line
    // string literal ahead of a real call is vanishingly rare and would only
    // cost an advisory miss, never a false reader-visible bug.)
    const lineStart = scriptText.lastIndexOf('\n', m.index) + 1;
    if (scriptText.lastIndexOf('//', m.index) >= lineStart) continue;
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

// ── --fix transform ───────────────────────────────────────────────────────
// Rewrite the CLASS A hazard — `<` followed by a letter / `/` / `!` — INSIDE a
// math-span body to a safe token, leaving `<`+digit/space/`\`, every `>`, and
// everything OUTSIDE the span (real <p>/<div> tags, JS) untouched. We re-emit
// each span via the matcher's `wrap`, so a span without a hazard is returned
// byte-for-byte. The token differs by surface:
//   - HTML prose (one HTML parse): `&lt;` — the browser decodes it back to `<`
//     before KaTeX runs; matches the existing static-prose corpus convention.
//   - KaTeX-source JSON fields (quiz `explain` is dual-path innerHTML + a
//     textContent-derived hint; concept blurb feeds SVG labels / hover cards /
//     dropdowns): `\lt ` — universal, survives the textContent path where
//     `&lt;` would render literally or KaTeX-error.
function fixSpans(str, token) {
  if (typeof str !== 'string' || !str.includes('<')) return { out: str, n: 0 };
  let n = 0;
  let out = str;
  for (const d of DELIMS) {
    out = out.replace(new RegExp(d.re.source, d.re.flags), (full, body) => {
      let changed = false;
      const fixed = body.replace(/<([a-zA-Z/!])/g, (_m, c) => { changed = true; n++; return token + c; });
      return changed ? d.wrap(fixed) : full;
    });
  }
  return { out, n };
}

// CLASS A fix for raw HTML strings (content/<topic>.json rawHead / rawBody* /
// raw blocks): apply `fixSpans` ONLY outside <script>/<style> regions. Those
// bodies are script/style-data to the tokenizer — the SCAN strips them for the
// same reason — and hold JS (`1<<n` bit-shifts, `` `${…}` `` template literals
// with embedded `<strong>…</strong>`) that `fixSpans` would otherwise mangle.
function fixProse(str) {
  if (typeof str !== 'string') return { out: str, n: 0 };
  let n = 0;
  const parts = [];
  const re = /<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi;
  let last = 0;
  let m;
  while ((m = re.exec(str))) {
    const r = fixSpans(str.slice(last, m.index), '&lt;');
    parts.push(r.out, m[0]); // fixed prose, then the script/style block verbatim
    n += r.n;
    last = m.index + m[0].length;
  }
  const tail = fixSpans(str.slice(last), '&lt;');
  parts.push(tail.out);
  n += tail.n;
  return { out: parts.join(''), n };
}

// Apply `fixSpans` to every string in a quiz/concept JSON file, patching the
// raw file text token-for-token rather than re-serializing. Re-serializing via
// JSON.stringify would canonicalize layout and reformat any hand-authored
// inline array (`"answer": [0,1,3]` → one element per line) — a noisy,
// layout-only diff. Instead we collect each (original → fixed) string the
// span-fixer changes and replace its exact JSON-encoded token in the text, so
// only the changed string literals move and the file's formatting is preserved.
// `fixSpans` only touches `<letter` inside a math span, and `$` appears only
// inside JSON string values (never in JSON syntax), so this is safe for the
// KaTeX-source banks (no embedded JS / HTML tags to mis-handle).
function fixJsonFile(path, token) {
  if (!existsSync(path)) return 0;
  let text;
  let obj;
  try {
    text = readFileSync(path, 'utf8');
    obj = JSON.parse(text);
  } catch {
    return 0; // missing or malformed — leave it for the validators to flag
  }
  const pairs = new Map(); // original string -> fixed string (deduped)
  let n = 0;
  (function walk(node) {
    if (typeof node === 'string') {
      if (pairs.has(node)) return;
      const r = fixSpans(node, token);
      if (r.n > 0) { pairs.set(node, r.out); n += r.n; }
      return;
    }
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (node && typeof node === 'object') { Object.values(node).forEach(walk); }
  })(obj);
  if (pairs.size === 0) return 0;
  for (const [orig, fixed] of pairs) {
    // JSON.stringify gives each string's exact on-disk token (quotes + the same
    // backslash/quote escaping the file uses), so the replace is layout-neutral.
    text = text.split(JSON.stringify(orig)).join(JSON.stringify(fixed));
  }
  writeFileSync(path, text);
  return n;
}

// NOTE on scope: --fix deliberately does NOT touch widget `params` in
// content/<topic>.json. The same param key (`bodyMarkup`, `hint`, …) holds raw
// JS in some widgets and HTML markup in others, and several keys are pure JS
// (`bodyScript`, `scriptBodyLiteral`, `controlsLiteral`, `templateLiteral`, …),
// so no key-name rule can tell prose from code — auto-rewriting would corrupt
// `1<<n` shifts and `${…}` literals. A hazard that survives in widget markup
// stays a (small, hand-fixable) CLASS A hit; the --strict gate is what flags it.
async function runFix(model) {
  let fixes = 0;
  const report = [];
  // CLASS A in topic prose → content/<topic>.json raw strings (`&lt;`).
  for (const topicId of model.topicIds) {
    let doc;
    try { doc = loadTopicContent(topicId, repoRoot); } catch { continue; }
    let n = 0;
    for (const key of ['rawHead', 'rawBodyPrefix', 'rawBodySuffix']) {
      const r = fixProse(doc[key]);
      doc[key] = r.out; n += r.n;
    }
    for (const s of doc.sections || []) {
      for (const b of s.blocks || []) {
        if (b.type === 'raw' && typeof b.html === 'string') {
          const r = fixProse(b.html); b.html = r.out; n += r.n;
        }
      }
    }
    if (n > 0 && saveTopicContent(topicId, doc, repoRoot)) { fixes += n; report.push(`  content/${topicId}.json  +${n}`); }
  }
  // CLASS A in quiz banks + concept graph → `\lt ` (KaTeX-source, dual-path safe).
  for (const topicId of model.topicIds) {
    for (const rel of [`quizzes/${topicId}.json`, `concepts/${topicId}.json`]) {
      const n = fixJsonFile(join(repoRoot, rel), '\\lt ');
      if (n > 0) { fixes += n; report.push(`  ${rel}  +${n}`); }
    }
  }
  const capN = fixJsonFile(join(repoRoot, 'concepts', 'capstones.json'), '\\lt ');
  if (capN > 0) { fixes += capN; report.push(`  concepts/capstones.json  +${capN}`); }

  console.log(`audit-math-rendering-leaks --fix: rewrote ${fixes} CLASS A hazard(s)`);
  if (report.length) console.log(report.sort().join('\n'));
  console.log('\nNext: `node scripts/rebuild.mjs` (regenerate HTML + bundles), then re-run the audit (no flag) to confirm CLASS A is clear.');
}

// ── Main ─────────────────────────────────────────────────────────────────────

const model = await loadContentModel();

if (FIX) {
  await runFix(model);
  process.exit(0);
}

// CLASS A prose + CLASS B inline-script scans over EVERY top-level `*.html`
// (topics AND index/pathway/updates/capstone-story pages). The tokenizer eats
// `<x` in math identically regardless of page role; the non-topic pages are
// prose-heavy and otherwise lightly validated.
for (const file of readdirSync(repoRoot).filter((f) => f.endsWith('.html')).sort()) {
  const html = readFileSync(join(repoRoot, file), 'utf8');
  // Strip <script>/<style> bodies before the prose scan: inside them the HTML
  // tokenizer is in script/style-data state, so `<` is NOT a tag-open —
  // scanning their JS (full of `i<n` loops, `$`-helpers) would be all FPs.
  const prose = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ');
  scanProseString(prose, file, 'prose');

  // CLASS B: scan the (un-stripped) inline <script> bodies for bare render calls.
  let sm;
  const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  while ((sm = scriptRe.exec(html))) {
    scanScriptForBareRenderCalls(sm[1], file);
  }
}

// CLASS B from the shared runtime under js/. A `renderMathInElement(...)` call
// here whose options omit a single-`$` delimiter silently no-ops `$…$` on every
// page that loads the file — `js/quiz.js` alone is on every topic + capstone.
const jsDir = join(repoRoot, 'js');
if (existsSync(jsDir)) {
  for (const f of readdirSync(jsDir).filter((n) => n.endsWith('.js')).sort()) {
    scanScriptForBareRenderCalls(readFileSync(join(jsDir, f), 'utf8'), `js/${f}`);
  }
}

// CLASS C (SVG <text>) + CLASS A (quiz banks) stay topic-scoped — that's where
// widgets and quizzes live.
for (const topicId of model.topicIds) {
  const topic = model.topics.get(topicId);

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
      const { hits, errors } = tagOpenHits(str);
      for (const h of hits) {
        classA.push({ file: `quizzes/${topicId}.json`, where: path, span: h.span, ch: h.ch });
      }
      if (errors.length) desync.push({ file: `quizzes/${topicId}.json`, where: path, err: errors[0] });
    });
  }
}

// CLASS A from concept graph (title/blurb -> SVG labels, hover cards, dropdowns).
for (const c of model.concepts.values()) {
  for (const [field, str] of [['title', c.title], ['blurb', c.blurb]]) {
    if (!str) continue;
    const { hits, errors } = tagOpenHits(str);
    for (const h of hits) {
      classA.push({ file: `concepts/${c.topic}.json`, where: `${c.id}.${field}`, span: h.span, ch: h.ch });
    }
    if (errors.length) desync.push({ file: `concepts/${c.topic}.json`, where: `${c.id}.${field}`, err: errors[0] });
  }
}
for (const cap of model.capstones) {
  for (const [field, str] of [['title', cap.title], ['blurb', cap.blurb]]) {
    if (!str) continue;
    const { hits, errors } = tagOpenHits(str);
    for (const h of hits) {
      classA.push({ file: 'concepts/capstones.json', where: `${cap.id}.${field}`, span: h.span, ch: h.ch });
    }
    if (errors.length) desync.push({ file: 'concepts/capstones.json', where: `${cap.id}.${field}`, err: errors[0] });
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
if (desync.length) log(`⚠ Unbalanced delimiters (Class A scan may be incomplete): ${desync.length}`);
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

if (desync.length) {
  log('## ⚠ Unbalanced delimiters — Class A scan may be incomplete  (advisory)');
  log('A field with an odd / unclosed `$` (or a literal "$5" mid-sentence)');
  log('desyncs the precise span extractor, so a real `<x` tag-open hazard could');
  log('slip past un-scanned. Eyeball each and balance the delimiters.');
  log('');
  for (const h of desync.sort((a, b) => (a.file + a.where).localeCompare(b.file + b.where))) {
    log(`  ${h.file}  ${h.where}  (${h.err})`);
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
