// proof-scrubber widget — declarative wrapper over the page-global
// MVProofScrubber library (js/widget-proof-scrubber.js).
//
// The widget emits an empty host div plus a single `<script>` calling
// `MVProofScrubber.init('#widgetId', config)`. All chrome (slider, play
// button, step chips, readout, optional SVG diagram) is built by the library
// at runtime from the config — this module just serializes the config to
// JS source.
//
// `config.steps` is `[{ title, body, svgInner? }]`: pure data, no closures.
// The library appends `svgInner` (raw SVG fragments) into its diagram on
// step change, so a portable frontend (React, etc.) can ignore renderScript
// and walk the same `steps` array directly.
//
// renderMarkup + renderScript are pure functions of params. See ./schema.json
// for the authoritative params shape.

function indent(n) {
  return ' '.repeat(n);
}

function jsonStringWithSingleQuotes(_) {
  // We don't use single quotes — JSON.stringify is fine. Keeping the function
  // here as a marker that the library reads the config as JSON-via-JS, so
  // anything `JSON.stringify` produces is consumable as JS.
  throw new Error('proof-scrubber: unused helper invoked');
}

function formatStep(step, depth) {
  // Each step renders as one JS object literal across multiple lines so the
  // result reads like the hand-authored config. Every value goes through
  // JSON.stringify so HTML / KaTeX content with backslashes and quotes
  // serializes losslessly.
  const pad = indent(depth);
  const inner = indent(depth + 2);
  const lines = [`${pad}{`];
  lines.push(`${inner}title: ${JSON.stringify(step.title)},`);
  lines.push(`${inner}body: ${JSON.stringify(step.body)},`);
  if (typeof step.svgInner === 'string') {
    lines.push(`${inner}svgInner: ${JSON.stringify(step.svgInner)},`);
  }
  lines.push(`${pad}}`);
  return lines.join('\n');
}

function formatSteps(steps, depth) {
  const pad = indent(depth);
  const inner = indent(depth + 2);
  const items = steps.map((s) => formatStep(s, depth + 2)).join(',\n');
  return `${pad}[\n${items},\n${pad}]`.replace(`${pad}[\n`, `[\n`);
}

function formatConfig(params) {
  // Build the config literal. The `init` call sits inside the IIFE, indented
  // 2 spaces; the config object opens on the same line and its keys indent
  // 4 spaces. The `steps` array is one element per line for readability.
  const lines = ['{'];
  lines.push(`    title: ${JSON.stringify(params.title)},`);
  if (typeof params.hint === 'string') {
    lines.push(`    hint: ${JSON.stringify(params.hint)},`);
  }
  if (typeof params.viewBox === 'string') {
    lines.push(`    viewBox: ${JSON.stringify(params.viewBox)},`);
  }
  if (typeof params.autoplayMs === 'number') {
    lines.push(`    autoplayMs: ${params.autoplayMs},`);
  }
  lines.push(`    steps: ${formatSteps(params.steps, 4)},`);
  lines.push('  }');
  return lines.join('\n');
}

export function renderMarkup(params) {
  // Empty host div. The library builds chrome (header, controls, SVG,
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
    `  if(!window.MVProofScrubber) return;\n` +
    `  MVProofScrubber.init('#${widgetId}', ${formatConfig(params)});\n` +
    `})();\n` +
    `</script>`
  );
}
