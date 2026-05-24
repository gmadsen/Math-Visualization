// class-field-theory-conductor-discriminant widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The conductor-discriminant formula for cyclotomic
// fields: |disc(Q(zeta_n))| = prod_{d|n} d^{P(d)}, P = mu * phi (the number of
// Dirichlet characters mod n of conductor exactly d), checked vs the closed form.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const btn = (n, on) =>
    `<button type="button" data-n="${n}" class="${on ? 'active' : ''}" aria-pressed="${on ? 'true' : 'false'}">n = ${n}</button>`;
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-btns">\n` +
    `    ${btn(5, true)}\n    ${btn(7, false)}\n    ${btn(8, false)}\n    ${btn(9, false)}\n    ${btn(12, false)}\n    ${btn(15, false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="The conductor-discriminant product for the cyclotomic field Q(zeta_n), broken down by the conductor of each character"><title>disc(Q(zeta_n)) as the product over divisors d of n of d to the power P(d), the number of Dirichlet characters mod n of conductor d</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* class-field-theory-conductor-discriminant widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  function phi(n){ var r=n,m=n; for(var p=2;p*p<=m;p++){ if(m%p===0){ while(m%p===0)m/=p; r-=r/p; } } if(m>1) r-=r/m; return r; }\n` +
    `  function mu(n){ if(n===1)return 1; var c=0,m=n; for(var p=2;p*p<=m;p++){ if(m%p===0){ m/=p; if(m%p===0)return 0; c++; } } if(m>1)c++; return c%2?-1:1; }\n` +
    `  function divisors(n){ var d=[]; for(var i=1;i<=n;i++) if(n%i===0)d.push(i); return d; }\n` +
    `  function P(d){ var s=0; divisors(d).forEach(function(e){ s+=mu(d/e)*phi(e); }); return s; }\n` +
    `  function primes(n){ var ps=[]; for(var p=2;p<=n;p++){ if(n%p===0){ var pr=true; for(var i=2;i*i<=p;i++) if(p%i===0){pr=false;break;} if(pr)ps.push(p); } } return ps; }\n` +
    `  function closedAbs(n){ var ph=phi(n), v=Math.pow(n,ph); primes(n).forEach(function(p){ v/=Math.pow(p, ph/(p-1)); }); return Math.round(v); }\n` +
    `  function factorStr(n){ if(n===1) return '1'; var fs=[],m=n; for(var p=2;p<=m;p++){ var e=0; while(m%p===0){m/=p;e++;} if(e) fs.push(e===1?(''+p):(p+'^'+e)); } return fs.join('\\u00b7'); }\n` +
    `  var cur=5;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var n=cur, ph=phi(n), ds=divisors(n);\n` +
    `    txt(20, 36, 'Gal(\\u211a(\\u03b6\\u2099)/\\u211a) = (\\u2124/'+n+')\\u00d7,  order \\u03c6('+n+') = '+ph+'  \\u2014  its \\u03c6('+n+') characters are the Dirichlet characters mod '+n, {size:11, fill:'var(--mute)'});\n` +
    `    txt(40, 64, 'd | n', {size:10, fill:'var(--mute)', weight:700}); txt(150, 64, 'P(d) = # \\u03c7 of conductor d', {size:10, fill:'var(--mute)', weight:700}); txt(380, 64, 'factor d^{P(d)}', {size:10, fill:'var(--mute)', weight:700});\n` +
    `    var y=88, prod=1, parts=[];\n` +
    `    ds.forEach(function(d){ var pd=P(d); var fac=Math.round(Math.pow(d,pd)); prod*=fac;\n` +
    `      var col = d===1?'var(--mute)':'var(--cyan)';\n` +
    `      txt(40, y, ''+d, {size:11, fill:col, mono:true}); txt(150, y, ''+pd+(d===1?'  (trivial \\u03c7 \\u2192 unramified)':(pd>0?'':'')), {size:11, fill:col, mono:true}); txt(380, y, d+'^'+pd+' = '+fac, {size:11, fill:col, mono:true, weight: d===1?'normal':700});\n` +
    `      if(pd>0||d===1) parts.push(d+'^'+pd); y+=22; });\n` +
    `    var clo=closedAbs(n); var sign=(ph/2)%2===0?1:-1;\n` +
    `    svg.appendChild(mk('line',{x1:30,y1:y-4,x2:520,y2:y-4,stroke:'var(--line)','stroke-width':1})); y+=18;\n` +
    `    txt(40, y, '\\u220f d^{P(d)} = '+parts.join(' \\u00b7 ')+' = '+prod, {size:12, fill:'var(--green)', weight:700, mono:true}); y+=24;\n` +
    `    txt(40, y, '|disc(\\u211a(\\u03b6\\u2099))| = '+factorStr(clo)+' = '+clo+'   '+(prod===clo?'\\u2713 matches':'\\u2260'), {size:12, fill: prod===clo?'var(--green)':'var(--pink)', weight:700, mono:true});\n` +
    `    out.textContent='The Galois group of \\u211a(\\u03b6\\u2099)/\\u211a is (\\u2124/'+n+')\\u00d7, and its characters are exactly the Dirichlet characters mod '+n+'. Each character \\u03c7 has an Artin CONDUCTOR f(\\u03c7) \\u2014 the smallest modulus through which it factors \\u2014 and the CONDUCTOR-DISCRIMINANT FORMULA (F\\u00fchrerdiskriminantenproduktformel, Hasse) writes the discriminant as a product over all characters: |disc(\\u211a(\\u03b6\\u2099)/\\u211a)| = \\u220f_\\u03c7 f(\\u03c7). Grouping the characters by conductor, this is \\u220f_{d|'+n+'} d^{P(d)}, where P(d) is the number of characters of conductor exactly d \\u2014 i.e. the number of PRIMITIVE Dirichlet characters mod d, given by the M\\u00f6bius convolution P = \\u03bc * \\u03c6 (so \\u03c6 = \\u03a3_{e|d} P(e), every character induced from a unique primitive one). For n = '+n+' the table gives \\u220f d^{P(d)} = '+prod+', matching the closed form |disc| = '+factorStr(clo)+' (the actual disc carries a sign ('+(-1==sign?'\\u2212':'+')+') from (\\u22121)^{\\u03c6(n)/2}). Ramification is thus controlled CHARACTER BY CHARACTER: the trivial character has conductor 1 and contributes the factor 1 (an unramified prime lies in no conductor); a prime p|n ramifies precisely through the characters non-trivial on its inertia, tamely contributing one power of p per such character, wildly more (via the Swan conductor).';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; cur=parseInt(b.getAttribute('data-n'),10);\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
