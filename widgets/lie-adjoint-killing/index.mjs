// lie-adjoint-killing widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. ad_X(Y)=[X,Y] and the Killing form B(X,Y)=tr(ad_X
// ad_Y), computed from structure constants. so(3): B negative-definite (compact);
// sl(2,ℝ): signature (2,1) (split). Both non-degenerate ⇒ semisimple (Cartan).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">algebra</span>\n` +
    `    <button type="button" id="${widgetId}-a0">so(3) &#8771; su(2)</button>\n` +
    `    <button type="button" id="${widgetId}-a1">sl(2,&#8477;)</button>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">$X$</span>\n` +
    `    <button type="button" id="${widgetId}-x0">e&#8321;</button>\n` +
    `    <button type="button" id="${widgetId}-x1">e&#8322;</button>\n` +
    `    <button type="button" id="${widgetId}-x2">e&#8323;</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 300" width="580" height="300" role="img" aria-label="The adjoint matrix of the chosen basis element and the Killing form of the algebra with its signature"><title>The adjoint representation ad_X = [X,-] and the Killing form B(X,Y) = tr(ad_X ad_Y); its signature distinguishes compact from split real forms</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* lie-adjoint-killing widget: ${widgetId} */\n` +
    `(function(){\n` +
    // structure constants c[i][j][k]: [e_i,e_j] = sum_k c[i][j][k] e_k
    `  function sc(rel){ var c=[[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]],[[0,0,0],[0,0,0],[0,0,0]]];\n` +
    `    rel.forEach(function(r){ var i=r[0],j=r[1],coef=r[2]; coef.forEach(function(ck,k){ c[i][j][k]=ck; c[j][i][k]=-ck; }); }); return c; }\n` +
    // so(3): [e_i,e_j]=eps_ijk e_k. sl(2): basis (H,E,F): [H,E]=2E,[H,F]=-2F,[E,F]=H
    `  var ALG=[\n` +
    `    { name:'so(3) \\u2245 su(2)', lbl:['e\\u2081','e\\u2082','e\\u2083'], c: sc([[0,1,[0,0,1]],[1,2,[1,0,0]],[2,0,[0,1,0]]]), note:'[e\\u1d62, e\\u2c7c] = \\u03b5\\u1d62\\u2c7c\\u2096 e\\u2096 (the cross product)' },\n` +
    `    { name:'sl(2,\\u211d)', lbl:['H','E','F'], c: sc([[0,1,[0,2,0]],[0,2,[0,0,-2]],[1,2,[1,0,0]]]), note:'[H,E]=2E,  [H,F]=\\u22122F,  [E,F]=H' }\n` +
    `  ];\n` +
    `  function adMat(c, xi){ var M=[[0,0,0],[0,0,0],[0,0,0]];\n` + // ad of basis element e_xi: column j = [e_xi, e_j]
    `    for(var j=0;j<3;j++) for(var k=0;k<3;k++) M[k][j]=c[xi][j][k]; return M; }\n` +
    `  function adGen(c, x){ var M=[[0,0,0],[0,0,0],[0,0,0]];\n` + // ad of general X = sum x_i e_i
    `    for(var i=0;i<3;i++) for(var j=0;j<3;j++) for(var k=0;k<3;k++) M[k][j]+=x[i]*c[i][j][k]; return M; }\n` +
    `  function matmul(A,B){ var C=[[0,0,0],[0,0,0],[0,0,0]]; for(var i=0;i<3;i++)for(var j=0;j<3;j++){var s=0;for(var k=0;k<3;k++)s+=A[i][k]*B[k][j];C[i][j]=s;} return C; }\n` +
    `  function trace(M){ return M[0][0]+M[1][1]+M[2][2]; }\n` +
    `  function killing(c){ var B=[[0,0,0],[0,0,0],[0,0,0]]; for(var i=0;i<3;i++)for(var j=0;j<3;j++){ B[i][j]=trace(matmul(adGen(c,basisvec(i)), adGen(c,basisvec(j)))); } return B; }\n` +
    `  function basisvec(i){ var v=[0,0,0]; v[i]=1; return v; }\n` +
    // symmetric eigenvalues via Jacobi rotations
    `  function eigsym(A){ var n=3, a=A.map(function(r){return r.slice();});\n` + // classic Jacobi; exact for the two hardcoded Killing forms (converges to ~1e-16)

    `    for(var sweep=0;sweep<60;sweep++){ var p=0,q=1,mx=0,i,j;\n` +
    `      for(i=0;i<n;i++) for(j=i+1;j<n;j++){ if(Math.abs(a[i][j])>mx){ mx=Math.abs(a[i][j]); p=i; q=j; } }\n` +
    `      if(mx<1e-11) break; var th=0.5*Math.atan2(2*a[p][q], a[p][p]-a[q][q]); var co=Math.cos(th), si=Math.sin(th);\n` +
    `      for(var k=0;k<n;k++){ var akp=a[k][p],akq=a[k][q]; a[k][p]=co*akp - si*akq; a[k][q]=si*akp + co*akq; }\n` +
    `      for(var k2=0;k2<n;k2++){ var apk=a[p][k2],aqk=a[q][k2]; a[p][k2]=co*apk - si*aqk; a[q][k2]=si*apk + co*aqk; } }\n` +
    `    return [a[0][0],a[1][1],a[2][2]].sort(function(x,y){return x-y;}); }\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var aB=[0,1].map(function(i){ return document.getElementById('${widgetId}-a'+i); });\n` +
    `  var xB=[0,1,2].map(function(i){ return document.getElementById('${widgetId}-x'+i); });\n` +
    `  if(!svg||!out||aB.some(function(b){return !b;})||xB.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    `  function mat3(x,y,M,col){ var cw=34,rh=22;\n` +
    `    svg.appendChild(mk('path',{d:'M '+(x+5)+' '+y+' L '+x+' '+y+' L '+x+' '+(y+3*rh)+' L '+(x+5)+' '+(y+3*rh),stroke:col,'stroke-width':1.1,fill:'none'}));\n` +
    `    svg.appendChild(mk('path',{d:'M '+(x+5+3*cw)+' '+y+' L '+(x+10+3*cw)+' '+y+' L '+(x+10+3*cw)+' '+(y+3*rh)+' L '+(x+5+3*cw)+' '+(y+3*rh),stroke:col,'stroke-width':1.1,fill:'none'}));\n` +
    `    for(var i=0;i<3;i++) for(var j=0;j<3;j++) txt(x+10+j*cw+cw/2, y+i*rh+15, ''+(Math.round(M[i][j]*100)/100), {size:11, anchor:'middle'}); }\n` +
    `  var alg=0, xi=0;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    aB.forEach(function(b,i){ b.classList.toggle('active',i===alg); b.setAttribute('aria-pressed',i===alg?'true':'false'); });\n` +
    `    var A=ALG[alg];\n` +
    `    xB.forEach(function(b,i){ b.classList.toggle('active',i===xi); b.setAttribute('aria-pressed',i===xi?'true':'false'); b.innerHTML=A.lbl[i]; });\n` +
    `    var adX=adMat(A.c, xi), B=killing(A.c), ev=eigsym(B);\n` +
    `    var pos=ev.filter(function(e){return e>1e-6;}).length, neg=ev.filter(function(e){return e<-1e-6;}).length, zero=3-pos-neg;\n` +
    `    txt(36, 40, A.name+' :   '+A.note, {size:12, fill:'var(--violet)'});\n` +
    `    txt(36, 74, 'ad_'+A.lbl[xi]+'(Y) = ['+A.lbl[xi]+', Y]   on basis ('+A.lbl.join(', ')+'):', {size:11, fill:'var(--mute)'});\n` +
    `    mat3(60, 86, adX, 'var(--yellow)');\n` +
    `    txt(330, 74, 'Killing form  B(e\\u1d62,e\\u2c7c) = tr(ad ad):', {size:11, fill:'var(--mute)'});\n` +
    `    mat3(360, 86, B, 'var(--cyan)');\n` +
    `    txt(36, 196, 'eigenvalues of B:  '+ev.map(function(e){return ''+(Math.round(e*100)/100);}).join(',  '), {size:12, fill:'var(--ink)'});\n` +
    `    txt(36, 218, 'signature ('+pos+' +, '+neg+' \\u2212'+(zero?', '+zero+' 0':'')+')', {size:13, fill:'var(--yellow)', weight:700});\n` +
    `    var defNeg=(neg===3), nondeg=(zero===0);\n` +
    `    txt(36, 244, 'B is '+(defNeg?'NEGATIVE-DEFINITE \\u21d2 compact group':(pos===3?'POSITIVE-DEFINITE':(zero>0?'DEGENERATE \\u21d2 not semisimple':'INDEFINITE \\u21d2 noncompact (split) group'))), {size:12, fill:defNeg?'var(--green)':(zero>0?'var(--pink)':'var(--orange)'), weight:600});\n` +
    `    txt(36, 266, 'B '+(nondeg?'non-degenerate \\u21d2 semisimple (Cartan\\u2019s criterion) \\u2713':'degenerate \\u21d2 NOT semisimple'), {size:11, fill:nondeg?'var(--green)':'var(--pink)'});\n` +
    `    out.textContent = 'The group acts on its algebra by conjugation Ad_g(X)=gXg\\u207b\\u00b9; differentiating gives ad_X(Y) = [X,Y], the adjoint representation of the algebra (shown left for X = '+A.lbl[xi]+'). Tracing products of these gives the Killing form B(X,Y) = tr(ad_X ad_Y) (right). For '+A.name+', B has eigenvalues '+ev.map(function(e){return ''+(Math.round(e*100)/100);}).join(', ')+' \\u2014 signature ('+pos+','+neg+'). '+(defNeg?'Negative-definite, so the associated group is COMPACT (rotations).':'Indefinite of signature ('+pos+','+neg+'), so the group is noncompact \\u2014 the split real form.')+' Either way B is non-degenerate, so by Cartan\\u2019s criterion the algebra is SEMISIMPLE. Jacobi\\u2019s identity is exactly the statement that ad is itself a Lie-algebra homomorphism, ad_{[X,Y]} = [ad_X, ad_Y].';\n` +
    `  }\n` +
    `  aB.forEach(function(b,i){ b.addEventListener('click', function(){ alg=i; draw(); }); });\n` +
    `  xB.forEach(function(b,i){ b.addEventListener('click', function(){ xi=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
