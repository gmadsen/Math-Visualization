// schrodinger-figure widget — bespoke registry entry for the
// schrodinger-equation topic.
//
// Each interactive on the page is a small variation on a single shape:
// idless <div class="widget"> wrapper, structured .hd header (title + optional
// hint), zero or more <div class="row"> blocks (sliders + spans + action
// buttons in irregular orderings), a single <svg> host, and a <div
// class="readout">. The shared slugs in the registry (parametric-plot,
// button-stepper, clickable-diagram) all *require* an id on the widget
// wrapper and assume a fixed control-row layout; stretching any of them to
// absorb the schrodinger-equation widgets would creep their schemas.
//
// This bespoke slug instead owns:
//
//   - emitting the .hd line from `title` + optional `hint`,
//   - emitting the <svg> tag from the structured `svg` block,
//   - emitting the <div class="readout"> from `readoutId`,
//   - dropping the row(s) in verbatim via `bodyMarkup`,
//   - dropping the IIFE body in verbatim via `bodyScript`.
//
// `bodyMarkup` and `bodyScript` are ARTIFACTS — a portable React / SSR
// consumer ignores them and drives its own renderer from a future structured
// `controls` + `draw` field; today they preserve byte-identity with the
// inline source.
//
// Exports:
//
//   renderMarkup(params)  -> <div class="widget"[ id="…"]>…</div>
//   renderScript(params)  -> <script>…</script>
//
// Both are pure functions of params.

function renderHintHtml(hint) {
  return typeof hint === 'string' && hint.length > 0
    ? `<div class="hint">${hint}</div>`
    : '';
}

export function renderMarkup(params) {
  const { widgetId, title, hint, svg, readoutId, readoutInitial, bodyMarkup } = params;

  const idAttr = widgetId ? ` id="${widgetId}"` : '';
  const svgTitleText = typeof svg.titleText === 'string' ? svg.titleText : title;
  const svgLine =
    `  <svg id="${svg.id}" viewBox="${svg.viewBox}" width="${svg.width}" height="${svg.height}">` +
    `<title>${svgTitleText}</title></svg>`;
  const readoutInit = typeof readoutInitial === 'string' ? readoutInitial : '';
  const readoutLine = `  <div class="readout" id="${readoutId}">${readoutInit}</div>`;
  const middle = typeof bodyMarkup === 'string' ? bodyMarkup : '';

  return (
    `<div class="widget"${idAttr}>\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${renderHintHtml(hint)}</div>\n` +
    `${middle}` +
    `${svgLine}\n` +
    `${readoutLine}\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { sectionComment, bodyScript } = params;
  const commentLine =
    typeof sectionComment === 'string' && sectionComment.length > 0
      ? `/* ${sectionComment} */\n`
      : '';
  return (
    `<script>\n` +
    commentLine +
    `(function(){\n` +
    `${bodyScript}\n` +
    `})();\n` +
    `</script>`
  );
}
