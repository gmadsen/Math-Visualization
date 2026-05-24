// sm-manifold-gallery widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A zoo of the canonical smooth manifolds with their
// dimension formulas, atlases/defining equations, and compact/connected/
// orientable status; a dimension-vs-n plot shows the growth.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const fams = [
    ['S','$S^n$'], ['RP','$\\mathbb{RP}^n$'], ['CP','$\\mathbb{CP}^n$'], ['T','$T^n$'],
    ['GL','$\\mathrm{GL}_n$'], ['SL','$\\mathrm{SL}_n$'], ['O','$\\mathrm{O}(n)$'], ['SO','$\\mathrm{SO}(n)$'],
    ['U','$\\mathrm{U}(n)$'], ['SU','$\\mathrm{SU}(n)$'], ['Gr','$\\mathrm{Gr}(k,n)$']
  ];
  let btns = '';
  fams.forEach(function(f, i){ btns += `    <button type="button" data-f="${f[0]}"${i===0?' class="active" aria-pressed="true"':' aria-pressed="false"'}>${f[1]}</button>\n`; });
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-fam" role="group" aria-label="manifold family" style="flex-wrap:wrap">\n` + btns +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">$n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="1" max="7" value="3" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nv">n = 3</span>\n` +
    `    <label for="${widgetId}-k" id="${widgetId}-klab">$k$ (Grassmannian)</label>\n` +
    `    <input type="range" id="${widgetId}-k" min="1" max="6" value="2" step="1">\n` +
    `    <span class="pill" id="${widgetId}-kv">k = 2</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="The dimension of the selected manifold family as a function of n, with its properties"><title>Canonical smooth manifolds: dimension as a function of n, with atlas, and compact/connected/orientable status</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* sm-manifold-gallery widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var fam=document.getElementById('${widgetId}-fam');\n` +
    `  var sn=document.getElementById('${widgetId}-n'), sk=document.getElementById('${widgetId}-k');\n` +
    `  var nv=document.getElementById('${widgetId}-nv'), kv=document.getElementById('${widgetId}-kv'), klab=document.getElementById('${widgetId}-klab');\n` +
    `  if(!svg||!out||!fam||!sn||!sk) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var SUP=['\\u2070','\\u00b9','\\u00b2','\\u00b3','\\u2074','\\u2075','\\u2076','\\u2077','\\u2078','\\u2079'];\n` +
    `  var SUB=['\\u2080','\\u2081','\\u2082','\\u2083','\\u2084','\\u2085','\\u2086','\\u2087','\\u2088','\\u2089'];\n` +
    // each family: name(n,k), dim(n,k), dimformula, built, compact, connected(n), orientable(n,k)+note
    `  var DB={\n` +
    `    S:{nm:function(n,k){return 'S'+sup(n);}, dim:function(n,k){return n;}, df:'n', built:'2 stereographic charts', cpt:true, con:function(n){return n>=1;}, ori:function(n){return {ok:true,why:'always orientable'};}},\n` +
    `    RP:{nm:function(n,k){return 'RP'+sup(n);}, dim:function(n,k){return n;}, df:'n', built:'n+1 homogeneous-coordinate charts', cpt:true, con:function(){return true;}, ori:function(n){return {ok:(n%2===1),why:'orientable \\u21d4 n odd'};}},\n` +
    `    CP:{nm:function(n,k){return 'CP'+sup(n);}, dim:function(n,k){return 2*n;}, df:'2n', built:'n+1 charts (complex n-manifold)', cpt:true, con:function(){return true;}, ori:function(){return {ok:true,why:'complex \\u21d2 orientable'};}},\n` +
    `    T:{nm:function(n,k){return 'T'+sup(n);}, dim:function(n,k){return n;}, df:'n', built:'R\\u207f/Z\\u207f = (S\\u00b9)\\u207f', cpt:true, con:function(){return true;}, ori:function(){return {ok:true,why:'Lie group'};}},\n` +
    `    GL:{nm:function(n,k){return 'GL'+sub(n)+'(R)';}, dim:function(n,k){return n*n;}, df:'n\\u00b2', built:'open { det \\u2260 0 } in n\\u00d7n matrices', cpt:false, con:function(){return false;}, ori:function(){return {ok:true,why:'open in n\\u00d7n matrix space; 2 components'};}},\n` +
    `    SL:{nm:function(n,k){return 'SL'+sub(n)+'(R)';}, dim:function(n,k){return n*n-1;}, df:'n\\u00b2\\u22121', built:'det A = 1  (regular preimage)', cpt:false, con:function(){return true;}, ori:function(){return {ok:true,why:'Lie group'};}},\n` +
    `    O:{nm:function(n,k){return 'O('+n+')';}, dim:function(n,k){return n*(n-1)/2;}, df:'n(n\\u22121)/2', built:'A\\u1d40A = I', cpt:true, con:function(){return false;}, ori:function(){return {ok:true,why:'Lie group; 2 components'};}},\n` +
    `    SO:{nm:function(n,k){return 'SO('+n+')';}, dim:function(n,k){return n*(n-1)/2;}, df:'n(n\\u22121)/2', built:'A\\u1d40A = I, det = 1', cpt:true, con:function(){return true;}, ori:function(){return {ok:true,why:'Lie group'};}},\n` +
    `    U:{nm:function(n,k){return 'U('+n+')';}, dim:function(n,k){return n*n;}, df:'n\\u00b2', built:'A*A = I', cpt:true, con:function(){return true;}, ori:function(){return {ok:true,why:'Lie group'};}},\n` +
    `    SU:{nm:function(n,k){return 'SU('+n+')';}, dim:function(n,k){return n*n-1;}, df:'n\\u00b2\\u22121', built:'A*A = I, det = 1', cpt:true, con:function(){return true;}, ori:function(){return {ok:true,why:'Lie group'};}},\n` +
    `    Gr:{nm:function(n,k){return 'Gr('+k+','+n+')';}, dim:function(n,k){return k*(n-k);}, df:'k(n\\u2212k)', built:'graph-of-map charts, dim k(n\\u2212k)', cpt:true, con:function(){return true;}, ori:function(n){return {ok:(n%2===0),why:'orientable \\u21d4 n even'};}, usesK:true}\n` +
    `  };\n` +
    `  function sup(n){ var s=''+n,o=''; for(var i=0;i<s.length;i++) o+=(SUP[+s[i]]||('^'+s[i])); return o; }\n` +
    `  function sub(n){ var s=''+n,o=''; for(var i=0;i<s.length;i++) o+=(SUB[+s[i]]||('_'+s[i])); return o; }\n` +
    `  var cur='S';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var D=DB[cur], n=parseInt(sn.value,10), k=parseInt(sk.value,10);\n` +
    `    if(D.usesK && n<2){ n=2; sn.value='2'; }\n` +  // Grassmannian needs n>=2 for a valid 1<=k<=n-1
    `    if(k>=n) k=Math.max(1,n-1);\n` +
    `    if(D.usesK) sk.value=''+k;\n` +  // sync the clamped k back to the slider thumb
    `    nv.textContent='n = '+n; kv.textContent='k = '+k;\n` +
    `    klab.style.opacity = D.usesK?'1':'0.4'; sk.disabled = !D.usesK; kv.style.opacity = D.usesK?'1':'0.4';\n` +
    `    var dim=D.dim(n,k), o=D.ori(n,k), conn=D.con(n);\n` +
    // dim-vs-n plot
    `    var PX0=60, PX1=300, PYB=250, PY0=50; var ms=[1,2,3,4,5,6,7];\n` +
    `    var vals=ms.map(function(m){ var kk=D.usesK?Math.min(k,m-1<1?1:m-1):k; if(D.usesK&&m<2) return 0; return D.dim(m,kk); });\n` +
    `    var ymax=Math.max(1, Math.max.apply(null,vals))*1.1;\n` +
    `    function X(m){ return PX0+(m-1)/6*(PX1-PX0); } function Y(v){ return PYB-(v/ymax)*(PYB-PY0); }\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:PYB,x2:PX1,y2:PYB,stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:PY0,x2:PX0,y2:PYB,stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt((PX0+PX1)/2,PYB+28,'n',{size:10,fill:'var(--mute)',anchor:'middle'}); txt(PX0-26,PY0-8,'dim',{size:10,fill:'var(--mute)'});\n` +
    `    var d=''; for(var i=0;i<ms.length;i++){ d+=(i?'L ':'M ')+X(ms[i])+' '+Y(vals[i])+' '; }\n` +
    `    svg.appendChild(mk('path',{d:d,fill:'none',stroke:'var(--cyan)','stroke-width':2}));\n` +
    `    for(i=0;i<ms.length;i++){ var hl=(ms[i]===n); svg.appendChild(mk('circle',{cx:X(ms[i]),cy:Y(vals[i]),r:hl?5:3,fill:hl?'var(--yellow)':'var(--cyan)'})); txt(X(ms[i]),PYB+14,''+ms[i],{size:8,fill:'var(--mute)',anchor:'middle'}); }\n` +
    `    txt(X(n),Y(dim)-10,''+dim,{size:10,fill:'var(--yellow)',weight:600,anchor:'middle'});\n` +
    // info panel
    `    function chk(b){ return b?'\\u2713':'\\u2717'; } function cc(b){ return b?'var(--green)':'var(--pink)'; }\n` +
    `    var TX=330, ty=58;\n` +
    `    txt(TX,ty,D.nm(n,k),{size:16,fill:'var(--violet)',weight:700}); ty+=26;\n` +
    `    txt(TX,ty,'dim = '+D.df+' = '+dim,{size:13,fill:'var(--ink)',weight:600}); ty+=24;\n` +
    `    txt(TX,ty,'atlas / cut out by:',{size:9,fill:'var(--mute)'}); ty+=14;\n` +
    `    txt(TX,ty,D.built,{size:10,fill:'var(--cyan)'}); ty+=26;\n` +
    `    txt(TX,ty,chk(D.cpt)+' compact',{size:11,fill:cc(D.cpt)}); ty+=16;\n` +
    `    txt(TX,ty,chk(conn)+' connected'+(conn?'':' (2 components)'),{size:11,fill:cc(conn)}); ty+=16;\n` +
    `    txt(TX,ty,chk(o.ok)+' orientable',{size:11,fill:cc(o.ok)}); ty+=14;\n` +
    `    txt(TX,ty,'   ('+o.why+')',{size:9,fill:'var(--mute)'});\n` +
    `    out.textContent = 'The canonical smooth manifolds. '+D.nm(n,k)+' has dimension '+D.df+' = '+dim+(D.usesK?' (here n='+n+', k='+k+')':' (here n='+n+')')+', built from '+D.built+'. It is '+(D.cpt?'compact':'NON-compact')+', '+(conn?'connected':'disconnected ('+(cur==='GL'||cur==='O'?'two components':'')+')')+', and '+(o.ok?'orientable':'non-orientable')+' ('+o.why+'). Slide n to watch the dimension grow \\u2014 linear in n for spheres, projective spaces and tori, quadratic (\\u223cn\\u00b2/2 or n\\u00b2) for the matrix groups. Spheres carry a 2-chart stereographic atlas; projective spaces n+1 homogeneous-coordinate charts; the matrix subgroups SL_n, O(n), SO(n), U(n), SU(n) are preimages of regular values of smooth maps (det, A\\u1d40A); Grassmannians Gr(k,n) use the graph-of-a-linear-map charts of dimension k(n\\u2212k). These plus products, quotients, and regular preimages generate essentially every manifold met in geometry and physics.';\n` +
    `  }\n` +
    `  Array.prototype.forEach.call(fam.querySelectorAll('button'), function(b){ b.addEventListener('click', function(){\n` +
    `    cur=b.getAttribute('data-f');\n` +
    `    Array.prototype.forEach.call(fam.querySelectorAll('button'), function(x){ var on=(x===b); x.classList.toggle('active',on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw();\n` +
    `  }); });\n` +
    `  sn.addEventListener('input', draw); sk.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
