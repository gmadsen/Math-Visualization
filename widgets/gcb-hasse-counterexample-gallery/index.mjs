// gcb-hasse-counterexample-gallery widget — bespoke registry entry.
//
// Bespoke widget for §6 of galois-cohomology-and-brauer: pick a classical Hasse-principle counterexample (Selmer 3X^3+4Y^3+5Z^3=0, Lind, Reichardt, a Brauer-Manin quartic), click to render local invariants per place v as colored boxes summing to a nonzero class in Q/Z. Shape: select + button + bespoke SVG invariant grid + readout + prose. Doesn't fit any shared slug.
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
