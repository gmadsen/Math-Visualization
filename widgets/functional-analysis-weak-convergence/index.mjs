// functional-analysis-weak-convergence widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The component values come from params. The widget
// shows that the orthonormal basis e_n converges weakly to 0 (⟨e_n,y⟩ = y_n → 0)
// while ‖e_n‖ = 1 stays put — weak ≠ strong in infinite dimensions.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, vectors } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = vectors
    .map((g, i) => `      <option value="${escapeHtml(g.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(g.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">test vector $y$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-n">basis index $n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="1" max="14" value="3" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nval">n = 3</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 250" width="540" height="250" role="img" aria-label="The components of y as bars, with ⟨e_n,y⟩ highlighted against the constant norm 1"><title>Weak convergence: e_n converges weakly to 0 but keeps norm 1</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, vectors } = params;
  const data = JSON.stringify(vectors);
  return (
    `<script>\n` +
    `/* functional-analysis-weak-convergence widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var VECS = ${data};\n` +
    `  var byId = {}; VECS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var nIn = document.getElementById('${widgetId}-n'), nL = document.getElementById('${widgetId}-nval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg'), out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !nIn || !nL || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  var PX0=52, PW=466, PY0=200, PH=150;\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || VECS[0], comps = g.comps, N = comps.length;\n` +
    `    var n = Math.min(+nIn.value, N); nL.textContent = 'n = ' + n;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var yHi = 1.1; // components are ≤ 1 here, and ‖e_n‖ = 1\n` +
    `    function BX(i){ return PX0 + (i-0.5)/N*PW; } function PY(v){ return PY0 - v/yHi*PH; }\n` +
    `    var bw = 0.62*PW/N;\n` +
    `    // axes + the constant ‖e_n‖ = 1 line\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY0, x2:PX0+PW, y2:PY0, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY(1), x2:PX0+PW, y2:PY(1), stroke:'var(--pink)', 'stroke-width':1.4, 'stroke-dasharray':'5 3'}));\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PY(1)-4, 'text-anchor':'end', 'font-size':10, fill:'var(--pink)'}, '‖e_n‖ = 1 (constant)'));\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PY0+16, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'component index k'));\n` +
    `    // component bars  y_k = ⟨e_k, y⟩\n` +
    `    var i; for(i=1;i<=N;i++){ var h=comps[i-1], hb=Math.abs(h); var on=(i===n);\n` +
    `      svg.appendChild(mk('rect', {x:(BX(i)-bw/2).toFixed(1), y:PY(hb).toFixed(1), width:bw.toFixed(1), height:(PY0-PY(hb)).toFixed(1), fill: on?'var(--yellow)':'color-mix(in srgb, var(--cyan) 55%, transparent)'})); }\n` +
    `    // highlight ⟨e_n, y⟩\n` +
    `    var yn = comps[n-1];\n` +
    `    svg.appendChild(mk('text', {x:BX(n), y:PY(Math.abs(yn))-6, 'text-anchor':'middle', 'font-size':10, fill:'var(--yellow)'}, '⟨e_' + n + ',y⟩ = ' + yn.toFixed(2)));\n` +
    `    svg.appendChild(mk('text', {x:PX0, y:PY0-PH+4, 'font-size':10, fill:'var(--mute)'}, 'components |y_k| (cyan), with k = n highlighted'));\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    lines.push('The orthonormal basis e_n converges WEAKLY to 0: for every y ∈ ℓ², ⟨e_n,y⟩ = y_n → 0 (because Σ|y_n|² = ‖y‖² < ∞ forces the terms to 0).');\n` +
    `    lines.push('Here ⟨e_' + n + ',y⟩ = y_' + n + ' = ' + yn.toFixed(3) + ' (yellow bar) \\u2014 it shrinks as n grows.');\n` +
    `    lines.push('But ‖e_n‖ = 1 for every n (pink line): e_n does NOT converge in norm. Weak \\u2260 strong \\u2014 the hallmark of infinite dimensions.');\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', function(){ var g=byId[sel.value]; if(g){ nIn.max=g.comps.length; if(+nIn.value>g.comps.length) nIn.value=g.comps.length; } draw(); });\n` +
    `  nIn.addEventListener('input', draw);\n` +
    `  // set initial max from the first vector\n` +
    `  var g0=byId[sel.value]||VECS[0]; nIn.max=g0.comps.length;\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
