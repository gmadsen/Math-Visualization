// gcb-tate-pairing-table widget — bespoke registry entry.
//
// Bespoke widget for §5 of galois-cohomology-and-brauer: choose an odd prime p and two square-classes a-bar, b-bar in Q_p^x/(Q_p^x)^2, the SVG renders the Hilbert-symbol/Tate-pairing table and the readout reports the cup-product class in H^2(Q_p, mu_2). Shape: triple selects + bespoke SVG table + readout + prose. Doesn't fit any shared slug.
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
