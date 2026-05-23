// hodge-theory-filtration-scrubber widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The script embeds `varieties` as JSON and rebuilds
// the filtration view from the Hodge matrices, so a non-HTML frontend can drive
// its own renderer from params alone (validated against ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, varieties } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = varieties
    .map((v, i) => `      <option value="${escapeHtml(v.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(v.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">variety</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-deg">degree $n$</label>\n` +
    `    <input type="range" id="${widgetId}-deg" min="0" max="6" value="2" step="1">\n` +
    `    <span class="pill" id="${widgetId}-degval">n = 2</span>\n` +
    `    <label for="${widgetId}-p">threshold $p$</label>\n` +
    `    <input type="range" id="${widgetId}-p" min="0" max="3" value="1" step="1">\n` +
    `    <span class="pill" id="${widgetId}-pval">p = 1</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 200" width="560" height="200" role="img" aria-label="Hodge filtration on the chosen degree"><title>Hodge filtration F^p splitting H^n</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, varieties } = params;
  const data = JSON.stringify(varieties);
  return (
    `<script>\n` +
    `/* hodge-theory-filtration-scrubber widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var DATA = ${data};\n` +
    `  var byId = {}; DATA.forEach(function(v){ byId[v.id] = v; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var deg = document.getElementById('${widgetId}-deg'), degL = document.getElementById('${widgetId}-degval');\n` +
    `  var pIn = document.getElementById('${widgetId}-p'), pL = document.getElementById('${widgetId}-pval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !deg || !pIn || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  var SUP = ['\\u2070','\\u00b9','\\u00b2','\\u00b3','\\u2074','\\u2075','\\u2076','\\u2077','\\u2078'];\n` +
    `  function sup(k){ return (k>=0 && k<SUP.length) ? SUP[k] : '^'+k; }\n` +
    `  function pqLabel(p,q){ return 'H'+sup(p)+'\\u140f'+sup(q); }\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function curV(){ return byId[sel.value] || DATA[0]; }\n` +
    `  function dimOf(v){ return v.h.length - 1; }\n` +
    `  function H(v,p,q){ return (v.h[p] && v.h[p][q] != null) ? v.h[p][q] : 0; }\n` +
    `  function syncRanges(){\n` +
    `    var v = curV(), d = dimOf(v);\n` +
    `    deg.max = 2*d; if(+deg.value > 2*d) deg.value = Math.min(d, 2*d);\n` +
    `    var n = +deg.value; pIn.max = n+1; if(+pIn.value > n+1) pIn.value = n+1;\n` +
    `  }\n` +
    `  function draw(){\n` +
    `    var v = curV(), d = dimOf(v), n = +deg.value, pp = +pIn.value;\n` +
    `    degL.textContent = 'n = ' + n; pL.textContent = 'p = ' + pp;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var lo = Math.max(0, n-d), hi = Math.min(n, d);\n` +
    `    var ps = []; for(var pr=lo; pr<=hi; pr++) ps.push(pr);\n` +
    `    var W = 560, bw = Math.min(78, (W-40)/Math.max(1,ps.length) - 10), gap = 10;\n` +
    `    var totalW = ps.length*bw + (ps.length-1)*gap, sx = (W-totalW)/2, by = 56, bh = 56;\n` +
    `    svg.appendChild(mk('text', {x:W/2, y:30, 'text-anchor':'middle', 'font-size':12, fill:'var(--mute)'}, 'the summands of H' + sup(n) + '  (degree n = ' + n + ');  yellow = inside F' + sup(pp)));\n` +
    `    var inF = 0, comp = 0;\n` +
    `    for(var i=0;i<ps.length;i++){\n` +
    `      var pr = ps[i], q = n-pr, dim = H(v,pr,q), x = sx + i*(bw+gap);\n` +
    `      var on = pr >= pp;\n` +
    `      if(on) inF += dim; else comp += dim;\n` +
    `      svg.appendChild(mk('rect', {x:x, y:by, width:bw, height:bh, rx:6, fill:(on?'var(--yellow)':'var(--panel2)'), 'fill-opacity':(on?'0.16':'1'), stroke:(on?'var(--yellow)':'var(--cyan)'), 'stroke-width':(on?'2':'1'), 'stroke-opacity':(on?'1':'0.5')}));\n` +
    `      svg.appendChild(mk('text', {x:x+bw/2, y:by+26, 'text-anchor':'middle', 'font-size':16, 'font-weight':'600', fill:'var(--ink)'}, String(dim)));\n` +
    `      svg.appendChild(mk('text', {x:x+bw/2, y:by+46, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)'}, pqLabel(pr,q)));\n` +
    `    }\n` +
    `    // threshold divider between p'=pp-1 and p'=pp\n` +
    `    var idx = pp - lo; // first box index with pr>=pp\n` +
    `    if(idx > 0 && idx < ps.length){ var dx = sx + idx*(bw+gap) - gap/2; svg.appendChild(mk('line', {x1:dx, y1:by-8, x2:dx, y2:by+bh+8, stroke:'var(--yellow)', 'stroke-width':1.5, 'stroke-dasharray':'4 3'})); }\n` +
    `    svg.appendChild(mk('text', {x:W/2, y:by+bh+34, 'text-anchor':'middle', 'font-size':11, 'font-style':'italic', fill:'var(--mute)'}, 'left of the line = conj(F' + sup(n-pp+1) + '),  the complementary half'));\n` +
    `    var bn = inF + comp;\n` +
    `    var lines = [];\n` +
    `    lines.push('F' + sup(pp) + ' H' + sup(n) + '  =  \\u2295 H' + sup('p\\u2032\\u2265'+pp) + ',q   (the yellow summands)');\n` +
    `    lines.push('dim F' + sup(pp) + ' = ' + inF + '     dim of the complement = ' + comp + '     b' + sup(n) + ' = ' + bn);\n` +
    `    lines.push('decreasing filtration:  F\\u2070 \\u2287 F\\u00b9 \\u2287 \\u22ef \\u2287 F' + sup(n) + ' \\u2287 0');\n` +
    `    lines.push('recovery:  H' + sup(n) + ' = F' + sup(pp) + ' \\u2295 conj(F' + sup(n-pp+1) + ')   \\u2014   ' + inF + ' + ' + comp + ' = ' + bn + (inF+comp===bn?'  \\u2713':''));\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', function(){ var v=curV(), d=dimOf(v); deg.value = Math.min(d, 2*d); syncRanges(); pIn.value = Math.min(1, +pIn.max); draw(); });\n` +
    `  deg.addEventListener('input', function(){ syncRanges(); draw(); });\n` +
    `  pIn.addEventListener('input', draw);\n` +
    `  (function(){ var v=curV(), d=dimOf(v); deg.value = Math.min(d, 2*d); syncRanges(); draw(); })();\n` +
    `})();\n` +
    `</script>`
  );
}
