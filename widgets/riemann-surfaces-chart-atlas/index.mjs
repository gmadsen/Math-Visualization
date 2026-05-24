// riemann-surfaces-chart-atlas widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The two-chart holomorphic atlas of the Riemann
// sphere CP^1: U0 (coordinate z) and U-infinity (coordinate w = 1/z), glued on
// the overlap C* by the biholomorphic transition w = 1/z.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-r">modulus $|z|$</label>\n` +
    `    <input type="range" id="${widgetId}-r" min="0" max="100" value="62" step="1">\n` +
    `    <span class="pill" id="${widgetId}-rv">|z| = …</span>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-th">argument $\\arg z$</label>\n` +
    `    <input type="range" id="${widgetId}-th" min="-180" max="180" value="40" step="1">\n` +
    `    <span class="pill" id="${widgetId}-thv">arg z = …</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="Two coordinate planes for the Riemann sphere: a point shown at z in chart U0 and at w = 1/z in chart U-infinity, related by the transition map"><title>Two-chart atlas of the Riemann sphere CP^1: the same point appears at z in chart U0 and at w = 1/z in chart U-infinity; the transition map w = 1/z is biholomorphic on the overlap</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* riemann-surfaces-chart-atlas widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sr=document.getElementById('${widgetId}-r'), sth=document.getElementById('${widgetId}-th');\n` +
    `  var rv=document.getElementById('${widgetId}-rv'), thv=document.getElementById('${widgetId}-thv');\n` +
    `  if(!svg||!out||!sr||!sth||!rv||!thv) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var RMIN=0.2, RMAX=5, DMAX=5.2, PR=84, CY=152, L=150, R=410;\n` +
    `  var SC=PR/DMAX;\n` +
    `  function fmtC(re,im){ var a=Math.abs(re)<0.005?0:re, b=Math.abs(im)<0.005?0:im;\n` +
    `    if(a===0&&b===0) return '0';\n` +
    `    if(b===0) return a.toFixed(2);\n` +
    `    if(a===0) return (b===1?'i':b===-1?'\\u2212i':(b<0?'\\u2212'+Math.abs(b).toFixed(2):b.toFixed(2))+'i');\n` +
    `    return a.toFixed(2)+(b<0?' \\u2212 ':' + ')+Math.abs(b).toFixed(2)+'i'; }\n` +
    `  function plane(cx,label,sub){\n` +
    `    svg.appendChild(mk('line',{x1:cx-PR,y1:CY,x2:cx+PR,y2:CY,stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:cx,y1:CY-PR,x2:cx,y2:CY+PR,stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('circle',{cx:cx,cy:CY,r:SC,fill:'none',stroke:'var(--mute)','stroke-width':1,'stroke-dasharray':'3 3'}));\n` +
    `    svg.appendChild(mk('circle',{cx:cx,cy:CY,r:3,fill:'none',stroke:'var(--mute)','stroke-width':1.2}));\n` +
    `    txt(cx, CY-PR-22, label, {anchor:'middle', size:12, weight:700, fill:'var(--violet)'});\n` +
    `    txt(cx, CY-PR-9, sub, {anchor:'middle', size:9, fill:'var(--mute)'});\n` +
    `    txt(cx+PR+2, CY-3, 'Re', {size:8, fill:'var(--mute)'});\n` +
    `    txt(cx+4, CY-PR+10, 'Im', {size:8, fill:'var(--mute)'});\n` +
    `  }\n` +
    `  function plotPt(cx,re,im,col,lab){\n` +
    `    var inBox=Math.abs(re)<=DMAX&&Math.abs(im)<=DMAX;\n` +
    `    if(inBox){ var px=cx+re*SC, py=CY-im*SC;\n` +
    `      svg.appendChild(mk('line',{x1:cx,y1:CY,x2:px,y2:py,stroke:col,'stroke-width':1.4,'stroke-opacity':0.7}));\n` +
    `      svg.appendChild(mk('circle',{cx:px,cy:py,r:5,fill:col}));\n` +
    `      txt(px+8, py+4, lab, {size:12, fill:col, weight:700}); }\n` +
    `    else { var ang=Math.atan2(im,re), ex=cx+Math.cos(ang)*PR, ey=CY-Math.sin(ang)*PR;\n` +
    `      svg.appendChild(mk('path',{d:'M '+(ex-6)+' '+(ey)+' L '+ex+' '+(ey-7)+' L '+(ex+6)+' '+(ey)+' Z', fill:col}));\n` +
    `      txt(cx, CY+PR+16, lab+' off-window (near \\u221e)', {anchor:'middle', size:9, fill:col}); }\n` +
    `  }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var s=parseInt(sr.value,10), r=RMIN*Math.pow(RMAX/RMIN, s/100);\n` +
    `    var thDeg=parseInt(sth.value,10), th=thDeg*Math.PI/180;\n` +
    `    rv.textContent='|z| = '+r.toFixed(2); thv.textContent='arg z = '+thDeg+'\\u00b0';\n` +
    `    var zre=r*Math.cos(th), zim=r*Math.sin(th);\n` +
    `    var wr=1/r, wre=wr*Math.cos(-th), wim=wr*Math.sin(-th);\n` +
    `    plane(L, 'chart U\\u2080  (coord z)', 'C, missing \\u221e (north pole)');\n` +
    `    plane(R, 'chart U\\u221e  (coord w = 1/z)', 'C, missing 0 (south pole)');\n` +
    `    plotPt(L, zre, zim, 'var(--cyan)', 'z');\n` +
    `    plotPt(R, wre, wim, 'var(--yellow)', 'w');\n` +
    `    // transition arrow in the gap between the planes\n` +
    `    var defs=mk('defs',{}); var m=mk('marker',{id:'${widgetId}-ar', viewBox:'0 0 10 10', refX:8, refY:5, markerWidth:6, markerHeight:6, orient:'auto'}); m.appendChild(mk('path',{d:'M0 0 L10 5 L0 10 z', fill:'var(--green)'})); defs.appendChild(m); svg.appendChild(defs);\n` +
    `    var gx0=L+PR+6, gx1=R-PR-6, gm=(gx0+gx1)/2;\n` +
    `    svg.appendChild(mk('line',{x1:gx0,y1:CY,x2:gx1,y2:CY,stroke:'var(--green)','stroke-width':1.4,'marker-end':'url(#${widgetId}-ar)'}));\n` +
    `    txt(gm, CY-7, '\\u03c6: w = 1/z', {anchor:'middle', size:11, fill:'var(--green)', weight:700});\n` +
    `    txt(gm, CY+14, 'overlap', {anchor:'middle', size:8, fill:'var(--mute)'});\n` +
    `    txt(gm, CY+24, 'U\\u2080 \\u2229 U\\u221e = C*', {anchor:'middle', size:8, fill:'var(--mute)'});\n` +
    `    var dwdz=1/(r*r);\n` +
    `    out.textContent='A Riemann surface is a Hausdorff space with an atlas of charts \\u03c6\\u03b1: U\\u03b1 \\u2192 C whose transition maps are biholomorphic. The Riemann sphere CP\\u00b9 = C \\u222a {\\u221e} is the genus-0 model, covered by just two charts: U\\u2080 with coordinate z (all but the north pole \\u221e) and U\\u221e with coordinate w = 1/z (all but the south pole 0). On the overlap U\\u2080 \\u2229 U\\u221e = C* the transition is \\u03c6\\u221e \\u2218 \\u03c6\\u2080\\u207b\\u00b9(z) = 1/z. Here z = '+fmtC(zre,zim)+'  (|z| = '+r.toFixed(2)+', arg z = '+thDeg+'\\u00b0), so w = 1/z = '+fmtC(wre,wim)+'  (|w| = '+wr.toFixed(2)+', arg w = '+(-thDeg)+'\\u00b0). The inversion satisfies |z|\\u00b7|w| = '+(r*wr).toFixed(2)+' = 1 and arg z + arg w = 0\\u00b0. The transition is BIHOLOMORPHIC: dw/dz = \\u22121/z\\u00b2 is holomorphic and nonzero on C* (here |dw/dz| = 1/|z|\\u00b2 = '+dwdz.toFixed(3)+'), with holomorphic inverse z = 1/w. A biholomorphism of plane domains is in particular orientation-preserving, so the two charts glue into a canonically oriented real 2-manifold. The two poles each live in exactly ONE chart: z = 0 (south pole) only in U\\u2080, and w = 0, i.e. z = \\u221e (north pole), only in U\\u221e \\u2014 neither is in the overlap.';\n` +
    `  }\n` +
    `  sr.addEventListener('input', draw); sth.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
