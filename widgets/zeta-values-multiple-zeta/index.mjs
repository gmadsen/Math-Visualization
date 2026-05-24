// zeta-values-multiple-zeta widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Multiple zeta values and the double-shuffle
// relations, computed by direct truncated summation (depth-2 sums via a
// running prefix, so O(N)).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-N">truncation $N$ (sum to $n_1\\le N$)</label>\n` +
    `    <input type="range" id="${widgetId}-N" min="20" max="50" value="34" step="1">\n` +
    `    <span class="pill" id="${widgetId}-Nv">N = …</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="Multiple zeta values bar chart and the stuffle, shuffle, and double-shuffle relations checked numerically"><title>Multiple zeta values: the weight-5 values and the stuffle / shuffle / double-shuffle relations, computed by truncated summation</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* zeta-values-multiple-zeta widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sN=document.getElementById('${widgetId}-N'), Nv=document.getElementById('${widgetId}-Nv');\n` +
    `  if(!svg||!out||!sN||!Nv) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  function z1(s,N){ var t=0; for(var n=1;n<=N;n++) t+=Math.pow(n,-s); return t; }\n` +
    `  function z2(s1,s2,N){ var t=0, pre=0; for(var n=1;n<=N;n++){ t+=Math.pow(n,-s1)*pre; pre+=Math.pow(n,-s2); } return t; }\n` +  // sum_{n>m} n^-s1 m^-s2
    `  function fmt(x){ return x.toFixed(4); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var N=Math.round(Math.pow(10, parseInt(sN.value,10)/10)); Nv.textContent='N = '+N.toLocaleString(); sN.setAttribute('aria-valuetext','N = '+N.toLocaleString());\n` +
    `    var Z2=z1(2,N), Z3=z1(3,N), Z5=z1(5,N);\n` +
    `    var Z21=z2(2,1,N), Z23=z2(2,3,N), Z32=z2(3,2,N), Z41=z2(4,1,N);\n` +
    `    // bar chart of weight-5 MZVs (+ zeta2, zeta3)\n` +
    `    var bars=[['\\u03b6(2)',Z2,'var(--mute)'],['\\u03b6(3)',Z3,'var(--mute)'],['\\u03b6(5)',Z5,'var(--cyan)'],['\\u03b6(2,3)',Z23,'var(--green)'],['\\u03b6(3,2)',Z32,'var(--green)'],['\\u03b6(4,1)',Z41,'var(--green)']];\n` +
    `    var BX0=50, BW=46, GAP=18, BBOT=150, BTOP=46, vmax=1.75;\n` +
    `    txt(BX0-8, BTOP-6, 'value', {size:9, fill:'var(--mute)', anchor:'end'});\n` +
    `    svg.appendChild(mk('line',{x1:BX0-8,y1:BBOT,x2:BX0+6*(BW+GAP),y2:BBOT,stroke:'var(--line)','stroke-width':1}));\n` +
    `    bars.forEach(function(b,i){ var x=BX0+i*(BW+GAP); var h=(b[1]/vmax)*(BBOT-BTOP); var y=BBOT-h;\n` +
    `      svg.appendChild(mk('rect',{x:x,y:y.toFixed(1),width:BW,height:h.toFixed(1),fill:b[2],'fill-opacity':0.8}));\n` +
    `      txt(x+BW/2, y-4, b[1].toFixed(3), {anchor:'middle', size:9, fill:'var(--ink)'});\n` +
    `      txt(x+BW/2, BBOT+13, b[0], {anchor:'middle', size:10, fill:'var(--ink)'}); });\n` +
    `    // relations panel\n` +
    `    var stuffleR=Z23+Z32+Z5, shuffleR=Z23+3*Z32+6*Z41, dblL=2*Z32+6*Z41;\n` +
    `    function ok(a,b){ return Math.abs(a-b)<0.01; }\n` +
    `    function chk(v){ return v?' \\u2713':' \\u2248'; }\n` +
    `    var ry=182, rh=18;\n` +
    `    txt(20, ry, 'relations (all hold as N\\u2192\\u221e; stuffle is exact at every N):', {size:10, fill:'var(--mute)'}); ry+=rh+2;\n` +
    `    txt(24, ry, 'Euler   \\u03b6(2,1) = '+fmt(Z21)+'   \\u03b6(3) = '+fmt(Z3)+chk(ok(Z21,Z3)), {size:11, fill:'var(--ink)', mono:true}); ry+=rh;\n` +
    `    txt(24, ry, 'stuffle \\u03b6(2)\\u03b6(3) = '+fmt(Z2*Z3)+' = \\u03b6(2,3)+\\u03b6(3,2)+\\u03b6(5) = '+fmt(stuffleR)+chk(ok(Z2*Z3,stuffleR)), {size:11, fill:'var(--ink)', mono:true}); ry+=rh;\n` +
    `    txt(24, ry, 'shuffle \\u03b6(2)\\u03b6(3) = '+fmt(Z2*Z3)+' = \\u03b6(2,3)+3\\u03b6(3,2)+6\\u03b6(4,1) = '+fmt(shuffleR)+chk(ok(Z2*Z3,shuffleR)), {size:11, fill:'var(--ink)', mono:true}); ry+=rh;\n` +
    `    txt(24, ry, 'double-shuffle  2\\u03b6(3,2)+6\\u03b6(4,1) = '+fmt(dblL)+' = \\u03b6(5) = '+fmt(Z5)+chk(ok(dblL,Z5)), {size:11, weight:700, fill:'var(--green)', mono:true}); ry+=rh+4;\n` +
    `    // Zagier dimension table\n` +
    `    var d=[1,0,1]; for(var n=3;n<=8;n++) d.push(d[n-2]+d[n-3]);\n` +
    `    txt(20, ry, 'Zagier:  d\\u2099 = d\\u2099\\u208b\\u2082 + d\\u2099\\u208b\\u2083   vs naive 2\\u207f\\u207b\\u00b2', {size:10, fill:'var(--mute)'}); ry+=14;\n` +
    `    var cells=''; for(n=2;n<=8;n++){ cells+='  n='+n+': d='+d[n]+' ('+(Math.pow(2,n-2))+')'; }\n` +
    `    txt(24, ry, cells.trim(), {size:9, fill:'var(--violet)', mono:true});\n` +
    `    out.textContent='A multiple zeta value nests the \\u03b6-sum: \\u03b6(s\\u2081,\\u2026,s\\u2096) = \\u03a3_{n\\u2081>\\u22ef>n\\u2096\\u22651} n\\u2081^{\\u2212s\\u2081}\\u22efn\\u2096^{\\u2212s\\u2096} (depth k, weight w=\\u03a3s\\u1d62). The field opens with Euler\\u2019s \\u03b6(2,1)=\\u03b6(3). Each MZV has TWO product structures. STUFFLE multiplies the nested sums and interleaves indices (with collisions where indices coincide and exponents add): \\u03b6(2)\\u03b6(3) = \\u03b6(2,3)+\\u03b6(3,2)+\\u03b6(5) \\u2014 this is an EXACT partial-sum identity, true at every truncation N. SHUFFLE writes each MZV as an iterated Chen integral in \\u03c9\\u2080=dt/t, \\u03c9\\u2081=dt/(1\\u2212t) and shuffles the letters: \\u03b6(2)\\u03b6(3) = \\u03b6(2,3)+3\\u03b6(3,2)+6\\u03b6(4,1). Subtracting the two expressions for \\u03b6(2)\\u03b6(3) kills the product and leaves the nontrivial DOUBLE-SHUFFLE relation 2\\u03b6(3,2)+6\\u03b6(4,1) = \\u03b6(5) among weight-5 MZVs (the panel checks it: currently '+fmt(dblL)+' vs \\u03b6(5)='+fmt(Z5)+'). Iterating double-shuffle across all weights generates the rich web of MZV identities, which collapses the \\u211a-span far below the naive 2^{n\\u22122} compositions: ZAGIER conjectured dim_\\u211a Z_n = d_n with d_n = d_{n\\u22122}+d_{n\\u22123} (a Padovan-type recurrence; d\\u2080..d\\u2088 = 1,0,1,1,1,2,2,3,4), proved as an UPPER bound by Goncharov and Terasoma. Raise N to watch the slowly-converging values (\\u03b6(2,1)\\u2192\\u03b6(3)) tighten.';\n` +
    `  }\n` +
    `  sN.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
