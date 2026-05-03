/* widget-history-era-toys.js
 *
 * Nine small inline interactives, one per era of history.html.
 * Each toy is self-contained (≤80 lines), no registry promotion, no
 * external dependencies beyond KaTeX (already on the page).
 *
 * Hosts the bootstrapper queries: <div class="widget era-toy" data-era-toy="<id>">
 * Dispatcher: window.MVHistoryToys.init(host) reads data-era-toy and
 * invokes the matching factory.
 */
(function(){
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs){
    const e = document.createElementNS(NS, tag);
    if(attrs) for(const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function shell(host, title, hint){
    host.innerHTML = '';
    const hd = document.createElement('div');
    hd.className = 'hd';
    // Title is uppercased by CSS — strip $...$ delimiters so the math
    // doesn't read as literal dollar signs in the rendered all-caps.
    const ttl = title.replace(/\$/g, '');
    hd.innerHTML = `<div class="ttl">${ttl}</div><div class="hint">${hint||''}</div>`;
    host.appendChild(hd);
    const body = document.createElement('div');
    body.className = 'era-toy-body';
    host.appendChild(body);
    const readout = document.createElement('div');
    readout.className = 'readout era-toy-readout';
    host.appendChild(readout);
    // Render any KaTeX delimiters in the hint (caller's $ allowed there).
    if(typeof window.renderMathInElement === 'function'){
      window.renderMathInElement(hd, {
        delimiters: [
          {left:'$$',right:'$$',display:true},
          {left:'$',right:'$',display:false}
        ],
        throwOnError: false
      });
    }
    return { body, readout };
  }
  function renderKatex(el){
    if(typeof window.renderMathInElement !== 'function') return;
    window.renderMathInElement(el, {
      delimiters: [
        {left:'$$',right:'$$',display:true},
        {left:'$',right:'$',display:false}
      ],
      throwOnError: false
    });
  }

  const TOYS = {
    // ===== 1. Prehistory: tally counter =====
    prehistory(host){
      const { body, readout } = shell(host, 'Tally counter · subitizing wall',
        'Click the slate to add notches. Try to count without thinking.');
      let n = 0;
      const slate = svgEl('svg', { viewBox:'0 0 360 80', width:'100%' });
      slate.style.cursor = 'pointer';
      slate.style.background = '#1a1a18';
      slate.style.borderRadius = '6px';
      const reset = document.createElement('button');
      reset.textContent = 'reset';
      reset.style.marginTop = '.4rem';
      function redraw(){
        slate.innerHTML = '';
        for(let i = 0; i < n; i++){
          const groupCol = Math.floor(i / 5), inGroup = i % 5;
          const x = 18 + groupCol * 36 + (inGroup === 4 ? 18 : inGroup * 6);
          const ln = svgEl('line', {
            x1: x, y1: 16, x2: x + (inGroup === 4 ? -28 : 0), y2: 64,
            stroke: '#ffd866', 'stroke-width': 2,
            'stroke-linecap': 'round'
          });
          slate.appendChild(ln);
        }
        const subitize = n <= 4;
        readout.textContent = `n = ${n} · ${subitize ? 'subitized: counted at a glance' : 'requires explicit count — language territory'}`;
      }
      slate.addEventListener('click', () => { if(n < 30) { n++; redraw(); } });
      reset.addEventListener('click', () => { n = 0; redraw(); });
      body.appendChild(slate);
      body.appendChild(reset);
      redraw();
    },

    // ===== 2. Ancient: Plimpton-322 triple generator =====
    ancient(host){
      const { body, readout } = shell(host, 'Babylonian triples · $a^2+b^2=c^2$',
        'Move the (p,q) sliders to generate $(p^2-q^2,\\ 2pq,\\ p^2+q^2)$.');
      const ctl = document.createElement('div'); ctl.className = 'row';
      ctl.innerHTML =
        '<label>p <input type="range" id="t-p" min="2" max="12" value="5" step="1"></label>' +
        '<label>q <input type="range" id="t-q" min="1" max="11" value="2" step="1"></label>';
      body.appendChild(ctl);
      const fig = svgEl('svg', { viewBox:'0 0 320 200', width:'100%' });
      body.appendChild(fig);
      function update(){
        const p = +ctl.querySelector('#t-p').value;
        let q = +ctl.querySelector('#t-q').value;
        if(q >= p) q = p - 1;
        const a = p*p - q*q, b = 2*p*q, c = p*p + q*q;
        const sx = Math.min(280 / a, 160 / b);
        fig.innerHTML = '';
        const ox = 30, oy = 180;
        const tri = svgEl('polygon', {
          points: `${ox},${oy} ${ox + a*sx},${oy} ${ox},${oy - b*sx}`,
          fill: 'rgba(255,216,102,0.18)',
          stroke: 'var(--yellow)', 'stroke-width': 1.5
        });
        fig.appendChild(tri);
        const lab = (x, y, text, color) => {
          const t = svgEl('text', { x, y, fill: color || 'var(--ink)', 'font-size': 12 });
          t.textContent = text; fig.appendChild(t);
        };
        lab(ox + a*sx/2, oy + 14, `a = ${a}`, 'var(--cyan)');
        lab(ox - 24, oy - b*sx/2, `b = ${b}`, 'var(--green)');
        lab(ox + a*sx/2 + 6, oy - b*sx/2 - 6, `c = ${c}`, 'var(--pink)');
        readout.textContent = `(${a}, ${b}, ${c}) · check: ${a*a} + ${b*b} = ${c*c}`;
      }
      ctl.querySelectorAll('input').forEach(el => el.addEventListener('input', update));
      update();
    },

    // ===== 3. Classical: Euclid Book I prop. 1 =====
    classical(host){
      const { body, readout } = shell(host, 'Euclid I.1 · equilateral from a segment',
        'Step through the construction: two arcs, one apex.');
      const fig = svgEl('svg', { viewBox:'0 0 320 200', width:'100%', style:'background:#0a0d12;border-radius:6px' });
      body.appendChild(fig);
      const btn = document.createElement('button');
      btn.textContent = 'step ▶';
      body.appendChild(btn);
      let step = 0;
      function redraw(){
        fig.innerHTML = '';
        const ax = 80, ay = 150, bx = 240, by = 150;
        const r = Math.hypot(bx-ax, by-ay);
        const cx = (ax+bx)/2, cy = ay - r * Math.sqrt(3)/2;
        // step 0: just AB; 1: arc from A; 2: arc from B; 3: triangle
        fig.appendChild(svgEl('line', { x1:ax, y1:ay, x2:bx, y2:by, stroke:'var(--ink)', 'stroke-width':2 }));
        const pt = (x,y,c) => fig.appendChild(svgEl('circle', { cx:x, cy:y, r:3.5, fill:c||'var(--yellow)' }));
        pt(ax, ay); pt(bx, by);
        if(step >= 1) fig.appendChild(svgEl('circle', { cx:ax, cy:ay, r:r, fill:'none', stroke:'var(--cyan)', 'stroke-width':1, opacity:0.7 }));
        if(step >= 2) fig.appendChild(svgEl('circle', { cx:bx, cy:by, r:r, fill:'none', stroke:'var(--green)', 'stroke-width':1, opacity:0.7 }));
        if(step >= 3){
          fig.appendChild(svgEl('polygon', {
            points: `${ax},${ay} ${bx},${by} ${cx},${cy}`,
            fill:'rgba(255,216,102,0.18)', stroke:'var(--yellow)', 'stroke-width':2
          }));
          pt(cx, cy, 'var(--pink)');
        }
        const labels = ['Step 0: segment AB','Step 1: arc centred at A through B','Step 2: arc centred at B through A','Step 3: their intersection completes the equilateral triangle.'];
        readout.textContent = labels[step];
      }
      btn.addEventListener('click', () => { step = (step + 1) % 4; redraw(); });
      redraw();
    },

    // ===== 4. Asian-Islamic: al-Khwārizmī completing the square =====
    'asian-islamic'(host){
      const { body, readout } = shell(host, 'Completing the square · al-Khwārizmī',
        'A geometric proof: $x^2 + bx = (x + b/2)^2 - (b/2)^2$.');
      const ctl = document.createElement('div'); ctl.className = 'row';
      ctl.innerHTML = '<label>b <input type="range" id="ck-b" min="1" max="10" step="1" value="4"></label>' +
                      '<label>x <input type="range" id="ck-x" min="1" max="8" step="0.5" value="3"></label>';
      body.appendChild(ctl);
      const fig = svgEl('svg', { viewBox:'0 0 320 220', width:'100%' });
      body.appendChild(fig);
      function update(){
        const b = +ctl.querySelector('#ck-b').value;
        const x = +ctl.querySelector('#ck-x').value;
        const scale = 18, ox = 24, oy = 20;
        fig.innerHTML = '';
        // x² square
        fig.appendChild(svgEl('rect', { x:ox, y:oy, width:x*scale, height:x*scale, fill:'rgba(125,224,214,0.25)', stroke:'var(--cyan)', 'stroke-width':1.2 }));
        // two b/2 strips (split bx)
        fig.appendChild(svgEl('rect', { x:ox + x*scale, y:oy, width:(b/2)*scale, height:x*scale, fill:'rgba(216,166,87,0.30)', stroke:'var(--ancient-stroke,#d8a657)', 'stroke-width':1.2 }));
        fig.appendChild(svgEl('rect', { x:ox, y:oy + x*scale, width:x*scale, height:(b/2)*scale, fill:'rgba(216,166,87,0.30)', stroke:'#d8a657', 'stroke-width':1.2 }));
        // (b/2)² completion (faint dashed)
        fig.appendChild(svgEl('rect', { x:ox + x*scale, y:oy + x*scale, width:(b/2)*scale, height:(b/2)*scale, fill:'rgba(255,216,102,0.20)', stroke:'var(--yellow)', 'stroke-dasharray':'3 3', 'stroke-width':1.4 }));
        const r = x*x + b*x;
        const completed = (x + b/2)**2;
        const correction = (b/2)**2;
        readout.innerHTML = `$x^2 + bx = ${r.toFixed(2)}$, complete to $(x+\\tfrac{b}{2})^2 = ${completed.toFixed(2)}$, correction $-(\\tfrac{b}{2})^2 = -${correction.toFixed(2)}$.`;
        renderKatex(readout);
      }
      ctl.querySelectorAll('input').forEach(el => el.addEventListener('input', update));
      update();
    },

    // ===== 5. Medieval: Oresme harmonic dyadic groups =====
    medieval(host){
      const { body, readout } = shell(host, 'Oresme · the harmonic series diverges',
        'Each dyadic block sums to ≥ 1/2. So the partial sums grow without bound.');
      const fig = svgEl('svg', { viewBox:'0 0 360 200', width:'100%' });
      body.appendChild(fig);
      const btn = document.createElement('button');
      btn.textContent = 'add next block';
      body.appendChild(btn);
      const reset = document.createElement('button'); reset.textContent = 'reset'; reset.style.marginLeft = '.4rem';
      body.appendChild(reset);
      let blocks = 1;
      function update(){
        fig.innerHTML = '';
        let total = 0, x = 10, y = 30;
        const colors = ['var(--cyan)','var(--green)','var(--yellow)','var(--pink)','var(--violet)','#83c167','#e07a5f'];
        for(let k = 0; k < blocks; k++){
          // block k contains terms 1/(2^k) ... 1/(2^(k+1)-1) + or first block 1
          const start = k === 0 ? 1 : 2**k;
          const end = k === 0 ? 1 : 2**(k+1) - 1;
          let blkSum = 0;
          for(let n = start; n <= end; n++){
            blkSum += 1/n;
            const w = Math.max(2, 240/n);
            fig.appendChild(svgEl('rect', { x: x, y: y, width: w, height: 20, fill: colors[k % colors.length], opacity: 0.7 }));
            x += w + 2;
          }
          total += blkSum;
          fig.appendChild(svgEl('text', { x: 10, y: y + 38, fill: 'var(--ink)', 'font-size': 11 }))
            .textContent = `Block ${k}: ${end - start + 1} term${end-start? 's':''}, sum = ${blkSum.toFixed(3)} (≥ ${k===0?'1':'1/2'})`;
          y += 24; x = 10;
          if(y > 180) break;
        }
        readout.textContent = `Partial sum after ${blocks} block(s): ${total.toFixed(4)}. Each new block adds at least 1/2 — so the sum diverges.`;
      }
      btn.addEventListener('click', () => { if(blocks < 7){ blocks++; update(); } });
      reset.addEventListener('click', () => { blocks = 1; update(); });
      update();
    },

    // ===== 6. Renaissance: Cardano cubic dial =====
    renaissance(host){
      const { body, readout } = shell(host, "Cardano's cubic · $x^3 + px = q$",
        'Cardano\'s formula. Note the $\\sqrt{-1}$ that appears when $\\Delta < 0$.');
      const ctl = document.createElement('div'); ctl.className = 'row';
      ctl.innerHTML = '<label>p <input type="range" id="cc-p" min="-12" max="12" step="0.5" value="-15"></label>' +
                      '<label>q <input type="range" id="cc-q" min="-20" max="20" step="0.5" value="4"></label>';
      body.appendChild(ctl);
      const fig = svgEl('svg', { viewBox:'-10 -40 220 80', width:'100%' });
      body.appendChild(fig);
      function update(){
        const p = +ctl.querySelector('#cc-p').value;
        const q = +ctl.querySelector('#cc-q').value;
        const D = (q/2)**2 + (p/3)**3;
        fig.innerHTML = '';
        fig.appendChild(svgEl('line', { x1:-10, y1:0, x2:210, y2:0, stroke:'var(--mute)', 'stroke-width':0.5 }));
        // plot x³ + px - q from x = -5 to 5
        let pts = '';
        for(let i = 0; i <= 100; i++){
          const x = -5 + 10 * i / 100;
          const y = -(x*x*x + p*x - q) / 50;
          const px = (x + 5) * 20;
          pts += `${px},${Math.max(-30, Math.min(30, y * 30))} `;
        }
        fig.appendChild(svgEl('polyline', { points: pts, fill:'none', stroke: D < 0 ? 'var(--pink)' : 'var(--cyan)', 'stroke-width': 1.5 }));
        let formula;
        if(D < 0){
          formula = `Discriminant $\\Delta = ${D.toFixed(2)} < 0$ — three real roots, but Cardano's formula needs $\\sqrt{${D.toFixed(2)}}$. The "casus irreducibilis" forced complex numbers into the open.`;
        } else {
          const u = Math.cbrt(-q/2 + Math.sqrt(D));
          const v = Math.cbrt(-q/2 - Math.sqrt(D));
          formula = `Real root: $x = \\sqrt[3]{${(-q/2).toFixed(2)} + \\sqrt{${D.toFixed(2)}}} + \\sqrt[3]{${(-q/2).toFixed(2)} - \\sqrt{${D.toFixed(2)}}} = ${(u + v).toFixed(3)}$.`;
        }
        readout.innerHTML = formula;
        renderKatex(readout);
      }
      ctl.querySelectorAll('input').forEach(el => el.addEventListener('input', update));
      update();
    },

    // ===== 7. Enlightenment: Euler ζ(2) via product =====
    enlightenment(host){
      const { body, readout } = shell(host, "Euler · $\\sin x / x$ as an infinite product",
        'Compare $\\sin(x)/x$ with the partial product $\\prod (1 - x^2/(n\\pi)^2)$.');
      const ctl = document.createElement('div'); ctl.className = 'row';
      ctl.innerHTML = '<label>terms N <input type="range" id="eu-n" min="1" max="20" step="1" value="3"></label>';
      body.appendChild(ctl);
      const fig = svgEl('svg', { viewBox:'0 0 360 180', width:'100%', style:'background:#0a0d12;border-radius:6px' });
      body.appendChild(fig);
      function update(){
        const N = +ctl.querySelector('#eu-n').value;
        fig.innerHTML = '';
        // axes
        fig.appendChild(svgEl('line', { x1:0, y1:90, x2:360, y2:90, stroke:'var(--mute)', 'stroke-width':0.5 }));
        const xMax = 4 * Math.PI;
        let truePts = '', prodPts = '';
        let zetaSum = 0;
        for(let n = 1; n <= N; n++) zetaSum += 1 / (n*n);
        for(let i = 0; i <= 360; i++){
          const x = (i / 360) * xMax * 2 - xMax;
          const sx = (x + xMax) / (2 * xMax) * 360;
          const trueY = x === 0 ? 1 : Math.sin(x) / x;
          let prodY = 1;
          for(let n = 1; n <= N; n++) prodY *= (1 - (x*x) / ((n * Math.PI)**2));
          truePts += `${sx},${90 - trueY * 50} `;
          prodPts += `${sx},${90 - prodY * 50} `;
        }
        fig.appendChild(svgEl('polyline', { points: truePts, fill:'none', stroke:'var(--cyan)', 'stroke-width':1.4, opacity:0.85 }));
        fig.appendChild(svgEl('polyline', { points: prodPts, fill:'none', stroke:'var(--yellow)', 'stroke-width':1.4 }));
        readout.innerHTML = `Partial $\\zeta(2) \\approx \\pi^2/6 \\cdot (1 - \\text{tail}) = ${zetaSum.toFixed(5)}$ (target $\\pi^2/6 \\approx ${(Math.PI**2/6).toFixed(5)}$). Cyan = $\\sin x / x$; yellow = product through $N=${N}$.`;
        renderKatex(readout);
      }
      ctl.querySelector('input').addEventListener('input', update);
      update();
    },

    // ===== 8. 20th C: Gödel-numbering encoder =====
    twentieth(host){
      const { body, readout } = shell(host, 'Gödel-number a string',
        'Each character → its Unicode codepoint mod 256 → exponent of the next prime. Truncated to 8 chars.');
      const ctl = document.createElement('div'); ctl.className = 'row';
      ctl.innerHTML = '<label>string <input type="text" id="gn-s" value="0=0" maxlength="8" style="width:140px"></label>';
      body.appendChild(ctl);
      function nthPrime(n){
        const primes = [2,3,5,7,11,13,17,19];
        return primes[n] || 23;
      }
      function update(){
        const s = ctl.querySelector('#gn-s').value || '';
        const chars = [...s].slice(0, 8);
        let parts = [];
        let approxLog = 0;
        chars.forEach((ch, i) => {
          const code = ch.codePointAt(0) % 256;
          const p = nthPrime(i);
          parts.push(`${p}^{${code}}`);
          approxLog += code * Math.log(p);
        });
        if(!parts.length){
          readout.textContent = '(empty string → 1)';
          return;
        }
        readout.innerHTML = `Gödel number $G = ${parts.join(' \\cdot ')}$ — about $10^{${(approxLog/Math.LN10).toFixed(1)}}$ digits.`;
        renderKatex(readout);
      }
      ctl.querySelector('input').addEventListener('input', update);
      update();
    },

    // ===== 9. Modern: Ricci flow blob =====
    modern(host){
      const { body, readout } = shell(host, 'Ricci flow · curvature smooths a blob',
        'Animate $\\partial_t g_{ij} = -2 R_{ij}$ on a closed curve. Bumps shrink, the curve circularises.');
      const fig = svgEl('svg', { viewBox:'0 0 320 200', width:'100%', style:'background:#0a0d12;border-radius:6px' });
      body.appendChild(fig);
      const btn = document.createElement('button');
      btn.textContent = 'step';
      body.appendChild(btn);
      const reset = document.createElement('button'); reset.textContent = 'reset'; reset.style.marginLeft = '.4rem';
      body.appendChild(reset);
      const N = 64;
      let pts = [];
      function init(){
        pts = [];
        for(let i = 0; i < N; i++){
          const t = (i/N) * Math.PI * 2;
          // perturbed circle
          const r = 60 + 20*Math.sin(3*t) + 12*Math.cos(5*t);
          pts.push({ x: 160 + r*Math.cos(t), y: 100 + r*Math.sin(t) });
        }
      }
      function smooth(){
        // discrete curvature flow: each point moves toward the average of its
        // neighbours. Simulates the qualitative behaviour of Ricci flow.
        const next = [];
        for(let i = 0; i < N; i++){
          const a = pts[(i + N - 1) % N], b = pts[i], c = pts[(i + 1) % N];
          next.push({ x: b.x + 0.18 * (a.x + c.x - 2*b.x), y: b.y + 0.18 * (a.y + c.y - 2*b.y) });
        }
        pts = next;
      }
      function redraw(){
        fig.innerHTML = '';
        const path = pts.map((p, i) => (i ? 'L' : 'M') + p.x + ' ' + p.y).join(' ') + ' Z';
        fig.appendChild(svgEl('path', { d: path, fill:'rgba(200,165,212,0.20)', stroke:'var(--violet)', 'stroke-width':1.5 }));
        // measure circularity: ratio of perimeter² to 4π·area
        let A = 0, P = 0;
        for(let i = 0; i < N; i++){
          const a = pts[i], b = pts[(i+1)%N];
          A += a.x * b.y - b.x * a.y;
          P += Math.hypot(b.x - a.x, b.y - a.y);
        }
        A = Math.abs(A) / 2;
        const iso = (P*P) / (4 * Math.PI * Math.max(1, A));
        readout.textContent = `Isoperimetric ratio P²/(4πA) = ${iso.toFixed(3)} (1 = perfect circle)`;
      }
      btn.addEventListener('click', () => { for(let i=0;i<5;i++) smooth(); redraw(); });
      reset.addEventListener('click', () => { init(); redraw(); });
      init(); redraw();
    }
  };

  window.MVHistoryToys = {
    init(host){
      const id = host && host.dataset && host.dataset.eraToy;
      if(!id || !TOYS[id]) return;
      try { TOYS[id](host); }
      catch(err){ console.error('[history-toys] init failed for ' + id + ':', err); }
    }
  };
})();
