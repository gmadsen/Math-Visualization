// eigenvector-explorer-2d widget — shared registry renderer for the
// "drag-direction" gesture: the reader drags a unit vector v around the unit
// circle and watches its image Av; the eigenvectors are the directions where Av
// stays parallel to v (Av = lambda*v).
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the drag gesture (the handle is pinned to the unit circle),
// the data<->pixel mapping, the v/Av arrows, the real eigendirection guide
// lines, the eigenvalue / det / trace readout and the "this is an eigenvector"
// detection, and Reset. The matrix is param-driven.
//
// jsdom-safe: createSVGPoint/getScreenCTM run only inside the pointer handlers.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 520 520';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 520;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 520;
  const svgTitle = params.svgTitle || title;
  const resetLabel = params.resetLabel || '↺ Reset';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:grab;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-reset" type="button">${resetLabel}</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId, range = 2.6, initialAngleDeg = 25 } = params;
  const M = Array.isArray(params.matrix) ? params.matrix : [[1.6, 0.5], [0.5, 0.7]];
  const a = M[0][0], b = M[0][1], c = M[1][0], d = M[1][1];
  const eigenLabel = params.eigenLabel || '';
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const R=${range}, A=${a}, B=${b}, C=${c}, D=${d}, ELABEL=${JSON.stringify(eigenLabel)};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 520 520').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3], cx=W/2, cy=Hh/2, S=(Math.min(W,Hh)/2-16)/R;\n` +
    `  function PX(x){ return cx + x*S; }\n` +
    `  function PY(y){ return cy - y*S; }\n` +
    `  function XV(px){ return (px-cx)/S; }\n` +
    `  function YV(py){ return (cy-py)/S; }\n` +
    `  function mul(x,y){ return [A*x+B*y, C*x+D*y]; }\n` +
    `  let th=${initialAngleDeg}*Math.PI/180;\n` +
    `  const tr=A+D, det=A*D-B*C, disc=tr*tr-4*det;\n` +
    `  const realEig = disc>=-1e-9, sq=Math.sqrt(Math.abs(disc));\n` +
    `  const l1 = realEig ? (tr+sq)/2 : tr/2, l2 = realEig ? (tr-sq)/2 : tr/2, imp = realEig ? 0 : sq/2;\n` +
    `  function eigvec(l){ var vx=B, vy=l-A; if(Math.hypot(vx,vy)<1e-7){ vx=l-D; vy=C; } if(Math.hypot(vx,vy)<1e-7){ vx=1; vy=0; } var n=Math.hypot(vx,vy); return [vx/n, vy/n]; }\n` +
    `  function arrow(x1,y1,col,wd){\n` +
    `    G.appendChild(SVG('line',{x1:PX(0),y1:PY(0),x2:PX(x1),y2:PY(y1),stroke:col,'stroke-width':wd||2.5}));\n` +
    `    const ang=Math.atan2(PY(y1)-PY(0),PX(x1)-PX(0)), hl=10;\n` +
    `    for(const s of [-1,1]){ const aa=ang+Math.PI+s*0.4; G.appendChild(SVG('line',{x1:PX(x1),y1:PY(y1),x2:PX(x1)+hl*Math.cos(aa),y2:PY(y1)+hl*Math.sin(aa),stroke:col,'stroke-width':wd||2.5})); } }\n` +
    `  function render(){\n` +
    `    while(G.firstChild)G.removeChild(G.firstChild);\n` +
    `    G.appendChild(SVG('line',{x1:PX(-R),y1:PY(0),x2:PX(R),y2:PY(0),stroke:'var(--mute)','stroke-width':1,opacity:0.35}));\n` +
    `    G.appendChild(SVG('line',{x1:PX(0),y1:PY(-R),x2:PX(0),y2:PY(R),stroke:'var(--mute)','stroke-width':1,opacity:0.35}));\n` +
    `    G.appendChild(SVG('circle',{cx:PX(0),cy:PY(0),r:S,fill:'none',stroke:'var(--line)','stroke-width':1,opacity:0.5}));\n` +
    `    // real eigendirection guide lines\n` +
    `    if(realEig){ [eigvec(l1),eigvec(l2)].forEach(function(e,i){ const col=i===0?'var(--green)':'var(--violet)';\n` +
    `      G.appendChild(SVG('line',{x1:PX(-R*e[0]),y1:PY(-R*e[1]),x2:PX(R*e[0]),y2:PY(R*e[1]),stroke:col,'stroke-width':1.5,'stroke-dasharray':'6 5',opacity:0.7})); }); }\n` +
    `    const vx=Math.cos(th), vy=Math.sin(th), Av=mul(vx,vy);\n` +
    `    const cross=vx*Av[1]-vy*Av[0], avn=Math.hypot(Av[0],Av[1]);\n` +
    `    const aligned = realEig && avn>1e-6 && Math.abs(cross)/avn < 0.02;\n` +
    `    arrow(Av[0],Av[1],'var(--pink)',2.5); G.appendChild(SVG('text',{x:PX(Av[0])+8,y:PY(Av[1])-6,'font-size':12,fill:'var(--pink)'})).textContent='Av';\n` +
    `    arrow(vx,vy, aligned?'var(--yellow)':'var(--cyan)',3);\n` +
    `    G.appendChild(SVG('text',{x:PX(vx)+8,y:PY(vy)-6,'font-size':12,fill:aligned?'var(--yellow)':'var(--cyan)'})).textContent='v';\n` +
    `    G.appendChild(SVG('circle',{cx:PX(vx),cy:PY(vy),r:7,fill:aligned?'var(--yellow)':'var(--cyan)',stroke:'var(--ink)','stroke-width':1.5}));\n` +
    `    function f(n){ return (n>=0?'':'\\u2212')+Math.abs(n).toFixed(2); }\n` +
    `    const enoun = ELABEL ? ELABEL+'s' : 'eigenvalues';\n` +
    `    const eigStr = realEig ? (enoun+' \\u03bb\\u2081 = '+f(l1)+', \\u03bb\\u2082 = '+f(l2)) : ('complex '+enoun+' '+f(tr/2)+' \\u00b1 '+imp.toFixed(2)+'i \\u2014 no real eigenvector (a rotation)');\n` +
    `    const lam = vx*Av[0]+vy*Av[1];\n` +
    `    const tail = aligned ? ' &nbsp;\\u00b7&nbsp; <b style=\\"color:var(--yellow)\\">v is an eigenvector! Av = '+f(lam)+'\\u00b7v</b>' : (realEig?' &nbsp;\\u00b7&nbsp; rotate v onto a dashed line to find an eigenvector':'');\n` +
    `    out.innerHTML='v = ('+f(vx)+', '+f(vy)+') &nbsp;\\u00b7&nbsp; Av = ('+f(Av[0])+', '+f(Av[1])+') &nbsp;\\u00b7&nbsp; '+eigStr+' &nbsp;\\u00b7&nbsp; det = '+f(det)+', tr = '+f(tr)+tail;\n` +
    `  }\n` +
    `  function toData(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; const p=q.matrixTransform(svg.getScreenCTM().inverse()); return {x:XV(p.x), y:YV(p.y)}; }\n` +
    `  let drag=false;\n` +
    `  svg.addEventListener('pointerdown',function(ev){ const pt=toData(ev); const vx=Math.cos(th), vy=Math.sin(th); if(Math.hypot(pt.x-vx,pt.y-vy)<0.5){ drag=true; ev.preventDefault(); try{svg.setPointerCapture(ev.pointerId);}catch(e){} } });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!drag)return; const pt=toData(ev); if(Math.hypot(pt.x,pt.y)>1e-3){ th=Math.atan2(pt.y,pt.x); render(); } });\n` +
    `  window.addEventListener('pointerup',function(){ drag=false; });\n` +
    `  const rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ th=${initialAngleDeg}*Math.PI/180; render(); });\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
