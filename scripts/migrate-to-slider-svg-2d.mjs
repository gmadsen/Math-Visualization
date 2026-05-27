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
// --normalize: re-point widgets onto slider-svg-2d's STANDARD layout instead
// of requiring byte-identity. Used for slider widgets whose hand-authored chrome
// differs (svg-first, multiple rows, note-div). Output is intentionally the
// uniform standard layout (controls row -> svg -> readout -> caption), so the
// byte-identity guard is skipped; behavior must be browser-verified (control
// ids are preserved, so the driving script still binds). Chosen by the user
// 2026-05-25 over a brittle byte-exact layout engine.
const NORMALIZE = argv.includes('--normalize');
const positional = argv.filter((a) => a !== '--normalize');
if (positional.length < 2) {
  console.error('Usage: node scripts/migrate-to-slider-svg-2d.mjs [--normalize] <topic> <verbatim-slug> [...]');
  process.exit(2);
}
const topicSlug = positional[0];
const wantSlugs = new Set(positional.slice(1));

// ---------------------------------------------------------------------------
// Parse a verbatim bodyMarkup string into slider-svg-2d typed params.

// Preserve numeric source formatting when JS's Number() would lose info.
// `"3.0"` parses to 3 and serialises back as `"3"`, breaking byte-identity.
// Strategy: keep the original string when `String(Number(s)) !== s`,
// otherwise store as a clean number for nicer schema validation.
//
// CRITICAL: the kept-string MUST match the schema's numeric pattern
// (`^-?\d+(?:\.\d+)?$`). Otherwise the migration writes JSON that
// silently fails validate-widget-params on the next rebuild. SFH on
// PR #243 flagged the gap: `"1e3"`, `"+1"`, `".5"`, `"1."`, `"-0"`,
// `"010"` all round-trip through `String(Number(…))` differently
// from the source AND fail the schema pattern. Throw at parse time
// rather than write invalid JSON. The migrate-script's existing
// failure-summary path (line ~313) already prints enough context.
// Allowlist for the verbatim labelAttrs string that gets spliced into
// the rendered `<label…>` tag. Cosmetic (style, class) and a11y
// (aria-*, data-*) attrs are accepted; event handlers (on*=), id (would
// collide with the renderer's for-binding), and anything else throws.
const LABEL_ATTR_NAME = /\s+([a-zA-Z][a-zA-Z0-9_-]*)\s*=\s*"/g;
const LABEL_ATTR_ALLOWLIST = /^(?:style|class|data-[a-z][a-z0-9_-]*|aria-[a-z]+)$/;
function assertLabelAttrsSafe(attrsString) {
  if (!attrsString) return;
  const seen = new Set();
  let m;
  LABEL_ATTR_NAME.lastIndex = 0;
  while ((m = LABEL_ATTR_NAME.exec(attrsString))) {
    const name = m[1].toLowerCase();
    if (!LABEL_ATTR_ALLOWLIST.test(name)) {
      throw new Error(
        `labelAttrs contains disallowed attribute "${name}" — ` +
        `slider-svg-2d's labelAttrs allowlist is style, class, data-*, aria-*. ` +
        `Refusing to silently propagate. Source attrs: "${attrsString}".`
      );
    }
    if (seen.has(name)) {
      throw new Error(
        `labelAttrs contains duplicate attribute "${name}" — ` +
        `would render as an ambiguous tag. Source attrs: "${attrsString}".`
      );
    }
    seen.add(name);
  }
}

const NUMERIC_PATTERN = /^-?\d+(?:\.\d+)?$/;
function preserveNumeric(s) {
  const n = Number(s);
  if (String(n) === s) return n;
  if (NUMERIC_PATTERN.test(s)) return s;
  throw new Error(
    `preserveNumeric: source value "${s}" cannot be preserved — neither ` +
    `Number()-round-trippable nor schema-pattern-compatible. ` +
    `slider-svg-2d's min/max/value/step pattern is /^-?\\d+(?:\\.\\d+)?$/. ` +
    `Either normalize the source (e.g. "1e3" → "1000") or extend the ` +
    `schema pattern + this regex to accept the new form.`
  );
}

