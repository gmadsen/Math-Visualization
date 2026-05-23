// complex-analysis-laurent widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The function eval + Laurent partial sums are
// intrinsic (kind/seriesKind enums); params carry the case menu + series text
// (validated against ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, cases } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = cases
    .map((c, i) => `      <option value="${escapeHtml(c.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(c.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">function · annulus</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-n">terms $N$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="1" max="30" value="6" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nval">N = 6</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 240" width="540" height="240" role="img" aria-label="The annulus of convergence and a test point"><title>Laurent series: the annulus of convergence and partial-sum convergence</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, cases } = params;
  const data = JSON.stringify(cases);
  return (
    `<script>\n` +
    `/* complex-analysis-laurent widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var CASES = ${data};\n` +
    `  var byId = {}; CASES.forEach(function(c){ byId[c.id] = c; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var nIn = document.getElementById('${widgetId}-n'), nL = document.getElementById('${widgetId}-nval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !nIn || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function cdiv(p,q){ var d=q[0]*q[0]+q[1]*q[1]; return [(p[0]*q[0]+p[1]*q[1])/d, (p[1]*q[0]-p[0]*q[1])/d]; }\n` +
    `  function cexp(p){ var e=Math.exp(p[0]); return [e*Math.cos(p[1]), e*Math.sin(p[1])]; }\n` +
    `  function fval(kind, z){\n` +
    `    if(kind==='inv_zzm1') return cdiv([1,0], cmul(z, [z[0]-1, z[1]]));\n` +
    `    if(kind==='exp_invz') return cexp(cdiv([1,0], z));\n` +
    `    return z;\n` +
    `  }\n` +
    `  function partial(seriesKind, z, N){\n` +
    `    var inv = cdiv([1,0], z), s, pw, k, fac;\n` +
    `    if(seriesKind==='inner_zzm1'){ s=[-inv[0], -inv[1]]; pw=[1,0]; for(k=0;k<=N;k++){ s=[s[0]-pw[0], s[1]-pw[1]]; pw=cmul(pw, z); } return s; }\n` +
    `    if(seriesKind==='outer_zzm1'){ s=[0,0]; pw=cmul(inv,inv); for(k=2;k<=N+1;k++){ s=[s[0]+pw[0], s[1]+pw[1]]; pw=cmul(pw, inv); } return s; }\n` +
    `    if(seriesKind==='exp_invz'){ s=[0,0]; pw=[1,0]; fac=1; for(k=0;k<=N;k++){ if(k>0) fac*=k; s=[s[0]+pw[0]/fac, s[1]+pw[1]/fac]; pw=cmul(pw, inv); } return s; }\n` +
    `    return [0,0];\n` +
    `  }\n` +
    `  var CX=130, CY=120, SC=44; // z-plane: 1 unit = SC px\n` +
    `  function ZX(x){ return CX + x*SC; } function ZY(y){ return CY - y*SC; }\n` +
    `  function draw(){\n` +
    `    var c = byId[sel.value] || CASES[0], N = +nIn.value;\n` +
    `    nL.textContent = 'N = ' + N;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var rOutD = Math.min(c.rOut, 2.3);\n` +
    `    // shaded annulus: outer disk minus inner disk\n` +
    `    svg.appendChild(mk('circle', {cx:CX, cy:CY, r:rOutD*SC, fill:'color-mix(in srgb, var(--cyan) 10%, transparent)', stroke:'var(--cyan)', 'stroke-width':1.2, 'stroke-dasharray': c.rOut>2.3?'4 3':''}));\n` +
    `    if(c.rIn>0.001){ svg.appendChild(mk('circle', {cx:CX, cy:CY, r:c.rIn*SC, fill:'var(--panel)', stroke:'var(--cyan)', 'stroke-width':1.2})); }\n` +
    `    svg.appendChild(mk('circle', {cx:CX, cy:CY, r:2.5, fill:'var(--pink)'}));\n` +
    `    svg.appendChild(mk('text', {x:CX+5, y:CY+13, 'font-size':9, fill:'var(--pink)'}, '0'));\n` +
    `    svg.appendChild(mk('text', {x:CX, y:18, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'annulus of convergence'));\n` +
    `    // test point at mid-radius, fixed angle\n` +
    `    var rt = (c.rIn + rOutD)/2, ang = 0.7, z=[rt*Math.cos(ang), rt*Math.sin(ang)];\n` +
    `    svg.appendChild(mk('circle', {cx:ZX(z[0]), cy:ZY(z[1]), r:4, fill:'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('text', {x:ZX(z[0])+7, y:ZY(z[1]), 'font-size':10, fill:'var(--yellow)'}, 'test z'));\n` +
    `    var fz = fval(c.kind, z), sN = partial(c.seriesKind, z, N), err = Math.hypot(fz[0]-sN[0], fz[1]-sN[1]);\n` +
    `    var lines = [];\n` +
    `    lines.push('Laurent series on this annulus:  f(z) = ' + c.series);\n` +
    `    lines.push('at the test point z = ' + z[0].toFixed(2) + ' + ' + z[1].toFixed(2) + 'i:');\n` +
    `    lines.push('  S_' + N + ' = ' + sN[0].toFixed(4) + ' + ' + sN[1].toFixed(4) + 'i      f = ' + fz[0].toFixed(4) + ' + ' + fz[1].toFixed(4) + 'i');\n` +
    `    lines.push('  |f \\u2212 S_' + N + '| = ' + err.toExponential(2) + '   \\u2192 0 as N grows (converges on the annulus, diverges outside it).');\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); nIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
