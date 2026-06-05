// draggable-points-2d widget — shared registry renderer for direct-manipulation
// (drag-a-handle) interactions.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer supplies the drag engine: it creates a handle circle per point,
// wires pointer-capture drag with viewBox/per-point clamping, keeps the handles
// in a top layer, and exposes a base group `G` plus the live `pts` array to the
// author's `draw()` (defined in params.bodyScript). The author writes only the
// math + redraw, never the drag plumbing. Coordinates are SVG/pixel coords.
//
// A non-HTML frontend can ignore renderScript and drive its own handles from
// params.points (validated against ./schema.json).

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint, viewBox, svgWidth, svgHeight } = params;
  const svgTitle = params.svgTitle || title;
  const outputInitial = params.outputInitial != null ? params.outputInitial : '&nbsp;';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}"><title>${svgTitle}</title></svg>\n` +
    `  <div class="readout" id="${outputId}">${outputInitial}</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { svgId, outputId, points, bodyScript } = params;
  const ptsJson = JSON.stringify(points);
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const pts=${ptsJson};\n` +
    `  pts.byId={}; for(const p of pts) pts.byId[p.id]=p;\n` +
    `  // ---- author draw() (reads pts, clears+fills G, writes out) ----\n` +
    bodyScript + `\n` +
    `  // ---- drag engine (supplied by draggable-points-2d) ----\n` +
    `  const HL=SVG('g'); svg.appendChild(HL);\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 640 400').split(/\\s+/).map(Number);\n` +
    `  const vb={x:_vb[0],y:_vb[1],width:_vb[2],height:_vb[3]};\n` +
    `  function clampPt(p){ const r=p.r||7;\n` +
    `    const lo_x=(p.minX!=null?p.minX:vb.x+r), hi_x=(p.maxX!=null?p.maxX:vb.x+vb.width-r);\n` +
    `    const lo_y=(p.minY!=null?p.minY:vb.y+r), hi_y=(p.maxY!=null?p.maxY:vb.y+vb.height-r);\n` +
    `    if(!p.lockX) p.x=Math.max(lo_x,Math.min(hi_x,p.x));\n` +
    `    if(!p.lockY) p.y=Math.max(lo_y,Math.min(hi_y,p.y));\n` +
    `  }\n` +
    `  const handles=[]; let drag=null;\n` +
    `  function toSvg(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; return q.matrixTransform(svg.getScreenCTM().inverse()); }\n` +
    `  pts.forEach(function(p){ const r=p.r||7;\n` +
    `    const h=SVG('circle',{cx:p.x,cy:p.y,r:r,fill:(p.color||'var(--cyan)'),stroke:'var(--bg)','stroke-width':1.5});\n` +
    `    h.style.cursor='grab'; h.style.touchAction='none'; HL.appendChild(h);\n` +
    `    let lab=null; if(p.label){ lab=SVG('text',{x:p.x+r+5,y:p.y-r-3,'font-size':12,fill:(p.color||'var(--cyan)')}); lab.textContent=p.label; HL.appendChild(lab); }\n` +
    `    handles.push({h:h,lab:lab,p:p,r:r});\n` +
    `    h.addEventListener('pointerdown',function(ev){ ev.preventDefault(); drag=p; h.style.cursor='grabbing'; try{h.setPointerCapture(ev.pointerId);}catch(e){} });\n` +
    `  });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!drag) return; const q=toSvg(ev); if(!drag.lockX)drag.x=q.x; if(!drag.lockY)drag.y=q.y; clampPt(drag); render(); });\n` +
    `  window.addEventListener('pointerup',function(){ drag=null; for(const o of handles) o.h.style.cursor='grab'; });\n` +
    `  function render(){ draw(); for(const o of handles){ o.h.setAttribute('cx',o.p.x); o.h.setAttribute('cy',o.p.y); if(o.lab){ o.lab.setAttribute('x',o.p.x+o.r+5); o.lab.setAttribute('y',o.p.y-o.r-3); } } }\n` +
    `  pts.forEach(clampPt); render();\n` +
    `})();\n` +
    `</script>`
  );
}
