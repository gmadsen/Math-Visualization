// harmonic-schwartz widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A gallery testing membership in Schwartz space:
// smooth AND faster-than-every-polynomial decay. Illustrates the smooth↔decay
// duality under the Fourier transform.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <button type="button" id="${widgetId}-f0">$e^{-\\pi x^2}$</button>\n` +
    `    <button type="button" id="${widgetId}-f1">$x^2 e^{-\\pi x^2}$</button>\n` +
    `    <button type="button" id="${widgetId}-f2">$1/(1+x^2)$</button>\n` +
    `    <button type="button" id="${widgetId}-f3">$e^{-|x|}$</button>\n` +
    `    <button type="button" id="${widgetId}-f4">bump</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 240" width="560" height="240" role="img" aria-label="Testing membership in Schwartz space: smooth and rapidly decaying"><title>Schwartz space membership: a function is in S iff it is smooth and decays faster than every polynomial</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* harmonic-schwartz widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=[0,1,2,3,4].map(function(i){ return document.getElementById('${widgetId}-f'+i); });\n` +
    `  if(!svg || !out || btns.some(function(b){ return !b; })) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'start', 'font-size':opt.size||11, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  function bump(x){ return Math.abs(x)<0.999 ? Math.exp(1 - 1/(1-x*x)) : 0; }\n` +
    `  var SCEN=[\n` +
    `    { label:'f(x) = e^{-\\u03c0x\\u00b2}', f:function(x){ return Math.exp(-Math.PI*x*x); }, smooth:true, decay:true,\n` +
    `      note:'The Gaussian: smooth and decaying faster than every polynomial, so it IS Schwartz \\u2014 and it is a FIXED POINT of the Fourier transform: e^{-\\u03c0x\\u00b2} \\u21a6 e^{-\\u03c0\\u03be\\u00b2}.' },\n` +
    `    { label:'f(x) = x\\u00b2 e^{-\\u03c0x\\u00b2}', f:function(x){ return x*x*Math.exp(-Math.PI*x*x); }, smooth:true, decay:true,\n` +
    `      note:'Polynomial \\u00d7 Gaussian is still Schwartz: S is closed under multiplication by polynomials and under differentiation. (The Hermite functions, built this way, are the eigenfunctions of F.)' },\n` +
    `    { label:'f(x) = 1/(1+x\\u00b2)', f:function(x){ return 1/(1+x*x); }, smooth:true, decay:false,\n` +
    `      note:'Smooth, but decays only like x^{-2} \\u2014 not faster than every polynomial \\u2014 so NOT Schwartz (it is in L\\u00b9\\u2229L\\u00b2 though). Its Fourier transform \\u03c0 e^{-2\\u03c0|\\u03be|} has a corner at 0: the merely-polynomial decay of f becomes non-smoothness of f\\u0302.' },\n` +
    `    { label:'f(x) = e^{-|x|}', f:function(x){ return Math.exp(-Math.abs(x)); }, smooth:false, decay:true,\n` +
    `      note:'Exponential decay, but a corner at x=0 means it is NOT smooth, so NOT Schwartz. Its Fourier transform 2/(1+4\\u03c0\\u00b2\\u03be\\u00b2) is a Lorentzian decaying only like \\u03be^{-2}: the non-smoothness of f becomes slow decay of f\\u0302.' },\n` +
    `    { label:'f(x) = smooth bump (compact support)', f:bump, smooth:true, decay:true,\n` +
    `      note:'A smooth bump with compact support: smooth, and (trivially) faster-than-polynomial decay since it is eventually 0. So it is Schwartz \\u2014 in fact in the test-function space D \\u2282 S.' }\n` +
    `  ];\n` +
    `  var sel=0;\n` +
    `  function plot(f){\n` +
    `    var px0=40, px1=360, x0=-3, x1=3, base=185, h=120;\n` +
    `    var mx=1e-9; for(var i=0;i<=200;i++){ var x=x0+(x1-x0)*i/200; mx=Math.max(mx, Math.abs(f(x))); }\n` +
    `    var SX=function(x){ return px0+(x-x0)/(x1-x0)*(px1-px0); }, SY=function(y){ return base - y/mx*h; };\n` +
    `    svg.appendChild(mk('line', {x1:px0, y1:base, x2:px1, y2:base, stroke:'var(--line)', 'stroke-width':1}));\n` +
    `    svg.appendChild(mk('line', {x1:SX(0), y1:base+6, x2:SX(0), y2:base-h-6, stroke:'var(--line)', 'stroke-width':0.6, 'stroke-dasharray':'2 3'}));\n` +
    `    var d=''; for(var j=0;j<=200;j++){ var xx=x0+(x1-x0)*j/200; d+=(j?'L':'M')+SX(xx).toFixed(1)+' '+SY(f(xx)).toFixed(1); }\n` +
    `    svg.appendChild(mk('path', {d:d, fill:'none', stroke:'var(--yellow)', 'stroke-width':1.8}));\n` +
    `    txt((px0+px1)/2, base+22, 'x', {anchor:'middle', size:10, fill:'var(--mute)'}); }\n` +
    `  function badge(x,y,label,ok){ svg.appendChild(mk('text', {x:x, y:y, 'font-size':14, fill: ok?'var(--green)':'var(--pink)'}, ok?'\\u2713':'\\u2717')); txt(x+18, y, label, {size:11, fill:'var(--ink)'}); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    btns.forEach(function(b,i){ var on=(i===sel); b.classList.toggle('active', on); b.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    var S=SCEN[sel];\n` +
    `    txt(40, 28, S.label, {size:12, fill:'var(--yellow)', weight:600});\n` +
    `    plot(S.f);\n` +
    `    badge(400, 70, 'smooth (C\\u221e)?', S.smooth);\n` +
    `    badge(400, 102, 'decays faster than', S.decay);\n` +
    `    txt(418, 118, 'every polynomial?', {size:11, fill:'var(--ink)'});\n` +
    `    var inS = S.smooth && S.decay;\n` +
    `    svg.appendChild(mk('rect', {x:392, y:150, width:150, height:34, rx:6, fill: inS?'color-mix(in srgb, var(--green) 16%, transparent)':'color-mix(in srgb, var(--pink) 16%, transparent)', stroke: inS?'var(--green)':'var(--pink)', 'stroke-width':1.5}));\n` +
    `    txt(467, 172, inS ? '\\u2208 S  (Schwartz)' : '\\u2209 S  (not Schwartz)', {anchor:'middle', size:13, fill: inS?'var(--green)':'var(--pink)', weight:600});\n` +
    `    out.textContent = S.note + '\\n\\nSchwartz space S = smooth functions all of whose derivatives decay faster than every polynomial. Both conditions are needed: 1/(1+x\\u00b2) is smooth but decays too slowly; e^{-|x|} decays fast but is not smooth. The Fourier transform F: S \\u2192 S is a topological isomorphism with F\\u2074 = id (smoothness \\u2194 decay swap under F, so requiring BOTH makes S the natural F-stable home). Its dual S\\u2032 (tempered distributions) then carries F by duality \\u27e8T\\u0302,\\u03c6\\u27e9=\\u27e8T,\\u03c6\\u0302\\u27e9 \\u2014 e.g. \\u03b4\\u0302 = 1 and 1\\u0302 = \\u03b4.';\n` +
    `  }\n` +
    `  btns.forEach(function(b,i){ b.addEventListener('click', function(){ sel=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
