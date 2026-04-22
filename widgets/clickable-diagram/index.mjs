// clickable-diagram widget — SHARED widget module absorbing multiple
// category-theory widgets through a single registry entry.  Dispatches on
// params.interaction to render any of the supported widget shapes:
//
//   "readout-only"  — a <select> + <div class="readout"> pair driven by a
//                     DATA dictionary keyed by option value.  Used by w-univ
//                     ("Universal property explorer") and w-mon
//                     ("Monoid-in-a-monoidal-category dictionary").
//
//   "proof-stepper" — select proof + ◀ back / next ▶ / reset buttons + an
//                     SVG diagram of objects (nodes) and morphisms (given +
//                     derived arrows, some as identity loops) + a caption +
//                     an "established equations" log.  Used by w-proof
//                     ("Proof stepper").
//
// Both exports are pure string-returning functions; each widget's absorbed
// markup/script round-trips byte-identical to the original inline source in
// category-theory.html.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Shared data model (portable — a React / SSR consumer can ignore the
// *Literal artifacts and drive its own renderer from these):
//
//   objects    : [{ id, x, y, label? }]        — diagram nodes (proof-stepper)
//   morphisms  : [{ id, src|from, tgt|to, label, loop?, curve?, derived? }]
//                                               — diagram arrows (proof-stepper)
//   cases      : { <key>: { <field>: string } } — dictionary lookup table
//                 Both readout-only (keyed by option value) and proof-stepper
//                 (keyed by proof id; cases[key] then carries
//                 { title, nodes, intro, given, steps }) use this shape.
//
// "*Literal" params (dataLiteral, proofsLiteral, templateLiteral) are
// source-byte artifacts: they preserve the original file's irregular
// alignment ("set:  {" vs "ab:   {", "x: 130, y:  80") so renderScript can
// byte-match the legacy inline source.  They are tagged as "artifact" in the
// README.  A portable consumer can ignore them and regenerate from `cases`.

function renderReadoutOnlyMarkup(params) {
  const {
    widgetId, pickId, outputId,
    title, hint, pickLabel, options,
  } = params;
  const optionsBlock = options
    .map(o => {
      const sel = o.selected ? ' selected' : '';
      return `      <option value="${o.value}"${sel}>${o.label}</option>`;
    })
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div><div class="hint">${hint}</div></div>\n` +
    `  <div class="row">\n` +
    `    <label>${pickLabel}</label>\n` +
    `    <select id="${pickId}">\n` +
    `${optionsBlock}\n` +
    `    </select>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}"></div>\n` +
    `</div>`
  );
}

function renderReadoutOnlyScript(params) {
  const {
    pickId, outputId,
    dataLiteral, templateLiteral,
  } = params;
  // Script body is the original IIFE verbatim; only the two ids, the DATA
  // dictionary, and the out.textContent template-literal chain are
  // param-driven.  dataLiteral is the full object-literal text (including
  // surrounding whitespace) produced by the original source and preserved
  // byte-exact via a raw string; templateLiteral is the concatenation
  // (` lines joined with ` +\n      `) that builds the readout string.
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const pick = $('#${pickId}'), out = $('#${outputId}');\n` +
    `  if(!pick || !out) return;\n` +
    `  const DATA = ${dataLiteral};\n` +
    `  function render(){\n` +
    `    const d = DATA[pick.value];\n` +
    `    out.textContent =\n` +
    `${templateLiteral};\n` +
    `  }\n` +
    `  pick.addEventListener('change', render);\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}

