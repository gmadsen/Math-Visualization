// Constraint-bifurcation-explorer widget. Visualizes a parameterized 2D
// inequality `g_a(x, y) <= 0` by shading the feasible region on a coarse
// grid (marching-pixels), with a slider for the parameter `a`. As `a` sweeps
// the reader watches the feasible region grow / shrink / split / collide —
// i.e., a topological bifurcation in the constraint set.
//
// The constraint family is selected by `config.kind` from a curated whitelist
// — no expression evaluation, no eval/Function. New kinds are added in this
// library; the widget schema's `kind` enum should track this list.
//
// Usage (called from a topic page):
//
//   MVConstraintBifurcationExplorer.init('#w-pitchfork', {
//     kind: 'saddle-pitchfork',
//     params: { a: 0.5 },
//     domain: { xRange: [-1.6, 1.6], yRange: [-1.2, 1.2] },
//     title: 'Saddle pitchfork: y^2 <= a*x^2 - x^4',
//     hint:  'drag a through 0 — one component splits into two',
//     viewBox: '0 0 360 360'   // default
//   });
//
// Each `kind` declares a slider range, a default domain, a `g(x, y, a)`
// function whose sign determines feasibility (g <= 0), and a KaTeX formula
// label. The library wires the slider, samples the constraint at ~80x80
// cells (per-pixel sampling, not marching squares — coarse pixelation is
// the intended aesthetic), and emits one `<rect>` per feasible cell.
//
// Dependencies: none. Plain SVG + DOM. Uses var(--yellow), var(--mute),
// var(--ink) for theme consistency. KaTeX auto-render via
// window.renderMathInElement is used for the readout when available.

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

  // Constraint catalog. Each entry exposes:
  //   slider  : { min, max, step } for `a`.
  //   defaultA: starting value of `a`.
  //   defaultDomain: { xRange, yRange } when caller omits it.
  //   g       : (x, y, a) => number; feasible when result <= 0.
  //   formula : KaTeX label (with placeholder for `a`).
  const KINDS = {
    'circle-radius': {
      slider: { min: 0, max: 4, step: 0.02 },
      defaultA: 1.5,
      defaultDomain: { xRange: [-4.2, 4.2], yRange: [-4.2, 4.2] },
      g(x, y, a) {
        return x * x + y * y - a * a;
      },
      formula: 'x^2 + y^2 \\le a^2',
    },
    'ellipse-eccentricity': {
      slider: { min: 0.1, max: 1.9, step: 0.01 },
      defaultA: 1.0,
      defaultDomain: { xRange: [-2.2, 2.2], yRange: [-2.2, 2.2] },
      g(x, y, a) {
        const b = 2 - a;
        // a and b are clamped > 0 by the slider range, so divisions are safe.
        return (x * x) / (a * a) + (y * y) / (b * b) - 1;
      },
      formula: '\\frac{x^2}{a^2} + \\frac{y^2}{(2-a)^2} \\le 1',
    },
    'saddle-pitchfork': {
      slider: { min: -1, max: 2, step: 0.01 },
      defaultA: 0.5,
      defaultDomain: { xRange: [-1.6, 1.6], yRange: [-1.2, 1.2] },
      g(x, y, a) {
        // Feasible iff y^2 <= a*x^2 - x^4, i.e., y^2 - (a*x^2 - x^4) <= 0.
        return y * y - (a * x * x - x * x * x * x);
      },
      formula: 'y^2 \\le a\\,x^2 - x^4',
    },
  };

  function init(selector, opts) {
    const root = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!root) return null;
    if (!opts || !opts.kind || !KINDS[opts.kind]) {
      root.textContent = `constraint-bifurcation-explorer: unknown kind "${opts && opts.kind}"`;
      return null;
    }

    const kindDef = KINDS[opts.kind];
    const initialA =
      opts.params && typeof opts.params.a === 'number' ? opts.params.a : kindDef.defaultA;
    const domain = {
      xRange: (opts.domain && opts.domain.xRange) || kindDef.defaultDomain.xRange,
      yRange: (opts.domain && opts.domain.yRange) || kindDef.defaultDomain.yRange,
    };
    const viewBox = opts.viewBox || '0 0 360 360';
    const [vbX, vbY, vbW, vbH] = viewBox.split(/\s+/).map(Number);
    const title = opts.title || 'Constraint bifurcation explorer';
    const hint = opts.hint || 'drag a · watch the feasible region change';

    // Mutable state.
    const state = { a: initialA };

    root.classList.add('widget');
    root.innerHTML = '';

    // Header.
    const hd = el('div', { class: 'hd' }, [
      el('div', { class: 'ttl' }, [title]),
      el('div', { class: 'hint' }, [hint]),
    ]);
    root.appendChild(hd);

    // Slider row.
    const sliderRow = el('div', {
      class: 'row',
      style:
        'display:flex;flex-wrap:wrap;gap:.6rem 1rem;align-items:center;margin:.2rem 0 .6rem',
    });
    const sliderLabel = el(
      'label',
      {
        style:
          'display:inline-flex;gap:.4rem;align-items:center;font-size:.9rem;color:var(--mute)',
      },
      ['a'],
    );
    const sliderInput = el('input', {
      type: 'range',
      min: String(kindDef.slider.min),
      max: String(kindDef.slider.max),
      step: String(kindDef.slider.step),
      value: String(state.a),
      style: 'accent-color:var(--yellow);width:200px',
      'aria-label': 'a',
    });
    const sliderVal = el(
      'span',
      {
        style:
          'font-family:ui-monospace,monospace;font-size:.85rem;color:var(--ink);min-width:3.5rem;text-align:right',
      },
      [String(state.a)],
    );
    sliderLabel.appendChild(sliderInput);
    sliderLabel.appendChild(sliderVal);
    sliderRow.appendChild(sliderLabel);
    root.appendChild(sliderRow);

    // SVG diagram.
    const svg = svgEl('svg', {
      viewBox,
      'aria-label': 'feasible region for ' + opts.kind,
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

    // Layout. A small margin around the plot lets the axes breathe.
    const margin = { l: 24, r: 12, t: 12, b: 24 };
    const plotW = vbW - margin.l - margin.r;
    const plotH = vbH - margin.t - margin.b;
    const plotX0 = vbX + margin.l;
    const plotY0 = vbY + margin.t;

    // Coarse grid resolution. ~80x80 cells over the viewBox is the sweet
    // spot for the pixelated aesthetic — fine enough to show topology
    // changes, coarse enough to stay tiny in SVG.
    const GRID_N = 80;
    const cellPxW = plotW / GRID_N;
    const cellPxH = plotH / GRID_N;
    // Each grid cell spans [xMin + i*dx, xMin + (i+1)*dx] in math coords.
    const dx = (domain.xRange[1] - domain.xRange[0]) / GRID_N;
    const dy = (domain.yRange[1] - domain.yRange[0]) / GRID_N;

    // Math -> screen converters (used for axes; cells use precomputed pixel
    // sizes for speed).
    function sx(x) {
      const t = (x - domain.xRange[0]) / (domain.xRange[1] - domain.xRange[0]);
      return plotX0 + t * plotW;
    }
    function sy(y) {
      const t = (y - domain.yRange[0]) / (domain.yRange[1] - domain.yRange[0]);
      // SVG y grows downward; flip so larger math-y is higher on screen.
      return plotY0 + plotH * (1 - t);
    }

    function render() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const t = svgEl('title');
      t.textContent = title + ' diagram';
      svg.appendChild(t);

      // Plot frame.
      svg.appendChild(
        svgEl('rect', {
          x: plotX0,
          y: plotY0,
          width: plotW,
          height: plotH,
          fill: 'var(--panel2)',
          stroke: 'var(--mute)',
          'stroke-width': '0.6',
          opacity: '0.35',
        }),
      );

      // Feasible-region cells. Per-pixel sampling at the cell center: we
      // call kindDef.g(xMid, yMid, state.a) and emit a <rect> when g <= 0.
      // Coarse pixelation is the intended aesthetic — no contour smoothing.
      const g = kindDef.g;
      const a = state.a;
      for (let j = 0; j < GRID_N; j++) {
        // Cell row j spans yMath in [yMin + j*dy, yMin + (j+1)*dy].
        const yMid = domain.yRange[0] + (j + 0.5) * dy;
        // Top of this row in screen space: larger math-y is smaller screen-y.
        const yTopPx = plotY0 + plotH - (j + 1) * cellPxH;
        for (let i = 0; i < GRID_N; i++) {
          const xMid = domain.xRange[0] + (i + 0.5) * dx;
          const v = g(xMid, yMid, a);
          if (Number.isFinite(v) && v <= 0) {
            svg.appendChild(
              svgEl('rect', {
                x: plotX0 + i * cellPxW,
                y: yTopPx,
                width: cellPxW + 0.5, // tiny overlap to avoid 1px seams
                height: cellPxH + 0.5,
                fill: 'var(--yellow)',
                opacity: '0.5',
              }),
            );
          }
        }
      }

      // Axes (drawn over the cells so they read clearly).
      // x = 0 vertical line, if 0 is in xRange.
      if (domain.xRange[0] < 0 && domain.xRange[1] > 0) {
        const x0 = sx(0);
        svg.appendChild(
          svgEl('line', {
            x1: x0,
            y1: plotY0,
            x2: x0,
            y2: plotY0 + plotH,
            stroke: 'var(--mute)',
            'stroke-width': '0.7',
            'stroke-dasharray': '3 3',
          }),
        );
      }
      // y = 0 horizontal line, if 0 is in yRange.
      if (domain.yRange[0] < 0 && domain.yRange[1] > 0) {
        const y0 = sy(0);
        svg.appendChild(
          svgEl('line', {
            x1: plotX0,
            y1: y0,
            x2: plotX0 + plotW,
            y2: y0,
            stroke: 'var(--mute)',
            'stroke-width': '0.7',
            'stroke-dasharray': '3 3',
          }),
        );
      }

      // Axis tick labels at the four corners of the domain.
      function tickLabel(x, y, anchor, vAlign, txt) {
        const t = svgEl('text', {
          x: String(x),
          y: String(y),
          'text-anchor': anchor,
          'dominant-baseline': vAlign,
          'font-size': '10',
          fill: 'var(--mute)',
        });
        t.textContent = txt;
        svg.appendChild(t);
      }
      tickLabel(plotX0 - 2, plotY0 + plotH + 2, 'start', 'hanging', domain.xRange[0].toFixed(1));
      tickLabel(plotX0 + plotW, plotY0 + plotH + 2, 'end', 'hanging', domain.xRange[1].toFixed(1));
      tickLabel(plotX0 - 4, plotY0 + plotH, 'end', 'middle', domain.yRange[0].toFixed(1));
      tickLabel(plotX0 - 4, plotY0, 'end', 'middle', domain.yRange[1].toFixed(1));

      // Readout: parameter value + KaTeX formula.
      readout.innerHTML =
        `<div>$ ${kindDef.formula} $ &nbsp; with &nbsp; ` +
        `<span style="color:var(--ink);font-family:ui-monospace,monospace">a = ${a.toFixed(3)}</span></div>` +
        `<div style="color:var(--mute);font-size:.85rem;margin-top:.25rem">feasible region shaded · sampled on ${GRID_N}×${GRID_N} grid</div>`;
      if (global.renderMathInElement) {
        try {
          global.renderMathInElement(readout, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\(', right: '\\)', display: false },
              { left: '\\[', right: '\\]', display: true },
            ],
          });
        } catch (_) {
          /* swallow */
        }
      }
    }

    // Slider precision = number of decimals in step.
    const stepStr = String(kindDef.slider.step);
    const decimals = stepStr.includes('.') ? stepStr.split('.')[1].length : 0;
    sliderInput.addEventListener('input', () => {
      const v = parseFloat(sliderInput.value);
      state.a = v;
      sliderVal.textContent = v.toFixed(decimals);
      render();
    });
    sliderVal.textContent = state.a.toFixed(decimals);

    render();
    return { render, state };
  }

  global.MVConstraintBifurcationExplorer = { init };
})(typeof window !== 'undefined' ? window : globalThis);
