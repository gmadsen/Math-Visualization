// functor-of-points-groupoid-target widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Why a moduli functor with automorphisms needs a
// groupoid-valued target: target Set forgets automorphisms (not a sheaf, not
// representable); target Grpd remembers isomorphisms (a stack). Scheme case =
// discrete groupoid (trivial automorphisms).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const btn = (k, lab, on) =>
    `<button type="button" data-k="${k}" class="${on ? 'active' : ''}" aria-pressed="${on ? 'true' : 'false'}">${lab}</button>`;
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-btns">\n` +
    `    <label>target of the moduli functor:</label>\n    ${btn('set', 'Set', true)}\n    ${btn('grpd', 'Grpd', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="The moduli functor of elliptic curves evaluated with target Set versus target groupoid, showing that the set of isomorphism classes forgets automorphisms while the groupoid remembers them"><title>The moduli functor M of elliptic curves on a field R: with target Set it records only the set of isomorphism classes and forgets the automorphism groups, so it is not a sheaf and not representable; with target Grpd it records the groupoid of curves with their isomorphisms, each object carrying its automorphism group, which is an algebraic stack</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* functor-of-points-groupoid-target widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  var CURVES=[\n` +
    `    {eq:'y\\u00b2 = x\\u00b3 + x + 1', j:'generic j', aut:'\\u2124/2', n:2},\n` +
    `    {eq:'y\\u00b2 = x\\u00b3 + x', j:'j = 1728', aut:'\\u2124/4', n:4},\n` +
    `    {eq:'y\\u00b2 = x\\u00b3 + 1', j:'j = 0', aut:'\\u2124/6', n:6},\n` +
    `  ];\n` +
    `  var cur='set';\n` +
    `  function loop(cx,cy,col,markerId){ svg.appendChild(mk('path',{d:'M '+(cx-7)+' '+(cy-14)+' C '+(cx-22)+' '+(cy-40)+', '+(cx+22)+' '+(cy-40)+', '+(cx+7)+' '+(cy-14),fill:'none',stroke:col,'stroke-width':1.8,'marker-end':'url(#'+markerId+')'})); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var grpd=(cur==='grpd');\n` +
    `    var defs=mk('defs',{}); var m=mk('marker',{id:'${widgetId}-ar',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto'}); m.appendChild(mk('path',{d:'M0 0 L10 5 L0 10 z',fill:'var(--violet)'})); defs.appendChild(m); svg.appendChild(defs);\n` +
    `    txt(280, 26, 'moduli functor   M : CRing \\u2192 '+(grpd?'Grpd':'Set')+'      (R = a field containing i and \\u03b6\\u2083)', {size:13, weight:700, fill:'var(--ink)'});\n` +
    `    txt(280, 46, grpd?'M(R) = the GROUPOID of elliptic curves over R and their isomorphisms':'M(R) = the SET of isomorphism classes of elliptic curves over R', {size:11, fill:grpd?'var(--violet)':'var(--mute)'});\n` +
    `    var xs=[140,280,420], yC=140;\n` +
    `    CURVES.forEach(function(c,idx){ var cx=xs[idx];\n` +
    `      var col = grpd ? (c.n>2?'var(--violet)':'var(--cyan)') : 'var(--mute)';\n` +
    `      svg.appendChild(mk('circle',{cx:cx,cy:yC,r:13,fill:'var(--panel2)',stroke:col,'stroke-width':2}));\n` +
    `      txt(cx, yC+5, '['+(idx+1)+']', {size:12, fill:col, weight:700});\n` +
    `      txt(cx, yC+34, c.eq, {size:10, mono:true, fill:'var(--ink)'});\n` +
    `      txt(cx, yC+50, c.j, {size:9, fill:'var(--mute)'});\n` +
    `      if(grpd){ loop(cx, yC-13, col, '${widgetId}-ar'); txt(cx, yC-46, 'Aut = '+c.aut, {size:10, fill:col, weight:700}); }\n` +
    `      else { txt(cx, yC-30, 'Aut '+c.aut+' forgotten', {size:8.5, fill:'var(--line)'}); }\n` +
    `    });\n` +
    `    if(grpd){\n` +
    `      txt(280, 222, 'remembering the isomorphisms (and automorphisms) restores DESCENT:', {size:10.5, fill:'var(--green)'});\n` +
    `      txt(280, 238, 'M is a SHEAF of groupoids \\u2014 an ALGEBRAIC STACK (here M\\u2081,\\u2081).', {size:10.5, fill:'var(--green)', weight:700});\n` +
    `    } else {\n` +
    `      txt(280, 222, 'forgetting Aut breaks gluing: a family locally \\u2245 a fixed E but globally', {size:10.5, fill:'var(--pink)'});\n` +
    `      txt(280, 238, 'twisted by an automorphism is INVISIBLE to M \\u2014 M is not a sheaf, not representable.', {size:10.5, fill:'var(--pink)', weight:700});\n` +
    `    }\n` +
    `    txt(280, 270, 'scheme / ordinary functor-of-points case = every Aut trivial (a DISCRETE groupoid): Set loses nothing.', {size:9.5, fill:'var(--mute)'});\n` +
    `    out.textContent='When the objects a functor classifies have non-trivial AUTOMORPHISMS, a Set-valued functor is the wrong tool. Take the moduli functor M of elliptic curves: with target SET, M(R) is the set of isomorphism CLASSES of curves over R \\u2014 it records the picture above but DROPS each curve\\u2019s automorphism group (generic Aut = \\u2124/2, the j=1728 curve y\\u00b2=x\\u00b3+x has Aut = \\u2124/4, the j=0 curve y\\u00b2=x\\u00b3+1 has Aut = \\u2124/6, over a field containing i and \\u03b6\\u2083). The fatal consequence: this functor is NOT A SHEAF. A family E \\u2192 Spec R can be Zariski- or \\u00e9tale-locally isomorphic to a constant curve yet globally TWISTED by a non-trivial automorphism (a torsor under Aut), and M(R) \\u2014 seeing only iso-classes \\u2014 cannot detect the twist, so it fails descent and M is NOT REPRESENTABLE by any scheme. The fix is to change the target: replace CRing \\u2192 Set by CRing \\u2192 GRPD, sending R to the GROUPOID of curves over R WITH their isomorphisms (each object now carries its automorphism group as a self-loop). This groupoid-valued, descent-satisfying (lax-functorial, sheafy) gadget is exactly an ALGEBRAIC STACK \\u2014 here the moduli stack M\\u2081,\\u2081. The ordinary scheme / functor-of-points story is the special case where every object has TRIVIAL automorphism group, i.e. the groupoid is DISCRETE; then passing to iso-classes loses nothing and the Set-valued functor can already be representable. Automorphisms are precisely the obstruction, and groupoids are precisely the cure.';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; cur=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
