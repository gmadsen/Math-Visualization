// osculating-circle-2d widget — shared registry renderer for the
// "drag-along-curve" gesture: the reader drags a point P along a parametric
// curve and watches the osculating circle (radius 1/|kappa|, the circle that
// best hugs the curve at P) grow and shrink with the curvature.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the curve sampling, the drag-to-nearest-t projection, the
// curvature (central finite difference) + osculating-circle geometry, the
// tangent/normal, the t/kappa/rho readout, and Reset. The author writes only
// `function curve(t){ return [x,y]; }` (params.bodyScript).
//
// jsdom-safe: createSVGPoint/getScreenCTM run only inside the pointer handlers.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 600 460';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 600;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 460;
  const svgTitle = params.svgTitle || title;
  const resetLabel = params.resetLabel || '↺ Reset';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:grab;width:100%;max-width:${svgWidth}px;height:auto;overflow:hidden"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-reset" type="button">${resetLabel}</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const {
    widgetId, svgId, outputId, bodyScript,
    x0 = -3.2, x1 = 3.2, y0 = -2.6, y1 = 2.6,
    t0 = 0, t1 = 6.283185307179586,
    closed = true, initialT = 0.6, showEvolute = false,
  } = params;
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const X0=${x0}, X1=${x1}, Y0=${y0}, Y1=${y1}, T0=${t0}, T1=${t1}, CLOSED=${closed}, SHOWEVOLUTE=${showEvolute};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 600 460').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3], padL=14, padR=14, padT=12, padB=12;\n` +
    `  const bx0=padL, bx1=W-padR, by0=Hh-padB, by1=padT;\n` +
    `  // isotropic mapping (equal px/unit in x and y) so a data circle draws as a circle\n` +
    `  const cxD=(X0+X1)/2, cyD=(Y0+Y1)/2, S=Math.min((bx1-bx0)/(X1-X0),(by0-by1)/(Y1-Y0));\n` +
    `  const pcx=(bx0+bx1)/2, pcy=(by0+by1)/2;\n` +
    `  function PX(x){ return pcx + (x-cxD)*S; }\n` +
    `  function PY(y){ return pcy - (y-cyD)*S; }\n` +
    `  function XV(px){ return cxD + (px-pcx)/S; }\n` +
    `  function YV(py){ return cyD - (py-pcy)/S; }\n` +
    `  // ---- author curve(t) -> [x,y] ----\n` +
    bodyScript + `\n` +
    `  // ---- osculating-circle engine ----\n` +
    `  let tt=${initialT};\n` +
    `  function geom(t){ const h=1e-3, p=curve(t);\n` +
    `    // derivative stencil: for an open curve, clamp the 3-point window inside [T0,T1] so\n` +
    `    // curve(t\\u00b1h) is never evaluated outside its declared domain (NaN guard); the point P\n` +
    `    // stays at curve(t). Closed/periodic curves keep te=t (curve handles the wrap itself).\n` +
    `    const te = CLOSED ? t : Math.min(Math.max(t, T0+h), T1-h);\n` +
    `    const c=curve(te), pp=curve(te+h), pm=curve(te-h);\n` +
    `    const dx=(pp[0]-pm[0])/(2*h), dy=(pp[1]-pm[1])/(2*h);\n` +
    `    const ddx=(pp[0]-2*c[0]+pm[0])/(h*h), ddy=(pp[1]-2*c[1]+pm[1])/(h*h);\n` +
    `    const sp=Math.hypot(dx,dy), kap=(dx*ddy-dy*ddx)/Math.pow(sp,3);\n` +
    `    return {p:p, dx:dx, dy:dy, sp:sp, kap:kap}; }\n` +
    `  function centreOfCurv(t){ const gg=geom(t); if(!isFinite(gg.kap)||Math.abs(gg.kap)<1e-6) return null;\n` +
    `    const ux=gg.dx/gg.sp, uy=gg.dy/gg.sp; return [gg.p[0]+(1/gg.kap)*(-uy), gg.p[1]+(1/gg.kap)*ux]; }\n` +
    `  function render(){\n` +
    `    while(G.firstChild)G.removeChild(G.firstChild);\n` +
    `    // evolute (locus of centres of curvature) — drawn faint, broken where it flies off (inflections)\n` +
    `    if(SHOWEVOLUTE){ let ed='', pen=false, M=600, mx=(X1-X0), my=(Y1-Y0);\n` +
    `      for(let i=0;i<=M;i++){ const t=T0+(T1-T0)*i/M, c=centreOfCurv(t);\n` +
    `        if(c && c[0]>X0-mx && c[0]<X1+mx && c[1]>Y0-my && c[1]<Y1+my){ ed+=(pen?'L':'M')+PX(c[0]).toFixed(1)+' '+PY(c[1]).toFixed(1)+' '; pen=true; } else pen=false; }\n` +
    `      if(ed) G.appendChild(SVG('path',{d:ed,fill:'none',stroke:'var(--violet)','stroke-width':1.5,'stroke-dasharray':'2 4',opacity:0.8}));\n` +
    `      var le=SVG('text',{x:PX(cxD)+4,y:PY(cyD)-6,'font-size':12,fill:'var(--violet)',opacity:0.9}); le.textContent='evolute'; G.appendChild(le);\n` +
    `    }\n` +
    `    // curve\n` +
    `    let d='', N=480; for(let i=0;i<=N;i++){ const t=T0+(T1-T0)*i/N, q=curve(t); d+=(i?'L':'M')+PX(q[0]).toFixed(1)+' '+PY(q[1]).toFixed(1)+' '; } if(CLOSED) d+='Z';\n` +
    `    G.appendChild(SVG('path',{d:d,fill:'none',stroke:'var(--green)','stroke-width':2.5}));\n` +
    `    const g=geom(tt), p=g.p, sp=g.sp, kap=g.kap, rho=1/Math.abs(kap);\n` +
    `    const tx=g.dx/sp, ty=g.dy/sp, nx=-ty, ny=tx; // unit tangent + left normal\n` +
    `    // osculating circle: centre = P + (1/kappa)*N_left (signed)\n` +
    `    const ccx=p[0]+(1/kap)*nx, ccy=p[1]+(1/kap)*ny;\n` +
    `    if(isFinite(rho) && rho<40){\n` +
    `      G.appendChild(SVG('circle',{cx:PX(ccx),cy:PY(ccy),r:Math.abs(PX(ccx+rho)-PX(ccx)),fill:'var(--pink)','fill-opacity':0.06,stroke:'var(--pink)','stroke-width':2}));\n` +
    `      G.appendChild(SVG('circle',{cx:PX(ccx),cy:PY(ccy),r:3,fill:'var(--pink)'}));\n` +
    `      G.appendChild(SVG('line',{x1:PX(p[0]),y1:PY(p[1]),x2:PX(ccx),y2:PY(ccy),stroke:'var(--pink)','stroke-width':1,'stroke-dasharray':'4 4',opacity:0.7}));\n` +
    `      var lc=SVG('text',{x:PX(ccx)+7,y:PY(ccy)-6,'font-size':12,fill:'var(--pink)'}); lc.textContent='centre of curvature'; G.appendChild(lc);\n` +
    `    }\n` +
    `    // tangent line\n` +
    `    G.appendChild(SVG('line',{x1:PX(p[0]-tx*1.4),y1:PY(p[1]-ty*1.4),x2:PX(p[0]+tx*1.4),y2:PY(p[1]+ty*1.4),stroke:'var(--cyan)','stroke-width':1.5,opacity:0.8}));\n` +
    `    // point P\n` +
    `    G.appendChild(SVG('circle',{cx:PX(p[0]),cy:PY(p[1]),r:7,fill:'var(--cyan)',stroke:'var(--ink)','stroke-width':1.5}));\n` +
    `    var lp=SVG('text',{x:PX(p[0])+9,y:PY(p[1])+16,'font-size':12,fill:'var(--cyan)'}); lp.textContent='P'; G.appendChild(lp);\n` +
    `    function f(n){ return (n>=0?'':'\\u2212')+Math.abs(n).toFixed(2); }\n` +
    `    var rhoStr = isFinite(rho)&&rho<1e4 ? f(rho) : '\\u221e (straight)';\n` +
    `    out.innerHTML='curvature \\u03ba = '+f(kap)+' &nbsp;\\u00b7&nbsp; radius of curvature \\u03c1 = 1/|\\u03ba| = <b style=\\"color:var(--pink)\\">'+rhoStr+'</b> &nbsp;\\u00b7&nbsp; the osculating circle hugs the curve to second order at P';\n` +
    `  }\n` +
    `  function toData(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; const pp=q.matrixTransform(svg.getScreenCTM().inverse()); return {x:XV(pp.x), y:YV(pp.y)}; }\n` +
    `  function nearestT(pt){ let best=tt,bd=1e9; const M=600; for(let i=0;i<=M;i++){ const t=T0+(T1-T0)*i/M, q=curve(t), dd=(q[0]-pt.x)*(q[0]-pt.x)+(q[1]-pt.y)*(q[1]-pt.y); if(dd<bd){bd=dd;best=t;} } return best; }\n` +
    `  let drag=false;\n` +
    `  svg.addEventListener('pointerdown',function(ev){ const pt=toData(ev); const p=curve(tt); if(Math.hypot(pt.x-p[0],pt.y-p[1])<0.45){ drag=true; ev.preventDefault(); try{svg.setPointerCapture(ev.pointerId);}catch(e){} } });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!drag)return; tt=nearestT(toData(ev)); render(); });\n` +
    `  window.addEventListener('pointerup',function(){ drag=false; });\n` +
    `  const rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ tt=${initialT}; render(); });\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
