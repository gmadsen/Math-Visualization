// sheaf-cohomology-leray widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Three concrete cover scenarios show when the
// comparison map Ȟ^p(U,F) → H^p(X,F) is an isomorphism: a Leray (F-acyclic)
// cover gives an iso, a cover with a non-acyclic member does not.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <button type="button" id="${widgetId}-s0">$\\mathbb{P}^1$ affine cover</button>\n` +
    `    <button type="button" id="${widgetId}-s1">$\\mathbb{P}^2$ affine cover</button>\n` +
    `    <button type="button" id="${widgetId}-s2">trivial cover $\\{\\mathbb{P}^1\\}$</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 280" width="540" height="280" role="img" aria-label="When the Čech-to-derived comparison map is an isomorphism: Leray acyclic covers"><title>Leray covers: the comparison map from Čech to derived cohomology is an isomorphism exactly when all intersections are acyclic</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* sheaf-cohomology-leray widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=[document.getElementById('${widgetId}-s0'), document.getElementById('${widgetId}-s1'), document.getElementById('${widgetId}-s2')];\n` +
    `  if(!svg || !out || btns.some(function(b){ return !b; })) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'start', 'font-size':opt.size||12, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  var SCEN=[\n` +
    `    { space:'X = P^1,  F quasi-coherent', cover:'cover U = { U_0, U_1 }',\n` +
    `      rows:[ {t:'U_0 = A^1   \\u2014 affine', ok:true}, {t:'U_1 = A^1   \\u2014 affine', ok:true}, {t:'U_0 \\u2229 U_1 = G_m   \\u2014 affine', ok:true} ],\n` +
    `      leray:true,\n` +
    `      verdict:'Leray: every set and intersection is affine, hence F-acyclic (Serre: H^i(affine, quasi-coherent) = 0 for i>0). The comparison map H^p(U,F) \\u2192 H^p(X,F) is an ISOMORPHISM for every p, so the two-term \\u010cech complex computes H*(P^1, O(d)) exactly \\u2014 no refinement needed.' },\n` +
    `    { space:'X = P^2,  F quasi-coherent', cover:'cover U = { U_0, U_1, U_2 }',\n` +
    `      rows:[ {t:'U_i = A^2   \\u2014 affine', ok:true}, {t:'U_i \\u2229 U_j = A^1 x G_m   \\u2014 affine', ok:true}, {t:'U_0 \\u2229 U_1 \\u2229 U_2 = G_m^2   \\u2014 affine', ok:true} ],\n` +
    `      leray:true,\n` +
    `      verdict:'Leray: all pairwise and triple intersections are affine, hence acyclic. \\u010cech on this 3-set cover computes H*(P^2); the top class H^2(O(d)) appears in the triple-overlap term \\u010c^2.' },\n` +
    `    { space:'X = P^1,  F = O(-2)', cover:'cover U = { P^1 }   (one set)',\n` +
    `      rows:[ {t:'the only set is P^1 itself', ok:true}, {t:'H^1(P^1, O(-2)) = k \\u2260 0   \\u2014 NOT acyclic', ok:false} ],\n` +
    `      leray:false,\n` +
    `      verdict:'NOT Leray: the single set is the whole space, which is not O(-2)-acyclic. The one-set \\u010cech complex gives H^0(U,F)=0 and H^p(U,F)=0 for p>0, missing the true H^1(P^1,O(-2)) = k. The comparison map is NOT an isomorphism \\u2014 refine to the affine cover (first tab) to compute correctly.' }\n` +
    `  ];\n` +
    `  var sel=0;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    btns.forEach(function(b,i){ var on=(i===sel); b.classList.toggle('active', on); b.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    var S=SCEN[sel];\n` +
    `    txt(270, 26, S.space, {anchor:'middle', size:12, fill:'var(--ink)', weight:600});\n` +
    `    txt(270, 46, S.cover, {anchor:'middle', size:11, fill:'var(--mute)', italic:true});\n` +
    `    txt(40, 78, 'finite intersections and their acyclicity:', {size:11, fill:'var(--cyan)', weight:600});\n` +
    `    S.rows.forEach(function(r,i){ var y=102+i*24;\n` +
    `      svg.appendChild(mk('text', {x:48, y:y, 'font-size':14, fill: r.ok?'var(--green)':'var(--pink)'}, r.ok?'\\u2713':'\\u2717'));\n` +
    `      txt(68, y, r.t, {size:12, fill:'var(--ink)'}); });\n` +
    `    // comparison map\n` +
    `    var cy=210;\n` +
    `    txt(120, cy, 'H^p(U, F)', {anchor:'middle', size:13, fill:'var(--ink)', weight:600});\n` +
    `    txt(270, cy, '\\u2192', {anchor:'middle', size:18, fill: S.leray?'var(--green)':'var(--pink)'});\n` +
    `    txt(270, cy-18, S.leray?'\\u2245':'\\u2260', {anchor:'middle', size:14, fill: S.leray?'var(--green)':'var(--pink)', weight:600});\n` +
    `    txt(420, cy, 'H^p(X, F)', {anchor:'middle', size:13, fill:'var(--ink)', weight:600});\n` +
    `    txt(120, cy+18, '\\u010cech, w.r.t. cover U', {anchor:'middle', size:9, fill:'var(--mute)'});\n` +
    `    txt(420, cy+18, 'derived functor', {anchor:'middle', size:9, fill:'var(--mute)'});\n` +
    `    // verdict badge\n` +
    `    var vb=S.leray?'LERAY \\u2014 comparison is an isomorphism':'NOT LERAY \\u2014 must refine';\n` +
    `    txt(270, 252, vb, {anchor:'middle', size:12, fill: S.leray?'var(--green)':'var(--pink)', weight:600});\n` +
    `    out.textContent=S.verdict;\n` +
    `  }\n` +
    `  btns.forEach(function(b,i){ b.addEventListener('click', function(){ sel=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
