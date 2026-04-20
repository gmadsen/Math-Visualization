#!/usr/bin/env node
// Structural validator for KaTeX math spans in quiz and concept JSON.
//
// Catches the common authoring mistakes that otherwise surface only at render
// time (silent KaTeX error boxes on the live page):
//
//   - Unbalanced delimiters: orphan `$`, `$$`, `\(…)` without close, `\[…]`
//     without close, or overlapping / interleaved pairs.
//   - Unbalanced braces inside a math span: unequal `{` / `}` counts (after
//     stripping escaped `\{` and `\}`).
//   - Unbalanced environments: every `\begin{foo}` needs a matching
//     `\end{foo}` inside the same span.
//   - Empty spans: `$$`, `\(\)`, `\[\]`, `$$  $$` (usually editor artifacts).
//     Warnings only.
//   - Heuristics for a couple of very common typos (stray `&` outside an
//     aligned env; `\sqrt` with no argument).
//
// This is NOT a KaTeX parser — that would pull in the `katex` npm package
// and break the project's "runs from stock node, zero deps" rule. Instead
// we catch the ~80% of failures that are structural, which is by far the
// noisiest class in practice.
//
// Walks:
//   - quizzes/*.json → every `quiz.questions[i].q`, `.explain`, each string
//     in `.choices` (for mcq). Same for the `hard` sibling array.
//   - concepts/*.json → every `concepts[i].blurb`.
//   - concepts/capstones.json → every `capstone.blurb`.
//
// Output format: `<file>:<path.to.field> → <error description>`, sorted by
// file. Prints a final count. Exit 1 if any errors, 0 clean. Warnings print
// but do not affect exit code.
//
// Zero dependencies: regex + string checks, runs from stock node.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const errors = [];   // [{ file, path, msg }]
const warnings = []; // [{ file, path, msg }]

// ─────────────────────────────────────────────────────────────────────────
// Math span extraction.
//
// KaTeX delimiters in this project (per AGENTS.md § House conventions):
//   $…$    inline
//   $$…$$  display
//   \(…\)  inline
//   \[…\]  display
//
// Strategy: walk the string left-to-right. At each position, try (in order):
//   1. a double-dollar open (`$$`) — greedy so it beats single-dollar
//   2. a single-dollar open (`$`)
//   3. `\(`
//   4. `\[`
// When an opener is found, scan forward for its matching close of the same
// kind. `$`-style closes are the same token reversed; `\(` closes on `\)`,
// `\[` closes on `\]`. A `\` right before the delimiter char escapes it
// (e.g. `\$` is a literal dollar, not a math open/close).
//
// Returns an array of { kind, open, close, body, startIdx, endIdx } and an
// array of structural errors encountered while scanning.

function escapedAt(s, i) {
  // Is the character at s[i] escaped by an odd number of preceding backslashes?
  let n = 0;
  for (let j = i - 1; j >= 0 && s[j] === '\\'; j--) n++;
  return n % 2 === 1;
}

function findDelimClose(s, startInside, opener) {
  // Search for the closing counterpart of `opener`, starting from index
  // `startInside` (just after the opener). Return the index of the close
  // token's first character, or -1 if not found. Honors backslash escaping
  // for the dollar closes.
  if (opener === '$$') {
    for (let i = startInside; i < s.length - 1; i++) {
      if (s[i] === '$' && s[i + 1] === '$' && !escapedAt(s, i)) return i;
    }
    return -1;
  }
  if (opener === '$') {
    for (let i = startInside; i < s.length; i++) {
      // Don't match a `$$` as a single-`$` close.
      if (s[i] === '$' && s[i + 1] !== '$' && !escapedAt(s, i)) return i;
    }
    return -1;
  }
  if (opener === '\\(') {
    for (let i = startInside; i < s.length - 1; i++) {
      if (s[i] === '\\' && s[i + 1] === ')') return i;
    }
    return -1;
  }
  if (opener === '\\[') {
    for (let i = startInside; i < s.length - 1; i++) {
      if (s[i] === '\\' && s[i + 1] === ']') return i;
    }
    return -1;
  }
  return -1;
}

