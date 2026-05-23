// functional-analysis-bounded-continuous widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The norm ratios ‖T x_n‖/‖x_n‖ are computed in closed
// form (a `kind` enum) for the test family x_n = sin(nx) on L²[0,π]; params carry
// the case menu. The widget contrasts bounded (capped ratio = continuous) with the
// unbounded derivative (ratio grows like n = discontinuous).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, operators } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = operators
    .map((g, i) => `      <option value="${escapeHtml(g.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(g.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">operator $T$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-n">test $x_n=\\sin(nx)$, $n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="1" max="20" value="6" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nval">n = 6</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 250" width="540" height="250" role="img" aria-label="The amplification ratio ‖Tx_n‖/‖x_n‖ plotted against n"><title>Bounded vs continuous: a linear operator is continuous iff the amplification ratio is bounded</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, operators } = params;
  const data = JSON.stringify(operators);
  return (
    `<script>\n` +
    `/* functional-analysis-bounded-continuous widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var OPS = ${data};\n` +
    `  var byId = {}; OPS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var nIn = document.getElementById('${widgetId}-n'), nL = document.getElementById('${widgetId}-nval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg'), out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !nIn || !nL || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  // ‖T x_n‖/‖x_n‖ for x_n = sin(nx) on L²[0,π], in closed form\n` +
    `  function ratio(kind, n){\n` +
    `    if(kind==='mult') return 2;                    // T = 2I\n` +
    `    if(kind==='volterra') return Math.sqrt(3)/n;   // V f = ∫₀ˣ f\n` +
    `    return n;                                       // D = d/dx\n` +
    `  }\n` +
    `  var NMAX=20, PX0=58, PW=452, PY0=210, PH=176;\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || OPS[0], n = +nIn.value;\n` +
    `    nL.textContent = 'n = ' + n;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var unbounded = (g.kind==='deriv');\n` +
    `    var maxR=0, k; for(k=1;k<=NMAX;k++){ var rr=ratio(g.kind,k); if(rr>maxR) maxR=rr; }\n` +
    `    var yHi = Math.max(maxR*1.12, 0.5);\n` +
    `    function PX(nn){ return PX0 + (nn-1)/(NMAX-1)*PW; }\n` +
    `    function PY(v){ return PY0 - Math.min(v,yHi)/yHi*PH; }\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY0, x2:PX0+PW, y2:PY0, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:PX0, y1:PY0, x2:PX0, y2:PY0-PH, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX0+PW, y:PY0+16, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, 'n \\u2192 ' + NMAX));\n` +
    `    svg.appendChild(mk('text', {x:PX0-6, y:PY0-PH+8, 'text-anchor':'end', 'font-size':10, fill:'var(--mute)'}, '‖T x_n‖/‖x_n‖'));\n` +
    `    // bound line for bounded operators\n` +
    `    if(!unbounded){ var cap=ratio(g.kind,1); svg.appendChild(mk('line', {x1:PX0, y1:PY(cap), x2:PX0+PW, y2:PY(cap), stroke:'var(--pink)', 'stroke-width':1.3, 'stroke-dasharray':'4 3'}));\n` +
    `      svg.appendChild(mk('text', {x:PX0+PW, y:PY(cap)-4, 'text-anchor':'end', 'font-size':10, fill:'var(--pink)'}, 'bound: sup ratio = ' + cap.toFixed(2))); }\n` +
    `    // ratio points + line\n` +
    `    var pts=[]; for(k=1;k<=NMAX;k++){ pts.push(PX(k).toFixed(1)+','+PY(ratio(g.kind,k)).toFixed(1)); }\n` +
    `    svg.appendChild(mk('polyline', {points:pts.join(' '), fill:'none', stroke:'var(--cyan)', 'stroke-width':2}));\n` +
    `    var rn=ratio(g.kind,n);\n` +
    `    svg.appendChild(mk('circle', {cx:PX(n), cy:PY(rn), r:4.5, fill:'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('text', {x:PX(n), y:PY0+16, 'text-anchor':'middle', 'font-size':10, fill:'var(--yellow)'}, 'n=' + n));\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    lines.push('A linear T is BOUNDED \\u21d4 CONTINUOUS \\u21d4 \\u2203 M with ‖Tx‖ \\u2264 M‖x‖ for all x. The plotted amplification ‖T x_n‖/‖x_n‖ tests this on x_n = sin(nx).');\n` +
    `    if(g.kind==='mult'){ lines.push('T = 2·Id: the ratio is exactly 2 for every n \\u2014 bounded (‖T‖ = 2), so continuous.'); }\n` +
    `    else if(g.kind==='volterra'){ lines.push('The Volterra integral V f = \\u222b\\u2080\\u02e3 f: the ratio = \\u221a3/n \\u2192 0 \\u2014 bounded (in fact compact), so continuous.'); }\n` +
    `    else { lines.push('The derivative D = d/dx: the ratio = n \\u2192 \\u221e, with NO bound. D is UNBOUNDED, hence DISCONTINUOUS \\u2014 sin(nx)/n \\u2192 0 uniformly while its derivative cos(nx) does not. (Only possible in infinite dimensions; every operator on a finite-dim space is bounded.)'); }\n` +
    `    lines.push('At n = ' + n + ':  ‖T x_n‖/‖x_n‖ = ' + rn.toFixed(3) + '.');\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); nIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
