#!/usr/bin/env node
// Migrate one inline `widget` block + its paired `widget-script` block in
// content/<topic>.json into a bespoke artifact-style registry slug.
//
// Usage:
//   node scripts/migrate-inline-widget.mjs <topic> <widgetId> <new-slug>
//     [--description "what this widget does and why it's a one-off"]
//     [--gesture click|drag|slider|step|...]
//     [--role exploratory|illustrative|construction|...]
//     [--dimension 2d|3d]
//
// Produces:
//   - widgets/<new-slug>/schema.json   (artifact-style: widgetId, title, hint,
//                                       bodyMarkup, sectionComment, bodyScript)
//   - widgets/<new-slug>/index.mjs     (renderMarkup + renderScript stubs;
//                                       byte-identical to the inline widget's
//                                       wrapper convention)
//   - widgets/<new-slug>/README.md     (brief description of what it does)
//   - content/<topic>.json patched in place: the widget + widget-script blocks
//     are rewritten to reference `slug + params`, dropping the inline html.
//
// After migration, run `node scripts/rebuild.mjs --no-fix` to verify
// byte-identical roundtrip. Failure means the extraction below didn't capture
// the original layout exactly — usually a whitespace mismatch between the
// renderer's wrapper template and the inline widget's actual indentation.
//
// Zero dependencies.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

// ----- args -----
const argv = process.argv.slice(2);
function flag(name) {
  const i = argv.indexOf(name);
  return i === -1 ? null : argv[i + 1] ?? null;
}
const positional = argv.filter((a, i) =>
  !a.startsWith('--') && !(i > 0 && argv[i - 1]?.startsWith('--'))
);
const [topic, widgetId, newSlug] = positional;
if (!topic || !widgetId || !newSlug) {
  console.error('usage: node scripts/migrate-inline-widget.mjs <topic> <widgetId> <new-slug>');
  console.error('         [--description "..."] [--gesture G] [--role R] [--dimension 2d|3d]');
  process.exit(2);
}

const description =
  flag('--description') ??
  `Bespoke widget for the [${widgetId}](#) figure on the ${topic} topic. TODO: describe what gestures the reader performs and why this didn't fit a shared slug.`;
const metaGesture = flag('--gesture') ?? 'click';
const metaRole = flag('--role') ?? 'exploratory';
const metaDimension = flag('--dimension') ?? '2d';

// ----- locate blocks -----
const contentPath = join(repoRoot, 'content', `${topic}.json`);
if (!existsSync(contentPath)) {
  console.error(`migrate: content/${topic}.json not found`);
  process.exit(1);
}
const contentDoc = JSON.parse(readFileSync(contentPath, 'utf8'));

let widgetBlockRef = null;
let scriptBlockRef = null;
for (const sec of contentDoc.sections || []) {
  for (let i = 0; i < (sec.blocks || []).length; i++) {
    const b = sec.blocks[i];
    if (b.type === 'widget' && !b.slug && b.id === widgetId) widgetBlockRef = { sec, i, block: b };
    if (b.type === 'widget-script' && b.forWidget === widgetId) scriptBlockRef = { sec, i, block: b };
  }
}
if (!widgetBlockRef) {
  console.error(`migrate: no inline widget block with id="${widgetId}" found in content/${topic}.json`);
  process.exit(1);
}
if (!scriptBlockRef) {
  console.error(`migrate: no widget-script block with forWidget="${widgetId}" found`);
  process.exit(1);
}

// ----- extract title, hint, bodyMarkup -----
//
// Expected widget html shape:
//
//   <div class="widget" id="WIDGETID">
//     <div class="hd"><div class="ttl">TITLE</div><div class="hint">HINT</div></div>
//     BODY
//   </div>
//
// where BODY is everything between the .hd's closing </div> + newline and
// the wrapper's closing </div>. The new renderer template (mirroring
// widgets/three-body-halo-orbits/index.mjs) emits:
//
//   `<div class="widget" id="${widgetId}">\n  <div class="hd">…</div>\n${bodyMarkup}\n</div>`
//
// so bodyMarkup is BODY minus the trailing "\n" before the closer.

const widgetHtml = widgetBlockRef.block.html;
const headerRe =
  /^<div class="widget"(?:\s+id="([^"]+)")?>\n  <div class="hd"><div class="ttl">([\s\S]*?)<\/div><div class="hint">([\s\S]*?)<\/div><\/div>\n([\s\S]*)\n<\/div>$/;
const m = widgetHtml.match(headerRe);
if (!m) {
  console.error(`migrate: widget html for "${widgetId}" doesn't match the expected header shape; manual cleanup needed first.`);
  console.error('  expected the standard `<div class="widget"…>\\n  <div class="hd">…</div>\\nBODY\\n</div>` shape.');
  process.exit(1);
}
const [, idCaptured, title, hint, bodyMarkup] = m;
if (idCaptured && idCaptured !== widgetId) {
  console.error(`migrate: id mismatch — header captured "${idCaptured}" but arg is "${widgetId}"`);
  process.exit(1);
}

// ----- extract sectionComment + bodyScript -----
//
// Expected widget-script html shape (PR #41 convention):
//
//   <script>
//   /* OPTIONAL SECTION COMMENT */
//   (function(){
//   …BODY…
//   })();
//   </script>
//
// The renderer template emits:
//
//   `<script>\n${commentLine}(function(){\n${bodyScript}\n})();\n</script>`
//
// so bodyScript is BODY (no leading/trailing newline beyond the IIFE's own).

const scriptHtml = scriptBlockRef.block.html;
const scriptRe =
  /^<script>\n(?:\/\* ([\s\S]*?) \*\/\n)?\(function\(\)\{\n([\s\S]*?)\n\}\)\(\);\n<\/script>$/;
