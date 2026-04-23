#!/usr/bin/env node
// Bundle every registered widget under widgets/<slug>/ into a single loadable
// .js file for widgets.html (the catalog page).
//
// Why: modern browsers block fetch() of local JSON files when the host page
// is opened via file:// (no server). The notebook's README says double-clicking
// any page should work, so widgets.html can't fetch('./widgets/<slug>/schema.json')
// at runtime. A <script src="./widgets/bundle.js"> tag works from file:// and
// exposes the registry as a window global (window.__MVWidgets).
//
// Usage:  node scripts/build-widgets-bundle.mjs
// Output: widgets/bundle.js (overwritten; idempotent — re-running with no
//         underlying source changes rewrites the same bytes).
//
// Per-widget payload:
//   {
//     slug, family, dimension, gesture, role,
//     title,               // from schema.title
//     description,         // from schema.description (falls back to README excerpt)
//     requiredParams,      // top-level `required` array (or [] for oneOf schemas)
//     readmeExcerpt,       // first paragraph of README.md (or null)
//     hasExample,          // true if widgets/<slug>/example.json exists
//     exampleParams,       // contents of example.json (null otherwise)
//     exampleMarkup,       // renderMarkup(exampleParams) if hasExample, else null
//     exampleScript        // renderScript(exampleParams) if hasExample, else null
//   }
//
// The widget module is imported dynamically (file:// URL) and renderMarkup /
// renderScript are called at build time so widgets.html doesn't need to run
// ES-module resolution from a file:// context. If renderMarkup throws, the
// widget is still listed in the bundle (with exampleMarkup=null) and a warning
// is logged — a broken example shouldn't break the whole catalog build.

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');
const widgetsDir = join(repoRoot, 'widgets');
const outPath = join(widgetsDir, 'bundle.js');

function readJson(absPath) {
  return JSON.parse(readFileSync(absPath, 'utf8'));
}

function firstParagraph(md) {
  // First non-heading, non-empty paragraph.
  const lines = md.split(/\r?\n/);
  const out = [];
  let seen = false;
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!seen) {
      if (line === '' || line.startsWith('#')) continue;
      seen = true;
      out.push(line);
      continue;
    }
    if (line === '') break;
    out.push(line);
  }
  return out.join(' ').trim() || null;
}

function extractRequired(schema) {
  if (Array.isArray(schema.required)) return schema.required.slice();
  // oneOf schemas (e.g. clickable-diagram) don't have a top-level `required`;
  // the required fields live under each branch. Collect the intersection — the
  // fields present across all branches are those every instance must carry.
  if (Array.isArray(schema.oneOf)) {
    const branches = [];
    for (const b of schema.oneOf) {
      // $ref into $defs is the common shape
      if (b && typeof b === 'object' && typeof b.$ref === 'string' && b.$ref.startsWith('#/$defs/') && schema.$defs) {
        const defName = b.$ref.slice('#/$defs/'.length);
        const def = schema.$defs[defName];
        if (def && Array.isArray(def.required)) branches.push(def.required);
      } else if (Array.isArray(b?.required)) {
        branches.push(b.required);
      }
    }
    if (branches.length === 0) return [];
    // intersection across branches preserves first-branch ordering
    const [first, ...rest] = branches;
    return first.filter((k) => rest.every((r) => r.includes(k)));
  }
  return [];
}

const entries = readdirSync(widgetsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

const widgets = [];
let exampleCount = 0;

for (const slug of entries) {
  const dir = join(widgetsDir, slug);
  const schemaPath = join(dir, 'schema.json');
  if (!existsSync(schemaPath) || !statSync(schemaPath).isFile()) continue;

  let schema;
  try {
    schema = readJson(schemaPath);
  } catch (e) {
    console.error(`build-widgets-bundle: widgets/${slug}/schema.json parse error: ${e.message}`);
    process.exit(1);
  }

  const meta = schema.meta && typeof schema.meta === 'object' ? schema.meta : {};
  const readmePath = join(dir, 'README.md');
  let readmeExcerpt = null;
  if (existsSync(readmePath)) {
    try {
      readmeExcerpt = firstParagraph(readFileSync(readmePath, 'utf8'));
    } catch {
      readmeExcerpt = null;
    }
  }

  const examplePath = join(dir, 'example.json');
  let hasExample = false;
  let exampleParams = null;
  let exampleMarkup = null;
  let exampleScript = null;
  if (existsSync(examplePath)) {
    try {
      exampleParams = readJson(examplePath);
      hasExample = true;
    } catch (e) {
      console.warn(`build-widgets-bundle: widgets/${slug}/example.json parse error: ${e.message}; skipping example`);
    }
  }

  if (hasExample) {
    const modPath = join(dir, 'index.mjs');
    if (existsSync(modPath)) {
      try {
        const mod = await import(pathToFileURL(modPath).href);
        if (typeof mod.renderMarkup === 'function') {
          exampleMarkup = mod.renderMarkup(exampleParams);
        }
        if (typeof mod.renderScript === 'function') {
          exampleScript = mod.renderScript(exampleParams);
        }
        exampleCount++;
      } catch (e) {
        console.warn(`build-widgets-bundle: widgets/${slug}/index.mjs render failed: ${e.message}`);
      }
    }
  }

  widgets.push({
    slug,
    family: meta.family ?? null,
    dimension: meta.dimension ?? null,
    gesture: meta.gesture ?? null,
    role: meta.role ?? null,
    title: typeof schema.title === 'string' ? schema.title : slug,
    description: typeof schema.description === 'string' ? schema.description : null,
    requiredParams: extractRequired(schema),
    readmeExcerpt,
    hasExample,
    exampleParams,
    exampleMarkup,
    exampleScript,
  });
}

const body = JSON.stringify(widgets, null, 2);
const js =
`// Auto-generated by scripts/build-widgets-bundle.mjs — DO NOT EDIT.
// Regenerate with:  node scripts/build-widgets-bundle.mjs
// Source of truth: widgets/<slug>/schema.json, README.md, optional example.json.
window.__MVWidgets = ${body};
`;

// Idempotent write: only touch the file if bytes changed. (Most callers don't
// care, but it makes "re-run → no diff" literally true at the byte level.)
let prev = null;
try { prev = readFileSync(outPath, 'utf8'); } catch {}
if (prev !== js) {
  writeFileSync(outPath, js);
}

console.log(`build-widgets-bundle: ${widgets.length} widget(s), ${exampleCount} example render(s) → ${outPath}`);
