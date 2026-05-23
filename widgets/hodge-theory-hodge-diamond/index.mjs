// hodge-theory-hodge-diamond widget — bespoke semantic registry entry.
//
// Exports two pure string-returning functions:
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Both are pure functions of params (no I/O). The driving script embeds the
// `varieties` array as JSON and rebuilds the diamond from it, so a React /
// any-frontend consumer can ignore renderScript and drive its own renderer
// from params alone (validated against ./schema.json).

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
    `    <label for="${widgetId}-sel">variety</label>\n` +
    `    <select id="${widgetId}-sel">\n` +
    `${options}\n` +
    `    </select>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 380" width="560" height="380" role="img" aria-label="Hodge diamond"><title>Hodge diamond of the selected variety</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, varieties } = params;
  const data = JSON.stringify(varieties);
  return (
    `<script>\n` +
    `/* hodge-theory-hodge-diamond widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var DATA = ${data};\n` +
    `  var byId = {}; DATA.forEach(function(v){ byId[v.id] = v; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  var SUP = ['\\u2070','\\u00b9','\\u00b2','\\u00b3','\\u2074','\\u2075','\\u2076','\\u2077','\\u2078'];\n` +
    `  var SUB = ['\\u2080','\\u2081','\\u2082','\\u2083','\\u2084','\\u2085','\\u2086','\\u2087','\\u2088'];\n` +
    `  function pqLabel(p,q){ return 'h'+SUP[p]+'\\u140f'+SUP[q]; }\n` +
    `  function mk(tag, attrs, text){\n` +
    `    var e = document.createElementNS(NS, tag);\n` +
    `    for(var k in attrs){ e.setAttribute(k, attrs[k]); }\n` +
    `    if(text != null) e.textContent = text;\n` +
    `    return e;\n` +
    `  }\n` +
    `  var W = 560, H = 380;\n` +
    `  var picked = null; // {p,q} of the clicked entry\n` +
    `  function draw(){\n` +
    `    var v = byId[sel.value] || DATA[0];\n` +
    `    var h = v.h, d = h.length - 1; // dimension is derived from the matrix, never a separate field\n` +
    `    function hpq(p,q){ return (h[p] && h[p][q] != null) ? h[p][q] : 0; } // guards ragged/short rows\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var dn = Math.max(1, d);\n` +
    `    var dx = Math.min(52, (W - 130) / (2 * dn));\n` +
    `    var dy = Math.min(46, (H - 110) / (2 * dn));\n` +
    `    var r  = Math.min(21, dx * 0.44, dy * 0.46);\n` +
    `    var cx = W / 2;\n` +
    `    var top = Math.max(34, (H - 2 * d * dy) / 2); // vertically centre the diamond\n` +
    `    // partners of the picked entry: conjugate (q,p) and Poincare dual (d-p,d-q)\n` +
    `    var conj = picked ? {p:picked.q, q:picked.p} : null;\n` +
    `    var dual = picked ? {p:d-picked.p, q:d-picked.q} : null;\n` +
    `    function same(a,b){ return a && b && a.p===b.p && a.q===b.q; }\n` +
    `    for(var p=0; p<=d; p++){\n` +
    `      for(var q=0; q<=d; q++){\n` +
    `        var n = p+q;\n` +
    `        var x = cx + (q - p) * dx;\n` +
    `        var y = top + n * dy;\n` +
    `        var here = {p:p,q:q};\n` +
    `        var stroke = 'var(--line)', sw = '1';\n` +
    `        if(same(here, picked)){ stroke = 'var(--yellow)'; sw = '2.4'; }\n` +
    `        else if(same(here, conj)){ stroke = 'var(--green)'; sw = '2.2'; }\n` +
    `        else if(same(here, dual)){ stroke = 'var(--cyan)'; sw = '2.2'; }\n` +
    `        var g = mk('g', {'style':'cursor:pointer'});\n` +
    `        g.setAttribute('data-p', p); g.setAttribute('data-q', q);\n` +
    `        g.appendChild(mk('circle', {cx:x, cy:y, r:r, fill:'var(--panel2)', stroke:stroke, 'stroke-width':sw}));\n` +
    `        g.appendChild(mk('text', {x:x, y:y+5, 'text-anchor':'middle', 'font-size':14, 'font-weight':'600', fill:'var(--ink)'}, String(hpq(p,q))));\n` +
    `        g.appendChild(mk('text', {x:x, y:y+r+12, 'text-anchor':'middle', 'font-size':10, fill:'var(--mute)'}, pqLabel(p,q)));\n` +
    `        (function(pp,qq){ g.addEventListener('click', function(){ picked = (picked && picked.p===pp && picked.q===qq) ? null : {p:pp,q:qq}; draw(); }); })(p,q);\n` +
    `        svg.appendChild(g);\n` +
    `      }\n` +
    `    }\n` +
    `    // readout\n` +
    `    var betti = [];\n` +
    `    for(var nn=0; nn<=2*d; nn++){ var s=0; for(var pp=0; pp<=d; pp++){ var qq=nn-pp; if(qq>=0 && qq<=d) s+=hpq(pp,qq); } betti.push(s); }\n` +
    `    var total = betti.reduce(function(a,b){return a+b;},0);\n` +
    `    var euler = betti.reduce(function(a,b,i){ return a + (i%2? -b : b); }, 0);\n` +
    `    var bettiStr = betti.map(function(b,i){ return 'b'+SUB[i]+'='+b; }).join('  ');\n` +
    `    // symmetry laws\n` +
    `    var hodgeOK = true, dualOK = true;\n` +
    `    for(var a=0; a<=d; a++){ for(var b=0; b<=d; b++){ if(hpq(a,b)!==hpq(b,a)) hodgeOK=false; if(hpq(a,b)!==hpq(d-a,d-b)) dualOK=false; } }\n` +
    `    var lines = [];\n` +
    `    lines.push('Betti numbers (row sums):  ' + bettiStr);\n` +
    `    lines.push('total dim H* = ' + total + '     Euler characteristic = ' + euler);\n` +
    `    lines.push('Hodge symmetry  h(p,q)=h(q,p): ' + (hodgeOK?'\\u2713':'\\u2717') + '     Poincare duality  h(p,q)=h(d\\u2212p,d\\u2212q): ' + (dualOK?'\\u2713':'\\u2717'));\n` +
    `    if(v.note) lines.push(v.note);\n` +
    `    if(picked){\n` +
    `      var pv = hpq(picked.p,picked.q), cv = hpq(picked.q,picked.p), dv = hpq(d-picked.p,d-picked.q);\n` +
    `      lines.push('');\n` +
    `      lines.push('selected  h(' + picked.p + ',' + picked.q + ') = ' + pv + '   \\u2022   conjugate h(' + picked.q + ',' + picked.p + ') = ' + cv + '   \\u2022   Poincare-dual h(' + (d-picked.p) + ',' + (d-picked.q) + ') = ' + dv);\n` +
    `    } else {\n` +
    `      lines.push('');\n` +
    `      lines.push('click an entry to light up its Hodge-conjugate (green) and Poincare-dual (cyan) partners');\n` +
    `    }\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', function(){ picked = null; draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
