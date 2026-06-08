// grid-world-mdp widget — bespoke registry renderer for the "edit-grid" gesture:
// a grid-world Markov decision process solved by value iteration.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// States are the cells of a grid (empty / goal / pit / wall). Actions are the four
// moves; transitions are stochastic (intended move w.p. 1-noise, slip to each
// perpendicular w.p. noise/2; walls and edges bounce back). The widget solves the
// Bellman optimality equation V*(s)=max_a{R+gamma sum P(s'|s,a)V*(s')} by value
// iteration and paints V* (cell shading + number) and the greedy policy pi* (an
// arrow per non-terminal cell). The reader CLICKS a cell to cycle its type and
// adjusts gamma / noise; everything re-solves live.
//
// Pure DOM/SVG; jsdom-safe (click-driven; no getScreenCTM/rAF).

const CELL = 74, PAD = 8;

function dims(params) {
  const layout = Array.isArray(params.layout) ? params.layout : ['...G', '.#.P', '....'];
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
    `    <label>γ</label><button id="${widgetId}-gdn" type="button">−</button><button id="${widgetId}-gup" type="button">+</button>\n` +
    `    <label>noise</label><button id="${widgetId}-ndn" type="button">−</button><button id="${widgetId}-nup" type="button">+</button>\n` +
    `    <button id="${widgetId}-reset" type="button">↺ Reset</button>\n` +
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
  const g0 = params.gammaInit != null ? params.gammaInit : 1;
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
  var gamma=${g0}, noise=${n0};
  const ACT={U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]}, PERP={U:['L','R'],D:['L','R'],L:['U','D'],R:['U','D']}, ARR={U:'\\u2191',D:'\\u2193',L:'\\u2190',R:'\\u2192'};
  function key(r,c){ return r+','+c; }
  function term(r,c){ var t=grid[r][c]; return t==='G'?GOAL:(t==='P'?PIT:null); }
  function nxt(r,c,dir){ var a=ACT[dir], nr=r+a[0], nc=c+a[1]; if(nr<0||nr>=R||nc<0||nc>=C||grid[nr][nc]==='#') return key(r,c); return key(nr,nc); }
  // ---- value iteration to convergence ----
  function solve(){
    var V={}; for(var r=0;r<R;r++)for(var c=0;c<C;c++){ if(grid[r][c]==='#')continue; var t=term(r,c); V[key(r,c)]=(t!=null)?t:0; }
    function Q(r,c,dir){ var p=PERP[dir]; return (1-noise)*V[nxt(r,c,dir)] + (noise/2)*V[nxt(r,c,p[0])] + (noise/2)*V[nxt(r,c,p[1])]; }
    var it=0, conv=false; for(; it<2000; it++){ var d=0, Vn={};
      for(var r=0;r<R;r++)for(var c=0;c<C;c++){ if(grid[r][c]==='#')continue; var k=key(r,c), t=term(r,c);
        if(t!=null){ Vn[k]=t; continue; }
        var best=-Infinity; for(var dir in ACT){ var q=STEP+gamma*Q(r,c,dir); if(q>best)best=q; } Vn[k]=best; if(Math.abs(Vn[k]-V[k])>d)d=Math.abs(Vn[k]-V[k]); }
      V=Vn; if(d<1e-7){ conv=true; it++; break; } }
    var pol={}; for(var r2=0;r2<R;r2++)for(var c2=0;c2<C;c2++){ if(grid[r2][c2]==='#'||term(r2,c2)!=null)continue;
      var best2=-Infinity, bd=null; for(var dir2 in ACT){ var q2=STEP+gamma*Q(r2,c2,dir2); if(q2>best2){best2=q2;bd=dir2;} } pol[key(r2,c2)]=bd; }
    return {V:V, pol:pol, it:it, conv:conv};
  }
  function render(){
    while(G.firstChild)G.removeChild(G.firstChild);
    var sol=solve(), V=sol.V, mx=0.001;
    for(var k in V){ if(Math.abs(V[k])>mx) mx=Math.abs(V[k]); }
    for(var r=0;r<R;r++)for(var c=0;c<C;c++){ var x=PAD+c*CELL, y=PAD+r*CELL, t=grid[r][c], k=key(r,c);
      if(t==='#'){ G.appendChild(SVG('rect',{x:x,y:y,width:CELL,height:CELL,fill:'var(--mute)','fill-opacity':0.5,stroke:'var(--line)','stroke-width':1,'data-r':r,'data-c':c,style:'cursor:pointer'})); continue; }
      var v=V[k], shade = v>=0 ? 'var(--green)' : 'var(--pink)', op = Math.min(0.42, Math.abs(v)/mx*0.42);
      G.appendChild(SVG('rect',{x:x,y:y,width:CELL,height:CELL,fill:shade,'fill-opacity':op.toFixed(3),stroke:'var(--line)','stroke-width':1,'data-r':r,'data-c':c,style:'cursor:pointer'}));
      var cx=x+CELL/2, cy=y+CELL/2;
      if(t==='G'||t==='P'){
        var rt=SVG('text',{x:cx,y:cy+6,'font-size':18,'font-weight':700,fill:(t==='G'?'var(--green)':'var(--pink)'),'text-anchor':'middle','pointer-events':'none'}); rt.textContent=(t==='G'?'+':'')+ (t==='G'?GOAL:PIT); G.appendChild(rt);
        var lt=SVG('text',{x:cx,y:y+15,'font-size':9,fill:'var(--mute)','text-anchor':'middle','pointer-events':'none'}); lt.textContent=(t==='G'?'goal':'pit'); G.appendChild(lt);
      } else {
        var pa=SVG('text',{x:cx,y:cy+2,'font-size':26,fill:'var(--ink)','text-anchor':'middle','pointer-events':'none'}); pa.textContent=ARR[sol.pol[k]]||''; G.appendChild(pa);
        var vt=SVG('text',{x:cx,y:y+CELL-7,'font-size':11,fill:'var(--ink)','text-anchor':'middle','pointer-events':'none'}); vt.textContent=v.toFixed(2); G.appendChild(vt);
      }
    }
    var head='discount γ = <b>'+gamma.toFixed(2)+'</b> &nbsp;\\u00b7&nbsp; action noise = <b>'+(noise*100).toFixed(0)+'%</b> (slip) &nbsp;\\u00b7&nbsp; ';
    if(sol.conv){ out.innerHTML = head+'value iteration converged in <b>'+sol.it+'</b> sweeps &nbsp;\\u00b7&nbsp; <span style=\\"color:var(--mute)\\">arrows = greedy policy π*, shade = V* &nbsp;\\u00b7&nbsp; click a cell: empty → goal → pit → wall</span>'; }
    else { out.innerHTML = head+'<b style=\\"color:var(--pink)\\">did not converge</b> in '+sol.it+' sweeps \\u2014 with no terminal to anchor the values and γ = 1 the undiscounted values keep drifting, so these are <em>not</em> V*/π*. Add a goal or pit, or lower γ below 1.'; }
  }
  svg.addEventListener('click',function(ev){ var t=ev.target; if(t&&t.getAttribute&&t.getAttribute('data-r')!=null){ var r=+t.getAttribute('data-r'), c=+t.getAttribute('data-c'); var cyc={'.':'G','G':'P','P':'#','#':'.'}; grid[r][c]=cyc[grid[r][c]]; render(); } });
  $('#${widgetId}-gup').addEventListener('click',function(){ gamma=Math.min(1,Math.round((gamma+0.05)*100)/100); render(); });
  $('#${widgetId}-gdn').addEventListener('click',function(){ gamma=Math.max(0,Math.round((gamma-0.05)*100)/100); render(); });
  $('#${widgetId}-nup').addEventListener('click',function(){ noise=Math.min(0.8,Math.round((noise+0.1)*100)/100); render(); });
  $('#${widgetId}-ndn').addEventListener('click',function(){ noise=Math.max(0,Math.round((noise-0.1)*100)/100); render(); });
  $('#${widgetId}-reset').addEventListener('click',function(){ grid=LAYOUT0.map(function(row){return row.split('');}); gamma=${g0}; noise=${n0}; render(); });
  render();
})();
</script>`
  );
}
