// vector-field-flow-2d widget — shared registry renderer for the "click-seed"
// gesture: the reader clicks anywhere in the plane to release a trajectory of a
// 2D autonomous flow, and the engine integrates and draws the streamline.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the click→data mapping, the RK4 integration (forward and
// backward through the seed), the faint normalised direction-field grid,
// trajectory drawing and a Clear button. The author writes only
// `function field(x,y){ return {dx,dy}; }` (params.bodyScript) and, optionally,
// `function decorate(BG){…}` to draw static overlays (fixed points, nullclines,
// labels) using the exposed data->pixel helpers PX(x)/PY(y).
//
// jsdom-safe: createSVGPoint/getScreenCTM run only inside the click handler,
// never at init (init draws axes + direction field + initial seeds, all from the
// viewBox numbers). A non-HTML frontend can ignore renderScript and integrate
// the same field from the schema.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 640 420';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 640;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 420;
  const svgTitle = params.svgTitle || title;
  const resetLabel = params.resetLabel || '↺ Clear';
  const outputInitial = params.outputInitial != null ? params.outputInitial : '&nbsp;';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:crosshair"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-reset" type="button">${resetLabel}</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">${outputInitial}</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const {
    widgetId,
    svgId,
    outputId,
    bodyScript,
    x0 = -2,
    x1 = 2,
    y0 = -1.5,
    y1 = 1.5,
    padL = 40,
    padR = 20,
    padT = 20,
    padB = 36,
    dt = 0.02,
    steps = 600,
    gridNX = 21,
    gridNY = 13,
  } = params;
  const seedsJson = Array.isArray(params.initialSeeds)
    ? JSON.stringify(params.initialSeeds)
    : '[]';
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const BG=SVG('g'); svg.appendChild(BG);\n` +
    `  const TR=SVG('g'); svg.appendChild(TR);\n` +
    `  const X0=${x0}, X1=${x1}, Y0=${y0}, Y1=${y1};\n` +
    `  const DT=${dt}, STEPS=${steps}, GNX=${gridNX}, GNY=${gridNY};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 640 420').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3];\n` +
    `  const bx0=${padL}, bx1=W-${padR}, by0=Hh-${padB}, by1=${padT};\n` +
    `  function PX(x){ return bx0+(bx1-bx0)*(x-X0)/(X1-X0); }\n` +
    `  function PY(y){ return by0+(by1-by0)*(y-Y0)/(Y1-Y0); }\n` +
    `  function XV(px){ return X0+(X1-X0)*(px-bx0)/(bx1-bx0); }\n` +
    `  function YV(py){ return Y0+(Y1-Y0)*(py-by0)/(by1-by0); }\n` +
    `  const SEEDS=${seedsJson};\n` +
    `  // ---- author field(x,y) + optional decorate(BG) ----\n` +
    bodyScript + `\n` +
    `  // ---- flow engine (supplied by vector-field-flow-2d) ----\n` +
    `  function inBox(x,y){ return x>=X0-1e-9 && x<=X1+1e-9 && y>=Y0-1e-9 && y<=Y1+1e-9; }\n` +
    `  function rk4(x,y,h){ const a=field(x,y); const k1x=a.dx,k1y=a.dy;\n` +
    `    const b=field(x+0.5*h*k1x,y+0.5*h*k1y); const k2x=b.dx,k2y=b.dy;\n` +
    `    const c=field(x+0.5*h*k2x,y+0.5*h*k2y); const k3x=c.dx,k3y=c.dy;\n` +
    `    const d=field(x+h*k3x,y+h*k3y); const k4x=d.dx,k4y=d.dy;\n` +
    `    return [x+h/6*(k1x+2*k2x+2*k3x+k4x), y+h/6*(k1y+2*k2y+2*k3y+k4y)]; }\n` +
    `  function integrate(x,y,sign){ const pts=[[x,y]]; let cx=x,cy=y;\n` +
    `    for(let i=0;i<STEPS;i++){ const v=field(cx,cy); if(Math.hypot(v.dx,v.dy)<1e-4) break;\n` +
    `      const n=rk4(cx,cy,sign*DT); cx=n[0]; cy=n[1]; if(!inBox(cx,cy)){ pts.push([cx,cy]); break; } pts.push([cx,cy]); }\n` +
    `    return pts; }\n` +
    `  function pathOf(pts){ let d=''; for(let i=0;i<pts.length;i++){ d+=(i?'L':'M')+PX(pts[i][0]).toFixed(1)+' '+PY(pts[i][1]).toFixed(1)+' '; } return d; }\n` +
    `  function fmt(v){ var r=Number(v.toFixed(2)); if(r===0) r=0; return r.toFixed(2); }\n` +
    `  function streamline(x,y){ const fwd=integrate(x,y,1), bwd=integrate(x,y,-1);\n` +
    `    const full=bwd.slice().reverse().concat(fwd.slice(1));\n` +
    `    TR.appendChild(SVG('path',{d:pathOf(full),fill:'none',stroke:'var(--cyan)','stroke-width':2,opacity:0.9}));\n` +
    `    TR.appendChild(SVG('circle',{cx:PX(x),cy:PY(y),r:3,fill:'var(--yellow)'}));\n` +
    `    const e=fwd[fwd.length-1], v=field(e[0],e[1]);\n` +
    `    if(!inBox(e[0],e[1])) return 'seed ('+fmt(x)+', '+fmt(y)+') \\u2192 escapes the window';\n` +
    `    if(Math.hypot(v.dx,v.dy)<1e-3) return 'seed ('+fmt(x)+', '+fmt(y)+') \\u2192 settles near ('+fmt(e[0])+', '+fmt(e[1])+')';\n` +
    `    return 'seed ('+fmt(x)+', '+fmt(y)+') \\u2192 still moving at ('+fmt(e[0])+', '+fmt(e[1])+')'; }\n` +
    `  function drawAxes(){ const y0p=(Y0<=0&&Y1>=0)?PY(0):null, x0p=(X0<=0&&X1>=0)?PX(0):null;\n` +
    `    BG.appendChild(SVG('rect',{x:bx0,y:by1,width:bx1-bx0,height:by0-by1,fill:'none',stroke:'var(--line)','stroke-width':1,opacity:0.5}));\n` +
    `    if(y0p!=null) BG.appendChild(SVG('line',{x1:bx0,y1:y0p,x2:bx1,y2:y0p,stroke:'var(--line)','stroke-width':1,opacity:0.7}));\n` +
    `    if(x0p!=null) BG.appendChild(SVG('line',{x1:x0p,y1:by1,x2:x0p,y2:by0,stroke:'var(--line)','stroke-width':1,opacity:0.7})); }\n` +
    `  function drawField(){ if(GNX<=0||GNY<=0) return; const L=10;\n` +
    `    for(let i=0;i<GNX;i++){ for(let j=0;j<GNY;j++){\n` +
    `      const x=X0+(X1-X0)*(i+0.5)/GNX, y=Y0+(Y1-Y0)*(j+0.5)/GNY; const v=field(x,y);\n` +
    `      const sp=Math.hypot(v.dx,v.dy); if(sp<1e-9) continue; const ux=v.dx/sp, uy=v.dy/sp;\n` +
    `      const px=PX(x), py=PY(y); const ex=px+L*ux, ey=py-L*uy;\n` +
    `      BG.appendChild(SVG('line',{x1:px,y1:py,x2:ex,y2:ey,stroke:'var(--mute)','stroke-width':1,opacity:0.4}));\n` +
    `      BG.appendChild(SVG('circle',{cx:ex,cy:ey,r:1.4,fill:'var(--mute)',opacity:0.5})); } } }\n` +
    `  function seedAll(){ while(TR.firstChild) TR.removeChild(TR.firstChild); let last='';\n` +
    `    for(let i=0;i<SEEDS.length;i++){ last=streamline(SEEDS[i][0],SEEDS[i][1]); } return last; }\n` +
    `  function toData(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; const p=q.matrixTransform(svg.getScreenCTM().inverse()); return {x:XV(p.x), y:YV(p.y)}; }\n` +
    `  svg.addEventListener('click',function(ev){ const d=toData(ev); if(!inBox(d.x,d.y)) return; const msg=streamline(d.x,d.y); out.innerHTML=msg; });\n` +
    `  const rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ const m=seedAll(); out.innerHTML=m||'cleared \\u2014 click in the plane to release a trajectory'; });\n` +
    `  drawAxes(); drawField(); if(typeof decorate==='function') decorate(BG); seedAll();\n` +
    `})();\n` +
    `</script>`
  );
}
