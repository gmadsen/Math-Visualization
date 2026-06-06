// contour-residue-2d widget — shared registry renderer for the "drag-contour"
// gesture: the reader drags a circular contour around the complex plane (move
// its centre, drag the rim to resize); the poles it encloses light up and the
// readout evaluates the contour integral by the residue theorem,
// oint_C f = 2 pi i * sum(residues of enclosed poles).
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the two-handle drag gesture (centre + rim), the data<->pixel
// mapping, the inside/outside test, the highlight, the integral readout, and
// Reset. The poles and the initial contour are param-driven.
//
// jsdom-safe: createSVGPoint/getScreenCTM run only inside the pointer handlers.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 560 520';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 560;
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
  const { widgetId, svgId, outputId, range = 2.6 } = params;
  const poles = Array.isArray(params.poles) ? params.poles : [];
  const ct = params.contour || {};
  const c0 = { cx: ct.cx != null ? ct.cx : 0, cy: ct.cy != null ? ct.cy : 0, r: ct.r != null ? ct.r : 1.5 };
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const R=${range}, POLES=${JSON.stringify(poles)};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 560 520').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3], cx0=W/2, cy0=Hh/2, S=(Math.min(W,Hh)/2-16)/R;\n` +
    `  function PX(x){ return cx0 + x*S; }\n` +
    `  function PY(y){ return cy0 - y*S; }\n` +
    `  function XV(px){ return (px-cx0)/S; }\n` +
    `  function YV(py){ return (cy0-py)/S; }\n` +
    `  let cxv=${c0.cx}, cyv=${c0.cy}, rr=${c0.r};\n` +
    `  function fmtRes(v){ return (v>=0?'+':'\\u2212')+Math.abs(v); }\n` +
    `  function render(){\n` +
    `    while(G.firstChild)G.removeChild(G.firstChild);\n` +
    `    G.appendChild(SVG('line',{x1:PX(-R),y1:PY(0),x2:PX(R),y2:PY(0),stroke:'var(--mute)','stroke-width':1,opacity:0.3}));\n` +
    `    G.appendChild(SVG('line',{x1:PX(0),y1:PY(-R),x2:PX(0),y2:PY(R),stroke:'var(--mute)','stroke-width':1,opacity:0.3}));\n` +
    `    // contour disk + circle\n` +
    `    G.appendChild(SVG('circle',{cx:PX(cxv),cy:PY(cyv),r:rr*S,fill:'var(--cyan)','fill-opacity':0.08,stroke:'var(--cyan)','stroke-width':2.5}));\n` +
    `    // ccw arrow hint on the rim (a small arc-tip at the top)\n` +
    `    var tipx=PX(cxv), tipy=PY(cyv)-rr*S;\n` +
    `    G.appendChild(SVG('line',{x1:tipx,y1:tipy,x2:tipx-9,y2:tipy-7,stroke:'var(--cyan)','stroke-width':2.5}));\n` +
    `    G.appendChild(SVG('line',{x1:tipx,y1:tipy,x2:tipx-9,y2:tipy+7,stroke:'var(--cyan)','stroke-width':2.5}));\n` +
    `    // poles\n` +
    `    var sum=0, nin=0, parts=[];\n` +
    `    POLES.forEach(function(p){ var inside=Math.hypot(p.x-cxv,p.y-cyv)<rr; if(inside){ sum+=p.res; nin++; parts.push(fmtRes(p.res)); }\n` +
    `      var col=inside?'var(--pink)':'var(--mute)', sz=inside?8:6;\n` +
    `      G.appendChild(SVG('line',{x1:PX(p.x)-sz,y1:PY(p.y)-sz,x2:PX(p.x)+sz,y2:PY(p.y)+sz,stroke:col,'stroke-width':inside?3:2}));\n` +
    `      G.appendChild(SVG('line',{x1:PX(p.x)-sz,y1:PY(p.y)+sz,x2:PX(p.x)+sz,y2:PY(p.y)-sz,stroke:col,'stroke-width':inside?3:2}));\n` +
    `      var lab=(p.label?p.label+': ':'')+'res '+fmtRes(p.res);\n` +
    `      var t=SVG('text',{x:PX(p.x)+11,y:PY(p.y)-9,'font-size':12,fill:col,'font-weight':inside?600:400}); t.textContent=lab; G.appendChild(t); });\n` +
    `    // centre + rim drag handles\n` +
    `    G.appendChild(SVG('circle',{cx:PX(cxv),cy:PY(cyv),r:5,fill:'var(--cyan)',stroke:'var(--ink)','stroke-width':1.4}));\n` +
    `    G.appendChild(SVG('circle',{cx:PX(cxv+rr),cy:PY(cyv),r:6,fill:'var(--yellow)',stroke:'var(--ink)','stroke-width':1.4}));\n` +
    `    // readout\n` +
    `    var twoPi=(2*Math.PI*sum);\n` +
    `    var sumStr = nin===0 ? '0' : (nin===1 ? parts[0].replace(/^\\+/,'') : parts.join(' ').replace(/^\\+/,'') + ' = ' + (sum>=0?'':'\\u2212')+Math.abs(sum));\n` +
    `    var val = nin===0 ? '0' : (Math.abs(twoPi)<1e-9?'0':( (twoPi>=0?'':'\\u2212')+Math.abs(twoPi).toFixed(2)+'i'));\n` +
    `    out.innerHTML='\\u222e<sub>C</sub> f dz = 2\\u03c0i \\u00b7 (\\u03a3 enclosed residues) = 2\\u03c0i\\u00b7('+sumStr+') = <b style=\\"color:var(--pink)\\">'+val+'</b> &nbsp;\\u00b7&nbsp; '+nin+' pole'+(nin===1?'':'s')+' enclosed';\n` +
    `  }\n` +
    `  function toData(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; const p=q.matrixTransform(svg.getScreenCTM().inverse()); return {x:XV(p.x), y:YV(p.y)}; }\n` +
    `  let mode=null;\n` +
    `  svg.addEventListener('pointerdown',function(ev){ const pt=toData(ev);\n` +
    `    const dRim=Math.hypot(pt.x-(cxv+rr),pt.y-cyv), dCen=Math.hypot(pt.x-cxv,pt.y-cyv);\n` +
    `    if(dRim<0.28) mode='rim'; else if(dCen<rr+0.15) mode='move'; else mode=null;\n` +
    `    if(mode){ ev.preventDefault(); try{svg.setPointerCapture(ev.pointerId);}catch(e){} } });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!mode)return; const pt=toData(ev);\n` +
    `    if(mode==='rim'){ rr=Math.max(0.15,Math.min(2*R,Math.hypot(pt.x-cxv,pt.y-cyv))); }\n` +
    `    else { cxv=Math.max(-R,Math.min(R,pt.x)); cyv=Math.max(-R,Math.min(R,pt.y)); } render(); });\n` +
    `  window.addEventListener('pointerup',function(){ mode=null; });\n` +
    `  const rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ cxv=${c0.cx};cyv=${c0.cy};rr=${c0.r}; render(); });\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
