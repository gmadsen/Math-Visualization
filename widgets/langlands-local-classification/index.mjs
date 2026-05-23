// langlands-local-classification widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The script embeds `rows` as JSON and rebuilds the
// clickable classification table from it, so a non-HTML frontend can drive its
// own renderer from params alone (validated against ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 200" width="580" height="200" role="img" aria-label="Local Langlands classification for GL_2 over Q_p"><title>GL_2(Q_p) representations matched to Weil-Deligne representations</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, rows } = params;
  const data = JSON.stringify(rows);
  return (
    `<script>\n` +
    `/* langlands-local-classification widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var ROWS = ${data};\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  var KIND = { principal:'--cyan', steinberg:'--yellow', supercuspidal:'--pink' };\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  var W = 580, top = 40, rowH = Math.min(32, (200 - top - 8) / ROWS.length), rx0 = 14, rw = W - 28;\n` +
    `  var picked = null;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    svg.appendChild(mk('text', {x:rx0+12, y:24, 'text-anchor':'start', 'font-size':11, 'font-weight':'600', fill:'var(--cyan)'}, 'GL\\u2082(\\u211a_p) representation'));\n` +
    `    svg.appendChild(mk('text', {x:rx0+260, y:24, 'text-anchor':'start', 'font-size':11, 'font-weight':'600', fill:'var(--yellow)'}, 'Weil\\u2013Deligne representation'));\n` +
    `    svg.appendChild(mk('text', {x:rx0+rw-8, y:24, 'text-anchor':'end', 'font-size':11, 'font-weight':'600', fill:'var(--mute)'}, 'cond.'));\n` +
    `    for(var i=0;i<ROWS.length;i++){\n` +
    `      var r = ROWS[i], y = top + i*rowH, on = picked === r.id;\n` +
    `      var col = 'var(' + (KIND[r.kind] || '--mute') + ')';\n` +
    `      var g = mk('g', {'style':'cursor:pointer'});\n` +
    `      g.appendChild(mk('rect', {x:rx0, y:y, width:rw, height:rowH-6, rx:6, fill:(on?col:'var(--panel2)'), 'fill-opacity':(on?'0.16':'1'), stroke:col, 'stroke-width':(on?'2':'1'), 'stroke-opacity':(on?'1':'0.6')}));\n` +
    `      g.appendChild(mk('text', {x:rx0+12, y:y+(rowH-6)/2+4, 'text-anchor':'start', 'font-size':11, fill:'var(--ink)'}, r.autoType));\n` +
    `      g.appendChild(mk('text', {x:rx0+260, y:y+(rowH-6)/2+4, 'text-anchor':'start', 'font-size':10.5, fill:'var(--mute)'}, r.wdRep));\n` +
    `      g.appendChild(mk('text', {x:rx0+rw-12, y:y+(rowH-6)/2+4, 'text-anchor':'end', 'font-size':11, 'font-weight':'600', fill:col}, r.conductor));\n` +
    `      (function(id){ g.addEventListener('click', function(){ picked = (picked===id)?null:id; draw(); }); })(r.id);\n` +
    `      svg.appendChild(g);\n` +
    `    }\n` +
    `    if(picked){\n` +
    `      var r = ROWS.filter(function(x){return x.id===picked;})[0];\n` +
    `      out.textContent = r.autoType + '   \\u2194   ' + r.wdRep + '\\nconductor exponent: ' + r.conductor + '\\n\\n' + r.detail;\n` +
    `    } else {\n` +
    `      out.textContent = 'Local Langlands for GL\\u2082 (Harris\\u2013Taylor, Henniart 2001): irreducible smooth representations of GL\\u2082(\\u211a_p) match 2-dimensional Frobenius-semisimple Weil\\u2013Deligne representations. The monodromy operator N detects the Steinberg case.\\n\\nclick a representation type.';\n` +
    `    }\n` +
    `  }\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
