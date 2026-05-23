// complex-analysis-monodromy widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The analytic continuation along the loop is
// intrinsic; params carry the menu + monodromy text (validated against
// ./schema.json).

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
    `    <label for="${widgetId}-sel">f(z)</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-ang">angle swept</label>\n` +
    `    <input type="range" id="${widgetId}-ang" min="0" max="12.566" value="3.6" step="0.05">\n` +
    `    <span class="pill" id="${widgetId}-angval">0.57 loops</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 270" width="540" height="270" role="img" aria-label="A loop around the branch point and the continued value"><title>Monodromy: continuing a multivalued function around the branch point 0</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* complex-analysis-monodromy widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var byId = {}; FNS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var ang = document.getElementById('${widgetId}-ang'), angL = document.getElementById('${widgetId}-angval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !ang || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  var Rz = 1.2; // loop radius around the branch point\n` +
    `  // continued value at swept angle phi (NOT reduced mod 2pi — that is the whole point)\n` +
    `  function fval(kind, phi){\n` +
    `    if(kind==='sqrt'){ var m=Math.sqrt(Rz); return [m*Math.cos(phi/2), m*Math.sin(phi/2)]; }\n` +
    `    if(kind==='cbrt'){ var m=Math.pow(Rz,1/3); return [m*Math.cos(phi/3), m*Math.sin(phi/3)]; }\n` +
    `    if(kind==='log'){ return [Math.log(Rz), phi]; }\n` +
    `    return [Math.cos(phi), Math.sin(phi)];\n` +
    `  }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0], TH = +ang.value;\n` +
    `    angL.textContent = (TH/(2*Math.PI)).toFixed(2) + ' loops';\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // left panel: z-plane loop around 0\n` +
    `    var LCX=130, CY=140, sL=70;\n` +
    `    function LX(x){ return LCX + x*sL; } function LY(y){ return CY - y*sL; }\n` +
    `    svg.appendChild(mk('text', {x:LCX, y:22, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'z-plane: loop around 0'));\n` +
    `    svg.appendChild(mk('text', {x:410, y:22, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'w = f(z), continued'));\n` +
    `    svg.appendChild(mk('line', {x1:LCX-90, y1:CY, x2:LCX+90, y2:CY, stroke:'var(--line)', 'stroke-width':0.6}));\n` +
    `    svg.appendChild(mk('line', {x1:LCX-90, y1:CY, x2:LCX, y2:CY, stroke:'var(--pink)', 'stroke-width':1.4, 'stroke-dasharray':'3 3'}));\n` +
    `    svg.appendChild(mk('circle', {cx:LCX, cy:CY, r:Rz*sL, fill:'none', stroke:'var(--line)', 'stroke-width':0.8}));\n` +
    `    svg.appendChild(mk('circle', {cx:LCX, cy:CY, r:3, fill:'var(--pink)'}));\n` +
    `    svg.appendChild(mk('text', {x:LCX+5, y:CY+14, 'font-size':10, fill:'var(--pink)'}, '0 (branch pt)'));\n` +
    `    // swept arc 0..TH (mod 2pi visually but show the wrap)\n` +
    `    var arc=[]; var steps=Math.max(2, Math.round(TH/0.1)); for(var i=0;i<=steps;i++){ var ph=TH*i/steps; arc.push(LX(Rz*Math.cos(ph))+','+LY(Rz*Math.sin(ph))); }\n` +
    `    svg.appendChild(mk('polyline', {points:arc.join(' '), fill:'none', stroke:'var(--yellow)', 'stroke-width':1.6}));\n` +
    `    var zc=[Rz*Math.cos(TH), Rz*Math.sin(TH)]; svg.appendChild(mk('circle', {cx:LX(zc[0]), cy:LY(zc[1]), r:4, fill:'var(--yellow)'}));\n` +
    `    // right panel: continued value path + current value\n` +
    `    var RCX=410;\n` +
    `    var path=[], wmax=0; for(var j=0;j<=steps;j++){ var ph2=TH*j/steps, w=fval(g.kind, ph2); path.push(w); var a=Math.hypot(w[0],w[1]); if(a>wmax) wmax=a; }\n` +
    `    var sR = wmax>0 ? 95/wmax : 1;\n` +
    `    function RX(x){ return RCX + x*sR; } function RY(y){ return CY - y*sR; }\n` +
    `    svg.appendChild(mk('line', {x1:RCX-100, y1:CY, x2:RCX+100, y2:CY, stroke:'var(--line)', 'stroke-width':0.6}));\n` +
    `    svg.appendChild(mk('line', {x1:RCX, y1:CY-110, x2:RCX, y2:CY+110, stroke:'var(--line)', 'stroke-width':0.6}));\n` +
    `    var start=fval(g.kind, 0); svg.appendChild(mk('circle', {cx:RX(start[0]), cy:RY(start[1]), r:3.5, fill:'var(--mute)'}));\n` +
    `    svg.appendChild(mk('text', {x:RX(start[0])+6, y:RY(start[1])+12, 'font-size':9, fill:'var(--mute)'}, 'f(start)'));\n` +
    `    svg.appendChild(mk('polyline', {points:path.map(function(w){ return RX(w[0]).toFixed(1)+','+RY(w[1]).toFixed(1); }).join(' '), fill:'none', stroke:'var(--cyan)', 'stroke-width':1.6}));\n` +
    `    var wc=fval(g.kind, TH); svg.appendChild(mk('circle', {cx:RX(wc[0]), cy:RY(wc[1]), r:4.5, fill:'var(--yellow)'}));\n` +
    `    var loops = TH/(2*Math.PI);\n` +
    `    var lines = [];\n` +
    `    lines.push('swept angle = ' + TH.toFixed(2) + ' rad = ' + loops.toFixed(2) + ' full loops around 0.');\n` +
    `    lines.push('f(start) = ' + start[0].toFixed(2) + ' + ' + start[1].toFixed(2) + 'i      f(now) = ' + wc[0].toFixed(2) + ' + ' + wc[1].toFixed(2) + 'i');\n` +
    `    lines.push(g.monodromy);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); ang.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
