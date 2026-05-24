// toric-varieties-reflexive-duality widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Reflexive lattice polygons and Batyrev polar
// duality in dimension 2: a gallery polygon Delta and its polar dual
// Delta^o = { v : <v,m> >= -1 for all m in Delta }, with a live reflexivity
// check (unique interior lattice point + integral dual).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const btn = (k, lab, on) =>
    `<button type="button" data-k="${k}" class="${on ? 'active' : ''}" aria-pressed="${on ? 'true' : 'false'}">${lab}</button>`;
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-btns">\n` +
    `    ${btn('p2', 'ℙ²', true)}\n` +
    `    ${btn('p1p1', 'ℙ¹×ℙ¹', false)}\n` +
    `    ${btn('square', 'square', false)}\n` +
    `    ${btn('dp3', 'dP₃ hexagon', false)}\n` +
    `    ${btn('nonref', 'non-reflexive', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="A lattice polygon and its polar dual side by side, with a live reflexivity check"><title>A reflexive lattice polygon Delta and its polar dual Delta-circle; reflexive iff 0 is the unique interior lattice point and the dual is a lattice polygon</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* toric-varieties-reflexive-duality widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var POLY={\n` +
    `    p2:{name:'\\u2119\\u00b2', dualName:'anticanonical cubic triangle', V:[[1,0],[0,1],[-1,-1]]},\n` +
    `    p1p1:{name:'\\u2119\\u00b9\\u00d7\\u2119\\u00b9 (diamond)', dualName:'square', V:[[1,0],[0,1],[-1,0],[0,-1]]},\n` +
    `    square:{name:'square', dualName:'diamond', V:[[1,1],[-1,1],[-1,-1],[1,-1]]},\n` +
    `    dp3:{name:'dP\\u2083 (hexagon)', dualName:'hexagon (self-dual up to GL\\u2082(\\u2124))', V:[[1,0],[1,1],[0,1],[-1,0],[-1,-1],[0,-1]]},\n` +
    `    nonref:{name:'non-reflexive', dualName:'(not a lattice polygon)', V:[[2,0],[0,1],[-1,-1]]}\n` +
    `  };\n` +
    `  function dual(V){ var k=V.length, D=[];\n` +
    `    for(var i=0;i<k;i++){ var a=V[i], b=V[(i+1)%k]; var det=a[0]*b[1]-a[1]*b[0];\n` +
    `      if(Math.abs(det)<1e-9) return null;\n` +
    `      var vx=(-1*b[1]-a[1]*-1)/det, vy=(a[0]*-1 - -1*b[0])/det; D.push([vx,vy]); }\n` +
    `    return D; }\n` +
    `  function isInt(p){ return Math.abs(p[0]-Math.round(p[0]))<1e-9 && Math.abs(p[1]-Math.round(p[1]))<1e-9; }\n` +
    `  function interiorLattice(V){ var xs=V.map(function(p){return p[0];}), ys=V.map(function(p){return p[1];}); var pts=[];\n` +
    `    var x0=Math.min.apply(null,xs), x1=Math.max.apply(null,xs), y0=Math.min.apply(null,ys), y1=Math.max.apply(null,ys);\n` +
    `    for(var x=x0;x<=x1;x++) for(var y=y0;y<=y1;y++){ var inside=true, onb=false;\n` +
    `      for(var i=0;i<V.length;i++){ var a=V[i], b=V[(i+1)%V.length]; var cr=(b[0]-a[0])*(y-a[1])-(b[1]-a[1])*(x-a[0]);\n` +
    `        if(cr<-1e-9){ inside=false; break; } if(Math.abs(cr)<1e-9) onb=true; }\n` +
    `      if(inside&&!onb) pts.push([x,y]); }\n` +
    `    return pts; }\n` +
    `  function boundaryLatticeCount(V){ var c=0; for(var i=0;i<V.length;i++){ var a=V[i], b=V[(i+1)%V.length]; c+=gcd(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1])); } return c; }\n` +
    `  function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=b; b=a%b; a=t; } return a; }\n` +
    `  var WIN=3.2, PR=80, LCX=148, RCX=412, CY=158;\n` +
    `  var SC=PR/WIN;\n` +
    `  function grid(cx,col){\n` +
    `    for(var x=-3;x<=3;x++) for(var y=-3;y<=3;y++){ svg.appendChild(mk('circle',{cx:cx+x*SC,cy:CY-y*SC,r:1,fill:'var(--mute)','fill-opacity':0.5})); }\n` +
    `    svg.appendChild(mk('line',{x1:cx-PR,y1:CY,x2:cx+PR,y2:CY,stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:cx,y1:CY-PR,x2:cx,y2:CY+PR,stroke:'var(--line)','stroke-width':1}));\n` +
    `  }\n` +
    `  function poly(cx,V,col,integral){\n` +
    `    var d=''; for(var i=0;i<V.length;i++){ d+=(i?'L ':'M ')+(cx+V[i][0]*SC)+' '+(CY-V[i][1]*SC)+' '; } d+='Z';\n` +
    `    svg.appendChild(mk('path',{d:d, fill:col, 'fill-opacity':0.13, stroke:col, 'stroke-width':2, 'stroke-dasharray': integral?'':'5 3'}));\n` +
    `    for(i=0;i<V.length;i++){ var ix=isInt(V[i]); svg.appendChild(mk('circle',{cx:cx+V[i][0]*SC, cy:CY-V[i][1]*SC, r:ix?3.5:4, fill:ix?col:'var(--pink)'}));\n` +
    `      if(!ix) txt(cx+V[i][0]*SC+6, CY-V[i][1]*SC-6, '('+V[i][0].toFixed(1)+','+V[i][1].toFixed(1)+')', {size:8, fill:'var(--pink)'}); }\n` +
    `  }\n` +
    `  var curKey='p2';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var P=POLY[curKey], V=P.V, D=dual(V);\n` +
    `    var dualInt = D && D.every(isInt);\n` +
    `    var interior=interiorLattice(V);\n` +
    `    var uniqueOrigin = interior.length===1 && interior[0][0]===0 && interior[0][1]===0;\n` +
    `    var reflexive = dualInt && uniqueOrigin;\n` +
    `    grid(LCX); grid(RCX);\n` +
    `    txt(LCX, CY-PR-22, '\\u0394 \\u2282 M\\u211d', {anchor:'middle', size:12, weight:700, fill:'var(--cyan)'});\n` +
    `    txt(LCX, CY-PR-9, P.name, {anchor:'middle', size:9, fill:'var(--mute)'});\n` +
    `    txt(RCX, CY-PR-22, '\\u0394\\u00b0 \\u2282 N\\u211d  (polar dual)', {anchor:'middle', size:12, weight:700, fill:'var(--yellow)'});\n` +
    `    txt(RCX, CY-PR-9, dualInt?P.dualName:'NOT a lattice polygon', {anchor:'middle', size:9, fill: dualInt?'var(--mute)':'var(--pink)'});\n` +
    `    poly(LCX, V, 'var(--cyan)', true);\n` +
    `    if(D) poly(RCX, D, 'var(--yellow)', dualInt);\n` +
    `    // interior lattice points of Delta\n` +
    `    interior.forEach(function(p){ var isO=p[0]===0&&p[1]===0; svg.appendChild(mk('circle',{cx:LCX+p[0]*SC, cy:CY-p[1]*SC, r:4, fill: isO?'var(--green)':'var(--pink)'})); });\n` +
    `    // origin marker in dual plane\n` +
    `    svg.appendChild(mk('circle',{cx:RCX, cy:CY, r:3, fill:'var(--green)'}));\n` +
    `    // duality arrow\n` +
    `    var gm=(LCX+PR+RCX-PR)/2;\n` +
    `    svg.appendChild(mk('line',{x1:LCX+PR+6,y1:CY,x2:RCX-PR-6,y2:CY,stroke:'var(--mute)','stroke-width':1,'stroke-dasharray':'2 2'}));\n` +
    `    txt(gm, CY-6, '\\u00b0', {anchor:'middle', size:16, fill:'var(--mute)', weight:700});\n` +
    `    var vc=V.length, dvc=D?D.length:0, bdy=boundaryLatticeCount(V), allLat=bdy+interior.length;\n` +
    `    out.textContent='A lattice polytope \\u0394 with 0 in its interior is REFLEXIVE iff its polar dual \\u0394\\u00b0 = { v : \\u27e8v, m\\u27e9 \\u2265 \\u22121 for all m \\u2208 \\u0394 } is again a lattice polytope \\u2014 equivalently, 0 is the unique interior lattice point of \\u0394 and every facet sits at lattice distance 1 from 0. In 2-D the dual is computed vertex-pair by vertex-pair: each edge (m\\u1d62, m\\u1d62\\u208a\\u2081) of \\u0394 gives the dual vertex v solving \\u27e8v,m\\u1d62\\u27e9 = \\u27e8v,m\\u1d62\\u208a\\u2081\\u27e9 = \\u22121. Current polygon: '+P.name+', with '+vc+' vertices and '+allLat+' lattice points ('+interior.length+' interior, '+bdy+' on the boundary). Interior lattice points: '+JSON.stringify(interior)+' \\u2014 '+(uniqueOrigin?'just the origin \\u2713':'NOT a single interior point \\u2717')+'. Its dual \\u0394\\u00b0 has '+dvc+' vertices'+(D?(dualInt?', all integral \\u2713':', and at least one is NON-integral \\u2717 (e.g. '+D.filter(function(p){return !isInt(p);}).map(function(p){return '('+p[0].toFixed(1)+','+p[1].toFixed(1)+')';})[0]+')'):'')+'. VERDICT: \\u0394 is '+(reflexive?'REFLEXIVE':'NOT reflexive')+'. '+(reflexive?'Polar duality is an involution, \\u0394\\u00b0\\u00b0 = \\u0394, and it swaps vertices of \\u0394 with facets of \\u0394\\u00b0. ':'')+'Batyrev: a reflexive \\u0394 of dimension n yields a MIRROR Calabi\\u2013Yau pair \\u2014 the CY hypersurfaces from \\u0394 and \\u0394\\u00b0 have their Hodge numbers h^{1,1} and h^{n\\u22122,1} swapped, the mirror phenomenon string theorists predicted. Reflexivity is rare and rigid: exactly 16 reflexive polygons in 2-D (the 16 Gorenstein toric Fano surfaces), 4319 in 3-D, and 473,800,776 in 4-D (Kreuzer\\u2013Skarke). In 2-D the CY hypersurface is just an elliptic curve, so this is a preview of the dimension-4 quintic-type story.';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; curKey=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
