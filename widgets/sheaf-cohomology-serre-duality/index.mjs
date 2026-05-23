// sheaf-cohomology-serre-duality widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The cohomology dimensions of O(d) on P^n are
// intrinsic (Serre's theorem); params carry only chrome. The widget pairs a cell
// (i, d) with its Serre dual (n-i, -d-n-1) and shows the two dimensions agree —
// the reflection symmetry H^i(O(d)) ≅ H^{n-i}(O(-d-n-1))^∨.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">$n$ (so $X=\\mathbb{P}^n$)</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="1" max="3" value="2" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nval">n = 2</span>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-d">twist $d$ in $\\mathcal{O}(d)$</label>\n` +
    `    <input type="range" id="${widgetId}-d" min="-9" max="9" value="-3" step="1">\n` +
    `    <span class="pill" id="${widgetId}-dval">d = -3</span>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-i">degree $i$</label>\n` +
    `    <input type="range" id="${widgetId}-i" min="0" max="3" value="2" step="1">\n` +
    `    <span class="pill" id="${widgetId}-ival">i = 2</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 230" width="560" height="230" role="img" aria-label="Serre duality pairing the cohomology of O(d) with its dual on projective space"><title>Serre duality: H^i(O(d)) is dual to H^{n-i}(O(-d-n-1)) on P^n</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* sheaf-cohomology-serre-duality widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var nIn=document.getElementById('${widgetId}-n'), dIn=document.getElementById('${widgetId}-d'), iIn=document.getElementById('${widgetId}-i');\n` +
    `  var nL=document.getElementById('${widgetId}-nval'), dL=document.getElementById('${widgetId}-dval'), iL=document.getElementById('${widgetId}-ival');\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  if(!nIn||!dIn||!iIn||!nL||!dL||!iL||!svg||!out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'middle', 'font-size':opt.size||12, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  function binom(a,b){ if(b<0||a<0||a<b) return 0; var r=1; for(var j=0;j<b;j++){ r=r*(a-j)/(j+1); } return Math.round(r); }\n` +
    `  function h(i,d,n){ if(i===0) return d>=0 ? binom(n+d,n) : 0; if(i===n) return d<=-n-1 ? binom(-d-1,n) : 0; return 0; }\n` +
    `  function box(x,y,w,lines,stroke,tcol){\n` +
    `    svg.appendChild(mk('rect', {x:x-w/2, y:y, width:w, height:54, rx:6, fill:'var(--panel2)', stroke:stroke, 'stroke-width':1.6}));\n` +
    `    txt(x, y+22, lines[0], {size:13, fill:tcol, weight:600}); txt(x, y+42, lines[1], {size:12, fill:'var(--ink)'}); }\n` +
    `  function draw(){\n` +
    `    var n=+nIn.value, d=+dIn.value, i=+iIn.value; if(i>n) i=n;\n` +
    `    nL.textContent='n = '+n; dL.textContent='d = '+d; iL.textContent='i = '+i;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var dd = -d-n-1, ii = n-i;            // Serre-dual cell\n` +
    `    var h1 = h(i,d,n), h2 = h(ii,dd,n);\n` +
    `    txt(280, 24, 'canonical sheaf  \\u03c9 = O(-(n+1)) = O(' + (-(n+1)) + ')      Serre:  H^i(O(d)) \\u2245 H^{n-i}(O(-d-n-1))\\u1d5b', {size:11, fill:'var(--mute)', italic:true});\n` +
    `    box(140, 60, 220, ['H^' + i + '(\\u2119^' + n + ', O(' + d + '))', 'dim = ' + h1], 'var(--yellow)', 'var(--yellow)');\n` +
    `    box(420, 60, 220, ['H^' + ii + '(\\u2119^' + n + ', O(' + dd + '))', 'dim = ' + h2], 'var(--cyan)', 'var(--cyan)');\n` +
    `    txt(280, 82, '\\u2245', {size:20, fill:'var(--pink)'});\n` +
    `    txt(280, 100, '(dual)\\u1d5b', {size:10, fill:'var(--pink)'});\n` +
    `    var agree = (h1===h2);\n` +
    `    txt(280, 150, agree ? ('\\u2713  dims agree: ' + h1 + ' = ' + h2) : ('mismatch: ' + h1 + ' \\u2260 ' + h2), {size:13, fill: agree?'var(--green)':'var(--pink)', weight:600});\n` +
    `    // d number-line with the reflection about d = -(n+1)/2\n` +
    `    var axis=-(n+1)/2, x0=60, x1=500, dmin=-9, dmax=9, sx=function(v){ return x0 + (v-dmin)/(dmax-dmin)*(x1-x0); };\n` +
    `    svg.appendChild(mk('line', {x1:x0, y1:190, x2:x1, y2:190, stroke:'var(--line)', 'stroke-width':1}));\n` +
    `    svg.appendChild(mk('line', {x1:sx(axis), y1:180, x2:sx(axis), y2:200, stroke:'var(--violet)', 'stroke-width':1.5, 'stroke-dasharray':'3 2'}));\n` +
    `    txt(sx(axis), 214, 'reflect about d = ' + (axis) , {size:9, fill:'var(--violet)'});\n` +
    `    svg.appendChild(mk('circle', {cx:sx(d), cy:190, r:5, fill:'var(--yellow)'})); txt(sx(d), 178, 'd=' + d, {size:9, fill:'var(--yellow)'});\n` +
    `    svg.appendChild(mk('circle', {cx:sx(dd), cy:190, r:5, fill:'var(--cyan)'})); txt(sx(dd), 178, 'd\\u2032=' + dd, {size:9, fill:'var(--cyan)'});\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    lines.push('Serre duality on a smooth projective X of dim n: H^i(X,F) \\u2245 H^{n-i}(X, F\\u1d5b\\u2297\\u03c9_X)\\u1d5b. On \\u2119^' + n + ' with F=O(' + d + '), \\u03c9=O(-(n+1))=O(' + (-(n+1)) + '), so the dual of H^' + i + '(O(' + d + ')) is H^' + ii + '(O(-d-n-1)) = H^' + ii + '(O(' + dd + '))\\u1d5b.');\n` +
    `    lines.push('Dimensions: dim H^' + i + '(\\u2119^' + n + ',O(' + d + ')) = ' + h1 + ',   dim H^' + ii + '(\\u2119^' + n + ',O(' + dd + ')) = ' + h2 + '. ' + (agree ? 'They agree \\u2014 the reflection (i,d) \\u21a6 (n-i, -d-n-1) is the symmetry of the \\u00a77 dimension table.' : ''));\n` +
    `    if(i!==0 && i!==n) lines.push('Here 0 < i < n, so both sides vanish (intermediate cohomology of O(d) on \\u2119^n is always 0) \\u2014 duality still holds, trivially 0 = 0.');\n` +
    `    else lines.push('The nonzero classes live in the H^0 triangle (d \\u2265 0) and the H^n triangle (d \\u2264 -n-1); Serre duality reflects one onto the other through \\u03c9 = O(-(n+1)).');\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  nIn.addEventListener('input', draw); dIn.addEventListener('input', draw); iIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
