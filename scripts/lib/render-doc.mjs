// Shared rendering helpers for content/<topic>.json documents.
//
// render-topic.mjs is a CLI wrapper around the same logic; this module
// exists so non-CLI consumers (audit-inline-links --fix, future
// JSON-aware injectors) can:
//   - render an in-memory `doc` to its HTML bytes, identical to what
//     render-topic.mjs writes to stdout, and
//   - obtain a block-offset map so that a candidate found in the
//     rendered HTML can be located back to its source block in the JSON.
//
// Why the offset map matters: most injectors compute candidates from
// the rendered HTML stream (because that's what the reader sees and
// what authors edit visually), but to be JSON-source-safe they need
// to write back into the source block, not the rendered HTML. The
// offset map closes that gap.

import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..', '..');

const widgetModuleCache = new Map();

async function loadWidgetModule(slug) {
  if (widgetModuleCache.has(slug)) return widgetModuleCache.get(slug);
  const modPath = resolve(repoRoot, 'widgets', slug, 'index.mjs');
  const mod = await import(pathToFileURL(modPath).href);
  widgetModuleCache.set(slug, mod);
  return mod;
}

function buildWidgetById(doc) {
  const map = new Map();
  for (const section of doc.sections) {
    for (const block of section.blocks) {
      if (block.type === 'widget' && block.slug && block.params?.widgetId) {
        const id = block.params.widgetId;
        if (map.has(id)) {
          throw new Error(
            `render-doc: duplicate widgetId "${id}" in topic — ref-based ` +
            `widget-script lookups are ambiguous.`,
          );
        }
        map.set(id, block);
      }
    }
  }
  return map;
}

async function renderBlock(block, widgetById) {
  if (block.type === 'widget') {
    if (block.slug) {
      const mod = await loadWidgetModule(block.slug);
      return mod.renderMarkup(block.params);
    }
    return block.html + (block.script || '');
  }
  if (block.type === 'widget-script') {
    if (block.ref) {
      const w = widgetById.get(block.ref);
      if (!w) throw new Error(`widget-script ref="${block.ref}" not found`);
      const mod = await loadWidgetModule(w.slug);
      return mod.renderScript(w.params);
    }
    return block.html;
  }
  // raw / quiz: html verbatim.
  return block.html;
}

/**
 * Render an in-memory content/<topic>.json doc to its full HTML string.
 * Byte-identical to render-topic.mjs's stdout.
 */
export async function renderDoc(doc) {
  const widgetById = buildWidgetById(doc);
  const parts = [];
  for (const section of doc.sections) {
    for (const block of section.blocks) {
      parts.push(await renderBlock(block, widgetById));
    }
  }
  return doc.rawHead + doc.rawBodyPrefix + parts.join('') + doc.rawBodySuffix;
}

/**
 * Render the doc AND return a flat list of ranges so callers can map a
 * byte offset in the rendered HTML back to its source location.
 *
 * Each range entry is one of:
 *   { kind: 'rawHead',       start, end, content }
 *   { kind: 'rawBodyPrefix', start, end, content }
 *   { kind: 'rawBodySuffix', start, end, content }
 *   { kind: 'block', sectionIdx, blockIdx, block, start, end, render }
 *
 * Ranges are returned in ascending start order, contiguous, with
 * end[i] === start[i+1] and the final end equal to the rendered HTML
 * length.
 */
export async function renderDocWithRanges(doc) {
  const widgetById = buildWidgetById(doc);
  const ranges = [];
  let offset = 0;

  ranges.push({
    kind: 'rawHead',
    start: offset,
    end: offset + doc.rawHead.length,
    content: doc.rawHead,
  });
  offset += doc.rawHead.length;

  ranges.push({
    kind: 'rawBodyPrefix',
    start: offset,
    end: offset + doc.rawBodyPrefix.length,
    content: doc.rawBodyPrefix,
  });
  offset += doc.rawBodyPrefix.length;

  for (let si = 0; si < doc.sections.length; si++) {
    const section = doc.sections[si];
    for (let bi = 0; bi < section.blocks.length; bi++) {
      const block = section.blocks[bi];
      const render = await renderBlock(block, widgetById);
      ranges.push({
        kind: 'block',
        sectionIdx: si,
        blockIdx: bi,
        block,
        start: offset,
        end: offset + render.length,
        render,
      });
      offset += render.length;
    }
  }

  ranges.push({
    kind: 'rawBodySuffix',
    start: offset,
    end: offset + doc.rawBodySuffix.length,
    content: doc.rawBodySuffix,
  });

  return { ranges, html: ranges.map((r) => r.content ?? r.render).join('') };
}

/**
 * Find the range containing the given global byte offset.
 * Linear scan — ranges are typically O(100) per page so binary search
 * is unnecessary.
 */
export function findRangeAt(ranges, globalIdx) {
  for (const r of ranges) {
    if (globalIdx >= r.start && globalIdx < r.end) return r;
  }
  return null;
}
