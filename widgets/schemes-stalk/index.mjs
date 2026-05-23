// schemes-stalk widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The polynomial eval is intrinsic; params carry the
// sample functions. The widget shows the stalk O_a at a point a of 𝔸¹ as a LOCAL
// ring: f is a unit iff f(a) ≠ 0, and the non-units form the unique maximal ideal.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-a">point $a$ on $\\mathbb{A}^1$</label>\n` +
    `    <input type="range" id="${widgetId}-a" min="-3" max="3" value="0.6" step="0.05">\n` +
    `    <span class="pill" id="${widgetId}-aval">a = 0.60</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 250" width="540" height="250" role="img" aria-label="Sample functions on the affine line, marked unit or non-unit at the chosen point"><title>Local rings: the stalk at a point is local; the non-units are exactly the functions vanishing there</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* schemes-stalk widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var aIn=document.getElementById('${widgetId}-a'), aL=document.getElementById('${widgetId}-aval');\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  if(!aIn || !aL || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function peval(c, x){ var r=0, i; for(i=c.length-1;i>=0;i--) r=r*x+c[i]; return r; }\n` +
    `  var XR=3, YR=4, PX0=44, PW=420, PYc=120, PHh=92;\n` +
    `  function PX(x){ return PX0 + (x+XR)/(2*XR)*PW; } function PY(v){ return PYc - Math.max(-YR,Math.min(YR,v))/YR*PHh; }\n` +
    `  var COLORS=['var(--cyan)','var(--green)','var(--violet)','var(--orange)','var(--blue)'];\n` +
    `  function draw(){\n` +
    `    var a=+aIn.value; aL.textContent='a = '+a.toFixed(2);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PYc, x2:PX0+PW, y2:PYc, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:PX(0), y1:PYc-PHh, x2:PX(0), y2:PYc+PHh, stroke:'var(--line)'}));\n` +
    `    // vertical line at the point a\n` +
    `    svg.appendChild(mk('line', {x1:PX(a), y1:PYc-PHh, x2:PX(a), y2:PYc+PHh, stroke:'var(--mute)', 'stroke-dasharray':'3 3'}));\n` +
    `    svg.appendChild(mk('text', {x:PX(a), y:PYc+PHh+16, 'text-anchor':'middle', 'font-size':10, fill:'var(--mute)'}, 'a = '+a.toFixed(2)));\n` +
    `    // function curves + value dots at a\n` +
    `    var i, x, j; for(j=0;j<FNS.length;j++){ var f=FNS[j], col=COLORS[j%COLORS.length], pts=[];\n` +
    `      for(i=0;i<=200;i++){ x=-XR+2*XR*i/200; var v=peval(f.coeffs,x); if(v>=-YR-0.1 && v<=YR+0.1) pts.push(PX(x).toFixed(1)+','+PY(v).toFixed(1)); }\n` +
    `      svg.appendChild(mk('polyline', {points:pts.join(' '), fill:'none', stroke:col, 'stroke-width':1.6, opacity:0.85}));\n` +
    `      var fa=peval(f.coeffs,a), unit=Math.abs(fa)>1e-9;\n` +
    `      svg.appendChild(mk('circle', {cx:PX(a), cy:PY(fa), r:4, fill: unit?col:'var(--pink)', stroke: unit?'none':'var(--pink)'})); }\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PYc-PHh+10, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'x \\u2208 [\\u22123,3]'));\n` +
    `    // readout\n` +
    `    var units=[], nonunits=[]; FNS.forEach(function(f){ var fa=peval(f.coeffs,a); if(Math.abs(fa)>1e-9) units.push(f.label+' ('+fa.toFixed(2)+')'); else nonunits.push(f.label); });\n` +
    `    var lines=[];\n` +
    `    lines.push('The stalk O_a = germs of functions near a (= k[x] localized at (x\\u2212a)) is a LOCAL ring: f is a UNIT iff f(a) \\u2260 0, and the non-units {f : f(a)=0} are its unique maximal ideal m_a. The residue field O_a/m_a = k via f \\u21a6 f(a).');\n` +
    `    lines.push('At a = ' + a.toFixed(2) + ':  units (f(a)\\u22600): ' + (units.join(', ')||'\\u2014') + '.');\n` +
    `    lines.push('  in m_a (f(a)=0, i.e. a is a root): ' + (nonunits.join(', ')||'none \\u2014 slide a onto a root to land in m_a') + '.');\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  aIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
