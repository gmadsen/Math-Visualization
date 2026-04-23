#!/usr/bin/env node
// Scaffold a new widget-registry entry: schema.json + index.mjs + README.md.
//
// Usage:
//   node scripts/new-widget.mjs <slug> [--family <family>] [--dimension 2d|3d]
//                                      [--gesture <g>] [--role <role>] [--force]
//
// Where:
//   <slug>       is kebab-case; becomes widgets/<slug>/ and the registry key
//                used by `{ type: "widget", slug: "<slug>", params: {...} }`
//                blocks inside content/<topic>.json.
//   --family     meta.family; default = slug. Shared-renderer widgets typically
//                set this to the family name (e.g. "clickable-diagram").
//   --dimension  meta.dimension; default = "2d".
//   --gesture    meta.gesture; default = "click".
//   --role       meta.role;    default = "exploratory".
//   --force      overwrite an existing widgets/<slug>/ (destructive).
//
// Produces:
//   1. widgets/<slug>/schema.json  — JSON Schema 2020-12 stub with meta block
//      and a minimal `{ widgetId, title, hint? }` params shape.
//   2. widgets/<slug>/index.mjs    — ESM module exporting renderMarkup(params)
//      and renderScript(params) as pure functions with TODO markers.
//   3. widgets/<slug>/README.md    — ~20-line docs stub (What it does / Params
//      / Usage), linking back to ../README.md.
//
// Refuses to clobber an existing widgets/<slug>/ unless --force is passed.
// Zero dependencies (no ajv / no external modules) — just node: built-ins.
//
// After scaffolding, verify with:
//   node scripts/rebuild.mjs --only widget-params
// (Until a content block references the new slug, validate-widget-params will
// simply not visit it — the generated schema still needs to be a valid 2020-12
// document on its own, which it is.)

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const scriptsDir = dirname(__filename);
const repoRoot = resolve(scriptsDir, '..');
const widgetsDir = join(repoRoot, 'widgets');

// ----- CLI parsing -----

function usage() {
  const lines = [
    'usage: node scripts/new-widget.mjs <slug> [options]',
    '',
    'Scaffold a new widget-registry entry at widgets/<slug>/ with',
    'schema.json, index.mjs, and README.md stubs.',
    '',
    'Options:',
    '  --family <name>       meta.family   (default: <slug>)',
    '  --dimension 2d|3d     meta.dimension (default: 2d)',
    '  --gesture <name>      meta.gesture  (default: click)',
    '  --role <name>         meta.role     (default: exploratory)',
    '  --force               overwrite widgets/<slug>/ if it already exists',
    '  --help                show this message',
    '',
    'Example:',
    '  node scripts/new-widget.mjs my-widget --family clickable-diagram --dimension 2d',
  ];
  console.log(lines.join('\n'));
}

const argv = process.argv.slice(2);

if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
  usage();
  process.exit(argv.length === 0 ? 2 : 0);
}

function takeOption(name) {
  const idx = argv.indexOf(name);
  if (idx === -1) return undefined;
  const value = argv[idx + 1];
  if (value === undefined || value.startsWith('--')) {
    console.error(`new-widget: ${name} requires a value`);
    process.exit(2);
  }
  argv.splice(idx, 2);
  return value;
}

const family    = takeOption('--family');
const dimension = takeOption('--dimension');
const gesture   = takeOption('--gesture');
const role      = takeOption('--role');

const forceIdx = argv.indexOf('--force');
const force = forceIdx !== -1;
if (force) argv.splice(forceIdx, 1);

// Anything left starting with `--` is an unknown flag.
const leftover = argv.filter(a => a.startsWith('--'));
if (leftover.length > 0) {
  console.error(`new-widget: unknown flag(s): ${leftover.join(', ')}`);
  usage();
  process.exit(2);
}

const positional = argv.filter(a => !a.startsWith('--'));
if (positional.length !== 1) {
  console.error('new-widget: expected exactly one <slug> positional argument.');
  usage();
  process.exit(2);
}
const slug = positional[0];

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error(`new-widget: invalid slug "${slug}". Use kebab-case: lower-case, digits, hyphens.`);
  process.exit(2);
}

// Validate --dimension if the user supplied one.
if (dimension !== undefined && !['2d', '3d'].includes(dimension)) {
  console.error(`new-widget: --dimension must be "2d" or "3d" (got "${dimension}").`);
  process.exit(2);
}

const meta = {
  family:    family    ?? slug,
  dimension: dimension ?? '2d',
  gesture:   gesture   ?? 'click',
  role:      role      ?? 'exploratory',
};

// ----- Preflight -----

const targetDir  = join(widgetsDir, slug);
const schemaPath = join(targetDir, 'schema.json');
const indexPath  = join(targetDir, 'index.mjs');
const readmePath = join(targetDir, 'README.md');

if (existsSync(targetDir)) {
  if (!force) {
    console.log(`new-widget: widgets/${slug}/ already exists. Pass --force to overwrite, or pick a new slug.`);
    process.exit(0);
  }
  // Destructive: only when --force was passed explicitly.
  console.warn(`new-widget: --force supplied; replacing existing widgets/${slug}/`);
  rmSync(targetDir, { recursive: true, force: true });
}

