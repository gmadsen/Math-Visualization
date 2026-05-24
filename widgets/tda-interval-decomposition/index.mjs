// tda-interval-decomposition widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The structure theorem via H0 sublevel-set
// persistence of a 1-D function: a sweeping threshold builds the barcode (the
// interval decomposition M = ⊕ I[b,d)), the complete invariant.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-t">sublevel threshold $t$</label>\n` +
    `    <input type="range" id="${widgetId}-t" min="0" max="100" value="50" step="1">\n` +
    `    <span class="pill" id="${widgetId}-tv">t = …</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="A 1-D function with a sweeping sublevel threshold, and the H0 persistence barcode it produces"><title>Sublevel-set H₀ persistence: as the threshold rises, components are born at minima and die at maxima; the barcode is the interval decomposition of the persistence module</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* tda-interval-decomposition widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var st=document.getElementById('${widgetId}-t'), tv=document.getElementById('${widgetId}-tv');\n` +
    `  if(!svg||!out||!st) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    // sampled 1-D function f
    `  var N=90, f=[]; for(var i=0;i<N;i++){ var x=i/(N-1); f.push(0.5-0.20*Math.cos(4*Math.PI*x)-0.10*Math.cos(2*Math.PI*x)+0.08*x); }\n` +
    `  var fmin=Math.min.apply(null,f), fmax=Math.max.apply(null,f);\n` +
    // H0 sublevel persistence (union-find sweep, elder rule) -> bars [birth, death]
    `  function persistence(){ var ord=f.map(function(v,i){return i;}).sort(function(a,b){return f[a]-f[b];});\n` +
    `    var parent=new Array(N).fill(-1), birth=new Array(N).fill(0), added=new Array(N).fill(false), bars=[];\n` +
    `    function find(x){ while(parent[x]!==x){ parent[x]=parent[parent[x]]; x=parent[x]; } return x; }\n` +
    `    for(var k=0;k<ord.length;k++){ var i=ord[k]; added[i]=true; var roots=[];\n` +
    `      [i-1,i+1].forEach(function(j){ if(j>=0&&j<N&&added[j]){ var r=find(j); if(roots.indexOf(r)<0) roots.push(r); } });\n` +
    `      if(roots.length===0){ parent[i]=i; birth[i]=f[i]; }\n` +
    `      else { var eld=roots[0]; roots.forEach(function(r){ if(birth[r]<birth[eld]) eld=r; }); parent[i]=eld;\n` +
    `        roots.forEach(function(r){ if(r!==eld){ bars.push([birth[r], f[i]]); parent[r]=eld; } }); }\n` +
    `    }\n` +
    `    var seen={}; for(var i2=0;i2<N;i2++){ var r=find(i2); if(!seen[r]){ seen[r]=1; bars.push([birth[r], Infinity]); } }\n` +
    `    bars.sort(function(a,b){ return a[0]-b[0]; }); return bars;\n` +
    `  }\n` +
    `  var BARS=persistence();\n` +
    `  var PX0=60, PX1=440, FY0=44, FY1=150;\n` +  // function plot box
    `  function FX(x){ return PX0 + x*(PX1-PX0); }\n` +  // x in [0,1]
    `  function FY(v){ return FY1 - (v-fmin)/(fmax-fmin)*(FY1-FY0); }\n` +  // f-value
    `  function BX(v){ return PX0 + (v-fmin)/(fmax-fmin)*(PX1-PX0); }\n` +  // filtration value -> barcode x (same scale as f-value)
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var t = fmin + (parseInt(st.value,10)/100)*(fmax-fmin); tv.textContent='t = '+t.toFixed(2);\n` +
    // function curve
    `    var d=''; for(var i=0;i<N;i++){ d+=(i?'L ':'M ')+FX(i/(N-1))+' '+FY(f[i])+' '; }\n` +
    `    svg.appendChild(mk('path',{d:d, fill:'none', stroke:'var(--cyan)','stroke-width':2}));\n` +
    `    txt(PX0-6, FY0+2, 'f(x)', {size:10, fill:'var(--mute)', anchor:'end'});\n` +
    // threshold line + shaded sublevel band
    `    svg.appendChild(mk('line',{x1:PX0,y1:FY(t),x2:PX1,y2:FY(t),stroke:'var(--yellow)','stroke-width':1.4,'stroke-dasharray':'4 3'}));\n` +
    `    txt(PX1+4, FY(t)+4, 't', {size:11, fill:'var(--yellow)', weight:700});\n` +
    // sublevel components: connected runs of f[i] <= t, count + colour
    `    var COMP=['var(--green)','var(--pink)','var(--violet)','var(--blue)','var(--cyan)'];\n` +
    `    var comps=0, runStart=-1; var compIv=[];\n` +
    `    for(i=0;i<N;i++){ var below=f[i]<=t; if(below && runStart<0){ runStart=i; } if((!below||i===N-1) && runStart>=0){ var endi=below?i:i-1; compIv.push([runStart,endi]); runStart=-1; } }\n` +
    `    comps=compIv.length;\n` +
    `    compIv.forEach(function(iv,ci){ var col=COMP[ci%COMP.length]; svg.appendChild(mk('line',{x1:FX(iv[0]/(N-1)),y1:FY1+10,x2:FX(iv[1]/(N-1)),y2:FY1+10,stroke:col,'stroke-width':4})); });\n` +
    `    txt(PX0-6, FY1+14, '{f\\u2264t}', {size:9, fill:'var(--mute)', anchor:'end'});\n` +
    // barcode
    `    var BY0=192, rh=20;\n` +
    `    txt(PX0, BY0-10, 'barcode  M \\u2245 \\u2295 I[b,d)  (filtration value \\u2192)', {size:10, fill:'var(--mute)'});\n` +
    `    var alive=0;\n` +
    `    BARS.forEach(function(b,bi){ var y=BY0+10+bi*rh; var x0=BX(b[0]); var inf=(b[1]===Infinity); var x1=inf?PX1+12:BX(b[1]);\n` +
    `      var isAlive = b[0]<=t && (inf || t<b[1]); if(isAlive) alive++;\n` +
    `      svg.appendChild(mk('line',{x1:x0,y1:y,x2:x1,y2:y,stroke: isAlive?'var(--green)':'var(--line)','stroke-width': isAlive?4:3,'stroke-opacity':isAlive?1:0.55}));\n` +
    `      svg.appendChild(mk('circle',{cx:x0,cy:y,r:3,fill:'var(--ink)'}));\n` +
    `      if(inf){ svg.appendChild(mk('path',{d:'M '+(PX1+12)+' '+(y-4)+' L '+(PX1+20)+' '+y+' L '+(PX1+12)+' '+(y+4)+' Z', fill:'var(--ink)'})); txt(x0-6, y+4, '[b\\u2080,\\u221e)', {size:8, fill:'var(--mute)', anchor:'end'}); }\n` +
    `      else { txt(x1+5, y+4, 'len '+(b[1]-b[0]).toFixed(2), {size:8, fill:'var(--mute)'}); }\n` +
    `    });\n` +
    // threshold vertical line on barcode
    `    var byBot=BY0+10+BARS.length*rh;\n` +
    `    svg.appendChild(mk('line',{x1:BX(t),y1:BY0+2,x2:BX(t),y2:byBot,stroke:'var(--yellow)','stroke-width':1.2,'stroke-dasharray':'3 2'}));\n` +
    `    txt(BX(t), byBot+12, 't', {size:9, fill:'var(--yellow)', anchor:'middle'});\n` +
    `    txt(PX1+30, BY0+10+0*rh+4, 'dim M_t = '+alive, {size:12, fill:'var(--green)', weight:700});\n` +
    `    out.textContent = 'A persistence module here comes from the sublevel sets {f \\u2264 t} of a 1-D function as the threshold t rises. Each connected component of {f\\u2264t} is a class in H\\u2080; a new component is BORN at each local minimum and two components MERGE at a local maximum, where by the elder rule the younger one (higher birth) DIES. Recording (birth, death) for every component gives the barcode \\u2014 currently '+comps+' component'+(comps===1?'':'s')+' at t='+t.toFixed(2)+', so dim M_t = '+alive+'. The Structure Theorem (Crawley-Boevey, Zomorodian\\u2013Carlsson) says any pointwise-finite persistence module over a field decomposes UNIQUELY as a direct sum of interval modules M \\u2245 \\u2295\\u2090 I[b\\u2090,d\\u2090) \\u2014 each bar is one indecomposable summand I[b,d). So the barcode (the multiset of bars) is a COMPLETE invariant: two such modules are isomorphic iff their barcodes match. A bar\\u2019s length is the feature\\u2019s persistence \\u2014 the long bar (and the infinite one, the global minimum / connected whole) is a significant feature; very short bars are noise. The proof mirrors the structure theorem for finitely generated modules over the PID k[t]. (No analogue exists for multi-parameter persistence over \\u211d\\u00b2.)';\n` +
    `  }\n` +
    `  st.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
