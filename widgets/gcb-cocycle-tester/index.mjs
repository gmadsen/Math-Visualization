// gcb-cocycle-tester widget — bespoke registry entry.
//
// Bespoke widget for §1 of galois-cohomology-and-brauer: pick a candidate value of phi(sigma) in Q(i)^* from a dropdown of norm-one and non-norm-one targets, then click test-and-trivialise. The widget reports whether phi extends to a 1-cocycle (norm-one check) and, if so, exhibits an explicit Hilbert-90 witness alpha with sigma(alpha)/alpha = phi(sigma). Shape: select + button + multi-line readout, with bracketing prose rows. Doesn't fit any shared slug.
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
