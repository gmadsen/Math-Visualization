// complex-analysis-arithmetic widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The arithmetic is intrinsic; params carry only the
// initial z and w (validated against ./schema.json). renderMarkup converts the
// initial cartesian z0/w0 into polar slider defaults at render time.

import { escapeHtml } from '../_shared/escape.mjs';

function polar(c) {
  return { r: Math.hypot(c.re, c.im), a: Math.atan2(c.im, c.re) };
}

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const z0 = params.z0 || { re: 1.3, im: 0.5 };
  const w0 = params.w0 || { re: 0, im: 1 };
  const pz = polar(z0), pw = polar(w0);
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const f = (x) => x.toFixed(2);
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-mul" class="active">z × w</button>\n` +
    `    <button id="${widgetId}-add">z + w</button>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-zr">|z|</label>\n` +
    `    <input type="range" id="${widgetId}-zr" min="0" max="1.8" value="${f(pz.r)}" step="0.05">\n` +
    `    <label for="${widgetId}-za">arg z</label>\n` +
    `    <input type="range" id="${widgetId}-za" min="-3.14" max="3.14" value="${f(pz.a)}" step="0.05">\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-wr">|w|</label>\n` +
    `    <input type="range" id="${widgetId}-wr" min="0" max="1.8" value="${f(pw.r)}" step="0.05">\n` +
    `    <label for="${widgetId}-wa">arg w</label>\n` +
    `    <input type="range" id="${widgetId}-wa" min="-3.14" max="3.14" value="${f(pw.a)}" step="0.05">\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 290" width="540" height="290" role="img" aria-label="The Argand plane with z, w and their sum or product"><title>Complex arithmetic on the Argand plane: addition translates, multiplication rotates and scales</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* complex-analysis-arithmetic widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var mul = document.getElementById('${widgetId}-mul'), add = document.getElementById('${widgetId}-add');\n` +
    `  var zr = document.getElementById('${widgetId}-zr'), za = document.getElementById('${widgetId}-za');\n` +
    `  var wr = document.getElementById('${widgetId}-wr'), wa = document.getElementById('${widgetId}-wa');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!mul || !add || !zr || !za || !wr || !wa || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  var mode = 'mul';\n` +
    `  // SC small enough that the largest result (|z|+|w| or |z||w| up to 3.6 at the slider\n` +
    `  // maxima of 1.8) stays inside the 540x290 viewBox: 3.6*32 = 115 < min(CY, 290-CY).\n` +
    `  var CX=270, CY=148, SC=32;\n` +
    `  function PX(x){ return CX + x*SC; } function PY(y){ return CY - y*SC; }\n` +
    `  function vec(p, color, label, w){ \n` +
    `    svg.appendChild(mk('line', {x1:CX, y1:CY, x2:PX(p[0]), y2:PY(p[1]), stroke:color, 'stroke-width':w||2}));\n` +
    `    svg.appendChild(mk('circle', {cx:PX(p[0]), cy:PY(p[1]), r:3.5, fill:color}));\n` +
    `    if(label) svg.appendChild(mk('text', {x:PX(p[0])+7, y:PY(p[1])-5, 'font-size':12, fill:color, 'font-weight':600}, label));\n` +
    `  }\n` +
    `  function fmtC(p){ var a=p[0], b=p[1]; var rs=(Math.abs(a)<0.005?0:a).toFixed(2); var is=(Math.abs(b)<0.005?0:b).toFixed(2); return rs + (b>=0?' + ':' \\u2212 ') + Math.abs(is) + 'i'; }\n` +
    `  function draw(){\n` +
    `    var Rz=+zr.value, Az=+za.value, Rw=+wr.value, Aw=+wa.value;\n` +
    `    var z=[Rz*Math.cos(Az), Rz*Math.sin(Az)], w=[Rw*Math.cos(Aw), Rw*Math.sin(Aw)];\n` +
    `    var res = mode==='mul' ? [z[0]*w[0]-z[1]*w[1], z[0]*w[1]+z[1]*w[0]] : [z[0]+w[0], z[1]+w[1]];\n` +
    `    mul.className = mode==='mul'?'active':''; add.className = mode==='add'?'active':'';\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    // axes + unit circle\n` +
    `    svg.appendChild(mk('line', {x1:CX-170, y1:CY, x2:CX+170, y2:CY, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('line', {x1:CX, y1:CY-130, x2:CX, y2:CY+130, stroke:'var(--line)'}));\n` +
    `    svg.appendChild(mk('circle', {cx:CX, cy:CY, r:SC, fill:'none', stroke:'var(--line)', 'stroke-dasharray':'2 3'}));\n` +
    `    svg.appendChild(mk('text', {x:CX+SC+2, y:CY-4, 'font-size':9, fill:'var(--mute)'}, '1'));\n` +
    `    if(mode==='add'){\n` +
    `      svg.appendChild(mk('line', {x1:PX(z[0]), y1:PY(z[1]), x2:PX(res[0]), y2:PY(res[1]), stroke:'var(--green)', 'stroke-width':1, 'stroke-dasharray':'3 3'}));\n` +
    `      svg.appendChild(mk('line', {x1:PX(w[0]), y1:PY(w[1]), x2:PX(res[0]), y2:PY(res[1]), stroke:'var(--blue)', 'stroke-width':1, 'stroke-dasharray':'3 3'}));\n` +
    `    }\n` +
    `    vec(z, 'var(--blue)', 'z', 2); vec(w, 'var(--green)', 'w', 2);\n` +
    `    vec(res, 'var(--yellow)', mode==='mul'?'z\\u00b7w':'z+w', 2.4);\n` +
    `    // readout\n` +
    `    var modZ=Math.hypot(z[0],z[1]), modW=Math.hypot(w[0],w[1]), modR=Math.hypot(res[0],res[1]);\n` +
    `    var argZ=Math.atan2(z[1],z[0]), argW=Math.atan2(w[1],w[0]), argR=Math.atan2(res[1],res[0]);\n` +
    `    function argStr(mod, ang){ return mod<1e-9 ? 'undefined' : ang.toFixed(2); } // arg(0) is undefined\n` +
    `    var lines = [];\n` +
    `    lines.push('z = ' + fmtC(z) + '    (|z| = ' + modZ.toFixed(2) + ',  arg z = ' + argStr(modZ, argZ) + ')');\n` +
    `    lines.push('w = ' + fmtC(w) + '    (|w| = ' + modW.toFixed(2) + ',  arg w = ' + argStr(modW, argW) + ')');\n` +
    `    if(mode==='mul'){\n` +
    `      lines.push('z\\u00b7w = ' + fmtC(res) + '    (|z\\u00b7w| = ' + modR.toFixed(2) + ',  arg = ' + argStr(modR, argR) + ')');\n` +
    `      if(modZ<1e-9 || modW<1e-9){\n` +
    `        lines.push('MULTIPLY: |z\\u00b7w| = |z||w| = 0, so z\\u00b7w = 0 \\u2014 its argument is undefined (you cannot rotate/scale by a zero-length number).');\n` +
    `      } else {\n` +
    `        // arg z + arg w can exceed \\u03c0; reduce it to the principal value so it matches arg(z\\u00b7w).\n` +
    `        var sumArg = argZ + argW; while(sumArg > Math.PI) sumArg -= 2*Math.PI; while(sumArg <= -Math.PI) sumArg += 2*Math.PI;\n` +
    `        lines.push('MULTIPLY = rotate + scale:  |z\\u00b7w| = |z||w| = ' + (modZ*modW).toFixed(2) + ',  arg z + arg w = ' + (argZ+argW).toFixed(2) + ' \\u2261 ' + sumArg.toFixed(2) + ' (mod 2\\u03c0) = arg(z\\u00b7w). Multiplying by w rotates z by arg w and scales it by |w|.');\n` +
    `      }\n` +
    `    } else {\n` +
    `      lines.push('z+w = ' + fmtC(res) + '    (|z+w| = ' + modR.toFixed(2) + ')');\n` +
    `      lines.push('ADD = translate (tip-to-tail):  z+w is the diagonal of the parallelogram on z and w \\u2014 the same vector addition as in \\u211d\\u00b2.');\n` +
    `    }\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  mul.addEventListener('click', function(){ mode='mul'; draw(); });\n` +
    `  add.addEventListener('click', function(){ mode='add'; draw(); });\n` +
    `  [zr,za,wr,wa].forEach(function(s){ s.addEventListener('input', draw); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