// Validate the verbatim inner of a `<select>` before storing it as a select
// control's optionsHtml (spliced back verbatim by the renderer). Must be ONLY
// `<option …>…</option>` elements plus whitespace, with no event handlers —
// `<optgroup>`, nested controls, or `on*=` defer rather than splice unsafely.
function assertOptionsSafe(optionsHtml) {
  // Option inner is `[^<]*` — TEXT-only (incl. KaTeX `$…$` and entities), no
  // nested tags. A `[\s\S]*?` body would strip a whole `<option><span>…</span>`
  // / `<option><script>…</script>` and leave an empty residue, smuggling nested
  // markup into the verbatim splice (Codex flagged on PR #378). Restricting to
  // `[^<]*` means any nested-tag option fails to strip → survives in the residue
  // → throws. optgroup / non-option content also defers via the residue check.
  const stripped = optionsHtml.replace(/<option\b[^>]*>[^<]*<\/option>/gi, '').trim();
  if (stripped !== '') {
    throw new Error('<select> inner has non-<option> or nested-markup content (defers): ' + stripped.slice(0, 60));
  }
  if (/\son[a-z]+\s*=/i.test(optionsHtml)) {
    throw new Error('<select> option carries an event handler (on*=)');
  }
}

// Validate the attr names of a verbatim `<input>` tag (text/number control)
// before storing it as a numinput control's inputHtml (spliced verbatim by the
// renderer). Allowlist: id/type/value/min/max/step/maxlength/placeholder/style/
// class/title/data-*/aria-*. Anything else (esp. on*= handlers) defers.
const INPUT_ATTR_ALLOW = /^(?:id|type|value|min|max|step|maxlength|placeholder|style|class|title|data-[a-z][a-z0-9_-]*|aria-[a-z]+)$/;
function assertInputAttrsSafe(inputTag) {
  const inner = inputTag.replace(/^<input\b/, '').replace(/\/?>$/, '');
  const re = /\s+([a-zA-Z][a-zA-Z0-9_-]*)(?:="[^"]*")?/g;
  let m;
  let residual = inner;
  while ((m = re.exec(inner))) {
    const name = m[1].toLowerCase();
    if (!INPUT_ATTR_ALLOW.test(name)) {
      throw new Error(`<input> has disallowed attribute "${name}" (text/number control allowlist): ${inputTag}`);
    }
    residual = residual.replace(m[0], '');
  }
  if (residual.trim() !== '') {
    throw new Error(`<input> has an unparseable/non-double-quoted attribute (refusing verbatim splice): ${inputTag}`);
  }
}

