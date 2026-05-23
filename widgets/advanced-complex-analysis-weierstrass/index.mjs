// advanced-complex-analysis-weierstrass widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The partial-product eval is intrinsic (a `kind`
// enum); params carry the case menu (validated against ./schema.json). The
// widget plots the partial product P_N along the real axis against the target
// entire function, so the prescribed zeros lock in one at a time.

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
    `    <label for="${widgetId}-n">factors $N$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="1" max="12" value="3" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nval">N = 3</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 250" width="540" height="250" role="img" aria-label="The partial product P_N along the real axis against the target function"><title>Weierstrass factorization: the partial product converges to the entire function as factors are added</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* advanced-complex-analysis-weierstrass widget: ${widgetId} */\n` +
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
    `  function partial(kind, x, N){ var p=1, n; if(kind==='sinc'){ for(n=1;n<=N;n++) p*=(1 - x*x/(n*n)); } else { for(n=1;n<=N;n++){ var d=(2*n-1); p*=(1 - 4*x*x/(d*d)); } } return p; }\n` +
    `  function target(kind, x){ if(kind==='sinc') return Math.abs(x)<1e-9 ? 1 : Math.sin(Math.PI*x)/(Math.PI*x); return Math.cos(Math.PI*x); }\n` +
    `  function zeros(kind, N){ var z=[], n; for(n=1;n<=N;n++){ if(kind==='sinc'){ z.push(n); z.push(-n); } else { z.push((2*n-1)/2); z.push(-(2*n-1)/2); } } return z; }\n` +
    `  var XR=4, YR=1.5;\n` +
    `  var PX0=50, PW=460, PYc=128, PHh=92;\n` +
    `  function PX(x){ return PX0 + (x+XR)/(2*XR)*PW; }\n` +
    `  function PY(v){ var c=Math.max(-YR, Math.min(YR, v)); return PYc - c/YR*PHh; }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0], N=+nIn.value;\n` +
    `    nL.textContent = 'N = ' + N;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PYc, x2:PX0+PW, y2:PYc, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:PX(0), y1:PYc-PHh, x2:PX(0), y2:PYc+PHh, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PYc+16, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'x \\u2208 [\\u22124, 4]'));\n` +
    `    // target (faint)\n` +
    `    var i, x, tp=[]; for(i=0;i<=240;i++){ x=-XR+2*XR*i/240; tp.push(PX(x).toFixed(1)+','+PY(target(g.kind,x)).toFixed(1)); }\n` +
    `    svg.appendChild(mk('polyline', {points:tp.join(' '), fill:'none', stroke:'var(--mute)', 'stroke-width':1.2, 'stroke-dasharray':'4 3'}));\n` +
    `    // partial product (clipped where it leaves the band, drawn in segments)\n` +
    `    var seg=[]; function flush(){ if(seg.length>1) svg.appendChild(mk('polyline', {points:seg.join(' '), fill:'none', stroke:'var(--cyan)', 'stroke-width':2})); seg=[]; }\n` +
    `    for(i=0;i<=360;i++){ x=-XR+2*XR*i/360; var v=partial(g.kind,x,N); if(v>=-YR-0.02 && v<=YR+0.02){ seg.push(PX(x).toFixed(1)+','+PY(v).toFixed(1)); } else { flush(); } }\n` +
    `    flush();\n` +
    `    // prescribed zeros locked in so far\n` +
    `    zeros(g.kind, N).forEach(function(z){ if(Math.abs(z)<=XR) svg.appendChild(mk('circle', {cx:PX(z), cy:PYc, r:3, fill:'var(--pink)'})); });\n` +
    `    svg.appendChild(mk('text', {x:PX(0)+6, y:PYc-PHh+12, 'font-size':10, fill:'var(--cyan)'}, 'P_' + N + ' (partial product)'));\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PYc-PHh+12, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'target (dashed)'));\n` +
    `    // readout\n` +
    `    var prod = g.kind==='sinc' ? '\\u220f(1 \\u2212 z\\u00b2/n\\u00b2)' : '\\u220f(1 \\u2212 4z\\u00b2/(2n\\u22121)\\u00b2)';\n` +
    `    var lines=[];\n` +
    `    lines.push('Weierstrass: an entire function is a product over its zeros (times e^{g}). Here ' + g.label + ' = ' + prod + '.');\n` +
    `    lines.push('P_' + N + ' is the product of the first ' + N + ' factor(s): its zeros (pink) sit at the prescribed points, and adding factors locks in more of them.');\n` +
    `    lines.push('As N grows P_N \\u2192 the target (dashed) on wider and wider intervals \\u2014 the canonical product converges.');\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); nIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
