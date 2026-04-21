/*
 * widget-counterexample-generator.js
 *
 * MVCounterexampleGenerator — a reusable widget for exploring pathological
 * topologies on a finite space. The learner toggles subsets to declare them
 * open; the widget (a) closes the selection under finite intersection and
 * arbitrary union (finite here, since the space itself is finite), then
 * (b) checks which separation axioms and global properties hold.
 *
 * Set encoding. A subset of an n-point space is a bitmask 0..(1<<n)-1; bit i
 * is set iff the i-th point (by index into the declared `space` array) is
 * in the subset. Unions are bitwise OR; intersections are bitwise AND;
 * complements are XOR with the universe mask. This makes the closure loop
 * and every axiom check a handful of integer ops, no Set<Set> nesting.
 *
 * Enforcement strategy. Every click toggles a subset into the current
 * "seed" set S. Before checks run, we normalize S by adding the empty set
 * and the full space, then closing under pairwise union and pairwise
 * intersection to a fixed point. That canonical topology is what we
 * display as highlighted cells and feed to the axiom checks.
 *
 * Axiom checks (T0, T1, T2) are quantifier-for-quantifier translations of
 * their textbook definitions; they iterate over pairs of points. Compact
 * is trivially true on a finite space (any cover has finite subcovers —
 * the cover itself is finite). "Connected" tests for a clopen partition:
 * an open U with 0<U<full whose complement is also open. "Discrete" tests
 * that every singleton is open.
 */
