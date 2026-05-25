// functor-of-points-base-change widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Base change as a pullback of functors, on the
// family x^2 = t over A^1: the fiber X_a = X x_{A^1} {a} has k-points
// { x in k : x^2 = a }, computed pointwise: (X x_S Y)(T) = X(T) x_{S(T)} Y(T).

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
    `    <label>base field k:</label>\n    ${btn('F5', 'F&#8325;', true)}\n    ${btn('F7', 'F&#8327;', false)}\n    ${btn('R', '&#8477;', false)}\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-a">fiber location  t = a</label>\n` +
    `    <input type="range" id="${widgetId}-a" min="0" max="4" value="1" step="1">\n` +
    `    <span class="pill" id="${widgetId}-av">a = …</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="The fiber of the family x squared equals t over a point t = a, drawn as the solutions of x squared equals a in the chosen base field"><title>For the family x^2 = t projecting to the affine line, the fiber over t = a is the set of x in the base field k with x^2 = a; a nonzero square gives two points, a = 0 gives one non-reduced point, a non-square gives the empty fiber</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* functor-of-points-base-change widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns'), sa=document.getElementById('${widgetId}-a'), av=document.getElementById('${widgetId}-av');\n` +
    `  if(!svg||!out||!btns||!sa||!av) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  var FIELDS={ F5:{p:5,name:'F\\u2085',min:0,max:4}, F7:{p:7,name:'F\\u2087',min:0,max:6}, R:{p:0,name:'\\u211d',min:-3,max:3} };\n` +
    `  var cur='F5';\n` +
    `  function fiber(field,a){ // returns {sols:[numbers or labels], n, type}\n` +
    `    if(field.p>0){ var p=field.p, aa=((a%p)+p)%p, s=[]; for(var x=0;x<p;x++) if((x*x)%p===aa) s.push(x); return {sols:s, n:s.length, aa:aa}; }\n` +
    `    if(a>0){ return {sols:[-Math.sqrt(a),Math.sqrt(a)], n:2, aa:a}; } if(a===0){ return {sols:[0], n:1, aa:0}; } return {sols:[], n:0, aa:a}; }\n` +
    `  function applyRange(){ var f=FIELDS[cur]; var v=parseInt(sa.value,10); if(isNaN(v)) v=f.min; v=Math.max(f.min, Math.min(f.max, v)); sa.min=f.min; sa.max=f.max; sa.step=1; sa.value=v; }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var f=FIELDS[cur]; var a=parseInt(sa.value,10); if(isNaN(a)) a=0; av.textContent='a = '+a; sa.setAttribute('aria-valuetext','a = '+a);\n` +
    `    var fb=fiber(f,a);\n` +
    `    txt(20, 26, 'family  X : x\\u00b2 = t   \\u2192   S = A\\u00b9   (project to t);   base field k = '+f.name, {size:13, weight:700, fill:'var(--ink)'});\n` +
    `    txt(20, 48, 'base change along  Spec '+f.name+' \\u2192 A\\u00b9,  t \\u21a6 a:   fiber  X\\u2090 = X \\u00d7_{A\\u00b9} {a} = { x \\u2208 '+f.name+' : x\\u00b2 = a }', {size:11, fill:'var(--mute)'});\n` +
    `    // ---- x-axis with the fiber solutions ----\n` +
    `    var y0=130, xL=60, xR=500;\n` +
    `    svg.appendChild(mk('line',{x1:xL,y1:y0,x2:xR,y2:y0,stroke:'var(--line)','stroke-width':1.4,'marker-end':'url(#${widgetId}-ar)'}));\n` +
    `    var defs=mk('defs',{}); var m=mk('marker',{id:'${widgetId}-ar',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto'}); m.appendChild(mk('path',{d:'M0 0 L10 5 L0 10 z',fill:'var(--line)'})); defs.appendChild(m); svg.appendChild(defs);\n` +
    `    txt(xR+4, y0+4, 'x', {size:11, fill:'var(--mute)'});\n` +
    `    if(f.p>0){ var p=f.p; for(var x=0;x<p;x++){ var px=xL+(xR-xL-30)*x/(p-1);\n` +
    `        var sol=fb.sols.indexOf(x)>=0;\n` +
    `        svg.appendChild(mk('circle',{cx:px,cy:y0,r:sol?7:3.5,fill:sol?'var(--green)':'var(--panel2)',stroke:sol?'var(--green)':'var(--line)','stroke-width':1.5}));\n` +
    `        txt(px, y0+22, ''+x, {anchor:'middle', size:10, fill: sol?'var(--green)':'var(--mute)', weight: sol?700:400}); } }\n` +
    `    else { // R: continuous axis [-3,3]\n` +
    `      for(var t=-3;t<=3;t++){ var px=xL+(xR-xL-30)*(t+3)/6; svg.appendChild(mk('line',{x1:px,y1:y0-4,x2:px,y2:y0+4,stroke:'var(--line)','stroke-width':1})); txt(px,y0+22,''+t,{anchor:'middle',size:10,fill:'var(--mute)'}); }\n` +
    `      fb.sols.forEach(function(s){ var px=xL+(xR-xL-30)*(s+3)/6; svg.appendChild(mk('circle',{cx:px,cy:y0,r:7,fill:'var(--green)',stroke:'var(--green)','stroke-width':1.5})); }); }\n` +
    `    // ---- verdict ----\n` +
    `    var solStr, typ, tc;\n` +
    `    if(fb.n===0){ solStr='{ }  (empty fiber)'; typ = (f.p>0?('a = '+fb.aa+' is a non-square mod '+f.p):'a < 0: no real square root'); tc='var(--pink)'; }\n` +
    `    else if(fb.n===1){ solStr='{ 0 }'; typ='a = 0: ONE point, but NON-REDUCED \\u2014 the fiber is Spec k[x]/(x\\u00b2), a double point'; tc='var(--yellow)'; }\n` +
    `    else { var ss = (f.p>0)? ('{ '+fb.sols.join(', ')+' }') : ('{ \\u2212\\u221a'+fb.aa+', \\u221a'+fb.aa+' }'); solStr=ss; typ=(f.p>0?('a = '+fb.aa+' is a nonzero square mod '+f.p):'a > 0: two real square roots')+': TWO reduced points'; tc='var(--green)'; }\n` +
    `    txt(20, 188, 'fiber  X\\u2090('+f.name+')  =  '+solStr, {size:13, mono:true, fill:tc, weight:700});\n` +
    `    txt(20, 210, typ, {size:11, fill:tc});\n` +
    `    txt(20, 246, 'Why pointwise:  (X \\u00d7_S Y)(T) = X(T) \\u00d7_{S(T)} Y(T)   \\u2014 representable functors preserve limits,', {size:10.5, fill:'var(--cyan)'});\n` +
    `    txt(20, 264, 'so the fiber X\\u2090 = X \\u00d7_{A\\u00b9} {a} is computed on R-points by intersecting with t = a.', {size:10.5, fill:'var(--cyan)'});\n` +
    `    out.textContent='A morphism X \\u2192 S of schemes is a family of fibers; base change forms a particular fiber. The key identity is that fiber products of schemes are computed POINTWISE on functors of points: since a representable functor h_X preserves limits, (X \\u00d7_S Y)(T) = X(T) \\u00d7_{S(T)} Y(T) as an identity of sets, natural in the test scheme T. Here the family is X = V(x\\u00b2 \\u2212 t) over S = A\\u00b9 (the projection (x,t) \\u21a6 t), and base change along the inclusion of a point Spec k \\u2192 A\\u00b9, t \\u21a6 a, produces the FIBER X\\u2090 = X \\u00d7_{A\\u00b9} {a}, whose k-points are X\\u2090(k) = X(k) \\u00d7_{A\\u00b9(k)} {a} = { x \\u2208 k : x\\u00b2 = a }. So the fiber is literally the solution set of x\\u00b2 = a in k, and its shape depends on both a and k: over a field where a is a nonzero square there are TWO points; over a where a is a non-square the fiber is EMPTY (e.g. x\\u00b2 = 2 has no point over F\\u2085, two points over F\\u2087); and at a = 0 there is one point but the fiber scheme is Spec k[x]/(x\\u00b2), a NON-REDUCED double point \\u2014 the family degenerates there. The functor-of-points viewpoint makes all of this a one-line computation: pull back the equations, then solve over each test ring.';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; cur=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    applyRange(); draw(); });\n` +
    `  sa.addEventListener('input', draw);\n` +
    `  applyRange(); draw();\n` +
    `})();\n` +
    `</script>`
  );
}
