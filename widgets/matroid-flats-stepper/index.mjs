// matroid-flats-stepper widget — bespoke registry entry for the §4 flats of M(K_4) widget
// on the `matroid-theory` topic.
//
// The widget combines a prev/next stepper over ranks 0–3 of the geometric lattice of $M(K_4)$, with an SVG that highlights the flats at each rank and a readout listing them. The shape is bespoke; this slug
// captures it as one unit.
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>
//
// Both are pure functions of params (no I/O). A portable consumer ignores
// `bodyMarkup` and `bodyScript` and rebuilds the widget from typed inputs.

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
