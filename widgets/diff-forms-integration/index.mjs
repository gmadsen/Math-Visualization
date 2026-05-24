// diff-forms-integration widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Integrate a 1-form ω = P dx + Q dy over an oriented
// curve γ by pullback: ∫_γ ω = ∫₀¹ [P(γ)x′ + Q(γ)y′] dt, shown as a Riemann sum
// of the form paired against the tangent γ′(t). Reversing orientation flips the
// sign; the angle form around a loop enclosing the origin gives 2π.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">1-form $\\omega$</span>\n` +
    `    <button type="button" id="${widgetId}-f0">$dx$</button>\n` +
    `    <button type="button" id="${widgetId}-f1">$x\\,dy$</button>\n` +
    `    <button type="button" id="${widgetId}-f2">angle form</button>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">curve $\\gamma$</span>\n` +
    `    <button type="button" id="${widgetId}-c0">segment</button>\n` +
    `    <button type="button" id="${widgetId}-c1">semicircle</button>\n` +
    `    <button type="button" id="${widgetId}-c2">full circle</button>\n` +
    `    <button type="button" id="${widgetId}-rev">reverse orientation</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="An oriented curve with a 1-form paired against its tangent vectors, and the line integral"><title>Integration of a 1-form over an oriented 1-chain: the integral is the Riemann sum of the form paired with the tangent along the curve</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* diff-forms-integration widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var PI=Math.PI;\n` +
    `  var FORMS=[\n` +
    `    { name:'\\u03c9 = dx', P:function(){return 1;}, Q:function(){return 0;} },\n` +
    `    { name:'\\u03c9 = x dy', P:function(){return 0;}, Q:function(x){return x;} },\n` +
    `    { name:'\\u03c9 = (\\u2212y dx + x dy)/(x\\u00b2+y\\u00b2)  (angle form)', P:function(x,y){return -y/(x*x+y*y);}, Q:function(x,y){return x/(x*x+y*y);} }\n` +
    `  ];\n` +
    `  var CURVES=[\n` +
    `    { name:'segment', g:function(t){return [-1+2.2*t, -0.6+1.4*t];}, gp:function(){return [2.2,1.4];}, loop:false },\n` +
    `    { name:'upper semicircle', g:function(t){return [Math.cos(PI*t), Math.sin(PI*t)];}, gp:function(t){return [-PI*Math.sin(PI*t), PI*Math.cos(PI*t)];}, loop:false },\n` +
    `    { name:'full circle', g:function(t){return [Math.cos(2*PI*t), Math.sin(2*PI*t)];}, gp:function(t){return [-2*PI*Math.sin(2*PI*t), 2*PI*Math.cos(2*PI*t)];}, loop:true }\n` +
    `  ];\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var fB=[0,1,2].map(function(i){return document.getElementById('${widgetId}-f'+i);});\n` +
    `  var cB=[0,1,2].map(function(i){return document.getElementById('${widgetId}-c'+i);});\n` +
    `  var revB=document.getElementById('${widgetId}-rev');\n` +
    `  if(!svg||!out||!revB||fB.some(function(b){return !b;})||cB.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    `  var CX=175, CY=150, SC=58;\n` + // plane center + scale px/unit
    `  function X(x){ return CX+x*SC; } function Y(y){ return CY-y*SC; }\n` +
    `  function arrow(x1,y1,x2,y2,col,w){ svg.appendChild(mk('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:col,'stroke-width':w||2})); var a=Math.atan2(y2-y1,x2-x1); svg.appendChild(mk('path',{d:'M '+x2+' '+y2+' L '+(x2-7*Math.cos(a-0.4))+' '+(y2-7*Math.sin(a-0.4))+' L '+(x2-7*Math.cos(a+0.4))+' '+(y2-7*Math.sin(a+0.4))+' Z',fill:col})); }\n` +
    `  var fi=2, ci=2, rev=false;\n` + // default: angle form on full circle -> 2π
    `  function pt(t){ return rev ? CURVES[ci].g(1-t) : CURVES[ci].g(t); }\n` +
    `  function tan(t){ var d=CURVES[ci].gp(rev?1-t:t); return rev?[-d[0],-d[1]]:[d[0],d[1]]; }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    fB.forEach(function(b,i){ b.classList.toggle('active',i===fi); b.setAttribute('aria-pressed',i===fi?'true':'false'); });\n` +
    `    cB.forEach(function(b,i){ b.classList.toggle('active',i===ci); b.setAttribute('aria-pressed',i===ci?'true':'false'); });\n` +
    `    revB.classList.toggle('active',rev); revB.setAttribute('aria-pressed',rev?'true':'false');\n` +
    `    var F=FORMS[fi], C=CURVES[ci];\n` +
    // axes
    `    svg.appendChild(mk('line',{x1:CX-130,y1:CY,x2:CX+130,y2:CY,stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:CX,y1:CY-120,x2:CX,y2:CY+120,stroke:'var(--line)','stroke-width':1}));\n` +
    `    if(fi===2) svg.appendChild(mk('circle',{cx:X(0),cy:Y(0),r:3,fill:'var(--pink)'}));\n` + // origin singularity of angle form
    // curve path
    `    var N=240, dpath='', i;\n` +
    `    for(i=0;i<=120;i++){ var t=i/120, p=pt(t); dpath+=(i===0?'M ':'L ')+X(p[0])+' '+Y(p[1])+' '; }\n` +
    `    svg.appendChild(mk('path',{d:dpath,fill:'none',stroke:'var(--violet)','stroke-width':2}));\n` +
    // orientation arrowheads along the curve
    `    [0.25,0.55,0.85].forEach(function(t){ var p=pt(t), q=pt(t+0.012); arrow(X(p[0]),Y(p[1]),X(q[0]),Y(q[1]),'var(--violet)',0); });\n` +
    // Riemann sum + sample pairings
    `    var I=0, dt=1/N;\n` +
    `    for(i=0;i<N;i++){ var t=(i+0.5)*dt, p=pt(t), d=tan(t); I += (F.P(p[0],p[1])*d[0] + F.Q(p[0],p[1])*d[1])*dt; }\n` +
    // sample tangent vectors colored by pairing sign
    `    var samples=C.loop?[0.05,0.3,0.55,0.8]:[0.1,0.35,0.6,0.85];\n` +
    `    samples.forEach(function(t){ var p=pt(t), d=tan(t), L=Math.hypot(d[0],d[1])||1; var ux=d[0]/L, uy=d[1]/L; var pair=F.P(p[0],p[1])*d[0]+F.Q(p[0],p[1])*d[1]; var col=pair>=0?'var(--green)':'var(--pink)';\n` +
    `      arrow(X(p[0]),Y(p[1]), X(p[0])+ux*0.55*SC, Y(p[1])-uy*0.55*SC, col,1.6); });\n` +
    // info panel
    `    var TX=330;\n` +
    `    txt(TX, 40, F.name, {size:12, fill:'var(--ink)', weight:600});\n` +
    `    txt(TX, 62, 'over '+C.name+(rev?'  (reversed)':''), {size:11, fill:'var(--violet)'});\n` +
    `    txt(TX, 92, '\\u222b_\\u03b3 \\u03c9 = \\u222b\\u2080\\u00b9 [P(\\u03b3)x\\u2032 + Q(\\u03b3)y\\u2032] dt', {size:11, fill:'var(--mute)'});\n` +
    `    var Idisp = Math.abs(I)<5e-4 ? 0 : I;\n` + // snap floating-point dust so e.g. the closed loop of dx shows 0, not -0.000
    `    txt(TX, 120, '= '+(Idisp<0?'\\u2212':'')+Math.abs(Idisp).toFixed(3), {size:16, fill:'var(--yellow)', weight:700});\n` +
    `    var nice='';\n` +
    `    if(fi===2 && ci===2) nice = rev?'= \\u22122\\u03c0  (winding \\u22121)':'= 2\\u03c0  (winding +1 about the origin)';\n` +
    `    else if(fi===2 && ci===1) nice = rev?'\\u2248 \\u2212\\u03c0  (half-turn, reversed)':'\\u2248 \\u03c0  (half-turn of angle)';\n` +
    `    else if(fi===1 && ci===2) nice = rev?'= \\u2212\\u03c0  (\\u2212area of the unit disk)':'= \\u03c0  (area of the unit disk)';\n` +
    `    else if(fi===0) nice='= x(end) \\u2212 x(start)  (dx is exact)';\n` +
    `    if(nice) txt(TX, 144, nice, {size:11, fill:'var(--green)'});\n` +
    `    txt(TX, 178, 'green tangent: \\u03c9(\\u03b3\\u2032) \\u2265 0', {size:10, fill:'var(--green)'});\n` +
    `    txt(TX, 194, 'pink tangent: \\u03c9(\\u03b3\\u2032) < 0', {size:10, fill:'var(--pink)'});\n` +
    `    txt(TX, 222, 'reversing \\u03b3 flips the sign', {size:10, fill:'var(--mute)', italic:true});\n` +
    `    out.textContent = 'The integral of a 1-form over an oriented curve is defined by pullback to the parameter interval: \\u222b_\\u03b3 \\u03c9 = \\u222b\\u2080\\u00b9 \\u03b3*\\u03c9 = \\u222b\\u2080\\u00b9 [P(\\u03b3(t))\\u00b7x\\u2032(t) + Q(\\u03b3(t))\\u00b7y\\u2032(t)] dt, the running sum of the form paired against the tangent \\u03b3\\u2032(t). Here '+F.name+' over the '+C.name+(rev?' (reversed)':'')+' gives '+(Idisp<0?'\\u2212':'')+Math.abs(Idisp).toFixed(3)+'. '+(C.loop?'':'For an open curve only the endpoints and path matter; ')+'reversing the orientation negates the integral \\u2014 that is the \\u22121 coefficient on the chain. The angle form is closed but not exact, so its integral around a loop enclosing the origin is 2\\u03c0 rather than 0: a first glimpse of de Rham cohomology.';\n` +
    `  }\n` +
    `  fB.forEach(function(b,i){ b.addEventListener('click', function(){ fi=i; draw(); }); });\n` +
    `  cB.forEach(function(b,i){ b.addEventListener('click', function(){ ci=i; draw(); }); });\n` +
    `  revB.addEventListener('click', function(){ rev=!rev; draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
