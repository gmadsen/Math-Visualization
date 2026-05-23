// commutative-algebra-koszul widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The combinatorics are intrinsic; params carry only
// chrome. The widget draws the Koszul complex K_•(a_1,…,a_n)=Λ•R^n with binomial
// ranks and states the regular-sequence ⇔ acyclicity theorem.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">number of elements $n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="1" max="4" value="3" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nval">n = 3</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 230" width="560" height="230" role="img" aria-label="The Koszul complex with binomial ranks"><title>Koszul complex K(a_1,...,a_n): the exterior algebra with binomial ranks; regular sequence iff acyclic</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* commutative-algebra-koszul widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var nIn=document.getElementById('${widgetId}-n'), nL=document.getElementById('${widgetId}-nval');\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  if(!nIn||!nL||!svg||!out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'middle', 'font-size':opt.size||11, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  function binom(n,k){ if(k<0||k>n) return 0; var r=1; for(var j=0;j<k;j++){ r=r*(n-j)/(j+1); } return Math.round(r); }\n` +
    `  function draw(){\n` +
    `    var n=+nIn.value; nL.textContent='n = '+n;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var tot=Math.pow(2,n);\n` +
    `    txt(280, 22, 'K\\u2022(a\\u2081,\\u2026,a_' + n + ') = \\u039b\\u2022R^' + n + ',   total rank \\u03a3_k C(' + n + ',k) = 2^' + n + ' = ' + tot, {size:11, fill:'var(--mute)', italic:true});\n` +
    `    // chain of boxes K_n -> ... -> K_0 (d lowers degree)\n` +
    `    var terms=n+1, x0=70, x1=500, y=92, bw=Math.min(70, (x1-x0)/terms - 8);\n` +
    `    function cx(i){ return x0 + (terms<=1? (x1-x0)/2 : i*(x1-x0)/(terms-1)); }   // i=0 is K_n (left), i=terms-1 is K_0 (right)\n` +
    `    txt(40, y+4, '0 \\u2192', {size:11, fill:'var(--mute)'});\n` +
    `    for(var i=0;i<terms;i++){ var k=n-i, rk=binom(n,k), X=cx(i);\n` +
    `      svg.appendChild(mk('rect', {x:X-bw/2, y:y-15, width:bw, height:30, rx:5, fill: (k===0)?'color-mix(in srgb, var(--yellow) 18%, transparent)':'var(--panel2)', stroke:(k===0)?'var(--yellow)':'var(--cyan)', 'stroke-width':1.4}));\n` +
    `      txt(X, y+4, (rk===1?'R':'R^'+rk), {size:12, fill:(k===0)?'var(--yellow)':'var(--ink)'});\n` +
    `      txt(X, y-24, 'K_' + k, {size:9, fill:'var(--mute)'});\n` +
    `      txt(X, y+30, 'C(' + n + ',' + k + ')=' + rk, {size:8, fill:'var(--mute)'});\n` +
    `      if(i<terms-1){ var xm=(cx(i)+cx(i+1))/2; txt(xm, y+4, '\\u2192', {size:15, fill:'var(--cyan)'}); txt(xm, y-10, 'd', {size:9, fill:'var(--cyan)', italic:true}); }\n` +
    `    }\n` +
    `    txt(x1+20, y+4, '\\u2192 0', {size:11, fill:'var(--mute)', anchor:'start'});\n` +
    `    // facts\n` +
    `    txt(280, 150, 'Euler characteristic  \\u03a3_k (\\u22121)^k C(' + n + ',k) = (1\\u22121)^' + n + ' = 0', {size:11, fill:'var(--ink)'});\n` +
    `    txt(280, 176, 'regular sequence  \\u21d4  exact in positive degrees,  with  H\\u2080 = R/(a\\u2081,\\u2026,a_' + n + ')', {size:12, fill:'var(--green)', weight:600});\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    lines.push('The Koszul complex K\\u2022(a\\u2081,\\u2026,a_' + n + ') is the exterior algebra \\u039b\\u2022R^' + n + ' with differential d(e_{i\\u2081}\\u2227\\u2026\\u2227e_{i_k}) = \\u03a3_j (\\u22121)^{j\\u22121} a_{i_j} e_{i\\u2081}\\u2227\\u2026\\u0302e_{i_j}\\u2026\\u2227e_{i_k}. So K_k = \\u039b^k R^' + n + ' = R^{C(' + n + ',k)}; here the ranks are ' + Array.from({length:n+1},function(_,k){return binom(n,k);}).join(', ') + ' (sum 2^' + n + ' = ' + tot + '). d\\u00b2 = 0 holds precisely because a_i a_j = a_j a_i.');\n` +
    `    if(n===1) lines.push('n=1:  0 \\u2192 R \\u2192(\\u00d7a\\u2081)\\u2192 R \\u2192 0.  H\\u2080 = R/(a\\u2081); H\\u2081 = ker(\\u00d7a\\u2081) = ann(a\\u2081). So a\\u2081 is a regular element (non-zero-divisor) iff H\\u2081 = 0.');\n` +
    `    else if(n===2) lines.push('n=2:  0 \\u2192 R \\u2192 R\\u00b2 \\u2192 R \\u2192 0 with d\\u2082=(\\u2212a\\u2082, a\\u2081)\\u1d40 and d\\u2081=(a\\u2081, a\\u2082).  H\\u2080 = R/(a\\u2081,a\\u2082); H\\u2081 vanishes iff every relation a\\u2081x = \\u2212a\\u2082y is Koszul-trivial \\u2014 i.e. (a\\u2081,a\\u2082) is a regular sequence.');\n` +
    `    lines.push('Theorem: a\\u2081,\\u2026,a_' + n + ' is a REGULAR SEQUENCE (each a_i a non-zero-divisor on R/(a\\u2081,\\u2026,a_{i\\u22121})) \\u21d4 K\\u2022 is exact in positive degrees, H\\u2080 = R/(a\\u2081,\\u2026,a_' + n + '). Then K\\u2022 is a finite free RESOLUTION of that quotient \\u2014 used to compute Tor and Ext against it, and to read off depth (the length of a maximal regular sequence in an ideal).');\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  nIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
