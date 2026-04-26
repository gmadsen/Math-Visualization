// branching-proof-scrubber widget — bespoke tree-shaped sibling of
// proof-scrubber. The proof is a node graph (a tree, in practice): some
// nodes are forks where the reader picks a tactic and the consequent
// chain plays out. Used for proofs by contradiction vs. construction,
// case-splits, "try induction / try direct / try contrapositive", etc.
//
// Renders the entire tree as a top-down SVG (rounded-rect nodes + edges),
// highlights the reader's chosen path in the configured palette accent,
// dims untraversed branches, and marks dead-ends with a red ✗.  Below
// the SVG: a card showing the current node's `prompt` (KaTeX-rendered),
// prev / next step buttons, and at fork nodes a row of branch buttons —
// one per child, labeled with `branchLabel`.  A breadcrumb traces the
// chosen path; reset returns to the root.
//
// All chrome and rendering is in a single self-contained IIFE in
// renderScript — no page-global library dependency, no fetch, file://
// safe.  Theme-aware via CSS custom properties; a MutationObserver on
// `data-theme` triggers a redraw on theme flip.
//
// Both exports are pure functions of params.  A React / SSR consumer
// can ignore renderScript entirely and walk the same `nodes` array
// directly — the schema captures the full data model.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>

const DEFAULTS = {
  width: 520,
  height: 280,
  palette: 'cyan',
};

function withDefaults(params) {
  return { ...DEFAULTS, ...params };
}

// ----- markup -----------------------------------------------------------

export function renderMarkup(params) {
  const p = withDefaults(params);
  const { widgetId, title, hint, width, height } = p;
  const hintHtml = hint
    ? `<div class="hint">${hint}</div>`
    : `<div class="hint">click a node · pick a branch at forks · ←/→ scrub · reset to start over</div>`;

  // Per-instance ids (so multiple branching scrubbers can coexist).
  const svg = `${widgetId}-svg`;
  const ro = `${widgetId}-readout`;
  const crumb = `${widgetId}-crumb`;
  const prev = `${widgetId}-prev`;
  const next = `${widgetId}-next`;
  const reset = `${widgetId}-reset`;
  const branches = `${widgetId}-branches`;
  const stepTitle = `${widgetId}-step-title`;

  const lines = [];
  lines.push(`<div class="widget" id="${widgetId}">`);
  lines.push(`  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>`);
  lines.push(
    `  <svg id="${svg}" viewBox="0 0 ${width} ${height}" ` +
      `style="width:100%;max-width:${width}px;height:auto;display:block;` +
      `background:var(--panel2);border:1px solid var(--line);border-radius:6px" ` +
      `aria-label="proof tree" data-current=""></svg>`
  );
  lines.push(
    `  <div class="row" id="${branches}" ` +
      `style="flex-wrap:wrap;gap:6px;margin-top:8px;display:none"></div>`
  );
  lines.push(`  <div class="row" style="margin-top:8px">`);
  lines.push(`    <button id="${prev}" type="button">← step</button>`);
  lines.push(`    <button id="${next}" type="button">step →</button>`);
  lines.push(
    `    <button id="${reset}" type="button" style="margin-left:auto">reset</button>`
  );
  lines.push(`  </div>`);
  lines.push(
    `  <div class="readout" id="${ro}" style="min-height:3.2em">` +
      `<div id="${stepTitle}" style="color:var(--mute);font-size:.85em;margin-bottom:4px"></div>` +
      `<div class="prompt"></div></div>`
  );
  lines.push(
    `  <div class="note" id="${crumb}" ` +
      `style="margin-top:6px;color:var(--mute);font-size:.85em"></div>`
  );
  lines.push(`</div>`);
  return lines.join('\n');
}

// ----- script -----------------------------------------------------------

