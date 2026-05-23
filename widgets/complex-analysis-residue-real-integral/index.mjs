// complex-analysis-residue-real-integral widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The 2πi·Σ arithmetic and contour drawing are
// intrinsic; params carry each integrand's poles, residues, and answer
// (validated against ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, integrands } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = integrands
    .map((g, i) => `      <option value="${escapeHtml(g.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(g.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">integrand $f(x)$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 250" width="560" height="250" role="img" aria-label="Upper-half-plane contour and the enclosed poles"><title>Real integral by residues: the upper-half-plane semicircle</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, integrands } = params;
  const data = JSON.stringify(integrands);
  return (
    `<script>\n` +
    `/* complex-analysis-residue-real-integral widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var DATA = ${data};\n` +
    `  var byId = {}; DATA.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function fmt(x){ var r = Math.round(x*1000)/1000; return (r===0?0:r).toString(); }\n` +
    `  var W = 560, cx = 280, axisY = 170, sc = 56; // pixels per unit; real axis at axisY\n` +
    `  function PX(re){ return cx + re*sc; } function PY(im){ return axisY - im*sc; }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || DATA[0];\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // real axis\n` +
    `    svg.appendChild(mk('line', {x1:20, y1:axisY, x2:W-20, y2:axisY, stroke:'var(--line)', 'stroke-width':1}));\n` +
    `    svg.appendChild(mk('text', {x:W-22, y:axisY+16, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'Re'));\n` +
    `    // UHP semicircle contour: segment along real axis + arc of radius R\n` +
    `    var R = 2.2, arc = [];\n` +
    `    for(var t=0; t<=60; t++){ var th = Math.PI*t/60; arc.push(PX(R*Math.cos(th))+','+PY(R*Math.sin(th))); }\n` +
    `    svg.appendChild(mk('polyline', {points:arc.join(' '), fill:'none', stroke:'var(--violet)', 'stroke-width':1.6}));\n` +
    `    svg.appendChild(mk('line', {x1:PX(-R), y1:axisY, x2:PX(R), y2:axisY, stroke:'var(--violet)', 'stroke-width':1.6}));\n` +
    `    // shade UHP lightly\n` +
    `    svg.appendChild(mk('text', {x:PX(0), y:PY(R)+ -6, 'text-anchor':'middle', 'font-size':10, 'font-style':'italic', fill:'var(--violet)'}, 'arc R \\u2192 \\u221e  (contribution \\u2192 0)'));\n` +
    `    // poles\n` +
    `    var sumRe = 0, sumIm = 0, enclosed = 0;\n` +
    `    for(var i=0;i<g.poles.length;i++){\n` +
    `      var p = g.poles[i], up = p.im > 0, x = PX(p.re), y = PY(p.im);\n` +
    `      var col = up ? 'var(--yellow)' : 'var(--mute)';\n` +
    `      svg.appendChild(mk('text', {x:x, y:y+(up?-8:14), 'text-anchor':'middle', 'font-size':14, fill:col}, '\\u00d7'));\n` +
    `      if(p.label) svg.appendChild(mk('text', {x:x+10, y:y+(up?-8:14), 'text-anchor':'start', 'font-size':10, fill:col}, p.label));\n` +
    `      if(up){ sumRe += p.resRe; sumIm += p.resIm; enclosed++; }\n` +
    `    }\n` +
    `    // 2*pi*i * (sumRe + i sumIm) = -2*pi*sumIm + i*2*pi*sumRe\n` +
    `    var twoPi = 2*Math.PI, intRe = -twoPi*sumIm, intIm = twoPi*sumRe;\n` +
    `    var intStr = (Math.abs(intIm) < 1e-9) ? fmt(intRe) : (fmt(intRe) + ' + ' + fmt(intIm) + 'i');\n` +
    `    var lines = [];\n` +
    `    lines.push('Close the contour in the upper half-plane. As R \\u2192 \\u221e the arc vanishes, so');\n` +
    `    lines.push('\\u222b\\u208b\\u221e\\u207a\\u221e f(x) dx = 2\\u03c0i \\u00b7 \\u03a3 Res over the ' + enclosed + ' enclosed pole' + (enclosed===1?'':'s') + ' (yellow \\u00d7, im > 0).');\n` +
    `    lines.push('\\u03a3 Res = ' + fmt(sumRe) + ' + ' + fmt(sumIm) + 'i      2\\u03c0i\\u00b7\\u03a3 Res = ' + intStr + '   =   ' + g.result);\n` +
    `    if(g.note){ lines.push(''); lines.push(g.note); }\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
