// complex-analysis-liouville widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The function eval + M_R = max_{|z|=R}|f| are
// intrinsic (a `kind` enum); params carry the case menu and each f's |f'(0)|
// (validated against ./schema.json). The widget plots the Cauchy estimate
// bound M_R/R against R and contrasts it with the actual |f'(0)|.

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
    `    <label for="${widgetId}-sel">entire $f(z)$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-r">radius $R$</label>\n` +
    `    <input type="range" id="${widgetId}-r" min="0.5" max="8" value="2" step="0.1">\n` +
    `    <span class="pill" id="${widgetId}-rval">R = 2.0</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 250" width="540" height="250" role="img" aria-label="The Cauchy estimate bound M_R/R plotted against the radius R"><title>Liouville's theorem: the Cauchy estimate |f'(0)| ≤ M_R/R collapses to 0 only when f is bounded</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* complex-analysis-liouville widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var byId = {}; FNS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var rIn = document.getElementById('${widgetId}-r'), rL = document.getElementById('${widgetId}-rval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !rIn || !rL || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function cexp(p){ var e=Math.exp(p[0]); return [e*Math.cos(p[1]), e*Math.sin(p[1])]; }\n` +
    `  function feval(kind, z){\n` +
    `    if(kind==='const') return [2,0];\n` +
    `    if(kind==='z') return z;\n` +
    `    if(kind==='affine') return [2*z[0]+1, 2*z[1]];\n` +
    `    if(kind==='z2') return cmul(z,z);\n` +
    `    if(kind==='ez') return cexp(z);\n` +
    `    return z;\n` +
    `  }\n` +
    `  function maxMod(kind, R){ var m=0, i, th, w; for(i=0;i<180;i++){ th=2*Math.PI*i/180; w=feval(kind, [R*Math.cos(th), R*Math.sin(th)]); var a=Math.hypot(w[0],w[1]); if(a>m) m=a; } return m; }\n` +
    `  function bound(kind, R){ return maxMod(kind, R)/R; }\n` +
    `  var RMIN=0.5, RMAX=8, YMAX=10;\n` +
    `  var PX0=64, PY0=210, PW=440, PH=176;\n` +
    `  function PX(R){ return PX0 + (R-RMIN)/(RMAX-RMIN)*PW; }\n` +
    `  function PY(v){ return PY0 - Math.min(v,YMAX)/YMAX*PH; }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0], R = +rIn.value;\n` +
    `    rL.textContent = 'R = ' + R.toFixed(1);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY0, x2:PX0+PW, y2:PY0, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY0, x2:PX0, y2:PY0-PH, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PY0+16, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'R \\u2192 ' + RMAX));\n` +
    `    svg.appendChild(mk('text', {x:PX0-8, y:PY0-PH+4, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, YMAX + ''));\n` +
    `    svg.appendChild(mk('text', {x:PX0-8, y:PY0, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, '0'));\n` +
    `    // |f'(0)| reference line\n` +
    `    if(g.fp0 <= YMAX){ svg.appendChild(mk('line', {x1:PX0, y1:PY(g.fp0), x2:PX0+PW, y2:PY(g.fp0), stroke:'var(--pink)', 'stroke-width':1.3, 'stroke-dasharray':'4 3'}));\n` +
    `      svg.appendChild(mk('text', {x:PX0+PW, y:PY(g.fp0)-4, 'text-anchor':'end', 'font-size':10, fill:'var(--pink)'}, '|f\\u2032(0)| = ' + g.fp0)); }\n` +
    `    // Cauchy bound curve M_R/R\n` +
    `    var pts=[], i, RR; for(i=0;i<=120;i++){ RR=RMIN+(RMAX-RMIN)*i/120; pts.push(PX(RR).toFixed(1)+','+PY(bound(g.kind,RR)).toFixed(1)); }\n` +
    `    svg.appendChild(mk('polyline', {points:pts.join(' '), fill:'none', stroke:'var(--cyan)', 'stroke-width':1.8}));\n` +
    `    svg.appendChild(mk('text', {x:PX0+8, y:PY0-PH+12, 'font-size':10, fill:'var(--cyan)'}, 'M_R / R   (Cauchy bound on |f\\u2032(0)|)'));\n` +
    `    // current R marker\n` +
    `    var b = bound(g.kind, R);\n` +
    `    svg.appendChild(mk('line', {x1:PX(R), y1:PY0, x2:PX(R), y2:PY0-PH, stroke:'var(--mute)', 'stroke-dasharray':'2 3'}));\n` +
    `    svg.appendChild(mk('circle', {cx:PX(R), cy:PY(b), r:4, fill:'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX(R), y:PY0+16, 'text-anchor':'middle', 'font-size':10, fill:'var(--yellow)'}, 'R=' + R.toFixed(1)));\n` +
    `    // readout\n` +
    `    var MR = maxMod(g.kind, R);\n` +
    `    var lines = [];\n` +
    `    lines.push('Cauchy estimate:  |f\\u2032(0)| \\u2264 (max_{|z|=R} |f|) / R = M_R / R.');\n` +
    `    lines.push('At R = ' + R.toFixed(1) + ':  M_R = ' + MR.toFixed(2) + ',  so the bound is M_R/R = ' + b.toFixed(3) + '.   Actual |f\\u2032(0)| = ' + g.fp0 + '.');\n` +
    `    if(g.kind==='const'){ lines.push('M_R = 2 stays bounded, so M_R/R = 2/R \\u2192 0 as R \\u2192 \\u221e \\u21d2 |f\\u2032(0)| = 0. A bounded entire function has zero derivative everywhere \\u21d2 it is CONSTANT. That is Liouville\\u2019s theorem.'); }\n` +
    `    else if(g.kind==='z'){ lines.push('M_R = R, so M_R/R = 1 for every R \\u2014 the bound never collapses to 0 (and indeed |f\\u2032(0)| = 1). z is unbounded, so Liouville does not apply.'); }\n` +
    `    else if(g.kind==='affine'){ lines.push('M_R = 2R+1, so M_R/R \\u2192 2 = |f\\u2032(0)|. Unbounded, so the bound stays positive \\u2014 no contradiction.'); }\n` +
    `    else if(g.kind==='z2'){ lines.push('M_R = R\\u00b2, so M_R/R = R \\u2192 \\u221e. Polynomial growth: f is unbounded and the estimate gives no ceiling as R grows.'); }\n` +
    `    else { lines.push('M_R = e^R, so M_R/R = e^R/R \\u2192 \\u221e explosively. e^z is the canonical non-constant entire function \\u2014 necessarily unbounded.'); }\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    lines.push('The estimate forces f\\u2032 = 0 only if M_R stays bounded as R \\u2192 \\u221e. Bounded + entire \\u21d2 constant.');\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); rIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
