// torus-orbit-explorer widget — bespoke registry renderer for the "click to seed"
// gesture: ergodic theory on the 2-torus.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The reader CLICKS a seed in the unit square [0,1)^2 (the torus) and watches its
// forward orbit under a measure-preserving map fill the torus — or not. A "next
// map" button cycles an irrational rotation (ergodic, not mixing), Arnold's cat
// map (mixing), and a rational rotation (periodic, non-ergodic); a "+ steps"
// button extends the orbit; the readout reports grid coverage so the reader sees
// the time-average distribution approach (or fail to approach) the uniform space
// average — Birkhoff's theorem made visible.
//
// Pure DOM/SVG; jsdom-safe and fully deterministic (no randomness). Pointer→torus
// mapping uses getBoundingClientRect inside the click handler only.

const PAD = 8;

function dims(params) {
  const viewBox = params.viewBox || '0 0 360 384';
  return { viewBox, svgWidth: params.svgWidth != null ? params.svgWidth : 360, svgHeight: params.svgHeight != null ? params.svgHeight : 384 };
}

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const { viewBox, svgWidth, svgHeight } = dims(params);
  const svgTitle = params.svgTitle || title;
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <div class="row" style="flex-wrap:wrap">\n` +
    `    <button id="${widgetId}-map" type="button">⇄ next map</button>\n` +
    `    <button id="${widgetId}-step" type="button">+ steps</button>\n` +
    `    <button id="${widgetId}-reset" type="button">↺ Reset</button>\n` +
    `  </div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:manipulation;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId } = params;
  const seedX = params.seedX != null ? params.seedX : 0.31;
  const seedY = params.seedY != null ? params.seedY : 0.27;
  const batch = params.stepBatch != null ? params.stepBatch : 250;
  const gridN = params.gridN != null ? params.gridN : 20;
  return (
`<script>
(function(){
  const svg=$('#${svgId}'), out=$('#${outputId}');
  const Grp=SVG('g'); svg.appendChild(Grp);
  const vb=(svg.getAttribute('viewBox')||'0 0 360 384').split(/\\s+/).map(Number);
  const PAD=${PAD}, SIDE=Math.min(vb[2],vb[3])-2*PAD, X0=PAD, Y0=PAD, BATCH=${batch}, GN=${gridN}, MAXPTS=6000;
  const SEED=[${seedX},${seedY}];
  // measure-preserving maps on the torus [0,1)^2. frac keeps everything in [0,1).
  function frac(t){ return t-Math.floor(t); }
  const MAPS=[
    { name:'irrational rotation', tag:'ergodic, not mixing', col:'var(--cyan)',
      f:function(x,y){ return [frac(x+0.6180339887), frac(y+0.4142135624)]; } },
    { name:"Arnold's cat map", tag:'mixing — scrambles whole regions', col:'var(--violet)',
      f:function(x,y){ return [frac(2*x+y), frac(x+y)]; } },
    { name:'rational rotation', tag:'periodic — not ergodic', col:'var(--orange)',
      f:function(x,y){ return [frac(x+0.2), frac(y+0.4)]; } },
  ];
  var mi=0, seed=SEED.slice(), orbit=[], n=200;
  function rebuild(){ orbit=[seed.slice()]; var p=seed.slice(); for(var i=0;i<n;i++){ p=MAPS[mi].f(p[0],p[1]); orbit.push(p); } }
  function sx(x){ return X0+x*SIDE; }
  function sy(y){ return Y0+(1-y)*SIDE; }
  function coverage(){ var cells={}, c=0; for(var i=0;i<orbit.length;i++){ var k=(Math.min(GN-1,(orbit[i][0]*GN)|0))+','+(Math.min(GN-1,(orbit[i][1]*GN)|0)); if(!cells[k]){ cells[k]=1; c++; } } return c; }
  function render(){
    while(Grp.firstChild)Grp.removeChild(Grp.firstChild);
    Grp.appendChild(SVG('rect',{x:X0,y:Y0,width:SIDE,height:SIDE,fill:'var(--panel2)','fill-opacity':0.35,stroke:'var(--line)','stroke-width':1,'data-torus':'1',style:'cursor:crosshair'}));
    for(var g=1;g<4;g++){ var t=g/4; Grp.appendChild(SVG('line',{x1:sx(t),y1:Y0,x2:sx(t),y2:Y0+SIDE,stroke:'var(--line)','stroke-width':0.5,'stroke-opacity':0.4,'pointer-events':'none'}));
      Grp.appendChild(SVG('line',{x1:X0,y1:sy(t),x2:X0+SIDE,y2:sy(t),stroke:'var(--line)','stroke-width':0.5,'stroke-opacity':0.4,'pointer-events':'none'})); }
    var col=MAPS[mi].col;
    for(var i=1;i<orbit.length;i++){ Grp.appendChild(SVG('circle',{cx:sx(orbit[i][0]),cy:sy(orbit[i][1]),r:1.7,fill:col,'fill-opacity':0.75,'pointer-events':'none'})); }
    // seed marker
    Grp.appendChild(SVG('circle',{cx:sx(seed[0]),cy:sy(seed[1]),r:5,fill:'var(--pink)',stroke:'var(--bg)','stroke-width':1.5,'pointer-events':'none'}));
    var cov=coverage(), tot=GN*GN, pct=(100*cov/tot).toFixed(0);
    var head='<b>'+MAPS[mi].name+'</b> <span style=\\"color:var(--mute)\\">('+MAPS[mi].tag+')</span> &nbsp;\\u00b7&nbsp; '+ (orbit.length-1) +' steps &nbsp;\\u00b7&nbsp; ';
    out.innerHTML=head+'support covers <b>'+cov+'</b> of '+tot+' grid cells (<b>'+pct+'%</b>) &nbsp;\\u00b7&nbsp; <span style=\\"color:var(--mute)\\">click to drop a new seed; <b>+ steps</b> extends the orbit. '+(mi===2?'A periodic orbit is a <b>finite</b> set, so its time average never reaches the uniform space average — not ergodic.':'For an ergodic map one orbit\\u2019s support fills the torus and its time average matches the space average (Birkhoff); full coverage is the geometric hint, not a proof.')+'</span>';
  }
  // pointer -> torus coords (only inside the click handler).
  function toTorus(ev){ var r=svg.getBoundingClientRect();
    var X=vb[0]+(ev.clientX-r.left)/r.width*vb[2], Y=vb[1]+(ev.clientY-r.top)/r.height*vb[3];
    var x=(X-X0)/SIDE, y=1-(Y-Y0)/SIDE; return [Math.max(0,Math.min(0.999,x)), Math.max(0,Math.min(0.999,y))]; }
  svg.addEventListener('click',function(ev){ var t=ev.target; if(t&&t.getAttribute&&t.getAttribute('data-torus')){ seed=toTorus(ev); rebuild(); render(); } });
  $('#${widgetId}-map').addEventListener('click',function(){ mi=(mi+1)%MAPS.length; n=200; rebuild(); render(); });
  // extend the orbit, capped at MAXPTS so repeated clicks can't bloat the DOM
  // (coverage saturates well before the cap, so nothing is lost pedagogically).
  $('#${widgetId}-step').addEventListener('click',function(){ var p=orbit[orbit.length-1].slice(); for(var i=0;i<BATCH&&orbit.length<MAXPTS;i++){ p=MAPS[mi].f(p[0],p[1]); orbit.push(p); } n=orbit.length-1; render(); });
  $('#${widgetId}-reset').addEventListener('click',function(){ seed=SEED.slice(); n=200; rebuild(); render(); });
  rebuild(); render();
})();
</script>`
  );
}
