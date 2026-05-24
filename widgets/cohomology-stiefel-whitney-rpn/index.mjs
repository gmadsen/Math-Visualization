// cohomology-stiefel-whitney-rpn widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Stiefel-Whitney classes of RP^n from the Whitney
// sum formula: w(T RP^n) = (1+a)^{n+1} in Z/2[a]/(a^{n+1}), so
// w_i = C(n+1,i) mod 2 -- drawn as Pascal's triangle mod 2 (Sierpinski).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">dimension $n$ of $\\mathbb{RP}^n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="1" max="12" value="4" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nv">n = 4</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="Pascal's triangle mod 2 up to row n+1, with the bottom row giving the Stiefel-Whitney classes of RP^n"><title>Pascal's triangle mod 2 (the Sierpinski pattern): row n+1 gives the Stiefel-Whitney classes w_i = C(n+1,i) mod 2 of RP^n, truncated at a^{n+1}</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* cohomology-stiefel-whitney-rpn widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sn=document.getElementById('${widgetId}-n'), nv=document.getElementById('${widgetId}-nv');\n` +
    `  if(!svg||!out||!sn||!nv) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  function bin2(N,i){ return ((i & N)===i)?1:0; }\n` +  // C(N,i) mod 2 via Lucas
    `  function sup(n){ var m={0:'\\u2070',1:'\\u00b9',2:'\\u00b2',3:'\\u00b3',4:'\\u2074',5:'\\u2075',6:'\\u2076',7:'\\u2077',8:'\\u2078',9:'\\u2079'}; return (''+n).split('').map(function(d){return m[d];}).join(''); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var n=parseInt(sn.value,10); nv.textContent='n = '+n;\n` +
    `    var R=n+1;\n` +  // bottom row index
    `    var rows=R+1;\n` +  // rows 0..R
    `    var TY0=40, CX=255;\n` +
    `    var cw=Math.min(30, 380/(R+2)), ch=Math.min(cw, 200/(rows)), sq=Math.min(cw,ch)*0.82;\n` +
    `    // Pascal triangle mod 2\n` +
    `    for(var r=0;r<=R;r++){ for(var i=0;i<=r;i++){ var on=bin2(r,i); var x=CX+(i-r/2)*cw, y=TY0+r*ch;\n` +
    `      var isBottom=(r===R); var isClass=isBottom && i<=n; var isTrunc=isBottom && i===R;\n` +
    `      var fill = on ? (isClass?'var(--green)':'var(--cyan)') : 'none';\n` +
    `      var op = isBottom?1:(on?0.5:0.18);\n` +
    `      svg.appendChild(mk('rect',{x:(x-sq/2).toFixed(1), y:(y-sq/2).toFixed(1), width:sq.toFixed(1), height:sq.toFixed(1), rx:1.5, fill:fill, 'fill-opacity':op, stroke: on?'none':'var(--line)', 'stroke-width':0.6}));\n` +
    `      if(isBottom){ svg.appendChild(mk('rect',{x:(x-sq/2-1).toFixed(1), y:(y-sq/2-1).toFixed(1), width:(sq+2).toFixed(1), height:(sq+2).toFixed(1), rx:2, fill:'none', stroke: isTrunc?'var(--mute)':(isClass?'var(--green)':'var(--ink)'), 'stroke-width':1.2, 'stroke-dasharray': isTrunc?'2 2':''}));\n` +
    `        if(isTrunc) svg.appendChild(mk('line',{x1:(x-sq/2).toFixed(1),y1:(y-sq/2).toFixed(1),x2:(x+sq/2).toFixed(1),y2:(y+sq/2).toFixed(1),stroke:'var(--mute)','stroke-width':1})); } } }\n` +
    `    // label the bottom row\n` +
    `    txt(CX-(R/2+1.4)*cw, TY0+R*ch+3, 'row '+R, {anchor:'end', size:9, fill:'var(--mute)'});\n` +
    `    txt(CX, TY0+R*ch+sq/2+16, 'w\\u2080 \\u2026 w\\u2099  (boxed; last entry = a\\u207f\\u207a\\u00b9 = 0, crossed)', {size:9, fill:'var(--mute)'});\n` +
    `    // build w polynomial + facts\n` +
    `    var warr=[]; for(var j=0;j<=n;j++) warr.push(bin2(R,j));\n` +
    `    var terms=[]; for(j=0;j<=n;j++){ if(warr[j]) terms.push(j===0?'1':(j===1?'a':'a'+sup(j))); }\n` +
    `    var wpoly = terms.join(' + ');\n` +
    `    var w1=warr[1]||0;\n` +
    `    var trivial=true; for(j=1;j<=n;j++){ if(warr[j]){ trivial=false; break; } }\n` +
    `    var isPow2=((R & (R-1))===0);\n` +
    `    txt(CX, TY0+R*ch+sq/2+34, 'w(T\\u211dP\\u207f) = (1+a)\\u207f\\u207a\\u00b9 = '+wpoly, {size:12, weight:700, fill:'var(--ink)'});\n` +
    `    out.textContent='Characteristic classes meet the cup product through the Whitney sum formula w(\\u03be \\u2295 \\u03b7) = w(\\u03be) \\u2323 w(\\u03b7). For real projective space, the tangent bundle satisfies T\\u211dP\\u207f \\u2295 \\u03b5\\u00b9 \\u2245 (n+1) copies of the tautological line bundle \\u03b3 (each with total Stiefel\\u2013Whitney class 1 + a, where a generates H*(\\u211dP\\u207f; \\u2124/2) = \\u2124/2[a]/(a\\u207f\\u207a\\u00b9)). So the Whitney sum formula collapses to an (n+1)-fold cup product: w(T\\u211dP\\u207f) = (1+a)\\u207f\\u207a\\u00b9, and the binomial theorem mod 2 gives w_i = C(n+1, i) mod 2 \\u2014 exactly row '+R+' of Pascal\\u2019s triangle mod 2 (the Sierpi\\u0144ski pattern above), truncated at a\\u207f\\u207a\\u00b9 = 0. For n = '+n+': w(T\\u211dP\\u207f) = '+wpoly+'. Two consequences fall straight out. (1) ORIENTABILITY: \\u211dP\\u207f is orientable iff w\\u2081 = 0; here w\\u2081 = C(n+1,1) mod 2 = (n+1) mod 2, so \\u211dP\\u207f is orientable iff n is ODD \\u2014 here w\\u2081 = '+w1+', so \\u211dP'+sup(n)+' is '+(w1===0?'ORIENTABLE':'NON-orientable')+'. (2) PARALLELIZABILITY: if \\u211dP\\u207f is parallelizable (or even stably trivial) then w(T\\u211dP\\u207f) = 1, i.e. all w_i = 0 for i \\u2265 1; by Kummer\\u2019s theorem (1+a)\\u207f\\u207a\\u00b9 \\u2261 1 mod 2 (truncated) exactly when n+1 is a power of 2. Here n+1 = '+R+(isPow2?' IS':' is NOT')+' a power of 2, so the total class is '+(trivial?'TRIVIAL':'nontrivial')+(trivial?' \\u2014 the obstruction vanishes (this is necessary, and indeed \\u211dP\\u00b9, \\u211dP\\u00b3, \\u211dP\\u2077 are exactly the parallelizable real projective spaces).':' \\u2014 \\u211dP\\u207f is definitely NOT parallelizable.');\n` +
    `  }\n` +
    `  sn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
