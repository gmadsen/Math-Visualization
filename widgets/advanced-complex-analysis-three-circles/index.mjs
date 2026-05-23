// advanced-complex-analysis-three-circles widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The function eval + M(r)=max_{|z|=r}|f| are
// intrinsic (a `kind` enum); params carry the case menu (validated against
// ./schema.json). The widget plots log M(r) vs log r and checks the
// three-circles inequality at the log-midpoint radius.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, functions } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = functions
    .map((g, i) => `      <option value="${escapeHtml(g.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(g.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">$f(z)$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-r1">$r_1$</label>\n` +
    `    <input type="range" id="${widgetId}-r1" min="0.4" max="2" value="0.7" step="0.05">\n` +
    `    <label for="${widgetId}-r3">$r_3$</label>\n` +
    `    <input type="range" id="${widgetId}-r3" min="2.5" max="6" value="4.5" step="0.05">\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 250" width="540" height="250" role="img" aria-label="log M(r) plotted against log r, with the three-circles chord"><title>Hadamard's three-circles theorem: log M(r) is a convex function of log r</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* advanced-complex-analysis-three-circles widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var byId = {}; FNS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var r1In = document.getElementById('${widgetId}-r1'), r3In = document.getElementById('${widgetId}-r3');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !r1In || !r3In || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function cexp(p){ var e=Math.exp(p[0]); return [e*Math.cos(p[1]), e*Math.sin(p[1])]; }\n` +
    `  function feval(kind, z){\n` +
    `    if(kind==='z2') return cmul(z,z);\n` +
    `    if(kind==='ez') return cexp(z);\n` +
    `    if(kind==='poly3'){ var z3=cmul(cmul(z,z),z); return [1+z[0]+z3[0], z[1]+z3[1]]; }\n` +
    `    if(kind==='expz2'){ var e=cexp(z), z2=cmul(z,z); return [e[0]+z2[0], e[1]+z2[1]]; }\n` +
    `    return z;\n` +
    `  }\n` +
    `  function logM(kind, r){ var m=0, i, th, w; for(i=0;i<144;i++){ th=2*Math.PI*i/144; w=feval(kind, [r*Math.cos(th), r*Math.sin(th)]); var a=Math.hypot(w[0],w[1]); if(a>m) m=a; } return Math.log(Math.max(m,1e-12)); }\n` +
    `  var RMIN=0.35, RMAX=6, Lmin=Math.log(RMIN), Lmax=Math.log(RMAX);\n` +
    `  var PX0=58, PY0=205, PW=448, PH=170;\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0];\n` +
    `    var r1=+r1In.value, r3=+r3In.value; if(r3<=r1) r3=r1+0.5;\n` +
    `    var r2=Math.sqrt(r1*r3);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // sample log M over the range, track y-extent\n` +
    `    var NS2=100, i, samples=[], yMin=1e9, yMax=-1e9;\n` +
    `    for(i=0;i<=NS2;i++){ var lr=Lmin+(Lmax-Lmin)*i/NS2; var lm=logM(g.kind, Math.exp(lr)); samples.push([lr,lm]); if(lm<yMin)yMin=lm; if(lm>yMax)yMax=lm; }\n` +
    `    var pad=(yMax-yMin)*0.1||1; yMin-=pad; yMax+=pad;\n` +
    `    function PX(lr){ return PX0 + (lr-Lmin)/(Lmax-Lmin)*PW; }\n` +
    `    function PY(v){ return PY0 - (v-yMin)/(yMax-yMin)*PH; }\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY0, x2:PX0+PW, y2:PY0, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY0, x2:PX0, y2:PY0-PH, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PY0+16, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'log r \\u2192'));\n` +
    `    svg.appendChild(mk('text', {x:PX0-8, y:PY0-PH+8, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'log M(r)'));\n` +
    `    // the convex curve\n` +
    `    var pts=samples.map(function(s){ return PX(s[0]).toFixed(1)+','+PY(s[1]).toFixed(1); });\n` +
    `    svg.appendChild(mk('polyline', {points:pts.join(' '), fill:'none', stroke:'var(--cyan)', 'stroke-width':2}));\n` +
    `    // chord between r1 and r3\n` +
    `    var L1=Math.log(r1), L3=Math.log(r3), L2=Math.log(r2);\n` +
    `    var m1=logM(g.kind,r1), m3=logM(g.kind,r3), m2=logM(g.kind,r2);\n` +
    `    svg.appendChild(mk('line', {x1:PX(L1), y1:PY(m1), x2:PX(L3), y2:PY(m3), stroke:'var(--yellow)', 'stroke-width':1.4, 'stroke-dasharray':'5 3'}));\n` +
    `    // markers at r1, r2, r3\n` +
    `    [[L1,m1,'r\\u2081'],[L3,m3,'r\\u2083']].forEach(function(p){ svg.appendChild(mk('circle', {cx:PX(p[0]), cy:PY(p[1]), r:3.5, fill:'var(--yellow)'})); svg.appendChild(mk('text', {x:PX(p[0]), y:PY0+16, 'text-anchor':'middle', 'font-size':10, fill:'var(--yellow)'}, p[2])); });\n` +
    `    var chordAt2=(m1+m3)/2; // chord value at the log-midpoint\n` +
    `    svg.appendChild(mk('line', {x1:PX(L2), y1:PY(m2), x2:PX(L2), y2:PY(chordAt2), stroke:'var(--pink)', 'stroke-width':1.4}));\n` +
    `    svg.appendChild(mk('circle', {cx:PX(L2), cy:PY(m2), r:4, fill:'var(--pink)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX(L2), y:PY0+16, 'text-anchor':'middle', 'font-size':10, fill:'var(--pink)'}, 'r\\u2082'));\n` +
    `    // readout\n` +
    `    var ok = m2 <= chordAt2 + 1e-6;\n` +
    `    var lines=[];\n` +
    `    lines.push('Hadamard: log M(r) is a CONVEX function of log r, so the curve never rises above any chord.');\n` +
    `    lines.push('r\\u2081 = ' + r1.toFixed(2) + ',  r\\u2082 = \\u221a(r\\u2081r\\u2083) = ' + r2.toFixed(2) + ',  r\\u2083 = ' + r3.toFixed(2) + '.');\n` +
    `    lines.push('log M(r\\u2082) = ' + m2.toFixed(3) + '   ' + (ok?'\\u2264':'>') + '   \\u00bd(log M(r\\u2081)+log M(r\\u2083)) = ' + chordAt2.toFixed(3) + '   \\u21d2   M(r\\u2082)\\u00b2 \\u2264 M(r\\u2081)\\u00b7M(r\\u2083). ' + (ok?'\\u2713':''));\n` +
    `    if(g.kind==='z2') lines.push('For z^a, log M = a\\u00b7log r is exactly linear in log r \\u2014 the boundary case where the inequality is an equality.');\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); r1In.addEventListener('input', draw); r3In.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
