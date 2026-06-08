// functional-equation-mirror widget — bespoke registry renderer for the
// "drag-reflect" gesture: Riemann's functional equation xi(s) = xi(1-s).
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The reader drags a point s = sigma + i t across the complex plane; the widget
// draws the functional-equation partner 1 - s (the point reflection of s through
// the center (1/2, 0)) and evaluates the completed zeta
//   xi(s) = 1/2 s(s-1) pi^{-s/2} Gamma(s/2) zeta(s)
// at BOTH points, showing they are equal. xi is computed honestly for any complex
// s via the everywhere-convergent, manifestly s<->1-s symmetric integral
//   xi(s) = 1/2 + 1/2 s(s-1) \int_1^infty (theta(x)-1)/2 (x^{s/2-1}+x^{(1-s)/2-1}) dx
// (Simpson quadrature, complex arithmetic). The critical line Re(s)=1/2 is the
// mirror axis; the first nontrivial zeros are ringed on it (in the shaded
// critical strip), and dragging s onto the line near one drives |xi(s)| to zero.
//
// Pure DOM/SVG; jsdom-safe: createSVGPoint/getScreenCTM run only inside the
// pointer handlers. The static plane is built once (G1); only the puck + partner
// + readout (G2) redraw on drag, each a pair of xi evaluations.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 440 600';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 440;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 600;
  const svgTitle = params.svgTitle || title;
  const resetLabel = params.resetLabel || '↺ Reset';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:crosshair;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-reset" type="button">${resetLabel}</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId } = params;
  const S0 = params.sigma0 != null ? params.sigma0 : -1.5;
  const S1 = params.sigma1 != null ? params.sigma1 : 2.5;
  const T0 = params.t0 != null ? params.t0 : -15;
  const T1 = params.t1 != null ? params.t1 : 15;
  const sInit = params.sigmaInit != null ? params.sigmaInit : 0.8;
  const tInit = params.tInit != null ? params.tInit : 6;
  const zeros = Array.isArray(params.zeros) ? params.zeros : [14.134725, 21.022040, 25.010858];
  return (
`<script>
(function(){
  const svg=$('#${svgId}'), out=$('#${outputId}');
  const G1=SVG('g'), G2=SVG('g'); svg.appendChild(G1); svg.appendChild(G2);
  const S0=${S0}, S1=${S1}, T0=${T0}, T1=${T1}, ZEROS=${JSON.stringify(zeros)};
  const _vb=(svg.getAttribute('viewBox')||'0 0 440 600').split(/\\s+/).map(Number);
  const W=_vb[2], Hh=_vb[3], padL=44, padR=16, padT=18, padB=40;
  const bx0=padL, bx1=W-padR, by0=Hh-padB, by1=padT;
  function PX(s){ return bx0+(s-S0)/(S1-S0)*(bx1-bx0); }
  function PY(t){ return by0-(t-T0)/(T1-T0)*(by0-by1); }
  function SX(px){ return S0+(px-bx0)/(bx1-bx0)*(S1-S0); }
  function TY(py){ return T0+(by0-py)/(by0-by1)*(T1-T0); }
  // ---- complex arithmetic ----
  function cadd(a,b){ return [a[0]+b[0],a[1]+b[1]]; }
  function csub(a,b){ return [a[0]-b[0],a[1]-b[1]]; }
  function cmul(a,b){ return [a[0]*b[0]-a[1]*b[1], a[0]*b[1]+a[1]*b[0]]; }
  function cabs(a){ return Math.hypot(a[0],a[1]); }
  function cexp(z){ var e=Math.exp(z[0]); return [e*Math.cos(z[1]), e*Math.sin(z[1])]; }
  function cpow(x,z){ var L=Math.log(x); return cexp([z[0]*L, z[1]*L]); } // x>0 real base
  // ---- Jacobi theta tail: T(x)=sum_{n>=1} e^{-pi n^2 x} ----
  function thetaTail(x){ var s=0; for(var n=1;n<=8;n++){ var t=Math.exp(-Math.PI*n*n*x); s+=t; if(t<1e-16) break; } return s; }
  // ---- completed zeta, pole-free form:
  //   xi(s) = 1/2 + 1/2 s(s-1) \\int_1^X T(x)(x^{s/2-1}+x^{(1-s)/2-1}) dx  (Simpson) ----
  function xi(s){
    var oms=[1-s[0], -s[1]];
    var ea=[0.5*s[0]-1, 0.5*s[1]], eb=[0.5*oms[0]-1, 0.5*oms[1]];
    var X=18, N=360, h=(X-1)/N, acc=[0,0];
    for(var i=0;i<=N;i++){ var x=1+i*h, w=(i===0||i===N)?1:(i%2?4:2), tt=thetaTail(x);
      var term=cadd(cpow(x,ea), cpow(x,eb)); acc[0]+=w*tt*term[0]; acc[1]+=w*tt*term[1]; }
    acc=[acc[0]*h/3, acc[1]*h/3];
    var half=cmul([0.5,0], cmul(s,[s[0]-1,s[1]]));   // 1/2 s(s-1)
    var body=cmul(half, acc);
    return [0.5+body[0], body[1]];
  }
  function fmtC(z){ var r=z[0], im=z[1]; var rs=(Math.abs(r)<5e-4?'0':r.toFixed(3));
    var is=(Math.abs(im)<5e-4?'0':Math.abs(im).toFixed(3)); return rs+(im<0?' \\u2212 ':' + ')+is+'i'; }
  function fmtN(n){ return (n<0?'\\u2212':'')+Math.abs(n).toFixed(2); }
  var sig=${sInit}, tau=${tInit};
  // ===== static layer: heatmap + strip + critical line + axes + zeros =====
  function buildStatic(){
    while(G1.firstChild)G1.removeChild(G1.firstChild);
    // critical strip 0<=sigma<=1 (where all nontrivial zeros live)
    G1.appendChild(SVG('rect',{x:PX(0),y:by1,width:PX(1)-PX(0),height:by0-by1,fill:'var(--cyan)','fill-opacity':0.08,stroke:'none'}));
    // frame
    G1.appendChild(SVG('rect',{x:bx0,y:by1,width:bx1-bx0,height:by0-by1,fill:'none',stroke:'var(--line)','stroke-width':1}));
    // real axis t=0
    if(T0<0&&T1>0) G1.appendChild(SVG('line',{x1:bx0,y1:PY(0),x2:bx1,y2:PY(0),stroke:'var(--mute)','stroke-width':1,opacity:0.35,'stroke-dasharray':'2 3'}));
    // critical line sigma=1/2
    G1.appendChild(SVG('line',{x1:PX(0.5),y1:by1,x2:PX(0.5),y2:by0,stroke:'var(--yellow)','stroke-width':1.4,opacity:0.85}));
    var cl=SVG('text',{x:PX(0.5)+4,y:by1+11,'font-size':10,fill:'var(--yellow)'}); cl.textContent='Re s = \\u00bd'; G1.appendChild(cl);
    // nontrivial zeros on the line (and their mirrors)
    ZEROS.forEach(function(z){ [z,-z].forEach(function(tt){ if(tt<T0||tt>T1) return;
      G1.appendChild(SVG('circle',{cx:PX(0.5),cy:PY(tt),r:4,fill:'none',stroke:'var(--pink)','stroke-width':1.6})); }); });
    // center (1/2, 0) — the reflection point
    G1.appendChild(SVG('circle',{cx:PX(0.5),cy:PY(0),r:2.4,fill:'var(--mute)'}));
    // axis ticks/labels
    function xt(v){ G1.appendChild(SVG('line',{x1:PX(v),y1:by0,x2:PX(v),y2:by0+4,stroke:'var(--mute)','stroke-width':1})); var t=SVG('text',{x:PX(v),y:by0+15,'font-size':10,fill:'var(--mute)','text-anchor':'middle'}); t.textContent=fmtN(v); G1.appendChild(t); }
    function yt(v){ G1.appendChild(SVG('line',{x1:bx0-4,y1:PY(v),x2:bx0,y2:PY(v),stroke:'var(--mute)','stroke-width':1})); var t=SVG('text',{x:bx0-6,y:PY(v)+3,'font-size':10,fill:'var(--mute)','text-anchor':'end'}); t.textContent=fmtN(v); G1.appendChild(t); }
    xt(0); xt(0.5); xt(1); xt(2);
    yt(T0); yt(0); yt(T1); yt(T1/2); yt(T0/2);
    var xl=SVG('text',{x:(bx0+bx1)/2,y:Hh-5,'font-size':11,fill:'var(--ink)','text-anchor':'middle'}); xl.textContent='Re s = \\u03c3'; G1.appendChild(xl);
    var yl=SVG('text',{x:12,y:(by0+by1)/2,'font-size':11,fill:'var(--ink)','text-anchor':'middle','transform':'rotate(-90 12 '+((by0+by1)/2)+')'}); yl.textContent='Im s = t'; G1.appendChild(yl);
  }
  // ===== dynamic layer: puck s + partner 1-s + readout =====
  function drawDyn(){
    while(G2.firstChild)G2.removeChild(G2.firstChild);
    var s=[sig,tau], oms=[1-sig,-tau];
    var sx=PX(sig), sy=PY(tau), mx=PX(1-sig), my=PY(-tau);
    // connector through the center (the point-reflection chord)
    G2.appendChild(SVG('line',{x1:sx,y1:sy,x2:mx,y2:my,stroke:'var(--ink)','stroke-width':1,opacity:0.5,'stroke-dasharray':'3 3'}));
    // partner 1-s (hollow)
    G2.appendChild(SVG('circle',{cx:mx,cy:my,r:6,fill:'var(--bg)',stroke:'var(--green)','stroke-width':2}));
    var pl=SVG('text',{x:mx+9,y:my+3,'font-size':10,fill:'var(--green)'}); pl.textContent='1\\u2212s'; G2.appendChild(pl);
    // puck s (filled)
    G2.appendChild(SVG('circle',{cx:sx,cy:sy,r:6.5,fill:'var(--yellow)',stroke:'var(--ink)','stroke-width':1.6}));
    var sl=SVG('text',{x:sx+9,y:sy+3,'font-size':10,fill:'var(--ink)'}); sl.textContent='s'; G2.appendChild(sl);
    // values
    var xs=xi(s), xo=xi(oms), m=cabs(xs);
    var nearZero = (Math.abs(sig-0.5)<0.06) && m<0.06;
    var eqHtml = '<b style="color:var(--green)">\\u03be(1\\u2212s) = '+fmtC(xo)+'</b>';
    var msg = '<b>s = '+fmtN(sig)+(tau<0?' \\u2212 ':' + ')+Math.abs(tau).toFixed(2)+'i</b> &nbsp;\\u00b7&nbsp; '
      + '<b style="color:var(--yellow)">\\u03be(s) = '+fmtC(xs)+'</b> &nbsp;\\u00b7&nbsp; ' + eqHtml
      + ' &nbsp;\\u00b7&nbsp; |\\u03be(s)| = <b>'+m.toFixed(4)+'</b>';
    if(nearZero) msg += ' &nbsp;\\u00b7&nbsp; <b style="color:var(--pink)">\\u2248 0 \\u2014 a nontrivial zero on the critical line</b>';
    out.innerHTML = msg;
  }
  function toData(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; return q.matrixTransform(svg.getScreenCTM().inverse()); }
  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
  function setFrom(ev){ var p=toData(ev); sig=clamp(SX(p.x),S0,S1); tau=clamp(TY(p.y),T0,T1); drawDyn(); }
  var drag=false;
  svg.addEventListener('pointerdown',function(ev){ var p=toData(ev); if(p.x>=bx0-14&&p.x<=bx1+14&&p.y>=by1-14&&p.y<=by0+14){ drag=true; ev.preventDefault(); try{svg.setPointerCapture(ev.pointerId);}catch(e){} setFrom(ev); } });
  window.addEventListener('pointermove',function(ev){ if(!drag)return; setFrom(ev); });
  window.addEventListener('pointerup',function(){ drag=false; });
  var rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ sig=${sInit}; tau=${tInit}; drawDyn(); });
  buildStatic(); drawDyn();
})();
</script>`
  );
}
