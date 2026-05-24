// diff-forms-pullback widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The pullback of a top form picks up the Jacobian
// determinant: for φ: (u,v) ↦ (x,y) and ω = dx∧dy, φ*ω = det(Dφ)·du∧dv. The unit
// (du,dv) square in the source maps to the parallelogram spanned by the columns
// of Dφ, whose signed area is exactly det(Dφ).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">map $\\varphi$</span>\n` +
    `    <button type="button" id="${widgetId}-m0">scaling</button>\n` +
    `    <button type="button" id="${widgetId}-m1">shear</button>\n` +
    `    <button type="button" id="${widgetId}-m2">stretch (det varies)</button>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-u">base point $u$</label>\n` +
    `    <input type="range" id="${widgetId}-u" min="-1.5" max="1.5" value="0.5" step="0.25">\n` +
    `    <span class="pill" id="${widgetId}-uv">u = 0.5</span>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-v">base point $v$</label>\n` +
    `    <input type="range" id="${widgetId}-v" min="-1.5" max="1.5" value="0.5" step="0.25">\n` +
    `    <span class="pill" id="${widgetId}-vv">v = 0.5</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 300" width="580" height="300" role="img" aria-label="A unit square in the source plane and its image parallelogram in the target plane, with area equal to the Jacobian determinant"><title>Pullback of the area form: the unit du-dv square maps to the parallelogram spanned by the Jacobian columns, of area det(Dphi)</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* diff-forms-pullback widget: ${widgetId} */\n` +
    `(function(){\n` +
    // each map: f(u,v) -> [x,y]; J(u,v) -> [[xu,xv],[yu,yv]]; det closed form
    `  var MAPS=[\n` +
    `    { name:'scaling  \\u03c6(u,v) = (1.5u, 0.6v)', f:function(u,v){return [1.5*u,0.6*v];}, J:function(){return [[1.5,0],[0,0.6]];} },\n` +
    `    { name:'shear  \\u03c6(u,v) = (u + 0.7v, v)', f:function(u,v){return [u+0.7*v,v];}, J:function(){return [[1,0.7],[0,1]];} },\n` +
    `    { name:'stretch  \\u03c6(u,v) = (u, v(1 + 0.5u))', f:function(u,v){return [u, v*(1+0.5*u)];}, J:function(u,v){return [[1,0],[0.5*v,1+0.5*u]];} }\n` +
    `  ];\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var mB=[0,1,2].map(function(i){ return document.getElementById('${widgetId}-m'+i); });\n` +
    `  var su=document.getElementById('${widgetId}-u'), sv=document.getElementById('${widgetId}-v');\n` +
    `  var uv=document.getElementById('${widgetId}-uv'), vv=document.getElementById('${widgetId}-vv');\n` +
    `  if(!svg||!out||!su||!sv||!uv||!vv||mB.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    `  var SC=34, CYL=158, CXL=150, CXR=430;\n` + // scale px/unit, plane center-y, left/right center-x
    `  function axes(cx, lblX, lblY){\n` +
    `    svg.appendChild(mk('line',{x1:cx-110,y1:CYL,x2:cx+110,y2:CYL,stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:cx,y1:CYL-110,x2:cx,y2:CYL+110,stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt(cx+112, CYL+4, lblX, {size:11, fill:'var(--mute)', italic:true});\n` +
    `    txt(cx-4, CYL-112, lblY, {size:11, fill:'var(--mute)', italic:true, anchor:'middle'}); }\n` +
    `  function poly(pts, attrs){ var d='M '+pts.map(function(p){return p[0]+' '+p[1];}).join(' L ')+' Z'; svg.appendChild(mk('path', Object.assign({d:d}, attrs))); }\n` +
    `  function arrow(x1,y1,x2,y2,col){ svg.appendChild(mk('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:col,'stroke-width':2})); var a=Math.atan2(y2-y1,x2-x1); svg.appendChild(mk('path',{d:'M '+x2+' '+y2+' L '+(x2-7*Math.cos(a-0.4))+' '+(y2-7*Math.sin(a-0.4))+' L '+(x2-7*Math.cos(a+0.4))+' '+(y2-7*Math.sin(a+0.4))+' Z',fill:col})); }\n` +
    `  var mi=0;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var u=parseFloat(su.value), v=parseFloat(sv.value);\n` +
    `    uv.textContent='u = '+u; vv.textContent='v = '+v;\n` +
    `    mB.forEach(function(b,i){ b.classList.toggle('active',i===mi); b.setAttribute('aria-pressed',i===mi?'true':'false'); });\n` +
    `    var M=MAPS[mi], J=M.J(u,v), det=J[0][0]*J[1][1]-J[0][1]*J[1][0];\n` +
    // left source plane
    `    axes(CXL, 'u', 'v');\n` +
    `    txt(CXL, 40, 'source (u, v)', {size:11, fill:'var(--ink)', anchor:'middle'});\n` +
    `    function L(a,b){ return [CXL+a*SC, CYL-b*SC]; }\n` +
    `    var sq=[L(u,v),L(u+1,v),L(u+1,v+1),L(u,v+1)];\n` +
    `    poly(sq, {fill:'var(--yellow)','fill-opacity':0.18, stroke:'var(--yellow)','stroke-width':1.4});\n` +
    `    arrow(L(u,v)[0],L(u,v)[1],L(u+1,v)[0],L(u+1,v)[1],'var(--green)');\n` +
    `    arrow(L(u,v)[0],L(u,v)[1],L(u,v+1)[0],L(u,v+1)[1],'var(--cyan)');\n` +
    `    txt(L(u+0.5,v-0.18)[0], L(u+0.5,v-0.18)[1], 'du', {size:10, fill:'var(--green)', anchor:'middle'});\n` +
    `    txt(L(u-0.28,v+0.5)[0], L(u-0.28,v+0.5)[1], 'dv', {size:10, fill:'var(--cyan)', anchor:'middle'});\n` +
    `    txt(L(u+0.5,v+0.5)[0], L(u+0.5,v+0.5)[1]+4, 'area 1', {size:9, fill:'var(--mute)', anchor:'middle'});\n` +
    // right target plane
    `    axes(CXR, 'x', 'y');\n` +
    `    txt(CXR, 40, 'target (x, y)', {size:11, fill:'var(--ink)', anchor:'middle'});\n` +
    `    function R(a,b){ return [CXR+a*SC, CYL-b*SC]; }\n` +
    `    var c1=[J[0][0],J[1][0]], c2=[J[0][1],J[1][1]];\n` + // columns of Dφ = images of the tangent vectors du, dv
    // drawn from the target-plane origin (Dφ maps tangent vectors du,dv -> c1,c2); the span area is det regardless of where φ lands, so this stays in-frame for any base point
    `    var img=[R(0,0), R(c1[0],c1[1]), R(c1[0]+c2[0],c1[1]+c2[1]), R(c2[0],c2[1])];\n` +
    `    poly(img, {fill: det<0?'var(--pink)':'var(--yellow)','fill-opacity':0.18, stroke: det<0?'var(--pink)':'var(--yellow)','stroke-width':1.4});\n` +
    `    arrow(R(0,0)[0],R(0,0)[1], R(c1[0],c1[1])[0],R(c1[0],c1[1])[1],'var(--green)');\n` +
    `    arrow(R(0,0)[0],R(0,0)[1], R(c2[0],c2[1])[0],R(c2[0],c2[1])[1],'var(--cyan)');\n` +
    `    txt(R(c1[0],c1[1])[0]+4, R(c1[0],c1[1])[1], 'D\\u03c6\\u00b7du', {size:9, fill:'var(--green)'});\n` +
    `    txt(R(c2[0],c2[1])[0]+4, R(c2[0],c2[1])[1], 'D\\u03c6\\u00b7dv', {size:9, fill:'var(--cyan)'});\n` +
    `    var midI=R((c1[0]+c2[0])/2, (c1[1]+c2[1])/2);\n` +
    `    txt(midI[0], midI[1]+4, 'area '+Math.abs(det).toFixed(2), {size:9, fill:'var(--mute)', anchor:'middle'});\n` +
    // readout (compact panel under planes)
    `    var jstr='['+J[0][0].toFixed(2)+'  '+J[0][1].toFixed(2)+';  '+J[1][0].toFixed(2)+'  '+J[1][1].toFixed(2)+']';\n` +
    `    txt(CXL, CYL+128, M.name, {size:11, fill:'var(--violet)', anchor:'middle'});\n` +
    `    txt(CXR, CYL+128, 'D\\u03c6 = '+jstr+',  det = '+det.toFixed(2), {size:11, fill:'var(--ink)', anchor:'middle'});\n` +
    `    out.textContent = 'The map \\u03c6 sends the unit du\\u2227dv square (left, area 1) to the parallelogram spanned by the columns of the Jacobian D\\u03c6 (right). Pulling back the area form \\u03c9 = dx\\u2227dy gives \\u03c6*\\u03c9 = det(D\\u03c6)\\u00b7du\\u2227dv = '+det.toFixed(2)+'\\u00b7du\\u2227dv, so the image parallelogram has signed area det(D\\u03c6) = '+det.toFixed(2)+'. '+(Math.abs(det-1)<1e-9?'Here det = 1, so this map preserves area (a shear).':(mi===2?'For this map det = 1 + 0.5u depends on the base point \\u2014 slide u and watch the area change.':'det is constant for this linear map.'))+' This is exactly why a change of coordinates in an integral picks up the Jacobian determinant once: \\u222b_{\\u03c6(R)} dx\\u2227dy = \\u222b_R det(D\\u03c6) du\\u2227dv.';\n` +
    `  }\n` +
    `  mB.forEach(function(b,i){ b.addEventListener('click', function(){ mi=i; draw(); }); });\n` +
    `  su.addEventListener('input', draw); sv.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
