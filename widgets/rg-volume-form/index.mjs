// rg-volume-form widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The Riemannian volume form sqrt(det g) dx^1..dx^n:
// shade the coordinate domain by the area density sqrt(det g), integrate to the
// total area (sphere -> 4pi), and show the Laplace-Beltrami factor.

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row" id="${widgetId}-metrics" role="group" aria-label="metric">\n` +
    `    <button type="button" data-m="sphere" class="active" aria-pressed="true">round sphere</button>\n` +
    `    <button type="button" data-m="flat" aria-pressed="false">flat plane</button>\n` +
    `    <button type="button" data-m="torus" aria-pressed="false">torus</button>\n` +
    `    <button type="button" data-m="hyp" aria-pressed="false">hyperbolic band</button>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 560 300" width="560" height="300" role="img" aria-label="The coordinate domain shaded by the area density sqrt det g, with the total integrated area"><title>Riemannian volume form: each coordinate cell is shaded by √det g, the local area density; integrating it gives the total area</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId } = params;
  return (
    `<script>\n` +
    `/* rg-volume-form widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var svg=document.getElementById('${widgetId}-svg'), out=document.getElementById('${widgetId}-out');\n` +
    `  var metricsBox=document.getElementById('${widgetId}-metrics');\n` +
    `  if(!svg||!out||!metricsBox) return;\n` +
    `  var NS='http://www.w3.org/2000/svg', PI=Math.PI, E=Math.E;\n` +
    `  function mk(tag,attrs,text){ var e=document.createElementNS(NS,tag); for(var k in attrs){ e.setAttribute(k,attrs[k]); } if(text!=null) e.textContent=text; return e; }\n` +
    `  function txt(x,y,s,opt){ opt=opt||{}; svg.appendChild(mk('text',{x:x,y:y,'text-anchor':opt.anchor||'start','font-size':opt.size||12,fill:opt.fill||'var(--ink)','font-weight':opt.weight||'normal'},s)); }\n` +
    `  var METRICS={\n` +
    `    sphere:{u:[0,PI],v:[0,2*PI],ul:'\\u03b8',vl:'\\u03c6',sg:function(u,v){return Math.sin(u);},ds:'d\\u03b8\\u00b2 + sin\\u00b2\\u03b8 d\\u03c6\\u00b2',sgl:'\\u221adet g = sin \\u03b8',name:'round sphere S\\u00b2',tot:'4\\u03c0'},\n` +
    `    flat:{u:[0,2*PI],v:[0,2*PI],ul:'x',vl:'y',sg:function(u,v){return 1;},ds:'dx\\u00b2 + dy\\u00b2',sgl:'\\u221adet g = 1',name:'flat plane',tot:'4\\u03c0\\u00b2'},\n` +
    `    torus:{u:[0,2*PI],v:[0,2*PI],ul:'u',vl:'v',sg:function(u,v){return 2+Math.cos(v);},ds:'(2+cos v)\\u00b2 du\\u00b2 + dv\\u00b2',sgl:'\\u221adet g = 2 + cos v',name:'torus (R=2, r=1)',tot:'8\\u03c0\\u00b2'},\n` +
    `    hyp:{u:[0,2*PI],v:[1,E],ul:'x',vl:'y',sg:function(u,v){return 1/(v*v);},ds:'(dx\\u00b2 + dy\\u00b2)/y\\u00b2',sgl:'\\u221adet g = 1/y\\u00b2',name:'hyperbolic band',tot:'2\\u03c0(1\\u22121/e)'}\n` +
    `  };\n` +
    `  var cur='sphere';\n` +
    `  function total(M){ var Nu=120,Nv=120,du=(M.u[1]-M.u[0])/Nu,dv=(M.v[1]-M.v[0])/Nv,acc=0; for(var i=0;i<Nu;i++){ for(var j=0;j<Nv;j++){ acc+=M.sg(M.u[0]+(i+0.5)*du, M.v[0]+(j+0.5)*dv); } } return acc*du*dv; }\n` +
    `  function draw(){\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var M=METRICS[cur];\n` +
    `    var gx0=44,gx1=348,gy0=46,gy1=248, cols=18,rows=12;\n` +
    `    var cw=(gx1-gx0)/cols, ch=(gy1-gy0)/rows;\n` +
    // find max density for normalization
    `    var maxg=1e-9; for(var i0=0;i0<cols;i0++){ for(var j0=0;j0<rows;j0++){ var uu=M.u[0]+(i0+0.5)/cols*(M.u[1]-M.u[0]), vv=M.v[0]+(j0+0.5)/rows*(M.v[1]-M.v[0]); var g=M.sg(uu,vv); if(g>maxg) maxg=g; } }\n` +
    `    for(var i=0;i<cols;i++){ for(var j=0;j<rows;j++){\n` +
    `      var u=M.u[0]+(i+0.5)/cols*(M.u[1]-M.u[0]), v=M.v[0]+(j+0.5)/rows*(M.v[1]-M.v[0]); var g=M.sg(u,v);\n` +
    `      var op=0.06+0.82*(g/maxg);\n` +
    `      svg.appendChild(mk('rect',{x:gx0+i*cw, y:gy0+j*ch, width:cw-0.6, height:ch-0.6, fill:'var(--cyan)','fill-opacity':op}));\n` +
    `    }}\n` +
    `    svg.appendChild(mk('rect',{x:gx0,y:gy0,width:gx1-gx0,height:gy1-gy0,fill:'none',stroke:'var(--line)','stroke-width':1}));\n` +
    `    txt((gx0+gx1)/2, gy1+16, M.ul+'  \\u2192', {size:10, fill:'var(--mute)', anchor:'middle'});\n` +
    `    txt(gx0-8, (gy0+gy1)/2, M.vl, {size:10, fill:'var(--mute)', anchor:'end'});\n` +
    `    txt((gx0+gx1)/2, gy0-8, 'darker = larger \\u221adet g (more area per coordinate cell)', {size:9, fill:'var(--mute)', anchor:'middle'});\n` +
    // sample point at domain centre
    `    var um=(M.u[0]+M.u[1])/2, vm=(M.v[0]+M.v[1])/2, gm=M.sg(um,vm);\n` +
    `    var px=gx0+(um-M.u[0])/(M.u[1]-M.u[0])*(gx1-gx0), py=gy0+(vm-M.v[0])/(M.v[1]-M.v[0])*(gy1-gy0);\n` +
    `    svg.appendChild(mk('circle',{cx:px,cy:py,r:4,fill:'none',stroke:'var(--yellow)','stroke-width':2}));\n` +
    // panel
    `    var TX=368, ty=44;\n` +
    `    txt(TX, ty, M.name, {size:12, fill:'var(--violet)', weight:600}); ty+=20;\n` +
    `    txt(TX, ty, 'ds\\u00b2 = '+M.ds, {size:10, fill:'var(--mute)'}); ty+=18;\n` +
    `    txt(TX, ty, M.sgl, {size:12, fill:'var(--cyan)', weight:600}); ty+=24;\n` +
    `    txt(TX, ty, 'at centre ('+M.ul+'='+um.toFixed(2)+'): \\u221adet g = '+gm.toFixed(3), {size:9, fill:'var(--yellow)'}); ty+=24;\n` +
    `    txt(TX, ty, 'total area = \\u222b\\u221adet g du dv', {size:10, fill:'var(--mute)'}); ty+=16;\n` +
    `    txt(TX, ty, '= '+M.tot+' \\u2248 '+total(M).toFixed(3), {size:13, fill:'var(--green)', weight:700}); ty+=28;\n` +
    `    txt(TX, ty, 'Laplace\\u2013Beltrami:', {size:9, fill:'var(--mute)'}); ty+=13;\n` +
    `    txt(TX, ty, '\\u0394_g f = (1/\\u221adet g)\\u2202\\u1d62(\\u221adet g g\\u2071\\u02b2\\u2202\\u2c7c f)', {size:9, fill:'var(--mute)'});\n` +
    `    out.textContent = 'A Riemannian metric distinguishes a canonical top-form, the volume form dvol_g = \\u221adet g\\u00b7dx\\u00b9\\u2227\\u00b7\\u00b7\\u00b7\\u2227dx\\u207f. The factor \\u221adet g is the volume of the parallelepiped spanned by the coordinate basis as measured by g \\u2014 the local area density. For the '+M.name+' with ds\\u00b2 = '+M.ds+', '+M.sgl+': the shading shows where coordinate cells carry more area (darker). Integrating, \\u222b\\u221adet g du dv = '+M.tot+' \\u2248 '+total(M).toFixed(3)+(cur==='sphere'?' \\u2014 the familiar area of the unit sphere':'')+'. The same \\u221adet g builds the divergence div_g X = (1/\\u221adet g)\\u2202\\u1d62(\\u221adet g X\\u2071) and the Laplace\\u2013Beltrami operator \\u0394_g f = (1/\\u221adet g)\\u2202\\u1d62(\\u221adet g g\\u2071\\u02b2\\u2202\\u2c7c f), which collapses to the ordinary Laplacian when g\\u1d62\\u2c7c=\\u03b4\\u1d62\\u2c7c; its eigenvalues are the spectral geometry of (M,g).';\n` +
    `  }\n` +
    `  Array.prototype.forEach.call(metricsBox.querySelectorAll('button'), function(b){ b.addEventListener('click', function(){\n` +
    `    cur=b.getAttribute('data-m');\n` +
    `    Array.prototype.forEach.call(metricsBox.querySelectorAll('button'), function(x){ var on=(x===b); x.classList.toggle('active',on); x.setAttribute('aria-pressed', on?'true':'false'); });\n` +
    `    draw();\n` +
    `  }); });\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
