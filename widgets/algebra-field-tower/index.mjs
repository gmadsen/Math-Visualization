// algebra-field-tower widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The extension data is intrinsic; params carry only
// chrome. The widget shows a field extension over Q as a tower with multiplying
// degrees (Tower Law), minimal polynomials, and a Q-basis.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">extension</span>\n` +
    `    <button type="button" id="${widgetId}-e0">$\\mathbb{Q}(\\sqrt{2})$</button>\n` +
    `    <button type="button" id="${widgetId}-e1">$\\mathbb{Q}(\\sqrt{2},\\sqrt{3})$</button>\n` +
    `    <button type="button" id="${widgetId}-e2">$\\mathbb{Q}(\\sqrt[3]{2})$</button>\n` +
    `    <button type="button" id="${widgetId}-e3">$\\mathbb{Q}(i)$</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 230" width="560" height="230" role="img" aria-label="A field extension over Q drawn as a tower with multiplying degrees"><title>Field extensions: the Tower Law multiplies degrees; degree of a simple extension is the degree of the minimal polynomial</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* algebra-field-tower widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=[0,1,2,3].map(function(i){ return document.getElementById('${widgetId}-e'+i); });\n` +
    `  if(!svg||!out||btns.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'middle', 'font-size':opt.size||12, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  // each scenario: tower nodes (bottom..top) with the step degree between consecutive, total degree, basis, readout\n` +
    `  var SCEN=[\n` +
    `    { tower:['\\u211a','\\u211a(\\u221a2)'], steps:['2'], minp:'x\\u00b2 \\u2212 2', deg:2, basis:'1, \\u221a2',\n` +
    `      note:'\\u221a2 is a root of the irreducible x\\u00b2\\u22122 over \\u211a (Eisenstein at 2), so its minimal polynomial has degree 2 and [\\u211a(\\u221a2):\\u211a] = deg(min poly) = 2. A \\u211a-basis is {1, \\u221a2}.' },\n` +
    `    { tower:['\\u211a','\\u211a(\\u221a2)','\\u211a(\\u221a2,\\u221a3)'], steps:['2','2'], minp:'x\\u00b2\\u22122, then x\\u00b2\\u22123', deg:4, basis:'1, \\u221a2, \\u221a3, \\u221a6',\n` +
    `      note:'Build in two steps: [\\u211a(\\u221a2):\\u211a]=2, then \\u221a3 still has minimal polynomial x\\u00b2\\u22123 over \\u211a(\\u221a2) (it is not already there), so [\\u211a(\\u221a2,\\u221a3):\\u211a(\\u221a2)]=2. The TOWER LAW multiplies: [\\u211a(\\u221a2,\\u221a3):\\u211a] = 2\\u00b72 = 4, with \\u211a-basis {1, \\u221a2, \\u221a3, \\u221a6}.' },\n` +
    `    { tower:['\\u211a','\\u211a(\\u221b2)'], steps:['3'], minp:'x\\u00b3 \\u2212 2', deg:3, basis:'1, \\u221b2, \\u221b4',\n` +
    `      note:'\\u221b2 is a root of x\\u00b3\\u22122, irreducible over \\u211a (Eisenstein at 2), so [\\u211a(\\u221b2):\\u211a]=3 with \\u211a-basis {1, \\u221b2, \\u221b4}. Note \\u211a(\\u221b2) is NOT the splitting field of x\\u00b3\\u22122 \\u2014 it is missing the complex roots \\u221b2\\u00b7\\u03c9 (\\u03c9 a primitive cube root of unity); the full splitting field \\u211a(\\u221b2,\\u03c9) has degree 6.' },\n` +
    `    { tower:['\\u211a','\\u211a(i)'], steps:['2'], minp:'x\\u00b2 + 1', deg:2, basis:'1, i',\n` +
    `      note:'i is a root of x\\u00b2+1, irreducible over \\u211a (no real roots), so [\\u211a(i):\\u211a]=2 with \\u211a-basis {1, i}. This is the Gaussian field; \\u211a(i) \\u2245 \\u211a[x]/(x\\u00b2+1).' }\n` +
    `  ];\n` +
    `  var sel=0;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    btns.forEach(function(b,i){ var on=(i===sel); b.classList.toggle('active',on); b.setAttribute('aria-pressed',on?'true':'false'); });\n` +
    `    var S=SCEN[sel], N=S.tower.length;\n` +
    `    // vertical tower: bottom Q at y=190, top at y=50\n` +
    `    var x=180, yBot=188, yTop=56, dy=(yBot-yTop)/(N-1);\n` +
    `    for(var i=0;i<N;i++){ var y=yBot-i*dy;\n` +
    `      svg.appendChild(mk('rect', {x:x-70, y:y-15, width:140, height:30, rx:6, fill:(i===N-1)?'color-mix(in srgb, var(--yellow) 18%, transparent)':'var(--panel2)', stroke:(i===N-1)?'var(--yellow)':'var(--cyan)', 'stroke-width':1.4}));\n` +
    `      txt(x, y+4, S.tower[i], {size:13, fill:(i===N-1)?'var(--yellow)':'var(--ink)'});\n` +
    `      if(i<N-1){ var ym=y-dy/2; svg.appendChild(mk('line',{x1:x,y1:y-15,x2:x,y2:y-dy+15,stroke:'var(--mute)','stroke-width':1.2})); txt(x+16, ym+4, 'deg ' + S.steps[i], {anchor:'start', size:11, fill:'var(--green)'}); }\n` +
    `    }\n` +
    `    // right column: total degree + basis\n` +
    `    txt(400, 70, '[' + S.tower[N-1] + ' : \\u211a] = ' + S.steps.join('\\u00b7') + ' = ' + S.deg, {size:13, fill:'var(--yellow)', weight:600});\n` +
    `    txt(400, 98, 'min. polynomial: ' + S.minp, {size:11, fill:'var(--ink)'});\n` +
    `    txt(400, 124, '\\u211a-basis:', {size:11, fill:'var(--mute)'});\n` +
    `    txt(400, 144, '{ ' + S.basis + ' }', {size:12, fill:'var(--cyan)'});\n` +
    `    txt(400, 172, '(dim = ' + S.deg + ' as a \\u211a-vector space)', {size:10, fill:'var(--mute)'});\n` +
    `    out.textContent = S.note + '\\n\\nA field extension F\\u2286K makes K a vector space over F; its dimension [K:F] is the degree. For a simple algebraic extension F(\\u03b1), [F(\\u03b1):F] = deg of the minimal polynomial of \\u03b1 (the monic irreducible generating the ideal of polynomials killing \\u03b1), and F(\\u03b1) \\u2245 F[x]/(m_\\u03b1). The Tower Law [L:F] = [L:K]\\u00b7[K:F] multiplies degrees up a chain.';\n` +
    `  }\n` +
    `  btns.forEach(function(b,i){ b.addEventListener('click', function(){ sel=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
