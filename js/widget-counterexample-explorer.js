// Counterexample-explorer widget. Pedagogical "which-hypotheses-fail"
// inspector. The author declares a list of hypotheses (rows) and a list of
// candidate cases (objects); each case carries a per-hypothesis
// `{ pass, note? }` cell. The widget renders a dropdown of cases, an
// illustration area for the selected case (raw SVG / LaTeX / plain label),
// and a checklist of hypotheses showing pass (green check) vs fail (pink
// cross) with the per-cell note shown beneath.
//
// Pure declarative: this library does NOT evaluate functions or check
// hypotheses. The pass/fail booleans are part of the author's data — the
// widget just renders them. That keeps the assertion contract honest and
// lets a portable frontend consume the same `cases` / `hypotheses` arrays.
//
// Usage (called from a topic page):
//
//   MVCounterexampleExplorer.init('#w-cont-vs-diff', {
//     title: 'Continuous vs. differentiable',
//     hint:  'pick a candidate · check which hypotheses survive',
//     viewBox: '0 0 320 160',                       // optional
//     hypotheses: [
//       { id: 'continuous',     label: 'Continuous on $[-1, 1]$' },
//       { id: 'differentiable', label: 'Differentiable on $(-1, 1)$' },
//     ],
//     cases: [
//       { name: 'f(x) = x', latex: 'f(x) = x',
//         hypotheses: { continuous: { pass: true }, differentiable: { pass: true } } },
//       { name: 'f(x) = |x|', latex: 'f(x) = |x|', svgInner: '<polyline .../>',
//         hypotheses: { continuous: { pass: true }, differentiable: { pass: false, note: 'corner at $x = 0$' } } },
//     ],
//   });
//
// The container must exist before init() runs. Re-initializing the same
// element replaces the content.
//
// KaTeX: case `latex`, hypothesis `label`, and per-cell `note` are typeset
// via window.renderMathInElement (if KaTeX auto-render is loaded) on every
// case change.
//
// Dependencies: none. Plain SVG + DOM. Uses theme tokens var(--green),
// var(--pink), var(--mute), var(--ink), var(--panel2), var(--line),
// var(--yellow).

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
        else if (k.startsWith('data-') || k === 'aria-label' || k === 'role' ||
                 k === 'type' || k === 'value')
          e.setAttribute(k, attrs[k]);
        else e[k] = attrs[k];
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

  function typesetMath(node) {
    if (global.renderMathInElement) {
      try {
        global.renderMathInElement(node, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$',  right: '$',  display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true },
          ],
        });
      } catch (_) { /* swallow */ }
    }
  }

  function init(selector, opts) {
    const root = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!root) return null;
    if (!opts || !Array.isArray(opts.hypotheses) || !opts.hypotheses.length) {
      root.textContent = 'counterexample-explorer: no hypotheses';
      return null;
    }
    if (!Array.isArray(opts.cases) || !opts.cases.length) {
      root.textContent = 'counterexample-explorer: no cases';
      return null;
    }

    const hypotheses = opts.hypotheses;
    const cases = opts.cases;
    const viewBox = opts.viewBox || '0 0 320 160';
    const title = opts.title || 'Counterexample explorer';
    const hint = opts.hint || 'pick a candidate · check which hypotheses survive';

    // Build chrome.
    root.classList.add('widget');
    root.innerHTML = '';

    const hd = el('div', { class: 'hd' }, [
      el('span', { class: 'ttl' }, [title]),
      el('span', { class: 'hint' }, [hint]),
    ]);
    root.appendChild(hd);

    // Dropdown row.
    const select = el('select', {
      'aria-label': 'Candidate',
      style: [
        'background:var(--panel2)',
        'color:var(--ink)',
        'border:1px solid var(--line)',
        'border-radius:6px',
        'padding:.3rem .6rem',
        'font:inherit',
        'font-size:.92rem',
        'cursor:pointer',
        'min-width:14rem',
      ].join(';'),
    });
    cases.forEach((c, i) => {
      const opt = el('option', { value: String(i) }, [c.name || `case ${i + 1}`]);
      select.appendChild(opt);
    });
    const selectLabel = el('label', {
      style: 'display:inline-flex;gap:.5rem;align-items:center;font-size:.9rem;color:var(--mute)',
    }, ['candidate']);
    selectLabel.appendChild(select);
    const controlsRow = el('div', {
      class: 'row',
      style: 'display:flex;gap:.6rem;align-items:center;margin:.2rem 0 .7rem;flex-wrap:wrap',
    }, [selectLabel]);
    root.appendChild(controlsRow);

    // Illustration area: a centered block that hosts SVG (preferred when
    // svgInner is present) plus a LaTeX / display label beneath / instead.
    const illoSvg = svgEl('svg', {
      viewBox,
      'aria-label': 'candidate illustration',
      style: 'width:100%;max-width:360px;display:block;margin:0 auto;background:var(--panel2);border:1px solid var(--line);border-radius:6px',
    });
    const illoTitle = svgEl('title');
    illoTitle.textContent = 'Candidate illustration';
    illoSvg.appendChild(illoTitle);
    const illoLabel = el('div', {
      class: 'cex-label',
      style: [
        'text-align:center',
        'color:var(--ink)',
        'font-size:1rem',
        'margin:.5rem 0 .8rem',
        'min-height:1.4em',
        'line-height:1.4',
      ].join(';'),
    });
    const illoWrap = el('div', { class: 'cex-illo', style: 'margin:.2rem 0 .4rem' }, [illoSvg, illoLabel]);
    root.appendChild(illoWrap);

    // Hypothesis checklist (one row per hypothesis). Each row has an
    // icon (✓ or ✗), the hypothesis label, and an optional per-case note.
    const list = el('ul', {
      class: 'cex-list',
      style: 'list-style:none;padding:0;margin:.2rem 0 .2rem;display:flex;flex-direction:column;gap:.3rem',
    });
    const rowEls = hypotheses.map((h) => {
      const icon = el('span', {
        class: 'cex-icon',
        style: [
          'display:inline-flex',
          'align-items:center',
          'justify-content:center',
          'width:1.4rem',
          'height:1.4rem',
          'border-radius:50%',
          'font-weight:700',
          'font-size:.85rem',
          'flex-shrink:0',
        ].join(';'),
      });
      const label = el('span', {
        class: 'cex-label-text',
        style: 'color:var(--ink);font-size:.94rem;line-height:1.35',
      });
      label.innerHTML = h.label;
      const note = el('div', {
        class: 'cex-note',
        style: [
          'color:var(--mute)',
          'font-size:.85rem',
          'margin-left:1.9rem',
          'margin-top:.1rem',
          'line-height:1.4',
        ].join(';'),
      });
      const top = el('div', {
        style: 'display:flex;gap:.5rem;align-items:flex-start',
      }, [icon, label]);
      const li = el('li', {
        class: 'cex-row',
        style: [
          'padding:.45rem .6rem',
          'background:var(--panel2)',
          'border:1px solid var(--line)',
          'border-left-width:3px',
          'border-radius:4px',
        ].join(';'),
      }, [top, note]);
      return { li, icon, label, note };
    });
    rowEls.forEach((r) => list.appendChild(r.li));
    root.appendChild(list);

    function setRow(row, cell, hypId) {
      const c = cell || {};
      const hasCell = !!cell;
      if (!hasCell) {
        row.icon.textContent = '–';
        row.icon.style.background = 'var(--panel2)';
        row.icon.style.color = 'var(--mute)';
        row.icon.style.border = '1px solid var(--mute)';
        row.li.style.borderLeftColor = 'var(--mute)';
        row.note.textContent = `(no entry for "${hypId}")`;
        return;
      }
      if (c.pass) {
        row.icon.textContent = '✓';
        row.icon.style.background = 'color-mix(in srgb, var(--green) 18%, var(--panel2))';
        row.icon.style.color = 'var(--green)';
        row.icon.style.border = '1px solid var(--green)';
        row.li.style.borderLeftColor = 'var(--green)';
      } else {
        row.icon.textContent = '✗';
        row.icon.style.background = 'color-mix(in srgb, var(--pink) 18%, var(--panel2))';
        row.icon.style.color = 'var(--pink)';
        row.icon.style.border = '1px solid var(--pink)';
        row.li.style.borderLeftColor = 'var(--pink)';
      }
      if (typeof c.note === 'string' && c.note.length > 0) {
        row.note.innerHTML = c.note;
        row.note.style.display = '';
      } else {
        row.note.textContent = '';
        row.note.style.display = 'none';
      }
    }

    function render(idx) {
      const c = cases[Math.max(0, Math.min(cases.length - 1, idx | 0))];

      // Illustration: SVG first (if svgInner), then LaTeX / displayLabel beneath.
      // Wipe SVG between renders, keep <title>.
      while (illoSvg.firstChild) illoSvg.removeChild(illoSvg.firstChild);
      const t = svgEl('title');
      t.textContent = 'Candidate: ' + (c.name || '');
      illoSvg.appendChild(t);
      if (typeof c.svgInner === 'string' && c.svgInner.length > 0) {
        // Append raw SVG fragment via a transient wrapper to preserve namespacing.
        const tmp = document.createElementNS(SVGNS, 'svg');
        tmp.innerHTML = c.svgInner;
        while (tmp.firstChild) illoSvg.appendChild(tmp.firstChild);
        illoSvg.style.display = '';
      } else {
        // No SVG content: hide the SVG box so the latex label can stand alone.
        illoSvg.style.display = 'none';
      }

      // Label beneath illustration: latex (rendered) and / or displayLabel.
      const labelParts = [];
      if (typeof c.latex === 'string' && c.latex.length > 0) {
        labelParts.push(`<div class="cex-latex">$${c.latex}$</div>`);
      }
      if (typeof c.displayLabel === 'string' && c.displayLabel.length > 0) {
        labelParts.push(`<div class="cex-display" style="color:var(--mute);font-size:.88rem;margin-top:.2rem">${c.displayLabel}</div>`);
      }
      illoLabel.innerHTML = labelParts.join('');

      // Hypothesis rows.
      hypotheses.forEach((h, i) => {
        const cell = (c.hypotheses && c.hypotheses[h.id]) || null;
        setRow(rowEls[i], cell, h.id);
      });

      // Re-typeset: the readout area + label labels both contain $...$.
      typesetMath(illoLabel);
      typesetMath(list);
    }

    // Initial typesetting of the static hypothesis labels (one-shot).
    typesetMath(list);

    select.addEventListener('change', () => {
      render(parseInt(select.value, 10));
    });

    render(0);

    return {
      render,
      select(idx) {
        const i = Math.max(0, Math.min(cases.length - 1, idx | 0));
        select.value = String(i);
        render(i);
      },
      get index() { return parseInt(select.value, 10); },
    };
  }

  global.MVCounterexampleExplorer = { init };
})(typeof window !== 'undefined' ? window : globalThis);
