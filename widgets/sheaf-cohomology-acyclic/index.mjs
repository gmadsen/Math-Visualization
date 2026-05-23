// sheaf-cohomology-acyclic widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Three tabs show three flavours of Γ-acyclic
// resolution that all compute H^i(X,F) = R^iΓ: Godement (flabby), de Rham
// (fine), and Čech (affine). The point: any acyclic resolution works.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <button type="button" id="${widgetId}-t0">Godement (flabby)</button>\n` +
    `    <button type="button" id="${widgetId}-t1">de Rham (fine)</button>\n` +
    `    <button type="button" id="${widgetId}-t2">Čech (affine)</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 210" width="560" height="210" role="img" aria-label="Three flavours of acyclic resolution computing sheaf cohomology"><title>Any Γ-acyclic resolution computes H^i(X,F): Godement, de Rham, or Čech</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* sheaf-cohomology-acyclic widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=[document.getElementById('${widgetId}-t0'), document.getElementById('${widgetId}-t1'), document.getElementById('${widgetId}-t2')];\n` +
    `  if(!svg || !out || btns.some(function(b){ return !b; })) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'middle', 'font-size':opt.size||12, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  function cell(x,y,label,stroke){ var w=66,h=30; svg.appendChild(mk('rect', {x:x-w/2, y:y-h/2, width:w, height:h, rx:5, fill:'var(--panel2)', stroke:stroke, 'stroke-width':1.5})); txt(x, y+4, label, {size:12, fill:'var(--ink)'}); }\n` +
    `  var SCEN=[\n` +
    `    { aug:'F', chain:['G\\u2070(F)','G\\u00b9(F)','G\\u00b2(F)'], col:'var(--yellow)',\n` +
    `      note:'Godement: G\\u2070(F) = \\u220f over points of the stalks of F (higher G\\u1d4f iterate the same construction on cokernels) \\u2014 FLABBY (every restriction surjects), hence \\u0393-acyclic. Canonical and always exists; this is essentially the R\\u2071\\u0393 definition made concrete.',\n` +
    `      computes:'H\\u2071(X,F) = R\\u2071\\u0393(X,F)' },\n` +
    `    { aug:'\\u211d', chain:['\\u03a9\\u2070','\\u03a9\\u00b9','\\u03a9\\u00b2'], col:'var(--green)',\n` +
    `      note:'On a smooth manifold the de Rham complex 0\\u2192\\u211d\\u2192\\u03a9\\u2070\\u2192\\u03a9\\u00b9\\u2192\\u22ef is a resolution (Poincar\\u00e9 lemma); each \\u03a9\\u1d56 is FINE (partitions of unity) hence acyclic. Taking \\u0393 gives global forms.',\n` +
    `      computes:'H\\u1d56_dR(X) = H\\u1d56(X, \\u211d)' },\n` +
    `    { aug:'F', chain:['\\u010c\\u2070','\\u010c\\u00b9','\\u010c\\u00b2'], col:'var(--cyan)',\n` +
    `      note:'For a scheme with an affine cover, each affine is \\u0393-acyclic for quasi-coherent F (Serre). The \\u010cech complex \\u010c\\u2022(U,F) IS the acyclic resolution (Leray), and is how you actually compute.',\n` +
    `      computes:'H\\u2071(X,F) = \\u021e\\u2071(U,F)' }\n` +
    `  ];\n` +
    `  var sel=0;\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    btns.forEach(function(b,i){ var on=(i===sel); b.classList.toggle('active', on); b.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    var S=SCEN[sel];\n` +
    `    txt(280, 26, 'a \\u0393-acyclic resolution of F:', {size:11, fill:S.col, weight:600});\n` +
    `    // resolution chain: 0 -> aug -> A^0 -> A^1 -> A^2 -> ...\n` +
    `    var xs=[70,180,300,420], y=66;\n` +
    `    txt(28, y+4, '0 \\u2192', {size:12, fill:'var(--mute)'});\n` +
    `    cell(xs[0], y, S.aug, 'var(--mute)');\n` +
    `    for(var k=0;k<3;k++){ txt((xs[k]+xs[k+1])/2, y+4, '\\u2192', {size:14, fill:S.col}); cell(xs[k+1], y, S.chain[k], S.col); }\n` +
    `    txt(500, y+4, '\\u2192 \\u22ef', {size:13, fill:'var(--mute)'});\n` +
    `    txt(xs[0], y-26, 'F \\u21aa', {size:10, fill:'var(--mute)'});\n` +
    `    // apply Gamma\n` +
    `    txt(280, 108, 'apply  \\u0393(X, \\u2212)   (left exact \\u2014 the resulting complex is no longer exact)', {size:11, fill:'var(--mute)', italic:true});\n` +
    `    txt(280, 134, '\\u0393A\\u2070 \\u2192 \\u0393A\\u00b9 \\u2192 \\u0393A\\u00b2 \\u2192 \\u22ef', {size:13, fill:'var(--ink)'});\n` +
    `    // take cohomology\n` +
    `    txt(280, 168, 'take cohomology  \\u21d2  ' + S.computes, {size:14, fill:S.col, weight:600});\n` +
    `    out.textContent = S.note + '\\n\\nAny resolution by \\u0393-acyclic sheaves computes the same H\\u2071: apply \\u0393, then take cohomology. \\u0393 is left exact, so R\\u2070\\u0393 = \\u0393(F) (global sections); the higher R\\u2071\\u0393 measure the failure of right-exactness \\u2014 e.g. \\u00a71\\u2019s exponential sequence, where \\u0393(exp) is not surjective. The three tabs are three acyclic resolutions; all give the same intrinsic answer.';\n` +
    `  }\n` +
    `  btns.forEach(function(b,i){ b.addEventListener('click', function(){ sel=i; draw(); }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
