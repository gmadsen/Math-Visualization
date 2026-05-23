// complex-analysis-cauchy-formula widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The function eval + numerical Cauchy integral are
// intrinsic (a `kind` enum); params carry the case menu (validated against
// ./schema.json). (1/2πi)∮_C f(z)/(z−a) dz is computed by the periodic
// trapezoid rule around a fixed circle C; it returns f(a) when a is inside C
// and 0 when a is outside.

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
    `    <label for="${widgetId}-sel">holomorphic $f(z)$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-a">base point $a$</label>\n` +
    `    <input type="range" id="${widgetId}-a" min="-2.2" max="2.2" value="0.4" step="0.05">\n` +
    `    <span class="pill" id="${widgetId}-aval">a = 0.40</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 280" width="540" height="280" role="img" aria-label="A circle C and a base point a, inside or outside it"><title>Cauchy integral formula: the contour integral recovers f(a) for a inside C</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* complex-analysis-cauchy-formula widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var byId = {}; FNS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var aIn = document.getElementById('${widgetId}-a'), aL = document.getElementById('${widgetId}-aval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !aIn || !aL || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function cdiv(p,q){ var d=q[0]*q[0]+q[1]*q[1]; return [(p[0]*q[0]+p[1]*q[1])/d, (p[1]*q[0]-p[0]*q[1])/d]; }\n` +
    `  function cexp(p){ var e=Math.exp(p[0]); return [e*Math.cos(p[1]), e*Math.sin(p[1])]; }\n` +
    `  function feval(kind, z){\n` +
    `    if(kind==='z') return z;\n` +
    `    if(kind==='z2') return cmul(z,z);\n` +
    `    if(kind==='ez') return cexp(z);\n` +
    `    if(kind==='cosz') return [Math.cos(z[0])*Math.cosh(z[1]), -Math.sin(z[0])*Math.sinh(z[1])];\n` +
    `    return z;\n` +
    `  }\n` +
    `  var R = 1.3;\n` +
    `  function cauchyIntegral(kind, a){\n` +
    `    // (1/2πi) ∮_C f(z)/(z−a) dz,  z(θ)=R e^{iθ},  z'(θ)=i R e^{iθ}\n` +
    `    var N=1440, acc=[0,0], j, th, z, zp, integ;\n` +
    `    for(j=0;j<N;j++){ th=2*Math.PI*j/N; z=[R*Math.cos(th), R*Math.sin(th)]; zp=[-R*Math.sin(th), R*Math.cos(th)];\n` +
    `      integ=cmul(cdiv(feval(kind, z), [z[0]-a, z[1]]), zp); acc=[acc[0]+integ[0], acc[1]+integ[1]]; }\n` +
    `    var h=2*Math.PI/N, raw=[acc[0]*h, acc[1]*h];\n` +
    `    return cdiv(raw, [0, 2*Math.PI]); // divide by 2πi\n` +
    `  }\n` +
    `  var CX=270, CY=140, SC=72;\n` +
    `  function PX(x){ return CX + x*SC; } function PY(y){ return CY - y*SC; }\n` +
    `  function fmt(v){ return (Math.abs(v)<1e-4?0:v).toFixed(4); }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0], a = +aIn.value;\n` +
    `    aL.textContent = 'a = ' + a.toFixed(2);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    svg.appendChild(mk('line', {x1:CX-170, y1:CY, x2:CX+170, y2:CY, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:CX, y1:CY-110, x2:CX, y2:CY+110, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('circle', {cx:CX, cy:CY, r:R*SC, fill:'color-mix(in srgb, var(--cyan) 7%, transparent)', stroke:'var(--cyan)', 'stroke-width':1.8}));\n` +
    `    svg.appendChild(mk('text', {x:CX, y:20, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'contour C: |z| = 1.3'));\n` +
    `    var near = Math.abs(Math.abs(a) - R) < 0.08, inside = Math.abs(a) < R - 1e-9;\n` +
    `    var col = near ? 'var(--orange)' : (inside ? 'var(--yellow)' : 'var(--mute)');\n` +
    `    svg.appendChild(mk('circle', {cx:PX(a), cy:PY(0), r:4.5, fill:col}));\n` +
    `    svg.appendChild(mk('text', {x:PX(a), y:PY(0)-9, 'text-anchor':'middle', 'font-size':10, fill:col}, 'a'));\n` +
    `    var I = cauchyIntegral(g.kind, a), fa = feval(g.kind, [a,0]);\n` +
    `    var lines = [];\n` +
    `    if(near){\n` +
    `      // a is on (or within a quadrature node of) the contour: the integrand is singular, so\n` +
    `      // the numeric value is meaningless (NaN / huge). Don't print it — just explain.\n` +
    `      lines.push('(1/2\\u03c0i) \\u222e_C f(z)/(z\\u2212a) dz is undefined here.');\n` +
    `      lines.push('a sits ON (or right next to) the contour |z| = 1.3, where the integrand blows up and the formula does not apply. Move a clearly inside or outside.');\n` +
    `    } else if(inside){\n` +
    `      lines.push('(1/2\\u03c0i) \\u222e_C f(z)/(z\\u2212a) dz = ' + fmt(I[0]) + ' + ' + fmt(I[1]) + 'i.');\n` +
    `      lines.push('a = ' + a.toFixed(2) + ' is INSIDE C, and f(a) = ' + fmt(fa[0]) + ' + ' + fmt(fa[1]) + 'i. They match \\u2014 the Cauchy integral formula: the contour integral reads off the value f(a).');\n` +
    `    } else {\n` +
    `      lines.push('(1/2\\u03c0i) \\u222e_C f(z)/(z\\u2212a) dz = ' + fmt(I[0]) + ' + ' + fmt(I[1]) + 'i.');\n` +
    `      lines.push('a = ' + a.toFixed(2) + ' is OUTSIDE C, so f(z)/(z\\u2212a) is holomorphic inside and the integral is 0 \\u2014 the formula recovers a value only for points the contour encloses.');\n` +
    `    }\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); aIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
