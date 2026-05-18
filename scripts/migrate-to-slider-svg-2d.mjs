#!/usr/bin/env node
// migrate-to-slider-svg-2d.mjs — convert verbatim-renderer slider widgets
// to the typed slider-svg-2d renderer.
//
// Usage:
//   node scripts/migrate-to-slider-svg-2d.mjs <topic-slug> <verbatim-slug> [<verbatim-slug>…]
//
// Behaviour:
//   - Loads content/<topic-slug>.json
//   - For each widget block whose slug matches an input slug:
//       parse the verbatim bodyMarkup to extract typed slider-svg-2d params
//       replace the widget block's slug → "slider-svg-2d" and params → the new shape
//   - Refuses to write if the new params would not render byte-identical
//     to the original bodyMarkup (safety guard).
//   - Saves content/<topic-slug>.json via the json-block-writer's atomic save.
//
// After running, also remove the old widget directories
// (widgets/<verbatim-slug>/) and re-run rebuild — test-roundtrip will
// re-render the topic HTML from the new JSON.

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadTopicContent,
  saveTopicContent,
} from './lib/json-block-writer.mjs';
import { renderMarkup as renderSliderSvg2d } from '../widgets/slider-svg-2d/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const argv = process.argv.slice(2);
if (argv.length < 2) {
  console.error('Usage: node scripts/migrate-to-slider-svg-2d.mjs <topic> <verbatim-slug> [...]');
  process.exit(2);
}
const topicSlug = argv[0];
const wantSlugs = new Set(argv.slice(1));

// ---------------------------------------------------------------------------
// Parse a verbatim bodyMarkup string into slider-svg-2d typed params.

function parseControls(rowInner) {
  // Match <label>...<input id="..." type="range" min="..." max="..." [step="..."] value="..."></label>
  // <button id="...">text</button>
  // <span id="..." class="..."></span> or <span id="..."></span>
  const controls = [];
  let i = 0;
  while (i < rowInner.length) {
    // Skip whitespace
    while (i < rowInner.length && /\s/.test(rowInner[i])) i++;
    if (i >= rowInner.length) break;

    if (rowInner.startsWith('<label>', i)) {
      const endIdx = rowInner.indexOf('</label>', i);
      if (endIdx < 0) throw new Error('unterminated <label> in .row');
      const inner = rowInner.slice(i + '<label>'.length, endIdx);
      // <label> contains label text + <input ...>
      const inputMatch = inner.match(/<input\s+([^>]+?)\s*\/?>/);
      if (!inputMatch) throw new Error('label without <input>: ' + inner);
      const inputAttrs = inputMatch[1];
      const labelText = inner.slice(0, inputMatch.index).trimEnd();
      const get = (name) => {
        const m = inputAttrs.match(new RegExp(`\\b${name}="([^"]*)"`));
        return m ? m[1] : null;
      };
      if (get('type') !== 'range') {
        throw new Error('non-range input in .row not supported by slider-svg-2d: ' + inputAttrs);
      }
      const slider = {
        type: 'slider',
        id: get('id'),
        label: labelText,
        min: Number(get('min')),
        max: Number(get('max')),
        value: Number(get('value')),
      };
      const step = get('step');
      if (step !== null) slider.step = Number(step);
      controls.push(slider);
      i = endIdx + '</label>'.length;
    } else if (rowInner.startsWith('<button', i)) {
      const closeStart = rowInner.indexOf('>', i);
      const endIdx = rowInner.indexOf('</button>', closeStart);
      if (endIdx < 0) throw new Error('unterminated <button>');
      const openTag = rowInner.slice(i, closeStart + 1);
      const text = rowInner.slice(closeStart + 1, endIdx);
      const idMatch = openTag.match(/\bid="([^"]+)"/);
      if (!idMatch) throw new Error('<button> without id: ' + openTag);
      controls.push({ type: 'button', id: idMatch[1], text });
      i = endIdx + '</button>'.length;
    } else if (rowInner.startsWith('<span', i)) {
      const closeStart = rowInner.indexOf('>', i);
      const endIdx = rowInner.indexOf('</span>', closeStart);
      if (endIdx < 0) throw new Error('unterminated <span>');
      const openTag = rowInner.slice(i, closeStart + 1);
      const text = rowInner.slice(closeStart + 1, endIdx);
      const idMatch = openTag.match(/\bid="([^"]+)"/);
      const classMatch = openTag.match(/\bclass="([^"]+)"/);
      if (!idMatch) throw new Error('<span> without id: ' + openTag);
      const span = { type: 'span', id: idMatch[1] };
      if (classMatch && classMatch[1] !== 'small') span.class = classMatch[1];
      if (text !== '') span.text = text;
      controls.push(span);
      i = endIdx + '</span>'.length;
    } else {
      throw new Error('unexpected token in .row at offset ' + i + ': ' + rowInner.slice(i, i + 40));
    }
  }
  return controls;
}

