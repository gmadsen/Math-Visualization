// svg-illustration widget — a static SVG figure wrapped in standard widget
// chrome.  No driving JS, no interactive controls: these are hand-drawn (or
// script-populated at load time by a sibling widget-script block)
// illustrations that sit in the widget registry purely to get metadata
// (family / dimension / gesture / role) and be portable to alternate
// frontends.  Including them in the registry also makes them visible to
// coverage stats rather than counting as `inline` widgets.
//
// Chrome shape produced by renderMarkup (byte-identical to the canonical
// static-svg variant in the corpus — 2-space indentation, no trailing
// newline on the closing </div>):
//
//   <div class="widget" id="{widgetId}">
//     <div class="hd"><div class="ttl">{title}</div><div class="hint">{hint}</div></div>
//     <svg id="{svgId}" viewBox="{viewBox}" width="{W}" height="{H}"><title>{title}</title>{svgInner}</svg>
//     {caption?}
//     {footer?}
//   </div>
//
// Width and height are derived from the viewBox (the restricted "0 0 W H"
// shape every static-svg candidate in the corpus uses).  When `hint` is
// omitted, the `.hint` slot collapses to an empty div to preserve the
// on-page structure — every absorbed widget supplies a hint, so in practice
// the field is always present.
//
// renderScript returns the empty string: svg-illustration widgets do not
// own a driving script.  When a script is needed at load time to decorate
// the SVG (e.g. L-functions w-schema populating its corners), it lives in a
// neighbouring `widget-script` block which the topic renderer emits
// verbatim — this widget doesn't interfere with it.

function parseViewBox(viewBox) {
  // Restricted to "0 0 W H".  Returns { w, h } as integer strings so we can
  // embed them in the width/height attributes without any formatting drift.
  const m = /^0 0 (\d+) (\d+)$/.exec(viewBox);
  if (!m) {
    throw new Error(
      `svg-illustration: viewBox "${viewBox}" does not match the "0 0 W H" shape`,
    );
  }
  return { w: m[1], h: m[2] };
}

function renderAfterSvg(block) {
  // block is one of the schema's `afterSvg` shapes: { kind:'small', content }
  // or { kind:'readout', id?, style?, content? }.  Emits a string with a
  // leading two-space indent and no trailing newline — the caller joins with
  // "\n".
  if (!block) return null;
  if (block.kind === 'small') {
    return `  <div class="small">${block.content}</div>`;
  }
  if (block.kind === 'readout') {
    const attrs = [' class="readout"'];
    if (block.id) attrs.push(` id="${block.id}"`);
    if (block.style) attrs.push(` style="${block.style}"`);
    const content = block.content || '';
    return `  <div${attrs.join('')}>${content}</div>`;
  }
  throw new Error(`svg-illustration: unknown afterSvg kind "${block.kind}"`);
}

export function renderMarkup(params) {
  const { widgetId, svgId, viewBox, title, hint, svgInner, caption, footer } = params;
  const { w, h } = parseViewBox(viewBox);
  const hintBlock = hint == null ? '' : `<div class="hint">${hint}</div>`;
  const lines = [
    `<div class="widget" id="${widgetId}">`,
    `  <div class="hd"><div class="ttl">${title}</div>${hintBlock}</div>`,
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${w}" height="${h}"><title>${title}</title>${svgInner}</svg>`,
  ];
  const capLine = renderAfterSvg(caption);
  if (capLine != null) lines.push(capLine);
  const footLine = renderAfterSvg(footer);
  if (footLine != null) lines.push(footLine);
  lines.push(`</div>`);
  return lines.join('\n');
}

export function renderScript(_params) {
  // svg-illustration widgets have no driving JS.  A sibling widget-script
  // block, if present, is rendered verbatim by the topic renderer — not by
  // this module.
  return '';
}
