// best-response-explorer-2d widget — bespoke registry renderer for the "drag"
// gesture: mixed strategies and Nash equilibrium in a 2x2 game, drawn as the
// best-response correspondence in the unit square.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// x = p = P(Row plays its first action), y = q = P(Column plays its first action).
// Row's best-response curve is the p maximising Row's expected payoff at each q;
// Column's is the q maximising Column's payoff at each p. The Nash equilibria are
// exactly where the two curves cross. The reader DRAGS the joint strategy (p, q)
// and reads off payoffs, each best response, the better-response arrow, and Nash
// status. A preset button cycles classic games to show the different topologies.
//
// Pure DOM/SVG; jsdom-safe and fully deterministic (no randomness). Pointer→data
// mapping uses getBoundingClientRect inside the drag handlers, never at init.

const DEFAULT_PRESETS = [
  { name: 'Battle of the Sexes', rowLabels: ['Bach', 'Strav'], colLabels: ['Bach', 'Strav'],
    A: [[2, 0], [0, 1]], B: [[1, 0], [0, 2]] },
  { name: 'Matching Pennies', rowLabels: ['Heads', 'Tails'], colLabels: ['Heads', 'Tails'],
    A: [[1, -1], [-1, 1]], B: [[-1, 1], [1, -1]] },
  { name: "Prisoner's Dilemma", rowLabels: ['Coop', 'Defect'], colLabels: ['Coop', 'Defect'],
    A: [[3, 0], [5, 1]], B: [[3, 5], [0, 1]] },
  { name: 'Chicken', rowLabels: ['Swerve', 'Straight'], colLabels: ['Swerve', 'Straight'],
    A: [[0, -1], [1, -10]], B: [[0, 1], [-1, -10]] },
];

