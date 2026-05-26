// migrate-to-button-stepper — hoist verbatim "buttons + SVG + readout" slugs
// onto the shared `button-stepper` renderer (widgets/button-stepper/).
//
//   node scripts/migrate-to-button-stepper.mjs <topic> <verbatim-slug> [...]
//
// Unlike migrate-to-slider-svg-2d's --normalize path, this tool defaults to a
// STRICT byte-identity guard: it parses each verbatim `bodyMarkup` into typed
// button-stepper params, re-renders, and refuses to migrate unless the output
// is byte-for-byte identical to the original. button-stepper's renderer was
// built to round-trip faithfully (it preserves layout-block ORDER, readout
// content, span-vs-div headers, raw blocks), so byte-identity is achievable
// for well-formed inputs and means ZERO behavior change — no browser-verify
// needed. Any widget whose markup the parser can't reproduce exactly throws
// and is left verbatim (atomic per topic-call: any listed slug failing → none
// saved). That conservatism is the point — defer the odd shapes, never guess.
//
// Scope (what button-stepper can represent): a `<div class="widget" id>` with
// a `.hd` header (div OR span ttl/hint), then an ordered run of layout blocks —
// `<div class="row">` (label? + <button> list, id-keyed or data-*-keyed),
// `<svg id viewBox width height><title>>`, `<div class="readout" id>content`,
// and an optional trailing `<p class="small">`. Shapes outside that (responsive
// or styled <svg>, sliders/selects in the row, raw mid-body blocks) trip the
// byte-identity guard and defer.

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadTopicContent,
  saveTopicContent,
} from './lib/json-block-writer.mjs';
import {
  renderMarkup as renderButtonStepper,
  renderScript as renderButtonStepperScript,
} from '../widgets/button-stepper/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..');

const argv = process.argv.slice(2);
const positional = argv.filter((a) => !a.startsWith('--'));
if (positional.length < 2) {
  console.error('Usage: node scripts/migrate-to-button-stepper.mjs <topic> <verbatim-slug> [...]');
  process.exit(2);
}
const topicSlug = positional[0];
const wantSlugs = new Set(positional.slice(1));

// ---------------------------------------------------------------------------
// Parser. Reproduces button-stepper/index.mjs::renderMarkup output exactly,
// so the byte-identity guard in the main loop is the real correctness check.

// Find the matching close for a `<div …>` whose opening `<` is at openStart.
// Returns indices for the inner span and the position just past `</div>`.
// Depth-counts nested <div>/</div> so headers (ttl/hint inside .hd) and
// readouts with nested markup resolve to their true close, not the first one.
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
// canonical `<div class="hd"><(div|span) class="ttl">…</…>[<(div|span)
// class="hint">…</…>]</div>` shape the renderer emits. Throws otherwise
// (e.g. a hand-authored hd carrying extra markup → defer via byte guard).
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

// Parse one <button …>label</button> into a button-stepper button object.
// Emits the same attr model the renderer consumes: { id?, dataAttr?, className?,
// label }. Refuses (throws) anything but the id/data-*/class attribute set, so
// onclick= handlers or unexpected attrs defer rather than silently drop.
function parseButton(openAttrs, label) {
  const btn = {};
  const attrRe = /\s+([a-zA-Z][a-zA-Z0-9_-]*)="([^"]*)"/g;
  let m;
  let sawData = false;
  while ((m = attrRe.exec(openAttrs))) {
    const name = m[1].toLowerCase();
    const value = m[2];
    if (name === 'id') btn.id = value;
    else if (name === 'class') btn.className = value;
    else if (name === 'type') btn.type = value;
    else if (name.startsWith('data-')) {
      if (sawData) throw new Error(`button has multiple data-* attrs (only one supported): ${openAttrs}`);
      btn.dataAttr = { name, value };
      sawData = true;
    } else {
      throw new Error(`button has unsupported attribute "${name}" (only id, type, class, single data-*): ${openAttrs}`);
    }
  }
  btn.label = label;
  return btn;
}

