// functional-analysis-operator-norm widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The singular-value computation is intrinsic; params
// carry only the initial matrix. The widget maps the unit circle to its image
// ellipse and reports ‖T‖ = σ_max.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const m = params.m0 || [1.4, 0.5, 0, 0.9];
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const f = (x) => (+x).toFixed(1);
  const slider = (id, lab, v) =>
    `    <label for="${widgetId}-${id}">${lab}</label>\n` +
    `    <input type="range" id="${widgetId}-${id}" min="-2" max="2" value="${f(v)}" step="0.1">\n`;
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    slider('a', 'a', m[0]) + slider('b', 'b', m[1]) + slider('c', 'c', m[2]) + slider('d', 'd', m[3]) +
    `    <span class="pill" id="${widgetId}-norm">‖T‖ = 1.40</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 280" width="540" height="280" role="img" aria-label="The unit circle and its image ellipse under T"><title>Operator norm: T maps the unit circle to an ellipse whose major semi-axis is ‖T‖</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* functional-analysis-operator-norm widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var aIn=document.getElementById('${widgetId}-a'), bIn=document.getElementById('${widgetId}-b'), cIn=document.getElementById('${widgetId}-c'), dIn=document.getElementById('${widgetId}-d');\n` +
    `  var normL=document.getElementById('${widgetId}-norm');\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  if(!aIn || !bIn || !cIn || !dIn || !normL || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  var CX=270, CY=140, SC=42;\n` +
    `  function PX(x){ return CX + x*SC; } function PY(y){ return CY - y*SC; }\n` +
    `  function draw(){\n` +
    `    var a=+aIn.value, b=+bIn.value, c=+cIn.value, d=+dIn.value;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // singular values: eigenvalues of M = T^T T = [[p,q],[q,r]]\n` +
    `    var p=a*a+c*c, r=b*b+d*d, q=a*b+c*d;\n` +
    `    var mid=(p+r)/2, dis=Math.sqrt(Math.max(0,((p-r)/2)*((p-r)/2)+q*q));\n` +
    `    var lmax=mid+dis, lmin=Math.max(0, mid-dis);\n` +
    `    var smax=Math.sqrt(lmax), smin=Math.sqrt(lmin);\n` +
    `    // right singular vector for sigma_max (eigenvector of M for lmax)\n` +
    `    var vx, vy; if(Math.abs(q)>1e-9){ vx=lmax-r; vy=q; } else { if(p>=r){ vx=1; vy=0; } else { vx=0; vy=1; } }\n` +
    `    var vn=Math.hypot(vx,vy)||1; vx/=vn; vy/=vn;\n` +
    `    normL.textContent='‖T‖ = ' + smax.toFixed(2);\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line', {x1:CX-150, y1:CY, x2:CX+150, y2:CY, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:CX, y1:CY-128, x2:CX, y2:CY+128, stroke:'var(--line)'}));\n` +
    `    // unit circle (domain)\n` +
    `    svg.appendChild(mk('circle', {cx:CX, cy:CY, r:SC, fill:'none', stroke:'var(--mute)', 'stroke-width':1.3, 'stroke-dasharray':'4 3'}));\n` +
    `    svg.appendChild(mk('text', {x:CX+SC+2, y:CY-4, 'font-size':9, fill:'var(--mute)'}, 'unit circle'));\n` +
    `    // image ellipse: T(cos θ, sin θ)\n` +
    `    var pts=[], i, th, x, y; for(i=0;i<=120;i++){ th=2*Math.PI*i/120; x=a*Math.cos(th)+b*Math.sin(th); y=c*Math.cos(th)+d*Math.sin(th); pts.push(PX(x).toFixed(1)+','+PY(y).toFixed(1)); }\n` +
    `    svg.appendChild(mk('polyline', {points:pts.join(' '), fill:'color-mix(in srgb, var(--cyan) 10%, transparent)', stroke:'var(--cyan)', 'stroke-width':1.8}));\n` +
    `    // max-stretch unit vector x* and its image Tx*\n` +
    `    var Tx=a*vx+b*vy, Ty=c*vx+d*vy;\n` +
    `    svg.appendChild(mk('line', {x1:CX, y1:CY, x2:PX(vx), y2:PY(vy), stroke:'var(--yellow)', 'stroke-width':1.5}));\n` +
    `    svg.appendChild(mk('circle', {cx:PX(vx), cy:PY(vy), r:3.5, fill:'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX(vx)+5, y:PY(vy)-4, 'font-size':10, fill:'var(--yellow)'}, 'x*'));\n` +
    `    svg.appendChild(mk('line', {x1:CX, y1:CY, x2:PX(Tx), y2:PY(Ty), stroke:'var(--pink)', 'stroke-width':2}));\n` +
    `    svg.appendChild(mk('circle', {cx:PX(Tx), cy:PY(Ty), r:4, fill:'var(--pink)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX(Tx)+5, y:PY(Ty)-4, 'font-size':10, fill:'var(--pink)'}, 'T x*  (length ‖T‖)'));\n` +
    `    // readout\n` +
    `    var det=a*d-b*c;\n` +
    `    var lines=[];\n` +
    `    lines.push('T = [[' + a.toFixed(1) + ', ' + b.toFixed(1) + '], [' + c.toFixed(1) + ', ' + d.toFixed(1) + ']].   ‖T‖ = sup_{‖x‖\\u22641} ‖Tx‖.');\n` +
    `    lines.push('The unit circle maps to an ellipse; ‖T‖ is its major semi-axis = the largest singular value \\u03c3_max = ' + smax.toFixed(3) + ' (attained at x*).');\n` +
    `    lines.push('Minor semi-axis \\u03c3_min = ' + smin.toFixed(3) + '.   |det T| = \\u03c3_max\\u00b7\\u03c3_min = ' + Math.abs(det).toFixed(3) + ' (the area scale). ' + (smin<0.02?'\\u03c3_min \\u2248 0: T is nearly rank-deficient \\u2014 the ellipse collapses to a segment.':''));\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  [aIn,bIn,cIn,dIn].forEach(function(s){ s.addEventListener('input', draw); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
