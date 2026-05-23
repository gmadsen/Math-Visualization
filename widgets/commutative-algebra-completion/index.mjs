// commutative-algebra-completion widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The p-adic arithmetic is intrinsic; params carry
// only chrome. The widget realizes the I-adic completion ℤ_p = lim ℤ/pⁿ as a
// tower of coherent residues with a p-adic digit expansion.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">prime $p$</span>\n` +
    `    <button type="button" id="${widgetId}-p2">2</button>\n` +
    `    <button type="button" id="${widgetId}-p3">3</button>\n` +
    `    <button type="button" id="${widgetId}-p5">5</button>\n` +
    `    <button type="button" id="${widgetId}-p7">7</button>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">element</span>\n` +
    `    <button type="button" id="${widgetId}-e0">$-1$</button>\n` +
    `    <button type="button" id="${widgetId}-e1">$13$</button>\n` +
    `    <button type="button" id="${widgetId}-e2">$1/(1-p)$</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 250" width="560" height="250" role="img" aria-label="The p-adic integers as the inverse limit of Z mod p to the n"><title>Completion: Z_p = lim Z/p^n as a tower of coherent residues with a p-adic digit expansion</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* commutative-algebra-completion widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var pB={2:document.getElementById('${widgetId}-p2'),3:document.getElementById('${widgetId}-p3'),5:document.getElementById('${widgetId}-p5'),7:document.getElementById('${widgetId}-p7')};\n` +
    `  var eB=[document.getElementById('${widgetId}-e0'),document.getElementById('${widgetId}-e1'),document.getElementById('${widgetId}-e2')];\n` +
    `  if(!svg||!out|| !pB[2]||!pB[3]||!pB[5]||!pB[7] || eB.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'start', 'font-size':opt.size||11, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  // residue r_n = element mod p^n in [0, p^n)\n` +
    `  function resid(elt, p, n){ var pn=Math.pow(p,n);\n` +
    `    if(elt===0) return pn-1;            // -1  = ...(p-1)(p-1)\n` +
    `    if(elt===1) return 13 % pn;          // 13\n` +
    `    return (pn-1)/(p-1); }                // 1/(1-p) = 1+p+p^2+...\n` +
    `  var ELT=['\\u22121','13','1/(1\\u2212p)'], NAME=['\\u22121','13','1/(1\\u2212p)'];\n` +
    `  var p=5, elt=0;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    for(var k in pB){ var on=(+k===p); pB[k].classList.toggle('active',on); pB[k].setAttribute('aria-pressed',on?'true':'false'); }\n` +
    `    eB.forEach(function(b,i){ var on=(i===elt); b.classList.toggle('active',on); b.setAttribute('aria-pressed',on?'true':'false'); });\n` +
    `    var N=6, r=[]; for(var n=0;n<=N;n++) r.push(n===0?0:resid(elt,p,n));\n` +
    `    var digits=[]; for(var kk=0;kk<N;kk++) digits.push((r[kk+1]-r[kk])/Math.pow(p,kk));\n` +
    `    txt(280, 22, '\\u2124_' + p + ' = lim \\u2124/' + p + '\\u207f   (coherent residues: r_{n+1} \\u2261 r_n mod ' + p + '\\u207f)', {anchor:'middle', size:11, fill:'var(--mute)', italic:true});\n` +
    `    // digit expansion\n` +
    `    var ds=digits.slice().reverse().join('');\n` +
    `    txt(280, 48, NAME[elt] + '  =  \\u2026' + ds + '   (base ' + p + ', digits low\\u2192high: ' + digits.join(' ') + ')', {anchor:'middle', size:12, fill:'var(--yellow)', weight:600});\n` +
    `    // coherent residue tower\n` +
    `    var x0=120, y0=80, dy=24;\n` +
    `    for(var m=1;m<=N;m++){ var y=y0+(m-1)*dy;\n` +
    `      txt(x0, y, 'mod ' + p + '^' + m + ':', {anchor:'end', size:11, fill:'var(--mute)'});\n` +
    `      txt(x0+14, y, '' + r[m], {size:13, fill:'var(--cyan)', weight:600});\n` +
    `      txt(x0+90, y, '=  ' + digits.slice(0,m).map(function(d,i){ return d+'\\u00b7'+p+'^'+i; }).join(' + '), {size:10, fill:'var(--ink)'});\n` +
    `      if(m<N) svg.appendChild(mk('text', {x:x0-40, y:y+dy-7, 'font-size':12, fill:'var(--green)'}, '\\u2193 reduce'));\n` +
    `    }\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    lines.push('Completion at I=(' + p + '): \\u2124_' + p + ' = lim\\u2190 \\u2124/' + p + '\\u207f is the set of coherent towers (r_n) with r_n \\u2208 \\u2124/' + p + '\\u207f and r_{n+1} \\u2261 r_n (mod ' + p + '\\u207f). Equivalently, formal base-' + p + ' expansions \\u03a3 d_k ' + p + '^k with digits d_k \\u2208 {0,\\u2026,' + (p-1) + '} \\u2014 but infinitely many digits to the LEFT.');\n` +
    `    if(elt===0) lines.push('Here \\u22121 = ' + digits.join('') + '\\u2026 (every digit ' + (p-1) + '): indeed (' + (p-1) + ')(1+' + p + '+' + p + '\\u00b2+\\u2026) sums to \\u22121, since each partial residue is ' + p + '\\u207f\\u22121 \\u2261 \\u22121 (mod ' + p + '\\u207f). A non-unit-looking series that IS \\u22121 \\u2014 the hallmark of completion.');\n` +
    `    else if(elt===2) lines.push('Here 1/(1\\u2212' + p + ') = 1+' + p + '+' + p + '\\u00b2+\\u2026 (every digit 1): the geometric series converges ' + p + '-adically because ' + p + '^k \\u2192 0, and (1\\u2212' + p + ')(1+' + p + '+\\u2026)=1. A non-integer rational living in \\u2124_' + p + '.');\n` +
    `    else lines.push('Here 13 is an ordinary integer; its tower stabilizes once ' + p + '\\u207f > 13, so its expansion is the finite base-' + p + ' form of 13 followed by zeros \\u2014 \\u2124 sits inside \\u2124_' + p + ' as the eventually-terminating towers.');\n` +
    `    lines.push('Why completion matters: \\u2124_' + p + ' is faithfully flat over \\u2124_{(' + p + ')}, \\u2229_n (' + p + ')^n = 0 (Krull intersection), and Hensel\\u2019s lemma lifts factorizations from \\u2124/' + p + ' \\u2014 the algebraic model of an infinitesimal neighbourhood.');\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  for(var k in pB){ (function(kk){ pB[kk].addEventListener('click', function(){ p=+kk; draw(); }); })(k); }\n` +
    `  eB.forEach(function(b,i){ b.addEventListener('click', function(){ elt=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
