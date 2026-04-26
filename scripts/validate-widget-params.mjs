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

// XSS-via-contributor-HTML lint helpers (used inside the per-block loop below).
// Several widget renderers (branching-proof-scrubber, diagram-editor) accept
// contributor-supplied HTML in params like `nodes[*].prompt` and pipe them
// straight into innerHTML so authors can use <b>, <i>, <code>, KaTeX. Any
// string-typed param is therefore a stored-XSS sink if a contributor PR slips
// in a <script>, on*= handler, or javascript: URL. We refuse to validate any
// params blob that contains those substrings — the realistic exposure is
// contributor mistakes, not adversarial input.
const FORBIDDEN_HTML_RE = /<\s*script\b|<[a-z][^>]*\son[a-z]+\s*=|javascript\s*:/i;
function matchedPatternFor(s) {
  if (/<\s*script\b/i.test(s)) return '<script tag';
  if (/<[a-z][^>]*\son[a-z]+\s*=/i.test(s)) return 'inline event handler (on*=)';
  if (/javascript\s*:/i.test(s)) return 'javascript: URL';
  return 'unknown';
}
// Param keys that are documented passthrough escape-hatches: the legacy
// passthrough widgets (extract-topic.mjs splits a topic's existing inline
// markup + script into bodyMarkup + bodyScript artifact strings) intentionally
// store opaque pre-extracted HTML and JS, so the lint would always trip on
// them. They are produced from real topic HTML, not contributor-authored
// fresh markup.
const XSS_LINT_SKIP_KEYS = new Set([
  'bodyMarkup', 'bodyScript', 'bodyTail',
  'scriptBodyLiteral', 'markupBodyLiteral',
]);

function collectXssHits(value, pathParts = []) {
  const hits = [];
  if (typeof value === 'string') {
    if (FORBIDDEN_HTML_RE.test(value)) {
      hits.push({
        path: pathParts.join('.') || '(root)',
        pattern: matchedPatternFor(value),
        value,
      });
    }
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      hits.push(...collectXssHits(value[i], [...pathParts, String(i)]));
    }
  } else if (value && typeof value === 'object') {
    for (const k of Object.keys(value)) {
      if (XSS_LINT_SKIP_KEYS.has(k)) continue;
      hits.push(...collectXssHits(value[k], [...pathParts, k]));
    }
  }
  return hits;
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
      // XSS-via-contributor-HTML lint. Several widget renderers
      // (branching-proof-scrubber, diagram-editor) intentionally accept
      // contributor-supplied HTML in params like `prompt`, `nodes[*].prompt`,
      // `arrows[*].label`, `relations[*].label`, etc. and pipe them straight
      // into innerHTML so authors can use <b>, <i>, <code>, KaTeX. That makes
      // any string-typed param a stored-XSS sink if a contributor PR slips in
      // a <script>, on*= handler, or javascript: URL. We can't sanitize at
      // render time without breaking the markup contract, but we can refuse
      // to validate any params blob that contains those substrings — the
      // realistic exposure is contributor mistakes, not adversarial input.
      const xssHits = collectXssHits(params);
      for (const hit of xssHits) {
        err(
          `${fileRel}: section[id=${sid}] block[type=${block.type},slug=${slug}] — ` +
            `${hit.path}: contains a forbidden HTML pattern (${hit.pattern}) ` +
            `— widget params flow to innerHTML; remove the markup or use a ` +
            `safer alternative. value=${truncate(hit.value)}`,
        );
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
