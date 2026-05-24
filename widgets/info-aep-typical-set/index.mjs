// info-aep-typical-set widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The AEP as concentration: for an i.i.d. binary
// source P(1)=p, the per-symbol log-probability −(1/n)log₂ p(xⁿ) concentrates at
// the entropy H=h(p) as n grows. Plots that distribution with the typical band.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-p">source bias $p = P(1)$</label>\n` +
    `    <input type="range" id="${widgetId}-p" min="0.05" max="0.95" value="0.2" step="0.05">\n` +
    `    <span class="pill" id="${widgetId}-pv">p = 0.20</span>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">block length $n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="2" max="200" value="20" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nv">n = 20</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="The distribution of the per-symbol log-probability of a random source sequence, concentrating at the entropy"><title>AEP: -(1/n)log p(x^n) concentrates at the entropy H(X) as n grows; the typical set carries almost all the probability</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* info-aep-typical-set widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sp=document.getElementById('${widgetId}-p'), sn=document.getElementById('${widgetId}-n');\n` +
    `  var pv=document.getElementById('${widgetId}-pv'), nv=document.getElementById('${widgetId}-nv');\n` +
    `  if(!svg||!out||!sp||!sn||!pv||!nv) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    `  var L2=Math.log(2);\n` +
    `  function log2(x){ return Math.log(x)/L2; }\n` +
    `  function hbin(p){ return -p*log2(p)-(1-p)*log2(1-p); }\n` +
    `  var EPS=0.1;\n` +
    `  var PX0=56, PX1=400, PY0=44, PYB=250;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var p=parseFloat(sp.value), n=parseInt(sn.value,10); pv.textContent='p = '+p.toFixed(2); nv.textContent='n = '+n;\n` +
    `    var H=hbin(p);\n` +
    `    var s0=-log2(p), s1=-log2(1-p);\n` + // surprise of a 1 and of a 0
    `    var emax=Math.max(s0,s1);\n` +
    `    var xmax=emax*1.05, xmin=0;\n` +
    `    function ex(e){ return PX0 + (e-xmin)/(xmax-xmin)*(PX1-PX0); }\n` +
    // binomial pmf via incremental log-binomial
    `    var probs=[], emp=[], maxpr=0, lp=Math.log(p), lq=Math.log(1-p), logC=0;\n` +
    `    for(var k=0;k<=n;k++){ if(k>0) logC += Math.log((n-k+1)/k);\n` +
    `      probs.push(Math.exp(logC + k*lp + (n-k)*lq));\n` +
    // empirical entropy e(k) = (k/n)*(-log2 p) + ((n-k)/n)*(-log2(1-p)) = (k/n)*s0 + ((n-k)/n)*s1
    `      emp.push((k/n)*s0 + ((n-k)/n)*s1); }\n` +
    `    for(var k3=0;k3<=n;k3++){ if(probs[k3]>maxpr) maxpr=probs[k3]; }\n` +
    `    var yh=PYB-PY0;\n` +
    `    function py(pr){ return PYB - (pr/maxpr)*(yh-10); }\n` +
    // axes
    `    svg.appendChild(mk('line',{x1:PX0,y1:PYB,x2:PX1,y2:PYB,stroke:'var(--line)','stroke-width':1}));\n` +
    `    for(var t=0;t<=Math.ceil(xmax);t++){ if(t>xmax) break; svg.appendChild(mk('line',{x1:ex(t),y1:PYB,x2:ex(t),y2:PYB+4,stroke:'var(--line)','stroke-width':1})); txt(ex(t),PYB+16,''+t,{size:9,fill:'var(--mute)',anchor:'middle'}); }\n` +
    `    txt(PX1, PYB+28, 'bits/symbol  \\u2212(1/n)log\\u2082 p(x\\u207f)', {size:10, fill:'var(--mute)', anchor:'end'});\n` +
    // typical band [H-eps, H+eps]
    `    var bx0=ex(Math.max(xmin,H-EPS)), bx1=ex(Math.min(xmax,H+EPS));\n` +
    `    svg.appendChild(mk('rect',{x:bx0,y:PY0,width:bx1-bx0,height:PYB-PY0,fill:'var(--green)','fill-opacity':0.12}));\n` +
    // distribution as filled polyline over (e(k), prob(k))
    `    var d='M '+ex(emp[0])+' '+PYB+' '; for(var k4=0;k4<=n;k4++){ d+='L '+ex(emp[k4])+' '+py(probs[k4])+' '; } d+='L '+ex(emp[n])+' '+PYB+' Z';\n` +
    `    svg.appendChild(mk('path',{d:d, fill:'var(--cyan)','fill-opacity':0.25, stroke:'var(--cyan)','stroke-width':1.4}));\n` +
    // H line
    `    svg.appendChild(mk('line',{x1:ex(H),y1:PY0,x2:ex(H),y2:PYB,stroke:'var(--yellow)','stroke-width':1.4,'stroke-dasharray':'4 3'}));\n` +
    `    txt(ex(H), PY0-4, 'H = '+H.toFixed(3), {size:11, fill:'var(--yellow)', anchor:'middle'});\n` +
    // typical-set probability
    `    var ptyp=0; for(var k5=0;k5<=n;k5++){ if(Math.abs(emp[k5]-H)<EPS) ptyp+=probs[k5]; }\n` +
    // info panel
    `    var TX=420;\n` +
    `    txt(TX, 56, 'entropy  H(X) = h(p)', {size:11, fill:'var(--mute)'});\n` +
    `    txt(TX, 74, '= '+H.toFixed(4)+' bits', {size:12, fill:'var(--yellow)', weight:600});\n` +
    `    txt(TX, 104, 'P(typical set)', {size:11, fill:'var(--mute)'});\n` +
    `    txt(TX, 122, '= '+(ptyp).toFixed(4), {size:13, fill:'var(--green)', weight:600});\n` +
    `    txt(TX, 140, '(\\u03b5 = '+EPS+', \\u2192 1 as n\\u2192\\u221e)', {size:9, fill:'var(--mute)'});\n` +
    `    txt(TX, 172, 'typical size \\u2248 2^(nH)', {size:11, fill:'var(--cyan)'});\n` +
    `    txt(TX, 190, '= 2^'+(n*H).toFixed(1), {size:11, fill:'var(--cyan)'});\n` +
    `    txt(TX, 208, 'of total 2^n = 2^'+n, {size:11, fill:'var(--mute)'});\n` +
    `    txt(TX, 226, 'fraction 2^(\\u2212n(1\\u2212H))', {size:9, fill:'var(--mute)'});\n` +
    `    txt(TX, 240, '= '+Math.pow(2,-n*(1-H)).toExponential(1), {size:10, fill:'var(--pink)'});\n` +
    `    out.textContent = 'Each symbol contributes surprise \\u2212log\\u2082 p(x\\u1d62); averaging over a length-'+n+' sequence gives \\u2212(1/n)log\\u2082 p(x\\u207f), a random variable equal to (k/n)\\u00b7'+s0.toFixed(2)+' + (1\\u2212k/n)\\u00b7'+s1.toFixed(2)+' for k ones. By the law of large numbers k/n \\u2192 p, so this concentrates at H(X) = h('+p.toFixed(2)+') = '+H.toFixed(3)+' bits (yellow line). The shaded green band is the typical set |\\u2212(1/n)log\\u2082 p \\u2212 H| < '+EPS+'; it currently carries probability '+ptyp.toFixed(3)+', and \\u2192 1 as n grows (slide n up to watch the cyan distribution spike onto H). So almost every emitted sequence has probability \\u2248 2^(\\u2212nH): the \\u2248 2^(nH) typical sequences are nearly equiprobable, a vanishing fraction 2^(\\u2212n(1\\u2212H)) of all 2^n strings, yet they capture essentially all the mass \\u2014 the basis of source coding at rate H.';\n` +
    `  }\n` +
    `  sp.addEventListener('input', draw); sn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
