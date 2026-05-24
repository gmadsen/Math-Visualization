// galois-representations-semisimplification widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A 2x2 upper-triangular rho(Frob_p) = [[a,b],[0,d]]:
// reducible for all b, semisimple only at b=0, with trace a+d and det ad
// independent of b -- so Frobenius traces see only the semisimplification.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-b">extension class $b$ (off-diagonal)</label>\n` +
    `    <input type="range" id="${widgetId}-b" min="-40" max="40" value="22" step="1">\n` +
    `    <span class="pill" id="${widgetId}-bv">b = …</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="A 2x2 upper-triangular Galois representation, its stable line, and its semisimplification, with trace and determinant independent of the off-diagonal"><title>An upper-triangular rho(Frob_p)=[[a,b],[0,d]] is reducible for all b but semisimple only at b=0; its trace a+d and determinant ad do not depend on b, so Frobenius traces see only the semisimplification diag(a,d)</title></svg>\n` +
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
    `  var A=3, D=-2;\n` +  // diagonal character values (trace 1, det -6)
    `  var CX=150, CY=180, U=34;\n` +  // plane for the basis-vector action
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var b=parseInt(sb.value,10)/10; bv.textContent='b = '+b.toFixed(1);\n` +
    `    var ss=(Math.abs(b)<1e-9);\n` +
    `    // matrix display\n` +
    `    txt(300, 60, '\\u03c1(Frob_p) =', {size:13, fill:'var(--ink)'});\n` +
    `    txt(430, 52, 'a   b', {size:13, mono:true, fill:'var(--ink)'}); txt(430, 72, '0   d', {size:13, mono:true, fill:'var(--ink)'});\n` +
    `    svg.appendChild(mk('line',{x1:418,y1:38,x2:418,y2:78,stroke:'var(--ink)','stroke-width':1.4})); svg.appendChild(mk('line',{x1:500,y1:38,x2:500,y2:78,stroke:'var(--ink)','stroke-width':1.4}));\n` +
    `    txt(300, 96, '= [['+A+', '+b.toFixed(1)+'], [0, '+D+']]', {size:12, mono:true, fill:'var(--cyan)'});\n` +
    `    txt(300, 124, 'trace = a+d = '+(A+D)+'   (constant)', {size:12, fill:'var(--green)', weight:700});\n` +
    `    txt(300, 146, 'det = a\\u00b7d = '+(A*D)+'   (constant)', {size:12, fill:'var(--green)', weight:700});\n` +
    `    txt(300, 176, ss?'b = 0:  SEMISIMPLE':'b \\u2260 0:  reducible, NOT semisimple', {size:12, fill: ss?'var(--green)':'var(--pink)', weight:700});\n` +
    `    txt(300, 196, '\\u03c1\\u02e2\\u02e2 = diag(a, d) = diag('+A+', '+D+')', {size:11, fill:'var(--violet)'});\n` +
    `    txt(300, 230, 'same trace '+(A+D)+' for every b \\u21d2', {size:10, fill:'var(--mute)'});\n` +
    `    txt(300, 246, 'Frobenius can\\u2019t tell \\u03c1 from \\u03c1\\u02e2\\u02e2.', {size:10, fill:'var(--mute)'});\n` +
    `    // basis-vector action picture (left): e1 stable, e2 -> (b, d)\n` +
    `    svg.appendChild(mk('line',{x1:CX-3.2*U,y1:CY,x2:CX+3.2*U,y2:CY,stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:CX,y1:CY-3.6*U,x2:CX,y2:CY+1.6*U,stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt(CX+3.2*U+2, CY+4, 'e\\u2081', {size:9, fill:'var(--mute)'}); txt(CX+4, CY-3.6*U+2, 'e\\u2082', {size:9, fill:'var(--mute)'});\n` +
    `    // stable line span(e1) highlighted\n` +
    `    svg.appendChild(mk('line',{x1:CX-3.2*U,y1:CY,x2:CX+3.2*U,y2:CY,stroke:'var(--green)','stroke-width':2.5,'stroke-opacity':0.5}));\n` +
    `    txt(CX-3.2*U, CY+16, 'stable line \\u27e8e\\u2081\\u27e9 (always)', {size:8, fill:'var(--green)'});\n` +
    `    function vec(vx,vy,col,lab){ var x2=CX+vx*U, y2=CY-vy*U; svg.appendChild(mk('line',{x1:CX,y1:CY,x2:x2,y2:y2,stroke:col,'stroke-width':2,'marker-end':'url(#${widgetId}-ar)'})); txt(x2+(vx>=0?4:-4), y2-4, lab, {size:9, fill:col, anchor:vx>=0?'start':'end'}); }\n` +
    `    var defs=mk('defs',{}); var m=mk('marker',{id:'${widgetId}-ar',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto'}); m.appendChild(mk('path',{d:'M0 0 L10 5 L0 10 z',fill:'var(--ink)'})); defs.appendChild(m); svg.appendChild(defs);\n` +
    `    vec(A,0,'var(--cyan)','\\u03c1(e\\u2081)=('+A+',0)');\n` +  // a*e1 on the x-axis (stable)
    `    vec(b,D,'var(--pink)','\\u03c1(e\\u2082)=('+b.toFixed(1)+','+D+')');\n` +  // b*e1 + d*e2
    `    txt(CX, CY+3.0*U+8, ss?'\\u03c1(e\\u2082) on \\u27e8e\\u2082\\u27e9 too \\u2192 \\u27e8e\\u2082\\u27e9 stable \\u2192 \\u2295':'\\u03c1(e\\u2082) tilts off \\u27e8e\\u2082\\u27e9 \\u2192 not a direct sum', {anchor:'middle', size:9, fill: ss?'var(--green)':'var(--pink)'});\n` +
    `    out.textContent='A Galois representation \\u03c1: G_\\u211a \\u2192 GL\\u2099(K) is IRREDUCIBLE if K\\u207f has no proper non-zero G_\\u211a-stable subspace, and SEMISIMPLE if it is a direct sum of irreducibles. Not every representation is semisimple: the upper-triangular \\u03c1(Frob_p) = [[a, b],[0, d]] always fixes the line \\u27e8e\\u2081\\u27e9 (so it is REDUCIBLE), but \\u03c1(e\\u2082) = b\\u00b7e\\u2081 + d\\u00b7e\\u2082 only lies back on \\u27e8e\\u2082\\u27e9 when b = 0 \\u2014 so it is a direct sum, i.e. SEMISIMPLE, exactly when the extension class b vanishes. The SEMISIMPLIFICATION \\u03c1\\u02e2\\u02e2 = \\u03c7\\u2081 \\u2295 \\u03c7\\u2082 = diag(a, d) throws away the off-diagonal cocycle. The crucial point: the trace a+d and determinant ad do NOT depend on b (the picture: a + d = '+(A+D)+' and ad = '+(A*D)+' for every slider position), because traces are ADDITIVE on short exact sequences. So tr \\u03c1(Frob_p) = tr \\u03c1\\u02e2\\u02e2(Frob_p) at every unramified prime \\u2014 Frobenius traces only ever see the semisimplification. Combined with BRAUER\\u2013NESBITT (a semisimple representation is determined by its characteristic polynomials) and CHEBOTAREV (Frobenius classes are equidistributed), this gives a dramatic rigidity: two semisimple \\u2113-adic representations of G_\\u211a are ISOMORPHIC iff their Frobenius traces agree on a density-one set of primes. (For \\u03c1_{E,\\u2113} from a non-CM elliptic curve, Serre\\u2019s open-image theorem makes \\u03c1 irreducible \\u2014 in fact surjective onto GL\\u2082(\\u2124_\\u2113) for all but finitely many \\u2113 \\u2014 so there is no off-diagonal to discard.)';\n` +
    `  }\n` +
    `  sb.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
