// modular-curves-mazur-torsion widget — bespoke registry entry for the modular-curves topic.
//
// Bespoke Mazur-torsion viewer on the modular-curves topic — buttons step through orders N from 1 to 16, and the SVG/readout classifies each as occurs / excluded / cuspidal-only, summarising Mazur's torsion theorem and the role of X₁(N). The order-by-order decision pane is bespoke.
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
