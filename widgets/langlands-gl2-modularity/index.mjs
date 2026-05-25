// langlands-gl2-modularity widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The proven GL_2 case of global Langlands: an
// elliptic curve E/Q of prime conductor N is matched to the weight-2 newform
// f in S_2(Gamma_0(N)), and the widget point-counts a_p(E) = p+1 - #E(F_p)
// LIVE while reading a_p(f) off the newform's q-expansion (LMFDB coefficients);
// the two independent sequences agree for every good prime — that IS modularity
// (L(E,s) = L(f,s)). Plain F_p / G_Q / GL_2 (blackboard F/A and the Q overline
// are astral / combining glyphs).

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
    `    <label>E =</label>\n    ${btn('11a', '11a', true)}\n    ${btn('19a', '19a', false)}\n    ${btn('37a', '37a', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 600 432" width="600" height="432" role="img" aria-label="The Modularity Theorem for the chosen elliptic curve: a_p of the curve, obtained by counting points over the prime fields, equals the q-expansion coefficient a_p of the attached weight-2 newform, for every good prime."><title>For an elliptic curve E over Q of conductor N matched to the weight-2 newform f in S_2(Gamma_0(N)), the widget draws the curve-side a_p(E) = p+1 minus the number of points of E over the prime field, computed by point counting, in one column, and the q-expansion coefficient a_p(f) of the newform in the next column, with a check mark on each row showing the two agree for every good prime. This equality for all p is the Modularity Theorem, equivalently the identity of L-functions L(E,s) = L(f,s).</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* langlands-gl2-modularity widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  var CURVES=[\n` +
    `    {k:'11a', N:11, eq:'y\\u00b2 + y = x\\u00b3 \\u2212 x\\u00b2 \\u2212 10x \\u2212 20', a1:0,a2:-1,a3:1,a4:-10,a6:-20,\n` +
    `      nf:'11.2.a.a', q:'q \\u2212 2q\\u00b2 \\u2212 q\\u00b3 + 2q\\u2074 + q\\u2075 + 2q\\u2076 \\u2212 2q\\u2077 \\u2212 2q\\u2079 \\u2212 2q\\u00b9\\u2070 + q\\u00b9\\u00b9 \\u2212 2q\\u00b9\\u00b2 + 4q\\u00b9\\u00b3 + \\u2026',\n` +
    `      af:{2:-2,3:-1,5:1,7:-2,13:4,17:-2,19:0,23:-1,29:0,31:7},\n` +
    `      note:'Conductor N = 11 (the smallest conductor of any elliptic curve over \\u211a). E is X\\u2080(11) itself, so the modular form is built into its very definition; semistable, so it is squarely inside Wiles\\u2019 1995 theorem. f = 11.2.a.a is the unique weight-2 newform of level 11.'},\n` +
    `    {k:'19a', N:19, eq:'y\\u00b2 + y = x\\u00b3 + x\\u00b2 \\u2212 9x \\u2212 15', a1:0,a2:1,a3:1,a4:-9,a6:-15,\n` +
    `      nf:'19.2.a.a', q:'q \\u2212 2q\\u00b3 \\u2212 2q\\u2074 + 3q\\u2075 \\u2212 q\\u2077 + q\\u2079 + 3q\\u00b9\\u00b9 + 4q\\u00b9\\u00b2 \\u2212 4q\\u00b9\\u00b3 + \\u2026',\n` +
    `      af:{2:0,3:-2,5:3,7:-1,11:3,13:-4,17:-3,23:0,29:6,31:-4},\n` +
    `      note:'Conductor N = 19, prime, so reduction is good at every p \\u2260 19 and a\\u2082 = 0 (the curve is supersingular at 2). f = 19.2.a.a is the unique weight-2 newform of level 19.'},\n` +
    `    {k:'37a', N:37, eq:'y\\u00b2 + y = x\\u00b3 \\u2212 x', a1:0,a2:0,a3:1,a4:-1,a6:0,\n` +
    `      nf:'37.2.a.a', q:'q \\u2212 2q\\u00b2 \\u2212 3q\\u00b3 + 2q\\u2074 \\u2212 2q\\u2075 + 6q\\u2076 \\u2212 q\\u2077 + 6q\\u2079 + 4q\\u00b9\\u2070 \\u2212 5q\\u00b9\\u00b9 \\u2212 6q\\u00b9\\u00b2 \\u2212 2q\\u00b9\\u00b3 + \\u2026',\n` +
    `      af:{2:-2,3:-3,5:-2,7:-1,11:-5,13:-2,17:0,19:0,23:2,29:6,31:-4},\n` +
    `      note:'Conductor N = 37, prime; this is the famous rank-1 curve y\\u00b2+y = x\\u00b3\\u2212x (its Mordell\\u2013Weil group is infinite, generated by (0,0)). f = 37.2.a.a is one of the two weight-2 newforms of level 37 \\u2014 the one with rational coefficients matching this E.'},\n` +
    `  ];\n` +
    `  var PRIMES=[2,3,5,7,11,13,17,19,23];\n` +
    `  function countPoints(C,p){ var cnt=1; /* point at infinity */\n` +
    `    for(var x=0;x<p;x++){ var rhs=(((x*x%p)*x%p) + C.a2*(x*x%p) + C.a4*x + C.a6)%p; rhs=((rhs%p)+p)%p;\n` +
    `      for(var y=0;y<p;y++){ var lhs=(y*y + C.a1*x*y + C.a3*y)%p; lhs=((lhs%p)+p)%p; if(lhs===rhs) cnt++; } }\n` +
    `    return cnt; }\n` +
    `  var cur='11a';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var C=null; for(var i=0;i<CURVES.length;i++) if(CURVES[i].k===cur) C=CURVES[i];\n` +
    `    if(!C) return;\n` +
    `    var defs=mk('defs',{}); var m=mk('marker',{id:'${widgetId}-ar',viewBox:'0 0 10 10',refX:5,refY:5,markerWidth:7,markerHeight:7,orient:'auto'}); m.appendChild(mk('path',{d:'M0 0 L10 5 L0 10 z',fill:'var(--violet)'})); defs.appendChild(m); svg.appendChild(defs);\n` +
    `    // ---- correspondence: arithmetic side <-> automorphic side ----\n` +
    `    svg.appendChild(mk('rect',{x:18,y:14,width:268,height:60,rx:8,fill:'var(--panel2)',stroke:'var(--cyan)','stroke-width':1.4}));\n` +
    `    txt(152,32,'elliptic curve  E / \\u211a',{size:11.5,weight:700,fill:'var(--cyan)'});\n` +
    `    txt(152,50,C.eq,{size:11,mono:true}); txt(152,66,'conductor N = '+C.N,{size:10,fill:'var(--mute)'});\n` +
    `    svg.appendChild(mk('rect',{x:314,y:14,width:268,height:60,rx:8,fill:'var(--panel2)',stroke:'var(--pink)','stroke-width':1.4}));\n` +
    `    txt(448,32,'weight-2 newform  f \\u2208 S\\u2082(\\u0393\\u2080('+C.N+'))',{size:11.5,weight:700,fill:'var(--pink)'});\n` +
    `    txt(448,50,C.q,{size:8.5,mono:true}); txt(448,66,'newform '+C.nf,{size:10,fill:'var(--mute)'});\n` +
    `    svg.appendChild(mk('line',{x1:286,y1:44,x2:314,y2:44,stroke:'var(--violet)','stroke-width':2,'marker-end':'url(#${widgetId}-ar)','marker-start':'url(#${widgetId}-ar)'}));\n` +
    `    txt(300,36,'mod.',{size:7.5,fill:'var(--violet)'});\n` +
    `    // ---- the comparison table over good primes ----\n` +
    `    var cols=[{x:64,h:'p'},{x:188,h:'#E(F_p)'},{x:320,h:'a_p(E)=p+1\\u2212#E'},{x:452,h:'a_p(f)'},{x:552,h:'match'}];\n` +
    `    var y0=98;\n` +
    `    txt(300,y0-6,'count points on E over each prime field  \\u2192  compare with the newform coefficient',{size:10,fill:'var(--mute)'});\n` +
    `    cols.forEach(function(c){ txt(c.x,y0+14,c.h,{size: c.h.length>8?9.5:11,weight:700,fill:'var(--violet)'}); });\n` +
    `    svg.appendChild(mk('line',{x1:24,y1:y0+22,x2:582,y2:y0+22,stroke:'var(--line)','stroke-width':0.8}));\n` +
    `    var ry=y0+22, allok=true;\n` +
    `    PRIMES.forEach(function(p){ if(p===C.N) return; ry+=26;\n` +
    `      var nE=countPoints(C,p), apE=p+1-nE, apF=C.af[p], ok=(apE===apF); if(!ok) allok=false;\n` +
    `      txt(cols[0].x,ry+4,''+p,{size:11,mono:true});\n` +
    `      txt(cols[1].x,ry+4,''+nE,{size:11,mono:true,fill:'var(--cyan)'});\n` +
    `      txt(cols[2].x,ry+4,(apE>=0?'+':'')+apE,{size:11,mono:true,fill:'var(--cyan)'});\n` +
    `      txt(cols[3].x,ry+4,(apF>=0?'+':'')+apF,{size:11,mono:true,fill:'var(--pink)'});\n` +
    `      txt(cols[4].x,ry+4, ok?'\\u2713':'\\u2717', {size:13,weight:700,fill: ok?'var(--green)':'var(--pink)'});\n` +
    `      svg.appendChild(mk('line',{x1:24,y1:ry+13,x2:582,y2:ry+13,stroke:'var(--line)','stroke-width':0.4}));\n` +
    `    });\n` +
    `    ry+=30;\n` +
    `    txt(300,ry, (allok?'every good prime agrees':'mismatch!')+'   \\u21d2   L(E,s) = L(f,s)   \\u2014 this is the Modularity Theorem',{size:11,weight:700,fill: allok?'var(--green)':'var(--pink)'});\n` +
    `    txt(300,ry+18,'(p = '+C.N+', the conductor, is bad reduction \\u2014 omitted; there a_'+C.N+' = \\u00b11)',{size:9,fill:'var(--mute)'});\n` +
    `    // ---- Galois <-> automorphic framing of the GL_2 Langlands case ----\n` +
    `    txt(300,ry+44,'\\u03c1_{E,\\u2113}: G_\\u211a \\u2192 GL\\u2082(\\u211a_\\u2113)   (Tate module)      \\u27f7      \\u03c0_f   on  GL\\u2082(A_\\u211a)',{size:10,fill:'var(--yellow)'});\n` +
    `    out.textContent = 'The MODULARITY THEOREM is the proven n=2 case of global Langlands over \\u211a. Every elliptic curve E/\\u211a is attached to a weight-2 cusp form f \\u2208 S\\u2082(\\u0393\\u2080(N)) with N the conductor of E, in the strong sense that L(E,s) = L(f,s) \\u2014 equivalently a_p(E) = a_p(f) for EVERY prime p. Here a_p(E) = p + 1 \\u2212 #E(F_p) is computed by literally counting the points of E over the prime field F_p (an arithmetic-geometry datum), while a_p(f) is read off the q-EXPANSION of the modular form (an analytic datum living on the upper half-plane). The table runs two completely independent computations and they agree on the nose, prime after prime. In Langlands\\u2019 language this is the matching of the 2-dimensional \\u2113-adic Galois representation \\u03c1_{E,\\u2113} on the Tate module T_\\u2113E with the cuspidal automorphic representation \\u03c0_f of GL\\u2082(A_\\u211a) generated by f; the equality of L-functions is local-global compatibility prime by prime. Wiles proved the semistable case in 1995 (with Taylor\\u2013Wiles patching closing the gap), and Breuil\\u2013Conrad\\u2013Diamond\\u2013Taylor extended it to all E/\\u211a in 2001. ' + C.note;\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b||!b.getAttribute('data-k')) return; cur=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
