// lie-algebra-tangent widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. g = T_e G is the matrices tangent to G at the
// identity: differentiate the defining equation at A=I. Pick a group; the widget
// shows the linearised condition on X and tests candidate 2×2 matrices for
// membership in g, with dim and a basis.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">group $G$</span>\n` +
    `    <button type="button" id="${widgetId}-g0">$\\mathrm{GL}_2\\mathbb{R}$</button>\n` +
    `    <button type="button" id="${widgetId}-g1">$\\mathrm{SL}_2\\mathbb{R}$</button>\n` +
    `    <button type="button" id="${widgetId}-g2">$\\mathrm{SO}(2)$</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 320" width="580" height="320" role="img" aria-label="Candidate 2x2 matrices tested for membership in the Lie algebra of the chosen group"><title>The Lie algebra is the tangent space at the identity: the set of matrices satisfying the linearised defining equation</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* lie-algebra-tangent widget: ${widgetId} */\n` +
    `(function(){\n` +
    // candidate 2x2 matrices [a,b,c,d]
    `  var CAND=[[0,-1,1,0],[1,0,0,-1],[0,1,0,0],[1,0,0,1],[2,1,3,-2],[0,2,-2,0]];\n` +
    // groups: defining eq, linearised condition, membership test, dim, algebra/basis text
    `  var GRP=[\n` +
    `    { name:'GL\\u2082\\u211d', def:'det A \\u2260 0  (open)', lin:'no condition \\u2014 g = M\\u2082(\\u211d)', test:function(){ return true; }, dim:4, basis:'gl\\u2082 = all 2\\u00d72 matrices' },\n` +
    `    { name:'SL\\u2082\\u211d', def:'det A = 1', lin:'tr X = 0  (a + d = 0)', test:function(m){ return Math.abs(m[0]+m[3])<1e-9; }, dim:3, basis:'sl\\u2082 = traceless:  H, E, F' },\n` +
    `    { name:'SO(2)', def:'A\\u1d40A = I, det A = 1', lin:'X\\u1d40 + X = 0  (skew: a=d=0, c=\\u2212b)', test:function(m){ return Math.abs(m[0])<1e-9 && Math.abs(m[3])<1e-9 && Math.abs(m[1]+m[2])<1e-9; }, dim:1, basis:'so(2) = span{ [[0,\\u22121],[1,0]] }' }\n` +
    `  ];\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var bt=[0,1,2].map(function(i){ return document.getElementById('${widgetId}-g'+i); });\n` +
    `  if(!svg||!out||bt.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    `  function matAt(x,y,m,col){ // 2x2 bracketed matrix at (x,y)\n` +
    `    svg.appendChild(mk('path',{d:'M '+(x+4)+' '+y+' L '+x+' '+y+' L '+x+' '+(y+38)+' L '+(x+4)+' '+(y+38),stroke:col,'stroke-width':1,fill:'none'}));\n` +
    `    svg.appendChild(mk('path',{d:'M '+(x+58)+' '+y+' L '+(x+62)+' '+y+' L '+(x+62)+' '+(y+38)+' L '+(x+58)+' '+(y+38),stroke:col,'stroke-width':1,fill:'none'}));\n` +
    `    txt(x+20,y+16,''+m[0],{size:11,anchor:'middle'}); txt(x+46,y+16,''+m[1],{size:11,anchor:'middle'});\n` +
    `    txt(x+20,y+33,''+m[2],{size:11,anchor:'middle'}); txt(x+46,y+33,''+m[3],{size:11,anchor:'middle'}); }\n` +
    `  var sel=1;\n` + // default SL2(R): the trace-0 condition is the cleanest illustration
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    bt.forEach(function(b,i){ b.classList.toggle('active',i===sel); b.setAttribute('aria-pressed',i===sel?'true':'false'); });\n` +
    `    var G=GRP[sel];\n` +
    `    txt(36, 40, 'G = '+G.name+':   defining equation   '+G.def, {size:12, fill:'var(--ink)'});\n` +
    `    txt(36, 62, 'differentiate at A = I (A\\u2032(0) = X)  \\u21d2  g = { X : '+G.lin+' }', {size:12, fill:'var(--yellow)', weight:600});\n` +
    `    txt(36, 92, 'is each X tangent to G at I  (i.e. X \\u2208 g)?', {size:11, fill:'var(--mute)'});\n` +
    // candidate grid: 3 columns x 2 rows
    `    CAND.forEach(function(m,i){ var col=i%3, row=Math.floor(i/3); var x=40+col*180, y=110+row*88;\n` +
    `      var ok=G.test(m); var c=ok?'var(--green)':'var(--pink)';\n` +
    `      matAt(x, y, m, c);\n` +
    `      svg.appendChild(mk('text',{x:x+78,y:y+24,'font-size':16,fill:c,'font-weight':700}, ok?'\\u2713':'\\u2717'));\n` +
    `      txt(x+96, y+24, ok?'\\u2208 g':'\\u2209 g', {size:11, fill:c}); });\n` +
    `    var nIn=CAND.filter(function(m){return G.test(m);}).length;\n` +
    `    txt(36, 300, 'dim g = '+G.dim+' = dim G   \\u2014   '+G.basis+'    ('+nIn+' of '+CAND.length+' shown matrices lie in g)', {size:11, fill:'var(--cyan)'});\n` +
    `    out.textContent = 'The Lie algebra g = T_e G is the tangent space to G at the identity. For a matrix group you find it by differentiating the defining equation along a curve A(t) with A(0) = I and A\\u2032(0) = X: for '+G.name+', \\u201c'+G.def+'\\u201d linearises to \\u201c'+G.lin+'\\u201d. So g is exactly the set of matrices X meeting that linear condition \\u2014 the green matrices above are in g, the pink ones are not. Its dimension, '+G.dim+', equals dim G (the number of free parameters left after the constraint). The same recipe gives so(3) = skew-symmetric 3\\u00d73 (dim 3), su(n) = traceless skew-Hermitian, and so on. The bracket [X,Y] = XY \\u2212 YX makes g a Lie algebra.';\n` +
    `  }\n` +
    `  bt.forEach(function(b,i){ b.addEventListener('click', function(){ sel=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
