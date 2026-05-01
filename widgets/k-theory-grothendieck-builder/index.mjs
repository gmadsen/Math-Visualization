// k-theory-grothendieck-builder widget — bespoke registry entry.
//
// Reader builds elements of K^0(X) by adding/subtracting line bundles on a curve, P^1, or P^2 — interactive Grothendieck-group construction.
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
