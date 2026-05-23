// complex-analysis-conformal-map widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The function evaluation + grid plotting are
// intrinsic to the renderScript; params carry the map menu (validated against
// ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, maps } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = maps
    .map((m, i) => `      <option value="${escapeHtml(m.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(m.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">map $w = f(z)$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 310" width="580" height="310" role="img" aria-label="A grid in the z-plane and its conformal image"><title>Conformal map: a grid and its image under a holomorphic function</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, maps } = params;
  const data = JSON.stringify(maps);
  return (
    `<script>\n` +
    `/* complex-analysis-conformal-map widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var MAPS = ${data};\n` +
    `  var byId = {}; MAPS.forEach(function(m){ byId[m.id] = m; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  // f: returns [u,v] or null (blow-up / out of range)\n` +
    `  function f(kind, x, y){\n` +
    `    var r2 = x*x + y*y;\n` +
    `    if(kind==='sq') return [x*x - y*y, 2*x*y];\n` +
    `    if(kind==='cube') return [x*x*x - 3*x*y*y, 3*x*x*y - y*y*y];\n` +
    `    if(kind==='exp'){ var e=Math.exp(x); return [e*Math.cos(y), e*Math.sin(y)]; }\n` +
    `    if(kind==='inv'){ if(r2<0.04) return null; return [x/r2, -y/r2]; }\n` +
    `    if(kind==='mobius'){ var c=x+1, d=y, den=c*c+d*d; if(den<0.04) return null; var a=x-1, b=y; return [(a*c+b*d)/den, (b*c-a*d)/den]; }\n` +
    `    if(kind==='joukowski'){ if(r2<0.04) return null; return [0.5*(x + x/r2), 0.5*(y - y/r2)]; }\n` +
    `    return [x, y];\n` +
    `  }\n` +
    `  var D = 1.3, NL = 7, M = 36, CLIP = 30;\n` +
    `  // build grid lines as arrays of [x,y]; vertical (x const) + horizontal (y const)\n` +
    `  function gridLines(){\n` +
    `    var V = [], H = [], i, j;\n` +
    `    for(i=0;i<NL;i++){ var xv = -D + 2*D*i/(NL-1), lv=[]; for(j=0;j<=M;j++){ lv.push([xv, -D + 2*D*j/M]); } V.push(lv); }\n` +
    `    for(i=0;i<NL;i++){ var yh = -D + 2*D*i/(NL-1), lh=[]; for(j=0;j<=M;j++){ lh.push([-D + 2*D*j/M, yh]); } H.push(lh); }\n` +
    `    return {V:V, H:H};\n` +
    `  }\n` +
    `  function draw(){\n` +
    `    var m = byId[sel.value] || MAPS[0];\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var g = gridLines();\n` +
    `    // left panel: z-plane, center (145,155), scale sL\n` +
    `    var sL = 110/D, lcx = 145, lcy = 155;\n` +
    `    function LX(x){ return lcx + x*sL; } function LY(y){ return lcy - y*sL; }\n` +
    `    // compute images, gather bbox (clipped)\n` +
    `    var all = g.V.concat(g.H), images = [], wxmin=1e9, wxmax=-1e9, wymin=1e9, wymax=-1e9;\n` +
    `    for(var a=0;a<all.length;a++){ var line=all[a], img=[]; for(var b=0;b<line.length;b++){ var w=f(m.kind, line[b][0], line[b][1]); if(w && isFinite(w[0]) && isFinite(w[1]) && Math.abs(w[0])<CLIP && Math.abs(w[1])<CLIP){ img.push(w); if(w[0]<wxmin)wxmin=w[0]; if(w[0]>wxmax)wxmax=w[0]; if(w[1]<wymin)wymin=w[1]; if(w[1]>wymax)wymax=w[1]; } else { img.push(null); } } images.push(img); }\n` +
    `    var wcx=(wxmin+wxmax)/2, wcy=(wymin+wymax)/2, half=Math.max((wxmax-wxmin)/2,(wymax-wymin)/2,0.1), sR=105/half, rcx=435, rcy=155;\n` +
    `    function RX(x){ return rcx + (x-wcx)*sR; } function RY(y){ return rcy - (y-wcy)*sR; }\n` +
    `    // panel frames + labels\n` +
    `    svg.appendChild(mk('rect', {x:30, y:36, width:230, height:240, rx:6, fill:'none', stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('rect', {x:320, y:36, width:230, height:240, rx:6, fill:'none', stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('text', {x:145, y:26, 'text-anchor':'middle', 'font-size':12, fill:'var(--mute)', 'font-style':'italic'}, 'z-plane (domain grid)'));\n` +
    `    svg.appendChild(mk('text', {x:435, y:26, 'text-anchor':'middle', 'font-size':12, fill:'var(--mute)', 'font-style':'italic'}, 'w = f(z)  (image)'));\n` +
    `    svg.appendChild(mk('text', {x:290, y:160, 'text-anchor':'middle', 'font-size':18, fill:'var(--mute)'}, '\\u2192'));\n` +
    `    // draw a line as segments, breaking at nulls; project chooses panel\n` +
    `    function drawLine(pts, project, color, isImage){\n` +
    `      var seg = [];\n` +
    `      function flush(){ if(seg.length>1) svg.appendChild(mk('polyline', {points:seg.join(' '), fill:'none', stroke:color, 'stroke-width':1, 'stroke-opacity':0.85})); seg=[]; }\n` +
    `      for(var b=0;b<pts.length;b++){ var p=pts[b]; if(p===null){ flush(); continue; } var pr=project(p); seg.push(pr[0].toFixed(1)+','+pr[1].toFixed(1)); }\n` +
    `      flush();\n` +
    `    }\n` +
    `    var nV = g.V.length;\n` +
    `    // domain grid (left): V cyan, H yellow\n` +
    `    for(var v=0; v<g.V.length; v++) drawLine(g.V[v], function(p){ return [LX(p[0]), LY(p[1])]; }, 'var(--cyan)', false);\n` +
    `    for(var h=0; h<g.H.length; h++) drawLine(g.H[h], function(p){ return [LX(p[0]), LY(p[1])]; }, 'var(--yellow)', false);\n` +
    `    // image grid (right): same colour coding, from the precomputed images\n` +
    `    for(var a2=0;a2<images.length;a2++){ var color = a2 < nV ? 'var(--cyan)' : 'var(--yellow)'; drawLine(images[a2], function(p){ return [RX(p[0]), RY(p[1])]; }, color, true); }\n` +
    `    var lines = [];\n` +
    `    lines.push('cyan = vertical lines (Re z const),  yellow = horizontal (Im z const).');\n` +
    `    lines.push('Holomorphic \\u21d2 conformal: the image curves still cross at right angles wherever f\\u2032 \\u2260 0.');\n` +
    `    if(m.deriv) lines.push('f\\u2032(z) = ' + m.deriv);\n` +
    `    if(m.critical) lines.push(m.critical);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
