// advanced-complex-analysis-landscape widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A thematic map of a landscape/overview section: the
// reader clicks a thread tab and sees its one-line idea plus member theorems as
// in-page anchor links. Data-only (threads validated against ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, threads } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const tabs = threads
    .map((t, i) => `    <button data-i="${i}"${i === 0 ? ' class="active"' : ''}>${escapeHtml(t.name)}</button>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-tabs">\n${tabs}\n  </div>\n` +
    `  <div class="note" id="${widgetId}-body" style="min-height:4.5em"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, threads } = params;
  const data = JSON.stringify(threads);
  return (
    `<script>\n` +
    `/* advanced-complex-analysis-landscape widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var THREADS = ${data};\n` +
    `  var tabs = document.getElementById('${widgetId}-tabs');\n` +
    `  var body = document.getElementById('${widgetId}-body');\n` +
    `  if(!tabs || !body) return;\n` +
    `  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }\n` +
    `  var btns = tabs.querySelectorAll('button');\n` +
    `  function show(i){\n` +
    `    var t = THREADS[i]; if(!t) return;\n` +
    `    for(var k=0;k<btns.length;k++) btns[k].className = (k===i)?'active':'';\n` +
    `    var links = t.members.map(function(m){ return '<a href=\"#' + esc(m.anchor) + '\">' + esc(m.label) + '</a>'; }).join('  ·  ');\n` +
    `    body.innerHTML = '<div style=\"margin-bottom:.4rem\">' + esc(t.blurb) + '</div><div style=\"font-size:.92em\">' + links + '</div>';\n` +
    `  }\n` +
    `  for(var k=0;k<btns.length;k++){ (function(j){ btns[j].addEventListener('click', function(){ show(j); }); })(k); }\n` +
    `  show(0);\n` +
    `})();\n` +
    `</script>`
  );
}
