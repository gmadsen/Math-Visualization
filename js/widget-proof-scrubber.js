// Proof-scrubber widget. Walks the learner through an ordered list of proof
// steps using a slider (0…N-1) and play/pause. The caller supplies the step
// array; each step has { title, body, render?(svg, state) }. The widget
// renders a piece of chrome, a scrubber bar, an SVG (only if at least one
// step has a render callback), and a readout showing the current step's
// title + body.
//
// Usage (called from a topic page):
//
//   MVProofScrubber.init('#w-unsolvability', {
//     steps: [
//       { title: 'Set up', body: 'We have $f \\in \\mathbb{Q}[x]$...',
//         render(svg, state){ ... } },
//       { title: 'Splitting field', body: '...' , render(svg, state){ ... } },
//       ...
//     ],
//     // optional:
//     title: 'Why the general quintic has no radical formula',
//     hint: 'drag the slider or click a step',
//     autoplayMs: 2200,   // dwell time on each step during play; default 2000
//     viewBox: '0 0 320 160'   // default SVG viewBox
//   });
//
// The container must exist before init() runs. After init, the widget's DOM
// is built inside it; re-initializing the same element replaces the content.
//
// Katex: after the readout updates we call window.renderMathInElement on
// just the readout (if KaTeX's auto-render is present), so $...$ inside
// body / title is typeset.
//
// Dependencies: none. Plain SVG + DOM. The widget uses the same palette
// tokens (var(--yellow), var(--mute), etc.) as the rest of the notebook.

