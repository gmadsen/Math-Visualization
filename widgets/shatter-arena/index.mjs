// shatter-arena widget — shared registry renderer for the "construct-to-break"
// gesture: the reader places points and tries to SHATTER them with a hypothesis
// class. The engine enumerates all 2^m labelings, asks the author's
// realizes(plus, minus) whether each is realizable, and renders the verdict —
// SHATTERED, or the FORCED WITNESS (the ± split no hypothesis can produce).
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns point placement (click to add, drag to move, click to
// delete), the all-dichotomies check, the witness highlight, the verdict, and
// Reset. The hypothesis class is author-supplied via realizes(plus, minus).
//
// jsdom-safe: createSVGPoint/getScreenCTM run only inside the pointer handlers.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 560 420';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 560;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 420;
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
    range = 5, maxPoints = 6, className = 'a hypothesis',
  } = params;
  const hasVc = params.vcDim != null;
  const initial = Array.isArray(params.initialPoints) && params.initialPoints.length
    ? params.initialPoints
    : [[-2.4, -1.8], [2.4, -1.8], [0, 2.6]];
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const R=${range}, MAXP=${maxPoints}, CLS=${JSON.stringify(className)};\n` +
    `  const HASVC=${hasVc}, VC=${hasVc ? params.vcDim : 0}, INIT=${JSON.stringify(initial)};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 560 420').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3], pad=24, S=(Math.min(W,Hh)-2*pad)/(2*R), cx=W/2, cy=Hh/2;\n` +
    `  function PX(x){ return cx + x*S; }\n` +
    `  function PY(y){ return cy - y*S; }\n` +
    `  function XV(p){ return (p-cx)/S; }\n` +
    `  function YV(p){ return (cy-p)/S; }\n` +
    `  // ---- author hook: realizes(plus, minus) ----\n` +
    bodyScript + `\n` +
    `  var pts=INIT.map(function(p){ return {x:p[0], y:p[1]}; });\n` +
    `  // ---- shattering test: enumerate all 2^m dichotomies ----\n` +
    `  function analyze(){ var m=pts.length, total=(1<<m), realized=0, witness=null;\n` +
    `    for(var k=0;k<total;k++){ var plus=[], minus=[];\n` +
    `      for(var b=0;b<m;b++){ if(k&(1<<b)) plus.push([pts[b].x,pts[b].y]); else minus.push([pts[b].x,pts[b].y]); }\n` +
    `      if(realizes(plus,minus)) realized++; else if(witness==null) witness=k; }\n` +
    `    return {m:m, total:total, realized:realized, shattered:(realized===total), witness:witness}; }\n` +
    `  function render(){\n` +
    `    while(G.firstChild)G.removeChild(G.firstChild);\n` +
    `    // frame\n` +
    `    G.appendChild(SVG('rect',{x:PX(-R),y:PY(R),width:2*R*S,height:2*R*S,fill:'none',stroke:'var(--line)','stroke-width':1}));\n` +
    `    var a=analyze();\n` +
    `    // points: coloured by the witness split if not shattered, else neutral\n` +
    `    for(var i=0;i<pts.length;i++){ var col='var(--cyan)', fill='var(--cyan)';\n` +
    `      if(a.witness!=null){ var isPlus=(a.witness&(1<<i))!==0; col=isPlus?'var(--pink)':'var(--blue)'; fill=isPlus?'var(--pink)':'var(--panel)'; }\n` +
    `      G.appendChild(SVG('circle',{cx:PX(pts[i].x),cy:PY(pts[i].y),r:9,fill:fill,stroke:col,'stroke-width':2.4})); }\n` +
    `    // verdict text inside the frame\n` +
    `    var banner;\n` +
    `    if(pts.length===0){ banner='click to place points'; }\n` +
    `    else if(a.shattered){ banner='\\u2713 SHATTERED'; }\n` +
    `    else { banner='\\u2717 cannot be shattered'; }\n` +
    `    var bt=SVG('text',{x:W/2,y:PY(R)+22,'font-size':15,'font-weight':600,fill:a.shattered?'var(--green)':'var(--pink)','text-anchor':'middle'}); bt.textContent=banner; G.appendChild(bt);\n` +
    `    if(a.witness!=null){ var leg=SVG('text',{x:W/2,y:PY(R)+40,'font-size':11,fill:'var(--mute)','text-anchor':'middle'}); leg.textContent='this split (pink vs hollow) cannot be cut off by '+CLS+' \\u2014 the forced witness'; G.appendChild(leg); }\n` +
    `    // readout\n` +
    `    var verdict;\n` +
    `    if(pts.length===0){ verdict='place points by clicking; drag to move, click a point to delete'; }\n` +
    `    else if(a.shattered){ verdict='<b style=\\"color:var(--green)\\">SHATTERED</b> \\u2014 all '+a.total+' labelings of these '+a.m+' points are realizable by '+CLS+(HASVC?' (so VC \\u2265 '+a.m+')':''); }\n` +
    `    else { verdict='<b style=\\"color:var(--pink)\\">not shattered</b> \\u2014 only '+a.realized+' of '+a.total+' labelings realizable; the highlighted \\u00b1 split cannot be cut off by '+CLS;\n` +
    `      if(HASVC && a.m>VC){ verdict+='. This is not just your placement \\u2014 VC = '+VC+', so <b>no</b> '+a.m+' points can ever be shattered (see the convex-hull argument above).'; } }\n` +
    `    out.innerHTML=verdict+' &nbsp;\\u00b7&nbsp; '+pts.length+'/'+MAXP+' points';\n` +
    `  }\n` +
    `  // ---- placement: click empty = add, drag = move, click point = delete ----\n` +
    `  function toData(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; const p=q.matrixTransform(svg.getScreenCTM().inverse()); return {x:XV(p.x), y:YV(p.y)}; }\n` +
    `  function hit(d){ for(var i=0;i<pts.length;i++){ if(Math.hypot(pts[i].x-d.x,pts[i].y-d.y)<0.5) return i; } return -1; }\n` +
    `  var drag=-1, moved=false, pressX=0, pressY=0;\n` +
    `  svg.addEventListener('pointerdown',function(ev){ var d=toData(ev); var i=hit(d);\n` +
    `    if(i>=0){ drag=i; moved=false; pressX=d.x; pressY=d.y; ev.preventDefault(); try{svg.setPointerCapture(ev.pointerId);}catch(e){} }\n` +
    `    else if(pts.length<MAXP && Math.abs(d.x)<=R && Math.abs(d.y)<=R){ pts.push({x:d.x,y:d.y}); render(); } });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(drag<0)return; var d=toData(ev); pts[drag].x=Math.max(-R,Math.min(R,d.x)); pts[drag].y=Math.max(-R,Math.min(R,d.y)); if(Math.hypot(d.x-pressX,d.y-pressY)>0.12) moved=true; render(); });\n` +
    `  window.addEventListener('pointerup',function(){ if(drag>=0 && !moved){ pts.splice(drag,1); render(); } drag=-1; });\n` +
    `  var rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ pts=INIT.map(function(p){ return {x:p[0],y:p[1]}; }); render(); });\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
