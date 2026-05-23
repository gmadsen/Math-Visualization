// homological-cartan-eilenberg widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Structural diagram of a Cartan–Eilenberg resolution:
// a cochain complex C^• resolved by a double complex P^{•,•} of projectives.
// Three mode tabs reveal the three defining conditions in layers.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <button type="button" id="${widgetId}-m1">1 · the complex $C^\\bullet$</button>\n` +
    `    <button type="button" id="${widgetId}-m2">2 · resolve each column</button>\n` +
    `    <button type="button" id="${widgetId}-m3">3 · resolve $Z,B,H$</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 300" width="540" height="300" role="img" aria-label="A Cartan–Eilenberg resolution: a complex resolved by a double complex of projectives"><title>Cartan–Eilenberg resolution: a double complex of projectives resolving a complex</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* homological-cartan-eilenberg widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=[document.getElementById('${widgetId}-m1'), document.getElementById('${widgetId}-m2'), document.getElementById('${widgetId}-m3')];\n` +
    `  if(!svg || !out || btns.some(function(b){ return !b; })) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function box(cx, cy, label, stroke, fill, tcol){ var w=92, h=30;\n` +
    `    svg.appendChild(mk('rect', {x:cx-w/2, y:cy-h/2, width:w, height:h, rx:5, fill:fill, stroke:stroke, 'stroke-width':1.4}));\n` +
    `    svg.appendChild(mk('text', {x:cx, y:cy+4, 'text-anchor':'middle', 'font-size':12, fill:tcol}, label)); }\n` +
    `  function arr(x1,y1,x2,y2,col,dashed,head){ var L=Math.hypot(x2-x1,y2-y1), ux=(x2-x1)/L, uy=(y2-y1)/L;\n` +
    `    var a={x1:x1, y1:y1, x2:x2, y2:y2, stroke:col, 'stroke-width':1.4}; if(dashed) a['stroke-dasharray']='4 3'; svg.appendChild(mk('line', a));\n` +
    `    if(head!==false){ var ex=x2, ey=y2; svg.appendChild(mk('path', {d:'M'+ex+' '+ey+' L'+(ex-7*ux+3*uy)+' '+(ey-7*uy-3*ux)+' L'+(ex-7*ux-3*uy)+' '+(ey-7*uy+3*ux)+' Z', fill:col})); } }\n` +
    `  function lab(x,y,s,col,sz,anch){ svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':anch||'middle', 'font-size':sz||10, fill:col||'var(--mute)'}, s)); }\n` +
    `  var CX=[140,290,440];      // columns p = 0,1,2\n` +
    `  var yC=262, yP0=192, yP1=122, yDots=72;\n` +
    `  var mode=1;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var pOn=(mode>=2), pHi=(mode===3);\n` +
    `    // axis hints\n` +
    `    lab(20, yC+4, 'C\\u2022', 'var(--mute)', 11, 'start');\n` +
    `    if(pOn) lab(20, (yP0+yP1)/2, 'P\\u2022,\\u2022', pHi?'var(--cyan)':'var(--mute)', 11, 'start');\n` +
    `    // the projective double complex P^{p,q} (modes 2,3)\n` +
    `    if(pOn){\n` +
    `      var pStroke=pHi?'var(--cyan)':'var(--line)';\n` +
    `      var pFill=pHi?'color-mix(in srgb, var(--cyan) 16%, transparent)':'var(--panel2)';\n` +
    `      var pTcol=pHi?'var(--cyan)':'var(--ink)';\n` +
    `      for(var p=0;p<3;p++){ var cx=CX[p];\n` +
    `        lab(cx, yDots, '\\u22ee', 'var(--mute)', 16);\n` +
    `        arr(cx, yDots+6, cx, yP1-16, 'var(--line)', false, true);\n` +
    `        box(cx, yP1, 'P^{'+p+',1}', pStroke, pFill, pTcol);\n` +
    `        box(cx, yP0, 'P^{'+p+',0}', pStroke, pFill, pTcol);\n` +
    `        arr(cx, yP1+15, cx, yP0-15, 'var(--mute)', false, true);          // resolution map down\n` +
    `        arr(cx, yP0+15, cx, yC-15, 'var(--green)', false, true);           // augmentation onto C^p\n` +
    `      }\n` +
    `      // horizontal lifted differential across the P rows (mode 3 only)\n` +
    `      if(pHi){ [yP0,yP1].forEach(function(yy){ for(var p=0;p<2;p++){ arr(CX[p]+46, yy, CX[p+1]-46, yy, 'var(--cyan)', false, true); } }); }\n` +
    `    }\n` +
    `    // the complex C^• (always)\n` +
    `    for(var p2=0;p2<3;p2++){ box(CX[p2], yC, 'C^'+p2, 'var(--yellow)', 'color-mix(in srgb, var(--yellow) 18%, transparent)', 'var(--yellow)'); }\n` +
    `    for(var p3=0;p3<2;p3++){ arr(CX[p3]+46, yC, CX[p3+1]-46, yC, 'var(--yellow)', false, true); }\n` +
    `    lab((CX[0]+CX[1])/2, yC+22, 'd', 'var(--yellow)', 11);\n` +
    `    // mode-3 Z/B/H annotation\n` +
    `    if(pHi){ lab(290, 24, 'horizontal Z^p, B^p, H^p of P\\u2022,\\u2022  \\u2192  projective resolutions of  Z^p(C), B^p(C), H^p(C)', 'var(--green)', 10); }\n` +
    `    // button active styling (house convention: .active class)\n` +
    `    btns.forEach(function(b,i){ var on=(i+1===mode); b.classList.toggle('active', on); b.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    if(mode===1){\n` +
    `      lines.push('A Cartan\\u2013Eilenberg resolution resolves not a single object but an entire complex. Start with a cochain complex C\\u2022 (bottom row), with differential d: C^p \\u2192 C^{p+1}.');\n` +
    `      lines.push('Where one module is resolved by a complex of projectives, a whole complex is resolved by a DOUBLE complex of projectives. Step through the tabs to build it.');\n` +
    `    } else if(mode===2){\n` +
    `      lines.push('Conditions 1\\u20132: every P^{p,q} is projective, and for each p the column P^{p,\\u2022} \\u2192 C^p is a projective resolution of C^p (the green augmentation arrows, with each column exact). This makes P\\u2022,\\u2022 a double complex of projectives sitting over C\\u2022.');\n` +
    `      lines.push('By itself this is only a \"rowwise resolution\" \\u2014 enough to resolve each term, but not yet functorial.');\n` +
    `    } else {\n` +
    `      lines.push('Condition 3 (the distinguishing one): taking horizontal cycles Z^p, boundaries B^p, and homology H^p of the double complex P\\u2022,\\u2022 yields PROJECTIVE RESOLUTIONS of Z^p(C\\u2022), B^p(C\\u2022), and H^p(C\\u2022) respectively. A plain rowwise resolution can fail this; it is exactly what makes the construction natural/functorial.');\n` +
    `      lines.push('Payoffs: (i) hyper-derived functors \\u211d^nF(C\\u2022) = H^n(F(P\\u2022,\\u2022)) extend derived functors from an object to a complex; (ii) the Grothendieck spectral sequence \\u211d^pG \\u2218 \\u211d^qF \\u21d2 \\u211d^{p+q}(GF) \\u2014 behind Leray, Lyndon\\u2013Hochschild\\u2013Serre, and Eilenberg\\u2013Moore.');\n` +
    `    }\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  btns.forEach(function(b,i){ b.addEventListener('click', function(){ mode=i+1; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
