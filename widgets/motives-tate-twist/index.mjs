// motives-tate-twist widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The Tate twist Q(n) as a motive, seen through every
// realization (Betti, de Rham, l-adic, crystalline, point-count): weight -2n,
// Hodge type (-n,-n), chi^n, Frobenius phi=p^{-n}, geom. Frobenius eigenvalue
// q^{-n}; with the Lefschetz motive L = Q(-1) = h^2(P^1) the concrete anchor.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">Tate twist  &#8474;(n),  n =</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="-3" max="3" value="1" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nv">n = 1</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="The Tate twist Q(n) tabulated through each realization, and placed on a weight number line"><title>The Tate motive Q(n) = L to the minus n, where L = h^2(P^1) is the Lefschetz motive. A table shows its incarnation in the Betti, de Rham, l-adic, crystalline, and point-counting realizations as n varies, and a number line places Q(n) at weight minus 2n, the unit Q(0) at 0, and L = Q(-1) at plus 2.</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* motives-tate-twist widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sn=document.getElementById('${widgetId}-n'), nv=document.getElementById('${widgetId}-nv');\n` +
    `  if(!svg||!out||!sn||!nv) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  function sup(d){ var M={'0':'\\u2070','1':'\\u00b9','2':'\\u00b2','3':'\\u00b3','4':'\\u2074','5':'\\u2075','6':'\\u2076','-':'\\u207b'}; return (''+d).split('').map(function(c){return M[c]||c;}).join(''); }\n` +
    `  function fmtm(x){ return x<0 ? ('\\u2212'+(-x)) : (''+x); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var n=parseInt(sn.value,10); if(isNaN(n)) n=0; nv.textContent='n = '+n; sn.setAttribute('aria-valuetext','n = '+n);\n` +
    `    // headline\n` +
    `    txt(20, 26, '\\u211a('+fmtm(n)+')  =  L'+sup(-n)+'      (L = h\\u00b2(\\u2119\\u00b9) = \\u211a(\\u22121), the Lefschetz motive)', {size:13, weight:700, fill:'var(--ink)'});\n` +
    `    var lshift=(n===0)?'s (unchanged)':(n>0?('s + '+n):('s \\u2212 '+(-n)));\n` +
    `    txt(20, 46, 'weight  '+fmtm(-2*n)+'      \\u00b7      geometric Frobenius eigenvalue  q'+sup(-n)+'      \\u00b7      L-function  '+lshift, {size:11, fill:'var(--cyan)', weight:600});\n` +
    `    // table\n` +
    `    txt(28, 76, 'realization', {size:10, fill:'var(--mute)', weight:700}); txt(150, 76, 'incarnation of \\u211a('+fmtm(n)+')', {size:10, fill:'var(--mute)', weight:700});\n` +
    `    var rows=[\n` +
    `      ['Betti', '(2\\u03c0i)'+sup(n)+' \\u00b7 \\u211a   \\u2014   Hodge type ('+fmtm(-n)+', '+fmtm(-n)+')'],\n` +
    `      ['de Rham', '\\u211a, Hodge filtration jumps at p = '+fmtm(-n)],\n` +
    `      ['\\u2113-adic', '\\u211a_\\u2113(n) = \\u03c7_cyc'+sup(n)+'   (the cyclotomic character to the n)'],\n` +
    `      ['crystalline', '\\u03c6-module \\u211a_p,  \\u03c6 = \\u00d7 p'+sup(-n)+',  Newton slope '+fmtm(-n)],\n` +
    `      ['point count', 'the measure sends L \\u21a6 q, so \\u211a(n) contributes q'+sup(-n)],\n` +
    `    ];\n` +
    `    var y=100;\n` +
    `    rows.forEach(function(r){ txt(28, y, r[0], {size:11, fill:'var(--violet)', weight:700}); txt(150, y, r[1], {size:10.5, fill:'var(--ink)'}); y+=24; });\n` +
    `    // weight number line\n` +
    `    var ly=258, lx0=60, lx1=520, wmin=-7, wmax=7;\n` +
    `    function wx(w){ return lx0 + (w-wmin)/(wmax-wmin)*(lx1-lx0); }\n` +
    `    svg.appendChild(mk('line',{x1:lx0,y1:ly,x2:lx1,y2:ly,stroke:'var(--line)','stroke-width':1.2,'marker-end':'url(#${widgetId}-ar)'}));\n` +
    `    var defs=mk('defs',{}); var m=mk('marker',{id:'${widgetId}-ar',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto'}); m.appendChild(mk('path',{d:'M0 0 L10 5 L0 10 z',fill:'var(--line)'})); defs.appendChild(m); svg.appendChild(defs);\n` +
    `    for(var w=wmin;w<=wmax;w++){ if(w%2===0){ svg.appendChild(mk('line',{x1:wx(w),y1:ly-4,x2:wx(w),y2:ly+4,stroke:'var(--line)','stroke-width':1})); txt(wx(w),ly+16,fmtm(w),{anchor:'middle',size:8,fill:'var(--mute)'}); } }\n` +
    `    txt(lx1+2, ly+4, 'weight', {size:9, fill:'var(--mute)'});\n` +
    `    function tick(w,lab,col){ var x=wx(Math.max(wmin,Math.min(wmax,w))); svg.appendChild(mk('circle',{cx:x,cy:ly,r:5,fill:col,stroke:'var(--ink)','stroke-width':1})); txt(x,ly-10,lab,{anchor:'middle',size:9,fill:col,weight:700}); }\n` +
    `    tick(0, '\\u211a(0)=1', 'var(--mute)');\n` +
    `    tick(2, 'L', 'var(--yellow)');\n` +
    `    tick(-2*n, '\\u211a('+fmtm(n)+')', 'var(--green)');\n` +
    `    txt(280, 300, 'each Tate twist shifts the weight by \\u22122; \\u211a(n) sits at weight \\u22122n', {anchor:'middle', size:9, fill:'var(--mute)'});\n` +
    `    out.textContent='After the unit motive \\u211a(0) = 1 (the motive of a point), the simplest motive is the LEFSCHETZ MOTIVE L = h\\u00b2(\\u2119\\u00b9), the top cohomology of the projective line. Its tensor-inverse is the TATE MOTIVE \\u211a(1) := L\\u207b\\u00b9, and \\u211a(n) := \\u211a(1)^{\\u2297n} for every integer n (so \\u211a(\\u22121) = L). Tate motives are the building blocks of all Tate-type structure in cohomology, and the motivic point is that ONE object \\u211a(n) has a coherent incarnation in EVERY realization: in BETTI cohomology it is (2\\u03c0i)\\u207f\\u00b7\\u211a, a rank-1 \\u211a-Hodge structure of weight \\u22122n and type (\\u2212n,\\u2212n); in DE RHAM it is \\u211a with its Hodge filtration jumping in degree \\u2212n; in \\u2113-ADIC cohomology it is \\u211a_\\u2113(n) = \\u03c7_cyc\\u207f, the n-th power of the cyclotomic character (a 1-dimensional Galois representation of G_\\u211a); in CRYSTALLINE cohomology it is a \\u03c6-module on which Frobenius \\u03c6 acts as multiplication by p\\u207b\\u207f, i.e. Newton slope \\u2212n; and under the point-counting MOTIVIC MEASURE \\u2014 which sends the Lefschetz motive L to q (because #\\u2119\\u00b9 over the field with q elements is q+1 = 1 + q, the q being the trace of geometric Frobenius on L = h\\u00b2) \\u2014 the twist \\u211a(n) contributes a geometric Frobenius eigenvalue of q\\u207b\\u207f. All of these track the single integer n: the WEIGHT is \\u22122n (so each twist drops the weight by 2, visible on the number line), and twisting by \\u211a(n) SHIFTS an L-function\\u2019s variable by s \\u21a6 s + n. This is why the Tate twist is the universal bookkeeping device of arithmetic geometry: it is the one knob that renormalizes weights and aligns the Betti, de Rham, \\u2113-adic, and crystalline pictures of the same motive.';\n` +
    `  }\n` +
    `  sn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
