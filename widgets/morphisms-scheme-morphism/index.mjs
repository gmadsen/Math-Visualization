// morphisms-scheme-morphism widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A scheme morphism f: A^1 -> A^1, y = f(x),
// from a ring map k[y] -> k[x]; the local-on-stalks condition is shown by
// pulling back a function vanishing at b = f(a) to one vanishing at a.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-a">source point $a \\in X = \\mathbb{A}^1$</label>\n` +
    `    <input type="range" id="${widgetId}-a" min="-220" max="220" value="130" step="1">\n` +
    `    <span class="pill" id="${widgetId}-av">a = …</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="The map f(x)=x^2-1 from the affine line to itself, with a point a mapping to b=f(a) and the fiber over b"><title>A scheme morphism A^1 -> A^1, y=f(x): a point a maps to b=f(a), and a function vanishing at b pulls back to one vanishing at a (the local-on-stalks condition)</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* morphisms-scheme-morphism widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sa=document.getElementById('${widgetId}-a'), av=document.getElementById('${widgetId}-av');\n` +
    `  if(!svg||!out||!sa||!av) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  function f(x){ return x*x-1; }\n` +  // the map y = f(x) = x^2 - 1
    `  var XL=-2.5, XR=2.5, YB=-1.6, YT=5.5, PX0=92, PX1=470, PTOP=40, PBOT=250;\n` +
    `  function PX(x){ return PX0+(x-XL)/(XR-XL)*(PX1-PX0); }\n` +
    `  function PY(y){ return PBOT-(y-YB)/(YT-YB)*(PBOT-PTOP); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var a=parseInt(sa.value,10)/100; var b=f(a); av.textContent='a = '+a.toFixed(2)+'  \\u21a6  b = f(a) = '+b.toFixed(2);\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:PY(0),x2:PX1,y2:PY(0),stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:PX(0),y1:PTOP,x2:PX(0),y2:PBOT,stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt(PX1-2, PY(0)-4, 'X = A\\u00b9 (coord x)', {anchor:'end', size:9, fill:'var(--mute)'});\n` +
    `    txt(PX(0)+4, PTOP+8, 'Y = A\\u00b9 (coord y)', {size:9, fill:'var(--mute)'});\n` +
    `    // parabola y = f(x)\n` +
    `    var d=''; for(var i=0;i<=120;i++){ var x=XL+(XR-XL)*i/120; d+=(i?'L ':'M ')+PX(x).toFixed(1)+' '+PY(f(x)).toFixed(1)+' '; } svg.appendChild(mk('path',{d:d,fill:'none',stroke:'var(--cyan)','stroke-width':2}));\n` +
    `    txt(PX(XR)-6, PY(f(XR-0.05))-6, 'y = x\\u00b2\\u22121', {anchor:'end', size:9, fill:'var(--cyan)'});\n` +
    `    // fiber over b: horizontal line y=b, preimages x=\\u00b1\\u221a(b+1)\n` +
    `    var r=Math.sqrt(b+1);\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:PY(b),x2:PX1,y2:PY(b),stroke:'var(--yellow)','stroke-width':1,'stroke-dasharray':'4 3'}));\n` +
    `    txt(PX0+2, PY(b)-3, 'g = y\\u2212b vanishes here (y=b)', {size:8, fill:'var(--yellow)'});\n` +
    `    // map arrows: a on x-axis -> up to parabola -> across to b on y-axis\n` +
    `    svg.appendChild(mk('line',{x1:PX(a),y1:PY(0),x2:PX(a),y2:PY(b),stroke:'var(--green)','stroke-width':1.2,'stroke-dasharray':'2 2'}));\n` +
    `    svg.appendChild(mk('line',{x1:PX(a),y1:PY(b),x2:PX(0),y2:PY(b),stroke:'var(--green)','stroke-width':1.2,'stroke-dasharray':'2 2'}));\n` +
    `    // fiber points on x-axis (preimages)\n` +
    `    [r,-r].forEach(function(xr){ svg.appendChild(mk('circle',{cx:PX(xr),cy:PY(0),r:3.5,fill: Math.abs(xr-a)<1e-6?'var(--pink)':'var(--mute)'})); });\n` +
    `    svg.appendChild(mk('circle',{cx:PX(a),cy:PY(0),r:4.5,fill:'var(--pink)'})); txt(PX(a), PY(0)+15, 'a', {anchor:'middle', size:10, fill:'var(--pink)', weight:700});\n` +
    `    svg.appendChild(mk('circle',{cx:PX(0),cy:PY(b),r:4,fill:'var(--yellow)'})); txt(PX(0)-8, PY(b)+3, 'b', {anchor:'end', size:10, fill:'var(--yellow)', weight:700});\n` +
    `    txt(PX(-r), PY(0)+15, 'f\\u207b\\u00b9(b) = {\\u00b1\\u221a(b+1)}', {anchor:'middle', size:8, fill:'var(--mute)'});\n` +
    `    var fpg=f(a)-b;\n` +  // (f#g)(a) = f(a) - b = 0
    `    out.textContent='A morphism of schemes f: X \\u2192 Y is more than a continuous map of spaces: it is a continuous map |X| \\u2192 |Y| TOGETHER with a map of structure sheaves f\\u0023: O_Y \\u2192 f_*O_X \\u2014 \\u201cpull back regular functions\\u201d \\u2014 subject to a LOCAL condition on stalks. Here X = Y = A\\u00b9 and f is the ring map \\u03c6: k[y] \\u2192 k[x], y \\u21a6 x\\u00b2\\u22121, so on points x = a \\u21a6 y = f(a) = a\\u00b2\\u22121 (the parabola); the fiber over b is f\\u207b\\u00b9(b) = {\\u00b1\\u221a(b+1)}. Pull back a regular function g(y) by composing: f\\u0023(g) = g \\u2218 f = g(x\\u00b2\\u22121). THE LOCAL CONDITION: for x = a with image b = f(a), the stalk map f\\u0023\\u2093: O_{Y,b} \\u2192 O_{X,a} must be a LOCAL ring homomorphism \\u2014 it must send the maximal ideal m_b into m_a, i.e. a function VANISHING at b must pull back to one VANISHING at a. Take g(y) = y \\u2212 b (the dashed line; g(b)=0, so g \\u2208 m_b). Its pullback is f\\u0023(g) = f(x) \\u2212 b = x\\u00b2 \\u2212 1 \\u2212 b, which vanishes exactly on the fiber {\\u00b1\\u221a(b+1)} \\u2014 in particular at a: (f\\u0023g)(a) = f(a) \\u2212 b = '+b.toFixed(2)+' \\u2212 '+b.toFixed(2)+' = '+fpg.toFixed(2)+' = 0. \\u2713 So m_b \\u2192 m_a, the map is local. (Here this is AUTOMATIC because f\\u0023 is honest composition with f, so it is a genuine scheme morphism; locality is a real, FALSIFIABLE condition only when the point-map and the sheaf-map are chosen independently \\u2014 e.g. a ringed-space map sending a generic point to a closed point with a non-local structure map is NOT a morphism of schemes.) This local-on-stalks condition is exactly what upgrades a morphism of ringed spaces to a morphism of LOCALLY ringed spaces; on affine schemes it makes Hom(Spec A, Spec B) = Hom_{ring}(B, A) (the contravariant Spec anti-equivalence).';\n` +
    `  }\n` +
    `  sa.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
