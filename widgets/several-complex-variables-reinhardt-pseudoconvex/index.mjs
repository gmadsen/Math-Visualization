// several-complex-variables-reinhardt-pseudoconvex widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Reinhardt domains: a domain of holomorphy iff its
// log image is convex. A slider dents the upper boundary; when non-convex the
// holomorphic (log-convex) hull fills the dent -> forced Laurent extension.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-m">boundary middle height</label>\n` +
    `    <input type="range" id="${widgetId}-m" min="-26" max="6" value="2" step="1">\n` +
    `    <span class="pill" id="${widgetId}-mv">…</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="The log image of a Reinhardt domain in the (log|z1|, log|z2|) plane; convex means pseudoconvex, a dent is filled by the holomorphic hull"><title>A Reinhardt domain is a domain of holomorphy iff its log image is convex; a dented (non-convex) log image is filled by the log-convex holomorphic hull, forcing holomorphic functions to extend</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* several-complex-variables-reinhardt-pseudoconvex widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sm=document.getElementById('${widgetId}-m'), mv=document.getElementById('${widgetId}-mv');\n` +
    `  if(!svg||!out||!sm||!mv) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    // (s,t) window and plot box
    `  var WMIN=-4, WMAX=0.7, PX0=92, PX1=372, PTOP=44, PBOT=276;\n` +
    `  function SX(s){ return PX0 + (s-WMIN)/(WMAX-WMIN)*(PX1-PX0); }\n` +
    `  function TY(t){ return PBOT - (t-WMIN)/(WMAX-WMIN)*(PBOT-PTOP); }\n` +
    // domain control points: upper boundary through (s0,fL)-(sm,fM)-(s1,fR), floor at TB
    `  var s0=-3.5, s1=0.3, smid=-1.6, fL=0.3, fR=-1.5, TB=-3.8;\n` +
    `  var chordMid = fL + (fR-fL)*(smid-s0)/(s1-s0);\n` +  // chord height above the slider point
    `  function pt(s,t){ return SX(s).toFixed(1)+' '+TY(t).toFixed(1); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var fM=parseInt(sm.value,10)/10; mv.textContent='mid t = '+fM.toFixed(1);\n` +
    `    var dented = fM < chordMid - 1e-9;\n` +
    // axes
    `    svg.appendChild(mk('line',{x1:PX0,y1:TY(0),x2:PX1,y2:TY(0),stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:SX(0),y1:PTOP,x2:SX(0),y2:PBOT,stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt(PX1-2, TY(0)-4, 's = log|z\\u2081|', {anchor:'end', size:9, fill:'var(--mute)'});\n` +
    `    txt(SX(0)+4, PTOP+8, 't = log|z\\u2082|', {size:9, fill:'var(--mute)'});\n` +
    `    txt(SX(0)+3, TY(0)+11, '0', {size:8, fill:'var(--mute)'});\n` +
    `    txt(SX(0)-14, TY(0)+11, '|z|=1', {size:7, fill:'var(--mute)'});\n` +
    // log image omega (below the dented/bulged piecewise curve, above floor)
    `    var d='M '+pt(s0,TB)+' L '+pt(s0,fL)+' L '+pt(smid,fM)+' L '+pt(s1,fR)+' L '+pt(s1,TB)+' Z';\n` +
    `    svg.appendChild(mk('path',{d:d, fill:'var(--cyan)','fill-opacity':0.16, stroke:'var(--cyan)','stroke-width':2}));\n` +
    // hull fill (the dent triangle), only when dented
    `    if(dented){ var tri='M '+pt(s0,fL)+' L '+pt(smid,fM)+' L '+pt(s1,fR)+' Z';\n` +
    `      svg.appendChild(mk('path',{d:tri, fill:'var(--pink)','fill-opacity':0.28, stroke:'none'}));\n` +
    `      svg.appendChild(mk('line',{x1:SX(s0),y1:TY(fL),x2:SX(s1),y2:TY(fR),stroke:'var(--pink)','stroke-width':1.6,'stroke-dasharray':'5 3'}));\n` +
    `      txt(SX(smid), TY(fM)-26, 'hull fills this', {anchor:'middle', size:9, fill:'var(--pink)', weight:700}); }\n` +
    // control point dot
    `    svg.appendChild(mk('circle',{cx:SX(smid), cy:TY(fM), r:4, fill:'var(--yellow)'}));\n` +
    // labels
    `    txt(SX(-2.1), TY(-2.2), '\\u03c9 = log image', {anchor:'middle', size:10, fill:'var(--cyan)', weight:700});\n` +
    `    var convex = !dented;\n` +
    `    txt(PX1+14, PTOP+12, convex?'CONVEX':'NOT convex', {size:12, weight:700, fill: convex?'var(--green)':'var(--pink)'});\n` +
    `    txt(PX1+14, PTOP+30, convex?'\\u21d2 pseudoconvex':'\\u21d2 hull \\u2295 dent', {size:9, fill:'var(--mute)'});\n` +
    `    txt(PX1+14, PTOP+44, convex?'\\u21d2 domain of':'\\u21d2 NOT a domain', {size:9, fill:'var(--mute)'});\n` +
    `    txt(PX1+14, PTOP+56, convex?'   holomorphy':'   of holomorphy', {size:9, fill:'var(--mute)'});\n` +
    `    out.textContent='In one variable every open set carries a function that does not extend (so \\u201cdomain of holomorphy\\u201d is vacuous), but in \\u2102\\u207f (n\\u22652) Hartogs shows most domains have forced extensions \\u2014 the ones that do NOT are the domains of holomorphy, and by Cartan\\u2013Thullen + Oka these are exactly the holomorphically convex = pseudoconvex domains. For a complete REINHARDT domain \\u03a9 (invariant under (z\\u2081,z\\u2082) \\u21a6 (e^{i\\u03b8\\u2081}z\\u2081, e^{i\\u03b8\\u2082}z\\u2082) and closed under shrinking each |z\\u1d62|, so \\u03c9 extends toward (\\u2212\\u221e,\\u2212\\u221e)) all of this becomes plane geometry: \\u03a9 is a domain of holomorphy \\u21d4 its LOG IMAGE \\u03c9 = {(log|z\\u2081|, log|z\\u2082|)} is CONVEX. The reason is the Laurent series: every holomorphic f \\u2208 O(\\u03a9) expands as \\u03a3 c\\u03b1 z\\u2081^{\\u03b1\\u2081} z\\u2082^{\\u03b1\\u2082}, and a monomial\\u2019s region of convergence is a half-plane in (s,t) = (log|z\\u2081|, log|z\\u2082|), so the common domain of convergence \\u2014 hence the holomorphic hull \\u2014 is always the CONVEX hull of \\u03c9. '+(convex ? 'Here \\u03c9 is convex: \\u03a9 equals its own holomorphic hull, so it IS a domain of holomorphy (pseudoconvex, Levi form \\u22650 on the boundary). Lower the middle of the boundary to break convexity.' : 'Here \\u03c9 is dented (non-convex): the holomorphic hull is the log-convex hull, which fills the pink triangle. Every holomorphic function on \\u03a9 automatically converges \\u2014 hence extends \\u2014 there, so \\u03a9 is NOT a domain of holomorphy; the dented boundary is the Levi-CONCAVE part where extension is forced, the higher-dimensional shadow of the Hartogs phenomenon.');\n` +
    `  }\n` +
    `  sm.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
