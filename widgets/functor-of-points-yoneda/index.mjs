// functor-of-points-yoneda widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A scheme is its functor of points: tabulate
// X(R) = Hom(A, R) over a gallery of test rings, illustrating that the
// assignment R -> X(R) determines X (Yoneda: h_(-) is fully faithful).

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
    `    ${btn('A1', 'A&#185;', true)}\n    ${btn('mu3', '&#956;&#8323;', false)}\n    ${btn('Gm', 'G_m', false)}\n    ${btn('i', '&#8484;[x]/(x&#178;+1)', false)}\n    ${btn('pt', 'Spec &#8484;', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="The functor of points of a scheme: a table of X(R) = Hom(A,R) over several test rings, showing the scheme is determined by its R-points"><title>For each chosen affine scheme X = Spec A, a table of its R-points X(R) = Hom(A,R) over the test rings F_2, F_3, F_5, F_7, Q, C, illustrating that the rule sending R to X(R) determines the scheme (the Yoneda embedding is fully faithful)</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* functor-of-points-yoneda widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  var SCHEMES=[\n` +
    `    {k:'A1', name:'A\\u00b9 = Spec \\u2124[x]', fr:'X(R) = R  (every element)', rows:[['F\\u2082','{0, 1}','2'],['F\\u2083','{0, 1, 2}','3'],['F\\u2085','{0, \\u2026, 4}','5'],['F\\u2087','{0, \\u2026, 6}','7'],['\\u211a','all of \\u211a','\\u221e'],['\\u2102','all of \\u2102','\\u221e']]},\n` +
    `    {k:'mu3', name:'\\u03bc\\u2083 = Spec \\u2124[x]/(x\\u00b3\\u22121)', fr:'X(R) = { r : r\\u00b3 = 1 }', rows:[['F\\u2082','{1}','1'],['F\\u2083','{1}','1'],['F\\u2085','{1}','1'],['F\\u2087','{1, 2, 4}','3'],['\\u211a','{1}','1'],['\\u2102','{1, \\u03c9, \\u03c9\\u00b2}','3']]},\n` +
    `    {k:'Gm', name:'G_m = Spec \\u2124[x, x\\u207b\\u00b9]', fr:'X(R) = R\\u00d7  (units)', rows:[['F\\u2082','{1}','1'],['F\\u2083','{1, 2}','2'],['F\\u2085','{1, 2, 3, 4}','4'],['F\\u2087','{1, \\u2026, 6}','6'],['\\u211a','\\u211a\\u00d7','\\u221e'],['\\u2102','\\u2102\\u00d7','\\u221e']]},\n` +
    `    {k:'i', name:'Spec \\u2124[x]/(x\\u00b2+1)', fr:'X(R) = { r : r\\u00b2 = \\u22121 }', rows:[['F\\u2082','{1}','1'],['F\\u2083','{ }','0'],['F\\u2085','{2, 3}','2'],['F\\u2087','{ }','0'],['\\u211a','{ }','0'],['\\u2102','{ i, \\u2212i }','2']]},\n` +
    `    {k:'pt', name:'Spec \\u2124  (terminal object)', fr:'X(R) = { \\u2217 }  (the unique \\u2124 \\u2192 R)', rows:[['F\\u2082','{\\u2217}','1'],['F\\u2083','{\\u2217}','1'],['F\\u2085','{\\u2217}','1'],['F\\u2087','{\\u2217}','1'],['\\u211a','{\\u2217}','1'],['\\u2102','{\\u2217}','1']]},\n` +
    `  ];\n` +
    `  var cur='A1';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var S=null; for(var i=0;i<SCHEMES.length;i++) if(SCHEMES[i].k===cur) S=SCHEMES[i];\n` +
    `    if(!S) return;\n` +
    `    txt(20, 28, 'X = '+S.name, {size:14, weight:700, fill:'var(--ink)'});\n` +
    `    txt(20, 48, S.fr, {size:12, fill:'var(--cyan)', mono:true});\n` +
    `    txt(40, 80, 'test ring R', {size:10, fill:'var(--mute)', weight:700});\n` +
    `    txt(150, 80, 'X(R) = Hom(A, R)', {size:10, fill:'var(--mute)', weight:700});\n` +
    `    txt(470, 80, '|X(R)|', {size:10, fill:'var(--mute)', weight:700});\n` +
    `    var y=106;\n` +
    `    S.rows.forEach(function(r){ var fin=(r[2]!=='\\u221e'); var col=fin?'var(--ink)':'var(--mute)';\n` +
    `      txt(40, y, r[0], {size:12, mono:true, fill: r[0].charCodeAt(0)===70?'var(--violet)':'var(--blue)', weight:700});\n` +
    `      txt(150, y, r[1], {size:12, mono:true, fill:col});\n` +
    `      txt(478, y, r[2], {size:12, mono:true, fill: r[2]==='0'?'var(--pink)':'var(--green)', weight:700, anchor:'end'});\n` +
    `      // small bar for finite counts (cap at 7)\n` +
    `      var n=parseInt(r[2],10); if(fin && !isNaN(n)){ svg.appendChild(mk('rect',{x:496,y:y-9,width:Math.max(2,n*8),height:11,rx:2,fill:'var(--green)','fill-opacity':0.30})); }\n` +
    `      y+=27; });\n` +
    `    svg.appendChild(mk('line',{x1:20,y1:y-6,x2:540,y2:y-6,stroke:'var(--line)','stroke-width':1})); y+=16;\n` +
    `    txt(20, y, 'the rule  R \\u21a6 X(R)  (natural in R)  IS the scheme X \\u2014 Yoneda:  Nat(h_X, h_Y) = Hom(X, Y)', {size:10.5, fill:'var(--yellow)'});\n` +
    `    out.textContent='Instead of a space with a structure sheaf, think of a scheme X as the FUNCTOR OF POINTS it represents: the rule sending each ring R to the set X(R) = Hom(A, R) of its R-points (for X = Spec A), together with the restriction maps along ring homomorphisms. The table shows this functor for X = '+S.name.replace(/\\s+/g,\" \")+': over a field k, an R-point is exactly a solution of the defining equations in k, so |X(F_p)| just counts solutions mod p (e.g. x\\u00b2 = \\u22121 has 2 solutions when p \\u2261 1 mod 4, none when p \\u2261 3 mod 4; x\\u00b3 = 1 has 3 cube roots only when p \\u2261 1 mod 3). The YONEDA EMBEDDING h_(\\u2212): Sch \\u2192 Fun(Sch^op, Set), X \\u21a6 h_X = Hom(\\u2212, X), is FULLY FAITHFUL: this is the representable Yoneda lemma Nat(h_X, F) \\u2245 F(X) (a natural transformation \\u03b7 is determined by its universal element \\u03b7_X(id_X) \\u2208 F(X)). Taking F = h_Y gives Nat(h_X, h_Y) \\u2245 Hom(X, Y) \\u2014 so a morphism of schemes is THE SAME THING as a natural family of maps X(R) \\u2192 Y(R), and two schemes with naturally isomorphic functors of points are isomorphic. That is the precise sense in which a scheme is nothing more nor less than its functor of points; the rest of the functor-of-points story (representability, moduli problems, base change) is built on this one fully-faithfulness theorem.';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; cur=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
