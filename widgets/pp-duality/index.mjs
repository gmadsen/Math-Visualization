// pp-duality widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Projective duality via pole-polar of the unit circle:
// point (px,py) <-> line px*x+py*y=1. The determinant detecting collinearity of
// three points is the same one detecting concurrency of their polars, so
// collinear points <=> concurrent lines (Pascal <-> Brianchon).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="note">Drag the three points $A,B,C$. Each point's polar line is drawn in the same colour.</span>\n` +
    `    <button type="button" id="${widgetId}-coll">make collinear</button>\n` +
    `    <button type="button" id="${widgetId}-reset">reset</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="Three draggable points and their polar lines with respect to the unit circle, showing collinear points correspond to concurrent polars"><title>Pole–polar duality: a point maps to its polar line w.r.t. the unit circle; three collinear points have three concurrent polar lines</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* pp-duality widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var bColl=document.getElementById('${widgetId}-coll'), bReset=document.getElementById('${widgetId}-reset');\n` +
    `  if(!svg||!out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var COL=['var(--cyan)','var(--yellow)','var(--pink)'], LBL=['A','B','C'];\n` +
    `  var DEF=[[-1.05,0.62],[1.1,0.42],[0.05,-1.05]];\n` +
    `  var P=DEF.map(function(p){ return p.slice(); });\n` +
    `  var sc=66, cx0=190, cy0=160;\n` +              // plane: data (x,y) -> svg
    `  var XMIN=-2.3, XMAX=2.3, YMIN=-2.25, YMAX=2.25;\n` +
    `  function X(x){ return cx0+x*sc; } function Y(y){ return cy0-y*sc; }\n` +
    `  function dataFromEvent(ev){ var pt=svg.createSVGPoint(); pt.x=ev.clientX; pt.y=ev.clientY; var m=svg.getScreenCTM(); if(!m) return null; var loc=pt.matrixTransform(m.inverse()); return [ (loc.x-cx0)/sc, (cy0-loc.y)/sc ]; }\n` +
    `  function clamp(v,lo,hi){ return v<lo?lo:(v>hi?hi:v); }\n` +
    // clip line u*x+v*y=w to the data box -> two endpoints, or null
    `  function clipLine(u,v,w){\n` +
    `    var pts=[];\n` +
    `    if(Math.abs(v)>1e-9){ [XMIN,XMAX].forEach(function(x){ var y=(w-u*x)/v; if(y>=YMIN-1e-9&&y<=YMAX+1e-9) pts.push([x,y]); }); }\n` +
    `    if(Math.abs(u)>1e-9){ [YMIN,YMAX].forEach(function(y){ var x=(w-v*y)/u; if(x>=XMIN-1e-9&&x<=XMAX+1e-9) pts.push([x,y]); }); }\n` +
    `    if(pts.length<2) return null;\n` +
    `    return [pts[0], pts[pts.length-1]];\n` +
    `  }\n` +
    `  function det3(){ var a=P[0],b=P[1],c=P[2]; return a[0]*(b[1]-c[1]) - a[1]*(b[0]-c[0]) + (b[0]*c[1]-b[1]*c[0]); }\n` +
    `  function fmt(x){ var r=Math.round(x*1000)/1000; if(Math.abs(r)<1e-9) r=0; return ''+r; }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    // axes
    `    svg.appendChild(mk('line',{x1:X(XMIN),y1:Y(0),x2:X(XMAX),y2:Y(0),stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:X(0),y1:Y(YMIN),x2:X(0),y2:Y(YMAX),stroke:'var(--line)','stroke-width':1}));\n` +
    // conic (unit circle)
    `    svg.appendChild(mk('circle',{cx:X(0),cy:Y(0),r:sc,fill:'none',stroke:'var(--violet)','stroke-width':1.5,'stroke-dasharray':'3 3'}));\n` +
    `    txt(X(0)+sc*0.71+4, Y(0)-sc*0.71, 'conic x\\u00b2+y\\u00b2=1', {size:9, fill:'var(--violet)'});\n` +
    // 0.04: visual tolerance on the shared determinant for reading "collinear/concurrent"
    `    var D=det3(), conc=Math.abs(D)<0.04;\n` +
    // polar lines
    // a point near the centre has |P| small, so its polar p_x x+p_y y=1 sits far off-screen
    // (near the line at infinity): clipLine returns null and we annotate instead of drawing nothing.
    `    for(var i=0;i<3;i++){ var seg=clipLine(P[i][0],P[i][1],1);\n` +
    `      if(seg) svg.appendChild(mk('line',{x1:X(seg[0][0]),y1:Y(seg[0][1]),x2:X(seg[1][0]),y2:Y(seg[1][1]),stroke:COL[i],'stroke-width':1.6,'stroke-opacity':0.85}));\n` +
    `      else txt(X(P[i][0])+10, Y(P[i][1])+16, 'polar near \\u221e', {size:8, fill:COL[i]}); }\n` +
    // common point (pole of line ABC) when concurrent
    `    if(conc){ var a=P[0],b=P[1]; var u=(b[1]-a[1]), v=(a[0]-b[0]), w=u*a[0]+v*a[1];\n` +
    `      if(Math.abs(w)>1e-6){ var px=u/w, py=v/w; if(px>XMIN&&px<XMAX&&py>YMIN&&py<YMAX){ svg.appendChild(mk('circle',{cx:X(px),cy:Y(py),r:6,fill:'none',stroke:'var(--green)','stroke-width':2})); txt(X(px)+9,Y(py)-6,'pole of line ABC',{size:9,fill:'var(--green)'}); } } }\n` +
    // points (draggable handles)
    `    for(i=0;i<3;i++){ (function(i){\n` +
    `      var h=mk('circle',{cx:X(P[i][0]),cy:Y(P[i][1]),r:7,fill:COL[i],stroke:'var(--bg)','stroke-width':1.5,style:'cursor:grab'});\n` +
    `      h.addEventListener('pointerdown', function(ev){ drag=i; try{ h.setPointerCapture(ev.pointerId); }catch(e){} ev.preventDefault(); });\n` +
    `      svg.appendChild(h);\n` +
    `      txt(X(P[i][0])+10, Y(P[i][1])+4, LBL[i], {size:13, fill:COL[i], weight:700});\n` +
    `    })(i); }\n` +
    // verdict
    `    txt(372, 40, 'shared determinant', {size:10, fill:'var(--mute)'});\n` +
    `    txt(372, 58, 'det[A;B;C; 1 1 1]', {size:9, fill:'var(--mute)'});\n` +
    `    txt(372, 76, '= '+fmt(D), {size:13, fill: conc?'var(--green)':'var(--ink)', weight:700});\n` +
    `    txt(372, 104, conc?'\\u2248 0:':'\\u2260 0:', {size:11, fill: conc?'var(--green)':'var(--mute)', weight:600});\n` +
    `    txt(372, 122, conc?'points COLLINEAR':'points in general', {size:10, fill: conc?'var(--green)':'var(--ink)'});\n` +
    `    txt(372, 138, conc?'polars CONCURRENT':'polars form a triangle', {size:10, fill: conc?'var(--green)':'var(--ink)'});\n` +
    `    txt(372, 172, 'point (p\\u2093,p\\u1d67)', {size:10, fill:'var(--mute)'});\n` +
    `    txt(372, 188, '\\u2194 line p\\u2093x+p\\u1d67y=1', {size:10, fill:'var(--mute)'});\n` +
    `    txt(372, 212, 'P on polar(Q)', {size:10, fill:'var(--cyan)'});\n` +
    `    txt(372, 228, '\\u21d4 Q on polar(P)', {size:10, fill:'var(--cyan)'});\n` +
    `    out.textContent = 'Projective duality swaps points and lines of P\\u00b2 while preserving incidence. Here it is realised concretely by the pole\\u2013polar map of the conic x\\u00b2+y\\u00b2=1: the point (p\\u2093,p\\u1d67) corresponds to the line p\\u2093x+p\\u1d67y=1, and the pairing p\\u2093X+p\\u1d67Y=1 is symmetric, so P lies on the polar of Q exactly when Q lies on the polar of P. The 3\\u00d73 determinant det[[A\\u2093,A\\u1d67,1],[B\\u2093,B\\u1d67,1],[C\\u2093,C\\u1d67,1]] = '+fmt(D)+' detects collinearity of A,B,C; the very same determinant detects concurrency of the three polar lines \\u2014 so collinear points \\u21d4 concurrent lines, exactly. Drag a point onto the line through the other two (or press \\u201cmake collinear\\u201d) and watch the three polars meet at one point: the pole of line ABC. This collinear\\u2194concurrent swap is the prototype of every dual theorem \\u2014 e.g. Pascal (six points on a conic \\u21d2 three collinear) dualises to Brianchon (six tangents \\u21d2 three concurrent).';\n` +
    `  }\n` +
    `  var drag=-1;\n` +
    `  svg.addEventListener('pointermove', function(ev){ if(drag<0) return; var d=dataFromEvent(ev); if(!d) return; P[drag]=[clamp(d[0],XMIN+0.05,XMAX-0.05), clamp(d[1],YMIN+0.05,YMAX-0.05)]; draw(); });\n` +
    `  function endDrag(){ drag=-1; }\n` +
    `  svg.addEventListener('pointerup', endDrag); svg.addEventListener('pointercancel', endDrag); svg.addEventListener('pointerleave', endDrag);\n` +
    // place C exactly on line AB; shrink the parameter t (NOT clamp x/y independently,
    // which would knock C off the line near the viewport edge) until C is inside the box.
    `  if(bColl) bColl.addEventListener('click', function(){ var a=P[0],b=P[1], dx=b[0]-a[0], dy=b[1]-a[1];\n` +
    `    function inBox(t){ var x=a[0]+t*dx, y=a[1]+t*dy; return x>=XMIN+0.05&&x<=XMAX-0.05&&y>=YMIN+0.05&&y<=YMAX-0.05; }\n` +
    `    var t=1.55; while(t>0.55 && !inBox(t)) t-=0.05;\n` +
    `    P[2]=[a[0]+t*dx, a[1]+t*dy]; draw(); });\n` +
    `  if(bReset) bReset.addEventListener('click', function(){ P=DEF.map(function(p){ return p.slice(); }); draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
