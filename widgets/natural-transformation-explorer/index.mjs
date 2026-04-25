// natural-transformation-explorer widget — second entry in the portable-widgets
// registry (after composition-explorer).
//
// Exports two pure string-returning functions:
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Both outputs are byte-identical to the original inline source in
// category-theory.html for the w-nat widget when called with the params
// stored in content/category-theory.json for that block.
//
// The functions are pure (no I/O). A React / SSR consumer can ignore
// renderScript entirely and drive its own renderer from params alone.
// The underlying mathematical set-up is fixed (F = Hom(X,-), G = Hom(Y,-),
// |X|=2, |Y|=1, η = u* with u(y)=x_1); what params control is ids, layout,
// and labelling.

function formatArray(items) {
  // → "'a₁','a₂','a₃'"   (single-quoted, comma-separated, no spaces — as in the source)
  return items.map(s => `'${s}'`).join(',');
}

function formatGrid2d(key, g) {
  // → "  HXA:{x:110, y:66,  cols:3, rows:3, cell:34, title:'Hom(X, A)', colHdr:'φ(x₂) →', rowHdr:'φ(x₁) ↓'}"
  // Source source uses aligned spacing after y: — "y:66,  " (two spaces) vs. "y:83,  " — so
  // we reproduce the original padding literally per-row.
  const fields = [
    `x:${g.x}`,
    `y:${g.y},${g.ySpace || ' '}`,
    `cols:${g.cols}`,
    `rows:${g.rows}`,
    `cell:${g.cell}`,
    `title:'${g.title}'`,
    `colHdr:'${g.colHdr}'`,
    `rowHdr:'${g.rowHdr}'`,
  ];
  // Note the trailing comma after y:VALUE is already inside fields[1]; join the rest with ", ".
  // We emit: `${key}:{x:V, y:V,<space(s)>cols:V, rows:V, ...}`
  return `    ${key}:{${fields[0]}, ${fields[1]}cols:${g.cols}, rows:${g.rows}, cell:${g.cell}, title:'${g.title}', colHdr:'${g.colHdr}', rowHdr:'${g.rowHdr}'}`;
}

function formatGrid1d(key, g) {
  // 1-d grids have no colHdr.
  return `    ${key}:{x:${g.x}, y:${g.y}, cols:${g.cols}, rows:${g.rows}, cell:${g.cell}, title:'${g.title}', rowHdr:'${g.rowHdr}'}`;
}

