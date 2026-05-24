// sheaves-ox-module widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. An O_X-module: multiply a section s of F by a
// function g in O_X(U), then check the module action commutes with
// restriction, (g·s)|_V = g|_V · s|_V.

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
    `    <span class="pill">g ∈ O_X(U):</span>\n` +
    `    ${btn('two', 'g = 2', true)}\n` +
    `    ${btn('ramp', 'g = x/3', false)}\n` +
    `    ${btn('cos', 'g = cos x', false)}\n` +
    `    ${btn('bump', 'g = (x−5)²⁄8', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="A function g, a section s, and their product g times s over an open and a sub-open, showing the module action commutes with restriction"><title>An O_X-module: the section g.s over U restricted to V equals the product of the restrictions g|V . s|V — the module action is compatible with restriction</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* sheaves-ox-module widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var XL=0, XR=10, PX0=44, PX1=420, PTOP=46, PBOT=210, YLO=-2.5, YHI=7;\n` +
    `  var Va=3, Vb=7;\n` +  // sub-open V
    `  function PX(x){ return PX0+(x-XL)/(XR-XL)*(PX1-PX0); }\n` +
    `  function PY(v){ if(v>YHI)v=YHI; if(v<YLO)v=YLO; return PBOT-(v-YLO)/(YHI-YLO)*(PBOT-PTOP); }\n` +
    `  function sFn(x){ return 1.4 + 0.7*Math.cos(0.85*x); }\n` +  // the section s of F = O_X
    `  var GS={ two:{f:function(x){return 2;}, lab:'2'}, ramp:{f:function(x){return x/3;}, lab:'x/3'}, cos:{f:function(x){return Math.cos(x);}, lab:'cos x'}, bump:{f:function(x){return (x-5)*(x-5)/8;}, lab:'(x\\u22125)\\u00b2/8'} };\n` +
    `  function curve(fn,a,b,col,wd,dash){ var d='',n=120; for(var i=0;i<=n;i++){ var x=a+(b-a)*i/n; d+=(i?'L ':'M ')+PX(x).toFixed(1)+' '+PY(fn(x)).toFixed(1)+' '; } svg.appendChild(mk('path',{d:d,fill:'none',stroke:col,'stroke-width':wd,'stroke-dasharray':dash||''})); }\n` +
    `  var curKey='two';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var G=GS[curKey], g=G.f; var gs=function(x){ return g(x)*sFn(x); };\n` +
    `    // V band\n` +
    `    svg.appendChild(mk('rect',{x:PX(Va).toFixed(1),y:PTOP,width:(PX(Vb)-PX(Va)).toFixed(1),height:PBOT-PTOP,fill:'var(--violet)','fill-opacity':0.08}));\n` +
    `    txt((PX(Va)+PX(Vb))/2, PTOP+10, 'sub-open V=[3,7]', {anchor:'middle', size:8, fill:'var(--violet)'});\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:PY(0),x2:PX1,y2:PY(0),stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt(PX1, PY(0)+12, 'X (open U=[0,10])', {anchor:'end', size:8, fill:'var(--mute)'});\n` +
    `    // curves over U: g, s, g.s\n` +
    `    curve(g,XL,XR,'var(--cyan)',1.6,'3 2'); curve(sFn,XL,XR,'var(--green)',1.6,'3 2'); curve(gs,XL,XR,'var(--yellow)',2.6);\n` +
    `    // emphasize g.s over V (the restriction)\n` +
    `    curve(gs,Va,Vb,'var(--pink)',3.4);\n` +
    `    // legend\n` +
    `    txt(PX0+4, PTOP+10, 'g (function)', {size:9, fill:'var(--cyan)'}); txt(PX0+4, PTOP+22, 's (section of F)', {size:9, fill:'var(--green)'}); txt(PX0+4, PTOP+34, 'g\\u00b7s', {size:9, fill:'var(--yellow)', weight:700});\n` +
    `    // commuting-square diagram (right)\n` +
    `    var bx=438, ty=70, bw=104, rh=44;\n` +
    `    txt(bx+bw/2, ty-14, 'module action', {anchor:'middle', size:9, fill:'var(--mute)'});\n` +
    `    txt(bx, ty, 'O(U)\\u00d7F(U)', {size:9, fill:'var(--ink)'}); txt(bx+bw, ty, 'F(U)', {anchor:'end', size:9, fill:'var(--ink)'});\n` +
    `    txt(bx, ty+rh, 'O(V)\\u00d7F(V)', {size:9, fill:'var(--ink)'}); txt(bx+bw, ty+rh, 'F(V)', {anchor:'end', size:9, fill:'var(--ink)'});\n` +
    `    svg.appendChild(mk('path',{d:'M '+(bx+44)+' '+(ty-4)+' L '+(bx+bw-22)+' '+(ty-4), fill:'none', stroke:'var(--ink)','stroke-width':1, 'marker-end':'url(#${widgetId}-a)'}));\n` +
    `    svg.appendChild(mk('path',{d:'M '+(bx+44)+' '+(ty+rh-4)+' L '+(bx+bw-22)+' '+(ty+rh-4), fill:'none', stroke:'var(--ink)','stroke-width':1, 'marker-end':'url(#${widgetId}-a)'}));\n` +
    `    svg.appendChild(mk('path',{d:'M '+(bx+18)+' '+(ty+6)+' L '+(bx+18)+' '+(ty+rh-14), fill:'none', stroke:'var(--violet)','stroke-width':1, 'marker-end':'url(#${widgetId}-a)'})); txt(bx+22, ty+rh/2+4, 'res', {size:7, fill:'var(--violet)'});\n` +
    `    svg.appendChild(mk('path',{d:'M '+(bx+bw)+' '+(ty+6)+' L '+(bx+bw)+' '+(ty+rh-14), fill:'none', stroke:'var(--violet)','stroke-width':1, 'marker-end':'url(#${widgetId}-a)'})); txt(bx+bw+4, ty+rh/2+4, 'res', {size:7, fill:'var(--violet)'});\n` +
    `    var defs=mk('defs',{}); var m=mk('marker',{id:'${widgetId}-a',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto'}); m.appendChild(mk('path',{d:'M0 0 L10 5 L0 10 z',fill:'var(--ink)'})); defs.appendChild(m); svg.appendChild(defs);\n` +
    `    txt(bx, ty+rh+20, 'commutes \\u2713', {size:10, fill:'var(--green)', weight:700});\n` +
    `    // numeric check at x0=5\n` +
    `    var x0=5, lhs=gs(x0), rhs=g(x0)*sFn(x0);\n` +
    `    txt(20, PBOT+30, '(g\\u00b7s)|_V at x=5  =  '+lhs.toFixed(3)+'      g|_V(5)\\u00b7s|_V(5)  =  '+g(x0).toFixed(3)+'\\u00b7'+sFn(x0).toFixed(3)+'  =  '+rhs.toFixed(3)+'   \\u2713', {size:10, fill:'var(--ink)'});\n` +
    `    out.textContent='A RINGED SPACE is a pair (X, O_X) with O_X a sheaf of (commutative, unital) rings \\u2014 here O_X = C\\u2070_X, continuous functions, the ring you can multiply by. An O_X-MODULE F is a sheaf of abelian groups in which every F(U) is a module over the ring O_X(U), COMPATIBLY with restriction: the square O(U)\\u00d7F(U)\\u2192F(U) over O(V)\\u00d7F(V)\\u2192F(V) commutes for V \\u2286 U. Concretely (the picture, with F = O_X itself, the free rank-1 module): take a function g \\u2208 O_X(U) = '+G.lab+' and a section s \\u2208 F(U); their product g\\u00b7s (yellow) is again a section. Restricting g\\u00b7s to V (pink) gives the SAME thing as multiplying the restrictions g|_V\\u00b7s|_V \\u2014 because multiplication is pointwise, the module action commutes with restriction (checked at x=5: '+lhs.toFixed(3)+' either way). For this free module F = O_X the square commutes AUTOMATICALLY \\u2014 but for a general O_X-module the action O_X(U)\\u00d7F(U)\\u2192F(U) is extra data, and this commuting square is the genuine axiom it must satisfy. That compatibility is exactly what upgrades \\u201ca module at each open\\u201d into an honest sheaf of modules. The category Mod(O_X) is ABELIAN and carries a tensor product F \\u2297_{O_X} G; the workhorse examples are O_X (rank 1), O_X\\u207f (free rank n / trivial bundle), IDEAL sheaves F \\u2286 O_X cutting out closed subschemes, and the TWISTING sheaves O(n) on projective space whose global sections are the degree-n forms.';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; curKey=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
