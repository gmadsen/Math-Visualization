// singular-cubics-minimal-model widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Minimal Weierstrass models and the u^12 scaling:
// (x,y) -> (u^2 x, u^3 y) sends Delta -> u^12 Delta, so a per-prime bar of
// v_p(Delta) splits the intrinsic v_p(Delta_0) from the spurious 12 v_p(u).

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
    `    ${btn('a', 'y² = x³ − x', true)}\n` +
    `    ${btn('b', 'y² = x³ + 1', false)}\n` +
    `    ${btn('c', 'y² = x³ − x + 1', false)}\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-u">scaling $u$</label>\n` +
    `    <input type="range" id="${widgetId}-u" min="1" max="6" value="1" step="1">\n` +
    `    <span class="pill" id="${widgetId}-uv">u = 1</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="Per-prime stacked bar chart of the valuation of the discriminant, splitting intrinsic from spurious contributions under u^12 scaling"><title>v_p(Delta) for the scaled Weierstrass model: intrinsic v_p(Delta_0) plus the spurious 12 v_p(u) added by the change of variables (x,y) -> (u^2 x, u^3 y)</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* singular-cubics-minimal-model widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var su=document.getElementById('${widgetId}-u'), uv=document.getElementById('${widgetId}-uv'), btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!su||!uv||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var CURVES={ a:{name:'y\\u00b2 = x\\u00b3 \\u2212 x', A:-1, B:0}, b:{name:'y\\u00b2 = x\\u00b3 + 1', A:0, B:1}, c:{name:'y\\u00b2 = x\\u00b3 \\u2212 x + 1', A:-1, B:1} };\n` +
    `  function factor(n){ n=Math.abs(n); var f={}; for(var p=2;p*p<=n;p++){ while(n%p===0){ f[p]=(f[p]||0)+1; n/=p; } } if(n>1) f[n]=(f[n]||0)+1; return f; }\n` +
    `  var curKey='a';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var C=CURVES[curKey], A=C.A, B=C.B, u=parseInt(su.value,10); uv.textContent='u = '+u;\n` +
    `    var D0=-16*(4*A*A*A+27*B*B);\n` +
    `    var fD0=factor(D0), fu=factor(u);\n` +
    `    // primes dividing the scaled discriminant Delta = u^12 * D0\n` +
    `    var primes={}; Object.keys(fD0).forEach(function(p){ primes[p]=1; }); Object.keys(fu).forEach(function(p){ primes[p]=1; });\n` +
    `    var plist=Object.keys(primes).map(Number).sort(function(x,y){ return x-y; });\n` +
    `    var rows=plist.map(function(p){ var vi=fD0[p]||0, vs=12*(fu[p]||0); return {p:p, vi:vi, vs:vs, tot:vi+vs}; });\n` +
    `    var vmax=Math.max.apply(null, rows.map(function(r){ return r.tot; }).concat([12]));\n` +
    // layout: bar chart
    `    var BX0=70, BX1=420, BY=250, BTOP=60; var ph=BY-BTOP;\n` +
    `    function Y(v){ return BY - (v/vmax)*ph; }\n` +
    `    // axis\n` +
    `    svg.appendChild(mk('line',{x1:BX0,y1:BY,x2:BX1,y2:BY,stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:BX0,y1:BTOP,x2:BX0,y2:BY,stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt(BX0-6, BTOP-4, 'v_p(\\u0394)', {anchor:'start', size:10, fill:'var(--mute)'});\n` +
    `    // gridlines at multiples of 12 (one u-step)\n` +
    `    for(var g=12; g<=vmax+0.001; g+=12){ var gy=Y(g); svg.appendChild(mk('line',{x1:BX0,y1:gy,x2:BX1,y2:gy,stroke:'var(--violet)','stroke-width':1,'stroke-dasharray':'3 3','stroke-opacity':0.5})); txt(BX0-6, gy+3, ''+g, {anchor:'end', size:9, fill:'var(--violet)'}); }\n` +
    `    txt(BX0-6, Y(0)+3, '0', {anchor:'end', size:9, fill:'var(--mute)'});\n` +
    `    // bars\n` +
    `    var n=rows.length, bw=Math.min(54, (BX1-BX0)/(n+0.5)*0.6), gap=(BX1-BX0-n*bw)/(n+1);\n` +
    `    rows.forEach(function(r,i){ var x=BX0+gap+i*(bw+gap);\n` +
    `      var yi=Y(r.vi), y0=Y(0); if(r.vi>0) svg.appendChild(mk('rect',{x:x,y:yi,width:bw,height:Math.max(0,y0-yi),fill:'var(--cyan)','fill-opacity':0.85}));\n` +
    `      var yt=Y(r.tot); if(r.vs>0) svg.appendChild(mk('rect',{x:x,y:yt,width:bw,height:Math.max(0,yi-yt),fill:'var(--pink)','fill-opacity':0.85}));\n` +
    `      txt(x+bw/2, BY+14, 'p='+r.p, {anchor:'middle', size:10, fill:'var(--ink)'});\n` +
    `      txt(x+bw/2, yt-5, ''+r.tot, {anchor:'middle', size:10, weight:700, fill: r.vs>0?'var(--pink)':'var(--cyan)'});\n` +
    `      if(r.vs>0) txt(x+bw/2, BY+26, '('+r.vi+'+'+r.vs+')', {anchor:'middle', size:8, fill:'var(--mute)'}); });\n` +
    `    // legend\n` +
    `    svg.appendChild(mk('rect',{x:BX1+14,y:BTOP+6,width:11,height:11,fill:'var(--cyan)','fill-opacity':0.85})); txt(BX1+29, BTOP+15, 'intrinsic', {size:9, fill:'var(--mute)'});\n` +
    `    svg.appendChild(mk('rect',{x:BX1+14,y:BTOP+24,width:11,height:11,fill:'var(--pink)','fill-opacity':0.85})); txt(BX1+29, BTOP+33, 'spurious', {size:9, fill:'var(--mute)'});\n` +
    `    txt(BX1+14, BTOP+52, '12\\u00b7v_p(u)', {size:8, fill:'var(--mute)'});\n` +
    `    // model line at top\n` +
    `    var Ap=A*Math.pow(u,4), Bp=B*Math.pow(u,6);\n` +
    `    txt(BX0, 30, C.name+(u>1?'   \\u2192  y\\u00b2 = x\\u00b3 + ('+Ap+')x + ('+Bp+')':'   (u = 1, the given model)'), {size:11, weight:700, fill:'var(--ink)'});\n` +
    `    txt(BX0, 46, '\\u0394 = u\\u00b9\\u00b2\\u00b7\\u0394\\u2080 = '+(u>1?u+'\\u00b9\\u00b2\\u00b7':'')+'('+D0+')', {size:10, fill:'var(--mute)'});\n` +
    `    // readout\n` +
    `    var spuriousPrimes=Object.keys(fu).map(Number).sort(function(x,y){return x-y;});\n` +
    `    var verdict;\n` +
    `    if(u===1){ verdict='This is the GLOBAL MINIMAL MODEL: \\u0394_min = \\u0394\\u2080 = '+D0+', minimal at every prime, so its bad primes ('+(Object.keys(fD0).join(', '))+') are the genuine ones. '; }\n` +
    `    else { verdict='This model is NON-MINIMAL exactly at the prime'+(spuriousPrimes.length>1?'s':'')+' dividing u: '+spuriousPrimes.join(', ')+'. Each contributes a SPURIOUS 12\\u00b7v_p(u) to v_p(\\u0394) (the pink blocks), a multiple of 12 that the single inverse change of variables (x,y) \\u2192 (x/u\\u00b2, y/u\\u00b3) \\u2014 the minimization step Tate\\u2019s algorithm detects and applies \\u2014 strips off, recovering \\u0394_min = '+D0+'. '; }\n` +
    `    out.textContent='To reduce E/\\u211a at a prime you first choose an integer Weierstrass model, and different models have different discriminants. The admissible change of variables (x,y) \\u2192 (u\\u00b2x, u\\u00b3y) rescales the invariants by (c\\u2084, c\\u2086, \\u0394) \\u2192 (u\\u2074c\\u2084, u\\u2076c\\u2086, u\\u00b9\\u00b2\\u0394) \\u2014 same curve, discriminant multiplied by u\\u00b9\\u00b2. So v_p(\\u0394) = v_p(\\u0394\\u2080) + 12\\u00b7v_p(u) at every prime, and a factor of p in u inflates v_p(\\u0394) by exactly 12 (the dashed violet gridlines). '+verdict+'A model is MINIMAL at p when v_p(\\u0394) is smallest among all integer models; a global minimal model (minimal at every prime simultaneously) exists for every E/\\u211a (N\\u00e9ron) and \\u0394_min is an invariant of the curve. The CONDUCTOR N, by contrast, records only the reduction TYPE at each genuine bad prime (1 for multiplicative, \\u22652 for additive) \\u2014 it is computed from the minimal model and is completely unaffected by u.';\n` +
    `  }\n` +
    `  su.addEventListener('input', draw);\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; curKey=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