// Parse the inner of a <div class="row">…</div> into a row layout block.
// The renderer emits label (optional) then each button on its own line. We
// accept that shape; anything else (slider/select/span controls, text) throws.
function parseRow(rowOpenAttrs, rowInner) {
  const block = { kind: 'row' };
  const idMatch = rowOpenAttrs.match(/\bid="([^"]+)"/);
  if (idMatch) block.id = idMatch[1];
  // Reject any row attribute other than id (class="row" is the tag selector,
  // already consumed by the caller's match).
  const otherAttr = rowOpenAttrs.replace(/\s*class="row"/, '').replace(/\s*id="[^"]*"/, '').trim();
  if (otherAttr) throw new Error(`row has unsupported attribute(s): "${otherAttr}"`);

  const trimmed = rowInner.trim();
  if (trimmed === '') return block; // empty row (id-only)

  const buttons = [];
  let label;
  // Tokenise: optional leading <label>…</label>, then a run of <button>…</button>.
  let rest = trimmed;
  const labelMatch = rest.match(/^<label>([\s\S]*?)<\/label>\s*/);
  if (labelMatch) { label = labelMatch[1]; rest = rest.slice(labelMatch[0].length); }
  const btnRe = /^<button([^>]*)>([\s\S]*?)<\/button>\s*/;
  while (rest.length > 0) {
    const bm = rest.match(btnRe);
    if (!bm) throw new Error(`row contains non-button content (sliders/selects/text defer): "${rest.slice(0, 60)}"`);
    buttons.push(parseButton(bm[1], bm[2]));
    rest = rest.slice(bm[0].length);
  }
  if (label !== undefined) block.label = label;
  if (buttons.length) block.buttons = buttons;
  return block;
}

// Parse an <svg …><title>…</title></svg> opener into an svg layout block.
// button-stepper emits exactly `id viewBox width height` then a single
// <title>. Anything else (style/role/aria attrs, missing width/height,
// extra children) won't byte-match and defers.
function parseSvg(svgTag, svgInner) {
  const attr = (name) => {
    const m = svgTag.match(new RegExp(`\\b${name}="([^"]*)"`));
    return m ? m[1] : undefined;
  };
  const id = attr('id'), viewBox = attr('viewBox'), width = attr('width'), height = attr('height');
  if (!id || !viewBox || width === undefined || height === undefined) {
    throw new Error('svg missing one of id/viewBox/width/height (responsive/styled svgs defer)');
  }
  const num = (s) => (/^\d+$/.test(s) ? Number(s) : s);
  const block = { kind: 'svg', id, viewBox, width: num(width), height: num(height) };
  const ariaLabel = attr('aria-label');
  if (ariaLabel !== undefined) block.ariaLabel = ariaLabel;
  const titleMatch = svgInner.match(/^<title>([\s\S]*?)<\/title>$/);
  if (!titleMatch) throw new Error('svg inner is not exactly a single <title> (extra children defer)');
  block.titleText = titleMatch[1];
  return block;
}

