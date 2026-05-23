// schemes-spec widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The prime arithmetic is intrinsic; params carry only
// chrome. The widget draws Spec ℤ — closed points (p) plus the generic point (0)
// — and highlights the Zariski-closed set V(n) for a slider-chosen integer n.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">closed set $V(n)$, $n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="1" max="60" value="12" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nval">n = 12</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 200" width="540" height="200" role="img" aria-label="Spec of the integers: the prime points and the generic point, with V(n) highlighted"><title>Spec ℤ: prime ideals as points, V(n) as a Zariski-closed set, and the dense generic point (0)</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* schemes-spec widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var nIn=document.getElementById('${widgetId}-n'), nL=document.getElementById('${widgetId}-nval');\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  if(!nIn || !nL || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  var PRIMES=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59];\n` +
    `  function factor(n){ var f=[], p, m=n; for(var i=0;i<PRIMES.length && m>1;i++){ p=PRIMES[i]; if(m%p===0){ var e=0; while(m%p===0){ m/=p; e++; } f.push([p,e]); } } if(m>1) f.push([m,1]); return f; }\n` +
    `  var X0=78, X1=512, Y=104;\n` +
    `  function draw(){\n` +
    `    var n=+nIn.value; nL.textContent='n = '+n;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var fac=factor(n), divs={}; fac.forEach(function(pe){ divs[pe[0]]=true; });\n` +
    `    // the line of closed points\n` +
    `    svg.appendChild(mk('line', {x1:X0-26, y1:Y, x2:X1+8, y2:Y, stroke:'var(--line)'}));\n` +
    `    // generic point (0), drawn as a diffuse mark at the far left\n` +
    `    svg.appendChild(mk('circle', {cx:X0-26, cy:Y, r:8, fill:'none', stroke:'var(--violet)', 'stroke-width':1.4, 'stroke-dasharray':'2 2'}));\n` +
    `    svg.appendChild(mk('circle', {cx:X0-26, cy:Y, r:2.5, fill:'var(--violet)'}));\n` +
    `    svg.appendChild(mk('text', {x:X0-26, y:Y+26, 'text-anchor':'middle', 'font-size':10, fill:'var(--violet)'}, 'η=(0)'));\n` +
    `    svg.appendChild(mk('text', {x:X0-26, y:Y-16, 'text-anchor':'middle', 'font-size':8.5, fill:'var(--mute)'}, 'generic'));\n` +
    `    // closed points (p)\n` +
    `    var i, np=PRIMES.length; for(i=0;i<np;i++){ var p=PRIMES[i], x=X0+(X1-X0)*i/(np-1), inV=!!divs[p];\n` +
    `      svg.appendChild(mk('circle', {cx:x, cy:Y, r: inV?5.5:3.5, fill: inV?'var(--yellow)':'var(--cyan)'}));\n` +
    `      svg.appendChild(mk('text', {x:x, y:Y+22, 'text-anchor':'middle', 'font-size':10, fill: inV?'var(--yellow)':'var(--mute)'}, '('+p+')')); }\n` +
    `    svg.appendChild(mk('text', {x:(X0+X1)/2, y:24, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'Spec \\u2124  \\u2014  closed points (p), highlighted = V(n)'));\n` +
    `    // readout\n` +
    `    var facStr = n===1 ? '1 (a unit)' : fac.map(function(pe){ return pe[1]>1? pe[0]+'^'+pe[1] : ''+pe[0]; }).join(' \\u00b7 ');\n` +
    `    var primeList = Object.keys(divs).map(function(p){ return '('+p+')'; }).join(', ');\n` +
    `    var lines=[];\n` +
    `    lines.push('Spec \\u2124 = { (0) } \\u222a { (p) : p prime }. The integer f acts as a \\u201cfunction\\u201d; its value at (p) is f mod p.');\n` +
    `    lines.push('n = ' + facStr + '.   V(n) = { primes p with n \\u2208 (p) } = { p : p | n } = ' + (primeList || '\\u2205 (n is a unit \\u2014 the empty closed set)') + '.');\n` +
    `    lines.push('Every PROPER closed set is such a finite set of CLOSED points (the only non-proper one is V(0) = all of Spec \\u2124). The generic point (0) is in no V(n) (n\\u22651): its closure is all of Spec \\u2124, so it lies in every nonempty OPEN set \\u2014 that is what \\u201cgeneric\\u201d means.');\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  nIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
