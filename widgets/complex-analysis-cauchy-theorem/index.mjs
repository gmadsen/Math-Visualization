// complex-analysis-cauchy-theorem widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The function eval + numerical contour integral are
// intrinsic (a `kind` enum); params carry the case menu (validated against
// ./schema.json). The contour integral uses the periodic trapezoid rule on a
// smooth wobbling contour z(θ) = (R + amp·sin 5θ)·e^{iθ}, which is spectrally
// accurate, so ∮ comes out to ~machine precision (0 for holomorphic f, 2πi for
// the enclosed pole 1/z).

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
    `    <label for="${widgetId}-d">deform $C$</label>\n` +
    `    <input type="range" id="${widgetId}-d" min="0" max="0.45" value="0.2" step="0.01">\n` +
    `    <span class="pill" id="${widgetId}-dval">deform = 0.20</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 280" width="540" height="280" role="img" aria-label="A closed contour C in the plane, with any enclosed pole marked"><title>Cauchy's theorem: the contour integral of a holomorphic function around a closed loop is zero</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* complex-analysis-cauchy-theorem widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var byId = {}; FNS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var dIn = document.getElementById('${widgetId}-d'), dL = document.getElementById('${widgetId}-dval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !dIn || !dL || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function cdiv(p,q){ var d=q[0]*q[0]+q[1]*q[1]; return [(p[0]*q[0]+p[1]*q[1])/d, (p[1]*q[0]-p[0]*q[1])/d]; }\n` +
    `  function cexp(p){ var e=Math.exp(p[0]); return [e*Math.cos(p[1]), e*Math.sin(p[1])]; }\n` +
    `  function feval(kind, z){\n` +
    `    if(kind==='z') return z;\n` +
    `    if(kind==='z2') return cmul(z,z);\n` +
    `    if(kind==='ez') return cexp(z);\n` +
    `    if(kind==='sinz') return [Math.sin(z[0])*Math.cosh(z[1]), Math.cos(z[0])*Math.sinh(z[1])];\n` +
    `    if(kind==='inv_z') return cdiv([1,0], z);\n` +
    `    if(kind==='inv_zm') return cdiv([1,0], [z[0]-1.6, z[1]]);\n` +
    `    return z;\n` +
    `  }\n` +
    `  var R0 = 1.0, K = 5;            // base radius and number of wobble lobes\n` +
    `  function rho(amp, th){ return R0 + amp*Math.sin(K*th); }\n` +
    `  function zAt(amp, th){ var r=rho(amp,th); return [r*Math.cos(th), r*Math.sin(th)]; }\n` +
    `  function zPrime(amp, th){ var rp=amp*K*Math.cos(K*th), r=rho(amp,th); return cmul([rp, r], [Math.cos(th), Math.sin(th)]); }\n` +
    `  function contourIntegral(kind, amp){\n` +
    `    var N=720, acc=[0,0], j, th, term;\n` +
    `    for(j=0;j<N;j++){ th=2*Math.PI*j/N; term=cmul(feval(kind, zAt(amp,th)), zPrime(amp,th)); acc=[acc[0]+term[0], acc[1]+term[1]]; }\n` +
    `    var h=2*Math.PI/N; return [acc[0]*h, acc[1]*h];\n` +
    `  }\n` +
    `  var CX=270, CY=140, SC=82;\n` +
    `  function PX(x){ return CX + x*SC; } function PY(y){ return CY - y*SC; }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0], amp = +dIn.value;\n` +
    `    dL.textContent = 'deform = ' + amp.toFixed(2);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    svg.appendChild(mk('line', {x1:CX-150, y1:CY, x2:CX+170, y2:CY, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:CX, y1:CY-128, x2:CX, y2:CY+128, stroke:'var(--line)'}));\n` +
    `    // contour\n` +
    `    var pts=[], i, th; for(i=0;i<=200;i++){ th=2*Math.PI*i/200; var z=zAt(amp,th); pts.push(PX(z[0]).toFixed(1)+','+PY(z[1]).toFixed(1)); }\n` +
    `    svg.appendChild(mk('polyline', {points:pts.join(' '), fill:'color-mix(in srgb, var(--cyan) 8%, transparent)', stroke:'var(--cyan)', 'stroke-width':1.8}));\n` +
    `    // CCW direction tick (a small arrowhead near theta=0)\n` +
    `    var za=zAt(amp,0.0), zb=zAt(amp,0.14);\n` +
    `    svg.appendChild(mk('text', {x:PX(za[0])+6, y:PY(za[1])-2, 'font-size':12, fill:'var(--cyan)'}, '\\u2192'));\n` +
    `    svg.appendChild(mk('text', {x:CX, y:20, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'closed contour C (counter-clockwise)'));\n` +
    `    // poles (only the cases that have one)\n` +
    `    if(g.kind==='inv_z'){ svg.appendChild(mk('circle', {cx:PX(0), cy:PY(0), r:4, fill:'var(--orange)'})); svg.appendChild(mk('text', {x:PX(0)+7, y:PY(0)+13, 'font-size':10, fill:'var(--orange)'}, 'pole (inside)')); }\n` +
    `    else if(g.kind==='inv_zm'){ svg.appendChild(mk('circle', {cx:PX(1.6), cy:PY(0), r:4, fill:'var(--orange)'})); svg.appendChild(mk('text', {x:PX(1.6)+7, y:PY(0)+4, 'font-size':10, fill:'var(--orange)'}, 'pole (outside)')); svg.appendChild(mk('circle', {cx:CX, cy:CY, r:2.5, fill:'var(--mute)'})); }\n` +
    `    else { svg.appendChild(mk('circle', {cx:CX, cy:CY, r:2.5, fill:'var(--mute)'})); }\n` +
    `    // integral\n` +
    `    var I = contourIntegral(g.kind, amp), mag = Math.hypot(I[0], I[1]);\n` +
    `    function fmt(v){ return (Math.abs(v)<1e-6?0:v).toFixed(4); }\n` +
    `    var lines = [];\n` +
    `    lines.push('\\u222e_C f(z) dz = ' + fmt(I[0]) + ' + ' + fmt(I[1]) + 'i.');\n` +
    `    if(g.kind==='inv_z'){\n` +
    `      lines.push('\\u2248 2\\u03c0i \\u2248 6.2832 i \\u2014 the pole at 0 is ENCLOSED, so f is not holomorphic inside C and Cauchy\\u2019s theorem does not apply (this is the residue, 2\\u03c0i\\u00b7Res = 2\\u03c0i).');\n` +
    `    } else if(g.kind==='inv_zm'){\n` +
    `      lines.push('\\u2248 0 \\u2014 f has a pole at 1.6, but it lies OUTSIDE C, so f is holomorphic inside and Cauchy\\u2019s theorem gives \\u222e = 0.');\n` +
    `    } else {\n` +
    `      lines.push('\\u2248 0 \\u2014 f is holomorphic on and inside C, so Cauchy\\u2019s theorem gives \\u222e_C f dz = 0.');\n` +
    `    }\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    lines.push('Drag \\u201cdeform C\\u201d: the contour wobbles but \\u222e is unchanged \\u2014 the integral depends only on what C encloses, not on its shape (deformation invariance).');\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); dIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
