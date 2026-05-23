// functional-analysis-banach-alaoglu widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The ℓ^p ball geometry is intrinsic; params carry the
// norm menu. The widget draws the dual unit ball inside the compact cube
// ∏[−‖eᵢ‖,‖eᵢ‖] that the Banach–Alaoglu proof embeds it into.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, norms } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = norms
    .map((g, i) => `      <option value="${escapeHtml(g.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(g.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">norm on $X=\\mathbb{R}^2$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 280" width="540" height="280" role="img" aria-label="The dual unit ball inside the compact product cube"><title>Banach–Alaoglu: the dual unit ball is a closed subset of a compact product, hence weak-* compact</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, norms } = params;
  const data = JSON.stringify(norms);
  return (
    `<script>\n` +
    `/* functional-analysis-banach-alaoglu widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var NORMS = ${data};\n` +
    `  var byId = {}; NORMS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var svg = document.getElementById('${widgetId}-svg'), out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  var CX=270, CY=148, SC=104;\n` +
    `  function PX(x){ return CX + x*SC; } function PY(y){ return CY - y*SC; }\n` +
    `  // boundary of the ℓ^p unit ball: r(θ) = (|cosθ|^p + |sinθ|^p)^{-1/p};  p≥50 ⇒ ∞ (the square)\n` +
    `  function ballPts(p){ var pts=[], i, th; for(i=0;i<=160;i++){ th=2*Math.PI*i/160; var c=Math.abs(Math.cos(th)), s=Math.abs(Math.sin(th)), r;\n` +
    `    if(p>=50){ r=1/Math.max(c,s,1e-9); } else { r=Math.pow(Math.pow(c,p)+Math.pow(s,p), -1/p); }\n` +
    `    pts.push([r*Math.cos(th), r*Math.sin(th)]); } return pts; }\n` +
    `  function poly(pts, attrs){ var s=pts.map(function(q){ return PX(q[0]).toFixed(1)+','+PY(q[1]).toFixed(1); }); svg.appendChild(mk('polygon', Object.assign({points:s.join(' ')}, attrs))); }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || NORMS[0];\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // the compact cube ∏[−1,1]  (= [−‖e₁‖,‖e₁‖]×[−‖e₂‖,‖e₂‖], here ‖eᵢ‖=1)\n` +
    `    svg.appendChild(mk('rect', {x:PX(-1), y:PY(1), width:(2*SC), height:(2*SC), fill:'none', stroke:'var(--mute)', 'stroke-width':1.4, 'stroke-dasharray':'5 4'}));\n` +
    `    svg.appendChild(mk('text', {x:PX(1)+4, y:PY(1)+10, 'font-size':9, fill:'var(--mute)'}, 'cube \\u220f[\\u22121,1]'));\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line', {x1:PX(-1.25), y1:CY, x2:PX(1.25), y2:CY, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:CX, y1:PY(1.25), x2:CX, y2:PY(-1.25), stroke:'var(--line)'}));\n` +
    `    // X unit ball (ℓ^p), faint, for duality context\n` +
    `    poly(ballPts(g.p), {fill:'none', stroke:'var(--violet)', 'stroke-width':1.2, 'stroke-dasharray':'3 3'});\n` +
    `    // dual ball B_{X*} = ℓ^q ball (the compact set), filled\n` +
    `    poly(ballPts(g.q), {fill:'color-mix(in srgb, var(--cyan) 16%, transparent)', stroke:'var(--cyan)', 'stroke-width':2});\n` +
    `    svg.appendChild(mk('text', {x:CX, y:18, 'text-anchor':'middle', 'font-size':11, fill:'var(--cyan)', 'font-style':'italic'}, 'dual ball B(X*) (cyan) inside the cube'));\n` +
    `    var pq=function(v){ return v>=50?'\\u221e':(''+v); };\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    lines.push('Banach\\u2013Alaoglu: the closed unit ball B(X*) = {ℓ : ‖ℓ‖ \\u2264 1} of the dual is compact in the weak-* topology.');\n` +
    `    lines.push('Here X = (\\u211d\\u00b2, \\u2113^' + pq(g.p) + '), so X* = \\u2113^' + pq(g.q) + ' and B(X*) is the \\u2113^' + pq(g.q) + ' ball (cyan). It embeds via ℓ \\u21a6 (ℓ(e\\u2081), ℓ(e\\u2082)) into the cube [\\u22121,1]\\u00b2 = \\u220f[\\u2212‖eᵢ‖, ‖eᵢ‖], since |ℓ(eᵢ)| \\u2264 ‖ℓ‖‖eᵢ‖ \\u2264 1.');\n` +
    `    lines.push('The cube is compact (Tychonoff) and B(X*) is a CLOSED subset of it \\u2014 hence compact. In infinite dimensions the norm-ball is never compact, but this weak-* compactness still holds.');\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
