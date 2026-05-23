// schemes-specialization widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The poset (nodes + specialization edges) comes from
// params. Clicking a prime highlights its closure V(p) = {q : p ⊆ q} — the
// irreducible subvariety it is the generic point of.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 270" width="540" height="270" role="img" aria-label="A specialization poset of prime ideals; click a point to see its closure"><title>Generic points and specialization: the closure of a prime is the subvariety it is generic for</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, nodes, edges } = params;
  const data = JSON.stringify({ nodes, edges });
  return (
    `<script>\n` +
    `/* schemes-specialization widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var G = ${data}, NODES=G.nodes, EDGES=G.edges;\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  if(!svg || !out) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  var byId={}; NODES.forEach(function(n){ byId[n.id]=n; });\n` +
    `  // forward adjacency: from -> to  (from ⊊ to)\n` +
    `  var adj={}; NODES.forEach(function(n){ adj[n.id]=[]; }); EDGES.forEach(function(e){ if(adj[e[0]]) adj[e[0]].push(e[1]); });\n` +
    `  function closure(id){ var seen={}, stack=[id]; while(stack.length){ var u=stack.pop(); if(seen[u]) continue; seen[u]=true; (adj[u]||[]).forEach(function(v){ if(!seen[v]) stack.push(v); }); } return seen; }\n` +
    `  // layout: group by height\n` +
    `  var maxH=0; NODES.forEach(function(n){ if(n.height>maxH) maxH=n.height; });\n` +
    `  var X0=80, X1=460, yTop=52, yBot=226;\n` +
    `  var byH={}; NODES.forEach(function(n){ (byH[n.height]=byH[n.height]||[]).push(n); });\n` +
    `  var pos={}; for(var h in byH){ var row=byH[h], m=row.length; row.forEach(function(n,i){ var x = m===1 ? (X0+X1)/2 : X0+(X1-X0)*i/(m-1); var y = maxH===0 ? (yTop+yBot)/2 : yTop+(yBot-yTop)*(maxH-n.height)/maxH; pos[n.id]=[x,y]; }); }\n` +
    `  var sel = null;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var cl = sel ? closure(sel) : {};\n` +
    `    // edges\n` +
    `    EDGES.forEach(function(e){ var a=pos[e[0]], b=pos[e[1]]; if(!a||!b) return; var inCl = sel && cl[e[0]] && cl[e[1]];\n` +
    `      svg.appendChild(mk('line', {x1:a[0], y1:a[1], x2:b[0], y2:b[1], stroke: inCl?'var(--yellow)':'var(--line)', 'stroke-width': inCl?1.8:1})); });\n` +
    `    // nodes\n` +
    `    NODES.forEach(function(n){ var p=pos[n.id], inCl=sel&&cl[n.id], isSel=(n.id===sel);\n` +
    `      var c=mk('circle', {cx:p[0], cy:p[1], r: isSel?8:6, fill: inCl?'color-mix(in srgb, var(--yellow) 40%, transparent)':'var(--panel2)', stroke: isSel?'var(--pink)':(inCl?'var(--yellow)':'var(--cyan)'), 'stroke-width': isSel?2.5:1.5, cursor:'pointer'});\n` +
    `      c.addEventListener('click', function(){ sel=n.id; draw(); });\n` +
    `      svg.appendChild(c);\n` +
    `      var t=mk('text', {x:p[0]+11, y:p[1]+4, 'font-size':11, fill:'var(--ink)', cursor:'pointer'}, n.label); t.addEventListener('click', function(){ sel=n.id; draw(); }); svg.appendChild(t); });\n` +
    `    // height legend\n` +
    `    svg.appendChild(mk('text', {x:8, y:yTop+4, 'font-size':9, fill:'var(--violet)'}, 'generic'));\n` +
    `    svg.appendChild(mk('text', {x:8, y:yBot+4, 'font-size':9, fill:'var(--mute)'}, 'closed'));\n` +
    `    svg.appendChild(mk('text', {x:(X0+X1)/2, y:20, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'click a point to highlight its closure V(p)'));\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    lines.push('A non-maximal prime p is a GENERIC POINT. Its closure in Spec R is V(p) = { q : p \\u2286 q } \\u2014 an entire irreducible subvariety, not a single point. p \\u2933 q (\\u201cp specializes to q\\u201d) means q \\u2208 closure{p}, i.e. p \\u2286 q.');\n` +
    `    if(sel){ var n=byId[sel], cl2=closure(sel), names=NODES.filter(function(x){ return cl2[x.id]; }).map(function(x){ return x.label; });\n` +
    `      lines.push('Selected p = ' + n.label + ' (V(p) = ' + n.geom + '). Its closure = { ' + names.join(', ') + ' } \\u2014 ' + (names.length===1?'just itself (a closed point).':'p plus everything it specializes to.')); }\n` +
    `    else { lines.push('Click the top (generic) point: its closure is the whole space. Click a closed point: its closure is just itself.'); }\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  // start with the most-generic node selected (highest height)\n` +
    `  var top=NODES[0]; NODES.forEach(function(n){ if(n.height>top.height) top=n; }); sel=top.id;\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
