// q-learning-grid-world widget — bespoke registry renderer for the "edit-grid"
// gesture: MODEL-FREE reinforcement learning on a grid-world (tabular Q-learning).
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The companion grid-world-mdp widget KNOWS the transition model and solves the
// Bellman optimality equation by value iteration. This agent knows nothing: it
// LEARNS Q(s,a) from sampled experience, one episode at a time, with the
// off-policy TD update
//     Q(s,a) <- Q(s,a) + alpha[ r + gamma max_a' Q(s',a') - Q(s,a) ]
// under an epsilon-greedy behaviour policy. The reader CLICKS a cell to edit the
// world and runs experience with Step / Episode / x50; the widget paints the
// learned greedy value (max_a Q, cell shading), the greedy policy (argmax_a Q
// arrows), and the agent. The payoff is watching the policy emerge from trial and
// error and converge to the same pi* value iteration computes on the known model.
//
// Pure DOM/SVG; jsdom-safe: the first render is deterministic (Q starts at 0) and
// all randomness (epsilon-greedy, stochastic transitions) fires only inside the
// button handlers.

const CELL = 74, PAD = 8;

function dims(params) {
  const layout = Array.isArray(params.layout) ? params.layout : ['S..G', '.#.P', '....'];
  const rows = layout.length, cols = layout[0].length;
  const W = cols * CELL + 2 * PAD, H = rows * CELL + 2 * PAD;
  return { layout, rows, cols, W, H };
}

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const { W, H } = dims(params);
  const viewBox = params.viewBox || `0 0 ${W} ${H}`;
  const svgWidth = params.svgWidth != null ? params.svgWidth : W;
  const svgHeight = params.svgHeight != null ? params.svgHeight : H;
  const svgTitle = params.svgTitle || title;
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <div class="row" style="flex-wrap:wrap">\n` +
    `    <button id="${widgetId}-step" type="button">▷ Step</button>\n` +
    `    <button id="${widgetId}-ep" type="button">▷▷ Episode</button>\n` +
    `    <button id="${widgetId}-run" type="button">⏩ ×50</button>\n` +
    `    <button id="${widgetId}-clearq" type="button">↺ Forget (reset Q)</button>\n` +
    `  </div>\n` +
    `  <div class="row" style="flex-wrap:wrap">\n` +
    `    <label>ε</label><button id="${widgetId}-edn" type="button">−</button><button id="${widgetId}-eup" type="button">+</button>\n` +
    `    <label>α</label><button id="${widgetId}-adn" type="button">−</button><button id="${widgetId}-aup" type="button">+</button>\n` +
    `    <label>γ</label><button id="${widgetId}-gdn" type="button">−</button><button id="${widgetId}-gup" type="button">+</button>\n` +
    `  </div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:manipulation;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId } = params;
  const { layout, rows, cols } = dims(params);
  const goalR = params.goalReward != null ? params.goalReward : 1;
  const pitR = params.pitReward != null ? params.pitReward : -1;
  const stepR = params.stepReward != null ? params.stepReward : -0.04;
  const g0 = params.gammaInit != null ? params.gammaInit : 0.95;
  const eps0 = params.epsilonInit != null ? params.epsilonInit : 0.2;
  const alp0 = params.alphaInit != null ? params.alphaInit : 0.5;
  const n0 = params.noiseInit != null ? params.noiseInit : 0.2;
  return (
`<script>
(function(){
  const svg=$('#${svgId}'), out=$('#${outputId}');
  const G=SVG('g'); svg.appendChild(G);
  const R=${rows}, C=${cols}, CELL=${CELL}, PAD=${PAD};
  const GOAL=${goalR}, PIT=${pitR}, STEP=${stepR};
  const LAYOUT0=${JSON.stringify(layout)};
  var grid=LAYOUT0.map(function(row){ return row.split(''); });
  var gamma=${g0}, eps=${eps0}, alpha=${alp0}, noise=${n0};
  const DIRS=['U','D','L','R'], ACT={U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]}, PERP={U:['L','R'],D:['L','R'],L:['U','D'],R:['U','D']}, ARR={U:'\\u2191',D:'\\u2193',L:'\\u2190',R:'\\u2192'};
  function key(r,c){ return r+','+c; }
  function term(r,c){ var t=grid[r][c]; return t==='G'?GOAL:(t==='P'?PIT:null); }
  function blocked(r,c){ return r<0||r>=R||c<0||c>=C||grid[r][c]==='#'; }
  // Q: stateKey -> [qU,qD,qL,qR]; episodes/steps/lastReturn track learning.
  var Q={}, episodes=0, stepsThisEp=0, lastReturn=null, agent=null;
  function qrow(r,c){ var k=key(r,c); if(!Q[k])Q[k]=[0,0,0,0]; return Q[k]; }
  function startCell(){
    for(var r=0;r<R;r++)for(var c=0;c<C;c++) if(grid[r][c]==='S') return [r,c];
    for(var r2=R-1;r2>=0;r2--)for(var c2=0;c2<C;c2++) if(grid[r2][c2]!=='#'&&term(r2,c2)==null) return [r2,c2];
    return [0,0];
  }
  function resetQ(){ Q={}; episodes=0; stepsThisEp=0; lastReturn=null; agent=startCell(); }
  // greedy action index at (r,c), deterministic tie-break (first max) for a stable
  // first paint; called with q=qrow(r,c).
  function argmax(q){ var bi=0; for(var i=1;i<4;i++) if(q[i]>q[bi]) bi=i; return bi; }
  function maxq(q){ var m=q[0]; for(var i=1;i<4;i++) if(q[i]>m) m=q[i]; return m; }
  // stochastic transition: intended dir w.p. 1-noise, each perpendicular w.p.
  // noise/2; a wall/edge bounces (stay). Randomness only on user-driven steps.
  function move(r,c,dir){
    var u=Math.random(), d=dir, p=PERP[dir];
    if(u<noise/2) d=p[0]; else if(u<noise) d=p[1];
    var a=ACT[d], nr=r+a[0], nc=c+a[1];
    if(blocked(nr,nc)) return [r,c];
    return [nr,nc];
  }
  // one Q-learning step from the agent's cell; returns reward, advances/episode-ends.
  function stepOnce(){
    if(agent==null) agent=startCell();
    var r=agent[0], c=agent[1];
    if(term(r,c)!=null){ agent=startCell(); stepsThisEp=0; return 0; }
    var q=qrow(r,c);
    var ai = (Math.random()<eps) ? Math.floor(Math.random()*4) : argmax(q);
    var nx=move(r,c,DIRS[ai]), nr=nx[0], nc=nx[1];
    var tr=term(nr,nc), r_=(tr!=null)?tr:STEP;
    var target = (tr!=null) ? r_ : (r_ + gamma*maxq(qrow(nr,nc)));
    q[ai] += alpha*(target - q[ai]);
    stepsThisEp++;
    if(tr!=null){ episodes++; lastReturn=r_; agent=startCell(); stepsThisEp=0; }
    else agent=[nr,nc];
    return r_;
  }
  function runEpisode(maxSteps){
    if(agent==null||term(agent[0],agent[1])!=null){ agent=startCell(); stepsThisEp=0; }
    var startEp=episodes, ret=0, gpow=1;
    for(var i=0;i<maxSteps;i++){ ret += gpow*stepOnce(); gpow*=gamma; if(episodes>startEp) break; }
    if(episodes>startEp) lastReturn=ret;
  }
  function greedyV(r,c){ return maxq(qrow(r,c)); }
  function render(){
    while(G.firstChild)G.removeChild(G.firstChild);
    if(agent==null) agent=startCell();
    var mx=0.001;
    for(var r=0;r<R;r++)for(var c=0;c<C;c++){ if(grid[r][c]==='#'||term(r,c)!=null)continue; var v=Math.abs(greedyV(r,c)); if(v>mx)mx=v; }
    for(var r=0;r<R;r++)for(var c=0;c<C;c++){
      var x=PAD+c*CELL, y=PAD+r*CELL, t=grid[r][c], cx=x+CELL/2, cy=y+CELL/2;
      if(t==='#'){ G.appendChild(SVG('rect',{x:x,y:y,width:CELL,height:CELL,fill:'var(--mute)','fill-opacity':0.5,stroke:'var(--line)','stroke-width':1,'data-r':r,'data-c':c,style:'cursor:pointer'})); continue; }
      if(t==='G'||t==='P'){
        G.appendChild(SVG('rect',{x:x,y:y,width:CELL,height:CELL,fill:(t==='G'?'var(--green)':'var(--pink)'),'fill-opacity':0.3,stroke:'var(--line)','stroke-width':1,'data-r':r,'data-c':c,style:'cursor:pointer'}));
        var rt=SVG('text',{x:cx,y:cy+6,'font-size':18,'font-weight':700,fill:(t==='G'?'var(--green)':'var(--pink)'),'text-anchor':'middle','pointer-events':'none'}); rt.textContent=(t==='G'?'+':'')+(t==='G'?GOAL:PIT); G.appendChild(rt);
        var lt=SVG('text',{x:cx,y:y+15,'font-size':9,fill:'var(--mute)','text-anchor':'middle','pointer-events':'none'}); lt.textContent=(t==='G'?'goal':'pit'); G.appendChild(lt);
        continue;
      }
      var v=greedyV(r,c), shade=v>=0?'var(--green)':'var(--pink)', op=Math.min(0.42,Math.abs(v)/mx*0.42);
      G.appendChild(SVG('rect',{x:x,y:y,width:CELL,height:CELL,fill:shade,'fill-opacity':op.toFixed(3),stroke:'var(--line)','stroke-width':1,'data-r':r,'data-c':c,style:'cursor:pointer'}));
      var q=qrow(r,c), explored=(q[0]||q[1]||q[2]||q[3]);
      var pa=SVG('text',{x:cx,y:cy+2,'font-size':26,fill:explored?'var(--ink)':'var(--mute)','text-anchor':'middle','pointer-events':'none'}); pa.textContent=ARR[DIRS[argmax(q)]]; G.appendChild(pa);
      var vt=SVG('text',{x:cx,y:y+CELL-7,'font-size':11,fill:'var(--ink)','text-anchor':'middle','pointer-events':'none'}); vt.textContent=v.toFixed(2); G.appendChild(vt);
      if(t==='S'){ var st=SVG('text',{x:x+4,y:y+13,'font-size':9,'font-weight':700,fill:'var(--cyan)','text-anchor':'start','pointer-events':'none'}); st.textContent='start'; G.appendChild(st); }
    }
    // agent marker
    if(agent){ var ax=PAD+agent[1]*CELL+CELL/2, ay=PAD+agent[0]*CELL+CELL/2;
      G.appendChild(SVG('circle',{cx:ax,cy:ay,r:9,fill:'var(--cyan)',stroke:'var(--bg)','stroke-width':2,'pointer-events':'none'})); }
    var head='episodes <b>'+episodes+'</b> &nbsp;\\u00b7&nbsp; ε=<b>'+eps.toFixed(2)+'</b> α=<b>'+alpha.toFixed(2)+'</b> γ=<b>'+gamma.toFixed(2)+'</b> &nbsp;\\u00b7&nbsp; ';
    if(episodes===0){ out.innerHTML=head+'<span style=\\"color:var(--mute)\\">Q ≡ 0 — no experience yet. <b>Step</b> takes one ε-greedy action, <b>Episode</b> runs to a terminal, <b>×50</b> runs 50 episodes. Click a cell to edit the world.</span>'; }
    else { var lr=(lastReturn==null)?'—':lastReturn.toFixed(2);
      out.innerHTML=head+'last return <b>'+lr+'</b> &nbsp;\\u00b7&nbsp; <span style=\\"color:var(--mute)\\">arrows = greedy argmax Q (grey = unvisited), shade = max Q. With enough episodes the greedy policy matches the value-iteration π* on the known MDP.</span>'; }
  }
  // click a cell: cycle type; setting a new start clears the old one.
  svg.addEventListener('click',function(ev){ var t=ev.target; if(t&&t.getAttribute&&t.getAttribute('data-r')!=null){
    var r=+t.getAttribute('data-r'), c=+t.getAttribute('data-c'); var cyc={'.':'S','S':'G','G':'P','P':'#','#':'.'}; var nxt=cyc[grid[r][c]];
    if(nxt==='S'){ for(var rr=0;rr<R;rr++)for(var cc=0;cc<C;cc++) if(grid[rr][cc]==='S') grid[rr][cc]='.'; }
    grid[r][c]=nxt; resetQ(); render(); } });
  $('#${widgetId}-step').addEventListener('click',function(){ stepOnce(); render(); });
  $('#${widgetId}-ep').addEventListener('click',function(){ runEpisode(400); render(); });
  $('#${widgetId}-run').addEventListener('click',function(){ for(var i=0;i<50;i++) runEpisode(400); render(); });
  $('#${widgetId}-clearq').addEventListener('click',function(){ resetQ(); render(); });
  $('#${widgetId}-eup').addEventListener('click',function(){ eps=Math.min(1,Math.round((eps+0.05)*100)/100); render(); });
  $('#${widgetId}-edn').addEventListener('click',function(){ eps=Math.max(0,Math.round((eps-0.05)*100)/100); render(); });
  $('#${widgetId}-aup').addEventListener('click',function(){ alpha=Math.min(1,Math.round((alpha+0.05)*100)/100); render(); });
  $('#${widgetId}-adn').addEventListener('click',function(){ alpha=Math.max(0.05,Math.round((alpha-0.05)*100)/100); render(); });
  $('#${widgetId}-gup').addEventListener('click',function(){ gamma=Math.min(1,Math.round((gamma+0.05)*100)/100); render(); });
  $('#${widgetId}-gdn').addEventListener('click',function(){ gamma=Math.max(0,Math.round((gamma-0.05)*100)/100); render(); });
  resetQ(); render();
})();
</script>`
  );
}
