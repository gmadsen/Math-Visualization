// hamiltonians-kam-tori widget — bespoke registry entry for the §5 KAM-tori
// illustration on the `hamiltonians-classical-mechanics` topic.
//
// The widget renders three `<input type="range">` sliders ($\omega_1$,
// $\omega_2$, $\varepsilon$) all sharing a SINGLE .row above an SVG host
// showing the 2-torus winding (rational closed curve, irrational dense fill,
// perturbed by a small KAM-style coupling). The all-sliders-in-one-row layout
// distinguishes this slug from parametric-plot (which puts each slider in its
// own row).
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>

function renderHintHtml(hint) {
  return hint ? `<div class="hint">${hint}</div>` : '';
}

function renderSliderEntries(sliders) {
  // For each slider, two lines emitted at .row-inner indent (4 spaces):
  //   <label for="id">label</label>
  //   <input id="id" type="range" min="m" max="M" value="v" />
  const lines = [];
  for (const s of sliders) {
    lines.push(`    <label for="${s.id}">${s.label}</label>`);
    lines.push(`    <input id="${s.id}" type="range" min="${s.min}" max="${s.max}" value="${s.value}" />`);
  }
  return lines.join('\n');
}

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint,
    viewBox, svgWidth, svgHeight, ariaLabel,
    sliders, outputInitial, } = params;

  return (
    `<div class="widget"` + (widgetId ? ` id="${widgetId}"` : "") + `>\n` +
    `  <div class="hd">\n` +
    `    <div class="ttl">${title}</div>\n` +
    `    ${renderHintHtml(hint)}\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `${renderSliderEntries(sliders)}\n` +
    `  </div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" aria-label="${ariaLabel}"></svg>\n` +
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
