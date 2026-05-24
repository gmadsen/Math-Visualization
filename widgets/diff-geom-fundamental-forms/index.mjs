// diff-geom-fundamental-forms widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The first fundamental form I = [[E,F],[F,G]] (the
// induced metric) and second II = [[L,M],[M,N]] (normal curvature) of a surface
// at a representative point, and the curvatures K = (LN−M²)/(EG−F²) and
// H = (EN−2FM+GL)/(2(EG−F²)) they produce.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">surface</span>\n` +
    `    <button type="button" id="${widgetId}-s0">sphere</button>\n` +
    `    <button type="button" id="${widgetId}-s1">cylinder</button>\n` +
    `    <button type="button" id="${widgetId}-s2">saddle</button>\n` +
    `    <button type="button" id="${widgetId}-s3">plane</button>\n` +
    `    <button type="button" id="${widgetId}-s4">torus</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 300" width="580" height="300" role="img" aria-label="A surface sketch with its first and second fundamental forms and Gaussian and mean curvature"><title>First and second fundamental forms: the metric I and the shape II give the Gaussian curvature K = det II / det I and the mean curvature H</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* diff-geom-fundamental-forms widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var bt=[0,1,2,3,4].map(function(i){ return document.getElementById('${widgetId}-s'+i); });\n` +
    `  if(!svg||!out||bt.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    // each surface: param(u,v)->[x,y,z], u/v ranges for the mesh, fundamental forms at the marked point, scale
    `  var TAU=2*Math.PI;\n` +
    `  var SURF=[\n` +
    `    { name:'unit sphere', f:function(u,v){ return [Math.sin(u)*Math.cos(v), Math.sin(u)*Math.sin(v), Math.cos(u)]; }, ur:[0.3,Math.PI-0.3], vr:[0,TAU], sc:70,\n` +
    `      EFG:[1,0,0.75], LMN:[1,0,0.75], ptlbl:'at latitude \\u03b8 = 60\\u00b0' },\n` +
    `    { name:'cylinder (r=1)', f:function(u,v){ return [Math.cos(u), Math.sin(u), v]; }, ur:[0,TAU], vr:[-1.4,1.4], sc:62,\n` +
    `      EFG:[1,0,1], LMN:[-1,0,0], ptlbl:'any point' },\n` +
    `    { name:'saddle  z = \\u00bd(u\\u00b2 \\u2212 v\\u00b2)', f:function(u,v){ return [u, v, 0.5*(u*u-v*v)]; }, ur:[-1.3,1.3], vr:[-1.3,1.3], sc:58,\n` +
    `      EFG:[1,0,1], LMN:[1,0,-1], ptlbl:'at the origin' },\n` +
    `    { name:'plane', f:function(u,v){ return [u, v, 0]; }, ur:[-1.3,1.3], vr:[-1.3,1.3], sc:58,\n` +
    `      EFG:[1,0,1], LMN:[0,0,0], ptlbl:'any point' },\n` +
    `    { name:'torus (R=2, r=1)', f:function(u,v){ var R=2,r=1; return [(R+r*Math.cos(v))*Math.cos(u), (R+r*Math.cos(v))*Math.sin(u), r*Math.sin(v)]; }, ur:[0,TAU], vr:[0,TAU], sc:34,\n` +
    `      EFG:[9,0,1], LMN:[3,0,1], ptlbl:'at the outer equator (v=0)' }\n` +
    `  ];\n` +
    // oblique projection: x right, z up, y receding (down-left)
    `  var CX=150, CY=160;\n` +
    `  function proj(p, sc){ return [CX + sc*(p[0] - 0.42*p[1]), CY - sc*(p[2] - 0.30*p[1])]; }\n` +
    `  var sel=0;\n` +
    `  function wire(S){ var NU=12, NV=18, i, j, lines=[];\n` +
    `    for(i=0;i<=NU;i++){ var u=S.ur[0]+(S.ur[1]-S.ur[0])*i/NU, d='';\n` +
    `      for(j=0;j<=NV;j++){ var v=S.vr[0]+(S.vr[1]-S.vr[0])*j/NV, q=proj(S.f(u,v),S.sc); d+=(j===0?'M ':'L ')+q[0].toFixed(1)+' '+q[1].toFixed(1)+' '; }\n` +
    `      lines.push(d); }\n` +
    `    for(j=0;j<=NV;j+=2){ var v2=S.vr[0]+(S.vr[1]-S.vr[0])*j/NV, d2='';\n` +
    `      for(i=0;i<=NU;i++){ var u2=S.ur[0]+(S.ur[1]-S.ur[0])*i/NU, q2=proj(S.f(u2,v2),S.sc); d2+=(i===0?'M ':'L ')+q2[0].toFixed(1)+' '+q2[1].toFixed(1)+' '; }\n` +
    `      lines.push(d2); }\n` +
    `    lines.forEach(function(d){ svg.appendChild(mk('path',{d:d,fill:'none',stroke:'var(--violet)','stroke-width':0.7,'stroke-opacity':0.5})); }); }\n` +
    `  function fmt(x){ return (Math.round(x*1000)/1000).toString(); }\n` +
    `  function mat(x,y,a,b,c,d,col){ // 2x2 bracketed matrix\n` +
    `    svg.appendChild(mk('path',{d:'M '+(x+5)+' '+y+' L '+x+' '+y+' L '+x+' '+(y+44)+' L '+(x+5)+' '+(y+44),stroke:col,'stroke-width':1.1,fill:'none'}));\n` +
    `    svg.appendChild(mk('path',{d:'M '+(x+75)+' '+y+' L '+(x+80)+' '+y+' L '+(x+80)+' '+(y+44)+' L '+(x+75)+' '+(y+44),stroke:col,'stroke-width':1.1,fill:'none'}));\n` +
    `    txt(x+24,y+17,fmt(a),{size:11,anchor:'middle'}); txt(x+58,y+17,fmt(b),{size:11,anchor:'middle'});\n` +
    `    txt(x+24,y+38,fmt(c),{size:11,anchor:'middle'}); txt(x+58,y+38,fmt(d),{size:11,anchor:'middle'}); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    bt.forEach(function(b,i){ b.classList.toggle('active',i===sel); b.setAttribute('aria-pressed',i===sel?'true':'false'); });\n` +
    `    var S=SURF[sel], E=S.EFG[0], F=S.EFG[1], G=S.EFG[2], L=S.LMN[0], M=S.LMN[1], N=S.LMN[2];\n` +
    `    var detI=E*G-F*F, detII=L*N-M*M;\n` +
    `    var K=detII/detI, H=(E*N-2*F*M+G*L)/(2*detI);\n` +
    `    wire(S);\n` +
    `    txt(CX, 286, S.name, {size:11, fill:'var(--violet)', anchor:'middle'});\n` +
    // forms + curvatures
    `    var TX=320;\n` +
    `    txt(TX, 40, 'first form I  '+S.ptlbl, {size:11, fill:'var(--mute)'});\n` +
    `    mat(TX, 50, E,F,F,G, 'var(--cyan)'); txt(TX+92, 76, '= [[E,F],[F,G]]', {size:9, fill:'var(--mute)'});\n` +
    `    txt(TX, 124, 'second form II', {size:11, fill:'var(--mute)'});\n` +
    `    mat(TX, 134, L,M,M,N, 'var(--yellow)'); txt(TX+92, 160, '= [[L,M],[M,N]]', {size:9, fill:'var(--mute)'});\n` +
    `    txt(TX, 208, 'K = (LN\\u2212M\\u00b2)/(EG\\u2212F\\u00b2) = '+fmt(K), {size:12, fill:'var(--green)', weight:600});\n` +
    `    txt(TX, 230, 'H = (EN\\u22122FM+GL)/2(EG\\u2212F\\u00b2) = '+fmt(H), {size:12, fill:'var(--pink)', weight:600});\n` +
    `    var type = Math.abs(K)<1e-9?'parabolic / flat (K = 0)':(K>0?'elliptic  (K > 0): bowl-like':'hyperbolic  (K < 0): saddle-like');\n` +
    `    txt(TX, 256, type, {size:12, fill:'var(--ink)', weight:600});\n` +
    `    out.textContent = 'On '+S.name+' '+S.ptlbl+', the first fundamental form I = [[ '+fmt(E)+', '+fmt(F)+' ],[ '+fmt(F)+', '+fmt(G)+' ]] is the induced metric (E = x_u\\u00b7x_u, F = x_u\\u00b7x_v, G = x_v\\u00b7x_v): it measures lengths, angles and areas of tangent vectors. The second fundamental form II = [[ '+fmt(L)+', '+fmt(M)+' ],[ '+fmt(M)+', '+fmt(N)+' ]] records how the unit normal turns (L = x_uu\\u00b7n, etc.) \\u2014 the bending into \\u211d\\u00b3. Their ratio of determinants is the Gaussian curvature K = (LN\\u2212M\\u00b2)/(EG\\u2212F\\u00b2) = '+fmt(K)+', and H = (EN\\u22122FM+GL)/(2(EG\\u2212F\\u00b2)) = '+fmt(H)+' is the mean curvature. '+(Math.abs(K)<1e-9?'K = 0 here \\u2014 the surface is flat in the Gaussian sense (a plane, or a developable like the cylinder which still bends, H \\u2260 0).':(K>0?'K > 0 \\u2014 the surface curves the same way in every direction (elliptic / bowl).':'K < 0 \\u2014 it curves up one way and down another (hyperbolic / saddle).'))+' By Gauss\\u2019s Theorema Egregium, K depends only on I \\u2014 it is intrinsic \\u2014 even though II is not.';\n` +
    `  }\n` +
    `  bt.forEach(function(b,i){ b.addEventListener('click', function(){ sel=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
