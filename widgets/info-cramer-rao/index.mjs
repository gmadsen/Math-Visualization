// info-cramer-rao widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Fisher information I(θ) = curvature of the
// log-likelihood, and the Cramér–Rao bound Var(θ̂) ≥ 1/(nI(θ)) as a floor that
// the MLE (sample mean) rides and a naive single-sample estimator sits far above.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-fam" role="group" aria-label="parametric family">\n` +
    `    <button type="button" data-fam="bern" class="active" aria-pressed="true">Bernoulli($\\theta$)</button>\n` +
    `    <button type="button" data-fam="gauss" aria-pressed="false">Gaussian mean</button>\n` +
    `    <button type="button" data-fam="pois" aria-pressed="false">Poisson($\\lambda$)</button>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-th" id="${widgetId}-thlab">probability $\\theta$</label>\n` +
    `    <input type="range" id="${widgetId}-th" min="0.05" max="0.95" value="0.3" step="0.05">\n` +
    `    <span class="pill" id="${widgetId}-thv">θ = 0.30</span>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">sample size $n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="1" max="40" value="10" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nv">n = 10</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="Estimator variance versus sample size, with the Cramér–Rao bound as a lower floor"><title>Variance vs n: the Cramér–Rao bound 1/(nI) decays as 1/n, the MLE rides exactly on it (efficient), and a single-sample estimator stays pinned at 1/I far above</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* info-cramer-rao widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sth=document.getElementById('${widgetId}-th'), sn=document.getElementById('${widgetId}-n');\n` +
    `  var thv=document.getElementById('${widgetId}-thv'), nv=document.getElementById('${widgetId}-nv');\n` +
    `  var thlab=document.getElementById('${widgetId}-thlab'), fam=document.getElementById('${widgetId}-fam');\n` +
    `  if(!svg||!out||!sth||!sn||!thv||!nv||!thlab||!fam) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var family='bern';\n` +
    // per-family slider range for the parameter: Bernoulli/Gaussian use theta, Poisson a rate lambda
    `  var ranges={ bern:{min:0.05,max:0.95,step:0.05,def:0.3,label:'probability \\u03b8'}, gauss:{min:-3,max:3,step:0.5,def:0,label:'mean \\u03b8'}, pois:{min:0.25,max:6,step:0.25,def:2,label:'rate \\u03bb'} };\n` +
    `  function applyRange(){ var r=ranges[family]; sth.min=r.min; sth.max=r.max; sth.step=r.step; sth.value=r.def; thlab.textContent=r.label; }\n` +
    // per-family: parameter symbol, Fisher info I(theta), and a one-line score formula
    `  function info(th){ if(family==='bern') return 1/(th*(1-th)); if(family==='gauss') return 1; return 1/th; }\n` +
    `  function psym(){ return family==='pois' ? '\\u03bb' : '\\u03b8'; }\n` +
    `  function famName(){ return family==='bern' ? 'Bernoulli(\\u03b8)' : (family==='gauss' ? 'N(\\u03b8, 1)' : 'Poisson(\\u03bb)'); }\n` +
    `  function iForm(){ return family==='bern' ? 'I(\\u03b8) = 1 / [\\u03b8(1\\u2212\\u03b8)]' : (family==='gauss' ? 'I(\\u03b8) = 1  (any mean)' : 'I(\\u03bb) = 1 / \\u03bb'); }\n` +
    `  function mleName(){ return 'sample mean'; }\n` +
    `  var PX0=58, PX1=380, PY0=40, PYB=250, NMAX=40;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var th=parseFloat(sth.value), n=parseInt(sn.value,10);\n` +
    `    thv.textContent=psym()+' = '+th.toFixed(2); nv.textContent='n = '+n;\n` +
    `    var I=info(th), inv=1/I;\n` +
    `    var ymax=inv*1.08;\n` +
    `    function nx(k){ return PX0 + (k-1)/(NMAX-1)*(PX1-PX0); }\n` +
    `    function vy(v){ return PYB - (v/ymax)*(PYB-PY0); }\n` +
    // axes
    `    svg.appendChild(mk('line',{x1:PX0,y1:PYB,x2:PX1,y2:PYB,stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:PY0,x2:PX0,y2:PYB,stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt((PX0+PX1)/2, PYB+30, 'sample size  n', {size:11, fill:'var(--mute)', anchor:'middle'});\n` +
    `    txt(PX0-6, PY0+2, 'Var', {size:11, fill:'var(--mute)', anchor:'end'});\n` +
    `    [0, inv/2, inv].forEach(function(v){ svg.appendChild(mk('line',{x1:PX0-4,y1:vy(v),x2:PX0,y2:vy(v),stroke:'var(--line)','stroke-width':1})); txt(PX0-6, vy(v)+3, v.toFixed(3), {size:9, fill:'var(--mute)', anchor:'end'}); });\n` +
    `    for(var g=10; g<=NMAX; g+=10){ svg.appendChild(mk('line',{x1:nx(g),y1:PYB,x2:nx(g),y2:PYB+4,stroke:'var(--line)','stroke-width':1})); txt(nx(g),PYB+16,''+g,{size:9,fill:'var(--mute)',anchor:'middle'}); }\n` +
    // single-sample estimator: flat at 1/I (the n=1 bound; never improves)
    `    svg.appendChild(mk('line',{x1:nx(1),y1:vy(inv),x2:nx(NMAX),y2:vy(inv),stroke:'var(--pink)','stroke-width':1.4,'stroke-dasharray':'5 3'}));\n` +
    `    txt(nx(NMAX), vy(inv)-6, 'single obs:  1/I (flat)', {size:10, fill:'var(--pink)', anchor:'end'});\n` +
    // CR bound 1/(nI) curve
    `    var d='M '; for(var k=1;k<=NMAX;k++){ d+=(k>1?'L ':'')+nx(k)+' '+vy(1/(k*I))+' '; }\n` +
    `    svg.appendChild(mk('path',{d:d, fill:'none', stroke:'var(--yellow)','stroke-width':2}));\n` +
    `    txt(nx(NMAX), vy(1/(NMAX*I))-8, 'CR bound  1/(nI)', {size:10, fill:'var(--yellow)', anchor:'end'});\n` +
    // MLE variance markers (= bound exactly): green dots
    `    for(var k2=2;k2<=NMAX;k2+=3){ svg.appendChild(mk('circle',{cx:nx(k2),cy:vy(1/(k2*I)),r:2.6,fill:'var(--green)'})); }\n` +
    `    txt(nx(14), vy(1/(14*I))-10, 'MLE ('+mleName()+')', {size:10, fill:'var(--green)'});\n` +
    // current-n marker on the bound
    `    var cur=1/(n*I); svg.appendChild(mk('circle',{cx:nx(n),cy:vy(cur),r:4.5,fill:'none',stroke:'var(--cyan)','stroke-width':2}));\n` +
    `    svg.appendChild(mk('line',{x1:nx(n),y1:vy(cur),x2:nx(n),y2:PYB,stroke:'var(--cyan)','stroke-width':1,'stroke-dasharray':'2 2'}));\n` +
    // info panel
    `    var TX=400;\n` +
    `    txt(TX, 52, famName(), {size:11, fill:'var(--violet)', weight:600});\n` +
    `    txt(TX, 74, iForm(), {size:10, fill:'var(--mute)'});\n` +
    `    txt(TX, 92, 'I('+psym()+') = '+I.toFixed(3), {size:13, fill:'var(--yellow)', weight:600});\n` +
    `    txt(TX, 120, 'CR bound at n='+n, {size:10, fill:'var(--mute)'});\n` +
    `    txt(TX, 137, '1/(nI) = '+cur.toFixed(4), {size:12, fill:'var(--cyan)', weight:600});\n` +
    `    txt(TX, 163, 'MLE variance', {size:10, fill:'var(--mute)'});\n` +
    `    txt(TX, 180, '= '+cur.toFixed(4)+'  \\u2713', {size:12, fill:'var(--green)', weight:600});\n` +
    `    txt(TX, 197, 'efficient (on the floor)', {size:9, fill:'var(--mute)'});\n` +
    `    txt(TX, 223, 'single obs variance', {size:10, fill:'var(--mute)'});\n` +
    `    txt(TX, 240, '= '+inv.toFixed(4)+'  (n\\u00d7 the bound)', {size:11, fill:'var(--pink)'});\n` +
    `    out.textContent = 'The score is U('+psym()+') = \\u2202 log p / \\u2202'+psym()+'; the Fisher information I('+psym()+') = Var(U) = \\u2212E[\\u2202\\u00b2 log p] measures the curvature of the log-likelihood at the truth. For '+famName()+', I('+psym()+') = '+I.toFixed(3)+'. The Cram\\u00e9r\\u2013Rao inequality says every unbiased estimator from n i.i.d. samples obeys Var('+psym()+'\\u0302) \\u2265 1/(nI) = '+cur.toFixed(4)+' (yellow floor). The MLE here is the '+mleName()+', whose variance equals 1/(nI) exactly \\u2014 it is efficient, riding on the green dots along the floor and shrinking like 1/n. By contrast a naive estimator that throws away all but one observation has variance 1/I = '+inv.toFixed(4)+' (pink dashed): it never improves with n, sitting '+n+'\\u00d7 above the bound at the current sample size. Curvature is informativeness: the sharper the log-likelihood peak (larger I), the lower the achievable variance.';\n` +
    `  }\n` +
    `  Array.prototype.forEach.call(fam.querySelectorAll('button'), function(b){ b.addEventListener('click', function(){\n` +
    `    family=b.getAttribute('data-fam');\n` +
    `    Array.prototype.forEach.call(fam.querySelectorAll('button'), function(x){ var on=(x===b); x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    applyRange(); draw();\n` +
    `  }); });\n` +
    `  sth.addEventListener('input', draw); sn.addEventListener('input', draw);\n` +
    `  applyRange(); draw();\n` +
    `})();\n` +
    `</script>`
  );
}
