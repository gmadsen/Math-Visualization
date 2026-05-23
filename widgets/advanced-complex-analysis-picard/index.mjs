// advanced-complex-analysis-picard widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The function eval + value-coverage sampling are
// intrinsic (a `kind` enum); params carry the case menu (validated against
// ./schema.json). The widget samples the domain and shades the values of the
// w-plane that get hit, marking any omitted value (Little / Great Picard).

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
    `    <label for="${widgetId}-sel">$f(z)$</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `    <label for="${widgetId}-r">radius</label>\n` +
    `    <input type="range" id="${widgetId}-r" min="0.4" max="4" value="2" step="0.1">\n` +
    `    <span class="pill" id="${widgetId}-rval">2.0</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 290" width="540" height="290" role="img" aria-label="The values of the w-plane attained by f, with any omitted value marked"><title>Picard's theorems: which values an entire function (or one near an essential singularity) attains</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, functions } = params;
  const data = JSON.stringify(functions);
  return (
    `<script>\n` +
    `/* advanced-complex-analysis-picard widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var FNS = ${data};\n` +
    `  var byId = {}; FNS.forEach(function(g){ byId[g.id] = g; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var rIn = document.getElementById('${widgetId}-r'), rL = document.getElementById('${widgetId}-rval');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !rIn || !rL || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function cmul(p,q){ return [p[0]*q[0]-p[1]*q[1], p[0]*q[1]+p[1]*q[0]]; }\n` +
    `  function cdiv(p,q){ var d=q[0]*q[0]+q[1]*q[1]; return [(p[0]*q[0]+p[1]*q[1])/d, (p[1]*q[0]-p[0]*q[1])/d]; }\n` +
    `  function cexp(p){ var e=Math.exp(p[0]); return [e*Math.cos(p[1]), e*Math.sin(p[1])]; }\n` +
    `  function csin(p){ return [Math.sin(p[0])*Math.cosh(p[1]), Math.cos(p[0])*Math.sinh(p[1])]; }\n` +
    `  function feval(kind, z){\n` +
    `    if(kind==='ez') return cexp(z);\n` +
    `    if(kind==='z2') return cmul(z,z);\n` +
    `    if(kind==='sinz') return csin(z);\n` +
    `    if(kind==='einvz') return cexp(cdiv([1,0], z));\n` +
    `    if(kind==='sininvz') return csin(cdiv([1,0], z));\n` +
    `    return z;\n` +
    `  }\n` +
    `  var W=3.4, NC=30, Cx=270, Cy=146, S=39;\n` +
    `  function WX(x){ return Cx + x*S; } function WY(y){ return Cy - y*S; }\n` +
    `  function draw(){\n` +
    `    var g = byId[sel.value] || FNS[0], R = +rIn.value;\n` +
    `    rL.textContent = R.toFixed(1);\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // sample the domain, mark which w-cells are hit\n` +
    `    var hit = new Array(NC*NC); for(var q=0;q<hit.length;q++) hit[q]=false;\n` +
    `    var punctured = (g.domain==='punctured'), z, w, i1, i2, a, b;\n` +
    `    function mark(w){ if(w[0]>=-W && w[0]<W && w[1]>=-W && w[1]<W){ hit[Math.floor((w[1]+W)/(2*W)*NC)*NC + Math.floor((w[0]+W)/(2*W)*NC)]=true; } }\n` +
    `    if(!punctured){\n` +
    `      // disk |z| <= R: dense polar grid (radial step kept below the w-cell size)\n` +
    `      var nr=130, nt=170; for(i1=1;i1<=nr;i1++){ var rho=R*i1/nr; for(i2=0;i2<nt;i2++){ var th=2*Math.PI*i2/nt; mark(feval(g.kind, [rho*Math.cos(th), rho*Math.sin(th)])); } }\n` +
    `    } else {\n` +
    `      // punctured 0<|z|<=R around an essential singularity: sample in the u = 1/z plane\n` +
    `      // (the natural log/arg domain for e^u, sin u). z = 1/u lies in 0<|z|<=R iff |u| >= 1/R.\n` +
    `      // Box must reach the high-winding preimages: as R shrinks, hitting a value needs |u| >= 1/R,\n` +
    `      // so for e^{1/z} large |Im u| (winding k=+-1,...) and for sin(1/z) large |Re u| (many periods).\n` +
    `      var bx = (g.kind==='einvz') ? [-3.4, 1.35, -7.6, 7.6] : [-7.4, 7.4, -2.4, 2.4];\n` +
    `      var inv2 = 1/(R*R), nx=190, ny=190; for(i1=0;i1<=nx;i1++){ a = bx[0] + (bx[1]-bx[0])*i1/nx;\n` +
    `        for(i2=0;i2<=ny;i2++){ b = bx[2] + (bx[3]-bx[2])*i2/ny; if(a*a+b*b < inv2) continue; z=cdiv([1,0],[a,b]); mark(feval(g.kind, z)); } }\n` +
    `    }\n` +
    `    // window + axes\n` +
    `    svg.appendChild(mk('line', {x1:Cx-W*S, y1:Cy, x2:Cx+W*S, y2:Cy, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:Cx, y1:Cy-W*S, x2:Cx, y2:Cy+W*S, stroke:'var(--line)'}));\n` +
    `    // covered cells, as one path\n` +
    `    var cw=2*W/NC, d='', c, rr; for(rr=0;rr<NC;rr++){ for(c=0;c<NC;c++){ if(hit[rr*NC+c]){ var wx0=-W+c*cw, wy0=-W+rr*cw; var x0=WX(wx0), x1=WX(wx0+cw), yb=WY(wy0), yt=WY(wy0+cw); d+='M'+x0.toFixed(1)+' '+yt.toFixed(1)+'H'+x1.toFixed(1)+'V'+yb.toFixed(1)+'H'+x0.toFixed(1)+'Z'; } } }\n` +
    `    if(d) svg.appendChild(mk('path', {d:d, fill:'var(--cyan)', opacity:0.5, stroke:'none'}));\n` +
    `    svg.appendChild(mk('text', {x:Cx, y:18, 'text-anchor':'middle', 'font-size':11, fill:'var(--mute)', 'font-style':'italic'}, 'values hit in the w-plane (cyan)'));\n` +
    `    // omitted value marker\n` +
    `    if(g.omit){ var ox=WX(g.omit.re), oy=WY(g.omit.im); svg.appendChild(mk('circle', {cx:ox, cy:oy, r:5, fill:'var(--panel)', stroke:'var(--pink)', 'stroke-width':2}));\n` +
    `      svg.appendChild(mk('text', {x:ox+9, y:oy+4, 'font-size':10, fill:'var(--pink)'}, 'omitted: ' + g.omit.re + (g.omit.im?('+'+g.omit.im+'i'):''))); }\n` +
    `    // readout\n` +
    `    var domTxt = punctured ? ('the punctured disk 0 < |z| \\u2264 ' + R.toFixed(1)) : ('the disk |z| \\u2264 ' + R.toFixed(1));\n` +
    `    var lines = [];\n` +
    `    if(punctured){ lines.push('Great Picard: near an essential singularity, f takes every value \\u2014 with at most one exception \\u2014 infinitely often.'); }\n` +
    `    else { lines.push('Little Picard: a non-constant entire function omits at most ONE value of \\u2102.'); }\n` +
    `    lines.push('Cyan = values f attains on ' + domTxt + ' (within |w| \\u2264 ' + W + ').');\n` +
    `    if(g.omit){ lines.push('This f omits exactly w = ' + g.omit.re + (g.omit.im?('+'+g.omit.im+'i'):'') + ' \\u2014 the dark hole at the pink ring. ' + (punctured?'Shrink the radius: the hole never fills, but everything else stays covered.':'Grow R: the covered region swells toward all of \\u2102 except that one point.')); }\n` +
    `    else { lines.push('This f omits NO value: the whole window fills in (it is surjective onto \\u2102' + (punctured?', taking every value infinitely often).':').')); }\n` +
    `    if(g.note) lines.push(g.note);\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw); rIn.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
