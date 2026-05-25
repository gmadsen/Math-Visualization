// knot-polynomials-khovanov widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Khovanov homology Kh^{i,j}(K) as a bigraded table
// (homological degree i across, quantum degree j up), for the unknot, the
// right-handed trefoil 3_1, and the figure-eight 4_1. The graded Euler
// characteristic sum_{i,j} (-1)^i q^j dim Kh^{i,j} is computed live from the
// table and shown to equal (q+q^{-1}) V_L(q^2), the unnormalised Jones
// polynomial — decategorification. Rational coefficients (A = Q<1,X>), so the
// table holds dimensions only. Plain Q (blackboard is astral); BMP Greek/arrows.

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
    `    <label>knot:</label>\n    ${btn('unknot', 'unknot', true)}\n    ${btn('trefoil', 'trefoil 3&#8321;', false)}\n    ${btn('fig8', 'figure-8 4&#8321;', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 600 472" width="600" height="472" role="img" aria-label="The Khovanov homology of the chosen knot as a bigraded table, with the alternating row sum recovering the Jones polynomial."><title>Khovanov homology of the chosen knot, displayed as a table indexed by homological degree across and quantum degree up, with the dimension of each bigraded piece in its cell. Below the table, the graded Euler characteristic — the alternating sum over homological degree of q to the quantum degree times the dimension — is computed and shown to equal the unnormalised Jones polynomial, demonstrating that Khovanov homology categorifies the Jones polynomial.</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* knot-polynomials-khovanov widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  // Rational unreduced Khovanov homology (Knot Atlas / Bar-Natan). cells: [i,j,dim]. V is the Jones polynomial V_L(t) as {power:coeff}.\n` +
    `  var KNOTS=[\n` +
    `    {k:'unknot', name:'unknot', Vstr:'1', V:{0:1}, cells:[[0,-1,1],[0,1,1]]},\n` +
    `    {k:'trefoil', name:'trefoil 3\\u2081 (right-handed)', Vstr:'t + t\\u00b3 \\u2212 t\\u2074', V:{1:1,3:1,4:-1}, cells:[[0,1,1],[0,3,1],[2,5,1],[3,9,1]]},\n` +
    `    {k:'fig8', name:'figure-eight 4\\u2081 (amphichiral)', Vstr:'t\\u207b\\u00b2 \\u2212 t\\u207b\\u00b9 + 1 \\u2212 t + t\\u00b2', V:{'-2':1,'-1':-1,0:1,1:-1,2:1}, cells:[[-2,-5,1],[-1,-1,1],[0,-1,1],[0,1,1],[1,1,1],[2,5,1]]}\n` +
    `  ];\n` +
    `  // Laurent-polynomial helpers ({power:coeff})\n` +
    `  function gradedEuler(cells){ var r={}; cells.forEach(function(c){ var s=((c[0]%2)===0?1:-1); r[c[1]]=(r[c[1]]||0)+s*c[2]; }); return clean(r); }\n` +
    `  function qqV(V){ var r={}; for(var t in V){ var j=2*(+t); r[j+1]=(r[j+1]||0)+V[t]; r[j-1]=(r[j-1]||0)+V[t]; } return clean(r); }\n` +
    `  function clean(p){ for(var k in p) if(p[k]===0) delete p[k]; return p; }\n` +
    `  function polyStr(P){ var ks=Object.keys(P).map(Number).sort(function(a,b){return a-b;}); if(!ks.length) return '0'; return ks.map(function(p,idx){ var c=P[p]; var sign=(c<0)?' \\u2212 ':(idx===0?'':' + '); var mag=Math.abs(c); var coef=(mag===1)?'':(''+mag); var pw=(p===0)?(coef||'1'):(coef+'q'+sup(p)); return (idx===0&&c<0?'\\u2212':'')+sign.trim()+(idx===0?'':' ')+pw; }).join(' ').replace(/\\s+/g,' ').trim(); }\n` +
    `  function sup(n){ var m=(n<0); n=Math.abs(n); var map={'0':'\\u2070','1':'\\u00b9','2':'\\u00b2','3':'\\u00b3','4':'\\u2074','5':'\\u2075','6':'\\u2076','7':'\\u2077','8':'\\u2078','9':'\\u2079'}; var s=(''+n).split('').map(function(d){return map[d];}).join(''); return (m?'\\u207b':'')+s; }\n` +
    `  var cur='unknot';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var K=null; for(var t=0;t<KNOTS.length;t++) if(KNOTS[t].k===cur) K=KNOTS[t];\n` +
    `    if(!K) return;\n` +
    `    svg.setAttribute('aria-label','Khovanov homology of the '+K.name+' as a bigraded table; the graded Euler characteristic recovers the Jones polynomial '+K.Vstr+'.');\n` +
    `    var imin=Infinity,imax=-Infinity,jmin=Infinity,jmax=-Infinity, dim={};\n` +
    `    K.cells.forEach(function(c){ imin=Math.min(imin,c[0]); imax=Math.max(imax,c[0]); jmin=Math.min(jmin,c[1]); jmax=Math.max(jmax,c[1]); dim[c[0]+','+c[1]]=c[2]; });\n` +
    `    txt(300,20,'Khovanov homology  Kh^{i,j}(K)  \\u2014  a bigraded vector space refining the Jones polynomial',{size:12,weight:700,fill:'var(--violet)'});\n` +
    `    txt(300,38,K.name+'      Jones  V_L(t) = '+K.Vstr,{size:11,fill:'var(--cyan)'});\n` +
    `    // grid geometry\n` +
    `    var ncol=imax-imin+1, nrow=(jmax-jmin)/2+1;\n` +
    `    var cw=Math.min(64, Math.floor(420/ncol)), chh=24, x0=140, y0=58;\n` +
    `    // axis captions\n` +
    `    txt(x0+ncol*cw/2, y0-4, 'homological degree  i  \\u2192', {size:9.5,fill:'var(--mute)'});\n` +
    `    txt(70, y0+nrow*chh/2, 'quantum', {size:9.5,fill:'var(--mute)'}); txt(70, y0+nrow*chh/2+12, 'degree j \\u2191', {size:9.5,fill:'var(--mute)'});\n` +
    `    // column headers (i)\n` +
    `    for(var i=imin;i<=imax;i++){ var cx=x0+(i-imin)*cw+cw/2; txt(cx, y0+10, 'i='+i, {size:10,weight:600,fill:'var(--violet)'}); }\n` +
    `    // rows (j from jmax down to jmin, step 2)\n` +
    `    var rIdx=0;\n` +
    `    for(var j=jmax;j>=jmin;j-=2){ var cy=y0+18+rIdx*chh; txt(x0-12, cy+chh/2+3, 'j='+j, {size:10,weight:600,anchor:'end',fill:'var(--violet)'});\n` +
    `      for(var i2=imin;i2<=imax;i2++){ var cx2=x0+(i2-imin)*cw; var d=dim[i2+','+j]||0;\n` +
    `        svg.appendChild(mk('rect',{x:cx2,y:cy,width:cw-3,height:chh-3,rx:3,fill: d>0?'var(--cyan)':'var(--panel2)','fill-opacity': d>0?0.22:1,stroke: d>0?'var(--cyan)':'var(--line)','stroke-width': d>0?1.4:0.5}));\n` +
    `        if(d>0) txt(cx2+(cw-3)/2, cy+(chh-3)/2+4, ''+d, {size:12,weight:700,fill:'var(--cyan)'});\n` +
    `      }\n` +
    `      rIdx++;\n` +
    `    }\n` +
    `    var gridBot=y0+18+nrow*chh+6;\n` +
    `    // decategorification\n` +
    `    var eul=gradedEuler(K.cells), rhs=qqV(K.V);\n` +
    `    var match=true; var ks=new Set(); for(var a in eul)ks.add(a); for(var b in rhs)ks.add(b); ks.forEach(function(k){ if((eul[k]||0)!==(rhs[k]||0)) match=false; });\n` +
    `    txt(300, gridBot+8, 'decategorify: take the graded Euler characteristic of the table', {size:9.5,fill:'var(--mute)'});\n` +
    `    txt(300, gridBot+30, '\\u2211 (\\u22121)\\u2071 q\\u02b2 dim Kh^{i,j}  =  '+polyStr(eul), {size:12,mono:true,weight:600,fill:'var(--ink)'});\n` +
    `    txt(300, gridBot+52, '(q + q\\u207b\\u00b9) \\u00b7 V_L(q\\u00b2)  =  '+polyStr(rhs), {size:12,mono:true,weight:600,fill:'var(--pink)'});\n` +
    `    txt(300, gridBot+76, match? '\\u2713  equal \\u2014 Khovanov homology CATEGORIFIES the (unnormalised) Jones polynomial' : 'mismatch!', {size:11,weight:700,fill: match?'var(--green)':'var(--pink)'});\n` +
    `    out.textContent = 'KHOVANOV HOMOLOGY (1999) categorifies the Jones polynomial: it replaces each power of q by a vector space and the Kauffman state sum by a bigraded CHAIN COMPLEX whose homology Kh^{i,j}(L) is a link invariant. Build it from an oriented diagram: each circle in a Kauffman smoothing contributes a copy of the 2-dimensional graded algebra A = \\u211a\\u27e81, X\\u27e9 (deg 1 = +1, deg X = \\u22121); flipping a 0-smoothing to a 1-smoothing merges two circles by multiplication (X\\u00b2 = 0) or splits one by comultiplication, giving a differential d with d\\u00b2 = 0. The bigraded homology is invariant under the three Reidemeister moves up to chain-homotopy. The table above is Kh^{i,j} for the '+K.name+' (rational coefficients, so each cell is just a dimension). DECATEGORIFICATION recovers Jones: the graded Euler characteristic \\u2211_{i,j} (\\u22121)\\u2071 q\\u02b2 dim Kh^{i,j} equals (q + q\\u207b\\u00b9) V_L(q\\u00b2), the unnormalised Jones polynomial \\u2014 the table above and the polynomial below it are two independent computations that agree. But the categorification is STRICTLY STRONGER: Khovanov homology distinguishes pairs of knots (and detects the unknot, by Kronheimer\\u2013Mrowka) where Jones alone cannot, and it is FUNCTORIAL \\u2014 a cobordism of links induces a map on homology, the input to Rasmussen\\u2019s s-invariant and a combinatorial proof of the Milnor conjecture.';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b||!b.getAttribute('data-k')) return; cur=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
