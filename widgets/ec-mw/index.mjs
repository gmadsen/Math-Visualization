// ec-mw widget — "Rank & torsion gallery" on the elliptic-curves topic.
//
//   renderMarkup(params)  -> <div class="widget"> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Migrated from a verbatim slug to a semantic renderer: the curve gallery
// (params.curves = {label, eq, rank, tors, note}[]), header title/hint, and DOM
// id prefix are now inspectable params. A dropdown selects a curve; the readout
// shows its Weierstrass equation, Mordell-Weil rank, torsion, and note.
// Output is visually/behaviorally identical to the pre-migration widget.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, idPrefix, curves } = params;
  const options = curves
    .map((c, i) => `    <option value="${i}">${escapeHtml(c.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `<div class="hd"><span class="ttl">${escapeHtml(title)}</span><span class="hint">${escapeHtml(hint)}</span></div>\n` +
    `<div class="row">\n` +
    `  <label>curve <select id="${idPrefix}-sel">\n` +
    `${options}\n` +
    `  </select></label>\n` +
    `</div>\n` +
    `<div id="${idPrefix}-out" class="readout"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { idPrefix, curves } = params;
  const data = curves.map((c) => ({ eq: c.eq, rank: c.rank, tors: c.tors, note: c.note }));
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const sel = document.getElementById('${idPrefix}-sel');\n` +
    `  const out = document.getElementById('${idPrefix}-out');\n` +
    `  const DATA = ${JSON.stringify(data)};\n` +
    `  function upd(){\n` +
    `    const d = DATA[+sel.value];\n` +
    `    out.textContent =\n` +
    `      'E : '+d.eq+'\\n'+\n` +
    `      'rank r = '+d.rank+'\\n'+\n` +
    `      'torsion subgroup: '+d.tors+'\\n'+\n` +
    `      '—\\n'+d.note;\n` +
    `  }\n` +
    `  sel.addEventListener('change', upd);\n` +
    `  upd();\n` +
    `})();\n` +
    `</script>`
  );
}
