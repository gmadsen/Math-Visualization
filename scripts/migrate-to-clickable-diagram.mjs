// migrate-to-clickable-diagram — hoist verbatim "controls + SVG + readout"
// slugs onto the shared `clickable-diagram` renderer's `svg-diagram` variant
// (widgets/clickable-diagram/).
//
//   node scripts/migrate-to-clickable-diagram.mjs <topic> <verbatim-slug> [...]
//
// Like migrate-to-button-stepper, this tool defaults to a STRICT byte-identity
// guard: it parses each verbatim `bodyMarkup` into typed svg-diagram params
// (header, svg attrs, the verbatim controls row as `controlsLiteral`, the empty
// readout, an optional trailing `<p class="small">`), re-renders, and refuses to
// migrate unless renderMarkup === the original AND leadSep+renderScript === the
// original bodyScript. clickable-diagram's svg-diagram renderer was built to
// round-trip its absorbed widgets byte-for-byte (it splices the bespoke control
// markup and the full script body in verbatim via the *Literal fields), so a
// byte-identical match means ZERO behavior change — no browser-verify needed.
// Any widget whose markup/script the parser can't reproduce exactly throws and is
// left verbatim (atomic per topic-call: any listed slug failing → none saved).
//
// Scope (what svg-diagram can represent): a `<div class="widget" id>` with a
// `.hd` header (div OR span ttl/hint), then exactly ONE `<div class="row">…</div>`
// controls block and ONE `<svg id viewBox width height><title>…</title></svg>`
// (in either order → layout controls-first | svg-first), then an EMPTY
// `<div class="readout" id>` and an optional trailing `<p class="small">`, plus a
// driving script in the canonical `<script>\n…\n</script>` shape (emitted by a
// `widget-script` block found anywhere in the section). Shapes outside that — a
// no-wrapper-id widget, a non-empty/initial-text readout, a script that lives in
// rawBodySuffix (empty bodyScript), >1 row, a styled/responsive svg with extra
// attrs — trip the byte-identity guard and defer. Conservatism is the point.

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadTopicContent,
  saveTopicContent,
} from './lib/json-block-writer.mjs';
import {
  renderMarkup as renderClickableDiagram,
  renderScript as renderClickableDiagramScript,
} from '../widgets/clickable-diagram/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const argv = process.argv.slice(2);
const positional = argv.filter((a) => !a.startsWith('--'));
if (positional.length < 2) {
  console.error('Usage: node scripts/migrate-to-clickable-diagram.mjs <topic> <verbatim-slug> [...]');
  process.exit(2);
}
const topicSlug = positional[0];
const wantSlugs = new Set(positional.slice(1));

// ---------------------------------------------------------------------------
// Parser. Reproduces clickable-diagram/index.mjs::renderSvgDiagramMarkup output
// exactly, so the byte-identity guard in the main loop is the real check.

// Find the matching close for a `<div …>` whose opening `<` is at openStart.
// Depth-counts nested <div>/</div> so the .hd header resolves to its true close.
function matchDivClose(str, openStart) {
  let depth = 0;
  const tagRe = /<(\/?)div\b[^>]*>/g;
  tagRe.lastIndex = openStart;
  let m;
  while ((m = tagRe.exec(str))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) {
      const innerStart = openStart + str.slice(openStart).indexOf('>') + 1;
      return { innerStart, closeStart: m.index, end: tagRe.lastIndex };
    }
  }
  throw new Error('unbalanced <div>');
}

// Parse the .hd header → { title, hint, titleTag, hintTag }. Accepts the
// canonical `<(div|span) class="ttl">…</…>[<(div|span) class="hint">…</…>]`
// shape the renderer emits. Throws otherwise (defer via byte guard).
function parseHd(hdInner) {
  const ttlMatch = hdInner.match(/^<(div|span) class="ttl">([\s\S]*?)<\/\1>/);
  if (!ttlMatch) throw new Error('could not parse .hd > .ttl');
  const titleTag = ttlMatch[1];
  const title = ttlMatch[2];
  let rest = hdInner.slice(ttlMatch[0].length);
  let hint, hintTag;
  if (rest.length > 0) {
    const hintMatch = rest.match(/^<(div|span) class="hint">([\s\S]*?)<\/\1>$/);
    if (!hintMatch) throw new Error('unexpected trailing content in .hd after .ttl');
    hintTag = hintMatch[1];
    hint = hintMatch[2];
  }
  return { title, titleTag, hint, hintTag };
}

