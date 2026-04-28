// hamiltonians-phase-space-cell widget — bespoke registry entry for the §1
// phase-space cell on the `hamiltonians-classical-mechanics` topic.
//
// The widget renders an SVG host plus two action buttons (Evolve / Reset)
// and a readout reporting area, centroid, and shape. No sliders, no select —
// just buttons drive the harmonic-oscillator flow. None of the shared slugs
// fit this gesture exactly (parametric-plot insists on a sliders array;
// button-stepper has its own state-cycling shape) so this slug captures the
// triple as a single unit. The bespoke draw + integrator code travels in
// `bodyScript` as an artifact.
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>
//
// Both are pure functions of params (no I/O). A portable consumer ignores
// `bodyScript` and drives its own flow from {ariaLabel, buttons, outputInitial}
// plus its own integrator.

function renderHintHtml(hint) {
  return hint ? `<div class="hint">${hint}</div>` : '';
}

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint,
    viewBox, svgWidth, svgHeight, ariaLabel,
    buttons, outputInitial, } = params;

  const buttonsHtml = buttons
    .map(b => `    <button id="${b.id}">${b.label}</button>`)
    .join('\n');

  return (
    `<div class="widget"` + (widgetId ? ` id="${widgetId}"` : "") + `>\n` +
    `  <div class="hd">\n` +
    `    <div class="ttl">${title}</div>\n` +
    `    ${renderHintHtml(hint)}\n` +
    `  </div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" aria-label="${ariaLabel}"></svg>\n` +
    `  <div class="row">\n` +
    `${buttonsHtml}\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">${outputInitial}</div>\n` +
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
