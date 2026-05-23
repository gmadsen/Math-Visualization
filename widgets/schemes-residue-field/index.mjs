// schemes-residue-field widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The arithmetic is intrinsic; params carry only
// chrome. The widget evaluates an integer f = n at every point of Spec ℤ: its
// value at (p) is n mod p in κ((p)) = 𝔽_p, and at (0) it is n in κ((0)) = ℚ.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">function $f = n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="0" max="30" value="12" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nval">n = 12</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 180" width="540" height="180" role="img" aria-label="The value of an integer at each point of Spec ℤ, living in that point's residue field"><title>Residue fields: evaluating f at a point gives a value in κ(p), a different field at each point</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* schemes-residue-field widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var nIn=document.getElementById('${widgetId}-n'), nL=document.getElementById('${widgetId}-nval');\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  if(!nIn || !nL || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  var PRIMES=[2,3,5,7,11,13,17,19,23];\n` +
    `  var X0=92, X1=512, Y=70;\n` +
    `  function draw(){\n` +
    `    var n=+nIn.value; nL.textContent='n = '+n;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    svg.appendChild(mk('line', {x1:X0-44, y1:Y, x2:X1+8, y2:Y, stroke:'var(--line)'}));\n` +
    `    // generic point (0): residue field ℚ, value = n\n` +
    `    svg.appendChild(mk('circle', {cx:X0-44, cy:Y, r:4, fill:'var(--violet)'}));\n` +
    `    svg.appendChild(mk('text', {x:X0-44, y:Y-26, 'text-anchor':'middle', 'font-size':10, fill:'var(--violet)'}, '(0)'));\n` +
    `    svg.appendChild(mk('text', {x:X0-44, y:Y-13, 'text-anchor':'middle', 'font-size':9, fill:'var(--mute)'}, '\\u03ba=\\u211a'));\n` +
    `    svg.appendChild(mk('text', {x:X0-44, y:Y+20, 'text-anchor':'middle', 'font-size':10, fill:'var(--ink)'}, ''+n));\n` +
    `    // closed points (p): residue field 𝔽_p, value = n mod p\n` +
    `    var i, np=PRIMES.length; for(i=0;i<np;i++){ var p=PRIMES[i], x=X0+(X1-X0)*i/(np-1), v=n%p, zero=(v===0);\n` +
    `      svg.appendChild(mk('circle', {cx:x, cy:Y, r: zero?5.5:3.5, fill: zero?'var(--yellow)':'var(--cyan)'}));\n` +
    `      svg.appendChild(mk('text', {x:x, y:Y-26, 'text-anchor':'middle', 'font-size':10, fill:'var(--mute)'}, '('+p+')'));\n` +
    `      svg.appendChild(mk('text', {x:x, y:Y-13, 'text-anchor':'middle', 'font-size':9, fill:'var(--mute)'}, '\\u03ba=\\ud835\\udd3d_'+p));\n` +
    `      svg.appendChild(mk('text', {x:x, y:Y+20, 'text-anchor':'middle', 'font-size':10, fill: zero?'var(--yellow)':'var(--ink)'}, ''+v)); }\n` +
    `    svg.appendChild(mk('text', {x:(X0+X1)/2, y:20, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'value of f = n at each point  (\\u03ba(p) below, f(p) below that)'));\n` +
    `    // readout\n` +
    `    var zeros=PRIMES.filter(function(p){ return n%p===0; }).map(function(p){ return '('+p+')'; });\n` +
    `    var lines=[];\n` +
    `    lines.push('\\u03ba(p) = Frac(R/p): at the prime (p) it is \\ud835\\udd3d_p, at the generic point (0) it is \\u211a. Evaluating f \\u2208 R at p means reducing f into \\u03ba(p).');\n` +
    `    lines.push('f = ' + n + ': at (p) the value is n mod p (in \\ud835\\udd3d_p); at (0) the value is n itself (in \\u211a). The SAME f takes values in different fields at different points.');\n` +
    `    lines.push('f vanishes at (p) \\u21d4 n \\u2261 0 mod p \\u21d4 p | n. ' + (n===0 ? 'n = 0 vanishes everywhere.' : (n===1? 'n = 1 vanishes nowhere (a unit).' : 'Here f = ' + n + ' vanishes at ' + (zeros.length?zeros.join(', '):'none of these primes') + ' \\u2014 exactly its prime divisors, recovering V(n).')));\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  nIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
