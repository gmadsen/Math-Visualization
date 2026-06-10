// ramsey-two-coloring widget — the "edge-color" gesture: click the edges of
// K_n to cycle them grey → red → blue → grey, trying to avoid a monochromatic
// triangle. Size buttons switch K_n (e.g. K5, escapable, vs K6, where
// R(3,3) = 6 makes a mono triangle unavoidable). Mono triangles are shaded
// live; completing a colouring yields a verdict.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params; a non-HTML frontend can drive its own renderer
// from params alone (validated against ./schema.json).
//
// jsdom-safe: no getScreenCTM/rAF/Math.random anywhere — edges are <line>
// elements with their own click handlers, so no pointer→viewBox math at all.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const svgTitle = params.svgTitle || title;
  const viewBox = params.viewBox || '0 0 560 480';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 560;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 480;
  const sizes = Array.isArray(params.sizes) && params.sizes.length ? params.sizes : [5, 6];
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  const sizeBtns = sizes
    .map((n, i) => `<button id="${widgetId}-k${n}" type="button" aria-pressed="${i === 0 ? 'true' : 'false'}">K<sub>${n}</sub></button>`)
    .join('\n    ');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:manipulation;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n    ${sizeBtns}\n` +
    `    <button id="${widgetId}-reset" type="button">↺ Reset</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId } = params;
  const sizes = Array.isArray(params.sizes) && params.sizes.length ? params.sizes : [5, 6];
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const SIZES=${JSON.stringify(sizes)};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 560 480').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3], CX=W/2, CYc=Hh/2, RAD=Math.min(W,Hh)/2-40;\n` +
    `  const TRI=SVG('g'); svg.appendChild(TRI);\n` +
    `  const EDG=SVG('g'); svg.appendChild(EDG);\n` +
    `  const VTX=SVG('g'); svg.appendChild(VTX);\n` +
    `  var n=SIZES[0], color={};\n` +
    `  function vpos(i){ const a=-Math.PI/2 + 2*Math.PI*i/n; return [CX+RAD*Math.cos(a), CYc+RAD*Math.sin(a)]; }\n` +
    `  function ekey(i,j){ return Math.min(i,j)+'-'+Math.max(i,j); }\n` +
    `  const PAINT={0:'var(--line)',1:'var(--pink)',2:'var(--blue)'};\n` +
    `  function monoTriangles(){\n` +
    `    const tris=[];\n` +
    `    for(var a=0;a<n;a++) for(var b=a+1;b<n;b++) for(var c2=b+1;c2<n;c2++){\n` +
    `      const x=color[ekey(a,b)]||0, y=color[ekey(a,c2)]||0, z=color[ekey(b,c2)]||0;\n` +
    `      if(x&&x===y&&y===z) tris.push([a,b,c2,x]);\n` +
    `    }\n` +
    `    return tris;\n` +
    `  }\n` +
    `  function render(){\n` +
    `    TRI.innerHTML=''; EDG.innerHTML=''; VTX.innerHTML='';\n` +
    `    const tris=monoTriangles();\n` +
    `    tris.forEach(function(t){\n` +
    `      const p=[vpos(t[0]),vpos(t[1]),vpos(t[2])];\n` +
    `      TRI.appendChild(SVG('path',{d:'M'+p[0]+' L'+p[1]+' L'+p[2]+' Z',fill:PAINT[t[3]],'fill-opacity':0.18,stroke:'none','pointer-events':'none'}));\n` +
    `    });\n` +
    `    var coloured=0, total=n*(n-1)/2;\n` +
    `    for(var i=0;i<n;i++) for(var j=i+1;j<n;j++){\n` +
    `      const k=ekey(i,j), c3=color[k]||0; if(c3) coloured++;\n` +
    `      const p1=vpos(i), p2=vpos(j);\n` +
    `      const ln=SVG('line',{x1:p1[0],y1:p1[1],x2:p2[0],y2:p2[1],stroke:PAINT[c3],'stroke-width':c3?4:2.5,opacity:c3?0.95:0.6});\n` +
    `      ln.style.cursor='pointer';\n` +
    `      // generous invisible hit zone under each edge\n` +
    `      const hit=SVG('line',{x1:p1[0],y1:p1[1],x2:p2[0],y2:p2[1],stroke:'rgba(0,0,0,0)','stroke-width':14});\n` +
    `      hit.style.cursor='pointer';\n` +
    `      (function(kk){ hit.addEventListener('click',function(){ color[kk]=((color[kk]||0)+1)%3; render(); }); })(k);\n` +
    `      EDG.appendChild(ln); EDG.appendChild(hit);\n` +
    `    }\n` +
    `    for(var v=0;v<n;v++){ const p=vpos(v);\n` +
    `      VTX.appendChild(SVG('circle',{cx:p[0],cy:p[1],r:7,fill:'var(--ink)','pointer-events':'none'}));\n` +
    `    }\n` +
    `    var msg=coloured+' of '+total+' edges coloured \\u00b7 monochromatic triangles: <b>'+tris.length+'</b>';\n` +
    `    if(coloured===total){\n` +
    `      if(tris.length===0){ msg+=' \\u00b7 <span class=\"ok\">a complete 2-colouring of K'+n+' with no mono triangle \\u2014 so R(3,3) &gt; '+n+'</span>'; }\n` +
    `      else { msg+=' \\u00b7 <span class=\"bad\">every 2-colouring of K'+n+' contains one'+(n>=6?' \\u2014 that is R(3,3) = 6':'')+'</span>'; }\n` +
    `    } else if(tris.length>0){ msg+=' \\u00b7 <span class=\"bad\">already trapped \\u2014 recolour an edge of the shaded triangle</span>'; }\n` +
    `    out.innerHTML=msg;\n` +
    `  }\n` +
    `  function setN(m){ n=m; color={};\n` +
    `    SIZES.forEach(function(s){ const b=$('#${widgetId}-k'+s); if(b) b.setAttribute('aria-pressed', s===m?'true':'false'); });\n` +
    `    render(); }\n` +
    `  SIZES.forEach(function(s){ const b=$('#${widgetId}-k'+s); if(b) b.addEventListener('click',function(){ setN(s); }); });\n` +
    `  const rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ color={}; render(); });\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
