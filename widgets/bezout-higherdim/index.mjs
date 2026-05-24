// bezout-higherdim widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Bézout in ℙⁿ: n hypersurfaces of degrees d₁,…,dₙ
// meeting properly in a zero-dimensional set contain ∏dᵢ points. Pick n and each
// degree; the widget shows the product and the equivalent Chow-ring computation
// [H₁]···[Hₙ] = (∏dᵢ)·Hⁿ = (∏dᵢ)·[pt] in A*(ℙⁿ)=ℤ[H]/(Hⁿ⁺¹), recovering the
// classical ℙ² statement as the case n=2.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const maxN = Number.isInteger(params.maxN) ? params.maxN : 4;
  const maxDeg = Number.isInteger(params.maxDegree) ? params.maxDegree : 4;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  let nBtns = '';
  for (let n = 2; n <= maxN; n++) nBtns += `    <button type="button" id="${widgetId}-n${n}">${n}</button>\n`;
  let degRows = '';
  for (let i = 1; i <= maxN; i++) {
    degRows +=
      `  <div class="row" id="${widgetId}-drow${i}">\n` +
      `    <label for="${widgetId}-d${i}">$d_{${i}}$</label>\n` +
      `    <input type="range" id="${widgetId}-d${i}" min="1" max="${maxDeg}" value="2" step="1">\n` +
      `    <span class="pill" id="${widgetId}-d${i}v">d${'₁₂₃₄₅'.charAt(i - 1)} = 2</span>\n` +
      `  </div>\n`;
  }
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">ambient $\\mathbb{P}^n$, $n =$</span>\n` +
    nBtns +
    `  </div>\n` +
    degRows +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 340" width="560" height="340" role="img" aria-label="Bezout in projective n-space: the product of the hypersurface degrees"><title>Bezout in P^n: n hypersurfaces of degrees d_1..d_n meet in the product d_1...d_n points, computed in the Chow ring as the product of hyperplane classes</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  const maxN = Number.isInteger(params.maxN) ? params.maxN : 4;
  const maxDeg = Number.isInteger(params.maxDegree) ? params.maxDegree : 4;
  return (
    `<script>\n` +
    `/* bezout-higherdim widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var MAXN=${maxN}, MAXDEG=${maxDeg};\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var nB=[]; for(var n=2;n<=MAXN;n++){ nB.push(document.getElementById('${widgetId}-n'+n)); }\n` +
    `  var dS=[], dV=[], dRow=[];\n` +
    `  for(var i=1;i<=MAXN;i++){ dS.push(document.getElementById('${widgetId}-d'+i)); dV.push(document.getElementById('${widgetId}-d'+i+'v')); dRow.push(document.getElementById('${widgetId}-drow'+i)); }\n` +
    `  if(!svg||!out||nB.some(function(b){return !b;})||dS.some(function(b){return !b;})) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    `  var N=Math.min(3, MAXN);\n` + // default 3 hypersurfaces in P^3, clamped to the configured maxN

    `  function cls(d){ return d===1 ? 'H' : d+'H'; }\n` + // a degree-1 hypersurface (hyperplane) has class H, not 1H
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    nB.forEach(function(b,i){ var on=(i+2===N); b.classList.toggle('active',on); b.setAttribute('aria-pressed',on?'true':'false'); });\n` +
    // active/dim the degree rows, gather degrees
    `    var degs=[];\n` +
    `    for(var i=0;i<MAXN;i++){ var active=(i<N); dRow[i].style.opacity=active?'1':'0.35'; dS[i].disabled=!active; var di=parseInt(dS[i].value,10)||1; dV[i].textContent='d'+'\\u2081\\u2082\\u2083\\u2084\\u2085'.charAt(i)+' = '+di; if(active) degs.push(di); }\n` +
    `    var prod=degs.reduce(function(a,b){return a*b;},1);\n` +
    // visual: one bar per factor, width proportional to degree
    `    var bx=40, by=44, bw=22, gap=10, unit=26;\n` +
    `    txt(bx, by-14, N+' hypersurfaces H\\u2081,\\u2026,H_'+N+' in \\u2119^'+N+'  (meeting properly)', {size:12, fill:'var(--ink)', weight:600});\n` +
    `    var lblX=bx+MAXDEG*unit+14;\n` +
    `    for(var i=0;i<degs.length;i++){ var y=by+i*(bw+gap);\n` +
    `      svg.appendChild(mk('rect',{x:bx,y:y,width:degs[i]*unit,height:bw,rx:3,fill:'var(--cyan)','fill-opacity':0.25,stroke:'var(--cyan)','stroke-width':1}));\n` +
    `      txt(bx+5, y+bw-7, degs[i], {size:11, fill:'var(--cyan)', weight:600});\n` +
    `      txt(lblX, y+bw-6, 'H_'+(i+1)+' :  degree '+degs[i]+'  \\u2192  class '+cls(degs[i]), {size:11, fill:'var(--ink)'}); }\n` +
    `    var ey=by+degs.length*(bw+gap)+24;\n` +
    // the count line
    `    txt(bx, ey, '\\u220f d_i  =  '+degs.join(' \\u00b7 ')+'  =  '+prod, {size:14, fill:'var(--yellow)', weight:700});\n` +
    // Chow ring computation
    `    txt(bx, ey+30, 'In the Chow ring  A*(\\u2119^'+N+') = \\u2124[H]/(H^'+(N+1)+'):', {size:11, fill:'var(--mute)', italic:true});\n` +
    `    txt(bx, ey+52, '[H\\u2081]\\u22ef[H_'+N+'] = ('+degs.map(cls).join(')(')+') = '+prod+'\\u00b7H^'+N+' = '+prod+'\\u00b7[pt]', {size:12, fill:'var(--violet)'});\n` +
    `    txt(bx, ey+72, 'since H^'+N+' = [pt]  and  H^'+(N+1)+' = 0', {size:10, fill:'var(--mute)'});\n` +
    // big answer
    `    txt(bx, ey+104, '\\u21d2  '+prod+' intersection points', {size:15, fill:'var(--green)', weight:700});\n` +
    // readout
    `    var ex='';\n` +
    `    if(N===2) ex=' This is the classical \\u2119\\u00b2 Bézout theorem: two plane curves of degrees '+degs[0]+' and '+degs[1]+' meet in '+prod+' points.';\n` +
    `    else if(degs.every(function(d){return d===2;})) ex=' E.g. '+N+' generic quadrics in \\u2119^'+N+' meet in 2^'+N+' = '+prod+' points.';\n` +
    `    out.textContent='In \\u2119^'+N+', '+N+' hypersurfaces of degrees '+degs.join(', ')+' that meet PROPERLY (in a zero-dimensional set) intersect in '+prod+' points, counted with multiplicity \\u2014 the product of the degrees.'+ex+'\\n\\nThe modern proof is one line in the Chow ring A*(\\u2119^'+N+') = \\u2124[H]/(H^'+(N+1)+'): a degree-d hypersurface has class dH, so the product of the n classes is ('+degs.join('\\u00b7')+')\\u00b7H^'+N+' = '+prod+'\\u00b7[pt]. The hypotheses match the \\u2119\\u00b2 case (algebraically closed field, projective ambient, count with multiplicity) plus one stated anew: the hypersurfaces must meet properly \\u2014 if any two share a positive-dimensional component the count is infinite.';\n` +
    `  }\n` +
    `  nB.forEach(function(b,i){ b.addEventListener('click', function(){ N=i+2; draw(); }); });\n` +
    `  dS.forEach(function(s){ s.addEventListener('input', draw); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
