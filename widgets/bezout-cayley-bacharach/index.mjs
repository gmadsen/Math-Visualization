// bezout-cayley-bacharach widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Cayley–Bacharach via the dimension count. The nine
// points of a 3×3 grid are the complete intersection of two cubics (three "row"
// lines and three "column" lines), so they impose only EIGHT independent
// conditions on the ℙ⁹ of plane cubics. Click points to toggle which are
// imposed; the widget computes the rank of the cubic-monomial evaluation matrix
// and flags any point FORCED by the imposed set (one whose row lies in their
// span — adding it doesn't raise the rank), making the 8-forces-the-9th miracle
// visible.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <span class="pill">impose</span>\n` +
    `    <button type="button" id="${widgetId}-b8">any 8 points</button>\n` +
    `    <button type="button" id="${widgetId}-b9">all 9</button>\n` +
    `    <button type="button" id="${widgetId}-bclear">clear</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="The nine points of a 3-by-3 grid as the intersection of two cubics, and the rank of the cubic conditions they impose"><title>Cayley-Bacharach: the nine points of a 3x3 grid impose only eight independent conditions on plane cubics, so any eight of them force the ninth</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* bezout-cayley-bacharach widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var b8=document.getElementById('${widgetId}-b8'), b9=document.getElementById('${widgetId}-b9'), bc=document.getElementById('${widgetId}-bclear');\n` +
    `  if(!svg||!out||!b8||!b9||!bc) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-style':opt.italic?'italic':'normal'},s)); }\n` +
    // nine grid points: index k -> (i,j)=(k%3, floor(k/3)), coords in {0,1,2}^2
    `  var PTS=[]; for(var k=0;k<9;k++){ PTS.push({i:k%3, j:Math.floor(k/3)}); }\n` +
    `  function gridX(i){ return 60+i*70; } function gridY(j){ return 84+j*70; }\n` +
    // the 10 cubic monomials evaluated at (x,y)
    `  function mono(x,y){ return [1, x, y, x*x, x*y, y*y, x*x*x, x*x*y, x*y*y, y*y*y]; }\n` +
    // rank of a set of rows (Gaussian elimination, partial pivoting)
    `  function rank(rows){ var m=rows.map(function(r){return r.slice();}), R=m.length, C=10, rk=0, eps=1e-7;\n` +
    `    for(var col=0; col<C && rk<R; col++){ var piv=-1, best=eps;\n` +
    `      for(var i=rk;i<R;i++){ if(Math.abs(m[i][col])>best){ best=Math.abs(m[i][col]); piv=i; } }\n` +
    `      if(piv<0) continue; var t=m[rk]; m[rk]=m[piv]; m[piv]=t; var pv=m[rk][col];\n` +
    `      for(var r2=0;r2<R;r2++){ if(r2!==rk && Math.abs(m[r2][col])>eps){ var f=m[r2][col]/pv; for(var c2=col;c2<C;c2++) m[r2][c2]-=f*m[rk][c2]; } }\n` +
    `      rk++; }\n` +
    `    return rk; }\n` +
    `  var imposed=[true,true,true,true,true,true,true,true,false];\n` + // default: 8 imposed, the 9th free (and forced)
    `  function rowOf(k){ return mono(PTS[k].i, PTS[k].j); }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    // two generating cubics: 3 row lines (C1, yellow) + 3 column lines (C2, cyan)
    `    for(var j=0;j<3;j++) svg.appendChild(mk('line',{x1:gridX(0)-24,y1:gridY(j),x2:gridX(2)+24,y2:gridY(j),stroke:'var(--yellow)','stroke-width':1.4,'stroke-opacity':0.55}));\n` +
    `    for(var i=0;i<3;i++) svg.appendChild(mk('line',{x1:gridX(i),y1:gridY(0)-24,x2:gridX(i),y2:gridY(2)+24,stroke:'var(--cyan)','stroke-width':1.4,'stroke-opacity':0.55}));\n` +
    `    txt(36, 30, 'C\\u2081 = the 3 row lines', {size:11, fill:'var(--yellow)'});\n` +
    `    txt(36, 46, 'C\\u2082 = the 3 column lines', {size:11, fill:'var(--cyan)'});\n` +
    // compute rank of imposed set and which non-imposed points are forced
    `    var impRows=[], impCount=0; for(var k=0;k<9;k++){ if(imposed[k]){ impRows.push(rowOf(k)); impCount++; } }\n` +
    `    var r=rank(impRows);\n` +
    `    var forced=[]; for(var k2=0;k2<9;k2++){ if(!imposed[k2]){ forced[k2]=(rank(impRows.concat([rowOf(k2)]))===r && impCount>0); } else forced[k2]=false; }\n` +
    `    var nForced=forced.filter(Boolean).length;\n` +
    // draw points (clickable)
    `    for(var k3=0;k3<9;k3++){ var cx=gridX(PTS[k3].i), cy=gridY(PTS[k3].j);\n` +
    `      if(forced[k3]){ svg.appendChild(mk('circle',{cx:cx,cy:cy,r:13,fill:'none',stroke:'var(--pink)','stroke-width':1.6,'stroke-dasharray':'3 2'})); }\n` +
    `      var dot=mk('circle',{cx:cx,cy:cy,r:7, fill:imposed[k3]?'var(--green)':'none', stroke:imposed[k3]?'var(--green)':'var(--mute)','stroke-width':1.6});\n` +
    `      svg.appendChild(dot);\n` +
    `      var hit=mk('circle',{cx:cx,cy:cy,r:16, fill:'transparent', style:'cursor:pointer'}); hit.setAttribute('data-k',k3); svg.appendChild(hit);\n` +
    `      if(forced[k3]) txt(cx+15, cy+4, 'forced', {size:9, fill:'var(--pink)'}); }\n` +
    // ledger
    `    var TX=300;\n` +
    `    txt(TX, 48, 'Plane cubics:  \\u2119\\u2079', {size:13, fill:'var(--ink)', weight:700});\n` +
    `    txt(TX, 66, '(10 coefficients a\\u2080 + a\\u2081x + \\u2026 + a\\u2089y\\u00b3)', {size:9, fill:'var(--mute)'});\n` +
    `    txt(TX, 96, 'points imposed:  ' + impCount, {size:12, fill:'var(--ink)'});\n` +
    `    txt(TX, 118, 'independent conditions (rank):  ' + r, {size:12, fill:'var(--yellow)', weight:600});\n` +
    `    txt(TX, 140, 'cubics through them:  \\u2119' + supr(9-r), {size:12, fill:'var(--cyan)'});\n` +
    `    if(nForced>0){ txt(TX, 172, '\\u21d2  ' + nForced + ' point' + (nForced===1?'':'s') + ' FORCED', {size:13, fill:'var(--pink)', weight:700}); txt(TX, 190, 'on every such cubic (rank does not rise)', {size:10, fill:'var(--mute)', italic:true}); }\n` +
    `    if(impCount===8 && r===8 && nForced===1){ txt(TX, 222, 'Eight of the nine \\u21d2 the ninth is', {size:11, fill:'var(--green)'}); txt(TX, 238, 'automatic.  That is Cayley\\u2013Bacharach.', {size:11, fill:'var(--green)', weight:600}); }\n` +
    // readout
    `    var msg;\n` +
    `    if(impCount===0){ msg='Click the nine grid points to impose conditions on plane cubics. Each point is one linear condition on the 10 coefficients, so the cubics through a chosen set form \\u2119^{9\\u2212rank}. Watch the rank: the nine points of this 3\\u00d73 grid never impose more than 8 independent conditions.'; }\n` +
    `    else { msg='You imposed ' + impCount + ' point' + (impCount===1?'':'s') + '. Their evaluation rows on the 10 cubic monomials have rank ' + r + ', so the cubics through them form \\u2119^' + (9-r) + (r===8?' (a pencil \\u2014 spanned by C\\u2081 = the three rows and C\\u2082 = the three columns)':'') + '.';\n` +
    `      if(nForced>0) msg += ' The ' + nForced + ' ringed point' + (nForced===1?'':'s') + ' \\u2014 not imposed, yet lying on every cubic through your set \\u2014 ' + (nForced===1?'is':'are') + ' FORCED: adding ' + (nForced===1?'it':'them') + ' leaves the rank at ' + r + '.'; }\n` +
    `    out.textContent = msg + '\\n\\nThe nine points of a 3\\u00d73 grid are the complete intersection of two cubics (C\\u2081 = product of the three row-lines, C\\u2082 = product of the three column-lines). A complete intersection of two cubics imposes only 8 \\u2014 not 9 \\u2014 independent conditions on cubics, so the family through all nine is the full pencil \\u03bbC\\u2081 + \\u03bcC\\u2082, two-dimensional. Hence any cubic through 8 of the points automatically contains the 9th: that is the Cayley\\u2013Bacharach theorem. Applied to the chord\\u2013tangent construction on a smooth cubic, it forces the elliptic-curve group law to be associative \\u2014 the one axiom that is otherwise a nightmare to check.';\n` +
    `  }\n` +
    `  function supr(n){ var S={'0':'\\u2070','1':'\\u00b9','2':'\\u00b2','3':'\\u00b3','4':'\\u2074','5':'\\u2075','6':'\\u2076','7':'\\u2077','8':'\\u2078','9':'\\u2079'}; return (''+n).split('').map(function(c){return S[c]||c;}).join(''); }\n` +
    `  svg.addEventListener('click', function(ev){ var t=ev.target; if(t && t.hasAttribute && t.hasAttribute('data-k')){ var k=+t.getAttribute('data-k'); imposed[k]=!imposed[k]; draw(); } });\n` +
    `  b8.addEventListener('click', function(){ var free=Math.floor(Math.random()*9); imposed=[]; for(var k=0;k<9;k++) imposed[k]=(k!==free); draw(); });\n` + // drop a RANDOM point each click, so "any 8" genuinely shows any 8 force the 9th

    `  b9.addEventListener('click', function(){ imposed=[true,true,true,true,true,true,true,true,true]; draw(); });\n` +
    `  bc.addEventListener('click', function(){ imposed=[false,false,false,false,false,false,false,false,false]; draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
