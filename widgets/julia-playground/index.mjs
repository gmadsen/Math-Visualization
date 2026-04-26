// julia-playground widget — bespoke canvas-based fractal explorer for the
// Mandelbrot set and the filled-in Julia sets J_c.  Iterates
//
//     z_{n+1} = z_n^2 + c
//
// per pixel; in "mandelbrot" mode the canvas plane is the c-plane and
// z_0 = 0; in "julia" mode the canvas plane is the z-plane and c is fixed
// (and interactively adjustable).  Smooth-iteration coloring uses a project
// accent ramp (cyan / violet / yellow / pink).
//
// The widget paints into an HTML5 <canvas> instead of SVG because escape-time
// rendering touches one entry per pixel — at the default 480x320 that's
// ~150k samples, well past the cost where SVG <rect> grids stop being
// reasonable.  All rendering happens in a single IIFE in renderScript; no
// external assets, no fetch, file:// safe.
//
// Both exports are pure functions of params.  A React / SSR / any-frontend
// consumer can ignore renderScript and reimplement the iteration loop from
// the schema (it is fully data: mode + the four window edges + c + the
// iteration cap + palette).
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>

// ----- defaults ---------------------------------------------------------

const DEFAULTS = {
  mode: 'mandelbrot',
  cReal: -0.7,
  cImag: 0.27015,
  xmin: -2.2,
  xmax: 1.0,
  ymin: -1.4,
  ymax: 1.4,
  maxIterations: 80,
  width: 480,
  height: 320,
  palette: 'cyan',
  minZoomSpan: 0.01,
  maxZoomSpan: 8.0,
};

function withDefaults(params) {
  const out = { ...DEFAULTS, ...params };
  return out;
}

// ----- markup -----------------------------------------------------------

export function renderMarkup(params) {
  const p = withDefaults(params);
  const { widgetId, title, hint, mode, width, height } = p;
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';

  // Per-instance ids (unique per widgetId so a page can host several).
  const cv = `${widgetId}-canvas`;
  const ro = `${widgetId}-readout`;
  const cr = `${widgetId}-cR`;
  const ci = `${widgetId}-cI`;
  const it = `${widgetId}-iter`;
  const reset = `${widgetId}-reset`;
  const crOut = `${widgetId}-cR-out`;
  const ciOut = `${widgetId}-cI-out`;
  const itOut = `${widgetId}-iter-out`;

  // Julia mode exposes c sliders + a "shift-click to pin c" affordance.
  // Mandelbrot mode hides them; the panel still renders but with display:none
  // so the IIFE can address the elements unconditionally.
  const cRowsHidden = mode === 'mandelbrot' ? ' style="display:none"' : '';

  const lines = [];
  lines.push(`<div class="widget" id="${widgetId}">`);
  lines.push(`  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>`);
  lines.push(
    `  <canvas id="${cv}" width="${width}" height="${height}" ` +
      `style="width:100%;max-width:${width}px;height:auto;display:block;` +
      `border:1px solid var(--line);border-radius:6px;cursor:crosshair;` +
      `image-rendering:pixelated;background:var(--bg)"></canvas>`
  );
  lines.push(`  <div class="row"${cRowsHidden}>`);
  lines.push(`    <label for="${cr}">$\\Re(c)$</label>`);
  lines.push(
    `    <input type="range" id="${cr}" min="-2" max="2" step="0.001" value="${p.cReal}">`
  );
  lines.push(
    `    <span class="small" id="${crOut}">${p.cReal.toFixed(3)}</span>`
  );
  lines.push(`  </div>`);
  lines.push(`  <div class="row"${cRowsHidden}>`);
  lines.push(`    <label for="${ci}">$\\Im(c)$</label>`);
  lines.push(
    `    <input type="range" id="${ci}" min="-2" max="2" step="0.001" value="${p.cImag}">`
  );
  lines.push(
    `    <span class="small" id="${ciOut}">${p.cImag.toFixed(3)}</span>`
  );
  lines.push(`  </div>`);
  lines.push(`  <div class="row">`);
  lines.push(`    <label for="${it}">iterations</label>`);
  lines.push(
    `    <input type="range" id="${it}" min="16" max="400" step="1" value="${p.maxIterations}">`
  );
  lines.push(`    <span class="small" id="${itOut}">${p.maxIterations}</span>`);
  lines.push(`    <button id="${reset}">reset view</button>`);
  lines.push(`  </div>`);
  lines.push(
    `  <div class="readout" id="${ro}">drag to pan · wheel to zoom` +
      (mode === 'julia' ? ' · shift-click to pin $c$' : '') +
      `</div>`
  );
  lines.push(`</div>`);
  return lines.join('\n');
}

