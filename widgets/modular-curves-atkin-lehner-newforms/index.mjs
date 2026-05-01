// modular-curves-atkin-lehner-newforms widget — bespoke registry entry for the modular-curves topic.
//
// Bespoke Atkin–Lehner / old-new decomposition viewer on the modular-curves topic — buttons pick a composite N (33, 55, 66, 77) and the SVG diagrams |W_N| = 2^ω(N) along with the dimension counts dim S_2^old vs dim S_2^new for the corresponding newform decomposition. The factor-pair decomposition with old/new dimension stacked-bar rendering is bespoke.
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
