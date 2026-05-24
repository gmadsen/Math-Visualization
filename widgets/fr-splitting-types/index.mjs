// fr-splitting-types widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The splitting type (r,f), rf=n, of an unramified
// prime in a Galois extension: r primes of residue degree f, Frobenius = r
// disjoint f-cycles, f-bar factors into r degree-f irreducibles over F_p.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">degree $n=[K:\\mathbb{Q}]$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="2" max="8" value="6" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nv">n = 6</span>\n` +
    `  </div>\n` +
    `  <div class="row"><span class="note">splitting type $(r,f)$ with $rf=n$:</span>\n` +
    `    <span id="${widgetId}-pairs" style="display:inline-flex;gap:.35rem;flex-wrap:wrap"></span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="The r primes above p drawn as r disjoint f-cycles of Frobenius"><title>Splitting type (r,f): p splits into r primes of residue degree f, and Frobenius acts as r disjoint f-cycles on the n roots</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* fr-splitting-types widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sn=document.getElementById('${widgetId}-n'), nv=document.getElementById('${widgetId}-nv');\n` +
    `  var pairsBox=document.getElementById('${widgetId}-pairs');\n` +
    `  if(!svg||!out||!sn||!pairsBox) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var SUB=['\\u2080','\\u2081','\\u2082','\\u2083','\\u2084','\\u2085','\\u2086','\\u2087','\\u2088'];\n` +
    `  function sub(i){ var s=''+i,o=''; for(var k=0;k<s.length;k++) o+=SUB[+s[k]]; return o; }\n` +
    `  var n=6, ri=2;\n` +  // ri = chosen number of primes r
    `  function divisors(m){ var o=[]; for(var d=1;d<=m;d++) if(m%d===0) o.push(d); return o; }\n` +
    `  function ensureValid(){ if(n%ri!==0){ var ds=divisors(n); ri=ds[0]; } }\n` +
    `  function buildPairs(){\n` +
    `    pairsBox.innerHTML=''; var ds=divisors(n);\n` +
    `    ds.forEach(function(r){ var f=n/r;\n` +
    `      var b=document.createElement('button'); b.type='button'; var on=(r===ri);\n` +
    `      b.style.cssText='padding:.1rem .5rem;border-radius:6px;background:var(--panel2);cursor:pointer;font-size:12px;border:1px solid '+(on?'var(--yellow)':'var(--line)')+';color:'+(on?'var(--yellow)':'var(--mute)')+';font-weight:'+(on?'700':'400');\n` +
    `      b.textContent='('+r+','+f+')'; b.setAttribute('aria-pressed', on?'true':'false'); b.setAttribute('aria-label','splitting type r='+r+' f='+f);\n` +
    `      b.addEventListener('click', function(){ ri=r; buildPairs(); draw(); });\n` +
    `      pairsBox.appendChild(b);\n` +
    `    });\n` +
    `  }\n` +
    // draw one f-cycle of dots at (cx,cy) radius R with directional arrows
    `  function drawCycle(cx,cy,R,f,col){\n` +
    `    if(f===1){ svg.appendChild(mk('circle',{cx:cx,cy:cy,r:4,fill:col})); return; }\n` +
    `    var pos=[]; for(var k=0;k<f;k++){ var a=-Math.PI/2 + k*2*Math.PI/f; pos.push([cx+R*Math.cos(a), cy+R*Math.sin(a)]); }\n` +
    `    for(k=0;k<f;k++){ var p0=pos[k], p1=pos[(k+1)%f];\n` +
    `      var mx=(p0[0]+p1[0])/2, my=(p0[1]+p1[1])/2; var dx=p1[0]-p0[0], dy=p1[1]-p0[1], L=Math.hypot(dx,dy)||1; var ux=dx/L, uy=dy/L;\n` +
    `      svg.appendChild(mk('line',{x1:p0[0],y1:p0[1],x2:p1[0],y2:p1[1],stroke:col,'stroke-width':1.3,'stroke-opacity':0.8}));\n` +  // segment
    `      svg.appendChild(mk('path',{d:'M '+(mx)+' '+(my)+' L '+(mx-6*ux+3*uy)+' '+(my-6*uy-3*ux)+' L '+(mx-6*ux-3*uy)+' '+(my-6*uy+3*ux)+' Z', fill:col}));\n` +  // arrowhead at midpoint
    `    }\n` +
    `    for(k=0;k<f;k++){ svg.appendChild(mk('circle',{cx:pos[k][0],cy:pos[k][1],r:3.5,fill:col})); }\n` +
    `  }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    ensureValid(); nv.textContent='n = '+n; var r=ri, f=n/r;\n` +
    `    var name = r===n ? 'completely split' : (r===1 ? 'inert' : 'partially split');\n` +
    `    var col  = r===n ? 'var(--green)' : (r===1 ? 'var(--pink)' : 'var(--cyan)');\n` +
    `    txt(280, 34, name+'   (r, f) = ('+r+', '+f+')', {size:14, fill:col, weight:700});\n` +
    `    txt(280, 52, 'p\\u00b7O_K = '+Array.from({length:r},function(_,i){return 'P'+sub(i+1);}).join(' ')+(r<n?'':'')+',   each residue degree f = '+f, {size:11, fill:'var(--mute)'});\n` +
    // r cycles in a row (wrap if many)
    `    var perRow=Math.min(r,4), rows=Math.ceil(r/perRow);\n` +
    `    var cellW=440/perRow, cellH=Math.min(120,180/rows), x0=60, y0=110;\n` +
    `    var R=Math.min(cellW,cellH)/2-22; if(R<10) R=10;\n` +
    `    for(var i=0;i<r;i++){ var rr=Math.floor(i/perRow), cc=i%perRow; var cx=x0+cellW*cc+cellW/2, cy=y0+cellH*rr+cellH/2-6;\n` +
    `      drawCycle(cx,cy,R,f,col);\n` +
    `      txt(cx, cy+cellH/2-2, 'P'+sub(i+1)+' (f='+f+')', {size:10, fill:'var(--ink)'});\n` +
    `    }\n` +
    // panel
    `    var by=y0+rows*cellH+18;\n` +
    `    txt(280, by, 'Frobenius cycle shape on the '+n+' roots:  ('+Array(r).fill(f).join(', ')+')', {size:11, fill:'var(--ink)', weight:600});\n` +
    `    txt(280, by+20, 'f\\u0304(x) \\u2261 '+(r===1?'one irreducible of degree '+f:r+' distinct irreducibles of degree '+f)+'  (mod p)', {size:10, fill:'var(--mute)'});\n` +
    `    txt(280, by+38, 'order of Frob_p = lcm of cycle lengths = '+f, {size:10, fill:col});\n` +
    `    out.textContent = 'For an unramified prime p in a Galois extension K/Q of degree n='+n+', p factors as p\\u00b7O_K = P_1\\u00b7\\u00b7\\u00b7P_'+r+' into r='+r+' primes, all of the SAME residue degree f='+f+' (the Galois group permutes them transitively), with rf=n. This is the splitting type ('+r+','+f+'): '+name+'. Frobenius acts on the n roots of f as r disjoint f-cycles \\u2014 cycle shape ('+Array(r).fill(f).join(',')+') \\u2014 so f\\u0304(x) factors mod p into '+r+' distinct irreducible'+(r===1?'':'s')+' of degree '+f+', and Frob_p has order '+f+'. '+(r===n?'Completely split: f\\u0304 splits into n linear factors, Frobenius is the identity \\u2014 K looks like copies of F_p here.':(r===1?'Inert: p stays prime, f\\u0304 is irreducible of degree n, Frobenius is a single n-cycle generating G \\u2014 the most twisted prime.':'Partially split: an intermediate shape with 1<r<n.'))+' (Ramified primes, where some e_i>1 and p | disc, are the finite exceptional set where this dictionary breaks.)';\n` +
    `  }\n` +
    `  sn.addEventListener('input', function(){ n=parseInt(sn.value,10); ensureValid(); buildPairs(); draw(); });\n` +
    `  buildPairs(); draw();\n` +
    `})();\n` +
    `</script>`
  );
}
