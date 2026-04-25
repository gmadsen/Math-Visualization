#!/usr/bin/env node
// JSON-schema validation for widget/widget-script params in structured content.
//
// Walks every content/<topic>.json, iterates sections[].blocks[], and for each
// block with type in {widget, widget-script} and a `slug`, loads
// widgets/<slug>/schema.json and validates block.params against it with Ajv
// (draft 2020-12). Compiled validators are cached by slug.
//
// Complements validate-schema.mjs (which covers concepts/ and quizzes/) by
// enforcing that structured-content widget-block params match the widget
// module's declared schema.
//
// Exit 0 if every widget-params blob validates. Exit 1 on any validation
// failure or when a referenced slug has no schema on disk, reporting file
// path, section id, block type+slug, JSON path, message, and a truncated
// value where useful.
//
// Deps: ajv, ajv-formats (under scripts/node_modules/), and node: built-ins.
//
// Usage: node scripts/validate-widget-params.mjs

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = dirname(__filename);
const repoRoot = resolve(scriptsDir, '..');
const contentDir = join(repoRoot, 'content');
const widgetsDir = join(repoRoot, 'widgets');

const errors = [];
const err = (m) => errors.push(m);

function readJson(absPath) {
  const raw = readFileSync(absPath, 'utf8');
  return JSON.parse(raw);
}

// Ajv setup — strict:false so widget schemas can carry annotation-only
// keywords like top-level `meta` (family / dimension / gesture / role) without
// compile rejection.
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

// Cache of compiled validators, keyed by slug. `null` means the slug is known
// bad (missing or uncompilable schema) and we've already reported it.
const validatorCache = new Map();

function getValidator(slug) {
  if (validatorCache.has(slug)) return validatorCache.get(slug);
  const schemaPath = join(widgetsDir, slug, 'schema.json');
  if (!existsSync(schemaPath)) {
    validatorCache.set(slug, null);
    return null;
  }
  let schema;
  try {
    schema = readJson(schemaPath);
  } catch (e) {
    err(`widgets/${slug}/schema.json: JSON parse error: ${e.message}`);
    validatorCache.set(slug, null);
    return null;
  }
  try {
    const v = ajv.compile(schema);
    validatorCache.set(slug, v);
    return v;
  } catch (e) {
    err(`widgets/${slug}/schema.json: schema compile error: ${e.message}`);
    validatorCache.set(slug, null);
    return null;
  }
}

function truncate(v, max = 120) {
  let s;
  try {
    s = JSON.stringify(v);
  } catch {
    s = String(v);
  }
  if (s === undefined) return 'undefined';
  return s.length <= max ? s : s.slice(0, max - 1) + '…';
}

function formatBlockError(fileRel, sectionId, block, ajvErr) {
  const path = ajvErr.instancePath || '(root)';
  const bits = [
    `${fileRel}: section[id=${sectionId}] block[type=${block.type},slug=${block.slug}] — ${path} ${ajvErr.message}`,
  ];
  if (ajvErr.params && Object.keys(ajvErr.params).length) {
    bits.push(`params=${JSON.stringify(ajvErr.params)}`);
  }
  if ('data' in ajvErr && ajvErr.data !== undefined) {
    bits.push(`value=${truncate(ajvErr.data)}`);
  }
  return bits.join(' | ');
}

function listJsonFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort();
}

const contentFiles = listJsonFiles(contentDir);
const slugsSeen = new Set();
let validations = 0;

for (const f of contentFiles) {
  const abs = join(contentDir, f);
  const fileRel = `content/${f}`;
  let data;
  try {
    data = readJson(abs);
  } catch (e) {
    err(`${fileRel}: JSON parse error: ${e.message}`);
    continue;
  }
  const sections = Array.isArray(data.sections) ? data.sections : [];
  for (const section of sections) {
    const sid = section && section.id != null ? section.id : '?';
    const blocks = Array.isArray(section && section.blocks) ? section.blocks : [];
    for (const block of blocks) {
      if (!block || typeof block !== 'object') continue;
      if (block.type !== 'widget' && block.type !== 'widget-script') continue;
      if (typeof block.slug !== 'string' || block.slug.length === 0) continue;
      const slug = block.slug;
      slugsSeen.add(slug);
      const validator = getValidator(slug);
      if (!validator) {
        err(
          `${fileRel}: section[id=${sid}] block[type=${block.type},slug=${slug}] — ` +
            `unknown widget slug "${slug}" — no schema at widgets/${slug}/schema.json`,
        );
        continue;
      }
      const params = block.params;
      validations++;
      const ok = validator(params);
      if (!ok) {
        for (const e of validator.errors || []) {
          err(formatBlockError(fileRel, sid, block, e));
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.log(`validate-widget-params: ${errors.length} error(s):`);
  for (const m of errors) console.log(`  - ${m}`);
  console.log(
    `FAIL: ${validations} widget-params attempted across ${contentFiles.length} content files, ${slugsSeen.size} slug(s)`,
  );
  process.exit(1);
}

const slugList = [...slugsSeen].sort().join(', ') || '(none)';
console.log(
  `validate-widget-params: ${validations} widget-params validated across ${contentFiles.length} content files, ${slugsSeen.size} slugs (${slugList}), 0 errors`,
);
process.exit(0);
