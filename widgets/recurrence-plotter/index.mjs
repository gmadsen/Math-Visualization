// recurrence-plotter widget — declarative wrapper over the page-global
// MVRecurrencePlotter library (js/widget-recurrence-plotter.js).
//
// Emits an empty host div + a single `<script>` that calls
// `MVRecurrencePlotter.init('#widgetId', config)`. The library owns
// chrome, sliders, the cobweb / trajectory rendering, and the iteration
// code per `kind`. The widget's params are pure data — a portable frontend
// can ignore renderScript and reimplement the iteration from `kind +
// params` alone (catalog of kinds documented in the library).

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
  return `<div class="widget" id="${params.widgetId}"></div>`;
}

export function renderScript(params) {
  const { widgetId, sectionComment } = params;
  const banner = sectionComment ? `/* ${sectionComment} */\n` : '';
  return (
    `<script>\n` +
    banner +
    `(function(){\n` +
    `  if(!window.MVRecurrencePlotter) return;\n` +
    `  MVRecurrencePlotter.init('#${widgetId}', ${formatConfig(params)});\n` +
    `})();\n` +
    `</script>`
  );
}