function presetsOf(params) {
  return Array.isArray(params.presets) && params.presets.length ? params.presets : DEFAULT_PRESETS;
}

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 460 384';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 460;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 384;
  const svgTitle = params.svgTitle || title;
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <div class="row" style="flex-wrap:wrap">\n` +
    `    <button id="${widgetId}-game" type="button">⇄ next game</button>\n` +
    `    <button id="${widgetId}-snap" type="button">snap to a Nash</button>\n` +
    `  </div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId } = params;
  const presets = presetsOf(params);
  const g0 = params.initialGame != null ? params.initialGame : 0;
  return (
`<script>
(function(){
  const svg=$('#${svgId}'), out=$('#${outputId}');
  const Grp=SVG('g'); svg.appendChild(Grp);
  const GAMES=${JSON.stringify(presets)};
  const PX0=72, PX1=412, PY0=30, PY1=310, WD=PX1-PX0, HT=PY1-PY0;
  var gi=${g0}%GAMES.length, p=0.5, q=0.5, dragging=false;
  function game(){ return GAMES[gi]; }
  function rowLabels(){ return game().rowLabels||['T','B']; }
  function colLabels(){ return game().colLabels||['L','R']; }
  function sx(P){ return PX0+P*WD; }
  function sy(Q){ return PY1-Q*HT; }
  // Row's expected payoffs for each pure action given Column's mix q = P(col action 0).
  function rowU(Q){ var A=game().A; return [ Q*A[0][0]+(1-Q)*A[0][1], Q*A[1][0]+(1-Q)*A[1][1] ]; }
  function colU(P){ var B=game().B; return [ P*B[0][0]+(1-P)*B[1][0], P*B[0][1]+(1-P)*B[1][1] ]; }
  function rowPayoff(P,Q){ var u=rowU(Q); return P*u[0]+(1-P)*u[1]; }
  function colPayoff(P,Q){ var v=colU(P); return Q*v[0]+(1-Q)*v[1]; }
  // Row best response to q: 0 -> action0 (p=1), 1 -> action1 (p=0), -1 -> indifferent (any p).
  function rowBR(Q){ var u=rowU(Q), d=u[0]-u[1]; return Math.abs(d)<1e-9?-1:(d>0?0:1); }
  function colBR(P){ var v=colU(P), d=v[0]-v[1]; return Math.abs(d)<1e-9?-1:(d>0?0:1); }
  // threshold q* where Row is indifferent (rowU[0]==rowU[1]); null if none in [0,1].
  function rowThreshold(){ var A=game().A; var slope=(A[0][0]-A[1][0])-(A[0][1]-A[1][1]); var inter=A[0][1]-A[1][1];
    if(Math.abs(slope)<1e-12) return null; var Q=-inter/slope; return (Q>1e-9&&Q<1-1e-9)?Q:null; }
  function colThreshold(){ var B=game().B; var slope=(B[0][0]-B[0][1])-(B[1][0]-B[1][1]); var inter=B[1][0]-B[1][1];
    if(Math.abs(slope)<1e-12) return null; var P=-inter/slope; return (P>1e-9&&P<1-1e-9)?P:null; }
  // all Nash equilibria as [p,q] pairs (pure corners that are mutual BR + interior mixed).
  function nashList(){ var res=[];
    for(var P=0;P<=1;P++)for(var Q=0;Q<=1;Q++){ var rb=rowBR(Q), cb=colBR(P);
      var rOK=(rb===-1)||(rb===0&&P===1)||(rb===1&&P===0);
      var cOK=(cb===-1)||(cb===0&&Q===1)||(cb===1&&Q===0);
      if(rOK&&cOK) res.push([P,Q]); }
    var qs=rowThreshold(), ps=colThreshold();
    if(qs!=null&&ps!=null) res.push([ps,qs]);
    return res; }

  function polyline(pts, color, dash){ var d=pts.map(function(pt,i){ return (i?'L':'M')+sx(pt[0]).toFixed(1)+' '+sy(pt[1]).toFixed(1); }).join(' ');
    var el=SVG('path',{d:d,fill:'none',stroke:color,'stroke-width':2.5}); if(dash) el.setAttribute('stroke-dasharray',dash); Grp.appendChild(el); }
  // Row BR curve in (p,q): a vertical/horizontal staircase. For q on one side of q*
  // Row plays action0 (p=1), on the other action1 (p=0); the jump is at q*.
  function rowBRCurve(){ var qs=rowThreshold();
    if(qs==null){ var br=rowBR(0.5); var P=(br===0)?1:(br===1)?0:0.5; polyline([[P,0],[P,1]],'var(--cyan)'); return; }
    var below=rowBR(qs/2), Pbelow=(below===0)?1:0, Pabove=(Pbelow===1)?0:1;
    polyline([[Pbelow,0],[Pbelow,qs],[Pabove,qs],[Pabove,1]],'var(--cyan)'); }
  // Column BR curve in (p,q): horizontal staircase, jump at p*.
  function colBRCurve(){ var ps=colThreshold();
    if(ps==null){ var br=colBR(0.5); var Q=(br===0)?1:(br===1)?0:0.5; polyline([[0,Q],[1,Q]],'var(--violet)'); return; }
    var left=colBR(ps/2), Qleft=(left===0)?1:0, Qright=(Qleft===1)?0:1;
    polyline([[0,Qleft],[ps,Qleft],[ps,Qright],[1,Qright]],'var(--violet)'); }

  function txt(x,y,s,opt){ var o=Object.assign({x:x,y:y,'font-size':11,fill:'var(--mute)','text-anchor':'middle','pointer-events':'none'},opt||{}); var t=SVG('text',o); t.textContent=s; Grp.appendChild(t); return t; }

  function render(){
    while(Grp.firstChild)Grp.removeChild(Grp.firstChild);
    // axes box + gridlines
    Grp.appendChild(SVG('rect',{x:PX0,y:PY0,width:WD,height:HT,fill:'var(--panel2)','fill-opacity':0.35,stroke:'var(--line)','stroke-width':1}));
    for(var t=0;t<=1;t+=0.5){ Grp.appendChild(SVG('line',{x1:sx(t),y1:PY0,x2:sx(t),y2:PY1,stroke:'var(--line)','stroke-width':0.6,'stroke-opacity':0.5}));
      Grp.appendChild(SVG('line',{x1:PX0,y1:sy(t),x2:PX1,y2:sy(t),stroke:'var(--line)','stroke-width':0.6,'stroke-opacity':0.5})); }
    txt((PX0+PX1)/2,PY1+34,'p = P(Row plays '+rowLabels()[0]+')');
    var yl=txt(0,0,'q = P(Col plays '+colLabels()[0]+')',{x:18,y:(PY0+PY1)/2,'text-anchor':'middle'}); yl.setAttribute('transform','rotate(-90 18 '+((PY0+PY1)/2)+')');
    txt(PX0,PY1+16,'0'); txt(PX1,PY1+16,'1'); txt(PX0-14,sy(0)+4,'0'); txt(PX0-14,sy(1)+4,'1');
    // best-response curves
    rowBRCurve(); colBRCurve();
    // Nash markers
    var nl=nashList();
    nl.forEach(function(n){ Grp.appendChild(SVG('circle',{cx:sx(n[0]),cy:sy(n[1]),r:7,fill:'none',stroke:'var(--yellow)','stroke-width':2.5,'pointer-events':'none'})); });
    // better-response arrow from the current point toward each player's BR
    var rb=rowBR(q), cb=colBR(p);
    var tp=(rb===-1)?p:(rb===0?1:0), tq=(cb===-1)?q:(cb===0?1:0);
    var ax=sx(p),ay=sy(q),bx=sx(tp),by=sy(tq);
    if(Math.abs(bx-ax)+Math.abs(by-ay)>4){ var ux=bx-ax,uy=by-ay,L=Math.hypot(ux,uy); ux/=L;uy/=L;
      var ex=ax+ux*Math.min(L,40), ey=ay+uy*Math.min(L,40);
      Grp.appendChild(SVG('line',{x1:ax,y1:ay,x2:ex,y2:ey,stroke:'var(--orange)','stroke-width':2,'pointer-events':'none'}));
      Grp.appendChild(SVG('path',{d:'M'+ex+' '+ey+'L'+(ex-6*ux+3*uy)+' '+(ey-6*uy-3*ux)+'L'+(ex-6*ux-3*uy)+' '+(ey-6*uy+3*ux)+'Z',fill:'var(--orange)','pointer-events':'none'})); }
    // draggable joint-strategy point
    Grp.appendChild(SVG('circle',{cx:ax,cy:ay,r:10,fill:'var(--pink)',stroke:'var(--bg)','stroke-width':2,style:'cursor:grab','data-pt':'1'}));
    // readout
    var rP=rowPayoff(p,q).toFixed(2), cP=colPayoff(p,q).toFixed(2);
    var rbName=(rb===-1)?'indifferent':rowLabels()[rb], cbName=(cb===-1)?'indifferent':colLabels()[cb];
    var atNash=nl.some(function(n){ return Math.abs(n[0]-p)<0.012&&Math.abs(n[1]-q)<0.012; });
    var head='<b>'+game().name+'</b> &nbsp;\\u00b7&nbsp; p=<b>'+p.toFixed(2)+'</b>, q=<b>'+q.toFixed(2)+'</b> &nbsp;\\u00b7&nbsp; payoffs Row <b>'+rP+'</b> / Col <b>'+cP+'</b> &nbsp;\\u00b7&nbsp; ';
    if(atNash){ out.innerHTML=head+'<b style=\\"color:var(--green)\\">Nash equilibrium ✓</b> <span style=\\"color:var(--mute)\\">— mutual best response (the curves cross here).</span>'; }
    else { out.innerHTML=head+'Row\\u2019s best response: <b style=\\"color:var(--cyan)\\">'+rbName+'</b>, Col\\u2019s: <b style=\\"color:var(--violet)\\">'+cbName+'</b> <span style=\\"color:var(--mute)\\">— follow the <span style=\\"color:var(--orange)\\">arrow</span> toward a better response; Nash = where the cyan and violet curves cross (◯).</span>'; }
  }

  // pointer -> (p,q), mapping via getBoundingClientRect (only inside handlers).
  function toData(ev){ var r=svg.getBoundingClientRect(); var vb=(svg.getAttribute('viewBox')||'0 0 460 384').split(/\\s+/).map(Number);
    var X=vb[0]+(ev.clientX-r.left)/r.width*vb[2], Y=vb[1]+(ev.clientY-r.top)/r.height*vb[3];
    var P=(X-PX0)/WD, Q=(PY1-Y)/HT; return [Math.max(0,Math.min(1,P)), Math.max(0,Math.min(1,Q))]; }
  function onMove(ev){ if(!dragging)return; var d=toData(ev); p=d[0]; q=d[1]; render(); ev.preventDefault(); }
  svg.addEventListener('pointerdown',function(ev){ dragging=true; var d=toData(ev); p=d[0]; q=d[1]; render(); if(svg.setPointerCapture&&ev.pointerId!=null){ try{ svg.setPointerCapture(ev.pointerId); }catch(e){} } ev.preventDefault(); });
  svg.addEventListener('pointermove',onMove);
  window.addEventListener('pointerup',function(){ dragging=false; });
  $('#${widgetId}-game').addEventListener('click',function(){ gi=(gi+1)%GAMES.length; p=0.5; q=0.5; render(); });
  $('#${widgetId}-snap').addEventListener('click',function(){ var nl=nashList(); if(nl.length){ p=nl[0][0]; q=nl[0][1]; render(); } });
  render();
})();
</script>`
  );
}
