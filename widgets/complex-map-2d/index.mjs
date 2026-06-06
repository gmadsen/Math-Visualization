// complex-map-2d widget — shared registry renderer for the "drag-probe" gesture:
// the reader drags a probe point z through a complex map w = f(z), watching its
// image and the local conformal frame (angle preservation) update live.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the drag gesture, the data<->pixel mapping, the image-of-the-
// grid drawing, the probe + image markers, the local cross (image of a small
// cross at z), the z / w / |f'| readout, and Reset. The author writes only
// `function f(x,y){ return [u,v]; }` (params.bodyScript).
//
// jsdom-safe: createSVGPoint/getScreenCTM run only inside the pointer handlers,
// never at init. The outermost <svg> clips the image grid to the viewport.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 560 560';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 560;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 560;
  const svgTitle = params.svgTitle || title;
  const resetLabel = params.resetLabel || '↺ Reset';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:grab;max-width:${svgWidth}px;overflow:hidden"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-reset" type="button">${resetLabel}</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const {
    widgetId,
    svgId,
    outputId,
    bodyScript,
    range = 2.5,
    gridExtent = 3,
  } = params;
  const z0 = Array.isArray(params.initialZ) ? params.initialZ : [1, 0.6];
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const R=${range}, EXT=${gridExtent};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 560 560').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3];\n` +
    `  const cx=W/2, cy=Hh/2, S=(Math.min(W,Hh)/2-14)/R;\n` +
    `  function PX(x){ return cx + x*S; }\n` +
    `  function PY(y){ return cy - y*S; }\n` +
    `  function XV(px){ return (px-cx)/S; }\n` +
    `  function YV(py){ return (cy-py)/S; }\n` +
    `  let zx=${z0[0]}, zy=${z0[1]};\n` +
    `  // ---- author f(x,y) -> [u,v] ----\n` +
    bodyScript + `\n` +
    `  // ---- complex-map engine (supplied by complex-map-2d) ----\n` +
    `  function mappedLine(fixed,isVert){ let d=''; const N=64;\n` +
    `    for(let i=0;i<=N;i++){ const t=-EXT+2*EXT*i/N; const p=isVert?f(fixed,t):f(t,fixed); d+=(i?'L':'M')+PX(p[0]).toFixed(1)+' '+PY(p[1]).toFixed(1)+' '; } return d; }\n` +
    `  function deriv(x,y){ const h=1e-3, a=f(x+h,y), b=f(x-h,y); return [(a[0]-b[0])/(2*h), (a[1]-b[1])/(2*h)]; }\n` +
    `  function render(){\n` +
    `    while(G.firstChild)G.removeChild(G.firstChild);\n` +
    `    // faint source grid + axes (reference)\n` +
    `    for(let k=-EXT;k<=EXT;k++){\n` +
    `      G.appendChild(SVG('line',{x1:PX(k),y1:PY(-EXT),x2:PX(k),y2:PY(EXT),stroke:'var(--line)','stroke-width':1,opacity:0.13}));\n` +
    `      G.appendChild(SVG('line',{x1:PX(-EXT),y1:PY(k),x2:PX(EXT),y2:PY(k),stroke:'var(--line)','stroke-width':1,opacity:0.13})); }\n` +
    `    // image of the grid under f (the warped / conformal grid)\n` +
    `    for(let k=-EXT;k<=EXT;k++){\n` +
    `      G.appendChild(SVG('path',{d:mappedLine(k,true),fill:'none',stroke:'var(--cyan)','stroke-width':k===0?2:1,opacity:k===0?0.75:0.38}));\n` +
    `      G.appendChild(SVG('path',{d:mappedLine(k,false),fill:'none',stroke:'var(--yellow)','stroke-width':k===0?2:1,opacity:k===0?0.75:0.38})); }\n` +
    `    const w=f(zx,zy), fp=deriv(zx,zy), s=Math.hypot(fp[0],fp[1]), ang=Math.atan2(fp[1],fp[0]);\n` +
    `    // image of a small cross at z (drawn at w) — shows local rotation+scale\n` +
    `    const e=0.32;\n` +
    `    const cxp=f(zx+e,zy), cxm=f(zx-e,zy), cyp=f(zx,zy+e), cym=f(zx,zy-e);\n` +
    `    G.appendChild(SVG('line',{x1:PX(cxm[0]),y1:PY(cxm[1]),x2:PX(cxp[0]),y2:PY(cxp[1]),stroke:'var(--pink)','stroke-width':2.5}));\n` +
    `    G.appendChild(SVG('line',{x1:PX(cym[0]),y1:PY(cym[1]),x2:PX(cyp[0]),y2:PY(cyp[1]),stroke:'var(--pink)','stroke-width':2.5}));\n` +
    `    // arrow z -> w\n` +
    `    G.appendChild(SVG('line',{x1:PX(zx),y1:PY(zy),x2:PX(w[0]),y2:PY(w[1]),stroke:'var(--mute)','stroke-width':1,'stroke-dasharray':'3 4',opacity:0.6}));\n` +
    `    // probe z and image w\n` +
    `    G.appendChild(SVG('circle',{cx:PX(w[0]),cy:PY(w[1]),r:5,fill:'var(--pink)',stroke:'var(--ink)','stroke-width':1.2}));\n` +
    `    const lw=SVG('text',{x:PX(w[0])+9,y:PY(w[1])-7,'font-size':12,fill:'var(--pink)'}); lw.textContent='w=f(z)'; G.appendChild(lw);\n` +
    `    G.appendChild(SVG('circle',{cx:PX(zx),cy:PY(zy),r:7,fill:'var(--cyan)',stroke:'var(--ink)','stroke-width':1.5}));\n` +
    `    const lz=SVG('text',{x:PX(zx)+9,y:PY(zy)-7,'font-size':12,fill:'var(--cyan)'}); lz.textContent='z'; G.appendChild(lz);\n` +
    `    function cpx(re,im){ const ai=Math.abs(im); return re.toFixed(2)+(im>=0?' + ':' \\u2212 ')+ai.toFixed(2)+'i'; }\n` +
    `    const conf = s>1e-3 ? 'angles preserved (conformal)' : '<b style=\\"color:var(--pink)\\">f\\u2032\\u22480: angles not preserved here</b>';\n` +
    `    out.innerHTML='z = '+cpx(zx,zy)+' &nbsp;\\u00b7&nbsp; w = f(z) = '+cpx(w[0],w[1])+' &nbsp;\\u00b7&nbsp; |f\\u2032(z)| \\u2248 '+s.toFixed(2)+' (local stretch), arg f\\u2032 \\u2248 '+(ang*180/Math.PI).toFixed(0)+'\\u00b0 &nbsp;\\u00b7&nbsp; '+conf;\n` +
    `  }\n` +
    `  function toData(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; const p=q.matrixTransform(svg.getScreenCTM().inverse()); return {x:XV(p.x), y:YV(p.y)}; }\n` +
    `  let drag=false;\n` +
    `  svg.addEventListener('pointerdown',function(ev){ const pt=toData(ev); if(Math.hypot(pt.x-zx,pt.y-zy)<18/S){ drag=true; ev.preventDefault(); try{svg.setPointerCapture(ev.pointerId);}catch(e){} } });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!drag)return; const pt=toData(ev); zx=Math.max(-R,Math.min(R,pt.x)); zy=Math.max(-R,Math.min(R,pt.y)); render(); });\n` +
    `  window.addEventListener('pointerup',function(){ drag=false; });\n` +
    `  const rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ zx=${z0[0]}; zy=${z0[1]}; render(); });\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
