// rep-theory-homomorphism widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A representation is a homomorphism ρ: G → GL(V).
// For S₃ and three reps (trivial, sign, the 3-dim permutation rep), pick g, h
// and watch ρ(g)ρ(h) = ρ(gh) hold matrix-by-matrix, with χ(g) = tr ρ(g).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const LBL = ['e', '(1 2)', '(1 3)', '(2 3)', '(1 2 3)', '(1 3 2)'];
  const elBtns = (kind) => LBL.map((l, i) =>
    `    <button type="button" id="${widgetId}-${kind}${i}">${l}</button>`).join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">representation</span>\n` +
    `    <button type="button" id="${widgetId}-rtriv">trivial</button>\n` +
    `    <button type="button" id="${widgetId}-rsign">sign</button>\n` +
    `    <button type="button" id="${widgetId}-rperm">permutation (deg 3)</button>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">$g$</span>\n` +
    elBtns('g') + `\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">$h$</span>\n` +
    elBtns('h') + `\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 300" width="580" height="300" role="img" aria-label="The matrices of a representation of S3, showing that rho of g times rho of h equals rho of gh"><title>A representation is a homomorphism: the matrix product rho(g)rho(h) equals rho(gh), and the character is the trace</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* rep-theory-homomorphism widget: ${widgetId} */\n` +
    `(function(){\n` +
    // S3 elements as permutations of {0,1,2} (p[i] = image of i)
    `  var ELS=[{lbl:'e',p:[0,1,2],sgn:1},{lbl:'(1 2)',p:[1,0,2],sgn:-1},{lbl:'(1 3)',p:[2,1,0],sgn:-1},{lbl:'(2 3)',p:[0,2,1],sgn:-1},{lbl:'(1 2 3)',p:[1,2,0],sgn:1},{lbl:'(1 3 2)',p:[2,0,1],sgn:1}];\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var rB={triv:document.getElementById('${widgetId}-rtriv'), sign:document.getElementById('${widgetId}-rsign'), perm:document.getElementById('${widgetId}-rperm')};\n` +
    `  var gB=[], hB=[]; for(var i=0;i<6;i++){ gB.push(document.getElementById('${widgetId}-g'+i)); hB.push(document.getElementById('${widgetId}-h'+i)); }\n` +
    `  if(!svg||!out||!rB.triv||!rB.sign||!rB.perm||gB.some(function(b){return !b;})||hB.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    // group operations
    `  function compose(a,b){ var r=[]; for(var i=0;i<3;i++) r[i]=a[b[i]]; return r; }\n` + // (a∘b)(i)=a(b(i))
    `  function idxOf(p){ for(var k=0;k<6;k++){ if(ELS[k].p[0]===p[0]&&ELS[k].p[1]===p[1]&&ELS[k].p[2]===p[2]) return k; } return -1; }\n` +
    // representation matrices
    `  function rho(el){ if(rep==='triv') return [[1]]; if(rep==='sign') return [[el.sgn]];\n` +
    `    var M=[[0,0,0],[0,0,0],[0,0,0]]; for(var i=0;i<3;i++) M[el.p[i]][i]=1; return M; }\n` +
    `  function matmul(A,B){ var n=A.length, m=B[0].length, k=B.length, C=[]; for(var i=0;i<n;i++){ C[i]=[]; for(var j=0;j<m;j++){ var s=0; for(var t=0;t<k;t++) s+=A[i][t]*B[t][j]; C[i][j]=s; } } return C; }\n` +
    `  function trace(M){ var s=0; for(var i=0;i<M.length;i++) s+=M[i][i]; return s; }\n` +
    `  function eq(A,B){ if(A.length!==B.length||A[0].length!==B[0].length) return false; for(var i=0;i<A.length;i++) for(var j=0;j<A[0].length;j++) if(A[i][j]!==B[i][j]) return false; return true; }\n` +
    // draw a matrix with brackets at top-left (x,y)
    `  function drawMat(x,y,M,col){ var rows=M.length, cols=M[0].length, cell=24, w=cols*cell, h=rows*cell;\n` +
    `    svg.appendChild(mk('path',{d:'M '+(x+6)+' '+y+' L '+x+' '+y+' L '+x+' '+(y+h)+' L '+(x+6)+' '+(y+h),stroke:col||'var(--ink)','stroke-width':1.2,fill:'none'}));\n` +
    `    svg.appendChild(mk('path',{d:'M '+(x+w-6)+' '+y+' L '+(x+w)+' '+y+' L '+(x+w)+' '+(y+h)+' L '+(x+w-6)+' '+(y+h),stroke:col||'var(--ink)','stroke-width':1.2,fill:'none'}));\n` +
    `    for(var r=0;r<rows;r++) for(var c=0;c<cols;c++) txt(x+c*cell+cell/2, y+r*cell+cell/2+4, ''+M[r][c], {size:12, anchor:'middle', fill:M[r][c]?'var(--ink)':'var(--mute)'});\n` +
    `    return {w:w,h:h}; }\n` +
    `  var rep='perm', gi=4, hi=1;\n` + // default: permutation rep, g=(1 2 3), h=(1 2)
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    rB.triv.classList.toggle('active',rep==='triv'); rB.triv.setAttribute('aria-pressed',rep==='triv'?'true':'false');\n` +
    `    rB.sign.classList.toggle('active',rep==='sign'); rB.sign.setAttribute('aria-pressed',rep==='sign'?'true':'false');\n` +
    `    rB.perm.classList.toggle('active',rep==='perm'); rB.perm.setAttribute('aria-pressed',rep==='perm'?'true':'false');\n` +
    `    gB.forEach(function(b,i){ b.classList.toggle('active',i===gi); b.setAttribute('aria-pressed',i===gi?'true':'false'); });\n` +
    `    hB.forEach(function(b,i){ b.classList.toggle('active',i===hi); b.setAttribute('aria-pressed',i===hi?'true':'false'); });\n` +
    `    var g=ELS[gi], h=ELS[hi], ghp=compose(g.p,h.p), gh=ELS[idxOf(ghp)];\n` +
    `    var Rg=rho(g), Rh=rho(h), prod=matmul(Rg,Rh), Rgh=rho(gh), ok=eq(prod,Rgh);\n` +
    `    var y1=58;\n` +
    `    txt(40, y1-14, '\\u03c1(g)', {size:12, fill:'var(--yellow)', weight:600}); var d1=drawMat(40, y1, Rg, 'var(--yellow)');\n` +
    `    txt(40+d1.w+18, y1+d1.h/2+4, '\\u00b7', {size:18, fill:'var(--mute)'});\n` +
    `    var x2=40+d1.w+36; txt(x2, y1-14, '\\u03c1(h)', {size:12, fill:'var(--cyan)', weight:600}); var d2=drawMat(x2, y1, Rh, 'var(--cyan)');\n` +
    `    var x3=x2+d2.w+18; txt(x3, y1+d2.h/2+4, '=', {size:16, fill:'var(--mute)'});\n` +
    `    var x4=x3+22; txt(x4, y1-14, '\\u03c1(g)\\u03c1(h)', {size:12, fill:'var(--ink)', weight:600}); var d3=drawMat(x4, y1, prod, 'var(--ink)');\n` +
    // second row: rho(gh)
    `    var y2=y1+Math.max(d1.h,72)+44;\n` +
    `    txt(40, y2-14, 'g\\u00b7h = '+g.lbl+' \\u00b7 '+h.lbl+' = '+gh.lbl+'   \\u21d2   \\u03c1(gh)', {size:12, fill:'var(--ink)'});\n` +
    `    var d4=drawMat(40, y2, Rgh, ok?'var(--green)':'var(--pink)');\n` +
    `    svg.appendChild(mk('text',{x:40+d4.w+22,y:y2+d4.h/2+5,'font-size':15,fill:ok?'var(--green)':'var(--pink)','font-weight':700}, ok?'\\u2713':'\\u2717'));\n` +
    `    txt(40+d4.w+44, y2+d4.h/2+5, ok?'\\u03c1(gh) = \\u03c1(g)\\u03c1(h)  \\u2014  homomorphism':'mismatch', {size:12, fill:ok?'var(--green)':'var(--pink)'});\n` +
    // character panel (right)
    `    var TX=380;\n` +
    `    txt(TX, y1-14, 'character  \\u03c7(g) = tr \\u03c1(g)', {size:12, fill:'var(--ink)', weight:600});\n` +
    `    txt(TX, y1+10, '\\u03c7(g) = '+trace(Rg), {size:12, fill:'var(--yellow)'});\n` +
    `    txt(TX, y1+30, '\\u03c7(h) = '+trace(Rh), {size:12, fill:'var(--cyan)'});\n` +
    `    txt(TX, y1+50, '\\u03c7(gh) = '+trace(Rgh), {size:12, fill:'var(--ink)'});\n` +
    `    txt(TX, y1+78, 'degree = dim V = '+Rg.length, {size:11, fill:'var(--mute)'});\n` +
    `    var faithful = rep==='perm'; var kernelNote = rep==='triv'?'kernel = all of S\\u2083 (very unfaithful)':(rep==='sign'?'kernel = A\\u2083 (the 3-cycles)':'kernel = {e} (faithful)');\n` +
    `    txt(TX, y1+98, kernelNote, {size:11, fill:'var(--mute)'});\n` +
    // readout
    `    var repName = rep==='triv'?'trivial representation (every g \\u21a6 [1])':(rep==='sign'?'sign representation (g \\u21a6 [sgn g] = \\u00b11)':'permutation representation on \\u2102\\u00b3 (g permutes coordinates)');\n` +
    `    out.textContent = 'A representation of G is a homomorphism \\u03c1: G \\u2192 GL(V): each group element becomes an invertible matrix, and group multiplication becomes matrix multiplication, \\u03c1(gh) = \\u03c1(g)\\u03c1(h). Shown: the '+repName+' of S\\u2083, with g = '+g.lbl+' and h = '+h.lbl+', so gh = '+gh.lbl+'. The product \\u03c1(g)\\u03c1(h) '+(ok?'equals':'does NOT equal')+' \\u03c1(gh) \\u2014 that identity, holding for every pair, is exactly what makes \\u03c1 a representation. The character \\u03c7(g) = tr \\u03c1(g) is constant on conjugacy classes; for the permutation rep it counts the points g fixes. '+kernelNote+'.';\n` +
    `  }\n` +
    `  rB.triv.addEventListener('click', function(){ rep='triv'; draw(); });\n` +
    `  rB.sign.addEventListener('click', function(){ rep='sign'; draw(); });\n` +
    `  rB.perm.addEventListener('click', function(){ rep='perm'; draw(); });\n` +
    `  gB.forEach(function(b,i){ b.addEventListener('click', function(){ gi=i; draw(); }); });\n` +
    `  hB.forEach(function(b,i){ b.addEventListener('click', function(){ hi=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
