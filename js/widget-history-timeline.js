/* widget-history-timeline.js
 *
 * The era-banded timeline on history.html.
 *
 * One SVG strip from prehistory to today. Year axis at the bottom uses a
 * piecewise-linear scale so prehistory doesn't crush the modern era and
 * 1500–2025 doesn't crush the medieval period. Each event from
 * window.HISTORY_DATA.events becomes a coloured dot at its year, vertically
 * packed in lanes when neighbours collide. Click selects → detail card. Era
 * chips toggle visibility. Search highlights matches.
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

  // ===== piecewise time-to-x scale =====
  // [yearStart, yearEnd, fraction-of-plot-width]
  const SEGMENTS = [
    [-50000, -3500, 0.05],
    [-3500,   -500, 0.22],
    [ -500,   1500, 0.23],
    [ 1500,   2025, 0.50]
  ];
  function makeScale(plotLeft, plotW){
    return function yearToX(y){
      let frac = 0;
      for(const [a, b, w] of SEGMENTS){
        if(y < a) return plotLeft + frac * plotW;
        if(y <= b){ frac += w * (y - a) / (b - a); return plotLeft + frac * plotW; }
        frac += w;
      }
      return plotLeft + frac * plotW;
    };
  }
  // Inverse: given a pixel position, return the year. Piecewise solve.
  function makeInverseScale(plotLeft, plotW){
    return function xToYear(x){
      const targetFrac = Math.max(0, Math.min(1, (x - plotLeft) / plotW));
      let frac = 0;
      for(const [a, b, w] of SEGMENTS){
        if(targetFrac <= frac + w){
          const localFrac = (targetFrac - frac) / w;
          return Math.round(a + localFrac * (b - a));
        }
        frac += w;
      }
      return SEGMENTS[SEGMENTS.length - 1][1];
    };
  }

  // axis tick marks: hand-picked so prehistory and modern both get coverage
  const AXIS_TICKS = [
    { y:-3000, label:'3000 BCE' },
    { y:-1500, label:'1500 BCE' },
    { y:-500,  label:'500 BCE' },
    { y:0,     label:'0' },
    { y:500,   label:'500' },
    { y:1000,  label:'1000' },
    { y:1500,  label:'1500' },
    { y:1700,  label:'1700' },
    { y:1800,  label:'1800' },
    { y:1900,  label:'1900' },
    { y:2000,  label:'2000' }
  ];

  function buildEraIndex(eras){
    const m = new Map();
    for(const e of eras) m.set(e.id, e);
    return m;
  }
  function buildPersonIndex(people){
    const m = new Map();
    for(const p of people) m.set(p.id, p);
    return m;
  }

  // ===== vertical packing =====
  // Place each event in a lane such that overlapping (within minSepPx in x)
  // events go to different lanes. Preferred order: stable by year ascending.
  function packLanes(events, yearToX, minSepPx, laneCount, plotTop, plotBottom){
    const lanes = []; // each entry: lastX placed
    const sorted = events.map((e,i) => ({e, i, x: yearToX(e.year)})).sort((a,b) => a.x - b.x);
    const out = new Array(events.length);
    for(const {e,i,x} of sorted){
      // find first lane whose lastX is far enough away
      let lane = -1;
      for(let k = 0; k < lanes.length; k++){
        if(x - lanes[k] >= minSepPx){ lane = k; break; }
      }
      if(lane === -1){
        if(lanes.length < laneCount){ lane = lanes.length; lanes.push(-Infinity); }
        else {
          // pick the lane with the smallest lastX (least likely to overlap)
          lane = 0;
          for(let k = 1; k < lanes.length; k++) if(lanes[k] < lanes[lane]) lane = k;
        }
      }
      lanes[lane] = x;
      const laneStep = (plotBottom - plotTop) / Math.max(1, laneCount - 1);
      out[i] = { x, y: plotTop + lane * laneStep, lane };
    }
    return out;
  }

  // ===== widget impl =====
  function init(host, data){
    if(!host || !data) return;
    const eras = data.eras || [];
    const people = data.people || [];
    const events = (data.events || []).slice();
    const eraById = buildEraIndex(eras);
    const personById = buildPersonIndex(people);

    // ----- frame -----
    const VIEW_W = 1180, VIEW_H = 410;
    const PAD_L = 28, PAD_R = 28;
    const PLOT_LEFT = PAD_L;
    const PLOT_W = VIEW_W - PAD_L - PAD_R;
    const ERA_BAND_TOP = 14, ERA_BAND_H = 24, ERA_BAND_GAP = 4;
    const AXIS_Y = VIEW_H - 30;
    const LANE_COUNT = 8;
    const MIN_SEP_PX = 22;

    // Pack eras into rows so overlapping year ranges land on different rows.
    // Greedy: sort by yearStart, place each into the first row whose last
    // event ended before this one begins.
    const sortedEras = eras.slice().sort((a,b) => a.yearStart - b.yearStart);
    const eraRowOf = new Map();
    const rowEnds = []; // per row: yearEnd of last placed era
    for(const era of sortedEras){
      let row = -1;
      for(let r = 0; r < rowEnds.length; r++){
        if(rowEnds[r] <= era.yearStart){ row = r; break; }
      }
      if(row === -1){ row = rowEnds.length; rowEnds.push(-Infinity); }
      rowEnds[row] = era.yearEnd;
      eraRowOf.set(era.id, row);
    }
    const ERA_ROW_COUNT = Math.max(1, rowEnds.length);
    const ERA_BLOCK_H = ERA_ROW_COUNT * ERA_BAND_H + (ERA_ROW_COUNT - 1) * ERA_BAND_GAP;
    const PLOT_TOP = ERA_BAND_TOP + ERA_BLOCK_H + 14;
    const PLOT_BOTTOM = AXIS_Y - 14;

    const yearToX = makeScale(PLOT_LEFT, PLOT_W);
    const xToYear = makeInverseScale(PLOT_LEFT, PLOT_W);

    // ----- header / hint row -----
    host.innerHTML = '';
    const hd = document.createElement('div');
    hd.className = 'hd';
    hd.innerHTML = '<div class="ttl">Timeline · 5 millennia of mathematics</div>'+
      '<div class="hint">Click a dot for details · drag/scroll to pan</div>';
    host.appendChild(hd);

    // ----- chip row (era filters + search) -----
    const ctrls = document.createElement('div');
    ctrls.className = 'timeline-controls';
    const allBtn = document.createElement('button');
    allBtn.className = 'era-chip active';
    allBtn.textContent = 'All eras';
    allBtn.setAttribute('aria-pressed', 'true');
    ctrls.appendChild(allBtn);

    const eraChips = new Map();
    for(const era of eras){
      const c = document.createElement('button');
      c.className = 'era-chip';
      c.style.setProperty('--era-color', era.color);
      c.innerHTML = `<i></i><span>${htmlEscape(era.label)}</span>`;
      c.setAttribute('aria-pressed', 'false');
      c.dataset.era = era.id;
      eraChips.set(era.id, c);
      ctrls.appendChild(c);
    }

    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'timeline-search';
    search.placeholder = 'search name or keyword…';
    search.setAttribute('aria-label', 'Search timeline');
    ctrls.appendChild(search);
    host.appendChild(ctrls);

    // ----- SVG container -----
    const wrap = document.createElement('div');
    wrap.className = 'tl-svg-wrap';
    const svg = el('svg', {
      'class':'tl',
      viewBox:`0 0 ${VIEW_W} ${VIEW_H}`,
      preserveAspectRatio:'xMidYMid meet',
      role:'img',
      'aria-label':'Mathematical history timeline'
    });
    wrap.appendChild(svg);
    host.appendChild(wrap);

    // ----- detail card -----
    const detail = document.createElement('div');
    detail.className = 'tl-detail';
    detail.id = 'tl-detail';
    detail.setAttribute('aria-live', 'polite');
    detail.innerHTML = '<div class="empty">Pick a dot above. Use the chips to filter by era; type a name in the search box to spotlight matches.</div>';
    host.appendChild(detail);

    // ===== render era bands =====
    for(const era of eras){
      const x0 = yearToX(Math.max(era.yearStart, -50000));
      const x1 = yearToX(Math.min(era.yearEnd, 2025));
      const row = eraRowOf.get(era.id) || 0;
      const yBand = ERA_BAND_TOP + row * (ERA_BAND_H + ERA_BAND_GAP);
      const r = el('rect', {
        'class': `era-band era-band-${era.id}`,
        x: x0, y: yBand, width: Math.max(2, x1 - x0), height: ERA_BAND_H,
        fill: era.color, rx: 4, ry: 4
      });
      r.dataset.era = era.id;
      svg.appendChild(r);

      // era label inside the band, centered, but only if wide enough
      if((x1 - x0) > 50){
        const t = el('text', {
          'class':'era-label',
          x: (x0 + x1) / 2, y: yBand + ERA_BAND_H/2 + 4,
          'text-anchor':'middle'
        });
        t.textContent = era.label;
        svg.appendChild(t);
      }
    }

    // ===== render year axis =====
    // axis line
    svg.appendChild(el('line', {
      x1: PLOT_LEFT, y1: AXIS_Y, x2: PLOT_LEFT + PLOT_W, y2: AXIS_Y,
      stroke: 'var(--line)', 'stroke-width': 1
    }));
    for(const tick of AXIS_TICKS){
      const x = yearToX(tick.y);
      const g = el('g', { 'class':'axis-tick' });
      g.appendChild(el('line', { x1:x, y1:AXIS_Y - 3, x2:x, y2:AXIS_Y + 5 }));
      const lb = el('text', {
        x:x, y: AXIS_Y + 18, 'text-anchor':'middle'
      });
      lb.textContent = tick.label;
      g.appendChild(lb);
      svg.appendChild(g);
    }
    // emphasized year-zero
    const xZero = yearToX(0);
    svg.appendChild(el('line', {
      'class':'axis-zero',
      x1:xZero, y1:PLOT_TOP-4, x2:xZero, y2:AXIS_Y
    }));

    // ===== scrubber =====
    // A draggable vertical line that the reader can sweep along the year
    // axis. The current year shows above it; the map widget listens on the
    // bus and fades out pins outside ±50 years of the cursor.
    const SCRUB_INIT_YEAR = 1500;
    let scrubYearState = SCRUB_INIT_YEAR;
    const scrubGroup = el('g', {
      'class':'tl-scrubber',
      tabindex: 0,
      role: 'slider',
      'aria-label': 'Year scrubber — drag or use ← / → / Home / End to filter the world map by year',
      'aria-valuemin': SEGMENTS[0][0],
      'aria-valuemax': SEGMENTS[SEGMENTS.length-1][1],
      'aria-valuenow': SCRUB_INIT_YEAR
    });
    const scrubLine = el('line', {
      x1: 0, y1: ERA_BAND_TOP, x2: 0, y2: AXIS_Y,
      stroke: 'var(--yellow)', 'stroke-width': 1.4,
      'stroke-dasharray': '4 3',
      opacity: 0.55,
      'pointer-events': 'none'
    });
    const scrubGrip = el('rect', {
      x: -8, y: ERA_BAND_TOP - 4, width: 16, height: 12, rx: 3, ry: 3,
      fill: 'var(--yellow)', stroke: '#0b0f16', 'stroke-width': 1.2,
      cursor: 'ew-resize'
    });
    const scrubLabel = el('text', {
      x: 0, y: ERA_BAND_TOP - 8,
      'text-anchor':'middle', 'font-size': 11,
      'font-variant-numeric':'tabular-nums', 'font-weight': 600,
      fill: 'var(--yellow)',
      'paint-order': 'stroke', stroke: '#0b0f16', 'stroke-width': 3,
      'pointer-events': 'none'
    });
    scrubGroup.appendChild(scrubLine);
    scrubGroup.appendChild(scrubGrip);
    scrubGroup.appendChild(scrubLabel);
    svg.appendChild(scrubGroup);
    function setScrubYear(year){
      const cy = Math.max(SEGMENTS[0][0], Math.min(SEGMENTS[SEGMENTS.length-1][1], year));
      const x = yearToX(cy);
      scrubLine.setAttribute('x1', x);
      scrubLine.setAttribute('x2', x);
      scrubGrip.setAttribute('x', x - 8);
      scrubLabel.setAttribute('x', x);
      scrubLabel.textContent = fmtYear(cy);
      scrubGroup.setAttribute('aria-valuenow', cy);
      scrubGroup.setAttribute('aria-valuetext', fmtYear(cy));
      scrubYearState = cy;
      // Throttle bus emissions: only re-broadcast when the integer year
      // changes. Pointer-move can fire 60+/s; without this every map pin
      // would have its classList toggled at that rate.
      if(window.MVHistoryBus && cy !== lastEmitYear){
        lastEmitYear = cy;
        window.MVHistoryBus.scrubYear(cy);
      }
    }
    // Initial scrub-year emit happens after the current macrotask so the
    // map widget's bus listener has a chance to register first (timeline
    // init runs before map init in the bootstrapper). Without the
    // setTimeout we'd emit while map listeners don't exist yet.
    setTimeout(() => setScrubYear(SCRUB_INIT_YEAR), 0);
    let dragging = false;
    let lastEmitYear = null;
    function pointerToYear(e){
      const rect = svg.getBoundingClientRect();
      const xCss = e.clientX - rect.left;
      // SVG viewBox is VIEW_W wide rendered into rect.width css pixels
      const xSvg = xCss * (VIEW_W / rect.width);
      return xToYear(xSvg);
    }
    scrubGrip.addEventListener('pointerdown', e => {
      dragging = true;
      scrubGrip.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    scrubGroup.addEventListener('pointermove', e => {
      if(!dragging) return;
      setScrubYear(pointerToYear(e));
    });
    function endDrag(){ dragging = false; }
    scrubGrip.addEventListener('pointerup', endDrag);
    scrubGrip.addEventListener('pointercancel', endDrag);
    scrubGroup.addEventListener('keydown', e => {
      // Coarse step keys: ← / →. Fine: shift+arrow. Home/End jump to bounds.
      const fine = e.shiftKey ? 10 : 50;
      if(e.key === 'ArrowLeft'){ setScrubYear(scrubYearState - fine); e.preventDefault(); }
      else if(e.key === 'ArrowRight'){ setScrubYear(scrubYearState + fine); e.preventDefault(); }
      else if(e.key === 'Home'){ setScrubYear(SEGMENTS[0][0]); e.preventDefault(); }
      else if(e.key === 'End'){ setScrubYear(SEGMENTS[SEGMENTS.length-1][1]); e.preventDefault(); }
    });
    // Click on the scrubber background also jumps the cursor.
    svg.addEventListener('click', e => {
      // Don't interfere with dot clicks — those already toggle selection.
      if(e.target.closest('.event-dot')) return;
      if(e.target.closest('.tl-scrubber')) return;
      // Only react to clicks within the band area (not the axis/labels).
      const rect = svg.getBoundingClientRect();
      const yCss = e.clientY - rect.top;
      const ySvg = yCss * (VIEW_H / rect.height);
      if(ySvg > AXIS_Y - 14 || ySvg < ERA_BAND_TOP) return;
      setScrubYear(pointerToYear(e));
    });

    // ===== pack and render event dots =====
    const placements = packLanes(
      events, yearToX, MIN_SEP_PX, LANE_COUNT, PLOT_TOP, PLOT_BOTTOM
    );
    const dotNodes = [];
    events.forEach((ev, i) => {
      const era = eraById.get(ev.era);
      const eraColor = era ? era.color : 'var(--mute)';
      const { x, y } = placements[i];
      const g = el('g', {
        'class':'event-dot',
        transform: `translate(${x},${y})`,
        tabindex: 0,
        role:'button',
        'aria-label':`${ev.title}, ${fmtYear(ev.year)}`
      });
      g.dataset.idx = i;
      g.style.setProperty('--era-color', eraColor);
      g.appendChild(el('circle', {
        r: 5.5, cx: 0, cy: 0,
        fill: eraColor
      }));
      g.appendChild(el('title')).textContent = `${ev.title} — ${fmtYear(ev.year)}`;
      svg.appendChild(g);
      dotNodes.push(g);
    });

    // ===== state =====
    const state = {
      activeEras: new Set(),  // empty = all visible
      query: '',
      selectedIdx: -1,
      _renderedIdx: -2          // track last selectedIdx the detail was rendered for
    };
    // Cache the era-band node list once — was being re-queried on every keystroke.
    const bandNodes = [...svg.querySelectorAll('rect.era-band')];

    function renderDetail(){
      // gate: only re-render when the selection has actually changed; saves a
      // KaTeX walk on every chip toggle and keystroke.
      if(state._renderedIdx === state.selectedIdx) return;
      state._renderedIdx = state.selectedIdx;
      if(state.selectedIdx < 0){
        detail.innerHTML = '<div class="empty">Pick a dot above. Use the chips to filter by era; type a name in the search box to spotlight matches.</div>';
        return;
      }
      const ev = events[state.selectedIdx];
      const era = eraById.get(ev.era);
      const eraColor = era ? era.color : 'var(--mute)';
      const peopleHtml = (ev.who || []).map(pid => {
        const p = personById.get(pid);
        if(!p) return '';
        const range = (p.birth ? fmtYear(p.birth) : '?') + '–' + (p.death ? fmtYear(p.death) : 'present');
        return `<span class="pill" style="border-color:${eraColor}">${htmlEscape(p.name)} <span style="color:var(--mute)">(${htmlEscape(range)})</span></span>`;
      }).filter(Boolean).join('');
      const place = (ev.city ? htmlEscape(ev.city) : '') + (ev.region ? `, ${htmlEscape(ev.region)}` : '');
      const linkHtml = ev.topicAnchor
        ? `<a class="ev-link" href="${htmlEscape(ev.topicAnchor)}">read the technical page →</a>` : '';
      detail.innerHTML =
        `<div><span class="ev-year" style="color:${eraColor}">${htmlEscape(ev.display || fmtYear(ev.year))}</span>` +
        `<span class="ev-title">${htmlEscape(ev.title)}</span></div>` +
        `<div class="ev-meta">${place ? `<span>${place}</span>`:''}${peopleHtml ? `<span>${peopleHtml}</span>`:''}</div>` +
        `<div class="ev-summary">${htmlEscape(ev.summary || '')}</div>` +
        linkHtml;
      // re-render KaTeX inside the detail
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

    function applyState(){
      const q = state.query.trim().toLowerCase();
      const filterActive = state.activeEras.size > 0;
      events.forEach((ev, i) => {
        const dot = dotNodes[i];
        let visible = !filterActive || state.activeEras.has(ev.era);
        // query matches title, summary, or any person name
        let match = false;
        if(q){
          const haystacks = [ev.title, ev.summary || '', ...((ev.who||[]).map(pid => (personById.get(pid)?.name||'')))];
          match = haystacks.some(h => h.toLowerCase().includes(q));
          visible = visible && match;
        }
        dot.classList.toggle('dim', !visible);
        dot.classList.toggle('match', !!q && match);
        dot.classList.toggle('selected', i === state.selectedIdx);
      });
      // band dimming: only highlight active eras when filters are on
      bandNodes.forEach(r => {
        const id = r.dataset.era;
        const dim = filterActive && !state.activeEras.has(id);
        r.classList.toggle('dim', dim);
      });
      // chip aria-pressed
      eraChips.forEach((c, id) => {
        const on = state.activeEras.has(id);
        c.classList.toggle('active', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      allBtn.classList.toggle('active', state.activeEras.size === 0);
      allBtn.setAttribute('aria-pressed', state.activeEras.size === 0 ? 'true' : 'false');
      renderDetail();
    }

    // ===== handlers =====
    dotNodes.forEach((g, i) => {
      const ev = events[i];
      const select = () => {
        state.selectedIdx = (state.selectedIdx === i) ? -1 : i;
        applyState();
        // Announce the first associated person (if any) on the cross-widget
        // bus so the map and lineage widgets can highlight matching surfaces.
        const firstPerson = (ev.who || [])[0] || null;
        if(window.MVHistoryBus){
          if(state.selectedIdx === i && firstPerson) window.MVHistoryBus.selectPerson(firstPerson);
          else window.MVHistoryBus.clearSelection();
        }
      };
      g.addEventListener('click', select);
      g.addEventListener('keydown', e => {
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); select(); }
      });
    });

    // Listen for cross-widget selections — pulse any dot whose event
    // includes the selected person.
    if(window.MVHistoryBus){
      window.MVHistoryBus.on('select-person', e => {
        const id = e.detail && e.detail.id;
        events.forEach((ev, i) => {
          const dot = dotNodes[i];
          const matches = id && (ev.who || []).indexOf(id) >= 0;
          dot.classList.toggle('bus-highlight', !!matches);
        });
      });
    }
    eraChips.forEach((c, id) => {
      c.addEventListener('click', () => {
        if(state.activeEras.has(id)) state.activeEras.delete(id);
        else state.activeEras.add(id);
        applyState();
      });
    });
    allBtn.addEventListener('click', () => {
      state.activeEras.clear();
      applyState();
    });
    search.addEventListener('input', () => {
      state.query = search.value;
      applyState();
    });

    // initial paint
    applyState();
  }

  window.MVHistoryTimeline = { init };
})();
