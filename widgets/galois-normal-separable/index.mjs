// galois-normal-separable widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Normal / separable / Galois, read off the roots of a
// minimal polynomial in ℂ: normal iff every root lies in L (the polynomial
// splits), separable iff the roots are distinct, Galois iff both — iff
// |Gal(L/K)| = [L:K].

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">extension $L/K$</span>\n` +
    `    <button type="button" id="${widgetId}-e0">$\\mathbb{Q}(\\sqrt2)$</button>\n` +
    `    <button type="button" id="${widgetId}-e1">$\\mathbb{Q}(\\sqrt[3]{2})$</button>\n` +
    `    <button type="button" id="${widgetId}-e2">$\\mathbb{Q}(\\sqrt[3]{2},\\omega)$</button>\n` +
    `    <button type="button" id="${widgetId}-e3">$\\mathbb{Q}(\\zeta_5)$</button>\n` +
    `    <button type="button" id="${widgetId}-e4">$\\mathbb{F}_p(t)/\\mathbb{F}_p(t^p)$</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="Roots of a minimal polynomial in the complex plane, coloured by whether they lie in the extension L"><title>Normal, separable, Galois: roots in L are filled; normal means all roots lie in L, separable means the roots are distinct</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* galois-normal-separable widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var TAU=2*Math.PI, c2=Math.cbrt(2);\n` +
    `  function cis(r,th){ return [r*Math.cos(th), r*Math.sin(th)]; }\n` +
    `  var EX=[\n` +
    `    { lab:'\\u211a(\\u221a2) / \\u211a', mp:'x\\u00b2 \\u2212 2', roots:[[Math.SQRT2,0],[-Math.SQRT2,0]], inL:[true,true], sep:true, deg:2, gal:2,\n` +
    `      note:'Both roots \\u00b1\\u221a2 are real and lie in \\u211a(\\u221a2). The polynomial splits, the roots are distinct \\u2014 normal and separable, hence Galois, with |Gal| = 2 = [L:\\u211a].' },\n` +
    `    { lab:'\\u211a(\\u221b2) / \\u211a', mp:'x\\u00b3 \\u2212 2', roots:[[c2,0], cis(c2,TAU/3), cis(c2,2*TAU/3)], inL:[true,false,false], sep:true, deg:3, gal:1,\n` +
    `      note:'Only the real root \\u221b2 lies in \\u211a(\\u221b2) \\u2282 \\u211d; the two complex roots \\u221b2\\u00b7\\u03c9, \\u221b2\\u00b7\\u03c9\\u00b2 escape. The polynomial does NOT split in L, so L/\\u211a is not normal \\u2014 not Galois. Indeed |Gal| = 1 < 3 = [L:\\u211a].' },\n` +
    `    { lab:'\\u211a(\\u221b2, \\u03c9) / \\u211a', mp:'x\\u00b3 \\u2212 2  (splitting field)', roots:[[c2,0], cis(c2,TAU/3), cis(c2,2*TAU/3)], inL:[true,true,true], sep:true, deg:6, gal:6,\n` +
    `      note:'Adjoining \\u03c9 = e^{2\\u03c0i/3} brings in all three cube roots, so x\\u00b3\\u22122 splits: L is the splitting field, hence normal. Separable (char 0), so Galois, with |Gal| = 6 = [L:\\u211a] \\u2014 the group is S\\u2083.' },\n` +
    `    { lab:'\\u211a(\\u03b6\\u2085) / \\u211a', mp:'x\\u2074 + x\\u00b3 + x\\u00b2 + x + 1', roots:[cis(1,TAU/5), cis(1,2*TAU/5), cis(1,3*TAU/5), cis(1,4*TAU/5)], inL:[true,true,true,true], sep:true, deg:4, gal:4,\n` +
    `      note:'The roots are the primitive 5th roots of unity \\u03b6\\u2085^k; each is a power of \\u03b6\\u2085, so all lie in \\u211a(\\u03b6\\u2085). The cyclotomic field is normal and separable \\u2014 Galois, with |Gal| = 4 = [L:\\u211a], cyclic (\\u2124/5)*.' },\n` +
    `    { lab:'\\u211d\\u209a(t) / \\u211d\\u209a(t\\u1d56)  (char p)', special:true, mp:'x\\u1d56 \\u2212 t\\u1d56 = (x \\u2212 t)\\u1d56', sep:false, deg:'p', gal:1,\n` +
    `      note:'Over a field of characteristic p, x\\u1d56 \\u2212 t\\u1d56 = (x \\u2212 t)\\u1d56 by the Frobenius: a SINGLE root t with multiplicity p. The extension is normal (the polynomial splits) but INSEPARABLE \\u2014 so not Galois. Its only automorphism is the identity, yet [L:K] = p, so |Gal| = 1 < p.' }\n` +
    `  ];\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var bt=[0,1,2,3,4].map(function(i){ return document.getElementById('${widgetId}-e'+i); });\n` +
    `  if(!svg||!out||bt.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    `  function vrow(x,y,label,ok){ svg.appendChild(mk('text',{x:x,y:y,'font-size':13,fill:ok?'var(--green)':'var(--pink)'},ok?'\\u2713':'\\u2717')); txt(x+17,y,label,{size:11,fill:'var(--ink)'}); }\n` +
    `  var sel=1;\n` + // default: Q(∛2), the not-normal example
    `  var CX=160, CY=170, SC=64;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    bt.forEach(function(b,i){ b.classList.toggle('active',i===sel); b.setAttribute('aria-pressed',i===sel?'true':'false'); });\n` +
    `    var E=EX[sel];\n` +
    `    var normal = E.special ? true : E.inL.every(function(b){return b;});\n` +
    `    var galois = normal && E.sep;\n` +
    `    if(E.special){\n` +
    `      txt(40, 90, 'minimal polynomial of t over \\u211d\\u209a(t\\u1d56):', {size:12, fill:'var(--mute)'});\n` +
    `      txt(40, 122, E.mp, {size:18, fill:'var(--yellow)', weight:600});\n` +
    `      txt(40, 150, 'one root  t  with multiplicity p  (a repeated root)', {size:12, fill:'var(--pink)'});\n` +
    `    } else {\n` +
    // complex-plane axes
    `      svg.appendChild(mk('line',{x1:CX-130,y1:CY,x2:CX+130,y2:CY,stroke:'var(--line)','stroke-width':1}));\n` +
    `      svg.appendChild(mk('line',{x1:CX,y1:CY-130,x2:CX,y2:CY+130,stroke:'var(--line)','stroke-width':1}));\n` +
    `      txt(CX+132, CY+4, 'Re', {size:10, fill:'var(--mute)'}); txt(CX+4, CY-132, 'Im', {size:10, fill:'var(--mute)'});\n` +
    `      svg.appendChild(mk('circle',{cx:CX,cy:CY,r:SC,fill:'none',stroke:'var(--line)','stroke-width':0.5,'stroke-dasharray':'2 3'}));\n` + // unit circle reference
    `      E.roots.forEach(function(r,ri){ var x=CX+r[0]*SC, y=CY-r[1]*SC, on=E.inL[ri];\n` +
    `        svg.appendChild(mk('circle',{cx:x,cy:y,r:6, fill:on?'var(--green)':'none', stroke:on?'var(--green)':'var(--pink)','stroke-width':1.8})); });\n` +
    `      txt(CX, CY+150, 'roots of  '+E.mp, {size:11, fill:'var(--mute)', anchor:'middle'});\n` +
    `      txt(CX-130, CY+150, '\\u25cf in L', {size:10, fill:'var(--green)'});\n` +
    `      txt(CX+70, CY+150, '\\u25cb not in L', {size:10, fill:'var(--pink)'});\n` +
    `    }\n` +
    // verdict panel
    `    var TX=340;\n` +
    `    txt(TX, 40, E.lab, {size:13, fill:'var(--ink)', weight:700});\n` +
    `    vrow(TX, 72, 'normal  (polynomial splits in L)', normal);\n` +
    `    vrow(TX, 96, 'separable  (roots distinct)', E.sep);\n` +
    `    vrow(TX, 128, 'Galois  (normal \\u2227 separable)', galois);\n` +
    `    txt(TX, 162, '|Gal(L/K)| = '+E.gal+(galois?'  =  ':'  <  ')+'[L:K] = '+E.deg, {size:12, fill:galois?'var(--green)':'var(--orange)', weight:600});\n` +
    `    if(!galois) txt(TX, 182, '\\u21d2 not Galois', {size:11, fill:'var(--orange)', italic:true});\n` +
    `    out.textContent = E.note + '\\n\\nGeneral rule: |Gal(L/K)| \\u2264 [L:K] always, with equality exactly when L/K is Galois \\u2014 i.e. both normal (every irreducible with a root in L splits in L) and separable (minimal polynomials have distinct roots). In characteristic zero separability is automatic, so a finite normal extension is Galois; characteristic p is where inseparability can intervene.';\n` +
    `  }\n` +
    `  bt.forEach(function(b,i){ b.addEventListener('click', function(){ sel=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
