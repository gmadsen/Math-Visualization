// padic-newton-polygon widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The Newton polygon of f over Q_p: plot (i, v_p(a_i)),
// take the lower convex hull; segment slopes (negated) = root valuations, lengths
// = root counts. Single slope -1/n => Eisenstein, irreducible.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-presets" role="group" aria-label="preset polynomial">\n` +
    `    <button type="button" data-pre="cubic" class="active" aria-pressed="true">$x^3-x-p$</button>\n` +
    `    <button type="button" data-pre="eis" aria-pressed="false">Eisenstein</button>\n` +
    `    <button type="button" data-pre="two" aria-pressed="false">two slopes</button>\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-n">degree $n$</label>\n` +
    `    <input type="range" id="${widgetId}-n" min="2" max="5" value="3" step="1">\n` +
    `    <span class="pill" id="${widgetId}-nv">n = 3</span>\n` +
    `  </div>\n` +
    `  <div class="row"><span class="note">valuation $v_p(a_i)$ &mdash; click a chip to cycle (endpoints $a_0,a_n\\ne0$):</span></div>\n` +
    `  <div class="row" id="${widgetId}-chips" style="display:flex;gap:.35rem;flex-wrap:wrap"></div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="The points (i, valuation of a_i) and the lower convex hull whose slopes give the root valuations"><title>Newton polygon: the lower convex hull of (i, v_p(a_i)); each segment's negated slope is a root valuation and its horizontal length counts those roots</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* padic-newton-polygon widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var sn=document.getElementById('${widgetId}-n'), nv=document.getElementById('${widgetId}-nv');\n` +
    `  var chips=document.getElementById('${widgetId}-chips'), presets=document.getElementById('${widgetId}-presets');\n` +
    `  if(!svg||!out||!sn||!chips||!presets) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var INF=Infinity;\n` +
    `  var val=[1,0,INF,0];\n` +  // valuations v_p(a_i), Infinity means a_i=0; default x^3-x-p
    `  var CYC=[0,1,2,3,INF];\n` +
    `  function gcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ var t=b; b=a%b; a=t; } return a; }\n` +
    `  function lowerHull(pts){ var h=[]; for(var k=0;k<pts.length;k++){ while(h.length>=2){ var a=h[h.length-2],b=h[h.length-1],c=pts[k]; var cr=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]); if(cr<=0) h.pop(); else break; } h.push(pts[k]); } return h; }\n` +
    `  function buildChips(){\n` +
    `    var n=parseInt(sn.value,10); chips.innerHTML='';\n` +
    `    for(var i=0;i<=n;i++){ (function(i){\n` +
    `      var endpoint=(i===0||i===n);\n` +
    `      var b=document.createElement('button'); b.type='button';\n` +
    `      var fin=isFinite(val[i]);\n` +
    `      b.style.cssText='padding:.12rem .5rem;border-radius:6px;background:var(--panel2);cursor:pointer;font-size:12px;border:1px solid '+(fin?'var(--cyan)':'var(--line)')+';color:'+(fin?'var(--cyan)':'var(--mute)');\n` +
    `      b.innerHTML = fin ? ('v(a<sub>'+i+'</sub>)='+val[i]) : ('a<sub>'+i+'</sub>=0');\n` +
    `      b.setAttribute('aria-label','cycle valuation of coefficient a'+i);\n` +
    `      b.addEventListener('click', function(){\n` +
    `        var cur=CYC.indexOf(val[i]); var nx=CYC[(cur+1)%CYC.length];\n` +
    `        if(endpoint && nx===INF) nx=CYC[(cur+2)%CYC.length];\n` +  // skip Infinity on endpoints
    `        val[i]=nx; buildChips(); draw();\n` +
    `      });\n` +
    `      chips.appendChild(b);\n` +
    `    })(i); }\n` +
    `  }\n` +
    `  function frac(num,den){ var g=gcd(num,den)||1; var nn=num/g, dd=den/g; return dd===1 ? (''+nn) : (nn+'/'+dd); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var n=parseInt(sn.value,10); nv.textContent='n = '+n;\n` +
    `    var pts=[], maxv=2; for(var i=0;i<=n;i++){ if(isFinite(val[i])){ pts.push([i,val[i]]); if(val[i]>maxv) maxv=val[i]; } }\n` +
    `    var PX0=56, PX1=400, PY0=44, PYB=246;\n` +
    `    function X(i){ return PX0 + i/n*(PX1-PX0); }\n` +
    `    function Y(v){ return PYB - v/maxv*(PYB-PY0); }\n` +
    // axes + grid
    `    svg.appendChild(mk('line',{x1:PX0,y1:PYB,x2:PX1,y2:PYB,stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:PY0,x2:PX0,y2:PYB,stroke:'var(--line)','stroke-width':1}));\n` +
    `    for(var gi=0;gi<=n;gi++){ txt(X(gi), PYB+16, ''+gi, {size:9, fill:'var(--mute)', anchor:'middle'}); }\n` +
    `    for(var gv=0;gv<=maxv;gv++){ txt(PX0-8, Y(gv)+3, ''+gv, {size:9, fill:'var(--mute)', anchor:'end'}); svg.appendChild(mk('line',{x1:PX0-3,y1:Y(gv),x2:PX0,y2:Y(gv),stroke:'var(--line)','stroke-width':1})); }\n` +
    `    txt((PX0+PX1)/2, PYB+30, 'i  (coefficient index)', {size:10, fill:'var(--mute)', anchor:'middle'});\n` +
    `    txt(PX0-30, PY0-8, 'v_p(a_i)', {size:10, fill:'var(--mute)', anchor:'start'});\n` +
    // all finite points
    `    for(i=0;i<=n;i++){ if(isFinite(val[i])){ svg.appendChild(mk('circle',{cx:X(i),cy:Y(val[i]),r:3.5,fill:'var(--mute)'})); } else { txt(X(i), PY0-2, '\\u221e', {size:11, fill:'var(--line)', anchor:'middle'}); } }\n` +
    // lower hull
    `    var hull=lowerHull(pts);\n` +
    `    var d=''; for(var hI=0;hI<hull.length;hI++){ d+=(hI?'L ':'M ')+X(hull[hI][0])+' '+Y(hull[hI][1])+' '; }\n` +
    `    svg.appendChild(mk('path',{d:d, fill:'none', stroke:'var(--cyan)','stroke-width':2.4}));\n` +
    `    for(hI=0;hI<hull.length;hI++){ svg.appendChild(mk('circle',{cx:X(hull[hI][0]),cy:Y(hull[hI][1]),r:5,fill:'var(--yellow)',stroke:'var(--bg)','stroke-width':1})); }\n` +
    // segments → root valuations
    `    var segs=[]; for(var j=0;j+1<hull.length;j++){ var dx=hull[j+1][0]-hull[j][0], dy=hull[j+1][1]-hull[j][1]; segs.push({len:dx, drop:-dy}); var mx=(X(hull[j][0])+X(hull[j+1][0]))/2, my=(Y(hull[j][1])+Y(hull[j+1][1]))/2; var slbl=(dy===0)?'0':('\\u2212'+frac(-dy,dx)); txt(mx, my-8, 'slope '+slbl, {size:9, fill:'var(--cyan)', anchor:'middle'}); }\n` +
    // panel
    `    var TX=418, ty=52;\n` +
    `    txt(TX, ty, 'roots in Q\\u0304_p:', {size:10, fill:'var(--mute)'}); ty+=18;\n` +
    `    segs.forEach(function(s){ txt(TX, ty, '\\u2022 '+s.len+' of val '+frac(s.drop,s.len), {size:11, fill:'var(--yellow)'}); ty+=16; });\n` +
    `    ty+=8; txt(TX, ty, 'total: '+n+' roots', {size:10, fill:'var(--mute)'});\n` +
    // irreducibility note (single segment, slope -h/n with gcd(h,n)=1, h/n not integer)
    `    var note='', eisen=false;\n` +
    `    if(segs.length===1){ var s0=segs[0]; if(s0.len===n && s0.drop>0 && (s0.drop % n !==0) && gcd(s0.drop,n)===1){ eisen=true; note='Single slope \\u2212'+frac(s0.drop,n)+' with gcd('+s0.drop+','+n+')=1: all roots share valuation '+frac(s0.drop,n)+' \\u2209 \\u2124, so f is irreducible over Q_p (Eisenstein-type).'; } }\n` +
    `    out.textContent = 'Plot (i, v_p(a_i)) for each coefficient and take the LOWER convex hull (cyan, vertices yellow): that is the Newton polygon of f. Each segment of (geometric) slope \\u2212m and horizontal length \\u2113 corresponds to exactly \\u2113 roots of f in the algebraic closure of valuation m \\u2014 the slopes read off the root valuations without solving f. '+(segs.map(function(s){return s.len+' root'+(s.len===1?'':'s')+' of valuation '+frac(s.drop,s.len);}).join('; '))+'. '+(eisen?note:'A single segment from (0,h) to (n,0) of slope \\u22121/n gives the Eisenstein irreducibility test.')+' Newton polygons factor f over Q_p by valuation strata and feed the e,f ramification computation in the next section.';\n` +
    `  }\n` +
    `  function applyPreset(p){\n` +
    `    if(p==='cubic'){ sn.value='3'; val=[1,0,INF,0]; }\n` +
    `    else if(p==='eis'){ sn.value='4'; val=[1,1,2,1,0]; }\n` +
    `    else if(p==='two'){ sn.value='4'; val=[2,1,0,0,0]; }\n` +
    `    buildChips(); draw();\n` +
    `  }\n` +
    `  Array.prototype.forEach.call(presets.querySelectorAll('button'), function(b){ b.addEventListener('click', function(){\n` +
    `    Array.prototype.forEach.call(presets.querySelectorAll('button'), function(x){ var on=(x===b); x.classList.toggle('active',on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    applyPreset(b.getAttribute('data-pre'));\n` +
    `  }); });\n` +
    `  sn.addEventListener('input', function(){ var n=parseInt(sn.value,10); while(val.length<=n) val.push(0); val=val.slice(0,n+1); if(!isFinite(val[0])) val[0]=1; if(!isFinite(val[n])) val[n]=0; buildChips(); draw(); });\n` +
    `  buildChips(); draw();\n` +
    `})();\n` +
    `</script>`
  );
}
