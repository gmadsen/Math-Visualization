// three-body-horseshoe widget — bespoke registry entry for the §4 Smale-
// horseshoe symbolic-itinerary illustration on the `three-body-problem`
// topic.
//
// The widget exposes step / step-back / reset buttons combined with an
// iteration slider (all in one row) above an SVG that shows the surviving
// Cantor-rectangle grid after $n$ horseshoe iterations, plus a readout that
// prints an example length-$n$ binary itinerary. The shape doesn't fit any
// shared slug; this slug captures it as one unit.
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>

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
