#!/usr/bin/env node
// Audit bundle staleness — fast check that concepts/bundle.js and
// quizzes/bundle.js match their source JSONs without running the full
// rebuild. Exits 1 if either bundle is out of sync with disk.
//
// This is a STRUCTURE check, not byte-for-byte. Formatting drift between
// builds is fine; what matters is that the decoded payload matches what a
// fresh flattening of the source JSONs would produce.
//
// Usage:  node scripts/audit-bundle-staleness.mjs
// Exit codes:
//   0 — both bundles in sync with their source JSONs
//   1 — one or more bundles stale; stderr names the specific files/topics
//       that differ

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const conceptsDir = join(repoRoot, 'concepts');
const quizzesDir = join(repoRoot, 'quizzes');

const problems = [];

// --- helpers -----------------------------------------------------------------

// Extract the embedded payload object from a bundle file.
//
// The bundle generators emit exactly:
//   window.__MVConcepts = { ... };
//   window.MVQuizBank   = { ... };
// We locate the first `{` after the `=` and the final `}` before the trailing
// `;` / newline, then JSON-parse that slice. This is more robust than regex
// against the fact that the embedded JSON contains many `{` and `}` itself.
function extractBundlePayload(bundlePath, globalName) {
  let raw;
  try {
    raw = readFileSync(bundlePath, 'utf8');
  } catch (e) {
    return { ok: false, reason: `cannot read ${bundlePath}: ${e.message}` };
  }

  const marker = `window.${globalName} =`;
  const markerIdx = raw.indexOf(marker);
  if (markerIdx === -1) {
    return { ok: false, reason: `bundle missing 'window.${globalName} =' assignment` };
  }
  const afterEq = raw.indexOf('=', markerIdx) + 1;
  const firstBrace = raw.indexOf('{', afterEq);
  if (firstBrace === -1) {
    return { ok: false, reason: `bundle has no opening '{' after 'window.${globalName} ='` };
  }
  // Find the matching closing brace by scanning, ignoring braces inside strings.
  let depth = 0;
  let inStr = false;
  let escape = false;
  let end = -1;
  for (let i = firstBrace; i < raw.length; i++) {
    const ch = raw[i];
    if (inStr) {
      if (escape) { escape = false; continue; }
      if (ch === '\\') { escape = true; continue; }
      if (ch === '"') { inStr = false; }
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) {
    return { ok: false, reason: `bundle has unbalanced braces; cannot find close of payload` };
  }
  const jsonSlice = raw.slice(firstBrace, end + 1);
  try {
    return { ok: true, value: JSON.parse(jsonSlice) };
  } catch (e) {
    return { ok: false, reason: `payload JSON.parse failed: ${e.message}` };
  }
}

// Structural deep-equal. Order-sensitive for arrays (JSON arrays are ordered);
// key-order-insensitive for objects (JSON.stringify of the source would
// preserve insertion order, but we want a robust content check).
function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  const bset = new Set(bk);
  for (const k of ak) {
    if (!bset.has(k)) return false;
    if (!deepEqual(a[k], b[k])) return false;
  }
  return true;
}

// Find the first differing path between two structures, for a readable diag.
function findFirstDiff(a, b, pathParts = []) {
  if (deepEqual(a, b)) return null;
  if (
    a === null || b === null ||
    typeof a !== typeof b ||
    typeof a !== 'object' ||
    Array.isArray(a) !== Array.isArray(b)
  ) {
    return pathParts.join('.') || '<root>';
  }
  if (Array.isArray(a)) {
    if (a.length !== b.length) {
      return `${pathParts.join('.') || '<root>'} (length ${a.length} vs ${b.length})`;
    }
    for (let i = 0; i < a.length; i++) {
      const sub = findFirstDiff(a[i], b[i], [...pathParts, `[${i}]`]);
      if (sub) return sub;
    }
    return pathParts.join('.') || '<root>';
  }
  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of allKeys) {
    if (!(k in a) || !(k in b)) {
      return `${[...pathParts, k].join('.')} (present in only one side)`;
    }
    const sub = findFirstDiff(a[k], b[k], [...pathParts, k]);
    if (sub) return sub;
  }
  return pathParts.join('.') || '<root>';
}

// --- concepts/bundle.js ------------------------------------------------------

