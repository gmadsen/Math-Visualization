// three-body-launcher widget — the "launch" gesture: press to place a test
// particle in the planar circular restricted three-body problem, drag to set
// its rotating-frame velocity arrow, release to integrate (RK4 with Coriolis
// terms) and draw the trajectory. The five Lagrange points are marked (the
// collinear three found by bisection at init); the readout reports the launch
// state, its Jacobi constant, and the outcome.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params; a non-HTML frontend can drive its own renderer
// from params alone (validated against ./schema.json).
//
// jsdom-safe: getScreenCTM/createSVGPoint run only inside pointer handlers;
// no Math.random, no rAF. The boot trajectory (a tadpole librating about L4)
// is integrated deterministically at init.

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint } = params;
  const svgTitle = params.svgTitle || title;
  const viewBox = params.viewBox || '0 0 640 520';
  const svgWidth = params.svgWidth != null ? params.svgWidth : 640;
  const svgHeight = params.svgHeight != null ? params.svgHeight : 520;
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" style="touch-action:none;cursor:crosshair;width:100%;max-width:${svgWidth}px;height:auto"><title>${svgTitle}</title></svg>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-clear" type="button">✕ Clear trajectories</button>\n` +
    `    <button id="${widgetId}-boot" type="button">↺ Tadpole at L4</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, svgId, outputId } = params;
  const mu = params.mu != null ? params.mu : 0.012;
  const bootSeed = params.bootSeed || null;
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const svg=$('#${svgId}'), out=$('#${outputId}');\n` +
    `  const _vb=(svg.getAttribute('viewBox')||'0 0 640 520').split(/\\s+/).map(Number);\n` +
    `  const W=_vb[2], Hh=_vb[3];\n` +
    `  // rotating-frame window x ∈ [-1.6, 1.6], y scaled to match\n` +
    `  const MU=${mu}, SC=W/3.2, CX=W/2, CY=Hh/2;\n` +
    `  const PX=function(x){ return CX+SC*x; }, PY=function(y){ return CY-SC*y; };\n` +
    `  const XMAX=1.6, YMAX=(Hh/2)/SC;\n` +
    `  function acc(x,y,vx,vy){\n` +
    `    const r1=Math.hypot(x+MU,y), r2=Math.hypot(x-1+MU,y);\n` +
    `    return [2*vy + x - (1-MU)*(x+MU)/(r1*r1*r1) - MU*(x-1+MU)/(r2*r2*r2),\n` +
    `            -2*vx + y - (1-MU)*y/(r1*r1*r1) - MU*y/(r2*r2*r2)];\n` +
    `  }\n` +
    `  function jacobi(x,y,vx,vy){\n` +
    `    const r1=Math.hypot(x+MU,y), r2=Math.hypot(x-1+MU,y);\n` +
    `    return x*x+y*y + 2*(1-MU)/r1 + 2*MU/r2 - (vx*vx+vy*vy);\n` +
    `  }\n` +
    `  function rk4(s,h){\n` +
    `    const f=function(st){ const a=acc(st[0],st[1],st[2],st[3]); return [st[2],st[3],a[0],a[1]]; };\n` +
    `    const k1=f(s), k2=f([s[0]+h/2*k1[0],s[1]+h/2*k1[1],s[2]+h/2*k1[2],s[3]+h/2*k1[3]]);\n` +
    `    const k3=f([s[0]+h/2*k2[0],s[1]+h/2*k2[1],s[2]+h/2*k2[2],s[3]+h/2*k2[3]]);\n` +
    `    const k4=f([s[0]+h*k3[0],s[1]+h*k3[1],s[2]+h*k3[2],s[3]+h*k3[3]]);\n` +
    `    return [s[0]+h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]), s[1]+h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]),\n` +
    `            s[2]+h/6*(k1[2]+2*k2[2]+2*k3[2]+k4[2]), s[3]+h/6*(k1[3]+2*k2[3]+2*k3[3]+k4[3])];\n` +
    `  }\n` +
    `  // collinear Lagrange points: roots of the on-axis acceleration (y=0, v=0)\n` +
    `  function fx(x){ return acc(x,0,0,0)[0]; }\n` +
    `  function bisect(a,b){ for(var i=0;i<70;i++){ var m=(a+b)/2; if(fx(a)*fx(m)<=0) b=m; else a=m; } return (a+b)/2; }\n` +
    `  const L1=bisect(0.2,1-MU-0.02), L2=bisect(1-MU+0.02,1.8), L3=bisect(-1.8,-0.2);\n` +
    `  const L4=[0.5-MU, Math.sqrt(3)/2], L5=[0.5-MU, -Math.sqrt(3)/2];\n` +
    `  const BG=SVG('g'); svg.appendChild(BG);\n` +
    `  const TRAJ=SVG('g'); svg.appendChild(TRAJ);\n` +
    `  const FG=SVG('g'); svg.appendChild(FG);\n` +
    `  // primaries (sized for visibility, not to scale) and Lagrange-point markers\n` +
    `  BG.appendChild(SVG('circle',{cx:PX(-MU),cy:PY(0),r:11,fill:'var(--yellow)','fill-opacity':0.85,stroke:'var(--line)'}));\n` +
    `  BG.appendChild(SVG('circle',{cx:PX(1-MU),cy:PY(0),r:5,fill:'var(--cyan)',stroke:'var(--line)'}));\n` +
    `  const t1=SVG('text',{x:PX(-MU),y:PY(0)+26,'font-size':11,fill:'var(--mute)','text-anchor':'middle'}); t1.textContent='m\\u2081 = '+(1-MU).toFixed(3); BG.appendChild(t1);\n` +
    `  const t2=SVG('text',{x:PX(1-MU),y:PY(0)+20,'font-size':11,fill:'var(--mute)','text-anchor':'middle'}); t2.textContent='m\\u2082 = '+MU.toFixed(3); BG.appendChild(t2);\n` +
    `  function lpt(p,name,dy){\n` +
    `    BG.appendChild(SVG('path',{d:'M'+(PX(p[0])-4)+' '+PY(p[1])+' L'+(PX(p[0])+4)+' '+PY(p[1])+' M'+PX(p[0])+' '+(PY(p[1])-4)+' L'+PX(p[0])+' '+(PY(p[1])+4),stroke:'var(--violet)','stroke-width':1.6}));\n` +
    `    const t=SVG('text',{x:PX(p[0]),y:PY(p[1])+(dy||-8),'font-size':11,fill:'var(--violet)','text-anchor':'middle'}); t.textContent=name; BG.appendChild(t);\n` +
    `  }\n` +
    `  lpt([L1,0],'L1'); lpt([L2,0],'L2'); lpt([L3,0],'L3'); lpt(L4,'L4'); lpt(L5,'L5',16);\n` +
    `  // transparent hit rect so empty space takes pointerdown\n` +
    `  BG.insertBefore(SVG('rect',{x:0,y:0,width:W,height:Hh,fill:'transparent'}),BG.firstChild);\n` +
    `  var ghostPath=null;\n` +
    `  function fmt(x){ const r=Math.round(x*1000)/1000; return (r===0?0:r).toFixed(3).replace('-','\\u2212'); }\n` +
    `  function integrate(x,y,vx,vy){\n` +
    `    var s=[x,y,vx,vy], d='M'+PX(x).toFixed(1)+' '+PY(y).toFixed(1), outcome=null, n=0;\n` +
    `    var max4=0, max5=0;\n` +
    `    const DT=0.004, NMAX=6000;\n` +
    `    for(n=0;n<NMAX;n++){\n` +
    `      s=rk4(s,DT);\n` +
    `      if(n%3===2) d+=' L'+PX(s[0]).toFixed(1)+' '+PY(s[1]).toFixed(1);\n` +
    `      max4=Math.max(max4,Math.hypot(s[0]-L4[0],s[1]-L4[1]));\n` +
    `      max5=Math.max(max5,Math.hypot(s[0]-L5[0],s[1]-L5[1]));\n` +
    `      const r1=Math.hypot(s[0]+MU,s[1]), r2=Math.hypot(s[0]-1+MU,s[1]);\n` +
    `      if(r1<0.045){ outcome='crash1'; break; }\n` +
    `      if(r2<0.022){ outcome='crash2'; break; }\n` +
    `      if(Math.abs(s[0])>XMAX+0.4||Math.abs(s[1])>YMAX+0.4){ outcome='escape'; break; }\n` +
    `    }\n` +
    `    return { d:d, outcome:outcome, t:(n+1)*DT, end:s, max4:max4, max5:max5 };\n` +
    `  }\n` +
    `  function launch(x,y,vx,vy,label){\n` +
    `    if(ghostPath){ ghostPath.setAttribute('opacity','0.22'); ghostPath.setAttribute('stroke','var(--mute)'); }\n` +
    `    const r=integrate(x,y,vx,vy);\n` +
    `    const path=SVG('path',{d:r.d,fill:'none',stroke:'var(--pink)','stroke-width':1.5,opacity:0.9,'pointer-events':'none'});\n` +
    `    TRAJ.appendChild(path); ghostPath=path;\n` +
    `    FG.innerHTML='';\n` +
    `    FG.appendChild(SVG('circle',{cx:PX(x),cy:PY(y),r:4,fill:'var(--green)','pointer-events':'none'}));\n` +
    `    const C=jacobi(x,y,vx,vy), sp=Math.hypot(vx,vy);\n` +
    `    var msg=(label||'launched')+' at ('+fmt(x)+', '+fmt(y)+'), rotating-frame speed '+fmt(sp);\n` +
    `    msg+=' \\u00b7 Jacobi constant <b>C = '+fmt(C)+'</b> (the one conserved quantity the rotating frame keeps)';\n` +
    `    if(r.outcome==='crash1') msg+=' \\u00b7 <span class="bad">crashed into m\\u2081 at t = '+r.t.toFixed(1)+'</span>';\n` +
    `    else if(r.outcome==='crash2') msg+=' \\u00b7 <span class="bad">crashed into m\\u2082 at t = '+r.t.toFixed(1)+'</span>';\n` +
    `    else if(r.outcome==='escape') msg+=' \\u00b7 left the window at t = '+r.t.toFixed(1);\n` +
    `    else msg+=' \\u00b7 <span class="ok">still orbiting at t = '+r.t.toFixed(1)+' (\\u2248 '+(r.t/(2*Math.PI)).toFixed(1)+' revolutions of the primaries)</span>';\n` +
    `    // tadpole verdict gated on the whole trajectory (max excursion), not just the launch point\n` +
    `    if(!r.outcome&&sp<0.15){\n` +
    `      if(Math.hypot(x-L4[0],y-L4[1])<0.25&&r.max4<0.5) msg+=' \\u2014 a tadpole hugging L4: it never strayed more than '+r.max4.toFixed(2)+' from the point, though L4 is a hilltop of the potential \\u2014 Coriolis keeps bending it back';\n` +
    `      else if(Math.hypot(x-L5[0],y-L5[1])<0.25&&r.max5<0.5) msg+=' \\u2014 a tadpole hugging L5: it never strayed more than '+r.max5.toFixed(2)+' from the point, though L5 is a hilltop of the potential \\u2014 Coriolis keeps bending it back';\n` +
    `    }\n` +
    `    out.innerHTML=msg;\n` +
    `  }\n` +
    `  // gesture: press places the particle, drag stretches the velocity arrow, release launches\n` +
    `  function toSvg(ev){ const q=svg.createSVGPoint(); q.x=ev.clientX; q.y=ev.clientY; return q.matrixTransform(svg.getScreenCTM().inverse()); }\n` +
    `  var armed=null;\n` +
    `  const VSC=1.6/SC; // svg px of drag -> rotating-frame velocity\n` +
    `  svg.addEventListener('pointerdown',function(ev){ ev.preventDefault();\n` +
    `    const p=toSvg(ev); armed={x:(p.x-CX)/SC, y:(CY-p.y)/SC, px:p.x, py:p.y, cx:p.x, cy:p.y};\n` +
    `    FG.innerHTML='';\n` +
    `    FG.appendChild(SVG('circle',{cx:p.x,cy:p.y,r:4,fill:'var(--green)','pointer-events':'none'}));\n` +
    `    out.innerHTML='aiming\\u2026 drag to set the rotating-frame velocity, release to launch (release in place = launch at rest)';\n` +
    `    try{svg.setPointerCapture(ev.pointerId);}catch(e){}\n` +
    `  });\n` +
    `  window.addEventListener('pointermove',function(ev){ if(!armed) return; const p=toSvg(ev);\n` +
    `    armed.cx=p.x; armed.cy=p.y;\n` +
    `    var arrow=FG.querySelector('line');\n` +
    `    if(!arrow){ arrow=SVG('line',{stroke:'var(--green)','stroke-width':2,'pointer-events':'none'}); FG.appendChild(arrow); }\n` +
    `    arrow.setAttribute('x1',armed.px); arrow.setAttribute('y1',armed.py);\n` +
    `    arrow.setAttribute('x2',p.x); arrow.setAttribute('y2',p.y);\n` +
    `    const vx=(p.x-armed.px)*VSC, vy=-(p.y-armed.py)*VSC;\n` +
    `    out.innerHTML='aiming\\u2026 v = ('+fmt(vx)+', '+fmt(vy)+'), speed '+fmt(Math.hypot(vx,vy))+' \\u2014 release to launch';\n` +
    `  });\n` +
    `  window.addEventListener('pointerup',function(){ if(!armed) return;\n` +
    `    const vx=(armed.cx-armed.px)*VSC, vy=-(armed.cy-armed.py)*VSC;\n` +
    `    const a=armed; armed=null;\n` +
    `    launch(a.x,a.y,vx,vy);\n` +
    `  });\n` +
    `  window.addEventListener('pointercancel',function(){ if(!armed) return; armed=null; FG.innerHTML='';\n` +
    `    out.innerHTML='aim cancelled \\u2014 press anywhere to place a new particle'; });\n` +
    `  const SEED=${bootSeed ? JSON.stringify(bootSeed) : `[0.5-MU+0.02, Math.sqrt(3)/2, 0, 0]`};\n` +
    `  const cb=$('#${widgetId}-clear'); if(cb) cb.addEventListener('click',function(){ TRAJ.innerHTML=''; FG.innerHTML=''; ghostPath=null; out.innerHTML='cleared \\u2014 press anywhere to place a new particle'; });\n` +
    `  const bb=$('#${widgetId}-boot'); if(bb) bb.addEventListener('click',function(){ launch(SEED[0],SEED[1],SEED[2],SEED[3],'tadpole seed launched'); });\n` +
    `  launch(SEED[0],SEED[1],SEED[2],SEED[3],'boot: tadpole seed launched');\n` +
    `})();\n` +
    `</script>`
  );
}
