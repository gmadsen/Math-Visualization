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

// ----- Explicit-stub method list -----
//
// Mirrors the `target = { … }` literal in `scripts/test-topic-jsdom.mjs`.
// Hand-maintained — the literal is small and rarely changes; mirroring it
// is more honest than parsing it. If `test-topic-jsdom.mjs`'s stub is
// extended, add the new key here too. The drift check below verifies the
// two are in sync at audit time.
const STUBBED_MEMBERS = new Set([
  // Properties.
  'canvas', 'fillStyle', 'strokeStyle', 'lineWidth', 'font',
  'textAlign', 'textBaseline', 'globalAlpha',
  // Methods that return undefined.
  'fillRect', 'strokeRect', 'clearRect',
  'beginPath', 'closePath', 'moveTo', 'lineTo',
  'arc', 'rect', 'fill', 'stroke',
  'fillText', 'strokeText',
  'save', 'restore', 'translate', 'scale', 'rotate',
  'transform', 'setTransform', 'resetTransform',
  'drawImage', 'putImageData',
  // Methods that return a value (typed shape).
  'measureText', 'createLinearGradient', 'createRadialGradient',
  'getImageData', 'createImageData',
]);

// Sync sanity check: every name in STUBBED_MEMBERS should appear at least
// once as a `name:` token in the test-topic-jsdom target literal. If a
// name is missing, the local list is stale (someone removed the stub
// without updating us). Asymmetric on purpose — extras in the literal
// (nested return-value keys like `width`, `addColorStop`) don't trip a
// false positive.
{
  const stubSrc = readFileSync(join(repoRoot, 'scripts/test-topic-jsdom.mjs'), 'utf8');
  const targetIdx = stubSrc.indexOf('const target = {');
  const closeIdx = stubSrc.indexOf('};\n              return new Proxy(target', targetIdx);
  const slice = targetIdx >= 0 && closeIdx >= 0 ? stubSrc.slice(targetIdx, closeIdx) : '';
  const stale = [...STUBBED_MEMBERS].filter((k) => !new RegExp(`\\b${k}\\s*:`).test(slice));
  if (stale.length) {
    console.error(`audit-canvas-stub: stale STUBBED_MEMBERS — test-topic-jsdom no longer stubs [${stale.join(', ')}]. Update or remove these from STUBBED_MEMBERS.`);
    process.exit(1);
  }
}
const stubbedMembers = STUBBED_MEMBERS;

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
