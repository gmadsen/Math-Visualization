// widget-diagram-editor.js
// Generic interactive commutative-diagram editor.
//
// Usage (browser, after the page's helper <script> has defined SVG + ensureArrow):
//
//   MVDiagramEditor.init('#widget-id', {
//     width: 560, height: 340,          // optional (defaults 560x340)
//     objects: [
//       { id:'A', x:120, y:80,  label:'A' },
//       { id:'B', x:420, y:80,  label:'B' },
//       { id:'P', x:120, y:260, label:'A\\times_Z B' },   // KaTeX inline allowed
//       { id:'Z', x:420, y:260, label:'Z' },
//     ],
//     morphisms: [
//       { from:'P', to:'A', label:'\\pi_A' },
//       { from:'P', to:'B', label:'\\pi_B' },
//       { from:'A', to:'Z', label:'f' },
//       { from:'B', to:'Z', label:'g' },
//     ],
//     commutes: [
//       { paths: [ ['\\pi_A','f'], ['\\pi_B','g'] ],
//         description: 'pullback square commutes' },
//     ],
//     title: 'Pullback square'            // optional
//   });
//
// Each commuting declaration is a list of label-paths (each path is a sequence of
// morphism labels read left-to-right as composition); for the square above, the
// two paths from P to Z are π_A then f, and π_B then g. The widget verifies the
// selected path matches any declared commuting equivalence class.
//
// Labels are rendered via <foreignObject> + KaTeX if window.renderMathInElement is
// available. Otherwise, plain textContent is used — labels with raw $…$ won't
// render, but the widget still functions.
(function(){
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const XHTML = 'http://www.w3.org/1999/xhtml';

  function svgEl(tag, attrs){
    const e = document.createElementNS(NS, tag);
    if(attrs) for(const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  // Ensure an arrowhead marker is defined on the svg's <defs>.
  function ensureArrowMarker(svg, id, color){
    let defs = svg.querySelector('defs');
    if(!defs){ defs = svgEl('defs'); svg.insertBefore(defs, svg.firstChild); }
    if(defs.querySelector('[id="'+id.replace(/"/g,'\\"')+'"]')) return;
    const mk = svgEl('marker', {
      id, viewBox:'0 0 10 10', refX:9, refY:5,
      markerWidth:6, markerHeight:6, orient:'auto'
    });
    mk.appendChild(svgEl('path', { d:'M0,0 L10,5 L0,10 z', fill:color }));
    defs.appendChild(mk);
  }

  function renderKatexInto(el){
    if(window.renderMathInElement){
      try{
        window.renderMathInElement(el, {
          delimiters:[
            {left:'$$',right:'$$',display:true},
            {left:'$', right:'$', display:false},
            {left:'\\(',right:'\\)',display:false},
            {left:'\\[',right:'\\]',display:true}
          ],
          throwOnError:false
        });
      }catch(e){ /* silent — KaTeX absent or label malformed */ }
    }
  }

  // Compare two arrays of strings for element-wise equality.
  function sameLabelPath(a, b){
    if(!a || !b) return false;
    if(a.length !== b.length) return false;
    for(let i=0;i<a.length;i++) if(a[i] !== b[i]) return false;
    return true;
  }

  // Chain the morphisms, pulling their from/to along. Returns {from,to,ok,reason}.
  function traceLabelPath(labels, morphisms){
    // pick the first morphism whose label matches each step, tracking object chain.
    if(!labels || labels.length === 0) return { ok:false, reason:'empty path' };
    // find starting morph (any match)
    const byLabel = new Map();
    for(const m of morphisms){
      if(!byLabel.has(m.label)) byLabel.set(m.label, []);
      byLabel.get(m.label).push(m);
    }
    // naive: resolve step by step, require contiguous composition.
    let first = null, steps = [];
    for(const lab of labels){
      const cand = byLabel.get(lab);
      if(!cand || cand.length === 0)
        return { ok:false, reason:`no morphism with label ${lab}` };
      let pick;
      if(steps.length === 0){ pick = cand[0]; }
      else {
        const need = steps[steps.length-1].to;
        pick = cand.find(m => m.from === need);
        if(!pick) return { ok:false, reason:`cannot compose ${lab} after ${steps[steps.length-1].label}` };
      }
      steps.push(pick);
      if(!first) first = pick;
    }
    return { ok:true, from: steps[0].from, to: steps[steps.length-1].to, steps };
  }

  // Try to match the selected morphism sequence against any declared commutation
  // equivalence class. Returns the match or null.
  function findCommutingMatch(selectedLabels, commutes){
    if(!commutes) return null;
    for(const c of commutes){
      const paths = c.paths || [];
      for(const p of paths){
        if(sameLabelPath(p, selectedLabels)){
          return { decl:c, path:p };
        }
      }
    }
    return null;
  }

  // ---- public API ---------------------------------------------------------
  const MVDiagramEditor = {
    _instances: new Map(),

    init(selector, cfg){
      const host = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;
      if(!host){ console.warn('[MVDiagramEditor] no host for', selector); return null; }

      const width  = cfg.width  || 560;
      const height = cfg.height || 340;

      // Build host DOM ------------------------------------------------------
      host.innerHTML = '';

      if(cfg.title){
        const hd = document.createElement('div');
        hd.className = 'hd';
        const ttl = document.createElement('div');
        ttl.className = 'ttl';
        ttl.textContent = cfg.title;
        hd.appendChild(ttl);
        const hint = document.createElement('div');
        hint.className = 'hint';
        hint.textContent = 'drag objects · click arrows to build a path · check commutativity';
        hd.appendChild(hint);
        host.appendChild(hd);
      }

      const svg = svgEl('svg', {
        viewBox: `0 0 ${width} ${height}`,
        width: String(width), height: String(height),
        class: 'mv-diagram-svg'
      });
      svg.style.touchAction = 'none';
      svg.style.userSelect = 'none';
      svg.setAttribute('role','img');
      svg.setAttribute('aria-label', cfg.title || 'Commutative diagram');
      const titleNode = svgEl('title');
      titleNode.textContent = cfg.title || 'Commutative diagram';
      svg.appendChild(titleNode);
      host.appendChild(svg);

      // readout
      const readout = document.createElement('div');
      readout.className = 'readout mv-diagram-readout';
      readout.textContent = 'drag a circle to reposition · click an arrow to start a path';
      host.appendChild(readout);

      // controls
      const row = document.createElement('div');
      row.className = 'row';
      const checkBtn = document.createElement('button');
      checkBtn.type = 'button';
      checkBtn.textContent = 'check commutativity';
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.textContent = 'clear selection';
      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.textContent = 'reset positions';
      row.appendChild(checkBtn);
      row.appendChild(clearBtn);
      row.appendChild(resetBtn);
      host.appendChild(row);

      // State ----------------------------------------------------------------
      const objectsInit = (cfg.objects || []).map(o => ({
        id:o.id, x:Number(o.x), y:Number(o.y),
        label: o.label ?? o.id,
        _origX:Number(o.x), _origY:Number(o.y),
        r: o.r || 22
      }));
      const objById = new Map(objectsInit.map(o => [o.id, o]));
      // Resolve morphism from/to to object refs, preserve label strings.
      const morphisms = (cfg.morphisms || []).map((m, i) => ({
        idx: i,
        from: m.from,
        to: m.to,
        label: m.label ?? `m${i}`,
        curve: (typeof m.curve === 'number') ? m.curve : 0
      }));
      const commutes = cfg.commutes || [];

      // selected: array of morphism indices (in chosen order)
      let selected = [];

      // Rendering -----------------------------------------------------------
      function selectedLabels(){ return selected.map(i => morphisms[i].label); }

      function arrowColor(i){
        return selected.includes(i) ? 'var(--yellow)' : 'var(--blue)';
      }

      function describeCurrent(){
        if(selected.length === 0)
          return 'drag a circle to reposition · click an arrow to start a path';
        const labs = selectedLabels();
        const trace = traceLabelPath(labs, morphisms);
        if(!trace.ok) return `Selected path: ${labs.join(' ∘ ')}   (${trace.reason})`;
        return `Selected path: ${trace.from} —[${labs.join(' ∘ ')}]→ ${trace.to}`;
      }

      function draw(){
        // Remove everything except <defs> and <title>
        Array.from(svg.children).forEach(ch => {
          if(ch.tagName && (ch.tagName.toLowerCase() === 'defs' || ch.tagName.toLowerCase() === 'title')) return;
          svg.removeChild(ch);
        });
        // Markers per color used
        ensureArrowMarker(svg, 'mv-arr-base', '#58c4dd');      // blue fallback color
        ensureArrowMarker(svg, 'mv-arr-hot',  '#ffd866');      // yellow fallback color

        // Draw morphisms first so circles overlay
        morphisms.forEach((m, i) => {
          const a = objById.get(m.from), b = objById.get(m.to);
          if(!a || !b) return;
          drawMorphism(m, i, a, b);
        });

        // Draw objects (circles + labels)
        objectsInit.forEach(o => drawObject(o));

        readout.textContent = describeCurrent();
      }

      function drawMorphism(m, i, a, b){
        const hot = selected.includes(i);
        const color = hot ? '#ffd866' : '#58c4dd';
        const strokeVar = hot ? 'var(--yellow)' : 'var(--blue)';
        const markerId = hot ? 'mv-arr-hot' : 'mv-arr-base';

        const dx = b.x - a.x, dy = b.y - a.y;
        const L = Math.hypot(dx, dy) || 1;
        const ux = dx / L, uy = dy / L;
        const pad1 = a.r + 4, pad2 = b.r + 6;
        const x1 = a.x + ux*pad1, y1 = a.y + uy*pad1;
        const x2 = b.x - ux*pad2, y2 = b.y - uy*pad2;
        const curve = m.curve || 0;
        const mx = (x1+x2)/2 - uy*curve;
        const my = (y1+y2)/2 + ux*curve;

        // visible stroked curve
        const d = `M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
        const path = svgEl('path', {
          d, fill:'none',
          stroke: strokeVar, 'stroke-width': hot ? 2.4 : 1.8,
          'marker-end': `url(#${markerId})`
        });
        svg.appendChild(path);

        // fat invisible hit-target
        const hit = svgEl('path', {
          d, fill:'none', stroke:'transparent', 'stroke-width':16,
          'data-morph-idx': String(i),
          style:'cursor:pointer'
        });
        hit.addEventListener('click', () => onArrowClick(i));
        svg.appendChild(hit);

        // label via foreignObject (KaTeX friendly). Offset perpendicular to the tangent.
        const off = 14 + (hot ? 2 : 0);
        const offSign = (curve >= 0) ? -1 : 1;
        const lx = mx + offSign * (-uy) * off;
        const ly = my + offSign * (ux)  * off;
        const fo = svgEl('foreignObject', {
          x: String(lx - 50), y: String(ly - 18),
          width: '100', height: '32',
          style:'overflow:visible;pointer-events:none'
        });
        const div = document.createElementNS(XHTML, 'div');
        div.setAttribute('xmlns', XHTML);
        div.setAttribute('style',
          'display:flex;align-items:center;justify-content:center;' +
          'height:100%;font-size:13px;font-style:italic;' +
          'color:' + strokeVar + ';text-align:center;line-height:1.1;' +
          'white-space:nowrap;');
        // Auto-wrap plain labels (no $) in $…$ so KaTeX italicizes them consistently.
        const labelSrc = m.label;
        const katexExpr = /[$\\]/.test(labelSrc) ? labelSrc : `$${labelSrc}$`;
        div.textContent = katexExpr;
        fo.appendChild(div);
        svg.appendChild(fo);
        renderKatexInto(div);
      }

      function drawObject(o){
        const g = svgEl('g', {
          'data-obj-id': o.id,
          class: 'mv-diag-obj',
          style: 'cursor:grab'
        });
        const circle = svgEl('circle', {
          cx: String(o.x), cy: String(o.y), r: String(o.r),
          fill: 'var(--panel2)',
          stroke: 'var(--violet)',
          'stroke-width': '1.6'
        });
        g.appendChild(circle);
        const fo = svgEl('foreignObject', {
          x: String(o.x - o.r - 6), y: String(o.y - 14),
          width: String(2 * o.r + 12), height: '28',
          style:'overflow:visible;pointer-events:none'
        });
        const div = document.createElementNS(XHTML, 'div');
        div.setAttribute('xmlns', XHTML);
        div.setAttribute('style',
          'display:flex;align-items:center;justify-content:center;' +
          'height:100%;font-size:14px;font-weight:600;' +
          'color:#fff;text-align:center;line-height:1;');
        const lbl = o.label;
        const katexExpr = /[$\\]/.test(lbl) ? lbl : `$${lbl}$`;
        div.textContent = katexExpr;
        fo.appendChild(div);
        g.appendChild(fo);
        svg.appendChild(g);
        renderKatexInto(div);

        // drag via pointer events on circle
        attachDrag(g, circle, o);
      }

      function attachDrag(g, circle, o){
        let dragging = false;
        let startPt = null, startObj = null;

        function svgPointFromEvent(ev){
          // convert screen → svg user coords.
          // Primary path: SVG's createSVGPoint + screenCTM.inverse. Fallback
          // (jsdom, unusual environments): scale clientXY by the svg's bounding
          // rect vs its viewBox.
          if(typeof svg.createSVGPoint === 'function'){
            try{
              const pt = svg.createSVGPoint();
              pt.x = ev.clientX; pt.y = ev.clientY;
              const ctm = svg.getScreenCTM && svg.getScreenCTM();
              if(ctm){
                const inv = ctm.inverse();
                const p = pt.matrixTransform(inv);
                return { x: p.x, y: p.y };
              }
            }catch(_){ /* fall through */ }
          }
          const rect = svg.getBoundingClientRect ? svg.getBoundingClientRect() : null;
          if(rect && rect.width > 0 && rect.height > 0){
            const sx = width / rect.width, sy = height / rect.height;
            return { x: (ev.clientX - rect.left) * sx, y: (ev.clientY - rect.top) * sy };
          }
          // Last-resort: interpret clientXY directly as user coords (test-env only).
          return { x: ev.clientX, y: ev.clientY };
        }

        circle.addEventListener('pointerdown', (ev) => {
          dragging = true;
          g.style.cursor = 'grabbing';
          try{ circle.setPointerCapture(ev.pointerId); }catch(_){}
          startPt  = svgPointFromEvent(ev);
          startObj = { x:o.x, y:o.y };
          ev.preventDefault();
        });
        circle.addEventListener('pointermove', (ev) => {
          if(!dragging) return;
          const p = svgPointFromEvent(ev);
          const nx = startObj.x + (p.x - startPt.x);
          const ny = startObj.y + (p.y - startPt.y);
          // clamp to viewBox (with a little margin)
          o.x = Math.max(o.r + 2, Math.min(width  - o.r - 2, nx));
          o.y = Math.max(o.r + 2, Math.min(height - o.r - 2, ny));
          draw();
        });
        const end = (ev) => {
          if(!dragging) return;
          dragging = false;
          g.style.cursor = 'grab';
          try{ circle.releasePointerCapture(ev.pointerId); }catch(_){}
        };
        circle.addEventListener('pointerup', end);
        circle.addEventListener('pointercancel', end);
      }

      // Interactions --------------------------------------------------------
      function onArrowClick(i){
        const m = morphisms[i];
        if(selected.length === 0){
          selected = [i];
        } else {
          const prev = morphisms[selected[selected.length-1]];
          // composable extension?
          if(prev.to === m.from){
            selected.push(i);
          } else {
            // restart with this arrow as the new head
            selected = [i];
          }
        }
        draw();
      }

      function onCheck(){
        if(selected.length === 0){
          readout.textContent = 'Select at least one arrow first (click a morphism).';
          return;
        }
        const labs = selectedLabels();
        const trace = traceLabelPath(labs, morphisms);
        if(!trace.ok){
          readout.textContent = `Selected path is not composable: ${trace.reason}.`;
          return;
        }
        const match = findCommutingMatch(labs, commutes);
        if(match){
          const alt = (match.decl.paths || [])
            .filter(p => !sameLabelPath(p, labs))
            .map(p => p.join(' ∘ '));
          const altText = alt.length
            ? `   (= ${alt.join('  =  ')})`
            : '';
          readout.textContent =
            `Commutation verified: ${labs.join(' ∘ ')}${altText}` +
            (match.decl.description ? `  — ${match.decl.description}` : '');
        } else {
          // Give a hint: does another declared path match from/to endpoints?
          const sameEndpoints = (commutes || [])
            .flatMap(c => (c.paths || []).map(p => ({ p, decl:c })))
            .filter(({p}) => {
              const t = traceLabelPath(p, morphisms);
              return t.ok && t.from === trace.from && t.to === trace.to;
            });
          if(sameEndpoints.length){
            const hints = sameEndpoints.map(x => x.p.join(' ∘ ')).join('  or  ');
            readout.textContent =
              `No declared commutation matches ${labs.join(' ∘ ')}. ` +
              `Try: ${hints}.`;
          } else {
            readout.textContent =
              `Path ${trace.from} → ${trace.to} via ${labs.join(' ∘ ')} ` +
              `is not part of any declared commuting square.`;
          }
        }
      }

      function onClearSelection(){
        selected = [];
        draw();
      }

      function onResetPositions(){
        objectsInit.forEach(o => { o.x = o._origX; o.y = o._origY; });
        selected = [];
        draw();
      }

      checkBtn.addEventListener('click', onCheck);
      clearBtn.addEventListener('click', onClearSelection);
      resetBtn.addEventListener('click', onResetPositions);

      // Initial draw
      draw();

      const inst = {
        host, svg,
        // test hooks
        _state: { get selected(){ return selected.slice(); }, objects: objectsInit, morphisms, commutes },
        clickArrow: onArrowClick,
        check: onCheck,
        clear: onClearSelection,
        resetPositions: onResetPositions,
        redraw: draw
      };
      MVDiagramEditor._instances.set(host, inst);
      return inst;
    },

    // Test helper: synthesize a pointer-drag on the object with `objId`.
    // delta = { dx, dy } in svg user coords.
    _simulateDrag(instance, objId, delta){
      const obj = instance._state.objects.find(o => o.id === objId);
      if(!obj) return false;
      obj.x += delta.dx || 0;
      obj.y += delta.dy || 0;
      instance.redraw();
      return true;
    }
  };

  if(typeof window !== 'undefined') window.MVDiagramEditor = MVDiagramEditor;
  if(typeof module !== 'undefined' && module.exports) module.exports = MVDiagramEditor;
})();
