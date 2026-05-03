/* widget-history-lineage.js
 *
 * The "lineages" widget on history.html: pick a big idea (calculus, group
 * theory, FLT, …) and see the chain of mathematicians whose work fed into
 * it. Each lineage is a small DAG defined in window.HISTORY_DATA.lineages.
 *
 * Layout: rows by year, x positions distributed by a tiny barycentric pass
 * so children sit beneath the average x of their parents.
 */
(function(){
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs){
    const e = document.createElementNS(NS, tag);
    if(attrs) for(const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function htmlEscape(s){
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function fmtYear(y){
    if(y < 0) return Math.abs(y).toLocaleString() + ' BCE';
    if(y < 1000) return y + ' CE';
    return y.toString();
  }

  // ----- layout: rank-based Sugiyama-style -----
  // y is the topological rank (longest path from any source); calendar year
  // is shown as a label on each node. Time-based y collapses badly when the
  // dataset has 1500-year gaps (e.g. Archimedes → Oresme).
  function layoutLineage(lineage, width, height, padX, padY){
    const nodes = lineage.tree.map(n => Object.assign({}, n));
    if(!nodes.length) return [];
    const idIndex = new Map();
    nodes.forEach((n,i) => idIndex.set(n.id, i));

    const parents = new Map();
    const children = new Map();
    nodes.forEach(n => { children.set(n.id, []); parents.set(n.id, []); });
    nodes.forEach(n => {
      (n.to || []).forEach(toId => {
        if(idIndex.has(toId)){
          children.get(n.id).push(toId);
          parents.get(toId).push(n.id);
        }
      });
    });

    // longest-path rank (topological): rank(n) = 1 + max(rank(p) for p in parents(n))
    // tie-break with year so chronologically earlier work sits higher.
    const rank = new Map();
    function computeRank(id, seen){
      if(rank.has(id)) return rank.get(id);
      if(seen.has(id)) return 0; // cycle guard
      seen.add(id);
      const ps = parents.get(id);
      let r = 0;
      for(const p of ps){
        r = Math.max(r, computeRank(p, seen) + 1);
      }
      rank.set(id, r);
      return r;
    }
    nodes.forEach(n => computeRank(n.id, new Set()));

    // small bump-down for very large generation gaps so e.g. medieval
    // contributors don't sit on the same row as ancient ones. Conservative:
    // never adds more than 1 extra rank per parent — we want compactness.
    let changed = true;
    let guard = 0;
    while(changed && guard++ < 5){
      changed = false;
      nodes.forEach(n => {
        const ps = parents.get(n.id);
        for(const pid of ps){
          const p = nodes[idIndex.get(pid)];
          if((n.y - p.y) > 800 && rank.get(n.id) <= rank.get(p.id) + 1){
            rank.set(n.id, rank.get(p.id) + 2);
            changed = true;
          }
        }
      });
    }

    // group by rank
    const byRank = new Map();
    let rankMax = 0;
    nodes.forEach(n => {
      const r = rank.get(n.id);
      rankMax = Math.max(rankMax, r);
      if(!byRank.has(r)) byRank.set(r, []);
      byRank.get(r).push(n);
    });
    const innerH = height - 2 * padY;
    const innerW = width - 2 * padX;
    const rowH = rankMax > 0 ? innerH / rankMax : 0;
    // initial x: in each rank-row distribute by year ascending
    for(let r = 0; r <= rankMax; r++){
      const list = (byRank.get(r) || []).slice().sort((a,b) => a.y - b.y);
      list.forEach((n, i) => {
        n.posY = padY + r * rowH;
        n.posX = padX + ((i + 1) / (list.length + 1)) * innerW;
      });
    }

    // barycentric refinement to reduce edge crossings
    for(let iter = 0; iter < 14; iter++){
      nodes.forEach(n => {
        const ps = parents.get(n.id).map(id => nodes[idIndex.get(id)].posX);
        const cs = children.get(n.id).map(id => nodes[idIndex.get(id)].posX);
        let target = n.posX;
        if(ps.length && cs.length){
          target = (ps.reduce((a,b)=>a+b,0)/ps.length + cs.reduce((a,b)=>a+b,0)/cs.length) / 2;
        } else if(ps.length){
          target = ps.reduce((a,b)=>a+b,0)/ps.length;
        } else if(cs.length){
          target = cs.reduce((a,b)=>a+b,0)/cs.length;
        }
        n.posX = n.posX * 0.55 + target * 0.45;
      });
      // separate co-row nodes that have collided
      for(let r = 0; r <= rankMax; r++){
        const list = (byRank.get(r) || []).slice().sort((a,b) => a.posX - b.posX);
        const minSep = 130;
        for(let k = 1; k < list.length; k++){
          if(list[k].posX - list[k-1].posX < minSep){
            list[k].posX = list[k-1].posX + minSep;
          }
        }
        // shift left if rightmost overflows
        if(list.length){
          const overshoot = list[list.length-1].posX - (width - padX);
          if(overshoot > 0){
            list.forEach(n => n.posX -= overshoot);
          }
          const undershoot = padX - list[0].posX;
          if(undershoot > 0){
            list.forEach(n => n.posX += undershoot);
          }
        }
      }
    }

    // global centering: shift the whole layout so it sits horizontally
    // centred in the canvas, avoiding the right-bias from barycentric +
    // collision-fixup passes.
    const allX = nodes.map(n => n.posX);
    const center = (Math.min(...allX) + Math.max(...allX)) / 2;
    const shift = width / 2 - center;
    nodes.forEach(n => n.posX += shift);

    nodes.forEach(n => {
      n.posX = Math.max(padX, Math.min(width - padX, n.posX));
    });

    nodes._rankMax = rankMax;
    return nodes;
  }

  // ----- node render -----
  function nodeWidth(label){
    return Math.max(100, 14 + label.length * 7.4);
  }

  function init(host, data){
    if(!host || !data) return;
    const lineages = data.lineages || [];
    const personById = new Map((data.people || []).map(p => [p.id, p]));
    const eraById = new Map((data.eras || []).map(e => [e.id, e]));
    if(!lineages.length){
      host.innerHTML = '<div class="small">No lineages defined.</div>';
      return;
    }

    host.innerHTML = '';
    const hd = document.createElement('div');
    hd.className = 'hd';
    hd.innerHTML = '<div class="ttl">Lineages of an idea</div><div class="hint">Click a chip to switch the lineage</div>';
    host.appendChild(hd);

    const pickrow = document.createElement('div');
    pickrow.className = 'lineage-pickrow';
    const buttons = new Map();
    for(const ln of lineages){
      const b = document.createElement('button');
      b.className = 'lineage-pick';
      b.textContent = ln.title;
      b.dataset.lid = ln.id;
      buttons.set(ln.id, b);
      pickrow.appendChild(b);
    }
    host.appendChild(pickrow);

    const wrap = document.createElement('div');
    wrap.className = 'lineage-svg-wrap';
    const VB_W = 980;
    const PAD_X = 20, PAD_Y = 32;
    const ROW_H = 56;  // generous vertical spacing per rank
    const svg = el('svg', {
      'class':'lineage',
      preserveAspectRatio:'xMidYMid meet',
      role:'img',
      'aria-label':'Lineage of mathematicians who contributed to this idea'
    });
    wrap.appendChild(svg);
    host.appendChild(wrap);

    const detail = document.createElement('div');
    detail.className = 'tl-detail';
    detail.style.marginTop = '.7rem';
    detail.innerHTML = '<div class="empty">Click a node above to learn about that mathematician.</div>';
    host.appendChild(detail);

    let activeId = lineages[0].id;
    let positions = [];

    function renderLineage(){
      svg.innerHTML = '';
      const ln = lineages.find(l => l.id === activeId);
      if(!ln) return;
      // Pre-compute rankMax to size the SVG; layout function uses rankMax to place rows.
      // Two-pass: first measure with a placeholder height, then re-layout with the
      // actual height required.
      const measureH = 1000;
      const measured = layoutLineage(ln, VB_W, measureH, PAD_X, PAD_Y);
      const rankMax = measured._rankMax || 0;
      const VB_H = Math.max(360, 2*PAD_Y + (rankMax + 1) * ROW_H);
      svg.setAttribute('viewBox', `0 0 ${VB_W} ${VB_H}`);
      const nodes = layoutLineage(ln, VB_W, VB_H, PAD_X, PAD_Y);
      positions = nodes;
      const idx = new Map(nodes.map(n => [n.id, n]));

      // === defs (arrowhead) ===
      const defs = el('defs');
      const m = el('marker', {
        id:'lineage-arrow', viewBox:'0 0 10 10', refX:9, refY:5,
        markerWidth:6, markerHeight:6, orient:'auto'
      });
      m.appendChild(el('path', { d:'M0,0 L10,5 L0,10 Z', fill:'currentColor' }));
      defs.appendChild(m);
      svg.appendChild(defs);

      // faint horizontal rank-row guides (one per rank, no year labels —
      // calendar year is visible on each node).
      const rowH = rankMax > 0 ? (VB_H - 2*PAD_Y) / rankMax : 0;
      for(let r = 0; r <= rankMax; r++){
        const py = PAD_Y + r * rowH;
        svg.appendChild(el('line', {
          x1: PAD_X, y1: py, x2: VB_W - PAD_X, y2: py,
          stroke:'var(--line)', 'stroke-width':0.6, 'stroke-dasharray':'2 5', opacity:0.4
        }));
      }
      // small "earlier ↑ / later ↓" arrow on the left
      const arrowX = 12;
      svg.appendChild(el('text', {
        x: arrowX, y: PAD_Y - 6, 'font-size':10, fill:'var(--mute)',
        'letter-spacing':'.1em'
      })).textContent = 'EARLIER';
      svg.appendChild(el('text', {
        x: arrowX, y: VB_H - PAD_Y + 16, 'font-size':10, fill:'var(--mute)',
        'letter-spacing':'.1em'
      })).textContent = 'LATER';

      // === edges ===
      const edgeLayer = el('g', { 'class':'edges' });
      svg.appendChild(edgeLayer);
      nodes.forEach(n => {
        (n.to || []).forEach(toId => {
          const tn = idx.get(toId);
          if(!tn) return;
          const x1 = n.posX, y1 = n.posY + 12;
          const x2 = tn.posX, y2 = tn.posY - 12;
          const my = (y1 + y2) / 2;
          const d = `M${x1.toFixed(1)},${y1.toFixed(1)} C${x1.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
          edgeLayer.appendChild(el('path', {
            'class':'ledge', d,
            'marker-end':'url(#lineage-arrow)', stroke:'currentColor', fill:'none',
            color: 'color-mix(in srgb, var(--line) 60%, var(--ink) 40%)'
          }));
        });
      });

      // === nodes ===
      const isRoot = new Set(ln.rootIds || []);
      const nodeLayer = el('g', { 'class':'nodes' });
      svg.appendChild(nodeLayer);
      nodes.forEach(n => {
        const w = nodeWidth(n.label);
        const h = 36;
        const x = n.posX - w/2;
        const y = n.posY - h/2;
        // assign accent from the corresponding person's era, if known
        const person = personById.get(n.id);
        const era = person ? eraById.get(person.era) : null;
        const accent = isRoot.has(n.id)
          ? 'var(--yellow)'
          : (era ? era.color : 'var(--blue)');
        const g = el('g', {
          'class': 'lnode' + (isRoot.has(n.id) ? ' lroot' : ''),
          tabindex: 0,
          role:'button',
          'aria-label': `${n.label}, ${fmtYear(n.y)}`
        });
        g.style.setProperty('--accent', accent);
        g.dataset.id = n.id;
        const rect = el('rect', {
          x, y, width: w, height: h, rx: 6, ry: 6,
          fill: isRoot.has(n.id) ? 'rgba(255,216,102,0.10)' : 'var(--panel)',
          stroke: accent
        });
        g.appendChild(rect);
        const label = el('text', {
          'class':'lname',
          x: n.posX, y: n.posY - 2, 'text-anchor':'middle'
        });
        label.textContent = n.label;
        g.appendChild(label);
        const yr = el('text', {
          'class':'lyear',
          x: n.posX, y: n.posY + 12, 'text-anchor':'middle'
        });
        yr.textContent = fmtYear(n.y);
        g.appendChild(yr);
        nodeLayer.appendChild(g);

        const select = () => showPerson(n);
        g.addEventListener('click', select);
        g.addEventListener('keydown', e => {
          if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); select(); }
        });
      });
    }

    function showPerson(node){
      const person = personById.get(node.id);
      if(!person){
        // unknown — no full bio; fall back to year/label
        detail.innerHTML = `<div><span class="ev-year">${htmlEscape(fmtYear(node.y))}</span><span class="ev-title">${htmlEscape(node.label)}</span></div>`+
          `<div class="ev-summary" style="color:var(--mute)">No further bio in the dataset.</div>`;
        return;
      }
      const era = eraById.get(person.era);
      const eraColor = era ? era.color : 'var(--mute)';
      const range = (person.birth ? fmtYear(person.birth) : '?') + '–' + (person.death ? fmtYear(person.death) : 'present');
      detail.innerHTML =
        `<div><span class="ev-year" style="color:${eraColor};border-color:${eraColor}">${htmlEscape(range)}</span>`+
        `<span class="ev-title">${htmlEscape(person.name)}</span></div>`+
        `<div class="ev-meta"><span class="pill">${htmlEscape(person.place || '')}</span>${era ? `<span class="pill" style="border-color:${eraColor};color:${eraColor}">${htmlEscape(era.label)}</span>` : ''}</div>`+
        `<div class="ev-summary">${person.blurb || ''}</div>`;
      if(typeof window.renderMathInElement === 'function'){
        window.renderMathInElement(detail, {
          delimiters:[
            {left:'$$',right:'$$',display:true},
            {left:'$',right:'$',display:false},
            {left:'\\(',right:'\\)',display:false},
            {left:'\\[',right:'\\]',display:true}
          ],
          throwOnError:false
        });
      }
    }

    function setActive(id){
      activeId = id;
      buttons.forEach((b, k) => b.classList.toggle('active', k === id));
      detail.innerHTML = '<div class="empty">Click a node above to learn about that mathematician.</div>';
      renderLineage();
    }
    buttons.forEach((b, id) => {
      b.addEventListener('click', () => setActive(id));
    });
    setActive(activeId);
  }

  window.MVHistoryLineage = { init };
})();
