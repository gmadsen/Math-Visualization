// Modular-arithmetic-clock widget. Visualizes arithmetic in Z/n on a
// circular dial of n equally-spaced points labelled 0..n-1.
//
// Two interaction modes selected by `config.kind`:
//
//   'addition'       — sliders for n, a, b. Draws an arrow from 0 to a
//                      (color A), then from a to (a+b) mod n (color B),
//                      and highlights the result point. Readout shows
//                      a + b ≡ (a+b) mod n  (mod n).
//
//   'multiplication' — sliders for n and a. Draws every arrow
//                      k -> (k·a) mod n, colored by cycle. Reports
//                      gcd(a, n), distinguishing the unit case
//                      (gcd = 1, every cycle has length ord_n(a)) from
//                      the zero-divisor case (image collapses).
//
// Usage (called from a topic page):
//
//   MVModularArithmeticClock.init('#w-clock', {
//     kind: 'addition',                 // 'addition' | 'multiplication'
//     params: { n: 12, a: 5, b: 4 },
//     title: 'Clock arithmetic in Z/12',
//     hint:  'drag a and b',
//     viewBox: '0 0 320 320'            // default
//   });
//
// Dependencies: none. Plain SVG + DOM. Uses var(--blue), var(--yellow),
// var(--pink), var(--mute), var(--ink), var(--panel2), var(--green) for
// theme consistency.