// Walk the wrapper's inner body (everything after the .hd line) into an ordered
// layout[] array plus an optional trailingExplainer. Each iteration matches the
// next top-level element by its opening tag; div blocks use a depth counter to
// find their matching close (readout/raw inner may contain nested elements).
function parseBody(body) {
  const layout = [];
  let trailingExplainer;
  let i = 0;
  const n = body.length;

  while (i < n) {
    // skip inter-block whitespace (the renderer joins blocks with '\n')
    while (i < n && /\s/.test(body[i])) i++;
    if (i >= n) break;
    const slice = body.slice(i);

    let mm;
    if ((mm = slice.match(/^<div class="row"([^>]*)>/))) {
      const openAttrs = mm[1];
      const { innerStart, closeStart, end } = matchDivClose(body, i);
      layout.push(parseRow(openAttrs, body.slice(innerStart, closeStart)));
      i = end;
    } else if ((mm = slice.match(/^<svg\b([^>]*)>/))) {
      const svgTag = mm[0];
      const closeIdx = slice.indexOf('</svg>');
      if (closeIdx < 0) throw new Error('unterminated <svg>');
      layout.push(parseSvg(svgTag, slice.slice(mm[0].length, closeIdx)));
      i += closeIdx + '</svg>'.length;
    } else if ((mm = slice.match(/^<div class="(readout(?:\s[^"]*)?)" id="([^"]+)"( style="[^"]*")?>/))) {
      // Class-first readout (button-stepper's canonical order). Captures the
      // full class (so "readout small" round-trips via className) and an
      // optional inline style. id-first readouts (`<div id=… class="readout">`)
      // don't match here and defer — button-stepper emits class-first.
      const cls = mm[1];
      const id = mm[2];
      const styleAttr = mm[3]; // ` style="…"` or undefined
      const { innerStart, closeStart, end } = matchDivClose(body, i);
      const block = { kind: 'readout', id };
      if (cls !== 'readout') block.className = cls;
      if (styleAttr) block.style = styleAttr.match(/ style="([^"]*)"/)[1];
      const content = body.slice(innerStart, closeStart);
      if (content !== '') block.content = content;
      layout.push(block);
      i = end;
    } else if ((mm = slice.match(/^<p class="small">([\s\S]*?)<\/p>\s*$/))) {
      // trailing explainer — must be the LAST thing in the body
      trailingExplainer = mm[1];
      i = n;
    } else {
      throw new Error(`unrecognised top-level block (raw/other defers): "${slice.slice(0, 70)}"`);
    }
  }
  return { layout, trailingExplainer };
}

// Parse a full verbatim bodyMarkup → button-stepper params (sans bodyScript,
// which the caller copies from the verbatim block). Throws on any shape it
// can't reproduce; the main loop's byte-identity guard is the final check.
function parseVerbatimMarkup(bodyMarkup) {
  const wrapMatch = bodyMarkup.match(/^<div class="widget" id="([^"]+)">\n([\s\S]*)\n<\/div>$/);
  if (!wrapMatch) throw new Error('wrapper is not `<div class="widget" id="…">…</div>` (button-stepper requires a wrapper id)');
  const widgetId = wrapMatch[1];
  const inner = wrapMatch[2];

  // hd line: `  <div class="hd">…</div>` as the first line. The hd div nests
  // the ttl/hint divs, so find its balanced close (not the first </div>).
  if (!inner.startsWith('  <div class="hd">')) {
    throw new Error('first line is not `  <div class="hd">…</div>`');
  }
  const hdOpenStart = 2; // after the two-space indent
  const { innerStart: hdInnerStart, closeStart: hdCloseStart, end: hdEnd } = matchDivClose(inner, hdOpenStart);
  const hd = parseHd(inner.slice(hdInnerStart, hdCloseStart));
  // Skip the single '\n' the renderer emits after the hd line.
  let body = inner.slice(hdEnd);
  if (body.startsWith('\n')) body = body.slice(1);

  const { layout, trailingExplainer } = parseBody(body);

  const params = { widgetId, title: hd.title, layout };
  if (hd.titleTag === 'span') params.titleTag = 'span';
  if (hd.hint !== undefined) {
    params.hint = hd.hint;
    if (hd.hintTag === 'span') params.hintTag = 'span';
  }
  if (trailingExplainer !== undefined) params.trailingExplainer = trailingExplainer;
  return params;
}

// Parse a verbatim bodyScript into the pieces button-stepper's renderScript
// consumes. Verbatim slugs store the FULL driving script —
// `<leadSep><script>\n[/* sectionComment */\n](function(){\n BODY \n})();\n
// </script>` — where leadSep is the inter-block separator (usually "\n") baked
// in because render-doc joins blocks with '' and the widget-script block sits
// adjacent to the widget. button-stepper.renderScript emits only the `<script>…`
// part and re-wraps BODY in the IIFE, so extract { leadSep, sectionComment,
// body } and (a) feed body+comment to the renderer, (b) relocate leadSep into
// an inserted raw block. Throws on any shape that doesn't fit (defer).
function parseVerbatimScript(bodyScript) {
  const m = bodyScript.match(
    /^(\s*)<script>\n(?:\/\* ([\s\S]*?) \*\/\n)?\(function\(\)\{\n([\s\S]*)\n\}\)\(\);\n<\/script>$/
  );
  if (!m) {
    throw new Error('bodyScript is not the canonical `<script>\\n(function(){\\n…\\n})();\\n</script>` IIFE shape');
  }
  return { leadSep: m[1], sectionComment: m[2], body: m[3] };
}

