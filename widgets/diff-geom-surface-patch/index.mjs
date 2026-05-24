// diff-geom-surface-patch widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A regular parametrized surface patch x(u,v) with the
// tangent vectors x_u, x_v at a marked point, the unit normal n = x_u×x_v/|·|,
// and the tangent plane they span. Regularity = x_u×x_v ≠ 0.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">surface $\\mathbf{x}(u,v)$</span>\n` +
    `    <button type="button" id="${widgetId}-s0">sphere</button>\n` +
    `    <button type="button" id="${widgetId}-s1">cylinder</button>\n` +
    `    <button type="button" id="${widgetId}-s2">saddle</button>\n` +
    `    <button type="button" id="${widgetId}-s3">torus</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 320" width="580" height="320" role="img" aria-label="A surface wireframe with the tangent vectors x_u, x_v and unit normal at a marked point"><title>Regular surface patch: the partials x_u and x_v span the tangent plane, and their cross product gives the unit normal</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* diff-geom-surface-patch widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var bt=[0,1,2,3].map(function(i){ return document.getElementById('${widgetId}-s'+i); });\n` +
    `  if(!svg||!out||bt.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    `  var TAU=2*Math.PI;\n` +
    `  var SURF=[\n` +
    `    { name:'unit sphere', f:function(u,v){ return [Math.sin(u)*Math.cos(v), Math.sin(u)*Math.sin(v), Math.cos(u)]; }, ur:[0.3,Math.PI-0.3], vr:[0,TAU], sc:78, pt:[1.05,0.9] },\n` +
    `    { name:'cylinder (r=1)', f:function(u,v){ return [Math.cos(u), Math.sin(u), v]; }, ur:[0,TAU], vr:[-1.4,1.4], sc:66, pt:[0.9,0.3] },\n` +
    `    { name:'saddle  z = u\\u00b2\\u2212v\\u00b2', f:function(u,v){ return [u, v, u*u-v*v]; }, ur:[-1.1,1.1], vr:[-1.1,1.1], sc:52, pt:[0.5,0.4] },\n` +
    `    { name:'torus (R=2, r=1)', f:function(u,v){ var R=2,r=1; return [(R+r*Math.cos(v))*Math.cos(u), (R+r*Math.cos(v))*Math.sin(u), r*Math.sin(v)]; }, ur:[0,TAU], vr:[0,TAU], sc:36, pt:[0.7,0.9] }\n` +
    `  ];\n` +
    `  var CX=160, CY=170;\n` +
    `  function proj(p, sc){ return [CX + sc*(p[0] - 0.42*p[1]), CY - sc*(p[2] - 0.30*p[1])]; }\n` +
    `  function sub(a,b){ return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]; }\n` +
    `  function cross(a,b){ return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }\n` +
    `  function norm(a){ return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]); }\n` +
    `  function scal(a,s){ return [a[0]*s,a[1]*s,a[2]*s]; }\n` +
    `  function add(a,b){ return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]; }\n` +
    `  var sel=0;\n` +
    `  function arrow(p0,p1,col,lbl){ svg.appendChild(mk('line',{x1:p0[0],y1:p0[1],x2:p1[0],y2:p1[1],stroke:col,'stroke-width':2}));\n` +
    `    var a=Math.atan2(p1[1]-p0[1],p1[0]-p0[0]); svg.appendChild(mk('path',{d:'M '+p1[0]+' '+p1[1]+' L '+(p1[0]-8*Math.cos(a-0.4))+' '+(p1[1]-8*Math.sin(a-0.4))+' L '+(p1[0]-8*Math.cos(a+0.4))+' '+(p1[1]-8*Math.sin(a+0.4))+' Z',fill:col}));\n` +
    `    if(lbl) txt(p1[0]+5,p1[1]-2,lbl,{size:11,fill:col,weight:600}); }\n` +
    `  function wire(S){ var NU=12, NV=18, i, j;\n` +
    `    for(i=0;i<=NU;i++){ var u=S.ur[0]+(S.ur[1]-S.ur[0])*i/NU, d='';\n` +
    `      for(j=0;j<=NV;j++){ var v=S.vr[0]+(S.vr[1]-S.vr[0])*j/NV, q=proj(S.f(u,v),S.sc); d+=(j===0?'M ':'L ')+q[0].toFixed(1)+' '+q[1].toFixed(1)+' '; }\n` +
    `      svg.appendChild(mk('path',{d:d,fill:'none',stroke:'var(--violet)','stroke-width':0.7,'stroke-opacity':0.45})); }\n` +
    `    for(j=0;j<=NV;j+=2){ var v2=S.vr[0]+(S.vr[1]-S.vr[0])*j/NV, d2='';\n` +
    `      for(i=0;i<=NU;i++){ var u2=S.ur[0]+(S.ur[1]-S.ur[0])*i/NU, q2=proj(S.f(u2,v2),S.sc); d2+=(i===0?'M ':'L ')+q2[0].toFixed(1)+' '+q2[1].toFixed(1)+' '; }\n` +
    `      svg.appendChild(mk('path',{d:d2,fill:'none',stroke:'var(--violet)','stroke-width':0.7,'stroke-opacity':0.45})); } }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    bt.forEach(function(b,i){ b.classList.toggle('active',i===sel); b.setAttribute('aria-pressed',i===sel?'true':'false'); });\n` +
    `    var S=SURF[sel]; wire(S);\n` +
    `    var u=S.pt[0], v=S.pt[1], h=1e-4;\n` +
    `    var P=S.f(u,v);\n` +
    `    var Xu=scal(sub(S.f(u+h,v),S.f(u-h,v)), 1/(2*h));\n` +
    `    var Xv=scal(sub(S.f(u,v+h),S.f(u,v-h)), 1/(2*h));\n` +
    `    var nrm=cross(Xu,Xv), nlen=norm(nrm), n=scal(nrm, 1/nlen);\n` +
    // scale the drawn vectors to a readable length in object space
    `    function unitish(w){ var L=norm(w)||1; return scal(w, 0.7/L); }\n` +
    `    var p2=proj(P,S.sc);\n` +
    // tangent plane parallelogram (small, spanned by unit-ish Xu, Xv)\n` +
    `    var eu=unitish(Xu), ev=unitish(Xv);\n` +
    `    var c1=proj(add(P,scal(eu,0.9)),S.sc), c2=proj(add(add(P,scal(eu,0.9)),scal(ev,0.9)),S.sc), c3=proj(add(P,scal(ev,0.9)),S.sc);\n` +
    `    svg.appendChild(mk('path',{d:'M '+p2[0]+' '+p2[1]+' L '+c1[0]+' '+c1[1]+' L '+c2[0]+' '+c2[1]+' L '+c3[0]+' '+c3[1]+' Z',fill:'var(--cyan)','fill-opacity':0.12,stroke:'var(--cyan)','stroke-width':0.8}));\n` +
    `    svg.appendChild(mk('circle',{cx:p2[0],cy:p2[1],r:3,fill:'var(--ink)'}));\n` +
    `    arrow(p2, proj(add(P,eu),S.sc), 'var(--green)', 'x_u');\n` +
    `    arrow(p2, proj(add(P,ev),S.sc), 'var(--yellow)', 'x_v');\n` +
    `    arrow(p2, proj(add(P,scal(n,0.9)),S.sc), 'var(--pink)', 'n');\n` +
    // info panel
    `    var TX=360;\n` +
    `    txt(TX, 44, S.name, {size:12, fill:'var(--violet)', weight:600});\n` +
    `    txt(TX, 70, 'at the marked point:', {size:10, fill:'var(--mute)'});\n` +
    `    txt(TX, 94, 'tangent plane T_pS = span{ x_u, x_v }', {size:11, fill:'var(--ink)'});\n` +
    `    svg.appendChild(mk('text',{x:TX,y:120,'font-size':11,fill:'var(--green)'},'\\u2014 x_u  (\\u2202x/\\u2202u)'));\n` +
    `    svg.appendChild(mk('text',{x:TX,y:138,'font-size':11,fill:'var(--yellow)'},'\\u2014 x_v  (\\u2202x/\\u2202v)'));\n` +
    `    svg.appendChild(mk('text',{x:TX,y:156,'font-size':11,fill:'var(--pink)'},'\\u2014 n = x_u \\u00d7 x_v / |x_u \\u00d7 x_v|'));\n` +
    `    txt(TX, 188, '|x_u \\u00d7 x_v| = '+(Math.round(nlen*1000)/1000), {size:12, fill:'var(--cyan)', weight:600});\n` +
    `    txt(TX, 210, nlen>1e-6?'\\u2260 0  \\u21d2  regular (d x injective)':'= 0  \\u21d2  singular point', {size:11, fill:nlen>1e-6?'var(--green)':'var(--pink)'});\n` +
    `    txt(TX, 232, '|x_u \\u00d7 x_v| = area of the', {size:9, fill:'var(--mute)', italic:true});\n` +
    `    txt(TX, 244, 'tangent parallelogram = \\u221a(EG\\u2212F\\u00b2)', {size:9, fill:'var(--mute)', italic:true});\n` +
    `    out.textContent = 'A regular surface is locally a smooth map x(u,v) from a planar domain into \\u211d\\u00b3 whose differential is injective \\u2014 equivalently, whose partial derivatives x_u = \\u2202x/\\u2202u and x_v = \\u2202x/\\u2202v are linearly independent, i.e. x_u \\u00d7 x_v \\u2260 0. Those two vectors span the tangent plane T_pS at each point (shown shaded), and their normalized cross product n = x_u\\u00d7x_v / |x_u\\u00d7x_v| is the unit normal (pink). Here on the '+S.name+', |x_u \\u00d7 x_v| = '+(Math.round(nlen*1000)/1000)+' \\u2260 0, so the parametrization is regular. The length |x_u \\u00d7 x_v| = \\u221a(EG\\u2212F\\u00b2) is exactly the area element \\u2014 the bridge from this picture to the first fundamental form and surface integrals.';\n` +
    `  }\n` +
    `  bt.forEach(function(b,i){ b.addEventListener('click', function(){ sel=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
