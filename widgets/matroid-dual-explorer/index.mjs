// matroid-dual-explorer widget — bespoke registry entry for the §5 dual matroid widget
// on the `matroid-theory` topic.
//
// The widget combines a two-button preset chooser (between $U_{2,4}$ and $M(K_4)$ minus an edge) with an SVG that draws the dual $M^*$ and a readout reporting bases / rank / cocircuits. The shape is bespoke; this slug
// captures it as one unit.
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>
//
// Both are pure functions of params (no I/O). A portable consumer ignores
// `bodyMarkup` and `bodyScript` and rebuilds the widget from typed inputs.

export function renderMarkup(params) {
  const { widgetId, title, hint, bodyMarkup } = params;
  return (
    `<div class="widget"` + (widgetId ? ` id="${widgetId}"` : "") + `>\n` +
    `  <div class="hd"><div class="ttl">${title}</div><div class="hint">${hint}</div></div>\n` +
    `${bodyMarkup}\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { sectionComment, bodyScript } = params;
  const commentLine = sectionComment ? `/* ${sectionComment} */\n` : '';
  return (
    `<script>\n` +
    commentLine +
    `(function(){\n` +
    `${bodyScript}\n` +
    `})();\n` +
    `</script>`
  );
}
