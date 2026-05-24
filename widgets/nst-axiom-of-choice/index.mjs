// nst-axiom-of-choice widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Russell's shoes-vs-socks picture of AC: shoes are
// distinguishable so "pick the left one" is a definable choice function (no AC);
// socks are indistinguishable so no rule exists and the infinite family needs AC.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-mode" role="group" aria-label="kind of pair">\n` +
    `    <button type="button" data-kind="shoes" class="active" aria-pressed="true">Shoes (distinguishable)</button>\n` +
    `    <button type="button" data-kind="socks" aria-pressed="false">Socks (indistinguishable)</button>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">visible pairs</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="2" max="6" value="4" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nv">4</span>\n` +
    `    <button type="button" id="${widgetId}-act">Pick the left one</button>\n` +
    `    <button type="button" id="${widgetId}-reset">reset</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="A row of pairs of shoes or socks, plus a bin for the infinitely many remaining pairs, with one item selected per bin"><title>Choosing one item from each pair: a left/right rule works for shoes (and reaches the infinite family) but no rule exists for indistinguishable socks — that is where the axiom of choice is needed</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* nst-axiom-of-choice widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var modeBox=document.getElementById('${widgetId}-mode');\n` +
    `  var sn=document.getElementById('${widgetId}-n'), nv=document.getElementById('${widgetId}-nv');\n` +
    `  var act=document.getElementById('${widgetId}-act'), reset=document.getElementById('${widgetId}-reset');\n` +
    `  if(!svg||!out||!modeBox||!sn||!act||!reset) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; var t=mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s); svg.appendChild(t); return t; }\n` +
    `  var SUB=['\\u2081','\\u2082','\\u2083','\\u2084','\\u2085','\\u2086'];\n` +
    `  function sub(i){ return SUB[i-1]||(''+i); }\n` +
    `  var kind='shoes';\n` +
    `  var n=4;\n` +
    `  var chosen=[];          // chosen[i] = 0 (left) | 1 (right) | -1 (none) for finite bins\n` +
    `  var infChosen=false;    // is the infinite bin resolved?\n` +
    `  function resetState(){ chosen=[]; for(var i=0;i<n;i++) chosen.push(-1); infChosen=false; }\n` +
    `  function drawItem(cx,cy,which,sel){\n` +
    // shoes: distinguishable L (cyan) / R (pink) with a letter; socks: identical grey ovals.
    // selection is shown by a green ring + check, never by dark-on-bright text (theme-safe, token-only).
    `    var base = kind==='shoes' ? (which===0?'var(--cyan)':'var(--pink)') : 'var(--mute)';\n` +
    `    svg.appendChild(mk('ellipse',{cx:cx, cy:cy, rx:13, ry:17, fill:'var(--panel2)', stroke:sel?'var(--green)':base, 'stroke-width':sel?3:2}));\n` +
    `    if(kind==='shoes'){ svg.appendChild(mk('text',{x:cx,y:cy+4,'text-anchor':'middle','font-size':12,fill:base,'font-weight':700}, which===0?'L':'R')); }\n` +
    `    else { svg.appendChild(mk('circle',{cx:cx, cy:cy, r:4, fill:sel?'var(--green)':'var(--mute)'})); }\n` +
    `    if(sel){ svg.appendChild(mk('text',{x:cx+12,y:cy-12,'text-anchor':'middle','font-size':12,fill:'var(--green)','font-weight':700}, '\\u2713')); }\n` +
    `  }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    nv.textContent=''+n;\n` +
    `    var slots=n+1, gap=540/slots, x0=10, binW=Math.min(74,gap-8), by=92, bh=92;\n` +
    `    txt(280, 26, kind==='shoes' ? 'each pair has a left and a right \\u2014 distinguishable'\n` +
    `                                : 'the two socks in a pair are identical \\u2014 indistinguishable', {size:11, fill:'var(--mute)'});\n` +
    `    for(var i=0;i<n;i++){ (function(i){\n` +
    `      var cx=x0+gap*i+gap/2;\n` +
    `      var g=mk('rect',{x:cx-binW/2, y:by, width:binW, height:bh, rx:9, fill:'var(--panel)', stroke:'var(--line)','stroke-width':1.2, style:'cursor:pointer'});\n` +
    `      svg.appendChild(g);\n` +
    `      txt(cx, by-8, 'A'+sub(i+1), {size:12, fill:'var(--ink)', weight:600});\n` +
    `      drawItem(cx-15, by+bh/2, 0, chosen[i]===0);\n` +
    `      drawItem(cx+15, by+bh/2, 1, chosen[i]===1);\n` +
    `      var hitL=mk('rect',{x:cx-binW/2, y:by, width:binW/2, height:bh, fill:'transparent', style:'cursor:pointer'});\n` +
    `      var hitR=mk('rect',{x:cx, y:by, width:binW/2, height:bh, fill:'transparent', style:'cursor:pointer'});\n` +
    `      hitL.addEventListener('click', function(){ chosen[i]=0; draw(); });\n` +
    `      hitR.addEventListener('click', function(){ chosen[i]=1; draw(); });\n` +
    `      svg.appendChild(hitL); svg.appendChild(hitR);\n` +
    `    })(i); }\n` +
    // the infinite bin
    `    var icx=x0+gap*n+gap/2;\n` +
    `    svg.appendChild(mk('rect',{x:icx-binW/2, y:by, width:binW, height:bh, rx:9, fill:'var(--panel)', stroke:infChosen?'var(--green)':'var(--violet)','stroke-width':1.4,'stroke-dasharray':'5 3'}));\n` +
    `    txt(icx, by-8, 'A\\u1d62, i\\u2192\\u221e', {size:11, fill:'var(--violet)', weight:600});\n` +
    `    if(kind==='shoes'){ drawItem(icx-15, by+bh/2, 0, infChosen); drawItem(icx+15, by+bh/2, 1, false); }\n` +
    `    else { txt(icx, by+bh/2-4, '\\u22ef', {size:20, fill:'var(--mute)'}); txt(icx, by+bh/2+18, infChosen?'?':'no rule', {size:9, fill:infChosen?'var(--mute)':'var(--pink)'}); }\n` +
    `    txt(icx, by+bh+16, '(infinitely many', {size:9, fill:'var(--mute)'});\n` +
    `    txt(icx, by+bh+28, 'more pairs)', {size:9, fill:'var(--mute)'});\n` +
    // status line
    `    var finiteDone=chosen.every(function(c){ return c>=0; });\n` +
    `    var allDone=finiteDone && infChosen;\n` +
    `    var status;\n` +
    `    if(kind==='shoes'){\n` +
    `      status = allDone ? '\\u2713 the rule \\u201cpick the left shoe\\u201d chose one from EVERY pair at once \\u2014 including the infinitely many. A choice function given by a formula. No axiom of choice needed.'\n` +
    `                       : 'Shoes are distinguishable. Click a shoe, or press the button to apply the rule \\u201cpick the left one\\u201d to all pairs at once.';\n` +
    `    } else {\n` +
    `      status = finiteDone ? 'You chose by hand from all '+n+' visible pairs \\u2014 fine for finitely many. But the socks are identical, so there is no rule, and the infinitely many pairs can never be exhausted by hand. The axiom of choice asserts a choice function exists anyway.'\n` +
    `                          : 'Socks are indistinguishable \\u2014 no formula picks one. You can still choose by hand from each FINITE bin (click a sock). The dashed \\u221e bin has no rule: that is exactly where AC is needed.';\n` +
    `    }\n` +
    `    txt(280, 248, kind==='shoes' ? (allDone?'\\u2713 definable choice function \\u2014 no AC':'pick the left one')\n` +
    `                                 : (finiteDone?'finite: done by hand \\u00b7 infinite: needs AC':'no uniform rule \\u2014 pick by hand'),\n` +
    `         {size:11, fill: kind==='shoes' ? (allDone?'var(--green)':'var(--mute)') : (finiteDone?'var(--pink)':'var(--mute)'), weight:600});\n` +
    `    out.textContent = status + '  \\u2014  Formally, AC says: for any family {A\\u1d62} of non-empty sets the product \\u220fA\\u1d62 is non-empty, i.e. a choice function f with f(i)\\u2208A\\u1d62 exists. For shoes the function i\\u21a6(left shoe of A\\u1d62) is explicit; for socks no such formula exists, yet AC guarantees a choice function. AC is independent of ZF (G\\u00f6del 1938: consistent; Cohen 1963: its negation consistent) and is equivalent to Zorn\\u2019s lemma, the well-ordering theorem, and \\u201cevery vector space has a basis\\u201d; it underlies Tychonoff\\u2019s theorem and the Banach\\u2013Tarski paradox. Countable choice (I countable) already suffices for most of analysis.';\n` +
    `  }\n` +
    `  function doAction(){\n` +
    `    if(kind==='shoes'){ for(var i=0;i<n;i++) chosen[i]=0; infChosen=true; }\n` +
    `    else { for(var j=0;j<n;j++) chosen[j]=Math.random()<0.5?0:1; infChosen=false; }\n` +
    `    draw();\n` +
    `  }\n` +
    `  act.addEventListener('click', doAction);\n` +
    `  reset.addEventListener('click', function(){ resetState(); draw(); });\n` +
    `  Array.prototype.forEach.call(modeBox.querySelectorAll('button'), function(b){ b.addEventListener('click', function(){\n` +
    `    kind=b.getAttribute('data-kind');\n` +
    `    Array.prototype.forEach.call(modeBox.querySelectorAll('button'), function(x){ var on=(x===b); x.classList.toggle('active',on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    act.textContent = kind==='shoes' ? 'Pick the left one' : 'Pick by hand (random)';\n` +
    `    resetState(); draw();\n` +
    `  }); });\n` +
    `  sn.addEventListener('input', function(){ n=parseInt(sn.value,10); resetState(); draw(); });\n` +
    `  resetState(); draw();\n` +
    `})();\n` +
    `</script>`
  );
}
