// sampling-box widget — shared registry renderer for the "shake-sample" gesture:
// the reader presses Draw to pull i.i.d. samples from an author source; they pile
// into a running histogram that fills toward the true density while the running
// sample mean converges to mu (the law of large numbers, made visible).
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the binning, histogram + density-overlay rendering, the
// running-mean marker, the Draw/Reset controls, and the readout. The author
// supplies sample() (required) and optionally density(x) via params.bodyScript.
//
// jsdom-safe: Math.random is called only inside the Draw handler, never at init.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 600 360';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 600;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 360;
  const svgTitle = params.svgTitle || title;
  const resetLabel = params.resetLabel || '↺ Reset';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  const drawSizes = Array.isArray(params.drawSizes) && params.drawSizes.length ? params.drawSizes : [1, 100, 1000];
  const btns = drawSizes
    .map((n) => `<button id="${widgetId}-draw-${n}" type="button" data-n="${n}">draw +${n}</button>`)
    .join('\n    ');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n    ${btns}\n` +
    `    <button id="${widgetId}-reset" type="button">${resetLabel}</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const {
    widgetId, svgId, outputId, bodyScript,
    xMin, xMax, bins = 40, xLabel = 'x', muLabel = 'μ',
  } = params;
  const drawSizes = Array.isArray(params.drawSizes) && params.drawSizes.length ? params.drawSizes : [1, 100, 1000];
  const hasMu = params.mu != null;
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const X0=${xMin}, X1=${xMax}, NB=${bins}, XLAB=${JSON.stringify(xLabel)};\n` +
    `  const HASMU=${hasMu}, MU=${hasMu ? params.mu : 0}, MULAB=${JSON.stringify(muLabel)};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 600 360').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3], padL=20, padR=16, padT=18, padB=42;\n` +
    `  const bx0=padL, bx1=W-padR, by0=Hh-padB, by1=padT;\n` +
    `  function PX(x){ return bx0+(x-X0)/(X1-X0)*(bx1-bx0); }\n` +
    `  // ---- author hooks: sample() required; density(x) optional ----\n` +
    bodyScript + `\n` +
    `  var hasDensity=(typeof density==='function');\n` +
    `  var hist=new Array(NB), N=0, sum=0; for(var i=0;i<NB;i++) hist[i]=0;\n` +
    `  function reset(){ for(var i=0;i<NB;i++) hist[i]=0; N=0; sum=0; render(); }\n` +
    `  function draw(k){ for(var t=0;t<k;t++){ var x=sample(); sum+=x; N++;\n` +
    `    var bi=Math.floor((x-X0)/(X1-X0)*NB); if(bi<0)bi=0; if(bi>=NB)bi=NB-1; hist[bi]++; } render(); }\n` +
    `  function fmt(n){ return (n<0?'\\u2212':'')+Math.abs(n).toFixed(3); }\n` +
    `  function render(){\n` +
    `    while(G.firstChild)G.removeChild(G.firstChild);\n` +
    `    var bw=(X1-X0)/NB;\n` +
    `    // peak for vertical scaling: max of empirical density and the overlay\n` +
    `    var pk=1e-9; for(var i=0;i<NB;i++){ var d=N>0?hist[i]/N/bw:0; if(d>pk)pk=d; }\n` +
    `    if(hasDensity){ for(var s=0;s<=120;s++){ var xx=X0+(X1-X0)*s/120, dv=density(xx); if(dv>pk)pk=dv; } }\n` +
    `    pk*=1.08;\n` +
    `    // histogram bars (empirical density = count/N/binwidth)\n` +
    `    var pw=(bx1-bx0)/NB;\n` +
    `    for(var i=0;i<NB;i++){ if(!hist[i])continue; var d=hist[i]/N/bw, h=d/pk*(by0-by1);\n` +
    `      G.appendChild(SVG('rect',{x:(bx0+i*pw+0.6).toFixed(2),y:(by0-h).toFixed(2),width:(pw-1.2).toFixed(2),height:h.toFixed(2),fill:'var(--cyan)','fill-opacity':0.5,stroke:'var(--cyan)','stroke-width':0.8})); }\n` +
    `    // true-density overlay\n` +
    `    if(hasDensity){ var dd='M'; for(var s=0;s<=160;s++){ var xx=X0+(X1-X0)*s/160; dd+=(s?'L':'')+PX(xx).toFixed(1)+' '+(by0-density(xx)/pk*(by0-by1)).toFixed(1)+' '; }\n` +
    `      G.appendChild(SVG('path',{d:dd,fill:'none',stroke:'var(--pink)','stroke-width':2.2})); }\n` +
    `    // axis\n` +
    `    G.appendChild(SVG('line',{x1:bx0,y1:by0,x2:bx1,y2:by0,stroke:'var(--ink)','stroke-width':1.2}));\n` +
    `    function xt(v){ var px=PX(v); G.appendChild(SVG('line',{x1:px,y1:by0,x2:px,y2:by0+4,stroke:'var(--mute)','stroke-width':1})); var t=SVG('text',{x:px,y:by0+16,'font-size':10,fill:'var(--mute)','text-anchor':'middle'}); t.textContent=(''+(+v.toFixed(2))); G.appendChild(t); }\n` +
    `    xt(X0); xt((X0+X1)/2); xt(X1);\n` +
    `    var xl=SVG('text',{x:(bx0+bx1)/2,y:Hh-6,'font-size':12,fill:'var(--ink)','text-anchor':'middle'}); xl.textContent=XLAB; G.appendChild(xl);\n` +
    `    // mu guideline + running-mean marker\n` +
    `    if(HASMU){ G.appendChild(SVG('line',{x1:PX(MU),y1:by1,x2:PX(MU),y2:by0,stroke:'var(--mute)','stroke-width':1.5,'stroke-dasharray':'5 4'}));\n` +
    `      var mt=SVG('text',{x:PX(MU),y:by1-4,'font-size':11,fill:'var(--mute)','text-anchor':'middle'}); mt.textContent=MULAB+' = '+fmt(MU); G.appendChild(mt); }\n` +
    `    if(N>0){ var xbar=sum/N; G.appendChild(SVG('line',{x1:PX(xbar),y1:by1+4,x2:PX(xbar),y2:by0,stroke:'var(--yellow)','stroke-width':2}));\n` +
    `      G.appendChild(SVG('circle',{cx:PX(xbar),cy:by1+4,r:4,fill:'var(--yellow)',stroke:'var(--ink)','stroke-width':1.2})); }\n` +
    `    // legend\n` +
    `    if(hasDensity){ G.appendChild(SVG('line',{x1:bx1-150,y1:by1+6,x2:bx1-132,y2:by1+6,stroke:'var(--pink)','stroke-width':2.2})); var lt=SVG('text',{x:bx1-128,y:by1+10,'font-size':11,fill:'var(--pink)'}); lt.textContent='true density'; G.appendChild(lt); }\n` +
    `    // readout\n` +
    `    if(N===0){ out.innerHTML='press <b>draw</b> to pull samples \\u2014 the histogram fills toward the true density and the sample mean settles on '+(HASMU?MULAB:'its limit'); return; }\n` +
    `    var xbar=sum/N, extra= HASMU ? (' &nbsp;\\u00b7&nbsp; sample mean <b style=\\"color:var(--yellow)\\">x\\u0304 = '+fmt(xbar)+'</b> vs '+MULAB+' = '+fmt(MU)+' &nbsp;(|x\\u0304\\u2212'+MULAB+'| = '+fmt(Math.abs(xbar-MU))+')') : (' &nbsp;\\u00b7&nbsp; sample mean x\\u0304 = <b style=\\"color:var(--yellow)\\">'+fmt(xbar)+'</b>');\n` +
    `    out.innerHTML='<b>'+N.toLocaleString()+'</b> sample'+(N===1?'':'s')+extra;\n` +
    `  }\n` +
    drawSizes.map((n) => `  (function(){ var b=$('#${widgetId}-draw-${n}'); if(b) b.addEventListener('click',function(){ draw(${n}); }); })();\n`).join('') +
    `  var rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',reset);\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
