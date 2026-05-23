// schemes-dimension widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The chain + geometry come from params. The widget
// draws a maximal chain of primes as a ladder; Krull dim = chain length − 1.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, rings } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = rings
    .map((g, i) => `      <option value="${escapeHtml(g.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(g.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">ring $R$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 270" width="540" height="270" role="img" aria-label="A maximal chain of prime ideals with its geometric meaning"><title>Krull dimension: the length of the longest chain of prime ideals</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, rings } = params;
  const data = JSON.stringify(rings);
  return (
    `<script>\n` +
    `/* schemes-dimension widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var RINGS = ${data};\n` +
    `  var byId = {}; RINGS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var svg = document.getElementById('${widgetId}-svg'), out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || RINGS[0], steps=g.steps, L=steps.length, d=L-1;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var LX=150, top=56, bot=232, step=(L>1)?(bot-top)/(L-1):0;\n` +
    `    // connecting spine\n` +
    `    if(L>1) svg.appendChild(mk('line', {x1:LX, y1:top, x2:LX, y2:bot, stroke:'var(--line)', 'stroke-width':1.4}));\n` +
    `    var i; for(i=0;i<L;i++){ var y = (L>1)? top+step*i : (top+bot)/2; var dimHere = d-i; // dim of V(p_i)\n` +
    `      // a small nested-size marker: bigger box = bigger-dimensional V(p_i)\n` +
    `      var r = 6 + dimHere*3;\n` +
    `      svg.appendChild(mk('circle', {cx:LX, cy:y, r:r, fill: i===0?'color-mix(in srgb, var(--violet) 22%, transparent)':'color-mix(in srgb, var(--cyan) 18%, transparent)', stroke: i===0?'var(--violet)':'var(--cyan)', 'stroke-width':1.5}));\n` +
    `      // prime label (left) + geometry (right)\n` +
    `      svg.appendChild(mk('text', {x:LX-r-10, y:y+4, 'text-anchor':'end', 'font-size':12, fill: i===0?'var(--violet)':'var(--ink)'}, steps[i].ideal));\n` +
    `      svg.appendChild(mk('text', {x:LX+r+12, y:y+1, 'font-size':11, fill:'var(--ink)'}, 'V('+steps[i].ideal+') = ' + steps[i].geom));\n` +
    `      svg.appendChild(mk('text', {x:LX+r+12, y:y+14, 'font-size':9, fill:'var(--mute)'}, 'dim ' + dimHere));\n` +
    `      // ⊊ between rungs\n` +
    `      if(i<L-1) svg.appendChild(mk('text', {x:LX-12, y:y+step/2+4, 'text-anchor':'end', 'font-size':12, fill:'var(--mute)'}, '\\u228a')); }\n` +
    `    svg.appendChild(mk('text', {x:LX, y:24, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'a maximal chain of primes'));\n` +
    `    svg.appendChild(mk('text', {x:LX, y:bot+26, 'text-anchor':'middle', 'font-size':14, fill:'var(--yellow)'}, 'Krull dim R = ' + d));\n` +
    `    // readout\n` +
    `    var chainStr = steps.map(function(s){ return s.ideal; }).join(' \\u228a ');\n` +
    `    var lines=[];\n` +
    `    lines.push('Krull dimension = the length of the longest chain of prime ideals p\\u2080 \\u228a \\u2026 \\u228a p_d. Here: ' + chainStr + ',  so dim R = ' + d + '.');\n` +
    `    lines.push('Going DOWN the chain, the primes grow and the closed sets V(p_i) shrink \\u2014 each step drops the dimension by one, from the generic point (0) (dim ' + d + ') to a maximal ideal (a dim-0 point).');\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
