// hodge-theory-why-refinement widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Why Hodge structures: the complex structure refines
// the Betti numbers b_n into the Hodge numbers h^{p,q}. A topological/Hodge
// toggle splits each per-degree bar from a single block (b_n) into (p,q) pieces;
// b_n = sum_{p+q=n} h^{p,q}. Gallery: elliptic curve, genus-2 curve, P^2, K3.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const btn = (g, k, lab, on) =>
    `<button type="button" data-${g}="${k}" class="${on ? 'active' : ''}" aria-pressed="${on ? 'true' : 'false'}">${lab}</button>`;
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-btns">\n` +
    `    ${btn('v','E','elliptic curve',true)}\n    ${btn('v','C2','genus-2 curve',false)}\n    ${btn('v','P2','&#8473;&#178;',false)}\n    ${btn('v','K3','K3 surface',false)}\n` +
    `  </div>\n` +
    `  <div class="row" id="${widgetId}-mode">\n` +
    `    <label>view:</label>\n    ${btn('m','top','topological',true)}\n    ${btn('m','hodge','Hodge',false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="For each cohomological degree, a bar that is a single block of size the Betti number in topological view and splits into coloured Hodge-number pieces in Hodge view"><title>For a smooth projective variety, each degree n has a bar of fixed width representing the cohomology H^n. In topological view it is one block labelled by the Betti number b_n; in Hodge view it splits into coloured segments proportional to the Hodge numbers h^{p,q} for p+q=n, since b_n equals the sum of those Hodge numbers.</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* hodge-theory-why-refinement widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var bt=document.getElementById('${widgetId}-btns'), md=document.getElementById('${widgetId}-mode');\n` +
    `  if(!svg||!out||!bt||!md) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  var PAL=['var(--cyan)','var(--yellow)','var(--violet)','var(--green)','var(--pink)'];\n` +
    `  var VARS=[\n` +
    `    {k:'E', nm:'elliptic curve E', deg:[{n:0,b:1,h:[[0,0,1]]},{n:1,b:2,h:[[1,0,1],[0,1,1]]},{n:2,b:1,h:[[1,1,1]]}]},\n` +
    `    {k:'C2', nm:'a genus-2 curve', deg:[{n:0,b:1,h:[[0,0,1]]},{n:1,b:4,h:[[1,0,2],[0,1,2]]},{n:2,b:1,h:[[1,1,1]]}]},\n` +
    `    {k:'P2', nm:'the projective plane \\u2119\\u00b2', deg:[{n:0,b:1,h:[[0,0,1]]},{n:1,b:0,h:[]},{n:2,b:1,h:[[1,1,1]]},{n:3,b:0,h:[]},{n:4,b:1,h:[[2,2,1]]}]},\n` +
    `    {k:'K3', nm:'a K3 surface', deg:[{n:0,b:1,h:[[0,0,1]]},{n:1,b:0,h:[]},{n:2,b:22,h:[[2,0,1],[1,1,20],[0,2,1]]},{n:3,b:0,h:[]},{n:4,b:1,h:[[2,2,1]]}]},\n` +
    `  ];\n` +
    `  var cur='E', mode='top';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var V=null; for(var i=0;i<VARS.length;i++) if(VARS[i].k===cur) V=VARS[i];\n` +
    `    if(!V) return;\n` +
    `    txt(20, 22, (mode==='top')?('topological view: only the Betti numbers b\\u2099 = dim H\\u207f(X) are visible'):('Hodge view: the complex structure splits H\\u207f(X;\\u2102) = \\u2295_{p+q=n} H^{p,q}'), {size:11, fill:(mode==='top')?'var(--mute)':'var(--violet)', weight:600});\n` +
    `    var X0=70, W=200, rows=V.deg.length, rh=Math.min(44,(262-44)/rows), y0=52;\n` +
    `    V.deg.forEach(function(d,i){ var yc=y0+i*rh+rh/2;\n` +
    `      txt(20, yc+4, 'H'+sup(d.n), {size:12, fill:'var(--ink)', weight:700});\n` +
    `      if(d.b===0){ txt(X0, yc+4, '0   (no cohomology in this degree)', {size:10, fill:'var(--mute)'}); return; }\n` +
    `      if(mode==='top'){\n` +
    `        svg.appendChild(mk('rect',{x:X0,y:yc-9,width:W,height:18,rx:3,fill:'var(--cyan)','fill-opacity':0.5,stroke:'var(--cyan)','stroke-width':1.4}));\n` +
    `        txt(X0+W+10, yc+4, 'b'+sub(d.n)+' = '+d.b, {size:11, fill:'var(--cyan)', weight:700});\n` +
    `      } else {\n` +
    `        var cx=X0; d.h.forEach(function(pc,j){ var w=W*pc[2]/d.b; var col=PAL[j%PAL.length];\n` +
    `          svg.appendChild(mk('rect',{x:cx,y:yc-9,width:w,height:18,rx:2,fill:col,'fill-opacity':0.55,stroke:col,'stroke-width':1.2}));\n` +
    `          if(w>26) txt(cx+w/2, yc+4, '('+pc[0]+','+pc[1]+')', {anchor:'middle', size:8.5, fill:'var(--ink)'});\n` +
    `          cx+=w; });\n` +
    `        var bd=d.h.map(function(pc){ return 'h^{'+pc[0]+','+pc[1]+'}='+pc[2]; }).join('  ');\n` +  // h^{p,q}
    `        txt(X0+W+10, yc+4, '= '+bd, {size:9.5, fill:'var(--ink)'});\n` +
    `      }\n` +
    `    });\n` +
    `    txt(20, 286, (mode==='top')?'\\u2014 the topologist stops here. Toggle to Hodge view \\u2192':'b\\u2099 = \\u03a3_{p+q=n} h^{p,q}: the same space, now graded by the complex structure.', {size:10, fill:(mode==='top')?'var(--mute)':'var(--violet)'});\n` +
    `    out.textContent='Take a smooth projective variety X over \\u2102 and its singular cohomology H\\u207f(X;\\u211a). A TOPOLOGIST sees only a finite-dimensional \\u211a-vector space: the data is \\u201cX has Betti numbers b\\u2099 = dim H\\u207f, with these cup products.\\u201d But X(\\u2102) is also a COMPLEX MANIFOLD, so it carries the sheaves \\u03a9\\u1d56 of holomorphic p-forms, and the Dolbeault cohomology H^{p,q}(X) := H^q(X, \\u03a9\\u1d56_X) is a genuine \\u2102-vector space attached to each bidegree (p,q). The HODGE DECOMPOSITION (for compact K\\u00e4hler, hence smooth projective, X) assembles these into H\\u207f(X;\\u2102) = \\u2295_{p+q=n} H^{p,q}, so each Betti number REFINES into Hodge numbers: b\\u2099 = \\u03a3_{p+q=n} h^{p,q}, with the conjugation symmetry h^{p,q} = h^{q,p}. The bars show this: in topological view H\\u207f is one undivided block of size b\\u2099; toggle to Hodge view and the SAME block splits into its (p,q) pieces. The split is real extra structure, not bookkeeping: it is invisible to the underlying topological space (two varieties can share all Betti numbers yet differ in their Hodge numbers), it tells you which cohomology classes can be represented by holomorphic data, and \\u2014 via the (p,p) part \\u2014 which classes are candidates to be ALGEBRAIC (the Hodge conjecture). For the elliptic curve, b\\u2081 = 2 splits as h^{1,0} = h^{0,1} = 1 (the holomorphic form dz and its conjugate); for a K3 surface, b\\u2082 = 22 splits as 1 + 20 + 1, the lone h^{2,0} (a holomorphic 2-form) being exactly what makes K3 surfaces special. This refinement is the entire subject: a pure Hodge structure is precisely a \\u211a-vector space carrying such a decomposition.';\n` +
    `  }\n` +
    `  function sup(d){ var M={'0':'\\u2070','1':'\\u00b9','2':'\\u00b2','3':'\\u00b3','4':'\\u2074','-':'\\u207b'}; return (''+d).split('').map(function(c){return M[c]||c;}).join(''); }\n` +
    `  function sub(d){ var M={'0':'\\u2080','1':'\\u2081','2':'\\u2082','3':'\\u2083','4':'\\u2084'}; return (''+d).split('').map(function(c){return M[c]||c;}).join(''); }\n` +
    `  bt.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b||!b.getAttribute('data-v')) return; cur=b.getAttribute('data-v');\n` +
    `    Array.prototype.forEach.call(bt.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); }); draw(); });\n` +
    `  md.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b||!b.getAttribute('data-m')) return; mode=b.getAttribute('data-m');\n` +
    `    Array.prototype.forEach.call(md.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); }); draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
