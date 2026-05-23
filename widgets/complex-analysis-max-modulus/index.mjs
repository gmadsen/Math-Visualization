// complex-analysis-max-modulus widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The |f| sampling + heatmap are intrinsic (a `kind`
// enum); params carry the menu (validated against ./schema.json).

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
    `    <label for="${widgetId}-sel">f(z)</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 270" width="540" height="270" role="img" aria-label="Heatmap of |f| over the unit disk with the boundary maximum"><title>Maximum modulus: |f| is largest on the boundary of the disk</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* complex-analysis-max-modulus widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var byId = {}; FNS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function cexp(p){ var e=Math.exp(p[0]); return [e*Math.cos(p[1]), e*Math.sin(p[1])]; }\n` +
    `  function csin(p){ return [Math.sin(p[0])*Math.cosh(p[1]), Math.cos(p[0])*Math.sinh(p[1])]; }\n` +
    `  function f(kind, z){\n` +
    `    if(kind==='sq') return cmul(z,z);\n` +
    `    if(kind==='exp') return cexp(z);\n` +
    `    if(kind==='cube_m_z'){ var z2=cmul(z,z), z3=cmul(z2,z); return [z3[0]-z[0], z3[1]-z[1]]; }\n` +
    `    if(kind==='sinz') return csin(z);\n` +
    `    if(kind==='poly211'){ var z2=cmul(z,z); return [z2[0]+z[0]+1, z2[1]+z[1]]; }\n` +
    `    return z;\n` +
    `  }\n` +
    `  function absf(kind, x, y){ var w=f(kind,[x,y]); return Math.hypot(w[0],w[1]); }\n` +
    `  var CX=200, CY=140, Rpx=110; // disk centre + pixel radius\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0];\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var GN=26, cell=2*Rpx/GN, maxAbs=0, intMax=0;\n` +
    `    // first pass: global max over the closed disk (boundary included)\n` +
    `    for(var bi=0;bi<=240;bi++){ var th=2*Math.PI*bi/240, a=absf(g.kind, Math.cos(th), Math.sin(th)); if(a>maxAbs) maxAbs=a; }\n` +
    `    // interior max (|z| <= 0.92) for comparison\n` +
    `    for(var ix=0;ix<GN;ix++) for(var iy=0;iy<GN;iy++){ var x=-1+(ix+0.5)*2/GN, y=-1+(iy+0.5)*2/GN; if(x*x+y*y<=0.85){ var a2=absf(g.kind,x,y); if(a2>intMax) intMax=a2; } }\n` +
    `    // heatmap cells over the disk\n` +
    `    for(var jx=0;jx<GN;jx++) for(var jy=0;jy<GN;jy++){ var cx2=-1+(jx+0.5)*2/GN, cy2=-1+(jy+0.5)*2/GN; if(cx2*cx2+cy2*cy2>1) continue; var av=absf(g.kind,cx2,cy2), op=maxAbs>0?Math.pow(av/maxAbs,0.8):0; svg.appendChild(mk('rect', {x:CX+cx2*Rpx-cell/2, y:CY-cy2*Rpx-cell/2, width:cell+0.6, height:cell+0.6, fill:'var(--cyan)', 'fill-opacity':(0.08+0.85*op).toFixed(3)})); }\n` +
    `    // boundary circle + max marker\n` +
    `    svg.appendChild(mk('circle', {cx:CX, cy:CY, r:Rpx, fill:'none', stroke:'var(--line)', 'stroke-width':1.2}));\n` +
    `    var bestTh=0, best=0; for(var k=0;k<720;k++){ var t2=2*Math.PI*k/720, a3=absf(g.kind, Math.cos(t2), Math.sin(t2)); if(a3>best){ best=a3; bestTh=t2; } }\n` +
    `    var mx=Math.cos(bestTh), my=Math.sin(bestTh);\n` +
    `    svg.appendChild(mk('circle', {cx:CX+mx*Rpx, cy:CY-my*Rpx, r:5, fill:'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('text', {x:CX+mx*Rpx+8, y:CY-my*Rpx+4, 'font-size':10, fill:'var(--yellow)'}, 'max |f|'));\n` +
    `    svg.appendChild(mk('text', {x:CX, y:CY+Rpx+22, 'text-anchor':'middle', 'font-size':10, fill:'var(--mute)', 'font-style':'italic'}, 'brighter = larger |f|'));\n` +
    `    var lines = [];\n` +
    `    lines.push('max |f| over the closed disk = ' + maxAbs.toFixed(3) + ', attained on the boundary at z = e^{i·' + bestTh.toFixed(2) + '}.');\n` +
    `    lines.push('largest |f| in the interior (|z| ≤ 0.92) = ' + intMax.toFixed(3) + '  <  ' + maxAbs.toFixed(3) + '.');\n` +
    `    lines.push('Maximum modulus principle: a non-constant holomorphic f has no interior local max of |f| — the sup sits on the boundary.');\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