function extractSpans(s) {
  const spans = [];
  const localErrors = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    const next = s[i + 1];

    // Try `$$` first (greedy beats `$`).
    if (c === '$' && next === '$' && !escapedAt(s, i)) {
      const openAt = i;
      const innerStart = i + 2;
      const closeAt = findDelimClose(s, innerStart, '$$');
      if (closeAt === -1) {
        localErrors.push(`unclosed $$…$$ opened at offset ${openAt}`);
        i = s.length;
        break;
      }
      spans.push({
        kind: '$$', open: '$$', close: '$$',
        body: s.slice(innerStart, closeAt),
        startIdx: openAt,
        endIdx: closeAt + 2,
      });
      i = closeAt + 2;
      continue;
    }

    if (c === '$' && !escapedAt(s, i)) {
      const openAt = i;
      const innerStart = i + 1;
      const closeAt = findDelimClose(s, innerStart, '$');
      if (closeAt === -1) {
        localErrors.push(`unclosed $…$ opened at offset ${openAt}`);
        i = s.length;
        break;
      }
      spans.push({
        kind: '$', open: '$', close: '$',
        body: s.slice(innerStart, closeAt),
        startIdx: openAt,
        endIdx: closeAt + 1,
      });
      i = closeAt + 1;
      continue;
    }

    if (c === '\\' && next === '(') {
      const openAt = i;
      const innerStart = i + 2;
      const closeAt = findDelimClose(s, innerStart, '\\(');
      if (closeAt === -1) {
        localErrors.push(`unclosed \\(…\\) opened at offset ${openAt}`);
        i = s.length;
        break;
      }
      spans.push({
        kind: '\\(', open: '\\(', close: '\\)',
        body: s.slice(innerStart, closeAt),
        startIdx: openAt,
        endIdx: closeAt + 2,
      });
      i = closeAt + 2;
      continue;
    }

    if (c === '\\' && next === '[') {
      const openAt = i;
      const innerStart = i + 2;
      const closeAt = findDelimClose(s, innerStart, '\\[');
      if (closeAt === -1) {
        localErrors.push(`unclosed \\[…\\] opened at offset ${openAt}`);
        i = s.length;
        break;
      }
      spans.push({
        kind: '\\[', open: '\\[', close: '\\]',
        body: s.slice(innerStart, closeAt),
        startIdx: openAt,
        endIdx: closeAt + 2,
      });
      i = closeAt + 2;
      continue;
    }

    // Stray `\)` or `\]` outside any open span is an orphan close.
    if (c === '\\' && (next === ')' || next === ']')) {
      localErrors.push(`orphan \\${next} close at offset ${i}`);
      i += 2;
      continue;
    }

    i++;
  }
  return { spans, errors: localErrors };
}

// ─────────────────────────────────────────────────────────────────────────
// Per-span structural checks.

function checkBraces(body) {
  // Count `{` and `}` but ignore escaped `\{` and `\}`.
  let open = 0, close = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === '{' && !escapedAt(body, i)) open++;
    else if (c === '}' && !escapedAt(body, i)) close++;
  }
  if (open !== close) {
    return `unbalanced braces inside ${body.length > 50 ? body.slice(0, 47) + '…' : body} ({=${open}, }=${close})`;
  }
  return null;
}

