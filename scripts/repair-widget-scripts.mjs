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

import { findScripts, referencedIdsInScript } from './lib/script-scan.mjs';

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
// Locate every <script>…</script> on a page; identify the ids each script
// references. Implementations live in scripts/lib/script-scan.mjs (shared
// with extract-topic.mjs).

// Try to split a script body that wraps multiple per-widget IIFEs (a pattern
// seen in older topics: `<script>\n/* SECTION 1 */\n(function(){…})();\n
// /* SECTION 2 */\n(function(){…})();\n…</script>`). Returns either:
//   { kind: 'noop' } — body doesn't have multiple top-level IIFEs
//   { kind: 'split', chunks: [{ comment, body }] } — one entry per IIFE
//
// `comment` is the optional /* ... */ banner immediately before the IIFE
// (without the slashes). `body` is the verbatim IIFE statements between
// `(function(){\n` and `\n})();`. Re-rendering with the migration helper's
// per-widget renderScript template wraps each chunk back into a standalone
// <script> tag.
function splitMultiIife(scriptInner) {
  // Match `(function(){…})();` blocks. JS regexes don't balance braces, so
  // we walk the string character-by-character looking for a `(function(){`
  // opener at top level (depth 0), then balance braces until the matching
  // `}` is followed by `)();`.
  const iifes = [];
  let i = 0;
  while (i < scriptInner.length) {
    const openIdx = scriptInner.indexOf('(function(){', i);
    if (openIdx === -1) break;
    const bodyStart = openIdx + '(function(){'.length;
    let depth = 1;
    let cursor = bodyStart;
    let inStr = null;
    let inLineComment = false;
    let inBlockComment = false;
    while (cursor < scriptInner.length && depth > 0) {
      const c = scriptInner[cursor];
      const next = scriptInner[cursor + 1];
      if (inStr) {
        if (c === '\\') { cursor += 2; continue; }
        if (c === inStr) inStr = null;
      } else if (inLineComment) {
        if (c === '\n') inLineComment = false;
      } else if (inBlockComment) {
        if (c === '*' && next === '/') { inBlockComment = false; cursor += 2; continue; }
      } else {
        if (c === '/' && next === '/') { inLineComment = true; cursor += 2; continue; }
        if (c === '/' && next === '*') { inBlockComment = true; cursor += 2; continue; }
        if (c === '"' || c === "'" || c === '`') inStr = c;
        else if (c === '{') depth++;
        else if (c === '}') depth--;
      }
      cursor++;
    }
    if (depth !== 0) return { kind: 'noop' }; // unbalanced
    // After the closing `}` we expect `)();` (allowing whitespace).
    // When we exit the loop with depth=0, `cursor` points one past the
    // matching `}`, so `cursor - 1` IS the `}` — the IIFE body should END
    // BEFORE that brace. bodyEnd is exclusive-end of body slice.
    const tail = scriptInner.slice(cursor).match(/^\s*\)\s*\(\s*\)\s*;/);
    if (!tail) {
      // not an IIFE — skip past this `(function(){` and keep looking
      i = bodyStart;
      continue;
    }
    const closeEnd = cursor + tail[0].length;
    iifes.push({ openIdx, bodyStart, bodyEnd: cursor - 1, closeEnd });
    i = closeEnd;
  }
  if (iifes.length < 2) return { kind: 'noop' };

  // For each IIFE, the optional preceding `/* ... */` banner is whatever
  // comment block sits between the previous IIFE end (or string start) and
  // this IIFE's open. Strip leading whitespace + extract the banner text.
  const chunks = [];
  let prevEnd = 0;
  for (const x of iifes) {
    const between = scriptInner.slice(prevEnd, x.openIdx);
    const cm = between.match(/\/\*\s*([\s\S]*?)\s*\*\//);
    const comment = cm ? cm[1] : null;
    // bodyEnd is the position of the closing `}` — slice up-to-but-not-
    // including so the extracted body has balanced braces. Trim leading
    // and trailing whitespace lines so the per-IIFE wrapper produces a
    // clean (function(){\nBODY\n})(); shape.
    const body = scriptInner.slice(x.bodyStart, x.bodyEnd).replace(/^\n|\n$/g, '');
    chunks.push({ comment, body });
    prevEnd = x.closeEnd;
  }
  return { kind: 'split', chunks };
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

  // If any script references multiple widgets, try to split it into per-IIFE
  // chunks first (the multi-IIFE-in-one-<script> pattern that several PCM-era
  // topics use). If every chunk references exactly one widget, we can rewrite
  // the multi-widget script as N separate <script>(function(){…})();</script>
  // tags — equivalent output, just unbundled. If splitting fails or any chunk
  // is multi-widget, bail conservatively.
  const recovered = []; // { sc, perIifeWidgets: [widgetId, ...] }
  for (const c of multiWidget) {
    const split = splitMultiIife(c.sc.inner);
    if (split.kind !== 'split') return { kind: 'bailed', reason: 'multi-widget-script-in-block' };
    const perIife = [];
    for (const chunk of split.chunks) {
      const ids = referencedIdsInScript(chunk.body);
      const widgets = new Set();
      for (const id of ids) {
        const wid = idToWidget.get(id);
        if (wid && wid !== 'AMBIG') widgets.add(wid);
      }
      if (widgets.size !== 1) return { kind: 'bailed', reason: 'multi-iife-chunk-not-1-widget' };
      perIife.push({ widget: [...widgets][0], chunk });
    }
    recovered.push({ sc: c.sc, perIife });
  }

  if (pairable.length === 0 && recovered.length === 0) return { kind: 'noop' };

  // Merge pairable + recovered scripts into one position-sorted list.
  // (Recovered = multi-widget single-script that got split into per-IIFE
  // chunks. Splitting changes the rendered HTML — one <script> tag becomes
  // N tags — so it's only safe when caller opts in via --allow-drift; when
  // disabled, recovered ends up empty and we fall back to the bail.)
  const allScripts = [
    ...pairable.map(p => ({ sc: p.sc, kind: 'paired', widget: [...p.widgets][0] })),
    ...recovered.map(r => ({ sc: r.sc, kind: 'recovered', perIife: r.perIife })),
  ];
  allScripts.sort((a, b) => a.sc.start - b.sc.start);

  // Build the new block sequence by walking scripts in order.
  const newBlocks = [];
  const paired = [];
  let cursor = 0;
  for (const c of allScripts) {
    const { sc } = c;
    if (sc.start > cursor) {
      newBlocks.push({ type: 'raw', html: rawHtml.slice(cursor, sc.start) });
    }
    if (c.kind === 'paired') {
      newBlocks.push({
        type: 'widget-script',
        forWidget: c.widget,
        html: rawHtml.slice(sc.start, sc.end),
      });
      paired.push(c.widget);
    } else {
      // Recovered: emit one widget-script block per IIFE, each wrapped in its
      // own <script>…</script>. Optional /* ... */ comment is preserved as a
      // section banner inside the new <script>.
      for (let k = 0; k < c.perIife.length; k++) {
        const { widget, chunk } = c.perIife[k];
        const banner = chunk.comment ? `/* ${chunk.comment} */\n` : '';
        const html =
          `<script>\n${banner}(function(){\n${chunk.body}\n})();\n</script>`;
        newBlocks.push({ type: 'widget-script', forWidget: widget, html });
        paired.push(widget);
        if (k < c.perIife.length - 1) {
          newBlocks.push({ type: 'raw', html: '\n' });
        }
      }
    }
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
  // `--allow-drift` skips the byte-identical roundtrip rollback. Required for
  // the multi-IIFE-in-one-<script> case (where one source <script> tag splits
  // into N rendered tags), since byte-identity is structurally impossible
  // there. Caller is expected to follow up with `node scripts/rebuild.mjs`
  // (fix mode) to align the on-disk HTML to the new rendered output.
  const allowDrift = args.includes('--allow-drift');

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
      // Verify byte-identical round-trip — unless caller opted into drift
      // (multi-IIFE split case).
      if (!allowDrift) {
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
