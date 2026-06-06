// linear-transform-2d widget — shared registry renderer for the "drag-basis"
// gesture: the reader drags the tips of where the standard basis vectors î and ĵ
// land, and the 2x2 matrix whose columns are those images transforms the whole
// plane (a grid of parallelograms), with det = the signed-area scaling factor.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the drag gesture (pointer hit-testing on the two handles,
// the data<->pixel mapping), the grid / basis-arrow / unit-square drawing, the
// det / orientation / invertibility readout, and Reset. The widget is fully
// param-driven (initialMatrix, optional shapePoints); an optional bodyScript may
// define `decorate(m, helpers)` for extra overlays.
//
// jsdom-safe: createSVGPoint/getScreenCTM run only inside the pointer handlers,
// never at init.

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
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:grab;max-width:${svgWidth}px"><title>${svgTitle}</title></svg>\n` +
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
    range = 5,
    gridExtent = 6,
  } = params;
  const m0 = Array.isArray(params.initialMatrix) ? params.initialMatrix : [[1, 0], [0, 1]];
  const a0 = m0[0][0], b0 = m0[0][1], c0 = m0[1][0], d0 = m0[1][1];
  const shapeJson = Array.isArray(params.shapePoints) ? JSON.stringify(params.shapePoints) : 'null';
  const author = bodyScript ? bodyScript + '\n' : '';
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const R=${range}, EXT=${gridExtent};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 560 560').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3];\n` +
    `  const cx=W/2, cy=Hh/2, S=(Math.min(W,Hh)/2-18)/R;\n` +
    `  function PX(x){ return cx + x*S; }\n` +
    `  function PY(y){ return cy - y*S; }\n` +
    `  function XV(px){ return (px-cx)/S; }\n` +
    `  function YV(py){ return (cy-py)/S; }\n` +
    `  let a=${a0}, b=${b0}, c=${c0}, d=${d0};\n` +
    `  const SHAPE=${shapeJson};\n` +
    `  function ap(x,y){ return [a*x+b*y, c*x+d*y]; }\n` +
    `  ${author ? '// ---- optional author decorate(m, helpers) ----' : ''}\n` +
    author +
    `  function arrow(x1,y1,col){\n` +
    `    G.appendChild(SVG('line',{x1:PX(0),y1:PY(0),x2:PX(x1),y2:PY(y1),stroke:col,'stroke-width':2.5}));\n` +
    `    const ang=Math.atan2(PY(y1)-PY(0), PX(x1)-PX(0)), hl=10;\n` +
    `    for(const s of [-1,1]){ const aa=ang+Math.PI+s*0.4;\n` +
    `      G.appendChild(SVG('line',{x1:PX(x1),y1:PY(y1),x2:PX(x1)+hl*Math.cos(aa),y2:PY(y1)+hl*Math.sin(aa),stroke:col,'stroke-width':2.5})); } }\n` +
    `  function render(){\n` +
    `    while(G.firstChild)G.removeChild(G.firstChild);\n` +
    `    const det=a*d-b*c;\n` +
    `    // faint reference grid (untransformed)\n` +
    `    for(let k=-EXT;k<=EXT;k++){\n` +
    `      G.appendChild(SVG('line',{x1:PX(k),y1:PY(-EXT),x2:PX(k),y2:PY(EXT),stroke:'var(--line)','stroke-width':1,opacity:0.18}));\n` +
    `      G.appendChild(SVG('line',{x1:PX(-EXT),y1:PY(k),x2:PX(EXT),y2:PY(k),stroke:'var(--line)','stroke-width':1,opacity:0.18})); }\n` +
    `    // transformed grid\n` +
    `    for(let k=-EXT;k<=EXT;k++){\n` +
    `      const p1=ap(k,-EXT), p2=ap(k,EXT), q1=ap(-EXT,k), q2=ap(EXT,k);\n` +
    `      G.appendChild(SVG('line',{x1:PX(p1[0]),y1:PY(p1[1]),x2:PX(p2[0]),y2:PY(p2[1]),stroke:'var(--cyan)','stroke-width':k===0?2:1,opacity:k===0?0.7:0.3}));\n` +
    `      G.appendChild(SVG('line',{x1:PX(q1[0]),y1:PY(q1[1]),x2:PX(q2[0]),y2:PY(q2[1]),stroke:'var(--yellow)','stroke-width':k===0?2:1,opacity:k===0?0.7:0.3})); }\n` +
    `    // transformed unit square — colour by orientation\n` +
    `    const o=ap(0,0), pi=ap(1,0), pij=ap(1,1), pj=ap(0,1);\n` +
    `    const sq='M'+PX(o[0]).toFixed(1)+' '+PY(o[1]).toFixed(1)+' L'+PX(pi[0]).toFixed(1)+' '+PY(pi[1]).toFixed(1)+' L'+PX(pij[0]).toFixed(1)+' '+PY(pij[1]).toFixed(1)+' L'+PX(pj[0]).toFixed(1)+' '+PY(pj[1]).toFixed(1)+' Z';\n` +
    `    G.appendChild(SVG('path',{d:sq,fill:det>=0?'var(--cyan)':'var(--pink)','fill-opacity':0.2,stroke:'none'}));\n` +
    `    if(SHAPE){ let sp=''; for(let n=0;n<SHAPE.length;n++){ const t=ap(SHAPE[n][0],SHAPE[n][1]); sp+=(n?'L':'M')+PX(t[0]).toFixed(1)+' '+PY(t[1]).toFixed(1)+' '; } sp+='Z';\n` +
    `      G.appendChild(SVG('path',{d:sp,fill:'var(--violet)','fill-opacity':0.25,stroke:'var(--violet)','stroke-width':1.5})); }\n` +
    `    arrow(a,c,'var(--cyan)'); arrow(b,d,'var(--yellow)');\n` +
    `    const ti=SVG('text',{x:PX(a)+10,y:PY(c)-8,'font-size':13,fill:'var(--cyan)','font-style':'italic'}); ti.textContent='\\u0131\\u0302'; G.appendChild(ti);\n` +
    `    const tj=SVG('text',{x:PX(b)+10,y:PY(d)-8,'font-size':13,fill:'var(--yellow)','font-style':'italic'}); tj.textContent='\\u0237\\u0302'; G.appendChild(tj);\n` +
    `    G.appendChild(SVG('circle',{cx:PX(a),cy:PY(c),r:7,fill:'var(--cyan)',stroke:'var(--ink)','stroke-width':1.5}));\n` +
    `    G.appendChild(SVG('circle',{cx:PX(b),cy:PY(d),r:7,fill:'var(--yellow)',stroke:'var(--ink)','stroke-width':1.5}));\n` +
    `    if(typeof decorate==='function'){ decorate({a:a,b:b,c:c,d:d,det:det},{G:G,PX:PX,PY:PY,ap:ap}); }\n` +
    `    const EPS=5e-3, inv=Math.abs(det)>=EPS;\n` +
    `    const orient = det>=EPS?'orientation preserved':(det<=-EPS?'orientation <b style=\\"color:var(--pink)\\">flipped</b>':'<b style=\\"color:var(--pink)\\">collapsed to a line</b>');\n` +
    `    out.innerHTML='M = ['+a.toFixed(2)+'\\u2009'+b.toFixed(2)+'; '+c.toFixed(2)+'\\u2009'+d.toFixed(2)+'] &nbsp;\\u00b7&nbsp; det = <b>'+det.toFixed(2)+'</b> \\u2192 areas \\u00d7'+Math.abs(det).toFixed(2)+' &nbsp;\\u00b7&nbsp; '+orient+' &nbsp;\\u00b7&nbsp; '+(inv?'invertible':'<b style=\\"color:var(--pink)\\">singular</b>'); }\n` +
    `  // ---- drag engine (supplied by linear-transform-2d) ----\n` +
    `  function toData(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; const p=q.matrixTransform(svg.getScreenCTM().inverse()); return {x:XV(p.x), y:YV(p.y)}; }\n` +
    `  let drag=null;\n` +
    `  function hit(pt){ const di=Math.hypot(pt.x-a,pt.y-c), dj=Math.hypot(pt.x-b,pt.y-d), r=16/S; if(di<r&&di<=dj) return 'i'; if(dj<r) return 'j'; return null; }\n` +
    `  svg.addEventListener('pointerdown',function(ev){ const pt=toData(ev); drag=hit(pt); if(drag){ ev.preventDefault(); try{svg.setPointerCapture(ev.pointerId);}catch(e){} } });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!drag)return; const pt=toData(ev); let x=Math.max(-R,Math.min(R,pt.x)), y=Math.max(-R,Math.min(R,pt.y)); if(drag==='i'){a=x;c=y;} else {b=x;d=y;} render(); });\n` +
    `  window.addEventListener('pointerup',function(){ drag=null; });\n` +
    `  const rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ a=${a0};b=${b0};c=${c0};d=${d0}; render(); });\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