function parseControls(rowInner) {
  // Supported tokens in source order:
  //   nested-slider:    <label[ ATTRS]>LABEL<input id="ID" type="range" min=… max=… [step=…] value=…></label>
  //   separate-slider:  <label[ ATTRS] for="ID">LABEL</label>
  //                     <input type="range" id="ID" min=… max=… [step=…] value=…>
  //   button:           <button id="ID"[ class="CLASS"]>TEXT</button>
  //   span:             <span id="ID"[ class="CLASS"]>TEXT?</span>
  //
  // The two slider forms render identically in the browser but differ at
  // the byte level — both styles exist in the corpus (spectral-theory
  // uses nested; kahler-geometry / spectral-methods-data / mathematical-
  // biology use separate). The renderer emits exactly the parsed form so
  // byte-identical roundtrip holds.
  const controls = [];
  let i = 0;
  while (i < rowInner.length) {
    while (i < rowInner.length && /\s/.test(rowInner[i])) i++;
    if (i >= rowInner.length) break;

    if (rowInner.startsWith('<label', i)) {
      // Distinguish nested vs separate by looking inside the <label> for
      // an <input>. Nested: input is a child. Separate: input is a sibling
      // immediately after </label>.
      const openCloseIdx = rowInner.indexOf('>', i);
      if (openCloseIdx < 0) throw new Error('unterminated <label> open tag');
      const labelOpenTag = rowInner.slice(i, openCloseIdx + 1);
      // Extract verbatim attribute string from the opening tag (everything
      // between `<label` and `>`), preserved through to renderer.
      // Strip `for="..."` separately (it's the form-binding attr, not
      // arbitrary cosmetic). What's left becomes labelAttrs.
      const labelAttrsRaw = labelOpenTag.slice('<label'.length, -1);
      const forMatch = labelAttrsRaw.match(/\s*for="([^"]+)"/);
      const labelAttrsWithoutFor = forMatch
        ? labelAttrsRaw.slice(0, forMatch.index) + labelAttrsRaw.slice(forMatch.index + forMatch[0].length)
        : labelAttrsRaw;

      // Allowlist: labelAttrs is verbatim-spliced into the rendered
      // `<label…>` tag, so it can carry whatever the parser captures.
      // Restrict to cosmetic/a11y attrs (style, class, data-*, aria-*).
      // Refuses event handlers (on*=), id (would collide with for-binding),
      // and anything else. SFH PR #243 flagged the gap — symmetric
      // corruption survives byte-identity. Throw at parse time.
      assertLabelAttrsSafe(labelAttrsWithoutFor);

      const labelEndIdx = rowInner.indexOf('</label>', openCloseIdx);
      if (labelEndIdx < 0) throw new Error('unterminated <label> in .row');
      const inner = rowInner.slice(openCloseIdx + 1, labelEndIdx);

      // Nested-form select: `<label>LABELTEXT<select ID [style]>OPTS</select></label>`
      // (label wraps the select; the select sits at the end of the label inner).
      const nestedSelectMatch = inner.match(/^([\s\S]*?)<select\b([^>]*)>([\s\S]*)<\/select>\s*$/);
      if (nestedSelectMatch) {
        const labelText = nestedSelectMatch[1];
        const selAttrs = nestedSelectMatch[2];
        const optionsHtml = nestedSelectMatch[3];
        const selIdM = selAttrs.match(/\bid="([^"]+)"/);
        if (!selIdM) throw new Error('nested <select> without id: ' + inner.slice(0, 80));
        const styleM = selAttrs.match(/\sstyle="([^"]*)"/);
        const extra = selAttrs.replace(/\s*id="[^"]*"/, '').replace(/\s*style="[^"]*"/, '').trim();
        if (extra) throw new Error('nested <select> with unsupported attribute(s) (id/style only): ' + selAttrs);
        if (labelAttrsWithoutFor.trim()) throw new Error('nested-select label carries extra attrs: ' + labelAttrsWithoutFor);
        assertOptionsSafe(optionsHtml);
        const ctrl = { type: 'select', id: selIdM[1], label: labelText, optionsHtml, format: 'nested' };
        if (styleM) ctrl.style = styleM[1];
        controls.push(ctrl);
        i = labelEndIdx + '</label>'.length;
        continue;
      }

      const nestedInputMatch = inner.match(/<input\s+([^>]+?)\s*\/?>/);
      let slider;
      let advanceTo;
      if (nestedInputMatch) {
        // Nested form
        const inputAttrs = nestedInputMatch[1];
        const labelText = inner.slice(0, nestedInputMatch.index).trimEnd();
        const get = (name) => {
          const m = inputAttrs.match(new RegExp(`\\b${name}="([^"]*)"`));
          return m ? m[1] : null;
        };
        const ntype = get('type');
        if (ntype === 'range') {
          slider = {
            type: 'slider',
            id: get('id'),
            label: labelText,
            // Store numerics as strings when they have a trailing `.0` (or
            // any decimal that JS's Number() would lose). Pure integers
            // stay as JSON numbers for cleaner schema validation.
            min: preserveNumeric(get('min')),
            max: preserveNumeric(get('max')),
            value: preserveNumeric(get('value')),
          };
          const step = get('step');
          if (step !== null) slider.step = preserveNumeric(step);
        } else if (ntype === 'number' || ntype === 'text') {
          // text/number input → numinput control (verbatim tag, nested form).
          assertInputAttrsSafe(nestedInputMatch[0]);
          slider = { type: 'numinput', id: get('id'), label: labelText, inputHtml: nestedInputMatch[0], format: 'nested' };
        } else {
          throw new Error('unsupported nested input type "' + ntype + '": ' + inputAttrs);
        }
        advanceTo = labelEndIdx + '</label>'.length;
      } else {
        // Separate form: scan past </label> + whitespace for the sibling control.
        const afterLabel = labelEndIdx + '</label>'.length;
        let j = afterLabel;
        while (j < rowInner.length && /\s/.test(rowInner[j])) j++;
        if (rowInner.startsWith('<select', j)) {
          // <label for="ID">L</label> <select id="ID">OPTIONS</select> → select control.
          const selOpenEnd = rowInner.indexOf('>', j);
          if (selOpenEnd < 0) throw new Error('unterminated <select> open tag');
          const selOpenTag = rowInner.slice(j, selOpenEnd + 1);
          const selIdM = selOpenTag.match(/\bid="([^"]+)"/);
          if (!selIdM) throw new Error('<select> without id: ' + selOpenTag);
          const selId = selIdM[1];
          const styleM = selOpenTag.match(/\sstyle="([^"]*)"/);
          const extra = selOpenTag.slice('<select'.length, -1).replace(/\s*id="[^"]*"/, '').replace(/\s*style="[^"]*"/, '').trim();
          if (extra) throw new Error('<select> with unsupported attribute(s) (only id/style): ' + selOpenTag);
          if (labelAttrsWithoutFor.trim()) {
            throw new Error('select-label carries extra attrs (unsupported): ' + labelAttrsWithoutFor);
          }
          const forId = forMatch ? forMatch[1] : selId;
          if (selId !== forId) throw new Error(`separate-label/select id mismatch: for="${forId}" select id="${selId}"`);
          const selCloseIdx = rowInner.indexOf('</select>', selOpenEnd);
          if (selCloseIdx < 0) throw new Error('unterminated <select>');
          const optionsHtml = rowInner.slice(selOpenEnd + 1, selCloseIdx);
          assertOptionsSafe(optionsHtml);
          const selStyle = styleM ? styleM[1] : undefined;
          const selCtrl = { type: 'select', id: selId, label: inner.trim(), optionsHtml };
          if (selStyle !== undefined) selCtrl.style = selStyle;
          controls.push(selCtrl);
          i = selCloseIdx + '</select>'.length;
          continue;
        }
        if (!rowInner.startsWith('<input', j)) {
          throw new Error('<label for="…"> not followed by <input> or <select>: ' + rowInner.slice(i, i + 80));
        }
        const inputCloseIdx = rowInner.indexOf('>', j);
        if (inputCloseIdx < 0) throw new Error('unterminated <input> after separate-form label');
        const inputAttrs = rowInner.slice(j + '<input'.length, inputCloseIdx).trim();
        const get = (name) => {
          const m = inputAttrs.match(new RegExp(`\\b${name}="([^"]*)"`));
          return m ? m[1] : null;
        };
        const stype = get('type');
        const forId = forMatch ? forMatch[1] : get('id');
        if (get('id') !== forId) {
          throw new Error(
            `separate-label/input id mismatch: label for="${forId}" but input id="${get('id')}"`
          );
        }
        if (stype === 'range') {
          slider = {
            type: 'slider',
            id: get('id'),
            label: inner.trim(),
            // Store numerics as strings when they have a trailing `.0` (or
            // any decimal that JS's Number() would lose). Pure integers
            // stay as JSON numbers for cleaner schema validation.
            min: preserveNumeric(get('min')),
            max: preserveNumeric(get('max')),
            value: preserveNumeric(get('value')),
            format: 'separate',
          };
          const step = get('step');
          if (step !== null) slider.step = preserveNumeric(step);
        } else if (stype === 'number' || stype === 'text') {
          const inputTag = rowInner.slice(j, inputCloseIdx + 1);
          assertInputAttrsSafe(inputTag);
          slider = { type: 'numinput', id: get('id'), label: inner.trim(), inputHtml: inputTag, format: 'separate' };
        } else {
          throw new Error('non-range/number/text sibling input after <label for="…">: ' + inputAttrs);
        }
        advanceTo = inputCloseIdx + 1;
      }
      // labelAttrs is a slider-only field (the renderer splices it into the
      // slider's `<label…>`); a non-slider control with extra label attrs defers.
      if (labelAttrsWithoutFor) {
        if (slider.type !== 'slider') throw new Error('label carries extra attrs on a non-slider control: ' + labelAttrsWithoutFor);
        slider.labelAttrs = labelAttrsWithoutFor;
      }
      controls.push(slider);
      i = advanceTo;
    } else if (rowInner.startsWith('<button', i)) {
      const closeStart = rowInner.indexOf('>', i);
      const endIdx = rowInner.indexOf('</button>', closeStart);
      if (endIdx < 0) throw new Error('unterminated <button>');
      const openTag = rowInner.slice(i, closeStart + 1);
      const text = rowInner.slice(closeStart + 1, endIdx);
      const idMatch = openTag.match(/\bid="([^"]+)"/);
      if (!idMatch) throw new Error('<button> without id: ' + openTag);
      const button = { type: 'button', id: idMatch[1], text };
      const classMatch = openTag.match(/\bclass="([^"]+)"/);
      if (classMatch) button.class = classMatch[1];
      controls.push(button);
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
      // Renderer's three-state rule for class:
      //   undefined  → emit class="small"  (spectral-theory default)
      //   ""         → emit no class attr  (kahler-geometry style)
      //   non-empty  → emit verbatim
      if (classMatch) {
        if (classMatch[1] !== 'small') span.class = classMatch[1];
        // else: omit the field → renderer defaults to class="small"
      } else {
        span.class = ''; // explicit empty → renderer omits the attribute
      }
      if (text !== '') span.text = text;
      controls.push(span);
      i = endIdx + '</span>'.length;
    } else {
      throw new Error('unexpected token in .row at offset ' + i + ': ' + rowInner.slice(i, i + 40));
    }
  }
  return controls;
}

