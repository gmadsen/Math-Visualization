// knot-crossing-toggle widget — the "toggle-crossing" gesture: click any
// crossing of a knot diagram to flip which strand passes over; the Kauffman
// bracket, writhe, and Jones polynomial recompute live and the readout names
// the resulting knot. The diagram is a fixed closed parametric curve; its
// crossings, arcs, and PD code are DERIVED from the curve's self-intersections
// at init, so the picture and the algebra cannot drift apart.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params; a non-HTML frontend can drive its own renderer
// from params alone (validated against ./schema.json).
//
// jsdom-safe: no getScreenCTM/createSVGPoint anywhere (clicks land on
// per-crossing hit circles, so no coordinate transforms are needed), no
// Math.random, no rAF. Conventions validated standalone against 3_1 (both
// chiralities), 4_1, and the unknot before this file was written.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const svgTitle = params.svgTitle || title;
  const viewBox = params.viewBox || '0 0 560 480';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 560;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 480;
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-mirror" type="button">⇄ Mirror (flip every crossing)</button>\n` +
    `    <button id="${widgetId}-reset" type="button">↺ Reset</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId } = params;
  const template = params.template || 'four';
  const defaultBits = template === 'trefoil' ? [true, false, true] : [false, true, false, false];
  const initialOver = params.initialOver || defaultBits;
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 560 480').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3], CX=W/2, CY=Hh/2, SC=Math.min(W,Hh)/2-40;\n` +
    `  // closed curve in math coords (y-up), radius ~1; y is flipped only at draw time\n` +
    `  const curve=${template === 'trefoil'
      ? `function(t){ return [(Math.sin(t)+2*Math.sin(2*t))/3, (Math.cos(t)-2*Math.cos(2*t))/3]; }`
      : `function(t){ const r=(1.2+Math.cos(2*t))/2.2; return [r*Math.cos(3*t), r*Math.sin(3*t)]; }`};\n` +
    `  const N=1200, P=[];\n` +
    `  for(var i=0;i<N;i++) P.push(curve(2*Math.PI*i/N));\n` +
    `  // self-intersections of the sampled polyline -> crossings with passage params t1<t2\n` +
    `  function segInt(a,b,c,d){\n` +
    `    const r=[b[0]-a[0],b[1]-a[1]], q=[d[0]-c[0],d[1]-c[1]];\n` +
    `    const den=r[0]*q[1]-r[1]*q[0]; if(Math.abs(den)<1e-12) return null;\n` +
    `    const s=((c[0]-a[0])*q[1]-(c[1]-a[1])*q[0])/den;\n` +
    `    const u=((c[0]-a[0])*r[1]-(c[1]-a[1])*r[0])/den;\n` +
    `    return (s>=0&&s<1&&u>=0&&u<1)?[s,u]:null;\n` +
    `  }\n` +
    `  const XR=[];\n` +
    `  for(var i2=0;i2<N;i2++) for(var j=i2+2;j<N;j++){\n` +
    `    if(i2===0&&j===N-1) continue;\n` +
    `    const h=segInt(P[i2],P[(i2+1)%N],P[j],P[(j+1)%N]);\n` +
    `    if(h) XR.push({t1:(i2+h[0])/N, t2:(j+h[1])/N,\n` +
    `      x:P[i2][0]+h[0]*(P[(i2+1)%N][0]-P[i2][0]), y:P[i2][1]+h[0]*(P[(i2+1)%N][1]-P[i2][1])});\n` +
    `  }\n` +
    `  const n=XR.length;\n` +
    `  // arc labels: sort the 2n passages by t; arc k runs between passage k and k+1\n` +
    `  const evts=[];\n` +
    `  XR.forEach(function(c,i){ evts.push({t:c.t1,i:i,w:0}); evts.push({t:c.t2,i:i,w:1}); });\n` +
    `  evts.sort(function(a,b){ return a.t-b.t; });\n` +
    `  const arcOf={};\n` +
    `  evts.forEach(function(e,k){ arcOf[e.i+','+e.w+',in']=(k===0?evts.length-1:k-1); arcOf[e.i+','+e.w+',out']=k; });\n` +
    `  function tang(t){ const k=Math.floor(t*N)%N; const a=P[k], b=P[(k+1)%N]; return [b[0]-a[0],b[1]-a[1]]; }\n` +
    `  // PD code + crossing signs from the over/under bits (validated conventions)\n` +
    `  function derivePD(bits){\n` +
    `    const pd=[], signs=[];\n` +
    `    XR.forEach(function(c,i){\n` +
    `      const uw=bits[i]?1:0, ow=1-uw;\n` +
    `      const ut=uw===0?c.t1:c.t2, ot=ow===0?c.t1:c.t2;\n` +
    `      const u=tang(ut), o=tang(ot);\n` +
    `      const uxo=u[0]*o[1]-u[1]*o[0];\n` +
    `      const a=arcOf[i+','+uw+',in'], cc=arcOf[i+','+uw+',out'];\n` +
    `      const oin=arcOf[i+','+ow+',in'], oout=arcOf[i+','+ow+',out'];\n` +
    `      pd.push(uxo>0?[a,oin,cc,oout]:[a,oout,cc,oin]);\n` +
    `      signs.push(uxo>0?-1:1);\n` +
    `    });\n` +
    `    return {pd:pd, signs:signs};\n` +
    `  }\n` +
    `  // Kauffman bracket state sum (Laurent poly in A as exponent->coef map)\n` +
    `  function bracket(pd){\n` +
    `    const poly=new Map();\n` +
    `    function add(m,e,c){ m.set(e,(m.get(e)||0)+c); }\n` +
    `    for(var s=0;s<(1<<n);s++){\n` +
    `      const par={};\n` +
    `      function find(x){ return par[x]===undefined?(par[x]=x):(par[x]===x?x:(par[x]=find(par[x]))); }\n` +
    `      function uni(a,b){ par[find(a)]=find(b); }\n` +
    `      var nA=0;\n` +
    `      for(var i3=0;i3<n;i3++){\n` +
    `        const e4=pd[i3];\n` +
    `        if(((s>>i3)&1)===0){ nA++; uni(e4[0],e4[1]); uni(e4[2],e4[3]); }\n` +
    `        else { uni(e4[0],e4[3]); uni(e4[1],e4[2]); }\n` +
    `      }\n` +
    `      const roots=new Set();\n` +
    `      pd.forEach(function(e4){ e4.forEach(function(e){ roots.add(find(e)); }); });\n` +
    `      var term=new Map([[2*nA-n,1]]);\n` +
    `      for(var k=0;k<roots.size-1;k++){\n` +
    `        const nt=new Map();\n` +
    `        term.forEach(function(c,e){ add(nt,e+2,-c); add(nt,e-2,-c); });\n` +
    `        term=nt;\n` +
    `      }\n` +
    `      term.forEach(function(c,e){ add(poly,e,c); });\n` +
    `    }\n` +
    `    return poly;\n` +
    `  }\n` +
    `  // Jones: f = (-A^3)^(-w) * bracket, then t = A^(-4)\n` +
    `  function jonesOf(bits){\n` +
    `    const ps=derivePD(bits);\n` +
    `    const br=bracket(ps.pd);\n` +
    `    var w=0; ps.signs.forEach(function(sg){ w+=sg; });\n` +
    `    const vt=new Map();\n` +
    `    br.forEach(function(c,e){\n` +
    `      const e2=e-3*w, coef=c*((((w%2)+2)%2===0)?1:-1);\n` +
    `      vt.set(-e2/4,(vt.get(-e2/4)||0)+coef);\n` +
    `    });\n` +
    `    vt.forEach(function(c,e){ if(c===0) vt.delete(e); });\n` +
    `    return {v:vt, w:w};\n` +
    `  }\n` +
    `  function polyHtml(vt){\n` +
    `    const es=[...vt.keys()].sort(function(a,b){ return a-b; });\n` +
    `    if(!es.length) return '0';\n` +
    `    var sHtml='';\n` +
    `    es.forEach(function(e,k){\n` +
    `      const c=vt.get(e);\n` +
    `      const mag=Math.abs(c);\n` +
    `      const sign=c<0?'\\u2212':(k===0?'':'+');\n` +
    `      const coefTxt=(mag===1&&e!==0)?'':String(mag);\n` +
    `      const tTxt=e===0?'':(e===1?'t':'t<sup>'+String(e).replace('-','\\u2212')+'</sup>');\n` +
    `      sHtml+=(k?' ':'')+sign+' '+coefTxt+tTxt;\n` +
    `    });\n` +
    `    return sHtml.replace(/^\\s+|\\s(?=\\s)/g,'');\n` +
    `  }\n` +
    `  function polyKey(vt){\n` +
    `    return [...vt.entries()].sort(function(a,b){ return a[0]-b[0]; }).map(function(p){ return p[0]+':'+p[1]; }).join(',');\n` +
    `  }\n` +
    `  const NAMES={\n` +
    `    '0:1':['the <b>unknot</b>','V = 1: the Jones polynomial cannot tell this diagram from an unraveled loop \\u2014 and for a diagram this small it really is one. Most over/under patterns collapse like this.'],\n` +
    `    '1:1,3:1,4:-1':['the <b>right-handed trefoil</b> 3\\u2081','chiral: press \\u21c4 Mirror and watch every exponent negate \\u2014 V(t) \\u21a6 V(t\\u207b\\u00b9) distinguishes the trefoil from its mirror.'],\n` +
    `    '-4:-1,-3:1,-1:1':['the <b>left-handed trefoil</b> 3\\u2081 (mirror)','chiral: press \\u21c4 Mirror and watch every exponent negate \\u2014 V(t) \\u21a6 V(t\\u207b\\u00b9) distinguishes the trefoil from its mirror.'],\n` +
    `    '-2:1,-1:-1,0:1,1:-1,2:1':['the <b>figure-eight knot</b> 4\\u2081','palindromic: V(t) = V(t\\u207b\\u00b9), so Jones cannot distinguish 4\\u2081 from its mirror \\u2014 and indeed the figure-eight is amphichiral.'],\n` +
    `  };\n` +
    `  const BOOT=${JSON.stringify(initialOver)};\n` +
    `  var bits=BOOT.slice();\n` +
    `  const CURVE=SVG('g'); svg.appendChild(CURVE);\n` +
    `  const HITS=SVG('g'); svg.appendChild(HITS);\n` +
    `  const PXp=function(p){ return CX+SC*p[0]; }, PYp=function(p){ return CY-SC*p[1]; };\n` +
    `  function arcPath(t,half){\n` +
    `    // polyline of the curve for params [t-half, t+half] (in [0,1) units)\n` +
    `    var d='';\n` +
    `    const k0=Math.round((t-half)*N), k1=Math.round((t+half)*N);\n` +
    `    for(var k=k0;k<=k1;k++){ const p=P[((k%N)+N)%N]; d+=(d?' L':'M')+PXp(p).toFixed(1)+' '+PYp(p).toFixed(1); }\n` +
    `    return d;\n` +
    `  }\n` +
    `  function draw(){\n` +
    `    CURVE.innerHTML='';\n` +
    `    var d='';\n` +
    `    for(var k=0;k<=N;k++){ const p=P[k%N]; d+=(d?' L':'M')+PXp(p).toFixed(1)+' '+PYp(p).toFixed(1); }\n` +
    `    CURVE.appendChild(SVG('path',{d:d,fill:'none',stroke:'var(--ink)','stroke-width':2.6,'stroke-linejoin':'round'}));\n` +
    `    // over-strand halo: erase the under-strand around each crossing, then re-ink the over strand\n` +
    `    XR.forEach(function(c,i){\n` +
    `      const ot=bits[i]?c.t1:c.t2;\n` +
    `      CURVE.appendChild(SVG('path',{d:arcPath(ot,0.006),fill:'none',stroke:'var(--panel)','stroke-width':14,'stroke-linecap':'round'}));\n` +
    `      CURVE.appendChild(SVG('path',{d:arcPath(ot,0.008),fill:'none',stroke:'var(--ink)','stroke-width':2.6,'stroke-linecap':'round'}));\n` +
    `    });\n` +
    `  }\n` +
    `  function report(){\n` +
    `    const jw=jonesOf(bits);\n` +
    `    const rec=NAMES[polyKey(jw.v)];\n` +
    `    var msg='V(t) = <b>'+polyHtml(jw.v)+'</b> \\u00b7 writhe w = '+(jw.w<0?'\\u2212'+(-jw.w):jw.w);\n` +
    `    if(rec) msg+=' \\u00b7 this is '+rec[0]+' \\u2014 '+rec[1];\n` +
    `    out.innerHTML=msg;\n` +
    `  }\n` +
    `  // visible, clickable crossing markers\n` +
    `  XR.forEach(function(c,i){\n` +
    `    const cx=CX+SC*c.x, cy=CY-SC*c.y;\n` +
    `    HITS.appendChild(SVG('circle',{cx:cx,cy:cy,r:14,fill:'none',stroke:'var(--mute)','stroke-width':1.3,'stroke-dasharray':'3 3',opacity:0.8}));\n` +
    `    const hit=SVG('circle',{cx:cx,cy:cy,r:15,fill:'transparent',cursor:'pointer'});\n` +
    `    hit.addEventListener('click',function(){ bits[i]=!bits[i]; draw(); report(); });\n` +
    `    HITS.appendChild(hit);\n` +
    `  });\n` +
    `  const mb=$('#${widgetId}-mirror'); if(mb) mb.addEventListener('click',function(){ bits=bits.map(function(b){ return !b; }); draw(); report(); });\n` +
    `  const rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ bits=BOOT.slice(); draw(); report(); });\n` +
    `  draw(); report();\n` +
    `})();\n` +
    `</script>`
  );
}
