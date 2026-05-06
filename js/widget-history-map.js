/* widget-history-map.js
 *
 * The world map of mathematical breakthroughs on history.html.
 *
 * Equirectangular projection: x ∝ longitude, y ∝ -latitude.
 * Renders a faint lat/long graticule, very-rough continent silhouettes
 * (hand-traced low-poly outlines so we don't ship a topojson dep), and a
 * pin per (city) cluster — clicking a pin pops a card listing every event
 * at that city. Era chips below the map filter by era; double-clicking the
 * map background resets the selection.
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

  // viewBox dims. Equirectangular but we crop the polar regions so they
  // don't look like a weird ribbon across the top — there are no events
  // anywhere near the Arctic anyway.
  const VB_W = 1080, VB_H = 480;
  const MARGIN = 12;
  const projW = VB_W - 2*MARGIN;
  const projH = VB_H - 2*MARGIN;
  const LAT_MAX = 76, LAT_MIN = -56;
  const LAT_SPAN = LAT_MAX - LAT_MIN;
  function project(lng, lat){
    const x = MARGIN + (lng + 180) / 360 * projW;
    const y = MARGIN + (LAT_MAX - lat) / LAT_SPAN * projH;
    return [x, y];
  }

  // === continent silhouettes ===
  // Hand-traced low-poly outlines, [lng, lat] pairs, clockwise.
  // Goal is recognizability not cartographic accuracy.
  const CONTINENTS = [
    { id:'north-america', name:'North America', points:[
      [-168,66],[-156,71],[-140,70],[-125,72],[-110,73],[-95,76],[-82,82],[-72,80],
      [-60,75],[-55,68],[-52,60],[-58,52],[-65,46],[-66,44],[-70,42],[-77,35],
      [-81,31],[-82,25],[-90,22],[-98,21],[-103,22],[-107,25],[-115,29],[-117,32],
      [-122,37],[-124,42],[-130,55],[-138,58],[-148,60],[-162,62],[-168,66]
    ]},
    { id:'central-america', name:'Central America', points:[
      [-95,16],[-89,15],[-83,9],[-79,8],[-77,9],[-83,13],[-87,15],[-90,17],[-92,17],[-95,16]
    ]},
    { id:'south-america', name:'South America', points:[
      [-79,12],[-72,11],[-62,8],[-52,5],[-50,0],[-50,-5],[-43,-8],[-39,-13],[-39,-22],
      [-44,-23],[-48,-28],[-58,-35],[-62,-39],[-67,-46],[-71,-52],[-72,-55],[-70,-55],
      [-67,-49],[-67,-43],[-72,-37],[-72,-30],[-70,-22],[-71,-18],[-77,-10],[-79,-5],[-80,2],[-79,12]
    ]},
    { id:'europe', name:'Europe', points:[
      [-10,36],[0,36],[3,40],[12,38],[18,40],[28,40],[33,42],[39,46],[42,48],[42,52],
      [55,57],[60,67],[55,71],[40,71],[30,68],[25,65],[20,69],[10,65],[6,62],[5,58],
      [-2,52],[-5,52],[-9,55],[-10,52],[-5,46],[-9,42],[-10,36]
    ]},
    { id:'africa', name:'Africa', points:[
      [-17,21],[-16,28],[-10,35],[-5,35],[0,33],[10,32],[18,31],[24,32],[31,31],
      [33,29],[35,24],[39,16],[43,11],[46,7],[51,11],[51,5],[42,-1],[40,-9],
      [40,-15],[38,-20],[35,-23],[32,-28],[28,-32],[24,-34],[20,-35],[18,-33],
      [14,-25],[12,-20],[8,-14],[5,-7],[3,-2],[7,4],[3,7],[-7,5],[-12,9],
      [-17,13],[-17,21]
    ]},
    { id:'middle-east', name:'Middle East', points:[
      [33,29],[38,24],[44,18],[50,15],[55,18],[58,22],[57,26],[51,30],[48,30],
      [46,38],[40,40],[34,36],[33,29]
    ]},
    { id:'asia', name:'Asia', points:[
      [42,52],[55,57],[60,67],[75,72],[100,77],[120,75],[140,75],[155,72],[165,68],
      [175,68],[180,68],[180,60],[170,60],[160,60],[152,55],[142,52],[135,42],
      [126,40],[125,32],[120,22],[110,18],[105,8],[97,5],[100,12],[97,16],
      [95,22],[88,21],[78,8],[73,15],[68,23],[65,25],[60,25],[58,30],[60,40],
      [50,42],[44,40],[44,44],[55,48],[48,52],[42,52]
    ]},
    { id:'india', name:'India', points:[
      [70,28],[75,30],[80,30],[85,26],[90,22],[88,21],[85,20],[80,15],[78,10],
      [76,9],[73,15],[70,20],[68,23],[70,28]
    ]},
    { id:'southeast-asia', name:'SE Asia', points:[
      [97,22],[105,21],[108,15],[107,8],[100,2],[100,-2],[107,-2],[114,-3],
      [118,-7],[125,-9],[136,-7],[140,-5],[140,0],[131,2],[126,3],[122,1],
      [120,8],[125,12],[122,18],[112,15],[105,8],[97,16],[97,22]
    ]},
    { id:'japan', name:'Japan', points:[
      [130,32],[136,34],[140,38],[145,42],[143,45],[140,40],[136,36],[131,33],[130,32]
    ]},
    { id:'australia', name:'Australia', points:[
      [113,-22],[116,-32],[122,-34],[130,-32],[138,-35],[145,-39],[150,-37],
      [152,-25],[146,-19],[143,-13],[138,-12],[130,-12],[125,-14],[122,-17],[115,-19],[113,-22]
    ]},
    { id:'new-zealand', name:'NZ', points:[
      [167,-46],[170,-46],[175,-41],[178,-37],[173,-36],[168,-43],[167,-46]
    ]},
    { id:'greenland', name:'Greenland', points:[
      [-55,82],[-25,82],[-15,77],[-22,68],[-40,60],[-50,62],[-55,68],[-55,82]
    ]},
    { id:'british-isles', name:'British Isles', points:[
      [-10,55],[-6,58],[-3,58],[-1,53],[1,52],[-4,50],[-5,52],[-9,52],[-10,55]
    ]},
    { id:'arabian', name:'Arabia', points:[
      [35,30],[45,30],[55,26],[58,22],[55,16],[51,13],[45,12],[40,17],[35,20],[33,23],[35,30]
    ]}
  ];

  // continent label centers (lng, lat) — placed off the dense pin clusters
  // so the labels don't fight the data.
  const CONTINENT_LABELS = [
    { name:'NORTH AMERICA', lng:-100, lat:55 },
    { name:'SOUTH AMERICA', lng:-58,  lat:-15 },
    { name:'EUROPE',        lng:  6,  lat:62 },
    { name:'AFRICA',        lng: 22,  lat:  5 },
    { name:'ASIA',          lng: 90,  lat:55 },
    { name:'AUSTRALIA',     lng:135,  lat:-25 },
    { name:'INDIA',         lng: 80,  lat:23, small:true },
    { name:'CHINA',         lng:108,  lat:35, small:true }
  ];

  function continentPath(points){
    const projected = points.map(([lng, lat]) => project(lng, lat));
    let d = `M${projected[0][0].toFixed(1)} ${projected[0][1].toFixed(1)}`;
    for(let i = 1; i < projected.length; i++){
      d += ` L${projected[i][0].toFixed(1)} ${projected[i][1].toFixed(1)}`;
    }
    d += ' Z';
    return d;
  }

  // === pin clustering: events at same city → one pin ===
  function clusterEvents(events){
    const map = new Map();
    for(const ev of events){
      const key = `${(ev.city||'').toLowerCase()}|${ev.lat||0}|${ev.lng||0}`;
      if(!map.has(key)) map.set(key, { city:ev.city, region:ev.region, lat:ev.lat, lng:ev.lng, events:[] });
      map.get(key).events.push(ev);
    }
    return [...map.values()];
  }

  // === init ===
  function init(host, data){
    if(!host){
      console.warn('widget-history-map: init called with no host element');
      return;
    }
    if(!data || !Array.isArray(data.eras) || data.eras.length === 0){
      // Surface a visible failure rather than rendering a dead chip row +
      // toggle that no-ops silently. The "All eras" three-state toggle in
      // particular degrades to a permanent no-op if `eras` is empty.
      console.warn('widget-history-map: data.eras missing or empty; widget cannot render');
      host.innerHTML = '<div class="bad" role="alert">World-map data unavailable: era palette missing.</div>';
      return;
    }
    const eras = data.eras;
    const events = (data.events || []).filter(e => Number.isFinite(e.lat) && Number.isFinite(e.lng));
    const eraById = new Map(eras.map(e => [e.id, e]));
    const personById = new Map((data.people||[]).map(p => [p.id, p]));

    host.innerHTML = '';
    const hd = document.createElement('div');
    hd.className = 'hd';
    hd.innerHTML = '<div class="ttl">World map of mathematical breakthroughs</div><div class="hint">Click a pin · multi-event clusters fan their rings by era, oldest at the centre</div>';
    host.appendChild(hd);

    // chip row
    const ctrls = document.createElement('div');
    ctrls.className = 'timeline-controls';
    const allBtn = document.createElement('button');
    allBtn.className = 'era-chip active';
    allBtn.textContent = 'All eras';
    allBtn.setAttribute('aria-pressed','true');
    ctrls.appendChild(allBtn);
    const eraChips = new Map();
    for(const era of eras){
      const c = document.createElement('button');
      c.className = 'era-chip';
      c.style.setProperty('--era-color', era.color);
      c.innerHTML = `<i></i><span>${htmlEscape(era.label)}</span>`;
      c.dataset.era = era.id;
      c.setAttribute('aria-pressed', 'false');
      eraChips.set(era.id, c);
      ctrls.appendChild(c);
    }
    host.appendChild(ctrls);

    // svg
    const wrap = document.createElement('div');
    wrap.className = 'map-svg-wrap';
    const svg = el('svg', {
      'class':'map',
      viewBox:`0 0 ${VB_W} ${VB_H}`,
      preserveAspectRatio:'xMidYMid meet',
      role:'img',
      'aria-label':'World map of mathematical breakthrough locations'
    });
    wrap.appendChild(svg);
    host.appendChild(wrap);

    // detail card (re-uses tl-detail styling)
    const detail = document.createElement('div');
    detail.className = 'tl-detail';
    detail.id = 'map-detail';
    detail.setAttribute('aria-live','polite');
    detail.innerHTML = '<div class="empty">Pick a pin above. Each pin colors itself by the era of the most recent breakthrough at that city.</div>';
    host.appendChild(detail);

    // === graticule (faint lat/long lines) ===
    const grat = el('g', { 'class':'graticule' });
    for(let lng = -150; lng <= 150; lng += 30){
      const [x0, y0] = project(lng, LAT_MAX);
      const [x1, y1] = project(lng, LAT_MIN);
      grat.appendChild(el('line', { x1:x0, y1:y0, x2:x1, y2:y1, stroke:'currentColor' }));
    }
    for(let lat = -45; lat <= 60; lat += 15){
      if(lat === 0) continue;
      const [x0, y0] = project(-180, lat);
      const [x1, y1] = project(180, lat);
      grat.appendChild(el('line', { x1:x0, y1:y0, x2:x1, y2:y1, stroke:'currentColor' }));
    }
    svg.appendChild(grat);

    // equator
    const [exa, eya] = project(-180, 0);
    const [exb, eyb] = project(180, 0);
    svg.appendChild(el('line', { 'class':'equator', x1:exa, y1:eya, x2:exb, y2:eyb }));

    // === continents ===
    for(const c of CONTINENTS){
      svg.appendChild(el('path', {
        'class':'continent',
        d: continentPath(c.points)
      }));
    }
    // continent labels
    for(const cl of CONTINENT_LABELS){
      const [x, y] = project(cl.lng, cl.lat);
      const t = el('text', {
        x, y, 'text-anchor':'middle',
        'font-size': cl.small ? 10 : 13,
        'font-weight': cl.small ? 400 : 600,
        fill:'var(--mute)', opacity: cl.small ? 0.45 : 0.7,
        'letter-spacing': '0.08em'
      });
      t.textContent = cl.name;
      svg.appendChild(t);
    }

    // === pins ===
    const clusters = clusterEvents(events);
    const pinNodes = [];
    clusters.forEach((cl, i) => {
      // Sort cluster events oldest → newest. Concentric arcs from inside
      // out: oldest event sits in the centre, newest takes the outer ring.
      // Cluster's "selected" colour (used for outline + filter logic) =
      // the era of the most recent event.
      const oldestFirst = cl.events.slice().sort((a,b) => a.year - b.year);
      const newestEra = oldestFirst[oldestFirst.length - 1].era;
      const newestEraObj = eraById.get(newestEra);
      const newestColor = newestEraObj ? newestEraObj.color : 'var(--mute)';
      const [x, y] = project(cl.lng, cl.lat);
      const g = el('g', {
        'class':'pin',
        transform:`translate(${x.toFixed(1)},${y.toFixed(1)})`,
        tabindex: 0,
        role:'button',
        'aria-label':`${cl.city||'Unknown'}: ${cl.events.length} event${cl.events.length>1?'s':''}`
      });
      g.dataset.idx = i;
      g.dataset.naturalColor = newestColor;
      g.style.setProperty('--era-color', newestColor);
      // Pin size: scales with sqrt(count), capped at 11px outer radius.
      const rOuter = Math.min(11, 4.5 + Math.sqrt(cl.events.length) * 1.6);
      if(cl.events.length === 1){
        // Single-event cluster: one filled disc, classic pin look. Tagged
        // with `data-era` so era-filter highlighting can target it the same
        // way it targets the rings of multi-event clusters.
        g.appendChild(el('circle', {
          r: rOuter, cx: 0, cy: 0, fill: newestColor,
          'data-era': newestEra,
        }));
      } else {
        // Multi-event cluster: render concentric discs, oldest era at the
        // centre, each newer event painted as a slightly larger ring.
        // Distinct eras only — duplicates (e.g. Paris with 4 enlightenment
        // events) collapse to one band so the pin shows era diversity not
        // event count. Each ring carries `data-era` so a single-era filter
        // can light up the matching ring while fading the rest, instead of
        // relying on a per-pin halo (which leaves multi-era clusters
        // visually indistinguishable on filter).
        const distinctEras = [];
        for(const ev of oldestFirst){
          if(!distinctEras.length || distinctEras[distinctEras.length-1] !== ev.era){
            distinctEras.push(ev.era);
          }
        }
        // Map each era to a radius growing from the centre outward.
        const rInnerMin = 2.2;
        const step = (rOuter - rInnerMin) / Math.max(1, distinctEras.length);
        // Render outermost ring first (largest disc) so inner discs paint on top.
        for(let k = distinctEras.length - 1; k >= 0; k--){
          const eraObj = eraById.get(distinctEras[k]);
          const c = eraObj ? eraObj.color : 'var(--mute)';
          const r = rInnerMin + step * (k + 1);
          g.appendChild(el('circle', {
            r: r, cx: 0, cy: 0, fill: c,
            'data-era': distinctEras[k],
          }));
        }
      }
      // tiny event-count badge under multi-event clusters
      if(cl.events.length > 1){
        g.appendChild(el('text', {
          x:0, y:rOuter + 11, 'text-anchor':'middle',
          'font-size':9, fill:'var(--ink)',
          'paint-order':'stroke', stroke:'#0b0f16', 'stroke-width':2.5
        })).textContent = String(cl.events.length);
      }
      g.appendChild(el('title')).textContent = `${cl.city||''} (${cl.events.length} event${cl.events.length>1?'s':''})`;
      svg.appendChild(g);
      pinNodes.push(g);
    });

    // === legend ===
    const legend = document.createElement('div');
    legend.className = 'map-legend';
    for(const era of eras){
      const sp = document.createElement('span');
      sp.style.setProperty('--era-color', era.color);
      sp.innerHTML = `<i></i>${htmlEscape(era.label)}`;
      legend.appendChild(sp);
    }
    host.appendChild(legend);

    // === state ===
    const state = { activeEras: new Set(), selectedIdx: -1, _renderedIdx: -2 };

    function renderDetail(){
      // gate: only re-render when the selection has actually changed.
      if(state._renderedIdx === state.selectedIdx) return;
      state._renderedIdx = state.selectedIdx;
      if(state.selectedIdx < 0){
        detail.innerHTML = '<div class="empty">Pick a pin above. Each pin colors itself by the era of the most recent breakthrough at that city.</div>';
        return;
      }
      const cl = clusters[state.selectedIdx];
      const head = `<div><span class="ev-year" style="color:var(--era-color, var(--yellow))">${htmlEscape(cl.city||'?')}</span><span class="ev-title">${htmlEscape(cl.region||'')}</span></div>`;
      const evRows = cl.events.slice().sort((a,b) => a.year - b.year).map(ev => {
        const era = eraById.get(ev.era);
        const eraColor = era ? era.color : 'var(--mute)';
        const peoplePills = (ev.who||[]).map(pid => {
          const p = personById.get(pid);
          return p ? `<span class="pill" style="border-color:${eraColor}">${htmlEscape(p.name)}</span>` : '';
        }).filter(Boolean).join(' ');
        const link = ev.topicAnchor
          ? ` <a class="ev-link" style="display:inline-block;margin-left:.4rem;font-size:.85rem" href="${htmlEscape(ev.topicAnchor)}">→ technical page</a>` : '';
        return `<div style="margin:.45rem 0;padding-left:.6rem;border-left:2px solid ${eraColor}">`+
          `<span class="pill" style="background:transparent;border-color:${eraColor};color:${eraColor};font-variant-numeric:tabular-nums">${htmlEscape(ev.display||fmtYear(ev.year))}</span> `+
          `<b style="color:#fff">${htmlEscape(ev.title)}</b><br>`+
          `<span style="color:var(--mute);font-size:.9rem">${htmlEscape(ev.summary||'')}</span> `+
          `${peoplePills} ${link}` +
          `</div>`;
      }).join('');
      detail.innerHTML = head + evRows;
      // re-render KaTeX
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
      const filterActive = state.activeEras.size > 0;
      // When a single era is selected, the halo should match that era for
      // every visible pin — not the pin's "newest era" color, which would
      // leak through unrelated eras' tints. We override --era-color on the
      // pin's <g> for the duration of the single-era filter, then restore
      // the cached natural color when the filter is cleared or broadened.
      const singleEra = state.activeEras.size === 1
        ? eraById.get(Array.from(state.activeEras)[0])
        : null;
      pinNodes.forEach((p, i) => {
        const cl = clusters[i];
        let visible = !filterActive;
        if(filterActive){
          for(const ev of cl.events){
            if(state.activeEras.has(ev.era)){ visible = true; break; }
          }
        }
        p.classList.toggle('dim', !visible);
        p.classList.toggle('selected', i === state.selectedIdx);
        if(singleEra && visible){
          p.style.setProperty('--era-color', singleEra.color);
        } else {
          p.style.setProperty('--era-color', p.dataset.naturalColor || 'var(--mute)');
        }
        // Per-ring highlighting: in filter mode, light up the rings that
        // match an active era and fade the rest, so a 5-era city under
        // "ancient" filter shows just the ancient ring popping. Without
        // this, the per-pin halo paints every concentric ring the same
        // and the user can't tell which event is the relevant one.
        const circles = p.querySelectorAll('circle[data-era]');
        if(filterActive && visible){
          circles.forEach(c => {
            const ce = c.getAttribute('data-era');
            const isMatch = state.activeEras.has(ce);
            c.classList.toggle('era-match', isMatch);
            c.classList.toggle('era-fade', !isMatch);
          });
        } else {
          circles.forEach(c => {
            c.classList.remove('era-match', 'era-fade');
          });
        }
      });
      // Mark the SVG itself when a filter is active so the
      // `.map[data-era-filter] .pin:not(.dim) circle` rule paints a soft
      // era-color halo on the active pins. Each pin's `<g>` already carries
      // `--era-color`, so the halo color is per-pin via inheritance.
      if (filterActive) {
        svg.setAttribute('data-era-filter', '1');
      } else {
        svg.removeAttribute('data-era-filter');
      }
      eraChips.forEach((c, id) => {
        const on = state.activeEras.has(id);
        c.classList.toggle('active', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      allBtn.classList.toggle('active', state.activeEras.size === 0);
      allBtn.setAttribute('aria-pressed', state.activeEras.size === 0 ? 'true' : 'false');
      renderDetail();
    }

    pinNodes.forEach((g, i) => {
      const select = () => {
        state.selectedIdx = (state.selectedIdx === i) ? -1 : i;
        applyState();
        // Cross-widget broadcast: if the cluster has a single primary person
        // or every event shares a person, highlight them on other surfaces.
        if(window.MVHistoryBus){
          if(state.selectedIdx === i){
            const cl = clusters[i];
            const personSet = new Set();
            cl.events.forEach(ev => (ev.who||[]).forEach(p => personSet.add(p)));
            // Just emit the most-recent event's first person, if any.
            const sorted = cl.events.slice().sort((a,b) => b.year - a.year);
            const primary = (sorted[0].who || [])[0] || null;
            if(primary) window.MVHistoryBus.selectPerson(primary);
            else window.MVHistoryBus.clearSelection();
          } else {
            window.MVHistoryBus.clearSelection();
          }
        }
      };
      g.addEventListener('click', select);
      g.addEventListener('keydown', e => {
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); select(); }
      });
    });

    // Listen for cross-widget selections — pulse any pin whose cluster
    // contains an event involving the selected person.
    if(window.MVHistoryBus){
      window.MVHistoryBus.on('select-person', e => {
        const id = e.detail && e.detail.id;
        pinNodes.forEach((p, i) => {
          const cl = clusters[i];
          const matches = id && cl.events.some(ev => (ev.who || []).indexOf(id) >= 0);
          p.classList.toggle('bus-highlight', !!matches);
        });
      });

      // Scrub-year: fade pins to 18% opacity unless their cluster contains
      // an event within ±SCRUB_WINDOW years of the cursor. year=null
      // restores everything.
      const SCRUB_WINDOW = 60;
      window.MVHistoryBus.on('scrub-year', e => {
        const yr = e.detail && e.detail.year;
        pinNodes.forEach((p, i) => {
          if(yr == null){
            p.classList.remove('scrub-out');
            return;
          }
          const cl = clusters[i];
          const hit = cl.events.some(ev => Math.abs(ev.year - yr) <= SCRUB_WINDOW);
          p.classList.toggle('scrub-out', !hit);
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
      // Three-state toggle — clicking "All eras" cycles between
      //   (a) no filter (every pin in its natural color)
      //   (b) all-eras-active (every pin glows in its newest-era color
      //       with the strong era-match halo)
      // depending on the current state. From any partial selection the
      // first click clears; from cleared state the click activates all
      // 9 eras at once so the user can compare the full geographic
      // distribution of activity.
      if (state.activeEras.size === 0) {
        for (const era of eras) state.activeEras.add(era.id);
      } else {
        state.activeEras.clear();
      }
      applyState();
    });
    svg.addEventListener('dblclick', e => {
      if(e.target === svg || e.target.classList.contains('continent') || e.target.tagName === 'line'){
        state.selectedIdx = -1;
        applyState();
      }
    });

    applyState();
  }

  window.MVHistoryMap = { init };
})();
