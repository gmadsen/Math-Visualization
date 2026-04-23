// input-form widget — SHARED widget module absorbing the input-calculator and
// input-plot families (~44 widgets across ~25 topics).  Chrome: a header, a
// single .row of labeled number/text inputs plus one action button, an
// optional <svg> canvas, and a <div class="readout"> output slot.  The
// per-widget computation logic is passed through as a verbatim `bodyScript`
// artifact string; renderScript wraps it in the canonical
// `<script>\n(function(){\n…\n})();\n</script>` envelope so the absorbed
// widget round-trips byte-identical to the legacy inline source.
//
// Exports two pure string-returning functions:
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// A portable frontend (React, etc.) ignores the `bodyScript` field entirely
// and implements `compute(inputs) → readout` on its own — the structured
// schema describes the chrome (inputs / button / readout / optional svg)
// which is all a non-browser renderer needs.
//
// Branch dispatch is driven by the presence of `svgId`:
//   - svgId absent: pure input-calculator (no SVG canvas).
//   - svgId present: input-plot variant — an <svg> renders BEFORE the .row.

// Canonical attribute order for <input>, matching the legacy hand-written
// order so renderMarkup byte-matches the original source.
const INPUT_ATTR_ORDER = ['type', 'id', 'value', 'min', 'max', 'step', 'placeholder', 'style'];

function renderInputElement(input) {
  // Build `<input …>` with attrs in canonical order, skipping any absent
  // attributes.  `type` and `id` are always present (required in schema).
  const parts = [];
  for (const key of INPUT_ATTR_ORDER) {
    if (key === 'type' || key === 'id') {
      parts.push(`${key}="${input[key]}"`);
      continue;
    }
    if (input[key] !== undefined) {
      parts.push(`${key}="${input[key]}"`);
    }
  }
  return `<input ${parts.join(' ')}>`;
}

function renderInputRow(inputs, button) {
  // Each input emits: optional leading <label>, the <input>, optional
  // trailing <label>.  All lines are indented four spaces (matching the
  // legacy source's `.row` children).
  const lines = [];
  for (const inp of inputs) {
    if (inp.label !== undefined) {
      lines.push(`    <label for="${inp.id}">${inp.label}</label>`);
    }
    lines.push(`    ${renderInputElement(inp)}`);
    if (inp.trailingLabel !== undefined) {
      lines.push(`    <label for="${inp.trailingLabel.for}">${inp.trailingLabel.text}</label>`);
    }
  }
  lines.push(`    <button id="${button.id}">${button.text}</button>`);
  return lines.join('\n');
}

function renderSvgTag(params) {
  // Optional <svg> line (input-plot variant).  Attributes emitted in this
  // fixed order: id, viewBox, width, height, style.  A <title> child reuses
  // the widget title for a11y.
  const { svgId, viewBox, svgWidthAttr, svgHeightAttr, svgStyleAttr, title } = params;
  const attrs = [`id="${svgId}"`, `viewBox="${viewBox}"`];
  if (svgWidthAttr  !== undefined) attrs.push(`width="${svgWidthAttr}"`);
  if (svgHeightAttr !== undefined) attrs.push(`height="${svgHeightAttr}"`);
  if (svgStyleAttr  !== undefined) attrs.push(`style="${svgStyleAttr}"`);
  return `  <svg ${attrs.join(' ')}><title>${title}</title></svg>\n`;
}

export function renderMarkup(params) {
  const {
    widgetId, title, hint,
    inputs, button,
    readoutId, readoutPrefix,
    svgId,
  } = params;
  const hintHtml = (hint !== undefined) ? `<div class="hint">${hint}</div>` : '';
  const svgLine = (svgId !== undefined) ? renderSvgTag(params) : '';
  const rowBody = renderInputRow(inputs, button);
  const readoutInner = (readoutPrefix !== undefined) ? readoutPrefix : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    svgLine +
    `  <div class="row">\n` +
    `${rowBody}\n` +
    `  </div>\n` +
    `  <div class="readout" id="${readoutId}">${readoutInner}</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { bodyScript } = params;
  // Canonical envelope: `<script>\n(function(){\n…\n})();\n</script>`.
  // `bodyScript` is the artifact string preserving the original IIFE body
  // byte-for-byte (including all indentation and internal newlines).  The
  // body does NOT carry a trailing newline — the wrapper contributes it.
  return (
    `<script>\n` +
    `(function(){\n` +
    `${bodyScript}\n` +
    `})();\n` +
    `</script>`
  );
}
