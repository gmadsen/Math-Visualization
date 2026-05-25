// stacks-quotient-stack widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The quotient stack [X/G] via its action groupoid
// (G x X => X) on a gallery of finite actions: orbits are the points of [X/G],
// stabilizers are the automorphism groups, and the groupoid cardinality
// sum 1/|Stab| = |X|/|G|.

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
    `    ${btn('Bmu2', 'B&#8484;/2', true)}\n    ${btn('swap', '&#8484;/2 swap', false)}\n    ${btn('refl', '&#8484;/2 reflect', false)}\n    ${btn('rot3', '&#8484;/3 rotate', false)}\n    ${btn('rot3f', '&#8484;/3 + fix', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 340" width="560" height="340" role="img" aria-label="The action groupoid of a finite group action, its orbits as the points of the quotient stack, and the stabilizers as their automorphism groups"><title>For each finite action of G on a set X, the objects of X grouped into G-orbits with their stabilizers, and the points of the quotient stack [X/G] = the orbits, stacky where the stabilizer is nontrivial; the groupoid cardinality sum of 1 over stabilizer order equals the size of X over the order of G</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* stacks-quotient-stack widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  var ACTIONS=[\n` +
    `    {k:'Bmu2', label:'[pt / (\\u2124/2)]  =  B(\\u2124/2)', Gord:2, pts:['\\u2022'], orbits:[{m:[0],stab:2,aut:'\\u2124/2'}],\n` +
    `      note:'X is a single point, so the only data is a G-torsor: [pt/G] = BG. There is ONE point, and its automorphism group is all of G. A scheme can have no nontrivial automorphisms at a point, so BG is not a scheme.'},\n` +
    `    {k:'swap', label:'\\u2124/2 \\u21bb {a, b}   (swap)', Gord:2, pts:['a','b'], orbits:[{m:[0,1],stab:1,aut:'1'}],\n` +
    `      note:'The action is FREE (no point is fixed), so every stabilizer is trivial. Then [X/G] = X/G is an honest SCHEME (one point here) \\u2014 a free quotient has no stacky behaviour.'},\n` +
    `    {k:'refl', label:'\\u2124/2 \\u21bb {\\u22121, 0, 1}   (x \\u21a6 \\u2212x)', Gord:2, pts:['\\u22121','0','1'], orbits:[{m:[0,2],stab:1,aut:'1'},{m:[1],stab:2,aut:'\\u2124/2'}],\n` +
    `      note:'The fixed point 0 becomes a STACKY point with automorphism group \\u2124/2; the free orbit {\\u22121, 1} stays honest. This is exactly the local picture of [A\\u00b9/(\\u2124/2)] at the origin \\u2014 a \\u2124/2-stacky point sitting inside an otherwise ordinary quotient.'},\n` +
    `    {k:'rot3', label:'\\u2124/3 \\u21bb {0, 1, 2}   (+1)', Gord:3, pts:['0','1','2'], orbits:[{m:[0,1,2],stab:1,aut:'1'}],\n` +
    `      note:'A free \\u2124/3-action: one orbit, trivial stabilizer, so [X/G] = X/G is a single honest point (a scheme).'},\n` +
    `    {k:'rot3f', label:'\\u2124/3 \\u21bb {0, 1, 2, F}   (rotate; fix F)', Gord:3, pts:['0','1','2','F'], orbits:[{m:[0,1,2],stab:1,aut:'1'},{m:[3],stab:3,aut:'\\u2124/3'}],\n` +
    `      note:'The fixed point F becomes a STACKY point with automorphism group \\u2124/3, while the rotated orbit {0,1,2} is honest.'},\n` +
    `  ];\n` +
    `  var cur='Bmu2';\n` +
    `  function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=b; b=a%b; a=t; } return a||1; }\n` +
    `  function addArrowDefs(){ var defs=mk('defs',{}); var m=mk('marker',{id:'${widgetId}-ar',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto'}); m.appendChild(mk('path',{d:'M0 0 L10 5 L0 10 z',fill:'var(--mute)'})); defs.appendChild(m); svg.appendChild(defs); }\n` +
    `  function loop(cx,cy,col){ // self-loop above a dot = a nontrivial stabilizer element\n` +
    `    svg.appendChild(mk('path',{d:'M '+(cx-7)+' '+(cy-12)+' C '+(cx-20)+' '+(cy-34)+', '+(cx+20)+' '+(cy-34)+', '+(cx+7)+' '+(cy-12),fill:'none',stroke:col,'stroke-width':1.6,'marker-end':'url(#${widgetId}-ar)'})); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    addArrowDefs();\n` +
    `    var A=null; for(var i=0;i<ACTIONS.length;i++) if(ACTIONS[i].k===cur) A=ACTIONS[i];\n` +
    `    if(!A) return;\n` +
    `    txt(280, 26, A.label, {size:14, weight:700, fill:'var(--ink)'});\n` +
    `    txt(280, 46, 'objects of X, grouped into G-orbits (arrows = the action; loops = stabilizer):', {size:10, fill:'var(--mute)'});\n` +
    `    // ---- orbit clusters ----\n` +
    `    var DOT=15, gapd=34, gapo=46, padc=16, yObj=104;\n` +
    `    var ws=A.orbits.map(function(o){ return o.m.length*gapd + padc; });\n` +
    `    var total=ws.reduce(function(s,w){return s+w;},0) + (A.orbits.length-1)*gapo;\n` +
    `    var x0=Math.max(20,(560-total)/2);\n` +
    `    A.orbits.forEach(function(o,oi){\n` +
    `      var w=ws[oi]; var stacky=o.stab>1; var col=stacky?'var(--violet)':'var(--green)';\n` +
    `      svg.appendChild(mk('rect',{x:x0,y:yObj-26,width:w,height:52,rx:12,fill:'none',stroke:col,'stroke-width':1.4,'stroke-dasharray':stacky?'0':'4 3'}));\n` +
    `      var dx=x0+padc/2+gapd/2;\n` +
    `      o.m.forEach(function(idx){ var cx=dx, cy=yObj;\n` +
    `        svg.appendChild(mk('circle',{cx:cx,cy:cy,r:DOT,fill:'var(--panel2)',stroke:col,'stroke-width':1.8}));\n` +
    `        txt(cx, cy+4, A.pts[idx], {size:12, fill:'var(--ink)'});\n` +
    `        dx+=gapd; });\n` +
    `      if(stacky) loop(x0+w/2, yObj-DOT, col);\n` +
    `      txt(x0+w/2, yObj+44, stacky?('Aut = '+o.aut):'Aut = 1 (free)', {size:10, fill:col, weight: stacky?700:400});\n` +
    `      x0+=w+gapo;\n` +
    `    });\n` +
    `    // ---- quotient arrow ----\n` +
    `    svg.appendChild(mk('line',{x1:280,y1:170,x2:280,y2:198,stroke:'var(--mute)','stroke-width':1.6,'marker-end':'url(#${widgetId}-ar)'}));\n` +
    `    txt(354, 188, 'quotient by  G \\u00d7 X \\u21c9 X', {size:10, fill:'var(--mute)', anchor:'start'});\n` +
    `    txt(280, 224, 'points of [X/G]  =  the G-orbits:', {size:11, fill:'var(--ink)', weight:600});\n` +
    `    // ---- coarse points row ----\n` +
    `    var no=A.orbits.length, step=Math.min(150, 380/no), cxs=280-(no-1)*step/2, yPt=262;\n` +
    `    A.orbits.forEach(function(o,oi){ var cx=cxs+oi*step; var stacky=o.stab>1; var col=stacky?'var(--violet)':'var(--green)';\n` +
    `      if(stacky) svg.appendChild(mk('circle',{cx:cx,cy:yPt,r:13,fill:'none',stroke:col,'stroke-width':1.4}));\n` +
    `      svg.appendChild(mk('circle',{cx:cx,cy:yPt,r:9,fill:stacky?col:'var(--panel2)',stroke:col,'stroke-width':2}));\n` +
    `      txt(cx, yPt+30, stacky?('stacky \\u00b7 Aut '+o.aut):'honest', {size:10, fill:col, weight: stacky?700:400});\n` +
    `    });\n` +
    `    // ---- groupoid cardinality ----\n` +
    `    var num=A.pts.length, den=A.Gord, g=gcd(num,den);\n` +
    `    var sumStr=A.orbits.map(function(o){return '1/'+o.stab;}).join(' + ');\n` +
    `    txt(280, 312, 'groupoid cardinality  \\u03a3 1/|Stab|  =  '+sumStr+'  =  '+(num/g)+'/'+(den/g)+'  =  |X|/|G|', {size:11, fill:'var(--cyan)', weight:600});\n` +
    `    out.textContent='The QUOTIENT STACK [X/G] is presented by the ACTION GROUPOID G \\u00d7 X \\u21c9 X: its objects are the points of X and it has one arrow x \\u2192 g\\u00b7x for each g in G. Three things you read straight off the groupoid: (1) the POINTS of [X/G] are the G-ORBITS \\u2014 its coarse space is the ordinary quotient X/G; (2) the AUTOMORPHISM GROUP of the point [x] is the STABILIZER Stab_G(x) of any representative (well-defined up to conjugacy), so a point is \\u201cstacky\\u201d exactly when its stabilizer is nontrivial; (3) the GROUPOID CARDINALITY \\u03a3_{orbits} 1/|Stab| equals |X|/|G| by orbit\\u2013stabilizer (each orbit has |G|/|Stab| elements). Two special cases bound the picture: when X is a point, the equivariant map carries no data and [pt/G] = BG, a single point with automorphism group G (never a scheme for nontrivial G); when G acts FREELY, all stabilizers are trivial and [X/G] = X/G is an honest scheme. (And [X/{e}] = X.) '+A.note;\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; cur=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
