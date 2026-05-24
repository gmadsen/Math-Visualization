// ant-waring-finiteness widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Hilbert-Waring finiteness: the minimum number of
// k-th powers needed for each n<=100 (by DP) stays bounded by g(k) however large
// n is -- the bound Hilbert (1909) proved finite for every k.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-kbox" role="group" aria-label="exponent k">\n` +
    `    <span class="note">exponent $k$:</span>\n` +
    `    <button type="button" data-k="2" class="active" aria-pressed="true">squares</button>\n` +
    `    <button type="button" data-k="3" aria-pressed="false">cubes</button>\n` +
    `    <button type="button" data-k="4" aria-pressed="false">4th powers</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="Minimum number of k-th powers needed for each n up to 100, bounded by g(k)"><title>For every n, the minimum number of k-th powers summing to n stays at or below g(k) — a finite bound (Hilbert–Waring)</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* ant-waring-finiteness widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var kbox=document.getElementById('${widgetId}-kbox');\n` +
    `  if(!svg||!out||!kbox) return;\n` +
    `  var NS='http://www.w3.org/2000/svg', N=100;\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var SUP=['\\u2070','\\u00b9','\\u00b2','\\u00b3','\\u2074','\\u2075'];\n` +
    `  var kk=2;\n` +
    `  function gk(k){ return Math.pow(2,k)+Math.floor(Math.pow(1.5,k))-2; }\n` +
    // DP: min #k-th powers for each n; keep a back-pointer (the power subtracted) to recover a decomposition
    `  function solve(k){ var m=new Array(N+1).fill(9999), back=new Array(N+1).fill(0); m[0]=0; var pw=[]; for(var b=1;Math.pow(b,k)<=N;b++) pw.push({b:b, v:Math.pow(b,k)});\n` +
    `    for(var n=1;n<=N;n++){ for(var j=0;j<pw.length;j++){ if(pw[j].v>n) break; if(m[n-pw[j].v]+1<m[n]){ m[n]=m[n-pw[j].v]+1; back[n]=pw[j].b; } } } return {m:m, back:back}; }\n` +
    `  function decomp(n,k,back){ var cnt={}; while(n>0){ var b=back[n]; cnt[b]=(cnt[b]||0)+1; n-=Math.pow(b,k); } return cnt; }\n` +
    `  function decompStr(cnt,k){ var parts=[]; Object.keys(cnt).map(Number).sort(function(a,b){return b-a;}).forEach(function(b){ var c=cnt[b]; parts.push((c>1?c+'\\u00b7':'')+b+(SUP[k]||('^'+k))); }); return parts.join(' + '); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var res=solve(kk), m=res.m, g=gk(kk);\n` +
    `    var mx=0, arg=1; for(var n=1;n<=N;n++){ if(m[n]>mx){ mx=m[n]; arg=n; } }\n` +
    `    var PX0=46, PX1=400, PYB=250, PY0=44, ymax=g+1;\n` +
    `    function bx(n){ return PX0+(n-1)/(N-1)*(PX1-PX0); }\n` +
    `    function by(v){ return PYB-(v/ymax)*(PYB-PY0); }\n` +
    `    var bw=(PX1-PX0)/N-0.7;\n` +
    // axes
    `    svg.appendChild(mk('line',{x1:PX0,y1:PYB,x2:PX1,y2:PYB,stroke:'var(--line)','stroke-width':1}));\n` +
    `    svg.appendChild(mk('line',{x1:PX0,y1:PY0,x2:PX0,y2:PYB,stroke:'var(--line)','stroke-width':1}));\n` +
    `    for(var gy=0;gy<=g;gy+=(g>10?5:1)){ txt(PX0-6,by(gy)+3,''+gy,{size:8,fill:'var(--mute)',anchor:'end'}); }\n` +
    `    txt((PX0+PX1)/2,PYB+30,'n  (1 to 100)',{size:10,fill:'var(--mute)',anchor:'middle'});\n` +
    `    txt(PX0-30,PY0-8,'# of '+(kk===2?'squares':(kk===3?'cubes':'4th powers')),{size:9,fill:'var(--mute)'});\n` +
    // bars
    `    for(n=1;n<=N;n++){ var hh=PYB-by(m[n]); var isMax=(m[n]===mx); svg.appendChild(mk('rect',{x:bx(n),y:by(m[n]),width:bw,height:hh,fill:isMax?'var(--pink)':'var(--cyan)','fill-opacity':isMax?0.95:0.5})); }\n` +
    // g(k) line
    `    svg.appendChild(mk('line',{x1:PX0,y1:by(g),x2:PX1,y2:by(g),stroke:'var(--yellow)','stroke-width':1.5,'stroke-dasharray':'5 3'}));\n` +
    `    txt(PX0+6,by(g)-5,'g('+kk+') = '+g+'  (finite bound)',{size:10,fill:'var(--yellow)',weight:600});\n` +
    // panel
    `    var cnt=decomp(arg,kk,res.back);\n` +
    `    var TX=414, ty=44;\n` +
    `    txt(TX,ty,'g('+kk+') = 2'+(SUP[kk])+' + \\u230a(3/2)'+(SUP[kk])+'\\u230b \\u2212 2',{size:10,fill:'var(--mute)'}); ty+=16;\n` +
    `    txt(TX,ty,'= '+g,{size:15,fill:'var(--yellow)',weight:700}); ty+=26;\n` +
    `    txt(TX,ty,'every n needs \\u2264 '+g+' '+(kk===2?'squares':(kk===3?'cubes':'4th powers')),{size:10,fill:'var(--ink)'}); ty+=14;\n` +
    `    txt(TX,ty,'\\u2014 a bound independent of n',{size:9,fill:'var(--mute)'}); ty+=24;\n` +
    `    txt(TX,ty,'smallest n needing all '+mx+': n = '+arg,{size:10,fill:'var(--pink)',weight:600}); ty+=16;\n` +
    `    txt(TX,ty,arg+' = '+decompStr(cnt,kk),{size:9,fill:'var(--pink)'}); ty+=24;\n` +
    `    txt(TX,ty,'Hilbert (1909): g(k) finite',{size:10,fill:'var(--green)',weight:600}); ty+=14;\n` +
    `    txt(TX,ty,'for EVERY k.',{size:10,fill:'var(--green)'});\n` +
    `    out.textContent = 'Waring asked: is there, for each exponent k, a single number g(k) such that EVERY positive integer is a sum of at most g(k) k-th powers? The bars show the minimum number of '+(kk===2?'squares':(kk===3?'cubes':'fourth powers'))+' needed for each n from 1 to 100 (computed by dynamic programming). They rise and fall but never exceed the yellow line g('+kk+') = '+g+' \\u2014 and crucially that bound does NOT grow as n grows. The smallest n that needs all '+mx+' is '+arg+' = '+decompStr(cnt,kk)+'. The formula g(k)=2\\u1d4f+\\u230a(3/2)\\u1d4f\\u230b\\u22122 gives g(2)=4 (Lagrange\\u2019s four-square theorem), g(3)=9, g(4)=19. David Hilbert (1909) proved g(k) is FINITE for every k \\u2014 the first proof, via a purely algebraic combinatorial identity expressing a power of a sum of squares as a sum of 2k-th powers of linear forms, with no estimate of the size of g(k). The Hardy\\u2013Littlewood circle method later recovered the asymptotics and the related bound G(k) (the value for all sufficiently large n).';\n` +
    `  }\n` +
    `  Array.prototype.forEach.call(kbox.querySelectorAll('button'), function(b){ b.addEventListener('click', function(){\n` +
    `    kk=parseInt(b.getAttribute('data-k'),10);\n` +
    `    Array.prototype.forEach.call(kbox.querySelectorAll('button'), function(x){ var on=(x===b); x.classList.toggle('active',on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw();\n` +
    `  }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
