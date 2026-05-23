// complex-analysis-riemann-sphere widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Stereographic projection + the fixed oblique 3-D
// drawing are intrinsic; params carry only optional presets (validated against
// ./schema.json).

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
      `  <div class="row">\n    <label for="${widgetId}-preset">jump to</label>\n    <select id="${widgetId}-preset">\n${opts}\n    </select>\n  </div>\n`;
  }
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    presetRow +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-mod">$|z|$</label>\n` +
    `    <input type="range" id="${widgetId}-mod" min="0" max="2.6" value="1" step="0.02">\n` +
    `    <span class="pill" id="${widgetId}-modval">|z| = 1</span>\n` +
    `    <label for="${widgetId}-arg">$\\arg z$</label>\n` +
    `    <input type="range" id="${widgetId}-arg" min="0" max="6.283" value="0.6" step="0.02">\n` +
    `    <span class="pill" id="${widgetId}-argval">arg = 0.6</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 520 330" width="520" height="330" role="img" aria-label="Stereographic projection of a point onto the Riemann sphere"><title>Riemann sphere: stereographic projection from the north pole</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, presets } = params;
  const data = JSON.stringify(presets || []);
  return (
    `<script>\n` +
    `/* complex-analysis-riemann-sphere widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var PRE = ${data};\n` +
    `  var pById = {}; PRE.forEach(function(p){ pById[p.id] = p; });\n` +
    `  var modIn = document.getElementById('${widgetId}-mod'), modL = document.getElementById('${widgetId}-modval');\n` +
    `  var argIn = document.getElementById('${widgetId}-arg'), argL = document.getElementById('${widgetId}-argval');\n` +
    `  var preset = document.getElementById('${widgetId}-preset');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!modIn || !argIn || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  var SC = 62, CX = 235, CY = 220, cosA = Math.cos(0.62), sinA = Math.sin(0.62), F = 0.5;\n` +
    `  function P(X,Y,Z){ return [CX + SC*(X + Y*F*cosA), CY - SC*(Z + Y*F*sinA)]; }\n` +
    `  function stereo(x,y){ var r2 = x*x + y*y, d = 1 + r2; return [x/d, y/d, r2/d]; }\n` +
    `  function ring(rad, z0, n){ var pts=[]; for(var i=0;i<=n;i++){ var t=2*Math.PI*i/n; var p=P(rad*Math.cos(t), rad*Math.sin(t), z0); pts.push(p[0].toFixed(1)+','+p[1].toFixed(1)); } return pts.join(' '); }\n` +
    `  function meridian(phi, n){ var pts=[]; for(var i=0;i<=n;i++){ var psi=Math.PI*i/n; var p=P(0.5*Math.sin(psi)*Math.cos(phi), 0.5*Math.sin(psi)*Math.sin(phi), 0.5+0.5*Math.cos(psi)); pts.push(p[0].toFixed(1)+','+p[1].toFixed(1)); } return pts.join(' '); }\n` +
    `  function draw(){\n` +
    `    var mod = +modIn.value, arg = +argIn.value;\n` +
    `    modL.textContent = '|z| = ' + mod.toFixed(2); argL.textContent = 'arg = ' + arg.toFixed(2);\n` +
    `    var x = mod*Math.cos(arg), y = mod*Math.sin(arg);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // tangent plane at Z=0: concentric circles + axes (faint)\n` +
    `    [0.5,1,1.5,2].forEach(function(rr){ svg.appendChild(mk('polyline', {points:ring(rr,0,48), fill:'none', stroke:'var(--line)', 'stroke-width':0.7})); });\n` +
    `    var ax1=P(-2.2,0,0), ax2=P(2.2,0,0), ay1=P(0,-2.2,0), ay2=P(0,2.2,0);\n` +
    `    svg.appendChild(mk('line', {x1:ax1[0], y1:ax1[1], x2:ax2[0], y2:ax2[1], stroke:'var(--line)', 'stroke-width':0.7}));\n` +
    `    svg.appendChild(mk('line', {x1:ay1[0], y1:ay1[1], x2:ay2[0], y2:ay2[1], stroke:'var(--line)', 'stroke-width':0.7}));\n` +
    `    // sphere wireframe: latitudes + 2 meridians; equator highlighted\n` +
    `    [0.12,0.3,0.7,0.88].forEach(function(z0){ var r0=Math.sqrt(Math.max(0,0.25-(z0-0.5)*(z0-0.5))); svg.appendChild(mk('polyline', {points:ring(r0,z0,48), fill:'none', stroke:'var(--mute)', 'stroke-width':0.7, 'stroke-opacity':0.5})); });\n` +
    `    svg.appendChild(mk('polyline', {points:meridian(0,40), fill:'none', stroke:'var(--mute)', 'stroke-width':0.7, 'stroke-opacity':0.5}));\n` +
    `    svg.appendChild(mk('polyline', {points:meridian(Math.PI/2,40), fill:'none', stroke:'var(--mute)', 'stroke-width':0.7, 'stroke-opacity':0.5}));\n` +
    `    svg.appendChild(mk('polyline', {points:ring(0.5,0.5,48), fill:'none', stroke:'var(--cyan)', 'stroke-width':1.2, 'stroke-opacity':0.8}));\n` +
    `    // poles\n` +
    `    var N = P(0,0,1), S = P(0,0,0);\n` +
    `    svg.appendChild(mk('circle', {cx:N[0], cy:N[1], r:3.5, fill:'var(--pink)'}));\n` +
    `    svg.appendChild(mk('text', {x:N[0]+8, y:N[1]-2, 'font-size':11, fill:'var(--pink)'}, 'N = \\u221e'));\n` +
    `    svg.appendChild(mk('text', {x:S[0]+6, y:S[1]+13, 'font-size':10, fill:'var(--mute)'}, '0'));\n` +
    `    // the point z in the plane, its image P_z, the projection ray N -> z\n` +
    `    var s = stereo(x,y), pz = P(s[0],s[1],s[2]), zp = P(x,y,0);\n` +
    `    svg.appendChild(mk('line', {x1:N[0], y1:N[1], x2:zp[0], y2:zp[1], stroke:'var(--yellow)', 'stroke-width':1, 'stroke-dasharray':'3 3', 'stroke-opacity':0.8}));\n` +
    `    svg.appendChild(mk('circle', {cx:zp[0], cy:zp[1], r:4, fill:'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('text', {x:zp[0]+7, y:zp[1]+4, 'font-size':11, fill:'var(--yellow)'}, 'z'));\n` +
    `    svg.appendChild(mk('circle', {cx:pz[0], cy:pz[1], r:4.5, fill:'var(--green)'}));\n` +
    `    svg.appendChild(mk('text', {x:pz[0]+7, y:pz[1]+4, 'font-size':11, fill:'var(--green)'}, 'P(z)'));\n` +
    `    // readout\n` +
    `    var lines = [];\n` +
    `    lines.push('z = ' + x.toFixed(2) + ' + ' + y.toFixed(2) + 'i      |z| = ' + mod.toFixed(2));\n` +
    `    lines.push('image on sphere:  (' + s[0].toFixed(2) + ', ' + s[1].toFixed(2) + ', ' + s[2].toFixed(2) + ')   [height ' + s[2].toFixed(2) + ']');\n` +
    `    var where = mod < 0.98 ? 'southern hemisphere (toward 0)' : (mod > 1.02 ? 'northern hemisphere (toward \\u221e)' : 'the equator');\n` +
    `    lines.push('|z| ' + (mod<0.98?'<':(mod>1.02?'>':'=')) + ' 1  \\u21d2  image on ' + where + '.');\n` +
    `    lines.push('');\n` +
    `    lines.push('Stereographic projection from N is conformal and sends circles\\u2194circles (a line = a circle through \\u221e). As |z|\\u2192\\u221e the image \\u2192 N.');\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  modIn.addEventListener('input', function(){ if(preset) preset.selectedIndex = -1; draw(); });\n` +
    `  argIn.addEventListener('input', function(){ if(preset) preset.selectedIndex = -1; draw(); });\n` +
    `  if(preset){ preset.addEventListener('change', function(){ var p = pById[preset.value]; if(p){ modIn.value = p.mod; argIn.value = p.arg; draw(); } }); }\n` +
    `  if(preset && PRE.length){ var p0 = PRE[0]; modIn.value = p0.mod; argIn.value = p0.arg; }\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
