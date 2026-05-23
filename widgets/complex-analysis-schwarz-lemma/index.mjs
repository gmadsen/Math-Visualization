// complex-analysis-schwarz-lemma widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The self-map evaluation + bound plot are intrinsic
// (a `kind` enum); params carry the menu (validated against ./schema.json).

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
    `    <label for="${widgetId}-sel">f : 𝔻→𝔻, f(0)=0</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-dir">ray $\\arg z$</label>\n` +
    `    <input type="range" id="${widgetId}-dir" min="0" max="6.283" value="0.6" step="0.02">\n` +
    `    <span class="pill" id="${widgetId}-dirval">arg = 0.60</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 250" width="540" height="250" role="img" aria-label="|f(z)| against |z| with the Schwarz bound"><title>Schwarz lemma: |f(z)| ≤ |z| with equality only for rotations</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* complex-analysis-schwarz-lemma widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var byId = {}; FNS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var dir = document.getElementById('${widgetId}-dir'), dirL = document.getElementById('${widgetId}-dirval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !dir || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function cdiv(p,q){ var d=q[0]*q[0]+q[1]*q[1]; return [(p[0]*q[0]+p[1]*q[1])/d, (p[1]*q[0]-p[0]*q[1])/d]; }\n` +
    `  var A = 0.5; // Blaschke parameter (real)\n` +
    `  function f(kind, z){\n` +
    `    if(kind==='sq') return cmul(z,z);\n` +
    `    if(kind==='cube') return cmul(cmul(z,z), z);\n` +
    `    if(kind==='rot'){ var e=[Math.cos(Math.PI/4), Math.sin(Math.PI/4)]; return cmul(e, z); }\n` +
    `    if(kind==='blaschke0'){ var num=[z[0]-A, z[1]], den=[1-A*z[0], -A*z[1]]; return cmul(z, cdiv(num, den)); }\n` +
    `    return z;\n` +
    `  }\n` +
    `  // plot box\n` +
    `  var PX0=70, PY0=210, PW=420, PH=170; // axes origin bottom-left, width, height\n` +
    `  function X(r){ return PX0 + r*PW; } function Y(v){ return PY0 - v*PH; }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0], th = +dir.value;\n` +
    `    dirL.textContent = 'arg = ' + th.toFixed(2);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY0, x2:PX0+PW, y2:PY0, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY0, x2:PX0, y2:PY0-PH, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PY0+16, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, '|z| \\u2192 1'));\n` +
    `    svg.appendChild(mk('text', {x:PX0-8, y:PY0-PH, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, '|f|'));\n` +
    `    // bound line |f| = |z| (the diagonal)\n` +
    `    svg.appendChild(mk('line', {x1:X(0), y1:Y(0), x2:X(1), y2:Y(1), stroke:'var(--pink)', 'stroke-width':1.2, 'stroke-dasharray':'4 3'}));\n` +
    `    svg.appendChild(mk('text', {x:X(0.82), y:Y(0.82)-6, 'font-size':10, fill:'var(--pink)'}, 'bound |f| = |z|'));\n` +
    `    // the curve |f(r e^{i th})| vs r\n` +
    `    var pts=[], touch=true; for(var i=0;i<=100;i++){ var r=i/100, z=[r*Math.cos(th), r*Math.sin(th)], w=f(g.kind, z), m=Math.hypot(w[0],w[1]); if(r>0.001 && m < r-1e-4) touch=false; pts.push(X(r)+','+Y(Math.min(m,1.05))); }\n` +
    `    svg.appendChild(mk('polyline', {points:pts.join(' '), fill:'none', stroke:'var(--cyan)', 'stroke-width':1.8}));\n` +
    `    svg.appendChild(mk('text', {x:X(0.96), y:Y(0.18), 'text-anchor':'end', 'font-size':10, fill:'var(--cyan)'}, '|f(z)| along the ray'));\n` +
    `    var lines = [];\n` +
    `    lines.push('Schwarz: f : 𝔻→𝔻 with f(0)=0 \\u21d2 |f(z)| \\u2264 |z| and |f\\u2032(0)| \\u2264 1.');\n` +
    `    lines.push('|f\\u2032(0)| = ' + (g.fp0 || '?') + '.   This f: the |f| curve lies ' + (touch ? 'ON the bound (a rotation — equality everywhere).' : 'strictly BELOW the bound (a genuine contraction).'));\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); dir.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
