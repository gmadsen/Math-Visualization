// constraint-bifurcation-explorer widget — declarative wrapper over the
// page-global MVConstraintBifurcationExplorer library
// (js/widget-constraint-bifurcation-explorer.js).
//
// Emits an empty host div + a single `<script>` that calls
// `MVConstraintBifurcationExplorer.init('#widgetId', config)`. The library owns
// chrome, the slider, the marching-pixels sampler, and the KaTeX readout per
// `kind`. The widget's params are pure data — a portable frontend can ignore
// renderScript and reimplement the sampler from `kind + params + domain` alone
// (catalog of kinds documented in the library).

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
  if (params.domain && typeof params.domain === 'object') {
    lines.push(`    domain: ${JSON.stringify(params.domain)},`);
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
    `  if(!window.MVConstraintBifurcationExplorer) return;\n` +
    `  MVConstraintBifurcationExplorer.init('#${widgetId}', ${formatConfig(params)});\n` +
    `})();\n` +
    `</script>`
  );
}
