// galois-representations-semisimplification widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A 2x2 upper-triangular rho(Frob_p) = [[a,b],[0,a]]
// with a REPEATED eigenvalue: a non-scalar Jordan block (b != 0) is reducible
// (fixes <e1>) but genuinely NOT semisimple -- <e1> is its only invariant line,
// so there is no invariant complement. Semisimple iff b = 0 (then rho = a*I).
// Trace 2a and det a^2 are independent of b, so Frobenius traces see only the
// semisimplification diag(a, a).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-b">extension class $b$ (off-diagonal)</label>\n` +
    `    <input type="range" id="${widgetId}-b" min="-4" max="4" value="2" step="0.1">\n` +
    `    <span class="pill" id="${widgetId}-bv">b = …</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="A 2x2 upper-triangular Galois representation with a repeated eigenvalue, its only invariant line, and its semisimplification; trace and determinant are independent of the off-diagonal"><title>An upper-triangular rho(Frob_p)=[[a,b],[0,a]] with a repeated eigenvalue is reducible for all b but semisimple only at b=0 (where it is the scalar a times I); for b nonzero it is a Jordan block whose only invariant line is the span of e1, so there is no invariant complement. Its trace 2a and determinant a squared do not depend on b, so Frobenius traces see only the semisimplification diag(a,a)</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* galois-representations-semisimplification widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sb=document.getElementById('${widgetId}-b'), bv=document.getElementById('${widgetId}-bv');\n` +
    `  if(!svg||!out||!sb||!bv) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  var A=1;\n` +  // the single repeated eigenvalue (diagonal a = d = 1): trace 2, det 1
    `  var CX=150, CY=180, U=34;\n` +  // plane for the basis-vector action
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var b=parseFloat(sb.value); if(!isFinite(b)) b=0; bv.textContent='b = '+b.toFixed(1); sb.setAttribute('aria-valuetext','b = '+b.toFixed(1));\n` +
    `    var ss=(Math.abs(b)<1e-9);\n` +
    `    // matrix display (right column)\n` +
    `    txt(300, 60, '\\u03c1(Frob_p) =', {size:13, fill:'var(--ink)'});\n` +
    `    txt(432, 52, 'a   b', {size:13, mono:true, fill:'var(--ink)'}); txt(432, 72, '0   a', {size:13, mono:true, fill:'var(--ink)'});\n` +
    `    svg.appendChild(mk('line',{x1:420,y1:38,x2:420,y2:78,stroke:'var(--ink)','stroke-width':1.4})); svg.appendChild(mk('line',{x1:502,y1:38,x2:502,y2:78,stroke:'var(--ink)','stroke-width':1.4}));\n` +
    `    txt(300, 96, '= [['+A+', '+b.toFixed(1)+'], [0, '+A+']]', {size:12, mono:true, fill:'var(--cyan)'});\n` +
    `    txt(300, 124, 'trace = 2a = '+(2*A)+'   (constant in b)', {size:12, fill:'var(--green)', weight:700});\n` +
    `    txt(300, 146, 'det = a\\u00b2 = '+(A*A)+'   (constant in b)', {size:12, fill:'var(--green)', weight:700});\n` +
    `    txt(300, 176, ss?'b = 0:  scalar a\\u00b7I  \\u2192  SEMISIMPLE':'b \\u2260 0:  Jordan block  \\u2192  NOT semisimple', {size:12, fill: ss?'var(--green)':'var(--pink)', weight:700});\n` +
    `    txt(300, 196, '\\u03c1\\u02e2\\u02e2 = diag(a, a) = diag('+A+', '+A+')', {size:11, fill:'var(--violet)'});\n` +
    `    txt(300, 230, 'same trace '+(2*A)+' for every b \\u21d2', {size:10, fill:'var(--mute)'});\n` +
    `    txt(300, 246, 'Frobenius can\\u2019t tell \\u03c1 from \\u03c1\\u02e2\\u02e2.', {size:10, fill:'var(--mute)'});\n` +
    `    // basis-vector action picture (left): e1 stable, e2 -> (b, a)\n` +
    `    svg.appendChild(mk('line',{x1:CX-3.2*U,y1:CY,x2:CX+3.2*U,y2:CY,stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:CX,y1:CY-2.4*U,x2:CX,y2:CY+1.6*U,stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt(CX+3.2*U+2, CY+4, 'e\\u2081', {size:9, fill:'var(--mute)'}); txt(CX+4, CY-2.4*U+2, 'e\\u2082', {size:9, fill:'var(--mute)'});\n` +
    `    // stable line span(e1) highlighted\n` +
    `    svg.appendChild(mk('line',{x1:CX-3.2*U,y1:CY,x2:CX+3.2*U,y2:CY,stroke:'var(--green)','stroke-width':2.5,'stroke-opacity':0.5}));\n` +
    `    txt(CX-3.2*U, CY+18, 'invariant line \\u27e8e\\u2081\\u27e9 (always)', {size:8, fill:'var(--green)'});\n` +
    `    var defs=mk('defs',{}); var m=mk('marker',{id:'${widgetId}-ar',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto'}); m.appendChild(mk('path',{d:'M0 0 L10 5 L0 10 z',fill:'var(--ink)'})); defs.appendChild(m); svg.appendChild(defs);\n` +
    `    function vec(vx,vy,col,lab,dy){ var x2=CX+vx*U, y2=CY-vy*U; svg.appendChild(mk('line',{x1:CX,y1:CY,x2:x2,y2:y2,stroke:col,'stroke-width':2,'marker-end':'url(#${widgetId}-ar)'})); var lx=Math.max(30,Math.min(286,x2)); txt(lx, y2+dy, lab, {anchor:'middle', size:9, fill:col}); }\n` +
    `    vec(A,0,'var(--cyan)','\\u03c1(e\\u2081)=(a,0)', 16);\n` +  // a*e1 on the x-axis (stable)
    `    vec(b,A,'var(--pink)','\\u03c1(e\\u2082)=(b,a)', -7);\n` +  // b*e1 + a*e2
    `    txt(CX, CY+2.6*U+10, ss?'every line is invariant \\u2192 \\u2102\\u00b2=\\u27e8e\\u2081\\u27e9\\u2295\\u27e8e\\u2082\\u27e9':'\\u27e8e\\u2081\\u27e9 is the only invariant line \\u2192 no complement', {anchor:'middle', size:9, fill: ss?'var(--green)':'var(--pink)'});\n` +
    `    out.textContent='A Galois representation \\u03c1: G_\\u211a \\u2192 GL\\u2099(K) is IRREDUCIBLE if K\\u207f has no proper non-zero G_\\u211a-stable subspace, and SEMISIMPLE if it is a direct sum of irreducibles. Not every reducible representation is semisimple. Take the upper-triangular \\u03c1(Frob_p) = [[a, b],[0, a]] with a REPEATED eigenvalue a: it always fixes the line \\u27e8e\\u2081\\u27e9 (so it is REDUCIBLE), but for b \\u2260 0 it is a non-trivial Jordan block whose ONLY invariant line is \\u27e8e\\u2081\\u27e9 itself \\u2014 there is no invariant complement, so \\u03c1 is INDECOMPOSABLE and not semisimple. (With a repeated eigenvalue the only semisimple matrices are the scalars a\\u00b7I, reached here exactly at b = 0.) Its SEMISIMPLIFICATION is \\u03c1\\u02e2\\u02e2 = diag(a, a), which discards the off-diagonal extension class b. The crucial point: trace = 2a and det = a\\u00b2 do NOT depend on b (the picture: 2a = '+(2*A)+' and a\\u00b2 = '+(A*A)+' at every slider position), because the trace is ADDITIVE on the short exact sequence 0 \\u2192 \\u27e8e\\u2081\\u27e9 \\u2192 \\u03c1 \\u2192 \\u03c1/\\u27e8e\\u2081\\u27e9 \\u2192 0. So tr \\u03c1(Frob_p) = tr \\u03c1\\u02e2\\u02e2(Frob_p) at every unramified prime \\u2014 Frobenius traces only ever see the semisimplification. (The same trace-blindness holds for DISTINCT characters \\u03c7\\u2081 \\u2260 \\u03c7\\u2082: a non-split extension 0 \\u2192 \\u03c7\\u2081 \\u2192 \\u03c1 \\u2192 \\u03c7\\u2082 \\u2192 0, with class in Ext\\u00b9(\\u03c7\\u2082,\\u03c7\\u2081) = H\\u00b9(G_\\u211a, \\u03c7\\u2081\\u03c7\\u2082\\u207b\\u00b9), is reducible but indecomposable \\u2014 there each single \\u03c1(g) is diagonalizable, yet no one basis diagonalizes the whole family, and \\u03c1 still shares all traces with \\u03c7\\u2081 \\u2295 \\u03c7\\u2082.) Combined with BRAUER\\u2013NESBITT (a semisimple representation is determined by its characteristic polynomials) and CHEBOTAREV (Frobenius classes are equidistributed), this gives a dramatic rigidity: two semisimple \\u2113-adic representations of G_\\u211a are ISOMORPHIC iff their Frobenius traces agree on a density-one set of primes. (For \\u03c1_{E,\\u2113} from a non-CM elliptic curve, Serre\\u2019s open-image theorem makes \\u03c1 irreducible \\u2014 in fact surjective onto GL\\u2082(\\u2124_\\u2113) for all but finitely many \\u2113 \\u2014 so there is no off-diagonal to discard.)';\n` +
    `  }\n` +
    `  sb.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
