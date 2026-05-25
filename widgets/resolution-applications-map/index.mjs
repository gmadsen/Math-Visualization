// resolution-applications-map widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A clickable thread-map of the applications and open
// frontiers of resolution of singularities, hung around the resolution hub
// pi: Y -> X. A survey/landscape navigation widget (no computational toy).

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
    `    ${btn('overview', 'Overview', true)}\n    ${btn('mmp', 'MMP', false)}\n    ${btn('motivic', 'Motivic integration', false)}\n    ${btn('weakfact', 'Weak factorisation', false)}\n    ${btn('logres', 'Log resolution', false)}\n    ${btn('charp', 'char-p frontier', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="A hub-and-spoke map of resolution of singularities and its applications: the minimal model program, motivic integration, weak factorisation, log resolution, and the characteristic-p frontier"><title>A central hub (the resolution pi from Y to X, Y smooth) with five spokes: the minimal model program, motivic integration, weak factorisation, log resolution, and the open characteristic-p frontier. Selecting a spoke explains how resolution of singularities feeds that area.</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* resolution-applications-map widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  var NODES=[\n` +
    `    {k:'mmp', short:'MMP (Mori)',\n` +
    `      desc:'MINIMAL MODEL PROGRAM (Mori). Starting from a smooth projective Y, contract K-negative extremal rays \\u2014 and perform flips where a contraction is too drastic \\u2014 to reach a MINIMAL or CANONICAL model. This bridges the birational classification of varieties to the geometry of the canonical bundle K_X, and resolution is the smooth starting point the program runs from. (See the Minimal models & birational geometry topic.)'},\n` +
    `    {k:'motivic', short:'Motivic integration',\n` +
    `      desc:'MOTIVIC INTEGRATION (Kontsevich). Integrals over the ARC SPACE of a singular variety are pulled back along a LOG RESOLUTION; the change-of-variables formula produces a STRINGY EULER CHARACTERISTIC that agrees for any two crepant resolutions \\u2014 the first hint of the McKay correspondence in arbitrary dimension.'},\n` +
    `    {k:'weakfact', short:'Weak factorisation',\n` +
    `      desc:'WEAK FACTORISATION (W\\u0142odarczyk; Abramovich\\u2013Karu\\u2013Matsuki\\u2013W\\u0142odarczyk). Any birational map between two SMOOTH projective varieties factors as a finite sequence of smooth BLOW-UPS and BLOW-DOWNS. The proof runs through log resolution \\u2014 a structural payoff of being able to resolve.'},\n` +
    `    {k:'logres', short:'Log resolution',\n` +
    `      desc:'LOG RESOLUTION. Resolve a PAIR (X, D) so that the total transform \\u03c0\\u207b\\u00b9(D) \\u222a Exc(\\u03c0) is a SIMPLE NORMAL CROSSING divisor (smooth components meeting transversally). This is the standing technical hypothesis under which most of modern birational geometry \\u2014 discrepancies, log canonical thresholds, vanishing theorems \\u2014 is set up.'},\n` +
    `    {k:'charp', short:'char-p frontier',\n` +
    `      desc:'OPEN FRONTIER \\u2014 CHARACTERISTIC p. Hironaka (1964) resolved singularities in ALL dimensions in characteristic 0. In characteristic p the picture is incomplete: SURFACES were settled by Abhyankar and THREEFOLDS by Cossart\\u2013Piltant, but DIMENSION \\u2265 4 remains OPEN. de Jong\\u2019s ALTERATIONS give a weaker, generically-finite substitute (a proper generically-finite cover by a smooth variety) in all characteristics and dimensions.'},\n` +
    `  ];\n` +
    `  var OVERVIEW='Resolution of singularities is a FOUNDATIONAL TOOL: a proper birational \\u03c0: Y \\u2192 X with Y smooth and \\u03c0 an isomorphism over the smooth locus lets a theorem proved for smooth varieties extend to singular ones by passage through Y. Click a spoke to see where it feeds: the minimal model program, motivic integration, weak factorisation, log resolution, and the still-open characteristic-p frontier.';\n` +
    `  var cur='overview';\n` +
    `  var cx=280, cy=150, R=110;\n` +
    `  var POS=NODES.map(function(n,i){ var a=(90-i*72)*Math.PI/180; return [cx+R*Math.cos(a), cy-R*Math.sin(a)]; });\n` +
    `  function box(x,y,w,h,sel,col){ svg.appendChild(mk('rect',{x:x-w/2,y:y-h/2,width:w,height:h,rx:7,fill: sel?col:'var(--panel2)',stroke:col,'stroke-width': sel?2.4:1.4,'fill-opacity': sel?0.22:1})); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // spokes\n` +
    `    NODES.forEach(function(n,i){ var sel=(cur===n.k); svg.appendChild(mk('line',{x1:cx,y1:cy,x2:POS[i][0],y2:POS[i][1],stroke: sel?'var(--yellow)':'var(--line)','stroke-width': sel?2:1})); });\n` +
    `    // hub\n` +
    `    var hubSel=(cur==='overview'); box(cx,cy,116,40,hubSel,'var(--violet)');\n` +
    `    txt(cx,cy-3,'resolution',{size:11,fill:'var(--violet)',weight:700}); txt(cx,cy+12,'\\u03c0: Y \\u2192 X  (Y smooth)',{size:10,fill:'var(--ink)'});\n` +
    `    // node boxes\n` +
    `    NODES.forEach(function(n,i){ var sel=(cur===n.k); var col= n.k==='charp'?'var(--pink)':'var(--cyan)';\n` +
    `      box(POS[i][0],POS[i][1],128,30,sel,col);\n` +
    `      txt(POS[i][0],POS[i][1]+4,n.short,{size:10,fill: sel?col:'var(--ink)',weight: sel?700:500});\n` +
    `    });\n` +
    `    var n=null; for(var i=0;i<NODES.length;i++) if(NODES[i].k===cur) n=NODES[i];\n` +
    `    out.textContent = n ? n.desc : OVERVIEW;\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; cur=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