const sm = scriptHtml.match(scriptRe);
if (!sm) {
  console.error(`migrate: widget-script html for "${widgetId}" doesn't match the expected <script>(function(){…})();</script> shape.`);
  console.error('  first 200 chars: ' + scriptHtml.slice(0, 200));
  process.exit(1);
}
const sectionComment = sm[1] || '';
const bodyScript = sm[2];

// ----- write widgets/<new-slug>/ -----
const slugDir = join(repoRoot, 'widgets', newSlug);
if (existsSync(slugDir)) {
  console.error(`migrate: widgets/${newSlug}/ already exists — pick a different slug or remove first`);
  process.exit(1);
}
mkdirSync(slugDir, { recursive: true });

const schemaJson = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: `https://math-vis.local/widgets/${newSlug}/schema.json`,
  title: `${newSlug} widget params`,
  description,
  meta: {
    family: newSlug,
    dimension: metaDimension,
    gesture: metaGesture,
    role: metaRole,
  },
  type: 'object',
  additionalProperties: false,
  required: ['widgetId', 'title', 'hint', 'bodyMarkup', 'bodyScript'],
  properties: {
    widgetId: {
      type: 'string',
      pattern: '^[A-Za-z][A-Za-z0-9_-]*$',
      description: 'DOM id for the outer <div class="widget">.',
    },
    title: {
      type: 'string',
      description: 'Header title rendered inside .hd > .ttl.',
    },
    hint: {
      type: 'string',
      description: 'Header hint rendered inside .hd > .hint.',
    },
    bodyMarkup: {
      type: 'string',
      'x-artifact':
        'verbatim inner-body HTML; portable consumers should rebuild controls + svg + readout from explicit fields once a shared shape proves out',
      description:
        'ARTIFACT. Verbatim HTML between the closing </div> of the .hd row and the closing </div> of the outer widget wrapper.',
    },
    sectionComment: {
      type: 'string',
      'x-artifact': true,
      description:
        'ARTIFACT. Optional /* ... */ banner placed between the leading <script> tag and the IIFE opener.',
    },
    bodyScript: {
      type: 'string',
      'x-artifact':
        'script body is bespoke; portable consumers should re-implement the widget logic from the schema-described data fields',
      description:
        'ARTIFACT. Verbatim JS that goes inside `(function(){\\n…\\n})();` — wires the controls and updates the SVG / readout.',
    },
  },
};
writeFileSync(join(slugDir, 'schema.json'), JSON.stringify(schemaJson, null, 2) + '\n');

const indexMjs = `// ${newSlug} widget — bespoke registry entry.
//
// ${description.replace(/\n/g, '\n// ')}
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\\n(function(){ ... })();\\n</script>

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, bodyMarkup } = params;
  return (
    \`<div class="widget"\` + (widgetId ? \` id="\${widgetId}"\` : "") + \`>\\n\` +
    \`  <div class="hd"><div class="ttl">\${escapeHtml(title)}</div><div class="hint">\${escapeHtml(hint)}</div></div>\\n\` +
    \`\${bodyMarkup}\\n\` +
    \`</div>\`
  );
}

export function renderScript(params) {
  const { sectionComment, bodyScript } = params;
  const commentLine = sectionComment ? \`/* \${sectionComment} */\\n\` : '';
  return (
    \`<script>\\n\` +
    commentLine +
    \`(function(){\\n\` +
    \`\${bodyScript}\\n\` +
    \`})();\\n\` +
    \`</script>\`
  );
}
`;
writeFileSync(join(slugDir, 'index.mjs'), indexMjs);

const readme = `# ${newSlug}

Bespoke widget for the ${topic} topic.

See [\`../README.md\`](../README.md) for the registry contract.

## What it does

${description.replace(/^TODO:.*$/m, '_TODO: prose description._')}

## Params

See [\`schema.json\`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| \`widgetId\`       | fundamental | DOM id for the outer \`<div class="widget">\`. |
| \`title\`          | fundamental | Header title. |
| \`hint\`           | fundamental | Header hint. |
| \`bodyMarkup\`     | *artifact*  | Verbatim inner-body HTML (controls, SVG, readouts). |
| \`sectionComment\` | *artifact*  | Optional \`/* ... */\` banner above the IIFE. |
| \`bodyScript\`     | *artifact*  | Verbatim IIFE body. |

## Usage

\`\`\`json
{ "type": "widget",        "slug": "${newSlug}", "params": { ... } },
{ "type": "widget-script", "slug": "${newSlug}", "params": { ... } }
\`\`\`

Both blocks carry the same \`params\` object.
`;
writeFileSync(join(slugDir, 'README.md'), readme);

// ----- patch content/<topic>.json -----
const params = { widgetId, title, hint, bodyMarkup };
if (sectionComment) params.sectionComment = sectionComment;
params.bodyScript = bodyScript;

widgetBlockRef.sec.blocks[widgetBlockRef.i] = {
  type: 'widget',
  slug: newSlug,
  params,
};
scriptBlockRef.sec.blocks[scriptBlockRef.i] = {
  type: 'widget-script',
  slug: newSlug,
  params,
};

writeFileSync(contentPath, JSON.stringify(contentDoc, null, 2) + '\n');

console.log(`migrated: ${widgetId} → widgets/${newSlug}/`);
console.log(`  wrote: widgets/${newSlug}/schema.json`);
console.log(`  wrote: widgets/${newSlug}/index.mjs`);
console.log(`  wrote: widgets/${newSlug}/README.md`);
console.log(`  patched: content/${topic}.json`);
console.log('');
console.log('Run `node scripts/rebuild.mjs --no-fix` to verify byte-identical roundtrip.');