if (!existsSync(widgetsDir)) {
  console.error(`new-widget: widgets/ directory not found at ${widgetsDir}`);
  process.exit(1);
}

// ----- Derive human-friendly title -----

function slugToTitle(s) {
  // my-new-widget -> My new widget
  const first = s[0].toUpperCase() + s.slice(1);
  return first.replace(/-/g, ' ');
}
const humanTitle = slugToTitle(slug);

// ----- Build schema.json -----

const schema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: `https://math-vis.local/widgets/${slug}/schema.json`,
  title: `${slug} widget params`,
  description: `TODO(${slug}): describe what this widget does and what params it consumes. Replace this placeholder with a real one-paragraph description.`,
  meta,
  type: 'object',
  additionalProperties: false,
  required: ['widgetId', 'title'],
  properties: {
    widgetId: {
      type: 'string',
      pattern: '^[A-Za-z][A-Za-z0-9_-]*$',
      description: 'DOM id for the outer <div class="widget"> wrapper.',
    },
    title: {
      type: 'string',
      description: 'Display title rendered inside .hd > .ttl.',
    },
    hint: {
      type: 'string',
      description: 'Optional short hint rendered inside .hd > .hint.',
    },
    // TODO(<slug>): add widget-specific params here (ids, geometry, data).
  },
};

// ----- Build index.mjs -----

const indexMjs = `// ${slug} widget — registry entry scaffolded by scripts/new-widget.mjs.
//
// Exports two pure string-returning functions:
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Both are pure functions of params (no I/O). A React / Three.js / any-frontend
// consumer can ignore renderScript entirely and drive its own renderer from
// params alone (validated against ./schema.json).
//
// See ../README.md for the registry contract and ../composition-explorer/index.mjs
// for a worked bespoke example.

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? \`<div class="hint">\${hint}</div>\` : '';
  // TODO(${slug}): flesh out the markup — add <svg>, <div class="readout">,
  // <div class="row">, controls, etc. Keep the outer <div class="widget"> +
  // <div class="hd"> shell; it's what the site CSS targets.
  return (
    \`<div class="widget" id="\${widgetId}">\\n\` +
    \`  <div class="hd"><div class="ttl">\${title}</div>\${hintHtml}</div>\\n\` +
    \`  <!-- TODO(${slug}): widget body -->\\n\` +
    \`</div>\`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  // TODO(${slug}): implement the driving IIFE. Typical shape:
  //   const svg = $('#...'), out = $('#...'), ...;
  //   function render(){ /* ... */ }
  //   // event wiring
  //   render();
  return (
    \`<script>\\n\` +
    \`/* ${slug} widget: \${widgetId} */\\n\` +
    \`(function(){\\n\` +
    \`  // TODO(${slug}): widget logic goes here.\\n\` +
    \`})();\\n\` +
    \`</script>\`
  );
}
`;

// ----- Build README.md -----

const readmeMd = `# ${slug}

${humanTitle} widget — scaffolded stub. Replace this paragraph with a short
description of what the widget does, which topic page first introduced it, and
whether it's a bespoke module or part of a shared family.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction.

## What it does

TODO(${slug}): one paragraph describing the interaction. What does the reader
click / drag / toggle, and what updates in response?

## Params

See [\`schema.json\`](./schema.json) for the authoritative shape. Required
fields:

| field | type | purpose |
|---|---|---|
| \`widgetId\` | string | DOM id for the outer \`<div class="widget">\` wrapper. |
| \`title\`    | string | Display title rendered in the header. |
| \`hint\`     | string (optional) | Short hint rendered next to the title. |

TODO(${slug}): extend this table as you add params to \`schema.json\`.

## Usage

Embed the widget by adding two blocks to \`content/<topic>.json\`:

\`\`\`json
{ "type": "widget",        "slug": "${slug}", "params": { "widgetId": "w-${slug}", "title": "${humanTitle}" } },
{ "type": "widget-script", "slug": "${slug}", "params": { "widgetId": "w-${slug}", "title": "${humanTitle}" } }
\`\`\`

Then run \`node scripts/rebuild.mjs --only widget-params\` to AJV-validate the
params against this widget's schema, and \`node scripts/rebuild.mjs\` for the
full chain (including the byte-identical round-trip gate).
`;

// ----- Write everything -----

mkdirSync(targetDir, { recursive: true });
writeFileSync(schemaPath, JSON.stringify(schema, null, 2) + '\n');
writeFileSync(indexPath, indexMjs);
writeFileSync(readmePath, readmeMd);

// ----- Report -----

const action = force ? 'replaced' : 'scaffolded';
console.log(`new-widget: ${action} widgets/${slug}/`);
console.log('  wrote:');
console.log(`    widgets/${slug}/schema.json`);
console.log(`    widgets/${slug}/index.mjs`);
console.log(`    widgets/${slug}/README.md`);
console.log('');
console.log('Next steps:');
console.log(`  1. Edit widgets/${slug}/schema.json to define params.`);
console.log(`  2. Edit widgets/${slug}/index.mjs to implement renderMarkup + renderScript.`);
console.log(`  3. Add a widget block to content/<topic>.json with { type: "widget", slug: "${slug}", params: {...} }.`);
console.log(`  4. Verify with: node scripts/rebuild.mjs --only widget-params`);
