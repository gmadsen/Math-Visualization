// zeta-values-mahler-measure widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. One-variable Mahler measure m(P) = ∫ log|P(e^{2πiθ})| dθ,
// computed by Jensen's formula (precomputed roots) and by the live torus
// integral, with the integrand plotted; bridges to ζ(3) / L-values.

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
    `    ${btn('twox', '2x', true)}\n` +
    `    ${btn('cyclo', 'x² + 1', false)}\n` +
    `    ${btn('golden', 'x² − x − 1', false)}\n` +
    `    ${btn('lehmer', 'Lehmer L(x)', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="The integrand log|P| over the unit circle, whose signed area is the Mahler measure m(P)"><title>The Mahler-measure integrand log|P(e^{2 pi i theta})| over one period; its signed area is m(P), which Jensen's formula also gives from the roots outside the unit circle</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* zeta-values-mahler-measure widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var POLY={\n` +
    `    twox:{name:'2x', c:[0,2], lead:2, out:[], note:'one root at 0 (inside); leading coeff 2'},\n` +
    `    cyclo:{name:'x\\u00b2 + 1', c:[1,0,1], lead:1, out:[], note:'roots \\u00b1i ON the unit circle'},\n` +
    `    golden:{name:'x\\u00b2 \\u2212 x \\u2212 1', c:[-1,-1,1], lead:1, out:[1.6180339887], note:'golden ratio \\u03c6 = 1.618\\u2026 (outside), \\u22120.618 (inside)'},\n` +
    `    lehmer:{name:'Lehmer L(x)', c:[1,1,0,-1,-1,-1,-1,-1,0,1,1], lead:1, out:[1.1762808183], note:'Lehmer\\u2019s number 1.17628\\u2026 (outside) + its reciprocal (inside); 8 roots ON the circle'}\n` +
    `  };\n` +
    `  function absP(re,im,c){ var ar=0,ai=0,zr=1,zi=0; for(var k=0;k<c.length;k++){ ar+=c[k]*zr; ai+=c[k]*zi; var nr=zr*re-zi*im, ni=zr*im+zi*re; zr=nr; zi=ni; } return Math.hypot(ar,ai); }\n` +
    `  function jensen(P){ var m=Math.log(P.lead); for(var i=0;i<P.out.length;i++) m+=Math.log(P.out[i]); return m; }\n` +
    `  function integral(P,M){ var s=0; for(var i=0;i<M;i++){ var th=2*Math.PI*(i+0.5)/M; var v=absP(Math.cos(th),Math.sin(th),P.c); s+=Math.log(Math.max(v,1e-12)); } return s/M; }\n` +
    `  var PX0=58, PX1=500, PTOP=46, PBOT=212, YLO=-4, YHI=2.4;\n` +
    `  function TX(t){ return PX0 + t*(PX1-PX0); }\n` +  // t in [0,1]
    `  function VY(v){ if(v>YHI)v=YHI; if(v<YLO)v=YLO; return PBOT - (v-YLO)/(YHI-YLO)*(PBOT-PTOP); }\n` +
    `  var curKey='twox';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var P=POLY[curKey];\n` +
    `    var mJ=jensen(P), mI=integral(P,4000);\n` +
    `    // axes\n` +
    `    var y0=VY(0);\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:y0,x2:PX1,y2:y0,stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:PTOP,x2:PX0,y2:PBOT,stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt(PX0-6, y0+3, '0', {anchor:'end', size:8, fill:'var(--mute)'});\n` +
    `    txt(PX0-6, VY(2), '+2', {anchor:'end', size:8, fill:'var(--mute)'}); txt(PX0-6, VY(-3), '\\u22123', {anchor:'end', size:8, fill:'var(--mute)'});\n` +
    `    txt(PX0, PTOP-6, 'log |P(e\\u00b2\\u1d56\\u2071\\u1d52)|   (signed area = m(P))', {size:9, fill:'var(--mute)'});\n` +
    `    [0,0.25,0.5,0.75,1].forEach(function(t){ var x=TX(t); svg.appendChild(mk('line',{x1:x,y1:PBOT,x2:x,y2:PBOT+4,stroke:'var(--line)','stroke-width':1})); txt(x, PBOT+14, t===0?'\\u03b8=0':(t===1?'1':''+t), {anchor:'middle', size:8, fill:'var(--mute)'}); });\n` +
    `    // integrand curve (sampled; break at deep singularities)\n` +
    `    var NSp=420, d='', pen=false;\n` +
    `    for(var i=0;i<=NSp;i++){ var t=i/NSp; var v=absP(Math.cos(2*Math.PI*t),Math.sin(2*Math.PI*t),P.c); var L=Math.log(Math.max(v,1e-12));\n` +
    `      var X=TX(t), Y=VY(L); d+=(pen?'L ':'M ')+X.toFixed(1)+' '+Y.toFixed(1)+' '; pen=(L>YLO+0.01); }\n` +
    `    svg.appendChild(mk('path',{d:d, fill:'none', stroke:'var(--cyan)','stroke-width':2}));\n` +
    `    // shade signed area between curve and 0 (light)\n` +
    `    var area='M '+TX(0).toFixed(1)+' '+y0.toFixed(1)+' ';\n` +
    `    for(i=0;i<=NSp;i++){ var t2=i/NSp; var v2=absP(Math.cos(2*Math.PI*t2),Math.sin(2*Math.PI*t2),P.c); area+='L '+TX(t2).toFixed(1)+' '+VY(Math.log(Math.max(v2,1e-12))).toFixed(1)+' '; }\n` +
    `    area+='L '+TX(1).toFixed(1)+' '+y0.toFixed(1)+' Z';\n` +
    `    svg.appendChild(mk('path',{d:area, fill:'var(--cyan)','fill-opacity':0.10, stroke:'none'}));\n` +
    `    // m line marker (the average value m)\n` +
    `    var ym=VY(mJ); svg.appendChild(mk('line',{x1:PX0,y1:ym,x2:PX1,y2:ym,stroke:'var(--yellow)','stroke-width':1.4,'stroke-dasharray':'5 3'}));\n` +
    `    txt(PX1+3, ym+3, 'm = '+mJ.toFixed(4), {size:10, fill:'var(--yellow)', weight:700});\n` +
    `    // readout-ish summary lines in svg\n` +
    `    txt(PX0, PBOT+34, P.name+':  '+P.note, {size:10, fill:'var(--ink)'});\n` +
    `    txt(PX0, PBOT+50, 'Jensen  m = log|lead| + \\u03a3_{|\\u03b1|>1} log|\\u03b1| = '+mJ.toFixed(5)+'      torus integral \\u2248 '+mI.toFixed(5), {size:10, fill:'var(--mute)'});\n` +
    `    out.textContent='The (logarithmic) Mahler measure is m(P) = \\u222b\\u2080\\u00b9 log|P(e\\u00b2\\u1d56\\u2071\\u1d4d)| d\\u03b8 \\u2014 the average of log|P| over the unit circle (the cyan curve; its signed area is m). In ONE variable Jensen\\u2019s formula collapses the integral to a pure height: m(P) = log|a| + \\u03a3_{|\\u03b1\\u2c7c|>1} log|\\u03b1\\u2c7c| over the leading coefficient a and the roots OUTSIDE the unit circle (roots on or inside contribute nothing). For '+P.name+': '+P.note+', so m = '+mJ.toFixed(5)+', matching the torus integral '+mI.toFixed(5)+' (roots ON the circle give log-singularities, so the integral converges slowly there). LEHMER\\u2019S PROBLEM: among integer polynomials with m(P) > 0, is there a GAP above 0 \\u2014 an infimum strictly positive? The smallest known value is Lehmer\\u2019s m(L) = log(1.17628\\u2026) = 0.162357\\u2026, unbeaten since 1933; whether inf{m(P) : m(P)>0} > 0 is open. The bridge to \\u03b6: in TWO+ variables no elementary evaluation exists, and Smyth (1981) found the Mahler measure computes special L-values \\u2014 m(1+x+y) = (3\\u221a3/4\\u03c0) L(\\u03c7\\u208b\\u2083, 2) and m(1+x+y+z) = (7/2\\u03c0\\u00b2) \\u03b6(3) \\u2248 0.4263, Ap\\u00e9ry\\u2019s constant again. Boyd then conjectured m(P) = r\\u00b7L\\u2032(E,0) for the elliptic curve P=0, tying these heights to the deepest L-value conjectures.';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; curKey=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
