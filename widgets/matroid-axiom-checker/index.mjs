// matroid-axiom-checker widget — bespoke registry entry for the §1 independence-
// axiom checker on the `matroid-theory` topic.
//
// The widget combines a ground-set <input>, a multi-line <textarea> for the
// family $\mathcal{I}$, a row of preset buttons (check / load $U_{2,4}$ /
// load broken example), and a readout that runs (I1)/(I2)/(I3) against the
// edited family. The shape is unique on the page and bespoke; this slug
// captures it as one unit.
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>
//
// Both are pure functions of params (no I/O). A portable consumer ignores
// `bodyMarkup` and `bodyScript` and rebuilds the checker from a typed family
// input + the (I1)/(I2)/(I3) predicates.

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
