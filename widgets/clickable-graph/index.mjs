// clickable-graph widget — shared module for the `clickable-graph` family.
//
// These widgets pose an SVG whose *elements* (nodes, regions, arrows) are the
// interactive controls — no sliders, selects, or buttons.  Clicking a node
// triggers one of three UX contracts, captured by params.clickAction:
//
//   "highlight" — permanently highlights the clicked node + its dependency
//                 set (closure / up-set / ancestor chain) and recolors edges
//                 accordingly.  Re-clicking the same node clears.
//   "toggle"    — flips a node's selection on/off; typically multiple nodes
//                 can be active at once.
//   "reveal"    — exposes extra data (reasoning text, alternate viewpoint)
//                 about the clicked node; typically a single-selection UX.
//
// Exports two pure string-returning functions:
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script>\n(function(){ ... })();\n</script>
//
// Both are pure (no I/O).  A React / SSR / any-frontend consumer can ignore
// renderScript entirely and drive its own renderer from params alone — the
// structured `nodes` / `edges` / `readoutMap` / `clickAction` fields are
// sufficient to reconstruct any highlight/toggle/reveal UX.  The verbatim
// `bodyScript` artifact exists so that the vanilla-HTML frontend can byte-
// match the legacy inline source through the round-trip gate.

function renderTitleTag(title, titleTag) {
  const tag = titleTag === 'span' ? 'span' : 'div';
  return `<${tag} class="ttl">${title}</${tag}>`;
}

function renderHintTag(hint, hintTag) {
  if (hint === undefined) return '';
  const tag = hintTag === 'span' ? 'span' : 'div';
  return `<${tag} class="hint">${hint}</${tag}>`;
}

export function renderMarkup(params) {
  const {
    widgetId, svgId, viewBox, title,
    hint, svgWidthAttr, svgHeightAttr,
    readoutId, initialReadoutHtml, titleTag, hintTag, trailingExplainer,
  } = params;

  const hintHtml = renderHintTag(hint, hintTag);
  const widthAttr  = svgWidthAttr  !== undefined ? ` width="${svgWidthAttr}"`   : '';
  const heightAttr = svgHeightAttr !== undefined ? ` height="${svgHeightAttr}"` : '';

  const readoutHtml = readoutId !== undefined
    ? `\n  <div class="readout" id="${readoutId}">${initialReadoutHtml ?? ''}</div>`
    : '';

  const trailingHtml = typeof trailingExplainer === 'string'
    ? `\n  <p class="small">${trailingExplainer}</p>`
    : '';

  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd">${renderTitleTag(title, titleTag)}${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}"${widthAttr}${heightAttr}><title>${title}</title></svg>` +
    `${readoutHtml}${trailingHtml}\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { bodyScript, sectionComment } = params;
  // bodyScript is the verbatim body of the driving IIFE — everything between
  // `(function(){` and `})();`.  Preserving it as an artifact is what lets
  // renderScript reproduce the legacy inline source byte-for-byte through the
  // round-trip gate.  The sectionComment, when present, sits on its own line
  // immediately after `<script>` (matching the legacy convention for
  // multi-widget pages).
  const header = sectionComment !== undefined
    ? `<script>\n${sectionComment}\n(function(){`
    : `<script>\n(function(){`;
  return (
    `${header}${bodyScript}})();\n` +
    `</script>`
  );
}