(function(global){
  'use strict';

  // ------- encoding helpers -------
  function maskFromSubset(subset, space){
    // subset: array of point names; returns bitmask
    let m = 0;
    for(const p of subset){
      const i = space.indexOf(p);
      if(i < 0) continue;
      m |= (1 << i);
    }
    return m;
  }
  function subsetFromMask(mask, space){
    const out = [];
    for(let i=0;i<space.length;i++) if(mask & (1<<i)) out.push(space[i]);
    return out;
  }
  function formatMask(mask, space){
    if(mask === 0) return '∅';
    const pts = subsetFromMask(mask, space);
    return '{' + pts.join(',') + '}';
  }
  function popcount(m){
    let c=0; while(m){ c += m & 1; m >>>= 1; } return c;
  }

  // Parse "ab" or "" or ["a","b"] or bitmask number into a bitmask.
  function coerceToMask(x, space){
    if(typeof x === 'number') return x;
    if(Array.isArray(x)) return maskFromSubset(x, space);
    if(typeof x === 'string'){
      if(x === '' || x === '∅') return 0;
      // split into single-char tokens that match a space element;
      // fall back to splitting by commas/spaces for multi-char names.
      if(space.every(s => s.length === 1)){
        return maskFromSubset([...x], space);
      }
      return maskFromSubset(x.split(/[\s,]+/).filter(Boolean), space);
    }
    return 0;
  }

  // ------- closure under finite union + finite intersection -------
  function closeTopology(seedMasks, universeMask){
    const S = new Set(seedMasks);
    S.add(0);
    S.add(universeMask);
    // Fixed-point loop: at each pass, add all pairwise unions and
    // intersections. On a finite space this converges in O(log|S|) passes
    // because the lattice of subsets of 2^X is finite.
    let grew = true;
    while(grew){
      grew = false;
      const arr = [...S];
      for(let i=0;i<arr.length;i++){
        for(let j=i;j<arr.length;j++){
          const u = arr[i] | arr[j];
          const v = arr[i] & arr[j];
          if(!S.has(u)){ S.add(u); grew = true; }
          if(!S.has(v)){ S.add(v); grew = true; }
        }
      }
    }
    return S;
  }

  // ------- axiom / property checks -------
  // Each returns { ok: bool, why: string } so the UI can explain failures.

  function checkT0(opens, n){
    // T0: for every pair i != j, some open contains exactly one.
    for(let i=0;i<n;i++){
      for(let j=i+1;j<n;j++){
        const bi = 1<<i, bj = 1<<j;
        let sep = false;
        for(const U of opens){
          const hasI = (U & bi) !== 0;
          const hasJ = (U & bj) !== 0;
          if(hasI !== hasJ){ sep = true; break; }
        }
        if(!sep) return { ok:false, i, j };
      }
    }
    return { ok:true };
  }

  function checkT1(opens, n){
    // T1: for every ordered pair i != j, some open contains i but not j.
    // Equivalent to: every singleton is closed.
    for(let i=0;i<n;i++){
      for(let j=0;j<n;j++){
        if(i === j) continue;
        const bi = 1<<i, bj = 1<<j;
        let sep = false;
        for(const U of opens){
          if((U & bi) && !(U & bj)){ sep = true; break; }
        }
        if(!sep) return { ok:false, i, j };
      }
    }
    return { ok:true };
  }

  function checkT2(opens, n){
    // T2 (Hausdorff): for every i != j there exist disjoint opens
    // U ∋ i, V ∋ j with U ∩ V = ∅.
    for(let i=0;i<n;i++){
      for(let j=i+1;j<n;j++){
        const bi = 1<<i, bj = 1<<j;
        let sep = false;
        outer:
        for(const U of opens){
          if(!(U & bi)) continue;
          for(const V of opens){
            if(!(V & bj)) continue;
            if((U & V) === 0){ sep = true; break outer; }
          }
        }
        if(!sep) return { ok:false, i, j };
      }
    }
    return { ok:true };
  }

  function checkConnected(opens, universe){
    // Connected: no nontrivial clopen partition. That is: no open U with
    // 0 < U < universe and universe \ U also open.
    for(const U of opens){
      if(U === 0 || U === universe) continue;
      const comp = universe & ~U;
      if(opens.has(comp)) return { ok:false, U, comp };
    }
    return { ok:true };
  }

  function checkCompact(_opens, _universe){
    // Any finite topological space is compact: any open cover is a finite
    // set of sets and is already its own finite subcover. We return the
    // tautology so the UI can display it; this is a helpful reminder that
    // compactness is "free" on finite spaces and the sharp counterexamples
    // live elsewhere (cofinite R, etc.).
    return { ok:true, trivial:true };
  }

  function checkDiscrete(opens, n){
    // Discrete: every singleton is open.
    for(let i=0;i<n;i++){
      if(!opens.has(1<<i)) return { ok:false, i };
    }
    return { ok:true };
  }

  const CHECKS = {
    T0: { label:'T₀', run: checkT0,
      why: (r, space) => `points ${space[r.i]} and ${space[r.j]} are topologically indistinguishable — every open either contains both or neither.` },
    T1: { label:'T₁', run: checkT1,
      why: (r, space) => `no open separates ${space[r.i]} from ${space[r.j]}: no open contains ${space[r.i]} but excludes ${space[r.j]}, so {${space[r.i]}} is not closed.` },
    T2: { label:'T₂', run: checkT2,
      why: (r, space) => `Hausdorff fails at ${space[r.i]}, ${space[r.j]}: every open around ${space[r.i]} meets every open around ${space[r.j]}.` },
    connected: { label:'connected', run: (opens, n, universe) => checkConnected(opens, universe),
      why: (r, space) => `the clopen set ${formatMask(r.U, space)} and its complement ${formatMask(r.comp, space)} are both open — a disconnection.` },
    compact: { label:'compact', run: (opens, n, universe) => checkCompact(opens, universe),
      why: (_r) => `finite spaces are always compact (any cover is finite).` },
    discrete: { label:'discrete', run: checkDiscrete,
      why: (r, space) => `the singleton {${space[r.i]}} is not open.` },
  };

  // ------- UI -------

  // Pick up to `limit` "most useful" nontrivial subsets to display as
  // toggle cells. We include: all singletons, all doubletons, then
  // triples, etc., stopping once we hit the limit. Empty set and full
  // space are added to the topology automatically and not surfaced.
  function chooseDisplayMasks(n, limit){
    const all = [];
    for(let m=1; m < (1<<n); m++){
      if(m === (1<<n)-1) continue; // skip full
      all.push(m);
    }
    all.sort((a,b) => popcount(a) - popcount(b) || a - b);
    return all.slice(0, limit);
  }

  function init(selector, cfg){
    const root = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if(!root) return null;

    const space = (cfg && cfg.space) ? cfg.space.slice() : ['a','b','c','d'];
    const n = space.length;
    const universe = (1<<n) - 1;
    const checks = (cfg && cfg.checks) ? cfg.checks.slice() : ['T0','T1','T2','connected','compact','discrete'];
    const presets = (cfg && cfg.presets) ? cfg.presets : [];
    const displayLimit = Math.min(cfg && cfg.displayLimit || 10, (1<<n) - 2);

    // The "seed" — user-toggled subsets. We close this set on every render.
    let seed = new Set();

    // ---- build DOM ----
    root.innerHTML = '';
    root.classList.add('widget');

    const hd = document.createElement('div');
    hd.className = 'hd';
    hd.innerHTML = `<div class="ttl">Counterexample generator</div><div class="hint">toggle opens on X = {${space.join(',')}} · axioms update live</div>`;
    root.appendChild(hd);

    // Presets row
    if(presets.length){
      const prow = document.createElement('div');
      prow.className = 'row';
      const plabel = document.createElement('span');
      plabel.style.color = 'var(--mute)';
      plabel.style.fontSize = '.85rem';
      plabel.textContent = 'presets:';
      prow.appendChild(plabel);
      presets.forEach(p => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = p.name;
        btn.addEventListener('click', () => loadPreset(p));
        prow.appendChild(btn);
      });
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.textContent = 'clear';
      clear.addEventListener('click', () => { seed = new Set(); render(); });
      prow.appendChild(clear);
      root.appendChild(prow);
    }

    // Utility row
    const urow = document.createElement('div');
    urow.className = 'row';
    const bAllSingles = document.createElement('button');
    bAllSingles.type = 'button';
    bAllSingles.textContent = 'include all singletons';
    bAllSingles.addEventListener('click', () => {
      for(let i=0;i<n;i++) seed.add(1<<i);
      render();
    });
    urow.appendChild(bAllSingles);
    const bComplements = document.createElement('button');
    bComplements.type = 'button';
    bComplements.textContent = 'include complements';
    bComplements.addEventListener('click', () => {
      // Snapshot so we don't iterate while mutating.
      const snap = [...seed];
      for(const m of snap){
        if(m !== 0 && m !== universe) seed.add(universe & ~m);
      }
      render();
    });
    urow.appendChild(bComplements);
    root.appendChild(urow);

    // Toggle grid
    const grid = document.createElement('div');
    grid.className = 'row';
    grid.style.marginTop = '.4rem';
    grid.style.flexWrap = 'wrap';
    root.appendChild(grid);

    const displayMasks = chooseDisplayMasks(n, displayLimit);

    // Build one button per displayed subset. Clicking toggles its
    // membership in the seed. Buttons show an inline "in τ" tag when
    // the subset ends up open after closure (which includes subsets the
    // user didn't click but are forced in by unions/intersections).
    const cellButtons = new Map();
    displayMasks.forEach(m => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.mask = String(m);
      btn.textContent = formatMask(m, space);
      btn.addEventListener('click', () => {
        if(seed.has(m)) seed.delete(m); else seed.add(m);
        render();
      });
      cellButtons.set(m, btn);
      grid.appendChild(btn);
    });

    // Topology readout + checks
    const topoOut = document.createElement('div');
    topoOut.className = 'readout';
    topoOut.style.marginTop = '.6rem';
    root.appendChild(topoOut);

    const checksOut = document.createElement('div');
    checksOut.style.marginTop = '.6rem';
    checksOut.style.display = 'grid';
    checksOut.style.gridTemplateColumns = 'repeat(auto-fit, minmax(240px, 1fr))';
    checksOut.style.gap = '.4rem';
    root.appendChild(checksOut);

    function loadPreset(p){
      const sp = p.space || space;
      if(sp.length !== n || sp.some((x,i) => x !== space[i])){
        // Preset targets a different underlying set; ignore rather than
        // corrupt — the caller declared a fixed `space` in init().
        return;
      }
      seed = new Set();
      (p.opens || []).forEach(o => {
        const m = coerceToMask(o, space);
        if(m >= 0 && m <= universe) seed.add(m);
      });
      render();
    }

    function render(){
      const opens = closeTopology([...seed], universe);

      // Mark seed buttons active; mark forced-in opens with a tint.
      cellButtons.forEach((btn, m) => {
        btn.classList.toggle('active', seed.has(m));
        if(!seed.has(m) && opens.has(m)){
          btn.style.borderColor = 'var(--cyan)';
          btn.style.color = 'var(--cyan)';
          btn.title = 'forced into τ by unions/intersections';
        } else {
          btn.style.borderColor = '';
          btn.style.color = '';
          btn.title = '';
        }
      });

      // Topology listing — sort by size, then numerically for stable output.
      const list = [...opens].sort((a,b) => popcount(a)-popcount(b) || a-b)
        .map(m => formatMask(m, space));
      topoOut.textContent = `τ = { ${list.join(', ')} }   (${opens.size} opens)`;

      // Run each requested check.
      checksOut.innerHTML = '';
      checks.forEach(key => {
        const spec = CHECKS[key];
        if(!spec) return;
        const r = spec.run(opens, n, universe);
        const row = document.createElement('div');
        row.style.padding = '.35rem .6rem';
        row.style.borderRadius = '6px';
        row.style.border = '1px solid var(--line)';
        row.style.background = r.ok ? 'rgba(131,193,103,0.08)' : 'rgba(224,122,95,0.10)';
        row.style.color = r.ok ? 'var(--green)' : 'var(--pink)';
        row.style.fontFamily = 'ui-monospace, monospace';
        row.style.fontSize = '.9rem';
        const mark = r.ok ? '✓' : '✗';
        const why = r.ok
          ? (r.trivial ? ' — ' + spec.why(r, space) : '')
          : ' — ' + spec.why(r, space);
        row.textContent = `${mark} ${spec.label}${why}`;
        checksOut.appendChild(row);
      });
    }

    // Load the first preset on init if one is provided and none other
    // state was passed; this gives users a non-empty starting point.
    if(presets.length && cfg && cfg.autoloadFirst !== false){
      loadPreset(presets[0]);
    } else {
      render();
    }

    return {
      loadPreset,
      setSeed(masks){
        seed = new Set(masks.map(x => coerceToMask(x, space)));
        render();
      },
      getState(){
        return { seed: [...seed], opens: [...closeTopology([...seed], universe)] };
      }
    };
  }

  global.MVCounterexampleGenerator = { init, _internal: {
    closeTopology, checkT0, checkT1, checkT2, checkConnected,
    checkCompact, checkDiscrete, maskFromSubset, coerceToMask
  }};
})(typeof window !== 'undefined' ? window : globalThis);
