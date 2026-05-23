// homological-les-sphere widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The Mayer–Vietoris arithmetic for H_*(S^n) is
// intrinsic; params carry only the slider bound and chrome. The widget shows the
// long exact sequence chunk whose connecting map ∂ is forced to be an isomorphism,
// the descent ladder down to H_1(S^1)=ℤ, and the resulting Betti table.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const maxDim = (params.maxDim || 6);
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">sphere $S^n$, $n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="1" max="${maxDim}" value="3" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nval">n = 3</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="Mayer–Vietoris computation of the homology of an n-sphere"><title>Computing H_*(S^n) via the Mayer–Vietoris long exact sequence</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* homological-les-sphere widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var nIn=document.getElementById('${widgetId}-n'), nL=document.getElementById('${widgetId}-nval');\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  if(!nIn || !nL || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'middle', 'font-size':opt.size||12, fill:opt.fill||'var(--ink)', 'font-style':opt.italic?'italic':'normal', 'font-weight':opt.weight||'normal'}, s)); }\n` +
    `  function grp(k,n){ return (k===0 || k===n) ? '\\u2124' : '0'; }\n` +
    `  function draw(){\n` +
    `    var n=+nIn.value; nL.textContent='n = '+n;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    txt(280, 24, 'S^' + n + ' = U \\u222a V with U, V contractible hemispheres and U\\u2229V \\u2243 S^' + (n-1), {size:11, fill:'var(--mute)', italic:true});\n` +
    `    // --- the MV long exact sequence chunk at the top degree k=n ---\n` +
    `    if(n>=2){\n` +
    `      txt(280, 58, 'Mayer\\u2013Vietoris at degree k = ' + n + ':', {size:11, fill:'var(--cyan)', weight:600});\n` +
    `      var yA=92;\n` +
    `      txt(70,  yA, '0', {size:14, fill:'var(--mute)'});\n` +
    `      txt(70,  yA+18, 'H_' + n + '(U)\\u2295H_' + n + '(V)', {size:9, fill:'var(--mute)'});\n` +
    `      txt(150, yA, '\\u2192', {size:16, fill:'var(--mute)'});\n` +
    `      txt(232, yA, 'H_' + n + '(S^' + n + ')', {size:14, fill:'var(--yellow)', weight:600});\n` +
    `      txt(330, yA, '\\u2192', {size:16, fill:'var(--pink)'});\n` +
    `      txt(330, yA-14, '\\u2202', {size:13, fill:'var(--pink)'});\n` +
    `      txt(430, yA, 'H_' + (n-1) + '(S^' + (n-1) + ')', {size:14, fill:'var(--yellow)', weight:600});\n` +
    `      txt(510, yA, '\\u2192', {size:16, fill:'var(--mute)'});\n` +
    `      txt(540, yA, '0', {size:14, fill:'var(--mute)'});\n` +
    `      txt(540, yA+18, 'H_' + (n-1) + '(U)\\u2295H_' + (n-1) + '(V)', {size:9, fill:'var(--mute)'});\n` +
    `      txt(330, yA+22, 'flanked by 0 \\u21d2 \\u2202 is an isomorphism', {size:10, fill:'var(--green)'});\n` +
    `    } else {\n` +
    `      txt(280, 58, 'Base case n = 1:', {size:11, fill:'var(--cyan)', weight:600});\n` +
    `      txt(280, 92, 'H_1(S^1) = \\u2124', {size:16, fill:'var(--yellow)', weight:600});\n` +
    `      txt(280, 112, '(the circle has one independent 1-cycle)', {size:10, fill:'var(--mute)'});\n` +
    `    }\n` +
    `    // --- descent ladder H_n(S^n) ≅ ... ≅ H_1(S^1) = ℤ ---\n` +
    `    txt(280, 150, 'Descent ladder (iterate MV down the dimensions):', {size:11, fill:'var(--cyan)', weight:600});\n` +
    `    var parts=[]; for(var k=n;k>=1;k--){ parts.push('H_' + k + '(S^' + k + ')'); }\n` +
    `    var ladder = parts.join('  \\u2245  ') + '  =  \\u2124';\n` +
    `    txt(280, 174, ladder, {size: (n>=6?10:12), fill:'var(--ink)'});\n` +
    `    // --- Betti table for S^n ---\n` +
    `    txt(280, 212, 'Homology of S^' + n + ':', {size:11, fill:'var(--cyan)', weight:600});\n` +
    `    var degs=[]; for(var d=0;d<=n;d++) degs.push(d);\n` +
    `    var bw=Math.min(64, Math.floor(480/(n+1))), x0=280-(n+1)*bw/2, by=232, bh=40;\n` +
    `    degs.forEach(function(d){ var on=(grp(d,n)==='\\u2124'); var cx=x0+d*bw+bw/2;\n` +
    `      svg.appendChild(mk('rect', {x:x0+d*bw+2, y:by, width:bw-4, height:bh, rx:4, fill: on?'color-mix(in srgb, var(--yellow) 22%, transparent)':'var(--panel2)', stroke: on?'var(--yellow)':'var(--line)', 'stroke-width':1}));\n` +
    `      txt(cx, by+16, 'H_' + d, {size:10, fill:'var(--mute)'});\n` +
    `      txt(cx, by+32, grp(d,n), {size:13, fill: on?'var(--yellow)':'var(--mute)', weight: on?600:400}); });\n` +
    `    // --- readout ---\n` +
    `    var lines=[];\n` +
    `    lines.push('Cover S^' + n + ' = U \\u222a V by two contractible hemispheres; their intersection deformation-retracts onto the equator S^' + (n-1) + '. The short exact sequence of singular chains 0\\u2192C(U\\u2229V)\\u2192C(U)\\u2295C(V)\\u2192C(S^' + n + ')\\u21920 gives the Mayer\\u2013Vietoris long exact sequence.');\n` +
    `    if(n>=2){\n` +
    `      lines.push('Since U, V are contractible, H_k(U)\\u2295H_k(V) = 0 for all k \\u2265 1. So in the chunk H_' + n + '(U)\\u2295H_' + n + '(V) \\u2192 H_' + n + '(S^' + n + ') \\u2192\\u2202 H_' + (n-1) + '(S^' + (n-1) + ') \\u2192 H_' + (n-1) + '(U)\\u2295H_' + (n-1) + '(V) the two outer terms vanish, forcing the connecting map \\u2202 to be an isomorphism: H_' + n + '(S^' + n + ') \\u2245 H_' + (n-1) + '(S^' + (n-1) + ').');\n` +
    `      lines.push('Iterating down to the base case H_1(S^1) = \\u2124 gives H_' + n + '(S^' + n + ') \\u2245 \\u2124. Together with H_0(S^' + n + ') = \\u2124 (S^' + n + ' is connected), every other H_k(S^' + n + ') = 0.');\n` +
    `    } else {\n` +
    `      lines.push('At n = 1 the base case is computed directly: H_1(S^1) = \\u2124 (one independent loop) and H_0(S^1) = \\u2124 (connected); all higher H_k = 0. This anchors the descent ladder for every larger sphere.');\n` +
    `    }\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  nIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
