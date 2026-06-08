// unroll-the-cover widget — shared registry renderer for the "wind-loop" gesture:
// the universal cover p : R -> S^1, t |-> e^{2 pi i t}. The reader drags a point
// around the base circle; the engine tracks the UNWRAPPED angle, so going around
// once raises the lift by one. The cover R is drawn as a vertical real line whose
// integer ticks are the fibre Z over the basepoint; the lift endpoint lands on an
// integer when the loop closes — that integer is the winding number = pi_1(S^1)=Z.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// jsdom-safe: createSVGPoint/getScreenCTM run only inside the pointer handlers.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 600 420';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 600;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 420;
  const svgTitle = params.svgTitle || title;
  const closeLabel = params.closeLabel || 'Close the loop';
  const resetLabel = params.resetLabel || '↺ Reset';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:grab;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-close" type="button">${closeLabel}</button>\n` +
    `    <button id="${widgetId}-reset" type="button">${resetLabel}</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId, maxTurns = 3 } = params;
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const MAXT=${maxTurns}, TAU=2*Math.PI;\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 600 420').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3];\n` +
    `  const cxL=W*0.27, cyC=Hh*0.52, RR=Math.min(W,Hh)*0.27;\n` +
    `  const cxR=W*0.74, yTop=Hh*0.12, yBot=Hh*0.92;\n` +
    `  function yOfT(t){ return yTop + (MAXT - t)/(2*MAXT)*(yBot - yTop); }\n` +
    `  let Phi=0;          // unwrapped angle in radians (Phi/TAU = lift t)\n` +
    `  function f(n){ return (n<0?'\\u2212':'')+Math.abs(n).toFixed(2); }\n` +
    `  function render(){\n` +
    `    while(G.firstChild)G.removeChild(G.firstChild);\n` +
    `    var t=Phi/TAU;\n` +
    `    // ===== LEFT: base circle S^1 with the winding spiral =====\n` +
    `    G.appendChild(SVG('circle',{cx:cxL,cy:cyC,r:RR,fill:'none',stroke:'var(--line)','stroke-width':1.5}));\n` +
    `    G.appendChild(SVG('text',{x:cxL,y:cyC-RR-8,'font-size':12,fill:'var(--mute)','text-anchor':'middle'})).textContent='S\\u00b9';\n` +
    `    // basepoint * at angle 0 (right)\n` +
    `    G.appendChild(SVG('circle',{cx:cxL+RR,cy:cyC,r:4,fill:'var(--mute)'}));\n` +
    `    var bl=SVG('text',{x:cxL+RR+8,y:cyC+4,'font-size':12,fill:'var(--mute)'}); bl.textContent='\\u2217'; G.appendChild(bl);\n` +
    `    // winding spiral from s=0 to s=t (radius shrinks 7px per turn so loops nest)\n` +
    `    var d='', N=Math.max(2,Math.round(Math.abs(t)*60)+2);\n` +
    `    for(var i=0;i<=N;i++){ var s=t*i/N, r=RR-7*Math.abs(s); var ang=TAU*s;\n` +
    `      var x=cxL+r*Math.cos(ang), y=cyC-r*Math.sin(ang); d+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' '; }\n` +
    `    G.appendChild(SVG('path',{d:d,fill:'none',stroke:'var(--cyan)','stroke-width':2.2}));\n` +
    `    // current point P at s=t\n` +
    `    var rP=RR-7*Math.abs(t), aP=TAU*t, Px=cxL+rP*Math.cos(aP), Py=cyC-rP*Math.sin(aP);\n` +
    `    G.appendChild(SVG('circle',{cx:Px,cy:Py,r:7,fill:'var(--cyan)',stroke:'var(--ink)','stroke-width':1.5}));\n` +
    `    var pl=SVG('text',{x:Px+9,y:Py+4,'font-size':12,fill:'var(--cyan)'}); pl.textContent='\\u03b3'; G.appendChild(pl);\n` +
    `    // ===== RIGHT: cover R as a vertical real line, fibre Z over * =====\n` +
    `    G.appendChild(SVG('line',{x1:cxR,y1:yTop,x2:cxR,y2:yBot,stroke:'var(--ink)','stroke-width':1.5}));\n` +
    `    G.appendChild(SVG('text',{x:cxR,y:yTop-10,'font-size':12,fill:'var(--mute)','text-anchor':'middle'})).textContent='\\u211d  (cover)';\n` +
    `    for(var k=-MAXT;k<=MAXT;k++){ var yk=yOfT(k); G.appendChild(SVG('line',{x1:cxR-6,y1:yk,x2:cxR+6,y2:yk,stroke:k===0?'var(--mute)':'var(--line)','stroke-width':k===0?2:1}));\n` +
    `      var tk=SVG('text',{x:cxR+12,y:yk+4,'font-size':11,fill:k===0?'var(--ink)':'var(--mute)'}); tk.textContent=(k>0?'+':'')+k+(k===0?'   = basepoint *':''); G.appendChild(tk); }\n` +
    `    var fl=SVG('text',{x:cxR-46,y:(yTop+yBot)/2,'font-size':11,fill:'var(--mute)','text-anchor':'middle','transform':'rotate(-90 '+(cxR-46)+' '+((yTop+yBot)/2)+')'}); fl.textContent='fibre = \\u2124'; G.appendChild(fl);\n` +
    `    // the lifted path from 0 to t\n` +
    `    var tc=Math.max(-MAXT,Math.min(MAXT,t));\n` +
    `    G.appendChild(SVG('line',{x1:cxR,y1:yOfT(0),x2:cxR,y2:yOfT(tc),stroke:'var(--cyan)','stroke-width':4,opacity:0.7}));\n` +
    `    G.appendChild(SVG('circle',{cx:cxR,cy:yOfT(tc),r:7,fill:'var(--cyan)',stroke:'var(--ink)','stroke-width':1.5}));\n` +
    `    var lift=SVG('text',{x:cxR-12,y:yOfT(tc)+4,'font-size':12,fill:'var(--cyan)','text-anchor':'end'}); lift.textContent='lift'; G.appendChild(lift);\n` +
    `    // connector p(lift)=P\n` +
    `    var arr=SVG('text',{x:(cxL+RR+cxR)/2,y:Hh*0.28,'font-size':11,fill:'var(--mute)','text-anchor':'middle'}); arr.textContent='p : \\u211d \\u2192 S\\u00b9,  t \\u21a6 e^{2\\u03c0it}'; G.appendChild(arr);\n` +
    `    // ===== readout =====\n` +
    `    var frac=Math.abs(t-Math.round(t)), closed=frac<0.02;\n` +
    `    var base='lift t = \\u03a6/2\\u03c0 = <b>'+f(t)+'</b> turn'+(Math.abs(t-1)<1e-9?'':'s')+' &nbsp;\\u00b7&nbsp; \\u03b3 is at e^{2\\u03c0i\\u00b7'+f(t)+'} on S\\u00b9';\n` +
    `    if(closed){ var wn=Math.round(t); var wstr=(wn>0?'+':(wn<0?'\\u2212':''))+Math.abs(wn); base+=' &nbsp;\\u00b7&nbsp; <b style=\\"color:var(--green)\\">loop closed: winding number = '+wstr+' \\u2208 \\u03c0\\u2081(S\\u00b9) = \\u2124</b>'; }\n` +
    `    else { base+=' &nbsp;\\u00b7&nbsp; drag back to \\u2217 to close the loop and read the integer'; }\n` +
    `    out.innerHTML=base;\n` +
    `  }\n` +
    `  // ---- drag to wind: accumulate the unwrapped angle ----\n` +
    `  function ang(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; const p=q.matrixTransform(svg.getScreenCTM().inverse()); return Math.atan2(cyC-p.y, p.x-cxL); }\n` +
    `  let drag=false, lastA=0;\n` +
    `  svg.addEventListener('pointerdown',function(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; const p=q.matrixTransform(svg.getScreenCTM().inverse()); if(p.x<cxL+RR+40){ drag=true; lastA=ang(ev); ev.preventDefault(); try{svg.setPointerCapture(ev.pointerId);}catch(e){} } });\n` +
    `  // accumulate the unwrapped angle: each move's delta is reduced to (-pi,pi] and added,\n` +
    `  // which lifts atan2 continuously across its branch cut. Assumes no single pointermove\n` +
    `  // jumps more than half a turn (true at any real pointer sampling rate).\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!drag)return; var a=ang(ev), dA=a-lastA; while(dA>Math.PI)dA-=TAU; while(dA<-Math.PI)dA+=TAU; Phi+=dA; lastA=a; render(); });\n` +
    `  window.addEventListener('pointerup',function(){ drag=false; });\n` +
    `  var cb=$('#${widgetId}-close'); if(cb) cb.addEventListener('click',function(){ Phi=Math.round(Phi/TAU)*TAU; render(); });\n` +
    `  var rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ Phi=0; render(); });\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
