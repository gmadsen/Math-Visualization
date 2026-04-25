#!/usr/bin/env node
/**
 * repair-widget-scripts.mjs
 *
 * Phase C follow-up repair pass. Walks every content/<topic>.json and splits
 * existing `raw` blocks whose body contains `<script>` tags that drive a
 * specific widget but were not auto-paired by the original
 * extract-topic.mjs heuristic (which only looked for a script IMMEDIATELY
 * following the widget's </div>).
 *
 * For each script we find inside a raw block, we compute the set of widget
 * ids referenced via $('#id'), getElementById('id'), querySelector('#id').
 * When exactly one widget is referenced, we split the raw block at that
 * script's byte range, producing:
 *
 *   [raw-before,  widget-script{forWidget, html},  raw-after]
 *
 * Multiple paired scripts in one raw block are fine — we fold all of them at
 * once. When a single script references 0 widgets (page-level glue) we leave
 * it alone. When a single script references >1 widgets (shared IIFE) we
 * leave the ENTIRE raw block alone — safer than partial splitting.
 *
 * rawBodyPrefix and rawBodySuffix are NOT modified. Some topics have their
 * widget scripts there; repairing those requires data-model changes which
 * are outside the scope of this script.
 *
 * Byte-identical round-trip is guaranteed: we only change block BOUNDARIES
 * inside existing raw strings. We verify by re-rendering each topic and
 * comparing to the on-disk HTML.
 *
 * Usage:
 *   node scripts/repair-widget-scripts.mjs [--dry] [--topic <slug>]
 *
 * Without --topic: processes every content/*.json.
 * Without --dry:   writes updated JSONs in place.
 */

import {
  readFileSync,
  writeFileSync,
  readdirSync,
} from 'node:fs';
import { dirname, resolve, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');
const contentDir = join(repoRoot, 'content');

// ----- shared helpers (mirror extract-topic.mjs) ------------------------------

function widgetIdSet(widgetBlock) {
  const ids = new Set();
  if (widgetBlock.id) ids.add(widgetBlock.id);
  // Descendant ids carried in html (inline widget) OR in params (registry widget)
  const idAttrRe = /\bid="([^"]+)"/g;
  const html = widgetBlock.html || '';
  let m;
  while ((m = idAttrRe.exec(html)) !== null) ids.add(m[1]);
  // If slug-driven, the registry module builds the HTML, so the html field
  // isn't populated on disk. Pull ids out of the params object instead.
  const p = widgetBlock.params;
  if (p && typeof p === 'object') collectParamIds(p, ids);
  return ids;
}

function collectParamIds(obj, out) {
  if (obj == null) return;
  if (Array.isArray(obj)) {
    for (const x of obj) collectParamIds(x, out);
    return;
  }
  if (typeof obj !== 'object') return;
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string' && /Id$|^id$|IdSuffix$/.test(k) && /^[A-Za-z_][\w-]*$/.test(v)) {
      out.add(v);
    }
    // Common shapes: {id: "..."}, {svgId:"..."}, etc. — covered above.
    // Recurse into nested structures (sliders, buttons, pick.options, etc.)
    collectParamIds(v, out);
  }
}

// Find every <script>...</script> inside an html string. Returns
// [{start, end, tagEnd, full, inner}].
function findScripts(html) {
  const out = [];
  const OPEN = '<script';
  const OPEN_CLOSE = '</script>';
  let i = 0;
  while (i < html.length) {
    const o = html.indexOf(OPEN, i);
    if (o === -1) break;
    const after = html.charCodeAt(o + OPEN.length);
    if (!(after === 32 || after === 9 || after === 10 || after === 13 || after === 62)) {
      i = o + OPEN.length;
      continue;
    }
    const tagEnd = html.indexOf('>', o);
    if (tagEnd === -1) break;
    const close = html.indexOf(OPEN_CLOSE, tagEnd + 1);
    if (close === -1) break;
    const end = close + OPEN_CLOSE.length;
    out.push({
      start: o,
      end,
      tagEnd,
      full: html.slice(o, end),
      inner: html.slice(tagEnd + 1, close),
    });
    i = end;
  }
  return out;
}

