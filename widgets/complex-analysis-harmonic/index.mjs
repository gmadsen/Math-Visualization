// complex-analysis-harmonic widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The harmonic function eval is intrinsic (a `kind`
// enum); params carry the case menu (validated against ./schema.json). The
// widget shows a circle in the z-plane and the values of u along it, and
// confirms numerically that the circle average equals u at the center — the
// mean-value property — hence no interior extremum (the maximum principle).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, cases } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = cases
    .map((c, i) => `      <option value="${escapeHtml(c.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(c.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">harmonic $u = \\operatorname{Re} f$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-cx">center $c_x$</label>\n` +
    `    <input type="range" id="${widgetId}-cx" min="-1.4" max="1.4" value="0.5" step="0.05">\n` +
    `    <label for="${widgetId}-r">radius $r$</label>\n` +
    `    <input type="range" id="${widgetId}-r" min="0.3" max="1.2" value="0.7" step="0.05">\n` +
    `    <span class="pill" id="${widgetId}-pill">c = 0.50,  r = 0.70</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 270" width="540" height="270" role="img" aria-label="A circle in the plane and the values of a harmonic function along it"><title>Harmonic functions: the mean over any circle equals the value at the center</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, cases } = params;
  const data = JSON.stringify(cases);
  return (
    `<script>\n` +
    `/* complex-analysis-harmonic widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var CASES = ${data};\n` +
    `  var byId = {}; CASES.forEach(function(c){ byId[c.id] = c; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var cxIn = document.getElementById('${widgetId}-cx'), rIn = document.getElementById('${widgetId}-r');\n` +
    `  var pill = document.getElementById('${widgetId}-pill');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !cxIn || !rIn || !pill || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function u(kind, x, y){\n` +
    `    if(kind==='re_z2') return x*x - y*y;\n` +
    `    if(kind==='re_z3') return x*x*x - 3*x*y*y;\n` +
    `    if(kind==='re_exp') return Math.exp(x)*Math.cos(y);\n` +
    `    if(kind==='re_inv'){ var d=x*x+y*y; return d<1e-9 ? NaN : x/d; }\n` +
    `    return x; // re_z\n` +
    `  }\n` +
    `  var LCX=120, LCY=135, LSC=58;   // z-plane panel\n` +
    `  var PX0=275, PY0=210, PW=240, PH=150; // u-vs-theta plot\n` +
    `  function draw(){\n` +
    `    var c = byId[sel.value] || CASES[0], cx = +cxIn.value, cy = 0, r = +rIn.value;\n` +
    `    pill.textContent = 'c = ' + cx.toFixed(2) + ',  r = ' + r.toFixed(2);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var uc = u(c.kind, cx, cy);\n` +
    `    // sample the circle\n` +
    `    var N=360, i, th, vals=[], sum=0, vmin=Infinity, vmax=-Infinity;\n` +
    `    for(i=0;i<N;i++){ th=2*Math.PI*i/N; var v=u(c.kind, cx+r*Math.cos(th), cy+r*Math.sin(th)); vals.push(v); sum+=v; if(v<vmin)vmin=v; if(v>vmax)vmax=v; }\n` +
    `    var avg = sum/N;\n` +
    `    var encloses0 = (c.kind==='re_inv') && (Math.hypot(cx,cy) <= r + 1e-9); // disk contains OR the circle touches z=0\n` +
    `    // ----- left: z-plane circle + boundary signs -----\n` +
    `    svg.appendChild(mk('line', {x1:LCX-110, y1:LCY, x2:LCX+110, y2:LCY, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:LCX, y1:LCY-110, x2:LCX, y2:LCY+110, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('circle', {cx:LCX+cx*LSC, cy:LCY-cy*LSC, r:r*LSC, fill:'none', stroke:'var(--mute)', 'stroke-width':1.4}));\n` +
    `    var SB=36; for(i=0;i<SB;i++){ th=2*Math.PI*i/SB; var bx=cx+r*Math.cos(th), by=cy+r*Math.sin(th), bv=u(c.kind,bx,by);\n` +
    `      var col = isNaN(bv) ? 'var(--mute)' : (bv>uc ? 'var(--cyan)' : 'var(--pink)');\n` +
    `      svg.appendChild(mk('circle', {cx:LCX+bx*LSC, cy:LCY-by*LSC, r:3, fill:col})); }\n` +
    `    svg.appendChild(mk('circle', {cx:LCX+cx*LSC, cy:LCY-cy*LSC, r:4, fill:'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('text', {x:LCX+cx*LSC+7, y:LCY-cy*LSC-6, 'font-size':10, fill:'var(--yellow)'}, 'center c'));\n` +
    `    svg.appendChild(mk('text', {x:LCX, y:20, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'circle |z \\u2212 c| = r'));\n` +
    `    if(c.kind==='re_inv'){ svg.appendChild(mk('circle', {cx:LCX, cy:LCY, r:2.5, fill:'var(--orange)'})); svg.appendChild(mk('text', {x:LCX+5, y:LCY+13, 'font-size':9, fill:'var(--orange)'}, '0')); }\n` +
    `    // ----- right: u along the circle vs theta -----\n` +
    `    var pad=(vmax-vmin)*0.15 || 1, lo=vmin-pad, hi=vmax+pad;\n` +
    `    function PX(t){ return PX0 + t/(2*Math.PI)*PW; } function PY(v){ return PY0 - (v-lo)/(hi-lo)*PH; }\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY0, x2:PX0+PW, y2:PY0, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY0, x2:PX0, y2:PY0-PH, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PY0+15, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, '\\u03b8: 0 \\u2192 2\\u03c0'));\n` +
    `    svg.appendChild(mk('text', {x:PX0-6, y:PY0-PH+4, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'u'));\n` +
    `    if(!isNaN(avg)){\n` +
    `      var pts=[]; for(i=0;i<N;i++){ if(!isNaN(vals[i])) pts.push(PX(2*Math.PI*i/N).toFixed(1)+','+PY(vals[i]).toFixed(1)); }\n` +
    `      svg.appendChild(mk('polyline', {points:pts.join(' '), fill:'none', stroke:'var(--green)', 'stroke-width':1.8}));\n` +
    `      // average line\n` +
    `      svg.appendChild(mk('line', {x1:PX0, y1:PY(avg), x2:PX0+PW, y2:PY(avg), stroke:'var(--yellow)', 'stroke-width':1.4, 'stroke-dasharray':'5 3'}));\n` +
    `      svg.appendChild(mk('text', {x:PX0+PW, y:PY(avg)-4, 'text-anchor':'end', 'font-size':10, fill:'var(--yellow)'}, encloses0 ? 'boundary mean \\u2260 u(c)' : 'mean = u(c)'));\n` +
    `    }\n` +
    `    // ----- readout -----\n` +
    `    var lines = [];\n` +
    `    lines.push(c.kind==='re_inv'\n` +
    `      ? 'u = ' + c.label + '  is harmonic on \\u2102 \\u2216 {0}:  \\u0394u = 0 everywhere except the origin.'\n` +
    `      : 'u = ' + c.label + '  is harmonic:  \\u0394u = u_xx + u_yy = 0.');\n` +
    `    if(encloses0){\n` +
    `      lines.push('This circle encloses (or touches) the singularity at z = 0, where u is NOT harmonic \\u2014 so the mean-value property need not hold: the boundary average differs from u(c). Move the center out so 0 lies outside the disk.');\n` +
    `    } else if(isNaN(avg)){\n` +
    `      lines.push('The boundary average is undefined here \\u2014 the circle passes through a singularity. Nudge the center or radius.');\n` +
    `    } else {\n` +
    `      lines.push('Mean of u over the circle = ' + avg.toFixed(4) + '.   u at the center c = (' + cx.toFixed(2) + ', 0) is ' + uc.toFixed(4) + '.');\n` +
    `      lines.push('They agree \\u2014 the MEAN-VALUE property: a harmonic function equals the average of its boundary values.');\n` +
    `      lines.push('Since u(c) is the average, the boundary always holds values both above (cyan) and below (pink) it: the center is neither a max nor a min. No interior extrema \\u2014 the maximum principle.');\n` +
    `    }\n` +
    `    if(c.note) lines.push(c.note);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); cxIn.addEventListener('input', draw); rIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
