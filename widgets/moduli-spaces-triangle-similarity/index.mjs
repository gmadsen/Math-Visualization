// moduli-spaces-triangle-similarity widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A warm-up moduli space: labeled triangles up to
// orientation-preserving similarity, parametrized by tau = (C-A)/(B-A). The
// rotation slider applies a similarity to the picture without moving tau; the
// shape sliders move the moduli point. A fine moduli space, in bijection with
// C minus R (parallels the j-line).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-re">shape  Re&#8201;&#964;</label>\n` +
    `    <input type="range" id="${widgetId}-re" min="-1.5" max="2.5" value="0.5" step="0.1">\n` +
    `    <label for="${widgetId}-im">Im&#8201;&#964; &gt; 0</label>\n` +
    `    <input type="range" id="${widgetId}-im" min="0.2" max="2.8" value="1.4" step="0.1">\n` +
    `    <label for="${widgetId}-th">rotate &#952;</label>\n` +
    `    <input type="range" id="${widgetId}-th" min="0" max="350" value="0" step="10">\n` +
    `    <span class="pill" id="${widgetId}-tv">&#964; = &#8230;</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="A labeled triangle and its shape parameter tau plotted in the moduli space of triangles up to similarity"><title>Left: a labeled triangle A B C, rotatable by a similarity. Right: the moduli space (C minus R) with the shape parameter tau = (C-A)/(B-A) plotted. Rotating the triangle leaves tau fixed; changing the shape moves tau. Triangles up to similarity are in bijection with C minus R, a fine moduli space paralleling the j-line of elliptic curves.</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* moduli-spaces-triangle-similarity widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sre=document.getElementById('${widgetId}-re'), sim=document.getElementById('${widgetId}-im'), sth=document.getElementById('${widgetId}-th'), tv=document.getElementById('${widgetId}-tv');\n` +
    `  if(!svg||!out||!sre||!sim||!sth||!tv) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  function cdiv(x,y){ var d=y[0]*y[0]+y[1]*y[1]; return [(x[0]*y[0]+x[1]*y[1])/d,(x[1]*y[0]-x[0]*y[1])/d]; }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var re=parseFloat(sre.value), im=parseFloat(sim.value), th=parseFloat(sth.value)*Math.PI/180;\n` +
    `    if(!isFinite(re))re=0.5; if(!isFinite(im)||im<0.1)im=0.9; if(!isFinite(th))th=0;\n` +
    `    // math coords: A=0, B=1, C=(re,im); rotate all about centroid by th\n` +
    `    var A=[0,0], B=[1,0], C=[re,im];\n` +
    `    var G=[(A[0]+B[0]+C[0])/3,(A[1]+B[1]+C[1])/3];\n` +
    `    function rot(P){ var dx=P[0]-G[0], dy=P[1]-G[1]; return [G[0]+dx*Math.cos(th)-dy*Math.sin(th), G[1]+dx*Math.sin(th)+dy*Math.cos(th)]; }\n` +
    `    var Ar=rot(A), Br=rot(B), Cr=rot(C);\n` +
    `    var tau=cdiv([Cr[0]-Ar[0],Cr[1]-Ar[1]],[Br[0]-Ar[0],Br[1]-Ar[1]]); // = (re,im), invariant under rot\n` +
    `    tv.textContent='\\u03c4 = '+tau[0].toFixed(2)+(tau[1]>=0?' + ':' \\u2212 ')+Math.abs(tau[1]).toFixed(2)+'i';\n` +
    `    sth.setAttribute('aria-valuetext', (th*180/Math.PI).toFixed(0)+'\\u00b0');\n` +
    `    // ===== LEFT: the triangle (fit to panel) =====\n` +
    `    txt(20, 24, 'a labeled triangle  (drag the shape; \\u03b8 = a similarity)', {size:11, fill:'var(--mute)'});\n` +
    `    var P=[Ar,Br,Cr], xs=P.map(function(p){return p[0];}), ys=P.map(function(p){return p[1];});\n` +
    `    var minx=Math.min.apply(null,xs), maxx=Math.max.apply(null,xs), miny=Math.min.apply(null,ys), maxy=Math.max.apply(null,ys);\n` +
    `    var w=(maxx-minx)||1, h=(maxy-miny)||1, s=Math.min(170/w, 150/h), pcx=140, pcy=180, gx=(minx+maxx)/2, gy=(miny+maxy)/2;\n` +
    `    function scr(p){ return [pcx+s*(p[0]-gx), pcy-s*(p[1]-gy)]; }\n` +
    `    var SA=scr(Ar), SB=scr(Br), SC=scr(Cr);\n` +
    `    svg.appendChild(mk('polygon',{points:SA[0]+','+SA[1]+' '+SB[0]+','+SB[1]+' '+SC[0]+','+SC[1],fill:'var(--cyan)','fill-opacity':0.14,stroke:'var(--cyan)','stroke-width':2}));\n` +
    `    [['A',SA],['B',SB],['C',SC]].forEach(function(pr){ svg.appendChild(mk('circle',{cx:pr[1][0],cy:pr[1][1],r:4,fill:'var(--cyan)'})); txt(pr[1][0]+6, pr[1][1]-6, pr[0], {size:11, fill:'var(--cyan)', weight:700}); });\n` +
    `    // ===== RIGHT: moduli space C\\\\R =====\n` +
    `    var qx0=310, qx1=545, qy0=70, qy1=292, reMin=-2, reMax=3, imMax=3.2;\n` +
    `    function mscr(t){ return [qx0+(t[0]-reMin)/(reMax-reMin)*(qx1-qx0), qy1 - t[1]/imMax*(qy1-qy0)]; }\n` +
    `    // shaded forbidden real axis (degenerate triangles)\n` +
    `    svg.appendChild(mk('line',{x1:qx0,y1:qy1,x2:qx1,y2:qy1,stroke:'var(--pink)','stroke-width':2,'stroke-opacity':0.5}));\n` +
    `    txt(qx0, qy1+14, 'Im \\u03c4 = 0: degenerate (collinear) \\u2014 excluded', {size:8.5, fill:'var(--pink)'});\n` +
    `    // Im axis (re=0)\n` +
    `    var zx=mscr([0,0])[0]; svg.appendChild(mk('line',{x1:zx,y1:qy0,x2:zx,y2:qy1,stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt(qx0+2, qy0+2, 'moduli space  {triangles}/similarity  \\u2245  \\u2102 \\u2216 \\u211d', {size:10, fill:'var(--mute)'});\n` +
    `    // equilateral special point\n` +
    `    var eq=mscr([0.5,Math.sqrt(3)/2]); svg.appendChild(mk('circle',{cx:eq[0],cy:eq[1],r:3.5,fill:'none',stroke:'var(--yellow)','stroke-width':1.4})); txt(eq[0]+6, eq[1]+3, 'equilateral', {size:8.5, fill:'var(--yellow)'});\n` +
    `    // tau dot\n` +
    `    var D=mscr([Math.max(reMin,Math.min(reMax,tau[0])), Math.max(0,Math.min(imMax,tau[1]))]);\n` +
    `    svg.appendChild(mk('circle',{cx:D[0],cy:D[1],r:6,fill:'var(--green)',stroke:'var(--ink)','stroke-width':1.2}));\n` +
    `    txt(D[0]+9, D[1]+4, '\\u03c4', {size:12, fill:'var(--green)', weight:700});\n` +
    `    out.textContent='A MODULI PROBLEM turns the usual logic around: instead of starting with a space and asking for its points, you start with a class of objects and try to build a space whose POINTS ARE THE OBJECTS up to isomorphism. Warm-up (no algebraic geometry needed): the objects are labeled triangles with ordered vertices A, B, C, and \\u201cisomorphism\\u201d is orientation-preserving SIMILARITY (translation + rotation + scaling, the complex maps z \\u21a6 \\u03b1z + \\u03b2 with \\u03b1 \\u2260 0). Every such triangle is captured by ONE complex number, the SHAPE PARAMETER \\u03c4 = (C \\u2212 A)/(B \\u2212 A) (normalizing A = 0, B = 1 makes \\u03c4 = C). The rotation slider \\u03b8 applies a similarity to the drawn triangle \\u2014 the picture turns, but \\u03c4 does NOT move, because \\u03c4 is invariant under z \\u21a6 \\u03b1z + \\u03b2: SIMILAR TRIANGLES ARE THE SAME POINT of the moduli space. The shape sliders, by contrast, move \\u03c4 to a genuinely different similarity class. Non-degenerate triangles have \\u03c4 \\u2209 \\u211d (collinear = excluded), so the moduli space is exactly \\u2102 \\u2216 \\u211d; the equilateral triangle sits at \\u03c4 = e^{i\\u03c0/3} = (0.5, 0.866). Because labeled oriented triangles have no non-trivial automorphisms, this is a FINE moduli space: it carries a universal family, and a continuously varying FAMILY of triangles over a base B is literally a MAP B \\u2192 (\\u2102 \\u2216 \\u211d). This is the same shape as the page\\u2019s main example \\u2014 the j-invariant gives a bijection {elliptic curves}/\\u2245 \\u2245 \\u2102 \\u2014 only there the objects are curves and \\u201cspace\\u201d must be sharpened to a scheme (and, when automorphisms intrude, to a stack).';\n` +
    `  }\n` +
    `  sre.addEventListener('input', draw); sim.addEventListener('input', draw); sth.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
