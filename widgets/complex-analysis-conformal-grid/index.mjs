// complex-analysis-conformal-grid widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The function eval is intrinsic (a `kind` enum);
// params carry the case menu (validated against ./schema.json). A grid in the
// z-plane is drawn beside its image under f; one vertical and one horizontal
// gridline are highlighted through a movable sample point, and the image
// crossing angle is measured numerically (90° for holomorphic = conformal).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, functions } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = functions
    .map((g, i) => `      <option value="${escapeHtml(g.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(g.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">map $f(z)$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-t">sample point</label>\n` +
    `    <input type="range" id="${widgetId}-t" min="0" max="1" value="0.4" step="0.02">\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 280" width="540" height="280" role="img" aria-label="A grid in the z-plane and its image under f, with one crossing highlighted"><title>Conformality: a holomorphic map sends the orthogonal grid to a grid that still crosses at right angles</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* complex-analysis-conformal-grid widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var byId = {}; FNS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var tIn = document.getElementById('${widgetId}-t');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !tIn || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function cdiv(p,q){ var d=q[0]*q[0]+q[1]*q[1]; return [(p[0]*q[0]+p[1]*q[1])/d, (p[1]*q[0]-p[0]*q[1])/d]; }\n` +
    `  function cexp(p){ var e=Math.exp(p[0]); return [e*Math.cos(p[1]), e*Math.sin(p[1])]; }\n` +
    `  function feval(kind, z){\n` +
    `    if(kind==='z2') return cmul(z,z);\n` +
    `    if(kind==='ez') return cexp(z);\n` +
    `    if(kind==='inv_z') return cdiv([1,0], z);\n` +
    `    if(kind==='conj') return [z[0], -z[1]];\n` +
    `    if(kind==='redouble') return [2*z[0], 0];\n` +
    `    return z;\n` +
    `  }\n` +
    `  var X0=0.4, X1=1.9, Y0=-0.75, Y1=0.75, NX=7, NY=7, SN=40;\n` +
    `  var Lcx=136, Lcy=140, SCD=78;\n` +
    `  function DX(x){ return Lcx + (x-(X0+X1)/2)*SCD; } function DY(y){ return Lcy - y*SCD; }\n` +
    `  function vLine(x){ var pts=[], i, y; for(i=0;i<=SN;i++){ y=Y0+(Y1-Y0)*i/SN; pts.push([x,y]); } return pts; }\n` +
    `  function hLine(y){ var pts=[], i, x; for(i=0;i<=SN;i++){ x=X0+(X1-X0)*i/SN; pts.push([x,y]); } return pts; }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0], t = +tIn.value;\n` +
    `    var px = X0 + t*(X1-X0), py = Y0 + t*(Y1-Y0);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // collect all gridlines (domain space)\n` +
    `    var V=[], H=[], i;\n` +
    `    for(i=0;i<NX;i++) V.push(vLine(X0+(X1-X0)*i/(NX-1)));\n` +
    `    for(i=0;i<NY;i++) H.push(hLine(Y0+(Y1-Y0)*i/(NY-1)));\n` +
    `    // image points + bbox\n` +
    `    var xmin=1e9, xmax=-1e9, ymin=1e9, ymax=-1e9;\n` +
    `    function img(line){ return line.map(function(p){ var w=feval(g.kind, p); if(w[0]<xmin)xmin=w[0]; if(w[0]>xmax)xmax=w[0]; if(w[1]<ymin)ymin=w[1]; if(w[1]>ymax)ymax=w[1]; return w; }); }\n` +
    `    var Vi=V.map(img), Hi=H.map(img);\n` +
    `    var hpV = vLine(px), hpH = hLine(py); var hpVi=img(hpV), hpHi=img(hpH);\n` +
    `    var w=Math.max(xmax-xmin, 1e-3), h=Math.max(ymax-ymin, 1e-3);\n` +
    `    var SCI=Math.min(224/w, 150/h), Rcx=408, Rcy=140, cxI=(xmin+xmax)/2, cyI=(ymin+ymax)/2;\n` +
    `    function IX(p){ return Rcx + (p[0]-cxI)*SCI; } function IY(p){ return Rcy - (p[1]-cyI)*SCI; }\n` +
    `    function poly(line, tf, attrs){ var pts=line.map(function(p){ return tf===0?(DX(p[0]).toFixed(1)+','+DY(p[1]).toFixed(1)):(IX(p).toFixed(1)+','+IY(p).toFixed(1)); }); svg.appendChild(mk('polyline', Object.assign({points:pts.join(' '), fill:'none'}, attrs))); }\n` +
    `    // faint grids\n` +
    `    V.forEach(function(l){ poly(l, 0, {stroke:'var(--line)', 'stroke-width':1}); });\n` +
    `    H.forEach(function(l){ poly(l, 0, {stroke:'var(--line)', 'stroke-width':1}); });\n` +
    `    Vi.forEach(function(l){ poly(l, 1, {stroke:'var(--line)', 'stroke-width':1}); });\n` +
    `    Hi.forEach(function(l){ poly(l, 1, {stroke:'var(--line)', 'stroke-width':1}); });\n` +
    `    // highlighted lines\n` +
    `    poly(hpV, 0, {stroke:'var(--yellow)', 'stroke-width':2}); poly(hpH, 0, {stroke:'var(--cyan)', 'stroke-width':2});\n` +
    `    poly(hpVi, 1, {stroke:'var(--yellow)', 'stroke-width':2}); poly(hpHi, 1, {stroke:'var(--cyan)', 'stroke-width':2});\n` +
    `    // crossing dots\n` +
    `    var v=[px,py], vi=feval(g.kind, v);\n` +
    `    svg.appendChild(mk('circle', {cx:DX(px), cy:DY(py), r:4, fill:'var(--pink)'}));\n` +
    `    svg.appendChild(mk('circle', {cx:IX(vi), cy:IY(vi), r:4, fill:'var(--pink)'}));\n` +
    `    svg.appendChild(mk('text', {x:136, y:18, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'z-plane (grid)'));\n` +
    `    svg.appendChild(mk('text', {x:408, y:18, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'image under f'));\n` +
    `    // measure image crossing angle via finite-difference tangents at v\n` +
    `    var e=1e-4;\n` +
    `    var th=[ (feval(g.kind,[px+e,py])[0]-feval(g.kind,[px-e,py])[0]), (feval(g.kind,[px+e,py])[1]-feval(g.kind,[px-e,py])[1]) ];\n` +
    `    var tv=[ (feval(g.kind,[px,py+e])[0]-feval(g.kind,[px,py-e])[0]), (feval(g.kind,[px,py+e])[1]-feval(g.kind,[px,py-e])[1]) ];\n` +
    `    var mh=Math.hypot(th[0],th[1]), mv=Math.hypot(tv[0],tv[1]);\n` +
    `    var lines = [];\n` +
    `    if(mh<1e-9 || mv<1e-9){\n` +
    `      lines.push('The image collapses to a line: at least one grid direction is flattened, so angles are destroyed.');\n` +
    `      lines.push('2\\u00b7Re(z) is real-linear but NOT complex-differentiable \\u2014 it is not holomorphic and not conformal.');\n` +
    `    } else {\n` +
    `      var cross=th[0]*tv[1]-th[1]*tv[0], dot=th[0]*tv[0]+th[1]*tv[1];\n` +
    `      var ang=Math.atan2(cross, dot)*180/Math.PI;\n` +
    `      lines.push('Domain: the gridlines cross at +90\\u00b0.   Image: they cross at ' + ang.toFixed(1) + '\\u00b0.');\n` +
    `      if(g.kind==='conj'){\n` +
    `        lines.push('\\u2248 \\u221290\\u00b0: conjugation preserves the angle\\u2019s SIZE but reverses orientation (anti-conformal). It fails the Cauchy\\u2013Riemann equations \\u2014 not holomorphic.');\n` +
    `      } else {\n` +
    `        lines.push('\\u2248 +90\\u00b0: f is holomorphic, hence CONFORMAL \\u2014 it preserves angles and orientation. Near each point f acts as multiplication by f\\u2032(z): a rotation by arg f\\u2032 and a scaling by |f\\u2032| (the amplitwist). That is the geometry of the Cauchy\\u2013Riemann equations.');\n` +
    `      }\n` +
    `    }\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); tIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
