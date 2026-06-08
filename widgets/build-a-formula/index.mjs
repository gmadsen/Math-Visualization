// build-a-formula widget — shared registry renderer for the "compose-evaluate"
// gesture: first-order satisfaction over one binary relation R. The reader builds
// a sentence by clicking prefix tiles (quantifiers, connectives, atoms); the
// engine parses it to an AST, evaluates it on several small structures (finite
// directed graphs), and shows live which satisfy it.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure DOM/SVG; jsdom-safe (click-driven; no getScreenCTM/rAF).

const TILES = [
  ['Ax', '∀x'], ['Ex', '∃x'], ['Ay', '∀y'], ['Ey', '∃y'],
  ['NOT', '¬'], ['AND', '∧'], ['OR', '∨'], ['IMP', '→'],
  ['Rxy', 'R(x,y)'], ['Ryx', 'R(y,x)'], ['Rxx', 'R(x,x)'], ['Ryy', 'R(y,y)'], ['EQ', 'x=y'],
];

export function renderMarkup(params) {
  const { widgetId, formulaId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 600 220';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 600;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 220;
  const svgTitle = params.svgTitle || title;
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  const tileBtns = TILES.map(([k, s]) => `<button id="${widgetId}-t-${k}" type="button" data-k="${k}">${s}</button>`).join('');
  const presets = Array.isArray(params.presets) ? params.presets : [];
  const presetBtns = presets.length
    ? `  <div class="row">\n    <span class="small" style="color:var(--mute)">try:</span>\n    ${presets.map((p, i) => `<button id="${widgetId}-p-${i}" type="button" class="small">${p.label}</button>`).join('')}\n  </div>\n`
    : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <div id="${formulaId}" class="readout" style="min-height:1.6em;text-align:center;font-size:15px">&nbsp;</div>\n` +
    `  <div class="row" style="flex-wrap:wrap">${tileBtns}\n` +
    `    <button id="${widgetId}-back" type="button">⌫</button>\n` +
    `    <button id="${widgetId}-clear" type="button">clear</button>\n` +
    `  </div>\n` +
    presetBtns +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, formulaId, svgId, outputId } = params;
  const structures = Array.isArray(params.structures) ? params.structures : [];
  const presets = Array.isArray(params.presets) ? params.presets : [];
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const fdiv=$('#${formulaId}'), svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const STR=${JSON.stringify(structures)}, PRESETS=${JSON.stringify(presets)};\n` +
    `  const ARITY={Ax:1,Ex:1,Ay:1,Ey:1,NOT:1,AND:2,OR:2,IMP:2,Rxy:0,Ryx:0,Rxx:0,Ryy:0,EQ:0};\n` +
    `  const SYM={Ax:'\\u2200x ',Ex:'\\u2203x ',Ay:'\\u2200y ',Ey:'\\u2203y ',NOT:'\\u00ac',AND:' \\u2227 ',OR:' \\u2228 ',IMP:' \\u2192 ',Rxy:'R(x,y)',Ryx:'R(y,x)',Rxx:'R(x,x)',Ryy:'R(y,y)',EQ:'x=y'};\n` +
    `  var toks=[];\n` +
    `  // ---- prefix parse to AST ----\n` +
    `  function parse(idx){ var t=toks[idx.i++]; if(t==null) return null; var a=ARITY[t];\n` +
    `    if(a===0) return {op:t}; if(a===1){ var c=parse(idx); return c?{op:t,c:[c]}:null; }\n` +
    `    var l=parse(idx), r=parse(idx); return (l&&r)?{op:t,c:[l,r]}:null; }\n` +
    `  function need(){ var e=1; for(var i=0;i<toks.length;i++){ e+=ARITY[toks[i]]-1; if(e<=0&&i<toks.length-1) return -1; } return e; }\n` +
    `  function str(node){ if(!node) return '?'; var o=node.op, c=node.c;\n` +
    `    if(o==='Rxy')return 'R(x,y)'; if(o==='Ryx')return 'R(y,x)'; if(o==='Rxx')return 'R(x,x)'; if(o==='Ryy')return 'R(y,y)'; if(o==='EQ')return 'x=y';\n` +
    `    if(o==='NOT')return '\\u00ac'+wrap(c[0]);\n` +
    `    if(o==='Ax')return '\\u2200x '+str(c[0]); if(o==='Ex')return '\\u2203x '+str(c[0]); if(o==='Ay')return '\\u2200y '+str(c[0]); if(o==='Ey')return '\\u2203y '+str(c[0]);\n` +
    `    var op=o==='AND'?' \\u2227 ':o==='OR'?' \\u2228 ':' \\u2192 '; return wrap(c[0])+op+wrap(c[1]); }\n` +
    `  function wrap(node){ var bin=(node&&(node.op==='AND'||node.op==='OR'||node.op==='IMP')); return bin?('('+str(node)+')'):str(node); }\n` +
    `  function freeVars(node, bx, by){ if(!node) return {x:false,y:false}; var o=node.op;\n` +
    `    if(o==='Rxy'||o==='Ryx'||o==='EQ') return {x:!bx,y:!by};\n` +
    `    if(o==='Rxx') return {x:!bx,y:false}; if(o==='Ryy') return {x:false,y:!by};\n` +
    `    if(o==='Ax'||o==='Ex'){ return freeVars(node.c[0],true,by); }\n` +
    `    if(o==='Ay'||o==='Ey'){ return freeVars(node.c[0],bx,true); }\n` +
    `    var r={x:false,y:false}; (node.c||[]).forEach(function(ch){ var f=freeVars(ch,bx,by); r.x=r.x||f.x; r.y=r.y||f.y; }); return r; }\n` +
    `  // ---- evaluate on a structure {n, R[][]} ----\n` +
    `  function ev(node, env, R, n){ var o=node.op, c=node.c, d;\n` +
    `    switch(o){\n` +
    `      case 'Rxy': return !!R[env.x][env.y]; case 'Ryx': return !!R[env.y][env.x];\n` +
    `      case 'Rxx': return !!R[env.x][env.x]; case 'Ryy': return !!R[env.y][env.y];\n` +
    `      case 'EQ': return env.x===env.y;\n` +
    `      case 'NOT': return !ev(c[0],env,R,n);\n` +
    `      case 'AND': return ev(c[0],env,R,n)&&ev(c[1],env,R,n);\n` +
    `      case 'OR': return ev(c[0],env,R,n)||ev(c[1],env,R,n);\n` +
    `      case 'IMP': return (!ev(c[0],env,R,n))||ev(c[1],env,R,n);\n` +
    `      case 'Ax': for(d=0;d<n;d++){ if(!ev(c[0],{x:d,y:env.y},R,n)) return false; } return true;\n` +
    `      case 'Ex': for(d=0;d<n;d++){ if(ev(c[0],{x:d,y:env.y},R,n)) return true; } return false;\n` +
    `      case 'Ay': for(d=0;d<n;d++){ if(!ev(c[0],{x:env.x,y:d},R,n)) return false; } return true;\n` +
    `      case 'Ey': for(d=0;d<n;d++){ if(ev(c[0],{x:env.x,y:d},R,n)) return true; } return false; } }\n` +
    `  function matOf(s){ var R=[]; for(var i=0;i<s.n;i++){ R.push([]); for(var j=0;j<s.n;j++) R[i].push(0); } s.edges.forEach(function(e){ if(R[e[0]]) R[e[0]][e[1]]=1; }); return R; }\n` +
    `  // ---- structure drawing ----\n` +
    `  function drawStruct(s, x0, w, sat){ var cx=x0+w/2, cy=98, rad=Math.min(w*0.30,42), nr=11;\n` +
    `    var pos=[]; for(var i=0;i<s.n;i++){ var ang=-Math.PI/2 + i/s.n*2*Math.PI; pos.push([cx+rad*Math.cos(ang), cy+rad*Math.sin(ang)]); }\n` +
    `    var R=matOf(s);\n` +
    `    for(var i=0;i<s.n;i++) for(var j=0;j<s.n;j++){ if(!R[i][j]) continue; var a=pos[i], b=pos[j];\n` +
    `      if(i===j){ G.appendChild(SVG('circle',{cx:a[0],cy:a[1]-nr-7,r:7,fill:'none',stroke:'var(--mute)','stroke-width':1.4})); continue; }\n` +
    `      var dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy), ux=dx/L, uy=dy/L; var ax=a[0]+ux*nr, ay=a[1]+uy*nr, bx=b[0]-ux*(nr+3), by=b[1]-uy*(nr+3);\n` +
    `      G.appendChild(SVG('line',{x1:ax,y1:ay,x2:bx,y2:by,stroke:'var(--mute)','stroke-width':1.5}));\n` +
    `      G.appendChild(SVG('line',{x1:bx,y1:by,x2:bx-ux*7-uy*4,y2:by-uy*7+ux*4,stroke:'var(--mute)','stroke-width':1.5}));\n` +
    `      G.appendChild(SVG('line',{x1:bx,y1:by,x2:bx-ux*7+uy*4,y2:by-uy*7-ux*4,stroke:'var(--mute)','stroke-width':1.5})); }\n` +
    `    for(var i=0;i<s.n;i++){ G.appendChild(SVG('circle',{cx:pos[i][0],cy:pos[i][1],r:nr,fill:'var(--panel)',stroke:'var(--ink)','stroke-width':1.4})); var t=SVG('text',{x:pos[i][0],y:pos[i][1]+4,'font-size':11,fill:'var(--ink)','text-anchor':'middle'}); t.textContent=i; G.appendChild(t); }\n` +
    `    var col = sat==null?'var(--mute)':(sat?'var(--green)':'var(--pink)');\n` +
    `    var mk=SVG('text',{x:cx,y:30,'font-size':18,fill:col,'text-anchor':'middle','font-weight':600}); mk.textContent=(sat==null?'\\u2013':(sat?'\\u2713':'\\u2717')); G.appendChild(mk);\n` +
    `    var lab=SVG('text',{x:cx,y:172,'font-size':11,fill:col,'text-anchor':'middle'}); lab.textContent=s.label; G.appendChild(lab); }\n` +
    `  function render(){\n` +
    `    while(G.firstChild)G.removeChild(G.firstChild);\n` +
    `    var nd=need(), ast=(nd===0)?parse({i:0}):null;\n` +
    `    fdiv.innerHTML = toks.length? (ast? str(ast) : '<span style=\\"color:var(--mute)\\">'+toks.map(function(t){return SYM[t].trim();}).join(' ')+' \\u2026</span>') : '<span style=\\"color:var(--mute)\\">click tiles to build a sentence \\u2014 e.g. \\u2200x \\u2203y R(x,y)</span>';\n` +
    `    var fv = ast?freeVars(ast,false,false):{x:false,y:false}, isSent = ast && !fv.x && !fv.y;\n` +
    `    var w=600/STR.length, nsat=0;\n` +
    `    STR.forEach(function(s,i){ var sat=null; if(isSent){ var R=matOf(s); sat=ev(ast,{x:0,y:0},R,s.n); if(sat) nsat++; } drawStruct(s, i*w, w, sat); });\n` +
    `    if(!toks.length){ out.innerHTML='build a first-order sentence about the relation R, then watch which structures model it.'; }\n` +
    `    else if(nd!==0){ out.innerHTML='<span style=\\"color:var(--mute)\\">incomplete \\u2014 the formula still needs '+(nd<0?'fewer tokens':nd+' more subformula'+(nd===1?'':'s'))+'</span>'; }\n` +
    `    else if(!isSent){ out.innerHTML='<span style=\\"color:var(--orange,var(--yellow))\\">this is a formula with a free variable ('+(fv.x?'x':'')+(fv.x&&fv.y?', ':'')+(fv.y?'y':'')+') \\u2014 not a closed <em>sentence</em>; add a quantifier to bind it.</span>'; }\n` +
    `    else { out.innerHTML='<b style=\\"color:var(--cyan)\\">'+nsat+' of '+STR.length+'</b> structures satisfy this sentence \\u2014 the ones marked \\u2713.'; }\n` +
    `    // disable tiles when the sentence is complete\n` +
    `    var complete=(nd===0); [].forEach.call(document.querySelectorAll('[id^=\\"${widgetId}-t-\\"]'),function(b){ b.disabled=complete; });\n` +
    `  }\n` +
    `  [].forEach.call(document.querySelectorAll('[id^=\\"${widgetId}-t-\\"]'),function(b){ b.addEventListener('click',function(){ if(need()!==0){ toks.push(b.getAttribute('data-k')); render(); } }); });\n` +
    `  $('#${widgetId}-back').addEventListener('click',function(){ toks.pop(); render(); });\n` +
    `  $('#${widgetId}-clear').addEventListener('click',function(){ toks=[]; render(); });\n` +
    presets.map((p, i) => `  (function(){ var b=$('#${widgetId}-p-${i}'); if(b) b.addEventListener('click',function(){ toks=${JSON.stringify(p.tokens)}.slice(); render(); }); })();\n`).join('') +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
