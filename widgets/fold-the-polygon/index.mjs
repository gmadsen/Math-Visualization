// fold-the-polygon widget — bespoke registry renderer for the "fold-glue"
// gesture: the classification of compact surfaces by polygon edge identifications.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// A 2n-gon is drawn with directed, labelled edges spelling a gluing WORD (each
// letter appears twice; sign = arrow direction). Gluing the polygon: union-find
// over the 2n corners gives the vertex classes V, with E = number of distinct
// letters and F = 1, so chi = V - E + F. Orientable iff every letter appears once
// forward and once backward; genus from chi. The reader CLICKS an edge to flip its
// arrow and watch the surface reclassify (flip one edge of the torus word and it
// becomes a Klein bottle); preset buttons load standard words. Corners are labelled
// by vertex class so the gluing is visible.
//
// Pure DOM/SVG; jsdom-safe (click-driven; no getScreenCTM/rAF).

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 420 360';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 420;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 360;
  const svgTitle = params.svgTitle || title;
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  const presets = Array.isArray(params.presets) ? params.presets : [];
  const presetBtns = presets
    .map((p, i) => `<button id="${widgetId}-p-${i}" type="button" class="small">${p.label}</button>`)
    .join('');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <div class="row" style="flex-wrap:wrap"><span class="small" style="color:var(--mute)">glue:</span>${presetBtns}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:manipulation;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId } = params;
  const presets = Array.isArray(params.presets) ? params.presets : [];
  const initial = params.initial != null ? params.initial : 0;
  return (
`<script>
(function(){
  const svg=$('#${svgId}'), out=$('#${outputId}');
  const G=SVG('g'); svg.appendChild(G);
  const PRESETS=${JSON.stringify(presets)};
  const LET=['var(--cyan)','var(--pink)','var(--green)','var(--violet)','var(--yellow)','var(--blue)'];
  const _vb=(svg.getAttribute('viewBox')||'0 0 420 360').split(/\\s+/).map(Number);
  const W=_vb[2], Hh=_vb[3], cx=W/2, cy=Hh/2+6, R=Math.min(W,Hh)*0.36;
  // word = array of {L, s} ; parse "a b a' b'"
  function parse(str){ return str.trim().split(/\\s+/).map(function(t){ return t.slice(-1)==="'"?{L:t.slice(0,-1),s:-1}:{L:t,s:1}; }); }
  var word = parse(PRESETS[${initial}].word);
  // ---- classify: union-find over the 2n corners ----
  function classify(w){
    var m=w.length, par=[]; for(var i=0;i<m;i++)par.push(i);
    function find(x){ while(par[x]!==x){ par[x]=par[par[x]]; x=par[x]; } return x; }
    function uni(a,b){ par[find(a)]=find(b); }
    var byL={}; w.forEach(function(e,k){ (byL[e.L]=byL[e.L]||[]).push({k:k,s:e.s}); });
    var orientable=true, bad=false;
    for(var L in byL){ var oc=byL[L]; if(oc.length!==2){ bad=true; continue; }
      function th(o){ return o.s>0?[o.k,(o.k+1)%m]:[(o.k+1)%m,o.k]; }
      var a=th(oc[0]), b=th(oc[1]); uni(a[0],b[0]); uni(a[1],b[1]);
      if(oc[0].s===oc[1].s) orientable=false;
    }
    var cls={}, vIdx={}, V=0;
    for(var i=0;i<m;i++){ var r=find(i); if(!(r in vIdx)){ vIdx[r]=V++; } cls[i]=vIdx[r]; }
    var E=Object.keys(byL).length, F=1, chi=V-E+F;
    var name, genus;
    if(bad){ name='(each letter must appear twice)'; genus=''; }
    else if(orientable){ var g=(2-chi)/2; genus='g = '+g; name=g===0?'sphere S\\u00b2':g===1?'torus T\\u00b2':'genus-'+g+' surface \\u03a3'+sub(g); }
    else { var k=2-chi; genus='k = '+k; name=k===1?'projective plane \\u211dP\\u00b2':k===2?'Klein bottle':'non-orientable N'+sub(k)+' (= '+k+'\\u00b7\\u211dP\\u00b2)'; }
    return {V:V,E:E,F:F,chi:chi,orientable:orientable,name:name,genus:genus,cls:cls,bad:bad,letters:Object.keys(byL)};
  }
  function sub(n){ var s=String(n), m={'0':'\\u2080','1':'\\u2081','2':'\\u2082','3':'\\u2083','4':'\\u2084','5':'\\u2085','6':'\\u2086','7':'\\u2087','8':'\\u2088','9':'\\u2089'}; return s.replace(/[0-9]/g,function(d){return m[d];}); }
  function corner(i,m){ if(m===2){ return [cx+(i===0?-1:1)*R, cy]; } var ang=-Math.PI/2 + i/m*2*Math.PI; return [cx+R*Math.cos(ang), cy+R*Math.sin(ang)]; }
  // edge geometry: straight for m>=3, arced (a lens/bigon) for m===2 so the two
  // edges don't overlap. apex = point at t=0.5; chord direction (b-a) is the
  // tangent there for a symmetric quadratic, so the arrow direction is just the chord.
  function edgeGeom(k,m){
    var a=corner(k,m), b=corner((k+1)%m,m), mid=[(a[0]+b[0])/2,(a[1]+b[1])/2];
    if(m===2){ var dx=b[0]-a[0], dy=b[1]-a[1], Ld=Math.hypot(dx,dy)||1, px=-dy/Ld, py=dx/Ld, bulge=(k===0?1:-1)*R*0.9;
      var ctrl=[mid[0]+px*bulge, mid[1]+py*bulge], apex=[0.25*a[0]+0.5*ctrl[0]+0.25*b[0], 0.25*a[1]+0.5*ctrl[1]+0.25*b[1]];
      return {a:a,b:b,ctrl:ctrl,apex:apex,curved:true}; }
    return {a:a,b:b,apex:mid,curved:false};
  }
  function colorOf(L,letters){ var idx=letters.indexOf(L); return LET[idx%LET.length]; }
  var VCOL=['var(--cyan)','var(--pink)','var(--green)','var(--violet)','var(--yellow)','var(--blue)','var(--mute)','var(--ink)'];
  function render(){
    while(G.firstChild)G.removeChild(G.firstChild);
    var m=word.length, info=classify(word);
    // edges (clickable) with arrowheads + labels
    for(var k=0;k<m;k++){
      var g=edgeGeom(k,m), a=g.a, b=g.b, e=word[k], col=colorOf(e.L,info.letters);
      var dseg = g.curved ? ('M'+a[0]+' '+a[1]+'Q'+g.ctrl[0]+' '+g.ctrl[1]+' '+b[0]+' '+b[1]) : ('M'+a[0]+' '+a[1]+'L'+b[0]+' '+b[1]);
      G.appendChild(SVG('path',{d:dseg,fill:'none',stroke:'transparent','stroke-width':18,'data-k':k,style:'cursor:pointer'}));
      G.appendChild(SVG('path',{d:dseg,fill:'none',stroke:col,'stroke-width':3,'pointer-events':'none'}));
      // arrow direction: + along a->b, - along b->a; chord is the tangent at the apex
      var dx=b[0]-a[0], dy=b[1]-a[1], Ld=Math.hypot(dx,dy)||1, ux=e.s>0?dx/Ld:-dx/Ld, uy=e.s>0?dy/Ld:-dy/Ld;
      var hx=g.apex[0], hy=g.apex[1], px=-uy, py=ux, sz=8;
      G.appendChild(SVG('path',{d:'M'+(hx+ux*sz)+' '+(hy+uy*sz)+'L'+(hx-ux*sz+px*sz*0.7)+' '+(hy-uy*sz+py*sz*0.7)+'L'+(hx-ux*sz-px*sz*0.7)+' '+(hy-uy*sz-py*sz*0.7)+'Z',fill:col,'pointer-events':'none'}));
      // label offset outward from the apex
      var ox=(g.apex[0]-cx), oy=(g.apex[1]-cy), on=Math.hypot(ox,oy)||1;
      var lt=SVG('text',{x:g.apex[0]+ox/on*15,y:g.apex[1]+oy/on*15+4,'font-size':14,fill:col,'text-anchor':'middle','font-style':'italic','pointer-events':'none'}); lt.textContent=e.L+(e.s<0?'\\u207b\\u00b9':''); G.appendChild(lt);
    }
    // corners coloured + labelled by vertex class
    for(var i=0;i<m;i++){ var c=corner(i,m), vc=info.cls[i];
      G.appendChild(SVG('circle',{cx:c[0],cy:c[1],r:7,fill:VCOL[vc%VCOL.length],stroke:'var(--bg)','stroke-width':1.5,'pointer-events':'none'}));
      var ct=SVG('text',{x:c[0],y:c[1]+3.5,'font-size':9,fill:'var(--bg)','text-anchor':'middle','font-weight':700,'pointer-events':'none'}); ct.textContent=vc; G.appendChild(ct);
    }
    // readout
    var wstr=word.map(function(e){return e.L+(e.s<0?'\\u207b\\u00b9':'');}).join(' ');
    var surf = info.bad ? '<b style=\\"color:var(--mute)\\">'+info.name+'</b>'
      : '<b style=\\"color:'+(info.orientable?'var(--cyan)':'var(--pink)')+'\\">'+info.name+'</b> &nbsp;('+(info.orientable?'orientable':'non-orientable')+', '+info.genus+')';
    out.innerHTML = 'word <b>'+wstr+'</b> &nbsp;\\u00b7&nbsp; V \\u2212 E + F = <b>'+info.V+' \\u2212 '+info.E+' + 1 = '+info.chi+'</b> (\\u03c7) &nbsp;\\u00b7&nbsp; '+surf
      + ' &nbsp;\\u00b7&nbsp; <span style=\\"color:var(--mute)\\">click an edge to flip its arrow</span>';
  }
  svg.addEventListener('click',function(ev){ var t=ev.target; if(t&&t.getAttribute&&t.getAttribute('data-k')!=null){ var k=+t.getAttribute('data-k'); word[k]={L:word[k].L,s:-word[k].s}; render(); } });
  PRESETS.forEach(function(p,i){ var b=$('#${widgetId}-p-'+i); if(b) b.addEventListener('click',function(){ word=parse(p.word); render(); }); });
  render();
})();
</script>`
  );
}
