// operator-algebras-positive widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The commutative picture of positivity: in the
// self-adjoint part of C({1,2}) ≅ ℝ² an element is its pair of eigenvalues
// (λ₁,λ₂). The positive cone A₊ is the first quadrant; the Löwner order a≤b is
// the translated cone; the order interval [0,1] is the unit square; and the
// positive square root b=√a (functional calculus) is a second point. The panel
// checks a≥0 ⇔ self-adjoint ∧ σ(a)⊆[0,∞) ⇔ a=b*b.

import { escapeHtml } from '../_shared/escape.mjs';

const DEFAULT_PRESETS = [
  { label: '$1$', l1: 1, l2: 1 },
  { label: '$p$', l1: 1, l2: 0 },
  { label: 'positive', l1: 2.25, l2: 0.75 },
  { label: 'indefinite', l1: 2, l2: -1 }
];

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const lo = params.lo != null ? params.lo : -1.5;
  const hi = params.hi != null ? params.hi : 3;
  const step = params.step != null ? params.step : 0.25;
  const presets = Array.isArray(params.presets) && params.presets.length ? params.presets : DEFAULT_PRESETS;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const btns = presets.map((p, i) =>
    `    <button type="button" id="${widgetId}-p${i}">${p.label}</button>`).join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">jump to</span>\n` +
    btns + `\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-l1">$\\lambda_1$ (value at point 1)</label>\n` +
    `    <input type="range" id="${widgetId}-l1" min="${lo}" max="${hi}" value="2.25" step="${step}">\n` +
    `    <span class="pill" id="${widgetId}-l1v">&#955;&#8321; = 2.25</span>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-l2">$\\lambda_2$ (value at point 2)</label>\n` +
    `    <input type="range" id="${widgetId}-l2" min="${lo}" max="${hi}" value="0.75" step="${step}">\n` +
    `    <span class="pill" id="${widgetId}-l2v">&#955;&#8322; = 0.75</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 320" width="540" height="320" role="img" aria-label="The positive cone and Lowner order in the self-adjoint plane of C of a two-point space"><title>Positive elements of a C*-algebra: the positive cone is the first quadrant, the Lowner order is the translated cone, the order interval [0,1] is the unit square, and the positive square root is a second point</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  const lo = params.lo != null ? params.lo : -1.5;
  const hi = params.hi != null ? params.hi : 3;
  const step = params.step != null ? params.step : 0.25;
  const presets = Array.isArray(params.presets) && params.presets.length ? params.presets : DEFAULT_PRESETS;
  const data = JSON.stringify({ lo, hi, step, presets });
  return (
    `<script>\n` +
    `/* operator-algebras-positive widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var P=${data};\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var s1=document.getElementById('${widgetId}-l1'), s2=document.getElementById('${widgetId}-l2');\n` +
    `  var v1=document.getElementById('${widgetId}-l1v'), v2=document.getElementById('${widgetId}-l2v');\n` +
    `  var pbtns=P.presets.map(function(_,i){ return document.getElementById('${widgetId}-p'+i); });\n` +
    `  if(!svg||!out||!s1||!s2||!v1||!v2||pbtns.some(function(b){return !b;})) return;\n` +
    `  var lo=P.lo, hi=P.hi; if(hi<=lo) hi=lo+1;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    `  function vrow(x,y,label,ok){ svg.appendChild(mk('text',{x:x,y:y,'font-size':13,fill:ok?'var(--green)':'var(--pink)'},ok?'\\u2713':'\\u2717')); txt(x+17,y,label,{size:11,fill:'var(--ink)'}); }\n` +
    `  var PX0=50, PX1=290, PY0=280, PY1=40;\n` +
    `  function sx(l){ return PX0 + (l-lo)/(hi-lo)*(PX1-PX0); }\n` +
    `  function sy(l){ return PY0 - (l-lo)/(hi-lo)*(PY0-PY1); }\n` +
    `  function clampX(x){ return Math.max(PX0,Math.min(PX1,x)); }\n` +
    `  function clampY(y){ return Math.max(PY1,Math.min(PY0,y)); }\n` +
    // rect from two data-derived pixel corners, clamped to the plot box and normalised to non-negative w/h (robust to any lo/hi)
    `  function crect(xa,ya,xb,yb,attrs){ var x0=clampX(xa),x1=clampX(xb),y0=clampY(ya),y1=clampY(yb); attrs.x=Math.min(x0,x1); attrs.y=Math.min(y0,y1); attrs.width=Math.abs(x1-x0); attrs.height=Math.abs(y1-y0); return mk('rect',attrs); }\n` +
    `  var EPS=1e-9;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var l1=parseFloat(s1.value), l2=parseFloat(s2.value);\n` +
    `    v1.innerHTML='\\u03bb\\u2081 = '+l1; v2.innerHTML='\\u03bb\\u2082 = '+l2;\n` +
    `    pbtns.forEach(function(b,i){ var on=Math.abs(P.presets[i].l1-l1)<1e-6 && Math.abs(P.presets[i].l2-l2)<1e-6; b.classList.toggle('active',on); b.setAttribute('aria-pressed',on?'true':'false'); });\n` +
    `    if(hi>0){ svg.appendChild(crect(sx(0),sy(hi),sx(hi),sy(0),{fill:'var(--green)','fill-opacity':0.12})); }\n` +
    `    var ucx=clampX(sx(l1)), ucy=clampY(sy(l2));\n` +
    `    svg.appendChild(mk('rect',{x:ucx,y:PY1,width:PX1-ucx,height:ucy-PY1,fill:'var(--violet)','fill-opacity':0.13}));\n` +
    `    svg.appendChild(mk('line',{x1:ucx,y1:ucy,x2:PX1,y2:ucy,stroke:'var(--violet)','stroke-width':1,'stroke-dasharray':'3 3'}));\n` +
    `    svg.appendChild(mk('line',{x1:ucx,y1:ucy,x2:ucx,y2:PY1,stroke:'var(--violet)','stroke-width':1,'stroke-dasharray':'3 3'}));\n` +
    `    svg.appendChild(crect(sx(0),sy(1),sx(1),sy(0),{fill:'none',stroke:'var(--cyan)','stroke-width':1.2,'stroke-dasharray':'4 3'}));\n` +
    `    txt(clampX(sx(0))+4, clampY(sy(1))-4, '[0,1]', {size:10, fill:'var(--cyan)'});\n` +
    `    for(var t=Math.ceil(lo); t<=Math.floor(hi); t++){ if(t===0) continue;\n` +
    `      svg.appendChild(mk('line',{x1:sx(t),y1:PY1,x2:sx(t),y2:PY0,stroke:'var(--line)','stroke-width':0.5,'stroke-opacity':0.5}));\n` +
    `      svg.appendChild(mk('line',{x1:PX0,y1:sy(t),x2:PX1,y2:sy(t),stroke:'var(--line)','stroke-width':0.5,'stroke-opacity':0.5}));\n` +
    `      txt(sx(t), sy(0)+13, ''+t, {size:9, fill:'var(--mute)', anchor:'middle'});\n` +
    `      txt(sx(0)-7, sy(t)+3, ''+t, {size:9, fill:'var(--mute)', anchor:'end'}); }\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:sy(0),x2:PX1+6,y2:sy(0),stroke:'var(--mute)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:sx(0),y1:PY0,x2:sx(0),y2:PY1-6,stroke:'var(--mute)','stroke-width':1}));\n` +
    `    txt(PX1+10, sy(0)+4, '\\u03bb\\u2081', {size:11, fill:'var(--mute)', italic:true});\n` +
    `    txt(sx(0)-4, PY1-9, '\\u03bb\\u2082', {size:11, fill:'var(--mute)', italic:true, anchor:'middle'});\n` +
    `    svg.appendChild(mk('circle',{cx:sx(1),cy:sy(1),r:3,fill:'none',stroke:'var(--ink)','stroke-width':1}));\n` +
    `    txt(sx(1)+6, sy(1)-5, '1', {size:10, fill:'var(--mute)'});\n` +
    `    var pos = (l1>=-EPS && l2>=-EPS);\n` +
    `    var neg = (l1<=EPS && l2<=EPS);\n` +
    `    if(pos){ var b1=Math.sqrt(Math.max(0,l1)), b2=Math.sqrt(Math.max(0,l2));\n` +
    `      svg.appendChild(mk('line',{x1:sx(l1),y1:sy(l2),x2:sx(b1),y2:sy(b2),stroke:'var(--cyan)','stroke-width':1,'stroke-opacity':0.6}));\n` +
    `      svg.appendChild(mk('circle',{cx:sx(b1),cy:sy(b2),r:4,fill:'var(--cyan)'}));\n` +
    `      txt(sx(b1)+6, sy(b2)+4, 'b = \\u221aa', {size:10, fill:'var(--cyan)'}); }\n` +
    `    var ac = pos?'var(--green)':(neg?'var(--pink)':'var(--orange)');\n` +
    `    svg.appendChild(mk('circle',{cx:clampX(sx(l1)),cy:clampY(sy(l2)),r:5.5,fill:ac}));\n` +
    `    txt(clampX(sx(l1))+7, clampY(sy(l2))-7, 'a', {size:13, fill:ac, weight:600});\n` +
    `    var TX=312;\n` +
    `    txt(TX, 52, 'a = (\\u03bb\\u2081, \\u03bb\\u2082) = ('+l1+', '+l2+')', {size:12, fill:'var(--yellow)', weight:600});\n` +
    `    vrow(TX, 78, 'self-adjoint  a* = a  (real values)', true);\n` +
    `    txt(TX, 102, '\\u03c3(a) = {'+l1+', '+l2+'}', {size:11, fill:'var(--cyan)'});\n` +
    `    vrow(TX, 126, '\\u03c3(a) \\u2286 [0, \\u221e)', pos);\n` +
    `    vrow(TX, 150, 'a = b*b  with b = \\u221aa', pos);\n` +
    `    var verdict = pos ? '\\u21d2  a \\u2265 0   (positive)' : (neg ? '\\u21d2  a \\u2264 0   (negative)' : '\\u21d2  a is indefinite');\n` +
    `    txt(TX, 182, verdict, {size:14, fill: pos?'var(--green)':(neg?'var(--pink)':'var(--orange)'), weight:700});\n` +
    `    txt(TX, 212, 'L\\u00f6wner order  (vs 1):', {size:11, fill:'var(--mute)', italic:true});\n` +
    `    vrow(TX, 234, 'a \\u2264 1', (l1<=1+EPS && l2<=1+EPS));\n` +
    `    vrow(TX, 256, '0 \\u2264 a \\u2264 1   (contraction)', pos && l1<=1+EPS && l2<=1+EPS);\n` +
    `    function key(y,col,op,lbl,dash){ svg.appendChild(mk('rect',{x:TX,y:y-9,width:14,height:10,fill:dash?'none':col,'fill-opacity':op,stroke:dash?col:'none','stroke-width':1,'stroke-dasharray':dash?'3 2':''})); txt(TX+20,y,lbl,{size:9,fill:'var(--mute)'}); }\n` +
    `    key(286,'var(--green)',0.12,'A\\u208a  (positive cone)',false);\n` +
    `    key(300,'var(--violet)',0.13,'{ b : b \\u2265 a }  (up-set)',false);\n` +
    `    key(314,'var(--cyan)',0,'order interval [0,1]',true);\n` +
    `    var note;\n` +
    `    if(pos) note='a is positive: every value is \\u2265 0, so \\u03c3(a) \\u2286 [0,\\u221e) and the functional calculus gives a genuine positive square root b = \\u221aa with a = b*b = b\\u00b2. The point a sits inside the green cone A\\u208a.';\n` +
    `    else if(neg) note='a is negative (\\u2212a \\u2265 0): the point sits in the opposite cone. There is no self-adjoint b with a = b*b, since b*b is always positive.';\n` +
    `    else note='a is indefinite: one value is positive and one negative, so \\u03c3(a) straddles 0. a is not in the cone A\\u208a and has no decomposition a = b*b. (Its positive part a\\u208a and negative part a\\u208b split it as a = a\\u208a \\u2212 a\\u208b.)';\n` +
    `    out.textContent = note + '\\n\\nThree equivalent ways to say a \\u2265 0 in a C*-algebra: (i) a = b*b for some b; (ii) a = a* and \\u03c3(a) \\u2286 [0,\\u221e); (iii) a = c\\u00b2 for some self-adjoint c (= \\u221aa). The positive elements form a closed cone A\\u208a, and a \\u2264 b means b \\u2212 a \\u2208 A\\u208a \\u2014 the L\\u00f6wner order, drawn here as the translated cone (everything up-and-right of a). This is the commutative picture in C({1,2}) \\u2245 \\u211d\\u00b2, where the order is pointwise; for noncommuting self-adjoints the cone and order are the same abstractly, but A\\u209b\\u2090 is no longer a plane and eigenvalues of b \\u2212 a are not differences of eigenvalues.';\n` +
    `  }\n` +
    `  s1.addEventListener('input', draw); s2.addEventListener('input', draw);\n` +
    `  pbtns.forEach(function(b,i){ b.addEventListener('click', function(){ s1.value=P.presets[i].l1; s2.value=P.presets[i].l2; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
