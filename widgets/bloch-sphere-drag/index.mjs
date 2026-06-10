// bloch-sphere-drag widget — the "drag-state" gesture: drag anywhere on the
// sphere to steer a qubit state |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩
// (horizontal drag turns φ, vertical drag tilts θ), with X / Z / H gate
// buttons acting as sphere rotations that leave a ghost at the old state.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params; a non-HTML frontend can drive its own renderer
// from params alone (validated against ./schema.json).
//
// jsdom-safe: getScreenCTM/createSVGPoint run only inside pointer handlers;
// no Math.random, no rAF. The drag maps pointer DELTAS to (Δφ, Δθ), so there
// is no front/back-hemisphere ambiguity to resolve.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const svgTitle = params.svgTitle || title;
  const viewBox = params.viewBox || '0 0 560 520';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 560;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 520;
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:grab;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-gx" type="button">X</button>\n` +
    `    <button id="${widgetId}-gz" type="button">Z</button>\n` +
    `    <button id="${widgetId}-gh" type="button">H</button>\n` +
    `    <button id="${widgetId}-reset" type="button">↺ Reset</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId } = params;
  const th0 = params.initialTheta != null ? params.initialTheta : Math.PI / 3;
  const ph0 = params.initialPhi != null ? params.initialPhi : Math.PI / 4;
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 560 520').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3], CX=W/2, CYc=Hh/2-10, S=Math.min(W,Hh)/2-60;\n` +
    `  const BG=SVG('g'); svg.appendChild(BG);\n` +
    `  const FG=SVG('g'); svg.appendChild(FG);\n` +
    `  // fixed orthographic view (yaw, pitch) — Bloch z up, x toward the viewer\n` +
    `  const YAW=-0.55, PIT=0.30;\n` +
    `  function proj(p){\n` +
    `    const ca=Math.cos(YAW), sa=Math.sin(YAW), cb=Math.cos(PIT), sb=Math.sin(PIT);\n` +
    `    const X1=p[0]*ca-p[1]*sa, Y1=p[0]*sa+p[1]*ca, Z1=p[2];\n` +
    `    return { x: CX+S*Y1, y: CYc-S*(Z1*cb-X1*sb), front: X1*cb+Z1*sb > -0.05 };\n` +
    `  }\n` +
    `  function circle3(axis, g){\n` +
    `    // draw a unit great circle perpendicular to 'axis' as two polylines (front solid, back dashed)\n` +
    `    var u,v;\n` +
    `    if(axis==='z'){ u=[1,0,0]; v=[0,1,0]; } else if(axis==='x'){ u=[0,1,0]; v=[0,0,1]; } else { u=[1,0,0]; v=[0,0,1]; }\n` +
    `    var dF='', dB='', penF=false, penB=false;\n` +
    `    for(var t=0;t<=128;t++){\n` +
    `      const a2=2*Math.PI*t/128;\n` +
    `      const p=[u[0]*Math.cos(a2)+v[0]*Math.sin(a2), u[1]*Math.cos(a2)+v[1]*Math.sin(a2), u[2]*Math.cos(a2)+v[2]*Math.sin(a2)];\n` +
    `      const q=proj(p);\n` +
    `      if(q.front){ dF+=(penF?'L':'M')+q.x.toFixed(1)+' '+q.y.toFixed(1)+' '; penF=true; penB=false; }\n` +
    `      else { dB+=(penB?'L':'M')+q.x.toFixed(1)+' '+q.y.toFixed(1)+' '; penB=true; penF=false; }\n` +
    `    }\n` +
    `    if(dB) g.appendChild(SVG('path',{d:dB,fill:'none',stroke:'var(--line)','stroke-width':1,'stroke-dasharray':'3 4',opacity:0.6,'pointer-events':'none'}));\n` +
    `    if(dF) g.appendChild(SVG('path',{d:dF,fill:'none',stroke:'var(--line)','stroke-width':1.4,opacity:0.9,'pointer-events':'none'}));\n` +
    `  }\n` +
    `  function label(p, txt, color){\n` +
    `    const q=proj(p);\n` +
    `    const t=SVG('text',{x:q.x,y:q.y-8,'font-size':12,fill:color||'var(--mute)','text-anchor':'middle','pointer-events':'none'});\n` +
    `    t.textContent=txt; BG.appendChild(t);\n` +
    `    BG.appendChild(SVG('circle',{cx:q.x,cy:q.y,r:2.5,fill:color||'var(--mute)','pointer-events':'none'}));\n` +
    `  }\n` +
    `  // static scenery: outline, three great circles, axis labels\n` +
    `  BG.appendChild(SVG('circle',{cx:CX,cy:CYc,r:S,fill:'var(--panel2)','fill-opacity':0.35,stroke:'var(--line)','stroke-width':1.5}));\n` +
    `  circle3('z',BG); circle3('x',BG); circle3('y',BG);\n` +
    `  label([0,0,1.12],'|0\\u27e9','var(--cyan)'); label([0,0,-1.14],'|1\\u27e9','var(--cyan)');\n` +
    `  label([1.14,0,0],'|+\\u27e9','var(--mute)'); label([-1.16,0,0],'|\\u2212\\u27e9','var(--mute)');\n` +
    `  label([0,1.12,0],'|+i\\u27e9','var(--mute)'); label([0,-1.14,0],'|\\u2212i\\u27e9','var(--mute)');\n` +
    `  var th=${th0}, ph=${ph0}, ghost=null, lastGate=null;\n` +
    `  function bloch(thA,phA){ return [Math.sin(thA)*Math.cos(phA), Math.sin(thA)*Math.sin(phA), Math.cos(thA)]; }\n` +
    `  function fmt(x){ const r=Math.round(x*100)/100; const t=(r===0?0:r).toFixed(2); return t.replace('-','\\u2212'); }\n` +
    `  function render(){\n` +
    `    FG.innerHTML='';\n` +
    `    if(ghost){ const gq=proj(bloch(ghost[0],ghost[1]));\n` +
    `      FG.appendChild(SVG('circle',{cx:gq.x,cy:gq.y,r:6,fill:'var(--violet)','fill-opacity':0.35,'pointer-events':'none'})); }\n` +
    `    const p=bloch(th,ph), q=proj(p);\n` +
    `    FG.appendChild(SVG('line',{x1:CX,y1:CYc,x2:q.x,y2:q.y,stroke:'var(--yellow)','stroke-width':2,opacity:q.front?0.9:0.45,'pointer-events':'none'}));\n` +
    `    FG.appendChild(SVG('circle',{cx:q.x,cy:q.y,r:7,fill:'var(--yellow)',stroke:'var(--bg)','stroke-width':1.5,opacity:q.front?1:0.55,'pointer-events':'none'}));\n` +
    `    const c0=Math.cos(th/2), s0=Math.sin(th/2);\n` +
    `    const re=s0*Math.cos(ph), im=s0*Math.sin(ph);\n` +
    `    var msg='|\\u03c8\\u27e9 = '+fmt(c0)+'\\u2009|0\\u27e9 + ('+fmt(re)+(im<0?' \\u2212 ':' + ')+fmt(Math.abs(im))+'i)\\u2009|1\\u27e9';\n` +
    `    var phDeg=((ph*180/Math.PI)%360+360)%360; if(phDeg>=359.5) phDeg=0;\n` +
    `    msg+=' \\u00b7 \\u03b8 = '+(th*180/Math.PI).toFixed(0)+'\\u00b0, \\u03c6 = '+phDeg.toFixed(0)+'\\u00b0';\n` +
    `    msg+=' \\u00b7 (x, y, z) = ('+fmt(p[0])+', '+fmt(p[1])+', '+fmt(p[2])+')';\n` +
    `    msg+=' \\u00b7 Born: P(0) = <b>'+fmt(c0*c0)+'</b>, P(1) = <b>'+fmt(s0*s0)+'</b>';\n` +
    `    if(lastGate){ msg+=' \\u00b7 applied '+lastGate; }\n` +
    `    if(th<0.06||th>Math.PI-0.06){ msg+=' \\u00b7 at a pole \\u03c6 is pure gauge \\u2014 the state ignores it'; }\n` +
    `    out.innerHTML=msg;\n` +
    `  }\n` +
    `  // drag: deltas steer (phi, theta) — no hemisphere ambiguity\n` +
    `  function toSvg(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; return q.matrixTransform(svg.getScreenCTM().inverse()); }\n` +
    `  var dragging=false, last=null;\n` +
    `  svg.addEventListener('pointerdown',function(ev){ ev.preventDefault(); dragging=true; last=toSvg(ev); svg.style.cursor='grabbing'; try{svg.setPointerCapture(ev.pointerId);}catch(e){} });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!dragging) return; const p=toSvg(ev);\n` +
    `    lastGate=null; ph+=(p.x-last.x)*0.012; th+=(p.y-last.y)*0.010;\n` +
    `    th=Math.max(0.001,Math.min(Math.PI-0.001,th)); last=p; ghost=null; render(); });\n` +
    `  window.addEventListener('pointerup',function(){ dragging=false; svg.style.cursor='grab'; });\n` +
    `  // gates as sphere maps (computed in Cartesian, back to angles)\n` +
    `  function setFromVec(v){ th=Math.acos(Math.max(-1,Math.min(1,v[2]))); ph=Math.atan2(v[1],v[0]); }\n` +
    `  function gate(map,name){ ghost=[th,ph]; lastGate=name; const v=bloch(th,ph); setFromVec(map(v)); render(); }\n` +
    `  const bx=$('#${widgetId}-gx'); if(bx) bx.addEventListener('click',function(){ gate(function(v){ return [v[0],-v[1],-v[2]]; },'X: \\u03c0 about x\\u0302'); });\n` +
    `  const bz=$('#${widgetId}-gz'); if(bz) bz.addEventListener('click',function(){ gate(function(v){ return [-v[0],-v[1],v[2]]; },'Z: \\u03c0 about z\\u0302'); });\n` +
    `  const bh=$('#${widgetId}-gh'); if(bh) bh.addEventListener('click',function(){ gate(function(v){ return [v[2],-v[1],v[0]]; },'H: \\u03c0 about (x\\u0302+z\\u0302)/\\u221a2'); });\n` +
    `  const rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ th=${th0}; ph=${ph0}; ghost=null; render(); });\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
