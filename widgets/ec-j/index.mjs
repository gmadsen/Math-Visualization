// ec-j widget — "j-invariant calculator" on the elliptic-curves topic.
//
//   renderMarkup(params)  -> <div class="widget"> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Migrated from a verbatim slug to a semantic renderer: slider ranges/defaults
// (params.a, params.b), header title/hint, DOM id prefix, and the preset CM-curve
// gallery (params.presets) are now inspectable params. The j-invariant
// j = 1728 * 4a^3 / (4a^3 + 27 b^2) and the CM annotations are intrinsic logic.
// Output is visually/behaviorally identical to the pre-migration widget.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, idPrefix, a, b, presets } = params;
  const presetBtns = presets
    .map((p) => `  <button data-ab="${p.a},${p.b}">${p.label}</button>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `<div class="hd"><span class="ttl">${escapeHtml(title)}</span><span class="hint">${escapeHtml(hint)}</span></div>\n` +
    `<div class="row">\n` +
    `  <label>$a$ <input type="range" id="${idPrefix}-a" min="${a.min}" max="${a.max}" step="${a.step}" value="${a.value}"></label>\n` +
    `  <span id="${idPrefix}-aval" class="small">${a.value}</span>\n` +
    `  <label>$b$ <input type="range" id="${idPrefix}-b" min="${b.min}" max="${b.max}" step="${b.step}" value="${b.value}"></label>\n` +
    `  <span id="${idPrefix}-bval" class="small">${b.value}</span>\n` +
    `</div>\n` +
    `<div class="row">\n` +
    `${presetBtns}\n` +
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
    `  function compute(a, b){\n` +
    `    Av.textContent = a.toFixed(2);\n` +
    `    Bv.textContent = b.toFixed(2);\n` +
    `    const D = -16*(4*a*a*a + 27*b*b);\n` +
    `    const numer = 4*a*a*a;\n` +
    `    const denom = 4*a*a*a + 27*b*b;\n` +
    `    let msg;\n` +
    `    if(Math.abs(denom) < 1e-9){\n` +
    `      msg = 'Δ = 0 (singular); j undefined (or ∞)';\n` +
    `    } else {\n` +
    `      const j = 1728 * numer / denom;\n` +
    `      msg = 'a = '+a+',  b = '+b+'\\n'+\n` +
    `            'Δ = -16(4a³+27b²) = '+D+'\\n'+\n` +
    `            'j = 1728 · 4a³/(4a³+27b²) = '+j;\n` +
    `      if(Math.abs(j) < 1e-6) msg += '\\nj = 0: CM by Z[ω], endomorphism e^(2πi/3).';\n` +
    `      else if(Math.abs(j - 1728) < 1e-3) msg += '\\nj = 1728: CM by Z[i], endomorphism i.';\n` +
    `    }\n` +
    `    out.textContent = msg;\n` +
    `  }\n` +
    `  function updFromSliders(){ compute(+A.value, +B.value); }\n` +
    `  A.addEventListener('input', updFromSliders);\n` +
    `  B.addEventListener('input', updFromSliders);\n` +
    `  document.querySelectorAll('button[data-ab]').forEach(btn=>{\n` +
    `    btn.addEventListener('click', ()=>{\n` +
    `      const [a,b] = btn.dataset.ab.split(',').map(Number);\n` +
    `      compute(a, b);\n` +
    `    });\n` +
    `  });\n` +
    `  updFromSliders();\n` +
    `})();\n` +
    `</script>`
  );
}
