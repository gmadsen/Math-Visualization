// operator-algebras-funccalc widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The spectrum is intrinsic; params carry only chrome.
// The widget shows continuous functional calculus on a self-adjoint element via
// the spectral mapping σ(f(a)) = f(σ(a)).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">$f$</span>\n` +
    `    <button type="button" id="${widgetId}-f0">$\\sqrt{t}$</button>\n` +
    `    <button type="button" id="${widgetId}-f1">$t^2$</button>\n` +
    `    <button type="button" id="${widgetId}-f2">$1/t$</button>\n` +
    `    <button type="button" id="${widgetId}-f3">$e^{t}$</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 230" width="560" height="230" role="img" aria-label="Continuous functional calculus: applying f to a self-adjoint operator maps its spectrum"><title>Continuous functional calculus: σ(f(a)) = f(σ(a)), the spectral mapping theorem</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* operator-algebras-funccalc widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=[0,1,2,3].map(function(i){ return document.getElementById('${widgetId}-f'+i); });\n` +
    `  if(!svg||!out||btns.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'middle', 'font-size':opt.size||11, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  var SPEC=[0.5,1,2,3];   // sigma(a) for a fixed positive self-adjoint a\n` +
    `  var FUN=[\n` +
    `    { label:'\\u221at', f:function(t){ return Math.sqrt(t); }, fmt:function(v){ return v.toFixed(2); } },\n` +
    `    { label:'t\\u00b2', f:function(t){ return t*t; }, fmt:function(v){ return v.toFixed(2); } },\n` +
    `    { label:'1/t', f:function(t){ return 1/t; }, fmt:function(v){ return v.toFixed(2); } },\n` +
    `    { label:'e\\u1d57', f:function(t){ return Math.exp(t); }, fmt:function(v){ return v.toFixed(2); } }\n` +
    `  ];\n` +
    `  var sel=0;\n` +
    `  function axis(y, vals, lo, hi, col, labels){ var x0=70, x1=500, sx=function(v){ return x0 + (v-lo)/(hi-lo)*(x1-x0); };\n` +
    `    svg.appendChild(mk('line',{x1:x0-10,y1:y,x2:x1+10,y2:y,stroke:'var(--line)','stroke-width':1}));\n` +
    `    for(var i=0;i<vals.length;i++){ svg.appendChild(mk('circle',{cx:sx(vals[i]),cy:y,r:4,fill:col})); txt(sx(vals[i]), y-9-((i%2)?12:0), labels[i], {size:10, fill:col}); }\n` +
    `    return sx; }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    btns.forEach(function(b,i){ var on=(i===sel); b.classList.toggle('active',on); b.setAttribute('aria-pressed',on?'true':'false'); });\n` +
    `    var F=FUN[sel];\n` +
    `    var img=SPEC.map(F.f);\n` +
    `    txt(280, 22, 'a = a* with \\u03c3(a) = {0.5, 1, 2, 3};   f(a) defined by the continuous functional calculus', {size:11, fill:'var(--mute)', italic:true});\n` +
    `    // domain axis: sigma(a) in [0, 3.4]\n` +
    `    txt(36, 78, '\\u03c3(a)', {anchor:'end', size:11, fill:'var(--yellow)', weight:600});\n` +
    `    var sxD=axis(78, SPEC, 0, 3.4, 'var(--yellow)', SPEC.map(function(v){ return ''+v; }));\n` +
    `    // range axis: sigma(f(a)) = f(sigma(a)), autoscaled\n` +
    `    var lo=Math.min.apply(null,img), hi=Math.max.apply(null,img), pad=(hi-lo)*0.15||0.5;\n` +
    `    txt(36, 168, '\\u03c3(f(a))', {anchor:'end', size:11, fill:'var(--cyan)', weight:600});\n` +
    `    var sxR=axis(168, img, lo-pad, hi+pad, 'var(--cyan)', img.map(F.fmt));\n` +
    `    // mapping arrows\n` +
    `    for(var i=0;i<SPEC.length;i++){ svg.appendChild(mk('line',{x1:sxD(SPEC[i]),y1:86,x2:sxR(img[i]),y2:160,stroke:'var(--pink)','stroke-width':1,opacity:0.7})); }\n` +
    `    txt(280, 122, 'f = ' + F.label + '   applied eigenvalue-by-eigenvalue', {size:11, fill:'var(--pink)'});\n` +
    `    txt(280, 200, '\\u03c3(f(a)) = f(\\u03c3(a)) = { ' + img.map(F.fmt).join(', ') + ' }   (spectral mapping)', {size:12, fill:'var(--green)', weight:600});\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    lines.push('For a normal element a of a C*-algebra (a*a = aa*), the continuous functional calculus is the unique isometric *-homomorphism \\u03a6_a : C(\\u03c3(a)) \\u2192 A with \\u03a6_a(id)=a; one writes f(a)=\\u03a6_a(f). It lets you plug ANY continuous f on the spectrum into a \\u2014 not just polynomials \\u2014 landing in the commutative C*-algebra C*(a,1) \\u2245 C(\\u03c3(a)).');\n` +
    `    lines.push('On the spectrum it acts by composition, so \\u03c3(f(a)) = f(\\u03c3(a)) (spectral mapping). Here \\u03c3(a) = {0.5, 1, 2, 3} and f = ' + F.label + ' gives \\u03c3(f(a)) = { ' + img.map(F.fmt).join(', ') + ' }.');\n` +
    `    lines.push('Payoffs: for a \\u2265 0, \\u221aa = (\\u221at)(a) is the unique positive square root; |a| = \\u221a(a*a) for any a; and the polar decomposition a = v|a| follows. This calculus is the analytic engine behind the spectral theorem for self-adjoint operators.');\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  btns.forEach(function(b,i){ b.addEventListener('click', function(){ sel=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
