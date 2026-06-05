// sketch-curve-2d widget — shared registry renderer for the "draw" gesture:
// the reader sketches y = f(x) by dragging the pointer across the plot, and a
// live transform of the sampled curve updates as they draw.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the sketch gesture: it maps pointer positions to the nearest
// of `samples` evenly spaced x-columns, sets that column's value (interpolating
// across columns skipped during a fast drag), and offers a Reset. It also
// supplies the data<->pixel helpers X(i)/xv(i)/Y(v)/Yinv(py) and the constant M.
// The author writes only `function draw(ys){…}` (params.bodyScript), which
// clears+redraws the SVG group `G` and writes the readout `out`.
//
// jsdom-safe: createSVGPoint/getScreenCTM run only inside the pointer handler,
// never at init (init just calls draw(ys) once). A non-HTML frontend can ignore
// renderScript and drive its own sampling from the schema.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const viewBox = params.viewBox || '0 0 640 380';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 640;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 380;
  const svgTitle = params.svgTitle || title;
  const resetLabel = params.resetLabel || '↺ Reset';
  const outputInitial = params.outputInitial != null ? params.outputInitial : '&nbsp;';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:crosshair"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-reset" type="button">${resetLabel}</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">${outputInitial}</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const {
    widgetId,
    svgId,
    outputId,
    bodyScript,
    samples = 60,
    x0 = 0,
    x1 = 1,
    ymin = -1,
    ymax = 1,
    padL = 48,
    padR = 24,
    padT = 24,
    padB = 40,
  } = params;
  const initialJson = Array.isArray(params.initialY)
    ? JSON.stringify(params.initialY)
    : 'null';
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const M=${samples}, X0=${x0}, X1=${x1}, YMIN=${ymin}, YMAX=${ymax};\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 640 380').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3];\n` +
    `  const bx0=${padL}, bx1=W-${padR}, by0=Hh-${padB}, by1=${padT};\n` +
    `  function X(i){ return bx0+(bx1-bx0)*i/(M-1); }\n` +
    `  function xv(i){ return X0+(X1-X0)*i/(M-1); }\n` +
    `  function Y(v){ let tt=(v-YMIN)/(YMAX-YMIN); if(tt<0)tt=0; if(tt>1)tt=1; return by0+(by1-by0)*tt; }\n` +
    `  function Yinv(py){ let tt=(py-by0)/(by1-by0); return YMIN+(YMAX-YMIN)*tt; }\n` +
    `  const INIT=${initialJson};\n` +
    `  const DEFAULT=INIT?Array.from({length:M},function(_,i){return typeof INIT[i]==='number'?INIT[i]:0;}):new Array(M).fill(0);\n` +
    `  const ys=DEFAULT.slice();\n` +
    `  // ---- author draw(ys) (clears+fills G, writes out) ----\n` +
    bodyScript + `\n` +
    `  // ---- sketch engine (supplied by sketch-curve-2d) ----\n` +
    `  function toSvg(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; return q.matrixTransform(svg.getScreenCTM().inverse()); }\n` +
    `  let drawing=false, lastI=null;\n` +
    `  function edit(pt){\n` +
    `    let i=Math.round((pt.x-bx0)/(bx1-bx0)*(M-1)); if(i<0)i=0; if(i>=M)i=M-1;\n` +
    `    let py=Math.max(Math.min(by0,by1),Math.min(Math.max(by0,by1),pt.y));\n` +
    `    const v=Yinv(py);\n` +
    `    if(lastI!==null && Math.abs(i-lastI)>1){ const a=Math.min(lastI,i), b=Math.max(lastI,i);\n` +
    `      const va=(a===lastI)?ys[lastI]:v, vb=(b===lastI)?ys[lastI]:v;\n` +
    `      for(let j=a;j<=b;j++) ys[j]=va+(vb-va)*(j-a)/(b-a||1); }\n` +
    `    else ys[i]=v;\n` +
    `    lastI=i; draw(ys);\n` +
    `  }\n` +
    `  svg.addEventListener('pointerdown',function(ev){ ev.preventDefault(); drawing=true; lastI=null; try{svg.setPointerCapture(ev.pointerId);}catch(e){} edit(toSvg(ev)); });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(drawing) edit(toSvg(ev)); });\n` +
    `  window.addEventListener('pointerup',function(){ drawing=false; lastI=null; });\n` +
    `  const rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',function(){ for(let i=0;i<M;i++) ys[i]=DEFAULT[i]; draw(ys); });\n` +
    `  draw(ys);\n` +
    `})();\n` +
    `</script>`
  );
}
