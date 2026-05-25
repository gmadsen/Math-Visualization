// motives-motivic-galois widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The motivic Galois group G_mot = Aut^otimes(omega_B)
// as a central hub with three realization-quotient spokes (etale -> absolute
// Galois group; Hodge -> Mumford-Tate group; crystalline -> Frobenius), matching
// the section prose. Plain G_m / G_Q / L (blackboard / overline are astral).

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
    `    ${btn('overview', 'Overview', true)}\n    ${btn('etale', '&#233;tale &#8594; Galois', false)}\n    ${btn('hodge', 'Hodge &#8594; Mumford&#8211;Tate', false)}\n    ${btn('crys', 'crystalline &#8594; Frobenius', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="The motivic Galois group as a central hub with three quotient arrows descending to the absolute Galois group, the Mumford-Tate group, and the crystalline Frobenius"><title>G_mot, the motivic Galois group, drawn as a central node with three quotient arrows descending to three classical groups, one per realization: the absolute Galois group via the etale realization, the Mumford-Tate group via the Hodge realization, and the crystalline Frobenius via the crystalline realization.</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* motives-motivic-galois widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  var NODES=[\n` +
    `    {k:'etale', x:135, top:'absolute Galois group', bot:'G_\\u211a = Gal(\\u211a-alg/\\u211a)', via:'\\u00e9tale',\n` +
    `      desc:'\\u00c9TALE realization \\u2192 the ABSOLUTE GALOIS GROUP G_\\u211a = Gal(\\u211a-alg / \\u211a). On ARTIN motives \\u2014 the motives h\\u2070 of finite \\u00e9tale \\u211a-schemes (e.g. Spec of a number field) \\u2014 G_mot is literally a FINITE Galois group, and the \\u00e9tale realization is the quotient G_mot \\u21a0 G_\\u211a. So the motivic Galois group GENERALIZES the absolute Galois group of classical Galois theory: ordinary Galois representations are the Artin (weight-0, Tate-twist-0) part of the motivic picture.'},\n` +
    `    {k:'hodge', x:280, top:'Mumford\\u2013Tate group', bot:'MT(H(X))', via:'Hodge',\n` +
    `      desc:'HODGE realization \\u2192 the MUMFORD\\u2013TATE GROUP. For a motive from a smooth projective X over \\u2102, the Hodge realization carries its symmetries into MT(H(X)), the Tannakian group of the Hodge structure (the smallest \\u211a-algebraic group whose reps contain it). For an ELLIPTIC CURVE E: MT(h\\u00b9E) = GL\\u2082 when E has NO complex multiplication (the generic case, Serre\\u2019s open-image theorem), and a RANK-2 TORUS (the CM field acting) when E has CM. The Hodge realization is the quotient G_mot \\u21a0 MT, and the Hodge conjecture is the statement that MT-invariants are exactly the algebraic classes.'},\n` +
    `    {k:'crys', x:425, top:'crystalline Frobenius', bot:'\\u03c6-structure', via:'crystalline',\n` +
    `      desc:'CRYSTALLINE realization \\u2192 the FROBENIUS. Over a finite field (or via p-adic comparison) the crystalline realization equips H(X) with a Frobenius \\u03c6 whose eigenvalues are the WEIL NUMBERS counting points; the Newton polygon (slopes of \\u03c6) sits on or above the Hodge polygon. This is the very same \\u03c6 that acts by p\\u207b\\u207f on the Tate twist \\u211a_p(n) from \\u00a74. The crystalline realization is the quotient of G_mot controlling this Frobenius / slope data.'},\n` +
    `  ];\n` +
    `  var OVERVIEW='G_mot(\\u211a) = Aut\\u2297(\\u03c9_B) is the TANNAKIAN FUNDAMENTAL GROUP of the category of (numerical) motives: by Jannsen\\u2019s theorem that category is \\u211a-linear, abelian and semisimple, and \\u2014 modulo the standard conjectures \\u2014 it is Tannakian, with the Betti realization \\u03c9_B as fiber functor, and G_mot is a PRO-REDUCTIVE group scheme over \\u211a. The punchline: MOTIVES OVER \\u211a ARE THE SAME THING AS finite-dimensional \\u211a-REPRESENTATIONS OF G_mot. It is the UNIVERSAL SYMMETRY of cohomology. Already the Tate motives \\u27e8\\u211a(n)\\u27e9 generate a copy of G_m inside G_mot (the weight grading from \\u00a74\\u2013\\u00a75), and each classical \\u201ccohomological symmetry group\\u201d is a REALIZATION-QUOTIENT of this one object: the absolute Galois group (\\u00e9tale), the Mumford\\u2013Tate group (Hodge), and the crystalline Frobenius. Click a spoke to follow one quotient arrow.';\n` +
    `  var cur='overview';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var defs=mk('defs',{}); var m=mk('marker',{id:'${widgetId}-ar',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto'}); m.appendChild(mk('path',{d:'M0 0 L10 5 L0 10 z',fill:'var(--mute)'})); defs.appendChild(m); svg.appendChild(defs);\n` +
    `    var hubX=280, hubY=66;\n` +
    `    // quotient arrows hub -> each node\n` +
    `    NODES.forEach(function(n){ var sel=(cur===n.k); svg.appendChild(mk('line',{x1:hubX,y1:hubY+22,x2:n.x,y2:150-14,stroke: sel?'var(--yellow)':'var(--line)','stroke-width': sel?2:1.2,'marker-end':'url(#${widgetId}-ar)'}));\n` +
    `      var mx=(hubX+n.x)/2, my=(hubY+22+150-14)/2; txt(mx+(n.x<hubX?-12:(n.x>hubX?12:0)), my, '\\u21a0', {size:11, fill: sel?'var(--yellow)':'var(--mute)'}); });\n` +
    `    // hub\n` +
    `    var hubSel=(cur==='overview'); svg.appendChild(mk('rect',{x:hubX-95,y:hubY-22,width:190,height:44,rx:9,fill: hubSel?'var(--violet)':'var(--panel2)',stroke:'var(--violet)','stroke-width': hubSel?2.4:1.6,'fill-opacity': hubSel?0.22:1}));\n` +
    `    txt(hubX,hubY-3,'G_mot(\\u211a) = Aut\\u2297(\\u03c9_B)',{size:12,fill:'var(--violet)',weight:700}); txt(hubX,hubY+13,'the motivic Galois group',{size:9,fill:'var(--mute)'});\n` +
    `    // spoke nodes\n` +
    `    NODES.forEach(function(n){ var sel=(cur===n.k); var col = sel?'var(--yellow)':'var(--cyan)';\n` +
    `      svg.appendChild(mk('rect',{x:n.x-78,y:150,width:156,height:44,rx:8,fill: sel?col:'var(--panel2)',stroke:col,'stroke-width': sel?2.4:1.4,'fill-opacity': sel?0.20:1}));\n` +
    `      txt(n.x,150+18,n.top,{size:10.5,fill: sel?col:'var(--ink)',weight:700}); txt(n.x,150+34,n.bot,{size:9.5,fill:'var(--ink)'});\n` +
    `      txt(n.x,150+56,'(via the '+n.via+' realization)',{size:8.5,fill:'var(--mute)'});\n` +
    `    });\n` +
    `    txt(280, 250, 'the three classical symmetry groups are the realization-quotients (\\u21a0) of one universal G_mot', {size:9.5, fill:'var(--mute)'});\n` +
    `    var n=null; for(var i=0;i<NODES.length;i++) if(NODES[i].k===cur) n=NODES[i];\n` +
    `    out.textContent = n ? n.desc : OVERVIEW;\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; cur=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
