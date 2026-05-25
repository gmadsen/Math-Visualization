// motives-tannakian widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The Tannakian formalism on its prototype Rep(G):
// the Clebsch-Gordan fusion table (tensor structure), the fiber functor
// omega: Rep(G) -> Vect, and reconstruction G = Aut^otimes(omega). Groups: Z/3, S_3.

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
    `    <label>G =</label>\n    ${btn('Z3', '&#8484;/3', true)}\n    ${btn('S3', 'S&#8323;', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="The Clebsch-Gordan fusion table of the irreducible representations of a finite group, with fiber-functor dimensions and the Tannakian reconstruction"><title>For a finite group G, the tensor (Clebsch-Gordan) fusion table of its irreducible representations: each cell is the decomposition of the tensor product of two irreducibles into irreducibles. With the fiber functor sending each representation to its underlying vector space, Tannakian reconstruction recovers G as the tensor-automorphisms of the fiber functor.</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* motives-tannakian widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  var GROUPS=[\n` +
    `    {k:'Z3', name:'\\u2124/3', irr:['\\u03c7\\u2080','\\u03c7\\u2081','\\u03c7\\u2082'], dim:[1,1,1],\n` +
    `      fuse:[[[[0,1]],[[1,1]],[[2,1]]],[[[1,1]],[[2,1]],[[0,1]]],[[[2,1]],[[0,1]],[[1,1]]]],\n` +
    `      note:'Rep(\\u2124/3): all three irreducibles are 1-dimensional CHARACTERS, and \\u03c7_i \\u2297 \\u03c7_j = \\u03c7_{(i+j) mod 3} \\u2014 the fusion table is literally the addition table of \\u2124/3. The fiber functor is trivial-dimensional (every \\u03c9(\\u03c7_i) = k), yet the TENSOR structure still pins down the group: Tannaka reconstruction returns \\u2124/3 (Rep of a finite ABELIAN group \\u2245 functions on the dual group, here \\u2245 \\u2124/3).'},\n` +
    `    {k:'S3', name:'S\\u2083', irr:['triv','sign','std'], dim:[1,1,2],\n` +
    `      fuse:[[[[0,1]],[[1,1]],[[2,1]]],[[[1,1]],[[0,1]],[[2,1]]],[[[2,1]],[[2,1]],[[0,1],[1,1],[2,1]]]],\n` +
    `      note:'Rep(S\\u2083): three irreducibles triv, sign (both 1-dim) and std (2-dim). The single non-abelian fusion is std \\u2297 std = triv \\u2295 sign \\u2295 std (dimensions 2\\u00b72 = 1+1+2 \\u2713). The 2-dimensional std is the representation through which S\\u2083 \\u21aa GL\\u2082 is recovered: a \\u2297-automorphism of \\u03c9 is a compatible family of matrices, and on std it lands on an actual element of S\\u2083.'},\n` +
    `  ];\n` +
    `  var cur='Z3';\n` +
    `  function decStr(cell, irr){ return cell.map(function(t){ return (t[1]>1?t[1]:'')+irr[t[0]]; }).join(' \\u2295 '); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var G=null; for(var i=0;i<GROUPS.length;i++) if(GROUPS[i].k===cur) G=GROUPS[i];\n` +
    `    if(!G) return;\n` +
    `    var N=G.irr.length;\n` +
    `    txt(280, 24, 'Rep('+G.name+') as a neutral Tannakian category \\u2014 the \\u2297 (Clebsch\\u2013Gordan) fusion table', {size:12, weight:700, fill:'var(--ink)'});\n` +
    `    // table geometry\n` +
    `    var cw=128, ch=44, x0=70, y0=56;\n` +
    `    // corner\n` +
    `    txt(x0-cw/2+18, y0+ch/2+4, '\\u2297', {size:14, fill:'var(--mute)', weight:700, anchor:'middle'});\n` +
    `    // header row + col\n` +
    `    for(var c=0;c<N;c++){ var cx=x0+c*cw+cw/2; txt(cx, y0+ch/2+4, G.irr[c], {size:11, fill:'var(--violet)', weight:700}); }\n` +
    `    for(var r=0;r<N;r++){ var cy=y0+(r+1)*ch+ch/2; txt(x0-cw/2+18, cy+4, G.irr[r], {size:11, fill:'var(--violet)', weight:700, anchor:'middle'}); }\n` +
    `    // grid lines\n` +
    `    for(var gi=0;gi<=N;gi++){ svg.appendChild(mk('line',{x1:18,y1:y0+(gi+1)*ch,x2:x0+N*cw,y2:y0+(gi+1)*ch,stroke:'var(--line)','stroke-width':0.7})); }\n` +
    `    svg.appendChild(mk('line',{x1:x0,y1:y0,x2:x0,y2:y0+(N+1)*ch,stroke:'var(--line)','stroke-width':0.7}));\n` +
    `    // cells\n` +
    `    for(var r2=0;r2<N;r2++) for(var c2=0;c2<N;c2++){ var cx=x0+c2*cw+cw/2, cy=y0+(r2+1)*ch+ch/2; var cell=G.fuse[r2][c2];\n` +
    `      var multi=(cell.length>1); txt(cx, cy+4, decStr(cell,G.irr), {size: multi?9:11, fill: multi?'var(--green)':'var(--ink)', weight: multi?700:400}); }\n` +
    `    // fiber functor + reconstruction\n` +
    `    var fy=y0+(N+1)*ch+24;\n` +
    `    txt(280, fy, 'fiber functor  \\u03c9: Rep('+G.name+') \\u2192 Vect,   \\u03c9(V) = underlying space;   dims:  '+G.irr.map(function(n,i){return n+'\\u21a6k'+(G.dim[i]>1?('^'+G.dim[i]):'');}).join(',  '), {size:10, fill:'var(--cyan)'});\n` +
    `    txt(280, fy+20, 'reconstruction:  G  =  Aut^\\u2297(\\u03c9)  \\u2014  the \\u2297-automorphisms of \\u03c9 recover the \\u201cinvisible\\u201d group', {size:10.5, fill:'var(--yellow)', weight:600});\n` +
    `    out.textContent='The structural payoff of motives runs through the TANNAKIAN FORMALISM. A NEUTRAL TANNAKIAN CATEGORY over k is a k-linear, RIGID (every object has a dual), ABELIAN, SYMMETRIC MONOIDAL (\\u2297 with a commutativity constraint) category T together with a faithful exact tensor functor \\u03c9: T \\u2192 Vect_k \\u2014 the FIBER FUNCTOR. The fundamental theorem (Tannaka\\u2013Krein, Saavedra, Deligne) says such a T is equivalent to Rep(G) for a uniquely determined affine group scheme G = Aut^\\u2297(\\u03c9), the group of tensor-natural automorphisms of \\u03c9: the category REMEMBERS an invisible group. The prototype is Rep(G) itself, shown here for a finite G. Its objects tensor by the CLEBSCH\\u2013GORDAN rule \\u2014 the fusion table above \\u2014 and the fiber functor just forgets a representation to its underlying vector space. For \\u2124/3 the table is the group\\u2019s own addition (characters multiply by adding indices); for S\\u2083 the only interesting entry is std \\u2297 std = triv \\u2295 sign \\u2295 std, and the 2-dimensional std is exactly the representation through which S\\u2083 sits inside GL\\u2082, recovered as \\u2297-automorphisms of \\u03c9. This is the engine of §6: the category Mot_k^{num} of numerical motives is (by Jannsen, and modulo the standard conjectures, as a Tannakian category) Rep of an affine group scheme \\u2014 the MOTIVIC GALOIS GROUP G_mot = Aut^\\u2297(\\u03c9_B) for the Betti fiber functor. Motives become representations of one pro-algebraic group, and the realizations (Betti, de Rham, \\u2113-adic, crystalline) are different fiber functors / forgetful functors out of it \\u2014 the universal symmetry group of all of cohomology.';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b||!b.getAttribute('data-k')) return; cur=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
