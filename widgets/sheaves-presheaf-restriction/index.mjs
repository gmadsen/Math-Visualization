// sheaves-presheaf-restriction widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A presheaf as a contravariant functor on opens:
// a fixed section s is restricted down a nested chain U ⊇ V ⊇ W, with the
// functor laws ρ^U_U=id, ρ^V_W∘ρ^U_V=ρ^U_W.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-v">open $V$ half-width</label>\n` +
    `    <input type="range" id="${widgetId}-v" min="20" max="55" value="42" step="1">\n` +
    `    <span class="pill" id="${widgetId}-vv">V</span>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-w">open $W$ half-width</label>\n` +
    `    <input type="range" id="${widgetId}-w" min="5" max="55" value="22" step="1">\n` +
    `    <span class="pill" id="${widgetId}-wv">W</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="A continuous section restricted to nested open sets U, V, W, with the restriction-map poset diagram"><title>A presheaf section s over U restricted to nested opens V and W; the two paths U to V to W and U to W give the same s|W (functoriality)</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* sheaves-presheaf-restriction widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sv=document.getElementById('${widgetId}-v'), sw=document.getElementById('${widgetId}-w'), vv=document.getElementById('${widgetId}-vv'), wv=document.getElementById('${widgetId}-wv');\n` +
    `  if(!svg||!out||!sv||!sw||!vv||!wv) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var XL=0, XR=12, PX0=44, PX1=516, PTOP=46, AXISY=176;\n` +  // section plot above the axis
    `  function PX(x){ return PX0+(x-XL)/(XR-XL)*(PX1-PX0); }\n` +
    `  function sFn(x){ return 2.4 + 1.25*Math.sin(0.85*x) + 0.55*Math.cos(2.15*x+0.6); }\n` +  // the section
    `  function PY(v){ return AXISY - v/5*(AXISY-PTOP); }\n` +  // value 0..5
    `  function curve(x0,x1,col,wd,op){ var d='', n=120; for(var i=0;i<=n;i++){ var x=x0+(x1-x0)*i/n; d+=(i?'L ':'M ')+PX(x).toFixed(1)+' '+PY(sFn(x)).toFixed(1)+' '; } svg.appendChild(mk('path',{d:d, fill:'none', stroke:col, 'stroke-width':wd, 'stroke-opacity':op==null?1:op})); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var vH=parseInt(sv.value,10)/10, wH=parseInt(sw.value,10)/10; if(wH>vH-0.3) wH=vH-0.3; sw.value=Math.round(wH*10);\n` +
    `    var C=6, Ua=0.3,Ub=11.7, Va=C-vH,Vb=C+vH, Wa=C-wH,Wb=C+wH;\n` +
    `    vv.textContent='V=['+Va.toFixed(1)+','+Vb.toFixed(1)+']'; wv.textContent='W=['+Wa.toFixed(1)+','+Wb.toFixed(1)+']';\n` +
    `    // axis\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:AXISY,x2:PX1,y2:AXISY,stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt(PX1, AXISY+14, 'X (a line)', {anchor:'end', size:9, fill:'var(--mute)'});\n` +
    `    txt(PX0-4, PTOP+2, 's', {anchor:'end', size:11, fill:'var(--mute)'});\n` +
    `    // the section over U (full, faint), then over V (cyan), W (green)\n` +
    `    curve(Ua,Ub,'var(--mute)',1.4,0.5);\n` +
    `    curve(Va,Vb,'var(--cyan)',2.4,1);\n` +
    `    curve(Wa,Wb,'var(--green)',3,1);\n` +
    `    // open-set bars under the axis\n` +
    `    function bar(a,b,y,col,lab){ svg.appendChild(mk('line',{x1:PX(a),y1:y,x2:PX(b),y2:y,stroke:col,'stroke-width':5,'stroke-linecap':'round'})); txt(PX((a+b)/2), y-6, lab, {anchor:'middle', size:10, fill:col, weight:700}); }\n` +
    `    bar(Ua,Ub,AXISY+30,'var(--mute)','U'); bar(Va,Vb,AXISY+50,'var(--cyan)','V'); bar(Wa,Wb,AXISY+70,'var(--green)','W');\n` +
    `    // poset diagram with restriction maps (right side)\n` +
    `    var dx=300, dy=AXISY+34; \n` +
    `    function node(x,y,t,col){ svg.appendChild(mk('circle',{cx:x,cy:y,r:11,fill:'var(--panel2)',stroke:col,'stroke-width':1.5})); txt(x,y+4,t,{anchor:'middle',size:11,fill:col,weight:700}); }\n` +
    `    var ux=300+120, vx=300+170, wx=300+220, ny=AXISY+58;\n` +
    `    txt(ux-40, ny+4, 'Open(X)^op:', {anchor:'end', size:9, fill:'var(--mute)'});\n` +
    `    node(ux,ny,'U','var(--mute)'); node(vx,ny,'V','var(--cyan)'); node(wx,ny,'W','var(--green)');\n` +
    `    svg.appendChild(mk('path',{d:'M '+(ux+11)+' '+(ny-4)+' Q '+((ux+vx)/2)+' '+(ny-22)+' '+(vx-11)+' '+(ny-4), fill:'none', stroke:'var(--ink)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('path',{d:'M '+(vx+11)+' '+(ny-4)+' Q '+((vx+wx)/2)+' '+(ny-22)+' '+(wx-11)+' '+(ny-4), fill:'none', stroke:'var(--ink)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('path',{d:'M '+(ux+9)+' '+(ny+9)+' Q '+((ux+wx)/2)+' '+(ny+34)+' '+(wx-9)+' '+(ny+9), fill:'none', stroke:'var(--violet)','stroke-width':1.2,'stroke-dasharray':'4 3'}));\n` +
    `    txt((ux+vx)/2, ny-24, '\\u03c1', {anchor:'middle', size:9, fill:'var(--mute)'});\n` +
    `    txt((vx+wx)/2, ny-24, '\\u03c1', {anchor:'middle', size:9, fill:'var(--mute)'});\n` +
    `    txt((ux+wx)/2, ny+40, '\\u03c1(U\\u2192W) = \\u03c1(V\\u2192W)\\u2218\\u03c1(U\\u2192V)', {anchor:'middle', size:8, fill:'var(--violet)'});\n` +
    `    out.textContent='A PRESHEAF on a space X is a contravariant functor F: Open(X)^op \\u2192 Set: to each open U it assigns a set F(U) (its SECTIONS, also written \\u0393(U,F)), and to each inclusion V \\u2286 U a RESTRICTION map \\u03c1(U\\u2192V): F(U) \\u2192 F(V), s \\u21a6 s|_V. The functor laws are \\u03c1(U\\u2192U) = id and \\u03c1(V\\u2192W) \\u2218 \\u03c1(U\\u2192V) = \\u03c1(U\\u2192W) for W \\u2286 V \\u2286 U \\u2014 restricting U\\u2192V\\u2192W equals restricting U\\u2192W in one step (the dashed violet arrow). Here F = C\\u2070_X, continuous functions, and s is the fixed section above: restricting it to the smaller opens V (cyan) then W (green) just forgets its values outside, and the two paths to W land on the SAME s|_W \\u2014 that is functoriality, visible. The same definition with Set replaced by Ab, Ring, or R-Mod gives presheaves of groups, rings, modules; sections over X itself are GLOBAL sections \\u0393(X,F). Continuous and holomorphic functions are in fact SHEAVES, but a presheaf need not be one: the constant presheaf (F(U)=A for every nonempty U, all restrictions the identity) is a perfectly good functor that FAILS to glue two different constants on disjoint opens \\u2014 which is exactly the gluing axiom the next section adds.';\n` +
    `  }\n` +
    `  sv.addEventListener('input', draw); sw.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
