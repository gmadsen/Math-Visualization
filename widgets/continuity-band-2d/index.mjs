// continuity-band-2d widget — shared registry renderer for the "slide-band"
// gesture: the epsilon-delta definition of continuity, and uniform continuity.
// For a chosen f and tolerance eps, the reader drags the point a along the
// domain; the engine draws the horizontal eps-band [f(a)-eps, f(a)+eps] and the
// largest symmetric delta(a) whose interval f maps into the band. Sliding a
// shows delta(a) change — collapsing toward 0 for 1/x near the origin (not
// uniformly continuous), staying healthy for a Lipschitz/bounded-slope f.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// jsdom-safe: createSVGPoint/getScreenCTM run only inside the pointer handlers.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, selectId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 600 420';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 600;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 420;
  const svgTitle = params.svgTitle || title;
  const resetLabel = params.resetLabel || '↺ Reset';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  const cases = Array.isArray(params.cases) ? params.cases : [];
  const opts = cases.map((c, i) => `<option value="${i}">${c.label}</option>`).join('');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${selectId}">function:</label>\n` +
    `    <select id="${selectId}">${opts}</select>\n` +
    `    <label>ε:</label><button id="${widgetId}-epsdn" type="button">−</button><button id="${widgetId}-epsup" type="button">+</button>\n` +
    `    <button id="${widgetId}-reset" type="button">${resetLabel}</button>\n` +
    `  </div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:ew-resize;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId, selectId } = params;
  const cases = Array.isArray(params.cases) ? params.cases : [];
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}'), sel=$('#${selectId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const CASES=${JSON.stringify(cases)};\n` +
    `  CASES.forEach(function(c){ c.f=new Function('x','return ('+c.expr+');'); });\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 600 420').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3], padL=44, padR=16, padT=16, padB=34;\n` +
    `  const bx0=padL, bx1=W-padR, by0=Hh-padB, by1=padT;\n` +
    `  var ci=0, a=0, eps=1, minD=Infinity;\n` +
    `  function C(){ return CASES[ci]; }\n` +
    `  function f(x){ return C().f(x); }\n` +
    `  function PX(x){ var c=C(); return bx0+(x-c.x0)/(c.x1-c.x0)*(bx1-bx0); }\n` +
    `  function PY(y){ var c=C(); return by0-(y-c.y0)/(c.y1-c.y0)*(by0-by1); }\n` +
    `  function XV(p){ var c=C(); return c.x0+(p-bx0)/(bx1-bx0)*(c.x1-c.x0); }\n` +
    `  function load(){ var c=C(); a=(c.aInit!=null?c.aInit:(c.x0+c.x1)/2); eps=(c.eps!=null?c.eps:(c.y1-c.y0)/8); minD=Infinity; render(); }\n` +
    `  function deltaAt(aa){ var c=C(), fa=f(aa), step=(c.x1-c.x0)/900, L=0, R=0, x;\n` +
    `    for(x=aa-step; x>=c.x0-1e-9; x-=step){ if(Math.abs(f(x)-fa)>=eps) break; L=aa-x; }\n` +
    `    for(x=aa+step; x<=c.x1+1e-9; x+=step){ if(Math.abs(f(x)-fa)>=eps) break; R=x-aa; }\n` +
    `    return Math.min(L,R); }\n` +
    `  function fmt(n){ return (n<0?'\\u2212':'')+Math.abs(n).toFixed(3); }\n` +
    `  function render(){\n` +
    `    while(G.firstChild)G.removeChild(G.firstChild); var c=C(), fa=f(a), del=deltaAt(a); if(del<minD)minD=del;\n` +
    `    // axes\n` +
    `    if(c.y0<0&&c.y1>0) G.appendChild(SVG('line',{x1:bx0,y1:PY(0),x2:bx1,y2:PY(0),stroke:'var(--mute)','stroke-width':1,opacity:0.3}));\n` +
    `    G.appendChild(SVG('rect',{x:bx0,y:by1,width:bx1-bx0,height:by0-by1,fill:'none',stroke:'var(--line)','stroke-width':1}));\n` +
    `    // eps-band (horizontal) and delta-interval (vertical)\n` +
    `    var yb0=PY(Math.min(c.y1,fa+eps)), yb1=PY(Math.max(c.y0,fa-eps));\n` +
    `    G.appendChild(SVG('rect',{x:bx0,y:yb0.toFixed(1),width:bx1-bx0,height:(yb1-yb0).toFixed(1),fill:'var(--green)','fill-opacity':0.1}));\n` +
    `    var xL=PX(Math.max(c.x0,a-del)), xR=PX(Math.min(c.x1,a+del));\n` +
    `    G.appendChild(SVG('rect',{x:xL.toFixed(1),y:by1,width:(xR-xL).toFixed(1),height:by0-by1,fill:'var(--cyan)','fill-opacity':0.12}));\n` +
    `    // the box where they meet (f maps the delta-interval into here)\n` +
    `    G.appendChild(SVG('rect',{x:xL.toFixed(1),y:yb0.toFixed(1),width:(xR-xL).toFixed(1),height:(yb1-yb0).toFixed(1),fill:'none',stroke:'var(--yellow)','stroke-width':1.5,'stroke-dasharray':'4 3'}));\n` +
    `    // curve\n` +
    `    var d='', N=260; for(var i=0;i<=N;i++){ var x=c.x0+(c.x1-c.x0)*i/N, y=f(x); if(!isFinite(y)){d='';continue;} var py=PY(Math.max(c.y0-1,Math.min(c.y1+1,y))); d+=(d?'L':'M')+PX(x).toFixed(1)+' '+py.toFixed(1)+' '; }\n` +
    `    G.appendChild(SVG('path',{d:d,fill:'none',stroke:'var(--pink)','stroke-width':2.2}));\n` +
    `    // point a\n` +
    `    G.appendChild(SVG('line',{x1:PX(a),y1:by1,x2:PX(a),y2:by0,stroke:'var(--ink)','stroke-width':1,opacity:0.4,'stroke-dasharray':'2 3'}));\n` +
    `    G.appendChild(SVG('circle',{cx:PX(a),cy:PY(fa),r:6,fill:'var(--ink)',stroke:'var(--bg)','stroke-width':1.5}));\n` +
    `    var al=SVG('text',{x:PX(a),y:by0+15,'font-size':11,fill:'var(--ink)','text-anchor':'middle'}); al.textContent='a = '+fmt(a); G.appendChild(al);\n` +
    `    var el=SVG('text',{x:bx0+4,y:yb0-3,'font-size':10,fill:'var(--green)'}); el.textContent='ε-band'; G.appendChild(el);\n` +
    `    // readout\n` +
    `    var note=c.note?(' &nbsp;\\u00b7&nbsp; <span style=\\"color:var(--mute)\\">'+c.note+'</span>'):'';\n` +
    `    out.innerHTML='at a = <b>'+fmt(a)+'</b>, the largest δ for ε = '+fmt(eps)+' is δ = <b style=\\"color:var(--cyan)\\">'+fmt(del)+'</b> &nbsp;\\u00b7&nbsp; smallest δ you\\u2019ve needed: <b style=\\"color:var(--yellow)\\">'+(isFinite(minD)?fmt(minD):'\\u2014')+'</b> &nbsp;\\u00b7&nbsp; <span style=\\"color:var(--mute)\\">uniform continuity = one δ for every a</span>'+note;\n` +
    `  }\n` +
    `  function toX(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; const p=q.matrixTransform(svg.getScreenCTM().inverse()); return XV(p.x); }\n` +
    `  function setA(x){ var c=C(), m=(c.x1-c.x0)*0.012; a=Math.max(c.x0+m,Math.min(c.x1-m,x)); render(); }\n` +
    `  var drag=false;\n` +
    `  svg.addEventListener('pointerdown',function(ev){ drag=true; ev.preventDefault(); try{svg.setPointerCapture(ev.pointerId);}catch(e){} setA(toX(ev)); });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!drag)return; setA(toX(ev)); });\n` +
    `  window.addEventListener('pointerup',function(){ drag=false; });\n` +
    `  sel.addEventListener('change',function(){ ci=+sel.value; load(); });\n` +
    `  $('#${widgetId}-epsup').addEventListener('click',function(){ var c=C(); eps=Math.min((c.y1-c.y0)*0.6,eps*1.4); minD=Infinity; render(); });\n` +
    `  $('#${widgetId}-epsdn').addEventListener('click',function(){ eps=Math.max((C().y1-C().y0)*0.01,eps/1.4); minD=Infinity; render(); });\n` +
    `  $('#${widgetId}-reset').addEventListener('click',load);\n` +
    `  load();\n` +
    `})();\n` +
    `</script>`
  );
}
