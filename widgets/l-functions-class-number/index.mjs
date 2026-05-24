// l-functions-class-number widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The analytic class number formula
// L(1, chi_d) = 2 pi h / (w sqrt|d|) for imaginary quadratic fields, with
// chi_d the Kronecker character and L summed as a Dirichlet series.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const btn = (k, lab, on) =>
    `<button type="button" data-k="${k}" class="${on ? 'active' : ''}" aria-pressed="${on ? 'true' : 'false'}">${lab}</button>`;
  const ds = [[-3, true], [-4, false], [-7, false], [-8, false], [-11, false], [-15, false], [-20, false], [-23, false], [-24, false], [-47, false]];
  const btns = ds.map(([d, on]) => btn(String(d), 'd = −' + (-d), on)).join('\n    ');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-btns">\n    ${btns}\n  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 320" width="560" height="320" role="img" aria-label="The Kronecker character of an imaginary quadratic field and the class number formula relating its L-value to the class number"><title>The class number formula L(1, chi_d) = 2 pi h / (w sqrt|d|): the Dirichlet L-series equals the closed form, reading off the class number h</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* l-functions-class-number widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  function legendre(a,p){ a=((a%p)+p)%p; if(a===0) return 0; var r=1,e=(p-1)/2,b=a; while(e>0){ if(e&1) r=(r*b)%p; b=(b*b)%p; e>>=1; } return r===1?1:-1; }\n` +
    `  function kron2(a){ a=((a%8)+8)%8; if(a%2===0) return 0; return (a===1||a===7)?1:-1; }\n` +
    `  function kronecker(a,n){ if(n===0) return (a===1||a===-1)?1:0; var s=1; while(n%2===0){ n/=2; s*=kron2(a); } var m=n, prod=1; for(var p=3;p*p<=m;p+=2){ while(m%p===0){ m/=p; prod*=legendre(a,p); } } if(m>1) prod*=legendre(a,m); return s*prod; }\n` +
    `  var FIELD={ '-3':{h:1,w:6}, '-4':{h:1,w:4}, '-7':{h:1,w:2}, '-8':{h:1,w:2}, '-11':{h:1,w:2}, '-15':{h:2,w:2}, '-20':{h:2,w:2}, '-23':{h:3,w:2}, '-24':{h:2,w:2}, '-47':{h:5,w:2} };\n` +
    `  var curKey='-3';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var d=parseInt(curKey,10), ad=-d, F=FIELD[curKey], h=F.h, w=F.w;\n` +
    `    var chi=[]; for(var r=0;r<ad;r++) chi.push(kronecker(d,r));\n` +
    `    var Lser=0; for(var n=1;n<=40000;n++){ var c=chi[n%ad]; if(c) Lser+=c/n; }\n` +
    `    var formula=2*Math.PI*h/(w*Math.sqrt(ad));\n` +
    `    var hRead=Math.round(Lser*w*Math.sqrt(ad)/(2*Math.PI));\n` +
    `    // character strip\n` +
    `    txt(20, 40, 'Kronecker character \\u03c7_d  (period |d| = '+ad+'):', {size:11, fill:'var(--mute)'});\n` +
    `    var sx0=24, cw=Math.min(22, 480/ad), cy=52, ch=22;\n` +
    `    for(r=0;r<ad;r++){ var x=sx0+r*cw, c=chi[r]; var col=c>0?'var(--green)':(c<0?'var(--pink)':'var(--line)');\n` +
    `      svg.appendChild(mk('rect',{x:x.toFixed(1), y:cy, width:(cw-1).toFixed(1), height:ch, fill:col, 'fill-opacity':c?0.8:0.3}));\n` +
    `      if(ad<=24){ txt(x+cw/2, cy+ch+10, ''+r, {anchor:'middle', size:7, fill:'var(--mute)'}); txt(x+cw/2, cy+14, c>0?'+':(c<0?'\\u2212':'0'), {anchor:'middle', size:9, fill:'var(--bg)', weight:700}); } }\n` +
    `    txt(sx0, cy+ch+(ad<=24?24:14), '\\u03c7_d(n) = (d / n) Kronecker symbol; +1 green, \\u22121 pink, 0 grey \\u2014 a real character mod |d|', {size:8, fill:'var(--mute)'});\n` +
    `    // L-value comparison\n` +
    `    var ly=148;\n` +
    `    txt(20, ly, 'Dirichlet L-series      L(1, \\u03c7_d) = \\u03a3 \\u03c7_d(n)/n  =  '+Lser.toFixed(5), {size:12, fill:'var(--cyan)', weight:700}); ly+=24;\n` +
    `    txt(20, ly, 'class number formula   2\\u03c0h / (w\\u221a|d|)  =  2\\u03c0\\u00b7'+h+' / ('+w+'\\u00b7'+Math.sqrt(ad).toFixed(3)+')  =  '+formula.toFixed(5), {size:12, fill:'var(--yellow)', weight:700}); ly+=24;\n` +
    `    var match=Math.abs(Lser-formula)<0.02;\n` +
    `    txt(20, ly, (match?'\\u2713 they agree':'\\u2248')+'   \\u21d2   class number  h = round( L(1,\\u03c7_d)\\u00b7w\\u221a|d| / 2\\u03c0 ) = '+hRead+'   (true h = '+h+')', {size:12, fill:'var(--green)', weight:700}); ly+=10;\n` +
    `    // bar comparison\n` +
    `    var by=ly+18, bx0=120, bxmax=470, vmax=2.6; function BW(v){ return (Math.min(v,vmax)/vmax)*(bxmax-bx0); }\n` +
    `    txt(bx0-6, by+9, 'series', {anchor:'end', size:9, fill:'var(--cyan)'}); svg.appendChild(mk('rect',{x:bx0,y:by,width:BW(Lser).toFixed(1),height:12,fill:'var(--cyan)','fill-opacity':0.8}));\n` +
    `    txt(bx0-6, by+27, 'formula', {anchor:'end', size:9, fill:'var(--yellow)'}); svg.appendChild(mk('rect',{x:bx0,y:by+18,width:BW(formula).toFixed(1),height:12,fill:'var(--yellow)','fill-opacity':0.8}));\n` +
    `    out.textContent='Once an L-function is continued to \\u2102, its values carry deep arithmetic. The cleanest case is an imaginary quadratic field K = \\u211a(\\u221ad) with d < 0 a fundamental discriminant, cut out by the Kronecker character \\u03c7_d (a real Dirichlet character mod |d|, shown as the strip). The ANALYTIC CLASS NUMBER FORMULA says its L-value at s = 1 is L(1, \\u03c7_d) = 2\\u03c0h / (w\\u221a|d|), where h is the CLASS NUMBER of K and w the number of roots of unity in K (the regulator R = 1 here, since the unit group is finite). For d = '+d+': summing the slowly-converging Dirichlet series gives L(1, \\u03c7_d) = '+Lser.toFixed(5)+', the closed form 2\\u03c0\\u00b7'+h+'/('+w+'\\u221a'+ad+') = '+formula.toFixed(5)+' \\u2014 they agree, and inverting reads off h = '+hRead+'. This is the SHAPE every special value takes: a transcendental PERIOD (here 2\\u03c0/\\u221a|d|) times an ARITHMETIC invariant (the integer h). The same template runs through Euler\\u2019s \\u03b6(2k) = (\\u22121)^{k+1}(2\\u03c0)^{2k}B_{2k}/(2\\u00b7(2k)!) [period \\u03c0^{2k}, arithmetic B_{2k}] and \\u03b6(1\\u2212n) = \\u2212B_n/n [pure rational], up to the Birch\\u2013Swinnerton-Dyer conjecture, where L^{(r)}(E,1) packages the rank, regulator, and Tate\\u2013Shafarevich group of an elliptic curve.';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; curKey=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
