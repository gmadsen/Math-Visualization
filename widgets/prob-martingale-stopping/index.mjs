// prob-martingale-stopping widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Optional stopping on symmetric simple random walk
// Sₙ (a martingale). Three stopping rules: fixed time (E[S_τ]=0), two-sided exit
// (0), and τ=inf{n:Sₙ=1} (finite a.s. but E[S_τ]=1≠0 — optional stopping fails
// without a hypothesis).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">stopping time $\\tau$</span>\n` +
    `    <button type="button" id="${widgetId}-r0">fixed time $N$</button>\n` +
    `    <button type="button" id="${widgetId}-r1">exit $\\pm 3$</button>\n` +
    `    <button type="button" id="${widgetId}-r2">first hit $+1$</button>\n` +
    `    <button type="button" id="${widgetId}-resample">resample</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 320" width="580" height="320" role="img" aria-label="Sample paths of a symmetric random walk stopped by the chosen rule, and the average stopped value"><title>Optional stopping: the mean stopped value E[S_tau] equals E[S_0]=0 for a bounded stopping time, but equals 1 for tau = first hit of +1</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* prob-martingale-stopping widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var rB=[0,1,2].map(function(i){ return document.getElementById('${widgetId}-r'+i); });\n` +
    `  var resB=document.getElementById('${widgetId}-resample');\n` +
    `  if(!svg||!out||!resB||rB.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    `  var K=2000, NFIX=40, AEXIT=3, CAP=6000, DRAW=18, MAXT=64, YR=7;\n` + // K paths; fixed-time horizon; exit level; hit-+1 cap; #paths drawn; draw window; y-range
    `  var PX0=50, PX1=410, PY=40, PYB=276;\n` +
    `  function tx(t){ return PX0 + t/MAXT*(PX1-PX0); }\n` +
    `  function vy(v){ return (PY+PYB)/2 - v/YR*((PYB-PY)/2); }\n` +
    `  var rule=2;\n` + // default: first hit +1 (the cautionary example)
    // simulate one path's stopped value; also return a drawable prefix if asked
    `  function step(){ return Math.random()<0.5?1:-1; }\n` +
    `  function simStopped(){ var s=0, n=0;\n` + // only the bounded rules 0 (fixed time) and 1 (two-sided exit); rule 2 uses its own hitting loop
    `    if(rule===0){ for(n=0;n<NFIX;n++) s+=step(); return s; }\n` +
    `    while(n<CAP){ s+=step(); n++; if(Math.abs(s)>=AEXIT) return s; }\n` +
    `    return s; }\n` +
    `  function simPath(){ var pts=[0], s=0, n=0, stopAt=-1;\n` + // up to MAXT for drawing
    `    for(n=1;n<=MAXT;n++){ s+=step(); pts.push(s);\n` +
    `      if(stopAt<0){ if(rule===0 && n>=NFIX) stopAt=n; else if(rule===1 && Math.abs(s)>=AEXIT) stopAt=n; else if(rule===2 && s>=1) stopAt=n; } }\n` +
    `    return {pts:pts, stopAt:stopAt}; }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    rB.forEach(function(b,i){ b.classList.toggle('active',i===rule); b.setAttribute('aria-pressed',i===rule?'true':'false'); });\n` +
    // axes
    `    svg.appendChild(mk('line',{x1:PX0,y1:vy(0),x2:PX1,y2:vy(0),stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:PY,x2:PX0,y2:PYB,stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt(PX0-6, vy(0)+3, '0', {size:9, fill:'var(--mute)', anchor:'end'});\n` +
    `    txt(PX1, PYB+14, 'time n', {size:10, fill:'var(--mute)', anchor:'end'});\n` +
    `    txt(PX0-6, vy(1)+3, '1', {size:9, fill:'var(--green)', anchor:'end'});\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:vy(1),x2:PX1,y2:vy(1),stroke:'var(--green)','stroke-width':0.5,'stroke-dasharray':'2 3'}));\n` +
    // stopping boundary guides
    `    if(rule===1){ [AEXIT,-AEXIT].forEach(function(a){ svg.appendChild(mk('line',{x1:PX0,y1:vy(a),x2:PX1,y2:vy(a),stroke:'var(--pink)','stroke-width':0.6,'stroke-dasharray':'4 3'})); txt(PX1+2,vy(a)+3,(a>0?'+':'')+a,{size:9,fill:'var(--pink)'}); }); }\n` +
    `    if(rule===0){ svg.appendChild(mk('line',{x1:tx(NFIX),y1:PY,x2:tx(NFIX),y2:PYB,stroke:'var(--pink)','stroke-width':0.6,'stroke-dasharray':'4 3'})); txt(tx(NFIX),PY-4,'N='+NFIX,{size:9,fill:'var(--pink)',anchor:'middle'}); }\n` +
    // draw sample paths
    `    for(var p=0;p<DRAW;p++){ var P=simPath(), d='', i, last=(P.stopAt<0?MAXT:P.stopAt);\n` +
    `      for(i=0;i<=last;i++){ d+=(i===0?'M ':'L ')+tx(i)+' '+vy(Math.max(-YR,Math.min(YR,P.pts[i])))+' '; }\n` +
    `      svg.appendChild(mk('path',{d:d,fill:'none',stroke:'var(--violet)','stroke-width':1,'stroke-opacity':0.4}));\n` +
    `      if(P.stopAt>=0){ var sv=P.pts[P.stopAt]; svg.appendChild(mk('circle',{cx:tx(P.stopAt),cy:vy(Math.max(-YR,Math.min(YR,sv))),r:2.5,fill:'var(--yellow)'})); } }\n` +
    // Monte Carlo. NB: for rule 2 the capped mean of S_{cap∧τ} is ≈ 0 (still a
    // martingale), NOT E[S_τ]=1 — the rare un-stopped deep-negative paths exactly
    // cancel it. So for rule 2 we report the FRACTION that reach +1 (→ 1 a.s.),
    // and E[S_τ]=1 follows because every stopped path sits at +1.
    `    var TX=430, holds=(rule!==2);\n` +
    `    var ruleName=['\\u03c4 = N = '+NFIX+'  (fixed time)','\\u03c4 = inf{n : |S\\u2099| = '+AEXIT+'}','\\u03c4 = inf{n : S\\u2099 = +1}'][rule];\n` +
    `    txt(TX, 44, ruleName, {size:11, fill:'var(--ink)', weight:600});\n` +
    `    txt(TX, 70, 'E[S\\u2080] = 0', {size:12, fill:'var(--mute)'});\n` +
    `    if(rule!==2){\n` +
    `      var sum=0; for(var q=0;q<K;q++) sum+=simStopped(); var emp=sum/K;\n` +
    `      txt(TX, 96, 'E[S_\\u03c4]  \\u2248  '+emp.toFixed(3), {size:13, fill:'var(--yellow)', weight:600});\n` +
    `      txt(TX, 114, '(exact 0, over '+K+' walks)', {size:9, fill:'var(--mute)'});\n` +
    `      txt(TX, 148, 'optional stopping HOLDS', {size:13, fill:'var(--green)', weight:700});\n` +
    `      txt(TX, 168, 'E[S_\\u03c4] = E[S\\u2080] = 0', {size:11, fill:'var(--green)'});\n` +
    `      txt(TX, 196, rule===0?'\\u03c4 is bounded \\u2713':'S_{n\\u2227\\u03c4} stays bounded \\u2713', {size:10, fill:'var(--mute)', italic:true});\n` +
    `    } else {\n` +
    `      var nhit=0; for(var q2=0;q2<K;q2++){ var s=0,n=0; while(n<CAP){ s+=step(); n++; if(s>=1){ nhit++; break; } } }\n` +
    `      var frac=nhit/K;\n` +
    `      txt(TX, 96, 'reached +1 within '+CAP+' steps:', {size:10, fill:'var(--mute)'});\n` +
    `      txt(TX, 112, (frac*100).toFixed(0)+'%   (\\u2192 100% a.s.)', {size:13, fill:'var(--yellow)', weight:600});\n` +
    `      txt(TX, 134, 'each stops at +1:  E[S_\\u03c4] = 1', {size:11, fill:'var(--cyan)'});\n` +
    `      txt(TX, 164, 'optional stopping FAILS', {size:13, fill:'var(--pink)', weight:700});\n` +
    `      txt(TX, 184, 'E[S_\\u03c4] = 1 \\u2260 0 = E[S\\u2080]', {size:11, fill:'var(--pink)'});\n` +
    `      txt(TX, 210, '\\u03c4 < \\u221e a.s. but E[\\u03c4] = \\u221e', {size:10, fill:'var(--mute)', italic:true});\n` +
    `      txt(TX, 224, '(not uniformly integrable)', {size:10, fill:'var(--mute)', italic:true});\n` +
    `    }\n` +
    `    out.textContent = 'Symmetric simple random walk S\\u2099 (\\u00b11 steps, each \\u00bd) is a martingale: E[S\\u2099\\u208a\\u2081 | \\u2131\\u2099] = S\\u2099, a fair game. Doob\\u2019s optional-stopping theorem gives E[S_\\u03c4] = E[S\\u2080] = 0 PROVIDED \\u03c4 is bounded, or S is uniformly integrable, or \\u03c4 < \\u221e a.s. with S_{n\\u2227\\u03c4} bounded. '+(holds ? 'Here \\u03c4 = '+(rule===0?('the fixed time N = '+NFIX+' \\u2014 bounded'):('the exit time of \\u00b1'+AEXIT+', under which S_{n\\u2227\\u03c4} stays in [\\u2212'+AEXIT+','+AEXIT+']'))+', so a hypothesis holds and the simulated mean lands near 0.' : 'For \\u03c4 = inf{n : S\\u2099 = 1} the walk reaches +1 with probability 1 (a.s. finite), and every path stops exactly at +1, so E[S_\\u03c4] = 1 \\u2260 0 \\u2014 optional stopping FAILS. The catch: E[\\u03c4] = \\u221e and S is not uniformly integrable. (Tellingly, you cannot see this by averaging: for any finite horizon n the truncated value S_{n\\u2227\\u03c4} is still a martingale with mean exactly 0 \\u2014 the rare paths that have wandered deep below cancel the many already at +1. The mean only jumps to 1 \\u201cat infinity\\u201d, which is precisely the failure.)');\n` +
    `  }\n` +
    `  rB.forEach(function(b,i){ b.addEventListener('click', function(){ rule=i; draw(); }); });\n` +
    `  resB.addEventListener('click', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
