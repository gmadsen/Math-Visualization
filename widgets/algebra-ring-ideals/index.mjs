// algebra-ring-ideals widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The arithmetic is intrinsic; params carry only
// chrome. The widget classifies the ideal (n) ⊆ ℤ and the quotient ℤ/n as
// prime / maximal / domain / field, with a zero-divisor witness for composite n.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">modulus $n$ in $\\mathbb{Z}/(n)$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="0" max="12" value="6" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nval">n = 6</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 220" width="560" height="220" role="img" aria-label="Classifying the ideal (n) in Z and the quotient Z/n"><title>Ideals in Z: (n) is prime iff n=0 or n is prime; maximal iff n is prime; Z/n is a field iff n is prime</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* algebra-ring-ideals widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var nIn=document.getElementById('${widgetId}-n'), nL=document.getElementById('${widgetId}-nval');\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  if(!nIn||!nL||!svg||!out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'start', 'font-size':opt.size||12, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  function isprime(k){ if(k<2) return false; for(var d=2;d*d<=k;d++){ if(k%d===0) return false; } return true; }\n` +
    `  function badge(x,y,label,ok){ svg.appendChild(mk('text',{x:x,y:y,'font-size':14,fill:ok?'var(--green)':'var(--pink)'},ok?'\\u2713':'\\u2717')); txt(x+18,y,label,{size:12,fill:'var(--ink)'}); }\n` +
    `  function smallFactor(n){ for(var d=2;d*d<=n;d++){ if(n%d===0) return d; } return n; }\n` +
    `  function draw(){\n` +
    `    var n=+nIn.value; nL.textContent='n = '+n;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var prime=isprime(n);\n` +
    `    var idealPrime = (n===0) || prime;       // (0) is prime in Z; (p) prime; (1) and composite are not\n` +
    `    var idealMax   = prime;                   // (p) maximal; (0) not (Z not a field); (1) not proper\n` +
    `    var quotDomain = (n===0) || prime;        // Z/0=Z domain; Z/p field; composite has zero-divisors; Z/1=0\n` +
    `    var quotField  = prime;\n` +
    `    var qname = (n===0)?'\\u2124':(n===1?'0 (the zero ring)':'\\u2124/'+n);\n` +
    `    txt(280, 26, 'ideal (' + n + ') \\u2286 \\u2124   \\u2014   quotient ring ' + qname, {anchor:'middle', size:13, fill:'var(--yellow)', weight:600});\n` +
    `    badge(120, 64, '(' + n + ') is a PRIME ideal', idealPrime);\n` +
    `    badge(120, 92, '(' + n + ') is a MAXIMAL ideal', idealMax);\n` +
    `    badge(120, 120, '\\u2124/' + (n<=1?'('+n+')':n) + ' is an integral DOMAIN', quotDomain);\n` +
    `    badge(120, 148, '\\u2124/' + (n<=1?'('+n+')':n) + ' is a FIELD', quotField);\n` +
    `    // witness / note\n` +
    `    if(n>=4 && !prime){ var a=smallFactor(n), b=n/a; txt(280, 182, 'zero divisors: ' + a + '\\u00b7' + b + ' = ' + n + ' \\u2261 0 (mod ' + n + '),  ' + a + ',' + b + ' \\u2260 0  \\u21d2 not a domain', {anchor:'middle', size:11, fill:'var(--pink)'}); }\n` +
    `    else if(prime){ txt(280, 182, '\\u2124/' + n + ' = F_' + n + ': every nonzero element is invertible', {anchor:'middle', size:11, fill:'var(--green)'}); }\n` +
    `    else if(n===0){ txt(280, 182, '(0) is prime since \\u2124 is a domain, but not maximal since \\u2124 is not a field', {anchor:'middle', size:11, fill:'var(--mute)'}); }\n` +
    `    else { txt(280, 182, '(1) = \\u2124 is not a proper ideal; \\u2124/1 = 0 is the zero ring', {anchor:'middle', size:11, fill:'var(--mute)'}); }\n` +
    `    txt(280, 206, '\\u2124/n field \\u21d4 (n) maximal \\u21d4 n prime;     \\u2124/n domain \\u21d4 (n) prime \\u21d4 n prime or 0', {anchor:'middle', size:10, fill:'var(--mute)', italic:true});\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    lines.push('An ideal I\\u2286R is closed under addition and under multiplication by any ring element; it is exactly the kernel of a ring map, and R/I is the quotient ring. (n)\\u2286\\u2124 is the set of multiples of ' + n + '.');\n` +
    `    if(prime) lines.push('n = ' + n + ' is prime, so (' + n + ') is MAXIMAL (no ideal strictly between (' + n + ') and \\u2124), hence also prime. Equivalently \\u2124/' + n + ' = F_' + n + ' is a FIELD (so in particular an integral domain). R/m is a field \\u21d4 the ideal m is maximal; R/p is a domain \\u21d4 the ideal p is prime.');\n` +
    `    else if(n===0) lines.push('(0) is PRIME because \\u2124 is an integral domain (ab=0 \\u21d2 a=0 or b=0), so \\u2124/(0)=\\u2124 is a domain. But (0) is NOT maximal \\u2014 it sits below every (p) \\u2014 and \\u2124 is not a field. This is the dimension-1 picture: (0) \\u228a (p), a chain of primes of length 1.');\n` +
    `    else if(n===1) lines.push('(1) = \\u2124 is the whole ring, not a proper ideal, so it counts as neither prime nor maximal; the quotient \\u2124/1 collapses to the zero ring {0}.');\n` +
    `    else { var a=smallFactor(n), b=n/a; lines.push('n = ' + n + ' is composite (' + n + ' = ' + a + '\\u00b7' + b + '), so (' + n + ') is NOT prime: ' + a + '\\u00b7' + b + ' \\u2208 (' + n + ') yet neither factor is. \\u2124/' + n + ' then has ZERO DIVISORS (' + a + '\\u00b7' + b + ' \\u2261 0), so it is not an integral domain \\u2014 and certainly not a field. The classic contrast: \\u2124/' + n + ' vs the field \\u2124/p.'); }\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  nIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
