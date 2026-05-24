// pp-cross-ratio widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The cross-ratio [A,B;C,D]=(a-c)(b-d)/((a-d)(b-c)) as
// the PGL2 invariant: a Mobius slider maps the four points to a second line and
// the cross-ratio is unchanged. Panel: orbit of six values, j(lambda), harmonic.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  function ptRow(id, lbl, val) {
    return (
      `    <label for="${widgetId}-${id}">$${lbl}$</label>\n` +
      `    <input type="range" id="${widgetId}-${id}" min="-3" max="4.5" value="${val}" step="0.25">\n` +
      `    <span class="pill" id="${widgetId}-${id}v">${lbl} = ${val}</span>\n`
    );
  }
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` + ptRow('a','a','0') + ptRow('b','b','1') +
    `  </div>\n` +
    `  <div class="row">\n` + ptRow('c','c','2') + ptRow('d','d','3') +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-s">Möbius map $t\\mapsto\\frac{t+s}{\\gamma t+1}$</label>\n` +
    `    <input type="range" id="${widgetId}-s" min="-2" max="2" value="0" step="0.1">\n` +
    `    <span class="pill" id="${widgetId}-sv">s = 0.0</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="Four points on a projective line and their image under a Möbius map, with the cross-ratio shown equal on both"><title>The cross-ratio of four collinear points is invariant under the projective (Möbius) map: the four images on the second line have the same cross-ratio</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* pp-cross-ratio widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var ids=['a','b','c','d','s'], el={};\n` +
    `  ids.forEach(function(k){ el[k]=document.getElementById('${widgetId}-'+k); el[k+'v']=document.getElementById('${widgetId}-'+k+'v'); });\n` +
    `  if(!svg||!out||!el.a||!el.s) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var COL=['var(--cyan)','var(--yellow)','var(--green)','var(--pink)'], LBL=['A','B','C','D'];\n` +
    `  function cross(p){ return ((p[0]-p[2])*(p[1]-p[3]))/((p[0]-p[3])*(p[1]-p[2])); }\n` +
    `  function fmt(x){ if(!isFinite(x)) return '\\u221e'; var r=Math.round(x*1000)/1000; if(Math.abs(r)<1e-9) r=0; return (''+r); }\n` +
    `  var PX0=58, PX1=326;\n` +
    `  function drawLine(y, dom, pts, labelLeft, lam){\n` +
    `    var lo=dom[0], hi=dom[1]; if(hi-lo<1e-6){ hi=lo+1; }\n` +
    `    function X(v){ return PX0 + (v-lo)/(hi-lo)*(PX1-PX0); }\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:y,x2:PX1,y2:y,stroke:'var(--line)','stroke-width':1.5}));\n` +
    `    txt(PX0-8, y+4, labelLeft, {size:11, fill:'var(--mute)', anchor:'end'});\n` +
    `    for(var i=0;i<4;i++){ var x=X(pts[i]);\n` +
    `      svg.appendChild(mk('circle',{cx:x, cy:y, r:5, fill:COL[i], stroke:'var(--bg)','stroke-width':1}));\n` +
    `      txt(x, y-12, LBL[i], {size:12, fill:COL[i], weight:700, anchor:'middle'});\n` +
    `      txt(x, y+20, fmt(pts[i]), {size:9, fill:'var(--mute)', anchor:'middle'});\n` +
    `    }\n` +
    `    txt(PX1+8, y+4, '\\u03bb = '+fmt(lam), {size:12, fill:'var(--ink)', weight:600});\n` +
    `  }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var a=+el.a.value, b=+el.b.value, c=+el.c.value, d=+el.d.value, s=+el.s.value;\n` +
    `    el.av.textContent='a = '+a; el.bv.textContent='b = '+b; el.cv.textContent='c = '+c; el.dv.textContent='d = '+d; el.sv.textContent='s = '+s.toFixed(1);\n` +
    `    var P=[a,b,c,d];\n` +
    `    var gamma=0.1*s;\n` +
    `    function M(t){ return (t+s)/(gamma*t+1); }\n` +
    `    var Q=P.map(M);\n` +
    `    var lam=cross(P), lam2=cross(Q);\n` +
    // line 1: fixed domain matching slider range
    `    drawLine(96, [-3,4.5], P, 'line \\u2113', lam);\n` +
    // line 2: autoscaled to images
    `    var lo=Math.min.apply(null,Q), hi=Math.max.apply(null,Q), pad=(hi-lo)*0.08||0.5;\n` +
    `    drawLine(176, [lo-pad,hi+pad], Q, 'image', lam2);\n` +
    `    txt(PX0, 210, 'Mobius image: t \\u21a6 (t+'+fmt(s)+')/('+fmt(gamma)+'\\u00b7t+1)  \\u2014  a projective map of the line', {size:10, fill:'var(--mute)'});\n` +
    `    txt(PX0, 230, (Math.abs(lam-lam2)<1e-6 ? '\\u2713 cross-ratio unchanged: \\u03bb = '+fmt(lam)+' on both lines (PGL\\u2082-invariant)' : 'difference '+fmt(lam-lam2)), {size:11, fill:'var(--green)', weight:600});\n` +
    // right panel: orbit + j + harmonic
    `    var TX=448;\n` +
    `    var orbit=[lam,1-lam,1/lam,1/(1-lam),lam/(lam-1),(lam-1)/lam];\n` +
    `    txt(TX, 36, '\\u03bb = '+fmt(lam), {size:13, fill:'var(--ink)', weight:700});\n` +
    `    txt(TX, 56, 'S\\u2084 orbit (6 values):', {size:9, fill:'var(--mute)'});\n` +
    `    var oy=72; orbit.forEach(function(v,i){ txt(TX, oy+i*15, '\\u2022 '+fmt(v), {size:10, fill:'var(--cyan)'}); });\n` +
    `    var jv=256*Math.pow(lam*lam-lam+1,3)/(lam*lam*Math.pow(lam-1,2));\n` +
    `    txt(TX, oy+6*15+8, 'j(\\u03bb) = '+fmt(jv), {size:10, fill:'var(--yellow)'});\n` +
    `    var harm=Math.abs(lam+1)<1e-3;\n` +
    `    if(harm) txt(TX, oy+6*15+26, '\\u2713 harmonic (\\u03bb = \\u22121)', {size:10, fill:'var(--pink)', weight:600});\n` +
    `    out.textContent = 'The cross-ratio of four collinear points A,B,C,D with coordinates a,b,c,d is [A,B;C,D] = (a\\u2212c)(b\\u2212d) / ((a\\u2212d)(b\\u2212c)) = '+fmt(lam)+'. Drag the s slider: the M\\u00f6bius (projective) map t\\u21a6(t+s)/(\\u03b3t+1) moves all four image points on the second line, yet \\u03bb is unchanged \\u2014 the cross-ratio is the fundamental PGL\\u2082(K)-invariant, so two quadruples are projectively equivalent iff their cross-ratios agree. Permuting the four points sends \\u03bb through the six-value orbit {\\u03bb, 1\\u2212\\u03bb, 1/\\u03bb, 1/(1\\u2212\\u03bb), \\u03bb/(\\u03bb\\u22121), (\\u03bb\\u22121)/\\u03bb} (only the Klein four-group fixes \\u03bb); the function j(\\u03bb)=256(\\u03bb\\u00b2\\u2212\\u03bb+1)\\u00b3/(\\u03bb\\u00b2(\\u03bb\\u22121)\\u00b2)='+fmt(jv)+' is S\\u2084-invariant and reappears as the j-invariant of an elliptic curve. The special value \\u03bb=\\u22121 is the harmonic configuration.';\n` +
    `  }\n` +
    `  ids.forEach(function(k){ el[k].addEventListener('input', draw); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