function referencedIdsInScript(scriptInner) {
  const ids = new Set();
  const dollarRe = /\$\(\s*['"]#([A-Za-z_][\w-]*)['"]/g;
  const gebRe = /getElementById\(\s*['"]([A-Za-z_][\w-]*)['"]/g;
  const qsRe = /querySelector(?:All)?\(\s*['"]#([A-Za-z_][\w-]*)/g;
  let m;
  while ((m = dollarRe.exec(scriptInner)) !== null) ids.add(m[1]);
  while ((m = gebRe.exec(scriptInner)) !== null) ids.add(m[1]);
  while ((m = qsRe.exec(scriptInner)) !== null) ids.add(m[1]);
  return ids;
}

// ----- repair core ------------------------------------------------------------

function buildIdToWidget(doc) {
  // Map every widget-owned id → its widget id. Ambiguous ids get AMBIG.
  const idToWidget = new Map();
  for (const s of doc.sections) {
    for (const b of s.blocks) {
      if (b.type !== 'widget') continue;
      const ids = widgetIdSet(b);
      for (const id of ids) {
        if (idToWidget.has(id) && idToWidget.get(id) !== b.id) {
          idToWidget.set(id, 'AMBIG');
        } else {
          idToWidget.set(id, b.id);
        }
      }
    }
  }
  return idToWidget;
}

// For a single raw block's html, return either:
//   { kind: 'noop' }                 — nothing to do
//   { kind: 'bailed', reason }        — scripts present but ambiguous/multi-widget
//   { kind: 'split', newBlocks: [...], paired: [widgetIds...] }
function repairRawBlock(rawHtml, idToWidget) {
  if (!rawHtml.includes('<script')) return { kind: 'noop' };
  const scripts = findScripts(rawHtml);
  if (scripts.length === 0) return { kind: 'noop' };

  // Classify each script.
  const classified = scripts.map(sc => {
    const ids = referencedIdsInScript(sc.inner);
    const widgets = new Set();
    for (const id of ids) {
      const wid = idToWidget.get(id);
      if (wid && wid !== 'AMBIG') widgets.add(wid);
    }
    return { sc, widgets };
  });

  // A script is "pairable" iff it references exactly one widget.
  const pairable = classified.filter(c => c.widgets.size === 1);
  const multiWidget = classified.filter(c => c.widgets.size > 1);

  if (pairable.length === 0) return { kind: 'noop' };

  // If any script references multiple widgets, bail conservatively —
  // splitting around a shared-data script can leave pairing downstream code
  // referring to the now-detached data constants.
  if (multiWidget.length > 0) {
    return { kind: 'bailed', reason: 'multi-widget-script-in-block' };
  }

  // Build the new block sequence by walking pairable scripts in order.
  const newBlocks = [];
  const paired = [];
  let cursor = 0;
  for (const c of pairable) {
    const { sc } = c;
    if (sc.start > cursor) {
      newBlocks.push({ type: 'raw', html: rawHtml.slice(cursor, sc.start) });
    }
    const widget = [...c.widgets][0];
    newBlocks.push({
      type: 'widget-script',
      forWidget: widget,
      html: rawHtml.slice(sc.start, sc.end),
    });
    paired.push(widget);
    cursor = sc.end;
  }
  if (cursor < rawHtml.length) {
    newBlocks.push({ type: 'raw', html: rawHtml.slice(cursor) });
  }
  // Filter empty raw blocks defensively.
  const final = newBlocks.filter(b => !(b.type === 'raw' && b.html.length === 0));
  return { kind: 'split', newBlocks: final, paired };
}

function repairDoc(doc) {
  const idToWidget = buildIdToWidget(doc);
  const stats = { pairedScripts: 0, pairedWidgets: [], bailed: 0, suffixRepaired: false };

  for (const sec of doc.sections) {
    const outBlocks = [];
    for (const b of sec.blocks) {
      if (b.type !== 'raw') {
        outBlocks.push(b);
        continue;
      }
      const r = repairRawBlock(b.html, idToWidget);
      if (r.kind === 'split') {
        outBlocks.push(...r.newBlocks);
        stats.pairedScripts += r.paired.length;
        stats.pairedWidgets.push(...r.paired);
      } else if (r.kind === 'bailed') {
        stats.bailed += 1;
        outBlocks.push(b);
      } else {
        outBlocks.push(b);
      }
    }
    sec.blocks = outBlocks;
  }

  // rawBodySuffix repair: many topics dump all their widget scripts after
  // </main>. Since render-topic.mjs renders `sections + rawBodySuffix`
  // byte-for-byte, we can repartition: move the suffix bytes into new
  // blocks at the tail of the last section, and empty out rawBodySuffix.
  // This only fires when the suffix contains at least one pairable script.
  if (doc.rawBodySuffix && doc.rawBodySuffix.includes('<script')) {
    const r = repairRawBlock(doc.rawBodySuffix, idToWidget);
    if (r.kind === 'split' && r.paired.length > 0) {
      const lastSec = doc.sections[doc.sections.length - 1];
      lastSec.blocks.push(...r.newBlocks);
      doc.rawBodySuffix = '';
      stats.pairedScripts += r.paired.length;
      stats.pairedWidgets.push(...r.paired);
      stats.suffixRepaired = true;
    } else if (r.kind === 'bailed') {
      stats.bailed += 1;
    }
  }
  // rawBodyPrefix repair: much rarer — most prefixes have no widget scripts.
  if (doc.rawBodyPrefix && doc.rawBodyPrefix.includes('<script')) {
    const r = repairRawBlock(doc.rawBodyPrefix, idToWidget);
    if (r.kind === 'split' && r.paired.length > 0) {
      const firstSec = doc.sections[0];
      firstSec.blocks.unshift(...r.newBlocks);
      doc.rawBodyPrefix = '';
      stats.pairedScripts += r.paired.length;
      stats.pairedWidgets.push(...r.paired);
    }
  }
  return stats;
}

// ----- verification helper ----------------------------------------------------

function md5(buf) {
  return createHash('md5').update(buf).digest('hex');
}

function verifyRoundtrip(topicSlug) {
  const htmlPath = resolve(repoRoot, `${topicSlug}.html`);
  const r = spawnSync(
    process.execPath,
    [resolve(__dirname, 'render-topic.mjs'), topicSlug],
    { encoding: 'utf8' }
  );
  if (r.status !== 0) {
    return { ok: false, reason: `render-topic exit ${r.status}: ${r.stderr}` };
  }
  const rendered = r.stdout;
  const onDisk = readFileSync(htmlPath, 'utf8');
  if (rendered === onDisk) return { ok: true };
  return {
    ok: false,
    reason: `bytes differ (rendered ${rendered.length} vs disk ${onDisk.length}; md5 ${md5(rendered)} vs ${md5(onDisk)})`,
  };
}

// ----- CLI --------------------------------------------------------------------

function listContentTopics(only) {
  if (only) return [only];
  return readdirSync(contentDir)
    .filter(f => f.endsWith('.json'))
    .map(f => basename(f, '.json'))
    .sort();
}

function main() {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry');
  const topicIdx = args.indexOf('--topic');
  const only = topicIdx >= 0 ? args[topicIdx + 1] : null;
  const verbose = args.includes('--verbose');

  const topics = listContentTopics(only);

  const perTopic = [];
  let totalPaired = 0;
  let totalBailed = 0;
  let verifyFailures = 0;

  for (const topic of topics) {
    const jsonPath = join(contentDir, `${topic}.json`);
    const original = readFileSync(jsonPath, 'utf8');
    const doc = JSON.parse(original);
    const stats = repairDoc(doc);

    if (stats.pairedScripts === 0 && stats.bailed === 0) {
      if (verbose) console.log(`${topic}: no changes`);
      perTopic.push({ topic, paired: 0, bailed: 0, widgets: [] });
      continue;
    }

    totalPaired += stats.pairedScripts;
    totalBailed += stats.bailed;

    if (!dry) {
      const updated = JSON.stringify(doc, null, 2);
      writeFileSync(jsonPath, updated);
      // Verify byte-identical round-trip.
      const v = verifyRoundtrip(topic);
      if (!v.ok) {
        // Roll back on failure.
        writeFileSync(jsonPath, original);
        verifyFailures += 1;
        console.log(`${topic}: repaired ${stats.pairedScripts} script(s) but ROUNDTRIP FAILED (${v.reason}); reverted`);
        perTopic.push({ topic, paired: 0, bailed: stats.bailed, widgets: [], reverted: true });
        continue;
      }
    }

    const uniqueWidgets = [...new Set(stats.pairedWidgets)];
    perTopic.push({ topic, paired: stats.pairedScripts, bailed: stats.bailed, widgets: uniqueWidgets });
    console.log(`${topic}: paired ${stats.pairedScripts} script(s) (${uniqueWidgets.length} widgets: ${uniqueWidgets.join(', ')})${stats.bailed ? `, bailed ${stats.bailed}` : ''}`);
  }

  console.log('');
  console.log(`--- repair-widget-scripts summary ---`);
  console.log(`topics processed:      ${topics.length}`);
  console.log(`scripts paired total:  ${totalPaired}`);
  console.log(`raw blocks bailed:     ${totalBailed}`);
  console.log(`roundtrip rollbacks:   ${verifyFailures}`);
  if (dry) console.log('(dry run; no files written)');
}

main();
