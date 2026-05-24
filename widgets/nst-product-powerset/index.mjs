// nst-product-powerset widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Two foundational set constructions: the Cartesian
// product A×B (a rectangle of pairs, |A×B|=|A|·|B|) and the power set P(A),
// shown via the indicator bijection P(A) ~= {0,1}^A so |P(A)|=2^n.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-mode" role="group" aria-label="construction">\n` +
    `    <button type="button" data-mode="prod" class="active" aria-pressed="true">Cartesian product $A\\times B$</button>\n` +
    `    <button type="button" data-mode="pow" aria-pressed="false">Power set $\\mathcal{P}(A)$</button>\n` +
    `  </div>\n` +
    `  <div class="row" id="${widgetId}-prodctl">\n` +
    `    <label for="${widgetId}-a">$|A|$</label>\n` +
    `    <input type="range" id="${widgetId}-a" min="1" max="6" value="3" step="1">\n` +
    `    <span class="pill" id="${widgetId}-av">|A| = 3</span>\n` +
    `    <label for="${widgetId}-b">$|B|$</label>\n` +
    `    <input type="range" id="${widgetId}-b" min="1" max="6" value="4" step="1">\n` +
    `    <span class="pill" id="${widgetId}-bv">|B| = 4</span>\n` +
    `  </div>\n` +
    `  <div class="row" id="${widgetId}-powctl" style="display:none">\n` +
    `    <label for="${widgetId}-n">$n = |A|$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="1" max="5" value="3" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nv">n = 3</span>\n` +
    `    <span class="note" id="${widgetId}-chips" style="display:inline-flex;gap:.3rem;flex-wrap:wrap"></span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="A grid of ordered pairs for the Cartesian product, or the indicator strings of all subsets for the power set"><title>Cartesian product A×B as a rectangle of |A|·|B| pairs, and the power set as the 2^n indicator strings in {0,1}^A</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* nst-product-powerset widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var modeBox=document.getElementById('${widgetId}-mode');\n` +
    `  var prodCtl=document.getElementById('${widgetId}-prodctl'), powCtl=document.getElementById('${widgetId}-powctl');\n` +
    `  var sa=document.getElementById('${widgetId}-a'), sb=document.getElementById('${widgetId}-b'), sn=document.getElementById('${widgetId}-n');\n` +
    `  var av=document.getElementById('${widgetId}-av'), bv=document.getElementById('${widgetId}-bv'), nv=document.getElementById('${widgetId}-nv');\n` +
    `  var chips=document.getElementById('${widgetId}-chips');\n` +
    `  if(!svg||!out||!modeBox||!sa||!sb||!sn||!chips) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var SUB=['\\u2081','\\u2082','\\u2083','\\u2084','\\u2085','\\u2086'];\n` +
    `  function sub(i){ return SUB[i-1]||(''+i); }\n` +
    `  var mode='prod';\n` +
    `  var member=[true,false,true,false,false];\n` +
    `  function weightColor(w){ var cols=['var(--mute)','var(--cyan)','var(--green)','var(--yellow)','var(--pink)','var(--violet)']; return cols[Math.min(w,cols.length-1)]; }\n` +
    `  function drawProduct(){\n` +
    `    var nA=parseInt(sa.value,10), nB=parseInt(sb.value,10);\n` +
    `    av.textContent='|A| = '+nA; bv.textContent='|B| = '+nB;\n` +
    `    var ox=90, oy=64, cw=Math.min(64,440/nB), ch=Math.min(40,220/nA);\n` +
    `    txt(ox-44, oy+nA*ch/2, 'A', {size:13, fill:'var(--cyan)', weight:600, anchor:'middle'});\n` +
    `    txt(ox+nB*cw/2, oy-30, 'B', {size:13, fill:'var(--yellow)', weight:600, anchor:'middle'});\n` +
    `    txt(ox+nB*cw/2, oy-46, 'each cell is a pair (a, b)', {size:10, fill:'var(--mute)', anchor:'middle'});\n` +
    `    for(var i=0;i<nA;i++){ txt(ox-14, oy+i*ch+ch/2+4, 'a'+sub(i+1), {size:11, fill:'var(--cyan)', anchor:'end'}); }\n` +
    `    for(var j=0;j<nB;j++){ txt(ox+j*cw+cw/2, oy-10, 'b'+sub(j+1), {size:11, fill:'var(--yellow)', anchor:'middle'}); }\n` +
    `    for(i=0;i<nA;i++){ for(j=0;j<nB;j++){\n` +
    `      svg.appendChild(mk('rect',{x:ox+j*cw+3, y:oy+i*ch+3, width:cw-6, height:ch-6, rx:5, fill:'var(--panel2)', stroke:'var(--line)','stroke-width':1}));\n` +
    `      svg.appendChild(mk('circle',{cx:ox+j*cw+cw/2, cy:oy+i*ch+ch/2, r:3.2, fill:'var(--violet)'}));\n` +
    `    }}\n` +
    `    var tot=nA*nB;\n` +
    `    txt(ox, oy+nA*ch+34, '|A \\u00d7 B| = |A| \\u00b7 |B| = '+nA+' \\u00b7 '+nB+' = '+tot, {size:13, fill:'var(--ink)', weight:600});\n` +
    `    txt(ox, oy+nA*ch+54, 'the product rule of counting \\u2014 one dot per ordered pair', {size:10, fill:'var(--mute)'});\n` +
    `    out.textContent = 'The Cartesian product A\\u00d7B is the set of all ordered pairs (a,b) with a\\u2208A, b\\u2208B \\u2014 drawn here as a '+nA+'\\u00d7'+nB+' grid, one cell per pair. Counting cells gives |A\\u00d7B| = |A|\\u00b7|B| = '+nA+'\\u00b7'+nB+' = '+tot+', the product rule. The two projections \\u03c0\\u2081(a,b)=a and \\u03c0\\u2082(a,b)=b read off the row and column. A function X\\u2192A\\u00d7B is exactly a pair of functions (X\\u2192A, X\\u2192B): this universal property makes the product a limit in the category of sets. Cartesian powers A\\u1d4f are the special case A\\u00d7\\u00b7\\u00b7\\u00b7\\u00d7A \\u2014 the words of length k over the alphabet A.';\n` +
    `  }\n` +
    `  function drawPower(){\n` +
    `    var n=parseInt(sn.value,10); nv.textContent='n = '+n;\n` +
    `    var S=[], ind=[]; for(var i=0;i<n;i++){ ind.push(member[i]?1:0); if(member[i]) S.push('a'+sub(i+1)); }\n` +
    `    var w=S.length, tot=Math.pow(2,n);\n` +
    `    txt(24, 40, 'current subset', {size:11, fill:'var(--mute)'});\n` +
    `    txt(24, 60, 'S = { '+(S.join(', ')||'\\u2205')+' }', {size:13, fill:'var(--green)', weight:600});\n` +
    `    txt(24, 86, 'indicator  1_S \\u2208 {0,1}\\u207f', {size:11, fill:'var(--mute)'});\n` +
    `    txt(24, 106, '( '+ind.join(', ')+' )', {size:14, fill:'var(--cyan)', weight:600});\n` +
    `    txt(24, 128, '|S| = '+w+' element'+(w===1?'':'s'), {size:10, fill:weightColor(w)});\n` +
    `    txt(24, 168, 'click the chips above to', {size:10, fill:'var(--mute)'});\n` +
    `    txt(24, 182, 'toggle a\\u1d62 in or out of S', {size:10, fill:'var(--mute)'});\n` +
    `    txt(24, 222, '|P(A)| = 2\\u207f = 2^'+n+' = '+tot, {size:13, fill:'var(--ink)', weight:600});\n` +
    `    txt(24, 240, 'one subset per binary string', {size:10, fill:'var(--mute)'});\n` +
    `    var curIdx=0; for(i=0;i<n;i++){ if(member[i]) curIdx += (1<<(n-1-i)); }\n` +
    `    var perCol=16, cols=Math.ceil(tot/perCol);\n` +
    `    var bx=300, by=44, rh=Math.min(17,260/Math.min(tot,perCol)), colW=Math.max(72,250/cols);\n` +
    `    txt(bx, by-16, 'all 2\\u207f indicator strings {0,1}\\u207f', {size:10, fill:'var(--mute)'});\n` +
    `    for(var s=0;s<tot;s++){\n` +
    `      var col=Math.floor(s/perCol), row=s%perCol;\n` +
    `      var x=bx+col*colW, y=by+row*rh;\n` +
    `      var bits=''; var ww=0; for(var k=0;k<n;k++){ var bit=(s>>(n-1-k))&1; bits+=bit; ww+=bit; }\n` +
    `      var here=(s===curIdx);\n` +
    `      if(here) svg.appendChild(mk('rect',{x:x-4, y:y-11, width:colW-10, height:rh-1, rx:3, fill:'var(--green)','fill-opacity':0.22, stroke:'var(--green)','stroke-width':1.2}));\n` +
    `      txt(x, y, bits, {size:11, fill:here?'var(--ink)':weightColor(ww), weight:here?700:400});\n` +
    `    }\n` +
    `    out.textContent = 'The power set P(A) is the set of all subsets of A. Each subset S corresponds to its indicator function 1_S\\u2236 A\\u2192{0,1} (1 on members, 0 elsewhere), and this correspondence S\\u2194 1_S is a bijection P(A)\\u2245{0,1}^A. So choosing a subset is n independent binary choices, one per element: |P(A)| = 2\\u207f = '+tot+' for n='+n+'. The chips build S = { '+(S.join(', ')||'\\u2205')+' }, indicator ('+ind.join('')+'), highlighted among all '+tot+' strings at right (coloured by |S|). Every topology and \\u03c3-algebra on A lives inside this P(A); a directed graph on A is a single element of P(A\\u00d7A).';\n` +
    `  }\n` +
    `  function buildChips(){\n` +
    `    var n=parseInt(sn.value,10); chips.innerHTML='';\n` +
    `    for(var i=0;i<n;i++){ (function(i){\n` +
    `      var b=document.createElement('button'); b.type='button';\n` +
    `      b.className='chip'+(member[i]?' active':''); b.setAttribute('aria-pressed', member[i]?'true':'false');\n` +
    `      b.style.cssText='padding:.1rem .5rem;border-radius:6px;background:var(--panel2);cursor:pointer;font-size:12px;border:1px solid '+(member[i]?'var(--green)':'var(--line)')+';color:'+(member[i]?'var(--green)':'var(--mute)')+';font-weight:'+(member[i]?'700':'400');\n` +
    `      b.textContent='a'+sub(i+1); b.setAttribute('aria-label','toggle element a'+(i+1));\n` +
    `      b.addEventListener('click', function(){ member[i]=!member[i]; buildChips(); draw(); });\n` +
    `      chips.appendChild(b);\n` +
    `    })(i); }\n` +
    `  }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    if(mode==='prod') drawProduct(); else drawPower();\n` +
    `  }\n` +
    `  Array.prototype.forEach.call(modeBox.querySelectorAll('button'), function(b){ b.addEventListener('click', function(){\n` +
    `    mode=b.getAttribute('data-mode');\n` +
    `    Array.prototype.forEach.call(modeBox.querySelectorAll('button'), function(x){ var on=(x===b); x.classList.toggle('active',on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    prodCtl.style.display = mode==='prod' ? '' : 'none';\n` +
    `    powCtl.style.display = mode==='pow' ? '' : 'none';\n` +
    `    draw();\n` +
    `  }); });\n` +
    `  sa.addEventListener('input', draw); sb.addEventListener('input', draw);\n` +
    `  sn.addEventListener('input', function(){ buildChips(); draw(); });\n` +
    `  buildChips(); draw();\n` +
    `})();\n` +
    `</script>`
  );
}