(function(global){
  const SVGNS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs){
    const e = document.createElementNS(SVGNS, tag);
    if(attrs) for(const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function el(tag, attrs, children){
    const e = document.createElement(tag);
    if(attrs) for(const k in attrs){
      if(k === 'class') e.className = attrs[k];
      else if(k === 'style') e.setAttribute('style', attrs[k]);
      else if(k.startsWith('data-') || k === 'type' || k === 'min' || k === 'max' ||
              k === 'step' || k === 'value' || k === 'aria-label' || k === 'role')
        e.setAttribute(k, attrs[k]);
      else e[k] = attrs[k];
    }
    if(children){
      for(const c of children){
        if(c == null) continue;
        e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      }
    }
    return e;
  }

  function typesetMath(node){
    if(global.renderMathInElement){
      try {
        global.renderMathInElement(node, {
          delimiters: [
            {left:'$$', right:'$$', display:true},
            {left:'$',  right:'$',  display:false},
            {left:'\\(', right:'\\)', display:false},
            {left:'\\[', right:'\\]', display:true}
          ]
        });
      } catch(_){ /* swallow */ }
    }
  }

  function init(selector, opts){
    const root = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if(!root){ return null; }
    if(!opts || !Array.isArray(opts.steps) || !opts.steps.length){
      root.textContent = 'proof-scrubber: no steps';
      return null;
    }

    const steps = opts.steps;
    const N = steps.length;
    const hasAnyRender = steps.some(s => typeof s.render === 'function');
    const autoplayMs = Math.max(400, opts.autoplayMs || 2000);
    const viewBox = opts.viewBox || '0 0 320 160';
    const title = opts.title || 'Proof scrubber';
    const hint  = opts.hint  || 'drag the slider or click a step';

    // Build chrome.
    root.classList.add('widget');
    root.innerHTML = '';

    const hdTtl = el('span', {class:'ttl'}, [title]);
    const hdHint = el('span', {class:'hint'}, [hint]);
    const hd = el('div', {class:'hd'}, [hdTtl, hdHint]);
    root.appendChild(hd);

    // Step chips: clickable dots labelled 1..N with title on hover.
    const chipsWrap = el('div', {
      class: 'ps-chips',
      style: 'display:flex;gap:.35rem;flex-wrap:wrap;margin:.2rem 0 .55rem'
    });
    const chipEls = [];
    for(let i = 0; i < N; i++){
      const chip = el('button', {
        type: 'button',
        class: 'ps-chip',
        'aria-label': `Step ${i+1}: ${steps[i].title || ''}`,
        style: [
          'background:var(--panel2)',
          'color:var(--mute)',
          'border:1px solid var(--line)',
          'border-radius:999px',
          'padding:.15rem .55rem',
          'font:inherit',
          'font-size:.82rem',
          'cursor:pointer',
          'line-height:1.2'
        ].join(';')
      }, [String(i+1)]);
      chip.dataset.step = String(i);
      chipsWrap.appendChild(chip);
      chipEls.push(chip);
    }
    root.appendChild(chipsWrap);

    // Scrubber bar: slider + play/pause + counter.
    const slider = el('input', {
      type: 'range',
      min: '0',
      max: String(N-1),
      step: '1',
      value: '0',
      'aria-label': 'Proof step',
      style: 'flex:1;max-width:none;accent-color:var(--yellow)'
    });
    const playBtn = el('button', {
      type: 'button',
      class: 'ps-play',
      'aria-label': 'Play',
      style: 'min-width:4.5rem'
    }, ['▶ play']);
    const counter = el('span', {
      class: 'ps-counter small',
      style: 'color:var(--mute);font-family:ui-monospace,monospace;white-space:nowrap'
    }, ['1 / ' + N]);
    const controls = el('div', {
      class: 'row',
      style: 'display:flex;gap:.6rem;align-items:center;margin:.1rem 0 .7rem'
    }, [playBtn, slider, counter]);
    root.appendChild(controls);

    // Optional SVG diagram area.
    let svg = null;
    if(hasAnyRender){
      svg = svgEl('svg', {
        viewBox,
        'aria-label': 'proof-step diagram',
        style: 'width:100%;max-width:520px;margin:0 auto .6rem;display:block'
      });
      const svgTitle = svgEl('title');
      svgTitle.textContent = 'Proof step diagram';
      svg.appendChild(svgTitle);
      root.appendChild(svg);
    }

    // Readout (title + body).
    const readTtl = el('div', {
      class: 'ps-step-title',
      style: [
        'color:var(--yellow)',
        'font-weight:600',
        'margin-bottom:.35rem',
        'font-size:.98rem'
      ].join(';')
    });
    const readBody = el('div', {
      class: 'ps-step-body',
      style: 'color:var(--ink);line-height:1.55'
    });
    const readout = el('div', {
      class: 'readout ps-readout',
      style: 'padding:.75rem .9rem;font-family:inherit;font-size:.95rem;white-space:normal;min-height:5em'
    }, [readTtl, readBody]);
    root.appendChild(readout);

    // State.
    const state = { step: 0, playing: false, timer: null };

    function update(){
      const i = state.step;
      slider.value = String(i);
      counter.textContent = (i+1) + ' / ' + N;
      // chip styles
      chipEls.forEach((c, k) => {
        if(k === i){
          c.style.background = 'var(--yellow)';
          c.style.color = '#111';
          c.style.borderColor = 'var(--yellow)';
        } else if(k < i){
          c.style.background = 'var(--panel2)';
          c.style.color = 'var(--ink)';
          c.style.borderColor = 'color-mix(in srgb, var(--yellow) 35%, var(--line))';
        } else {
          c.style.background = 'var(--panel2)';
          c.style.color = 'var(--mute)';
          c.style.borderColor = 'var(--line)';
        }
      });
      const s = steps[i];
      readTtl.textContent = (i+1) + '. ' + (s.title || '');
      readBody.innerHTML = s.body || '';
      typesetMath(readout);
      if(svg){
        // wipe the svg between renders; keep the <title>.
        while(svg.firstChild) svg.removeChild(svg.firstChild);
        const svgTitle = svgEl('title');
        svgTitle.textContent = 'Proof step ' + (i+1) + ': ' + (s.title || '');
        svg.appendChild(svgTitle);
        if(typeof s.render === 'function'){
          try { s.render(svg, { step: i, N, state }); }
          catch(err){
            // surface in dev console but don't break the widget
            if(global.console && global.console.error)
              global.console.error('proof-scrubber render step', i, err);
          }
        }
      }
    }

    function setStep(i){
      i = Math.max(0, Math.min(N-1, i|0));
      state.step = i;
      update();
    }

    function stopPlay(){
      state.playing = false;
      playBtn.textContent = '▶ play';
      playBtn.setAttribute('aria-label', 'Play');
      playBtn.classList.remove('active');
      if(state.timer){ clearTimeout(state.timer); state.timer = null; }
    }
    function tick(){
      if(!state.playing) return;
      if(state.step >= N-1){ stopPlay(); return; }
      setStep(state.step + 1);
      state.timer = setTimeout(tick, autoplayMs);
    }
    function startPlay(){
      if(state.step >= N-1) setStep(0);
      state.playing = true;
      playBtn.textContent = '❚❚ pause';
      playBtn.setAttribute('aria-label', 'Pause');
      playBtn.classList.add('active');
      state.timer = setTimeout(tick, autoplayMs);
    }

    // Wire events.
    slider.addEventListener('input', () => {
      stopPlay();
      setStep(parseInt(slider.value, 10));
    });
    chipsWrap.addEventListener('click', e => {
      const t = e.target.closest('.ps-chip');
      if(!t) return;
      stopPlay();
      setStep(parseInt(t.dataset.step, 10));
    });
    playBtn.addEventListener('click', () => {
      if(state.playing) stopPlay(); else startPlay();
    });

    update();

    return {
      setStep,
      stop: stopPlay,
      play: startPlay,
      get step(){ return state.step; }
    };
  }

  global.MVProofScrubber = { init };
})(typeof window !== 'undefined' ? window : globalThis);
