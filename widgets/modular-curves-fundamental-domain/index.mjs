// modular-curves-fundamental-domain widget — bespoke registry entry for the modular-curves topic.
//
// Bespoke fundamental-domain visualizer for Γ₀(N) on the modular-curves topic — a level selector picks prime N (2,3,5,7,11) and the SVG redraws the union of [SL₂(ℤ):Γ₀(N)] coset-tile copies of the canonical SL₂(ℤ) fundamental domain. The bespoke coset-tile rendering with index/cusp pills and the Cayley-graph layout of cosets don't fit any shared slug.
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
