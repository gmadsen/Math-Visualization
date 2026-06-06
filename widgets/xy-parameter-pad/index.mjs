// xy-parameter-pad widget — shared registry renderer for the "two-parameter
// scrub" gesture: the reader drags ONE puck across a labeled 2D pad that drives
// two coupled parameters at once, over an author-defined regime map. The regime
// regions (and the codim-1 walls between them, which two sequential sliders can
// never land on) are painted by grid-sampling the author's classify(x,y).
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the grid shading, the overlay host, the drag gesture, and
// the readout. The author supplies classify(x,y) (required) and optionally
// value(x,y) / readout(x,y) / decorate(D) via params.bodyScript.
//
// jsdom-safe: createSVGPoint/getScreenCTM run only inside the pointer handlers.
// The shaded grid + overlays are a STATIC layer (built once); only the puck +
// readout redraw on drag.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 560 440';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 560;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 440;
  const svgTitle = params.svgTitle || title;
  const resetLabel = params.resetLabel || '↺ Reset';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:crosshair;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-reset" type="button">${resetLabel}</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const {
    widgetId, svgId, outputId, bodyScript,
    x0, x1, y0, y1, xLabel = 'x', yLabel = 'y', grid = 56, legendPos = 'tr',
  } = params;
  const xInit = params.xInit != null ? params.xInit : (x0 + x1) / 2;
  const yInit = params.yInit != null ? params.yInit : (y0 + y1) / 2;
  const regimes = Array.isArray(params.regimes) ? params.regimes : [];
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G1=SVG('g'), G2=SVG('g'); svg.appendChild(G1); svg.appendChild(G2);\n` +
    `  const X0=${x0}, X1=${x1}, Y0=${y0}, Y1=${y1}, GRID=${grid}, LEGPOS=${JSON.stringify(legendPos)};\n` +
    `  const XLAB=${JSON.stringify(xLabel)}, YLAB=${JSON.stringify(yLabel)};\n` +
    `  const REG=${JSON.stringify(regimes)};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 560 440').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3], padL=52, padR=16, padT=16, padB=44;\n` +
    `  const bx0=padL, bx1=W-padR, by0=Hh-padB, by1=padT; // pad pixel box (by0=bottom edge)\n` +
    `  function PX(x){ return bx0+(x-X0)/(X1-X0)*(bx1-bx0); }\n` +
    `  function PY(y){ return by0-(y-Y0)/(Y1-Y0)*(by0-by1); }\n` +
    `  function XV(p){ return X0+(p-bx0)/(bx1-bx0)*(X1-X0); }\n` +
    `  function YV(p){ return Y0+(by0-p)/(by0-by1)*(Y1-Y0); }\n` +
    `  // ---- author hooks: classify(x,y) required; value/readout/decorate optional ----\n` +
    bodyScript + `\n` +
    `  var hasValue=(typeof value==='function'), hasReadout=(typeof readout==='function'), hasDecorate=(typeof decorate==='function');\n` +
    `  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }\n` +
    `  function fmt(n){ return (n<0?'\\u2212':'')+Math.abs(n).toFixed(2); }\n` +
    `  let px=${xInit}, py=${yInit};\n` +
    `  // ===== static layer: shaded regime map + axes + overlays (built once) =====\n` +
    `  function buildStatic(){\n` +
    `    while(G1.firstChild)G1.removeChild(G1.firstChild);\n` +
    `    var aspect=(bx1-bx0)/(by0-by1), NX=GRID, NY=Math.max(8,Math.round(GRID/aspect));\n` +
    `    var cw=(bx1-bx0)/NX, ch=(by0-by1)/NY;\n` +
    `    for(var i=0;i<NX;i++){ for(var j=0;j<NY;j++){\n` +
    `      var xc=X0+(i+0.5)/NX*(X1-X0), yc=Y0+(j+0.5)/NY*(Y1-Y0);\n` +
    `      var r=classify(xc,yc); if(r==null||!REG[r]) continue;\n` +
    `      G1.appendChild(SVG('rect',{x:(bx0+i*cw).toFixed(2),y:(by1+(NY-1-j)*ch).toFixed(2),width:(cw+0.6).toFixed(2),height:(ch+0.6).toFixed(2),fill:REG[r].color,'fill-opacity':0.17,stroke:'none'})); } }\n` +
    `    G1.appendChild(SVG('rect',{x:bx0,y:by1,width:bx1-bx0,height:by0-by1,fill:'none',stroke:'var(--line)','stroke-width':1}));\n` +
    `    if(X0<0&&X1>0){ G1.appendChild(SVG('line',{x1:PX(0),y1:by1,x2:PX(0),y2:by0,stroke:'var(--mute)','stroke-width':1,opacity:0.35,'stroke-dasharray':'2 3'})); }\n` +
    `    if(Y0<0&&Y1>0){ G1.appendChild(SVG('line',{x1:bx0,y1:PY(0),x2:bx1,y2:PY(0),stroke:'var(--mute)','stroke-width':1,opacity:0.35,'stroke-dasharray':'2 3'})); }\n` +
    `    if(hasDecorate) decorate({ add:function(el){G1.appendChild(el);}, SVG:SVG, PX:PX, PY:PY, x0:X0, x1:X1, y0:Y0, y1:Y1 });\n` +
    `    function tick(v,horiz){ if(horiz){ G1.appendChild(SVG('line',{x1:PX(v),y1:by0,x2:PX(v),y2:by0+4,stroke:'var(--mute)','stroke-width':1})); var t=SVG('text',{x:PX(v),y:by0+16,'font-size':10,fill:'var(--mute)','text-anchor':'middle'}); t.textContent=fmt(v); G1.appendChild(t); }\n` +
    `      else { G1.appendChild(SVG('line',{x1:bx0-4,y1:PY(v),x2:bx0,y2:PY(v),stroke:'var(--mute)','stroke-width':1})); var t2=SVG('text',{x:bx0-7,y:PY(v)+3,'font-size':10,fill:'var(--mute)','text-anchor':'end'}); t2.textContent=fmt(v); G1.appendChild(t2); } }\n` +
    `    tick(X0,true); tick((X0+X1)/2,true); tick(X1,true);\n` +
    `    tick(Y0,false); tick((Y0+Y1)/2,false); tick(Y1,false);\n` +
    `    var xl=SVG('text',{x:(bx0+bx1)/2,y:Hh-6,'font-size':12,fill:'var(--ink)','text-anchor':'middle'}); xl.textContent=XLAB; G1.appendChild(xl);\n` +
    `    var yl=SVG('text',{x:14,y:(by0+by1)/2,'font-size':12,fill:'var(--ink)','text-anchor':'middle','transform':'rotate(-90 14 '+((by0+by1)/2)+')'}); yl.textContent=YLAB; G1.appendChild(yl);\n` +
    `    if(LEGPOS!=='none'){ var lgW=128, lgRows=REG.length*15+6;\n` +
    `      var lx=(LEGPOS==='tl'||LEGPOS==='bl')?bx0+8:bx1-lgW-2;\n` +
    `      var ly0=(LEGPOS==='bl'||LEGPOS==='br')?by0-lgRows-2:by1+6;\n` +
    `      for(var k=0;k<REG.length;k++){ var ly=ly0+13+k*15;\n` +
    `        G1.appendChild(SVG('rect',{x:lx,y:ly-9,width:11,height:11,fill:REG[k].color,'fill-opacity':0.5,stroke:REG[k].color,'stroke-width':1}));\n` +
    `        var lt=SVG('text',{x:lx+15,y:ly,'font-size':11,fill:'var(--ink)'}); lt.textContent=REG[k].label; G1.appendChild(lt); } }\n` +
    `  }\n` +
    `  // ===== dynamic layer: puck + crosshair + readout =====\n` +
    `  function drawDyn(){\n` +
    `    while(G2.firstChild)G2.removeChild(G2.firstChild);\n` +
    `    var cx=PX(px), cy=PY(py);\n` +
    `    G2.appendChild(SVG('line',{x1:cx,y1:by1,x2:cx,y2:by0,stroke:'var(--yellow)','stroke-width':1,opacity:0.45}));\n` +
    `    G2.appendChild(SVG('line',{x1:bx0,y1:cy,x2:bx1,y2:cy,stroke:'var(--yellow)','stroke-width':1,opacity:0.45}));\n` +
    `    G2.appendChild(SVG('circle',{cx:cx,cy:cy,r:8,fill:'var(--yellow)',stroke:'var(--ink)','stroke-width':1.6}));\n` +
    `    var r=classify(px,py); var reg=(r!=null&&REG[r])?REG[r]:null;\n` +
    `    var head=XLAB+' = <b>'+fmt(px)+'</b> &nbsp;\\u00b7&nbsp; '+YLAB+' = <b>'+fmt(py)+'</b>';\n` +
    `    var regHtml=reg?(' &nbsp;\\u00b7&nbsp; <b style=\\"color:'+reg.color+'\\">'+reg.label+'</b>'):'';\n` +
    `    var extra='';\n` +
    `    if(hasReadout){ extra=' &nbsp;\\u00b7&nbsp; '+readout(px,py); }\n` +
    `    else if(hasValue){ extra=' &nbsp;\\u00b7&nbsp; '+fmt(value(px,py)); }\n` +
    `    out.innerHTML=head+regHtml+extra;\n` +
    `  }\n` +
    `  function toData(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; const p=q.matrixTransform(svg.getScreenCTM().inverse()); return p; }\n` +
    `  function setFrom(ev){ var p=toData(ev); px=clamp(XV(p.x),Math.min(X0,X1),Math.max(X0,X1)); py=clamp(YV(p.y),Math.min(Y0,Y1),Math.max(Y0,Y1)); drawDyn(); }\n` +
    `  let drag=false;\n` +
    `  svg.addEventListener('pointerdown',function(ev){ var p=toData(ev); if(p.x>=bx0-12&&p.x<=bx1+12&&p.y>=by1-12&&p.y<=by0+12){ drag=true; ev.preventDefault(); try{svg.setPointerCapture(ev.pointerId);}catch(e){} setFrom(ev); } });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!drag)return; setFrom(ev); });\n` +
    `  window.addEventListener('pointerup',function(){ drag=false; });\n` +
    `  var rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ px=${xInit}; py=${yInit}; drawDyn(); });\n` +
    `  buildStatic(); drawDyn();\n` +
    `})();\n` +
    `</script>`
  );
}
