// diagram-editor widget — bespoke draggable + togglable commutative diagram.
//
// The reader can:
//   1. Drag any node — free, snap-to-grid, or fixed (drag disabled).
//   2. Toggle individual togglable arrows on/off (checkbox per arrow).
//   3. Read live evaluation of each declared `relation` (commute / exact)
//      against the current arrow set: ✓ if all referenced arrows are present
//      and the path endpoints resolve consistently, ✗ if endpoints fail,
//      ? if any referenced arrow is toggled off (indeterminate).
//   4. Reset the whole widget — restores initial node positions and turns all
//      togglable arrows back on.
//
// Rendering:
//   - SVG canvas. Nodes are rounded rects with a centered (KaTeX-rendered)
//     <foreignObject> label; arrows are <path> elements with kind-based
//     stroke styles (mono = hooked tail, epi = double head, iso = ≅ above,
//     dotted = dashed) and KaTeX-rendered labels above the midpoint.
//   - The chrome is a standard <div class="widget"> with .hd, an SVG, a
//     readout panel, a row of toggle checkboxes (one per togglable arrow),
//     and a reset button.
//
// All interaction lives in a single self-contained IIFE in renderScript —
// no page-global library dependency. Theme-aware via a MutationObserver on
// data-theme: the SVG paint attributes use var(--…) so a no-op redraw is
// enough to refresh hues on a theme flip.
//
// Both exports are pure functions of params. A React / SSR / any-frontend
// consumer can ignore renderScript and walk `nodes` + `arrows` + `relations`
// directly — the schema captures the full data model.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>

const DEFAULTS = {
  width: 480,
  height: 280,
  palette: 'violet',
  mode: 'snap-grid',
  relations: [],
};

function withDefaults(params) {
  return { ...DEFAULTS, ...params };
}

// ----- markup -----------------------------------------------------------

export function renderMarkup(params) {
  const p = withDefaults(params);
  const { widgetId, title, hint, width, height, arrows } = p;
  const hintHtml = hint
    ? `<div class="hint">${hint}</div>`
    : `<div class="hint">drag nodes · toggle arrows · watch relations update live</div>`;

  // Per-instance ids so multiple editors can coexist on a page.
  const svg = `${widgetId}-svg`;
  const ro = `${widgetId}-readout`;
  const toggles = `${widgetId}-toggles`;
  const reset = `${widgetId}-reset`;
  const status = `${widgetId}-status`;

  // Pre-render checkboxes for every togglable arrow so server-rendered HTML
  // is interactive even before JS executes (graceful degradation).
  const togglableArrows = (arrows || []).filter((a) => a.togglable);
  let togglesInner = '';
  if (togglableArrows.length > 0) {
    const items = togglableArrows.map((a) => {
      const cbId = `${widgetId}-toggle-${a.id}`;
      const lab = a.label
        ? `${a.label} (${a.from}→${a.to})`
        : `${a.from}→${a.to}`;
      return (
        `    <label class="small" for="${cbId}" ` +
        `style="display:inline-flex;align-items:center;gap:4px;margin-right:8px">` +
        `<input type="checkbox" id="${cbId}" data-arrow-id="${a.id}" checked> ` +
        `<span class="arrow-label">${lab}</span></label>`
      );
    });
    togglesInner = items.join('\n');
  }

  const lines = [];
  lines.push(`<div class="widget" id="${widgetId}">`);
  lines.push(`  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>`);
  lines.push(
    `  <svg id="${svg}" viewBox="0 0 ${width} ${height}" ` +
      `style="width:100%;max-width:${width}px;height:auto;display:block;` +
      `background:var(--panel2);border:1px solid var(--line);border-radius:6px;` +
      `touch-action:none;user-select:none" ` +
      `aria-label="${title}"><title>${title}</title></svg>`
  );
  if (togglableArrows.length > 0) {
    lines.push(
      `  <div class="row" id="${toggles}" style="flex-wrap:wrap;gap:4px;margin-top:8px">`
    );
    lines.push(togglesInner);
    lines.push(`  </div>`);
  } else {
    lines.push(`  <div class="row" id="${toggles}" style="display:none"></div>`);
  }
  lines.push(`  <div class="row" style="margin-top:8px">`);
  lines.push(
    `    <span class="small" id="${status}" style="color:var(--mute)"></span>`
  );
  lines.push(
    `    <button id="${reset}" type="button" style="margin-left:auto">reset</button>`
  );
  lines.push(`  </div>`);
  lines.push(`  <div class="readout" id="${ro}" style="min-height:1.6em"></div>`);
  lines.push(`</div>`);
  return lines.join('\n');
}