export function renderScript(params) {
  const p = withDefaults(params);
  // Serialize the full config as a JSON literal.  All KaTeX strings + HTML
  // round-trip via JSON.stringify, no escaping surprises.
  const cfg = JSON.stringify({
    widgetId: p.widgetId,
    rootId: p.rootId,
    nodes: p.nodes,
    width: p.width,
    height: p.height,
    palette: p.palette,
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
    `\n` +
    `  // ---- DOM refs ------------------------------------------------------\n` +
    `  var svg       = document.getElementById(CFG.widgetId + '-svg');\n` +
    `  var readout   = document.getElementById(CFG.widgetId + '-readout');\n` +
    `  var promptEl  = readout ? readout.querySelector('.prompt') : null;\n` +
    `  var titleEl   = document.getElementById(CFG.widgetId + '-step-title');\n` +
    `  var crumbEl   = document.getElementById(CFG.widgetId + '-crumb');\n` +
    `  var prevBtn   = document.getElementById(CFG.widgetId + '-prev');\n` +
    `  var nextBtn   = document.getElementById(CFG.widgetId + '-next');\n` +
    `  var resetBtn  = document.getElementById(CFG.widgetId + '-reset');\n` +
    `  var branchBar = document.getElementById(CFG.widgetId + '-branches');\n` +
    `  if (!svg || !readout || !promptEl) return;\n` +
    `\n` +
    `  // ---- index nodes ---------------------------------------------------\n` +
    `  var byId = Object.create(null);\n` +
    `  for (var i = 0; i < CFG.nodes.length; i++) {\n` +
    `    var n = CFG.nodes[i];\n` +
    `    byId[n.id] = n;\n` +
    `  }\n` +
    `  if (!byId[CFG.rootId]) return;\n` +
    `\n` +
    `  // ---- tree layout (top-down) ---------------------------------------\n` +
    `  // Walk reachable nodes from root; assign each a depth (y) and a leaf\n` +
    `  // ordering (x slot).  Layout is computed once because the tree shape\n` +
    `  // is static — only the highlighted path changes.\n` +
    `  var layout = computeLayout();\n` +
    `\n` +
    `  function computeLayout() {\n` +
    `    var depth = Object.create(null);\n` +
    `    var leafSlot = Object.create(null);\n` +
    `    var subtreeSpan = Object.create(null);\n` +
    `    var nextSlot = { v: 0 };\n` +
    `    var maxDepth = 0;\n` +
    `\n` +
    `    function visit(id, d) {\n` +
    `      if (depth[id] !== undefined) return; // already visited (DAG-safe)\n` +
    `      depth[id] = d;\n` +
    `      if (d > maxDepth) maxDepth = d;\n` +
    `      var node = byId[id];\n` +
    `      if (!node) { leafSlot[id] = nextSlot.v++; subtreeSpan[id] = [leafSlot[id], leafSlot[id]]; return; }\n` +
    `      var kids = node.children || [];\n` +
    `      if (kids.length === 0) {\n` +
    `        leafSlot[id] = nextSlot.v++;\n` +
    `        subtreeSpan[id] = [leafSlot[id], leafSlot[id]];\n` +
    `        return;\n` +
    `      }\n` +
    `      var lo = Infinity, hi = -Infinity;\n` +
    `      for (var k = 0; k < kids.length; k++) {\n` +
    `        visit(kids[k], d + 1);\n` +
    `        var span = subtreeSpan[kids[k]] || [leafSlot[kids[k]], leafSlot[kids[k]]];\n` +
    `        if (span[0] < lo) lo = span[0];\n` +
    `        if (span[1] > hi) hi = span[1];\n` +
    `      }\n` +
    `      subtreeSpan[id] = [lo, hi];\n` +
    `    }\n` +
    `    visit(CFG.rootId, 0);\n` +
    `\n` +
    `    var totalLeaves = nextSlot.v;\n` +
    `    var marginX = 24, marginY = 28;\n` +
    `    var usableW = CFG.width - 2 * marginX;\n` +
    `    var usableH = CFG.height - 2 * marginY;\n` +
    `    var levelDy = maxDepth > 0 ? usableH / maxDepth : 0;\n` +
    `    var slotDx = totalLeaves > 1 ? usableW / (totalLeaves - 1) : 0;\n` +
    `\n` +
    `    var pos = Object.create(null);\n` +
    `    for (var id in depth) {\n` +
    `      var span = subtreeSpan[id] || [leafSlot[id], leafSlot[id]];\n` +
    `      var slot = (span[0] + span[1]) / 2;\n` +
    `      var x = totalLeaves > 1 ? marginX + slot * slotDx : CFG.width / 2;\n` +
    `      var y = marginY + depth[id] * levelDy;\n` +
    `      pos[id] = { x: x, y: y, depth: depth[id] };\n` +
    `    }\n` +
    `    return { pos: pos, maxDepth: maxDepth, totalLeaves: totalLeaves };\n` +
    `  }\n` +
    `\n` +
    `  // ---- state ---------------------------------------------------------\n` +
    `  // history is the chain of node ids the reader has traversed so far,\n` +
    `  // ending in the current node.  At a fork, the next step is unknown\n` +
    `  // until the reader clicks a branch button.\n` +
    `  var history = [CFG.rootId];\n` +
    `\n` +
    `  function currentId() { return history[history.length - 1]; }\n` +
    `  function currentNode() { return byId[currentId()]; }\n` +
    `\n` +
    `  // ---- rendering: tree SVG ------------------------------------------\n` +
    `  function el(tag, attrs) {\n` +
    `    var e = document.createElementNS(SVGNS, tag);\n` +
    `    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);\n` +
    `    return e;\n` +
    `  }\n` +
    `  function pathOnHistory(id) {\n` +
    `    return history.indexOf(id) !== -1;\n` +
    `  }\n` +
    `  function descendantOfHistory(id) {\n` +
    `    // Was this node ever reached or could be reached on the current path?\n` +
    `    // For the highlight we just check membership in history.\n` +
    `    return pathOnHistory(id);\n` +
    `  }\n` +
    `\n` +
    `  function renderTree() {\n` +
    `    while (svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    svg.setAttribute('data-current', currentId());\n` +
    `\n` +
    `    var accent = 'var(--' + CFG.palette + ')';\n` +
    `    var pos = layout.pos;\n` +
    `\n` +
    `    // ---- edges (drawn first so nodes overlay) -----------------------\n` +
    `    var edgesGroup = el('g', { 'class': 'edges' });\n` +
    `    svg.appendChild(edgesGroup);\n` +
    `    for (var i = 0; i < CFG.nodes.length; i++) {\n` +
    `      var n = CFG.nodes[i];\n` +
    `      if (!pos[n.id]) continue;\n` +
    `      var kids = n.children || [];\n` +
    `      for (var k = 0; k < kids.length; k++) {\n` +
    `        var childId = kids[k];\n` +
    `        if (!pos[childId]) continue;\n` +
    `        var p1 = pos[n.id], p2 = pos[childId];\n` +
    `        var onPath = pathOnHistory(n.id) && pathOnHistory(childId)\n` +
    `          && history.indexOf(childId) === history.indexOf(n.id) + 1;\n` +
    `        var dead = byId[childId] && byId[childId].dead;\n` +
    `        var stroke, strokeW, opacity;\n` +
    `        if (onPath) { stroke = accent; strokeW = 2.2; opacity = 1; }\n` +
    `        else if (dead) { stroke = 'var(--mute)'; strokeW = 1.4; opacity = 0.55; }\n` +
    `        else { stroke = 'var(--line)'; strokeW = 1.2; opacity = 0.7; }\n` +
    `        // S-curve so edges don't overlap with sibling rects.\n` +
    `        var midY = (p1.y + p2.y) / 2;\n` +
    `        var d = 'M ' + p1.x + ' ' + (p1.y + 14) +\n` +
    `                ' C ' + p1.x + ' ' + midY + ', ' + p2.x + ' ' + midY + ', ' +\n` +
    `                p2.x + ' ' + (p2.y - 14);\n` +
    `        var pathEl = el('path', {\n` +
    `          d: d, fill: 'none', stroke: stroke,\n` +
    `          'stroke-width': String(strokeW),\n` +
    `          opacity: String(opacity),\n` +
    `        });\n` +
    `        edgesGroup.appendChild(pathEl);\n` +
    `      }\n` +
    `    }\n` +
    `\n` +
    `    // ---- nodes ------------------------------------------------------\n` +
    `    var nodesGroup = el('g', { 'class': 'nodes' });\n` +
    `    svg.appendChild(nodesGroup);\n` +
    `    var rectW = 22, rectH = 14;\n` +
    `    for (var j = 0; j < CFG.nodes.length; j++) {\n` +
    `      var nd = CFG.nodes[j];\n` +
    `      if (!pos[nd.id]) continue;\n` +
    `      var pp = pos[nd.id];\n` +
    `      var isCur = nd.id === currentId();\n` +
    `      var inHist = pathOnHistory(nd.id);\n` +
    `      var dead = !!nd.dead;\n` +
    `      var fill, stroke, strokeW, textFill, op;\n` +
    `      if (isCur) {\n` +
    `        fill = accent; stroke = accent; strokeW = 2.4;\n` +
    `        textFill = 'var(--bg)'; op = 1;\n` +
    `      } else if (inHist) {\n` +
    `        fill = 'color-mix(in srgb, ' + accent + ' 30%, var(--panel2))';\n` +
    `        stroke = accent; strokeW = 1.6; textFill = 'var(--ink)'; op = 1;\n` +
    `      } else if (dead) {\n` +
    `        fill = 'var(--panel2)'; stroke = 'var(--mute)'; strokeW = 1;\n` +
    `        textFill = 'var(--mute)'; op = 0.65;\n` +
    `      } else {\n` +
    `        fill = 'var(--panel)'; stroke = 'var(--line)'; strokeW = 1;\n` +
    `        textFill = 'var(--mute)'; op = 0.85;\n` +
    `      }\n` +
    `      var g = el('g', {\n` +
    `        'class': 'node',\n` +
    `        'data-id': nd.id,\n` +
    `        'data-kind': nd.kind,\n` +
    `        transform: 'translate(' + pp.x + ',' + pp.y + ')',\n` +
    `        opacity: String(op),\n` +
    `        style: 'cursor:pointer',\n` +
    `      });\n` +
    `      nodesGroup.appendChild(g);\n` +
    `      var rect = el(nd.kind === 'leaf' ? 'rect' : (nd.kind === 'fork' ? 'rect' : 'rect'), {\n` +
    `        x: String(-rectW), y: String(-rectH),\n` +
    `        width: String(2 * rectW), height: String(2 * rectH),\n` +
    `        rx: nd.kind === 'fork' ? '4' : (nd.kind === 'leaf' ? '12' : '7'),\n` +
    `        ry: nd.kind === 'fork' ? '4' : (nd.kind === 'leaf' ? '12' : '7'),\n` +
    `        fill: fill, stroke: stroke, 'stroke-width': String(strokeW),\n` +
    `      });\n` +
    `      g.appendChild(rect);\n` +
    `      // Glyph: number for steps, fork icon, leaf dot, ✗ for dead.\n` +
    `      var glyph = nd.kind === 'fork' ? '◇' : (nd.kind === 'leaf' ? '∎' : '•');\n` +
    `      var label = el('text', {\n` +
    `        x: '0', y: '5', 'text-anchor': 'middle',\n` +
    `        'font-size': '13', 'font-weight': '600', fill: textFill,\n` +
    `        'pointer-events': 'none',\n` +
    `      });\n` +
    `      label.textContent = glyph;\n` +
    `      g.appendChild(label);\n` +
    `      if (dead) {\n` +
    `        // Red ✗ overlay just outside the rect, top-right corner.\n` +
    `        var x = el('text', {\n` +
    `          x: String(rectW - 2), y: String(-rectH + 4),\n` +
    `          'text-anchor': 'end',\n` +
    `          'font-size': '12', 'font-weight': '700',\n` +
    `          fill: 'var(--pink)',\n` +
    `          'pointer-events': 'none',\n` +
    `        });\n` +
    `        x.textContent = '✗';\n` +
    `        g.appendChild(x);\n` +
    `      }\n` +
    `      // Click navigates to this node — but only if it's reachable along\n` +
    `      // the current history (no teleporting across forks).\n` +
    `      g.addEventListener('click', function(idLocal){\n` +
    `        return function(){ tryJumpTo(idLocal); };\n` +
    `      }(nd.id));\n` +
    `      // Tooltip via SVG <title> for hover discoverability.\n` +
    `      var t = el('title');\n` +
    `      t.textContent = stripHtml(nd.prompt || '').slice(0, 140);\n` +
    `      g.appendChild(t);\n` +
    `    }\n` +
    `  }\n` +
    `\n` +
    `  function stripHtml(s) {\n` +
    `    var d = document.createElement('div');\n` +
    `    d.innerHTML = s;\n` +
    `    return d.textContent || d.innerText || '';\n` +
    `  }\n` +
    `\n` +
    `  // ---- rendering: prompt + branch picker + breadcrumb ---------------\n` +
    `  function renderPrompt() {\n` +
    `    var node = currentNode();\n` +
    `    if (!node) return;\n` +
    `    var kindLabel = node.kind === 'fork' ? 'fork — pick a tactic'\n` +
    `                  : node.kind === 'leaf' ? (node.dead ? 'dead end' : 'QED')\n` +
    `                  : 'step ' + history.length;\n` +
    `    if (titleEl) titleEl.textContent = kindLabel;\n` +
    `    promptEl.innerHTML = node.prompt || '';\n` +
    `    // KaTeX re-typeset (only if loader is on the page).\n` +
    `    if (window.renderMathInElement) {\n` +
    `      try {\n` +
    `        window.renderMathInElement(promptEl, {\n` +
    `          delimiters: [\n` +
    `            {left: '$$', right: '$$', display: true},\n` +
    `            {left: '$',  right: '$',  display: false},\n` +
    `            {left: '\\\\(', right: '\\\\)', display: false},\n` +
    `            {left: '\\\\[', right: '\\\\]', display: true}\n` +
    `          ],\n` +
    `          throwOnError: false,\n` +
    `        });\n` +
    `      } catch (_) { /* swallow KaTeX errors so the page stays alive */ }\n` +
    `    }\n` +
    `  }\n` +
    `\n` +
    `  function renderBranches() {\n` +
    `    if (!branchBar) return;\n` +
    `    while (branchBar.firstChild) branchBar.removeChild(branchBar.firstChild);\n` +
    `    var node = currentNode();\n` +
    `    if (!node || node.kind !== 'fork') {\n` +
    `      branchBar.style.display = 'none';\n` +
    `      return;\n` +
    `    }\n` +
    `    branchBar.style.display = '';\n` +
    `    var kids = node.children || [];\n` +
    `    var lab = document.createElement('span');\n` +
    `    lab.className = 'small';\n` +
    `    lab.style.color = 'var(--mute)';\n` +
    `    lab.style.marginRight = '6px';\n` +
    `    lab.textContent = 'pick:';\n` +
    `    branchBar.appendChild(lab);\n` +
    `    for (var k = 0; k < kids.length; k++) {\n` +
    `      var child = byId[kids[k]];\n` +
    `      if (!child) continue;\n` +
    `      var btn = document.createElement('button');\n` +
    `      btn.type = 'button';\n` +
    `      var label = child.branchLabel || ('branch ' + (k + 1));\n` +
    `      btn.textContent = label + (child.dead ? ' ✗' : '');\n` +
    `      if (child.dead) btn.style.color = 'var(--mute)';\n` +
    `      (function(idLocal){\n` +
    `        btn.addEventListener('click', function(){ pickBranch(idLocal); });\n` +
    `      })(kids[k]);\n` +
    `      branchBar.appendChild(btn);\n` +
    `    }\n` +
    `  }\n` +
    `\n` +
    `  function renderCrumb() {\n` +
    `    if (!crumbEl) return;\n` +
    `    var parts = [];\n` +
    `    for (var i = 0; i < history.length; i++) {\n` +
    `      var nd = byId[history[i]];\n` +
    `      if (!nd) continue;\n` +
    `      var glyph = nd.kind === 'fork' ? '◇' : nd.kind === 'leaf' ? '∎' : '•';\n` +
    `      var tag;\n` +
    `      if (nd.kind === 'fork' && i + 1 < history.length) {\n` +
    `        var picked = byId[history[i + 1]];\n` +
    `        var blab = picked && picked.branchLabel ? picked.branchLabel : 'pick';\n` +
    `        tag = glyph + ' ' + blab;\n` +
    `      } else {\n` +
    `        tag = glyph + ' ' + nd.id;\n` +
    `      }\n` +
    `      parts.push(tag);\n` +
    `    }\n` +
    `    crumbEl.textContent = 'path: ' + parts.join(' → ');\n` +
    `  }\n` +
    `\n` +
    `  function syncStepButtons() {\n` +
    `    var node = currentNode();\n` +
    `    if (prevBtn) prevBtn.disabled = history.length <= 1;\n` +
    `    if (nextBtn) {\n` +
    `      // disabled when at a leaf or at a fork (must pick a branch)\n` +
    `      var atFork = node && node.kind === 'fork';\n` +
    `      var atLeaf = !node || (node.children || []).length === 0;\n` +
    `      nextBtn.disabled = atFork || atLeaf;\n` +
    `    }\n` +
    `  }\n` +
    `\n` +
    `  function renderAll() {\n` +
    `    renderTree();\n` +
    `    renderPrompt();\n` +
    `    renderBranches();\n` +
    `    renderCrumb();\n` +
    `    syncStepButtons();\n` +
    `  }\n` +
    `\n` +
    `  // ---- navigation ----------------------------------------------------\n` +
    `  function step(delta) {\n` +
    `    if (delta < 0) {\n` +
    `      if (history.length > 1) {\n` +
    `        history.pop();\n` +
    `        renderAll();\n` +
    `      }\n` +
    `      return;\n` +
    `    }\n` +
    `    var node = currentNode();\n` +
    `    if (!node) return;\n` +
    `    if (node.kind === 'fork') return; // must pick a branch\n` +
    `    var kids = node.children || [];\n` +
    `    if (kids.length === 1 && byId[kids[0]]) {\n` +
    `      history.push(kids[0]);\n` +
    `      renderAll();\n` +
    `    }\n` +
    `  }\n` +
    `  function pickBranch(childId) {\n` +
    `    if (!byId[childId]) return;\n` +
    `    var node = currentNode();\n` +
    `    if (!node || node.kind !== 'fork') return;\n` +
    `    if ((node.children || []).indexOf(childId) === -1) return;\n` +
    `    history.push(childId);\n` +
    `    renderAll();\n` +
    `  }\n` +
    `  function tryJumpTo(targetId) {\n` +
    `    // Click on a tree node: jump to it iff it's already in history (a\n` +
    `    // backward scrub) — never teleport across an unchosen fork.\n` +
    `    var idx = history.indexOf(targetId);\n` +
    `    if (idx === -1) return;\n` +
    `    history = history.slice(0, idx + 1);\n` +
    `    renderAll();\n` +
    `  }\n` +
    `  function reset() {\n` +
    `    history = [CFG.rootId];\n` +
    `    renderAll();\n` +
    `  }\n` +
    `\n` +
    `  // ---- wiring --------------------------------------------------------\n` +
    `  if (prevBtn) prevBtn.addEventListener('click', function(){ step(-1); });\n` +
    `  if (nextBtn) nextBtn.addEventListener('click', function(){ step(1); });\n` +
    `  if (resetBtn) resetBtn.addEventListener('click', reset);\n` +
    `\n` +
    `  // Keyboard: ←/→ when the widget contains focus (or is hovered).\n` +
    `  ROOT.tabIndex = 0;\n` +
    `  ROOT.addEventListener('keydown', function(e){\n` +
    `    if (e.key === 'ArrowLeft')  { step(-1); e.preventDefault(); }\n` +
    `    else if (e.key === 'ArrowRight') { step(1);  e.preventDefault(); }\n` +
    `    else if (e.key === 'Home' || e.key === 'r' || e.key === 'R') { reset(); e.preventDefault(); }\n` +
    `  });\n` +
    `\n` +
    `  // Theme observer — repaint so accent colors track --bg / --ink.\n` +
    `  // (We use CSS vars in attribute strings, which the SVG renderer\n` +
    `  // resolves at paint time, so a no-op redraw is enough.)\n` +
    `  var themeObserver = new MutationObserver(function(){ renderTree(); });\n` +
    `  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });\n` +
    `\n` +
    `  renderAll();\n` +
    `})();\n` +
    `</script>`
  );
}
