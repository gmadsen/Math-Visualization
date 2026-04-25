// Recurrence plotter widget. Iterates a single-variable recurrence
// `x_{n+1} = f(x_n)` (or two-term `x_{n+1} = f(x_n, x_{n-1})`) and shows
// the trajectory plus, for one-term cases, a cobweb diagram on the y=x line.
//
// The recurrence is selected by `config.kind` from a curated whitelist —
// no expression evaluation, no eval/Function. New kinds are added here in
// the library; the widget schema's `kind` enum should track this list.
//
// Usage (called from a topic page):
//
//   MVRecurrencePlotter.init('#w-logistic', {
//     kind: 'logistic',     // 'logistic' | 'linear-2term' | 'quadratic'
//     params: { r: 3.7, x0: 0.5, n: 80 },
//     title: 'Logistic map',
//     hint:  'drag r through the period-doubling cascade',
//     viewBox: '0 0 480 220'         // default
//   });
//
// Each `kind` declares its slider controls, an `iterate(state) -> next`
// function, and (optionally) a `func(x)` for the cobweb. The library wires
// the controls and re-renders on input.
//
// Dependencies: none. Plain SVG + DOM. Uses var(--yellow), var(--blue),
// var(--mute) etc. for theme consistency.

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

  // Recurrence catalog. Each entry exposes:
  //   defaults: starting param values (numbers).
  //   sliders : array of { key, label, min, max, step }.
  //   iterate : (state) => next x value. `state` includes prev xs.
  //   func    : optional one-arg function for cobweb (one-term recurrences).
  //   range   : [yMin, yMax] for the trajectory plot's y axis.
  //   formula : KaTeX label for the readout.
  const KINDS = {
    logistic: {
      defaults: { r: 3.5, x0: 0.4, n: 60 },
      sliders: [
        { key: 'r', label: 'r', min: 0, max: 4, step: 0.01 },
        { key: 'x0', label: 'x₀', min: 0.001, max: 0.999, step: 0.001 },
      ],
      iterate(state) {
        return state.r * state.x * (1 - state.x);
      },
      func(state) {
        return (x) => state.r * x * (1 - x);
      },
      range: [0, 1],
      formula: 'x_{n+1} = r\\,x_n(1-x_n)',
    },
    quadratic: {
      defaults: { a: -1.4, c: 0.3, x0: 0, n: 80 },
      sliders: [
        { key: 'a', label: 'a', min: -2, max: 2, step: 0.01 },
        { key: 'c', label: 'c', min: -1, max: 1, step: 0.01 },
        { key: 'x0', label: 'x₀', min: -1, max: 1, step: 0.01 },
      ],
      iterate(state) {
        return state.a * state.x * state.x + state.c;
      },
      func(state) {
        return (x) => state.a * x * x + state.c;
      },
      range: [-2, 2],
      formula: 'x_{n+1} = a\\,x_n^2 + c',
    },
    'linear-2term': {
      defaults: { a: 1, b: 1, x0: 1, x1: 1, n: 18 },
      sliders: [
        { key: 'a', label: 'a', min: -2, max: 2, step: 0.01 },
        { key: 'b', label: 'b', min: -2, max: 2, step: 0.01 },
      ],
      twoTerm: true,
      iterate(state) {
        return state.a * state.x + state.b * state.xPrev;
      },
      range: null, // auto-scale
      formula: 'x_{n+1} = a\\,x_n + b\\,x_{n-1}',
    },
  };

  function iterateSequence(kindDef, params) {
    const n = Math.max(2, params.n || 60);
    const seq = [];
    if (kindDef.twoTerm) {
      let xPrev = params.x0;
      let x = params.x1;
      seq.push(xPrev, x);
      for (let i = 2; i < n; i++) {
        const next = kindDef.iterate({ ...params, x, xPrev });
        seq.push(next);
        xPrev = x;
        x = next;
      }
    } else {
      let x = params.x0;
      seq.push(x);
      for (let i = 1; i < n; i++) {
        const next = kindDef.iterate({ ...params, x });
        seq.push(next);
        x = next;
      }
    }
    return seq;
  }

  function autoRange(seq) {
    let lo = Infinity;
    let hi = -Infinity;
    for (const v of seq) {
      if (!Number.isFinite(v)) continue;
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    if (lo === Infinity || hi === -Infinity) return [-1, 1];
    if (lo === hi) return [lo - 1, hi + 1];
    const pad = (hi - lo) * 0.1;
    return [lo - pad, hi + pad];
  }

  function init(selector, opts) {
    const root = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!root) return null;
    if (!opts || !opts.kind || !KINDS[opts.kind]) {
      root.textContent = `recurrence-plotter: unknown kind "${opts && opts.kind}"`;
      return null;
    }

    const kindDef = KINDS[opts.kind];
    const params = { ...kindDef.defaults, ...(opts.params || {}) };
    const viewBox = opts.viewBox || '0 0 480 220';
    const [vbX, vbY, vbW, vbH] = viewBox.split(/\s+/).map(Number);
    const title = opts.title || 'Recurrence';
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
      const labelEl = el('label', { style: 'display:inline-flex;gap:.4rem;align-items:center;font-size:.9rem;color:var(--mute)' }, [s.label]);
      const input = el('input', {
        type: 'range',
        min: String(s.min),
        max: String(s.max),
        step: String(s.step),
        value: String(params[s.key]),
        style: 'accent-color:var(--yellow);width:120px',
        'aria-label': s.label,
      });
      const valSpan = el('span', { style: 'font-family:ui-monospace,monospace;font-size:.85rem;color:var(--ink);min-width:3rem;text-align:right' }, [String(params[s.key])]);
      labelEl.appendChild(input);
      labelEl.appendChild(valSpan);
      sliderInputs[s.key] = { input, valSpan };
      sliderRow.appendChild(labelEl);
    }
    root.appendChild(sliderRow);

    const svg = svgEl('svg', {
      viewBox,
      'aria-label': 'recurrence trajectory + optional cobweb',
      style: 'width:100%;max-width:520px;display:block;margin:0 auto .5rem',
    });
    const svgTitle = svgEl('title');
    svgTitle.textContent = title + ' diagram';
    svg.appendChild(svgTitle);
    root.appendChild(svg);

    const readout = el('div', {
      class: 'readout',
      style: 'font-size:.92rem;line-height:1.5;padding:.55rem .8rem',
    });
    root.appendChild(readout);

    // Layout: split viewBox in half for cobweb (left) + trajectory (right)
    // when the kind is one-term; otherwise the trajectory uses the full
    // width.
    const margin = { l: 30, r: 16, t: 16, b: 28 };
    const cobwebW = kindDef.twoTerm ? 0 : Math.floor((vbW - margin.l - margin.r - 16) / 2);
    const trajW = vbW - margin.l - margin.r - cobwebW - (cobwebW ? 16 : 0);
    const plotH = vbH - margin.t - margin.b;

    function render() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const t = svgEl('title');
      t.textContent = title + ' diagram';
      svg.appendChild(t);

      const seq = iterateSequence(kindDef, params);
      const [yMin, yMax] = kindDef.range || autoRange(seq);
      const yScale = (y) => {
        const t = (y - yMin) / (yMax - yMin || 1);
        return vbY + margin.t + plotH * (1 - t);
      };

      // Trajectory subplot (right or full).
      const trajX0 = vbX + margin.l + cobwebW + (cobwebW ? 16 : 0);
      // Axes.
      const ax = svgEl('path', {
        d: `M ${trajX0} ${vbY + margin.t} L ${trajX0} ${vbY + margin.t + plotH} L ${trajX0 + trajW} ${vbY + margin.t + plotH}`,
        fill: 'none', stroke: 'var(--mute)', 'stroke-width': '0.8',
      });
      svg.appendChild(ax);
      // Y=0 baseline if range crosses zero.
      if (yMin < 0 && yMax > 0) {
        const zy = yScale(0);
        svg.appendChild(svgEl('line', {
          x1: trajX0, y1: zy, x2: trajX0 + trajW, y2: zy,
          stroke: 'var(--line)', 'stroke-width': '0.6', 'stroke-dasharray': '3 3',
        }));
      }
      // Trajectory polyline + dots.
      const dx = trajW / Math.max(1, seq.length - 1);
      const pts = seq.map((y, i) => `${trajX0 + i * dx},${yScale(y)}`).join(' ');
      svg.appendChild(svgEl('polyline', {
        points: pts, fill: 'none', stroke: 'var(--blue)', 'stroke-width': '1.2',
      }));
      for (let i = 0; i < seq.length; i++) {
        const cy = yScale(seq[i]);
        if (!Number.isFinite(cy)) continue;
        svg.appendChild(svgEl('circle', {
          cx: trajX0 + i * dx, cy, r: '1.6', fill: 'var(--yellow)',
        }));
      }
      // Y labels.
      svg.appendChild((function () {
        const t = svgEl('text', { x: trajX0 - 4, y: vbY + margin.t + 4, 'text-anchor': 'end', 'font-size': '10', fill: 'var(--mute)' });
        t.textContent = yMax.toFixed(2);
        return t;
      })());
      svg.appendChild((function () {
        const t = svgEl('text', { x: trajX0 - 4, y: vbY + margin.t + plotH, 'text-anchor': 'end', 'font-size': '10', fill: 'var(--mute)' });
        t.textContent = yMin.toFixed(2);
        return t;
      })());

      // Cobweb subplot (one-term only).
      if (cobwebW > 0 && typeof kindDef.func === 'function') {
        const cw = cobwebW;
        const cx0 = vbX + margin.l;
        const f = kindDef.func(params);
        const cyScale = (y) => vbY + margin.t + plotH * (1 - (y - yMin) / (yMax - yMin || 1));
        const cxScale = (x) => cx0 + cw * (x - yMin) / (yMax - yMin || 1);
        // Box.
        svg.appendChild(svgEl('rect', {
          x: cx0, y: vbY + margin.t, width: cw, height: plotH,
          fill: 'none', stroke: 'var(--mute)', 'stroke-width': '0.6',
        }));
        // y = x line.
        svg.appendChild(svgEl('line', {
          x1: cxScale(yMin), y1: cyScale(yMin), x2: cxScale(yMax), y2: cyScale(yMax),
          stroke: 'var(--mute)', 'stroke-width': '0.8', 'stroke-dasharray': '3 3',
        }));
        // y = f(x) curve sampled at 100 points.
        const samples = 100;
        const fpts = [];
        for (let i = 0; i <= samples; i++) {
          const xv = yMin + (i / samples) * (yMax - yMin);
          const yv = f(xv);
          if (Number.isFinite(yv)) fpts.push(`${cxScale(xv)},${cyScale(yv)}`);
        }
        svg.appendChild(svgEl('polyline', {
          points: fpts.join(' '), fill: 'none', stroke: 'var(--green)', 'stroke-width': '1.2',
        }));
        // Cobweb path: from (x0, 0) up to (x0, f(x0)), across to (f(x0), f(x0)),
        // up/down to (f(x0), f(f(x0))), etc.
        const cw_pts = [];
        let x = params.x0;
        cw_pts.push(`${cxScale(x)},${cyScale(yMin)}`);
        for (let i = 0; i < Math.min(40, params.n); i++) {
          const fx = f(x);
          if (!Number.isFinite(fx)) break;
          cw_pts.push(`${cxScale(x)},${cyScale(fx)}`);
          cw_pts.push(`${cxScale(fx)},${cyScale(fx)}`);
          x = fx;
        }
        svg.appendChild(svgEl('polyline', {
          points: cw_pts.join(' '), fill: 'none', stroke: 'var(--yellow)', 'stroke-width': '1.0', opacity: '0.8',
        }));
        // Subplot label.
        svg.appendChild((function () {
          const t = svgEl('text', { x: cx0 + cw / 2, y: vbY + margin.t - 4, 'text-anchor': 'middle', 'font-size': '10', fill: 'var(--mute)' });
          t.textContent = 'cobweb';
          return t;
        })());
      }

      // Trajectory subplot label.
      svg.appendChild((function () {
        const t = svgEl('text', { x: trajX0 + trajW / 2, y: vbY + margin.t - 4, 'text-anchor': 'middle', 'font-size': '10', fill: 'var(--mute)' });
        t.textContent = 'trajectory';
        return t;
      })());

      // Readout: formula + a few values.
      const tail = seq.slice(-5).map((v) => Number.isFinite(v) ? v.toFixed(4) : 'NaN').join(', ');
      readout.innerHTML = `<div>$ ${kindDef.formula} $</div><div style="color:var(--mute);font-size:.85rem;margin-top:.25rem">last 5: ${tail}</div>`;
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

    for (const s of kindDef.sliders) {
      const { input, valSpan } = sliderInputs[s.key];
      input.addEventListener('input', () => {
        const v = parseFloat(input.value);
        params[s.key] = v;
        valSpan.textContent = v.toFixed(s.step < 1 ? (String(s.step).split('.')[1] || '').length : 0);
        render();
      });
    }

    render();
    return { render, params };
  }

  global.MVRecurrencePlotter = { init };
})(typeof window !== 'undefined' ? window : globalThis);
