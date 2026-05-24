// operator-algebras-cstar widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A gallery of the canonical C*-algebras with their
// involution, commutativity, unitality, and the C*-identity instance.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">example</span>\n` +
    `    <button type="button" id="${widgetId}-c0">$\\mathbb{C}$</button>\n` +
    `    <button type="button" id="${widgetId}-c1">$C(X)$</button>\n` +
    `    <button type="button" id="${widgetId}-c2">$M_n(\\mathbb{C})$</button>\n` +
    `    <button type="button" id="${widgetId}-c3">$B(H)$</button>\n` +
    `    <button type="button" id="${widgetId}-c4">$\\mathcal{K}(H)$</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 210" width="560" height="210" role="img" aria-label="A gallery of canonical C*-algebras"><title>The cast of C*-algebras: involution, commutativity, unitality, and the C*-identity</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* operator-algebras-cstar widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=[0,1,2,3,4].map(function(i){ return document.getElementById('${widgetId}-c'+i); });\n` +
    `  if(!svg||!out||btns.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'start', 'font-size':opt.size||12, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  function row(x,y,label,ok,detail){ svg.appendChild(mk('text',{x:x,y:y,'font-size':14,fill:ok?'var(--green)':'var(--pink)'},ok?'\\u2713':'\\u2717')); txt(x+18,y,label+(detail?'  \\u2014  '+detail:''),{size:11,fill:'var(--ink)'}); }\n` +
    `  var SCEN=[\n` +
    `    { name:'\\u2102', elts:'complex numbers', star:'a* = complex conjugate \\u0101', comm:true, unital:true, cstar:'\\u2016z\\u0304z\\u2016 = |z|\\u00b2 = \\u2016z\\u2016\\u00b2',\n` +
    `      note:'\\u2102 is the one-dimensional C*-algebra; involution is conjugation and the norm is |\\u00b7|. Every C*-algebra is built on copies of this scalar field.' },\n` +
    `    { name:'C(X)', elts:'continuous functions X\\u2192\\u2102 (X compact Hausdorff)', star:'f* = pointwise conjugate f\\u0304', comm:true, unital:true, cstar:'\\u2016f\\u0304f\\u2016\\u221e = \\u2016f\\u2016\\u221e\\u00b2',\n` +
    `      note:'C(X) with the sup norm is the prototype COMMUTATIVE unital C*-algebra. Gelfand duality (\\u00a77) is the converse: EVERY commutative unital C*-algebra is C(X) for a unique compact Hausdorff X = its spectrum.' },\n` +
    `    { name:'M_n(\\u2102)', elts:'n\\u00d7n complex matrices', star:'a* = conjugate transpose (adjoint)', comm:false, unital:true, cstar:'\\u2016a*a\\u2016 = \\u2016a\\u2016\\u00b2 (operator norm)',\n` +
    `      note:'M_n(\\u2102) with the operator norm is the prototype FINITE-DIMENSIONAL C*-algebra (noncommutative for n\\u22652). Every finite-dimensional C*-algebra is a finite product of matrix algebras \\u2295 M_{n_i}(\\u2102).' },\n` +
    `    { name:'B(H)', elts:'bounded operators on a Hilbert space H', star:'a* = Hilbert-space adjoint', comm:false, unital:true, cstar:'\\u2016a*a\\u2016 = \\u2016a\\u2016\\u00b2',\n` +
    `      note:'B(H) is the universal concrete C*-algebra: by the GNS construction (\\u00a78) every C*-algebra embeds as a norm-closed *-subalgebra of some B(H). Its unit is the identity operator.' },\n` +
    `    { name:'K(H)', elts:'compact operators on H', star:'a* = adjoint', comm:false, unital:false, cstar:'\\u2016a*a\\u2016 = \\u2016a\\u2016\\u00b2',\n` +
    `      note:'The compact operators K(H) form the key NON-UNITAL C*-algebra when dim H = \\u221e (the identity is not compact). It is a closed two-sided ideal in B(H); its multiplier algebra is B(H) and B(H)/K(H) is the Calkin algebra.' }\n` +
    `  ];\n` +
    `  var sel=1;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    btns.forEach(function(b,i){ var on=(i===sel); b.classList.toggle('active',on); b.setAttribute('aria-pressed',on?'true':'false'); });\n` +
    `    var S=SCEN[sel];\n` +
    `    txt(40, 26, 'A = ' + S.name + '   \\u2014   ' + S.elts, {size:12, fill:'var(--yellow)', weight:600});\n` +
    `    txt(40, 54, 'involution:  ' + S.star, {size:11, fill:'var(--cyan)'});\n` +
    `    row(40, 86, 'commutative', S.comm, S.comm?'ab = ba':'ab \\u2260 ba in general');\n` +
    `    row(40, 114, 'unital (has 1)', S.unital, S.unital?'':'no identity when dim H = \\u221e');\n` +
    `    txt(40, 146, 'C*-identity:  ' + S.cstar, {size:12, fill:'var(--green)', weight:600});\n` +
    `    txt(40, 172, 'every C*-algebra satisfies \\u2016a*a\\u2016 = \\u2016a\\u2016\\u00b2 \\u2014 the single axiom that pins down the norm', {size:10, fill:'var(--mute)', italic:true});\n` +
    `    out.textContent = S.note + '\\n\\nA C*-algebra is a complex Banach *-algebra in which the C*-identity \\u2016a*a\\u2016 = \\u2016a\\u2016\\u00b2 holds for every a. That one identity is astonishingly rigid: it forces \\u2016a*\\u2016 = \\u2016a\\u2016, makes the C*-norm unique on a given *-algebra, and (Gelfand\\u2013Naimark) guarantees every abstract C*-algebra is isometrically a *-subalgebra of some B(H) \\u2014 commutative ones are exactly the C(X).';\n` +
    `  }\n` +
    `  btns.forEach(function(b,i){ b.addEventListener('click', function(){ sel=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
