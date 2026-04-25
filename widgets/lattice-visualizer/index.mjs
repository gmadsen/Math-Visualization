// lattice-visualizer widget — declarative wrapper over the page-global
// MVLatticeVisualizer library (js/widget-lattice-visualizer.js).
//
// Emits an empty host div + a single `<script>` calling
// `MVLatticeVisualizer.init('#widgetId', config)`. The library owns chrome,
// the four basis-component sliders, the SVG (lattice points + fundamental
// parallelogram + optional sublattice overlay), and the readout (covolume +
// optional sublattice index). All renderers are pure functions of params.
//
// `basis`, `viewWindow`, and `sublattice.matrix` are pure data — a portable
// frontend can ignore renderScript and reimplement the geometry directly.

function formatConfig(params) {
  const lines = ['{'];
  lines.push(`    title: ${JSON.stringify(params.title)},`);
  if (typeof params.hint === 'string') {
    lines.push(`    hint: ${JSON.stringify(params.hint)},`);
  }
  if (typeof params.viewBox === 'string') {
    lines.push(`    viewBox: ${JSON.stringify(params.viewBox)},`);
  }
  if (params.basis && typeof params.basis === 'object') {
    lines.push(`    basis: ${JSON.stringify(params.basis)},`);
  }
  if (params.viewWindow && typeof params.viewWindow === 'object') {
    lines.push(`    viewWindow: ${JSON.stringify(params.viewWindow)},`);
  }
  if (params.sublattice && typeof params.sublattice === 'object') {
    lines.push(`    sublattice: ${JSON.stringify(params.sublattice)},`);
  }
  lines.push('  }');
  return lines.join('\n');
}

export function renderMarkup(params) {
  // Empty host div. The library builds chrome (header, sliders, SVG,
  // readout) at init time inside this element.
  return `<div class="widget" id="${params.widgetId}"></div>`;
}

export function renderScript(params) {
  const { widgetId, sectionComment } = params;
  const banner = sectionComment ? `/* ${sectionComment} */\n` : '';
  return (
    `<script>\n` +
    banner +
    `(function(){\n` +
    `  if(!window.MVLatticeVisualizer) return;\n` +
    `  MVLatticeVisualizer.init('#${widgetId}', ${formatConfig(params)});\n` +
    `})();\n` +
    `</script>`
  );
}
