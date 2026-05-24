// rg-ricci-curvature widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Ricci as average sectional curvature and as the
// control on geodesic-ball volume on a constant-curvature model: positive K =>
// smaller balls (Ric>0), negative => larger. Ric(v,v)=(n-1)K, S=n(n-1)K.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-k">sectional curvature $K$</label>\n` +
    `    <input type="range" id="${widgetId}-k" min="-1" max="1" value="1" step="0.1">\n` +
    `    <span class="pill" id="${widgetId}-kv">K = 1.0</span>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">dimension $n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="2" max="5" value="3" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nv">n = 3</span>\n` +
    `    <label for="${widgetId}-r">geodesic radius $r$</label>\n` +
    `    <input type="range" id="${widgetId}-r" min="0.3" max="1.4" value="1" step="0.1">\n` +
    `    <span class="pill" id="${widgetId}-rv">r = 1.0</span>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="The geodesic ball compared with the Euclidean ball of the same radius, and the Ricci and scalar curvatures"><title>Ricci curvature controls geodesic-ball volume: positive curvature makes balls smaller than Euclidean, negative makes them larger</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* rg-ricci-curvature widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sk=document.getElementById('${widgetId}-k'), sn=document.getElementById('${widgetId}-n'), sr=document.getElementById('${widgetId}-r');\n` +
    `  var kv=document.getElementById('${widgetId}-kv'), nv=document.getElementById('${widgetId}-nv'), rv=document.getElementById('${widgetId}-rv');\n` +
    `  if(!svg||!out||!sk||!sn||!sr) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  function fmt(x){ var r=Math.round(x*1000)/1000; if(Math.abs(r)<1e-9) r=0; return ''+r; }\n` +
    // s_K(t): the warped radial factor; geodesic n-ball volume ratio to Euclidean via Simpson
    `  function sK(t,K){ if(Math.abs(K)<1e-9) return t; if(K>0){var a=Math.sqrt(K); return Math.sin(a*t)/a;} var b=Math.sqrt(-K); return Math.sinh(b*t)/b; }\n` +
    `  function volRatio(K,n,r){ var N=400,h=r/N,acc=0; for(var i=0;i<=N;i++){ var t=i*h, w=(i===0||i===N)?1:(i%2?4:2); acc+=w*Math.pow(sK(t,K),n-1); } acc*=h/3; return acc/(Math.pow(r,n)/n); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var K=parseFloat(sk.value), n=parseInt(sn.value,10), r=parseFloat(sr.value);\n` +
    `    kv.textContent='K = '+K.toFixed(1); nv.textContent='n = '+n; rv.textContent='r = '+r.toFixed(1);\n` +
    `    var ric=(n-1)*K, S=n*(n-1)*K, ratio=volRatio(K,n,r);\n` +
    // left: euclidean reference (dashed) vs geodesic (solid), area scaled by ratio
    `    var cx=160, cy=150, RE=82, RG=RE*Math.sqrt(ratio);\n` +
    `    svg.appendChild(mk('circle',{cx:cx,cy:cy,r:RE,fill:'none',stroke:'var(--mute)','stroke-width':1.4,'stroke-dasharray':'5 3'}));\n` +
    `    var gcol = K>1e-9?'var(--yellow)':(K<-1e-9?'var(--cyan)':'var(--green)');\n` +
    `    svg.appendChild(mk('circle',{cx:cx,cy:cy,r:RG,fill:gcol,'fill-opacity':0.16,stroke:gcol,'stroke-width':2}));\n` +
    `    txt(cx, cy-RE-10, 'Euclidean ball B_r', {size:10, fill:'var(--mute)', anchor:'middle'});\n` +
    `    txt(cx, cy+RE+18, 'geodesic ball B_r', {size:10, fill:gcol, anchor:'middle'});\n` +
    `    txt(cx, cy+RE+32, '(disk area = n-ball volume ratio)', {size:8, fill:'var(--mute)', anchor:'middle'});\n` +
    // right panel
    `    var TX=312, ty=44;\n` +
    `    txt(TX, ty, 'constant curvature K = '+K.toFixed(1), {size:11, fill:gcol, weight:600}); ty+=24;\n` +
    `    txt(TX, ty, 'Ric(v,v) = (n\\u22121)K = '+fmt(ric), {size:12, fill:'var(--ink)', weight:600}); ty+=16;\n` +
    `    txt(TX, ty, '(average of the n\\u22121 sectional', {size:8, fill:'var(--mute)'}); ty+=11;\n` +
    `    txt(TX, ty, ' curvatures of 2-planes through v)', {size:8, fill:'var(--mute)'}); ty+=22;\n` +
    `    txt(TX, ty, 'scalar S = n(n\\u22121)K = '+fmt(S), {size:12, fill:'var(--ink)', weight:600}); ty+=22;\n` +
    `    txt(TX, ty, 'Einstein: Ric = \\u03bb g,  \\u03bb = S/n = '+fmt(ric), {size:11, fill:'var(--violet)'}); ty+=24;\n` +
    `    txt(TX, ty, 'vol(geodesic B_r) / vol(Euclidean)', {size:10, fill:'var(--mute)'}); ty+=16;\n` +
    `    txt(TX, ty, '= '+fmt(ratio)+'  '+(ratio<0.999?'(smaller \\u2014 Ric>0)':(ratio>1.001?'(larger \\u2014 Ric<0)':'(equal \\u2014 flat)')), {size:12, fill:gcol, weight:600}); ty+=24;\n` +
    `    txt(TX, ty, '\\u221adet g \\u2248 1 \\u2212 (1/6)Ric\\u00b7x\\u00b2 = 1 \\u2212 '+fmt(ric/6)+' r\\u00b2', {size:9, fill:'var(--mute)'});\n` +
    `    out.textContent = 'On a model space of constant sectional curvature K='+K.toFixed(1)+' in dimension n='+n+', every 2-plane has curvature K, so the Ricci curvature in a unit direction v is the sum of the n\\u22121 sectional curvatures of planes through v: Ric(v,v) = (n\\u22121)K = '+fmt(ric)+'. It is the directional AVERAGE that the full Riemann tensor refines. Tracing again gives the scalar curvature S = n(n\\u22121)K = '+fmt(S)+'. Because Ric = \\u03bb g with \\u03bb = (n\\u22121)K, every constant-curvature space is Einstein (\\u03bb = S/n). Geometrically, in geodesic normal coordinates \\u221adet g = 1 \\u2212 (1/6)Ric_{ij}x\\u2071x\\u02b2 + O(|x|\\u00b3), so positive Ricci shrinks the metric volume element and negative Ricci grows it: the geodesic ball of radius r='+r.toFixed(1)+' here has volume '+fmt(ratio)+'\\u00d7 the Euclidean ball '+(ratio<0.999?'(smaller)':(ratio>1.001?'(larger)':'(equal)'))+'. This Ricci\\u2013volume link is exactly what powers Bishop\\u2013Gromov comparison and Bonnet\\u2013Myers; Ricci-flat (Ric=0) is the source-free Einstein equation of general relativity.';\n` +
    `  }\n` +
    `  sk.addEventListener('input', draw); sn.addEventListener('input', draw); sr.addEventListener('input', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
