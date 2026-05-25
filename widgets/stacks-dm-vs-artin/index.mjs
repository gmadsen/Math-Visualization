// stacks-dm-vs-artin widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. A gallery of stacks classified by the dimension of
// their automorphism groups into nested rings Schemes < Deligne-Mumford < Artin:
// finite Aut (dim 0) => DM (etale atlas, unramified diagonal); positive-dimensional
// stabilizers => Artin only (smooth atlas).

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
    `    ${btn('A1', 'A&#185;', true)}\n    ${btn('Bmu2', 'B&#8484;/2', false)}\n    ${btn('A1mu2', '[A&#185;/&#8484;2]', false)}\n    ${btn('M11', 'M&#8321;,&#8321;', false)}\n    ${btn('Bgm', 'B G_m', false)}\n    ${btn('A1gm', '[A&#185;/G_m]', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="A gallery of stacks placed in nested rings Schemes inside Deligne-Mumford inside Artin, classified by the dimension of their automorphism groups"><title>Each example stack is marked in nested rings: Schemes (trivial automorphisms) inside Deligne-Mumford (finite automorphism groups, etale atlas) inside Artin (positive-dimensional stabilizers allowed, smooth atlas), with its automorphism group, that group's dimension, the atlas type, and the diagonal condition</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* stacks-dm-vs-artin widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  var ITEMS=[\n` +
    `    {k:'A1', label:'A\\u00b9  (the affine line)', autShort:'{e}', dim:0, cls:'scheme', atlas:'iso (\\u00e9tale)',\n` +
    `      note:'A SCHEME: every point has trivial automorphism group, so it lands in the innermost class. Its diagonal is an immersion.'},\n` +
    `    {k:'Bmu2', label:'B(\\u2124/2)', autShort:'\\u2124/2  (finite)', dim:0, cls:'dm', atlas:'\\u00e9tale',\n` +
    `      note:'The classifying stack of \\u2124/2: one point whose automorphism group is \\u2124/2. Finite automorphisms \\u2192 DELIGNE\\u2013MUMFORD, and the \\u00e9tale atlas Spec k \\u2192 B(\\u2124/2) exists. Not a scheme \\u2014 a scheme has no nontrivial automorphisms at a point.'},\n` +
    `    {k:'A1mu2', label:'[A\\u00b9 / (\\u2124/2)]', autShort:'\\u2124/2 at 0, else {e}', dim:0, cls:'dm', atlas:'\\u00e9tale',\n` +
    `      note:'Reflection x \\u21a6 \\u2212x: the origin has automorphism group \\u2124/2 and every other point is free. All stabilizers are FINITE \\u2192 Deligne\\u2013Mumford, with an \\u00e9tale atlas A\\u00b9 \\u2192 [A\\u00b9/(\\u2124/2)].'},\n` +
    `    {k:'M11', label:'M\\u2081,\\u2081  (elliptic curves)', autShort:'finite (\\u2264 6)', dim:0, cls:'dm', atlas:'\\u00e9tale',\n` +
    `      note:'The moduli stack of elliptic curves. Automorphism groups are FINITE \\u2014 \\u2124/2 generically, \\u2124/4 at j = 1728, \\u2124/6 at j = 0 (in characteristic 0) \\u2014 so M\\u2081,\\u2081 is Deligne\\u2013Mumford, with an \\u00e9tale atlas from adding level structure. It is the prototypical DM stack.'},\n` +
    `    {k:'Bgm', label:'B G_m', autShort:'G_m  (dim 1)', dim:1, cls:'artin', atlas:'smooth',\n` +
    `      note:'The classifying stack of the multiplicative group G_m. Its single point has automorphism group G_m, which is 1-DIMENSIONAL \\u2014 so B G_m is ARTIN but NOT Deligne\\u2013Mumford: only a SMOOTH atlas Spec k \\u2192 B G_m exists (never \\u00e9tale), and the diagonal is not unramified.'},\n` +
    `    {k:'A1gm', label:'[A\\u00b9 / G_m]', autShort:'G_m at 0, else {e}', dim:1, cls:'artin', atlas:'smooth',\n` +
    `      note:'The scaling action of G_m on A\\u00b9: the open orbit A\\u00b9 minus the origin is free, but the ORIGIN has the 1-dimensional stabilizer G_m. A positive-dimensional stabilizer forces ARTIN, not DM.'},\n` +
    `  ];\n` +
    `  var cur='A1';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var it=null; for(var i=0;i<ITEMS.length;i++) if(ITEMS[i].k===cur) it=ITEMS[i];\n` +
    `    if(!it) return;\n` +
    `    txt(20, 28, it.label, {size:15, weight:700, fill:'var(--ink)'});\n` +
    `    // ---- nested rings: Artin > DM > Scheme ----\n` +
    `    svg.appendChild(mk('rect',{x:20,y:50,width:360,height:240,rx:14,fill:'none',stroke:'var(--pink)','stroke-width':1.6}));\n` +
    `    txt(34, 70, 'Artin (algebraic) \\u2014 smooth atlas', {size:11, fill:'var(--pink)', weight:600});\n` +
    `    svg.appendChild(mk('rect',{x:48,y:80,width:250,height:184,rx:12,fill:'none',stroke:'var(--violet)','stroke-width':1.6}));\n` +
    `    txt(62, 100, 'Deligne\\u2013Mumford \\u2014 finite Aut, \\u00e9tale atlas', {size:11, fill:'var(--violet)', weight:600});\n` +
    `    svg.appendChild(mk('rect',{x:76,y:112,width:150,height:120,rx:10,fill:'none',stroke:'var(--green)','stroke-width':1.6}));\n` +
    `    txt(90, 132, 'Schemes \\u2014 trivial Aut', {size:11, fill:'var(--green)', weight:600});\n` +
    `    // ---- marker dot for current example ----\n` +
    `    var pos={scheme:[151,178], dm:[262,150], artin:[339,118]}[it.cls];\n` +
    `    var col={scheme:'var(--green)', dm:'var(--violet)', artin:'var(--pink)'}[it.cls];\n` +
    `    svg.appendChild(mk('circle',{cx:pos[0],cy:pos[1],r:11,fill:col,stroke:'var(--ink)','stroke-width':1.5}));\n` +
    `    svg.appendChild(mk('circle',{cx:pos[0],cy:pos[1],r:17,fill:'none',stroke:col,'stroke-width':1,'stroke-opacity':0.5}));\n` +
    `    txt(pos[0], pos[1]+33, 'this stack', {anchor:'middle', size:9, fill:col});\n` +
    `    // ---- info panel (right) ----\n` +
    `    var px=400, py=70, dy=24;\n` +
    `    txt(px, py, 'Aut(point):', {size:10, fill:'var(--mute)'}); txt(px, py+15, it.autShort, {size:11, fill:'var(--ink)', weight:600}); py+=44;\n` +
    `    txt(px, py, 'dim Aut = '+it.dim+(it.dim>0?'  (positive!)':''), {size:11, fill: it.dim>0?'var(--pink)':'var(--ink)', weight: it.dim>0?700:400}); py+=dy;\n` +
    `    txt(px, py, 'atlas: '+it.atlas, {size:11, fill:'var(--ink)'}); py+=dy;\n` +
    `    var diag = it.cls==='artin'?'not unramified':(it.cls==='dm'?'unramified':'an immersion');\n` +
    `    txt(px, py, 'diagonal:', {size:10, fill:'var(--mute)'}); txt(px, py+15, diag, {size:11, fill:'var(--ink)'}); py+=46;\n` +
    `    var verdict={scheme:'SCHEME', dm:'DELIGNE\\u2013MUMFORD', artin:'ARTIN, not DM'}[it.cls];\n` +
    `    txt(px, py, verdict, {size:12, fill:col, weight:700}); py+=20;\n` +
    `    txt(px, py, it.cls==='scheme'?'\\u2282 DM \\u2282 Artin':(it.cls==='dm'?'(\\u2282 Artin, \\u2287 schemes)':'(\\u2287 DM)'), {size:9, fill:'var(--mute)'});\n` +
    `    out.textContent='Both ARTIN (algebraic) and DELIGNE\\u2013MUMFORD stacks are presented by an ATLAS \\u2014 a surjection U \\u2192 X from a scheme U onto the stack X \\u2014 with representable, quasi-compact diagonal. ARTIN: the atlas is a SMOOTH surjection. DELIGNE\\u2013MUMFORD: additionally the diagonal is UNRAMIFIED, equivalently one can find an \\u00c9TALE atlas. The single thing that distinguishes them is the AUTOMORPHISM GROUPS of points (the fibres of the diagonal): DM \\u21d4 those automorphism schemes are FINITE (0-dimensional, unramified) \\u21d4 an \\u00e9tale atlas exists; an honestly ARTIN stack has at least one POSITIVE-DIMENSIONAL stabilizer, so no \\u00e9tale atlas can exist and only a smooth one does. Every DM stack is Artin, and schemes are the further special case where every automorphism group is trivial: Schemes \\u2282 Deligne\\u2013Mumford \\u2282 Artin. So the test is purely the dimension of the automorphism groups \\u2014 finite keeps you in DM (B(\\u2124/2), [A\\u00b9/(\\u2124/2)], the moduli stack M\\u2081,\\u2081 of elliptic curves), positive-dimensional drops you into Artin-only (B G_m, [A\\u00b9/G_m]). '+it.note;\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; cur=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
