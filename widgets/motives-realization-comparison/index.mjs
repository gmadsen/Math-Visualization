// motives-realization-comparison widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Both are pure functions of params. The script embeds the `varieties` and
// `theories` arrays as JSON and rebuilds the comparison from them, so a
// non-HTML frontend can drive its own renderer from params alone (validated
// against ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, varieties } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = varieties
    .map((v, i) =>
      `      <option value="${escapeHtml(v.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(v.label)}</option>`
    )
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">variety $X/\\mathbb{Q}$</label>\n` +
    `    <select id="${widgetId}-sel">\n` +
    `${options}\n` +
    `    </select>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 600 250" width="600" height="250" role="img" aria-label="Realization functors on the chosen variety"><title>Four cohomology realizations of the selected variety</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, varieties, theories } = params;
  const data = JSON.stringify({ varieties, theories });
  return (
    `<script>\n` +
    `/* motives-realization-comparison widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var P = ${data};\n` +
    `  var VARS = P.varieties, THEORIES = P.theories;\n` +
    `  var byId = {}; VARS.forEach(function(v){ byId[v.id] = v; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  var SUP = ['\\u2070','\\u00b9','\\u00b2','\\u00b3','\\u2074','\\u2075','\\u2076','\\u2077','\\u2078'];\n` +
    `  function mk(tag, attrs, text){\n` +
    `    var e = document.createElementNS(NS, tag);\n` +
    `    for(var k in attrs){ e.setAttribute(k, attrs[k]); }\n` +
    `    if(text != null) e.textContent = text;\n` +
    `    return e;\n` +
    `  }\n` +
    `  var W = 600;\n` +
    `  var picked = null; // theory key\n` +
    `  function overview(v){\n` +
    `    var total = v.betti.reduce(function(a,b){return a+b;}, 0);\n` +
    `    var lines = [];\n` +
    `    lines.push('All four realizations assign the same dim H\\u2071 = b\\u2071 (total ' + total + ') \\u2014 the shared \"motive\".');\n` +
    `    lines.push('They differ only in the extra structure each one carries (the coloured cards).');\n` +
    `    if(v.note) lines.push(v.note);\n` +
    `    lines.push('');\n` +
    `    lines.push('click a realization card to see its coefficient category and extra structure');\n` +
    `    return lines.join('\\n');\n` +
    `  }\n` +
    `  function focus(v, t){\n` +
    `    var lines = [];\n` +
    `    lines.push(t.name + ' realization \\u2014 lands in: ' + t.coeff);\n` +
    `    lines.push('extra structure: ' + t.structure);\n` +
    `    var tn = v.theoryNotes && v.theoryNotes[t.key];\n` +
    `    if(tn) lines.push('for ' + v.label.replace(/\\s*\\(.*$/, '') + ':  ' + tn);\n` +
    `    lines.push('');\n` +
    `    lines.push('underlying dimensions are still b\\u2071 \\u2014 identical to every other realization');\n` +
    `    return lines.join('\\n');\n` +
    `  }\n` +
    `  function draw(){\n` +
    `    var v = byId[sel.value] || VARS[0];\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // shared Betti row\n` +
    `    var n = v.betti.length, bw = 42, gap = 8;\n` +
    `    var totalW = n*bw + (n-1)*gap, sx = (W - totalW)/2, by = 16;\n` +
    `    svg.appendChild(mk('text', {x:W/2, y:by-4, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)'}, 'shared Betti numbers  (same for all four realizations)'));\n` +
    `    for(var i=0;i<n;i++){\n` +
    `      var x = sx + i*(bw+gap);\n` +
    `      svg.appendChild(mk('rect', {x:x, y:by+6, width:bw, height:38, rx:6, fill:'var(--panel2)', stroke:'var(--line)'}));\n` +
    `      svg.appendChild(mk('text', {x:x+bw/2, y:by+30, 'text-anchor':'middle', 'font-size':15, 'font-weight':'600', fill:'var(--ink)'}, String(v.betti[i])));\n` +
    `      svg.appendChild(mk('text', {x:x+bw/2, y:by+56, 'text-anchor':'middle', 'font-size':10, fill:'var(--mute)'}, 'b'+SUP[i]));\n` +
    `    }\n` +
    `    // realization cards\n` +
    `    var m = THEORIES.length, cardW = 134, cgap = (W - 20 - m*cardW)/(m-1), cy = 108, cardH = 92, cstartX = 10;\n` +
    `    for(var j=0;j<m;j++){\n` +
    `      var t = THEORIES[j];\n` +
    `      var cxp = cstartX + j*(cardW+cgap);\n` +
    `      var on = picked === t.key;\n` +
    `      var g = mk('g', {'style':'cursor:pointer'});\n` +
    `      g.appendChild(mk('rect', {x:cxp, y:cy, width:cardW, height:cardH, rx:8, fill:(on?'var('+t.color+')':'var(--panel2)'), 'fill-opacity':(on?'0.16':'1'), stroke:'var('+t.color+')', 'stroke-width':(on?'2.4':'1.2')}));\n` +
    `      g.appendChild(mk('text', {x:cxp+cardW/2, y:cy+24, 'text-anchor':'middle', 'font-size':13, 'font-weight':'600', fill:'var('+t.color+')'}, t.name));\n` +
    `      // coeff ring, wrapped to up to 2 lines\n` +
    `      var words = String(t.coeff).split(' '); var l1='', l2='';\n` +
    `      for(var w=0;w<words.length;w++){ if((l1+' '+words[w]).trim().length<=18 && !l2) l1=(l1+' '+words[w]).trim(); else l2=(l2+' '+words[w]).trim(); }\n` +
    `      g.appendChild(mk('text', {x:cxp+cardW/2, y:cy+46, 'text-anchor':'middle', 'font-size':10.5, fill:'var(--ink)'}, l1));\n` +
    `      if(l2) g.appendChild(mk('text', {x:cxp+cardW/2, y:cy+60, 'text-anchor':'middle', 'font-size':10.5, fill:'var(--ink)'}, l2));\n` +
    `      g.appendChild(mk('text', {x:cxp+cardW/2, y:cy+cardH-10, 'text-anchor':'middle', 'font-size':9.5, 'font-style':'italic', fill:'var(--mute)'}, on?'\\u25c0 focused':'+ structure'));\n` +
    `      (function(key){ g.addEventListener('click', function(){ picked = (picked===key)?null:key; draw(); }); })(t.key);\n` +
    `      svg.appendChild(g);\n` +
    `    }\n` +
    `    var pt = picked ? THEORIES.filter(function(t){return t.key===picked;})[0] : null;\n` +
    `    out.textContent = pt ? focus(v, pt) : overview(v);\n` +
    `  }\n` +
    `  sel.addEventListener('change', function(){ picked = null; draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