function checkEnvironments(body) {
  const openRe = /\\begin\{([a-zA-Z*]+)\}/g;
  const closeRe = /\\end\{([a-zA-Z*]+)\}/g;
  const stack = [];
  const unmatchedClose = [];
  // Walk tokens in order. We merge both regexes by stepping through the
  // string and matching whichever comes first. Simplest: build a combined
  // array sorted by index.
  const tokens = [];
  let m;
  while ((m = openRe.exec(body))) tokens.push({ at: m.index, kind: 'begin', name: m[1] });
  while ((m = closeRe.exec(body))) tokens.push({ at: m.index, kind: 'end', name: m[1] });
  tokens.sort((a, b) => a.at - b.at);
  for (const t of tokens) {
    if (t.kind === 'begin') stack.push(t.name);
    else {
      if (stack.length === 0) { unmatchedClose.push(t.name); continue; }
      const top = stack.pop();
      if (top !== t.name) {
        return `mismatched environment: \\begin{${top}} closed by \\end{${t.name}}`;
      }
    }
  }
  if (stack.length > 0) {
    return `unclosed environment \\begin{${stack[stack.length - 1]}} (no matching \\end)`;
  }
  if (unmatchedClose.length > 0) {
    return `orphan \\end{${unmatchedClose[0]}} (no matching \\begin)`;
  }
  return null;
}

function checkEmpty(span) {
  if (span.body.trim() === '') {
    return `empty math span ${span.open}${span.close}`;
  }
  return null;
}

