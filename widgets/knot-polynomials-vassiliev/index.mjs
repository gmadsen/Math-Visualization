// knot-polynomials-vassiliev widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. Finite-type invariants and v_2: the Vassiliev skein
// v(K_x)=v(K_+)-v(K_-), order <= n vanishes on (n+1)-singular knots, and
// v_2 = a_2 (the z^2 coefficient of the Conway polynomial) on a small-knot gallery.

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
    `    ${btn('unknot', '0&#8321;', false)}\n    ${btn('k31', '3&#8321;', true)}\n    ${btn('k41', '4&#8321;', false)}\n    ${btn('k51', '5&#8321;', false)}\n    ${btn('k52', '5&#8322;', false)}\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="The order-2 Vassiliev invariant v2 of small knots, as the z-squared coefficient of the Conway polynomial, with a signed bar chart and the order-2 chord diagram"><title>For a gallery of small knots, the order-2 Vassiliev invariant v2 equals a2, the coefficient of z squared in the Conway polynomial (unknot 0, trefoil 1, figure-eight -1, cinquefoil 3, and 5_2 gives 2), shown as a signed bar chart; the single order-2 chord diagram with two crossing chords generates the one-dimensional space of order-2 weight systems corresponding to v2.</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* knot-polynomials-vassiliev widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var btns=document.getElementById('${widgetId}-btns');\n` +
    `  if(!svg||!out||!btns) return;\n` +
    `  var NS='http://www.w3.org/2000/svg';\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'middle','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal','font-family':opt.mono?'monospace':'inherit'},s)); }\n` +
    `  var KNOTS=[\n` +
    `    {k:'unknot', nm:'0\\u2081', full:'unknot', conway:'\\u2207 = 1', v2:0},\n` +
    `    {k:'k31', nm:'3\\u2081', full:'trefoil', conway:'\\u2207 = z\\u00b2 + 1', v2:1},\n` +
    `    {k:'k41', nm:'4\\u2081', full:'figure-eight', conway:'\\u2207 = 1 \\u2212 z\\u00b2', v2:-1},\n` +
    `    {k:'k51', nm:'5\\u2081', full:'cinquefoil', conway:'\\u2207 = z\\u2074 + 3z\\u00b2 + 1', v2:3},\n` +
    `    {k:'k52', nm:'5\\u2082', full:'three-twist knot', conway:'\\u2207 = 2z\\u00b2 + 1', v2:2},\n` +
    `  ];\n` +
    `  var cur='k31';\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var K=null; for(var i=0;i<KNOTS.length;i++) if(KNOTS[i].k===cur) K=KNOTS[i];\n` +
    `    if(!K) return;\n` +
    `    txt(280, 24, 'Vassiliev skein:  v(K_\\u00d7) = v(K_+) \\u2212 v(K_\\u2212);   order \\u2264 n \\u21d4 v vanishes on every knot with \\u2265 n+1 double points', {size:9.5, fill:'var(--mute)'});\n` +
    `    txt(280, 42, 'simplest non-trivial invariant: v\\u2082 (order 2) = a\\u2082 = the z\\u00b2 coefficient of the Conway polynomial \\u2207', {size:10, fill:'var(--ink)'});\n` +
    `    // ===== v2 bar chart (left) =====\n` +
    `    var bx=[60,120,180,240,300], base=170, sc=20, bw=30;\n` +
    `    svg.appendChild(mk('line',{x1:34,y1:base,x2:330,y2:base,stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt(34, base+2, 'v\\u2082=0', {size:8, fill:'var(--mute)', anchor:'end'});\n` +
    `    KNOTS.forEach(function(n,i){ var sel=(n.k===cur); var h=n.v2*sc; var x=bx[i];\n` +
    `      var y=(h>=0)?(base-h):base; var hh=Math.abs(h);\n` +
    `      var col= sel?'var(--yellow)':(n.v2<0?'var(--pink)':'var(--cyan)');\n` +
    `      if(hh>0) svg.appendChild(mk('rect',{x:x-bw/2,y:y,width:bw,height:hh,rx:2,fill:col,'fill-opacity': sel?0.9:0.5,stroke:col,'stroke-width':1.4}));\n` +
    `      else svg.appendChild(mk('circle',{cx:x,cy:base,r:3,fill:col}));\n` +
    `      txt(x, (h>=0)?(y-5):(base+hh+12), ''+n.v2, {size:11, fill:col, weight:700});\n` +
    `      txt(x, base+(n.v2<0?(hh+26):14), n.nm, {size:10, fill: sel?'var(--yellow)':'var(--mute)', weight: sel?700:400});\n` +
    `    });\n` +
    `    txt(180, 236, 'v\\u2082 across the gallery  (signed; a\\u2082 mod 2 = the Arf invariant)', {size:9, fill:'var(--mute)'});\n` +
    `    // selected knot detail\n` +
    `    txt(180, 262, K.nm+'  ('+K.full+'):   '+K.conway+'    \\u2192   v\\u2082 = '+K.v2, {size:12, fill:'var(--green)', weight:700, mono:true});\n` +
    `    // ===== order-2 chord diagram (right) =====\n` +
    `    var ccx=455, ccy=120, cr=44;\n` +
    `    svg.appendChild(mk('circle',{cx:ccx,cy:ccy,r:cr,fill:'none',stroke:'var(--line)','stroke-width':1.5}));\n` +
    `    var ang=[45,135,225,315].map(function(d){ return [ccx+cr*Math.cos(d*Math.PI/180), ccy-cr*Math.sin(d*Math.PI/180)]; });\n` +
    `    // two crossing chords: (45->225) and (135->315)\n` +
    `    svg.appendChild(mk('line',{x1:ang[0][0],y1:ang[0][1],x2:ang[2][0],y2:ang[2][1],stroke:'var(--violet)','stroke-width':2}));\n` +
    `    svg.appendChild(mk('line',{x1:ang[1][0],y1:ang[1][1],x2:ang[3][0],y2:ang[3][1],stroke:'var(--violet)','stroke-width':2}));\n` +
    `    ang.forEach(function(p){ svg.appendChild(mk('circle',{cx:p[0],cy:p[1],r:3,fill:'var(--violet)'})); });\n` +
    `    txt(455, 186, 'order-2 weight system:', {size:9, fill:'var(--mute)'});\n` +
    `    txt(455, 199, 'this 1 chord diagram (2', {size:9, fill:'var(--violet)'});\n` +
    `    txt(455, 211, 'crossing chords) \\u2192 v\\u2082', {size:9, fill:'var(--violet)'});\n` +
    `    out.textContent='VASSILIEV (FINITE-TYPE) INVARIANTS. Extend any knot invariant v to SINGULAR knots (immersions with transverse double points) by the local rule v(K_\\u00d7) = v(K_+) \\u2212 v(K_\\u2212), where K_\\u00d7 has one double point and K_\\u00b1 are its two crossing resolutions. Iterating replaces an n-fold singular knot by an alternating sum of 2\\u207f ordinary knots \\u2014 values at the singular end behave like nth DERIVATIVES of v. We say v has FINITE TYPE OF ORDER \\u2264 n if it vanishes on every knot with \\u2265 n+1 double points (its (n+1)st derivative is identically 0). The simplest non-constant example is v\\u2082, of order 2: it equals a\\u2082, the coefficient of z\\u00b2 in the CONWAY POLYNOMIAL \\u2207 (defined by \\u2207(unknot)=1 and the skein \\u2207(L_+) \\u2212 \\u2207(L_-) = z\\u00b7\\u2207(L_0)). Reading a\\u2082 off the gallery: unknot 0, trefoil 3\\u2081 \\u2192 1, figure-eight 4\\u2081 \\u2192 \\u22121, cinquefoil 5\\u2081 \\u2192 3, and 5\\u2082 \\u2192 2 \\u2014 so v\\u2082 already distinguishes these knots, and a\\u2082 mod 2 recovers the Arf invariant (0,1,1,1,0 here). The deeper structure: the associated graded of order-n invariants injects into WEIGHT SYSTEMS on CHORD DIAGRAMS with n chords (modulo the 1T and 4T relations). At order 2 there is, up to those relations, a SINGLE chord diagram \\u2014 the two crossing chords drawn here \\u2014 so the space of order-2 invariants is one-dimensional and v\\u2082 generates it. (Kontsevich\\u2019s theorem: over \\u211a every weight system is the symbol of an actual Vassiliev invariant, via the Kontsevich integral.)';\n` +
    `  }\n` +
    `  btns.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b) return; cur=b.getAttribute('data-k');\n` +
    `    Array.prototype.forEach.call(btns.querySelectorAll('button'), function(x){ var on=x===b; x.classList.toggle('active', on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw(); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
