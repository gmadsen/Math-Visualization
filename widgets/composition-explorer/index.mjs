// composition-explorer widget — pilot of the portable-widgets registry.
//
// Exports two pure string-returning functions:
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Both outputs are byte-identical to the original inline source in
// category-theory.html for the w-cat widget when called with the params
// stored in content/category-theory.json for that block.
//
// The functions are pure (no I/O). A React / SSR consumer can ignore
// renderScript entirely and drive its own renderer from params alone.

function padTo(str, target) {
  if (str.length >= target) return str;
  return str + ' '.repeat(target - str.length);
}

function formatObjectsConst(objects) {
  // → "  const A=[120,200], B=[310,80], C=[500,200];"
  const parts = objects.map(o => `${o.id}=[${o.x},${o.y}]`);
  return `  const ${parts.join(', ')};`;
}

function formatPosConst(objects) {
  // → "  const POS = {A,B,C};"
  return `  const POS = {${objects.map(o => o.id).join(',')}};`;
}

function formatDrawNodeCalls(objects) {
  // → "    drawNode(svg, A[0], A[1], 'A');\n..."
  return objects
    .map(o => `    drawNode(svg, ${o.id}[0], ${o.id}[1], '${o.id}');`)
    .join('\n');
}

function formatMorphObj(m, idColWidth) {
  // Row:  {id:'X', src:'A', tgt:'B', label:'l', loop:true, curve:-40}
  // The original source pads so that 'src:' aligns across rows.
  const idField = `id:'${m.id}',`;
  const padded = padTo(idField, idColWidth);
  const parts = [padded, `src:'${m.src}'`, `tgt:'${m.tgt}'`, `label:'${m.label}'`];
  if (m.loop === true) parts.push('loop:true');
  if (typeof m.curve === 'number') parts.push(`curve:${m.curve}`);
  // parts[0] already ends in a comma+padding; subsequent fields are joined with ", ".
  return `{${parts[0]} ${parts.slice(1).join(', ')}}`;
}

function formatMorphs(morphisms) {
  // Column width = longest `id:'X',` + enough trailing space so shortest
  // row matches the original (max_id_string_length + 7 places total).
  const maxIdLen = morphisms.reduce((m, x) => Math.max(m, x.id.length), 0);
  const idColWidth = maxIdLen + 7; // "id:'X',".length for X of maxIdLen is maxIdLen + 5; +2 trailing.
  const lines = morphisms.map(m => `    ${formatMorphObj(m, idColWidth)},`);
  return lines.join('\n');
}

function formatCompositionEntry(key, value) {
  return `'${key}':'${value}'`;
}

function formatComposition(composition, compositionLines) {
  // If compositionLines is provided, group entries per the layout; each line is
  // indented by 4 spaces, entries are ", "-joined except where the original
  // used "  " (two-space) separators. The original uses ", " between entries
  // of id-squared (line 1) and ",  " (comma + two spaces) between the two-entry
  // lines. We preserve both patterns by inspecting line length.
  //
  // Observed patterns in w-cat:
  //   ['idA.idA','idB.idB','idC.idC']  → ", " separator
  //   ['idB.f','f.idA']                → ",  " separator (extra space)
  //   ['idC.g','g.idB']                → ",  "
  //   ['idC.h','h.idA']                → ",  "
  //   ['g.f']                          → single
  //
  // Rule: 3-entry identity line uses ", "; 2-entry paired lines use ",  ".
  if (!compositionLines) {
    // Fallback: one entry per line.
    const lines = Object.entries(composition).map(
      ([k, v]) => `    ${formatCompositionEntry(k, v)},`
    );
    return lines.join('\n');
  }
  const renderedLines = [];
  for (const group of compositionLines) {
    const entries = group.map(k => formatCompositionEntry(k, composition[k]));
    const sep = group.length === 3 ? ', ' : ',  ';
    renderedLines.push(`    ${entries.join(sep)},`);
  }
  return renderedLines.join('\n');
}

