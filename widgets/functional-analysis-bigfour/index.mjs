// functional-analysis-bigfour widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A tab map of the big-four Banach-space theorems: the
// reader clicks a theorem and sees its input → output one-liner, statement, and
// what powers it. Data-only (theorems validated against ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, theorems } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const tabs = theorems
    .map((t, i) => `    <button data-i="${i}"${i === 0 ? ' class="active"' : ''}>${escapeHtml(t.name)}</button>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-tabs">\n${tabs}\n  </div>\n` +
    `  <div class="note" id="${widgetId}-body" style="min-height:5.5em"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, theorems } = params;
  const data = JSON.stringify(theorems);
  return (
    `<script>\n` +
    `/* functional-analysis-bigfour widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var THMS = ${data};\n` +
    `  var tabs = document.getElementById('${widgetId}-tabs');\n` +
    `  var body = document.getElementById('${widgetId}-body');\n` +
    `  if(!tabs || !body) return;\n` +
    `  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }\n` +
    `  var btns = tabs.querySelectorAll('button');\n` +
    `  function show(i){\n` +
    `    var t = THMS[i]; if(!t) return;\n` +
    `    for(var k=0;k<btns.length;k++) btns[k].className = (k===i)?'active':'';\n` +
    `    var pw = t.poweredBy ? ('<div style=\"font-size:.85em;color:var(--mute);margin-top:.4rem\">powered by ' + esc(t.poweredBy) + '</div>') : '';\n` +
    `    body.innerHTML = '<div style=\"margin-bottom:.4rem\"><span style=\"color:var(--cyan)\">given</span> ' + esc(t.input) + '  <span style=\"color:var(--mute)\">\\u2192</span>  <span style=\"color:var(--yellow)\">then</span> ' + esc(t.output) + '</div><div>' + esc(t.statement) + '</div>' + pw;\n` +
    `  }\n` +
    `  for(var k=0;k<btns.length;k++){ (function(j){ btns[j].addEventListener('click', function(){ show(j); }); })(k); }\n` +
    `  show(0);\n` +
    `})();\n` +
    `</script>`
  );
}
