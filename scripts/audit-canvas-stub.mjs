#!/usr/bin/env node
// Cross-check canvas 2D method calls in the corpus against the explicit
// stub list in scripts/test-topic-jsdom.mjs.
//
// The jsdom canvas stub installs a Proxy that returns a no-op for any
// unlisted method. That keeps boot tests from throwing, but it also means
// a widget can call ctx.someMethod(...) at runtime and silently get
// undefined back from the stub when the method needs a non-undefined
// return (e.g. createPattern → CanvasPattern, isPointInPath → bool,
// measureText → metrics with more than width). This audit flags any such
// drift before it becomes a runtime bug behind a passing boot test.
//
// Advisory — exits 0. Run from the repo root.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

// ----- Parse the explicit-stub method list -----
//
// The stub lives inside `target = { ... }` in test-topic-jsdom.mjs. We
// find the literal that contains `getContext = function (kind)` and walk
// brace-balanced from `target = {` to the closing `}`. Then scan top-level
// keys (depth=1) only.
const stubSrc = readFileSync(join(repoRoot, 'scripts/test-topic-jsdom.mjs'), 'utf8');
const targetIdx = stubSrc.indexOf('const target = {');
if (targetIdx === -1) {
  console.error('audit-canvas-stub: could not locate `const target = {` in test-topic-jsdom.mjs');
  process.exit(0);
}
const openIdx = stubSrc.indexOf('{', targetIdx);
let depth = 0;
let endIdx = -1;
for (let i = openIdx; i < stubSrc.length; i++) {
  const c = stubSrc[i];
  if (c === '{') depth++;
  else if (c === '}') {
    depth--;
    if (depth === 0) { endIdx = i; break; }
  }
}
if (endIdx === -1) {
  console.error('audit-canvas-stub: brace-balance failed parsing target literal');
  process.exit(0);
}
const targetBody = stubSrc.slice(openIdx + 1, endIdx);

// Walk top-level keys: depth 0 in the literal. Skip nested object/array
// values and string contents. Capture an identifier whenever depth=0 and
// it appears at the start of the literal or right after a comma.
const stubbedMembers = new Set();
{
  let d = 0;
  let inStr = null;
  let i = 0;
  let canStartKey = true; // true at literal-start, after a top-level comma
  while (i < targetBody.length) {
    const c = targetBody[i];
    if (inStr) {
      if (c === '\\') { i += 2; continue; }
      if (c === inStr) inStr = null;
      i++;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; i++; continue; }
    if (c === '{' || c === '(' || c === '[') { d++; i++; continue; }
    if (c === '}' || c === ')' || c === ']') { d--; i++; continue; }
    if (d === 0 && c === ',') { canStartKey = true; i++; continue; }
    if (d === 0 && canStartKey && /[a-zA-Z_]/.test(c)) {
      const m = targetBody.slice(i).match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
      if (m) {
        stubbedMembers.add(m[1]);
        i += m[0].length;
        canStartKey = false;
        continue;
      }
    }
    if (!/\s/.test(c)) canStartKey = false;
    i++;
  }
}

// ----- Collect candidate files -----
function walk(dir, out) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    if (e.isDirectory()) {
      if (['node_modules', 'audits', 'examples', 'tests'].includes(e.name)) continue;
      walk(join(dir, e.name), out);
    } else if (/\.(html|mjs|js|json)$/.test(e.name)) {
      out.push(join(dir, e.name));
    }
  }
}
const files = [];
walk(join(repoRoot, 'widgets'), files);
walk(join(repoRoot, 'js'), files);
walk(join(repoRoot, 'content'), files);
for (const e of readdirSync(repoRoot, { withFileTypes: true })) {
  if (e.isFile() && e.name.endsWith('.html')) files.push(join(repoRoot, e.name));
}

// ----- Scan each file for getContext('2d') sites -----
//
// For every assignment `… = X.getContext('2d')` (with optional `var/let/
// const`), capture the LHS identifier, then collect every `IDENT.method`
// reference in the same file. Methods not in `stubbedMembers` would hit
// the Proxy noop fallback at runtime.

const findings = [];
let getContextSites = 0;
let totalCallSites = 0;
const ctxMethodRe = /\b([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
const ctxAssignRe = /(?:^|[^.\w])([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*[^=;]*?\.getContext\s*\(\s*['"`]2d['"`]/g;

for (const file of files) {
  const txt = readFileSync(file, 'utf8');
  const ctxVars = new Set();
  let m;
  while ((m = ctxAssignRe.exec(txt))) ctxVars.add(m[1]);
  if (!ctxVars.size) continue;
  getContextSites += ctxVars.size;
  while ((m = ctxMethodRe.exec(txt))) {
    if (!ctxVars.has(m[1])) continue;
    totalCallSites++;
    const method = m[2];
    if (stubbedMembers.has(method)) continue;
    findings.push({ file: relative(repoRoot, file), method });
  }
}

// ----- Report -----
console.log(
  `audit-canvas-stub: ${stubbedMembers.size} explicit stub(s); ` +
    `${getContextSites} getContext('2d') site(s); ${totalCallSites} method call(s) total`
);
console.log('');

if (findings.length === 0) {
  console.log('  ✓ no canvas method call hits the Proxy fallback');
} else {
  // Group by file.
  const byFile = new Map();
  for (const f of findings) {
    if (!byFile.has(f.file)) byFile.set(f.file, new Set());
    byFile.get(f.file).add(f.method);
  }
  console.log('  POTENTIAL Proxy-fallback hits:');
  console.log('  -------------------------------');
  for (const [file, methods] of byFile) {
    console.log(`  ${file}: ${[...methods].sort().join(', ')}`);
  }
  console.log('');
  console.log(
    '  Each method above is called on a 2d context but is NOT in the explicit'
  );
  console.log(
    '  stub list. The boot test will pass (Proxy returns noop), but if the'
  );
  console.log(
    '  widget reads the return value at runtime it gets undefined. Add the'
  );
  console.log(
    "  method to the `target` literal in scripts/test-topic-jsdom.mjs with a"
  );
  console.log('  realistic stub.');
}
console.log('');
console.log('(advisory; always exits 0)');
