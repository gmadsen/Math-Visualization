// advanced-complex-analysis-mittag-leffler widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The partial-sum eval is intrinsic (a `kind` enum);
// params carry the case menu (validated against ./schema.json). The widget plots
// the partial sum of principal parts along the real axis against the target
// meromorphic function, so the prescribed poles lock in one pair at a time.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, functions } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = functions
    .map((g, i) => `      <option value="${escapeHtml(g.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(g.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">function</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-n">pole terms $N$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="1" max="12" value="3" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nval">N = 3</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 250" width="540" height="250" role="img" aria-label="The partial sum of principal parts against the target meromorphic function"><title>Mittag-Leffler: the sum of principal parts converges to a meromorphic function with the prescribed poles</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* advanced-complex-analysis-mittag-leffler widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var byId = {}; FNS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var nIn = document.getElementById('${widgetId}-n'), nL = document.getElementById('${widgetId}-nval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !nIn || !nL || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function partial(kind, x, N){ var s, n;\n` +
    `    if(kind==='cot'){ s = 1/x; for(n=1;n<=N;n++) s += 2*x/(x*x - n*n); return s; }\n` +
    `    s = 0; for(n=-N;n<=N;n++) s += 1/((x-n)*(x-n)); return s; }\n` +
    `  function target(kind, x){ var s=Math.sin(Math.PI*x); if(kind==='cot') return Math.PI*Math.cos(Math.PI*x)/s; return Math.PI*Math.PI/(s*s); }\n` +
    `  var XR=4;\n` +
    `  var PX0=48, PW=464, PTop=28, PBot=214, PH=186;\n` +
    `  function PX(x){ return PX0 + (x+XR)/(2*XR)*PW; }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0], N=+nIn.value;\n` +
    `    nL.textContent = 'N = ' + N;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var isCot = (g.kind==='cot');\n` +
    `    var yLo = isCot?-6:0, yHi = isCot?6:32;\n` +
    `    function PY(v){ var c=Math.max(yLo, Math.min(yHi, v)); return PBot - (c-yLo)/(yHi-yLo)*PH; }\n` +
    `    // pole asymptotes at the included integers\n` +
    `    var n; for(n=-N;n<=N;n++){ if(Math.abs(n)<=XR){ svg.appendChild(mk('line', {x1:PX(n), y1:PTop, x2:PX(n), y2:PBot, stroke:'var(--line)', 'stroke-dasharray':'2 4'})); } }\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY(0), x2:PX0+PW, y2:PY(0), stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PY(0)+(isCot?16:-6), 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'x \\u2208 [\\u22124, 4]'));\n` +
    `    // target (faint), drawn in segments to avoid jumping across poles\n` +
    `    function drawCurve(fn, attrs){ var seg=[], i, x; for(i=0;i<=520;i++){ x=-XR+2*XR*i/520; var v=fn(x); if(isFinite(v) && v>yLo-1 && v<yHi+1){ seg.push(PX(x).toFixed(1)+','+PY(v).toFixed(1)); } else if(seg.length>1){ svg.appendChild(mk('polyline', Object.assign({points:seg.join(' '), fill:'none'}, attrs))); seg=[]; } else seg=[]; } if(seg.length>1) svg.appendChild(mk('polyline', Object.assign({points:seg.join(' '), fill:'none'}, attrs))); }\n` +
    `    drawCurve(function(x){ return target(g.kind, x); }, {stroke:'var(--mute)', 'stroke-width':1.2, 'stroke-dasharray':'4 3'});\n` +
    `    drawCurve(function(x){ return partial(g.kind, x, N); }, {stroke:'var(--cyan)', 'stroke-width':2});\n` +
    `    // pole markers on the axis\n` +
    `    for(n=-N;n<=N;n++){ if(Math.abs(n)<=XR) svg.appendChild(mk('circle', {cx:PX(n), cy:PY(0), r:2.6, fill:'var(--pink)'})); }\n` +
    `    svg.appendChild(mk('text', {x:PX0+6, y:PTop+10, 'font-size':10, fill:'var(--cyan)'}, 'S_' + N + ' (partial sum)'));\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PTop+10, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'target (dashed)'));\n` +
    `    // readout\n` +
    `    var expansion = isCot ? '1/z + \\u03a3 2z/(z\\u00b2\\u2212n\\u00b2)' : '\\u03a3 1/(z\\u2212n)\\u00b2';\n` +
    `    var lines=[];\n` +
    `    lines.push('Mittag-Leffler: prescribe poles and principal parts, and a meromorphic function with exactly those poles exists \\u2014 as a (corrected) sum of principal parts. Here ' + g.label + ' = ' + expansion + '.');\n` +
    `    lines.push('S_' + N + ' keeps the pole terms through n = \\u00b1' + N + ' (pink dots): its poles already sit at those integers, and adding terms includes more.');\n` +
    `    lines.push('As N grows S_N \\u2192 the target (dashed) on wider intervals; near the edges, beyond the last included pole, it has not settled yet \\u2014 raise N.');\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); nIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
