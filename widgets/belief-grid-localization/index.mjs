// belief-grid-localization widget — bespoke registry renderer for the "edit-grid"
// gesture: the POMDP belief state and the Bayes update, shown as grid localization
// (a histogram filter / Markov localization).
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// A robot sits at a HIDDEN true cell. The reader sees only the belief b(s) =
// P(true state = s), painted as a heatmap. Pressing a direction runs one belief
// update:
//   PREDICT  b'(s') = sum_s P(s'|s,a) b(s)         (motion spreads the belief)
//   CORRECT  b''(s) ∝ P(o|s) b'(s),  renormalise   (a sensor reading sharpens it)
// with a 4-neighbour wall sensor whose bits flip with probability sensorNoise.
// Clicking a cell toggles a wall (re-deriving the model, resetting to uniform).
// This is the canonical multi-state belief example behind the 2-state Tiger POMDP.
//
// Pure DOM/SVG; jsdom-safe: the first render is deterministic (uniform belief) and
// all randomness (motion slip, sensor flips) fires only inside the button handlers.

const CELL = 56, PAD = 8;

function dims(params) {
  const layout = Array.isArray(params.layout) && params.layout.length
    ? params.layout : ['.....', '.##..', '.....', '..#.#', '.....'];
  const rows = layout.length, cols = layout[0].length;
  for (const row of layout) {
    if (row.length !== cols) {
      throw new Error(`belief-grid-localization: layout rows must all have equal length; got [${layout.map((r) => r.length).join(', ')}]`);
    }
  }
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
    `    <span>move &amp; sense:</span>\n` +
    `    <button id="${widgetId}-up" type="button">↑</button><button id="${widgetId}-dn" type="button">↓</button>\n` +
    `    <button id="${widgetId}-lf" type="button">←</button><button id="${widgetId}-rt" type="button">→</button>\n` +
    `    <button id="${widgetId}-sense" type="button">👁 sense only</button>\n` +
    `    <button id="${widgetId}-reset" type="button">↺ Reset belief</button>\n` +
    `  </div>\n` +
    `  <div class="row" style="flex-wrap:wrap">\n` +
    `    <label>move noise</label><button id="${widgetId}-mdn" type="button">−</button><button id="${widgetId}-mup" type="button">+</button>\n` +
    `    <label>sensor noise</label><button id="${widgetId}-sdn" type="button">−</button><button id="${widgetId}-sup" type="button">+</button>\n` +
    `  </div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:manipulation;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId } = params;
  const { layout, rows, cols } = dims(params);
  const mn0 = params.moveNoiseInit != null ? params.moveNoiseInit : 0.15;
  const sn0 = params.sensorNoiseInit != null ? params.sensorNoiseInit : 0.1;
  return (
`<script>
(function(){
  const svg=$('#${svgId}'), out=$('#${outputId}');
  const Grp=SVG('g'); svg.appendChild(Grp);
  const R=${rows}, C=${cols}, CELL=${CELL}, PAD=${PAD};
  const LAYOUT0=${JSON.stringify(layout)};
  var grid=LAYOUT0.map(function(row){ return row.split(''); });
  var moveNoise=${mn0}, sensorNoise=${sn0};
  const ACT={U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]};
  // DIRS index the 4 sensor bits N,E,S,W (wall/edge present = 1).
  const SENSE=[[-1,0],[0,1],[1,0],[0,-1]], SNAME=['N','E','S','W'];
  function key(r,c){ return r+','+c; }
  function wall(r,c){ return r<0||r>=R||c<0||c>=C||grid[r][c]==='#'; }
  function freeCells(){ var a=[]; for(var r=0;r<R;r++)for(var c=0;c<C;c++) if(!wall(r,c)) a.push([r,c]); return a; }
  // true 4-bit wall signature of a cell (what a perfect sensor would read).
  function sig(r,c){ return SENSE.map(function(d){ return wall(r+d[0],c+d[1])?1:0; }); }
  // P(observation o | cell s): each bit matches w.p. 1-sensorNoise, flips w.p. sensorNoise.
  function likelihood(o,r,c){ var s=sig(r,c), p=1; for(var i=0;i<4;i++) p*= (o[i]===s[i])?(1-sensorNoise):sensorNoise; return p; }
  // intended move target (stay if blocked).
  function target(r,c,a){ var d=ACT[a], nr=r+d[0], nc=c+d[1]; return wall(nr,nc)?[r,c]:[nr,nc]; }

  var belief={}, truePos=null, lastObs=null, lastAction=null;
  function uniform(){ var f=freeCells(), b={}, p=1/f.length; for(var i=0;i<f.length;i++) b[key(f[i][0],f[i][1])]=p; return b; }
  function pickTrue(){ var f=freeCells(); return f.length? f[(f.length/2)|0] : null; }
  function resetBelief(){ belief=uniform(); truePos=pickTrue(); lastObs=null; lastAction=null; }

  // PREDICT: b'(s') = sum_s P(s'|s,a) b(s); intended target w.p. 1-moveNoise, stay w.p. moveNoise.
  function predict(b,a){ var nb={}, f=freeCells(); for(var i=0;i<f.length;i++) nb[key(f[i][0],f[i][1])]=0;
    for(var j=0;j<f.length;j++){ var r=f[j][0],c=f[j][1],k=key(r,c),bs=b[k]||0; if(bs===0)continue;
      var t=target(r,c,a), tk=key(t[0],t[1]); nb[tk]+=(1-moveNoise)*bs; nb[k]+=moveNoise*bs; }
    return nb; }
  // CORRECT: b''(s) ∝ P(o|s) b'(s), renormalise.
  function correct(b,o){ var f=freeCells(), z=0, nb={}; for(var i=0;i<f.length;i++){ var r=f[i][0],c=f[i][1],k=key(r,c); var v=(b[k]||0)*likelihood(o,r,c); nb[k]=v; z+=v; }
    if(z>0){ for(var k2 in nb) nb[k2]/=z; } else { nb=uniform(); } return nb; }
  // sample a noisy observation at the true cell (randomness — inside handlers only).
  function observe(r,c){ var s=sig(r,c); return s.map(function(b){ return (Math.random()<sensorNoise)?(1-b):b; }); }
  // sample the true motion: intended w.p. 1-moveNoise else stay.
  function trueMove(a){ if(!truePos)return; if(Math.random()<1-moveNoise) truePos=target(truePos[0],truePos[1],a); }

  function act(a){ if(!truePos){ resetBelief(); render(); return; }
    trueMove(a); belief=predict(belief,a); lastObs=observe(truePos[0],truePos[1]); belief=correct(belief,lastObs); lastAction=a; render(); }
  function senseOnly(){ if(!truePos){ resetBelief(); render(); return; }
    lastObs=observe(truePos[0],truePos[1]); belief=correct(belief,lastObs); lastAction=null; render(); }

  function argmaxCell(){ var best=-1, bk=null; for(var k in belief){ if(belief[k]>best){ best=belief[k]; bk=k; } } return bk; }
  function entropy(){ var h=0; for(var k in belief){ var p=belief[k]; if(p>1e-12) h-=p*Math.log2(p); } return h; }

  function render(){
    while(Grp.firstChild)Grp.removeChild(Grp.firstChild);
    var mx=1e-6; for(var k in belief){ if(belief[k]>mx)mx=belief[k]; }
    var amk=argmaxCell();
    for(var r=0;r<R;r++)for(var c=0;c<C;c++){ var x=PAD+c*CELL, y=PAD+r*CELL;
      if(wall(r,c)){ Grp.appendChild(SVG('rect',{x:x,y:y,width:CELL,height:CELL,fill:'var(--mute)','fill-opacity':0.55,stroke:'var(--line)','stroke-width':1,'data-r':r,'data-c':c,style:'cursor:pointer'})); continue; }
      var k=key(r,c), b=belief[k]||0, op=Math.min(0.85, b/mx*0.85);
      Grp.appendChild(SVG('rect',{x:x,y:y,width:CELL,height:CELL,fill:'var(--cyan)','fill-opacity':op.toFixed(3),stroke:'var(--line)','stroke-width':1,'data-r':r,'data-c':c,style:'cursor:pointer'}));
      var bt=SVG('text',{x:x+CELL/2,y:y+CELL-7,'font-size':10,fill:'var(--ink)','text-anchor':'middle','pointer-events':'none'}); bt.textContent=(b>=0.005?b.toFixed(2):''); Grp.appendChild(bt);
      if(k===amk){ Grp.appendChild(SVG('rect',{x:x+2,y:y+2,width:CELL-4,height:CELL-4,fill:'none',stroke:'var(--yellow)','stroke-width':2,'pointer-events':'none'})); }
    }
    // true robot position (hidden from the belief, shown for the reader as ground truth)
    if(truePos){ var tx=PAD+truePos[1]*CELL+CELL/2, ty=PAD+truePos[0]*CELL+22;
      Grp.appendChild(SVG('circle',{cx:tx,cy:ty,r:8,fill:'var(--pink)',stroke:'var(--bg)','stroke-width':2,'pointer-events':'none'})); }
    // readout
    var obsTxt = lastObs ? SNAME.filter(function(_,i){return lastObs[i]===1;}).join(' ')||'(open on all sides)' : '—';
    var head='move noise <b>'+(moveNoise*100).toFixed(0)+'%</b> &nbsp;\\u00b7&nbsp; sensor noise <b>'+(sensorNoise*100).toFixed(0)+'%</b> &nbsp;\\u00b7&nbsp; ';
    if(lastObs==null){ out.innerHTML=head+'<span style=\\"color:var(--mute)\\">belief uniform over free cells. Press a direction to <b>move &amp; sense</b> (predict then Bayes-correct), or <b>sense only</b>. <span style=\\"color:var(--pink)\\">●</span> = hidden true cell, <span style=\\"color:var(--yellow)\\">▢</span> = most-likely cell. Click a cell to toggle a wall.</span>'; }
    else { var amOK = amk && truePos && amk===key(truePos[0],truePos[1]);
      out.innerHTML=head+'sensed walls <b>'+obsTxt+'</b> &nbsp;\\u00b7&nbsp; belief peak <b>'+(mx).toFixed(2)+'</b>, entropy <b>'+entropy().toFixed(2)+'</b> bits &nbsp;\\u00b7&nbsp; <span style=\\"color:'+(amOK?'var(--green)':'var(--mute)')+'\\">argmax '+(amOK?'= true cell ✓':'≠ true cell')+'</span>'; }
  }

  svg.addEventListener('click',function(ev){ var t=ev.target; if(t&&t.getAttribute&&t.getAttribute('data-r')!=null){
    var r=+t.getAttribute('data-r'), c=+t.getAttribute('data-c'); grid[r][c]=(grid[r][c]==='#')?'.':'#';
    resetBelief(); render(); } });
  $('#${widgetId}-up').addEventListener('click',function(){ act('U'); });
  $('#${widgetId}-dn').addEventListener('click',function(){ act('D'); });
  $('#${widgetId}-lf').addEventListener('click',function(){ act('L'); });
  $('#${widgetId}-rt').addEventListener('click',function(){ act('R'); });
  $('#${widgetId}-sense').addEventListener('click',senseOnly);
  $('#${widgetId}-reset').addEventListener('click',function(){ resetBelief(); render(); });
  $('#${widgetId}-mup').addEventListener('click',function(){ moveNoise=Math.min(0.6,Math.round((moveNoise+0.05)*100)/100); render(); });
  $('#${widgetId}-mdn').addEventListener('click',function(){ moveNoise=Math.max(0,Math.round((moveNoise-0.05)*100)/100); render(); });
  $('#${widgetId}-sup').addEventListener('click',function(){ sensorNoise=Math.min(0.45,Math.round((sensorNoise+0.05)*100)/100); render(); });
  $('#${widgetId}-sdn').addEventListener('click',function(){ sensorNoise=Math.max(0,Math.round((sensorNoise-0.05)*100)/100); render(); });
  resetBelief(); render();
})();
</script>`
  );
}
