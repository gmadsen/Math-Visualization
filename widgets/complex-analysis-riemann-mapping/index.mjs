// complex-analysis-riemann-mapping widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The conformal-map eval is intrinsic (a `kind` enum);
// params carry the case menu (validated against ./schema.json). A canonical
// simply-connected region's grid is drawn beside its image under an explicit
// conformal map onto the unit disk.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, regions } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = regions
    .map((g, i) => `      <option value="${escapeHtml(g.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(g.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">region $U$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 280" width="540" height="280" role="img" aria-label="A simply-connected region and its conformal image filling the unit disk"><title>Riemann mapping theorem: every simply-connected proper open subset of C maps conformally onto the unit disk</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, regions } = params;
  const data = JSON.stringify(regions);
  return (
    `<script>\n` +
    `/* complex-analysis-riemann-mapping widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var REG = ${data};\n` +
    `  var byId = {}; REG.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function cdiv(p,q){ var d=q[0]*q[0]+q[1]*q[1]; return [(p[0]*q[0]+p[1]*q[1])/d, (p[1]*q[0]-p[0]*q[1])/d]; }\n` +
    `  function cexp(p){ var e=Math.exp(p[0]); return [e*Math.cos(p[1]), e*Math.sin(p[1])]; }\n` +
    `  function cayley(w){ return cdiv([w[0], w[1]-1], [w[0], w[1]+1]); } // (w-i)/(w+i): half-plane -> disk\n` +
    `  function phi(kind, z){\n` +
    `    if(kind==='uhp') return cayley(z);\n` +
    `    if(kind==='rhp') return cdiv([z[0]-1, z[1]], [z[0]+1, z[1]]);\n` +
    `    if(kind==='quarter') return cayley(cmul(z,z));\n` +
    `    if(kind==='strip') return cayley(cexp(z));\n` +
    `    return z;\n` +
    `  }\n` +
    `  // region domain bbox + base point (maps to centre 0) + formula text\n` +
    `  var SPEC = {\n` +
    `    uhp:     {X0:-2.2, X1:2.2, Y0:0.12, Y1:2.6,  z0:[0,1],                          f:'\\u03c6(z) = (z \\u2212 i)/(z + i)'},\n` +
    `    rhp:     {X0:0.12, X1:2.6, Y0:-2.2, Y1:2.2,  z0:[1,0],                          f:'\\u03c6(z) = (z \\u2212 1)/(z + 1)'},\n` +
    `    quarter: {X0:0.12, X1:2.1, Y0:0.12, Y1:2.1,  z0:[Math.SQRT1_2, Math.SQRT1_2],   f:'\\u03c6(z) = (z\\u00b2 \\u2212 i)/(z\\u00b2 + i)'},\n` +
    `    strip:   {X0:-1.7, X1:1.7, Y0:0.12, Y1:Math.PI-0.12, z0:[0, Math.PI/2],         f:'\\u03c6(z) = (e^z \\u2212 i)/(e^z + i)'}\n` +
    `  };\n` +
    `  var NX=8, NY=8, SN=44;\n` +
    `  var Lcx=130, Lcy=140, Rcx=406, Rcy=140, RDISK=104;\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || REG[0], s = SPEC[g.kind] || SPEC.uhp;\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var SCD = Math.min(214/(s.X1-s.X0), 214/(s.Y1-s.Y0)), mx=(s.X0+s.X1)/2, my=(s.Y0+s.Y1)/2;\n` +
    `    function DX(x){ return Lcx + (x-mx)*SCD; } function DY(y){ return Lcy - (y-my)*SCD; }\n` +
    `    function IX(p){ return Rcx + p[0]*RDISK; } function IY(p){ return Rcy - p[1]*RDISK; }\n` +
    `    function line(fixed, isV){ var pts=[], i, t; for(i=0;i<=SN;i++){ t=i/SN; var z = isV ? [fixed, s.Y0+(s.Y1-s.Y0)*t] : [s.X0+(s.X1-s.X0)*t, fixed]; pts.push(z); } return pts; }\n` +
    `    function polyD(z, attrs){ var pts=z.map(function(p){ return DX(p[0]).toFixed(1)+','+DY(p[1]).toFixed(1); }); svg.appendChild(mk('polyline', Object.assign({points:pts.join(' '), fill:'none'}, attrs))); }\n` +
    `    function polyI(z, attrs){ var pts=z.map(function(p){ var w=phi(g.kind,p); return IX(w).toFixed(1)+','+IY(w).toFixed(1); }); svg.appendChild(mk('polyline', Object.assign({points:pts.join(' '), fill:'none'}, attrs))); }\n` +
    `    var i;\n` +
    `    // unit disk on the right\n` +
    `    svg.appendChild(mk('circle', {cx:Rcx, cy:Rcy, r:RDISK, fill:'color-mix(in srgb, var(--cyan) 7%, transparent)', stroke:'var(--cyan)', 'stroke-width':1.6}));\n` +
    `    // grids\n` +
    `    for(i=0;i<NX;i++){ var L=line(s.X0+(s.X1-s.X0)*i/(NX-1), true); polyD(L, {stroke:'var(--violet)', 'stroke-width':1, opacity:0.8}); polyI(L, {stroke:'var(--violet)', 'stroke-width':1, opacity:0.8}); }\n` +
    `    for(i=0;i<NY;i++){ var H=line(s.Y0+(s.Y1-s.Y0)*i/(NY-1), false); polyD(H, {stroke:'var(--green)', 'stroke-width':1, opacity:0.8}); polyI(H, {stroke:'var(--green)', 'stroke-width':1, opacity:0.8}); }\n` +
    `    // base point -> centre 0\n` +
    `    svg.appendChild(mk('circle', {cx:DX(s.z0[0]), cy:DY(s.z0[1]), r:4, fill:'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('circle', {cx:IX([0,0]), cy:IY([0,0]), r:4, fill:'var(--yellow)'}));\n` +
    `    svg.appendChild(mk('text', {x:DX(s.z0[0])+7, y:DY(s.z0[1])-5, 'font-size':10, fill:'var(--yellow)'}, 'z\\u2080'));\n` +
    `    svg.appendChild(mk('text', {x:IX([0,0])+7, y:IY([0,0])-5, 'font-size':10, fill:'var(--yellow)'}, '0'));\n` +
    `    svg.appendChild(mk('text', {x:Lcx, y:18, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'region U (grid)'));\n` +
    `    svg.appendChild(mk('text', {x:Rcx, y:18, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, '\\u03c6(U) = unit disk'));\n` +
    `    // readout\n` +
    `    var lines = [];\n` +
    `    lines.push('Riemann mapping theorem: every simply-connected proper open U \\u228a \\u2102 is conformally equivalent to the unit disk.');\n` +
    `    lines.push('Here ' + s.f + ' maps the ' + g.label + ' conformally ONTO the disk: the orthogonal grid stays orthogonal, U fills the disk, and z\\u2080 \\u2192 0.');\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
