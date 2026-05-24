// morphisms-separated-proper widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Separated (diagonal closed) and proper
// (valuative criterion) shown by running a one-parameter limit on A^1
// (separated, not proper), P^1 (separated + proper), and the doubled-origin
// line (not separated).

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
    `    ${btn('a1', 'A¹ (affine line)', true)}\n` +
    `    ${btn('p1', 'P¹ (projective line)', false)}\n` +
    `    ${btn('dbl', 'doubled-origin line', false)}\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-t">family parameter $t \\to 0$</label>\n` +
    `    <input type="range" id="${widgetId}-t" min="6" max="200" value="120" step="1">\n` +
    `    <span class="pill" id="${widgetId}-tv">t = …</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="A one-parameter family approaching a limit on the affine line, projective line, and doubled-origin line, showing separatedness and properness"><title>Separated vs proper: a one-parameter limit has no limit on A^1 (not proper), a unique limit on P^1 (proper), and two limits on the doubled-origin line (not separated)</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* morphisms-separated-proper widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var st=document.getElementById('${widgetId}-t'), tv=document.getElementById('${widgetId}-tv'), btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!st||!tv||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var CX=280, MIDY=150, LX0=70, LX1=490, R=90;\n` +
    `  var curKey='a1';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var t=parseInt(st.value,10)/100; tv.textContent='t = '+t.toFixed(2);\n` +
    `    var verdict='';\n` +
    `    if(curKey==='a1'){\n` +
    `      // A^1: a line; family u = 1/t escapes to +infinity (off the right end) as t->0\n` +
    `      var u=1/t; svg.appendChild(mk('line',{x1:LX0,y1:MIDY,x2:LX1,y2:MIDY,stroke:'var(--cyan)','stroke-width':2}));\n` +
    `      txt(LX0-4, MIDY+4, '(\\u221e missing)', {anchor:'end', size:8, fill:'var(--mute)'}); txt(LX1+4, MIDY+4, '(\\u221e missing)', {size:8, fill:'var(--mute)'});\n` +
    `      // map u in [0,5] to [CX, LX1]; beyond 5, clamp at edge with arrow\n` +
    `      var SCALE=(LX1-CX)/5; var px=CX+u*SCALE; var off=px>LX1;\n` +
    `      txt(CX, MIDY+18, '0', {anchor:'middle', size:9, fill:'var(--mute)'}); svg.appendChild(mk('circle',{cx:CX,cy:MIDY,r:2.5,fill:'var(--mute)'}));\n` +
    `      if(off){ svg.appendChild(mk('path',{d:'M '+(LX1-10)+' '+(MIDY-6)+' L '+(LX1+2)+' '+MIDY+' L '+(LX1-10)+' '+(MIDY+6)+' Z', fill:'var(--pink)'})); txt(LX1-14, MIDY-12, 'point = 1/t = '+u.toFixed(1)+' \\u2192 escapes', {anchor:'end', size:9, fill:'var(--pink)'}); }\n` +
    `      else { svg.appendChild(mk('circle',{cx:px,cy:MIDY,r:5,fill:'var(--pink)'})); txt(px, MIDY-10, '1/t = '+u.toFixed(2), {anchor:'middle', size:9, fill:'var(--pink)'}); }\n` +
    `      txt(CX, MIDY+44, 'the family t \\u21a6 1/t runs off the end \\u2014 NO limit in A\\u00b9', {anchor:'middle', size:10, fill:'var(--ink)'});\n` +
    `      verdict='A\\u00b9 is SEPARATED (its diagonal is closed) but NOT PROPER: the family t\\u21a61/t has no limit as t\\u21920 \\u2014 it escapes to infinity, which A\\u00b9 is missing. The valuative criterion fails (a limit need not exist).';\n` +
    `    } else if(curKey==='p1'){\n` +
    `      // P^1 as a circle; 0 at bottom, infinity at top; point u=1/t at angle 2 atan(u)\n` +
    `      var u2=1/t; var al=2*Math.atan(u2); var px2=CX+R*Math.sin(al), py2=MIDY+R*Math.cos(al);\n` +
    `      svg.appendChild(mk('circle',{cx:CX,cy:MIDY,r:R,fill:'none',stroke:'var(--cyan)','stroke-width':2}));\n` +
    `      svg.appendChild(mk('circle',{cx:CX,cy:MIDY+R,r:3,fill:'var(--mute)'})); txt(CX, MIDY+R+14, '0', {anchor:'middle', size:9, fill:'var(--mute)'});\n` +
    `      svg.appendChild(mk('circle',{cx:CX,cy:MIDY-R,r:3,fill:'var(--green)'})); txt(CX, MIDY-R-6, '\\u221e (the added point)', {anchor:'middle', size:9, fill:'var(--green)'});\n` +
    `      svg.appendChild(mk('circle',{cx:px2,cy:py2,r:5,fill:'var(--pink)'})); txt(px2+ (px2>CX?8:-8), py2, '1/t = '+u2.toFixed(2), {anchor:px2>CX?'start':'end', size:9, fill:'var(--pink)'});\n` +
    `      txt(CX, MIDY+R+40, 'as t \\u2192 0, the point limits to \\u221e \\u2014 a UNIQUE limit in P\\u00b9', {anchor:'middle', size:10, fill:'var(--ink)'});\n` +
    `      verdict='P\\u00b9 is SEPARATED and PROPER: every one-parameter family has a limit (here t\\u21a61/t \\u2192 \\u221e as t\\u21920), and the limit is UNIQUE. That is exactly the valuative criterion of properness \\u2014 P\\u00b9 is complete, the model compact variety.';\n` +
    `    } else {\n` +
    `      // doubled-origin line: a line with two origins at x=0\n` +
    `      svg.appendChild(mk('line',{x1:LX0,y1:MIDY,x2:LX1,y2:MIDY,stroke:'var(--cyan)','stroke-width':2}));\n` +
    `      // two origins, drawn split\n` +
    `      svg.appendChild(mk('circle',{cx:CX,cy:MIDY-9,r:4,fill:'var(--green)'})); txt(CX-8, MIDY-12, '0_L', {anchor:'end', size:9, fill:'var(--green)', weight:700});\n` +
    `      svg.appendChild(mk('circle',{cx:CX,cy:MIDY+9,r:4,fill:'var(--pink)'})); txt(CX-8, MIDY+16, '0_R', {anchor:'end', size:9, fill:'var(--pink)', weight:700});\n` +
    `      // approaching point at x = t (from the right), shown twice (it lifts toward both origins)\n` +
    `      var SCALE2=(LX1-CX)/5; var px3=CX+t*SCALE2;\n` +
    `      svg.appendChild(mk('circle',{cx:px3,cy:MIDY-9,r:3.5,fill:'var(--green)','fill-opacity':0.7}));\n` +
    `      svg.appendChild(mk('circle',{cx:px3,cy:MIDY+9,r:3.5,fill:'var(--pink)','fill-opacity':0.7}));\n` +
    `      txt(px3, MIDY-20, 'x = t = '+t.toFixed(2), {anchor:'middle', size:9, fill:'var(--ink)'});\n` +
    `      txt(CX, MIDY+44, 'as t \\u2192 0 the family approaches BOTH origins \\u2014 TWO limits', {anchor:'middle', size:10, fill:'var(--ink)'});\n` +
    `      verdict='The line with doubled origin (two copies of A\\u00b9 glued along A\\u00b9\\u2216{0}) is NOT SEPARATED: the family t\\u21a6t has TWO limits as t\\u21920, the two origins 0_L and 0_R \\u2014 like a non-Hausdorff space with two limits of one sequence. Its diagonal \\u0394 fails to be closed: the pair (0_L, 0_R) lies in the closure of \\u0394(X) but not on \\u0394(X) itself.';\n` +
    `    }\n` +
    `    out.textContent='Once you have fiber products, the key adjectives are defined by pulling a condition through a diagonal or base-change square. SEPARATED: the diagonal \\u0394_f: X \\u2192 X \\u00d7_S X (always a locally closed immersion) is a CLOSED immersion \\u2014 the scheme-theoretic analog of the Hausdorff condition (in a Hausdorff space the diagonal is closed in the product). PROPER: separated + finite type + universally closed, captured by the VALUATIVE CRITERION \\u2014 for every map from the punctured spectrum of a DVR (a one-parameter family / punctured disk), the limit point exists (proper) and is unique (separated). '+verdict+' Run the slider t \\u2192 0 to watch the family seek its limit(s); switch spaces to compare. The three cases are the canonical zoo: A\\u00b9 separated-not-proper, P\\u00b9 separated-and-proper (complete), and the doubled-origin line not-separated.';\n` +
    `  }\n` +
    `  st.addEventListener('input', draw);\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; curKey=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