// ---------------------------------------------------------------------------

const doc = loadTopicContent(topicSlug, repoRoot);

let migrated = 0;
let failed = 0;

for (const section of doc.sections) {
  // Index-based: migrating a widget may splice a separator raw block before
  // its (adjacent) widget-script block, shifting later indices.
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

    const newParams = { ...params, bodyScript: scriptParts.body };
    if (scriptParts.sectionComment !== undefined) newParams.sectionComment = scriptParts.sectionComment;

    // Full byte-identity guard across BOTH the markup and the script. The
    // widget contributes renderMarkup at its block, and (via the adjacent
    // widget-script ref) renderScript at the script block; the leadSep that
    // separated them in the verbatim bodyScript is relocated into a raw block.
    // If `renderMarkup === bodyMarkup` AND `leadSep + renderScript === bodyScript`,
    // the reconstructed page is byte-for-byte identical → provably zero change.
    const renderedMarkup = renderButtonStepper(newParams);
    const renderedScript = renderButtonStepperScript(newParams);
    if (renderedMarkup !== old.bodyMarkup) {
      console.error(`  ${block.slug}: MARKUP byte-identity FAILED — refusing to migrate`);
      console.error('--- expected ---'); console.error(JSON.stringify(old.bodyMarkup));
      console.error('--- actual ---');   console.error(JSON.stringify(renderedMarkup));
      failed++;
      continue;
    }
    if (scriptParts.leadSep + renderedScript !== old.bodyScript) {
      console.error(`  ${block.slug}: SCRIPT byte-identity FAILED — refusing to migrate`);
      console.error('--- expected ---'); console.error(JSON.stringify(old.bodyScript));
      console.error('--- actual ---');   console.error(JSON.stringify(scriptParts.leadSep + renderedScript));
      failed++;
      continue;
    }

    // The verbatim widget-script block must be adjacent (next non-widget block
    // referencing this widget). Find it; if it isn't the immediate sibling, the
    // script layout is unusual → defer rather than guess where the separator goes.
    const scriptIdx = i + 1;
    const sb = section.blocks[scriptIdx];
    if (!sb || sb.type !== 'widget-script' || sb.ref !== params.widgetId) {
      console.error(`  ${block.slug}: expected an adjacent widget-script ref="${params.widgetId}" at block ${scriptIdx} — defer`);
      failed++;
      continue;
    }

    const origSlug = block.slug;
    block.slug = 'button-stepper';
    block.params = newParams;
    // Relocate the leading separator into a raw block between the widget and
    // its widget-script block (render-doc joins with '' — without this the
    // script would glue to `</div>`).
    if (scriptParts.leadSep !== '') {
      section.blocks.splice(scriptIdx, 0, { type: 'raw', html: scriptParts.leadSep });
      i++; // skip over the block we just inserted
    }
    migrated++;
    console.log(`  ${origSlug}→button-stepper: migrated (${old.bodyMarkup.length}B markup byte-identical; leadSep ${JSON.stringify(scriptParts.leadSep)} relocated)`);
  }
}

if (failed > 0) {
  console.error(`migrate-to-button-stepper: ${failed} failure(s); refusing to save`);
  process.exit(1);
}
if (migrated === 0) {
  console.log('migrate-to-button-stepper: nothing to migrate');
  process.exit(0);
}

saveTopicContent(topicSlug, doc, repoRoot);
console.log(`migrate-to-button-stepper: migrated ${migrated} widget(s) in ${topicSlug}`);
