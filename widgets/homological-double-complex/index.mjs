// homological-double-complex widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The grid geometry is intrinsic; params carry the grid
// size and chrome. The widget highlights the anti-diagonal p+q=n whose direct sum
// is the total complex Tot^n.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const N = (params.size || 4);
  const maxN = 2 * (N - 1);
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">total degree $n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="0" max="${maxN}" value="2" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nval">n = 2</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 290" width="540" height="290" role="img" aria-label="A double complex grid with the total-complex diagonal highlighted"><title>Double complex: the total complex Tot^n is the direct sum along the diagonal p+q=n</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  const N = (params.size || 4);
  return (
    `<script>\n` +
    `/* homological-double-complex widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var N = ${N};\n` +
    `  var nIn=document.getElementById('${widgetId}-n'), nL=document.getElementById('${widgetId}-nval');\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  if(!nIn || !nL || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function arrow(x1,y1,x2,y2,col,on){ var ang=Math.atan2(y2-y1,x2-x1), L=Math.hypot(x2-x1,y2-y1), ux=(x2-x1)/L, uy=(y2-y1)/L; var ex=x2-ux*8, ey=y2-uy*8;\n` +
    `    svg.appendChild(mk('line', {x1:x1+ux*16, y1:y1+uy*16, x2:ex, y2:ey, stroke:col, 'stroke-width':on?2:1.2, opacity:on?1:0.5}));\n` +
    `    svg.appendChild(mk('path', {d:'M'+ex+' '+ey+' L'+(ex-7*ux+3*uy)+' '+(ey-7*uy-3*ux)+' L'+(ex-7*ux-3*uy)+' '+(ey-7*uy+3*ux)+' Z', fill:col, opacity:on?1:0.5})); }\n` +
    `  var X0=110, Y0=240, dx=(N>4?86:104), dy=(N>4?52:62);\n` +
    `  function PX(p){ return X0 + p*dx; } function PY(q){ return Y0 - q*dy; }\n` +
    `  function draw(){\n` +
    `    var n=+nIn.value; nL.textContent='n = '+n;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var p,q;\n` +
    `    // arrows: d^h (→ p+1) and d^v (→ q+1, drawn upward)\n` +
    `    for(p=0;p<N;p++) for(q=0;q<N;q++){\n` +
    `      if(p+1<N) arrow(PX(p),PY(q),PX(p+1),PY(q),'var(--mute)', (p+q===n)&&(p+1+q===n+1));\n` +
    `      if(q+1<N) arrow(PX(p),PY(q),PX(p),PY(q+1),'var(--mute)', false); }\n` +
    `    // nodes\n` +
    `    for(p=0;p<N;p++) for(q=0;q<N;q++){ var on=(p+q===n);\n` +
    `      svg.appendChild(mk('circle', {cx:PX(p), cy:PY(q), r:on?15:12, fill: on?'color-mix(in srgb, var(--yellow) 30%, transparent)':'var(--panel2)', stroke: on?'var(--yellow)':'var(--line)', 'stroke-width':on?2:1}));\n` +
    `      svg.appendChild(mk('text', {x:PX(p), y:PY(q)+4, 'text-anchor':'middle', 'font-size':10, fill: on?'var(--yellow)':'var(--mute)'}, p+','+q)); }\n` +
    `    // axis labels\n` +
    `    svg.appendChild(mk('text', {x:PX(N-1)+24, y:PY(0)+4, 'font-size':10, fill:'var(--mute)'}, 'p \\u2192  (d^h)'));\n` +
    `    svg.appendChild(mk('text', {x:PX(0)-4, y:PY(N-1)-16, 'text-anchor':'middle', 'font-size':10, fill:'var(--mute)'}, 'q \\u2191 (d^v)'));\n` +
    `    // readout\n` +
    `    var summands=[]; for(q=0;q<N;q++){ p=n-q; if(p>=0 && p<N) summands.push('C^{'+p+','+q+'}'); }\n` +
    `    var lines=[];\n` +
    `    lines.push('A double complex C^{p,q} has two anticommuting differentials: d^h: C^{p,q}\\u2192C^{p+1,q} and d^v: C^{p,q}\\u2192C^{p,q+1}, with d^h\\u00b2 = d^v\\u00b2 = 0 and d^h d^v + d^v d^h = 0.');\n` +
    `    lines.push('The TOTAL complex collects each anti-diagonal: Tot^n = \\u2295_{p+q=n} C^{p,q}. Here Tot^' + n + ' = ' + (summands.join(' \\u2295 ') || '0') + ' (highlighted).');\n` +
    `    lines.push('Its total differential D = d^h + (\\u22121)^p d^v maps Tot^n \\u2192 Tot^{n+1}; the sign + anticommutativity give D\\u00b2 = 0, so Tot is a single complex (the engine behind Tor symmetry and spectral sequences).');\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  nIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
