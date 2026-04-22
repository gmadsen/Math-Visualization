// render.mjs — POC entry point.
// Proves the widget registry is framework-portable by rendering the
// composition-explorer widget with React, using only the widget's JSON
// schema and the params block from content/category-theory.json.
//
// Node >= 20.  No bundler, no HTML parsing, no vanilla widget code.
//
// Flags:
//   (none)    Print `params validated: OK` then the rendered widget HTML to stdout.
//   --html    Additionally wrap the output in a standalone document and write it to
//             `render.html` next to this script, so you can open it with a browser.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import CompositionExplorer from './CompositionExplorer.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

async function readJson(path) {
  const text = await readFile(path, 'utf8');
  return JSON.parse(text);
}

function findWidgetParams(content, sectionId, slug) {
  const section = (content.sections || []).find((s) => s && s.id === sectionId);
  if (!section) throw new Error(`section '${sectionId}' not found`);
  const block = (section.blocks || []).find(
    (b) => b && b.type === 'widget' && b.slug === slug,
  );
  if (!block) throw new Error(`widget block '${slug}' not found in section '${sectionId}'`);
  return block.params;
}

async function main() {
  const schemaPath  = resolve(repoRoot, 'widgets', 'composition-explorer', 'schema.json');
  const contentPath = resolve(repoRoot, 'content', 'category-theory.json');

  const [schema, content] = await Promise.all([readJson(schemaPath), readJson(contentPath)]);
  const params = findWidgetParams(content, 'cat', 'composition-explorer');

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  if (!validate(params)) {
    console.error('params validation FAILED:');
    console.error(JSON.stringify(validate.errors, null, 2));
    process.exit(1);
  }
  console.log('params validated: OK');

  const html = ReactDOMServer.renderToString(
    React.createElement(CompositionExplorer, params),
  );
  console.log(html);

  if (process.argv.includes('--html')) {
    const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>React consumer POC — ${params.title}</title>
<style>
  body { font: 15px/1.5 system-ui, sans-serif; background: #111; color: #e8e8e8; margin: 0; padding: 24px; }
  .note { max-width: 620px; margin: 0 auto 18px; color: #9aa; }
  .note code { background: #222; padding: 2px 6px; border-radius: 3px; }
  .widget { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 16px; max-width: 660px; margin: 0 auto; }
  .widget-title { margin: 0 0 4px; font-size: 16px; }
  .widget-hint { margin: 0 0 12px; color: #888; font-size: 13px; }
  .widget-output { background: #0c0c0c; border: 1px solid #222; border-radius: 4px; padding: 8px; margin: 10px 0; min-height: 1.4em; }
  .widget-legend { color: #888; font-size: 12px; margin: 8px 0 0; }
  .widget-reset { background: #222; color: #e8e8e8; border: 1px solid #333; padding: 4px 10px; border-radius: 4px; cursor: pointer; }
  svg circle { fill: #e8e8e8; stroke: #111; }
  svg text { fill: #111; }
  svg [data-morphism-label] { fill: #8ad; }
</style>
</head>
<body>
<p class="note">Rendered by <code>ReactDOMServer.renderToString</code> from only
<code>widgets/composition-explorer/schema.json</code> and the <code>params</code>
block in <code>content/category-theory.json</code> — no HTML parsing, no vanilla-JS
widget code. Static SSR; no client-side interactivity.</p>
${html}
</body>
</html>
`;
    const outPath = resolve(__dirname, 'render.html');
    await writeFile(outPath, doc, 'utf8');
    console.error(`wrote ${outPath}`);
  }
}

main().catch((err) => {
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
});
