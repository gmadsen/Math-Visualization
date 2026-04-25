// modular-arithmetic-clock widget — declarative wrapper over the page-global
// MVModularArithmeticClock library (js/widget-modular-arithmetic-clock.js).
//
// Emits an empty host div + a single `<script>` that calls
// `MVModularArithmeticClock.init('#widgetId', config)`. The library owns
// chrome, sliders, the dial rendering, and the per-`kind` arithmetic
// (addition walk, or multiplication arrow bundle with gcd / cycle readout).
// The widget's params are pure data — a portable frontend can ignore
// renderScript and reimplement the dial from `kind + params` alone (see the
// library for the catalog of kinds).

function formatConfig(params) {
  const lines = ['{'];
  lines.push(`    kind: ${JSON.stringify(params.kind)},`);
  lines.push(`    title: ${JSON.stringify(params.title)},`);
  if (typeof params.hint === 'string') {
    lines.push(`    hint: ${JSON.stringify(params.hint)},`);
  }
  if (typeof params.viewBox === 'string') {
    lines.push(`    viewBox: ${JSON.stringify(params.viewBox)},`);
  }
  if (params.params && typeof params.params === 'object') {
    lines.push(`    params: ${JSON.stringify(params.params)},`);
  }
  lines.push('  }');
  return lines.join('\n');
}

export function renderMarkup(params) {
  // Empty host div. The library builds chrome (header, sliders, SVG dial,
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
    `  if(!window.MVModularArithmeticClock) return;\n` +
    `  MVModularArithmeticClock.init('#${widgetId}', ${formatConfig(params)});\n` +
    `})();\n` +
    `</script>`
  );
}
