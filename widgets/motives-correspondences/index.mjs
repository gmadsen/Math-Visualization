// motives-correspondences widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Algebraic correspondences as the morphisms of Mot_k,
// concrete on 0-dimensional varieties: a correspondence X->Y is a multiplicity
// matrix, composition beta.alpha is matrix multiplication = weighted path counting
// through Y (the pushforward-pullback formula). Scenarios: graphs of maps, a
// multivalued Hecke-type correspondence, the diagonal as identity.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const btn = (k, lab, on) =>
    `<button type="button" data-k="${k}" class="${on ? 'active' : ''}" aria-pressed="${on ? 'true' : 'false'}">${lab}</button>`;
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-btns">\n` +
    `    ${btn('graphs', 'graphs of maps', true)}\n    ${btn('hecke', 'multivalued (Hecke-type)', false)}\n    ${btn('id', 'diagonal = identity', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="Correspondences between finite point sets drawn as bipartite diagrams, with the composite correspondence computed by counting weighted paths"><title>Columns of points X, Y, Z. A correspondence alpha from X to Y and beta from Y to Z are drawn as edges with multiplicities; the composite beta after alpha from X to Z is shown with each edge labelled by the number of weighted paths through Y, which is the pushforward-pullback composition law and equals the product of the multiplicity matrices.</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* motives-correspondences widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  // a = alpha (Y x X), b = beta (Z x Y); sizes inferred from matrices\n` +
    `  var SC=[\n` +
    `    {k:'graphs', nx:2, ny:3, nz:2, a:[[1,0],[0,0],[0,1]], b:[[1,1,0],[0,0,1]],\n` +
    `      note:'When \\u03b1 = graph(f) and \\u03b2 = graph(g) are the graphs of honest maps (one edge out of each source point), the composite \\u03b2\\u2218\\u03b1 is the graph of g\\u2218f. So ordinary composition of maps is the special case \\u2014 a morphism of varieties f: X \\u2192 Y enters Mot_k as its GRAPH \\u0393_f \\u2282 X\\u00d7Y, and Var embeds into the category of correspondences.'},\n` +
    `    {k:'hecke', nx:2, ny:3, nz:2, a:[[1,0],[1,1],[0,1]], b:[[1,1,0],[0,1,1]],\n` +
    `      note:'A correspondence need not be a graph: here each point spreads to several (a MULTIVALUED, Hecke-type correspondence). Composition COUNTS WEIGHTED PATHS through Y \\u2014 \\u03b2\\u2218\\u03b1(x,z) = \\u03a3_y \\u03b1(x,y)\\u00b7\\u03b2(y,z) \\u2014 producing multiplicities (a 2 wherever two paths exist). This path-count IS the pushforward\\u2013pullback formula, and it is how Hecke operators and the Frobenius correspondence act on cohomology.'},\n` +
    `    {k:'id', nx:2, ny:2, nz:2, a:[[1,0],[0,1]], b:[[1,1],[0,1]],\n` +
    `      note:'The DIAGONAL \\u0394_X \\u2282 X\\u00d7X (the graph of the identity map) is the IDENTITY morphism: \\u03b2\\u2218\\u0394 = \\u03b2 for every \\u03b2. With composition the pushforward\\u2013pullback law and \\u0394 the unit, smooth projective varieties and correspondences form a category \\u2014 the starting point for pure motives (one then cuts by projectors p = p\\u2218p).'},\n` +
    `  ];\n` +
    `  var cur='graphs';\n` +
    `  function mul(B,A){ var Z=B.length, Y=A.length, X=A[0].length, R=[]; for(var z=0;z<Z;z++){ R[z]=[]; for(var x=0;x<X;x++){ var s=0; for(var y=0;y<Y;y++) s+=B[z][y]*A[y][x]; R[z][x]=s; } } return R; }\n` +
    `  function col(n,yTop,yBot){ var ys=[]; for(var i=0;i<n;i++) ys.push(yTop+(i+0.5)*(yBot-yTop)/n); return ys; }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var S=null; for(var i=0;i<SC.length;i++) if(SC[i].k===cur) S=SC[i];\n` +
    `    if(!S) return;\n` +
    `    var C=mul(S.b,S.a);\n` +
    `    var xX=55, xY=180, xZ=305, xX2=410, xZ2=510, yTop=64, yBot=224;\n` +
    `    var YX=col(S.nx,yTop,yBot), YY=col(S.ny,yTop,yBot), YZ=col(S.nz,yTop,yBot);\n` +
    `    var YX2=col(S.nx,yTop,yBot), YZ2=col(S.nz,yTop,yBot);\n` +
    `    txt((xX+xZ)/2,34,'\\u03b1 (X \\u22a2 Y, cyan)   \\u00b7   \\u03b2 (Y \\u22a2 Z, violet)',{size:9.5,fill:'var(--mute)'});\n` +
    `    txt(xX,54,'X',{size:12,fill:'var(--mute)',weight:700}); txt(xY,54,'Y',{size:12,fill:'var(--mute)',weight:700}); txt(xZ,54,'Z',{size:12,fill:'var(--mute)',weight:700});\n` +
    `    txt((xX2+xZ2)/2,54,'\\u03b2\\u2218\\u03b1 : X \\u22a2 Z',{size:10,fill:'var(--green)',weight:700});\n` +
    `    function edge(x1,y1,x2,y2,m,colr){ if(m<=0) return; svg.appendChild(mk('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:colr,'stroke-width':1+0.8*Math.min(m,3),'stroke-opacity':0.8})); if(m>1) txt((x1+x2)/2,(y1+y2)/2-3,'\\u00d7'+m,{size:8.5,fill:colr,weight:700}); }\n` +
    `    function dot(x,y,col){ svg.appendChild(mk('circle',{cx:x,cy:y,r:6,fill:'var(--panel2)',stroke:col,'stroke-width':1.6})); }\n` +
    `    // alpha edges (Y x X)\n` +
    `    for(var x=0;x<S.nx;x++) for(var y=0;y<S.ny;y++) edge(xX,YX[x],xY,YY[y],S.a[y][x],'var(--cyan)');\n` +
    `    // beta edges (Z x Y)\n` +
    `    for(var y=0;y<S.ny;y++) for(var z=0;z<S.nz;z++) edge(xY,YY[y],xZ,YZ[z],S.b[z][y],'var(--violet)');\n` +
    `    YX.forEach(function(yy){ dot(xX,yy,'var(--cyan)'); }); YY.forEach(function(yy){ dot(xY,yy,'var(--ink)'); }); YZ.forEach(function(yy){ dot(xZ,yy,'var(--violet)'); });\n` +
    `    // composite\n` +
    `    for(var x2=0;x2<S.nx;x2++) for(var z2=0;z2<S.nz;z2++) edge(xX2,YX2[x2],xZ2,YZ2[z2],C[z2][x2],'var(--green)');\n` +
    `    YX2.forEach(function(yy){ dot(xX2,yy,'var(--green)'); }); YZ2.forEach(function(yy){ dot(xZ2,yy,'var(--green)'); });\n` +
    `    // composition law line\n` +
    `    txt(280, 264, '\\u03b2\\u2218\\u03b1(x, z) = \\u03a3_y \\u03b1(x, y)\\u00b7\\u03b2(y, z)   (weighted paths through Y)   =   the pushforward\\u2013pullback formula', {size:10, fill:'var(--cyan)'});\n` +
    `    txt(280, 282, 'on 0-dimensional varieties this is exactly the product of the multiplicity matrices', {size:9.5, fill:'var(--mute)'});\n` +
    `    out.textContent='In the category of motives Mot_k, the MORPHISMS are not maps of varieties \\u2014 they are ALGEBRAIC CORRESPONDENCES: \\u211a-linear combinations of subvarieties of a product. For smooth projective X, Y of dimensions d_X, d_Y, a correspondence of degree r from X to Y is an element of Corr^r(X,Y) = CH^{d_X+r}(X\\u00d7Y)\\u2297\\u211a, where CH* is the Chow group (algebraic cycles modulo rational equivalence). Two correspondences compose by a pushforward\\u2013pullback on the triple product: \\u03b2\\u2218\\u03b1 = (p_{XZ})_*( (p_{XY})^*\\u03b1 \\u00b7 (p_{YZ})^*\\u03b2 ), where (p_{XY})^* etc. are PULLBACKS, (p_{XZ})_* is the PUSHFORWARD, and the \\u201c\\u00b7\\u201d is the intersection product. The cleanest place to SEE this is on 0-dimensional varieties (finite sets of points): there a correspondence is just a MATRIX of multiplicities, the intersection-and-pushforward collapses to \\u03b2\\u2218\\u03b1(x,z) = \\u03a3_y \\u03b1(x,y)\\u00b7\\u03b2(y,z), and composition is literally MATRIX MULTIPLICATION \\u2014 the weighted count of paths x \\u2192 y \\u2192 z through the middle. Three things the picture makes plain: (1) an ordinary map f: X \\u2192 Y is a special correspondence, its GRAPH \\u0393_f, and composing graphs reproduces composing maps (the graphs scenario) \\u2014 so Var embeds into correspondences; (2) most correspondences are NOT graphs (the multivalued scenario): a point can spread to several, and composition then carries MULTIPLICITIES \\u2014 this extra freedom is exactly what lets Hecke operators, the Frobenius correspondence, and projectors live as endomorphisms of a variety; (3) the DIAGONAL \\u0394_X is the identity (\\u03b2\\u2218\\u0394 = \\u03b2), and the TRANSPOSE of \\u03b1 (swapping the two factors of X\\u00d7Y) reverses source and target. With these, smooth projective varieties and correspondences form a category; pure motives are then built by splitting objects along idempotent correspondences p = p\\u2218p (projectors), e.g. carving h\\u00b9(C) out of a curve C.';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; cur=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
