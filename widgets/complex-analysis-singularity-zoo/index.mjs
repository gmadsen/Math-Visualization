// complex-analysis-singularity-zoo widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Complex evaluation + plotting are intrinsic
// (selected by a `kind` enum); params carry the menu + classification text
// (validated against ./schema.json).

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
    `    <label for="${widgetId}-r">radius $r$</label>\n` +
    `    <input type="range" id="${widgetId}-r" min="0.15" max="1.2" value="0.6" step="0.01">\n` +
    `    <span class="pill" id="${widgetId}-rval">r = 0.60</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 250" width="560" height="250" role="img" aria-label="Image of the circle |z|=r under the chosen function"><title>Classifying a singularity by the image of a small circle</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* complex-analysis-singularity-zoo widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var byId = {}; FNS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var rIn = document.getElementById('${widgetId}-r'), rL = document.getElementById('${widgetId}-rval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !rIn || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function cdiv(p,q){ var d=q[0]*q[0]+q[1]*q[1]; return [(p[0]*q[0]+p[1]*q[1])/d, (p[1]*q[0]-p[0]*q[1])/d]; }\n` +
    `  function cexp(p){ var e=Math.exp(p[0]); return [e*Math.cos(p[1]), e*Math.sin(p[1])]; }\n` +
    `  function csin(p){ return [Math.sin(p[0])*Math.cosh(p[1]), Math.cos(p[0])*Math.sinh(p[1])]; }\n` +
    `  function f(kind, z){\n` +
    `    if(kind==='sinz_z'){ if(z[0]===0 && z[1]===0) return [1,0]; return cdiv(csin(z), z); }\n` +
    `    if(kind==='inv_z') return cdiv([1,0], z);\n` +
    `    if(kind==='inv_z2z'){ var z2=cmul(z,z), den=cmul(z2,[z[0]-1,z[1]]); return cdiv([1,0], den); }\n` +
    `    if(kind==='exp_invz') return cexp(cdiv([1,0], z));\n` +
    `    return z;\n` +
    `  }\n` +
    `  var TYPE = { removable:{c:'--green',t:'removable'}, pole:{c:'--yellow',t:'pole'}, essential:{c:'--pink',t:'essential'} };\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0], r = +rIn.value;\n` +
    `    rL.textContent = 'r = ' + r.toFixed(2);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var N = 360, img = [], maxAbs = 0;\n` +
    `    for(var i=0;i<=N;i++){ var t=2*Math.PI*i/N, z=[r*Math.cos(t), r*Math.sin(t)], w=f(g.kind, z); if(w && isFinite(w[0]) && isFinite(w[1])){ img.push(w); var a=Math.hypot(w[0],w[1]); if(a>maxAbs) maxAbs=a; } else img.push(null); }\n` +
    `    // auto-scale image to the panel (clip extreme so a pole/essential stays framed)\n` +
    `    var cap = Math.min(maxAbs, 60), sc = cap>0 ? 95/cap : 1, CX=420, CY=125;\n` +
    `    function WX(u){ return CX + u*sc; } function WY(v){ return CY - v*sc; }\n` +
    `    // left: the domain circle |z|=r\n` +
    `    var dz=[]; for(var k=0;k<=64;k++){ var tt=2*Math.PI*k/64; dz.push((140+r*70*Math.cos(tt)).toFixed(1)+','+(125-r*70*Math.sin(tt)).toFixed(1)); }\n` +
    `    svg.appendChild(mk('text', {x:140, y:22, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'domain: |z| = r'));\n` +
    `    svg.appendChild(mk('text', {x:420, y:22, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'image: f(|z| = r)'));\n` +
    `    svg.appendChild(mk('circle', {cx:140, cy:125, r:2, fill:'var(--mute)'}));\n` +
    `    svg.appendChild(mk('polyline', {points:dz.join(' '), fill:'none', stroke:'var(--cyan)', 'stroke-width':1.2}));\n` +
    `    // right: image curve as segments\n` +
    `    svg.appendChild(mk('circle', {cx:CX, cy:CY, r:2, fill:'var(--mute)'}));\n` +
    `    var ty = TYPE[g.type] || TYPE.pole, col = 'var(' + ty.c + ')';\n` +
    `    var seg=[]; function flush(){ if(seg.length>1) svg.appendChild(mk('polyline', {points:seg.join(' '), fill:'none', stroke:col, 'stroke-width':1.2})); seg=[]; }\n` +
    `    for(var j=0;j<img.length;j++){ var w=img[j]; if(!w || Math.hypot(w[0],w[1])>cap*1.05){ flush(); continue; } seg.push(WX(w[0]).toFixed(1)+','+WY(w[1]).toFixed(1)); } flush();\n` +
    `    // badge\n` +
    `    svg.appendChild(mk('rect', {x:470, y:210, width:80, height:24, rx:9, fill:'color-mix(in srgb, '+col+' 22%, var(--panel))', stroke:col, 'stroke-width':1}));\n` +
    `    svg.appendChild(mk('text', {x:510, y:226, 'text-anchor':'middle', 'font-size':11, 'font-weight':'600', fill:col}, ty.t));\n` +
    `    var lines = [];\n` +
    `    lines.push('image of |z| = ' + r.toFixed(2) + ':  max|f| \\u2248 ' + (maxAbs>999?'>999':maxAbs.toFixed(2)));\n` +
    `    lines.push('principal part: ' + g.laurent);\n` +
    `    if(g.behavior) lines.push(g.behavior);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw);\n` +
    `  rIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
