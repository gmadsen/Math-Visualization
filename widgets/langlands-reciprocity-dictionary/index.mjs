// langlands-reciprocity-dictionary widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The script embeds the column descriptors + matched
// rows as JSON and rebuilds the two-column dictionary from them, so a non-HTML
// frontend can drive its own renderer from params alone (validated against
// ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 600 300" width="600" height="300" role="img" aria-label="Langlands correspondence dictionary"><title>Arithmetic ↔ automorphic dictionary</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, left, right, rows } = params;
  const data = JSON.stringify({ left, right, rows });
  return (
    `<script>\n` +
    `/* langlands-reciprocity-dictionary widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var P = ${data};\n` +
    `  var L = P.left, R = P.right, ROWS = P.rows;\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){\n` +
    `    var e = document.createElementNS(NS, tag);\n` +
    `    for(var k in attrs){ e.setAttribute(k, attrs[k]); }\n` +
    `    if(text != null) e.textContent = text;\n` +
    `    return e;\n` +
    `  }\n` +
    `  var W = 600, boxW = 250, lx = 14, rx = W - 14 - boxW, midX = W/2, rowH = 34, top = 56, boxH = 28;\n` +
    `  var picked = null;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // column headers\n` +
    `    svg.appendChild(mk('text', {x:lx+boxW/2, y:30, 'text-anchor':'middle', 'font-size':13, 'font-weight':'600', fill:'var('+L.color+')'}, L.header));\n` +
    `    svg.appendChild(mk('text', {x:rx+boxW/2, y:30, 'text-anchor':'middle', 'font-size':13, 'font-weight':'600', fill:'var('+R.color+')'}, R.header));\n` +
    `    for(var i=0;i<ROWS.length;i++){\n` +
    `      var row = ROWS[i];\n` +
    `      var y = top + i*rowH;\n` +
    `      var on = picked === row.id;\n` +
    `      var g = mk('g', {'style':'cursor:pointer'});\n` +
    `      // connecting line + symbol\n` +
    `      g.appendChild(mk('line', {x1:lx+boxW, y1:y+boxH/2, x2:rx, y2:y+boxH/2, stroke:(on?'var(--ink)':'var(--line)'), 'stroke-width':(on?'1.4':'0.8')}));\n` +
    `      g.appendChild(mk('text', {x:midX, y:y+boxH/2-5, 'text-anchor':'middle', 'font-size':12, fill:(on?'var(--ink)':'var(--mute)')}, '\\u2194'));\n` +
    `      // left box\n` +
    `      g.appendChild(mk('rect', {x:lx, y:y, width:boxW, height:boxH, rx:6, fill:(on?'var('+L.color+')':'var(--panel2)'), 'fill-opacity':(on?'0.16':'1'), stroke:'var('+L.color+')', 'stroke-width':(on?'2':'1')}));\n` +
    `      g.appendChild(mk('text', {x:lx+boxW/2, y:y+boxH/2+4, 'text-anchor':'middle', 'font-size':11.5, fill:'var(--ink)'}, row.left));\n` +
    `      // right box\n` +
    `      g.appendChild(mk('rect', {x:rx, y:y, width:boxW, height:boxH, rx:6, fill:(on?'var('+R.color+')':'var(--panel2)'), 'fill-opacity':(on?'0.16':'1'), stroke:'var('+R.color+')', 'stroke-width':(on?'2':'1')}));\n` +
    `      g.appendChild(mk('text', {x:rx+boxW/2, y:y+boxH/2+4, 'text-anchor':'middle', 'font-size':11.5, fill:'var(--ink)'}, row.right));\n` +
    `      (function(id){ g.addEventListener('click', function(){ picked = (picked===id)?null:id; draw(); }); })(row.id);\n` +
    `      svg.appendChild(g);\n` +
    `    }\n` +
    `    if(picked){\n` +
    `      var r = ROWS.filter(function(x){return x.id===picked;})[0];\n` +
    `      out.textContent = r.left + '   \\u2194   ' + r.right + '\\n\\n' + r.detail;\n` +
    `    } else {\n` +
    `      out.textContent = 'Each row is a matched pair: the Langlands correspondence is the claim that the two columns biject, with equal L-functions.\\n\\nclick a row to see what the correspondence asserts about it.';\n` +
    `    }\n` +
    `  }\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
