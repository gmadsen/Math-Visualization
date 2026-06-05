// surface-3d widget — self-contained shared renderer for drag-to-rotate 3D
// parametric surfaces.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer bundles its OWN 3D engine — rotation, orthographic projection,
// painter's-algorithm depth sort, Lambert shading (via fill-opacity, so it stays
// palette-token-only), auto-fit scaling, and mesh decimation while dragging. It
// does NOT use the page-global make3DDraggable/proj3 helpers, and it touches no
// SVG-only DOM API (rotation comes from raw pixel deltas), so it is jsdom-safe
// and any topic can adopt it. The author supplies only `surf(u,v)` (model coords)
// plus optional sliders / colorOf / readoutText in bodyScript.
//
// A non-HTML frontend can ignore renderScript and drive react-three-fiber from
// the structural params (uRange, vRange, nu, nv, sliders, initialYaw/Pitch).

function sliderRow(s) {
  const echo = s.outId ? `\n    <span class="small" id="${s.outId}"></span>` : '';
  return (
    `  <div class="row">\n` +
    `    <label for="${s.id}">${s.label}</label>\n` +
    `    <input type="range" id="${s.id}" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.init}">${echo}\n` +
    `  </div>`
  );
}

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint, viewBox, svgWidth, svgHeight } = params;
  const svgTitle = params.svgTitle || title;
  const outputInitial = params.outputInitial != null ? params.outputInitial : '&nbsp;';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  const rows = (params.sliders || []).map(sliderRow).join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="cursor:grab;touch-action:none"><title>${svgTitle}</title></svg>\n` +
    (rows ? rows + '\n' : '') +
    `  <div class="readout" id="${outputId}">${outputInitial}</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { svgId, outputId, uRange, vRange, nu, nv, bodyScript } = params;
  const yaw0 = params.initialYaw != null ? params.initialYaw : 0.6;
  const pitch0 = params.initialPitch != null ? params.initialPitch : 0.5;
  const color = params.color || 'var(--cyan)';
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const G=SVG('g'); svg.appendChild(G);\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 640 400').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], H=_vb[3], cx=_vb[0]+W/2, cy=_vb[1]+H/2;\n` +
    `  const U0=${uRange[0]}, U1=${uRange[1]}, V0=${vRange[0]}, V1=${vRange[1]}, NU=${nu}, NV=${nv};\n` +
    `  const DEFCOLOR=${JSON.stringify(color)};\n` +
    `  let yaw=${yaw0}, pitch=${pitch0}, dragging=false, lx=0, ly=0;\n` +
    `  // ---- author surf(u,v)[, colorOf, readoutText] ----\n` +
    bodyScript + `\n` +
    `  // ---- 3D engine (supplied by surface-3d) ----\n` +
    `  function rotv(p){ const ca=Math.cos(yaw),sa=Math.sin(yaw),cb=Math.cos(pitch),sb=Math.sin(pitch);\n` +
    `    const X=p[0]*ca-p[1]*sa, Y=p[0]*sa+p[1]*ca, Z=p[2]; return [X, Y*cb-Z*sb, Y*sb+Z*cb]; }\n` +
    `  function render(){\n` +
    `    G.innerHTML='';\n` +
    `    const su=dragging?Math.max(6,NU>>1):NU, sv=dragging?Math.max(6,NV>>1):NV;\n` +
    `    const P=[]; let maxr=1e-6;\n` +
    `    for(let i=0;i<=su;i++){ P[i]=[]; const u=U0+(U1-U0)*i/su;\n` +
    `      for(let j=0;j<=sv;j++){ const v=V0+(V1-V0)*j/sv; const q=surf(u,v); P[i][j]=q;\n` +
    `        const r=Math.hypot(q[0],q[1],q[2]); if(r>maxr)maxr=r; } }\n` +
    `    const scale=0.44*Math.min(W,H)/maxr;\n` +
    `    const proj=function(p){ const r=rotv(p); return {x:cx+scale*r[0], y:cy-scale*r[2], d:r[1]}; };\n` +
    `    const faces=[];\n` +
    `    for(let i=0;i<su;i++)for(let j=0;j<sv;j++){\n` +
    `      const a=P[i][j], b=P[i+1][j], c=P[i+1][j+1], e=P[i][j+1];\n` +
    `      const pa=proj(a),pb=proj(b),pc=proj(c),pe=proj(e);\n` +
    `      const depth=(pa.d+pb.d+pc.d+pe.d)/4;\n` +
    `      const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2], wx=e[0]-a[0],wy=e[1]-a[1],wz=e[2]-a[2];\n` +
    `      const nx=uy*wz-uz*wy, ny=uz*wx-ux*wz, nz=ux*wy-uy*wx; const rn=rotv([nx,ny,nz]);\n` +
    `      const nl=Math.hypot(rn[0],rn[1],rn[2])||1; const lam=0.30+0.62*Math.abs(rn[1])/nl;\n` +
    `      const um=U0+(U1-U0)*(i+0.5)/su, vm=V0+(V1-V0)*(j+0.5)/sv;\n` +
    `      const col=(typeof colorOf==='function')?colorOf(um,vm,a):DEFCOLOR;\n` +
    `      faces.push({pts:[pa,pb,pc,pe], depth:depth, op:lam.toFixed(3), col:col});\n` +
    `    }\n` +
    `    faces.sort(function(f,g){ return g.depth-f.depth; });\n` +
    `    for(const f of faces){ const d='M'+f.pts.map(function(p){return p.x.toFixed(1)+' '+p.y.toFixed(1);}).join(' L ')+' Z';\n` +
    `      G.appendChild(SVG('path',{d:d, fill:f.col, 'fill-opacity':f.op, stroke:'var(--bg)', 'stroke-width':0.4, 'stroke-opacity':0.5})); }\n` +
    `    out.textContent=(typeof readoutText==='function')?readoutText():('drag to rotate · yaw '+(yaw*180/Math.PI).toFixed(0)+'°, pitch '+(pitch*180/Math.PI).toFixed(0)+'°');\n` +
    `  }\n` +
    `  svg.addEventListener('pointerdown',function(ev){ ev.preventDefault(); dragging=true; lx=ev.clientX; ly=ev.clientY; svg.style.cursor='grabbing'; });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!dragging) return; yaw+=(ev.clientX-lx)*0.01; pitch+=(ev.clientY-ly)*0.01; pitch=Math.max(-1.5,Math.min(1.5,pitch)); lx=ev.clientX; ly=ev.clientY; render(); });\n` +
    `  window.addEventListener('pointerup',function(){ if(dragging){ dragging=false; svg.style.cursor='grab'; render(); } });\n` +
    (params.sliders || []).map(s => `  $('#${s.id}').addEventListener('input',render);`).join('\n') + (params.sliders && params.sliders.length ? '\n' : '') +
    `  render();\n` +
    `})();\n` +
    `</script>`
  );
}
