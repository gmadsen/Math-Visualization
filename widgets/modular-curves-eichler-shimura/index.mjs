// modular-curves-eichler-shimura widget — bespoke registry entry for the modular-curves topic.
//
// Bespoke Eichler–Shimura visualizer on the modular-curves topic — buttons select a level N (11, 17, 23, 37) and the SVG diagrams the equivalence S₂(Γ₀(N)) ↔ Ω¹(X₀(N)) ↔ J₀(N), with matched dimensions g, dim S_2, and dim J_0(N) reported in the readout. The three-column correspondence diagram with paired dimension counts is bespoke.
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
