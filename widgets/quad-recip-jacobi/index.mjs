// quad-recip-jacobi widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The Jacobi symbol (a/n) = ∏(a/pᵢ)^eᵢ for odd n, with
// the caveat that (a/n)=+1 does NOT imply a is a square mod n (e.g. (2/15)=+1 but
// 2 is a nonsquare mod 15).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const nBtns = [9, 15, 21, 25, 35, 45].map((n) =>
    `    <button type="button" id="${widgetId}-n${n}">${n}</button>`).join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-a">numerator $a$</label>\n` +
    `    <input type="range" id="${widgetId}-a" min="2" max="15" value="2" step="1">\n` +
    `    <span class="pill" id="${widgetId}-av">a = 2</span>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">odd $n$</span>\n` +
    nBtns + `\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 280" width="580" height="280" role="img" aria-label="The Jacobi symbol computed by factoring the denominator, with a check of actual quadratic residue status"><title>The Jacobi symbol (a/n) is the product of Legendre symbols over the prime factors of n; it equals 1 does not imply a is a square mod n</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* quad-recip-jacobi widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var NS_LIST=[9,15,21,25,35,45];\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sa=document.getElementById('${widgetId}-a'), av=document.getElementById('${widgetId}-av');\n` +
    `  var nB=NS_LIST.map(function(n){ return document.getElementById('${widgetId}-n'+n); });\n` +
    `  if(!svg||!out||!sa||!av||nB.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    `  function gcd(a,b){ while(b){ var t=a%b; a=b; b=t; } return a; }\n` +
    `  function powmod(b,e,m){ b%=m; var r=1; while(e>0){ if(e&1) r=(r*b)%m; b=(b*b)%m; e>>=1; } return r; }\n` +
    `  function legendre(a,p){ a=((a%p)+p)%p; if(a===0) return 0; var r=powmod(a,(p-1)/2,p); return r===1?1:-1; }\n` +
    `  function factor(n){ var f=[], d=2; while(d*d<=n){ if(n%d===0){ var e=0; while(n%d===0){ n=n/d; e++; } f.push([d,e]); } d++; } if(n>1) f.push([n,1]); return f; }\n` +
    `  function isQR(a,n){ a=((a%n)+n)%n; if(a===0) return true; for(var x=1;x<n;x++){ if((x*x)%n===a) return true; } return false; }\n` +
    `  var a=2, n=15;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    a=parseInt(sa.value,10); av.textContent='a = '+a;\n` +
    `    nB.forEach(function(b,i){ var on=(NS_LIST[i]===n); b.classList.toggle('active',on); b.setAttribute('aria-pressed',on?'true':'false'); });\n` +
    `    var g=gcd(a,n), fac=factor(n);\n` +
    `    var jac = g>1 ? 0 : fac.reduce(function(acc,pe){ return acc*Math.pow(legendre(a,pe[0]), pe[1]); }, 1);\n` +
    `    var facStr=fac.map(function(pe){ return pe[1]>1? pe[0]+'^'+pe[1] : ''+pe[0]; }).join(' \\u00b7 ');\n` +
    `    txt(36, 44, '('+a+' / '+n+')   with  '+n+' = '+facStr, {size:14, fill:'var(--yellow)', weight:700});\n` +
    `    if(g>1){\n` +
    `      txt(36, 78, 'gcd('+a+', '+n+') = '+g+' > 1   \\u21d2   ('+a+'/'+n+') = 0', {size:13, fill:'var(--mute)'});\n` +
    `    } else {\n` +
    // factor expansion
    `      var parts=fac.map(function(pe){ var L=legendre(a,pe[0]); var base='('+a+'/'+pe[0]+') = '+(L>0?'+1':'\\u22121'); return pe[1]>1? base+'  (^'+pe[1]+')' : base; });\n` +
    `      txt(36, 78, '('+a+'/'+n+') = '+fac.map(function(pe){ return '('+a+'/'+pe[0]+')'+(pe[1]>1?'^'+pe[1]:''); }).join(' \\u00b7 '), {size:12, fill:'var(--ink)'});\n` +
    `      parts.forEach(function(s,i){ txt(56, 104+i*20, s, {size:11, fill:'var(--cyan)'}); });\n` +
    `      txt(36, 104+parts.length*20+8, '\\u21d2  ('+a+'/'+n+') = '+(jac>0?'+1':'\\u22121'), {size:14, fill:jac>0?'var(--green)':'var(--pink)', weight:700});\n` +
    `    }\n` +
    // QR caveat check
    `    var qr=isQR(a,n);\n` +
    `    var cy=200;\n` +
    `    txt(36, cy, 'Is '+a+' actually a square mod '+n+'?   '+(qr?'YES':'NO'), {size:13, fill:qr?'var(--green)':'var(--pink)', weight:600});\n` +
    `    if(g===1 && jac===1 && !qr){ txt(36, cy+24, 'CAVEAT: ('+a+'/'+n+') = +1  but  '+a+' is NOT a square mod '+n+'.', {size:12, fill:'var(--orange)', weight:600}); txt(36, cy+42, 'the Jacobi symbol only tracks the parity of nonsquare factors', {size:10, fill:'var(--mute)', italic:true}); }\n` +
    `    else if(g===1 && jac===-1){ txt(36, cy+24, '(\\u2212 sign \\u21d2 odd # of factors where '+a+' is a nonsquare \\u21d2 '+a+' is NOT a square mod '+n+')', {size:10, fill:'var(--mute)', italic:true}); }\n` +
    `    else if(g===1 && jac===1 && qr){ txt(36, cy+24, '(here +1 and genuinely a square \\u2014 but that agreement is not guaranteed)', {size:10, fill:'var(--mute)', italic:true}); }\n` +
    `    out.textContent = 'The Jacobi symbol extends Legendre to odd composite denominators by factoring the bottom: ('+a+'/'+n+') = \\u220f ('+a+'/p\\u1d62)^{e\\u1d62} over the prime power factorization '+n+' = '+facStr+'. '+(g>1? 'Here gcd('+a+','+n+') = '+g+', so the symbol is 0.' : 'It comes out '+(jac>0?'+1':'\\u22121')+'. ')+(g===1?('A direct scan of the squares mod '+n+' shows '+a+' '+(qr?'IS':'is NOT')+' a quadratic residue. '+((jac===1&&!qr)?'This is the key caveat: (a/n) = +1 does NOT imply a is a square mod n \\u2014 it only records the parity of the prime factors at which a is a nonsquare (here an even number of them, two, so the signs cancel to +1 even though a fails to be a QR at each).':'')) : '')+' What does survive verbatim from Legendre is the reciprocity identity (m/n)(n/m) = (\\u22121)^{((m\\u22121)/2)((n\\u22121)/2)} and both supplements \\u2014 which is exactly what makes the symbol the right tool for fast computation.';\n` +
    `  }\n` +
    `  sa.addEventListener('input', draw);\n` +
    `  nB.forEach(function(b,i){ b.addEventListener('click', function(){ n=NS_LIST[i]; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
