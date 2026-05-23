// motives-standard-conjectures widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The script embeds `items` as JSON and rebuilds the
// clickable status table from it, so a non-HTML frontend can drive its own
// renderer from params alone (validated against ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 280" width="580" height="280" role="img" aria-label="Status of the standard conjectures and related results"><title>Standard conjectures: known / partial / open</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, items } = params;
  const data = JSON.stringify(items);
  return (
    `<script>\n` +
    `/* motives-standard-conjectures widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var ITEMS = ${data};\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  var STATUS = { known:{c:'--green',t:'known'}, partial:{c:'--cyan',t:'partial'}, open:{c:'--yellow',t:'OPEN'} };\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  var W = 580, top = 14, rowH = Math.min(34, (280 - top - 8) / ITEMS.length), rx0 = 14, rw = W - 28;\n` +
    `  var picked = null;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    for(var i=0;i<ITEMS.length;i++){\n` +
    `      var it = ITEMS[i], y = top + i*rowH, on = picked === it.id;\n` +
    `      var st = STATUS[it.status] || STATUS.open, col = 'var(' + st.c + ')';\n` +
    `      var g = mk('g', {'style':'cursor:pointer'});\n` +
    `      g.appendChild(mk('rect', {x:rx0, y:y, width:rw, height:rowH-6, rx:6, fill:(on?col:'var(--panel2)'), 'fill-opacity':(on?'0.16':'1'), stroke:col, 'stroke-width':(on?'2':'1'), 'stroke-opacity':(on?'1':'0.7')}));\n` +
    `      g.appendChild(mk('text', {x:rx0+12, y:y+(rowH-6)/2+4, 'text-anchor':'start', 'font-size':12, 'font-weight':'600', fill:'var(--ink)'}, it.name));\n` +
    `      g.appendChild(mk('text', {x:rx0+150, y:y+(rowH-6)/2+4, 'text-anchor':'start', 'font-size':10.5, fill:'var(--mute)'}, it.statement));\n` +
    `      var bw = 84, bx = rx0+rw-bw-8, byy = y+3;\n` +
    `      g.appendChild(mk('rect', {x:bx, y:byy, width:bw, height:rowH-12, rx:9, fill:'color-mix(in srgb, '+col+' 22%, var(--panel))', stroke:col, 'stroke-width':1}));\n` +
    `      g.appendChild(mk('text', {x:bx+bw/2, y:byy+(rowH-12)/2+4, 'text-anchor':'middle', 'font-size':10.5, 'font-weight':'600', fill:col}, st.t));\n` +
    `      (function(id){ g.addEventListener('click', function(){ picked = (picked===id)?null:id; draw(); }); })(it.id);\n` +
    `      svg.appendChild(g);\n` +
    `    }\n` +
    `    if(picked){\n` +
    `      var it = ITEMS.filter(function(x){return x.id===picked;})[0];\n` +
    `      var st = STATUS[it.status] || STATUS.open;\n` +
    `      out.textContent = it.name + '   \\u2014   ' + st.t + '\\n' + it.statement + '\\n\\n' + it.reason;\n` +
    `    } else {\n` +
    `      out.textContent = 'The standard conjectures (Grothendieck, 1968) are the specifications motives need — open in general for 60 years, but a surprising amount around them is known unconditionally.\\n\\nclick an item for its statement and status.';\n` +
    `    }\n` +
    `  }\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
