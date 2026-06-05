// graph-edit-2d widget — shared registry renderer for the "graph-edit" gesture:
// the reader builds a small graph by direct manipulation (click empty space to
// add a vertex, drag between two vertices to toggle an edge, click a vertex to
// delete it), and an author-supplied draw(g) re-renders the graph plus any live
// invariant after every edit.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the edit gesture: pointer hit-testing against the vertex
// positions, the rubber-band line during an edge drag, add / delete / toggle,
// and a Reset. The author writes only `function draw(g){…}` (params.bodyScript),
// which clears+redraws the SVG group `G`, writes the readout `out`, and reads the
// live model g.nodes / g.edges / g.adj / g.deg(id) / g.n / g.m / g.R.
//
// jsdom-safe: createSVGPoint/getScreenCTM run only inside the pointer handlers,
// never at init (init just calls draw(g) once). A non-HTML frontend can ignore
// renderScript and drive its own editing from the schema.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 640 380';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 640;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 380;
  const svgTitle = params.svgTitle || title;
  const resetLabel = params.resetLabel || '↺ Reset';
  const outputInitial = params.outputInitial != null ? params.outputInitial : '&nbsp;';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:pointer"><title>${svgTitle}</title></svg>\n` +
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
    nodeRadius = 16,
    pad = 24,
  } = params;
  const nodesJson = Array.isArray(params.initialNodes)
    ? JSON.stringify(params.initialNodes)
    : '[]';
  const edgesJson = Array.isArray(params.initialEdges)
    ? JSON.stringify(params.initialEdges)
    : '[]';
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const R=${nodeRadius}, PAD=${pad};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 640 380').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3];\n` +
    `  const N0=${nodesJson}, E0=${edgesJson};\n` +
    `  let nodes=[], edges=[], idc=0;\n` +
    `  function clampX(x){ return Math.max(PAD,Math.min(W-PAD,x)); }\n` +
    `  function clampY(y){ return Math.max(PAD,Math.min(Hh-PAD,y)); }\n` +
    `  function reset(){\n` +
    `    nodes=N0.map(function(p,i){ return {id:i,x:clampX(p[0]),y:clampY(p[1])}; });\n` +
    `    idc=nodes.length;\n` +
    `    edges=[];\n` +
    `    E0.forEach(function(e){ addEdge(e[0],e[1]); });\n` +
    `  }\n` +
    `  function hasEdge(a,b){ const u=Math.min(a,b),v=Math.max(a,b); return edges.some(function(e){return e.u===u&&e.v===v;}); }\n` +
    `  function addEdge(a,b){ if(a===b)return; const u=Math.min(a,b),v=Math.max(a,b);\n` +
    `    if(!nodes.some(n=>n.id===u)||!nodes.some(n=>n.id===v))return;\n` +
    `    if(!hasEdge(u,v)) edges.push({u:u,v:v}); }\n` +
    `  function toggleEdge(a,b){ if(a===b)return; const u=Math.min(a,b),v=Math.max(a,b);\n` +
    `    const i=edges.findIndex(function(e){return e.u===u&&e.v===v;});\n` +
    `    if(i>=0) edges.splice(i,1); else edges.push({u:u,v:v}); }\n` +
    `  function addNode(x,y){ nodes.push({id:idc++,x:clampX(x),y:clampY(y)}); }\n` +
    `  function delNode(id){ nodes=nodes.filter(n=>n.id!==id);\n` +
    `    edges=edges.filter(function(e){return e.u!==id&&e.v!==id;}); }\n` +
    `  // ---- live model handed to the author's draw(g) ----\n` +
    `  function model(){\n` +
    `    const adj={}; nodes.forEach(function(n){ adj[n.id]=[]; });\n` +
    `    edges.forEach(function(e){ if(adj[e.u]&&adj[e.v]){ adj[e.u].push(e.v); adj[e.v].push(e.u); } });\n` +
    `    return { nodes:nodes, edges:edges, adj:adj, n:nodes.length, m:edges.length, R:R,\n` +
    `             deg:function(id){ return adj[id]?adj[id].length:0; } };\n` +
    `  }\n` +
    `  function render(){ draw(model()); }\n` +
    `  // ---- author draw(g) (clears+fills G, writes out) ----\n` +
    bodyScript + `\n` +
    `  // ---- graph-edit engine (supplied by graph-edit-2d) ----\n` +
    `  function toSvg(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; return q.matrixTransform(svg.getScreenCTM().inverse()); }\n` +
    `  function hit(pt){ let best=null,bd=(R*1.25)*(R*1.25); for(let k=0;k<nodes.length;k++){ const nd=nodes[k], dx=nd.x-pt.x, dy=nd.y-pt.y, d=dx*dx+dy*dy; if(d<bd){bd=d;best=nd;} } return best; }\n` +
    `  let from=null, downPt=null, moved=false, rb=null;\n` +
    `  svg.addEventListener('pointerdown',function(ev){ ev.preventDefault(); const pt=toSvg(ev); downPt=pt; moved=false; from=hit(pt); try{svg.setPointerCapture(ev.pointerId);}catch(e){} });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(downPt==null)return; const pt=toSvg(ev);\n` +
    `    if(Math.abs(pt.x-downPt.x)+Math.abs(pt.y-downPt.y)>4) moved=true;\n` +
    `    if(from){ if(!rb){ rb=SVG('line',{stroke:'var(--mute)','stroke-width':2,'stroke-dasharray':'4 4','pointer-events':'none'}); svg.appendChild(rb); }\n` +
    `      rb.setAttribute('x1',from.x); rb.setAttribute('y1',from.y); rb.setAttribute('x2',pt.x); rb.setAttribute('y2',pt.y); } });\n` +
    `  window.addEventListener('pointerup',function(ev){ if(downPt==null)return; const pt=toSvg(ev); const tgt=hit(pt);\n` +
    `    if(rb){ svg.removeChild(rb); rb=null; }\n` +
    `    if(from){ if(tgt && tgt.id!==from.id) toggleEdge(from.id,tgt.id);\n` +
    `      else if(!moved && (!tgt||tgt.id===from.id)) delNode(from.id); }\n` +
    `    else if(!moved && !tgt) addNode(pt.x,pt.y);\n` +
    `    from=null; downPt=null; moved=false; render(); });\n` +
    `  const rbn=$('#${widgetId}-reset'); if(rbn) rbn.addEventListener('click',function(){ reset(); render(); });\n` +
    `  reset(); render();\n` +
    `})();\n` +
    `</script>`
  );
}
