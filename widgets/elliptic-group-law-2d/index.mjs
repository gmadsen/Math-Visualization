// elliptic-group-law-2d widget — shared registry renderer for the "drag-on-curve"
// gesture: the reader drags two points P, Q pinned to a real elliptic curve
// y^2 = x^3 + a x + b, and the chord-and-tangent construction draws P + Q live.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the curve sampling, the on-curve drag (pointer -> nearest
// curve point on the chosen branch), the chord/tangent construction, the
// group-law arithmetic (third intersection R = m^2 - x_P - x_Q, reflect to get
// the sum), and Reset. The curve is param-driven (a, b, initial point x-coords).
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
    widgetId, svgId, outputId,
    a = -1, b = 1,
    x0 = -2.2, x1 = 3, y0 = -3.6, y1 = 3.6,
    initialP = -0.6, initialQ = 1.4,
  } = params;
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const A=${a}, B=${b}, X0=${x0}, X1=${x1}, Y0=${y0}, Y1=${y1};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 600 460').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3], padL=14, padR=14, padT=12, padB=12;\n` +
    `  const bx0=padL, bx1=W-padR, by0=Hh-padB, by1=padT;\n` +
    `  function PX(x){ return bx0+(bx1-bx0)*(x-X0)/(X1-X0); }\n` +
    `  function PY(y){ return by0+(by1-by0)*(y-Y0)/(Y1-Y0); }\n` +
    `  function XV(px){ return X0+(X1-X0)*(px-bx0)/(bx1-bx0); }\n` +
    `  function YV(py){ return Y0+(Y1-Y0)*(py-by0)/(by1-by0); }\n` +
    `  function cub(x){ return x*x*x + A*x + B; }\n` +
    `  function curveY(x){ return Math.sqrt(Math.max(0,cub(x))); }\n` +
    `  function nearestX(px){ if(cub(px)>=0) return Math.max(X0,Math.min(X1,px));\n` +
    `    let best=null,bd=1e9; for(let s=0;s<=400;s++){ const x=X0+(X1-X0)*s/400; if(cub(x)>=0){ const d=Math.abs(x-px); if(d<bd){bd=d;best=x;} } } return best===null?px:best; }\n` +
    `  let Px=${initialP}, Psg=1, Qx=${initialQ}, Qsg=1;\n` +
    `  function add(x1p,y1p,x2p,y2p){ const E=1e-7;\n` +
    `    if(Math.abs(x1p-x2p)<E && Math.abs(y1p+y2p)<E) return {inf:true};\n` +
    `    let m, tan=false;\n` +
    `    if(Math.abs(x1p-x2p)<E && Math.abs(y1p-y2p)<E){ if(Math.abs(y1p)<E) return {inf:true}; m=(3*x1p*x1p+A)/(2*y1p); tan=true; }\n` +
    `    else { if(Math.abs(x1p-x2p)<E) return {inf:true}; m=(y2p-y1p)/(x2p-x1p); }\n` +
    `    const x3=m*m-x1p-x2p, y3=m*(x3-x1p)+y1p; return {inf:false,m:m,tan:tan,Rx:x3,Ry:y3,Sx:x3,Sy:-y3}; }\n` +
    `  function dot(x,y,col,r){ return SVG('circle',{cx:PX(x),cy:PY(y),r:r||6,fill:col,stroke:'var(--ink)','stroke-width':1.4}); }\n` +
    `  function lbl(x,y,t,col,dx,dy){ const e=SVG('text',{x:PX(x)+(dx||9),y:PY(y)+(dy||-8),'font-size':13,fill:col,'font-weight':600}); e.textContent=t; return e; }\n` +
    `  function render(){\n` +
    `    while(G.firstChild)G.removeChild(G.firstChild);\n` +
    `    // axes\n` +
    `    if(Y0<=0&&Y1>=0) G.appendChild(SVG('line',{x1:bx0,y1:PY(0),x2:bx1,y2:PY(0),stroke:'var(--mute)','stroke-width':1,opacity:0.5}));\n` +
    `    if(X0<=0&&X1>=0) G.appendChild(SVG('line',{x1:PX(0),y1:by1,x2:PX(0),y2:by0,stroke:'var(--mute)','stroke-width':1,opacity:0.3}));\n` +
    `    // curve (upper + lower branches, pen-up across gaps)\n` +
    `    let up='',lo='',pu=false,pl=false; const N=480;\n` +
    `    for(let i=0;i<=N;i++){ const x=X0+(X1-X0)*i/N, c=cub(x);\n` +
    `      if(c>=0){ const y=Math.sqrt(c); up+=(pu?'L':'M')+PX(x).toFixed(1)+' '+PY(y).toFixed(1)+' '; lo+=(pl?'L':'M')+PX(x).toFixed(1)+' '+PY(-y).toFixed(1)+' '; pu=true; pl=true; } else { pu=false; pl=false; } }\n` +
    `    G.appendChild(SVG('path',{d:up,fill:'none',stroke:'var(--green)','stroke-width':2.5}));\n` +
    `    G.appendChild(SVG('path',{d:lo,fill:'none',stroke:'var(--green)','stroke-width':2.5}));\n` +
    `    const Py=Psg*curveY(Px), Qy=Qsg*curveY(Qx);\n` +
    `    const res=add(Px,Py,Qx,Qy);\n` +
    `    // chord / tangent line across the view\n` +
    `    if(!res.inf){ const m=res.m, yL=m*(X0-Px)+Py, yR=m*(X1-Px)+Py;\n` +
    `      G.appendChild(SVG('line',{x1:PX(X0),y1:PY(yL),x2:PX(X1),y2:PY(yR),stroke:'var(--violet)','stroke-width':1.5,opacity:0.85}));\n` +
    `      // R (third intersection) and vertical reflection to the sum\n` +
    `      G.appendChild(SVG('line',{x1:PX(res.Rx),y1:PY(res.Ry),x2:PX(res.Sx),y2:PY(res.Sy),stroke:'var(--pink)','stroke-width':1.5,'stroke-dasharray':'5 4',opacity:0.85}));\n` +
    `      G.appendChild(dot(res.Rx,res.Ry,'var(--mute)',4)); G.appendChild(lbl(res.Rx,res.Ry,'R','var(--mute)',8,16));\n` +
    `      G.appendChild(dot(res.Sx,res.Sy,'var(--pink)')); G.appendChild(lbl(res.Sx,res.Sy,'P+Q','var(--pink)'));\n` +
    `    } else { G.appendChild(SVG('line',{x1:PX(Px),y1:by1,x2:PX(Px),y2:by0,stroke:'var(--pink)','stroke-width':1.5,'stroke-dasharray':'5 4',opacity:0.7})); }\n` +
    `    G.appendChild(dot(Px,Py,'var(--cyan)')); G.appendChild(lbl(Px,Py,res.tan?'P=Q':'P','var(--cyan)'));\n` +
    `    if(!(Math.abs(Px-Qx)<1e-7&&Math.abs(Py-Qy)<1e-7)){ G.appendChild(dot(Qx,Qy,'var(--yellow)')); G.appendChild(lbl(Qx,Qy,'Q','var(--yellow)')); }\n` +
    `    function fmt(x,y){ return '('+x.toFixed(2)+', '+y.toFixed(2)+')'; }\n` +
    `    const sumStr = res.inf ? '<b style=\\"color:var(--pink)\\">O</b> (point at infinity — the identity)' : '<b style=\\"color:var(--pink)\\">'+fmt(res.Sx,res.Sy)+'</b>';\n` +
    `    const op = (Math.abs(Px-Qx)<1e-7&&Math.abs(Py-Qy)<1e-7) ? '2P (tangent doubling)' : 'P + Q';\n` +
    `    out.innerHTML='P = '+fmt(Px,Py)+' &nbsp;\\u00b7&nbsp; Q = '+fmt(Qx,Qy)+' &nbsp;\\u00b7&nbsp; '+op+' = '+sumStr;\n` +
    `  }\n` +
    `  function toData(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; const p=q.matrixTransform(svg.getScreenCTM().inverse()); return {x:XV(p.x), y:YV(p.y)}; }\n` +
    `  let drag=null;\n` +
    `  function hit(pt){ const Py=Psg*curveY(Px), Qy=Qsg*curveY(Qx);\n` +
    `    const dp=Math.hypot(pt.x-Px,pt.y-Py), dq=Math.hypot(pt.x-Qx,pt.y-Qy), r=0.45; if(dp<r&&dp<=dq) return 'P'; if(dq<r) return 'Q'; return null; }\n` +
    `  function place(which,pt){ const x=nearestX(pt.x), yc=curveY(x), sg=(pt.y>=0||yc===0)?1:-1; if(which==='P'){Px=x;Psg=sg;} else {Qx=x;Qsg=sg;} }\n` +
    `  svg.addEventListener('pointerdown',function(ev){ const pt=toData(ev); drag=hit(pt); if(drag){ ev.preventDefault(); try{svg.setPointerCapture(ev.pointerId);}catch(e){} } });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!drag)return; place(drag,toData(ev)); render(); });\n` +
    `  window.addEventListener('pointerup',function(){ drag=null; });\n` +
    `  const rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ Px=${initialP};Psg=1;Qx=${initialQ};Qsg=1; render(); });\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
