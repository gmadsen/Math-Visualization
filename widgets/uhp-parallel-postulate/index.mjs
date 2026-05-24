// uhp-parallel-postulate widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Failure of the parallel postulate in the upper
// half-plane H: through a point P off a hyperbolic line L there are infinitely
// many geodesics that never meet L (the wedge between two limiting parallels).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-th">rotate the line through $P$</label>\n` +
    `    <input type="range" id="${widgetId}-th" min="6" max="174" value="90" step="2">\n` +
    `    <span class="pill" id="${widgetId}-thv">θ = 90°</span>\n` +
    `    <button type="button" id="${widgetId}-fan" aria-pressed="true">fan: on</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="The upper half-plane with a hyperbolic line and a fan of geodesics through a point, coloured by whether they meet the line"><title>In ℍ, infinitely many hyperbolic lines through a point P miss a given line ℓ — the wedge between the two limiting parallels — so the parallel postulate fails</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* uhp-parallel-postulate widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sth=document.getElementById('${widgetId}-th'), thv=document.getElementById('${widgetId}-thv'), fanBtn=document.getElementById('${widgetId}-fan');\n` +
    `  if(!svg||!out||!sth||!fanBtn) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    // domain: x in [-4,4], y in [0,3.2]; real axis at the bottom
    `  var XMIN=-4, XMAX=4, YMAX=3.2, PX0=40, PX1=520, AX=258, TOP=30;\n` +
    `  function X(x){ return PX0+(x-XMIN)/(XMAX-XMIN)*(PX1-PX0); }\n` +
    `  function Y(y){ return AX-(y/YMAX)*(AX-TOP); }\n` +
    // the given hyperbolic line L: semicircle centre 1 radius 1 (feet 0 and 2)
    `  var LC=1, LR=1, LA=LC-LR, LB=LC+LR;\n` +
    `  var Px=-1, Py=2.5;\n` +
    `  var showFan=true;\n` +
    `  function inside(x){ return x>LA+1e-9 && x<LB-1e-9; }\n` +
    // geodesic through P with tangent angle th(rad): centre c on axis, radius r
    `  function geoTheta(th){ var c=Px+Py*Math.tan(th), r=Py/Math.abs(Math.cos(th)); return {c:c, r:r, e1:c-r, e2:c+r}; }\n` +
    // geodesic through P and a foot t on the axis (used for the two limiting parallels)
    `  function geoFoot(t){ var c=(Px*Px+Py*Py-t*t)/(2*(Px-t)), r=Math.abs(c-t); return {c:c, r:r, e1:c-r, e2:c+r}; }\n` +
    `  function crosses(g){ return inside(g.e1)!==inside(g.e2); }\n` +
    `  function arcPath(g){\n` +
    `    if(g.r>14 || !isFinite(g.r) || !isFinite(g.c)){ return 'M '+X(Px)+' '+Y(0)+' L '+X(Px)+' '+Y(YMAX); }\n` + // near-vertical ray
    `    var d='', first=true; for(var k=0;k<=48;k++){ var a=Math.PI*k/48; var x=g.c+g.r*Math.cos(a), y=g.r*Math.sin(a); if(y>YMAX+0.5) { first=true; continue; } d+=(first?'M ':'L ')+X(x)+' '+Y(y)+' '; first=false; } return d;\n` +
    `  }\n` +
    `  function drawGeo(g, col, w, dash){ var p=mk('path',{d:arcPath(g), fill:'none', stroke:col, 'stroke-width':w}); if(dash) p.setAttribute('stroke-dasharray', dash); svg.appendChild(p); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var th=parseInt(sth.value,10); thv.textContent='θ = '+th+'\\u00b0';\n` +
    `    fanBtn.textContent='fan: '+(showFan?'on':'off'); fanBtn.setAttribute('aria-pressed', showFan?'true':'false');\n` +
    // shaded H + real axis
    `    svg.appendChild(mk('rect',{x:PX0,y:TOP,width:PX1-PX0,height:AX-TOP,fill:'var(--panel2)','fill-opacity':0.25}));\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:Y(0),x2:PX1,y2:Y(0),stroke:'var(--line)','stroke-width':2}));\n` +
    `    txt(PX1-4, Y(0)+16, 'real axis  (boundary of \\u210d, at infinity)', {size:9, fill:'var(--mute)', anchor:'end'});\n` +
    `    txt(PX0+4, TOP+12, '\\u210d = { x+iy : y>0 },  curvature \\u22121', {size:10, fill:'var(--mute)'});\n` +
    // fan of geodesics through P
    `    var nPar=0, nCross=0;\n` +
    `    if(showFan){ for(var d=8; d<=172; d+=8){ var g=geoTheta(d*Math.PI/180); var cr=crosses(g); if(cr) nCross++; else nPar++; drawGeo(g, cr?'var(--green)':'var(--pink)', 1, null); } }\n` +
    // the two limiting parallels (through L's ideal endpoints) -- asymptotic, never meet L
    `    drawGeo(geoFoot(LA), 'var(--yellow)', 1.8, '5 3'); drawGeo(geoFoot(LB), 'var(--yellow)', 1.8, '5 3');\n` +
    // the given line L
    `    drawGeo({c:LC, r:LR, e1:LA, e2:LB}, 'var(--cyan)', 2.6, null);\n` +
    `    txt(X(LC), Y(0)-4, '\\u2113', {size:13, fill:'var(--cyan)', weight:700, anchor:'middle'});\n` +
    // ideal endpoints of L
    `    svg.appendChild(mk('circle',{cx:X(LA),cy:Y(0),r:3,fill:'var(--cyan)'})); svg.appendChild(mk('circle',{cx:X(LB),cy:Y(0),r:3,fill:'var(--cyan)'}));\n` +
    // the test line (slider)
    `    var gt=geoTheta(th*Math.PI/180), tcr=crosses(gt);\n` +
    `    drawGeo(gt, tcr?'var(--green)':'var(--pink)', 3, null);\n` +
    // point P
    `    svg.appendChild(mk('circle',{cx:X(Px),cy:Y(Py),r:5,fill:'var(--violet)',stroke:'var(--bg)','stroke-width':1.5}));\n` +
    `    txt(X(Px)-10, Y(Py)-6, 'P', {size:13, fill:'var(--violet)', weight:700, anchor:'end'});\n` +
    // legend / verdict
    `    txt(PX0+4, AX+34, (tcr?'this line MEETS \\u2113 (green)':'this line MISSES \\u2113 \\u2014 parallel (pink)'), {size:11, fill: tcr?'var(--green)':'var(--pink)', weight:600});\n` +
    `    if(showFan) txt(PX1-4, AX+34, 'fan: '+nPar+' miss, '+nCross+' meet \\u2113  (yellow = the 2 limiting parallels)', {size:9, fill:'var(--mute)', anchor:'end'});\n` +
    `    out.textContent = 'The test line through P (\\u03b8 = '+th+'\\u00b0) currently '+(tcr?'MEETS':'MISSES')+' \\u2113. The upper half-plane \\u210d = { x+iy : y>0 } carries the hyperbolic metric of constant curvature \\u22121. Its straight lines (geodesics) are the semicircles meeting the real axis at right angles, together with vertical rays. Here \\u2113 (cyan) is one such line and P (violet) is a point not on it. Rotate the test line through P with the slider: it either MEETS \\u2113 (green) or MISSES it (pink). The two dashed yellow geodesics are the LIMITING PARALLELS \\u2014 they run into \\u2113\\u2019s ideal endpoints on the real axis (the boundary at infinity) without ever meeting \\u2113 in \\u210d. Every line through P whose direction lies in the wedge BETWEEN the two limiting parallels misses \\u2113, so there are INFINITELY MANY lines through P parallel to \\u2113. Euclid\\u2019s parallel postulate \\u2014 a unique parallel through P \\u2014 fails: this is Lobachevsky\\u2019s non-Euclidean plane, and the SL\\u2082(\\u2124) action on \\u210d makes it the stage for modular forms.';\n` +
    `  }\n` +
    `  sth.addEventListener('input', draw);\n` +
    `  fanBtn.addEventListener('click', function(){ showFan=!showFan; draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
