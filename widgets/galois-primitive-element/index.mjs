// galois-primitive-element widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The primitive element theorem on ℚ(√2,√3) =
// ℚ(√2+√3). Slide c in θ = √2 + c√3; the four conjugates ±√2 ± c√3 are distinct
// for c ≠ 0, giving a degree-4 minimal polynomial (x²−3c²+2)²−8x² and a
// primitive element; at c = 0 two pairs collide and the degree drops to 2.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-c">coefficient $c$ in $\\theta=\\sqrt2+c\\sqrt3$</label>\n` +
    `    <input type="range" id="${widgetId}-c" min="-2" max="2" value="1" step="0.25">\n` +
    `    <span class="pill" id="${widgetId}-cv">c = 1</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="The four conjugates of theta on a number line and the minimal polynomial of theta"><title>Primitive element theorem: theta = sqrt2 + c sqrt3 has four distinct conjugates for c not zero, giving a degree-4 minimal polynomial that generates Q(sqrt2,sqrt3)</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* galois-primitive-element widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var R2=Math.SQRT2, R3=Math.sqrt(3);\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sc=document.getElementById('${widgetId}-c'), cv=document.getElementById('${widgetId}-cv');\n` +
    `  if(!svg||!out||!sc||!cv) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    `  function poly(c){ var A=-(4+6*c*c), B=(2-3*c*c)*(2-3*c*c);\n` + // x^4 + A x^2 + B
    `    var as=(A<0?'\\u2212 ':'+ ')+Math.abs(A).toFixed(2).replace(/\\.00$/,'')+'x\\u00b2';\n` +
    `    var bs=(B<0?'\\u2212 ':'+ ')+Math.abs(B).toFixed(2).replace(/\\.00$/,'');\n` +
    `    return 'x\\u2074 '+as+' '+bs; }\n` +
    `  var X0=40, X1=520, CY=120;\n` + // number-line geometry
    `  var LO=-5.5, HI=5.5;\n` +
    `  function px(v){ return X0 + (v-LO)/(HI-LO)*(X1-X0); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var c=parseFloat(sc.value); cv.textContent='c = '+c;\n` +
    `    var conj=[R2+c*R3, R2-c*R3, -R2+c*R3, -R2-c*R3];\n` + // ±√2 ± c√3
    `    var distinct=[]; conj.forEach(function(v){ if(!distinct.some(function(w){return Math.abs(w-v)<1e-9;})) distinct.push(v); });\n` +
    `    var nDist=distinct.length, primitive=(nDist===4), deg=nDist;\n` +
    // number line
    `    svg.appendChild(mk('line',{x1:X0,y1:CY,x2:X1,y2:CY,stroke:'var(--mute)','stroke-width':1}));\n` +
    `    for(var t=-5;t<=5;t++){ svg.appendChild(mk('line',{x1:px(t),y1:CY-4,x2:px(t),y2:CY+4,stroke:'var(--line)','stroke-width':1})); txt(px(t),CY+18,''+t,{size:9,fill:'var(--mute)',anchor:'middle'}); }\n` +
    `    txt(40, 52, '\\u03b8 = \\u221a2 + c\\u221a3 = '+(R2+c*R3).toFixed(3)+'    \\u2014    conjugates  \\u00b1\\u221a2 \\u00b1 c\\u221a3:', {size:12, fill:'var(--ink)'});\n` +
    // labels for the four conjugate expressions
    `    var lbls=['\\u221a2 + c\\u221a3','\\u221a2 \\u2212 c\\u221a3','\\u2212\\u221a2 + c\\u221a3','\\u2212\\u221a2 \\u2212 c\\u221a3'];\n` +
    `    var cols=['var(--yellow)','var(--cyan)','var(--green)','var(--pink)'];\n` +
    `    conj.forEach(function(v,i){ var x=px(v); var up=(i%2===0);\n` +
    `      svg.appendChild(mk('circle',{cx:x,cy:CY,r:6,fill:cols[i],'fill-opacity':0.85,stroke:'var(--bg)','stroke-width':1}));\n` +
    `      svg.appendChild(mk('line',{x1:x,y1:CY,x2:x,y2:CY+(up?-30:34),stroke:cols[i],'stroke-width':1,'stroke-opacity':0.5}));\n` +
    `      txt(x, CY+(up?-34:48), lbls[i], {size:9, fill:cols[i], anchor:'middle'}); });\n` +
    // verdict / min poly
    `    txt(40, CY+92, 'distinct conjugates: '+nDist+(primitive?'  (all four)':'  (a pair collided)'), {size:12, fill:primitive?'var(--green)':'var(--orange)', weight:600});\n` +
    `    txt(40, CY+118, 'minimal polynomial  m_\\u03b8(x) = '+(primitive?poly(c):'x\\u00b2 \\u2212 2'), {size:13, fill:'var(--yellow)', weight:600});\n` +
    `    txt(40, CY+140, '[\\u211a(\\u03b8):\\u211a] = deg m_\\u03b8 = '+deg, {size:12, fill:'var(--cyan)'});\n` +
    `    txt(40, CY+166, primitive ? '\\u211a(\\u03b8) = \\u211a(\\u221a2,\\u221a3)  \\u2014  \\u03b8 is a PRIMITIVE element \\u2713' : '\\u211a(\\u03b8) = \\u211a(\\u221a2) \\u228a \\u211a(\\u221a2,\\u221a3)  \\u2014  not primitive', {size:13, fill:primitive?'var(--green)':'var(--pink)', weight:700});\n` +
    // readout
    `    out.textContent = (primitive\n` +
    `      ? '\\u03b8 = \\u221a2 + c\\u221a3 with c = '+c+' has four distinct conjugates \\u00b1\\u221a2 \\u00b1 c\\u221a3 (the Galois orbit, from independent sign flips on \\u221a2 and \\u221a3). Their product \\u220f(x \\u2212 conjugate) = (x\\u00b2 \\u2212 3c\\u00b2 + 2)\\u00b2 \\u2212 8x\\u00b2 = '+poly(c)+' is irreducible of degree 4 = [\\u211a(\\u221a2,\\u221a3):\\u211a], so \\u211a(\\u03b8) is the whole field: \\u03b8 is a primitive element.'\n` +
    `      : '\\u03b8 = \\u221a2 + c\\u221a3 with c = '+c+' collapses: with c = 0, \\u03b8 = \\u221a2 and the four conjugates \\u00b1\\u221a2 \\u00b1 0 collide into just \\u00b1\\u221a2. The minimal polynomial drops to x\\u00b2 \\u2212 2 (degree 2), so \\u211a(\\u03b8) = \\u211a(\\u221a2) is a proper subfield \\u2014 \\u03b8 is not primitive.')\n` +
    `      + '\\n\\nThe primitive element theorem: any finite separable extension L/K is simple, L = K(\\u03b8). The proof is exactly this picture \\u2014 for generators \\u03b1, \\u03b2 almost every \\u03b8 = \\u03b1 + c\\u03b2 works, because \\u03b8 fails to generate only when two of its conjugates coincide, and that happens for only finitely many c (here, the single value c = 0). So Galois theory over \\u211a reduces to one irreducible polynomial: Gal acts by permuting its roots.';\n` +
    `  }\n` +
    `  sc.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
