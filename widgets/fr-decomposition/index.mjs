// fr-decomposition widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Decomposition/inertia at a prime P|p: the tower
// Q <= K^D <= K^I <= K (degrees r, f, e), the SES 1->I->D->Z/f->1 with
// |D|=ef=|G|/r (orbit-stabiliser), |I|=e, and Frobenius generating D/I.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  function step(id, lbl, val, max) {
    return (
      `    <label for="${widgetId}-${id}">$${lbl}$</label>\n` +
      `    <input type="range" id="${widgetId}-${id}" min="1" max="${max}" value="${val}" step="1">\n` +
      `    <span class="pill" id="${widgetId}-${id}v">${lbl} = ${val}</span>\n`
    );
  }
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` + step('r','r',2,4) + step('f','f',2,4) + step('e','e',1,4) +
    `  </div>\n` +
    `  <div class="row" id="${widgetId}-presets" role="group" aria-label="preset">\n` +
    `    <button type="button" data-pre="split">completely split</button>\n` +
    `    <button type="button" data-pre="inert">inert</button>\n` +
    `    <button type="button" data-pre="ram">ramified</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="The fixed-field tower Q, K^D, K^I, K and the short exact sequence relating inertia, decomposition, and the residue Galois group"><title>Decomposition tower Q ⊆ K^D ⊆ K^I ⊆ K with degrees r, f, e, and the exact sequence 1→I→D→Gal(F_{p^f}/F_p)→1</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* fr-decomposition widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sr=document.getElementById('${widgetId}-r'), sf=document.getElementById('${widgetId}-f'), se=document.getElementById('${widgetId}-e');\n` +
    `  var rv=document.getElementById('${widgetId}-rv'), fv=document.getElementById('${widgetId}-fv'), ev=document.getElementById('${widgetId}-ev');\n` +
    `  var presets=document.getElementById('${widgetId}-presets');\n` +
    `  if(!svg||!out||!sr||!sf||!se) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var SUP=['\\u2070','\\u00b9','\\u00b2','\\u00b3','\\u2074'];\n` +
    `  function node(cx,cy,w,label,col){ svg.appendChild(mk('rect',{x:cx-w/2,y:cy-14,width:w,height:28,rx:7,fill:'var(--panel)',stroke:col,'stroke-width':1.6})); txt(cx,cy+5,label,{size:12,fill:col,weight:600}); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var r=parseInt(sr.value,10), f=parseInt(sf.value,10), e=parseInt(se.value,10);\n` +
    `    rv.textContent='r = '+r; fv.textContent='f = '+f; ev.textContent='e = '+e;\n` +
    `    var n=e*f*r, D=e*f, unram=(e===1);\n` +
    // fixed-field tower on the left
    `    var cx=130, yQ=270, yD=198, yI=126, yK=54;\n` +
    `    svg.appendChild(mk('line',{x1:cx,y1:yQ-14,x2:cx,y2:yD+14,stroke:'var(--violet)','stroke-width':(r>1?2.2:1.2)}));\n` +
    `    svg.appendChild(mk('line',{x1:cx,y1:yD-14,x2:cx,y2:yI+14,stroke:'var(--cyan)','stroke-width':(f>1?2.2:1.2)}));\n` +
    `    svg.appendChild(mk('line',{x1:cx,y1:yI-14,x2:cx,y2:yK+14,stroke:'var(--pink)','stroke-width':(e>1?2.2:1.2)}));\n` +
    `    node(cx,yQ,56,'Q','var(--ink)'); node(cx,yD,70,'K^D','var(--violet)'); node(cx,yI,68,'K^I','var(--cyan)'); node(cx,yK,52,'K','var(--pink)');\n` +
    `    txt(cx+74,(yQ+yD)/2,'r = '+r,{size:11,fill:'var(--violet)',anchor:'start'}); txt(cx+74,(yQ+yD)/2+14,'(p splits into r)',{size:8,fill:'var(--mute)',anchor:'start'});\n` +
    `    txt(cx+74,(yD+yI)/2,'f = '+f,{size:11,fill:'var(--cyan)',anchor:'start'}); txt(cx+74,(yD+yI)/2+14,'(residue / Frob)',{size:8,fill:'var(--mute)',anchor:'start'});\n` +
    `    txt(cx+74,(yI+yK)/2,'e = '+e,{size:11,fill:'var(--pink)',anchor:'start'}); txt(cx+74,(yI+yK)/2+14,'(inertia / ramif.)',{size:8,fill:'var(--mute)',anchor:'start'});\n` +
    `    txt(cx,yK-24,'fixed-field tower',{size:9,fill:'var(--mute)'});\n` +
    // right panel: orders + SES
    `    var TX=300, ty=44;\n` +
    `    txt(TX,ty,'|G| = n = e\\u00b7f\\u00b7r = '+e+'\\u00b7'+f+'\\u00b7'+r+' = '+n,{size:12,fill:'var(--ink)',weight:700,anchor:'start'}); ty+=26;\n` +
    `    txt(TX,ty,'decomposition group D(P) = Stab_G(P)',{size:10,fill:'var(--mute)',anchor:'start'}); ty+=16;\n` +
    `    txt(TX,ty,'|D| = e\\u00b7f = |G|/r = '+D,{size:12,fill:'var(--violet)',weight:600,anchor:'start'}); ty+=14;\n` +
    `    txt(TX,ty,'(orbit\\u2013stabiliser: r = [G:D] primes)',{size:8,fill:'var(--mute)',anchor:'start'}); ty+=26;\n` +
    `    txt(TX,ty,'inertia I(P) = ker(D \\u2192 residue Gal)',{size:10,fill:'var(--mute)',anchor:'start'}); ty+=16;\n` +
    `    txt(TX,ty,'|I| = e = '+e,{size:12,fill:'var(--pink)',weight:600,anchor:'start'}); ty+=24;\n` +
    `    txt(TX,ty,'1 \\u2192 I \\u2192 D \\u2192 Gal(F_p'+(f>1?SUP[f]||('^'+f):'')+'/F_p) \\u2192 1',{size:11,fill:'var(--cyan)',anchor:'start'}); ty+=14;\n` +
    `    txt(TX,ty,'with D/I \\u2245 Z/'+f+' = where Frob lives',{size:9,fill:'var(--mute)',anchor:'start'}); ty+=24;\n` +
    `    txt(TX,ty, unram?'\\u2713 unramified (e=1): I trivial,':'ramified (e>1): I nontrivial,',{size:10,fill: unram?'var(--green)':'var(--pink)',weight:600,anchor:'start'}); ty+=14;\n` +
    `    txt(TX,ty, unram?'D \\u2245 Z/'+f+' cyclic, Frob generates it':'Frob generates only D/I',{size:9,fill:'var(--mute)',anchor:'start'});\n` +
    `    out.textContent = 'Fix a prime P above p in a Galois extension K/Q with group G of order n = e\\u00b7f\\u00b7r = '+n+'. The decomposition group D(P) = {\\u03c3\\u2208G : \\u03c3P = P} is the stabiliser of P; by orbit\\u2013stabiliser |D| = |G|/r = ef = '+D+', since G permutes the r = '+r+' primes above p transitively. Each \\u03c3\\u2208D acts on the residue field O_K/P, giving D \\u2192 Gal(F_p^f/F_p) \\u2245 Z/f; its kernel is the inertia group I(P) of order e = '+e+', and the sequence 1\\u2192I\\u2192D\\u2192Z/f\\u21921 is exact. Fixed fields give the tower Q \\u2286 K^D \\u2286 K^I \\u2286 K of degrees r, f, e: p splits into r primes up to K^D, picks up residue degree f (where Frobenius lives) up to K^I, then ramifies with index e up to K. '+(unram?'Here e=1 (unramified): I is trivial, D \\u2245 Z/f is cyclic, and the Frobenius element \\u2014 the preimage of x\\u21a6x^p \\u2014 generates D.':'Here e>1 (ramified): inertia I is nontrivial and Frobenius generates only the quotient D/I.')+' Changing the prime above p conjugates D and Frob, so only the conjugacy class Frob_p \\u2282 G is canonical.';\n` +
    `  }\n` +
    // clear preset highlight when a slider moves the config away from a preset
    `  function clearPresets(){ Array.prototype.forEach.call(presets.querySelectorAll('button'), function(x){ x.classList.remove('active'); x.setAttribute('aria-pressed','false'); }); }\n` +
    `  function onSlide(){ clearPresets(); draw(); }\n` +
    `  sr.addEventListener('input', onSlide); sf.addEventListener('input', onSlide); se.addEventListener('input', onSlide);\n` +
    `  Array.prototype.forEach.call(presets.querySelectorAll('button'), function(b){ b.addEventListener('click', function(){\n` +
    `    var pre=b.getAttribute('data-pre');\n` +
    `    if(pre==='split'){ sr.value='4'; sf.value='1'; se.value='1'; }\n` +
    `    else if(pre==='inert'){ sr.value='1'; sf.value='4'; se.value='1'; }\n` +
    `    else if(pre==='ram'){ sr.value='2'; sf.value='1'; se.value='2'; }\n` +
    `    Array.prototype.forEach.call(presets.querySelectorAll('button'), function(x){ var on=(x===b); x.classList.toggle('active',on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw();\n` +
    `  }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