(function (global) {
  const SVGNS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs) {
    const e = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === 'class') e.className = attrs[k];
        else if (k === 'style') e.setAttribute('style', attrs[k]);
        else e.setAttribute(k, attrs[k]);
      }
    }
    if (children) {
      for (const c of children) {
        if (c == null) continue;
        e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      }
    }
    return e;
  }

  function gcd(a, b) {
    a = Math.abs(a | 0); b = Math.abs(b | 0);
    while (b) { const t = b; b = a % b; a = t; }
    return a;
  }
  function mod(a, n) {
    return ((a % n) + n) % n;
  }
  // Decompose Z/n under k -> a·k mod n into disjoint cycles. Returns
  // an array of cycles; each cycle is an array of integers in [0,n-1]
  // listed in traversal order (k, a·k, a²·k, ...).
  function multCycles(a, n) {
    const seen = new Uint8Array(n);
    const cycles = [];
    for (let k = 0; k < n; k++) {
      if (seen[k]) continue;
      const cyc = [];
      let x = k;
      // Walk until we hit a value already in this cycle. For multiplication
      // by a fixed `a`, every orbit is "rho-shaped"; the cycle is the
      // tail-free portion. We track each visited value to detect the
      // first repeat.
      const local = new Map();
      while (!local.has(x)) {
        local.set(x, cyc.length);
        cyc.push(x);
        seen[x] = 1;
        x = mod(x * a, n);
      }
      // Drop the tail before the first repeat so we report only the cycle.
      const cycleStart = local.get(x);
      cycles.push(cyc.slice(cycleStart));
      // Mark anything in the tail as seen too (already done above).
    }
    return cycles;
  }

  // The kinds catalog. Each entry exposes:
  //   defaults : starting param values.
  //   sliders  : [{ key, label, min, max, step }] — `max` may be a function
  //              of the current params (e.g. a < n).
  //   render   : (svg, params, ctx) -> { readoutHTML }
  const KINDS = {
    addition: {
      defaults: { n: 12, a: 5, b: 4 },
      sliders: [
        { key: 'n', label: 'n', min: 2, max: 36, step: 1 },
        { key: 'a', label: 'a', min: 0, maxOf: (p) => p.n - 1, step: 1 },
        { key: 'b', label: 'b', min: 0, maxOf: (p) => p.n - 1, step: 1 },
      ],
      render(svg, p, ctx) {
        const { cx, cy, R, r } = ctx;
        const a = mod(p.a, p.n);
        const b = mod(p.b, p.n);
        const sum = mod(a + b, p.n);
        drawDial(svg, p.n, cx, cy, R, r, [
          { idx: a,   stroke: 'var(--blue)' },
          { idx: sum, stroke: 'var(--yellow)', fill: 'var(--yellow)' },
        ]);
        // Arrow 1: 0 -> a (blue).
        drawArrow(svg, ctx, 0, a, 'var(--blue)', 'arrowA');
        // Arrow 2: a -> (a+b) mod n (yellow).
        drawArrow(svg, ctx, a, sum, 'var(--yellow)', 'arrowB');
        const wrap = a + b !== sum
          ? ` \\;=\\; ${a + b} - ${p.n} \\;\\equiv\\; ${sum}`
          : ` \\;\\equiv\\; ${sum}`;
        return {
          readoutHTML:
            `<div>$ ${a} + ${b}${wrap} \\pmod{${p.n}} $</div>` +
            `<div style="color:var(--mute);font-size:.85rem;margin-top:.25rem">` +
            `walk 0 → ${a} (length ${a}) → ${sum} (length ${b}); wrap = ${a + b >= p.n ? 'yes' : 'no'}` +
            `</div>`,
        };
      },
    },

    multiplication: {
      defaults: { n: 12, a: 5 },
      sliders: [
        { key: 'n', label: 'n', min: 2, max: 36, step: 1 },
        { key: 'a', label: 'a', min: 0, maxOf: (p) => p.n - 1, step: 1 },
      ],
      render(svg, p, ctx) {
        const { cx, cy, R, r } = ctx;
        const a = mod(p.a, p.n);
        const g = gcd(a, p.n);
        const isUnit = g === 1;
        const cycles = multCycles(a, p.n);
        // Sort cycles longest-first so the legend reports the dominant one.
        const lengths = cycles.map((c) => c.length).sort((x, y) => y - x);

        // Highlight: the fixed point 0 (always maps to 0) gets the mute
        // ring; non-trivial cycle members get the cycle's own color.
        const palette = ['var(--blue)', 'var(--yellow)', 'var(--pink)', 'var(--green)'];
        const highlights = [];
        cycles.forEach((cyc, ci) => {
          if (cyc.length === 1) return; // fixed points styled separately
          const color = palette[ci % palette.length];
          for (const k of cyc) highlights.push({ idx: k, stroke: color });
        });
        // Fixed points (0 and any other k with k·a ≡ k) get a panel2 fill.
        cycles.forEach((cyc) => {
          if (cyc.length === 1) {
            highlights.push({ idx: cyc[0], stroke: 'var(--mute)', fill: 'var(--panel2)' });
          }
        });
        drawDial(svg, p.n, cx, cy, R, r, highlights);

        // Arrows: every k -> (k·a) mod n, colored by cycle membership.
        // For non-unit `a`, the orbit of k is rho-shaped: a tail
        // k → k·a → … flowing into a cycle. multCycles only stores cycle
        // members, so tail nodes have no entry yet — assign each tail the
        // cycle index it converges to (back-fill by walking forward).
        const cycleOfIdx = new Array(p.n);
        cycles.forEach((cyc, ci) => { for (const k of cyc) cycleOfIdx[k] = ci; });
        for (let k = 0; k < p.n; k++) {
          if (cycleOfIdx[k] !== undefined) continue;
          const trail = [];
          let x = k;
          // Bounded by p.n iterations: every orbit reaches its cycle in ≤ n steps.
          for (let i = 0; i < p.n && cycleOfIdx[x] === undefined; i++) {
            trail.push(x);
            x = mod(x * a, p.n);
          }
          const ci = cycleOfIdx[x];
          for (const t of trail) cycleOfIdx[t] = ci;
        }
        for (let k = 0; k < p.n; k++) {
          const j = mod(k * a, p.n);
          if (j === k) continue; // skip self-loops; the dial dot shows it
          const ci = cycleOfIdx[k];
          const color = (ci === undefined || cycles[ci].length === 1)
            ? 'var(--mute)'
            : palette[ci % palette.length];
          drawArrow(svg, ctx, k, j, color, `mc-${k}`, /*thin=*/true);
        }

        const cycleSummary = isUnit
          ? `every non-zero cycle has length ${lengths[0]} = \\operatorname{ord}_{${p.n}}(${a})`
          : `cycle lengths: ${lengths.join(', ')}`;
        return {
          readoutHTML:
            `<div>$ \\times ${a} \\pmod{${p.n}} $ &nbsp; — &nbsp; ` +
            `$ \\gcd(${a}, ${p.n}) = ${g} $ ` +
            `(${isUnit ? '<b style="color:var(--green)">unit</b>' : '<b style="color:var(--pink)">zero divisor</b>'})</div>` +
            `<div style="color:var(--mute);font-size:.85rem;margin-top:.25rem">` +
            `${cycleSummary} · ${cycles.length} cycle${cycles.length === 1 ? '' : 's'} total` +
            `</div>`,
        };
      },
    },
  };

  // Draw the n-point dial (background ring + numbered dots). `highlights`
  // lets the caller request a colored stroke / fill on specific indices;
  // anything not listed gets the default mute style.
  function drawDial(svg, n, cx, cy, R, r, highlights) {
    // Background ring.
    svg.appendChild(svgEl('circle', {
      cx, cy, r: R,
      fill: 'none', stroke: 'var(--line, var(--mute))', 'stroke-width': '0.8',
      'stroke-dasharray': '2 3', opacity: '0.6',
    }));
    const hi = new Map();
    for (const h of highlights || []) hi.set(h.idx, h);
    for (let k = 0; k < n; k++) {
      const ang = -Math.PI / 2 + (2 * Math.PI * k) / n;
      const x = cx + R * Math.cos(ang);
      const y = cy + R * Math.sin(ang);
      const h = hi.get(k);
      svg.appendChild(svgEl('circle', {
        cx: x, cy: y, r,
        fill: h && h.fill ? h.fill : 'var(--panel2)',
        stroke: h ? h.stroke : 'var(--mute)',
        'stroke-width': h ? '1.6' : '0.9',
      }));
      // Label outside the dot.
      const lr = R + r + 8;
      const lx = cx + lr * Math.cos(ang);
      const ly = cy + lr * Math.sin(ang) + 3.5;
      const t = svgEl('text', {
        x: lx, y: ly, 'text-anchor': 'middle',
        'font-size': n > 24 ? '8' : '10',
        fill: h ? 'var(--ink)' : 'var(--mute)',
        'font-family': 'ui-monospace,monospace',
      });
      t.textContent = String(k);
      svg.appendChild(t);
    }
  }

  // Draw an arrow along a chord from index `from` to index `to`. Stops
  // short of each dot by `r + pad` so the arrowhead is visible. If
  // from === to we skip (self-loops are implicit in the dot styling).
  function drawArrow(svg, ctx, from, to, color, idSuffix, thin) {
    const { cx, cy, R, r, n } = ctx;
    if (from === to) return;
    const a1 = -Math.PI / 2 + (2 * Math.PI * from) / n;
    const a2 = -Math.PI / 2 + (2 * Math.PI * to) / n;
    const x1 = cx + R * Math.cos(a1);
    const y1 = cy + R * Math.sin(a1);
    const x2 = cx + R * Math.cos(a2);
    const y2 = cy + R * Math.sin(a2);
    const dx = x2 - x1, dy = y2 - y1;
    const L = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / L, uy = dy / L;
    const pad = r + 2;
    const sx = x1 + ux * pad, sy = y1 + uy * pad;
    const ex = x2 - ux * (pad + 4), ey = y2 - uy * (pad + 4);
    // Arrowhead via marker — defined per-arrow so colors track.
    let defs = svg.querySelector('defs');
    if (!defs) { defs = svgEl('defs'); svg.appendChild(defs); }
    const mid = `mac-arrow-${idSuffix}`;
    const marker = svgEl('marker', {
      id: mid, viewBox: '0 0 10 10', refX: '8', refY: '5',
      markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse',
    });
    const head = svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: color });
    marker.appendChild(head);
    defs.appendChild(marker);
    svg.appendChild(svgEl('line', {
      x1: sx, y1: sy, x2: ex, y2: ey,
      stroke: color, 'stroke-width': thin ? '1.0' : '1.8',
      'marker-end': `url(#${mid})`,
      opacity: thin ? '0.8' : '1',
    }));
  }

  function init(selector, opts) {
    const root = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!root) return null;
    if (!opts || !opts.kind || !KINDS[opts.kind]) {
      root.textContent = `modular-arithmetic-clock: unknown kind "${opts && opts.kind}"`;
      return null;
    }

    const kindDef = KINDS[opts.kind];
    const params = { ...kindDef.defaults, ...(opts.params || {}) };
    // Sanitize: enforce integer types and clamp a, b into [0, n-1].
    params.n = Math.max(2, Math.min(60, params.n | 0));
    if ('a' in params) params.a = mod(params.a | 0, params.n);
    if ('b' in params) params.b = mod(params.b | 0, params.n);

    const viewBox = opts.viewBox || '0 0 320 320';
    const [vbX, vbY, vbW, vbH] = viewBox.split(/\s+/).map(Number);
    const title = opts.title || 'Modular arithmetic clock';
    const hint = opts.hint || 'drag a slider';

    root.classList.add('widget');
    root.innerHTML = '';

    const hd = el('div', { class: 'hd' }, [
      el('div', { class: 'ttl' }, [title]),
      el('div', { class: 'hint' }, [hint]),
    ]);
    root.appendChild(hd);

    // Slider row.
    const sliderRow = el('div', {
      class: 'row',
      style: 'display:flex;flex-wrap:wrap;gap:.6rem 1rem;align-items:center;margin:.2rem 0 .6rem',
    });
    const sliderInputs = {};
    for (const s of kindDef.sliders) {
      const max = typeof s.maxOf === 'function' ? s.maxOf(params) : s.max;
      const labelEl = el('label', {
        style: 'display:inline-flex;gap:.4rem;align-items:center;font-size:.9rem;color:var(--mute)',
      }, [s.label]);
      const input = el('input', {
        type: 'range', min: String(s.min), max: String(max),
        step: String(s.step), value: String(params[s.key]),
        style: 'accent-color:var(--yellow);width:140px',
        'aria-label': s.label,
      });
      const valSpan = el('span', {
        style: 'font-family:ui-monospace,monospace;font-size:.85rem;color:var(--ink);min-width:2rem;text-align:right',
      }, [String(params[s.key])]);
      labelEl.appendChild(input);
      labelEl.appendChild(valSpan);
      sliderInputs[s.key] = { input, valSpan, def: s };
      sliderRow.appendChild(labelEl);
    }
    root.appendChild(sliderRow);

    const svg = svgEl('svg', {
      viewBox,
      'aria-label': 'modular arithmetic dial',
      style: 'width:100%;max-width:380px;display:block;margin:0 auto .5rem',
    });
    const svgTitle = svgEl('title');
    svgTitle.textContent = title + ' dial';
    svg.appendChild(svgTitle);
    root.appendChild(svg);

    const readout = el('div', {
      class: 'readout',
      style: 'font-size:.92rem;line-height:1.5;padding:.55rem .8rem',
    });
    root.appendChild(readout);

    // Geometry of the dial inside the viewBox.
    const cx = vbX + vbW / 2;
    const cy = vbY + vbH / 2;
    const R = Math.min(vbW, vbH) * 0.38;
    const r = Math.max(4, Math.min(10, R / 16));

    function render() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const t = svgEl('title');
      t.textContent = title + ' dial';
      svg.appendChild(t);

      const ctx = { cx, cy, R, r, n: params.n };
      const out = kindDef.render(svg, params, ctx) || {};
      readout.innerHTML = out.readoutHTML || '';
      if (global.renderMathInElement) {
        try {
          global.renderMathInElement(readout, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
            ],
          });
        } catch (_) { /* swallow */ }
      }

      // After every render, refresh slider maxes that depend on n and
      // re-clamp downstream params if they've drifted past the new max.
      for (const key in sliderInputs) {
        const { input, valSpan, def } = sliderInputs[key];
        if (typeof def.maxOf === 'function') {
          const newMax = def.maxOf(params);
          input.max = String(newMax);
          if (params[key] > newMax) {
            params[key] = newMax;
            input.value = String(newMax);
            valSpan.textContent = String(newMax);
          }
        }
      }
    }

    for (const key in sliderInputs) {
      const { input, valSpan, def } = sliderInputs[key];
      input.addEventListener('input', () => {
        const v = parseInt(input.value, 10);
        params[key] = v;
        valSpan.textContent = String(v);
        // Clamp dependents (a, b) back into [0, n-1] when n shrinks.
        if (key === 'n') {
          for (const otherKey of ['a', 'b']) {
            if (otherKey in params) params[otherKey] = mod(params[otherKey], params.n);
            if (sliderInputs[otherKey]) {
              sliderInputs[otherKey].input.value = String(params[otherKey]);
              sliderInputs[otherKey].valSpan.textContent = String(params[otherKey]);
            }
          }
        }
        render();
      });
    }

    render();
    return { render, params };
  }

  global.MVModularArithmeticClock = { init };
})(typeof window !== 'undefined' ? window : globalThis);
