// ec-disc widget — "Discriminant watch" on the elliptic-curves topic.
//
//   renderMarkup(params)  -> <div class="widget"> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Migrated from a verbatim (opaque bodyMarkup/bodyScript) slug to a semantic
// renderer: the slider ranges/defaults (params.a, params.b), header title/hint,
// and DOM id prefix are now inspectable params. The discriminant of
// y^2 = x^3 + a x + b is Delta = -16(4a^3 + 27 b^2); the readout classifies the
// real locus. Output is visually identical to the pre-migration widget.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, idPrefix, a, b } = params;
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `<div class="hd"><span class="ttl">${escapeHtml(title)}</span><span class="hint">${escapeHtml(hint)}</span></div>\n` +
    `<div class="row">\n` +
    `  <label>$a$ <input type="range" id="${idPrefix}-a" min="${a.min}" max="${a.max}" step="${a.step}" value="${a.value}"></label>\n` +
    `  <span id="${idPrefix}-aval" class="small">${a.value}</span>\n` +
    `</div>\n` +
    `<div class="row">\n` +
    `  <label>$b$ <input type="range" id="${idPrefix}-b" min="${b.min}" max="${b.max}" step="${b.step}" value="${b.value}"></label>\n` +
    `  <span id="${idPrefix}-bval" class="small">${b.value}</span>\n` +
    `</div>\n` +
    `<div id="${idPrefix}-out" class="readout"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { idPrefix } = params;
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const A = document.getElementById('${idPrefix}-a');\n` +
    `  const B = document.getElementById('${idPrefix}-b');\n` +
    `  const Av = document.getElementById('${idPrefix}-aval');\n` +
    `  const Bv = document.getElementById('${idPrefix}-bval');\n` +
    `  const out = document.getElementById('${idPrefix}-out');\n` +
    `  function upd(){\n` +
    `    const a = +A.value, b = +B.value;\n` +
    `    Av.textContent = a.toFixed(2);\n` +
    `    Bv.textContent = b.toFixed(2);\n` +
    `    const d = -16*(4*a*a*a + 27*b*b);\n` +
    `    let msg = 'Delta = -16(4a^3 + 27 b^2) = ' + d.toFixed(4);\n` +
    `    if(Math.abs(d) < 1e-3) msg += '\\nnear-singular: curve has a node or cusp.';\n` +
    `    else if(d > 0) msg += '\\nsmooth; real locus has two components (oval + unbounded).';\n` +
    `    else msg += '\\nsmooth; real locus has one unbounded component.';\n` +
    `    out.textContent = msg;\n` +
    `  }\n` +
    `  A.addEventListener('input', upd);\n` +
    `  B.addEventListener('input', upd);\n` +
    `  upd();\n` +
    `})();\n` +
    `</script>`
  );
}
