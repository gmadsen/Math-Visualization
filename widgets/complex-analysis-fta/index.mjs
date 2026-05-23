// complex-analysis-fta widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Polynomial evaluation + winding-number count are
// intrinsic; params carry the case menu (coefficients + roots, validated
// against ./schema.json). The widget draws |z|=R in the z-plane and the image
// curve p(R e^{iθ}) in the w-plane, and reports how many times that image winds
// around 0 — which equals the number of roots enclosed.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, cases } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = cases
    .map((c, i) => `      <option value="${escapeHtml(c.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(c.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">polynomial $p(z)$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-r">radius $R$</label>\n` +
    `    <input type="range" id="${widgetId}-r" min="0.1" max="3" value="1.5" step="0.05">\n` +
    `    <span class="pill" id="${widgetId}-rval">R = 1.50</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 290" width="540" height="290" role="img" aria-label="The circle |z|=R and its image under p, with the winding number around 0"><title>Fundamental theorem of algebra: the image of |z|=R winds around 0 once per enclosed root</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, cases } = params;
  const data = JSON.stringify(cases);
  return (
    `<script>\n` +
    `/* complex-analysis-fta widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var CASES = ${data};\n` +
    `  var byId = {}; CASES.forEach(function(c){ byId[c.id] = c; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var rIn = document.getElementById('${widgetId}-r'), rL = document.getElementById('${widgetId}-rval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !rIn || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function peval(a, z){ var r=[0,0], k; for(k=a.length-1;k>=0;k--){ r=cmul(r,z); r=[r[0]+a[k], r[1]]; } return r; }\n` +
    `  var LCX=120, LCY=148, LSC=36;   // z-plane panel\n` +
    `  var WCX=405, WCY=148, WR=92;    // w-plane panel (image), autoscaled\n` +
    `  function draw(){\n` +
    `    var c = byId[sel.value] || CASES[0], R = +rIn.value, n = c.coeffs.length-1;\n` +
    `    rL.textContent = 'R = ' + R.toFixed(2);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // ----- left: z-plane -----\n` +
    `    svg.appendChild(mk('line', {x1:LCX-118, y1:LCY, x2:LCX+118, y2:LCY, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:LCX, y1:LCY-118, x2:LCX, y2:LCY+118, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('circle', {cx:LCX, cy:LCY, r:R*LSC, fill:'none', stroke:'var(--cyan)', 'stroke-width':1.6, 'stroke-dasharray':'5 3'}));\n` +
    `    var inside = 0;\n` +
    `    c.roots.forEach(function(rt){ var d=Math.hypot(rt.re, rt.im), inq = d < R-1e-6; if(inq) inside++;\n` +
    `      svg.appendChild(mk('circle', {cx:LCX+rt.re*LSC, cy:LCY-rt.im*LSC, r:4.5, fill: inq?'var(--yellow)':'var(--panel)', stroke:'var(--yellow)', 'stroke-width':1.4})); });\n` +
    `    svg.appendChild(mk('text', {x:LCX, y:24, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'z-plane:  circle |z| = R'));\n` +
    `    // ----- right: image curve p(R e^{i th}) -----\n` +
    `    var M=240, ws=[], maxMod=1e-9, minMod=Infinity, i, th, z, w, total=0, prev=null;\n` +
    `    for(i=0;i<=M;i++){ th=2*Math.PI*i/M; z=[R*Math.cos(th), R*Math.sin(th)]; w=peval(c.coeffs, z); ws.push(w);\n` +
    `      var m=Math.hypot(w[0],w[1]); if(m>maxMod) maxMod=m; if(m<minMod) minMod=m;\n` +
    `      var ang=Math.atan2(w[1], w[0]); if(prev!==null){ var d=ang-prev; while(d>Math.PI)d-=2*Math.PI; while(d<=-Math.PI)d+=2*Math.PI; total+=d; } prev=ang; }\n` +
    `    var winding = Math.round(total/(2*Math.PI));\n` +
    `    var sc = WR/maxMod;\n` +
    `    svg.appendChild(mk('line', {x1:WCX-100, y1:WCY, x2:WCX+100, y2:WCY, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:WCX, y1:WCY-100, x2:WCX, y2:WCY+100, stroke:'var(--line)'}));\n` +
    `    var pts = ws.map(function(w){ return (WCX+w[0]*sc).toFixed(1)+','+(WCY-w[1]*sc).toFixed(1); });\n` +
    `    svg.appendChild(mk('polyline', {points:pts.join(' '), fill:'none', stroke:'var(--violet)', 'stroke-width':1.8}));\n` +
    `    // mark image of theta=0 (start point on the curve)\n` +
    `    svg.appendChild(mk('circle', {cx:WCX+ws[0][0]*sc, cy:WCY-ws[0][1]*sc, r:3, fill:'var(--violet)'}));\n` +
    `    // the winding target w = 0\n` +
    `    svg.appendChild(mk('circle', {cx:WCX, cy:WCY, r:3.5, fill:'var(--pink)'}));\n` +
    `    svg.appendChild(mk('text', {x:WCX+7, y:WCY+13, 'font-size':9, fill:'var(--pink)'}, 'w = 0'));\n` +
    `    svg.appendChild(mk('text', {x:WCX, y:24, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'image  w = p(z)'));\n` +
    `    svg.appendChild(mk('text', {x:WCX, y:280, 'text-anchor':'middle', 'font-size':12, fill:'var(--violet)'}, 'winding number = ' + winding));\n` +
    `    // ----- readout -----\n` +
    `    var onCircle = minMod < 0.04*maxMod;\n` +
    `    var lines = [];\n` +
    `    lines.push('p(z) = ' + c.label + ',   deg p = ' + n + '.');\n` +
    `    lines.push('On |z| = R = ' + R.toFixed(2) + ':  ' + inside + ' of ' + n + ' root(s) lie inside.');\n` +
    `    if(onCircle){ lines.push('The image passes through 0 \\u2014 a root sits on |z| = R (winding undefined here; nudge R).'); }\n` +
    `    else { lines.push('The image of the circle winds ' + winding + ' time(s) around 0 \\u2014 exactly the number of enclosed roots.'); }\n` +
    `    if(c.note) lines.push(c.note);\n` +
    `    lines.push('Shrink R \\u2192 0: winding \\u2192 0.  Grow R past every root: winding \\u2192 ' + n + '.  The count can only change when the image crosses 0, so p must vanish somewhere \\u2014 the fundamental theorem of algebra.');\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); rIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
