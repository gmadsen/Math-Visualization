// functional-analysis-riesz widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The geometry is intrinsic; params carry only the
// initial representing vector. The widget shows the functional ℓ(x)=⟨x,v⟩ via its
// level lines (⊥ v) and a test point, with ‖ℓ‖ = ‖v‖.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const v = params.v0 || [1.3, 0.8];
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const f = (x) => (+x).toFixed(1);
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-vx">$v_x$</label>\n` +
    `    <input type="range" id="${widgetId}-vx" min="-2" max="2" value="${f(v[0])}" step="0.1">\n` +
    `    <label for="${widgetId}-vy">$v_y$</label>\n` +
    `    <input type="range" id="${widgetId}-vy" min="-2" max="2" value="${f(v[1])}" step="0.1">\n` +
    `    <label for="${widgetId}-th">test point $x$</label>\n` +
    `    <input type="range" id="${widgetId}-th" min="0" max="6.28" value="0.7" step="0.02">\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 280" width="540" height="280" role="img" aria-label="The level lines of a linear functional, its representing vector, and a test point"><title>Riesz representation: every bounded functional is an inner product with a unique vector</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* functional-analysis-riesz widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var vxIn=document.getElementById('${widgetId}-vx'), vyIn=document.getElementById('${widgetId}-vy'), thIn=document.getElementById('${widgetId}-th');\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  if(!vxIn || !vyIn || !thIn || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  var CX=270, CY=140, SC=52, RX=1.45;\n` +
    `  function PX(x){ return CX + x*SC; } function PY(y){ return CY - y*SC; }\n` +
    `  function draw(){\n` +
    `    var vx=+vxIn.value, vy=+vyIn.value, th=+thIn.value;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var nv=Math.hypot(vx,vy);\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line', {x1:CX-150, y1:CY, x2:CX+150, y2:CY, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:CX, y1:CY-128, x2:CX, y2:CY+128, stroke:'var(--line)'}));\n` +
    `    // level lines ℓ = c  (perpendicular to v, through (c/|v|^2) v)\n` +
    `    if(nv>1e-6){ var ux=-vy/nv, uy=vx/nv; var c; for(c=-3;c<=3;c++){ var bx=(c/(nv*nv))*vx, by=(c/(nv*nv))*vy; var L=4.5;\n` +
    `      svg.appendChild(mk('line', {x1:PX(bx-L*ux), y1:PY(by-L*uy), x2:PX(bx+L*ux), y2:PY(by+L*uy), stroke: c===0?'var(--pink)':'var(--line)', 'stroke-width': c===0?1.8:1, 'stroke-dasharray': c===0?'':'3 4'})); }\n` +
    `      svg.appendChild(mk('text', {x:PX(-vy/nv*4.5*0.8), y:PY(vx/nv*4.5*0.8)-4, 'font-size':9, fill:'var(--pink)'}, 'ker ℓ ( ℓ=0 )')); }\n` +
    `    // representing vector v\n` +
    `    svg.appendChild(mk('line', {x1:CX, y1:CY, x2:PX(vx), y2:PY(vy), stroke:'var(--violet)', 'stroke-width':2.4}));\n` +
    `    svg.appendChild(mk('circle', {cx:PX(vx), cy:PY(vy), r:4, fill:'var(--violet)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX(vx)+5, y:PY(vy)-4, 'font-size':10, fill:'var(--violet)'}, 'v'));\n` +
    `    // test point x on a circle of radius RX\n` +
    `    var xx=RX*Math.cos(th), xy=RX*Math.sin(th);\n` +
    `    svg.appendChild(mk('line', {x1:CX, y1:CY, x2:PX(xx), y2:PY(xy), stroke:'var(--yellow)', 'stroke-width':1.6}));\n` +
    `    svg.appendChild(mk('circle', {cx:PX(xx), cy:PY(xy), r:4, fill:'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX(xx)+5, y:PY(xy)-4, 'font-size':10, fill:'var(--yellow)'}, 'x'));\n` +
    `    var lx=xx*vx+xy*vy; // ℓ(x) = <x,v>\n` +
    `    // foot of x on the level line through it is automatic; show projection onto v-direction\n` +
    `    if(nv>1e-6){ var proj=lx/(nv*nv); svg.appendChild(mk('line', {x1:PX(xx), y1:PY(xy), x2:PX(proj*vx), y2:PY(proj*vy), stroke:'var(--cyan)', 'stroke-width':1, 'stroke-dasharray':'2 3'})); }\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    lines.push('Riesz: every bounded linear functional ℓ on a Hilbert space is ℓ(x) = ⟨x, v⟩ for a UNIQUE v, and ‖ℓ‖ = ‖v‖ (an isometry H ≅ H*).');\n` +
    `    lines.push('Here v = (' + vx.toFixed(1) + ', ' + vy.toFixed(1) + '),  ‖ℓ‖ = ‖v‖ = ' + nv.toFixed(2) + '.   ℓ(x) = ⟨x, v⟩ = ' + lx.toFixed(2) + '.');\n` +
    `    lines.push('The level sets ℓ = c are the lines PERPENDICULAR to v; the kernel ℓ = 0 (pink) passes through the origin. ℓ(x) is the signed projection of x onto v, scaled by ‖v‖.');\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  [vxIn,vyIn,thIn].forEach(function(s){ s.addEventListener('input', draw); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
