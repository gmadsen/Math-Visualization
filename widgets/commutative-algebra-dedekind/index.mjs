// commutative-algebra-dedekind widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The arithmetic of Z[√−5] is intrinsic; params carry
// only chrome. The widget shows that in a Dedekind domain ideals factor uniquely
// into primes even when elements do not — the classic (6) example.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">factor 6 as</span>\n` +
    `    <button type="button" id="${widgetId}-a">$2\\cdot 3$</button>\n` +
    `    <button type="button" id="${widgetId}-b">$(1+\\sqrt{-5})(1-\\sqrt{-5})$</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 250" width="560" height="250" role="img" aria-label="In Z[sqrt -5], 6 has two element factorizations but one prime-ideal factorization"><title>Dedekind domains: ideals factor uniquely into primes even when elements do not</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* commutative-algebra-dedekind widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var bA=document.getElementById('${widgetId}-a'), bB=document.getElementById('${widgetId}-b');\n` +
    `  if(!svg||!out||!bA||!bB) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag, attrs, text){ var e=document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text', {x:x, y:y, 'text-anchor':opt.anchor||'middle', 'font-size':opt.size||12, fill:opt.fill||'var(--ink)', 'font-weight':opt.weight||'normal', 'font-style':opt.italic?'italic':'normal'}, s)); }\n` +
    `  function box(cx,cy,w,label,col){ svg.appendChild(mk('rect', {x:cx-w/2, y:cy-15, width:w, height:30, rx:5, fill:'var(--panel2)', stroke:col, 'stroke-width':1.4})); txt(cx, cy+4, label, {size:12, fill:'var(--ink)'}); }\n` +
    `  function arr(x1,y1,x2,y2){ svg.appendChild(mk('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:'var(--mute)','stroke-width':1})); var a=Math.atan2(y2-y1,x2-x1); svg.appendChild(mk('path',{d:'M'+x2+' '+y2+' L'+(x2-7*Math.cos(a-0.4))+' '+(y2-7*Math.sin(a-0.4))+' L'+(x2-7*Math.cos(a+0.4))+' '+(y2-7*Math.sin(a+0.4))+' Z',fill:'var(--mute)'})); }\n` +
    `  var sel='a';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    bA.classList.toggle('active',sel==='a'); bA.setAttribute('aria-pressed',sel==='a'?'true':'false');\n` +
    `    bB.classList.toggle('active',sel==='b'); bB.setAttribute('aria-pressed',sel==='b'?'true':'false');\n` +
    `    txt(280, 22, 'R = \\u2124[\\u221a\\u22125] (a Dedekind domain, but NOT a UFD)', {size:11, fill:'var(--mute)', italic:true});\n` +
    `    // element factorization (top)\n` +
    `    var f1, f2;\n` +
    `    if(sel==='a'){ f1='(2)'; f2='(3)'; txt(280, 50, '6 = 2 \\u00b7 3   (two irreducibles)', {size:13, fill:'var(--yellow)', weight:600}); }\n` +
    `    else { f1='(1+\\u221a\\u22125)'; f2='(1\\u2212\\u221a\\u22125)'; txt(280, 50, '6 = (1+\\u221a\\u22125)(1\\u2212\\u221a\\u22125)   (two more irreducibles)', {size:13, fill:'var(--yellow)', weight:600}); }\n` +
    `    box(170, 86, 90, f1, 'var(--yellow)'); box(390, 86, 110, f2, 'var(--yellow)');\n` +
    `    // expand each principal ideal into primes\n` +
    `    var e1, e2;\n` +
    `    if(sel==='a'){ e1=['p\\u2082','p\\u2082']; e2=['p\\u2083',\"p\\u2083'\"]; }\n` +
    `    else { e1=['p\\u2082','p\\u2083']; e2=['p\\u2082',\"p\\u2083'\"]; }\n` +
    `    arr(170,101,170,131); arr(390,101,390,131);\n` +
    `    txt(170, 150, f1 + ' = ' + e1.join('\\u00b7'), {size:12, fill:'var(--cyan)'});\n` +
    `    txt(390, 150, f2 + ' = ' + e2.join('\\u00b7'), {size:12, fill:'var(--cyan)'});\n` +
    `    // converge to (6)\n` +
    `    arr(190,162,265,186); arr(380,162,300,186);\n` +
    `    txt(280, 200, '(6) = p\\u2082\\u00b2 \\u00b7 p\\u2083 \\u00b7 p\\u2083\\u2032', {size:15, fill:'var(--green)', weight:600});\n` +
    `    txt(280, 222, 'same prime-ideal factorization from BOTH element factorizations \\u2014 unique!', {size:10, fill:'var(--green)'});\n` +
    `    txt(280, 240, 'p\\u2082 = (2, 1+\\u221a\\u22125),   p\\u2083 = (3, 1+\\u221a\\u22125),   p\\u2083\\u2032 = (3, 1\\u2212\\u221a\\u22125)', {size:10, fill:'var(--mute)'});\n` +
    `    // readout\n` +
    `    var lines=[];\n` +
    `    lines.push('In R = \\u2124[\\u221a\\u22125], the element 6 factors two genuinely different ways into irreducibles: 6 = 2\\u00b73 = (1+\\u221a\\u22125)(1\\u2212\\u221a\\u22125). So R is not a unique factorization domain.');\n` +
    `    lines.push('But R is a DEDEKIND domain (dimension 1, Noetherian, integrally closed), so every nonzero ideal factors uniquely into PRIME ideals. Here (2) = p\\u2082\\u00b2 (2 ramifies), (3) = p\\u2083\\u00b7p\\u2083\\u2032 (3 splits), and (1+\\u221a\\u22125) = p\\u2082\\u00b7p\\u2083, (1\\u2212\\u221a\\u22125) = p\\u2082\\u00b7p\\u2083\\u2032 (each has norm 6 = 2\\u00b73).');\n` +
    `    lines.push('Both element factorizations refine to the SAME ideal factorization (6) = p\\u2082\\u00b2\\u00b7p\\u2083\\u00b7p\\u2083\\u2032 \\u2014 unique factorization is restored at the level of ideals. The class group Cl(R) (here \\u2124/2) measures exactly how far the (non-principal) prime ideals p\\u2082, p\\u2083, p\\u2083\\u2032 are from being principal, i.e. how far R is from a UFD.');\n` +
    `    lines.push('DVR connection: localizing R at any nonzero prime p gives a DVR \\u2014 a local PID with a uniformizer \\u03c0 and valuation v_p, where every element is u\\u03c0\\u207f and every ideal is (\\u03c0\\u207f). Dedekind = \\u201cDVR at every prime,\\u201d the one-dimensional regular local model glued over the curve/number-ring.');\n` +
    `    out.textContent=lines.join('\\n');\n` +
    `  }\n` +
    `  bA.addEventListener('click', function(){ sel='a'; draw(); });\n` +
    `  bB.addEventListener('click', function(){ sel='b'; draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
