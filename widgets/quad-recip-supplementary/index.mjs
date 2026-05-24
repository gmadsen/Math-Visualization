// quad-recip-supplementary widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The two supplementary laws: (−1/p)=(−1)^((p−1)/2)
// (−1 a QR iff p≡1 mod 4) and (2/p)=(−1)^((p²−1)/8) (2 a QR iff p≡±1 mod 8),
// checked against the actual squares mod p, with period-4/period-8 strips.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-p">odd prime $p$</label>\n` +
    `    <input type="range" id="${widgetId}-p" min="0" max="13" value="4" step="1">\n` +
    `    <span class="pill" id="${widgetId}-pv">p = 13</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 580 320" width="580" height="320" role="img" aria-label="The first and second supplementary laws of quadratic reciprocity for the chosen prime, with period strips"><title>Supplementary laws: (-1/p) depends on p mod 4, (2/p) on p mod 8</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* quad-recip-supplementary widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var PR=[3,5,7,11,13,17,19,23,29,31,37,41,43,47];\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sp=document.getElementById('${widgetId}-p'), pv=document.getElementById('${widgetId}-pv');\n` +
    `  if(!svg||!out||!sp||!pv) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    // squares mod p as a set
    `  function squares(p){ var s={}; for(var x=1;x<p;x++) s[(x*x)%p]=true; return s; }\n` +
    `  function neg1law(p){ return (p%4===1)?1:-1; }\n` +
    `  function twolaw(p){ var r=p%8; return (r===1||r===7)?1:-1; }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var idx=parseInt(sp.value,10), p=PR[idx]; pv.textContent='p = '+p;\n` +
    `    var sq=squares(p), s1=neg1law(p), s2=twolaw(p);\n` +
    `    var has_n1=!!sq[(p-1)%p], has_2=!!sq[2%p];\n` +
    // first supplement panel
    `    txt(36, 44, 'First supplement \\u2014 (\\u22121 / p)', {size:13, fill:'var(--ink)', weight:700});\n` +
    `    txt(36, 68, 'p mod 4 = '+(p%4), {size:12, fill:'var(--cyan)'});\n` +
    `    txt(36, 88, '(\\u22121/p) = (\\u22121)^((p\\u22121)/2) = '+(s1>0?'+1':'\\u22121'), {size:12, fill:'var(--yellow)', weight:600});\n` +
    `    txt(36, 110, (s1>0?'\\u22121 IS a QR mod p   (p \\u2261 1 mod 4)':'\\u22121 is NOT a QR mod p   (p \\u2261 3 mod 4)'), {size:11, fill:s1>0?'var(--green)':'var(--pink)'});\n` +
    `    svg.appendChild(mk('text',{x:36,y:130,'font-size':10,fill:'var(--mute)'},'check: \\u22121\\u2261'+(p-1)+' '+(has_n1?'IS':'is not')+' among the squares mod p  '+(((s1>0)===has_n1)?'\\u2713':'\\u2717')));\n` +
    // second supplement panel
    `    txt(310, 44, 'Second supplement \\u2014 (2 / p)', {size:13, fill:'var(--ink)', weight:700});\n` +
    `    txt(310, 68, 'p mod 8 = '+(p%8), {size:12, fill:'var(--cyan)'});\n` +
    `    txt(310, 88, '(2/p) = (\\u22121)^((p\\u00b2\\u22121)/8) = '+(s2>0?'+1':'\\u22121'), {size:12, fill:'var(--yellow)', weight:600});\n` +
    `    txt(310, 110, (s2>0?'2 IS a QR mod p   (p \\u2261 \\u00b11 mod 8)':'2 is NOT a QR mod p   (p \\u2261 \\u00b13 mod 8)'), {size:11, fill:s2>0?'var(--green)':'var(--pink)'});\n` +
    `    svg.appendChild(mk('text',{x:310,y:130,'font-size':10,fill:'var(--mute)'},'check: 2 '+(has_2?'IS':'is not')+' among the squares mod p  '+(((s2>0)===has_2)?'\\u2713':'\\u2717')));\n` +
    // period strips
    `    function strip(y, title, fn){ txt(36, y-8, title, {size:11, fill:'var(--mute)'});\n` +
    `      var x0=36, cw=Math.min(36,(508)/PR.length);\n` +
    `      PR.forEach(function(q,i){ var sgn=fn(q), on=(q===p); var cx=x0+i*cw;\n` +
    `        svg.appendChild(mk('rect',{x:cx,y:y,width:cw-3,height:24,rx:3,fill:sgn>0?'var(--green)':'var(--pink)','fill-opacity':on?0.5:0.18,stroke:on?'var(--ink)':'none','stroke-width':on?1.4:0}));\n` +
    `        txt(cx+(cw-3)/2, y+16, ''+q, {size:9, fill:'var(--ink)', anchor:'middle'}); }); }\n` +
    `    strip(180, 'p \\u21a6 (\\u22121/p):  green +1 (p\\u22611 mod 4), pink \\u22121 (p\\u22613 mod 4)', neg1law);\n` +
    `    strip(238, 'p \\u21a6 (2/p):  green +1 (p\\u2261\\u00b11 mod 8), pink \\u22121 (p\\u2261\\u00b13 mod 8)', twolaw);\n` +
    `    txt(36, 292, 'selected prime is outlined', {size:9, fill:'var(--mute)', italic:true});\n` +
    `    out.textContent = 'Any Legendre symbol factors through (\\u22121/p), (2/p), and odd-prime symbols (handled by reciprocity). The two SUPPLEMENTS settle the first two by a glance at p mod 8. For p = '+p+': (\\u22121/p) = '+(s1>0?'+1':'\\u22121')+' because p \\u2261 '+(p%4)+' (mod 4) \\u2014 so \\u22121 '+(s1>0?'is':'is not')+' a square mod '+p+'; and (2/p) = '+(s2>0?'+1':'\\u22121')+' because p \\u2261 '+(p%8)+' (mod 8) \\u2014 so 2 '+(s2>0?'is':'is not')+' a square mod '+p+'. Both match a direct scan of the squares mod p (the small checks). The first supplement has period 4 in p, the second has period 8 \\u2014 visible as the repeating colour patterns in the strips.';\n` +
    `  }\n` +
    `  sp.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
