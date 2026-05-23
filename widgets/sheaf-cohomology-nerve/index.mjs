// sheaf-cohomology-nerve widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The combinatorics are intrinsic; params carry only
// chrome. The widget draws a good cover (of S^1 or of a contractible interval)
// by N overlapping arcs, its nerve simplicial complex, and the Čech cohomology
// of the constant sheaf — which equals the simplicial cohomology of the nerve.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <button type="button" id="${widgetId}-circle">cover of $S^1$</button>\n` +
    `    <button type="button" id="${widgetId}-interval">cover of an interval</button>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">number of sets $N$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="3" max="6" value="4" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nval">N = 4</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="A good cover, its nerve simplicial complex, and the Čech cohomology of the constant sheaf"><title>The nerve of a cover: Čech cohomology of the constant sheaf equals simplicial cohomology of the nerve</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* sheaf-cohomology-nerve widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var nIn=document.getElementById('${widgetId}-n'), nL=document.getElementById('${widgetId}-nval');\n` +
    `  var bC=document.getElementById('${widgetId}-circle'), bI=document.getElementById('${widgetId}-interval');\n` +
    `  if(!svg || !out || !nIn || !nL || !bC || !bI) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  var PAL=['var(--yellow)','var(--cyan)','var(--green)','var(--pink)','var(--violet)','var(--blue)'];\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'middle', 'font-size':opt.size||11, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  function pc(cx,cy,R,a){ return [cx+R*Math.cos(a), cy+R*Math.sin(a)]; }\n` +
    `  function arcPath(cx,cy,R,a1,a2){ var p1=pc(cx,cy,R,a1), p2=pc(cx,cy,R,a2); var large=(a2-a1)>Math.PI?1:0; return 'M'+p1[0]+' '+p1[1]+' A'+R+' '+R+' 0 '+large+' 1 '+p2[0]+' '+p2[1]; }\n` +
    `  function zk(k){ return k===0 ? '0' : (k===1 ? '\\u2124' : '\\u2124^'+k); }\n` +
    `  var topo='circle';\n` +
    `  function draw(){\n` +
    `    var N=+nIn.value; nL.textContent='N = '+N;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    bC.classList.toggle('active', topo==='circle'); bC.setAttribute('aria-pressed', topo==='circle');\n` +
    `    bI.classList.toggle('active', topo==='interval'); bI.setAttribute('aria-pressed', topo==='interval');\n` +
    `    var E = (topo==='circle') ? N : (N-1);    // nerve edges: cyclic vs path\n` +
    `    var b0 = 1, b1 = E - N + b0;               // Euler/Betti of the nerve graph\n` +
    `    // ---- left: the cover ----\n` +
    `    txt(120, 28, 'cover by '+N+' overlapping sets', {size:11, fill:'var(--mute)', italic:true});\n` +
    `    if(topo==='circle'){\n` +
    `      var cx=120, cy=150, R=72;\n` +
    `      svg.appendChild(mk('circle', {cx:cx, cy:cy, r:R, fill:'none', stroke:'var(--line)', 'stroke-width':1, 'stroke-dasharray':'3 4'}));\n` +
    `      for(var i=0;i<N;i++){ var mid=-Math.PI/2 + i*2*Math.PI/N, half=(Math.PI/N)*1.18;\n` +
    `        svg.appendChild(mk('path', {d:arcPath(cx,cy,R, mid-half, mid+half), fill:'none', stroke:PAL[i%PAL.length], 'stroke-width':6, 'stroke-linecap':'round', opacity:0.85}));\n` +
    `        var lp=pc(cx,cy,R+18, mid); txt(lp[0], lp[1]+3, 'U'+i, {size:10, fill:PAL[i%PAL.length]}); }\n` +
    `    } else {\n` +
    `      var x0=40, x1=200, yL=150, seg=(x1-x0)/N;\n` +
    `      svg.appendChild(mk('line', {x1:x0, y1:yL, x2:x1, y2:yL, stroke:'var(--line)', 'stroke-width':1, 'stroke-dasharray':'3 4'}));\n` +
    `      for(var j=0;j<N;j++){ var c=x0+(j+0.5)*seg, hl=seg*0.62, yy=yL+((j%2)?12:-12);\n` +
    `        svg.appendChild(mk('line', {x1:c-hl, y1:yy, x2:c+hl, y2:yy, stroke:PAL[j%PAL.length], 'stroke-width':6, 'stroke-linecap':'round', opacity:0.85}));\n` +
    `        txt(c, yy+((j%2)?16:-10), 'U'+j, {size:10, fill:PAL[j%PAL.length]}); }\n` +
    `    }\n` +
    `    // ---- right: the nerve graph ----\n` +
    `    txt(410, 28, 'nerve N(U)', {size:11, fill:'var(--mute)', italic:true});\n` +
    `    var VX=[], VY=[];\n` +
    `    if(topo==='circle'){ var ncx=410, ncy=150, nR=70;\n` +
    `      for(var v=0;v<N;v++){ var a=-Math.PI/2 + v*2*Math.PI/N; VX.push(ncx+nR*Math.cos(a)); VY.push(ncy+nR*Math.sin(a)); } }\n` +
    `    else { var bx0=320, bx1=520, by=150; for(var v2=0;v2<N;v2++){ VX.push(bx0 + (N>1? v2*(bx1-bx0)/(N-1) : (bx0+bx1)/2)); VY.push(by); } }\n` +
    `    // edges (1-simplices = pairwise overlaps)\n` +
    `    function edge(a,b){ svg.appendChild(mk('line', {x1:VX[a], y1:VY[a], x2:VX[b], y2:VY[b], stroke:'var(--cyan)', 'stroke-width':2})); }\n` +
    `    for(var e=0;e<N-1;e++) edge(e, e+1);\n` +
    `    if(topo==='circle') edge(N-1, 0);\n` +
    `    // vertices (0-simplices)\n` +
    `    for(var w=0;w<N;w++){ svg.appendChild(mk('circle', {cx:VX[w], cy:VY[w], r:13, fill:'var(--panel2)', stroke:PAL[w%PAL.length], 'stroke-width':2}));\n` +
    `      txt(VX[w], VY[w]+4, ''+w, {size:11, fill:PAL[w%PAL.length], weight:600}); }\n` +
    `    // ---- bottom: the Čech complex + cohomology ----\n` +
    `    txt(280, 250, '\\u010cech complex of the constant sheaf \\u2124:   \\u010c\\u2070 = ' + zk(N) + '  \\u2192  \\u010c\\u00b9 = ' + zk(E) + '  \\u2192  \\u010c\\u00b2 = 0', {size:12, fill:'var(--ink)'});\n` +
    `    txt(280, 276, '\\u021e\\u2070 = ' + zk(b0) + '        \\u021e\\u00b9 = ' + zk(b1), {size:14, fill:'var(--yellow)', weight:600});\n` +
    `    // ---- readout ----\n` +
    `    var space = (topo==='circle') ? 'S\\u00b9' : 'a contractible interval';\n` +
    `    var lines=[];\n` +
    `    lines.push('A good cover of ' + space + ' by ' + N + ' sets: each set overlaps only its neighbour(s) in a single contractible piece, and there are no triple overlaps, so \\u010c\\u00b2 = 0. The nerve N(U) has one vertex per set (' + N + ' of them) and one edge per nonempty pairwise overlap (' + E + ' of them).');\n` +
    `    lines.push('\\u010cech cohomology of the constant sheaf \\u2124 IS the simplicial cohomology of the nerve. The nerve is a ' + (topo==='circle' ? 'cycle graph (b\\u2080=1, b\\u2081=1)' : 'path / tree (b\\u2080=1, b\\u2081=0)') + ', so \\u021e\\u2070(U,\\u2124) = ' + zk(b0) + ' and \\u021e\\u00b9(U,\\u2124) = ' + zk(b1) + '.');\n` +
    `    if(topo==='circle') lines.push('This is exactly H*(S\\u00b9; \\u2124) = (\\u2124, \\u2124), and it does not change as you vary N: the nerve theorem says a good cover\\u2019s nerve is homotopy-equivalent to the space, so \\u010cech recovers singular cohomology independent of the cover.');\n` +
    `    else lines.push('A contractible interval has H* = (\\u2124, 0); its good covers have tree nerves, so \\u021e\\u00b9 = 0. Switch to S\\u00b9 to see the loop appear as the single independent 1-cocycle.');\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  bC.addEventListener('click', function(){ topo='circle'; draw(); });\n` +
    `  bI.addEventListener('click', function(){ topo='interval'; draw(); });\n` +
    `  nIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
