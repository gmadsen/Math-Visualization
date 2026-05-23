// complex-analysis-normal-families widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The sequence eval is intrinsic (a `kind` enum);
// params carry the case menu (validated against ./schema.json). The widget plots
// Re f_n along a compact slice of the disk with the earlier terms ghosted, and
// the uniform bound, to illustrate Montel's theorem.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, families } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = families
    .map((g, i) => `      <option value="${escapeHtml(g.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(g.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">sequence $(f_n)$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-n">index $n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="1" max="20" value="4" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nval">n = 4</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 250" width="540" height="250" role="img" aria-label="Re f_n plotted along a compact slice of the disk, with the uniform bound"><title>Montel's theorem: a uniformly bounded family of holomorphic functions is normal</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, families } = params;
  const data = JSON.stringify(families);
  return (
    `<script>\n` +
    `/* complex-analysis-normal-families widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FAM = ${data};\n` +
    `  var byId = {}; FAM.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var nIn = document.getElementById('${widgetId}-n'), nL = document.getElementById('${widgetId}-nval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !nIn || !nL || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  // Re f_n at a real point x (the disk's diameter)\n` +
    `  function reF(kind, x, n){\n` +
    `    if(kind==='zn') return Math.pow(x, n);\n` +
    `    if(kind==='shrink') return x/n;\n` +
    `    if(kind==='rot') return x*Math.cos(n);\n` +
    `    if(kind==='unbounded') return n*x;\n` +
    `    return x;\n` +
    `  }\n` +
    `  var XR=0.9; // compact slice |x| <= 0.9 inside the unit disk\n` +
    `  var PX0=55, PW=445, PYc=128, PHh=92;\n` +
    `  function PX(x){ return PX0 + (x+XR)/(2*XR)*PW; }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FAM[0], n = +nIn.value;\n` +
    `    nL.textContent = 'n = ' + n;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var unbounded = (g.kind==='unbounded');\n` +
    `    var yMax = unbounded ? Math.max(1, n*XR*1.1) : 1;\n` +
    `    function PY(v){ return PYc - v/yMax*PHh; }\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PYc, x2:PX0+PW, y2:PYc, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:PX(0), y1:PYc-PHh, x2:PX(0), y2:PYc+PHh, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PYc+16, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'x \\u2208 [\\u22120.9, 0.9]'));\n` +
    `    svg.appendChild(mk('text', {x:PX0-6, y:PYc-PHh+4, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'Re f_n'));\n` +
    `    // uniform bound (only meaningful for the bounded families)\n` +
    `    if(!unbounded){\n` +
    `      svg.appendChild(mk('line', {x1:PX0, y1:PY(XR), x2:PX0+PW, y2:PY(XR), stroke:'var(--pink)', 'stroke-width':1.2, 'stroke-dasharray':'4 3'}));\n` +
    `      svg.appendChild(mk('line', {x1:PX0, y1:PY(-XR), x2:PX0+PW, y2:PY(-XR), stroke:'var(--pink)', 'stroke-width':1.2, 'stroke-dasharray':'4 3'}));\n` +
    `      svg.appendChild(mk('text', {x:PX0+PW, y:PY(XR)-4, 'text-anchor':'end', 'font-size':10, fill:'var(--pink)'}, 'uniform bound |f_n| \\u2264 0.9'));\n` +
    `    }\n` +
    `    function curve(nn, attrs){ var pts=[], i, x; for(i=0;i<=120;i++){ x=-XR+2*XR*i/120; pts.push(PX(x).toFixed(1)+','+PY(reF(g.kind,x,nn)).toFixed(1)); } svg.appendChild(mk('polyline', Object.assign({points:pts.join(' '), fill:'none'}, attrs))); }\n` +
    `    // ghosts of earlier terms\n` +
    `    var k; for(k=3;k>=1;k--){ if(n-k>=1) curve(n-k, {stroke:'var(--line)', 'stroke-width':1}); }\n` +
    `    // current term\n` +
    `    curve(n, {stroke:'var(--cyan)', 'stroke-width':2.2});\n` +
    `    svg.appendChild(mk('text', {x:PX(0)+8, y:PYc-PHh+12, 'font-size':10, fill:'var(--cyan)'}, 'f_' + n + ' (earlier terms ghosted)'));\n` +
    `    // readout\n` +
    `    var lines = [];\n` +
    `    lines.push('Montel: a family of holomorphic functions uniformly bounded on compact sets is NORMAL \\u2014 every sequence has a locally-uniformly-convergent subsequence.');\n` +
    `    lines.push('(The plot shows Re f_n on the real diameter |x| \\u2264 0.9 \\u2014 a faithful 1-D slice of the holomorphic f_n.)');\n` +
    `    if(g.kind==='zn'){ lines.push('f_n = z^n: |f_n| \\u2264 1 on the disk and \\u2264 0.9 on |z|\\u22640.9. The family is normal; the whole sequence converges to 0 on compacts.'); }\n` +
    `    else if(g.kind==='shrink'){ lines.push('f_n = z/n: bounded by 0.9 on this slice and \\u2192 0 uniformly. Normal; the whole sequence converges to 0.'); }\n` +
    `    else if(g.kind==='rot'){ lines.push('f_n = e^{in} z: |f_n| = |z| \\u2264 0.9, so bounded \\u21d2 NORMAL by Montel \\u2014 yet the FULL sequence does NOT converge (e^{in} circles the unit circle forever). Montel only promises a convergent SUBsequence: pick n_k with e^{i n_k} \\u2192 1.'); }\n` +
    `    else { lines.push('f_n = n\\u00b7z is NOT uniformly bounded (|f_n(0.9)| = 0.9n \\u2192 \\u221e). Montel\\u2019s hypothesis fails: no subsequence converges, so the family is NOT normal \\u2014 watch the y-axis keep rescaling as the values run off to infinity.'); }\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); nIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