function parseVerbatimMarkup(bodyMarkup) {
  // Expected shape:
  // <div class="widget">
  //   <div class="hd"><div class="ttl">{title}</div><div class="hint">{hint}</div></div>
  //   <div class="row">
  //     <controls>
  //   </div>
  //   <svg id="..." viewBox="..." width="..." height="..."><title>{title}</title></svg>
  //   <div class="readout" id="..."></div>
  // </div>

  const titleMatch = bodyMarkup.match(/<div class="ttl">([\s\S]*?)<\/div>/);
  const hintMatch  = bodyMarkup.match(/<div class="hint">([\s\S]*?)<\/div>/);
  if (!titleMatch || !hintMatch) throw new Error('could not parse .hd > .ttl/.hint');
  const title = titleMatch[1];
  const hint  = hintMatch[1];

  // Find <div class="row"> ... </div> block — be careful with nested divs:
  // these widgets' rows contain only <label>, <button>, <span> (no nested divs).
  const rowStart = bodyMarkup.indexOf('<div class="row">');
  if (rowStart < 0) throw new Error('missing <div class="row">');
  const rowOpenEnd = rowStart + '<div class="row">'.length;
  const rowEnd = bodyMarkup.indexOf('</div>', rowOpenEnd);
  if (rowEnd < 0) throw new Error('unterminated <div class="row">');
  const rowInner = bodyMarkup.slice(rowOpenEnd, rowEnd).trim();
  const controls = parseControls(rowInner);

  const svgMatch = bodyMarkup.match(
    /<svg\s+id="([^"]+)"\s+viewBox="([^"]+)"\s+width="([^"]+)"\s+height="([^"]+)">/
  );
  if (!svgMatch) throw new Error('could not parse <svg> open tag');
  const svg = {
    id: svgMatch[1],
    viewBox: svgMatch[2],
    width: Number(svgMatch[3]),
    height: Number(svgMatch[4]),
  };

  // Readout: either `<div class="readout" id="...-readout"></div>` or absent.
  const readoutMatch = bodyMarkup.match(/<div class="readout" id="([^"]+)"><\/div>/);
  let readout = false;
  if (readoutMatch) {
    const expectedId = svg.id.endsWith('-svg') ? svg.id.slice(0, -4) + '-readout' : null;
    if (expectedId === readoutMatch[1]) {
      readout = true;
    } else {
      readout = { id: readoutMatch[1] };
    }
  }

  return { title, hint, controls, svg, readout };
}

// ---------------------------------------------------------------------------

const doc = loadTopicContent(topicSlug, repoRoot);

let migrated = 0;
let failed = 0;

for (const section of doc.sections) {
  for (const block of section.blocks) {
    if (block.type !== 'widget' || !wantSlugs.has(block.slug)) continue;
    const old = block.params;
    if (typeof old.bodyMarkup !== 'string') {
      console.warn(`  ${block.slug}: not a verbatim slug (no bodyMarkup), skipping`);
      continue;
    }
    let typed;
    try {
      typed = parseVerbatimMarkup(old.bodyMarkup);
    } catch (e) {
      // Surface enough context for the developer to know WHICH widget on
      // WHICH topic and at WHICH section the parser tripped — and reprint
      // the markup head so the failure isn't indistinguishable from a
      // parser bug vs an unexpected widget shape.
      console.error(
        `  ${topicSlug} § ${section.id} slug=${block.slug}: parse error — ${e.message}\n` +
        `    markup head: ${(old.bodyMarkup || '').replace(/\s+/g, ' ').slice(0, 160)}…`
      );
      failed++;
      continue;
    }

    const newParams = {
      widgetId: old.widgetId || '',
      title: typed.title,
      hint:  typed.hint,
      controls: typed.controls,
      svg: typed.svg,
      readout: typed.readout,
      bodyScript: old.bodyScript || '',
    };

    // Safety: re-render and require byte-identity vs original bodyMarkup.
    const rendered = renderSliderSvg2d(newParams);
    if (rendered !== old.bodyMarkup) {
      console.error(`  ${block.slug}: byte-identity check FAILED — refusing to migrate`);
      console.error('--- expected ---');
      console.error(old.bodyMarkup);
      console.error('--- actual ---');
      console.error(rendered);
      failed++;
      continue;
    }

    block.slug = 'slider-svg-2d';
    block.params = newParams;
    migrated++;
    console.log(`  ${block.slug}: migrated (was ${old.bodyMarkup.length} bytes opaque, now typed)`);
  }
}

if (failed > 0) {
  console.error(`migrate-to-slider-svg-2d: ${failed} failure(s); refusing to save`);
  process.exit(1);
}

if (migrated === 0) {
  console.log('migrate-to-slider-svg-2d: nothing to migrate');
  process.exit(0);
}

saveTopicContent(topicSlug, doc, repoRoot);
console.log(`migrate-to-slider-svg-2d: migrated ${migrated} widget(s) in ${topicSlug}`);