function checkTypoHeuristics(body) {
  // \sqrt with no argument. Valid forms include `\sqrt{…}`, `\sqrt[n]{…}`,
  // `\sqrt 3` (single-token arg after whitespace), or `\sqrt3`. So we only
  // flag `\sqrt` followed immediately by end-of-span or a closing-ish token.
  const sqrtRe = /\\sqrt(?![a-zA-Z])(?=\s*$|\s*[)\]}])/g;
  const m = sqrtRe.exec(body);
  if (m) {
    return `suspicious \\sqrt with no argument at offset ${m.index}`;
  }
  // stray `&` outside an aligned/matrix/cases env. Cheap check: if there is
  // any `&` (not escaped) and no \begin{align|aligned|array|matrix|pmatrix|
  // bmatrix|cases|smallmatrix|split|gathered} in the span, flag it.
  let hasAmp = false;
  for (let i = 0; i < body.length; i++) {
    if (body[i] === '&' && !escapedAt(body, i)) { hasAmp = true; break; }
  }
  if (hasAmp && !/\\begin\{(align\*?|aligned|alignat\*?|array|matrix|pmatrix|bmatrix|Bmatrix|vmatrix|Vmatrix|smallmatrix|cases|split|gathered|eqnarray\*?)\}/.test(body)) {
    return `stray '&' outside an aligned/matrix/cases environment`;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// Validate one string value, annotating errors with the JSON field path.

function validateString(s, file, path) {
  if (typeof s !== 'string' || s === '') return;
  const { spans, errors: extractErrs } = extractSpans(s);
  for (const e of extractErrs) {
    errors.push({ file, path, msg: e });
  }
  for (const span of spans) {
    const emptyMsg = checkEmpty(span);
    if (emptyMsg) {
      warnings.push({ file, path, msg: emptyMsg });
      continue; // skip further checks on an empty span
    }
    const braceMsg = checkBraces(span.body);
    if (braceMsg) {
      errors.push({ file, path, msg: `${span.open}…${span.close}: ${braceMsg}` });
    }
    const envMsg = checkEnvironments(span.body);
    if (envMsg) {
      errors.push({ file, path, msg: `${span.open}…${span.close}: ${envMsg}` });
    }
    const typoMsg = checkTypoHeuristics(span.body);
    if (typoMsg) {
      warnings.push({ file, path, msg: `${span.open}…${span.close}: ${typoMsg}` });
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Walk quizzes/*.json.

const quizzesDir = join(repoRoot, 'quizzes');
if (existsSync(quizzesDir)) {
  const files = readdirSync(quizzesDir).filter((f) => f.endsWith('.json')).sort();
  for (const f of files) {
    const abs = join(quizzesDir, f);
    const rel = `quizzes/${f}`;
    let data;
    try {
      data = JSON.parse(readFileSync(abs, 'utf8'));
    } catch (e) {
      errors.push({ file: rel, path: '<root>', msg: `parse error: ${e.message}` });
      continue;
    }
    if (!data || typeof data.quizzes !== 'object' || !data.quizzes) continue;
    for (const [conceptId, quiz] of Object.entries(data.quizzes)) {
      if (!quiz || typeof quiz !== 'object') continue;
      for (const tier of ['questions', 'hard']) {
        const arr = Array.isArray(quiz[tier]) ? quiz[tier] : null;
        if (!arr) continue;
        for (let i = 0; i < arr.length; i++) {
          const q = arr[i];
          if (!q || typeof q !== 'object') continue;
          const base = `quizzes.${conceptId}.${tier}[${i}]`;
          validateString(q.q,       rel, `${base}.q`);
          validateString(q.explain, rel, `${base}.explain`);
          if (q.type === 'mcq' && Array.isArray(q.choices)) {
            for (let j = 0; j < q.choices.length; j++) {
              validateString(q.choices[j], rel, `${base}.choices[${j}]`);
            }
          }
        }
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Walk concepts/*.json (excluding index.json and bundle.js).

const conceptsDir = join(repoRoot, 'concepts');
if (existsSync(conceptsDir)) {
  const files = readdirSync(conceptsDir)
    .filter((f) => f.endsWith('.json') && f !== 'index.json' && f !== 'capstones.json')
    .sort();
  for (const f of files) {
    const abs = join(conceptsDir, f);
    const rel = `concepts/${f}`;
    let data;
    try {
      data = JSON.parse(readFileSync(abs, 'utf8'));
    } catch (e) {
      errors.push({ file: rel, path: '<root>', msg: `parse error: ${e.message}` });
      continue;
    }
    if (!data || !Array.isArray(data.concepts)) continue;
    for (let i = 0; i < data.concepts.length; i++) {
      const c = data.concepts[i];
      if (!c || typeof c !== 'object') continue;
      const key = c.id || `#${i}`;
      validateString(c.blurb, rel, `concepts[${key}].blurb`);
    }
  }

  // capstones.json: walk `capstones[*].blurb`.
  const capPath = join(conceptsDir, 'capstones.json');
  if (existsSync(capPath)) {
    const rel = 'concepts/capstones.json';
    let data;
    try {
      data = JSON.parse(readFileSync(capPath, 'utf8'));
    } catch (e) {
      errors.push({ file: rel, path: '<root>', msg: `parse error: ${e.message}` });
      data = null;
    }
    if (data && Array.isArray(data.capstones)) {
      for (let i = 0; i < data.capstones.length; i++) {
        const c = data.capstones[i];
        if (!c || typeof c !== 'object') continue;
        const key = c.id || `#${i}`;
        validateString(c.blurb, rel, `capstones[${key}].blurb`);
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Report.

function cmp(a, b) {
  if (a.file !== b.file) return a.file < b.file ? -1 : 1;
  if (a.path !== b.path) return a.path < b.path ? -1 : 1;
  return 0;
}
errors.sort(cmp);
warnings.sort(cmp);

console.log(`validate-katex: scanned quizzes/*.json + concepts/*.json`);
console.log('');

if (errors.length) {
  console.log(`ERRORS (${errors.length}):`);
  for (const { file, path, msg } of errors) console.log(`  - ${file}:${path} → ${msg}`);
  console.log('');
}
if (warnings.length) {
  console.log(`WARNINGS (${warnings.length}):`);
  for (const { file, path, msg } of warnings) console.log(`  - ${file}:${path} → ${msg}`);
  console.log('');
}

if (errors.length === 0) {
  console.log(`OK: ${warnings.length === 0 ? 'no structural KaTeX issues found' : `no errors (${warnings.length} warning${warnings.length === 1 ? '' : 's'})`}.`);
  process.exit(0);
} else {
  console.log(`FAIL: ${errors.length} structural KaTeX error(s).`);
  process.exit(1);
}
