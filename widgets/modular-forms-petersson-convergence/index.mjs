// modular-forms-petersson-convergence widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Why the Petersson product converges on cusp forms
// but not on M_k: plot the x-averaged cusp-neighborhood integrand
// H(y) = (sum |a_n|^2 e^{-4 pi n y}) y^{k-2} for Delta vs E_12 at weight 12,
// with a running integral up to a slider cutoff Y.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-Y">cutoff $Y$ (integrate $\\sqrt3/2 \\to Y$)</label>\n` +
    `    <input type="range" id="${widgetId}-Y" min="87" max="500" value="180" step="2">\n` +
    `    <span class="pill" id="${widgetId}-Yv">Y = …</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="Log-scale plot of the cusp-neighborhood Petersson integrand for the weight-12 cusp form Delta versus the Eisenstein series E12, with a movable cutoff"><title>The x-averaged Petersson integrand H(y) at weight 12: the cusp form Delta decays (its integral converges) while the Eisenstein series E12 grows (its integral diverges)</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* modular-forms-petersson-convergence widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sY=document.getElementById('${widgetId}-Y'), Yv=document.getElementById('${widgetId}-Yv');\n` +
    `  if(!svg||!out||!sY||!Yv) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var K=12, FP=4*Math.PI;\n` +
    `  var TAU=[0,1,-24,252,-1472,4830,-6048];\n` +              // Delta coefficients tau(n), a_0=0
    `  var C=65520/691, S11=[0,1,2049,177148,4196353,48828126];\n` + // E_12: a_n = C*sigma_11(n), a_0=1
    `  function mDelta(y){ var s=0; for(var n=1;n<TAU.length;n++) s+=TAU[n]*TAU[n]*Math.exp(-FP*n*y); return s; }\n` +
    `  function mEis(y){ var s=1; for(var n=1;n<S11.length;n++){ var a=C*S11[n]; s+=a*a*Math.exp(-FP*n*y); } return s; }\n` +
    `  function H(mfn,y){ return mfn(y)*Math.pow(y, K-2); }\n` +
    `  var Y0=Math.sqrt(3)/2, YMAX=5;\n` +
    `  function integ(mfn,Y){ var N=500, h=(Y-Y0)/N, s=0; for(var i=0;i<=N;i++){ var y=Y0+i*h, v=H(mfn,y); s+=(i===0||i===N)?v/2:v; } return s*h; }\n` +
    `  var PX0=66, PX1=452, PTOP=50, PBOT=246, LMIN=-21, LMAX=8;\n` +
    `  function Xp(y){ return PX0 + (y-Y0)/(YMAX-Y0)*(PX1-PX0); }\n` +
    `  function Yp(L){ if(L>LMAX)L=LMAX; if(L<LMIN)L=LMIN; return PTOP + (LMAX-L)/(LMAX-LMIN)*(PBOT-PTOP); }\n` +
    `  function curve(mfn,col){ var d='', NS2=160; for(var i=0;i<=NS2;i++){ var y=Y0+i/NS2*(YMAX-Y0); var Hv=H(mfn,y); var L=Hv>0?Math.log(Hv)/Math.LN10:LMIN; d+=(i?'L ':'M ')+Xp(y).toFixed(1)+' '+Yp(L).toFixed(1)+' '; } svg.appendChild(mk('path',{d:d, fill:'none', stroke:col, 'stroke-width':2})); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var Y=parseInt(sY.value,10)/100; Yv.textContent='Y = '+Y.toFixed(2);\n` +
    `    // axes\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:PBOT,x2:PX1,y2:PBOT,stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:PTOP,x2:PX0,y2:PBOT,stroke:'var(--line)','stroke-width':1}));\n` +
    `    // log10 gridlines at -20,-10,0\n` +
    `    [-20,-10,0].forEach(function(L){ var yy=Yp(L); svg.appendChild(mk('line',{x1:PX0,y1:yy,x2:PX1,y2:yy,stroke:'var(--line)','stroke-width':1,'stroke-dasharray':'2 3','stroke-opacity':0.5})); txt(PX0-5, yy+3, '10'+(L<0?'\\u207b':'')+sup(Math.abs(L)), {anchor:'end', size:8, fill:'var(--mute)'}); });\n` +
    `    txt(PX0-5, PTOP-6, 'integrand H(y)', {anchor:'start', size:9, fill:'var(--mute)'});\n` +
    `    txt((PX0+PX1)/2, PBOT+30, 'Im \\u03c4 = y   (fundamental-domain spine, y \\u2265 \\u221a3/2)', {anchor:'middle', size:9, fill:'var(--mute)'});\n` +
    `    // x ticks\n` +
    `    [1,2,3,4,5].forEach(function(yt){ var xx=Xp(yt); svg.appendChild(mk('line',{x1:xx,y1:PBOT,x2:xx,y2:PBOT+4,stroke:'var(--line)','stroke-width':1})); txt(xx, PBOT+15, ''+yt, {anchor:'middle', size:9, fill:'var(--mute)'}); });\n` +
    `    // shade integrated region [Y0,Y]\n` +
    `    var xY=Xp(Y); svg.appendChild(mk('rect',{x:PX0, y:PTOP, width:Math.max(0,xY-PX0), height:PBOT-PTOP, fill:'var(--violet)','fill-opacity':0.08}));\n` +
    `    svg.appendChild(mk('line',{x1:xY,y1:PTOP,x2:xY,y2:PBOT,stroke:'var(--violet)','stroke-width':1.4,'stroke-dasharray':'4 3'}));\n` +
    `    txt(xY, PTOP-6, 'Y', {anchor:'middle', size:10, fill:'var(--violet)', weight:700});\n` +
    `    // curves\n` +
    `    curve(mEis, 'var(--pink)');\n` +
    `    curve(mDelta, 'var(--green)');\n` +
    `    // legend\n` +
    `    svg.appendChild(mk('line',{x1:PX0+10,y1:PTOP+8,x2:PX0+26,y2:PTOP+8,stroke:'var(--green)','stroke-width':2})); txt(PX0+30, PTOP+11, '\\u0394  (cusp form, a\\u2080=0)', {size:9, fill:'var(--green)'});\n` +
    `    svg.appendChild(mk('line',{x1:PX0+10,y1:PTOP+22,x2:PX0+26,y2:PTOP+22,stroke:'var(--pink)','stroke-width':2})); txt(PX0+30, PTOP+25, 'E\\u2081\\u2082  (Eisenstein, a\\u2080=1)', {size:9, fill:'var(--pink)'});\n` +
    `    // running integrals\n` +
    `    var ID=integ(mDelta,Y), IE=integ(mEis,Y);\n` +
    `    txt(PX0+6, PBOT-8, '\\u222b\\u0394: '+ID.toExponential(2), {size:10, fill:'var(--green)', weight:700});\n` +
    `    txt(PX0+6, PBOT-22, '\\u222bE\\u2081\\u2082: '+IE.toExponential(2), {size:10, fill:'var(--pink)', weight:700});\n` +
    `    var IDfull=integ(mDelta,YMAX);\n` +
    `    out.textContent='The Petersson product is \\u27e8f,g\\u27e9 = \\u222b_{\\u0393\\\\\\u210d} f \\u00b7 conj(g) \\u00b7 y^{k\\u22122} dx dy on weight-k forms. The hyperbolic measure y\\u207b\\u00b2 dx dy and the combination |f|\\u00b2 y^k are each SL\\u2082(\\u2124)-invariant (under \\u03b3 the factor |c\\u03c4+d|\\u207b\\u00b2\\u1d4f in |f|\\u00b2 is exactly cancelled by y \\u21a6 y/|c\\u03c4+d|\\u00b2), so the integrand descends to the fundamental domain and the pairing is well-defined. All the convergence drama is at the cusp i\\u221e: by Parseval the x-average of |f|\\u00b2 over the strip |x|\\u2264\\u00bd is \\u03a3_{n\\u22650} |a_n|\\u00b2 e^(\\u22124\\u03c0ny) (with q = e^{2\\u03c0i\\u03c4}), so the cusp-neighborhood part of \\u2016f\\u2016\\u00b2 is \\u222b H(y) dy with H(y) = (\\u03a3 |a_n|\\u00b2 e^(\\u22124\\u03c0ny)) y^{k\\u22122}, here k=12 (this x-averages over the whole strip |x|\\u2264\\u00bd; for y<1 the fundamental domain is really the smaller region |\\u03c4|\\u22651, so the y<1 slice slightly over-counts \\u2014 it is the convergence as y\\u2192\\u221e, not the exact value, that the picture is about). For the CUSP FORM \\u0394 the constant term a\\u2080 = 0, so H(y) \\u2248 e^(\\u22124\\u03c0y) y\\u00b9\\u2070 \\u2014 the exponential crushes the polynomial and \\u222b\\u0394 converges (it has essentially reached '+IDfull.toExponential(2)+' by Y='+YMAX+'; right now \\u222b_{\\u221a3/2}^{'+Y.toFixed(2)+'}\\u0394 = '+ID.toExponential(2)+'). For the EISENSTEIN series E\\u2081\\u2082 the constant term a\\u2080 = 1, so H(y) \\u2248 y\\u00b9\\u2070 \\u2192 \\u221e and \\u222bE\\u2081\\u2082 = '+IE.toExponential(2)+' just keeps climbing \\u2014 it DIVERGES. That is precisely why the Petersson product lives on the space S_k of cusp forms (vanishing at every cusp), where it is a genuine Hermitian inner product; the Hecke operators T_p are self-adjoint for it, which forces a basis of simultaneous eigenforms with real eigenvalues.';\n` +
    `  }\n` +
    `  function sup(n){ var m={0:'\\u2070',1:'\\u00b9',2:'\\u00b2',3:'\\u00b3',4:'\\u2074',5:'\\u2075',6:'\\u2076',7:'\\u2077',8:'\\u2078',9:'\\u2079'}; return (''+n).split('').map(function(d){return m[d];}).join(''); }\n` +
    `  sY.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
