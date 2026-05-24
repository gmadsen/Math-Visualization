// class-field-theory-existence widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Takagi's existence theorem as the lattice
// anti-isomorphism between subgroups of (Z/m)^x and subfields of Q(zeta_m),
// for m = 8 and 12 (Klein four-group cases).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const btn = (m, on) =>
    `<button type="button" data-m="${m}" class="${on ? 'active' : ''}" aria-pressed="${on ? 'true' : 'false'}">m = ${m}</button>`;
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-btns">\n    ${btn(8, true)}\n    ${btn(12, false)}\n  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="The lattice of subgroups of the unit group versus the lattice of subfields of the cyclotomic field, related by the Galois correspondence"><title>Takagi existence: subgroups H of (Z/m)^x correspond bijectively to subfields of Q(zeta_m), the lattice of fields anti-isomorphic to the lattice of subgroups</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* class-field-theory-existence widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var DATA={\n` +
    `    8:{ unit:'{1,3,5,7}', zeta:'\\u211a(\\u03b6\\u2088)', mid:[{H:'{1,5}',F:'\\u211a(i)'},{H:'{1,7}',F:'\\u211a(\\u221a2)'},{H:'{1,3}',F:'\\u211a(\\u221a\\u22122)'}] },\n` +
    `    12:{ unit:'{1,5,7,11}', zeta:'\\u211a(\\u03b6\\u2081\\u2082)', mid:[{H:'{1,5}',F:'\\u211a(i)'},{H:'{1,7}',F:'\\u211a(\\u221a\\u22123)'},{H:'{1,11}',F:'\\u211a(\\u221a3)'}] }\n` +
    `  };\n` +
    `  var curM=8;\n` +
    `  function node(x,y,line1,line2,col){ var w=104,h=34; svg.appendChild(mk('rect',{x:(x-w/2).toFixed(1),y:(y-h/2).toFixed(1),width:w,height:h,rx:5,fill:'var(--panel2)',stroke:col,'stroke-width':1.4}));\n` +
    `    txt(x, y-3, line1, {size:10, fill:col, weight:700}); txt(x, y+11, line2, {size:8, fill:'var(--mute)'}); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var m=curM, D=DATA[m]; var cx=280, topY=66, midY=168, botY=272, sp=170;\n` +
    `    txt(cx, 36, 'Galois correspondence for \\u211a(\\u03b6\\u2098)/\\u211a:  subgroups H \\u2286 (\\u2124/'+m+')\\u00d7  \\u27f7  subfields, ANTI-isomorphically', {size:10, fill:'var(--mute)'});\n` +
    `    var midX=[cx-sp, cx, cx+sp];\n` +
    `    // edges (drawn first): bottom {1} to each mid, each mid to top G\n` +
    `    midX.forEach(function(mx){ svg.appendChild(mk('line',{x1:cx,y1:botY-17,x2:mx,y2:midY+17,stroke:'var(--line)','stroke-width':1})); svg.appendChild(mk('line',{x1:mx,y1:midY-17,x2:cx,y2:topY+17,stroke:'var(--line)','stroke-width':1})); });\n` +
    `    // top: whole group G  <->  Q  (deg 1)\n` +
    `    node(cx, topY, 'H = (\\u2124/'+m+')\\u00d7', 'Fix = \\u211a   [L:\\u211a]=1', 'var(--mute)');\n` +
    `    // middle: three index-2 subgroups <-> three quadratic subfields (deg 2)\n` +
    `    D.mid.forEach(function(nd,i){ node(midX[i], midY, 'H = '+nd.H, 'Fix = '+nd.F+'   [L:\\u211a]=2', 'var(--cyan)'); });\n` +
    `    // bottom: trivial {1} <-> Q(zeta_m)  (deg phi(m)=4)\n` +
    `    node(cx, botY, 'H = {1}', 'Fix = '+D.zeta+'   [L:\\u211a]=4', 'var(--green)');\n` +
    `    // anti-iso annotation\n` +
    `    txt(cx-sp-58, topY, 'small field', {anchor:'middle', size:8, fill:'var(--mute)'}); txt(cx-sp-58, topY+12, '(big H)', {anchor:'middle', size:8, fill:'var(--mute)'});\n` +
    `    txt(cx-sp-58, botY, 'big field', {anchor:'middle', size:8, fill:'var(--green)'}); txt(cx-sp-58, botY+12, '(H = {1})', {anchor:'middle', size:8, fill:'var(--green)'});\n` +
    `    out.textContent='Artin reciprocity IDENTIFIES the unit group (\\u2124/'+m+')\\u00d7 with Gal(\\u211a(\\u03b6\\u2098)/\\u211a) (the Artin map sending a prime p\\u2224'+m+' to the Frobenius, i.e. to p mod '+m+'); for each abelian L inside \\u211a(\\u03b6\\u2098), Galois restriction then gives a SURJECTION Gal(\\u211a(\\u03b6\\u2098)/\\u211a) \\u21a0 Gal(L/\\u211a). TAKAGI\\u2019S EXISTENCE THEOREM makes the resulting correspondence a BIJECTION: every (admissible) finite-index subgroup H is the kernel of the Artin map for a genuine abelian extension, so finite abelian extensions L are in bijection with finite-index (open) subgroups H, via H = ker(\\u2192 Gal(L/\\u211a)) and L = Fix(H), with Gal(L/\\u211a) \\u2245 (\\u2124/'+m+')\\u00d7 / H. The bijection is ORDER-REVERSING: L \\u2286 L\\u2032 \\u21d4 H \\u2287 H\\u2032, so the lattice of subfields is ANTI-isomorphic to the lattice of subgroups \\u2014 the whole group fixes the smallest field \\u211a, the trivial subgroup {1} fixes all of '+D.zeta+', and each index-2 subgroup (the kernel of a quadratic Dirichlet character) fixes one quadratic subfield. Here (\\u2124/'+m+')\\u00d7 = '+D.unit+' is the Klein four-group, so the diamond has five nodes on each side. Idelically the same statement reads: finite abelian L/K \\u27f7 finite-index open subgroups N \\u2282 C_K of the id\\u00e8le class group, N = ker \\u03b8_{L/K}. Reciprocity (the map) plus existence (its surjectivity onto all subgroups) turns class field theory into an ALGORITHM: to build the abelian extension realizing a target Galois group, find the matching subgroup.';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; curM=parseInt(b.getAttribute('data-m'),10);\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
