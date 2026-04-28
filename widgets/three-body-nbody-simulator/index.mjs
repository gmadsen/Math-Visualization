// three-body-nbody-simulator widget — bespoke registry entry for the §1
// N-body simulator on the `three-body-problem` topic.
//
// The widget is a row of 4 preset buttons (2-body Kepler, Lagrange equilateral,
// figure-eight, generic 3-body), a row of pause/reset/speed controls, an SVG
// host where orbit traces accumulate as the leapfrog integrator advances, and
// a readout reporting energy + angular-momentum drift. The trailing
// `<p class="small">` carries the Chenciner–Montgomery initial-conditions
// credit. The shape is bespoke; this slug captures it as one unit.
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>
//
// Both are pure functions of params (no I/O). A portable consumer ignores
// `bodyMarkup` and `bodyScript` and rebuilds the simulator from a typed
// preset list + integrator config.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, bodyMarkup } = params;
  return (
    `<div class="widget"` + (widgetId ? ` id="${widgetId}"` : "") + `>\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div><div class="hint">${escapeHtml(hint)}</div></div>\n` +
    `${bodyMarkup}\n` +
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