export function renderMarkup(params) {
  const {
    widgetId, svgId, outputId, resetId,
    title, hint, viewBox, width, height,
    initialOutput, resetLabel, legend,
  } = params;
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div><div class="hint">${hint}</div></div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${width}" height="${height}"><title>${title}</title></svg>\n` +
    `  <div class="readout" id="${outputId}">${initialOutput}</div>\n` +
    `  <div class="row">\n` +
    `    <button id="${resetId}">${resetLabel}</button>\n` +
    `    <span class="small">${legend}</span>\n` +
    `  </div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const {
    svgId, outputId, resetId,
    sectionComment,
    initialOutput,
    objects, morphisms, composition, compositionLines,
  } = params;

  const objectsDecl = formatObjectsConst(objects);
  const posDecl = formatPosConst(objects);
  const drawNodeCalls = formatDrawNodeCalls(objects);
  const morphsBlock = formatMorphs(morphisms);
  const compBlock = formatComposition(composition, compositionLines);

  // The script body is a direct embedding of the original IIFE. Only the
  // positions, morphisms, composition table, initial output text, comment,
  // and element ids are param-driven. The inner helper functions and event
  // handlers are verbatim because they operate uniformly on those data.
  return (
    `<script>\n` +
    `/* ${sectionComment} */\n` +
    `(function(){\n` +
    `  const svg = $('#${svgId}'), out = $('#${outputId}'), resetBtn = $('#${resetId}');\n` +
    `  // positions\n` +
    `${objectsDecl}\n` +
    `  // morphisms as {id, src, tgt, label, path-info}\n` +
    `  const MORPHS = [\n` +
    `${morphsBlock}\n` +
    `  ];\n` +
    `${posDecl}\n` +
    `  // composition table: compose[left][right] (right applied first)\n` +
    `  // we store compose(g,f) under key g.f  — i.e. first "f" then "g"\n` +
    `  const COMP = {\n` +
    `${compBlock}\n` +
    `  };\n` +
    `  let picks = []; // array of morph-ids\n` +
    `\n` +
    `  function findMorph(id){ return MORPHS.find(m=>m.id===id); }\n` +
    `  function loopArrow(svgEl, p, label, mid, highlight){\n` +
    `    // draw a small loop above a node\n` +
    `    const [x,y]=p;\n` +
    `    const col = highlight?'var(--yellow)':'var(--violet)';\n` +
    `    ensureArrow(svgEl, 'arr-loop-'+(highlight?'h':'n'), col);\n` +
    `    const d = \`M \${x-10} \${y-22} C \${x-36} \${y-70}, \${x+36} \${y-70}, \${x+10} \${y-22}\`;\n` +
    `    const p1 = SVG('path',{d, fill:'none', stroke:col, 'stroke-width':1.4,\n` +
    `      'marker-end':\`url(#arr-loop-\${highlight?'h':'n'})\`});\n` +
    `    svgEl.appendChild(p1);\n` +
    `    const t = SVG('text',{x:x, y:y-52, 'text-anchor':'middle','font-size':12, fill:col,\n` +
    `      'font-style':'italic'});\n` +
    `    t.textContent = label;\n` +
    `    svgEl.appendChild(t);\n` +
    `    // make clickable via a transparent overlay rect\n` +
    `    const r = SVG('rect',{x:x-30,y:y-72,width:60,height:40,fill:'transparent',\n` +
    `      style:'cursor:pointer','data-mid':mid});\n` +
    `    svgEl.appendChild(r);\n` +
    `  }\n` +
    `  function render(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // nodes\n` +
    `${drawNodeCalls}\n` +
    `    // arrows (non-loops)\n` +
    `    for(const m of MORPHS){\n` +
    `      if(m.loop) continue;\n` +
    `      const highlight = picks.includes(m.id);\n` +
    `      const color = highlight? 'var(--yellow)' : (m.id==='h' ? 'var(--pink)' : 'var(--blue)');\n` +
    `      const markerId = 'arr-cat-'+m.id+(highlight?'h':'');\n` +
    `      const p1 = POS[m.src], p2 = POS[m.tgt];\n` +
    `      drawArrow(svg, p1, p2, {color, curve: m.curve||14, label:m.label, markerId, pad1:20, pad2:22, width:1.8});\n` +
    `      // enlarge click target\n` +
    `      const midx=(p1[0]+p2[0])/2, midy=(p1[1]+p2[1])/2 - (m.curve? m.curve*0.55 : 8);\n` +
    `      const r = SVG('rect',{x:midx-18,y:midy-14,width:36,height:22,fill:'transparent',\n` +
    `        style:'cursor:pointer','data-mid':m.id});\n` +
    `      svg.appendChild(r);\n` +
    `    }\n` +
    `    // identity loops\n` +
    `    for(const m of MORPHS){\n` +
    `      if(!m.loop) continue;\n` +
    `      const highlight = picks.includes(m.id);\n` +
    `      loopArrow(svg, POS[m.src], m.label, m.id, highlight);\n` +
    `    }\n` +
    `  }\n` +
    `\n` +
    `  function onClickId(mid){\n` +
    `    if(picks.length === 0){\n` +
    `      picks = [mid]; render(); showState();\n` +
    `    } else if(picks.length === 1){\n` +
    `      picks = [picks[0], mid]; render(); showState();\n` +
    `    } else {\n` +
    `      picks = [mid]; render(); showState();\n` +
    `    }\n` +
    `  }\n` +
    `  function showState(){\n` +
    `    if(picks.length === 0){\n` +
    `      out.textContent = '${initialOutput}';\n` +
    `      return;\n` +
    `    }\n` +
    `    if(picks.length === 1){\n` +
    `      const m = findMorph(picks[0]);\n` +
    `      out.textContent = \`picked: \${m.label} : \${m.src} → \${m.tgt}\\n(now click a second morphism — the FIRST one to apply, i.e. the one on the right of ∘)\`;\n` +
    `      return;\n` +
    `    }\n` +
    `    // two picks — treat first as "left" (outer), second as "right" (inner)\n` +
    `    const left = findMorph(picks[0]), right = findMorph(picks[1]);\n` +
    `    const key = \`\${left.id}.\${right.id}\`;\n` +
    `    if(left.src !== right.tgt){\n` +
    `      out.textContent =\n` +
    `        \`\${left.label} : \${left.src} → \${left.tgt}\\n\` +\n` +
    `        \`\${right.label} : \${right.src} → \${right.tgt}\\n\\n\` +\n` +
    `        \`NOT composable: need right.tgt = left.src, but \${right.tgt} ≠ \${left.src}.\`;\n` +
    `      return;\n` +
    `    }\n` +
    `    const res = COMP[key] || '??';\n` +
    `    const resM = findMorph(res);\n` +
    `    out.textContent =\n` +
    `      \`\${left.label} ∘ \${right.label}\\n\` +\n` +
    `      \`  = (\${left.src}←\${left.tgt}? no, it's \${right.src} → \${right.tgt} → \${left.tgt})\\n\` +\n` +
    `      \`  : \${right.src} → \${left.tgt}\\n\` +\n` +
    `      \`  = \${resM.label}.\`;\n` +
    `  }\n` +
    `  svg.addEventListener('click',e=>{\n` +
    `    const mid = e.target && e.target.getAttribute && e.target.getAttribute('data-mid');\n` +
    `    if(mid) onClickId(mid);\n` +
    `  });\n` +
    `  resetBtn.addEventListener('click',()=>{ picks=[]; render(); showState(); });\n` +
    `  render(); showState();\n` +
    `})();\n` +
    `</script>`
  );
}
