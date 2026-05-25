// hodge-theory-pure-structure widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Pure Hodge structures as a category, with the Tate
// twist V -> V(m) as the central operation: pieces shift (p,q)->(p-m,q-m),
// weight n->n-2m. Gallery: Q(0), Q(1), H^1(E), H^2(K3), plotted on the (p,q)
// lattice with conjugation diagonal and weight antidiagonal.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const btn = (k, lab, on) =>
    `<button type="button" data-k="${k}" class="${on ? 'active' : ''}" aria-pressed="${on ? 'true' : 'false'}">${lab}</button>`;
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-btns">\n` +
    `    ${btn('Q0', '&#8474;(0)', false)}\n    ${btn('Q1', '&#8474;(1)', false)}\n    ${btn('H1E', 'H&#185;(E)', true)}\n    ${btn('K3', 'H&#178;(K3)', false)}\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-m">Tate twist  V &#8614; V(m),  m =</label>\n` +
    `    <input type="range" id="${widgetId}-m" min="-2" max="2" value="0" step="1">\n` +
    `    <span class="pill" id="${widgetId}-mv">m = 0</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="The Hodge pieces of a pure Hodge structure plotted on the (p,q) lattice, with a Tate twist that shifts them along the diagonal and changes the weight"><title>A pure Hodge structure plotted on the (p,q) lattice: dots at each type (p,q) labelled by the Hodge number h to the p,q, lying on the weight antidiagonal p+q=n and symmetric across the conjugation diagonal p=q. The Tate twist V to V(m) shifts every piece by minus m along the diagonal and changes the weight from n to n minus 2m.</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* hodge-theory-pure-structure widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns'), sm=document.getElementById('${widgetId}-m'), mv=document.getElementById('${widgetId}-mv');\n` +
    `  if(!svg||!out||!btns||!sm||!mv) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  var GAL=[\n` +
    `    {k:'Q0', nm:'\\u211a(0)', wt:0, pcs:[[0,0,1]], note:'the unit object'},\n` +
    `    {k:'Q1', nm:'\\u211a(1)', wt:-2, pcs:[[-1,-1,1]], note:'the Tate twist; Hodge realization 2\\u03c0i\\u00b7\\u211a'},\n` +
    `    {k:'H1E', nm:'H\\u00b9(E)', wt:1, pcs:[[1,0,1],[0,1,1]], note:'an elliptic curve E: h\\u00b9\\u2070=h\\u2070\\u00b9=1'},\n` +
    `    {k:'K3', nm:'H\\u00b2(K3)', wt:2, pcs:[[2,0,1],[1,1,20],[0,2,1]], note:'a K3 surface: h\\u00b2\\u2070=1, h\\u00b9\\u00b9=20, h\\u2070\\u00b2=1 (b\\u2082=22)'},\n` +
    `  ];\n` +
    `  var cur='H1E';\n` +
    `  var pmin=-3, pmax=4, px0=58, px1=292, qbot=290, qtop=58;\n` +
    `  function sx(p){ return px0 + (p-pmin)/(pmax-pmin)*(px1-px0); }\n` +
    `  function sy(q){ return qbot - (q-pmin)/(pmax-pmin)*(qbot-qtop); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var V=null; for(var i=0;i<GAL.length;i++) if(GAL[i].k===cur) V=GAL[i];\n` +
    `    if(!V) return;\n` +
    `    var m=parseInt(sm.value,10); if(isNaN(m)) m=0; mv.textContent='m = '+m; sm.setAttribute('aria-valuetext','m = '+m);\n` +
    `    var wt=V.wt-2*m;\n` +
    `    var pcs=V.pcs.map(function(p){ return [p[0]-m, p[1]-m, p[2]]; });\n` +
    `    // grid\n` +
    `    for(var g=pmin; g<=pmax; g++){ svg.appendChild(mk('line',{x1:sx(g),y1:qtop,x2:sx(g),y2:qbot,stroke:'var(--line)','stroke-width':0.5,'stroke-opacity':0.5})); svg.appendChild(mk('line',{x1:px0,y1:sy(g),x2:px1,y2:sy(g),stroke:'var(--line)','stroke-width':0.5,'stroke-opacity':0.5})); }\n` +
    `    // axes p (q=0) and q (p=0)\n` +
    `    svg.appendChild(mk('line',{x1:px0,y1:sy(0),x2:px1,y2:sy(0),stroke:'var(--mute)','stroke-width':1})); svg.appendChild(mk('line',{x1:sx(0),y1:qtop,x2:sx(0),y2:qbot,stroke:'var(--mute)','stroke-width':1}));\n` +
    `    txt(px1+2, sy(0)+4, 'p', {size:11, fill:'var(--mute)'}); txt(sx(0)+4, qtop-2, 'q', {size:11, fill:'var(--mute)'});\n` +
    `    // conjugation diagonal p=q\n` +
    `    svg.appendChild(mk('line',{x1:sx(pmin),y1:sy(pmin),x2:sx(pmax),y2:sy(pmax),stroke:'var(--violet)','stroke-width':1,'stroke-dasharray':'3 3','stroke-opacity':0.6}));\n` +
    `    txt(sx(pmax)-44, sy(pmax)+12, 'p = q', {size:8.5, fill:'var(--violet)'});\n` +
    `    // weight antidiagonal p+q=wt (clamped endpoints)\n` +
    `    var A=[Math.max(pmin,wt-pmax), 0]; A[1]=wt-A[0]; var B=[Math.min(pmax,wt-pmin),0]; B[1]=wt-B[0];\n` +
    `    if(A[1]>=pmin && A[1]<=pmax && B[1]>=pmin && B[1]<=pmax){ svg.appendChild(mk('line',{x1:sx(A[0]),y1:sy(A[1]),x2:sx(B[0]),y2:sy(B[1]),stroke:'var(--yellow)','stroke-width':1.4,'stroke-opacity':0.7})); }\n` +
    `    txt(px0+2, qtop+12, 'weight antidiagonal  p+q = '+wt, {size:9, fill:'var(--yellow)'});\n` +
    `    // pieces\n` +
    `    pcs.forEach(function(pc){ var x=sx(pc[0]), y=sy(pc[1]);\n` +
    `      svg.appendChild(mk('circle',{cx:x,cy:y,r:7,fill:'var(--cyan)',stroke:'var(--ink)','stroke-width':1.2}));\n` +
    `      txt(x+10, y-7, 'h^{'+pc[0]+','+pc[1]+'}='+pc[2], {size:9.5, fill:'var(--cyan)', weight:700});\n` +
    `    });\n` +
    `    // info panel (right)\n` +
    `    var ix=330, iy=80;\n` +
    `    txt(ix, iy, (m===0?V.nm:V.nm+'('+m+')'), {size:14, fill:'var(--ink)', weight:700}); iy+=22;\n` +
    `    txt(ix, iy, 'weight n = '+wt, {size:12, fill:'var(--yellow)', weight:700}); iy+=20;\n` +
    `    txt(ix, iy, 'type: '+pcs.map(function(p){return '('+p[0]+','+p[1]+')';}).join(' + '), {size:10, fill:'var(--mute)'}); iy+=18;\n` +
    `    txt(ix, iy, 'dim_\\u211a = '+pcs.reduce(function(s,p){return s+p[2];},0), {size:10, fill:'var(--mute)'}); iy+=18;\n` +
    `    txt(ix, iy, 'conj symmetry: h^{p,q}=h^{q,p}', {size:9.5, fill:'var(--violet)'}); iy+=24;\n` +
    `    txt(ix, iy, V.note, {size:9.5, fill:'var(--mute)'});\n` +
    `    out.textContent='Strip away the variety: a PURE \\u211a-HODGE STRUCTURE of weight n is a finite-dimensional \\u211a-vector space V_\\u211a together with a decomposition of its complexification V_\\u2102 = \\u2295_{p+q=n} V^{p,q} satisfying the CONJUGATION SYMMETRY conj(V^{p,q}) = V^{q,p} (equivalently, a decreasing Hodge filtration F\\u2022 with V_\\u2102 = F^p \\u2295 conj(F^{n-p+1})). The cohomology H^n(X) of a smooth projective variety is the canonical example, but the notion is purely linear-algebraic. These objects form a CATEGORY HS_\\u211a: morphisms are \\u211a-linear maps respecting the decomposition; tensor products and duals of pure Hodge structures stay pure, with the UNIT \\u211a(0) of weight 0 and type (0,0). The TATE TWIST \\u211a(1) has weight \\u22122 and type (\\u22121,\\u22121) (its Hodge realization is 2\\u03c0i\\u00b7\\u211a \\u2282 \\u2102) \\u2014 the same Tate twist that organizes the motivic story. Twisting V \\u21a6 V(m) = V \\u2297 \\u211a(1)^{\\u2297m} shifts every Hodge type (p,q) \\u21a6 (p\\u2212m, q\\u2212m) and the weight n \\u21a6 n\\u22122m, leaving the Hodge numbers h^{p,q} unchanged \\u2014 you see the whole diagram slide along the conjugation diagonal as you move the slider, landing on a new weight antidiagonal. POLARISABILITY (a (\\u22121)^n-symmetric form positive on the primitive part, supplied by cup product with the K\\u00e4hler class on H^n(X)) upgrades a pure Hodge structure to a polarised one, and the category of polarisable pure Hodge structures is SEMISIMPLE \\u2014 every short exact sequence splits. Finally HS_\\u211a is a NEUTRAL TANNAKIAN category over \\u211a (fiber functor V \\u21a6 V_\\u211a), so it has a Tannakian fundamental group: the MUMFORD\\u2013TATE group, which packages all the linear-algebraic symmetries of Hodge structures as the representations of one (pro)algebraic group.';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; cur=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  sm.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
