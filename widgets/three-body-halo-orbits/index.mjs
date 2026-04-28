// three-body-halo-orbits widget — bespoke registry entry for the §6 halo-
// orbit / tadpole illustration on the `three-body-problem` topic.
//
// The widget exposes three preset buttons ($L_1$ halo, $L_2$ halo, $L_4$
// tadpole) co-located with an amplitude slider in a single row, above an SVG
// that animates a spacecraft on the chosen libration orbit, plus a readout
// reporting amplitude in km. The shape doesn't fit any shared slug; this
// slug captures it as one unit.
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>

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
