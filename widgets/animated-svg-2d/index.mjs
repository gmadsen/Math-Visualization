// animated-svg-2d widget — shared registry renderer for the "play" gesture:
// a self-contained play/pause animation over a normalized time t in [0,1].
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer supplies the clock: a Play/Pause button, a scrub slider, and a
// requestAnimationFrame loop that advances t and calls the author's frame(t).
// The author writes only the per-frame math + redraw (params.bodyScript), which
// receives the SVG group `G`, the `svg` node, the readout `out`, the constant
// STEPS, and the page-global $/SVG helpers. The author NEVER touches the clock
// or starts a timer — the engine owns rAF, looping, and the scrub wiring.
//
// jsdom-safe: requestAnimationFrame is never called at init (the first frame is
// painted synchronously at t=0); the loop starts only on user Play / autoplay,
// and a setTimeout shim covers environments without rAF.
//
// A non-HTML frontend can ignore renderScript and drive its own clock from the
// schema (steps / durationMs / loop), validated against ./schema.json.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint, steps = 120 } = params;
  const viewBox = params.viewBox || '0 0 640 380';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 640;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 380;
  const svgTitle = params.svgTitle || title;
  const playLabel = params.playLabel || '▶ Play';
  const outputInitial = params.outputInitial != null ? params.outputInitial : '&nbsp;';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-play" type="button" aria-pressed="false">${playLabel}</button>\n` +
    `    <input id="${widgetId}-scrub" type="range" min="0" max="${steps}" value="0" step="1" aria-label="Scrub timeline" style="flex:1">\n` +
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
    steps = 120,
    durationMs = 4000,
    loop = true,
    autoplay = false,
    playLabel = '▶ Play',
    pauseLabel = '⏸ Pause',
  } = params;
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const STEPS=${steps}, DUR=${durationMs}, LOOP=${loop ? 'true' : 'false'};\n` +
    `  // ---- author frame(t), t in [0,1] (clears+fills G, writes out) ----\n` +
    bodyScript + `\n` +
    `  // ---- play engine (supplied by animated-svg-2d) ----\n` +
    `  const playBtn=$('#${widgetId}-play'), scrub=$('#${widgetId}-scrub');\n` +
    `  const PLAY=${JSON.stringify(playLabel)}, PAUSE=${JSON.stringify(pauseLabel)};\n` +
    `  const hasRAF=typeof window.requestAnimationFrame==='function';\n` +
    `  const raf=hasRAF?window.requestAnimationFrame.bind(window):function(cb){return setTimeout(function(){cb(Date.now());},16);};\n` +
    `  const craf=hasRAF&&typeof window.cancelAnimationFrame==='function'?window.cancelAnimationFrame.bind(window):clearTimeout;\n` +
    `  let t=0, playing=false, id=0, last=0;\n` +
    `  function setT(v){ t=Math.max(0,Math.min(1,v)); scrub.value=Math.round(t*STEPS); frame(t); }\n` +
    `  function tick(now){ if(!playing) return; if(!last) last=now;\n` +
    `    const dt=(now-last)/DUR; last=now; let nt=t+dt;\n` +
    `    if(nt>=1){ if(LOOP){ nt=nt-Math.floor(nt); } else { setT(1); pause(); return; } }\n` +
    `    setT(nt); id=raf(tick); }\n` +
    `  function play(){ if(playing) return; if(t>=1) t=0; playing=true; last=0;\n` +
    `    playBtn.textContent=PAUSE; playBtn.setAttribute('aria-pressed','true'); id=raf(tick); }\n` +
    `  function pause(){ if(!playing) return; playing=false; if(id) craf(id);\n` +
    `    playBtn.textContent=PLAY; playBtn.setAttribute('aria-pressed','false'); }\n` +
    `  playBtn.addEventListener('click',function(){ playing?pause():play(); });\n` +
    `  scrub.addEventListener('input',function(){ pause(); setT((+scrub.value)/STEPS); });\n` +
    `  setT(0);\n` +
    (autoplay ? `  if(hasRAF) play();\n` : ``) +
    `})();\n` +
    `</script>`
  );
}
