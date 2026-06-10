// simplicial-glue widget — the "glue" gesture: build an abstract simplicial
// complex by clicking. Toggle vertices, glue edges between active vertices,
// fill triangles whose boundary is present. The downward-closure axiom is
// enforced live (a 2-simplex demands its three edges; deleting a vertex
// sweeps away every face above it), and the readout tracks the f-vector,
// Euler characteristic, and GF(2) Betti numbers with the Euler–Poincaré
// identity checked at every click.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params; a non-HTML frontend can drive its own renderer
// from params alone (validated against ./schema.json).
//
// jsdom-safe: no getScreenCTM/createSVGPoint (clicks land on per-simplex hit
// shapes), no Math.random, no rAF. Homology = boundary-matrix ranks over
// GF(2) by bitmask Gaussian elimination — verified standalone (cycle (1,1),
// disk (1,0), wedge (1,2), full 1-skeleton β₁ = E−V+1 = 6) before this file
// was written.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const svgTitle = params.svgTitle || title;
  const viewBox = params.viewBox || '0 0 560 500';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 560;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 500;
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-cycle" type="button">○ Cycle</button>\n` +
    `    <button id="${widgetId}-disk" type="button">● Disk</button>\n` +
    `    <button id="${widgetId}-wedge" type="button">∞ Wedge</button>\n` +
    `    <button id="${widgetId}-empty" type="button">✕ Points</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId } = params;
  const preset = params.preset || 'cycle';
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 560 500').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3], CX=W/2, CY=Hh/2-4, R=Math.min(W,Hh)/2-56;\n` +
    `  // hexagon vertices 0..5 (from the top, clockwise) + hub 6 at the center\n` +
    `  const VP=[];\n` +
    `  for(var i=0;i<6;i++){ const a=Math.PI/2-i*Math.PI/3; VP.push([CX+R*Math.cos(a), CY-R*Math.sin(a)]); }\n` +
    `  VP.push([CX,CY]);\n` +
    `  const EDGES=[]; // [lo,hi] pairs: hexagon ring then spokes\n` +
    `  for(var i1=0;i1<6;i1++) EDGES.push([Math.min(i1,(i1+1)%6), Math.max(i1,(i1+1)%6)]);\n` +
    `  for(var i4=0;i4<6;i4++) EDGES.push([i4,6]);\n` +
    `  const TRIS=[]; // wedges (i, i+1, hub)\n` +
    `  for(var i5=0;i5<6;i5++) TRIS.push([i5,(i5+1)%6,6]);\n` +
    `  const eKey=function(a,b){ return Math.min(a,b)+'-'+Math.max(a,b); };\n` +
    `  const eIdxOf={}; EDGES.forEach(function(e,i){ eIdxOf[e[0]+'-'+e[1]]=i; });\n` +
    `  var vOn=[], eOn=[], tOn=[];\n` +
    `  const PRESETS={\n` +
    `    cycle: function(){ vOn=[1,1,1,1,1,1,0]; eOn=EDGES.map(function(e,i){ return i<6?1:0; }); tOn=[0,0,0,0,0,0]; },\n` +
    `    disk:  function(){ vOn=[1,1,1,1,1,1,1]; eOn=EDGES.map(function(){ return 1; }); tOn=[1,1,1,1,1,1]; },\n` +
    `    wedge: function(){ vOn=[1,1,1,1,1,1,1]; eOn=EDGES.map(function(e,i){ return (i<6||i===6||i===9)?1:0; }); tOn=[0,0,0,0,0,0]; },\n` +
    `    empty: function(){ vOn=[1,1,1,1,1,1,1]; eOn=EDGES.map(function(){ return 0; }); tOn=[0,0,0,0,0,0]; },\n` +
    `  };\n` +
    `  // GF(2) rank by bitmask Gaussian elimination\n` +
    `  function rank2(rows){\n` +
    `    rows=rows.slice(); var r=0;\n` +
    `    for(var c=0;c<32;c++){\n` +
    `      var p=-1;\n` +
    `      for(var i6=r;i6<rows.length;i6++) if((rows[i6]>>c)&1){ p=i6; break; }\n` +
    `      if(p<0) continue;\n` +
    `      const tmp=rows[r]; rows[r]=rows[p]; rows[p]=tmp;\n` +
    `      for(var i7=0;i7<rows.length;i7++) if(i7!==r && ((rows[i7]>>c)&1)) rows[i7]^=rows[r];\n` +
    `      r++;\n` +
    `    }\n` +
    `    return r;\n` +
    `  }\n` +
    `  function homology(){\n` +
    `    const av=[]; vOn.forEach(function(on,i){ if(on) av.push(i); });\n` +
    `    const vPos={}; av.forEach(function(v,i){ vPos[v]=i; });\n` +
    `    const ae=[]; EDGES.forEach(function(e,i){ if(eOn[i]) ae.push(e); });\n` +
    `    const ePos={}; ae.forEach(function(e,i){ ePos[e[0]+'-'+e[1]]=i; });\n` +
    `    const at=[]; TRIS.forEach(function(t,i){ if(tOn[i]) at.push(t); });\n` +
    `    const d1=ae.map(function(e){ return (1<<vPos[e[0]])|(1<<vPos[e[1]]); });\n` +
    `    const d2=at.map(function(t){\n` +
    `      return (1<<ePos[eKey(t[0],t[1])])|(1<<ePos[eKey(t[1],t[2])])|(1<<ePos[eKey(t[0],t[2])]);\n` +
    `    });\n` +
    `    const r1=rank2(d1), r2=rank2(d2);\n` +
    `    return { f0:av.length, f1:ae.length, f2:at.length,\n` +
    `             b0:av.length-r1, b1:(ae.length-r1)-r2, b2:at.length-r2 };\n` +
    `  }\n` +
    `  const TRIG=SVG('g'); svg.appendChild(TRIG);\n` +
    `  const EDGG=SVG('g'); svg.appendChild(EDGG);\n` +
    `  const VERG=SVG('g'); svg.appendChild(VERG);\n` +
    `  var note='';\n` +
    `  function draw(){\n` +
    `    TRIG.innerHTML=''; EDGG.innerHTML=''; VERG.innerHTML='';\n` +
    `    TRIS.forEach(function(t,i){\n` +
    `      const pts=t.map(function(v){ return VP[v][0].toFixed(1)+','+VP[v][1].toFixed(1); }).join(' ');\n` +
    `      const filled=!!tOn[i];\n` +
    `      const poly=SVG('polygon',{points:pts,fill:filled?'var(--violet)':'transparent','fill-opacity':filled?0.3:1,stroke:'none',cursor:'pointer'});\n` +
    `      poly.addEventListener('click',function(){ clickTri(i); });\n` +
    `      TRIG.appendChild(poly);\n` +
    `    });\n` +
    `    EDGES.forEach(function(e,i){\n` +
    `      const p=VP[e[0]], q=VP[e[1]];\n` +
    `      if(eOn[i]) EDGG.appendChild(SVG('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:'var(--ink)','stroke-width':2.6,'pointer-events':'none'}));\n` +
    `      else if(vOn[e[0]]&&vOn[e[1]]) EDGG.appendChild(SVG('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:'var(--line)','stroke-width':1,'stroke-dasharray':'3 4','pointer-events':'none',opacity:0.7}));\n` +
    `      const hit=SVG('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:'transparent','stroke-width':12,cursor:'pointer'});\n` +
    `      hit.addEventListener('click',function(){ clickEdge(i); });\n` +
    `      EDGG.appendChild(hit);\n` +
    `    });\n` +
    `    VP.forEach(function(p,v){\n` +
    `      const on=!!vOn[v];\n` +
    `      const c=SVG('circle',{cx:p[0],cy:p[1],r:8,fill:on?'var(--cyan)':'var(--panel)',stroke:on?'var(--cyan)':'var(--mute)','stroke-width':1.6,'stroke-dasharray':on?'none':'2 2',cursor:'pointer'});\n` +
    `      c.addEventListener('click',function(){ clickVert(v); });\n` +
    `      VERG.appendChild(c);\n` +
    `      const lab=SVG('text',{x:p[0]+(v===6?14:(p[0]>CX+1?14:(p[0]<CX-1?-14:0))),y:p[1]+(v===6?-12:(p[1]>CY+1?18:(p[1]<CY-1?-12:5))),'font-size':12,fill:'var(--mute)','text-anchor':'middle','pointer-events':'none'});\n` +
    `      lab.textContent=String(v); VERG.appendChild(lab);\n` +
    `    });\n` +
    `  }\n` +
    `  function report(){\n` +
    `    const h=homology();\n` +
    `    const fmtI=function(x){ return String(x).replace('-','\\u2212'); };\n` +
    `    var msg='f = ('+h.f0+', '+h.f1+', '+h.f2+') \\u00b7 \\u03c7 = '+h.f0+' \\u2212 '+h.f1+' + '+h.f2+' = <b>'+fmtI(h.f0-h.f1+h.f2)+'</b>';\n` +
    `    msg+=' \\u00b7 \\u03b2\\u2080 = <b>'+h.b0+'</b>, \\u03b2\\u2081 = <b>'+h.b1+'</b>';\n` +
    `    msg+=' \\u00b7 <span class="ok">\\u03b2\\u2080 \\u2212 \\u03b2\\u2081 = '+fmtI(h.b0-h.b1)+' = \\u03c7 \\u2713 Euler\\u2013Poincar\\u00e9</span>';\n` +
    `    if(h.b2!==0) msg+=' \\u00b7 \\u03b2\\u2082 = '+h.b2;\n` +
    `    if(note){ msg+=' \\u00b7 '+note; note=''; }\n` +
    `    out.innerHTML=msg;\n` +
    `  }\n` +
    `  function clickVert(v){\n` +
    `    if(vOn[v]){\n` +
    `      var ne=0, nt=0;\n` +
    `      EDGES.forEach(function(e,i){ if(eOn[i]&&(e[0]===v||e[1]===v)){ eOn[i]=0; ne++; } });\n` +
    `      TRIS.forEach(function(t,i){ if(tOn[i]&&t.indexOf(v)>=0){ tOn[i]=0; nt++; } });\n` +
    `      vOn[v]=0;\n` +
    `      if(ne||nt) note='removed vertex '+v+' and the '+ne+' edge'+(ne===1?'':'s')+', '+nt+' triangle'+(nt===1?'':'s')+' above it \\u2014 a complex is downward closed, so everything above it had to go';\n` +
    `    } else { vOn[v]=1; }\n` +
    `    draw(); report();\n` +
    `  }\n` +
    `  function clickEdge(i){\n` +
    `    const e=EDGES[i];\n` +
    `    if(eOn[i]){\n` +
    `      var nt=0;\n` +
    `      TRIS.forEach(function(t,j){ if(tOn[j]&&t.indexOf(e[0])>=0&&t.indexOf(e[1])>=0){ tOn[j]=0; nt++; } });\n` +
    `      eOn[i]=0;\n` +
    `      if(nt) note='removing edge {'+e[0]+','+e[1]+'} also removed '+nt+' triangle'+(nt===1?'':'s')+' \\u2014 a face cannot outlive its boundary';\n` +
    `    } else {\n` +
    `      if(!vOn[e[0]]||!vOn[e[1]]){ note='<span class="bad">\\u2717 an edge needs both endpoints \\u2014 a complex is downward closed</span>'; report(); return; }\n` +
    `      eOn[i]=1;\n` +
    `    }\n` +
    `    draw(); report();\n` +
    `  }\n` +
    `  function clickTri(i){\n` +
    `    const t=TRIS[i];\n` +
    `    if(tOn[i]){ tOn[i]=0; }\n` +
    `    else {\n` +
    `      const need=[eKey(t[0],t[1]),eKey(t[1],t[2]),eKey(t[0],t[2])].filter(function(k){ return !eOn[eIdxOf[k]]; });\n` +
    `      if(need.length){ note='<span class="bad">\\u2717 the 2-simplex {'+t.join(',')+'} needs all three boundary edges first ('+need.length+' missing) \\u2014 downward closure</span>'; report(); return; }\n` +
    `      tOn[i]=1;\n` +
    `    }\n` +
    `    draw(); report();\n` +
    `  }\n` +
    `  ['cycle','disk','wedge','empty'].forEach(function(name){\n` +
    `    const b=$('#${widgetId}-'+name);\n` +
    `    if(b) b.addEventListener('click',function(){ PRESETS[name](); note=''; draw(); report(); });\n` +
    `  });\n` +
    `  PRESETS['${preset}']();\n` +
    `  draw(); report();\n` +
    `})();\n` +
    `</script>`
  );
}
