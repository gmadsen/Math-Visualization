#!/usr/bin/env node
// JSON-schema validation for the portable data model.
//
// Validates every concepts/<topic>.json against schemas/concept.schema.json
// and every quizzes/<topic>.json against schemas/quiz-bank.schema.json, using
// Ajv (draft 2020-12). Complements validate-concepts.mjs, which handles the
// cross-file invariants schemas can't express (prereq resolution, cycles).
//
// Exit 0 if every file validates. Exit 1 on the first validation failure(s),
// reporting file path, JSON path, message, and failing value where useful.
//
// Deps: ajv, ajv-formats (under scripts/node_modules/), and node: built-ins.
//
// Usage: node scripts/validate-schema.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = dirname(__filename);
const repoRoot = resolve(scriptsDir, '..');
const schemasDir = join(repoRoot, 'schemas');
const conceptsDir = join(repoRoot, 'concepts');
const quizzesDir = join(repoRoot, 'quizzes');

const errors = [];
const err = (m) => errors.push(m);

function readJson(absPath) {
  const raw = readFileSync(absPath, 'utf8');
  return JSON.parse(raw);
}

// Ajv setup — same options the schema-authoring agent verified clean.
const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

let validateConcept;
let validateQuiz;
try {
  const conceptSchema = readJson(join(schemasDir, 'concept.schema.json'));
  validateConcept = ajv.compile(conceptSchema);
} catch (e) {
  console.error(`validate-schema: cannot compile concept schema: ${e.message}`);
  process.exit(1);
}
try {
  const quizSchema = readJson(join(schemasDir, 'quiz-bank.schema.json'));
  validateQuiz = ajv.compile(quizSchema);
} catch (e) {
  console.error(`validate-schema: cannot compile quiz-bank schema: ${e.message}`);
  process.exit(1);
}

function listJsonFiles(dir, { skip = [] } = {}) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json') && !skip.includes(f))
    .sort();
}

function formatAjvError(fileRel, e) {
  const path = e.instancePath || '(root)';
  const bits = [`${fileRel}: ${path} ${e.message}`];
  if (e.params && Object.keys(e.params).length) {
    bits.push(`params=${JSON.stringify(e.params)}`);
  }
  if ('data' in e && e.data !== undefined) {
    let v;
    try {
      v = JSON.stringify(e.data);
    } catch {
      v = String(e.data);
    }
    if (v !== undefined && v.length <= 120) bits.push(`value=${v}`);
  }
  return bits.join(' | ');
}

function validateFile(absPath, fileRel, validator) {
  let data;
  try {
    data = readJson(absPath);
  } catch (e) {
    err(`${fileRel}: JSON parse error: ${e.message}`);
    return false;
  }
  const ok = validator(data);
  if (!ok) {
    for (const e of validator.errors || []) {
      err(formatAjvError(fileRel, e));
    }
    return false;
  }
  return true;
}

// concepts/*.json — skip registry files (index, capstones, sections) and the
// built bundle. These have their own shapes; only topic concept files get
// validated against schemas/concept.schema.json.
const conceptFiles = listJsonFiles(conceptsDir, {
  skip: ['index.json', 'capstones.json', 'sections.json'],
});
let conceptOk = 0;
for (const f of conceptFiles) {
  const abs = join(conceptsDir, f);
  if (validateFile(abs, `concepts/${f}`, validateConcept)) conceptOk++;
}

// quizzes/*.json — bundle.js is filtered by the .json extension check.
const quizFiles = listJsonFiles(quizzesDir);
let quizOk = 0;
for (const f of quizFiles) {
  const abs = join(quizzesDir, f);
  if (validateFile(abs, `quizzes/${f}`, validateQuiz)) quizOk++;
}

if (errors.length > 0) {
  console.log(`validate-schema: ${errors.length} error(s):`);
  for (const m of errors) console.log(`  - ${m}`);
  console.log(`FAIL: concepts ${conceptOk}/${conceptFiles.length} ok, quizzes ${quizOk}/${quizFiles.length} ok`);
  process.exit(1);
}

console.log(`validate-schema: concepts ${conceptOk}/${conceptFiles.length} ok, quizzes ${quizOk}/${quizFiles.length} ok`);
process.exit(0);