// ----- script -----------------------------------------------------------

export function renderScript(params) {
  const p = withDefaults(params);
  const cfg = JSON.stringify({
    widgetId: p.widgetId,
    width: p.width,
    height: p.height,
    palette: p.palette,
    mode: p.mode,
    nodes: p.nodes,
    arrows: p.arrows,
    relations: p.relations || [],
  });
  const banner = p.sectionComment ? `/* ${p.sectionComment} */\n` : '';
  return (
    `<script>\n` +
    banner +
    `(function(){\n` +
    `  var CFG = ${cfg};\n` +
    `  var ROOT = document.getElementById(CFG.widgetId);\n` +
    `  if (!ROOT) return;\n` +
    `  var SVGNS = 'http://www.w3.org/2000/svg';\n` +
    `  var XHTMLNS = 'http://www.w3.org/1999/xhtml';\n` +
    `\n` +
    `  // ---- DOM refs ------------------------------------------------------\n` +
    `  var svg       = document.getElementById(CFG.widgetId + '-svg');\n` +
    `  var readout   = document.getElementById(CFG.widgetId + '-readout');\n` +
    `  var statusEl  = document.getElementById(CFG.widgetId + '-status');\n` +
    `  var resetBtn  = document.getElementById(CFG.widgetId + '-reset');\n` +
    `  var toggleBar = document.getElementById(CFG.widgetId + '-toggles');\n` +
    `  if (!svg || !readout) return;\n` +
    `\n` +
    `  // ---- state ---------------------------------------------------------\n` +
    `  // Working copy of node positions in SVG user-space (pixels), seeded\n` +
    `  // from CFG.nodes[i].{x,y} ratios. Drag mutates this; reset restores it.\n` +
    `  var positions = Object.create(null);\n` +
    `  var initialPositions = Object.create(null);\n` +
    `  for (var i = 0; i < CFG.nodes.length; i++) {\n` +
    `    var n = CFG.nodes[i];\n` +
    `    var px = clamp(n.x * CFG.width, 28, CFG.width - 28);\n` +
    `    var py = clamp(n.y * CFG.height, 22, CFG.height - 22);\n` +
    `    if (CFG.mode === 'snap-grid') {\n` +
    `      var snapped = snapToGrid(px, py);\n` +
    `      px = snapped.x; py = snapped.y;\n` +
    `    }\n` +
    `    positions[n.id] = { x: px, y: py };\n` +
    `    initialPositions[n.id] = { x: px, y: py };\n` +
    `  }\n` +
    `\n` +
    `  // Working set of present arrow ids (togglable arrows can drop out).\n` +
    `  var arrowsOn = Object.create(null);\n` +
    `  for (var ai = 0; ai < CFG.arrows.length; ai++) arrowsOn[CFG.arrows[ai].id] = true;\n` +
    `\n` +
    `  var byArrowId = Object.create(null);\n` +
    `  for (var aj = 0; aj < CFG.arrows.length; aj++) byArrowId[CFG.arrows[aj].id] = CFG.arrows[aj];\n` +
    `  var byNodeId = Object.create(null);\n` +
    `  for (var nk = 0; nk < CFG.nodes.length; nk++) byNodeId[CFG.nodes[nk].id] = CFG.nodes[nk];\n` +
    `\n` +
    `  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }\n` +
    `  function snapToGrid(x, y) {\n` +
    `    // 6 columns x 4 rows, with a one-cell inset margin so nodes don't kiss the edge.\n` +
    `    var COLS = 6, ROWS = 4;\n` +
    `    var marginX = CFG.width / (COLS + 1);\n` +
    `    var marginY = CFG.height / (ROWS + 1);\n` +
    `    var cellW = (CFG.width - 2 * marginX) / (COLS - 1);\n` +
    `    var cellH = (CFG.height - 2 * marginY) / (ROWS - 1);\n` +
    `    var c = Math.round((x - marginX) / cellW);\n` +
    `    var r = Math.round((y - marginY) / cellH);\n` +
    `    c = clamp(c, 0, COLS - 1);\n` +
    `    r = clamp(r, 0, ROWS - 1);\n` +
    `    return { x: marginX + c * cellW, y: marginY + r * cellH };\n` +
    `  }\n` +
    `\n` +
    `  // ---- KaTeX helper --------------------------------------------------\n` +
    `  function typesetIn(el) {\n` +
    `    if (window.renderMathInElement) {\n` +
    `      try {\n` +
    `        window.renderMathInElement(el, {\n` +
    `          delimiters: [\n` +
    `            { left: '$$', right: '$$', display: true },\n` +
    `            { left: '$',  right: '$',  display: false },\n` +
    `            { left: '\\\\(', right: '\\\\)', display: false },\n` +
    `            { left: '\\\\[', right: '\\\\]', display: true }\n` +
    `          ],\n` +
    `          throwOnError: false\n` +
    `        });\n` +
    `      } catch (_) { /* swallow KaTeX errors so the page stays alive */ }\n` +
    `    }\n` +
    `  }\n` +
    `\n` +
    `  // ---- SVG element factory ------------------------------------------\n` +
    `  function el(tag, attrs) {\n` +
    `    var e = document.createElementNS(SVGNS, tag);\n` +
    `    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);\n` +
    `    return e;\n` +
    `  }\n` +
    `\n` +
    `  // Ensure a marker (arrowhead) of a given color exists in <defs>.\n` +
    `  function ensureMarker(defs, id, color, kind) {\n` +
    `    if (defs.querySelector('#' + id)) return;\n` +
    `    var marker = el('marker', {\n` +
    `      id: id,\n` +
    `      viewBox: '0 0 10 10',\n` +
    `      refX: kind === 'epi' ? '11' : '9',\n` +
    `      refY: '5',\n` +
    `      markerWidth: '7', markerHeight: '7',\n` +
    `      orient: 'auto-start-reverse'\n` +
    `    });\n` +
    `    if (kind === 'epi') {\n` +
    `      // Double head: two stacked triangles (close to the canonical ↠ glyph).\n` +
    `      var p1 = el('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: color });\n` +
    `      var p2 = el('path', { d: 'M -6 0 L 4 5 L -6 10 z', fill: color });\n` +
    `      marker.appendChild(p1);\n` +
    `      marker.appendChild(p2);\n` +
    `    } else {\n` +
    `      var p = el('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: color });\n` +
    `      marker.appendChild(p);\n` +
    `    }\n` +
    `    defs.appendChild(marker);\n` +
    `  }\n` +
    `\n` +
    `  // For monos: a hooked-tail marker.\n` +
    `  function ensureTailMarker(defs, id, color) {\n` +
    `    if (defs.querySelector('#' + id)) return;\n` +
    `    var marker = el('marker', {\n` +
    `      id: id,\n` +
    `      viewBox: '-2 -6 14 12',\n` +
    `      refX: '0', refY: '0',\n` +
    `      markerWidth: '8', markerHeight: '8',\n` +
    `      orient: 'auto'\n` +
    `    });\n` +
    `    var p = el('path', {\n` +
    `      d: 'M 8 -5 A 5 5 0 0 0 8 5',\n` +
    `      fill: 'none', stroke: color, 'stroke-width': '1.6'\n` +
    `    });\n` +
    `    marker.appendChild(p);\n` +
    `    defs.appendChild(marker);\n` +
    `  }\n` +
    `\n` +
    `  // ---- geometry helpers ---------------------------------------------\n` +
    `  function nodeBox(nid) {\n` +
    `    // Bounding half-width / half-height for arrow trimming. Match\n` +
    `    // renderNode's rect dimensions.\n` +
    `    return { hw: 26, hh: 17 };\n` +
    `  }\n` +
    `  function trimToBox(p1, p2, box1, box2) {\n` +
    `    // Trim the (p1, p2) segment so its endpoints sit on the rect borders\n` +
    `    // around p1 and p2. Returns { a, b } trimmed endpoints.\n` +
    `    function clipAtBox(c, p, hw, hh) {\n` +
    `      var dx = p.x - c.x, dy = p.y - c.y;\n` +
    `      if (dx === 0 && dy === 0) return c;\n` +
    `      var tx = Math.abs(dx) > 0 ? hw / Math.abs(dx) : Infinity;\n` +
    `      var ty = Math.abs(dy) > 0 ? hh / Math.abs(dy) : Infinity;\n` +
    `      var t = Math.min(tx, ty);\n` +
    `      return { x: c.x + dx * t, y: c.y + dy * t };\n` +
    `    }\n` +
    `    return {\n` +
    `      a: clipAtBox(p1, p2, box1.hw + 4, box1.hh + 4),\n` +
    `      b: clipAtBox(p2, p1, box2.hw + 4, box2.hh + 4)\n` +
    `    };\n` +
    `  }\n` +
    `\n` +
    `  // ---- relation evaluation ------------------------------------------\n` +
    `  // Returns one of: 'sat' | 'vio' | 'ind' (indeterminate)\n` +
    `  // - 'sat' = every referenced arrow is on AND endpoints resolve consistently\n` +
    `  // - 'vio' = every referenced arrow is on BUT endpoints fail to align\n` +
    `  //           (e.g. lhs ends at X but rhs ends at Y, or 'exact' chains miss "at")\n` +
    `  // - 'ind' = at least one referenced arrow is off — relation is undefined\n` +
    `  function pathEndpoints(arrowIds) {\n` +
    `    if (!arrowIds || arrowIds.length === 0) return null;\n` +
    `    var first = byArrowId[arrowIds[0]];\n` +
    `    var last  = byArrowId[arrowIds[arrowIds.length - 1]];\n` +
    `    if (!first || !last) return null;\n` +
    `    // Validate composability: each step's "to" must equal the next step's "from".\n` +
    `    for (var i = 0; i + 1 < arrowIds.length; i++) {\n` +
    `      var hi = byArrowId[arrowIds[i]];\n` +
    `      var lo = byArrowId[arrowIds[i + 1]];\n` +
    `      if (!hi || !lo) return null;\n` +
    `      if (hi.to !== lo.from) return { from: first.from, to: last.to, composable: false };\n` +
    `    }\n` +
    `    return { from: first.from, to: last.to, composable: true };\n` +
    `  }\n` +
    `  function evalRelation(rel) {\n` +
    `    var ids = (rel.lhs || []).concat(rel.rhs || []);\n` +
    `    for (var i = 0; i < ids.length; i++) {\n` +
    `      if (!arrowsOn[ids[i]]) return 'ind';\n` +
    `      if (!byArrowId[ids[i]]) return 'vio';\n` +
    `    }\n` +
    `    if (rel.kind === 'commute') {\n` +
    `      var l = pathEndpoints(rel.lhs);\n` +
    `      var r = pathEndpoints(rel.rhs);\n` +
    `      if (!l || !r) return 'vio';\n` +
    `      if (!l.composable || !r.composable) return 'vio';\n` +
    `      if (l.from !== r.from || l.to !== r.to) return 'vio';\n` +
    `      return 'sat';\n` +
    `    }\n` +
    `    if (rel.kind === 'exact') {\n` +
    `      var lh = pathEndpoints(rel.lhs);\n` +
    `      var rh = pathEndpoints(rel.rhs);\n` +
    `      if (!lh || !rh) return 'vio';\n` +
    `      if (!lh.composable || !rh.composable) return 'vio';\n` +
    `      if (lh.to !== rel.at) return 'vio';\n` +
    `      if (rh.from !== rel.at) return 'vio';\n` +
    `      return 'sat';\n` +
    `    }\n` +
    `    return 'ind';\n` +
    `  }\n` +
    `\n` +
    `  // ---- rendering -----------------------------------------------------\n` +
    `  function renderArrow(arrow, accent, defs) {\n` +
    `    var from = positions[arrow.from], to = positions[arrow.to];\n` +
    `    if (!from || !to) return null;\n` +
    `    var box1 = nodeBox(arrow.from), box2 = nodeBox(arrow.to);\n` +
    `    var trimmed = trimToBox(from, to, box1, box2);\n` +
    `    var a = trimmed.a, b = trimmed.b;\n` +
    `    // Curve: perpendicular bow.\n` +
    `    var dx = b.x - a.x, dy = b.y - a.y;\n` +
    `    var len = Math.sqrt(dx*dx + dy*dy) || 1;\n` +
    `    var nx = -dy / len, ny = dx / len;\n` +
    `    var bow = arrow.curve || 0;\n` +
    `    var mx = (a.x + b.x) / 2 + nx * bow;\n` +
    `    var my = (a.y + b.y) / 2 + ny * bow;\n` +
    `    var d = bow === 0\n` +
    `      ? 'M ' + a.x + ' ' + a.y + ' L ' + b.x + ' ' + b.y\n` +
    `      : 'M ' + a.x + ' ' + a.y + ' Q ' + mx + ' ' + my + ' ' + b.x + ' ' + b.y;\n` +
    `\n` +
    `    var kind = arrow.kind || 'morphism';\n` +
    `    var dashed = kind === 'dotted';\n` +
    `    var color = kind === 'dotted' ? 'var(--mute)' : 'var(--ink)';\n` +
    `    var headId = CFG.widgetId + '-head-' + kind;\n` +
    `    if (kind === 'epi') ensureMarker(defs, headId, color, 'epi');\n` +
    `    else ensureMarker(defs, headId, color, 'plain');\n` +
    `    var attrs = {\n` +
    `      d: d, fill: 'none', stroke: color,\n` +
    `      'stroke-width': '1.6',\n` +
    `      'marker-end': 'url(#' + headId + ')',\n` +
    `      'data-arrow-id': arrow.id\n` +
    `    };\n` +
    `    if (dashed) attrs['stroke-dasharray'] = '5 4';\n` +
    `    if (kind === 'mono') {\n` +
    `      var tailId = CFG.widgetId + '-tail-mono';\n` +
    `      ensureTailMarker(defs, tailId, color);\n` +
    `      attrs['marker-start'] = 'url(#' + tailId + ')';\n` +
    `    }\n` +
    `    var path = el('path', attrs);\n` +
    `    var g = el('g', { 'class': 'arrow', 'data-arrow-id': arrow.id });\n` +
    `    g.appendChild(path);\n` +
    `\n` +
    `    // ≅ glyph above the midpoint, for iso arrows.\n` +
    `    if (kind === 'iso') {\n` +
    `      var iso = el('text', {\n` +
    `        x: String(mx), y: String(my - 8),\n` +
    `        'text-anchor': 'middle',\n` +
    `        'font-size': '14',\n` +
    `        'font-style': 'italic',\n` +
    `        fill: accent\n` +
    `      });\n` +
    `      iso.textContent = '≅';\n` +
    `      g.appendChild(iso);\n` +
    `    }\n` +
    `\n` +
    `    // Label rendered into a foreignObject so KaTeX works.\n` +
    `    if (arrow.label) {\n` +
    `      // Position label slightly off the path on the bow side.\n` +
    `      var lx = mx + nx * 12;\n` +
    `      var ly = my + ny * 12;\n` +
    `      var fo = el('foreignObject', {\n` +
    `        x: String(lx - 40), y: String(ly - 12),\n` +
    `        width: '80', height: '24',\n` +
    `        style: 'pointer-events:none;overflow:visible'\n` +
    `      });\n` +
    `      var div = document.createElementNS(XHTMLNS, 'div');\n` +
    `      div.setAttribute('xmlns', XHTMLNS);\n` +
    `      div.style.cssText = 'text-align:center;font-size:13px;color:var(--ink);font-style:italic;line-height:1.2';\n` +
    `      div.textContent = arrow.label;\n` +
    `      fo.appendChild(div);\n` +
    `      g.appendChild(fo);\n` +
    `      // KaTeX-typeset the label asynchronously (after the SVG is in the DOM).\n` +
    `      pendingTypeset.push(div);\n` +
    `    }\n` +
    `    return g;\n` +
    `  }\n` +
    `\n` +
    `  function renderNode(node, accent) {\n` +
    `    var pos = positions[node.id];\n` +
    `    if (!pos) return null;\n` +
    `    var hw = 26, hh = 17;\n` +
    `    var nodeColor = node.color === 'ink' || !node.color ? 'var(--ink)' : 'var(--' + node.color + ')';\n` +
    `    var g = el('g', {\n` +
    `      'class': 'node',\n` +
    `      'data-node-id': node.id,\n` +
    `      transform: 'translate(' + pos.x + ',' + pos.y + ')',\n` +
    `      style: CFG.mode === 'fixed' ? 'cursor:default' : 'cursor:grab'\n` +
    `    });\n` +
    `    var rect = el('rect', {\n` +
    `      x: String(-hw), y: String(-hh),\n` +
    `      width: String(2 * hw), height: String(2 * hh),\n` +
    `      rx: '6', ry: '6',\n` +
    `      fill: 'var(--panel)',\n` +
    `      stroke: nodeColor, 'stroke-width': '1.4'\n` +
    `    });\n` +
    `    g.appendChild(rect);\n` +
    `    var fo = el('foreignObject', {\n` +
    `      x: String(-hw + 2), y: String(-hh + 2),\n` +
    `      width: String(2 * hw - 4), height: String(2 * hh - 4),\n` +
    `      style: 'pointer-events:none;overflow:visible'\n` +
    `    });\n` +
    `    var div = document.createElementNS(XHTMLNS, 'div');\n` +
    `    div.setAttribute('xmlns', XHTMLNS);\n` +
    `    div.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:13px;color:' + nodeColor + ';font-weight:600';\n` +
    `    div.textContent = node.label;\n` +
    `    fo.appendChild(div);\n` +
    `    g.appendChild(fo);\n` +
    `    pendingTypeset.push(div);\n` +
    `    var t = el('title');\n` +
    `    t.textContent = node.label + (CFG.mode !== 'fixed' ? ' — drag to move' : '');\n` +
    `    g.appendChild(t);\n` +
    `    return g;\n` +
    `  }\n` +
    `\n` +
    `  var pendingTypeset = [];\n` +
    `\n` +
    `  function renderAll() {\n` +
    `    while (svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    pendingTypeset = [];\n` +
    `    var accent = 'var(--' + CFG.palette + ')';\n` +
    `    var defs = el('defs');\n` +
    `    svg.appendChild(defs);\n` +
    `\n` +
    `    // Arrows first, so node rects overlay arrow ends cleanly.\n` +
    `    var arrowsGroup = el('g', { 'class': 'arrows' });\n` +
    `    svg.appendChild(arrowsGroup);\n` +
    `    for (var i = 0; i < CFG.arrows.length; i++) {\n` +
    `      var a = CFG.arrows[i];\n` +
    `      if (!arrowsOn[a.id]) continue;\n` +
    `      var g = renderArrow(a, accent, defs);\n` +
    `      if (g) arrowsGroup.appendChild(g);\n` +
    `    }\n` +
    `\n` +
    `    // Nodes.\n` +
    `    var nodesGroup = el('g', { 'class': 'nodes' });\n` +
    `    svg.appendChild(nodesGroup);\n` +
    `    for (var j = 0; j < CFG.nodes.length; j++) {\n` +
    `      var n = CFG.nodes[j];\n` +
    `      var ng = renderNode(n, accent);\n` +
    `      if (ng) nodesGroup.appendChild(ng);\n` +
    `    }\n` +
    `\n` +
    `    // KaTeX-typeset all freshly-inserted labels in one pass.\n` +
    `    for (var k = 0; k < pendingTypeset.length; k++) {\n` +
    `      typesetIn(pendingTypeset[k]);\n` +
    `    }\n` +
    `\n` +
    `    renderRelations();\n` +
    `    renderStatus();\n` +
    `  }\n` +
    `\n` +
    `  function renderRelations() {\n` +
    `    var rels = CFG.relations || [];\n` +
    `    if (rels.length === 0) {\n` +
    `      readout.innerHTML = '<span class=\"small\" style=\"color:var(--mute)\">no relations declared — drag and toggle freely</span>';\n` +
    `      return;\n` +
    `    }\n` +
    `    var lines = [];\n` +
    `    var accent = 'var(--' + CFG.palette + ')';\n` +
    `    for (var i = 0; i < rels.length; i++) {\n` +
    `      var rel = rels[i];\n` +
    `      var status = evalRelation(rel);\n` +
    `      var glyph, color;\n` +
    `      if (status === 'sat') { glyph = '✓'; color = accent; }\n` +
    `      else if (status === 'ind') { glyph = '?'; color = 'var(--mute)'; }\n` +
    `      else { glyph = '✗'; color = 'var(--pink)'; }\n` +
    `      var label = rel.label;\n` +
    `      if (!label) {\n` +
    `        if (rel.kind === 'commute') {\n` +
    `          label = '<span class=\"k\">' + (rel.lhs || []).join(' ∘ ') + '</span> = <span class=\"k\">' + (rel.rhs || []).join(' ∘ ') + '</span>';\n` +
    `        } else if (rel.kind === 'exact') {\n` +
    `          label = 'exact at ' + rel.at;\n` +
    `        } else {\n` +
    `          label = rel.kind;\n` +
    `        }\n` +
    `      }\n` +
    `      lines.push('<div style=\"display:flex;gap:6px;align-items:baseline\">' +\n` +
    `        '<span style=\"color:' + color + ';font-weight:700;width:1em\">' + glyph + '</span>' +\n` +
    `        '<span style=\"color:var(--ink)\">' + label + '</span></div>');\n` +
    `    }\n` +
    `    readout.innerHTML = lines.join('');\n` +
    `    // KaTeX-typeset any LaTeX that snuck in via labels.\n` +
    `    typesetIn(readout);\n` +
    `  }\n` +
    `\n` +
    `  function renderStatus() {\n` +
    `    if (!statusEl) return;\n` +
    `    var on = 0, total = 0;\n` +
    `    for (var i = 0; i < CFG.arrows.length; i++) {\n` +
    `      total++;\n` +
    `      if (arrowsOn[CFG.arrows[i].id]) on++;\n` +
    `    }\n` +
    `    var modeLabel = CFG.mode === 'free' ? 'free drag' :\n` +
    `                    CFG.mode === 'snap-grid' ? 'snap to grid' : 'drag locked';\n` +
    `    statusEl.textContent = on + '/' + total + ' arrows on · ' + modeLabel;\n` +
    `  }\n` +
    `\n` +
    `  // ---- drag handling -------------------------------------------------\n` +
    `  var dragNodeId = null;\n` +
    `  var dragOffset = { x: 0, y: 0 };\n` +
    `\n` +
    `  function svgPointFromEvent(e) {\n` +
    `    var rect = svg.getBoundingClientRect();\n` +
    `    var sx = CFG.width / rect.width;\n` +
    `    var sy = CFG.height / rect.height;\n` +
    `    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };\n` +
    `  }\n` +
    `\n` +
    `  if (CFG.mode !== 'fixed') {\n` +
    `    svg.addEventListener('pointerdown', function(e){\n` +
    `      var target = e.target;\n` +
    `      // Walk up to nearest <g class=\"node\"> so clicks on rect / text inside still register.\n` +
    `      var nodeG = null, cur = target;\n` +
    `      while (cur && cur !== svg) {\n` +
    `        if (cur.getAttribute && cur.getAttribute('data-node-id')) { nodeG = cur; break; }\n` +
    `        cur = cur.parentNode;\n` +
    `      }\n` +
    `      if (!nodeG) return;\n` +
    `      dragNodeId = nodeG.getAttribute('data-node-id');\n` +
    `      var pt = svgPointFromEvent(e);\n` +
    `      var pos = positions[dragNodeId];\n` +
    `      dragOffset.x = pt.x - pos.x;\n` +
    `      dragOffset.y = pt.y - pos.y;\n` +
    `      nodeG.style.cursor = 'grabbing';\n` +
    `      if (svg.setPointerCapture) try { svg.setPointerCapture(e.pointerId); } catch (_) {}\n` +
    `      e.preventDefault();\n` +
    `    });\n` +
    `    // rAF-coalesce live-drag re-renders. At display refresh rate (60-120 Hz)\n` +
    `    // raw pointermove fires faster than the full renderAll (which rebuilds\n` +
    `    // every node + arrow + KaTeX label) can finish. Without coalescing, drag\n` +
    `    // queues rebuilds that supersede each other before pixels appear. With\n` +
    `    // coalescing, at most one rebuild per frame.\n` +
    `    var dragRafQueued = false;\n` +
    `    function scheduleDragRender(){\n` +
    `      if (dragRafQueued) return;\n` +
    `      dragRafQueued = true;\n` +
    `      requestAnimationFrame(function(){ dragRafQueued = false; renderAll(); });\n` +
    `    }\n` +
    `    svg.addEventListener('pointermove', function(e){\n` +
    `      if (!dragNodeId) return;\n` +
    `      var pt = svgPointFromEvent(e);\n` +
    `      var nx = clamp(pt.x - dragOffset.x, 28, CFG.width - 28);\n` +
    `      var ny = clamp(pt.y - dragOffset.y, 22, CFG.height - 22);\n` +
    `      positions[dragNodeId] = { x: nx, y: ny };\n` +
    `      scheduleDragRender();\n` +
    `    });\n` +
    `    function endDrag() {\n` +
    `      if (!dragNodeId) return;\n` +
    `      if (CFG.mode === 'snap-grid') {\n` +
    `        var p = positions[dragNodeId];\n` +
    `        var snapped = snapToGrid(p.x, p.y);\n` +
    `        positions[dragNodeId] = snapped;\n` +
    `        renderAll();\n` +
    `      }\n` +
    `      dragNodeId = null;\n` +
    `    }\n` +
    `    svg.addEventListener('pointerup', endDrag);\n` +
    `    svg.addEventListener('pointercancel', endDrag);\n` +
    `    svg.addEventListener('pointerleave', endDrag);\n` +
    `  }\n` +
    `\n` +
    `  // ---- toggle wiring -------------------------------------------------\n` +
    `  if (toggleBar) {\n` +
    `    toggleBar.addEventListener('change', function(e){\n` +
    `      var t = e.target;\n` +
    `      if (!t || t.tagName !== 'INPUT' || t.type !== 'checkbox') return;\n` +
    `      var id = t.getAttribute('data-arrow-id');\n` +
    `      if (!id) return;\n` +
    `      arrowsOn[id] = !!t.checked;\n` +
    `      renderAll();\n` +
    `    });\n` +
    `  }\n` +
    `\n` +
    `  // ---- reset ---------------------------------------------------------\n` +
    `  if (resetBtn) resetBtn.addEventListener('click', function(){\n` +
    `    for (var id in initialPositions) {\n` +
    `      positions[id] = { x: initialPositions[id].x, y: initialPositions[id].y };\n` +
    `    }\n` +
    `    for (var aid in arrowsOn) arrowsOn[aid] = true;\n` +
    `    if (toggleBar) {\n` +
    `      var inputs = toggleBar.querySelectorAll('input[type=\"checkbox\"]');\n` +
    `      for (var i = 0; i < inputs.length; i++) inputs[i].checked = true;\n` +
    `    }\n` +
    `    renderAll();\n` +
    `  });\n` +
    `\n` +
    `  // Theme observer — repaint so accent colors track --bg / --ink / accent.\n` +
    `  var themeObserver = new MutationObserver(function(){ renderAll(); });\n` +
    `  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });\n` +
    `\n` +
    `  renderAll();\n` +
    `})();\n` +
    `</script>`
  );
}
