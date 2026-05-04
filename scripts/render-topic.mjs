#!/usr/bin/env node
/**
 * render-topic.mjs — phase 1 pilot inverse of extract-topic.mjs.
 *
 * Reads content/<topic>.json and prints the reconstructed HTML to stdout.
 * The output must be byte-identical to the source HTML so that the round
 * trip (html -> json -> html) is lossless; callers redirect stdout to a
 * file if they want to persist.
 *
 * Usage: node scripts/render-topic.mjs <topic-slug>  > path/to/out.html
 *
 * Block types supported:
 *   raw              — verbatim bytes (html field)
 *   quiz             — verbatim quiz stub (html field)
 *   widget           — either inline (html + optional script) or registry-driven
 *                      (slug + params).  When slug is present, the widget
 *                      module at widgets/<slug>/index.mjs is imported and
 *                      renderMarkup(params) is called; that module's output
 *                      must match the original inline bytes exactly.
 *   widget-script    — registry-driven script block. Three forms:
 *                        (a) {ref: widgetId} — looks up the widget block by
 *                            widgetId, calls renderScript on its slug+params.
 *                            This is the canonical form: it eliminates ~5KB
 *                            of duplicated params per widget.
 *                        (b) {slug, params} — legacy duplicated form. Kept
 *                            for back-compat; new content should use (a).
 *                        (c) {forWidget, html} — verbatim inline script with
 *                            a back-reference (Phase 3 auto-detect).
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');

const widgetModuleCache = new Map();

async function loadWidgetModule(slug) {
  if (widgetModuleCache.has(slug)) return widgetModuleCache.get(slug);
  const modPath = resolve(repoRoot, 'widgets', slug, 'index.mjs');
  const mod = await import(pathToFileURL(modPath).href);
  widgetModuleCache.set(slug, mod);
  return mod;
}

async function renderBlock(b, widgetById) {
  if (b.type === 'widget') {
    if (b.slug) {
      const mod = await loadWidgetModule(b.slug);
      return mod.renderMarkup(b.params);
    }
    return b.html + (b.script || '');
  }
  if (b.type === 'widget-script') {
    // Canonical form: ref by widgetId — looks up the widget block elsewhere
    // in the doc and uses its slug+params. Eliminates duplicated params.
    if (b.ref) {
      const w = widgetById.get(b.ref);
      if (!w) throw new Error(`widget-script ref="${b.ref}" not found in widget blocks`);
      const mod = await loadWidgetModule(w.slug);
      return mod.renderScript(w.params);
    }
    // Legacy form: slug + params duplicated from the widget block.
    if (b.slug) {
      const mod = await loadWidgetModule(b.slug);
      return mod.renderScript(b.params);
    }
    // Phase 3 auto-detected: verbatim html with forWidget back-reference.
    return b.html;
  }
  // raw / quiz both carry their html verbatim.
  return b.html;
}

function buildWidgetById(doc) {
  const map = new Map();
  for (const section of doc.sections) {
    for (const block of section.blocks) {
      if (block.type === 'widget' && block.slug && block.params?.widgetId) {
        map.set(block.params.widgetId, block);
      }
    }
  }
  return map;
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: node scripts/render-topic.mjs <topic-slug>');
    process.exit(2);
  }
  const inPath = resolve(repoRoot, 'content', `${slug}.json`);
  const doc = JSON.parse(readFileSync(inPath, 'utf8'));

  const widgetById = buildWidgetById(doc);
  const parts = [];
  for (const section of doc.sections) {
    for (const block of section.blocks) {
      parts.push(await renderBlock(block, widgetById));
    }
  }
  const out = doc.rawHead + doc.rawBodyPrefix + parts.join('') + doc.rawBodySuffix;
  process.stdout.write(out);
}

main();
