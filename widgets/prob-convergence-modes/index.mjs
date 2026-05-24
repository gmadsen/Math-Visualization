// prob-convergence-modes widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The four modes of convergence and the one-way
// implications: a.s. ⇒ in prob ⇒ in dist, and Lᵖ ⇒ in prob. The implication
// diagram is coloured per example so you see which reverse implication fails.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">example $X_n$</span>\n` +
    `    <button type="button" id="${widgetId}-e0">spike $n\\mathbf{1}_{(0,1/n)}$</button>\n` +
    `    <button type="button" id="${widgetId}-e1">typewriter</button>\n` +
    `    <button type="button" id="${widgetId}-e2">i.i.d.</button>\n` +
    `    <button type="button" id="${widgetId}-e3">$X/n$</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 300" width="580" height="300" role="img" aria-label="The implication diagram between the four modes of convergence, coloured for the selected example"><title>Modes of convergence: almost surely and Lp each imply in probability, which implies in distribution; the reverse implications can fail</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* prob-convergence-modes widget: ${widgetId} */\n` +
    `(function(){\n` +
    // each example: which modes hold (as, Lp, prob, dist), the formula, and the lesson
    `  var EX=[\n` +
    `    { lab:'X_n = n\\u00b71_{(0,1/n)}', as:true, Lp:false, prob:true, dist:true,\n` +
    `      note:'For each fixed \\u03c9 \\u2208 (0,1], X_n(\\u03c9) = 0 once 1/n < \\u03c9, so X_n \\u2192 0 ALMOST SURELY (hence in probability and in distribution). But E|X_n| = n\\u00b7(1/n) = 1 for all n, so X_n does NOT converge in L\\u00b9. Lesson: a.s. convergence does not imply L\\u1d56 convergence \\u2014 mass can escape to infinity.' },\n` +
    `    { lab:'typewriter:  X_n = 1_{I_n}', as:false, Lp:true, prob:true, dist:true,\n` +
    `      note:'The intervals I_n sweep across [0,1] in blocks of shrinking length |I_n| \\u2192 0. Then E|X_n| = |I_n| \\u2192 0, so X_n \\u2192 0 in L\\u00b9 and in probability. But every \\u03c9 is hit infinitely often, so X_n(\\u03c9) does NOT converge for any \\u03c9 \\u2014 NOT almost surely. Lesson: in probability (even in L\\u1d56) does not imply a.s.' },\n` +
    `    { lab:'X_n i.i.d. (e.g. N(0,1))', as:false, Lp:false, prob:false, dist:true,\n` +
    `      note:'If the X_n are i.i.d. with common law \\u03bc, then trivially X_n \\u2192 (that law) IN DISTRIBUTION \\u2014 every X_n already has law \\u03bc. But the values keep fluctuating: \\u2119(|X_n \\u2212 X_m| \\u2265 \\u03b5) does not vanish, so there is no convergence in probability (or a.s., or L\\u1d56) to any random variable. Lesson: in distribution is the weakest mode \\u2014 it constrains only the law, not the values.' },\n` +
    `    { lab:'X_n = X / n', as:true, Lp:true, prob:true, dist:true,\n` +
    `      note:'For an integrable X, X_n = X/n \\u2192 0 in every mode at once: pointwise (a.s.), E|X/n| = E|X|/n \\u2192 0 (L\\u00b9), hence in probability and in distribution. When the limit is this well-behaved all four notions agree \\u2014 the modes only diverge on cleverly built counterexamples.' }\n` +
    `  ];\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var bt=[0,1,2,3].map(function(i){ return document.getElementById('${widgetId}-e'+i); });\n` +
    `  if(!svg||!out||bt.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    `  function arrow(x1,y1,x2,y2){ var a=Math.atan2(y2-y1,x2-x1), x2b=x2-22*Math.cos(a), y2b=y2-22*Math.sin(a), x1b=x1+22*Math.cos(a), y1b=y1+22*Math.sin(a);\n` +
    `    svg.appendChild(mk('line',{x1:x1b,y1:y1b,x2:x2b,y2:y2b,stroke:'var(--mute)','stroke-width':1.5}));\n` +
    `    svg.appendChild(mk('path',{d:'M '+x2b+' '+y2b+' L '+(x2b-8*Math.cos(a-0.4))+' '+(y2b-8*Math.sin(a-0.4))+' L '+(x2b-8*Math.cos(a+0.4))+' '+(y2b-8*Math.sin(a+0.4))+' Z',fill:'var(--mute)'}));\n` +
    `    txt((x1+x2)/2,(y1+y2)/2-6,'\\u21d2',{size:13,fill:'var(--mute)',anchor:'middle'}); }\n` +
    `  var sel=0;\n` +
    // node positions
    `  var NODE={ as:[120,80], Lp:[120,210], prob:[300,145], dist:[470,145] };\n` +
    `  var NAME={ as:'a.s.', Lp:'L\\u1d56', prob:'in prob.', dist:'in dist.' };\n` +
    `  function node(k,holds){ var p=NODE[k]; svg.appendChild(mk('ellipse',{cx:p[0],cy:p[1],rx:46,ry:24,fill:holds?'var(--green)':'var(--pink)','fill-opacity':0.16,stroke:holds?'var(--green)':'var(--pink)','stroke-width':1.6}));\n` +
    `    txt(p[0],p[1]+4,NAME[k],{size:13,anchor:'middle',fill:holds?'var(--green)':'var(--pink)',weight:600}); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    bt.forEach(function(b,i){ b.classList.toggle('active',i===sel); b.setAttribute('aria-pressed',i===sel?'true':'false'); });\n` +
    `    var E=EX[sel];\n` +
    // arrows (drawn first, under nodes)
    `    arrow(NODE.as[0],NODE.as[1],NODE.prob[0],NODE.prob[1]);\n` +
    `    arrow(NODE.Lp[0],NODE.Lp[1],NODE.prob[0],NODE.prob[1]);\n` +
    `    arrow(NODE.prob[0],NODE.prob[1],NODE.dist[0],NODE.dist[1]);\n` +
    `    node('as',E.as); node('Lp',E.Lp); node('prob',E.prob); node('dist',E.dist);\n` +
    `    txt(290, 36, E.lab, {size:13, fill:'var(--yellow)', weight:600, anchor:'middle'});\n` +
    // verdict strip at bottom
    `    function chip(x,k){ var on=E[k]; svg.appendChild(mk('text',{x:x,y:272,'font-size':13,fill:on?'var(--green)':'var(--pink)'},on?'\\u2713':'\\u2717')); txt(x+16,272,NAME[k],{size:10,fill:'var(--ink)'}); }\n` +
    `    chip(70,'as'); chip(170,'Lp'); chip(260,'prob'); chip(380,'dist');\n` +
    `    out.textContent = E.note + '\\n\\nThe implications a.s. \\u21d2 in probability \\u21d2 in distribution and L\\u1d56 \\u21d2 in probability always hold; none of the reverse arrows holds in general. Extra hypotheses bridge the gaps: dominated/uniformly-integrable families upgrade in-probability to L\\u1d56, a fast-enough rate (Borel\\u2013Cantelli, \\u03a3 \\u2119(|X_n\\u2212X|\\u2265\\u03b5) < \\u221e) upgrades in-probability to a.s., and a constant limit upgrades in-distribution to in-probability.';\n` +
    `  }\n` +
    `  bt.forEach(function(b,i){ b.addEventListener('click', function(){ sel=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
