// bayes-mass-updater widget — shared registry renderer for the "pour-and-update"
// gesture: sequential Bayesian inference over a 1-D parameter. The posterior
// density over theta is a bar chart; the reader sculpts the PRIOR by dragging
// across the bars, then feeds data one datum at a time via action buttons. Each
// datum multiplies the posterior by the author's like(key, theta) and
// renormalizes, so probability mass visibly pours toward the theta consistent
// with the evidence.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the bar chart, the drag-to-sculpt-prior gesture, the
// per-datum Bayesian update + renormalization, the mean/MAP readout, and Reset.
// The author supplies like(key, theta) (required) and optionally prior0 /
// summary via params.bodyScript.
//
// jsdom-safe: createSVGPoint/getScreenCTM run only inside the pointer handlers.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 600 360';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 600;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 360;
  const svgTitle = params.svgTitle || title;
  const resetLabel = params.resetLabel || '↺ Clear data';
  const resetPriorLabel = params.resetPriorLabel || 'Reset prior';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  const actions = Array.isArray(params.actions) ? params.actions : [];
  const btns = actions
    .map((a) => `<button id="${widgetId}-act-${a.key}" type="button" data-key="${a.key}">${a.label}</button>`)
    .join('\n    ');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:ns-resize;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n    ${btns}\n` +
    `    <button id="${widgetId}-reset" type="button">${resetLabel}</button>\n` +
    `    <button id="${widgetId}-resetprior" type="button">${resetPriorLabel}</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const {
    widgetId, svgId, outputId, bodyScript,
    x0 = 0, x1 = 1, bars = 30, paramLabel = 'θ',
  } = params;
  const actions = Array.isArray(params.actions) ? params.actions : [];
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const X0=${x0}, X1=${x1}, NB=${bars}, PLAB=${JSON.stringify(paramLabel)};\n` +
    `  const ACTS=${JSON.stringify(actions)};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 600 360').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3], padL=44, padR=16, padT=16, padB=40;\n` +
    `  const bx0=padL, bx1=W-padR, by0=Hh-padB, by1=padT;\n` +
    `  function CX(i){ return bx0+(i+0.5)/NB*(bx1-bx0); }\n` +
    `  function thetaAt(i){ return X0+(i+0.5)/NB*(X1-X0); }\n` +
    `  // ---- author hooks: like(key,theta) required; prior0/summary optional ----\n` +
    bodyScript + `\n` +
    `  var hasPrior0=(typeof prior0==='function'), hasSummary=(typeof summary==='function');\n` +
    `  function fmt(n){ return (n<0?'\\u2212':'')+Math.abs(n).toFixed(3); }\n` +
    `  // ---- state ----\n` +
    `  var prior=new Array(NB), data=[];   // prior holds RAW non-negative heights; normalized only for display/posterior\n` +
    `  function initPrior(){ for(var i=0;i<NB;i++){ prior[i]=hasPrior0?Math.max(0,prior0(thetaAt(i))):1; } }\n` +
    `  function normalize(a){ var s=0; for(var i=0;i<NB;i++) s+=a[i]; if(s<=0){ for(var j=0;j<NB;j++) a[j]=1/NB; return; } for(var k=0;k<NB;k++) a[k]/=s; }\n` +
    `  function priorNorm(){ var a=prior.slice(); normalize(a); return a; }\n` +
    `  function posterior(){ var p=new Array(NB); for(var i=0;i<NB;i++){ var v=prior[i]; for(var d=0;d<data.length;d++){ v*=Math.max(0,like(data[d],thetaAt(i))); } p[i]=v; } normalize(p); return p; }\n` +
    `  function counts(){ var c={}; ACTS.forEach(function(a){c[a.key]=0;}); data.forEach(function(k){ if(c[k]!=null)c[k]++; }); return c; }\n` +
    `  function colorOf(key){ for(var i=0;i<ACTS.length;i++) if(ACTS[i].key===key) return ACTS[i].color||'var(--cyan)'; return 'var(--cyan)'; }\n` +
    `  function render(){\n` +
    `    while(G.firstChild)G.removeChild(G.firstChild);\n` +
    `    var post=posterior(), pn=priorNorm();\n` +
    `    var pk=0; for(var i=0;i<NB;i++){ if(post[i]>pk)pk=post[i]; if(pn[i]>pk)pk=pn[i]; } if(pk<=0)pk=1;\n` +
    `    var bw=(bx1-bx0)/NB;\n` +
    `    // posterior bars\n` +
    `    for(var i=0;i<NB;i++){ var h=post[i]/pk*(by0-by1); G.appendChild(SVG('rect',{x:(bx0+i*bw+1).toFixed(2),y:(by0-h).toFixed(2),width:(bw-2).toFixed(2),height:h.toFixed(2),fill:'var(--cyan)','fill-opacity':0.55,stroke:'var(--cyan)','stroke-width':1})); }\n` +
    `    // prior outline (faint dashed)\n` +
    `    var d='M'; for(var i=0;i<NB;i++){ d+=(i?'L':'')+CX(i).toFixed(1)+' '+(by0-pn[i]/pk*(by0-by1)).toFixed(1)+' '; }\n` +
    `    G.appendChild(SVG('path',{d:d,fill:'none',stroke:'var(--mute)','stroke-width':1.5,'stroke-dasharray':'4 3',opacity:0.8}));\n` +
    `    // axis\n` +
    `    G.appendChild(SVG('line',{x1:bx0,y1:by0,x2:bx1,y2:by0,stroke:'var(--ink)','stroke-width':1.2}));\n` +
    `    function xt(v){ var px=bx0+(v-X0)/(X1-X0)*(bx1-bx0); G.appendChild(SVG('line',{x1:px,y1:by0,x2:px,y2:by0+4,stroke:'var(--mute)','stroke-width':1})); var t=SVG('text',{x:px,y:by0+16,'font-size':10,fill:'var(--mute)','text-anchor':'middle'}); t.textContent=(''+v); G.appendChild(t); }\n` +
    `    xt(X0); xt((X0+X1)/2); xt(X1);\n` +
    `    var xl=SVG('text',{x:(bx0+bx1)/2,y:Hh-6,'font-size':12,fill:'var(--ink)','text-anchor':'middle'}); xl.textContent=PLAB; G.appendChild(xl);\n` +
    `    // posterior mean + MAP\n` +
    `    var mean=0, mapi=0, mn=post[0]; for(var i=0;i<NB;i++){ mean+=thetaAt(i)*post[i]; if(post[i]>post[mapi])mapi=i; if(post[i]<mn)mn=post[i]; }\n` +
    `    var mapStr=(post[mapi]-mn<1e-9)?'\\u2014 (flat)':fmt(thetaAt(mapi));\n` +
    `    var mpx=bx0+(mean-X0)/(X1-X0)*(bx1-bx0);\n` +
    `    G.appendChild(SVG('line',{x1:mpx,y1:by1,x2:mpx,y2:by0,stroke:'var(--yellow)','stroke-width':2}));\n` +
    `    var ml=SVG('text',{x:mpx,y:by1+10,'font-size':11,fill:'var(--yellow)','text-anchor':'middle'}); ml.textContent='mean'; G.appendChild(ml);\n` +
    `    // legend: prior vs posterior\n` +
    `    G.appendChild(SVG('line',{x1:bx1-150,y1:by1+6,x2:bx1-130,y2:by1+6,stroke:'var(--mute)','stroke-width':1.5,'stroke-dasharray':'4 3'}));\n` +
    `    var pl=SVG('text',{x:bx1-126,y:by1+10,'font-size':11,fill:'var(--mute)'}); pl.textContent='prior'; G.appendChild(pl);\n` +
    `    G.appendChild(SVG('rect',{x:bx1-86,y:by1+1,width:11,height:9,fill:'var(--cyan)','fill-opacity':0.55,stroke:'var(--cyan)','stroke-width':1}));\n` +
    `    var ql=SVG('text',{x:bx1-72,y:by1+10,'font-size':11,fill:'var(--cyan)'}); ql.textContent='posterior'; G.appendChild(ql);\n` +
    `    // readout\n` +
    `    var cnt=counts(), tally=ACTS.map(function(a){ return '<span style=\\"color:'+colorOf(a.key)+'\\">'+a.key+'='+cnt[a.key]+'</span>'; }).join(', ');\n` +
    `    var base=PLAB+' posterior: mean = <b style=\\"color:var(--yellow)\\">'+fmt(mean)+'</b> &nbsp;\\u00b7&nbsp; MAP '+(mapStr.charAt(0)==='\\u2014'?'= '+mapStr:'\\u2248 '+mapStr)+' &nbsp;\\u00b7&nbsp; '+data.length+' observation'+(data.length===1?'':'s')+' ('+tally+')';\n` +
    `    var extra=''; if(hasSummary){ var s=summary({mean:mean, map:thetaAt(mapi), n:data.length, counts:cnt}); if(s) extra=' &nbsp;\\u00b7&nbsp; '+s; }\n` +
    `    out.innerHTML=base+extra;\n` +
    `  }\n` +
    `  // ---- draw the prior: a stroke starts fresh and paints the shape bar-by-bar ----\n` +
    `  function toData(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; const p=q.matrixTransform(svg.getScreenCTM().inverse()); return p; }\n` +
    `  var drag=false, lastI=-1;\n` +
    `  function paint(ev){ var p=toData(ev); var i=Math.floor((p.x-bx0)/((bx1-bx0)/NB)); if(i<0)i=0; if(i>=NB)i=NB-1;\n` +
    `    var h=Math.max(1e-5,Math.min(1,(by0-p.y)/(by0-by1)));\n` +
    `    if(lastI>=0){ var a=Math.min(i,lastI), b=Math.max(i,lastI); for(var k=a;k<=b;k++) prior[k]=h; } else { prior[i]=h; }\n` +
    `    lastI=i; render(); }\n` +
    `  svg.addEventListener('pointerdown',function(ev){ var p=toData(ev); if(p.x>=bx0&&p.x<=bx1&&p.y>=by1-6&&p.y<=by0+6){ drag=true; lastI=-1; ev.preventDefault(); try{svg.setPointerCapture(ev.pointerId);}catch(e){} for(var k=0;k<NB;k++) prior[k]=1e-5; paint(ev); } });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!drag)return; paint(ev); });\n` +
    `  window.addEventListener('pointerup',function(){ drag=false; lastI=-1; });\n` +
    `  // ---- data buttons ----\n` +
    `  ACTS.forEach(function(a){ var b=$('#${widgetId}-act-'+a.key); if(b) b.addEventListener('click',function(){ data.push(a.key); render(); }); });\n` +
    `  var rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ data=[]; render(); });\n` +
    `  var rp=$('#${widgetId}-resetprior'); if(rp) rp.addEventListener('click',function(){ initPrior(); data=[]; render(); });\n` +
    `  initPrior(); render();\n` +
    `})();\n` +
    `</script>`
  );
}
