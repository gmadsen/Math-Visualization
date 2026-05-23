// advanced-complex-analysis-hardy-spaces widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The function eval is intrinsic (a `kind` enum);
// params carry the case menu (validated against ./schema.json). The widget draws
// the radius to e^{iθ} and plots |f(re^{iθ})| as r→1, showing the Fatou
// boundary value (and the measure-zero exceptional point for the inner function).

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
    `    <label for="${widgetId}-sel">$f$ on $\\mathbb{D}$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-t">angle $\\theta$</label>\n` +
    `    <input type="range" id="${widgetId}-t" min="-3.14159" max="3.14159" value="0.9" step="0.02">\n` +
    `    <span class="pill" id="${widgetId}-tval">θ = 0.90</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 260" width="540" height="260" role="img" aria-label="The radius to e^{iθ} in the disk, and |f| along it as r→1"><title>Fatou's theorem: a bounded holomorphic function on the disk has radial boundary values almost everywhere</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* advanced-complex-analysis-hardy-spaces widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var byId = {}; FNS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var tIn = document.getElementById('${widgetId}-t'), tL = document.getElementById('${widgetId}-tval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !tIn || !tL || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cdiv(p,q){ var d=q[0]*q[0]+q[1]*q[1]; return [(p[0]*q[0]+p[1]*q[1])/d, (p[1]*q[0]-p[0]*q[1])/d]; }\n` +
    `  function cexp(p){ var e=Math.exp(p[0]); return [e*Math.cos(p[1]), e*Math.sin(p[1])]; }\n` +
    `  function feval(kind, z){\n` +
    `    if(kind==='blaschke') return cdiv([z[0]-0.5, z[1]], [1-0.5*z[0], -0.5*z[1]]);\n` +
    `    if(kind==='half') return [(1+z[0])/2, z[1]/2];\n` +
    `    return cexp(cdiv([z[0]+1, z[1]], [z[0]-1, z[1]])); // singInner exp((z+1)/(z-1))\n` +
    `  }\n` +
    `  function absF(kind, r, th){ var w=feval(kind, [r*Math.cos(th), r*Math.sin(th)]); return Math.hypot(w[0], w[1]); }\n` +
    `  var Lx=112, Ly=130, LR=96;            // disk panel\n` +
    `  var PX0=258, PW=252, PYb=212, PTop=36, PH=176, YHI=1.18; // |f| vs r plot\n` +
    `  function PX(r){ return PX0 + r*PW; } function PY(v){ return PYb - Math.min(v,YHI)/YHI*PH; }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0], th = +tIn.value;\n` +
    `    tL.textContent = '\\u03b8 = ' + th.toFixed(2);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // ---- disk + radius ----\n` +
    `    svg.appendChild(mk('circle', {cx:Lx, cy:Ly, r:LR, fill:'color-mix(in srgb, var(--cyan) 6%, transparent)', stroke:'var(--cyan)', 'stroke-width':1.4}));\n` +
    `    var bx=Lx+LR*Math.cos(th), by=Ly-LR*Math.sin(th);\n` +
    `    svg.appendChild(mk('line', {x1:Lx, y1:Ly, x2:bx, y2:by, stroke:'var(--yellow)', 'stroke-width':2}));\n` +
    `    svg.appendChild(mk('circle', {cx:bx, cy:by, r:4, fill:'var(--pink)'}));\n` +
    `    svg.appendChild(mk('text', {x:bx+(Math.cos(th)>=0?6:-6), y:by+(Math.sin(th)>0?-6:12), 'font-size':10, fill:'var(--pink)', 'text-anchor':Math.cos(th)>=0?'start':'end'}, 'e^{iθ}'));\n` +
    `    svg.appendChild(mk('text', {x:Lx, y:Ly+LR+16, 'text-anchor':'middle', 'font-size':10, fill:'var(--mute)', 'font-style':'italic'}, 'radius to e^{iθ}'));\n` +
    `    // ---- |f| vs r plot ----\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PYb, x2:PX0+PW, y2:PYb, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PYb, x2:PX0, y2:PTop, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:PX(1), y1:PTop, x2:PX(1), y2:PYb, stroke:'var(--line)', 'stroke-dasharray':'2 3'}));\n` +
    `    svg.appendChild(mk('text', {x:PX(1), y:PYb+14, 'text-anchor':'middle', 'font-size':10, fill:'var(--mute)'}, 'r = 1'));\n` +
    `    svg.appendChild(mk('text', {x:PX0-6, y:PY(1), 'text-anchor':'end', 'font-size':9, fill:'var(--mute)'}, '1'));\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY(1), x2:PX0+PW, y2:PY(1), stroke:'var(--line)', 'stroke-dasharray':'1 4'}));\n` +
    `    svg.appendChild(mk('text', {x:PX0+4, y:PTop+10, 'font-size':10, fill:'var(--cyan)'}, '|f(r e^{iθ})|'));\n` +
    `    var pts=[], i, r; for(i=0;i<=200;i++){ r=0.999*i/200; pts.push(PX(r).toFixed(1)+','+PY(absF(g.kind,r,th)).toFixed(1)); }\n` +
    `    svg.appendChild(mk('polyline', {points:pts.join(' '), fill:'none', stroke:'var(--cyan)', 'stroke-width':2}));\n` +
    `    var fb = absF(g.kind, 0.9995, th);\n` +
    `    svg.appendChild(mk('circle', {cx:PX(1), cy:PY(fb), r:4, fill:'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX(1)-4, y:PY(fb)-6, 'text-anchor':'end', 'font-size':10, fill:'var(--yellow)'}, 'f*'));\n` +
    `    // ---- readout ----\n` +
    `    var lines=[];\n` +
    `    lines.push('Fatou: a bounded holomorphic f on \\ud835\\udd3b has a radial (non-tangential) limit f*(e^{i\\u03b8}) for ALMOST EVERY \\u03b8.');\n` +
    `    lines.push('Along this radius |f(r e^{i\\u03b8})| \\u2192 |f*(e^{i\\u03b8})| \\u2248 ' + fb.toFixed(3) + ' as r \\u2192 1.');\n` +
    `    if(g.kind==='blaschke'){ lines.push('A Blaschke factor is an inner function: |f*| = 1 at EVERY \\u03b8 (it maps the boundary circle to itself).'); }\n` +
    `    else if(g.kind==='half'){ lines.push('(1+z)/2 extends continuously: |f*(e^{i\\u03b8})| = |cos(\\u03b8/2)| \\u2014 a genuine non-constant boundary function.'); }\n` +
    `    else { lines.push('exp((z+1)/(z\\u22121)) is a singular inner function: |f*| = 1 for almost every \\u03b8, yet at the single point z = 1 (\\u03b8 = 0) the radial limit is 0 \\u2014 set \\u03b8 = 0 to see it. That lone bad point is the measure-zero exceptional set Fatou allows.'); }\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); tIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
