// harmonic-pontryagin widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A gallery of locally compact abelian groups and
// their Pontryagin duals, drawing the discrete↔compact swap and the double dual.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <button type="button" id="${widgetId}-g0">$\\mathbb{R}$</button>\n` +
    `    <button type="button" id="${widgetId}-g1">$\\mathbb{T}=\\mathbb{R}/\\mathbb{Z}$</button>\n` +
    `    <button type="button" id="${widgetId}-g2">$\\mathbb{Z}$</button>\n` +
    `    <button type="button" id="${widgetId}-g3">$\\mathbb{Z}/N$</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 250" width="560" height="250" role="img" aria-label="A gallery of locally compact abelian groups and their Pontryagin duals"><title>Pontryagin duality: G and its dual group, the discrete–compact swap, and the double dual</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* harmonic-pontryagin widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=[0,1,2,3].map(function(i){ return document.getElementById('${widgetId}-g'+i); });\n` +
    `  if(!svg || !out || btns.some(function(b){ return !b; })) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'middle', 'font-size':opt.size||11, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  function pic(kind, cx, cy, col){\n` +
    `    if(kind==='line'){ svg.appendChild(mk('line',{x1:cx-55,y1:cy,x2:cx+55,y2:cy,stroke:col,'stroke-width':2}));\n` +
    `      svg.appendChild(mk('path',{d:'M'+(cx+55)+' '+cy+' L'+(cx+47)+' '+(cy-4)+' L'+(cx+47)+' '+(cy+4)+' Z',fill:col}));\n` +
    `      svg.appendChild(mk('path',{d:'M'+(cx-55)+' '+cy+' L'+(cx-47)+' '+(cy-4)+' L'+(cx-47)+' '+(cy+4)+' Z',fill:col})); }\n` +
    `    else if(kind==='circle'){ svg.appendChild(mk('circle',{cx:cx,cy:cy,r:34,fill:'none',stroke:col,'stroke-width':2})); }\n` +
    `    else if(kind==='dots'){ for(var i=-3;i<=3;i++) svg.appendChild(mk('circle',{cx:cx+i*16,cy:cy,r:3,fill:col})); txt(cx-62,cy+4,'\\u22ef',{fill:'var(--mute)',size:13}); txt(cx+62,cy+4,'\\u22ef',{fill:'var(--mute)',size:13}); }\n` +
    `    else if(kind==='roots'){ var N=6; svg.appendChild(mk('circle',{cx:cx,cy:cy,r:34,fill:'none',stroke:'var(--line)','stroke-width':1,'stroke-dasharray':'3 3'}));\n` +
    `      for(var k=0;k<N;k++){ var a=-Math.PI/2 + k*2*Math.PI/N; svg.appendChild(mk('circle',{cx:cx+34*Math.cos(a),cy:cy+34*Math.sin(a),r:3.4,fill:col})); } } }\n` +
    `  var SCEN=[\n` +
    `    { G:'\\u211d', Gh:'\\u211d', chi:'\\u03c7_\\u03be(x) = e^{2\\u03c0i\\u03bex}', ft:'continuous Fourier transform', Gp:'line', Ghp:'line', Gt:'continuous, non-compact', Ght:'continuous, non-compact', self:true,\n` +
    `      note:'\\u211d is self-dual: every continuous character is x\\u21a6e^{2\\u03c0i\\u03bex} for a unique \\u03be\\u2208\\u211d. The \\u201cFourier transform\\u201d is the usual one on the line.' },\n` +
    `    { G:'\\u0054 = \\u211d/\\u2124', Gh:'\\u2124', chi:'\\u03c7_n(x) = e^{2\\u03c0inx}', ft:'Fourier series (f\\u0302 \\u2208 \\u2113\\u00b2(\\u2124))', Gp:'circle', Ghp:'dots', Gt:'compact', Ght:'discrete', self:false,\n` +
    `      note:'The circle \\u0054 is COMPACT; its dual is the DISCRETE group \\u2124 (the Fourier modes n). Compact \\u2194 discrete is the central swap of Pontryagin duality.' },\n` +
    `    { G:'\\u2124', Gh:'\\u0054', chi:'\\u03c7_\\u03b8(m) = e^{2\\u03c0im\\u03b8}', ft:'discrete-time Fourier transform', Gp:'dots', Ghp:'circle', Gt:'discrete', Ght:'compact', self:false,\n` +
    `      note:'\\u2124 is DISCRETE; its dual is the COMPACT circle \\u0054 (\\u03b8\\u2208[0,1)). Exactly the mirror image of the \\u0054\\u2194\\u2124 case \\u2014 dualizing swaps discrete and compact.' },\n` +
    `    { G:'\\u2124/N', Gh:'\\u2124/N', chi:'\\u03c7_k(j) = e^{2\\u03c0ijk/N}', ft:'discrete Fourier transform (DFT)', Gp:'roots', Ghp:'roots', Gt:'finite (here N=6)', Ght:'finite (here N=6)', self:true,\n` +
    `      note:'A finite cyclic group is self-dual: the N characters \\u03c7_k(j)=e^{2\\u03c0ijk/N} are the N-th roots of unity, themselves indexed by \\u2124/N. This is the DFT, the engine of the FFT.' }\n` +
    `  ];\n` +
    `  var sel=0;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    btns.forEach(function(b,i){ var on=(i===sel); b.classList.toggle('active', on); b.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    var S=SCEN[sel];\n` +
    `    txt(280, 24, 'G = ' + S.G + '        \\u011c = Hom_cts(G, U(1)) = ' + S.Gh + '        (' + S.ft + ')', {size:12, fill:'var(--ink)', weight:600});\n` +
    `    // left: G\n` +
    `    txt(150, 70, 'G = ' + S.G, {size:13, fill:'var(--yellow)', weight:600});\n` +
    `    pic(S.Gp, 150, 120, 'var(--yellow)');\n` +
    `    txt(150, 172, S.Gt, {size:10, fill:'var(--mute)'});\n` +
    `    // arrow\n` +
    `    txt(280, 116, '\\u2192', {size:24, fill:'var(--pink)'});\n` +
    `    txt(280, 96, 'dual', {size:10, fill:'var(--pink)'});\n` +
    `    txt(280, 136, '\\u03c7\\u2208\\u011c', {size:10, fill:'var(--mute)'});\n` +
    `    // right: Ghat\n` +
    `    txt(410, 70, '\\u011c = ' + S.Gh, {size:13, fill:'var(--cyan)', weight:600});\n` +
    `    pic(S.Ghp, 410, 120, 'var(--cyan)');\n` +
    `    txt(410, 172, S.Ght, {size:10, fill:'var(--mute)'});\n` +
    `    // double dual + character\n` +
    `    txt(280, 200, S.self ? ('G \\u2245 \\u011c (self-dual);   \\u011c\\u0302 \\u2245 G  \\u2014 Pontryagin double duality') : ('\\u011c\\u0302 \\u2245 G  \\u2014 Pontryagin: dualizing twice returns G'), {size:11, fill:'var(--green)', weight:600});\n` +
    `    txt(280, 224, 'characters:  ' + S.chi, {size:11, fill:'var(--violet)'});\n` +
    `    out.textContent = S.note + '\\n\\nPontryagin duality unifies the Fourier theorems: \\u011c = Hom_cts(G,U(1)) with the compact-open topology is again locally compact abelian, and G \\u2192 \\u011c\\u0302 is an isomorphism. Dualizing swaps DISCRETE and COMPACT (\\u2124\\u2194\\u0054), and fixes the self-dual groups (\\u211d, \\u2124/N, and also \\u211a_p and the ad\\u00e8les \\u2014 the setting of Tate\\u2019s thesis).';\n` +
    `  }\n` +
    `  btns.forEach(function(b,i){ b.addEventListener('click', function(){ sel=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
