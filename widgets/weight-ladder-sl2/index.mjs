// weight-ladder-sl2 widget — shared registry renderer for the "ladder-op" gesture:
// the irreducible sl_2 representation V_n. Set the highest weight n (dim n+1) and
// apply the raising operator e / lowering operator f to walk a basis vector up and
// down the weight ladder n, n-2, ..., -n, with the integer action coefficients and
// the kill-at-the-ends behaviour shown.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Concept-specific (the V_n family); no author bodyScript. jsdom-safe.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 460 420';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 460;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 420;
  const svgTitle = params.svgTitle || title;
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-raise" type="button">raise: e·v</button>\n` +
    `    <button id="${widgetId}-lower" type="button">lower: f·v</button>\n` +
    `    <button id="${widgetId}-top" type="button">↥ highest weight</button>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label>dim V_n:</label>\n` +
    `    <button id="${widgetId}-ndn" type="button">−</button>\n` +
    `    <button id="${widgetId}-nup" type="button">+</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId, nInit = 4, nMax = 7 } = params;
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const NMAX=${nMax};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 460 420').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3], cx=W*0.46, yTop=46, yBot=Hh-54;\n` +
    `  var n=${nInit}, k=0;   // V_n, current basis vector v_k (k=0 highest weight)\n` +
    `  function mu(kk){ return n-2*kk; }                 // weight of v_k\n` +
    `  function eCoef(kk){ return kk===0 ? 0 : (n-kk+1); } // e.v_k = (n-k+1) v_{k-1}\n` +
    `  function fCoef(kk){ return kk===n ? 0 : (kk+1); }   // f.v_k = (k+1) v_{k+1}\n` +
    `  function yOf(kk){ return n===0 ? (yTop+yBot)/2 : yTop + kk/n*(yBot-yTop); }\n` +
    `  function sgn(m){ return (m>0?'+':(m<0?'\\u2212':''))+Math.abs(m); }\n` +
    `  function render(){\n` +
    `    while(G.firstChild)G.removeChild(G.firstChild);\n` +
    `    // axis label\n` +
    `    var hl=SVG('text',{x:cx,y:24,'font-size':12,fill:'var(--mute)','text-anchor':'middle'}); hl.textContent='weights of V'+(''+n).replace(/[0-9]/g,function(d){return '\\u2080\\u2081\\u2082\\u2083\\u2084\\u2085\\u2086\\u2087\\u2088\\u2089'[+d];})+'  (dim '+(n+1)+')'; G.appendChild(hl);\n` +
    `    // ladder rungs\n` +
    `    for(var i=0;i<=n;i++){ var y=yOf(i), cur=(i===k);\n` +
    `      G.appendChild(SVG('line',{x1:cx-60,y1:y,x2:cx+60,y2:y,stroke:cur?'var(--cyan)':'var(--line)','stroke-width':cur?2:1}));\n` +
    `      G.appendChild(SVG('circle',{cx:cx,cy:y,r:cur?8:5,fill:cur?'var(--cyan)':'var(--panel)',stroke:cur?'var(--ink)':'var(--mute)','stroke-width':cur?1.5:1.2}));\n` +
    `      var wl=SVG('text',{x:cx-72,y:y+4,'font-size':12,fill:cur?'var(--cyan)':'var(--mute)','text-anchor':'end'}); wl.textContent='\\u03bc = '+sgn(mu(i)); G.appendChild(wl);\n` +
    `      var vl=SVG('text',{x:cx+72,y:y+4,'font-size':12,fill:cur?'var(--ink)':'var(--mute)'}); vl.textContent='v'+(''+i).replace(/[0-9]/g,function(d){return '\\u2080\\u2081\\u2082\\u2083\\u2084\\u2085\\u2086\\u2087\\u2088\\u2089'[+d];}); G.appendChild(vl);\n` +
    `    }\n` +
    `    // e (up) and f (down) action arrows from the current rung\n` +
    `    var yc=yOf(k);\n` +
    `    if(k>0){ var yu=yOf(k-1); G.appendChild(SVG('line',{x1:cx+30,y1:yc-6,x2:cx+30,y2:yu+6,stroke:'var(--green)','stroke-width':2})); G.appendChild(SVG('line',{x1:cx+30,y1:yu+6,x2:cx+26,y2:yu+12,stroke:'var(--green)','stroke-width':2})); G.appendChild(SVG('line',{x1:cx+30,y1:yu+6,x2:cx+34,y2:yu+12,stroke:'var(--green)','stroke-width':2})); var el=SVG('text',{x:cx+38,y:(yc+yu)/2+4,'font-size':12,fill:'var(--green)'}); el.textContent='e'; G.appendChild(el); }\n` +
    `    if(k<n){ var yd=yOf(k+1); G.appendChild(SVG('line',{x1:cx-30,y1:yc+6,x2:cx-30,y2:yd-6,stroke:'var(--pink)','stroke-width':2})); G.appendChild(SVG('line',{x1:cx-30,y1:yd-6,x2:cx-34,y2:yd-12,stroke:'var(--pink)','stroke-width':2})); G.appendChild(SVG('line',{x1:cx-30,y1:yd-6,x2:cx-26,y2:yd-12,stroke:'var(--pink)','stroke-width':2})); var fl=SVG('text',{x:cx-44,y:(yc+yd)/2+4,'font-size':12,fill:'var(--pink)'}); fl.textContent='f'; G.appendChild(fl); }\n` +
    `    // readout\n` +
    `    var ec=eCoef(k), fc=fCoef(k);\n` +
    `    var es = ec===0 ? '<span style=\\"color:var(--mute)\\">e\\u00b7v = 0  (highest weight \\u2014 killed)</span>' : '<span style=\\"color:var(--green)\\">e\\u00b7v'+sub(k)+' = '+ec+' v'+sub(k-1)+'</span> (raises weight by 2)';\n` +
    `    var fs = fc===0 ? '<span style=\\"color:var(--mute)\\">f\\u00b7v = 0  (lowest weight \\u2014 killed)</span>' : '<span style=\\"color:var(--pink)\\">f\\u00b7v'+sub(k)+' = '+fc+' v'+sub(k+1)+'</span> (lowers weight by 2)';\n` +
    `    out.innerHTML='current <b style=\\"color:var(--cyan)\\">v'+sub(k)+'</b>, weight h\\u00b7v = '+sgn(mu(k))+'\\u00b7v &nbsp;\\u00b7&nbsp; '+es+' &nbsp;\\u00b7&nbsp; '+fs;\n` +
    `    var rb=$('#${widgetId}-raise'); if(rb) rb.disabled=(k===0); var lb=$('#${widgetId}-lower'); if(lb) lb.disabled=(k===n);\n` +
    `    var nd=$('#${widgetId}-ndn'); if(nd) nd.disabled=(n<=1); var nu=$('#${widgetId}-nup'); if(nu) nu.disabled=(n>=NMAX);\n` +
    `  }\n` +
    `  function sub(m){ if(m<0) return '\\u208b'+(''+(-m)).replace(/[0-9]/g,sd); return (''+m).replace(/[0-9]/g,sd); }\n` +
    `  function sd(d){ return '\\u2080\\u2081\\u2082\\u2083\\u2084\\u2085\\u2086\\u2087\\u2088\\u2089'[+d]; }\n` +
    `  $('#${widgetId}-raise').addEventListener('click',function(){ if(k>0){k--;render();} });\n` +
    `  $('#${widgetId}-lower').addEventListener('click',function(){ if(k<n){k++;render();} });\n` +
    `  $('#${widgetId}-top').addEventListener('click',function(){ k=0; render(); });\n` +
    `  $('#${widgetId}-ndn').addEventListener('click',function(){ if(n>1){n--; if(k>n)k=n; render();} });\n` +
    `  $('#${widgetId}-nup').addEventListener('click',function(){ if(n<NMAX){n++; render();} });\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
