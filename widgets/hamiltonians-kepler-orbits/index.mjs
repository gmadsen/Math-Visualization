// hamiltonians-kepler-orbits widget — bespoke registry entry for the §6
// Kepler-orbit sweep on the `hamiltonians-classical-mechanics` topic.
//
// Two `<input type="range">` sliders ($E$, $L$) share a single .row above an
// SVG host showing the conic orbit (ellipse / parabola / hyperbola)
// parametrized by energy and angular momentum. The all-sliders-in-one-row
// layout matches `hamiltonians-kam-tori` (3 sliders) but is distinct from
// parametric-plot's per-row layout, so this widget rides on its own bespoke
// slug. Conic-section draw logic is opaque artifact in `bodyScript`.
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>

function renderHintHtml(hint) {
  return hint ? `<div class="hint">${hint}</div>` : '';
}

function renderSliderEntries(sliders) {
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