// ----- script -----------------------------------------------------------

export function renderScript(params) {
  const p = withDefaults(params);
  // The IIFE receives params as a JSON literal — keep the script body
  // independent of the surrounding page (no closure sharing across widgets).
  const cfg = JSON.stringify(
    {
      widgetId: p.widgetId,
      mode: p.mode,
      cReal: p.cReal,
      cImag: p.cImag,
      xmin: p.xmin,
      xmax: p.xmax,
      ymin: p.ymin,
      ymax: p.ymax,
      maxIterations: p.maxIterations,
      width: p.width,
      height: p.height,
      palette: p.palette,
      minZoomSpan: p.minZoomSpan,
      maxZoomSpan: p.maxZoomSpan,
    }
  );
  const banner = p.sectionComment ? `/* ${p.sectionComment} */\n` : '';
  return (
    `<script>\n` +
    banner +
    `(function(){\n` +
    `  var CFG = ${cfg};\n` +
    `  var ROOT = document.getElementById(CFG.widgetId);\n` +
    `  if (!ROOT) return;\n` +
    `  var canvas = document.getElementById(CFG.widgetId + '-canvas');\n` +
    `  if (!canvas || !canvas.getContext) return;\n` +
    `  var ctx = canvas.getContext('2d');\n` +
    `  if (!ctx) return;\n` +
    `  var readout = document.getElementById(CFG.widgetId + '-readout');\n` +
    `  var cRIn = document.getElementById(CFG.widgetId + '-cR');\n` +
    `  var cIIn = document.getElementById(CFG.widgetId + '-cI');\n` +
    `  var iterIn = document.getElementById(CFG.widgetId + '-iter');\n` +
    `  var cROut = document.getElementById(CFG.widgetId + '-cR-out');\n` +
    `  var cIOut = document.getElementById(CFG.widgetId + '-cI-out');\n` +
    `  var iterOut = document.getElementById(CFG.widgetId + '-iter-out');\n` +
    `  var resetBtn = document.getElementById(CFG.widgetId + '-reset');\n` +
    `\n` +
    `  // ---- view + state -------------------------------------------------\n` +
    `  var view = { xmin: CFG.xmin, xmax: CFG.xmax, ymin: CFG.ymin, ymax: CFG.ymax };\n` +
    `  var iterMax = CFG.maxIterations;\n` +
    `  var cR = CFG.cReal, cI = CFG.cImag;\n` +
    `  var renderToken = 0;   // monotone — increment to cancel an in-flight render\n` +
    `  var img = null;        // ImageData scratch\n` +
    `\n` +
    `  // ---- palette ------------------------------------------------------\n` +
    `  // Resolve the project accent CSS variable to an [r,g,b] triple at\n` +
    `  // render time so theme toggles refresh without a page reload.\n` +
    `  function cssRGB(varName, fallback) {\n` +
    `    var raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();\n` +
    `    var m = raw.match(/^#([0-9a-fA-F]{3,6})$/);\n` +
    `    if (m) {\n` +
    `      var hex = m[1];\n` +
    `      if (hex.length === 3) hex = hex.split('').map(function(c){return c+c;}).join('');\n` +
    `      return [parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16)];\n` +
    `    }\n` +
    `    var rgbm = raw.match(/rgb\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)/);\n` +
    `    if (rgbm) return [+rgbm[1], +rgbm[2], +rgbm[3]];\n` +
    `    return fallback;\n` +
    `  }\n` +
    `  function paletteRGB() {\n` +
    `    var accentVar = '--' + CFG.palette;\n` +
    `    var bg   = cssRGB('--bg',    [15, 18, 24]);\n` +
    `    var mute = cssRGB('--mute',  [134, 145, 168]);\n` +
    `    var ink  = cssRGB('--ink',   [232, 234, 240]);\n` +
    `    var hot  = cssRGB(accentVar, [125, 224, 214]);\n` +
    `    return { bg: bg, mute: mute, ink: ink, hot: hot };\n` +
    `  }\n` +
    `  function lerpRGB(a, b, t) {\n` +
    `    return [\n` +
    `      Math.round(a[0] + (b[0] - a[0]) * t),\n` +
    `      Math.round(a[1] + (b[1] - a[1]) * t),\n` +
    `      Math.round(a[2] + (b[2] - a[2]) * t)\n` +
    `    ];\n` +
    `  }\n` +
    `  function colorize(mu, pal) {\n` +
    `    // mu in [0,1]: smooth-normalized escape time. Two-stop ramp through\n` +
    `    // mute to the chosen accent.\n` +
    `    if (mu <= 0.5) return lerpRGB(pal.bg, pal.mute, mu * 2);\n` +
    `    return lerpRGB(pal.mute, pal.hot, (mu - 0.5) * 2);\n` +
    `  }\n` +
    `\n` +
    `  // ---- iteration core ----------------------------------------------\n` +
    `  // Returns smooth-iteration count in [0, iterMax]. -1 means "did not\n` +
    `  // escape" (interior point); plotted as ink color.\n` +
    `  function escapeFrom(zx0, zy0, cx, cy, iterMax) {\n` +
    `    var x = zx0, y = zy0;\n` +
    `    for (var i = 0; i < iterMax; i++) {\n` +
    `      var x2 = x*x, y2 = y*y;\n` +
    `      if (x2 + y2 > 256) {\n` +
    `        // Smooth iteration count: i + 1 - log_2(log(|z|))\n` +
    `        var logZn = Math.log(x2 + y2) / 2;\n` +
    `        var nu = Math.log(logZn / Math.LN2) / Math.LN2;\n` +
    `        return i + 1 - nu;\n` +
    `      }\n` +
    `      var xn = x2 - y2 + cx;\n` +
    `      y = 2*x*y + cy;\n` +
    `      x = xn;\n` +
    `    }\n` +
    `    return -1;\n` +
    `  }\n` +
    `\n` +
    `  // ---- palette cache ------------------------------------------------\n` +
    `  // Resolve the project accent vars once at init; refresh on theme flip\n` +
    `  // (MutationObserver below). Saves four getComputedStyle(:root) calls\n` +
    `  // per slider tick during a drag (60-120 Hz).\n` +
    `  var pal = paletteRGB();\n` +
    `\n` +
    `  // ---- render scheduling --------------------------------------------\n` +
    `  // Slider/wheel/pan all want a fresh render. Coalesce back-to-back\n` +
    `  // events into a single rAF — the renderToken cancellation already\n` +
    `  // handles the race, this just stops kicking off renders that will be\n` +
    `  // immediately superseded.\n` +
    `  var renderQueued = false;\n` +
    `  function queueRender() {\n` +
    `    if (renderQueued) return;\n` +
    `    renderQueued = true;\n` +
    `    requestAnimationFrame(function() { renderQueued = false; startRender(); });\n` +
    `  }\n` +
    `\n` +
    `  // ---- render loop --------------------------------------------------\n` +
    `  function startRender() {\n` +
    `    renderToken++;\n` +
    `    var token = renderToken;\n` +
    `    var W = CFG.width, H = CFG.height;\n` +
    `    if (!img || img.width !== W || img.height !== H) img = ctx.createImageData(W, H);\n` +
    `    var data = img.data;\n` +
    `    var dx = (view.xmax - view.xmin) / W;\n` +
    `    var dy = (view.ymax - view.ymin) / H;\n` +
    `    var isM = CFG.mode === 'mandelbrot';\n` +
    `    var iter = iterMax;\n` +
    `    var rowsPerSlice = Math.max(8, Math.floor(40 - Math.log2(W * H) + 24));\n` +
    `    if (rowsPerSlice > H) rowsPerSlice = H;\n` +
    `\n` +
    `    function renderSlice(yStart) {\n` +
    `      if (token !== renderToken) return;   // newer render superseded us\n` +
    `      var yEnd = Math.min(yStart + rowsPerSlice, H);\n` +
    `      for (var py = yStart; py < yEnd; py++) {\n` +
    `        var ya = view.ymax - py * dy;     // flip y so +i is up\n` +
    `        for (var px = 0; px < W; px++) {\n` +
    `          var xa = view.xmin + px * dx;\n` +
    `          var n;\n` +
    `          if (isM) n = escapeFrom(0, 0, xa, ya, iter);\n` +
    `          else     n = escapeFrom(xa, ya, cR, cI, iter);\n` +
    `          var rgb;\n` +
    `          if (n < 0) {\n` +
    `            rgb = pal.ink;\n` +
    `          } else {\n` +
    `            var mu = Math.max(0, Math.min(1, n / iter));\n` +
    `            // Sharpen the gradient near the boundary; sqrt redistributes\n` +
    `            // resolution toward the rapidly-escaping band.\n` +
    `            mu = Math.sqrt(mu);\n` +
    `            rgb = colorize(mu, pal);\n` +
    `          }\n` +
    `          var off = (py * W + px) * 4;\n` +
    `          data[off    ] = rgb[0];\n` +
    `          data[off + 1] = rgb[1];\n` +
    `          data[off + 2] = rgb[2];\n` +
    `          data[off + 3] = 255;\n` +
    `        }\n` +
    `      }\n` +
    `      ctx.putImageData(img, 0, 0);\n` +
    `      if (yEnd < H) {\n` +
    `        // Yield to the event loop so sliders / pan / zoom stay responsive.\n` +
    `        if (typeof requestAnimationFrame === 'function') {\n` +
    `          requestAnimationFrame(function(){ renderSlice(yEnd); });\n` +
    `        } else {\n` +
    `          setTimeout(function(){ renderSlice(yEnd); }, 0);\n` +
    `        }\n` +
    `      }\n` +
    `    }\n` +
    `    renderSlice(0);\n` +
    `  }\n` +
    `\n` +
    `  // ---- readout ------------------------------------------------------\n` +
    `  function fmt(x) { return (Math.round(x * 1000) / 1000).toString(); }\n` +
    `  function updateReadout() {\n` +
    `    var span = view.xmax - view.xmin;\n` +
    `    var center = '(' + fmt((view.xmin + view.xmax) / 2) + ', ' + fmt((view.ymin + view.ymax) / 2) + ')';\n` +
    `    var line = 'view ' + center + ' · span ' + fmt(span) + ' · iter ' + iterMax;\n` +
    `    if (CFG.mode === 'julia') line += ' · c = ' + fmt(cR) + (cI >= 0 ? ' + ' : ' − ') + fmt(Math.abs(cI)) + 'i';\n` +
    `    if (readout) readout.textContent = line;\n` +
    `  }\n` +
    `\n` +
    `  // ---- input wiring -------------------------------------------------\n` +
    `  function pixelToPlane(px, py) {\n` +
    `    var rect = canvas.getBoundingClientRect();\n` +
    `    var sx = canvas.width / rect.width;\n` +
    `    var sy = canvas.height / rect.height;\n` +
    `    var cx = px * sx;\n` +
    `    var cy = py * sy;\n` +
    `    return {\n` +
    `      x: view.xmin + (cx / canvas.width) * (view.xmax - view.xmin),\n` +
    `      y: view.ymax - (cy / canvas.height) * (view.ymax - view.ymin)\n` +
    `    };\n` +
    `  }\n` +
    `  function clampSpan() {\n` +
    `    var span = view.xmax - view.xmin;\n` +
    `    if (span < CFG.minZoomSpan) {\n` +
    `      var cx = (view.xmin + view.xmax) / 2;\n` +
    `      var cy = (view.ymin + view.ymax) / 2;\n` +
    `      var s = CFG.minZoomSpan / 2;\n` +
    `      var sH = s * (CFG.height / CFG.width);\n` +
    `      view.xmin = cx - s; view.xmax = cx + s;\n` +
    `      view.ymin = cy - sH; view.ymax = cy + sH;\n` +
    `    } else if (span > CFG.maxZoomSpan) {\n` +
    `      var cx2 = (view.xmin + view.xmax) / 2;\n` +
    `      var cy2 = (view.ymin + view.ymax) / 2;\n` +
    `      var s2 = CFG.maxZoomSpan / 2;\n` +
    `      var sH2 = s2 * (CFG.height / CFG.width);\n` +
    `      view.xmin = cx2 - s2; view.xmax = cx2 + s2;\n` +
    `      view.ymin = cy2 - sH2; view.ymax = cy2 + sH2;\n` +
    `    }\n` +
    `  }\n` +
    `\n` +
    `  var dragging = false, lastX = 0, lastY = 0, dragMoved = false;\n` +
    `  canvas.addEventListener('pointerdown', function(e) {\n` +
    `    if (e.shiftKey && CFG.mode === 'julia') {\n` +
    `      var p = pixelToPlane(e.offsetX, e.offsetY);\n` +
    `      cR = p.x; cI = p.y;\n` +
    `      if (cRIn) cRIn.value = String(cR);\n` +
    `      if (cIIn) cIIn.value = String(cI);\n` +
    `      if (cROut) cROut.textContent = fmt(cR);\n` +
    `      if (cIOut) cIOut.textContent = fmt(cI);\n` +
    `      updateReadout();\n` +
    `      queueRender();\n` +
    `      return;\n` +
    `    }\n` +
    `    dragging = true; dragMoved = false;\n` +
    `    lastX = e.clientX; lastY = e.clientY;\n` +
    `    if (canvas.setPointerCapture) try { canvas.setPointerCapture(e.pointerId); } catch (_) {}\n` +
    `  });\n` +
    `  canvas.addEventListener('pointermove', function(e) {\n` +
    `    if (!dragging) return;\n` +
    `    var rect = canvas.getBoundingClientRect();\n` +
    `    var dx = (e.clientX - lastX) / rect.width  * (view.xmax - view.xmin);\n` +
    `    var dy = (e.clientY - lastY) / rect.height * (view.ymax - view.ymin);\n` +
    `    if (Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY) > 2) dragMoved = true;\n` +
    `    view.xmin -= dx; view.xmax -= dx;\n` +
    `    view.ymin += dy; view.ymax += dy;\n` +
    `    lastX = e.clientX; lastY = e.clientY;\n` +
    `    clampSpan();\n` +
    `    updateReadout();\n` +
    `    queueRender();\n` +
    `  });\n` +
    `  function endDrag() { dragging = false; }\n` +
    `  canvas.addEventListener('pointerup', endDrag);\n` +
    `  canvas.addEventListener('pointercancel', endDrag);\n` +
    `  canvas.addEventListener('pointerleave', endDrag);\n` +
    `\n` +
    `  canvas.addEventListener('wheel', function(e) {\n` +
    `    e.preventDefault();\n` +
    `    var p = pixelToPlane(e.offsetX, e.offsetY);\n` +
    `    var k = e.deltaY > 0 ? 1.2 : 1 / 1.2;\n` +
    `    view.xmin = p.x + (view.xmin - p.x) * k;\n` +
    `    view.xmax = p.x + (view.xmax - p.x) * k;\n` +
    `    view.ymin = p.y + (view.ymin - p.y) * k;\n` +
    `    view.ymax = p.y + (view.ymax - p.y) * k;\n` +
    `    clampSpan();\n` +
    `    updateReadout();\n` +
    `    queueRender();\n` +
    `  }, { passive: false });\n` +
    `\n` +
    `  if (cRIn) cRIn.addEventListener('input', function() {\n` +
    `    cR = parseFloat(cRIn.value);\n` +
    `    if (cROut) cROut.textContent = fmt(cR);\n` +
    `    updateReadout();\n` +
    `    queueRender();\n` +
    `  });\n` +
    `  if (cIIn) cIIn.addEventListener('input', function() {\n` +
    `    cI = parseFloat(cIIn.value);\n` +
    `    if (cIOut) cIOut.textContent = fmt(cI);\n` +
    `    updateReadout();\n` +
    `    queueRender();\n` +
    `  });\n` +
    `  if (iterIn) iterIn.addEventListener('input', function() {\n` +
    `    iterMax = parseInt(iterIn.value, 10);\n` +
    `    if (iterOut) iterOut.textContent = String(iterMax);\n` +
    `    updateReadout();\n` +
    `    queueRender();\n` +
    `  });\n` +
    `  if (resetBtn) resetBtn.addEventListener('click', function() {\n` +
    `    view.xmin = CFG.xmin; view.xmax = CFG.xmax;\n` +
    `    view.ymin = CFG.ymin; view.ymax = CFG.ymax;\n` +
    `    iterMax = CFG.maxIterations;\n` +
    `    cR = CFG.cReal; cI = CFG.cImag;\n` +
    `    if (cRIn) cRIn.value = String(cR);\n` +
    `    if (cIIn) cIIn.value = String(cI);\n` +
    `    if (iterIn) iterIn.value = String(iterMax);\n` +
    `    if (cROut) cROut.textContent = fmt(cR);\n` +
    `    if (cIOut) cIOut.textContent = fmt(cI);\n` +
    `    if (iterOut) iterOut.textContent = String(iterMax);\n` +
    `    updateReadout();\n` +
    `    startRender();\n` +
    `  });\n` +
    `\n` +
    `  // Repaint on theme change so the palette tracks --bg / --ink / accent.\n` +
    `  // Refresh the cached pal first, then kick a render.\n` +
    `  var themeObserver = new MutationObserver(function() { pal = paletteRGB(); startRender(); });\n` +
    `  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });\n` +
    `\n` +
    `  updateReadout();\n` +
    `  startRender();\n` +
    `})();\n` +
    `</script>`
  );
}
