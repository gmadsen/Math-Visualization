// bezout-statement widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Pick degrees d, e; the widget draws the d×e grid of
// de intersection points and the verdict ∑_P I_P(C,D) = de. Three toggles turn
// off each hypothesis of Bézout's theorem (algebraically closed field;
// projective ambient ℙ²; counting with intersection multiplicity). Dropping any
// one breaks the equality into a strict inequality, with a canonical
// counterexample named in the readout.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const maxDeg = Number.isInteger(params.maxDegree) ? params.maxDegree : 4;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const degBtns = (kind) => {
    let s = '';
    for (let i = 1; i <= maxDeg; i++) s += `    <button type="button" id="${widgetId}-${kind}${i}">${i}</button>\n`;
    return s;
  };
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">degree $d$</span>\n` +
    degBtns('d') +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">degree $e$</span>\n` +
    degBtns('e') +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">hypotheses</span>\n` +
    `    <button type="button" id="${widgetId}-hAlg">$k=\\bar k$ (alg. closed)</button>\n` +
    `    <button type="button" id="${widgetId}-hProj">$C,D\\subset\\mathbb{P}^2$</button>\n` +
    `    <button type="button" id="${widgetId}-hMult">count $I_P$</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 300" width="540" height="300" role="img" aria-label="The d-by-e grid of Bezout intersection points and the three hypotheses"><title>Bezout's theorem: two plane curves of degrees d and e meet in exactly de points when counted over an algebraically closed field, in the projective plane, with intersection multiplicity</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  const maxDeg = Number.isInteger(params.maxDegree) ? params.maxDegree : 4;
  return (
    `<script>\n` +
    `/* bezout-statement widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var MAX=${maxDeg};\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var dB=[], eB=[];\n` +
    `  for(var i=1;i<=MAX;i++){ dB.push(document.getElementById('${widgetId}-d'+i)); eB.push(document.getElementById('${widgetId}-e'+i)); }\n` +
    `  var hAlgB=document.getElementById('${widgetId}-hAlg'), hProjB=document.getElementById('${widgetId}-hProj'), hMultB=document.getElementById('${widgetId}-hMult');\n` +
    `  if(!svg||!out||!hAlgB||!hProjB||!hMultB||dB.some(function(b){return !b;})||eB.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    `  var d=2, e=3, hAlg=true, hProj=true, hMult=true;\n` +
    // canonical counterexamples for each dropped hypothesis (fixed math facts)
    `  var CE={\n` +
    `    alg:'Over a field that is not algebraically closed (e.g. \\u211d) some of the de intersections are complex and invisible. Two disjoint real circles (d=e=2, de=4) meet in 4 points over \\u2102 \\u2014 two complex finite points and the two circular points [1:\\u00b1i:0] at infinity \\u2014 but in 0 real affine points.',\n` +
    `    proj:'In the affine plane A\\u00b2 some intersections escape to the line at infinity. Two parallel lines (d=e=1, de=1) meet only at their shared point at infinity, giving 0 affine intersections; a hyperbola and one of its asymptotes lose a point the same way.',\n` +
    `    mult:'Without intersection multiplicity, tangencies and singular contacts undercount. A line tangent to a conic (de=2) meets it in a single point, but that point carries I_P = 2; counting points naively gives 1 < 2.'\n` +
    `  };\n` +
    `  function setActive(btns,sel){ btns.forEach(function(b,i){ var on=(i+1===sel); b.classList.toggle('active',on); b.setAttribute('aria-pressed',on?'true':'false'); }); }\n` +
    `  function setToggle(btn,on){ btn.classList.toggle('active',on); btn.setAttribute('aria-pressed',on?'true':'false'); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    setActive(dB,d); setActive(eB,e); setToggle(hAlgB,hAlg); setToggle(hProjB,hProj); setToggle(hMultB,hMult);\n` +
    `    var N=d*e, allHold=hAlg&&hProj&&hMult;\n` +
    // grid of de dots: d columns, e rows
    `    var gx=70, gy=70, sp=Math.min(40, 300/(Math.max(d,e)+1));\n` +
    `    var dotCol=allHold?'var(--green)':'var(--mute)';\n` +
    `    for(var r=0;r<e;r++){ for(var c=0;c<d;c++){\n` +
    `      var cx=gx+c*sp, cy=gy+r*sp;\n` +
    `      if(allHold) svg.appendChild(mk('circle',{cx:cx,cy:cy,r:6,fill:dotCol}));\n` +
    `      else svg.appendChild(mk('circle',{cx:cx,cy:cy,r:6,fill:'none',stroke:dotCol,'stroke-width':1.4,'stroke-dasharray':'2 2'}));\n` +
    `    } }\n` +
    `    txt(gx-14, gy+(e-1)*sp/2, 'e', {size:13, fill:'var(--cyan)', italic:true, anchor:'end'});\n` +
    `    txt(gx+(d-1)*sp/2, gy+(e-1)*sp+30, 'd', {size:13, fill:'var(--yellow)', italic:true, anchor:'middle'});\n` +
    `    txt(gx, gy+(e-1)*sp+50, 'a degree-d curve C  \\u2229  a degree-e curve D', {size:11, fill:'var(--mute)'});\n` +
    // right panel
    `    var TX=320;\n` +
    `    txt(TX, 56, 'Bézout\\u2019s theorem', {size:13, fill:'var(--ink)', weight:700});\n` +
    `    txt(TX, 86, '\\u2211 I_P(C,D) = d\\u00b7e', {size:14, fill:'var(--yellow)', weight:600});\n` +
    `    txt(TX, 110, '= ' + d + ' \\u00b7 ' + e + ' = ' + N + (N===1?' point':' points'), {size:13, fill:'var(--cyan)'});\n` +
    `    function hyp(y,on,label){ svg.appendChild(mk('text',{x:TX,y:y,'font-size':13,fill:on?'var(--green)':'var(--pink)'},on?'\\u2713':'\\u2717')); txt(TX+17,y,label,{size:11,fill:on?'var(--ink)':'var(--mute)'}); }\n` +
    `    hyp(142, hAlg, 'k algebraically closed'); hyp(164, hProj, 'curves in \\u2119\\u00b2 (projective)'); hyp(186, hMult, 'count with multiplicity I_P');\n` +
    `    if(allHold){ txt(TX, 220, '= de = ' + N + '   (exact equality)', {size:14, fill:'var(--green)', weight:700}); }\n` +
    `    else { txt(TX, 220, 'actual count  <  de = ' + N, {size:14, fill:'var(--orange)', weight:700}); txt(TX, 240, '(strict inequality \\u2014 a hypothesis is dropped)', {size:10, fill:'var(--mute)', italic:true}); }\n` +
    // readout
    `    var msg;\n` +
    `    if(allHold){ msg='With all three hypotheses, two plane curves with no common component and of degrees d=' + d + ', e=' + e + ' meet in EXACTLY de = ' + N + ' points. The grid shows those de points; over \\u2102, in \\u2119\\u00b2, with each point weighted by its intersection multiplicity I_P, the total is pinned to the product of the degrees \\u2014 independent of the particular curves.'; }\n` +
    `    else { var parts=[]; if(!hAlg) parts.push('\\u2022 algebraically closed: '+CE.alg); if(!hProj) parts.push('\\u2022 projective \\u2119\\u00b2: '+CE.proj); if(!hMult) parts.push('\\u2022 multiplicity I_P: '+CE.mult); msg='Drop a hypothesis and the equality ' + '\\u2211 I_P = de' + ' weakens to a strict inequality \\u2014 the de = ' + N + ' count is no longer pinned (dashed dots). Why each is needed:\\n\\n' + parts.join('\\n\\n'); }\n` +
    `    out.textContent=msg;\n` +
    `  }\n` +
    `  dB.forEach(function(b,i){ b.addEventListener('click', function(){ d=i+1; draw(); }); });\n` +
    `  eB.forEach(function(b,i){ b.addEventListener('click', function(){ e=i+1; draw(); }); });\n` +
    `  hAlgB.addEventListener('click', function(){ hAlg=!hAlg; draw(); });\n` +
    `  hProjB.addEventListener('click', function(){ hProj=!hProj; draw(); });\n` +
    `  hMultB.addEventListener('click', function(){ hMult=!hMult; draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