function parseVerbatimMarkup(bodyMarkup, normalize) {
  // Expected shapes (canonical + variations):
  // <div class="widget"[ id="WIDGETID"]>
  //   <div class="hd"><div class="ttl">{title}</div><div class="hint">{hint}</div></div>
  //   <div class="row">
  //     <controls>  ← nested or separate slider form per parseControls
  //   </div>
  //   <svg id="..." viewBox="..." width="..." height="..."><title>{title}</title></svg>
  //   <div class="readout" id="..."></div>
  // </div>

  // Wrapper opening tag — detect optional `id="..."`. When present, the
  // renderer needs wrapperHasId=true so the byte-identical roundtrip
  // preserves it (kahler-geometry / smd-w* style).
  const wrapperOpenMatch = bodyMarkup.match(/^<div class="widget"(?:\s+id="([^"]+)")?\s*>/);
  if (!wrapperOpenMatch) {
    throw new Error('bodyMarkup does not begin with `<div class="widget"[ id=…]>`');
  }
  const wrapperWidgetId = wrapperOpenMatch[1] || null;

  // Header title/hint. Most widgets wrap these in `<div class="ttl">` /
  // `<div class="hint">`, but a handful use `<span class="ttl">` /
  // `<span class="hint">` (e.g. differential-forms df-closed-not-exact,
  // elliptic-curves ec-gl). Accept either tag via a backreference so the
  // open/close tags match. The renderer always emits the canonical `<div>`
  // form, so div-header widgets round-trip byte-identically and span-header
  // ones are normalized to div (an accepted cosmetic delta under the
  // normalize-to-one-layout decision — .ttl/.hint CSS applies to both).
  const titleMatch = bodyMarkup.match(/<(div|span) class="ttl">([\s\S]*?)<\/\1>/);
  const hintMatch  = bodyMarkup.match(/<(div|span) class="hint">([\s\S]*?)<\/\1>/);
  if (!titleMatch || !hintMatch) throw new Error('could not parse .hd > .ttl/.hint');
  const title = titleMatch[2];
  const hint  = hintMatch[2];

  // Find <div class="row"> ... </div> block — be careful with nested divs:
  // these widgets' rows contain only <label>, <button>, <span> (no nested divs).
  let controls = [];
  if (normalize) {
    // Normalize mode: gather controls from EVERY <div class="row"> — some
    // widgets split sliders across multiple rows; they collapse into the
    // single standard row on output. (Rows contain only label/input/button/
    // span, never nested divs, so indexOf('</div>') finds each row's close.)
    let scan = 0;
    while (true) {
      const rs = bodyMarkup.indexOf('<div class="row">', scan);
      if (rs < 0) break;
      const oe = rs + '<div class="row">'.length;
      const re = bodyMarkup.indexOf('</div>', oe);
      if (re < 0) throw new Error('unterminated <div class="row">');
      controls = controls.concat(parseControls(bodyMarkup.slice(oe, re).trim()));
      scan = re + '</div>'.length;
    }
    if (controls.length === 0) throw new Error('missing <div class="row">');
  } else {
    const rowStart = bodyMarkup.indexOf('<div class="row">');
    if (rowStart < 0) throw new Error('missing <div class="row">');
    const rowOpenEnd = rowStart + '<div class="row">'.length;
    const rowEnd = bodyMarkup.indexOf('</div>', rowOpenEnd);
    if (rowEnd < 0) throw new Error('unterminated <div class="row">');
    controls = parseControls(bodyMarkup.slice(rowOpenEnd, rowEnd).trim());
  }

  // Parse the <svg> open tag attribute-by-attribute (order-agnostic). Legacy
  // widgets carry `id viewBox width height`; modern responsive ones carry only
  // `id viewBox` (+ optional role/aria-label) and size from CSS max-width:100%.
  // id + viewBox are required; width/height/role/aria-label are optional.
  const unescapeHtml = (s) => s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  // `<svg>` is OPTIONAL: most widgets have a diagram, but some (select + readout
  // dropdowns) have none. When absent, `svg` stays undefined and the renderer
  // omits the svg block. A no-svg widget that nonetheless carries trailing prose
  // the svg-anchored finder can't see trips the byte-identity guard → defers.
  let svg;
  const svgOpenMatch = bodyMarkup.match(/<svg\b([^>]*)>/);
  if (svgOpenMatch) {
    const svgAttrStr = svgOpenMatch[1];
    const svgAttr = (name) => {
      const m = svgAttrStr.match(new RegExp(`\\b${name}="([^"]*)"`));
      return m ? m[1] : undefined;
    };
    const svgId = svgAttr('id');
    const svgViewBox = svgAttr('viewBox');
    if (!svgId) throw new Error('<svg> open tag missing id');
    if (!svgViewBox) throw new Error('<svg> open tag missing viewBox');
    // width/height: numeric px OR a responsive percent string ("100%"). Keep the
    // original string when it isn't a clean round-trippable number, so byte-identity
    // holds for both `width="360"` and `width="100%"` (schema allows number|percent).
    const dim = (s) => { if (s == null) return undefined; const n = Number(s); return (Number.isFinite(n) && String(n) === s) ? n : s; };
    const svgWidth = dim(svgAttr('width'));
    const svgHeight = dim(svgAttr('height'));
    const svgRole = svgAttr('role');
    const svgAriaLabel = svgAttr('aria-label');
    const svgStyle = svgAttr('style');
    svg = {
      id: svgId,
      viewBox: svgViewBox,
      ...(svgWidth != null ? { width: svgWidth } : {}),
      ...(svgHeight != null ? { height: svgHeight } : {}),
      ...(svgRole === 'img' ? { role: svgRole } : {}),
      ...(svgAriaLabel != null ? { ariaLabel: unescapeHtml(svgAriaLabel) } : {}),
      ...(svgStyle != null ? { style: svgStyle } : {}),
    };
    const svgTitleMatch = bodyMarkup.slice(svgOpenMatch.index).match(/<title>([\s\S]*?)<\/title>/);
    if (svgTitleMatch) {
      const unescaped = unescapeHtml(svgTitleMatch[1]);
      if (unescaped !== title) svg.title = unescaped;
    }
  }

  // Readout: either `<div class="readout" id="...-readout"></div>` or absent.
  // Readout div. Strict mode: must be EMPTY (the renderer emits an empty
  // readout, so initial text could never round-trip byte-identically).
  // Normalize mode: also accept a readout with placeholder text — the
  // renderer emits it empty and the driving script repopulates it on first
  // draw, so the text is a discardable placeholder; what matters is the div
  // (with its id) exists for the script to bind.
  // Normalize also tolerates id-before-class attr order (`<div id="x" class="readout">`)
  // via lookaheads — the renderer always emits the canonical class-first form, so
  // this only matters for FINDING the readout div + its id, not reproducing it.
  // It also tolerates MULTI-CLASS readouts (`class="readout small"`) — several
  // corpus widgets give the bottom readout an extra `small` (or similar) class.
  // The bare `class="readout"` lookahead would miss those (the closing `"` can't
  // follow `readout` when more classes trail it) and silently set readout=false,
  // dropping the div — a script that binds to it then no-ops or warns. We capture
  // the full class value so the renderer's `{ id, class }` readout form preserves
  // it; only the canonical single `readout` class collapses to the boolean form.
  let readoutId, readoutClass;
  if (normalize) {
    const m = bodyMarkup.match(/<div\s+(?=[^>]*\bclass="(readout(?:\s[^"]*)?)")(?=[^>]*\bid="([^"]+)")[^>]*>[\s\S]*?<\/div>/);
    if (m) { readoutClass = m[1]; readoutId = m[2]; }
  } else {
    const m = bodyMarkup.match(/<div class="readout" id="([^"]+)"><\/div>/);
    if (m) { readoutClass = 'readout'; readoutId = m[1]; }
  }
  let readout = false;
  if (readoutId) {
    // svg-less widgets can't derive the readout id from svg.id, so they always
    // take the explicit `{ id }` object form (expectedId stays null).
    const expectedId = (svg && svg.id.endsWith('-svg')) ? svg.id.slice(0, -4) + '-readout' : null;
    if (readoutClass === 'readout' && expectedId === readoutId) {
      readout = true;
    } else if (readoutClass === 'readout') {
      readout = { id: readoutId };
    } else {
      readout = { id: readoutId, class: readoutClass };
    }
  }

  // Trailing prose: optional `<p class="small">...</p>` between the
  // readout and the wrapper's closing `</div>`. Several corpus widgets
  // (spectral-methods-data, etc.) embed an explanatory caption here.
  //
  // CRITICAL: count `<p class="small">` openings in the trailing
  // region. The naive non-greedy `[\s\S]*?` regex silently merges
  // multi-paragraph captures (SFH PR #243 finding) — `<p class="small">
  // first</p><p class="small">second</p>` round-trips byte-identically
  // because the renderer emits `<p class="small">{capture}</p>` and the
  // capture contains the embedded `</p><p class="small">` boundary.
  // The JSON then stores semantically corrupted prose. Throw if >1.
  const trailingRegion = (() => {
    // The trailing region is everything between the last structural block and
    // the wrapper close, scanned for a `<p class="small">` / `<div class="note">`
    // caption. Anchor at `</svg>` when there's a diagram; for svg-less widgets
    // (select + readout) anchor at the readout div's close instead — otherwise
    // the caption is never seen and silently dropped.
    let anchorIdx = bodyMarkup.indexOf('</svg>');
    if (anchorIdx < 0 && readoutId) {
      const ri = bodyMarkup.indexOf(`id="${readoutId}"`);
      if (ri >= 0) anchorIdx = bodyMarkup.indexOf('</div>', ri);
    }
    if (anchorIdx < 0) return null;
    const wrapperCloseIdx = bodyMarkup.lastIndexOf('</div>');
    if (wrapperCloseIdx <= anchorIdx) return null;
    return bodyMarkup.slice(anchorIdx, wrapperCloseIdx);
  })();
  let trailingProse = null;
  if (trailingRegion) {
    // Tolerate extra attrs on the trailing `<p class="small" …>` (e.g. an inline
    // `style="margin-top:.6rem"`). The renderer emits the bare `<p class="small">`,
    // so in byte-identity mode a styled `<p>` still won't round-trip and defers;
    // in --normalize the style is a discardable cosmetic delta and the note text
    // is preserved.
    const openings = (trailingRegion.match(/<p class="small"[^>]*>/g) || []).length;
    if (openings > 1) {
      throw new Error(
        `multiple <p class="small"> blocks (${openings}) between readout and ` +
        `wrapper close — slider-svg-2d's trailingProse param holds at most one. ` +
        `Either merge the prose into a single paragraph in the source, or extend ` +
        `the schema to accept an array of paragraphs.`
      );
    }
    if (openings === 1) {
      const m = trailingRegion.match(/<p class="small"[^>]*>([\s\S]*?)<\/p>/);
      if (m) trailingProse = m[1];
    }
    if (normalize && trailingProse === null) {
      // Normalize: a trailing <div class="note…">…</div> or <div class="small">…</div>
      // becomes the standard <p class="small"> caption. (Caption bodies are plain
      // text/inline markup, no nested divs, so the non-greedy </div> match is safe.)
      // The div→p is a discardable cosmetic delta under normalize; the TEXT is preserved.
      const nm = trailingRegion.match(/<div class="(?:note[^"]*|small)">([\s\S]*?)<\/div>/);
      if (nm) trailingProse = nm[1];
    }
    // Defer-on-residue: the trailing region must not hold ANOTHER block the chrome
    // can't represent — a second caption, or a <table>/<ul>/<ol>/<canvas> the script
    // populates. slider-svg-2d's tail is exactly one optional <p class="small">, so
    // anything past the one caption we captured would be SILENTLY DROPPED (normalize
    // skips the byte-identity guard, jsdom stays green). Mirror the assertOptionsSafe/
    // assertInputAttrsSafe discipline — refuse rather than lose content.
    // (Caught half-integral-weight-forms-w3's trailing <div class="small"> caption,
    // PR #385 review; before the prose-capture extension above it was dropped outright.)
    const captionCount =
      (trailingRegion.match(/<p class="small"[^>]*>/g) || []).length +
      (trailingRegion.match(/<div class="(?:note[^"]*|small)">/g) || []).length;
    const captured = trailingProse === null ? 0 : 1;
    if (captionCount > captured) {
      throw new Error(
        `uncaptured trailing caption(s) in the widget tail (would be silently ` +
        `dropped): ${captionCount} caption block(s) found, only ${captured} captured. ` +
        `Merge them into one paragraph in the source, or defer this widget.`
      );
    }
    for (const t of ['<table', '<ul', '<ol', '<canvas', '<textarea', '<pre']) {
      if (trailingRegion.includes(t)) {
        throw new Error(
          `uncaptured ${t}…> in the widget tail (would be silently dropped) — ` +
          `slider-svg-2d's tail holds only one <p class="small">. Defer this widget.`
        );
      }
    }
  }

  return { title, hint, controls, svg, readout, wrapperWidgetId, trailingProse };
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
      typed = parseVerbatimMarkup(old.bodyMarkup, NORMALIZE);
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

    // Reconcile widgetId across the verbatim params and the wrapper's
    // own id attribute (when present). Two cases:
    //
    //   (1) wrapperWidgetId present AND matches old.widgetId  → wrapperHasId=true,
    //       widgetId stays as-is.
    //   (2) wrapperWidgetId present BUT old.widgetId differs  → trust the
    //       wrapper's id (it's what the page actually emits); old.widgetId
    //       was likely a placeholder slug for widget-script ref-binding
    //       that won't apply here. Use wrapperWidgetId as widgetId, set
    //       wrapperHasId=true.
    //   (3) wrapperWidgetId absent                            → widgetId
    //       stays metadata-only (spectral-theory style), wrapperHasId omitted.
    const newWidgetId = typed.wrapperWidgetId || old.widgetId || '';
    const newParams = {
      widgetId: newWidgetId,
      title: typed.title,
      hint:  typed.hint,
      controls: typed.controls,
      svg: typed.svg,
      readout: typed.readout,
      bodyScript: old.bodyScript || '',
    };
    if (typed.wrapperWidgetId) newParams.wrapperHasId = true;
    if (typed.trailingProse !== null) newParams.trailingProse = typed.trailingProse;

    // Safety: re-render and require byte-identity vs original bodyMarkup.
    // In --normalize mode the output is intentionally the uniform standard
    // layout (not byte-identical), so the guard is skipped — behavior is
    // browser-verified instead, and control ids are preserved so the driving
    // script still binds.
    const rendered = renderSliderSvg2d(newParams);
    if (!NORMALIZE && rendered !== old.bodyMarkup) {
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
