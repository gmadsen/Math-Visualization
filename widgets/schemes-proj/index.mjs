// schemes-proj widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The geometry is intrinsic; params carry only chrome.
// The widget sweeps a point of ℙ¹ = Proj k[x₀,x₁] and shows its coordinate in the
// two affine charts U₀ (t = x₁/x₀) and U₁ (s = x₀/x₁), glued by t = 1/s.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-th">point $[x_0:x_1]$ around $\\mathbb{P}^1$</label>\n` +
    `    <input type="range" id="${widgetId}-th" min="0" max="3.14159" value="0.6" step="0.01">\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 250" width="540" height="250" role="img" aria-label="A point of the projective line and its coordinate in each of the two affine charts"><title>Proj: the projective line glued from two affine charts U0 and U1 by t = 1/s</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* schemes-proj widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var thIn=document.getElementById('${widgetId}-th');\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  if(!thIn || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  var Cx=270, Cyc=86, Rs=66;       // semicircle (ℙ¹)\n` +
    `  var LCx=270, LHalf=190, U0y=164, U1y=212; // chart lines\n` +
    `  function squash(v){ return v/(1+Math.abs(v)); } // R ∪ {∞} -> (-1,1], ∞ -> ±1\n` +
    `  function fmt(v, inf){ return inf ? '\\u221e' : v.toFixed(2); }\n` +
    `  function chartLine(y, label, coord, val, isInf){\n` +
    `    svg.appendChild(mk('line', {x1:LCx-LHalf, y1:y, x2:LCx+LHalf, y2:y, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('circle', {cx:LCx, cy:y, r:2, fill:'var(--mute)'}));\n` +
    `    svg.appendChild(mk('text', {x:LCx, y:y+14, 'text-anchor':'middle', 'font-size':8.5, fill:'var(--mute)'}, '0'));\n` +
    `    svg.appendChild(mk('text', {x:LCx+LHalf, y:y-5, 'text-anchor':'end', 'font-size':8.5, fill:'var(--mute)'}, '\\u2192 \\u221e'));\n` +
    `    svg.appendChild(mk('text', {x:LCx-LHalf, y:y-5, 'font-size':9, fill:'var(--mute)'}, label));\n` +
    `    var px = LCx + squash(val)*LHalf;\n` +
    `    svg.appendChild(mk('circle', {cx: isInf? LCx+LHalf : px, cy:y, r:4.5, fill: isInf?'var(--mute)':'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('text', {x:(isInf?LCx+LHalf:px), y:y-9, 'text-anchor':'middle', 'font-size':9, fill: isInf?'var(--mute)':'var(--yellow)'}, coord+'='+fmt(val,isInf))); }\n` +
    `  function draw(){\n` +
    `    var th=+thIn.value, x0=Math.cos(th), x1=Math.sin(th);\n` +
    `    var t = Math.abs(x0)<1e-6 ? Infinity : x1/x0;  // U0 coord\n` +
    `    var s = Math.abs(x1)<1e-6 ? Infinity : x0/x1;  // U1 coord = 1/t\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // ℙ¹ as a semicircle (antipodal x0:x1 identified ⇒ θ∈[0,π))\n` +
    `    var arc=[], i; for(i=0;i<=60;i++){ var a=Math.PI*i/60; arc.push((Cx+Rs*Math.cos(a)).toFixed(1)+','+(Cyc-Rs*Math.sin(a)).toFixed(1)); }\n` +
    `    svg.appendChild(mk('polyline', {points:arc.join(' '), fill:'none', stroke:'var(--cyan)', 'stroke-width':1.8}));\n` +
    `    var Px=Cx+Rs*Math.cos(th), Py=Cyc-Rs*Math.sin(th);\n` +
    `    svg.appendChild(mk('circle', {cx:Px, cy:Py, r:5, fill:'var(--pink)'}));\n` +
    `    svg.appendChild(mk('text', {x:Px, y:Py-9, 'text-anchor':'middle', 'font-size':10, fill:'var(--pink)'}, '[' + x0.toFixed(2) + ':' + x1.toFixed(2) + ']'));\n` +
    `    svg.appendChild(mk('text', {x:Cx, y:18, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, '\\u2119\\u00b9 = Proj k[x\\u2080,x\\u2081]'));\n` +
    `    chartLine(U0y, 'U\\u2080: t = x\\u2081/x\\u2080', 't', isFinite(t)?t:0, !isFinite(t));\n` +
    `    chartLine(U1y, 'U\\u2081: s = x\\u2080/x\\u2081', 's', isFinite(s)?s:0, !isFinite(s));\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    lines.push('\\u2119\\u00b9 = Proj k[x\\u2080,x\\u2081] is covered by two affine lines: U\\u2080 = {x\\u2080\\u22600}, coordinate t = x\\u2081/x\\u2080, and U\\u2081 = {x\\u2081\\u22600}, coordinate s = x\\u2080/x\\u2081. On the overlap (both \\u22600) they glue by t = 1/s.');\n` +
    `    lines.push('Point [' + x0.toFixed(2) + ':' + x1.toFixed(2) + ']:  t = ' + (isFinite(t)?t.toFixed(2):'\\u221e (not in U\\u2080)') + ',  s = ' + (isFinite(s)?s.toFixed(2):'\\u221e (not in U\\u2081)') + '.');\n` +
    `    lines.push('Two points sit in only one chart: [1:0] is t=0 in U\\u2080 but missing from U\\u2081 (s=\\u221e), and [0:1] is s=0 in U\\u2081 but the \\u201cpoint at infinity\\u201d of U\\u2080 (t=\\u221e). Glue the two lines at their ends and you get the whole projective line.');\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  thIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
