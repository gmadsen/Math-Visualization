// counterexample-explorer widget — declarative wrapper over the page-global
// MVCounterexampleExplorer library (js/widget-counterexample-explorer.js).
//
// The widget emits an empty host div plus a single `<script>` calling
// `MVCounterexampleExplorer.init('#widgetId', config)`. All chrome (header,
// dropdown, illustration area, hypothesis checklist) is built by the library
// at runtime from the config — this module just serializes the config to
// JS source.
//
// `config.hypotheses` is `[{ id, label }]` and `config.cases` is
// `[{ name, latex?, displayLabel?, svgInner?, hypotheses: { <id>: { pass, note? } } }]`.
// Pure data, no closures: a portable frontend (React, etc.) can ignore
// renderScript and walk the same `cases` / `hypotheses` arrays directly.
//
// renderMarkup + renderScript are pure functions of params. See ./schema.json
// for the authoritative params shape.

function formatConfig(params) {
  // The config object is one giant JSON literal. JSON.stringify is fine for
  // every value we serialize (titles, latex, svgInner, pass/fail booleans) —
  // backslashes and quotes round-trip losslessly.
  const cfg = {
    title: params.title,
  };
  if (typeof params.hint === 'string') cfg.hint = params.hint;
  if (typeof params.viewBox === 'string') cfg.viewBox = params.viewBox;
  cfg.hypotheses = params.hypotheses;
  cfg.cases = params.cases;
  return JSON.stringify(cfg, null, 4)
    // Re-indent by 2 so the closing `}` aligns with `MVCounterexampleExplorer.init('#…',`
    // when nested inside the IIFE.
    .replace(/\n/g, '\n  ');
}

export function renderMarkup(params) {
  // Empty host div. The library builds chrome (header, dropdown, illustration,
  // checklist) at init time inside this element.
  return `<div class="widget" id="${params.widgetId}"></div>`;
}

export function renderScript(params) {
  const { widgetId, sectionComment } = params;
  const banner = sectionComment ? `/* ${sectionComment} */\n` : '';
  return (
    `<script>\n` +
    banner +
    `(function(){\n` +
    `  if(!window.MVCounterexampleExplorer) return;\n` +
    `  MVCounterexampleExplorer.init('#${widgetId}', ${formatConfig(params)});\n` +
    `})();\n` +
    `</script>`
  );
}
