// Lattice visualizer widget. Renders a 2D lattice Λ = ℤv₁ + ℤv₂ in the
// plane: a grid of dots covering the visible window, the fundamental
// parallelogram (corners 0, v₁, v₁+v₂, v₂) filled with low-opacity yellow,
// the two basis vectors as colored arrows, and a readout reporting the
// covolume |det[v₁ v₂]|. Optionally also draws a sublattice
// Λ' = M·Λ as larger pink dots and reports the index [Λ:Λ'] = |det M|.
//
// Usage (called from a topic page):
//
//   MVLatticeVisualizer.init('#w-lattice', {
//     title: 'A hexagonal lattice',
//     hint:  'drag v₁/v₂ to deform the basis',
//     viewBox: '0 0 360 320',          // default
//     basis: { v1: {x:1, y:0}, v2: {x:0.5, y:0.866} },
//     sublattice: { matrix: [[2,0],[0,2]] }, // optional
//     viewWindow: { xRange: [-3,3], yRange: [-3,3] }, // default
//   });
//
// Sliders adjust v₁.x, v₁.y, v₂.x, v₂.y in the range [-2, 2]. The
// `viewWindow` is given in lattice units (i.e. multiples of the basis
// vectors), but lattice points are placed by the cartesian image
// i·v₁ + j·v₂; the (i, j) index range is derived dynamically so the dots
// always cover the visible window even after large basis changes.
//
// Dependencies: none. Plain SVG + DOM. Uses var(--blue) for v₁,
// var(--green) for v₂, var(--yellow) for the fundamental domain fill,
// var(--pink) for sublattice dots, var(--mute) for the lattice grid.

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

  function det2(a, b, c, d) {
    return a * d - b * c;
  }

  // Solve the 2×2 linear system [v1 v2]·[i j]ᵀ = [x y]ᵀ for (i, j).
  // Returns null when v1, v2 are colinear (degenerate basis).
  function solveCoeffs(v1, v2, x, y) {
    const D = det2(v1.x, v2.x, v1.y, v2.y);
    if (Math.abs(D) < 1e-9) return null;
    return {
      i: det2(x, v2.x, y, v2.y) / D,
      j: det2(v1.x, x, v1.y, y) / D,
    };
  }

  function init(selector, opts) {
    const root = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!root) return null;

    opts = opts || {};
    const title = opts.title || 'Lattice';
    const hint = opts.hint || 'drag the v₁/v₂ sliders to deform the basis';
    const viewBox = opts.viewBox || '0 0 360 320';
    const [vbX, vbY, vbW, vbH] = viewBox.split(/\s+/).map(Number);

    // Mutable state — sliders write here.
    const basisIn = opts.basis || {};
    const v1 = {
      x: basisIn.v1 && typeof basisIn.v1.x === 'number' ? basisIn.v1.x : 1,
      y: basisIn.v1 && typeof basisIn.v1.y === 'number' ? basisIn.v1.y : 0,
    };
    const v2 = {
      x: basisIn.v2 && typeof basisIn.v2.x === 'number' ? basisIn.v2.x : 0,
      y: basisIn.v2 && typeof basisIn.v2.y === 'number' ? basisIn.v2.y : 1,
    };

    const win = opts.viewWindow || {};
    const xRange = Array.isArray(win.xRange) && win.xRange.length === 2 ? win.xRange.slice() : [-3, 3];
    const yRange = Array.isArray(win.yRange) && win.yRange.length === 2 ? win.yRange.slice() : [-3, 3];

    const subM = opts.sublattice && Array.isArray(opts.sublattice.matrix)
      ? opts.sublattice.matrix
      : null;

    // Build chrome.
    root.classList.add('widget');
    root.innerHTML = '';

    const hd = el('div', { class: 'hd' }, [
      el('span', { class: 'ttl' }, [title]),
      el('span', { class: 'hint' }, [hint]),
    ]);
    root.appendChild(hd);

    // Slider row: four range inputs for v1.x, v1.y, v2.x, v2.y.
    const sliderRow = el('div', {
      class: 'row',
      style: 'display:flex;flex-wrap:wrap;gap:.4rem 1rem;align-items:center;margin:.2rem 0 .6rem',
    });
    const SLIDER_DEFS = [
      { key: 'v1.x', label: 'v₁.x', accent: 'var(--blue)', get: () => v1.x, set: (v) => { v1.x = v; } },
      { key: 'v1.y', label: 'v₁.y', accent: 'var(--blue)', get: () => v1.y, set: (v) => { v1.y = v; } },
      { key: 'v2.x', label: 'v₂.x', accent: 'var(--green)', get: () => v2.x, set: (v) => { v2.x = v; } },
      { key: 'v2.y', label: 'v₂.y', accent: 'var(--green)', get: () => v2.y, set: (v) => { v2.y = v; } },
    ];
    const sliderRefs = [];
    for (const def of SLIDER_DEFS) {
      const labelEl = el('label', {
        style: 'display:inline-flex;gap:.35rem;align-items:center;font-size:.88rem;color:var(--mute)',
      }, [def.label]);
      const input = el('input', {
        type: 'range',
        min: '-2',
        max: '2',
        step: '0.01',
        value: String(def.get()),
        style: `accent-color:${def.accent};width:110px`,
        'aria-label': def.label,
      });
      const valSpan = el('span', {
        style: 'font-family:ui-monospace,monospace;font-size:.82rem;color:var(--ink);min-width:2.6rem;text-align:right',
      }, [def.get().toFixed(2)]);
      labelEl.appendChild(input);
      labelEl.appendChild(valSpan);
      sliderRow.appendChild(labelEl);
      sliderRefs.push({ def, input, valSpan });
    }
    root.appendChild(sliderRow);

    // SVG.
    const svg = svgEl('svg', {
      viewBox,
      'aria-label': 'lattice diagram',
      style: 'width:100%;max-width:520px;display:block;margin:0 auto .5rem',
    });
    const svgTitle = svgEl('title');
    svgTitle.textContent = title + ' diagram';
    svg.appendChild(svgTitle);
    root.appendChild(svg);

    // Readout.
    const readout = el('div', {
      class: 'readout',
      style: 'font-size:.92rem;line-height:1.5;padding:.55rem .8rem',
    });
    root.appendChild(readout);

    // Plot geometry: keep a margin so labels and arrowheads fit.
    const margin = { l: 24, r: 24, t: 24, b: 24 };
    const plotW = vbW - margin.l - margin.r;
    const plotH = vbH - margin.t - margin.b;

    // Map lattice (cartesian) coords (X, Y) -> SVG pixel coords.
    // The visible cartesian window is [xRange[0], xRange[1]] × [yRange[0], yRange[1]].
    function toPx(X, Y) {
      const tx = (X - xRange[0]) / (xRange[1] - xRange[0]);
      const ty = (Y - yRange[0]) / (yRange[1] - yRange[0]);
      return {
        px: vbX + margin.l + tx * plotW,
        py: vbY + margin.t + (1 - ty) * plotH,
      };
    }

    // Compute the integer (i, j) bounding box such that i·v₁ + j·v₂ covers
    // the visible window. Done by inverting the basis on the four window
    // corners and taking the integer envelope.
    function integerBounds() {
      const corners = [
        [xRange[0], yRange[0]],
        [xRange[1], yRange[0]],
        [xRange[0], yRange[1]],
        [xRange[1], yRange[1]],
      ];
      let iMin = Infinity, iMax = -Infinity, jMin = Infinity, jMax = -Infinity;
      for (const [cx, cy] of corners) {
        const sol = solveCoeffs(v1, v2, cx, cy);
        if (!sol) return null;
        if (sol.i < iMin) iMin = sol.i;
        if (sol.i > iMax) iMax = sol.i;
        if (sol.j < jMin) jMin = sol.j;
        if (sol.j > jMax) jMax = sol.j;
      }
      // Clamp to a hard ceiling so a near-degenerate basis cannot blow up
      // the dot count (otherwise we may try to draw thousands of points).
      const CAP = 60;
      return {
        iMin: Math.max(-CAP, Math.floor(iMin) - 1),
        iMax: Math.min(CAP, Math.ceil(iMax) + 1),
        jMin: Math.max(-CAP, Math.floor(jMin) - 1),
        jMax: Math.min(CAP, Math.ceil(jMax) + 1),
      };
    }

    function inWindow(X, Y) {
      // Slight padding so dots near the edge still draw.
      const padX = (xRange[1] - xRange[0]) * 0.02;
      const padY = (yRange[1] - yRange[0]) * 0.02;
      return X >= xRange[0] - padX && X <= xRange[1] + padX
          && Y >= yRange[0] - padY && Y <= yRange[1] + padY;
    }

    function render() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const t = svgEl('title');
      t.textContent = title + ' diagram';
      svg.appendChild(t);

      // Plot frame + axes through origin (only if origin is inside window).
      svg.appendChild(svgEl('rect', {
        x: vbX + margin.l, y: vbY + margin.t,
        width: plotW, height: plotH,
        fill: 'var(--panel2)', stroke: 'var(--line)', 'stroke-width': '0.6',
      }));
      const oPx = toPx(0, 0);
      if (oPx.px >= vbX + margin.l && oPx.px <= vbX + margin.l + plotW) {
        svg.appendChild(svgEl('line', {
          x1: oPx.px, y1: vbY + margin.t,
          x2: oPx.px, y2: vbY + margin.t + plotH,
          stroke: 'var(--line)', 'stroke-width': '0.5', 'stroke-dasharray': '3 3',
        }));
      }
      if (oPx.py >= vbY + margin.t && oPx.py <= vbY + margin.t + plotH) {
        svg.appendChild(svgEl('line', {
          x1: vbX + margin.l, y1: oPx.py,
          x2: vbX + margin.l + plotW, y2: oPx.py,
          stroke: 'var(--line)', 'stroke-width': '0.5', 'stroke-dasharray': '3 3',
        }));
      }

      const D = det2(v1.x, v2.x, v1.y, v2.y);
      const covolume = Math.abs(D);
      const degenerate = covolume < 1e-6;

      // Fundamental parallelogram: 0, v1, v1+v2, v2. Drawn before lattice
      // dots so points sit on top.
      if (!degenerate) {
        const p0 = toPx(0, 0);
        const p1 = toPx(v1.x, v1.y);
        const p12 = toPx(v1.x + v2.x, v1.y + v2.y);
        const p2 = toPx(v2.x, v2.y);
        svg.appendChild(svgEl('polygon', {
          points: `${p0.px},${p0.py} ${p1.px},${p1.py} ${p12.px},${p12.py} ${p2.px},${p2.py}`,
          fill: 'var(--yellow)',
          'fill-opacity': '0.18',
          stroke: 'var(--yellow)',
          'stroke-width': '1',
          'stroke-opacity': '0.7',
        }));
      }

      // Lattice points.
      const bounds = integerBounds();
      let pointCount = 0;
      if (bounds) {
        for (let i = bounds.iMin; i <= bounds.iMax; i++) {
          for (let j = bounds.jMin; j <= bounds.jMax; j++) {
            const X = i * v1.x + j * v2.x;
            const Y = i * v1.y + j * v2.y;
            if (!inWindow(X, Y)) continue;
            const p = toPx(X, Y);
            const isOrigin = (i === 0 && j === 0);
            svg.appendChild(svgEl('circle', {
              cx: p.px, cy: p.py,
              r: isOrigin ? '2.6' : '1.8',
              fill: isOrigin ? 'var(--ink)' : 'var(--mute)',
            }));
            pointCount++;
          }
        }
      }

      // Sublattice overlay.
      let subIndex = null;
      if (subM && bounds) {
        // Sublattice basis: w1 = m11·v1 + m21·v2, w2 = m12·v1 + m22·v2.
        const m11 = subM[0][0], m12 = subM[0][1];
        const m21 = subM[1][0], m22 = subM[1][1];
        const w1 = { x: m11 * v1.x + m21 * v2.x, y: m11 * v1.y + m21 * v2.y };
        const w2 = { x: m12 * v1.x + m22 * v2.x, y: m12 * v1.y + m22 * v2.y };
        subIndex = Math.abs(det2(m11, m12, m21, m22));
        // Enumerate (a, b) integers with a·w1 + b·w2 inside the window.
        const wDet = det2(w1.x, w2.x, w1.y, w2.y);
        if (Math.abs(wDet) > 1e-9) {
          const corners = [
            [xRange[0], yRange[0]],
            [xRange[1], yRange[0]],
            [xRange[0], yRange[1]],
            [xRange[1], yRange[1]],
          ];
          let aMin = Infinity, aMax = -Infinity, bMin = Infinity, bMax = -Infinity;
          for (const [cx, cy] of corners) {
            const a = det2(cx, w2.x, cy, w2.y) / wDet;
            const b = det2(w1.x, cx, w1.y, cy) / wDet;
            if (a < aMin) aMin = a;
            if (a > aMax) aMax = a;
            if (b < bMin) bMin = b;
            if (b > bMax) bMax = b;
          }
          const CAP = 40;
          const aLo = Math.max(-CAP, Math.floor(aMin) - 1);
          const aHi = Math.min(CAP, Math.ceil(aMax) + 1);
          const bLo = Math.max(-CAP, Math.floor(bMin) - 1);
          const bHi = Math.min(CAP, Math.ceil(bMax) + 1);
          for (let a = aLo; a <= aHi; a++) {
            for (let b = bLo; b <= bHi; b++) {
              const X = a * w1.x + b * w2.x;
              const Y = a * w1.y + b * w2.y;
              if (!inWindow(X, Y)) continue;
              const p = toPx(X, Y);
              svg.appendChild(svgEl('circle', {
                cx: p.px, cy: p.py,
                r: '3.6',
                fill: 'none',
                stroke: 'var(--pink)',
                'stroke-width': '1.6',
              }));
            }
          }
        }
      }

      // Basis vector arrows from the origin. Draw last so they sit on top.
      if (!degenerate) {
        const o = toPx(0, 0);
        const a1 = toPx(v1.x, v1.y);
        const a2 = toPx(v2.x, v2.y);
        svg.appendChild(svgEl('line', {
          x1: o.px, y1: o.py, x2: a1.px, y2: a1.py,
          stroke: 'var(--blue)', 'stroke-width': '2', 'stroke-linecap': 'round',
        }));
        svg.appendChild(svgEl('circle', {
          cx: a1.px, cy: a1.py, r: '3.2', fill: 'var(--blue)',
        }));
        svg.appendChild(svgEl('line', {
          x1: o.px, y1: o.py, x2: a2.px, y2: a2.py,
          stroke: 'var(--green)', 'stroke-width': '2', 'stroke-linecap': 'round',
        }));
        svg.appendChild(svgEl('circle', {
          cx: a2.px, cy: a2.py, r: '3.2', fill: 'var(--green)',
        }));
        // Vector labels.
        const lbl1 = svgEl('text', {
          x: a1.px + 5, y: a1.py - 5,
          'font-size': '11', fill: 'var(--blue)', 'font-weight': '600',
        });
        lbl1.textContent = 'v₁';
        svg.appendChild(lbl1);
        const lbl2 = svgEl('text', {
          x: a2.px + 5, y: a2.py - 5,
          'font-size': '11', fill: 'var(--green)', 'font-weight': '600',
        });
        lbl2.textContent = 'v₂';
        svg.appendChild(lbl2);
      }

      // Readout: covolume + optional sublattice index.
      const lines = [];
      if (degenerate) {
        lines.push(`<div style="color:var(--pink)">basis is degenerate (det = 0)</div>`);
      } else {
        lines.push(`<div>covolume $|\\det[v_1\\,v_2]| = ${covolume.toFixed(4)}$</div>`);
      }
      if (subIndex != null) {
        lines.push(`<div style="color:var(--mute);font-size:.88rem;margin-top:.2rem">sublattice index $[\\Lambda:\\Lambda'] = |\\det M| = ${subIndex.toFixed(0)}$</div>`);
      }
      lines.push(`<div style="color:var(--mute);font-size:.8rem;margin-top:.2rem">${pointCount} lattice point${pointCount === 1 ? '' : 's'} in window</div>`);
      readout.innerHTML = lines.join('');
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
    }

    // Wire sliders.
    for (const ref of sliderRefs) {
      ref.input.addEventListener('input', () => {
        const v = parseFloat(ref.input.value);
        if (!Number.isFinite(v)) return;
        ref.def.set(v);
        ref.valSpan.textContent = v.toFixed(2);
        render();
      });
    }

    render();
    return { render, get v1() { return { ...v1 }; }, get v2() { return { ...v2 }; } };
  }

  global.MVLatticeVisualizer = { init };
})(typeof window !== 'undefined' ? window : globalThis);
