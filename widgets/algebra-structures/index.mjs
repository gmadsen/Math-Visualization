// algebra-structures widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The classifications are intrinsic; params carry only
// chrome. The widget climbs the group → ring → field hierarchy ("one, two, three
// operations") for a chosen set.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">set</span>\n` +
    `    <button type="button" id="${widgetId}-s0">$\\mathbb{N}$</button>\n` +
    `    <button type="button" id="${widgetId}-s1">$\\mathbb{Z}$</button>\n` +
    `    <button type="button" id="${widgetId}-s2">$\\mathbb{Z}/5$</button>\n` +
    `    <button type="button" id="${widgetId}-s3">$\\mathbb{Z}/6$</button>\n` +
    `    <button type="button" id="${widgetId}-s4">$\\mathbb{Q}$</button>\n` +
    `    <button type="button" id="${widgetId}-s5">$M_2(\\mathbb{R})$</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 230" width="560" height="230" role="img" aria-label="Climbing the group, ring, field hierarchy for a chosen set"><title>One, two, three operations: which of group / ring / field a set forms</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* algebra-structures widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=[0,1,2,3,4,5].map(function(i){ return document.getElementById('${widgetId}-s'+i); });\n` +
    `  if(!svg||!out||btns.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'start', 'font-size':opt.size||12, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  // grp/ring/fld: true/false; reason strings per level\n` +
    `  var SCEN=[\n` +
    `    { name:'\\u2115', grp:false, ring:false, fld:false, gr:'(\\u2115,+) is only a monoid \\u2014 no additive inverses (3 has no \\u22123)', rr:'not a ring (not an additive group)', fr:'not a field',\n` +
    `      note:'\\u2115 fails at the very first axiom: addition has an identity (0) and is associative, but elements lack inverses, so (\\u2115,+) is a commutative monoid, not a group. Everything above needs an abelian group first.' },\n` +
    `    { name:'\\u2124', grp:true, ring:true, fld:false, gr:'(\\u2124,+) is an abelian group', rr:'a commutative ring (two operations, distributive)', fr:'NOT a field \\u2014 only \\u00b11 are invertible',\n` +
    `      note:'\\u2124 is the prototype ring: an abelian group under +, with an associative, distributive, commutative multiplication and unit 1. But 2 has no multiplicative inverse in \\u2124, so it is not a field. Inverting all nonzero elements is exactly the step \\u2124 \\u21a6 \\u211a.' },\n` +
    `    { name:'\\u2124/5', grp:true, ring:true, fld:true, gr:'(\\u2124/5,+) is an abelian group', rr:'a commutative ring', fr:'a FIELD (5 is prime, so every nonzero residue is invertible)',\n` +
    `      note:'\\u2124/5 = F\\u2085 is a finite field: 5 is prime, so each of 1,2,3,4 has an inverse mod 5 (e.g. 2\\u00b73=6\\u22611). The finite fields F_{p\\u207f} are the third tier \\u2014 \\u201cnumbers\\u201d you can do linear algebra over.' },\n` +
    `    { name:'\\u2124/6', grp:true, ring:true, fld:false, gr:'(\\u2124/6,+) is an abelian group', rr:'a commutative ring', fr:'NOT a field \\u2014 2\\u00b73\\u22610, so 2,3 are zero divisors (no inverses)',\n` +
    `      note:'\\u2124/6 is a ring but not a field (nor even a domain): 2\\u00b73\\u22610 mod 6, so 2 and 3 are zero divisors and cannot be inverted. \\u2124/n is a field exactly when n is prime.' },\n` +
    `    { name:'\\u211a', grp:true, ring:true, fld:true, gr:'(\\u211a,+) is an abelian group', rr:'a commutative ring', fr:'a FIELD \\u2014 every nonzero rational has an inverse',\n` +
    `      note:'\\u211a is the field of fractions of \\u2124: every nonzero a/b has inverse b/a. \\u211a, \\u211d, \\u2102 are the familiar infinite fields \\u2014 places you can always solve a linear equation cx = d (c\\u22600).' },\n` +
    `    { name:'M\\u2082(\\u211d)', grp:true, ring:true, fld:false, gr:'(M\\u2082(\\u211d),+) is an abelian group', rr:'a ring, but NONCOMMUTATIVE (AB \\u2260 BA in general)', fr:'NOT a field \\u2014 noncommutative, and singular matrices have no inverse',\n` +
    `      note:'2\\u00d72 real matrices form a ring under + and \\u00d7, but multiplication is noncommutative and singular (det = 0) matrices are non-invertible \\u2014 two separate reasons it is not a field. It is the prototype of a noncommutative ring.' }\n` +
    `  ];\n` +
    `  var sel=1;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    btns.forEach(function(b,i){ var on=(i===sel); b.classList.toggle('active',on); b.setAttribute('aria-pressed',on?'true':'false'); });\n` +
    `    var S=SCEN[sel];\n` +
    `    txt(280, 24, 'S = ' + S.name + ':  how far up the hierarchy?', {anchor:'middle', size:13, fill:'var(--yellow)', weight:600});\n` +
    `    var rows=[['abelian GROUP under + (one operation)', S.grp, S.gr], ['RING: +, \\u00d7, distributive (two operations)', S.ring, S.rr], ['FIELD: nonzero \\u00d7 is a group (three operations)', S.fld, S.fr]];\n` +
    `    rows.forEach(function(r,i){ var y=66+i*44;\n` +
    `      svg.appendChild(mk('text',{x:40,y:y,'font-size':16,fill:r[1]?'var(--green)':'var(--pink)'}, r[1]?'\\u2713':'\\u2717'));\n` +
    `      txt(64, y, r[0], {size:12, fill:'var(--ink)', weight:600});\n` +
    `      txt(64, y+18, r[2], {size:10.5, fill:'var(--mute)'}); });\n` +
    `    txt(280, 212, 'group \\u2286 ring \\u2286 field is a tower of axioms: each tier keeps the last and demands more', {anchor:'middle', size:10, fill:'var(--mute)', italic:true});\n` +
    `    out.textContent = S.note + '\\n\\nThe structures of algebra come from how many operations you demand and how well-behaved they are. GROUP: one associative operation with identity and inverses (models symmetry). RING: an abelian group under + plus an associative, distributive multiplication (models arithmetic like \\u2124, \\u2124[x], matrices). FIELD: a commutative ring in which the nonzero elements form a group under \\u00d7 (models \\u201cnumbers\\u201d \\u2014 \\u211a, \\u211d, \\u2102, and the finite fields F_{p\\u207f}).';\n` +
    `  }\n` +
    `  btns.forEach(function(b,i){ b.addEventListener('click', function(){ sel=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
