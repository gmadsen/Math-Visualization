// rep-theory-orthogonality widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The first orthogonality relation for irreducible
// characters, ⟨χλ,χμ⟩ = δλμ. Pick a group (S₃ or C₄) and two irreducible
// characters; the widget shows the character table and computes the
// class-weighted Hermitian inner product (1/|G|)·Σ_C |C|·χλ(C)·conj(χμ(C)) term
// by term. C₄'s characters are complex, so the conjugate matters.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const rowBtns = (kind) => {
    let s = '';
    for (let i = 0; i < 4; i++) s += `    <button type="button" id="${widgetId}-${kind}${i}">${i + 1}</button>\n`;
    return s;
  };
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">group</span>\n` +
    `    <button type="button" id="${widgetId}-gS3">$S_3$</button>\n` +
    `    <button type="button" id="${widgetId}-gC4">$C_4$</button>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">character $\\chi_\\lambda$ (row)</span>\n` +
    rowBtns('l') +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">character $\\chi_\\mu$ (row)</span>\n` +
    rowBtns('m') +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 340" width="580" height="340" role="img" aria-label="A character table and the weighted inner product of two irreducible characters"><title>First orthogonality relation: the inner product of two irreducible characters, weighted by conjugacy-class size, is 1 if the characters agree and 0 otherwise</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  // character-table data; characters stored as complex [re, im].
  // NB: labels use literal BMP unicode (not \\uXXXX) because this object is
  // serialized with JSON.stringify — an escape here would survive as a literal
  // backslash in the emitted JSON.
  const GROUPS = {
    S3: {
      name: 'S₃', order: 6,
      classes: [{ lbl: 'e', size: 1 }, { lbl: '(a b)', size: 3 }, { lbl: '(a b c)', size: 2 }],
      irreps: [
        { lbl: 'trivial', ch: [[1, 0], [1, 0], [1, 0]] },
        { lbl: 'sign', ch: [[1, 0], [-1, 0], [1, 0]] },
        { lbl: 'standard', ch: [[2, 0], [0, 0], [-1, 0]] }
      ]
    },
    C4: {
      name: 'C₄', order: 4,
      classes: [{ lbl: 'e', size: 1 }, { lbl: 'g', size: 1 }, { lbl: 'g²', size: 1 }, { lbl: 'g³', size: 1 }],
      irreps: [
        { lbl: 'χ₀', ch: [[1, 0], [1, 0], [1, 0], [1, 0]] },
        { lbl: 'χ₁', ch: [[1, 0], [0, 1], [-1, 0], [0, -1]] },
        { lbl: 'χ₂', ch: [[1, 0], [-1, 0], [1, 0], [-1, 0]] },
        { lbl: 'χ₃', ch: [[1, 0], [0, -1], [-1, 0], [0, 1]] }
      ]
    }
  };
  return (
    `<script>\n` +
    `/* rep-theory-orthogonality widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var GROUPS=${JSON.stringify(GROUPS)};\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var gS3=document.getElementById('${widgetId}-gS3'), gC4=document.getElementById('${widgetId}-gC4');\n` +
    `  var lB=[], mB=[]; for(var i=0;i<4;i++){ lB.push(document.getElementById('${widgetId}-l'+i)); mB.push(document.getElementById('${widgetId}-m'+i)); }\n` +
    `  if(!svg||!out||!gS3||!gC4||lB.some(function(b){return !b;})||mB.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    // complex helpers
    `  function cmul(a,b){ return [a[0]*b[0]-a[1]*b[1], a[0]*b[1]+a[1]*b[0]]; }\n` +
    `  function cconj(a){ return [a[0], -a[1]]; }\n` +
    `  function fmt(c){ var re=Math.round(c[0]*1000)/1000, im=Math.round(c[1]*1000)/1000;\n` +
    `    if(Math.abs(im)<1e-9) return (re<0?'\\u2212'+Math.abs(re):''+re);\n` +
    `    if(Math.abs(re)<1e-9){ if(Math.abs(im-1)<1e-9) return 'i'; if(Math.abs(im+1)<1e-9) return '\\u2212i'; return (im<0?'\\u2212':'')+Math.abs(im)+'i'; }\n` +
    `    return re+(im<0?'\\u2212':'+')+(Math.abs(im-1)<1e-9||Math.abs(im+1)<1e-9?'':Math.abs(im))+'i'; }\n` +
    `  var gk='S3', li=0, mi=2;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var G=GROUPS[gk], nC=G.classes.length, nI=G.irreps.length;\n` +
    `    if(li>=nI) li=0; if(mi>=nI) mi=nI-1;\n` +
    `    gS3.classList.toggle('active',gk==='S3'); gS3.setAttribute('aria-pressed',gk==='S3'?'true':'false');\n` +
    `    gC4.classList.toggle('active',gk==='C4'); gC4.setAttribute('aria-pressed',gk==='C4'?'true':'false');\n` +
    `    lB.forEach(function(b,i){ b.style.display=(i<nI)?'':'none'; b.classList.toggle('active',i===li); b.setAttribute('aria-pressed',i===li?'true':'false'); });\n` +
    `    mB.forEach(function(b,i){ b.style.display=(i<nI)?'':'none'; b.classList.toggle('active',i===mi); b.setAttribute('aria-pressed',i===mi?'true':'false'); });\n` +
    // table geometry
    `    var x0=40, cw=Math.min(92,(380)/(nC)), rh=26, y0=64;\n` +
    `    var colX=function(c){ return x0+120+c*cw; };\n` +
    `    txt(x0, y0-22, 'character table of '+G.name, {size:12, fill:'var(--ink)', weight:600});\n` +
    // class headers
    `    for(var c=0;c<nC;c++){ txt(colX(c)+cw/2, y0-4, G.classes[c].lbl, {size:11, fill:'var(--violet)', anchor:'middle'}); txt(colX(c)+cw/2, y0+9, '|C|='+G.classes[c].size, {size:9, fill:'var(--mute)', anchor:'middle'}); }\n` +
    // highlight rows li, mi
    `    function rowY(i){ return y0+18+i*rh; }\n` +
    `    if(li===mi){ svg.appendChild(mk('rect',{x:x0-4,y:rowY(li)-1,width:120+nC*cw+8,height:rh,fill:'var(--green)','fill-opacity':0.14})); }\n` +
    `    else { svg.appendChild(mk('rect',{x:x0-4,y:rowY(li)-1,width:120+nC*cw+8,height:rh,fill:'var(--yellow)','fill-opacity':0.13})); svg.appendChild(mk('rect',{x:x0-4,y:rowY(mi)-1,width:120+nC*cw+8,height:rh,fill:'var(--cyan)','fill-opacity':0.13})); }\n` +
    // table body
    `    for(var r=0;r<nI;r++){ txt(x0, rowY(r)+rh-10, G.irreps[r].lbl, {size:11, fill:(r===li?'var(--yellow)':(r===mi?'var(--cyan)':'var(--ink)')), weight:(r===li||r===mi)?600:400});\n` +
    `      for(var cc=0;cc<nC;cc++){ txt(colX(cc)+cw/2, rowY(r)+rh-10, fmt(G.irreps[r].ch[cc]), {size:12, fill:'var(--ink)', anchor:'middle'}); } }\n` +
    // inner product computation
    `    var iy=rowY(nI)+24;\n` +
    `    var lam=G.irreps[li], mu=G.irreps[mi];\n` +
    `    txt(x0, iy, '\\u27e8\\u03c7'+(li+1)+', \\u03c7'+(mi+1)+'\\u27e9 = (1/'+G.order+') \\u03a3 |C|\\u00b7\\u03c7'+(li+1)+'(C)\\u00b7\\u03c7'+(mi+1)+'(C)\\u0305', {size:12, fill:'var(--ink)'});\n` +
    `    var terms=[], sum=[0,0];\n` +
    `    for(var c2=0;c2<nC;c2++){ var t=cmul([G.classes[c2].size,0], cmul(lam.ch[c2], cconj(mu.ch[c2]))); sum=[sum[0]+t[0], sum[1]+t[1]]; terms.push(G.classes[c2].size+'\\u00b7('+fmt(lam.ch[c2])+')('+fmt(cconj(mu.ch[c2]))+')'); }\n` +
    `    txt(x0+8, iy+22, '= (1/'+G.order+') [ '+terms.join('  +  ')+' ]', {size:10, fill:'var(--mute)'});\n` +
    `    var res=[sum[0]/G.order, sum[1]/G.order];\n` +
    `    var isOne=Math.abs(res[0]-1)<1e-9 && Math.abs(res[1])<1e-9;\n` +
    `    var verdict = '= '+fmt(res)+'  =  \\u03b4\\u03bb\\u03bc'+(li===mi?'  (\\u03bb = \\u03bc \\u2014 orthonormal)':'  (\\u03bb \\u2260 \\u03bc \\u2014 orthogonal)');\n` +
    `    txt(x0, iy+50, verdict, {size:14, fill:isOne?'var(--green)':(Math.abs(res[0])<1e-9&&Math.abs(res[1])<1e-9?'var(--pink)':'var(--orange)'), weight:700});\n` +
    // readout
    `    out.textContent = 'The character is a class function, so its values are listed per conjugacy class C (with multiplicity |C|). The first orthogonality relation says the irreducible characters are ORTHONORMAL for the Hermitian inner product \\u27e8f\\u2081,f\\u2082\\u27e9 = (1/|G|) \\u03a3_g f\\u2081(g) f\\u2082(g)\\u0305, grouped over classes as (1/|G|) \\u03a3_C |C| f\\u2081(C) f\\u2082(C)\\u0305. Here \\u27e8\\u03c7'+(li+1)+', \\u03c7'+(mi+1)+'\\u27e9 = '+fmt(res)+', i.e. '+(li===mi?'1 \\u2014 each irreducible character has norm 1':'0 \\u2014 distinct irreducibles are orthogonal')+'. '+(gk==='C4'?'C\\u2084 has complex characters (powers of i), so the conjugate on the second factor is essential: without it the \\u201cinner product\\u201d would not even be real.':'Equivalently \\u27e8\\u03c7\\u03bb,\\u03c7\\u03bc\\u27e9 = dim Hom_G(V\\u03bc,V\\u03bb), which Schur\\u2019s lemma evaluates as \\u03b4\\u03bb\\u03bc.')+' The irreducible characters form an orthonormal basis of the space of class functions, so the number of irreducibles equals the number of conjugacy classes.';\n` +
    `  }\n` +
    `  gS3.addEventListener('click', function(){ gk='S3'; draw(); });\n` +
    `  gC4.addEventListener('click', function(){ gk='C4'; draw(); });\n` +
    `  lB.forEach(function(b,i){ b.addEventListener('click', function(){ li=i; draw(); }); });\n` +
    `  mB.forEach(function(b,i){ b.addEventListener('click', function(){ mi=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