function checkConceptsBundle() {
  const indexPath = join(conceptsDir, 'index.json');
  const capstonesPath = join(conceptsDir, 'capstones.json');
  let index, capstones;
  try {
    index = JSON.parse(readFileSync(indexPath, 'utf8'));
  } catch (e) {
    problems.push(`concepts: cannot read/parse ${indexPath}: ${e.message}`);
    return;
  }
  try {
    capstones = JSON.parse(readFileSync(capstonesPath, 'utf8'));
  } catch (e) {
    problems.push(`concepts: cannot read/parse ${capstonesPath}: ${e.message}`);
    return;
  }

  const topics = {};
  for (const t of index.topics || []) {
    const p = join(conceptsDir, `${t}.json`);
    try {
      topics[t] = JSON.parse(readFileSync(p, 'utf8'));
    } catch (e) {
      problems.push(`concepts: cannot read/parse ${p}: ${e.message}`);
      return;
    }
  }

  const expected = { index, topics, capstones };

  const bundlePath = join(conceptsDir, 'bundle.js');
  const extracted = extractBundlePayload(bundlePath, '__MVConcepts');
  if (!extracted.ok) {
    problems.push(`concepts/bundle.js: ${extracted.reason}`);
    return;
  }
  const actual = extracted.value;

  // Top-level keys.
  for (const k of ['index', 'topics', 'capstones']) {
    if (!(k in actual)) {
      problems.push(`concepts/bundle.js: missing top-level key '${k}'`);
    }
  }
  if (problems.length) return;

  if (!deepEqual(actual.index, expected.index)) {
    const where = findFirstDiff(actual.index, expected.index) || '<root>';
    problems.push(`concepts/bundle.js: 'index' differs from concepts/index.json at ${where}`);
  }
  if (!deepEqual(actual.capstones, expected.capstones)) {
    const where = findFirstDiff(actual.capstones, expected.capstones) || '<root>';
    problems.push(`concepts/bundle.js: 'capstones' differs from concepts/capstones.json at ${where}`);
  }

  // Topic-by-topic diff so we can name the offender.
  const expectedTopicKeys = Object.keys(expected.topics).sort();
  const actualTopicKeys = Object.keys(actual.topics || {}).sort();
  const missingInBundle = expectedTopicKeys.filter((k) => !actualTopicKeys.includes(k));
  const extraInBundle = actualTopicKeys.filter((k) => !expectedTopicKeys.includes(k));
  for (const k of missingInBundle) {
    problems.push(`concepts/bundle.js: topic '${k}' is registered in index.json but missing from bundle`);
  }
  for (const k of extraInBundle) {
    problems.push(`concepts/bundle.js: topic '${k}' present in bundle but not registered in concepts/index.json`);
  }
  for (const k of expectedTopicKeys) {
    if (!actualTopicKeys.includes(k)) continue;
    if (!deepEqual(actual.topics[k], expected.topics[k])) {
      const where = findFirstDiff(actual.topics[k], expected.topics[k]) || '<root>';
      problems.push(`concepts/bundle.js: topic '${k}' differs from concepts/${k}.json at ${where}`);
    }
  }
}

// --- quizzes/bundle.js -------------------------------------------------------

function checkQuizzesBundle() {
  const entries = readdirSync(quizzesDir)
    .filter((entry) => extname(entry) === '.json')
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  const expected = {};
  for (const entry of entries) {
    const full = join(quizzesDir, entry);
    try {
      if (!statSync(full).isFile()) continue;
    } catch (e) {
      problems.push(`quizzes: cannot stat ${full}: ${e.message}`);
      return;
    }
    const topic = basename(entry, '.json');
    try {
      expected[topic] = JSON.parse(readFileSync(full, 'utf8'));
    } catch (e) {
      problems.push(`quizzes: cannot parse ${full}: ${e.message}`);
      return;
    }
  }

  const bundlePath = join(quizzesDir, 'bundle.js');
  const extracted = extractBundlePayload(bundlePath, 'MVQuizBank');
  if (!extracted.ok) {
    problems.push(`quizzes/bundle.js: ${extracted.reason}`);
    return;
  }
  const actual = extracted.value;

  const expectedKeys = Object.keys(expected).sort();
  const actualKeys = Object.keys(actual || {}).sort();
  const missingInBundle = expectedKeys.filter((k) => !actualKeys.includes(k));
  const extraInBundle = actualKeys.filter((k) => !expectedKeys.includes(k));
  for (const k of missingInBundle) {
    problems.push(`quizzes/bundle.js: topic '${k}' has a source quizzes/${k}.json but is missing from bundle`);
  }
  for (const k of extraInBundle) {
    problems.push(`quizzes/bundle.js: topic '${k}' present in bundle but has no quizzes/${k}.json on disk`);
  }
  for (const k of expectedKeys) {
    if (!actualKeys.includes(k)) continue;
    if (!deepEqual(actual[k], expected[k])) {
      const where = findFirstDiff(actual[k], expected[k]) || '<root>';
      problems.push(`quizzes/bundle.js: topic '${k}' differs from quizzes/${k}.json at ${where}`);
    }
  }
}

// --- main --------------------------------------------------------------------

checkConceptsBundle();
checkQuizzesBundle();

if (problems.length === 0) {
  console.log('bundles in sync — concepts/bundle.js and quizzes/bundle.js match their source JSONs');
  process.exit(0);
}

console.error('bundles out of sync — rebuild with: node scripts/rebuild.mjs');
for (const p of problems) {
  console.error(`  • ${p}`);
}
console.error(`(${problems.length} mismatch${problems.length === 1 ? '' : 'es'})`);
process.exit(1);