export function renderMarkup(params) {
  const {
    widgetId, svgId, outputId,
    sliderFId, sliderFLabelId, playId,
    sliderPhiId, sliderPhiLabelId,
    title, hint, intro,
    fLabel, phiLabel, playLabel,
    viewBox, width, height,
    sliderFMin, sliderFMax, sliderFStep, initialFi,
    sliderPhiMin, sliderPhiMax, sliderPhiStep, initialPhii,
  } = params;
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div><div class="hint">${hint}</div></div>\n` +
    `\n` +
    `${intro}\n` +
    `\n` +
    `  <div class="row">\n` +
    `    <label for="${sliderFId}">${fLabel}</label>\n` +
    `    <input type="range" id="${sliderFId}" min="${sliderFMin}" max="${sliderFMax}" step="${sliderFStep}" value="${initialFi}">\n` +
    `    <span class="small" id="${sliderFLabelId}"></span>\n` +
    `    <button id="${playId}">${playLabel}</button>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${sliderPhiId}">${phiLabel}</label>\n` +
    `    <input type="range" id="${sliderPhiId}" min="${sliderPhiMin}" max="${sliderPhiMax}" step="${sliderPhiStep}" value="${initialPhii}">\n` +
    `    <span class="small" id="${sliderPhiLabelId}"></span>\n` +
    `  </div>\n` +
    `\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${width}" height="${height}"><title>${title}</title></svg>\n` +
    `  <div class="readout" id="${outputId}"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const {
    svgId, outputId,
    sliderFId, sliderFLabelId, playId,
    sliderPhiId, sliderPhiLabelId,
    sectionComment,
    setA, setB, grids,
    initialFi, initialPhii,
  } = params;

  const aDecl = formatArray(setA);
  const bDecl = formatArray(setB);

  // The four-grid layout block is nearly symbolic but the source has a specific
  // space-after-"y:<n>," alignment baked in ("y:66,  " and "y:83,  " use two
  // spaces; "y:330," uses one space elsewhere).  Emit literally.
  const gridsBlock =
    `    HXA:{x:${grids.HXA.x}, y:${grids.HXA.y},  cols:${grids.HXA.cols}, rows:${grids.HXA.rows}, cell:${grids.HXA.cell}, title:'${grids.HXA.title}', colHdr:'${grids.HXA.colHdr}', rowHdr:'${grids.HXA.rowHdr}'},\n` +
    `    HXB:{x:${grids.HXB.x}, y:${grids.HXB.y},  cols:${grids.HXB.cols}, rows:${grids.HXB.rows}, cell:${grids.HXB.cell}, title:'${grids.HXB.title}', colHdr:'${grids.HXB.colHdr}', rowHdr:'${grids.HXB.rowHdr}'},\n` +
    `    HYA:{x:${grids.HYA.x}, y:${grids.HYA.y}, cols:${grids.HYA.cols}, rows:${grids.HYA.rows}, cell:${grids.HYA.cell}, title:'${grids.HYA.title}', rowHdr:'${grids.HYA.rowHdr}'},\n` +
    `    HYB:{x:${grids.HYB.x}, y:${grids.HYB.y}, cols:${grids.HYB.cols}, rows:${grids.HYB.rows}, cell:${grids.HYB.cell}, title:'${grids.HYB.title}', rowHdr:'${grids.HYB.rowHdr}'}`;

  // Script body follows the original IIFE verbatim, with only ids, set labels,
  // grid-layout constants, initial state, and comment frame param-driven.
  // sectionComment is emitted verbatim between <script>\n and (function(){.
  // It is expected to either be '' (no banner — w-nat case) or a full line
  // including its trailing '\n' (banner case).
  return (
    `<script>\n` +
    `${sectionComment}` +
    `(function(){\n` +
    `  // Set up the concrete example: X={x1,x2}, Y={y}, u:Y→X with u(y)=x1.\n` +
    `  // F = Hom(X,-) covariant; G = Hom(Y,-); η = u* (precompose with u).\n` +
    `  // A = {a1,a2,a3}, B = {b1,b2}, f varies over Hom(A,B) (8 functions).\n` +
    `\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const slider=$('#${sliderFId}'), flbl=$('#${sliderFLabelId}'), play=$('#${playId}');\n` +
    `  const phiSl=$('#${sliderPhiId}'), phiLbl=$('#${sliderPhiLabelId}');\n` +
    `  const A=[${aDecl}], B=[${bDecl}];\n` +
    `\n` +
    `  // enumerate the four hom-sets\n` +
    `  const HXA=[]; for(let i=0;i<3;i++) for(let j=0;j<3;j++) HXA.push([i,j]);   // 9: (φ(x1), φ(x2))\n` +
    `  const HXB=[]; for(let i=0;i<2;i++) for(let j=0;j<2;j++) HXB.push([i,j]);   // 4: (ψ(x1), ψ(x2))\n` +
    `  const HYA=[[0],[1],[2]];                                                    // 3: ρ(y)\n` +
    `  const HYB=[[0],[1]];                                                        // 2: σ(y)\n` +
    `  const FS=[]; for(let i=0;i<2;i++) for(let j=0;j<2;j++) for(let k=0;k<2;k++) FS.push([i,j,k]); // 8\n` +
    `  slider.max=FS.length-1; phiSl.max=HXA.length-1;\n` +
    `\n` +
    `  // layout: four grids at corners\n` +
    `  const G={\n` +
    `${gridsBlock}\n` +
    `  };\n` +
    `  function center(g,i){ const r=Math.floor(i/g.cols), c=i%g.cols;\n` +
    `    return [g.x + c*g.cell + g.cell/2, g.y + r*g.cell + g.cell/2]; }\n` +
    `  function cellLabel(name, i){\n` +
    `    if(name==='HXA'){ const p=HXA[i]; return A[p[0]]+A[p[1]]; }\n` +
    `    if(name==='HXB'){ const p=HXB[i]; return B[p[0]]+B[p[1]]; }\n` +
    `    if(name==='HYA'){ return A[HYA[i][0]]; }\n` +
    `    if(name==='HYB'){ return B[HYB[i][0]]; }\n` +
    `  }\n` +
    `\n` +
    `  let fi=${initialFi}, phii=${initialPhii}, timer=null;\n` +
    `\n` +
    `  function drawGrid(name, highlights, clickable){\n` +
    `    const g=G[name];\n` +
    `    // title\n` +
    `    const t=SVG('text',{x:g.x + g.cols*g.cell/2, y:g.y-12,'text-anchor':'middle','font-size':12,fill:'var(--ink)','font-weight':600});\n` +
    `    t.textContent=g.title; svg.appendChild(t);\n` +
    `    // size caption\n` +
    `    const cap=SVG('text',{x:g.x + g.cols*g.cell/2, y:g.y + g.rows*g.cell + 16,'text-anchor':'middle','font-size':10,fill:'var(--mute)'});\n` +
    `    cap.textContent='|'+g.title.replace(/\\s+/g,'')+'| = '+(g.cols*g.rows);\n` +
    `    svg.appendChild(cap);\n` +
    `    // cells\n` +
    `    const N=g.cols*g.rows;\n` +
    `    for(let i=0;i<N;i++){\n` +
    `      const r=Math.floor(i/g.cols), c=i%g.cols;\n` +
    `      const x=g.x + c*g.cell, y=g.y + r*g.cell;\n` +
    `      const hl=highlights[i];\n` +
    `      const fill = hl ? hl.fill : 'var(--panel2)';\n` +
    `      const stroke = hl ? hl.stroke : 'var(--line)';\n` +
    `      const sw = hl ? 2.5 : 1;\n` +
    `      const rect=SVG('rect',{x:x+2,y:y+2,width:g.cell-4,height:g.cell-4,fill,stroke,'stroke-width':sw,rx:4,\n` +
    `        'data-grid':name,'data-idx':i, style: clickable?'cursor:pointer':'cursor:default'});\n` +
    `      svg.appendChild(rect);\n` +
    `      const txt=SVG('text',{x:x+g.cell/2,y:y+g.cell/2+4,'text-anchor':'middle','font-size':11,\n` +
    `        fill: hl ? (hl.textColor||'#000') : 'var(--mute)',\n` +
    `        'font-family':'ui-monospace, monospace','pointer-events':'none','font-weight': hl?700:400});\n` +
    `      txt.textContent=cellLabel(name,i);\n` +
    `      svg.appendChild(txt);\n` +
    `    }\n` +
    `  }\n` +
    `\n` +
    `  function render(){\n` +
    `    svg.innerHTML='';\n` +
    `    const f=FS[fi], phi=HXA[phii];\n` +
    `    flbl.textContent=\`f(a₁)=\${B[f[0]]}, f(a₂)=\${B[f[1]]}, f(a₃)=\${B[f[2]]}\`;\n` +
    `    phiLbl.textContent=\`φ: x₁↦\${A[phi[0]]}, x₂↦\${A[phi[1]]}\`;\n` +
    `\n` +
    `    // Compute images along each arrow\n` +
    `    // F(f)(φ) = f∘φ : X→B, values (f(φ(x1)), f(φ(x2)))\n` +
    `    const fphi=[f[phi[0]], f[phi[1]]];\n` +
    `    const topIdx = fphi[0]*2 + fphi[1];              // index in HXB\n` +
    `    // η_A(φ) = φ∘u : Y→A, y ↦ φ(x1)\n` +
    `    const leftIdx = phi[0];                          // index in HYA\n` +
    `    // Blue finish: η_B(f∘φ) = (f∘φ)∘u : y ↦ (f∘φ)(x1) = f[phi[0]] = fphi[0]\n` +
    `    const blueBR = fphi[0];                          // index in HYB\n` +
    `    // Pink finish: G(f)(φ∘u) = f∘(φ∘u) : y ↦ f(φ(x1)) = f[phi[0]]\n` +
    `    const pinkBR = f[leftIdx];                       // index in HYB\n` +
    `    const agree = (blueBR===pinkBR);\n` +
    `\n` +
    `    // Highlights\n` +
    `    const hlHXA={[phii]: {fill:'var(--yellow)', stroke:'var(--yellow)', textColor:'#0b0d10'}};\n` +
    `    const hlHXB={[topIdx]: {fill:'var(--blue)', stroke:'var(--blue)', textColor:'#0b0d10'}};\n` +
    `    const hlHYA={[leftIdx]: {fill:'var(--pink)', stroke:'var(--pink)', textColor:'#0b0d10'}};\n` +
    `    const hlHYB={};\n` +
    `    if(agree){ hlHYB[blueBR]={fill:'var(--green)', stroke:'var(--green)', textColor:'#0b0d10'}; }\n` +
    `    else { hlHYB[blueBR]={fill:'var(--blue)', stroke:'var(--blue)', textColor:'#0b0d10'};\n` +
    `           hlHYB[pinkBR]={fill:'var(--pink)', stroke:'var(--pink)', textColor:'#0b0d10'}; }\n` +
    `\n` +
    `    drawGrid('HXA', hlHXA, true);\n` +
    `    drawGrid('HXB', hlHXB, false);\n` +
    `    drawGrid('HYA', hlHYA, false);\n` +
    `    drawGrid('HYB', hlHYB, false);\n` +
    `\n` +
    `    // Functor-action labels in the gaps\n` +
    `    const midX = (G.HXA.x + G.HXA.cols*G.HXA.cell + G.HXB.x)/2;\n` +
    `    const midY_top = G.HXA.y - 40;\n` +
    `    const midY_bot = G.HYA.y + G.HYA.cell + 40;\n` +
    `    function txt(x,y,s,c,style){ const t=SVG('text',{x,y,'text-anchor':'middle','font-size':12,fill:c,'font-style':'italic'});\n` +
    `      if(style==='b') t.setAttribute('font-weight','600'); t.textContent=s; svg.appendChild(t); }\n` +
    `    txt(midX, midY_top, 'F(f) = f ∘ —', 'var(--blue)', 'b');\n` +
    `    txt(midX, midY_bot, 'G(f) = f ∘ —', 'var(--pink)', 'b');\n` +
    `\n` +
    `    // Left / right η labels\n` +
    `    const midY_lr = (G.HXA.y + G.HXA.rows*G.HXA.cell + G.HYA.y)/2;\n` +
    `    txt(60, midY_lr-8, 'η_A = — ∘ u', 'var(--pink)', 'b');\n` +
    `    txt(60, midY_lr+8, '(precompose)', 'var(--mute)');\n` +
    `    txt(670, midY_lr-8, 'η_B = — ∘ u', 'var(--blue)', 'b');\n` +
    `    txt(670, midY_lr+8, '(precompose)', 'var(--mute)');\n` +
    `\n` +
    `    // --- Route arrows drawn CELL-TO-CELL ---\n` +
    `    // blue top: yellow cell → blue cell\n` +
    `    const pYellow = center(G.HXA, phii);\n` +
    `    const pBlueT  = center(G.HXB, topIdx);\n` +
    `    const pPinkL  = center(G.HYA, leftIdx);\n` +
    `    const pBlueBR = center(G.HYB, blueBR);\n` +
    `    const pPinkBR = center(G.HYB, pinkBR);\n` +
    `\n` +
    `    drawArrow(svg, pYellow, pBlueT, {color:'var(--blue)', markerId:'nt-blueTop', curve:-18, width:2.2, pad1:20, pad2:22});\n` +
    `    drawArrow(svg, pBlueT,  pBlueBR, {color:'var(--blue)', markerId:'nt-blueRight', curve:18, width:2.2, pad1:20, pad2:22});\n` +
    `    drawArrow(svg, pYellow, pPinkL, {color:'var(--pink)', markerId:'nt-pinkLeft', curve:-18, width:2.2, pad1:20, pad2:22, dash:'6 3'});\n` +
    `    drawArrow(svg, pPinkL,  pPinkBR, {color:'var(--pink)', markerId:'nt-pinkBot', curve:18, width:2.2, pad1:20, pad2:22, dash:'6 3'});\n` +
    `\n` +
    `    // agreement ring\n` +
    `    if(agree){\n` +
    `      svg.appendChild(SVG('circle',{cx:pBlueBR[0], cy:pBlueBR[1], r:22, fill:'none',\n` +
    `        stroke:'var(--green)', 'stroke-width':2, 'stroke-dasharray':'3 2', opacity:0.9}));\n` +
    `      const chk=SVG('text',{x:pBlueBR[0]+28, y:pBlueBR[1]+4,'font-size':14,fill:'var(--green)','font-weight':700});\n` +
    `      chk.textContent='✓'; svg.appendChild(chk);\n` +
    `    }\n` +
    `\n` +
    `    // readout\n` +
    `    out.innerHTML =\n` +
    `      \`<div><span style="color:var(--yellow);font-weight:600">φ</span>: x₁↦\${A[phi[0]]}, x₂↦\${A[phi[1]]} &nbsp;·&nbsp; <b>f</b>: (\${B[f[0]]}, \${B[f[1]]}, \${B[f[2]]})</div>\`+\n` +
    `      \`<div style="color:var(--blue);margin-top:6px">▸ blue (top → right): φ  ─F(f)→  f∘φ = \${B[fphi[0]]}\${B[fphi[1]]}  ─η_B→  y ↦ \${B[blueBR]}</div>\`+\n` +
    `      \`<div style="color:var(--pink)">▸ pink (left → bottom): φ  ─η_A→  y ↦ \${A[leftIdx]}  ─G(f)→  y ↦ \${B[pinkBR]}</div>\`+\n` +
    `      \`<div style="color:var(--green);margin-top:6px;font-weight:600">\`+\n` +
    `        (agree?\`✓ both routes end at \${B[blueBR]} — the square commutes (as it must for every φ and every f).\`\n` +
    `             :\`✗ routes disagree (this is a bug — naturality should force agreement).\`)+\n` +
    `      \`</div>\`;\n` +
    `  }\n` +
    `\n` +
    `  slider.addEventListener('input', ()=>{fi=parseInt(slider.value,10); render();});\n` +
    `  phiSl.addEventListener('input',  ()=>{phii=parseInt(phiSl.value,10); render();});\n` +
    `  // click a yellow cell to choose φ\n` +
    `  svg.addEventListener('click', (e)=>{\n` +
    `    const g=e.target.getAttribute && e.target.getAttribute('data-grid');\n` +
    `    const i=e.target.getAttribute && e.target.getAttribute('data-idx');\n` +
    `    if(g==='HXA' && i!=null){ phii=parseInt(i,10); phiSl.value=phii; render(); }\n` +
    `  });\n` +
    `  play.addEventListener('click', ()=>{\n` +
    `    if(timer){ clearInterval(timer); timer=null; play.textContent='play'; return; }\n` +
    `    play.textContent='stop';\n` +
    `    timer=setInterval(()=>{\n` +
    `      fi=(fi+1)%FS.length;\n` +
    `      if(fi===0) phii=(phii+1)%HXA.length;\n` +
    `      slider.value=fi; phiSl.value=phii;\n` +
    `      render();\n` +
    `    }, 900);\n` +
    `  });\n` +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
