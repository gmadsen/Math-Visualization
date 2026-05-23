// functional-analysis-krein-milman widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The point geometry is intrinsic (a `kind` enum);
// params carry the shape menu. The widget highlights the extreme points of a
// compact convex set and, on a non-extreme boundary point, draws the segment
// witnessing it as a midpoint of two other points of the set.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, shapes } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = shapes
    .map((s, i) => `      <option value="${escapeHtml(s.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(s.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">convex set $K$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-t">probe boundary</label>\n` +
    `    <input type="range" id="${widgetId}-t" min="0" max="1" value="0.13" step="0.004">\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 290" width="540" height="290" role="img" aria-label="A compact convex set with its extreme points highlighted"><title>Krein–Milman: a compact convex set is the closed convex hull of its extreme points</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, shapes } = params;
  const data = JSON.stringify(shapes);
  return (
    `<script>\n` +
    `/* functional-analysis-krein-milman widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var SHAPES = ${data};\n` +
    `  var byId = {}; SHAPES.forEach(function(s){ byId[s.id] = s; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var tIn = document.getElementById('${widgetId}-t');\n` +
    `  var svg = document.getElementById('${widgetId}-svg'), out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !tIn || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  var CX=270, CY=150, R=96;\n` +
    `  function PX(x){ return CX + x*R; } function PY(y){ return CY - y*R; }\n` +
    `  var ARCF = Math.PI/(Math.PI+2); // arc-length fraction of the half-disk boundary\n` +
    `  // boundary point (unit-scaled), and whether it is an extreme point, per kind\n` +
    `  function verts(n){ var v=[], k; for(k=0;k<n;k++){ var ph=Math.PI/2 + 2*Math.PI*k/n; v.push([Math.cos(ph), Math.sin(ph)]); } return v; }\n` +
    `  function bpoint(sh, t){\n` +
    `    if(sh.kind==='disk'){ var a=2*Math.PI*t; return {p:[Math.cos(a),Math.sin(a)], ext:true}; }\n` +
    `    if(sh.kind==='halfdisk'){\n` +
    `      if(t < ARCF){ var th=Math.PI*(t/ARCF); return {p:[Math.cos(th),Math.sin(th)], ext:true}; }\n` +
    `      var s=(t-ARCF)/(1-ARCF), x=-1+2*s; var corner=(s<0.03||s>0.97); return {p:[x,0], ext:corner, edge:[[-1,0],[1,0]], s:s}; }\n` +
    `    var V=verts(sh.n||4), n=V.length, seg=t*n, k=Math.floor(seg)%n, ss=seg-Math.floor(seg);\n` +
    `    var A=V[k], B=V[(k+1)%n]; var p=[A[0]+ss*(B[0]-A[0]), A[1]+ss*(B[1]-A[1])];\n` +
    `    return {p:p, ext:(Math.min(ss,1-ss)<0.022), edge:[A,B], s:ss};\n` +
    `  }\n` +
    `  function draw(){\n` +
    `    var sh = byId[sel.value] || SHAPES[0], t=+tIn.value;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // filled set (sample the boundary)\n` +
    `    var fill=[], i; for(i=0;i<160;i++){ var q=bpoint(sh, i/160).p; fill.push(PX(q[0]).toFixed(1)+','+PY(q[1]).toFixed(1)); }\n` +
    `    svg.appendChild(mk('polygon', {points:fill.join(' '), fill:'color-mix(in srgb, var(--cyan) 9%, transparent)', stroke:'var(--cyan)', 'stroke-width':1.4}));\n` +
    `    // extreme set highlight\n` +
    `    if(sh.kind==='polygon'){ verts(sh.n||4).forEach(function(v){ svg.appendChild(mk('circle', {cx:PX(v[0]), cy:PY(v[1]), r:5, fill:'var(--pink)'})); }); }\n` +
    `    else if(sh.kind==='disk'){ svg.appendChild(mk('circle', {cx:CX, cy:CY, r:R, fill:'none', stroke:'var(--pink)', 'stroke-width':3})); }\n` +
    `    else { var arc=[]; for(i=0;i<=80;i++){ var th=Math.PI*i/80; arc.push(PX(Math.cos(th)).toFixed(1)+','+PY(Math.sin(th)).toFixed(1)); } svg.appendChild(mk('polyline', {points:arc.join(' '), fill:'none', stroke:'var(--pink)', 'stroke-width':3})); [[-1,0],[1,0]].forEach(function(v){ svg.appendChild(mk('circle', {cx:PX(v[0]), cy:PY(v[1]), r:5, fill:'var(--pink)'})); }); }\n` +
    `    // probe point\n` +
    `    var b=bpoint(sh, t), p=b.p;\n` +
    `    if(!b.ext && b.edge){ // witness: P = midpoint of x,y on the same edge\n` +
    `      var A=b.edge[0], B=b.edge[1], ex=B[0]-A[0], ey=B[1]-A[1]; var h=Math.min(b.s, 1-b.s, 0.32);\n` +
    `      var x1=[p[0]-h*ex, p[1]-h*ey], x2=[p[0]+h*ex, p[1]+h*ey];\n` +
    `      svg.appendChild(mk('line', {x1:PX(x1[0]), y1:PY(x1[1]), x2:PX(x2[0]), y2:PY(x2[1]), stroke:'var(--yellow)', 'stroke-width':2}));\n` +
    `      [x1,x2].forEach(function(v){ svg.appendChild(mk('circle', {cx:PX(v[0]), cy:PY(v[1]), r:3.5, fill:'var(--yellow)'})); });\n` +
    `    }\n` +
    `    svg.appendChild(mk('circle', {cx:PX(p[0]), cy:PY(p[1]), r:4.5, fill: b.ext?'var(--pink)':'var(--orange)', stroke:'var(--panel)', 'stroke-width':1.5}));\n` +
    `    svg.appendChild(mk('text', {x:CX, y:18, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'extreme points in pink'));\n` +
    `    // readout\n` +
    `    var extDesc = sh.kind==='polygon' ? ('its ' + (sh.n||4) + ' vertices') : (sh.kind==='disk' ? 'its entire boundary circle' : 'the curved arc plus the two corners');\n` +
    `    var lines=[];\n` +
    `    lines.push('Krein\\u2013Milman: a compact convex set K is the closed convex hull of its extreme points ext(K). Here ext(K) = ' + extDesc + '.');\n` +
    `    if(b.ext){ lines.push('The probe point IS extreme: it is not the midpoint of any segment lying in K \\u2014 you cannot write it as \\u00bd(x+y) with x \\u2260 y in K.'); }\n` +
    `    else { lines.push('The probe point is NOT extreme: it lies inside a flat edge, so it equals \\u00bd(x+y) for the two yellow points x \\u2260 y in K. Interior-of-edge points are averages, never extreme.'); }\n` +
    `    if(sh.note) lines.push(sh.note);\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); tIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
