// complex-analysis-disk-automorphism widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The Blaschke map + grid plotting are intrinsic;
// params carry only title/hint (validated against ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-mod">$|a|$</label>\n` +
    `    <input type="range" id="${widgetId}-mod" min="0" max="0.9" value="0.5" step="0.01">\n` +
    `    <span class="pill" id="${widgetId}-modval">|a| = 0.50</span>\n` +
    `    <label for="${widgetId}-arg">$\\arg a$</label>\n` +
    `    <input type="range" id="${widgetId}-arg" min="0" max="6.283" value="0.5" step="0.02">\n` +
    `    <span class="pill" id="${widgetId}-argval">arg a = 0.50</span>\n` +
    `    <label for="${widgetId}-rot">$\\theta$</label>\n` +
    `    <input type="range" id="${widgetId}-rot" min="0" max="6.283" value="0" step="0.02">\n` +
    `    <span class="pill" id="${widgetId}-rotval">θ = 0.00</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 290" width="540" height="290" role="img" aria-label="A polar grid in the unit disk and its image under a disk automorphism"><title>Disk automorphism: a Blaschke map sends the disk to itself</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* complex-analysis-disk-automorphism widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var modIn = document.getElementById('${widgetId}-mod'), modL = document.getElementById('${widgetId}-modval');\n` +
    `  var argIn = document.getElementById('${widgetId}-arg'), argL = document.getElementById('${widgetId}-argval');\n` +
    `  var rotIn = document.getElementById('${widgetId}-rot'), rotL = document.getElementById('${widgetId}-rotval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!modIn || !argIn || !rotIn || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function cdiv(p,q){ var d=q[0]*q[0]+q[1]*q[1]; return [(p[0]*q[0]+p[1]*q[1])/d, (p[1]*q[0]-p[0]*q[1])/d]; }\n` +
    `  // phi(z) = e^{i theta} (z - a)/(1 - conj(a) z)\n` +
    `  function phi(z, a, eit){ var num=[z[0]-a[0], z[1]-a[1]]; var az=[a[0]*z[0]+a[1]*z[1], a[0]*z[1]-a[1]*z[0]]; var den=[1-az[0], -az[1]]; return cmul(eit, cdiv(num, den)); }\n` +
    `  var R = 95, LCX = 140, RCX = 400, CY = 150; // two disk panels of radius R\n` +
    `  function L(z){ return [LCX + z[0]*R, CY - z[1]*R]; } function Rp(z){ return [RCX + z[0]*R, CY - z[1]*R]; }\n` +
    `  function draw(){\n` +
    `    var am = +modIn.value, aa = +argIn.value, th = +rotIn.value;\n` +
    `    modL.textContent = '|a| = ' + am.toFixed(2); argL.textContent = 'arg a = ' + aa.toFixed(2); rotL.textContent = 'θ = ' + th.toFixed(2);\n` +
    `    var a = [am*Math.cos(aa), am*Math.sin(aa)], eit = [Math.cos(th), Math.sin(th)];\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    svg.appendChild(mk('text', {x:LCX, y:24, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'unit disk + polar grid'));\n` +
    `    svg.appendChild(mk('text', {x:RCX, y:24, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'image under φ'));\n` +
    `    svg.appendChild(mk('text', {x:270, y:CY+4, 'text-anchor':'middle', 'font-size':16, fill:'var(--mute)'}, '\\u2192'));\n` +
    `    // boundary circles\n` +
    `    svg.appendChild(mk('circle', {cx:LCX, cy:CY, r:R, fill:'none', stroke:'var(--line)', 'stroke-width':1.2}));\n` +
    `    svg.appendChild(mk('circle', {cx:RCX, cy:CY, r:R, fill:'none', stroke:'var(--line)', 'stroke-width':1.2}));\n` +
    `    // polar grid: concentric circles (cyan) + radial spokes (yellow), and their images\n` +
    `    function curve(pts, proj, color){ var s=pts.map(function(z){ var p=proj(z); return p[0].toFixed(1)+','+p[1].toFixed(1); }); svg.appendChild(mk('polyline', {points:s.join(' '), fill:'none', stroke:color, 'stroke-width':0.9, 'stroke-opacity':0.85})); }\n` +
    `    var rad=[0.2,0.4,0.6,0.8], spokes=8, M=60;\n` +
    `    rad.forEach(function(rr){ var dom=[],imgc=[]; for(var i=0;i<=M;i++){ var t=2*Math.PI*i/M, z=[rr*Math.cos(t), rr*Math.sin(t)]; dom.push(z); imgc.push(phi(z,a,eit)); } curve(dom,L,'var(--cyan)'); curve(imgc,Rp,'var(--cyan)'); });\n` +
    `    for(var k=0;k<spokes;k++){ var ang=2*Math.PI*k/spokes, dom=[],imgs=[]; for(var i=0;i<=M;i++){ var rr=0.92*i/M, z=[rr*Math.cos(ang), rr*Math.sin(ang)]; dom.push(z); imgs.push(phi(z,a,eit)); } curve(dom,L,'var(--yellow)'); curve(imgs,Rp,'var(--yellow)'); }\n` +
    `    // mark a (left) -> 0 (right), and 0 (left) -> phi(0) (right)\n` +
    `    var aL=L(a), zero=phi([0,0],a,eit), zeroR=Rp(zero);\n` +
    `    svg.appendChild(mk('circle', {cx:aL[0], cy:aL[1], r:4, fill:'var(--pink)'}));\n` +
    `    svg.appendChild(mk('text', {x:aL[0]+7, y:aL[1]+4, 'font-size':11, fill:'var(--pink)'}, 'a'));\n` +
    `    var cR=Rp([0,0]); svg.appendChild(mk('circle', {cx:cR[0], cy:cR[1], r:4, fill:'var(--pink)'}));\n` +
    `    svg.appendChild(mk('text', {x:cR[0]+7, y:cR[1]+4, 'font-size':11, fill:'var(--pink)'}, 'φ(a)=0'));\n` +
    `    var lines = [];\n` +
    `    lines.push('φ(z) = e^{iθ} (z − a)/(1 − ā z),  a = ' + a[0].toFixed(2) + ' + ' + a[1].toFixed(2) + 'i,  θ = ' + th.toFixed(2));\n` +
    `    lines.push('φ sends the disk to itself, a ↦ 0, and the boundary circle to itself — these Blaschke maps ARE all the holomorphic automorphisms of 𝔻.');\n` +
    `    lines.push('Being conformal, the image grid still meets at right angles; the rotation θ spins the whole picture about the new centre.');\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  modIn.addEventListener('input', draw); argIn.addEventListener('input', draw); rotIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
