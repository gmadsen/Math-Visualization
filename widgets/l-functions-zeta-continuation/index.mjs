// l-functions-zeta-continuation widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The continued ζ(s) for real s (CVZ η-series for
// s>0, functional equation + Lanczos Γ for s<0) plotted against the truncated
// Dirichlet partial sum, which only tracks ζ in its half-plane of convergence.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-N">Dirichlet partial sum $\\sum_{n\\le N} n^{-s}$</label>\n` +
    `    <input type="range" id="${widgetId}-N" min="1" max="40" value="8" step="1">\n` +
    `    <span class="pill" id="${widgetId}-Nv">N = …</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="The analytically continued Riemann zeta for real s, plotted against the truncated Dirichlet partial sum"><title>The continued zeta(s) for real s is finite everywhere except the pole at s=1; the Dirichlet partial sum tracks it only for s>1 and blows up for s<=1</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* l-functions-zeta-continuation widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sN=document.getElementById('${widgetId}-N'), Nv=document.getElementById('${widgetId}-Nv');\n` +
    `  if(!svg||!out||!sN||!Nv) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var LG=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];\n` +
    `  function gamma(z){ if(z<0.5) return Math.PI/(Math.sin(Math.PI*z)*gamma(1-z)); z-=1; var x=LG[0]; for(var i=1;i<9;i++) x+=LG[i]/(z+i); var t=z+7.5; return Math.sqrt(2*Math.PI)*Math.pow(t,z+0.5)*Math.exp(-t)*x; }\n` +
    `  function eta(s){ var n=32, d=Math.pow(3+Math.sqrt(8),n); d=(d+1/d)/2; var b=-1, cc=-d, sum=0; for(var k=0;k<n;k++){ cc=b-cc; sum+=cc*Math.pow(k+1,-s); b=(k+n)*(k-n)*b/((k+0.5)*(k+1)); } return sum/d; }\n` +
    `  function zeta(s){ if(Math.abs(s-1)<1e-7) return null; if(Math.abs(s)<1e-12) return -0.5;\n` +
    `    if(s>0) return eta(s)/(1-Math.pow(2,1-s));\n` +
    `    return Math.pow(2,s)*Math.pow(Math.PI,s-1)*Math.sin(Math.PI*s/2)*gamma(1-s)*zeta(1-s); }\n` +
    `  function partial(s,N){ var t=0; for(var n=1;n<=N;n++) t+=Math.pow(n,-s); return t; }\n` +
    `  var SLO=-6, SHI=5, YLO=-2, YHI=3, PX0=54, PX1=506, PTOP=44, PBOT=250;\n` +
    `  function SX(s){ return PX0 + (s-SLO)/(SHI-SLO)*(PX1-PX0); }\n` +
    `  function YY(v){ return PBOT - (v-YLO)/(YHI-YLO)*(PBOT-PTOP); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var N=parseInt(sN.value,10); Nv.textContent='N = '+N;\n` +
    `    // grid: y=0 axis, x ticks, s=1 pole line\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:YY(0),x2:PX1,y2:YY(0),stroke:'var(--line)','stroke-width':1}));\n` +
    `    for(var gi=-6;gi<=5;gi++){ var gx=SX(gi); svg.appendChild(mk('line',{x1:gx,y1:PBOT,x2:gx,y2:PBOT+4,stroke:'var(--line)','stroke-width':1})); if(gi%2===0||gi===1||gi===-1) txt(gx, PBOT+14, ''+gi, {anchor:'middle', size:8, fill:'var(--mute)'}); }\n` +
    `    txt(PX0-4, YY(0)+3, '0', {anchor:'end', size:8, fill:'var(--mute)'}); txt(PX0-4, YY(2)+3, '2', {anchor:'end', size:8, fill:'var(--mute)'}); txt(PX0-4, YY(-1)+3, '\\u22121', {anchor:'end', size:8, fill:'var(--mute)'});\n` +
    `    txt(PX1, PBOT+26, 's (real axis)', {anchor:'end', size:9, fill:'var(--mute)'});\n` +
    `    // pole at s=1\n` +
    `    svg.appendChild(mk('line',{x1:SX(1),y1:PTOP,x2:SX(1),y2:PBOT,stroke:'var(--pink)','stroke-width':1,'stroke-dasharray':'2 3','stroke-opacity':0.6})); txt(SX(1)+3, PTOP+8, 'pole s=1', {size:8, fill:'var(--pink)'});\n` +
    `    // Dirichlet partial sum (dashed yellow), clamped\n` +
    `    var dp='', pen=false; for(var i=0;i<=440;i++){ var s=SLO+(SHI-SLO)*i/440; var v=partial(s,N); var cl=v>YHI?YHI:(v<YLO?YLO:v); var inside=(v<=YHI&&v>=YLO); dp+=(pen?'L ':'M ')+SX(s).toFixed(1)+' '+YY(cl).toFixed(1)+' '; pen=true; }\n` +
    `    svg.appendChild(mk('path',{d:dp, fill:'none', stroke:'var(--yellow)','stroke-width':1.4,'stroke-dasharray':'4 3'}));\n` +
    `    // continued zeta (cyan), break at pole and at clamp\n` +
    `    var d='', pz=false; for(i=0;i<=600;i++){ var s2=SLO+(SHI-SLO)*i/600; if(Math.abs(s2-1)<0.04){ pz=false; continue; } var z=zeta(s2); if(z===null||z>YHI+0.5||z<YLO-0.5){ pz=false; continue; } var zz=z>YHI?YHI:(z<YLO?YLO:z); d+=(pz?'L ':'M ')+SX(s2).toFixed(1)+' '+YY(zz).toFixed(1)+' '; pz=(z<=YHI&&z>=YLO); }\n` +
    `    svg.appendChild(mk('path',{d:d, fill:'none', stroke:'var(--cyan)','stroke-width':2}));\n` +
    `    // special points\n` +
    `    function dot(s,v,lab,col){ if(v<YLO||v>YHI) return; svg.appendChild(mk('circle',{cx:SX(s),cy:YY(v),r:3.5,fill:col})); txt(SX(s)+5, YY(v)-4, lab, {size:9, fill:col}); }\n` +
    `    dot(0,-0.5,'\\u03b6(0)=\\u2212\\u00bd','var(--green)'); dot(-1,-1/12,'\\u03b6(\\u22121)=\\u2212\\u00b9\\u2044\\u2081\\u2082','var(--green)'); dot(2,Math.PI*Math.PI/6,'\\u03b6(2)=\\u03c0\\u00b2\\u20446','var(--violet)');\n` +
    `    dot(-2,0,'','var(--mute)'); dot(-4,0,'','var(--mute)'); txt(SX(-4)-2, YY(0)-6, 'trivial zeros \\u22122,\\u22124,\\u2026', {size:8, fill:'var(--mute)'});\n` +
    `    // legend\n` +
    `    svg.appendChild(mk('line',{x1:PX0+6,y1:PTOP+8,x2:PX0+22,y2:PTOP+8,stroke:'var(--cyan)','stroke-width':2})); txt(PX0+26, PTOP+11, 'continued \\u03b6(s)', {size:9, fill:'var(--cyan)'});\n` +
    `    svg.appendChild(mk('line',{x1:PX0+6,y1:PTOP+22,x2:PX0+22,y2:PTOP+22,stroke:'var(--yellow)','stroke-width':1.4,'stroke-dasharray':'4 3'})); txt(PX0+26, PTOP+25, '\\u03a3_{n\\u2264'+N+'} n\\u207b\\u02e2 (partial sum)', {size:9, fill:'var(--yellow)'});\n` +
    `    out.textContent='A Dirichlet series \\u03b6(s) = \\u03a3 n\\u207b\\u02e2 only defines a function where it CONVERGES \\u2014 for \\u03b6 that is Re s > 1 (the yellow partial sum tracks \\u03b6 there, but for s \\u2264 1 it diverges, shooting off as you raise N). The content of \\u201c\\u03b6 is an L-function\\u201d is that this half-plane is an ARTIFACT: the true object continues to a meromorphic function on all of \\u2102 (cyan), with a single simple pole at s = 1. The mechanism is the Mellin transform: \\u039b(s) = \\u03c0^(\\u2212s/2)\\u0393(s/2)\\u03b6(s) = \\u222b\\u2080^\\u221e ((\\u03b8(iy)\\u22121)/2)\\u00b7y^{s/2\\u22121} dy, split at y = 1; Jacobi\\u2019s theta relation \\u03b8(i/y) = \\u221ay\\u00b7\\u03b8(iy) folds the two halves into each other, proving the FUNCTIONAL EQUATION \\u039b(s) = \\u039b(1\\u2212s) and the continuation in one stroke (the same y\\u21a61/y trick works for cusp-form L-functions via f(i/y)=\\u03b5 y^k f(iy)). Reading off the values the series could never see: \\u03b6(0) = \\u2212\\u00bd, \\u03b6(\\u22121) = \\u2212\\u00b9\\u2044\\u2081\\u2082 (the regularized 1+2+3+\\u22ef), \\u03b6(\\u22122)=\\u03b6(\\u22124)=\\u22ef=0 (the TRIVIAL ZEROS, from the sin(\\u03c0s/2) factor), and on the convergent side \\u03b6(2)=\\u03c0\\u00b2\\u20446. The functional equation mirrors s\\u2194 1\\u2212s about the critical line Re s = \\u00bd, where the Riemann Hypothesis lives.';\n` +
    `  }\n` +
    `  sN.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