// Parse a full verbatim bodyMarkup → svg-diagram params (sans script, copied by
// the caller). Throws on any shape svg-diagram can't reproduce.
function parseVerbatimMarkup(bodyMarkup) {
  const wrapMatch = bodyMarkup.match(/^<div class="widget" id="([^"]+)">\n([\s\S]*)\n<\/div>$/);
  if (!wrapMatch) {
    throw new Error('wrapper is not `<div class="widget" id="…">…</div>` (svg-diagram requires a wrapper id)');
  }
  const widgetId = wrapMatch[1];
  const inner = wrapMatch[2];

  // hd line: `  <div class="hd">…</div>` as the first line.
  if (!inner.startsWith('  <div class="hd">')) {
    throw new Error('first line is not `  <div class="hd">…</div>`');
  }
  const { innerStart: hdInnerStart, closeStart: hdCloseStart, end: hdEnd } = matchDivClose(inner, 2);
  const hd = parseHd(inner.slice(hdInnerStart, hdCloseStart));
  let body = inner.slice(hdEnd);
  if (body.startsWith('\n')) body = body.slice(1);

  // Readout (EMPTY) splits body into middle (row + svg) and trailing.
  const roMatch = body.match(/\n  <div class="readout" id="([^"]+)"><\/div>/);
  if (!roMatch) throw new Error('no empty `<div class="readout" id>` found (non-empty/initial-text readout defers)');
  const outputId = roMatch[1];
  const middle = body.slice(0, roMatch.index);
  const after = body.slice(roMatch.index + roMatch[0].length);
  let trailingExplainer;
  if (after !== '') {
    const tm = after.match(/^\n  <p class="small">([\s\S]*)<\/p>$/);
    if (!tm) throw new Error('unexpected content after readout (only one trailing `<p class="small">` allowed)');
    trailingExplainer = tm[1];
  }

  // middle = rowBlock + '\n' + svgBlock  OR  svgBlock + '\n' + rowBlock.
  const svgRe = /  <svg id="([^"]+)" viewBox="([^"]+)" width="([^"]+)" height="([^"]+)"><title>([\s\S]*?)<\/title><\/svg>/;
  const svgM = middle.match(svgRe);
  if (!svgM) throw new Error('svg is not the canonical `<svg id viewBox width height><title>…</title></svg>` (styled/responsive/extra-attr svg defers)');
  const svgBlock = svgM[0];
  const beforeSvg = middle.slice(0, svgM.index);
  const afterSvg = middle.slice(svgM.index + svgBlock.length);

  let layout, rowBlock;
  if (beforeSvg === '') {
    // svg-first: svgBlock + '\n' + rowBlock
    layout = 'svg-first';
    if (!afterSvg.startsWith('\n')) throw new Error('malformed svg-first middle (no separator before row)');
    rowBlock = afterSvg.slice(1);
  } else {
    // controls-first: rowBlock + '\n' + svgBlock
    layout = 'controls-first';
    if (!beforeSvg.endsWith('\n')) throw new Error('malformed controls-first middle (no separator after row)');
    rowBlock = beforeSvg.slice(0, -1);
    if (afterSvg !== '') throw new Error('content after svg in controls-first layout (a second block defers)');
  }

  const rowM = rowBlock.match(/^  <div class="row">\n([\s\S]*)\n  <\/div>$/);
  if (!rowM) throw new Error('controls block is not the canonical `  <div class="row">\\n…\\n  </div>`');
  const controlsLiteral = rowM[1];

  const params = {
    interaction: 'svg-diagram',
    widgetId,
    title: hd.title,
    svgId: svgM[1],
    svgViewBox: svgM[2],
    svgWidthAttr: svgM[3],
    svgHeightAttr: svgM[4],
    svgTitle: svgM[5],
    outputId,
    layout,
    controlsLiteral,
  };
  if (hd.titleTag === 'span') params.titleTag = 'span';
  // svg-diagram requires `hint`; a header with no hint div can't round-trip.
  if (hd.hint === undefined) throw new Error('svg-diagram requires a `.hd > .hint` (header has none)');
  params.hint = hd.hint;
  if (hd.hintTag === 'span') params.hintTag = 'span';
  if (trailingExplainer !== undefined) params.trailingExplainer = trailingExplainer;
  return params;
}

// Parse the verbatim bodyScript → { leadSep, scriptBodyLiteral }. svg-diagram's
// renderScript emits `<script>\n${scriptBodyLiteral}\n</script>` verbatim (NO
// IIFE re-wrap — the whole body is preserved), so scriptBodyLiteral is the exact
// content between `<script>\n` and `\n</script>`, and leadSep (the inter-block
// separator, usually "\n") is relocated into a raw block. An empty bodyScript
// (script lives in rawBodySuffix) doesn't match → defer.
function parseVerbatimScript(bodyScript) {
  const m = bodyScript.match(/^(\s*)<script>\n([\s\S]*)\n<\/script>$/);
  if (!m) {
    throw new Error('bodyScript is not the canonical `<script>\\n…\\n</script>` shape (empty/non-canonical script defers)');
  }
  return { leadSep: m[1], scriptBodyLiteral: m[2] };
}

// ---------------------------------------------------------------------------

const doc = loadTopicContent(topicSlug, repoRoot);

let migrated = 0;
let failed = 0;

for (const section of doc.sections) {
  // Index-based: migrating a widget splices a separator raw block before its
  // widget-script block, shifting later indices.
  for (let i = 0; i < section.blocks.length; i++) {
    const block = section.blocks[i];
    if (block.type !== 'widget' || !wantSlugs.has(block.slug)) continue;
    const old = block.params;
    if (typeof old.bodyMarkup !== 'string') {
      console.warn(`  ${block.slug}: not a verbatim slug (no bodyMarkup), skipping`);
      continue;
    }

    let params, scriptParts;
    try {
      params = parseVerbatimMarkup(old.bodyMarkup);
      scriptParts = parseVerbatimScript(old.bodyScript || '');
    } catch (e) {
      console.error(
        `  ${topicSlug} § ${section.id} slug=${block.slug}: parse error — ${e.message}\n` +
        `    markup head: ${(old.bodyMarkup || '').replace(/\s+/g, ' ').slice(0, 160)}…`
      );
      failed++;
      continue;
    }

    const newParams = { ...params, scriptBodyLiteral: scriptParts.scriptBodyLiteral };

    const renderedMarkup = renderClickableDiagram(newParams);
    const renderedScript = renderClickableDiagramScript(newParams);

    // MARKUP guard: strict byte-identity. The svg-diagram renderer splices the
    // controls row + svg + readout verbatim, so an exact match proves zero change.
    if (renderedMarkup !== old.bodyMarkup) {
      console.error(`  ${block.slug}: MARKUP byte-identity FAILED — refusing to migrate`);
      console.error('--- expected ---'); console.error(JSON.stringify(old.bodyMarkup));
      console.error('--- actual ---');   console.error(JSON.stringify(renderedMarkup));
      failed++;
      continue;
    }
    // SCRIPT guard: leadSep + renderScript must reproduce the verbatim bodyScript.
    if (scriptParts.leadSep + renderedScript !== old.bodyScript) {
      console.error(`  ${block.slug}: SCRIPT byte-identity FAILED — refusing to migrate`);
      console.error('--- expected ---'); console.error(JSON.stringify(old.bodyScript));
      console.error('--- actual ---');   console.error(JSON.stringify(scriptParts.leadSep + renderedScript));
      failed++;
      continue;
    }

    // Find the widget-script block referencing this widget ANYWHERE in the
    // section (scripts may be grouped, not adjacent). Relocate the leadSep that
    // preceded the script into a raw block immediately before it.
    const scriptIdx = section.blocks.findIndex((b) => b.type === 'widget-script' && b.ref === params.widgetId);
    if (scriptIdx < 0) {
      console.error(`  ${block.slug}: no widget-script ref="${params.widgetId}" found in section — defer`);
      failed++;
      continue;
    }

    const origSlug = block.slug;
    block.slug = 'clickable-diagram';
    block.params = newParams;
    if (scriptParts.leadSep !== '') {
      section.blocks.splice(scriptIdx, 0, { type: 'raw', html: scriptParts.leadSep });
      if (scriptIdx <= i) i++; // inserted at/before our cursor → keep alignment
    }
    migrated++;
    console.log(`  ${origSlug}→clickable-diagram[svg-diagram]: migrated (byte-identical; ${old.bodyMarkup.length}B markup; layout=${params.layout}; leadSep ${JSON.stringify(scriptParts.leadSep)} relocated)`);
  }
}

if (failed > 0) {
  console.error(`migrate-to-clickable-diagram: ${failed} failure(s); refusing to save`);
  process.exit(1);
}
if (migrated === 0) {
  console.log('migrate-to-clickable-diagram: nothing to migrate');
  process.exit(0);
}

saveTopicContent(topicSlug, doc, repoRoot);
console.log(`migrate-to-clickable-diagram: migrated ${migrated} widget(s) in ${topicSlug}`);
