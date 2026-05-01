// modular-curves-cusps-and-wn widget — bespoke registry entry for the modular-curves topic.
//
// Bespoke cusps-and-Atkin–Lehner viewer on the modular-curves topic — buttons pick a level N (12, 14, 15, 30, 36) and the SVG enumerates all cusps of X₀(N) as a/d pairs, drawing arrows for the Atkin–Lehner involution w_N's action on them. The cusp-list plus involution-arrow rendering is bespoke.
//
// Header uses <span class="ttl"> / <span class="hint"> (the modular-curves
// page convention; see widgets/README.md "Bespoke vs. shared").
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, bodyMarkup } = params;
  return (
    `<div class="widget"` + (widgetId ? ` id="${widgetId}"` : "") + `>\n` +
    `  <div class="hd"><span class="ttl">${escapeHtml(title)}</span><span class="hint">${escapeHtml(hint)}</span></div>\n` +
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
