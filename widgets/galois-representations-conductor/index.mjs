// galois-representations-conductor widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The Artin conductor N = prod p^{f_p} of the l-adic
// representation rho_{E,l} of an elliptic curve, read off the reduction type at
// each bad prime: f_p = dim V - dim V^{I_p} + (Swan/wild term).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const btn = (c, on) =>
    `<button type="button" data-c="${c}" class="${on ? 'active' : ''}" aria-pressed="${on ? 'true' : 'false'}">${c}</button>`;
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-btns">\n` +
    `    ${btn('11a', true)}\n    ${btn('14a', false)}\n    ${btn('20a', false)}\n    ${btn('27a', false)}\n    ${btn('32a', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="Bad primes of an elliptic curve with their reduction type, inertia-invariant dimension, and conductor exponent, multiplying to the conductor N"><title>For each elliptic curve, a table of its bad primes p with reduction type, dim V to the I_p, conductor exponent f_p = 2 minus dim V to the I_p plus a wild term, and the product N = prod p to the f_p</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* galois-representations-conductor widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  var CURVES={\n` +
    `    '11a':{N:11, bad:[{p:11,t:'split multiplicative',dv:1,w:0}]},\n` +
    `    '14a':{N:14, bad:[{p:2,t:'multiplicative',dv:1,w:0},{p:7,t:'multiplicative',dv:1,w:0}]},\n` +
    `    '20a':{N:20, bad:[{p:2,t:'additive',dv:0,w:0},{p:5,t:'multiplicative',dv:1,w:0}]},\n` +
    `    '27a':{N:27, bad:[{p:3,t:'additive (wild)',dv:0,w:1}]},\n` +
    `    '32a':{N:32, bad:[{p:2,t:'additive (wild)',dv:0,w:3}]}\n` +
    `  };\n` +
    `  var cur='11a';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var C=CURVES[cur];\n` +
    `    txt(20, 32, 'E = '+cur+',   \\u2113-adic Tate module representation \\u03c1_{E,\\u2113}: G_\\u211a \\u2192 GL\\u2082(\\u2124_\\u2113)', {size:12, fill:'var(--ink)', weight:700});\n` +
    `    txt(20, 52, 'good primes p \\u2224 N: \\u03c1(I_p) = 1 (unramified), f_p = 0 \\u2014 only the bad primes below contribute', {size:10, fill:'var(--mute)'});\n` +
    `    txt(28, 84, 'p', {size:10, fill:'var(--mute)', weight:700, mono:true});\n` +
    `    txt(62, 84, 'reduction type', {size:10, fill:'var(--mute)', weight:700});\n` +
    `    txt(250, 84, 'dim V^{I_p}', {size:10, fill:'var(--mute)', weight:700});\n` +
    `    txt(340, 84, '\\u03b5=2\\u2212dim V^{I_p}', {size:10, fill:'var(--mute)', weight:700});\n` +
    `    txt(452, 84, '\\u03b4', {size:10, fill:'var(--mute)', weight:700});\n` +
    `    txt(486, 84, 'f_p', {size:10, fill:'var(--mute)', weight:700});\n` +
    `    var y=110, prod=1, parts=[];\n` +
    `    C.bad.forEach(function(b){ var eps=2-b.dv, f=eps+b.w, pf=Math.pow(b.p,f); prod*=pf; parts.push(b.p+'^'+f);\n` +
    `      var col = b.w>0?'var(--pink)':(b.dv===1?'var(--cyan)':'var(--violet)');\n` +
    `      txt(28, y, ''+b.p, {size:11, fill:col, mono:true, weight:700});\n` +
    `      txt(62, y, b.t, {size:11, fill:col});\n` +
    `      txt(262, y, ''+b.dv, {size:11, fill:col, mono:true});\n` +
    `      txt(372, y, ''+eps, {size:11, fill:col, mono:true});\n` +
    `      txt(452, y, ''+b.w, {size:11, fill:col, mono:true});\n` +
    `      txt(486, y, ''+f, {size:11, fill:col, mono:true, weight:700});\n` +
    `      txt(512, y, '(p^'+f+'='+pf+')', {size:9, fill:'var(--mute)', mono:true});\n` +
    `      y+=26; });\n` +
    `    svg.appendChild(mk('line',{x1:20,y1:y-6,x2:540,y2:y-6,stroke:'var(--line)','stroke-width':1})); y+=18;\n` +
    `    txt(28, y, 'N = \\u220f_p p^{f_p} = '+parts.join(' \\u00b7 ')+' = '+prod, {size:13, fill:'var(--green)', weight:700, mono:true}); y+=24;\n` +
    `    txt(28, y, 'conductor of E = '+C.N+'   '+(prod===C.N?'\\u2713 matches':'\\u2260'), {size:12, fill: prod===C.N?'var(--green)':'var(--pink)', weight:700, mono:true}); y+=26;\n` +
    `    txt(28, y, 'f_p = 1 \\u21d4 multiplicative (tame);   f_p \\u2265 2 \\u21d4 additive  (\\u03b4>0 only at p=2,3, wild)', {size:10, fill:'var(--mute)'});\n` +
    `    out.textContent='At a prime p, the decomposition group D_p \\u2282 G_\\u211a (the Galois group of the local field \\u211a_p) contains the INERTIA group I_p, and the quotient D_p / I_p is generated by Frobenius. A representation \\u03c1 is UNRAMIFIED at p when \\u03c1(I_p) = 1 \\u2014 then \\u03c1(Frob_p) is a well-defined conjugacy class, which is what the Euler factor at p sees. The ARTIN CONDUCTOR EXPONENT f_p = (dim V \\u2212 dim V^{I_p}) + \\u03b4_p measures the failure: the first (TAME) part counts the coordinates inertia moves, and the SWAN term \\u03b4_p (non-zero only in WILD ramification, where p divides the order of \\u03c1(I_p), so only at p = 2, 3 for elliptic curves) counts higher inertia. For \\u03c1_{E,\\u2113} (\\u2113 \\u2260 p) the reduction type of E at p reads it off directly: GOOD reduction \\u2192 unramified, V^{I_p} = V, f_p = 0; MULTIPLICATIVE reduction \\u2192 inertia acts by a single unipotent block, dim V^{I_p} = 1, f_p = 1 (tame); ADDITIVE reduction \\u2192 dim V^{I_p} = 0, f_p = 2 (tame, p \\u2265 5) or f_p \\u2265 2 with a wild term (p = 2, 3). The global conductor N(E) = \\u220f_p p^{f_p} is exactly the level appearing in the curve\\u2019s L-function and \\u2014 by modularity \\u2014 the level of its weight-2 newform; for E = '+cur+' the bad primes multiply to N = '+prod+'. (Ogg\\u2019s formula f_p = v_p(\\u0394_min) + 1 \\u2212 m_p ties \\u03b4_p to the minimal discriminant and the number of components of the N\\u00e9ron special fibre, so this is computable, not folklore.)';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; cur=b.getAttribute('data-c');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
