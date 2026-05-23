// complex-analysis-argument-principle widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Polynomial evaluation + winding count are intrinsic;
// params carry the root data (validated against ./schema.json).

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
    `    <label for="${widgetId}-sel">p(z)</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-r">radius $R$</label>\n` +
    `    <input type="range" id="${widgetId}-r" min="0.3" max="2.5" value="1.2" step="0.01">\n` +
    `    <span class="pill" id="${widgetId}-rval">R = 1.20</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 280" width="540" height="280" role="img" aria-label="A circle |z|=R and the winding of its polynomial image about 0"><title>Argument principle: the image of |z|=R winds around 0 once per enclosed zero</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* complex-analysis-argument-principle widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var byId = {}; FNS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var rIn = document.getElementById('${widgetId}-r'), rL = document.getElementById('${widgetId}-rval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !rIn || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function evalP(roots, z){ var w=[1,0]; for(var i=0;i<roots.length;i++){ var m=roots[i].mult||1; var f=[z[0]-roots[i].re, z[1]-roots[i].im]; for(var j=0;j<m;j++) w=cmul(w,f); } return w; }\n` +
    `  var LR = 80, LCX = 130, RCX = 400, CY = 150; // left: z-plane (fixed scale), right: w-plane (auto)\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0], R = +rIn.value;\n` +
    `    rL.textContent = 'R = ' + R.toFixed(2);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    svg.appendChild(mk('text', {x:LCX, y:22, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'z-plane: |z| = R + roots'));\n` +
    `    svg.appendChild(mk('text', {x:RCX, y:22, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'w-plane: image p(|z|=R)'));\n` +
    `    // left: fixed scale so roots up to ~2.6 fit\n` +
    `    var sL = LR/2.6;\n` +
    `    function LX(re){ return LCX + re*sL; } function LY(im){ return CY - im*sL; }\n` +
    `    svg.appendChild(mk('line', {x1:LCX-LR, y1:CY, x2:LCX+LR, y2:CY, stroke:'var(--line)', 'stroke-width':0.6}));\n` +
    `    svg.appendChild(mk('line', {x1:LCX, y1:CY-LR, x2:LCX, y2:CY+LR, stroke:'var(--line)', 'stroke-width':0.6}));\n` +
    `    svg.appendChild(mk('circle', {cx:LCX, cy:CY, r:R*sL, fill:'none', stroke:'var(--violet)', 'stroke-width':1.4}));\n` +
    `    var inside = 0;\n` +
    `    g.roots.forEach(function(rt){ var m=rt.mult||1, inq=(rt.re*rt.re+rt.im*rt.im) < R*R; if(inq) inside+=m; var col=inq?'var(--yellow)':'var(--mute)'; svg.appendChild(mk('text', {x:LX(rt.re), y:LY(rt.im)+4, 'text-anchor':'middle', 'font-size':14, fill:col}, '\\u00d7')); if(m>1) svg.appendChild(mk('text', {x:LX(rt.re)+9, y:LY(rt.im)-5, 'font-size':9, fill:col}, '\\u00d7'+m)); });\n` +
    `    // right: image p(|z|=R), auto-scaled\n` +
    `    var N=240, img=[], wmax=0;\n` +
    `    for(var i=0;i<=N;i++){ var t=2*Math.PI*i/N, z=[R*Math.cos(t), R*Math.sin(t)], w=evalP(g.roots, z); img.push(w); var a=Math.hypot(w[0],w[1]); if(a>wmax) wmax=a; }\n` +
    `    var sR = wmax>0 ? 92/wmax : 1;\n` +
    `    function RX(re){ return RCX + re*sR; } function RY(im){ return CY - im*sR; }\n` +
    `    svg.appendChild(mk('line', {x1:RCX-100, y1:CY, x2:RCX+100, y2:CY, stroke:'var(--line)', 'stroke-width':0.6}));\n` +
    `    svg.appendChild(mk('line', {x1:RCX, y1:CY-100, x2:RCX, y2:CY+100, stroke:'var(--line)', 'stroke-width':0.6}));\n` +
    `    var pts = img.map(function(w){ return RX(w[0]).toFixed(1)+','+RY(w[1]).toFixed(1); });\n` +
    `    svg.appendChild(mk('polyline', {points:pts.join(' '), fill:'none', stroke:'var(--cyan)', 'stroke-width':1.4}));\n` +
    `    svg.appendChild(mk('circle', {cx:RCX, cy:CY, r:3.5, fill:'var(--pink)'}));\n` +
    `    svg.appendChild(mk('text', {x:RCX+7, y:CY-5, 'font-size':10, fill:'var(--pink)'}, '0'));\n` +
    `    var lines = [];\n` +
    `    lines.push('roots inside |z| = ' + R.toFixed(2) + ' (counting multiplicity):  ' + inside);\n` +
    `    lines.push('the image curve p(|z|=R) winds around 0 exactly ' + inside + ' time' + (inside===1?'':'s') + ' \\u2014 the argument principle: winding = (zeros \\u2212 poles) enclosed.');\n` +
    `    lines.push('Slide R past a root\\u2019s modulus and the winding jumps by its multiplicity. Rouché compares two such windings.');\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); rIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
