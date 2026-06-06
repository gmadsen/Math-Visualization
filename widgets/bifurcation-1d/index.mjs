// bifurcation-1d widget — shared registry renderer for the "dial" gesture: the
// reader picks a one-parameter normal form x' = f(x; mu) and drags a vertical
// mu-line across the bifurcation diagram, watching the fixed points (roots of
// f) collide / exchange / split while a live phase line shows their stability.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the root-finding (sign-change bracketing + bisection), the
// stability test (sign of df/dx), the bifurcation diagram, the live phase line
// with flow arrows, the drag-the-mu-line gesture, the form dropdown, and the
// readout. The normal forms are param-driven (author JS expressions in x, mu).
//
// jsdom-safe: createSVGPoint/getScreenCTM run only inside the pointer handlers.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, selectId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 600 460';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 600;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 460;
  const svgTitle = params.svgTitle || title;
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  const cases = Array.isArray(params.cases) ? params.cases : [];
  const opts = cases
    .map((c, i) => `<option value="${i}">${c.label}</option>`)
    .join('');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${selectId}">normal form:</label>\n` +
    `    <select id="${selectId}">${opts}</select>\n` +
    `  </div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:ew-resize;max-width:${svgWidth}px"><title>${svgTitle}</title></svg>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const {
    widgetId, svgId, outputId, selectId,
    xmin = -2.2, xmax = 2.2, muVar = 'μ',
  } = params;
  const cases = Array.isArray(params.cases) ? params.cases : [];
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}'), sel=$('#${selectId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const XMIN=${xmin}, XMAX=${xmax}, MUVAR=${JSON.stringify(muVar)};\n` +
    `  const CASES=${JSON.stringify(cases)};\n` +
    `  CASES.forEach(function(c){ c.f=new Function('x','mu','return ('+c.expr+');');\n` +
    `    if(c.muInit==null) c.muInit=(c.mu0+c.mu1)/2; });\n` +
    `  // ---- panel geometry (viewBox 600x460) ----\n` +
    `  const L=64, Rt=584, dTop=34, dBot=278;   // bifurcation diagram box\n` +
    `  const phaseY=388, phaseTop=330;          // phase-line baseline + label band\n` +
    `  let ci=0, mu=CASES[0].muInit;\n` +
    `  function f(x){ return CASES[ci].f(x,mu); }\n` +
    `  function fp(x){ const h=1e-4; return (CASES[ci].f(x+h,mu)-CASES[ci].f(x-h,mu))/(2*h); }\n` +
    `  function MX(m){ const c=CASES[ci]; return L+(m-c.mu0)/(c.mu1-c.mu0)*(Rt-L); }\n` +
    `  function MXinv(px){ const c=CASES[ci]; return c.mu0+(px-L)/(Rt-L)*(c.mu1-c.mu0); }\n` +
    `  function MY(x){ return dBot-(x-XMIN)/(XMAX-XMIN)*(dBot-dTop); }\n` +
    `  function PX(x){ return L+(x-XMIN)/(XMAX-XMIN)*(Rt-L); }\n` +
    `  // ---- root finding for x'=g(x): roots of g over [XMIN,XMAX] ----\n` +
    `  function rootsOf(g){ const K=420, out=[]; let xp=XMIN, vp=g(xp);\n` +
    `    for(let i=1;i<=K;i++){ const xc=XMIN+(XMAX-XMIN)*i/K, vc=g(xc);\n` +
    `      if(vp===0){ out.push(xp); } else if(vp*vc<0){ let a=xp,b=xc,fa=vp;\n` +
    `        for(let j=0;j<60;j++){ const mdv=(a+b)/2, fm=g(mdv); if(fa*fm<=0){b=mdv;} else {a=mdv;fa=fm;} }\n` +
    `        out.push((a+b)/2); } xp=xc; vp=vc; }\n` +
    `    // dedup near-equal roots\n` +
    `    out.sort(function(a,b){return a-b;}); const r=[]; out.forEach(function(v){ if(!r.length||Math.abs(v-r[r.length-1])>1e-4) r.push(v); }); return r; }\n` +
    `  function fixedPts(m){ const g=function(x){return CASES[ci].f(x,m);};\n` +
    `    return rootsOf(g).map(function(x){ const h=1e-4, d=(CASES[ci].f(x+h,m)-CASES[ci].f(x-h,m))/(2*h);\n` +
    `      return {x:x, stable:d<0, d:d}; }); }\n` +
    `  function fmt(n){ return (n<0?'\\u2212':'')+Math.abs(n).toFixed(2); }\n` +
    `  function clearG(){ while(G.firstChild)G.removeChild(G.firstChild); }\n` +
    `  function render(){\n` +
    `    clearG(); const c=CASES[ci];\n` +
    `    // ===== top: bifurcation diagram =====\n` +
    `    // axes\n` +
    `    G.appendChild(SVG('line',{x1:L,y1:dBot,x2:Rt,y2:dBot,stroke:'var(--mute)','stroke-width':1,opacity:0.5}));\n` +
    `    G.appendChild(SVG('line',{x1:L,y1:dTop,x2:L,y2:dBot,stroke:'var(--mute)','stroke-width':1,opacity:0.5}));\n` +
    `    if(XMIN<0&&XMAX>0){ var y0=MY(0); G.appendChild(SVG('line',{x1:L,y1:y0,x2:Rt,y2:y0,stroke:'var(--mute)','stroke-width':1,'stroke-dasharray':'2 4',opacity:0.4})); }\n` +
    `    var ax=SVG('text',{x:Rt,y:dBot+16,'font-size':12,fill:'var(--mute)','text-anchor':'end'}); ax.textContent=MUVAR+' (parameter)'; G.appendChild(ax);\n` +
    `    var ay=SVG('text',{x:L-8,y:dTop+4,'font-size':12,fill:'var(--mute)','text-anchor':'end'}); ay.textContent='x*'; G.appendChild(ay);\n` +
    `    // branches: scan mu across the axis, plot each fixed point coloured by stability\n` +
    `    var COLS=260;\n` +
    `    for(var k=0;k<=COLS;k++){ var mm=c.mu0+(c.mu1-c.mu0)*k/COLS, px=MX(mm), pts=fixedPts(mm);\n` +
    `      for(var p=0;p<pts.length;p++){ if(pts[p].x<XMIN||pts[p].x>XMAX) continue;\n` +
    `        G.appendChild(SVG('circle',{cx:px,cy:MY(pts[p].x),r:1.3,fill:pts[p].stable?'var(--green)':'var(--pink)'})); } }\n` +
    `    // legend\n` +
    `    G.appendChild(SVG('circle',{cx:Rt-150,cy:dTop+6,r:4,fill:'var(--green)'}));\n` +
    `    var lg1=SVG('text',{x:Rt-142,y:dTop+10,'font-size':11,fill:'var(--mute)'}); lg1.textContent='stable'; G.appendChild(lg1);\n` +
    `    G.appendChild(SVG('circle',{cx:Rt-90,cy:dTop+6,r:4,fill:'var(--pink)'}));\n` +
    `    var lg2=SVG('text',{x:Rt-82,y:dTop+10,'font-size':11,fill:'var(--mute)'}); lg2.textContent='unstable'; G.appendChild(lg2);\n` +
    `    // draggable mu-line\n` +
    `    var mx=MX(mu);\n` +
    `    G.appendChild(SVG('line',{x1:mx,y1:dTop-4,x2:mx,y2:dBot+4,stroke:'var(--yellow)','stroke-width':2}));\n` +
    `    G.appendChild(SVG('circle',{cx:mx,cy:dTop-4,r:5,fill:'var(--yellow)',stroke:'var(--ink)','stroke-width':1.4}));\n` +
    `    var ml=SVG('text',{x:mx,y:dTop-12,'font-size':12,fill:'var(--yellow)','text-anchor':'middle'}); ml.textContent=MUVAR+'='+fmt(mu); G.appendChild(ml);\n` +
    `    // ===== bottom: phase line at current mu =====\n` +
    `    var pts=fixedPts(mu);\n` +
    `    var eqn=c.label.indexOf(':')>=0 ? c.label.slice(c.label.indexOf(':')+1).trim() : c.expr;\n` +
    `    var hd=SVG('text',{x:L,y:phaseTop,'font-size':12,fill:'var(--ink)'}); hd.textContent='phase line   '+eqn; G.appendChild(hd);\n` +
    `    G.appendChild(SVG('line',{x1:L,y1:phaseY,x2:Rt,y2:phaseY,stroke:'var(--ink)','stroke-width':1.5}));\n` +
    `    if(XMIN<0&&XMAX>0){ G.appendChild(SVG('line',{x1:PX(0),y1:phaseY-5,x2:PX(0),y2:phaseY+5,stroke:'var(--mute)','stroke-width':1})); var z=SVG('text',{x:PX(0),y:phaseY+18,'font-size':10,fill:'var(--mute)','text-anchor':'middle'}); z.textContent='0'; G.appendChild(z); }\n` +
    `    // flow arrows: sample sign of f between consecutive fixed points (and the outer regions)\n` +
    `    var bounds=[XMIN].concat(pts.map(function(p){return p.x;})).concat([XMAX]);\n` +
    `    for(var b=0;b<bounds.length-1;b++){ var lo=bounds[b], hi=bounds[b+1]; if(hi-lo<1e-3) continue;\n` +
    `      var xm=(lo+hi)/2, dir=f(xm)>0?1:-1, ax0=PX(xm)-dir*11, ax1=PX(xm)+dir*11;\n` +
    `      G.appendChild(SVG('line',{x1:ax0,y1:phaseY,x2:ax1,y2:phaseY,stroke:'var(--cyan)','stroke-width':2}));\n` +
    `      G.appendChild(SVG('line',{x1:ax1,y1:phaseY,x2:ax1-dir*5,y2:phaseY-4,stroke:'var(--cyan)','stroke-width':2}));\n` +
    `      G.appendChild(SVG('line',{x1:ax1,y1:phaseY,x2:ax1-dir*5,y2:phaseY+4,stroke:'var(--cyan)','stroke-width':2})); }\n` +
    `    // fixed-point dots\n` +
    `    pts.forEach(function(p){ var col=p.stable?'var(--green)':'var(--pink)';\n` +
    `      G.appendChild(SVG('circle',{cx:PX(p.x),cy:phaseY,r:6,fill:p.stable?col:'var(--panel)',stroke:col,'stroke-width':2.2})); });\n` +
    `    // ===== readout =====\n` +
    `    var desc;\n` +
    `    if(!pts.length){ desc='<b>no fixed points</b> — the flow sweeps straight through'; }\n` +
    `    else { desc=pts.map(function(p){ return 'x*='+fmt(p.x)+' <span style=\\"color:'+(p.stable?'var(--green)':'var(--pink)')+'\\">('+(p.stable?'stable':'unstable')+')</span>'; }).join(' &nbsp; '); }\n` +
    `    var crit='';\n` +
    `    if(c.muCrit!=null){ var span=(c.mu1-c.mu0); if(Math.abs(mu-c.muCrit)<0.02*span) crit=' &nbsp;\\u00b7&nbsp; <b style=\\"color:var(--yellow)\\">at the bifurcation ('+MUVAR+'='+fmt(c.muCrit)+')</b>'; }\n` +
    `    out.innerHTML=MUVAR+' = <b>'+fmt(mu)+'</b> &nbsp;\\u00b7&nbsp; '+pts.length+' fixed point'+(pts.length===1?'':'s')+': '+desc+crit;\n` +
    `  }\n` +
    `  // ---- drag the mu-line (the dial) ----\n` +
    `  function toData(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; const p=q.matrixTransform(svg.getScreenCTM().inverse()); return p; }\n` +
    `  function setMuFrom(px){ const c=CASES[ci]; mu=Math.max(c.mu0,Math.min(c.mu1,MXinv(px))); render(); }\n` +
    `  let drag=false;\n` +
    `  svg.addEventListener('pointerdown',function(ev){ const p=toData(ev); if(p.y<=dBot+10){ drag=true; ev.preventDefault(); try{svg.setPointerCapture(ev.pointerId);}catch(e){} setMuFrom(p.x); } });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!drag)return; setMuFrom(toData(ev).x); });\n` +
    `  window.addEventListener('pointerup',function(){ drag=false; });\n` +
    `  sel.addEventListener('change',function(){ ci=+sel.value; mu=CASES[ci].muInit; render(); });\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
