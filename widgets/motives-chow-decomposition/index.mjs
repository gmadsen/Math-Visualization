// motives-chow-decomposition widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The script embeds `varieties` as JSON and rebuilds
// the decomposition from it, so a non-HTML frontend can drive its own renderer
// from params alone (validated against ./schema.json).

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
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 180" width="580" height="180" role="img" aria-label="Chow-motive decomposition of the chosen variety"><title>h(X) decomposed into Tate motives and h^1 pieces</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, varieties } = params;
  const data = JSON.stringify(varieties);
  return (
    `<script>\n` +
    `/* motives-chow-decomposition widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var DATA = ${data};\n` +
    `  var byId = {}; DATA.forEach(function(v){ byId[v.id] = v; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  var SUP = ['\\u2070','\\u00b9','\\u00b2','\\u00b3','\\u2074','\\u2075','\\u2076','\\u2077','\\u2078'];\n` +
    `  function sup(k){ return (k>=0 && k<SUP.length) ? SUP[k] : '^'+k; }\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  var W = 580;\n` +
    `  function draw(){\n` +
    `    var v = byId[sel.value] || DATA[0];\n` +
    `    var pieces = v.pieces.slice().sort(function(a,b){ return a.degree - b.degree; });\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var n = pieces.length, gap = 14, bw = Math.min(96, (W - 28 - (n-1)*gap)/n), bh = 64;\n` +
    `    var totalW = n*bw + (n-1)*gap, sx = (W-totalW)/2, by = 30;\n` +
    `    svg.appendChild(mk('text', {x:W/2, y:18, 'text-anchor':'middle', 'font-size':12, fill:'var(--mute)'}, 'h(X) = the direct sum below   (\\u29f9 between pieces)'));\n` +
    `    var betti = {};\n` +
    `    for(var i=0;i<n;i++){\n` +
    `      var pc = pieces[i], mult = pc.mult || 1, x = sx + i*(bw+gap);\n` +
    `      var col = pc.kind === 'tate' ? 'var(--cyan)' : 'var(--yellow)';\n` +
    `      betti[pc.degree] = (betti[pc.degree] || 0) + pc.dim*mult;\n` +
    `      svg.appendChild(mk('rect', {x:x, y:by, width:bw, height:bh, rx:8, fill:'color-mix(in srgb, '+col+' 13%, var(--panel))', stroke:col, 'stroke-width':1.4}));\n` +
    `      svg.appendChild(mk('text', {x:x+bw/2, y:by+27, 'text-anchor':'middle', 'font-size':17, 'font-weight':'600', fill:col}, pc.label + (mult>1 ? ('\\u2295'+mult) : '')));\n` +
    `      svg.appendChild(mk('text', {x:x+bw/2, y:by+46, 'text-anchor':'middle', 'font-size':10.5, fill:'var(--ink)'}, '\\u2192 H' + sup(pc.degree)));\n` +
    `      svg.appendChild(mk('text', {x:x+bw/2, y:by+59, 'text-anchor':'middle', 'font-size':9.5, fill:'var(--mute)'}, 'dim ' + (pc.dim*mult)));\n` +
    `      if(i < n-1){ svg.appendChild(mk('text', {x:x+bw+gap/2, y:by+bh/2+6, 'text-anchor':'middle', 'font-size':16, fill:'var(--mute)'}, '\\u2295')); }\n` +
    `    }\n` +
    `    var degs = Object.keys(betti).map(Number).sort(function(a,b){return a-b;});\n` +
    `    var maxDeg = degs.length ? degs[degs.length-1] : 0;\n` +
    `    var bstr = [];\n` +
    `    for(var d=0; d<=maxDeg; d++){ bstr.push('b' + sup(d) + '=' + (betti[d]||0)); }\n` +
    `    var lines = [];\n` +
    `    lines.push('h(X) = ' + pieces.map(function(p){ return p.label + ((p.mult||1)>1 ? ('^{\\u2295'+(p.mult)+'}') : ''); }).join(' \\u2295 '));\n` +
    `    lines.push('Tate motives 𝕃\\u2071 = \\u211a(\\u2212i) are 1-dimensional of pure type (i,i); the h\\u00b9 pieces carry the transcendental part.');\n` +
    `    lines.push('Betti realization (dim per degree):  ' + bstr.join('  '));\n` +
    `    if(v.note){ lines.push(''); lines.push(v.note); }\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
