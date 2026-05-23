// complex-analysis-open-mapping widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The function eval + winding count are intrinsic
// (a `kind` enum); params carry the case menu (validated against ./schema.json).
// A disk around z0 is drawn beside its image; the winding number of the image of
// the boundary around f(z0) decides whether f(z0) is interior (image open).

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
    `    <label for="${widgetId}-sel">map $f(z)$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-c">center $x$</label>\n` +
    `    <input type="range" id="${widgetId}-c" min="0.3" max="1.8" value="1" step="0.05">\n` +
    `    <label for="${widgetId}-r">radius</label>\n` +
    `    <input type="range" id="${widgetId}-r" min="0.1" max="0.5" value="0.3" step="0.02">\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 280" width="540" height="280" role="img" aria-label="A disk around z0 and its image under f"><title>Open mapping theorem: a non-constant holomorphic map sends the open disk to an open set</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* complex-analysis-open-mapping widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var byId = {}; FNS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var cIn = document.getElementById('${widgetId}-c'), rIn = document.getElementById('${widgetId}-r');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !cIn || !rIn || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function cexp(p){ var e=Math.exp(p[0]); return [e*Math.cos(p[1]), e*Math.sin(p[1])]; }\n` +
    `  function feval(kind, z){\n` +
    `    if(kind==='z2') return cmul(z,z);\n` +
    `    if(kind==='z3') return cmul(cmul(z,z), z);\n` +
    `    if(kind==='ez') return cexp(z);\n` +
    `    if(kind==='re') return [z[0], 0];\n` +
    `    if(kind==='abs') return [Math.hypot(z[0], z[1]), 0];\n` +
    `    return z;\n` +
    `  }\n` +
    `  var CY0=0.4; // fixed imaginary part of the disk centre\n` +
    `  var Lcx=130, Lcy=140, SCD=66;\n` +
    `  function DX(x){ return Lcx + (x-1.05)*SCD; } function DY(y){ return Lcy - y*SCD; }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0], cx = +cIn.value, r = +rIn.value, c=[cx, CY0];\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // ---- domain disk ----\n` +
    `    svg.appendChild(mk('line', {x1:Lcx-105, y1:Lcy, x2:Lcx+105, y2:Lcy, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:Lcx, y1:Lcy-105, x2:Lcx, y2:Lcy+105, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('circle', {cx:DX(cx), cy:DY(CY0), r:r*SCD, fill:'color-mix(in srgb, var(--cyan) 12%, transparent)', stroke:'var(--cyan)', 'stroke-width':1.6}));\n` +
    `    svg.appendChild(mk('circle', {cx:DX(cx), cy:DY(CY0), r:3.5, fill:'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('text', {x:DX(cx)+7, y:DY(CY0)-6, 'font-size':10, fill:'var(--yellow)'}, 'z\\u2080'));\n` +
    `    svg.appendChild(mk('text', {x:Lcx, y:18, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'open disk around z\\u2080'));\n` +
    `    // ---- image of the boundary ----\n` +
    `    var M=240, bd=[], i, th, z, w, xmin=1e9,xmax=-1e9,ymin=1e9,ymax=-1e9;\n` +
    `    for(i=0;i<=M;i++){ th=2*Math.PI*i/M; z=[cx+r*Math.cos(th), CY0+r*Math.sin(th)]; w=feval(g.kind, z); bd.push(w); if(w[0]<xmin)xmin=w[0]; if(w[0]>xmax)xmax=w[0]; if(w[1]<ymin)ymin=w[1]; if(w[1]>ymax)ymax=w[1]; }\n` +
    `    var fc = feval(g.kind, c);\n` +
    `    if(fc[0]<xmin)xmin=fc[0]; if(fc[0]>xmax)xmax=fc[0]; if(fc[1]<ymin)ymin=fc[1]; if(fc[1]>ymax)ymax=fc[1];\n` +
    `    var w0=Math.max(xmax-xmin,1e-3), h0=Math.max(ymax-ymin,1e-3);\n` +
    `    var SCI=Math.min(210/w0, 200/h0), Rcx=410, Rcy=140, cxI=(xmin+xmax)/2, cyI=(ymin+ymax)/2;\n` +
    `    function IX(p){ return Rcx + (p[0]-cxI)*SCI; } function IY(p){ return Rcy - (p[1]-cyI)*SCI; }\n` +
    `    // winding of the boundary image around f(z0), plus how close the boundary comes to f(z0)\n` +
    `    var total=0, prev=null, minR=1e9, maxR=0;\n` +
    `    for(i=0;i<=M;i++){ var dx=bd[i][0]-fc[0], dy=bd[i][1]-fc[1], rr=Math.hypot(dx,dy); if(rr<minR)minR=rr; if(rr>maxR)maxR=rr; var ang=Math.atan2(dy, dx); if(prev!==null){ var d=ang-prev; while(d>Math.PI)d-=2*Math.PI; while(d<=-Math.PI)d+=2*Math.PI; total+=d; } prev=ang; }\n` +
    `    // a degenerate (collapsed) image has its boundary passing through f(z0): the winding is then meaningless,\n` +
    `    // so f(z0) is NOT an interior point. Re(z) and |z| collapse the disk to a segment and trip this.\n` +
    `    var degenerate = (maxR < 1e-9) || (minR < 0.04*maxR);\n` +
    `    var winding = degenerate ? 0 : Math.round(total/(2*Math.PI));\n` +
    `    var pts=bd.map(function(p){ return IX(p).toFixed(1)+','+IY(p).toFixed(1); });\n` +
    `    svg.appendChild(mk('polyline', {points:pts.join(' '), fill: winding!==0?'color-mix(in srgb, var(--violet) 14%, transparent)':'none', stroke:'var(--violet)', 'stroke-width':1.8}));\n` +
    `    svg.appendChild(mk('circle', {cx:IX(fc), cy:IY(fc), r:4, fill:'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('text', {x:IX(fc)+7, y:IY(fc)-6, 'font-size':10, fill:'var(--yellow)'}, 'f(z\\u2080)'));\n` +
    `    svg.appendChild(mk('text', {x:Rcx, y:18, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'image f(disk)'));\n` +
    `    // ---- readout ----\n` +
    `    var lines = [];\n` +
    `    if(winding!==0){\n` +
    `      lines.push('The image of the boundary winds ' + Math.abs(winding) + ' time(s) around f(z\\u2080), so f(z\\u2080) lies in the INTERIOR of f(disk): the image is an OPEN set.');\n` +
    `      lines.push('Open mapping theorem: a non-constant holomorphic map sends open sets to open sets. (No real-variable map like x\\u00b2 does this \\u2014 it is special to holomorphy.)');\n` +
    `      if(Math.abs(winding)>1) lines.push('Winding ' + Math.abs(winding) + ' means f is locally ' + Math.abs(winding) + '-to-1 here (a critical point), but the image is still open.');\n` +
    `    } else {\n` +
    `      lines.push('The image is just a segment \\u2014 a 1-D set, which has EMPTY INTERIOR in \\u2102. So no point of it (f(z\\u2080) included) is an interior point, and the image is NOT open. (The boundary image doesn\\u2019t enclose f(z\\u2080): winding 0.)');\n` +
    `      lines.push('Re(z) and |z| are NOT holomorphic; they collapse the disk to a 1-D set and are not open maps. The open mapping theorem genuinely needs holomorphy.');\n` +
    `    }\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); cIn.addEventListener('input', draw); rIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
