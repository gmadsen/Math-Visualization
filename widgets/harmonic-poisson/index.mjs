// harmonic-poisson widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The arithmetic (Gaussian, theta series) is intrinsic;
// params carry only chrome. The widget applies Poisson summation to the Gaussian
// f_t(x)=e^{-π t x^2} to exhibit the theta functional equation θ(1/t)=√t·θ(t).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-t">scale $t$</label>\n` +
    `    <input type="range" id="${widgetId}-t" min="0.25" max="4" value="1" step="0.05">\n` +
    `    <span class="pill" id="${widgetId}-tval">t = 1.00</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 230" width="560" height="230" role="img" aria-label="Poisson summation applied to a Gaussian, giving the theta functional equation"><title>Poisson summation: the Gaussian and its Fourier transform, lattice sums equal</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* harmonic-poisson widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var tIn=document.getElementById('${widgetId}-t'), tL=document.getElementById('${widgetId}-tval');\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  if(!tIn || !tL || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'middle', 'font-size':opt.size||11, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  function theta(s){ var v=0; for(var n=-12;n<=12;n++) v+=Math.exp(-Math.PI*n*n*s); return v; }\n` +
    `  // draw a Gaussian a*e^{-π b x^2} over [-3,3] into the panel at (px,py,pw,ph), marking integer samples\n` +
    `  function gauss(px,py,pw,ph, b, amp, col, label){\n` +
    `    var x0=-3, x1=3, sx=function(x){ return px + (x-x0)/(x1-x0)*pw; }, sy=function(y){ return py+ph - y/amp*(ph-6); };\n` +
    `    svg.appendChild(mk('line', {x1:px, y1:py+ph, x2:px+pw, y2:py+ph, stroke:'var(--line)', 'stroke-width':1}));\n` +
    `    var d=''; for(var i=0;i<=120;i++){ var x=x0+(x1-x0)*i/120, y=amp*Math.exp(-Math.PI*b*x*x); d+=(i?'L':'M')+sx(x).toFixed(1)+' '+sy(y).toFixed(1); }\n` +
    `    svg.appendChild(mk('path', {d:d, fill:'none', stroke:col, 'stroke-width':1.8}));\n` +
    `    for(var m=-3;m<=3;m++){ var yy=amp*Math.exp(-Math.PI*b*m*m); svg.appendChild(mk('circle', {cx:sx(m), cy:sy(yy), r:2.6, fill:col})); svg.appendChild(mk('line',{x1:sx(m),y1:py+ph,x2:sx(m),y2:sy(yy),stroke:col,'stroke-width':0.6,opacity:0.5})); }\n` +
    `    txt(px+pw/2, py-4, label, {size:10, fill:col}); }\n` +
    `  function draw(){\n` +
    `    var t=+tIn.value; tL.textContent='t = '+t.toFixed(2);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var th=theta(t), dual=Math.pow(t,-0.5)*theta(1/t);\n` +
    `    txt(280, 20, 'Poisson summation:  \\u03a3\\u2099 f(n) = \\u03a3\\u2099 f\\u0302(n),   with f(x)=e^{-\\u03c0 t x\\u00b2},  f\\u0302(\\u03be)=t^{-1/2} e^{-\\u03c0\\u03be\\u00b2/t}', {size:10, fill:'var(--mute)', italic:true});\n` +
    `    // two panels: space side (f_t) and frequency side (f_hat)\n` +
    `    gauss(40, 44, 220, 110, t, 1, 'var(--yellow)', 'f(x) = e^{-\\u03c0 t x\\u00b2}   (samples at x\\u2208\\u2124)');\n` +
    `    gauss(300, 44, 220, 110, 1/t, Math.pow(t,-0.5), 'var(--cyan)', 'f\\u0302(\\u03be) = t^{-1/2} e^{-\\u03c0\\u03be\\u00b2/t}   (samples at \\u03be\\u2208\\u2124)');\n` +
    `    txt(150, 172, '\\u03a3\\u2099 f(n) = \\u03b8(t) = ' + th.toFixed(5), {size:11, fill:'var(--yellow)'});\n` +
    `    txt(410, 172, '\\u03a3\\u2099 f\\u0302(n) = t^{-1/2}\\u03b8(1/t) = ' + dual.toFixed(5), {size:11, fill:'var(--cyan)'});\n` +
    `    txt(280, 198, '\\u21d2  \\u03b8(1/t) = \\u221at\\u00b7\\u03b8(t)   ' + (Math.abs(th-dual)<1e-4 ? '\\u2713 equal' : ''), {size:13, fill:'var(--green)', weight:600});\n` +
    `    if(Math.abs(t-1)<0.03) txt(280, 218, 't = 1: the Gaussian is its own Fourier transform (self-dual fixed point)', {size:10, fill:'var(--violet)', italic:true});\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    lines.push('Poisson summation \\u03a3\\u2099f(n)=\\u03a3\\u2099f\\u0302(n) applied to the Gaussian f(x)=e^{-\\u03c0tx\\u00b2} (whose transform is f\\u0302(\\u03be)=t^{-1/2}e^{-\\u03c0\\u03be\\u00b2/t}) gives the modular transformation of Jacobi\\u2019s theta function \\u03b8(t)=\\u03a3\\u2099 e^{-\\u03c0n\\u00b2t}: namely \\u03b8(t) = t^{-1/2}\\u03b8(1/t), i.e. \\u03b8(1/t)=\\u221at\\u00b7\\u03b8(t).');\n` +
    `    lines.push('At t=' + t.toFixed(2) + ':  \\u03b8(t) = ' + th.toFixed(6) + ',   t^{-1/2}\\u03b8(1/t) = ' + dual.toFixed(6) + '  \\u2014 equal to floating precision. As t grows the space-side Gaussian narrows and the frequency-side widens (and vice versa); they coincide only at t=1, the self-dual fixed point.');\n` +
    `    lines.push('This is the analytic seed of Riemann\\u2019s 1859 functional equation: \\u03be(s)=\\u03c0^{-s/2}\\u0393(s/2)\\u03b6(s) satisfies \\u03be(s)=\\u03be(1-s), proved by feeding exactly this \\u03b8 transformation into a Mellin transform.');\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  tIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
