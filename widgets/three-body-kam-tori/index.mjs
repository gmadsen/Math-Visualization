// three-body-kam-tori widget — bespoke registry entry for the §5 KAM
// tori-vs-perturbation illustration on the `three-body-problem` topic.
//
// The widget exposes a single perturbation slider $\varepsilon$ with an
// inline `<span class="small">` readout above an SVG of nested invariant
// tori; rationally-resonant rings shatter into Birkhoff islands as
// $\varepsilon$ grows, and a marked golden-mean torus survives longest. The
// shape doesn't fit any shared slug; this slug captures it as one unit.
// (Distinct from `hamiltonians-kam-tori`, which is a 2-torus winding
// visualization driven by three sliders.)
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
