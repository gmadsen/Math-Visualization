// hodge-theory-period-elliptic widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The SL2(Z) reduction and the j-invariant q-series
// are intrinsic to the renderScript; params only carry optional notable
// presets (validated against ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, presets } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  let presetRow = '';
  if (presets && presets.length) {
    const opts = presets
      .map((p, i) => `      <option value="${escapeHtml(p.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(p.label)}</option>`)
      .join('\n');
    presetRow =
      `  <div class="row">\n` +
      `    <label for="${widgetId}-preset">jump to</label>\n` +
      `    <select id="${widgetId}-preset">\n${opts}\n    </select>\n` +
      `  </div>\n`;
  }
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    presetRow +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-re">$\\operatorname{Re}\\tau$</label>\n` +
    `    <input type="range" id="${widgetId}-re" min="-2" max="2" value="0" step="0.02">\n` +
    `    <span class="pill" id="${widgetId}-reval">Re τ = 0</span>\n` +
    `    <label for="${widgetId}-im">$\\operatorname{Im}\\tau$</label>\n` +
    `    <input type="range" id="${widgetId}-im" min="0.12" max="2.5" value="1" step="0.02">\n` +
    `    <span class="pill" id="${widgetId}-imval">Im τ = 1</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 480 300" width="480" height="300" role="img" aria-label="The period τ in the upper half-plane and its fundamental-domain representative"><title>Period map: τ in ℍ, reduced into the SL₂(ℤ) fundamental domain</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, presets } = params;
  const data = JSON.stringify(presets || []);
  return (
    `<script>\n` +
    `/* hodge-theory-period-elliptic widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var PRESETS = ${data};\n` +
    `  var pById = {}; PRESETS.forEach(function(p){ pById[p.id] = p; });\n` +
    `  var reIn = document.getElementById('${widgetId}-re'), reL = document.getElementById('${widgetId}-reval');\n` +
    `  var imIn = document.getElementById('${widgetId}-im'), imL = document.getElementById('${widgetId}-imval');\n` +
    `  var preset = document.getElementById('${widgetId}-preset');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!reIn || !imIn || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function X(re){ return 240 + re*110; }\n` +
    `  function Y(im){ return 285 - im*100; }\n` +
    `  function reduce(re, im){\n` +
    `    var steps = 0;\n` +
    `    for(var it=0; it<60; it++){\n` +
    `      var t = re - Math.round(re); if(t !== re){ re = t; steps++; }\n` +
    `      var n2 = re*re + im*im;\n` +
    `      if(n2 < 1 - 1e-9){ re = -re/n2; im = im/n2; steps++; } else break;\n` +
    `    }\n` +
    `    return [re, im, steps];\n` +
    `  }\n` +
    `  function jInv(re, im){ // expects reduced tau (small |q|)\n` +
    `    var qa = Math.exp(-2*Math.PI*im), th = 2*Math.PI*re;\n` +
    `    var qre = qa*Math.cos(th), qim = qa*Math.sin(th), n2 = qre*qre + qim*qim;\n` +
    `    if(n2 === 0) return [Infinity, 0];\n` +
    `    var jre = qre/n2, jim = -qim/n2; jre += 744;\n` +
    `    var coef = [196884, 21493760, 864299970, 20245856256, 333202640600];\n` +
    `    var pre = qre, pim = qim;\n` +
    `    for(var k=0;k<coef.length;k++){ jre += coef[k]*pre; jim += coef[k]*pim; var nr = pre*qre - pim*qim, ni = pre*qim + pim*qre; pre = nr; pim = ni; }\n` +
    `    return [jre, jim];\n` +
    `  }\n` +
    `  function draw(){\n` +
    `    var re = +reIn.value, im = +imIn.value;\n` +
    `    reL.textContent = 'Re τ = ' + re.toFixed(2); imL.textContent = 'Im τ = ' + im.toFixed(2);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line', {x1:20, y1:Y(0), x2:460, y2:Y(0), stroke:'var(--line)'}));\n` +
    `    // fundamental domain polygon: Re in [-1/2,1/2], above |tau|=1\n` +
    `    var pts = [];\n` +
    `    pts.push(X(-0.5)+','+Y(2.6)); pts.push(X(-0.5)+','+Y(Math.sqrt(0.75)));\n` +
    `    for(var a=120; a>=60; a-=4){ var rad = a*Math.PI/180; pts.push(X(Math.cos(rad))+','+Y(Math.sin(rad))); }\n` +
    `    pts.push(X(0.5)+','+Y(2.6));\n` +
    `    svg.appendChild(mk('polygon', {points:pts.join(' '), fill:'color-mix(in srgb, var(--violet) 12%, transparent)', stroke:'var(--violet)', 'stroke-width':1, 'stroke-dasharray':'4 3'}));\n` +
    `    svg.appendChild(mk('text', {x:X(0), y:Y(2.0), 'text-anchor':'middle', 'font-size':10.5, fill:'var(--violet)'}, 'fundamental domain'));\n` +
    `    // unit circle (reference)\n` +
    `    var cpts = []; for(var b=0;b<=180;b+=6){ var r2=b*Math.PI/180; cpts.push(X(Math.cos(r2))+','+Y(Math.sin(r2))); }\n` +
    `    svg.appendChild(mk('polyline', {points:cpts.join(' '), fill:'none', stroke:'var(--line)', 'stroke-width':0.8}));\n` +
    `    var red = reduce(re, im), rre = red[0], rim = red[1];\n` +
    `    // dashed link tau -> reduced\n` +
    `    svg.appendChild(mk('line', {x1:X(re), y1:Y(im), x2:X(rre), y2:Y(rim), stroke:'var(--mute)', 'stroke-width':1, 'stroke-dasharray':'2 3'}));\n` +
    `    // reduced point (green) and chosen tau (yellow)\n` +
    `    svg.appendChild(mk('circle', {cx:X(rre), cy:Y(rim), r:5, fill:'var(--green)'}));\n` +
    `    svg.appendChild(mk('text', {x:X(rre)+8, y:Y(rim)-6, 'font-size':10, fill:'var(--green)'}, 'τ*'));\n` +
    `    svg.appendChild(mk('circle', {cx:X(re), cy:Y(im), r:5, fill:'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('text', {x:X(re)+8, y:Y(im)-6, 'font-size':10, fill:'var(--yellow)'}, 'τ'));\n` +
    `    // readout\n` +
    `    var j = jInv(rre, rim), jre = j[0], jim = j[1];\n` +
    `    var jStr = (Math.abs(jim) < 0.5) ? String(Math.round(jre)) : (jre.toFixed(1) + ' + ' + jim.toFixed(1) + ' i');\n` +
    `    var qa = Math.exp(-2*Math.PI*rim);\n` +
    `    var lines = [];\n` +
    `    lines.push('τ = ' + re.toFixed(3) + ' + ' + im.toFixed(3) + ' i      lattice  \\u2124 + \\u2124\\u00b7τ');\n` +
    `    lines.push('reduced into the fundamental domain:  τ* = ' + rre.toFixed(3) + ' + ' + rim.toFixed(3) + ' i   (' + red[2] + ' SL\\u2082(\\u2124) moves)');\n` +
    `    lines.push('|q| = e^(\\u22122\\u03c0 Im τ*) = ' + qa.toExponential(2) + '      j(τ) \\u2248 ' + jStr);\n` +
    `    lines.push('');\n` +
    `    lines.push('\\u210d is the weight-1 period domain (Siegel H\\u2081); the period map of the universal elliptic curve is \\u210d / SL\\u2082(\\u2124) \\u2192 the j-line. Griffiths transversality is automatic here (\\u210d is Hermitian symmetric) \\u2014 higher-weight period domains are not, which is the difficulty.');\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  reIn.addEventListener('input', function(){ if(preset) preset.selectedIndex = -1; draw(); });\n` +
    `  imIn.addEventListener('input', function(){ if(preset) preset.selectedIndex = -1; draw(); });\n` +
    `  if(preset){ preset.addEventListener('change', function(){ var p = pById[preset.value]; if(p){ reIn.value = p.re; imIn.value = p.im; draw(); } }); }\n` +
    `  if(preset && PRESETS.length){ var p0 = PRESETS[0]; reIn.value = p0.re; imIn.value = p0.im; }\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
