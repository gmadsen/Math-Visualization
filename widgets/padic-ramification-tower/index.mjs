// padic-ramification-tower widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The tower Q_p <= L^ur <= L: unramified piece of
// degree f (residue field F_{p^f}) then totally ramified of degree e, with
// ef=[L:Q_p] and tame (gcd(e,p)=1) vs wild (p|e).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-pbox" role="group" aria-label="prime p">\n` +
    `    <span class="note">prime $p$:</span>\n` +
    `    <button type="button" data-p="2" class="active" aria-pressed="true">2</button>\n` +
    `    <button type="button" data-p="3" aria-pressed="false">3</button>\n` +
    `    <button type="button" data-p="5" aria-pressed="false">5</button>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-e">ramification index $e$</label>\n` +
    `    <input type="range" id="${widgetId}-e" min="1" max="6" value="2" step="1">\n` +
    `    <span class="pill" id="${widgetId}-ev">e = 2</span>\n` +
    `    <label for="${widgetId}-f">residue degree $f$</label>\n` +
    `    <input type="range" id="${widgetId}-f" min="1" max="4" value="1" step="1">\n` +
    `    <span class="pill" id="${widgetId}-fv">f = 1</span>\n` +
    `  </div>\n` +
    `  <div class="row" id="${widgetId}-presets" role="group" aria-label="preset extension">\n` +
    `    <button type="button" data-pre="unram">unramified</button>\n` +
    `    <button type="button" data-pre="tame">tame totally ramified</button>\n` +
    `    <button type="button" data-pre="wild">wild ($\\mathbb{Q}_2(i)$)</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="The tower Q_p inside L-unramified inside L, with the unramified degree f and totally ramified degree e"><title>Extension tower Q_p ⊆ L^ur ⊆ L: an unramified step of degree f then a totally ramified step of degree e, with ef the total degree</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* padic-ramification-tower widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var se=document.getElementById('${widgetId}-e'), sf=document.getElementById('${widgetId}-f');\n` +
    `  var ev=document.getElementById('${widgetId}-ev'), fv=document.getElementById('${widgetId}-fv');\n` +
    `  var pbox=document.getElementById('${widgetId}-pbox'), presets=document.getElementById('${widgetId}-presets');\n` +
    `  if(!svg||!out||!se||!sf||!pbox||!presets) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var SUP=['\\u2070','\\u00b9','\\u00b2','\\u00b3','\\u2074','\\u2075','\\u2076','\\u2077','\\u2078','\\u2079'];\n` +
    `  function sup(n){ var s=''+n, o=''; for(var i=0;i<s.length;i++) o+=SUP[+s[i]]; return o; }\n` +
    `  var p=2;\n` +
    `  function gcd(a,b){ while(b){ var t=b; b=a%b; a=t; } return a; }\n` +
    `  function node(cx,cy,w,label,fill){ svg.appendChild(mk('rect',{x:cx-w/2,y:cy-15,width:w,height:30,rx:7,fill:'var(--panel)',stroke:fill,'stroke-width':1.6})); txt(cx,cy+5,label,{size:13,fill:fill,weight:600}); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var e=parseInt(se.value,10), f=parseInt(sf.value,10);\n` +
    `    ev.textContent='e = '+e; fv.textContent='f = '+f;\n` +
    `    var n=e*f, wild=(e%p===0), tame=!wild;\n` +
    `    var cx=180, yB=246, yM=150, yT=54;\n` +
    // edges
    `    svg.appendChild(mk('line',{x1:cx,y1:yB-15,x2:cx,y2:yM+15,stroke:(f>1?'var(--cyan)':'var(--line)'),'stroke-width':(f>1?2.2:1.2)}));\n` +
    `    svg.appendChild(mk('line',{x1:cx,y1:yM-15,x2:cx,y2:yT+15,stroke:(e>1?'var(--pink)':'var(--line)'),'stroke-width':(e>1?2.2:1.2)}));\n` +
    `    txt(cx+70, (yB+yM)/2, 'degree f = '+f, {size:11, fill:'var(--cyan)', anchor:'start'});\n` +
    `    txt(cx+70, (yB+yM)/2+15, f===1?'(unramified: trivial)':'unramified', {size:9, fill:'var(--mute)', anchor:'start'});\n` +
    `    txt(cx+70, (yM+yT)/2, 'degree e = '+e, {size:11, fill:'var(--pink)', anchor:'start'});\n` +
    `    txt(cx+70, (yM+yT)/2+15, e===1?'(totally ramified: trivial)':'totally ramified', {size:9, fill:'var(--mute)', anchor:'start'});\n` +
    // nodes
    `    node(cx, yB, 80, 'Q_p', 'var(--ink)');\n` +
    `    node(cx, yM, 120, 'L^ur', 'var(--cyan)');\n` +
    `    node(cx, yT, 80, 'L', 'var(--pink)');\n` +
    `    txt(cx, yB+34, 'residue F_p', {size:9, fill:'var(--mute)'});\n` +
    `    txt(cx, yM+34, 'residue F_p'+(f>1?sup(f):''), {size:9, fill:'var(--cyan)'});\n` +
    `    txt(cx, yT-26, 'uniformizer \\u03c0'+(e>1?', \\u03c0'+sup(e)+'~p':''), {size:9, fill:'var(--pink)'});\n` +
    // right panel
    `    var TX=350, ty=44;\n` +
    `    txt(TX, ty, '[L : Q_p] = e\\u00b7f', {size:11, fill:'var(--mute)', anchor:'start'}); ty+=20;\n` +
    `    txt(TX, ty, '= '+e+'\\u00b7'+f+' = '+n, {size:14, fill:'var(--ink)', weight:700, anchor:'start'}); ty+=28;\n` +
    `    txt(TX, ty, 'residue field F_p'+(f>1?sup(f):''), {size:11, fill:'var(--cyan)', anchor:'start'}); ty+=18;\n` +
    `    txt(TX, ty, 'ram. index e = v_L(p) = '+e, {size:10, fill:'var(--mute)', anchor:'start'}); ty+=28;\n` +
    `    var verdict = e===1 ? 'UNRAMIFIED' : (tame?'TAMELY ramified':'WILDLY ramified');\n` +
    `    txt(TX, ty, verdict, {size:13, fill: wild?'var(--pink)':'var(--green)', weight:700, anchor:'start'}); ty+=18;\n` +
    `    txt(TX, ty, 'gcd(e,p) = gcd('+e+','+p+') = '+gcd(e,p), {size:10, fill:'var(--mute)', anchor:'start'}); ty+=15;\n` +
    `    txt(TX, ty, tame?'(p does not divide e)':'(p divides e)', {size:9, fill:'var(--mute)', anchor:'start'});\n` +
    `    var cls = e===1 ? 'unramified (e=1): L = L^ur is the unramified extension of degree f, gotten by lifting the residue extension F_p'+sup(f)+'/F_p.' : (f===1 ? 'totally ramified (f=1): L/Q_p is generated by an Eisenstein uniformizer \\u03c0 with \\u03c0'+sup(e)+' ~ p.' : 'mixed: an unramified step of degree '+f+' followed by a totally ramified step of degree '+e+'.');\n` +
    `    out.textContent = 'A finite extension L/Q_p has a ramification index e = v_L(p) and a residue degree f = [residue field : F_p], satisfying ef = [L:Q_p] = '+n+'. It factors canonically as Q_p \\u2286 L^ur \\u2286 L: the maximal unramified subextension L^ur has degree f (residue field F_p'+sup(f)+', lifted from F_p'+sup(f)+'/F_p), and L/L^ur is totally ramified of degree e, generated by an Eisenstein uniformizer. '+cls+' The extension is '+(tame?'TAMELY ramified because gcd(e,p)=1':'WILDLY ramified because p='+p+' divides e='+e)+'. Wild ramification is genuinely p-adic \\u2014 e.g. Q_p(\\u03b6_{p\\u207f})/Q_p is totally ramified of degree p^(n\\u22121)(p\\u22121) and wild for n\\u22652.';\n` +
    `  }\n` +
    `  Array.prototype.forEach.call(pbox.querySelectorAll('button'), function(b){ b.addEventListener('click', function(){\n` +
    `    p=parseInt(b.getAttribute('data-p'),10);\n` +
    `    Array.prototype.forEach.call(pbox.querySelectorAll('button'), function(x){ var on=(x===b); x.classList.toggle('active',on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw();\n` +
    `  }); });\n` +
    `  function setP(np){ p=np; Array.prototype.forEach.call(pbox.querySelectorAll('button'), function(x){ var on=(+x.getAttribute('data-p')===np); x.classList.toggle('active',on); x.setAttribute('aria-pressed', on?'true':'false'); }); }\n` +
    `  Array.prototype.forEach.call(presets.querySelectorAll('button'), function(b){ b.addEventListener('click', function(){\n` +
    `    var pre=b.getAttribute('data-pre');\n` +
    `    if(pre==='unram'){ setP(3); se.value='1'; sf.value='2'; }\n` +
    `    else if(pre==='tame'){ setP(5); se.value='3'; sf.value='1'; }\n` +
    `    else if(pre==='wild'){ setP(2); se.value='2'; sf.value='1'; }\n` +
    `    draw();\n` +
    `  }); });\n` +
    `  se.addEventListener('input', draw); sf.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
