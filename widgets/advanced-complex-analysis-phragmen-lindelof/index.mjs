// advanced-complex-analysis-phragmen-lindelof widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The function eval is intrinsic (a `kind` enum);
// params carry the case menu (validated against ./schema.json). The widget plots
// log|f| along a ray of the right half-plane at angle α, with the boundary
// (α=π/2) and bisector (α=0) references, illustrating Phragmén–Lindelöf.

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
    `    <label for="${widgetId}-sel">$f(z)$ on $\\operatorname{Re} z\\ge 0$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-a">ray angle $\\alpha$</label>\n` +
    `    <input type="range" id="${widgetId}-a" min="0" max="1.5708" value="0.5" step="0.02">\n` +
    `    <span class="pill" id="${widgetId}-aval">α = 0.50</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 250" width="540" height="250" role="img" aria-label="The right half-plane with a ray, and log|f| along that ray vs the boundary and bisector"><title>Phragmén–Lindelöf: bounded boundary plus a growth bound controls the interior of an unbounded domain</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* advanced-complex-analysis-phragmen-lindelof widget: ${widgetId} */\n` +
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
    `  // log|f| at radius r along the ray of angle alpha (z = r e^{i alpha}, Re z >= 0 for |alpha|<=pi/2)\n` +
    `  function logAbs(kind, r, al){\n` +
    `    if(kind==='ez') return r*Math.cos(al);                       // |e^z| = e^{Re z}\n` +
    `    return -Math.sqrt(r)*Math.cos(al/2);                          // |e^{-sqrt z}| = e^{-Re sqrt z}\n` +
    `  }\n` +
    `  var RMAX=8;\n` +
    `  // left inset: the right half-plane;  right: the log|f| vs r plot\n` +
    `  var Lx=78, Ly=128, LS=42;\n` +
    `  var PX0=212, PW=300, PTop=30, PBot=212, PH=182;\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0], al = +aIn.value;\n` +
    `    aL.textContent = '\\u03b1 = ' + al.toFixed(2);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var ez = (g.kind==='ez');\n` +
    `    var yLo = ez?-1:-3, yHi = ez?8.5:0.6;\n` +
    `    function PX(r){ return PX0 + r/RMAX*PW; } function PY(v){ var c=Math.max(yLo,Math.min(yHi,v)); return PBot - (c-yLo)/(yHi-yLo)*PH; }\n` +
    `    // ---- left inset: half-plane ----\n` +
    `    svg.appendChild(mk('rect', {x:Lx, y:Ly-92, width:92, height:184, fill:'color-mix(in srgb, var(--cyan) 7%, transparent)'}));\n` +
    `    svg.appendChild(mk('line', {x1:Lx-60, y1:Ly, x2:Lx+92, y2:Ly, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:Lx, y1:Ly-96, x2:Lx, y2:Ly+96, stroke:'var(--pink)', 'stroke-width':2}));\n` +
    `    svg.appendChild(mk('text', {x:Lx+4, y:Ly-86, 'font-size':9, fill:'var(--pink)'}, 'boundary'));\n` +
    `    svg.appendChild(mk('line', {x1:Lx, y1:Ly, x2:Lx+90*Math.cos(al), y2:Ly-90*Math.sin(al), stroke:'var(--cyan)', 'stroke-width':2}));\n` +
    `    svg.appendChild(mk('text', {x:Lx+92, y:Ly+4, 'font-size':9, fill:'var(--mute)'}, 'Re z \\u2265 0'));\n` +
    `    // ---- right plot ----\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY(0), x2:PX0+PW, y2:PY(0), stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PTop, x2:PX0, y2:PBot, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PY(0)+(ez?14:-6), 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'r \\u2192 ' + RMAX));\n` +
    `    svg.appendChild(mk('text', {x:PX0-6, y:PTop+8, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'log|f|'));\n` +
    `    function curve(al2, attrs){ var pts=[], i, r; for(i=0;i<=160;i++){ r=RMAX*i/160; pts.push(PX(r).toFixed(1)+','+PY(logAbs(g.kind,r,al2)).toFixed(1)); } svg.appendChild(mk('polyline', Object.assign({points:pts.join(' '), fill:'none'}, attrs))); }\n` +
    `    curve(0, {stroke:'var(--yellow)', 'stroke-width':1.2, 'stroke-dasharray':'4 3'});       // bisector (interior)\n` +
    `    curve(Math.PI/2, {stroke:'var(--pink)', 'stroke-width':1.2, 'stroke-dasharray':'4 3'}); // boundary\n` +
    `    curve(al, {stroke:'var(--cyan)', 'stroke-width':2.2});                                  // chosen ray\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PY(logAbs(g.kind,RMAX,0))+ (ez?-3:12), 'text-anchor':'end', 'font-size':9, fill:'var(--yellow)'}, '\\u03b1=0 (real axis)'));\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PY(logAbs(g.kind,RMAX,Math.PI/2))-3, 'text-anchor':'end', 'font-size':9, fill:'var(--pink)'}, '\\u03b1=\\u03c0/2 (boundary)'));\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    if(ez){\n` +
    `      lines.push('On the BOUNDARY (imaginary axis, \\u03b1=\\u03c0/2): |e^z| = e^{Re z} = 1 \\u2014 bounded. But on the real axis (\\u03b1=0): |e^z| = e^r \\u2192 \\u221e.');\n` +
    `      lines.push('So a bounded boundary does NOT bound the interior here: the naive maximum principle fails on the unbounded half-plane.');\n` +
    `      lines.push('Phragmén\\u2013Lindelöf restores it by ADDING a growth bound \\u2014 order < 1 on a half-plane. e^z has order exactly 1, sitting on the borderline the theorem rules out.');\n` +
    `    } else {\n` +
    `      lines.push('|e^{\\u2212\\u221az}| = e^{\\u2212\\u221ar\\u00b7cos(\\u03b1/2)} \\u2264 1 on the WHOLE half-plane (boundary and interior alike), and it has order \\u00bd < 1.');\n` +
    `      lines.push('So it satisfies the Phragmén\\u2013Lindelöf hypotheses: the boundary bound (here 1) genuinely controls the interior \\u2014 no blow-up. Slide \\u03b1: every ray stays \\u2264 0 in log scale.');\n` +
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
