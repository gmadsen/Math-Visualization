// homological-tor-symmetry widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The gcd arithmetic is intrinsic; params carry only
// chrome. The widget computes Tor₁ᶻ(ℤ/m, ℤ/n) by resolving each argument and
// shows both give ℤ/gcd(m,n).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-m">$m$</label>\n` +
    `    <input type="range" id="${widgetId}-m" min="2" max="12" value="6" step="1">\n` +
    `    <label for="${widgetId}-n">$n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="2" max="12" value="4" step="1">\n` +
    `    <span class="pill" id="${widgetId}-mn">m=6, n=4</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 230" width="540" height="230" role="img" aria-label="Tor computed two ways, both giving the same group"><title>Symmetry of Tor: resolving either argument gives the same Tor group</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* homological-tor-symmetry widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var mIn=document.getElementById('${widgetId}-m'), nIn=document.getElementById('${widgetId}-n'), mnL=document.getElementById('${widgetId}-mn');\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  if(!mIn || !nIn || !mnL || !svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function gcd(a,b){ while(b){ var t=a%b; a=b; b=t; } return a; }\n` +
    `  function grp(g){ return g===1 ? '\\u2124/1 = 0' : '\\u2124/'+g; }\n` +
    `  function col(x, head, lines, gstr){\n` +
    `    svg.appendChild(mk('text', {x:x, y:46, 'text-anchor':'middle', 'font-size':11, fill:'var(--cyan)', 'font-weight':600}, head));\n` +
    `    lines.forEach(function(L,i){ svg.appendChild(mk('text', {x:x, y:72+i*22, 'text-anchor':'middle', 'font-size':11, fill:'var(--ink)'}, L)); });\n` +
    `    svg.appendChild(mk('text', {x:x, y:72+lines.length*22+6, 'text-anchor':'middle', 'font-size':13, fill:'var(--yellow)'}, 'Tor\\u2081 = ' + gstr)); }\n` +
    `  function draw(){\n` +
    `    var m=+mIn.value, n=+nIn.value, g=gcd(m,n); mnL.textContent='m='+m+', n='+n;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    svg.appendChild(mk('text', {x:270, y:22, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'two routes to Tor\\u2081\\u1d3f(\\u2124/'+m+', \\u2124/'+n+')'));\n` +
    `    col(140, 'resolve \\u2124/'+m, ['0 \\u2192 \\u2124 \\u2192\\u00d7'+m+'\\u2192 \\u2124 \\u2192 \\u2124/'+m+' \\u2192 0', '\\u2297 \\u2124/'+n+':   \\u2124/'+n+' \\u2192\\u00d7'+m+'\\u2192 \\u2124/'+n, 'Tor\\u2081 = ker(\\u00d7'+m+' on \\u2124/'+n+')'], grp(g));\n` +
    `    col(400, 'resolve \\u2124/'+n, ['0 \\u2192 \\u2124 \\u2192\\u00d7'+n+'\\u2192 \\u2124 \\u2192 \\u2124/'+n+' \\u2192 0', '\\u2297 \\u2124/'+m+':   \\u2124/'+m+' \\u2192\\u00d7'+n+'\\u2192 \\u2124/'+m, 'Tor\\u2081 = ker(\\u00d7'+n+' on \\u2124/'+m+')'], grp(g));\n` +
    `    // the ≅ between them\n` +
    `    svg.appendChild(mk('text', {x:270, y:150, 'text-anchor':'middle', 'font-size':22, fill:'var(--pink)'}, '\\u2245'));\n` +
    `    svg.appendChild(mk('text', {x:270, y:200, 'text-anchor':'middle', 'font-size':12, fill:'var(--green)'}, 'both = ' + grp(g) + '   (gcd(' + m + ',' + n + ') = ' + g + ')'));\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    lines.push('Tor\\u2081\\u1d3f(\\u2124/' + m + ', \\u2124/' + n + ') = ker(\\u00d7' + m + ' : \\u2124/' + n + ' \\u2192 \\u2124/' + n + ') = { x : ' + m + 'x \\u2261 0 mod ' + n + ' } = \\u2124/gcd(' + m + ',' + n + ') = ' + grp(g) + '.');\n` +
    `    lines.push('Resolving the OTHER factor gives ker(\\u00d7' + n + ' on \\u2124/' + m + ') = ' + grp(g) + ' \\u2014 the SAME group. That is the symmetry of Tor: Tor\\u2099(M,N) \\u2245 Tor\\u2099(N,M).');\n` +
    `    lines.push('The clean proof resolves BOTH at once: form the double complex P\\u2022 \\u2297 Q\\u2022 and take its total homology \\u2014 the two routes are its two filtrations.');\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  mIn.addEventListener('input', draw); nIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