function renderProofStepperMarkup(params) {
  const {
    widgetId, pickId, outputTextId, outputLogId,
    prevId, nextId, resetId, counterId, svgId,
    title, hint, pickLabel,
    options,
    prevLabel, nextLabel, resetLabel,
    svgViewBox, svgWidthAttr, svgStyleAttr,
    outputLogStyleAttr,
  } = params;
  const optionsBlock = options
    .map(o => {
      const sel = o.selected ? ' selected' : '';
      return `      <option value="${o.value}"${sel}>${o.label}</option>`;
    })
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div><div class="hint">${hint}</div></div>\n` +
    `  <div class="row">\n` +
    `    <label>${pickLabel}</label>\n` +
    `    <select id="${pickId}">\n` +
    `${optionsBlock}\n` +
    `    </select>\n` +
    `    <button id="${prevId}">${prevLabel}</button>\n` +
    `    <button id="${nextId}">${nextLabel}</button>\n` +
    `    <button id="${resetId}">${resetLabel}</button>\n` +
    `    <span class="small" id="${counterId}" style="margin-left:.4rem"></span>\n` +
    `  </div>\n` +
    `  <svg id="${svgId}" viewBox="${svgViewBox}" width="${svgWidthAttr}" style="${svgStyleAttr}"><title>${title}</title></svg>\n` +
    `  <div class="readout" id="${outputTextId}"></div>\n` +
    `  <div class="readout" id="${outputLogId}" style="${outputLogStyleAttr}"></div>\n` +
    `</div>`
  );
}

function renderProofStepperScript(params) {
  const {
    pickId, nextId, prevId, resetId, counterId,
    svgId, outputTextId, outputLogId,
    proofsLiteral, initialKey,
  } = params;
  // The inner rendering logic — drawLoop, render, event handlers — is a
  // fixed template that depends only on ids and the PROOFS dictionary.
  // proofsLiteral preserves the source's irregular alignment (e.g.
  // "x: 130, y:  80" in the product proof has two spaces before 80 to align
  // with "x: 180, y: 260" below).  initialKey is the option value the IIFE
  // starts on (the "let key = '...'" line).
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const PROOFS = ${proofsLiteral};\n` +
    `\n` +
    `  // locals\n` +
    `  const pick = $('#${pickId}'), next = $('#${nextId}'), prev = $('#${prevId}'),\n` +
    `        reset = $('#${resetId}'), cnt = $('#${counterId}'),\n` +
    `        svg = $('#${svgId}'), textEl = $('#${outputTextId}'), logEl = $('#${outputLogId}');\n` +
    `  let key = '${initialKey}', step = 0;\n` +
    `\n` +
    `  // Loop-arrow drawer (for identity proof)\n` +
    `  function drawLoop(svg, pos, side, label, color){\n` +
    `    const markerId = 'pf-loop-' + (color==='var(--yellow)'?'hl':(color==='var(--green)'?'dr':'in'));\n` +
    `    ensureArrow(svg, markerId, color);\n` +
    `    const s = side === 'bottom' ? 1 : -1;\n` +
    `    const r = 18;\n` +
    `    const x0 = pos.x - 10, y0 = pos.y + s*r*0.6;\n` +
    `    const x1 = pos.x + 10, y1 = pos.y + s*r*0.6;\n` +
    `    const cx1 = pos.x - 50, cy1 = pos.y + s*(r*0.4 + 55);\n` +
    `    const cx2 = pos.x + 50, cy2 = pos.y + s*(r*0.4 + 55);\n` +
    `    const p = SVG('path', {\n` +
    `      d: \`M\${x0} \${y0} C \${cx1} \${cy1}, \${cx2} \${cy2}, \${x1} \${y1}\`,\n` +
    `      fill:'none', stroke: color, 'stroke-width': 1.8,\n` +
    `      'marker-end': \`url(#\${markerId})\`\n` +
    `    });\n` +
    `    svg.appendChild(p);\n` +
    `    if(label){\n` +
    `      const t = SVG('text', {\n` +
    `        x: pos.x, y: pos.y + s*(r + 58),\n` +
    `        'text-anchor':'middle', 'font-size': 14,\n` +
    `        fill: color, 'font-style':'italic'\n` +
    `      });\n` +
    `      t.textContent = label;\n` +
    `      svg.appendChild(t);\n` +
    `    }\n` +
    `  }\n` +
    `\n` +
    `  function render(){\n` +
    `    svg.innerHTML = '';\n` +
    `    const P = PROOFS[key];\n` +
    `\n` +
    `    // Build the set of visible arrows and highlighted ids based on current step.\n` +
    `    const visible = P.given.slice();\n` +
    `    let highlights = new Set();\n` +
    `    const eqs = [];\n` +
    `    let captionText = P.intro;\n` +
    `\n` +
    `    for(let i = 0; i < step; i++){\n` +
    `      const s = P.steps[i];\n` +
    `      if(s.add) for(const a of s.add) visible.push(a);\n` +
    `      if(s.equation) eqs.push(s.equation);\n` +
    `      if(i === step - 1){\n` +
    `        captionText = s.text;\n` +
    `        if(s.highlight) for(const h of s.highlight) highlights.add(h);\n` +
    `      }\n` +
    `    }\n` +
    `\n` +
    `    // Draw nodes first.\n` +
    `    for(const [id, pos] of Object.entries(P.nodes)){\n` +
    `      drawNode(svg, pos.x, pos.y, id, {r:20, stroke:'var(--blue)'});\n` +
    `    }\n` +
    `\n` +
    `    // Draw arrows\n` +
    `    for(const a of visible){\n` +
    `      const from = P.nodes[a.from], to = P.nodes[a.to];\n` +
    `      const hl = highlights.has(a.id);\n` +
    `      const color = hl ? 'var(--yellow)' : (a.derived ? 'var(--green)' : 'var(--ink)');\n` +
    `      if(a.loop){\n` +
    `        drawLoop(svg, from, a.loop, a.label, color);\n` +
    `      } else {\n` +
    `        drawArrow(svg, [from.x, from.y], [to.x, to.y], {\n` +
    `          curve: a.curve || 0,\n` +
    `          label: a.label,\n` +
    `          color,\n` +
    `          width: hl ? 2.2 : 1.5,\n` +
    `          markerId: 'pf-' + (hl?'hl':(a.derived?'dr':'in')),\n` +
    `          pad1: 20, pad2: 22\n` +
    `        });\n` +
    `      }\n` +
    `    }\n` +
    `\n` +
    `    // Caption + log\n` +
    `    textEl.textContent = captionText;\n` +
    `    logEl.textContent = eqs.length ? 'established:\\n  ' + eqs.join('\\n  ') : '';\n` +
    `    logEl.style.color = step >= P.steps.length ? 'var(--green)' : 'var(--ink)';\n` +
    `\n` +
    `    cnt.textContent = step >= P.steps.length\n` +
    `      ? \`complete · \${P.steps.length}/\${P.steps.length}\`\n` +
    `      : \`step \${step}/\${P.steps.length}\`;\n` +
    `    prev.disabled = step === 0;\n` +
    `    next.disabled = step >= P.steps.length;\n` +
    `    prev.style.opacity = prev.disabled ? 0.5 : 1;\n` +
    `    next.style.opacity = next.disabled ? 0.5 : 1;\n` +
    `  }\n` +
    `\n` +
    `  pick.addEventListener('change', () => { key = pick.value; step = 0; render(); });\n` +
    `  next.addEventListener('click', () => {\n` +
    `    const P = PROOFS[key];\n` +
    `    if(step < P.steps.length){ step++; render(); }\n` +
    `  });\n` +
    `  prev.addEventListener('click', () => { if(step > 0){ step--; render(); } });\n` +
    `  reset.addEventListener('click', () => { step = 0; render(); });\n` +
    `\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}

export function renderMarkup(params) {
  if (params.interaction === 'readout-only') return renderReadoutOnlyMarkup(params);
  if (params.interaction === 'proof-stepper') return renderProofStepperMarkup(params);
  throw new Error(`clickable-diagram: unknown interaction "${params.interaction}"`);
}

export function renderScript(params) {
  if (params.interaction === 'readout-only') return renderReadoutOnlyScript(params);
  if (params.interaction === 'proof-stepper') return renderProofStepperScript(params);
  throw new Error(`clickable-diagram: unknown interaction "${params.interaction}"`);
}
