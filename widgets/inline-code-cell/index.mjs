// inline-code-cell widget — declarative wrapper over the page-global
// MVInlineCodeCell library (js/widget-inline-code-cell.js).
//
// The widget emits an empty host div plus a single `<script>` calling
// `MVInlineCodeCell.init('#widgetId', config)`. All chrome (textarea
// editor, Run button, output area) is built by the library at runtime
// from the config — this module just serializes the config to JS source.
//
// User code runs in a sandboxed Web Worker (no DOM access, no parent
// globals, no fetch by default in workers) with a 2-second hard timeout,
// so a portable frontend can adopt the same params shape and supply its
// own equivalent sandbox.
//
// renderMarkup + renderScript are pure functions of params. See
// ./schema.json for the authoritative params shape.

function formatConfig(params) {
  const lines = ['{'];
  lines.push(`    title: ${JSON.stringify(params.title)},`);
  if (typeof params.hint === 'string') {
    lines.push(`    hint: ${JSON.stringify(params.hint)},`);
  }
  if (typeof params.initialCode === 'string') {
    lines.push(`    initialCode: ${JSON.stringify(params.initialCode)},`);
  }
  if (typeof params.prelude === 'string') {
    lines.push(`    prelude: ${JSON.stringify(params.prelude)},`);
  }
  if (typeof params.rows === 'number') {
    lines.push(`    rows: ${params.rows},`);
  }
  if (typeof params.runLabel === 'string') {
    lines.push(`    runLabel: ${JSON.stringify(params.runLabel)},`);
  }
  lines.push('  }');
  return lines.join('\n');
}

export function renderMarkup(params) {
  // Empty host div. The library builds chrome (header, textarea, Run
  // button, output area) at init time inside this element.
  return `<div class="widget" id="${params.widgetId}"></div>`;
}

export function renderScript(params) {
  const { widgetId, sectionComment } = params;
  const banner = sectionComment ? `/* ${sectionComment} */\n` : '';
  return (
    `<script>\n` +
    banner +
    `(function(){\n` +
    `  if(!window.MVInlineCodeCell) return;\n` +
    `  MVInlineCodeCell.init('#${widgetId}', ${formatConfig(params)});\n` +
    `})();\n` +
    `</script>`
  );
}
