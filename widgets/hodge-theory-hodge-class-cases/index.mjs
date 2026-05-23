// hodge-theory-hodge-class-cases widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The script embeds `cases` as JSON and rebuilds the
// clickable status table from it, so a non-HTML frontend can drive its own
// renderer from params alone (validated against ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 280" width="560" height="280" role="img" aria-label="Status of the Hodge conjecture across cases"><title>Hodge conjecture: known / partial / open / false, by case</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, cases } = params;
  const data = JSON.stringify(cases);
  return (
    `<script>\n` +
    `/* hodge-theory-hodge-class-cases widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var CASES = ${data};\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  var STATUS = { known:{c:'--green',t:'known'}, partial:{c:'--cyan',t:'partial'}, open:{c:'--yellow',t:'OPEN'}, 'false':{c:'--pink',t:'FALSE'} };\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  var W = 560, top = 16, rowH = Math.min(34, (280 - top - 8) / CASES.length), rx0 = 14, rw = W - 28;\n` +
    `  var picked = null;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    for(var i=0;i<CASES.length;i++){\n` +
    `      var c = CASES[i], y = top + i*rowH, on = picked === c.id;\n` +
    `      var st = STATUS[c.status] || STATUS.open, col = 'var(' + st.c + ')';\n` +
    `      var g = mk('g', {'style':'cursor:pointer'});\n` +
    `      g.appendChild(mk('rect', {x:rx0, y:y, width:rw, height:rowH-6, rx:6, fill:(on?col:'var(--panel2)'), 'fill-opacity':(on?'0.16':'1'), stroke:col, 'stroke-width':(on?'2':'1'), 'stroke-opacity':(on?'1':'0.7')}));\n` +
    `      g.appendChild(mk('text', {x:rx0+12, y:y+(rowH-6)/2+4, 'text-anchor':'start', 'font-size':12, fill:'var(--ink)'}, c.variety));\n` +
    `      g.appendChild(mk('text', {x:rx0+rw-150, y:y+(rowH-6)/2+4, 'text-anchor':'end', 'font-size':11, fill:'var(--mute)'}, c.codim));\n` +
    `      // status badge\n` +
    `      var bw = 96, bx = rx0+rw-bw-8, byy = y+3;\n` +
    `      g.appendChild(mk('rect', {x:bx, y:byy, width:bw, height:rowH-12, rx:9, fill:'color-mix(in srgb, '+col+' 22%, var(--panel))', stroke:col, 'stroke-width':1}));\n` +
    `      g.appendChild(mk('text', {x:bx+bw/2, y:byy+(rowH-12)/2+4, 'text-anchor':'middle', 'font-size':10.5, 'font-weight':'600', fill:col}, st.t));\n` +
    `      (function(id){ g.addEventListener('click', function(){ picked = (picked===id)?null:id; draw(); }); })(c.id);\n` +
    `      svg.appendChild(g);\n` +
    `    }\n` +
    `    if(picked){\n` +
    `      var c = CASES.filter(function(x){return x.id===picked;})[0];\n` +
    `      var st = STATUS[c.status] || STATUS.open;\n` +
    `      out.textContent = c.variety + '   (' + c.codim + ')   \\u2014   ' + st.t + '\\n\\n' + c.reason;\n` +
    `    } else {\n` +
    `      out.textContent = 'The Hodge conjecture: every rational class of type (p,p) is a combination of algebraic cycle classes. Proven for p=1 (Lefschetz), open in general.\\n\\nclick a case to see what is known and why.';\n` +
    `    }\n` +
    `  }\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
