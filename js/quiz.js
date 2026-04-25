// Quiz widget. Renders into <div class="quiz" data-concept="..."></div> placeholders.
// Reads quizzes/<topic>.json. On all-correct, calls MVProgress.setMastered.
//
// Three-tier schema:
//   {
//     "<concept-id>": {
//       "title": "...",
//       "questions": [ ... ],   // v1 tier (required)
//       "hard":      [ ... ],   // optional harder tier, unlocked after v1 mastered
//       "expert":    [ ... ]    // optional expert tier, unlocked after hard mastered
//     }
//   }
//
// Question types (JSON) — same shape in all three tiers:
//   { type: "mcq",          q: "...", choices: ["a","b","c"], answer: 1, explain: "..." }
//   { type: "numeric",      q: "...", answer: 5,        tol: 1e-6,    explain: "..." }
//   { type: "complex",      q: "...", answer: [re, im], tol: 1e-3,    explain: "..." }
//   { type: "multi-select", q: "...", choices: ["a","b","c","d"], answer: [0,2], explain: "..." }
//   { type: "ordering",     q: "...", items: ["a","b","c"], answer: [2,0,1], explain: "..." }
//   { type: "proof-completion", q: "...", steps: ["step1","step2"],
//       choices: ["A","B","C"], answer: 1, explain: "..." }
//   { type: "matching", q: "...", left: ["A","B","C"], right: ["x","y","z"],
//       answer: [2,0,1], explain: "..." }   // answer[i] = index in `left` that pairs with right[i]
//   { type: "spot-the-error", q: "...", steps: ["s1","s2 (bad)","s3"],
//       answer: 1, explain: "..." }
//   { type: "construction", q: "...",
//       target: { kind: "point", x: 40, y: 60, tolerance: 6 },
//       viewBox: "0 0 100 100", start: { x: 50, y: 50 }, explain: "..." }
//   { type: "guess-my-rule", q: "...",
//       examples: [[1,1],[2,4],[3,9]], testCases: [[4,16],[5,25]],
//       inputKind: "integer", outputKind: "integer",
//       tol: 1e-6, hint: "...", explain: "..." }
//
// Optional per-question: `hint` (short text revealed on the ? button; falls
// back to the first sentence of `explain` when absent).
(function(global){
  function num(s){ return parseFloat(String(s).trim()); }

  function sameSet(a, b){
    if(a.length !== b.length) return false;
    const sa = new Set(a), sb = new Set(b);
    if(sa.size !== sb.size) return false;
    for(const x of sa) if(!sb.has(x)) return false;
    return true;
  }

  function sameOrder(a, b){
    if(a.length !== b.length) return false;
    for(let i = 0; i < a.length; i++) if(a[i] !== b[i]) return false;
    return true;
  }

  function grade(q, raw){
    if(q.type === 'mcq') return raw === q.answer;
    if(q.type === 'numeric'){
      const v = num(raw); const tol = q.tol ?? 1e-6;
      return Number.isFinite(v) && Math.abs(v - q.answer) <= tol;
    }
    if(q.type === 'complex'){
      const re = num(raw.re), im = num(raw.im); const tol = q.tol ?? 1e-3;
      return Number.isFinite(re) && Number.isFinite(im)
        && Math.abs(re - q.answer[0]) <= tol
        && Math.abs(im - q.answer[1]) <= tol;
    }
    if(q.type === 'multi-select'){
      return Array.isArray(raw) && Array.isArray(q.answer) && sameSet(raw, q.answer);
    }
    if(q.type === 'ordering'){
      return Array.isArray(raw) && Array.isArray(q.answer) && sameOrder(raw, q.answer);
    }
    if(q.type === 'proof-completion'){
      return raw === q.answer;
    }
    if(q.type === 'matching'){
      return Array.isArray(raw) && Array.isArray(q.answer) && sameOrder(raw, q.answer);
    }
    if(q.type === 'spot-the-error'){
      return raw === q.answer;
    }
    if(q.type === 'construction'){
      if(!raw || !q.target || q.target.kind !== 'point') return false;
      const dx = raw.x - q.target.x, dy = raw.y - q.target.y;
      return Math.hypot(dx, dy) <= (q.target.tolerance ?? 5);
    }
    if(q.type === 'guess-my-rule'){
      if(!Array.isArray(raw) || !Array.isArray(q.testCases)) return false;
      if(raw.length !== q.testCases.length) return false;
      const tol = q.tol ?? 1e-6;
      for(let i = 0; i < q.testCases.length; i++){
        const expected = q.testCases[i][1];
        const given = num(raw[i]);
        if(!Number.isFinite(given)) return false;
        if(Math.abs(given - expected) > tol) return false;
      }
      return true;
    }
    return false;
  }

  // First-sentence heuristic: split on `.`, `?`, `!`, keep the trailing
  // punctuation. Returns '' if the explain field is missing or too short to
  // be useful as a hint on its own.
  function firstSentence(explain){
    const s = String(explain || '').trim();
    if(!s) return '';
    const m = s.match(/^([\s\S]*?[.?!])(\s|$)/);
    const chunk = (m ? m[1] : s).trim();
    if(chunk.length < 20) return '';
    return chunk;
  }

  // Does this question have something we can reveal as a hint?
  function hintTextOf(q){
    if(q.hint && String(q.hint).trim()) return String(q.hint).trim();
    return firstSentence(q.explain);
  }

  // Directional feedback for a wrong numeric answer. `v` is the parsed
  // submission, `a` is the correct answer, `tol` is the absolute tolerance
  // the bank specifies. Messages are short and never reveal the answer.
  function numericFeedback(v, a, tol){
    if(!Number.isFinite(v)) return '✗ enter a number';
    const diff = v - a;
    const absDiff = Math.abs(diff);
    // Sign flip: roughly opposite sign, magnitudes comparable.
    if(a !== 0 && v !== 0 && Math.sign(v) !== Math.sign(a)){
      const r = Math.abs(v) / Math.abs(a);
      if(r > 0.5 && r < 2) return '✗ sign flipped?';
    }
    // Order-of-magnitude error (relative ratio check, only if a ≠ 0).
    if(a !== 0){
      const r = Math.abs(v) / Math.abs(a);
      if(r >= 5 && r <= 20)      return '✗ off by roughly a factor of 10';
      if(r >= 20)                return '✗ magnitude way too large';
      if(r > 0 && r <= 1/5 && r >= 1/20) return '✗ off by roughly a factor of 10';
      if(r > 0 && r < 1/20)      return '✗ magnitude way too small';
      if(r > 2 && r < 5)         return '✗ within a factor of a few — recheck arithmetic';
      if(r < 0.5 && r > 1/5)     return '✗ within a factor of a few — recheck arithmetic';
    }
    // Close: within ~2× tolerance.
    if(absDiff <= 2 * tol){
      return diff > 0 ? '✗ slightly too large' : '✗ slightly too small';
    }
    return '✗ not close — re-check approach';
  }

  // Directional feedback for a wrong complex answer.
  function complexFeedback(vre, vim, ans, tol){
    if(!Number.isFinite(vre) || !Number.isFinite(vim)) return '✗ enter two numbers';
    const [are, aim] = ans;
    const reOk = Math.abs(vre - are) <= tol;
    const imOk = Math.abs(vim - aim) <= tol;
    if(reOk && !imOk) return '✗ real part ✓, imaginary part off';
    if(!reOk && imOk) return '✗ imaginary part ✓, real part off';
    // Swap check: did they enter (aim, are)?
    if(Math.abs(vre - aim) <= tol && Math.abs(vim - are) <= tol){
      return '✗ did you swap real and imaginary?';
    }
    // Magnitude/phase heuristic.
    const vmag = Math.hypot(vre, vim);
    const amag = Math.hypot(are, aim);
    if(amag > 0 && vmag > 0){
      const magRatio = vmag / amag;
      const magClose = magRatio > 0.9 && magRatio < 1.1;
      const dot = vre*are + vim*aim;
      const phaseCos = dot / (vmag * amag);
      const phaseClose = phaseCos > 0.98;
      if(magClose && !phaseClose) return '✗ magnitude ✓, angle off';
      if(!magClose && phaseClose) return '✗ direction ✓, magnitude off';
    }
    return '✗ not close — re-check approach';
  }

  // Directional feedback for a wrong multi-select answer.
  // `selected` and `answer` are arrays of choice indices.
  function multiSelectFeedback(selected, answer){
    if(!Array.isArray(selected) || selected.length === 0) return '✗ select at least one option';
    const ans = new Set(answer);
    const sel = new Set(selected);
    let correct = 0, extra = 0, missed = 0;
    for(const x of sel) if(ans.has(x)) correct++; else extra++;
    for(const x of ans) if(!sel.has(x)) missed++;
    if(extra > 0 && missed === 0) return '✗ too many selected';
    if(extra === 0 && missed > 0) return '✗ too few selected';
    if(extra > 0 && missed > 0)   return '✗ partially wrong — some right, some wrong';
    return '✗ try again';
  }

  // Directional feedback for a wrong ordering answer.
  // `submitted` and `answer` are arrays of item indices (permutations).
  function orderingFeedback(submitted, answer){
    if(!Array.isArray(submitted) || submitted.length !== answer.length){
      return '✗ arrange every item';
    }
    let outOfPlace = 0;
    for(let i = 0; i < answer.length; i++){
      if(submitted[i] !== answer[i]) outOfPlace++;
    }
    if(outOfPlace === 0) return '';
    return `✗ ${outOfPlace} item${outOfPlace === 1 ? '' : 's'} out of place`;
  }

  // Directional feedback for a wrong proof-completion answer. The question's
  // `steps` array describes the first N steps; `answer` is the correct next
  // step. On wrong answer we name the gap: the choice the learner picked
  // presumably violates some earlier step in the chain, so we hint to
  // re-read the last step.
  function proofCompletionFeedback(selected, q){
    if(!Number.isInteger(selected)) return '✗ pick a continuation';
    const n = (q.steps || []).length;
    if(n === 0) return '✗ try again';
    return `✗ re-read step ${n} — the next move has to use it`;
  }

  // Directional feedback for a wrong matching answer. `submitted` and
  // `answer` are same-length permutations; we just report how many right
  // slots pair to the correct left item.
  function matchingFeedback(submitted, answer){
    if(!Array.isArray(submitted) || submitted.length !== answer.length){
      return '✗ pair every row';
    }
    let correct = 0;
    for(let i = 0; i < answer.length; i++){
      if(submitted[i] === answer[i]) correct++;
    }
    return `✗ ${correct} of ${answer.length} pairs correct`;
  }

  // Directional feedback for a wrong spot-the-error answer. If the learner
  // picked a valid step we tell them it's valid. If they haven't picked yet,
  // nudge them.
  function spotTheErrorFeedback(selected, q){
    if(!Number.isInteger(selected) || selected < 0) return '✗ click the flawed step';
    if(selected === q.answer) return '';
    return `✗ step ${selected + 1} is valid — try another`;
  }

  // Directional feedback for a wrong construction answer. `raw = {x,y}` in
  // viewBox coords; `target = {x,y,tolerance}`. We report direction only
  // (left/right/up/down), not magnitude.
  function constructionFeedback(raw, target){
    if(!raw || !Number.isFinite(raw.x) || !Number.isFinite(raw.y)){
      return '✗ drag the marker to place it';
    }
    const dx = raw.x - target.x;
    const dy = raw.y - target.y;
    const tol = target.tolerance ?? 5;
    const dist = Math.hypot(dx, dy);
    if(dist <= tol) return '';
    // Dominant axis gets the hint.
    const parts = [];
    if(Math.abs(dx) > tol){
      parts.push(dx > 0 ? 'too far right' : 'too far left');
    }
    if(Math.abs(dy) > tol){
      // In SVG viewBox y grows down; describe it that way.
      parts.push(dy > 0 ? 'too far down' : 'too far up');
    }
    if(parts.length === 0) return '✗ close — nudge a bit';
    return '✗ ' + parts.join(', ');
  }

  // Directional feedback for a wrong guess-my-rule answer. `submitted` is an
  // array of raw strings (or numbers), `q` is the question. We report how
  // many test cases matched.
  function guessMyRuleFeedback(submitted, q){
    if(!Array.isArray(submitted) || submitted.length !== q.testCases.length){
      return '✗ fill in every test case';
    }
    const tol = q.tol ?? 1e-6;
    let matched = 0, blank = 0;
    for(let i = 0; i < q.testCases.length; i++){
      const v = num(submitted[i]);
      if(!Number.isFinite(v)){ blank++; continue; }
      if(Math.abs(v - q.testCases[i][1]) <= tol) matched++;
    }
    if(blank > 0) return `✗ ${blank} entr${blank === 1 ? 'y' : 'ies'} missing`;
    return `✗ ${matched} of ${q.testCases.length} test cases match`;
  }

  function typeset(el){
    if(typeof renderMathInElement === 'function'){
      renderMathInElement(el, {
        delimiters:[
          {left:'$$',right:'$$',display:true},
          {left:'$',right:'$',display:false}
        ], throwOnError:false
      });
    }
  }

  // ---- Ordering widget (click-to-promote / move-up & move-down) --------------
  // Drag-and-drop is nicer on desktop but finicky on touch devices; a pair
  // of ↑ / ↓ buttons per row works everywhere and is accessible to screen
  // readers without any ARIA gymnastics. The widget keeps its own `order`
  // array (item indices in current display order) and exposes getOrder() so
  // the grader can read it on check.
  function renderOrdering(hostEl, q, nameKey){
    const n = q.items.length;
    // Initial order: shuffled deterministically by nameKey so the page is
    // stable across reloads but not trivially 0..n-1.
    let seed = 0;
    for(let i = 0; i < nameKey.length; i++) seed = (seed * 31 + nameKey.charCodeAt(i)) >>> 0;
    const order = Array.from({length: n}, (_, i) => i);
    // Fisher-Yates with a small PRNG.
    for(let i = n - 1; i > 0; i--){
      seed = (seed * 1103515245 + 12345) >>> 0;
      const j = seed % (i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    // If the shuffled order accidentally equals the answer, bump one swap
    // so the learner actually has to do something.
    if(Array.isArray(q.answer) && q.answer.length === n){
      let same = true;
      for(let i = 0; i < n; i++) if(order[i] !== q.answer[i]){ same = false; break; }
      if(same && n >= 2){ [order[0], order[1]] = [order[1], order[0]]; }
    }

    hostEl.innerHTML = `
      <ol data-role="order-list" style="list-style:none;padding:0;margin:.3rem 0;
        border:1px solid var(--line);border-radius:8px;overflow:hidden;
        background:var(--panel2)"></ol>
    `;
    const ol = hostEl.querySelector('[data-role="order-list"]');

    function draw(){
      ol.innerHTML = '';
      order.forEach((itemIdx, pos) => {
        const li = document.createElement('li');
        li.style.cssText = `display:flex;align-items:center;gap:.6rem;
          padding:.45rem .7rem;border-top:1px solid var(--line)`;
        if(pos === 0) li.style.borderTop = '0';
        li.innerHTML = `
          <span style="display:inline-block;min-width:1.4em;color:var(--mute);
            font-variant-numeric:tabular-nums;text-align:right">${pos + 1}.</span>
          <span style="flex:1">${q.items[itemIdx]}</span>
          <button data-role="up" data-pos="${pos}" aria-label="move up"
            ${pos === 0 ? 'disabled' : ''}
            style="background:var(--panel);color:var(--ink);border:1px solid var(--line);
            border-radius:6px;padding:.15rem .45rem;font:inherit;font-size:.85rem;
            cursor:${pos === 0 ? 'default' : 'pointer'};opacity:${pos === 0 ? '.4' : '1'}">↑</button>
          <button data-role="down" data-pos="${pos}" aria-label="move down"
            ${pos === n - 1 ? 'disabled' : ''}
            style="background:var(--panel);color:var(--ink);border:1px solid var(--line);
            border-radius:6px;padding:.15rem .45rem;font:inherit;font-size:.85rem;
            cursor:${pos === n - 1 ? 'default' : 'pointer'};opacity:${pos === n - 1 ? '.4' : '1'}">↓</button>
        `;
        ol.appendChild(li);
      });
      // Re-typeset after DOM rewrite so $…$ inside items stays live.
      typeset(ol);
    }

    ol.addEventListener('click', (ev) => {
      const btn = ev.target.closest('button[data-role]');
      if(!btn || btn.disabled) return;
      const pos = parseInt(btn.getAttribute('data-pos'), 10);
      const role = btn.getAttribute('data-role');
      if(role === 'up' && pos > 0){
        [order[pos - 1], order[pos]] = [order[pos], order[pos - 1]];
      } else if(role === 'down' && pos < n - 1){
        [order[pos], order[pos + 1]] = [order[pos + 1], order[pos]];
      }
      draw();
    });

    draw();
    return { getOrder: () => order.slice() };
  }

  // ---- Matching widget ------------------------------------------------------
  // Renders two columns: `left` items labeled (A, B, C, ...) and `right` items
  // each with a dropdown selecting which left item pairs with it. getSelection()
  // returns an array of length right.length where entry i is the chosen left
  // index (or -1 if unpicked).
  function renderMatching(hostEl, q, nameKey){
    const n = q.right.length;
    const labels = Array.from({length: q.left.length}, (_, i) =>
      String.fromCharCode(65 + i));   // A, B, C, ...
    const leftHTML = q.left.map((item, i) =>
      `<li style="margin:.25rem 0;list-style:none;display:flex;align-items:baseline;gap:.5rem">
         <span style="color:var(--violet);font-weight:600;min-width:1.4em">${labels[i]}.</span>
         <span>${item}</span>
       </li>`
    ).join('');
    const rightRowsHTML = q.right.map((item, i) => {
      const opts = ['<option value="-1">— pick —</option>']
        .concat(q.left.map((_, j) => `<option value="${j}">${labels[j]}</option>`))
        .join('');
      return `<li style="margin:.25rem 0;list-style:none;display:flex;
        align-items:center;gap:.5rem">
        <select data-role="match-sel" data-right="${i}" name="${nameKey}-${i}"
          style="background:var(--panel);color:var(--ink);border:1px solid var(--line);
          border-radius:6px;padding:.1rem .3rem;font:inherit">${opts}</select>
        <span style="flex:1">${item}</span>
      </li>`;
    }).join('');
    hostEl.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin-top:.3rem">
        <div>
          <div style="color:var(--mute);font-size:.85rem;margin-bottom:.25rem">Items</div>
          <ul style="padding:0;margin:0">${leftHTML}</ul>
        </div>
        <div>
          <div style="color:var(--mute);font-size:.85rem;margin-bottom:.25rem">
            Pair with (pick a letter)
          </div>
          <ul style="padding:0;margin:0">${rightRowsHTML}</ul>
        </div>
      </div>
    `;
    typeset(hostEl);
    return {
      getSelection(){
        const sels = hostEl.querySelectorAll('select[data-role="match-sel"]');
        return Array.from(sels).map(s => parseInt(s.value, 10));
      }
    };
  }

  // ---- Spot-the-error widget ------------------------------------------------
  // Renders a numbered proof where each step is clickable. The learner's
  // selection persists; getSelection() returns the 0-based index or -1.
  function renderSpotTheError(hostEl, q, nameKey){
    let selected = -1;
    hostEl.innerHTML = `
      <ol data-role="ste-list" style="list-style:none;padding:0;margin:.3rem 0;
        border:1px solid var(--line);border-radius:8px;overflow:hidden;
        background:var(--panel2)"></ol>
      <div style="color:var(--mute);font-size:.85rem;margin-top:.2rem">
        click the step that contains the error
      </div>
    `;
    const ol = hostEl.querySelector('[data-role="ste-list"]');
    function draw(){
      ol.innerHTML = '';
      q.steps.forEach((step, i) => {
        const li = document.createElement('li');
        const isSel = i === selected;
        li.style.cssText = `display:flex;gap:.6rem;padding:.45rem .7rem;
          border-top:1px solid var(--line);cursor:pointer;
          background:${isSel ? 'color-mix(in srgb, var(--pink) 14%, transparent)' : 'transparent'}`;
        if(i === 0) li.style.borderTop = '0';
        li.innerHTML = `
          <span style="display:inline-block;min-width:1.6em;color:var(--mute);
            font-variant-numeric:tabular-nums;text-align:right">${i + 1}.</span>
          <span style="flex:1">${step}</span>
        `;
        li.addEventListener('click', () => {
          selected = i;
          draw();
        });
        ol.appendChild(li);
      });
      typeset(ol);
    }
    draw();
    return { getSelection: () => selected };
  }

  // ---- Construction widget (draggable point on an SVG canvas) ---------------
  // The SVG uses the question's `viewBox`. A marker can be dragged anywhere
  // inside; getSelection() returns { x, y } in viewBox coordinates.
  function renderConstruction(hostEl, q, nameKey){
    const vb = (q.viewBox || '0 0 100 100').split(/\s+/).map(Number);
    const [vx, vy, vw, vh] = vb;
    const startX = q.start?.x ?? (vx + vw / 2);
    const startY = q.start?.y ?? (vy + vh / 2);
    const state = { x: startX, y: startY };
    hostEl.innerHTML = `
      <div style="max-width:360px;margin:.3rem 0">
        <svg data-role="cons-svg" viewBox="${q.viewBox || '0 0 100 100'}"
          preserveAspectRatio="xMidYMid meet"
          style="width:100%;height:auto;background:var(--panel2);
          border:1px solid var(--line);border-radius:8px;touch-action:none">
          <rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="none" stroke="none"/>
          <g data-role="cons-bg"></g>
          <circle data-role="cons-marker" r="3.5"
            fill="var(--yellow)" stroke="var(--ink)" stroke-width="0.6"
            cx="${startX}" cy="${startY}" style="cursor:grab"/>
        </svg>
      </div>
      <div style="color:var(--mute);font-size:.85rem">
        drag the marker · position (<span data-role="cons-x">${startX.toFixed(1)}</span>,
        <span data-role="cons-y">${startY.toFixed(1)}</span>)
      </div>
    `;
    const svg = hostEl.querySelector('[data-role="cons-svg"]');
    const marker = hostEl.querySelector('[data-role="cons-marker"]');
    const xReadout = hostEl.querySelector('[data-role="cons-x"]');
    const yReadout = hostEl.querySelector('[data-role="cons-y"]');
    function clientToViewBox(clientX, clientY){
      const rect = svg.getBoundingClientRect();
      const scaleX = vw / rect.width;
      const scaleY = vh / rect.height;
      return {
        x: vx + (clientX - rect.left) * scaleX,
        y: vy + (clientY - rect.top) * scaleY
      };
    }
    function setPos(x, y){
      state.x = Math.max(vx, Math.min(vx + vw, x));
      state.y = Math.max(vy, Math.min(vy + vh, y));
      marker.setAttribute('cx', state.x);
      marker.setAttribute('cy', state.y);
      xReadout.textContent = state.x.toFixed(1);
      yReadout.textContent = state.y.toFixed(1);
    }
    let dragging = false;
    function onDown(ev){
      dragging = true;
      marker.style.cursor = 'grabbing';
      if(svg.setPointerCapture && ev.pointerId !== undefined){
        try { svg.setPointerCapture(ev.pointerId); } catch(_){}
      }
      const p = clientToViewBox(ev.clientX, ev.clientY);
      setPos(p.x, p.y);
      ev.preventDefault();
    }
    function onMove(ev){
      if(!dragging) return;
      const p = clientToViewBox(ev.clientX, ev.clientY);
      setPos(p.x, p.y);
    }
    function onUp(){
      dragging = false;
      marker.style.cursor = 'grab';
    }
    svg.addEventListener('pointerdown', onDown);
    svg.addEventListener('pointermove', onMove);
    svg.addEventListener('pointerup',   onUp);
    svg.addEventListener('pointercancel', onUp);
    return {
      getSelection: () => ({ x: state.x, y: state.y }),
      setPosition: (x, y) => setPos(x, y)
    };
  }

  // ---- Guess-my-rule widget -------------------------------------------------
  // Shows the `examples` as (input, output) pairs, then for each test case
  // shows the input and a blank for the output. getSelection() returns an
  // array of raw strings from each blank.
  function renderGuessMyRule(hostEl, q, nameKey){
    const examplesHTML = q.examples.map(([a, b]) =>
      `<code style="background:var(--panel2);padding:.1rem .4rem;border-radius:4px;
        border:1px solid var(--line);margin:.15rem .15rem .15rem 0;display:inline-block">
        $${a}$ → $${b}$
      </code>`
    ).join('');
    const testRowsHTML = q.testCases.map(([a], i) =>
      `<div style="display:flex;align-items:center;gap:.5rem;margin:.25rem 0">
         <span>input $${a}$ →</span>
         <input type="text" inputmode="decimal" data-role="gmr-in"
           data-idx="${i}" placeholder="output"
           style="width:110px;background:var(--panel);color:var(--ink);
           border:1px solid var(--line);border-radius:6px;padding:.15rem .4rem;font:inherit"/>
       </div>`
    ).join('');
    hostEl.innerHTML = `
      <div style="margin:.3rem 0">
        <div style="color:var(--mute);font-size:.85rem;margin-bottom:.2rem">Examples</div>
        <div>${examplesHTML}</div>
      </div>
      <div style="margin:.3rem 0">
        <div style="color:var(--mute);font-size:.85rem;margin-bottom:.2rem">
          Apply your rule to predict each test output
        </div>
        ${testRowsHTML}
      </div>
    `;
    typeset(hostEl);
    return {
      getSelection(){
        const inputs = hostEl.querySelectorAll('[data-role="gmr-in"]');
        return Array.from(inputs).map(el => el.value);
      }
    };
  }

  // Render a single tier's questions into `container`. onAllCorrect fires
  // exactly once per render when every question in this tier is graded
  // correct. Inputs stay editable so retakes still refresh the explain text.
  function renderTier(container, conceptId, tier, questions, onAllCorrect){
    const passed = new Set();
    let fired = false;

    questions.forEach((q, i) => {
      const qDiv = document.createElement('div');
      qDiv.style.cssText = 'border-top:1px solid var(--line);padding:.7rem 0;margin-top:.4rem';

      let inputHTML = '';
      const nameKey = `q-${conceptId}-${tier}-${i}`;
      if(q.type === 'mcq'){
        inputHTML = q.choices.map((c,j) =>
          `<label style="display:block;margin:.25rem 0;cursor:pointer">
             <input type="radio" name="${nameKey}" value="${j}" style="margin-right:.4rem"> ${c}
           </label>`
        ).join('');
      } else if(q.type === 'numeric'){
        inputHTML = `<input type="text" inputmode="decimal" data-role="numin" placeholder="number" style="width:160px"/>`;
      } else if(q.type === 'complex'){
        inputHTML = `<input type="text" inputmode="decimal" data-role="re" placeholder="Re" style="width:90px"/>
                     <span style="color:var(--mute)">+</span>
                     <input type="text" inputmode="decimal" data-role="im" placeholder="Im" style="width:90px"/>
                     <span style="color:var(--mute)">i</span>`;
      } else if(q.type === 'multi-select'){
        inputHTML = q.choices.map((c,j) =>
          `<label style="display:block;margin:.25rem 0;cursor:pointer">
             <input type="checkbox" name="${nameKey}" value="${j}" style="margin-right:.4rem"> ${c}
           </label>`
        ).join('')
          + `<div style="color:var(--mute);font-size:.85rem;margin-top:.25rem">select all that apply</div>`;
      } else if(q.type === 'ordering'){
        inputHTML = `<div data-role="order-host"></div>
          <div style="color:var(--mute);font-size:.85rem;margin-top:.2rem">use ↑ / ↓ to reorder</div>`;
      } else if(q.type === 'proof-completion'){
        const stepsHTML = (q.steps || []).map((step, si) =>
          `<li style="margin:.2rem 0;display:flex;gap:.5rem">
             <span style="color:var(--mute);min-width:1.6em;text-align:right;
               font-variant-numeric:tabular-nums">${si + 1}.</span>
             <span style="flex:1">${step}</span>
           </li>`
        ).join('');
        const choicesHTML = (q.choices || []).map((c, j) =>
          `<label style="display:block;margin:.25rem 0;cursor:pointer">
             <input type="radio" name="${nameKey}" value="${j}" style="margin-right:.4rem"> ${c}
           </label>`
        ).join('');
        inputHTML = `
          <ol style="list-style:none;padding:0;margin:.3rem 0;border:1px solid var(--line);
            border-radius:8px;background:var(--panel2);padding:.4rem .6rem">${stepsHTML}</ol>
          <div style="margin-top:.4rem;color:var(--mute);font-size:.88rem">Next step:</div>
          <div>${choicesHTML}</div>
        `;
      } else if(q.type === 'matching'){
        inputHTML = `<div data-role="match-host"></div>`;
      } else if(q.type === 'spot-the-error'){
        inputHTML = `<div data-role="ste-host"></div>`;
      } else if(q.type === 'construction'){
        inputHTML = `<div data-role="cons-host"></div>`;
      } else if(q.type === 'guess-my-rule'){
        inputHTML = `<div data-role="gmr-host"></div>`;
      }

      const hint = hintTextOf(q);
      const hintBtnHTML = hint
        ? `<button data-role="hint-btn" aria-label="show hint" title="show hint"
             style="background:var(--panel2);color:var(--yellow);border:1px solid var(--line);
             border-radius:6px;padding:.2rem .55rem;font:inherit;font-size:.9rem;cursor:pointer">?</button>`
        : '';

      qDiv.innerHTML = `
        <div style="margin-bottom:.5rem">
          <b>Q${i+1}.</b> ${q.q}
          ${hintBtnHTML}
        </div>
        <div data-role="hint-box" class="quiz-hint" style="display:none;margin:.35rem 0 .5rem;
          padding:.3rem .7rem;color:var(--mute);border-left:2px solid var(--yellow);
          background:color-mix(in srgb, var(--yellow) 6%, transparent);border-radius:0 4px 4px 0;
          font-size:.92rem"></div>
        <div>${inputHTML}</div>
        <div class="row" style="margin-top:.5rem">
          <button data-role="check">check</button>
          <span data-role="fb" style="font-size:.9rem"></span>
        </div>
        <div data-role="explain" class="ok" style="display:none;margin-top:.5rem">${q.explain || ''}</div>
      `;
      container.appendChild(qDiv);

      // Mount the ordering widget AFTER qDiv is in the DOM so its inner
      // innerHTML assignment doesn't wipe the nested button listeners.
      let orderingWidget = null;
      let matchingWidget = null;
      let spotTheErrorWidget = null;
      let constructionWidget = null;
      let guessMyRuleWidget = null;
      if(q.type === 'ordering'){
        const orderHost = qDiv.querySelector('[data-role="order-host"]');
        orderingWidget = renderOrdering(orderHost, q, nameKey);
      } else if(q.type === 'matching'){
        const host = qDiv.querySelector('[data-role="match-host"]');
        matchingWidget = renderMatching(host, q, nameKey);
      } else if(q.type === 'spot-the-error'){
        const host = qDiv.querySelector('[data-role="ste-host"]');
        spotTheErrorWidget = renderSpotTheError(host, q, nameKey);
      } else if(q.type === 'construction'){
        const host = qDiv.querySelector('[data-role="cons-host"]');
        constructionWidget = renderConstruction(host, q, nameKey);
      } else if(q.type === 'guess-my-rule'){
        const host = qDiv.querySelector('[data-role="gmr-host"]');
        guessMyRuleWidget = renderGuessMyRule(host, q, nameKey);
      }

      const fb = qDiv.querySelector('[data-role="fb"]');
      const explainEl = qDiv.querySelector('[data-role="explain"]');
      const hintBox = qDiv.querySelector('[data-role="hint-box"]');
      const hintBtn = qDiv.querySelector('[data-role="hint-btn"]');
      if(hintBtn && hintBox){
        hintBox.textContent = hint;
        hintBtn.addEventListener('click', () => {
          const showing = hintBox.style.display !== 'none';
          hintBox.style.display = showing ? 'none' : 'block';
          hintBtn.setAttribute('aria-expanded', showing ? 'false' : 'true');
          if(!showing) typeset(hintBox);
        });
      }
      qDiv.querySelector('[data-role="check"]').addEventListener('click', () => {
        let raw;
        if(q.type === 'mcq'){
          const sel = qDiv.querySelector(`input[name="${nameKey}"]:checked`);
          if(!sel){ fb.textContent = 'pick an option'; fb.style.color = 'var(--mute)'; return; }
          raw = parseInt(sel.value, 10);
        } else if(q.type === 'numeric'){
          raw = qDiv.querySelector('[data-role="numin"]').value;
        } else if(q.type === 'complex'){
          raw = { re: qDiv.querySelector('[data-role="re"]').value,
                  im: qDiv.querySelector('[data-role="im"]').value };
        } else if(q.type === 'multi-select'){
          const sels = qDiv.querySelectorAll(`input[name="${nameKey}"]:checked`);
          raw = Array.from(sels).map(el => parseInt(el.value, 10));
        } else if(q.type === 'ordering'){
          raw = orderingWidget ? orderingWidget.getOrder() : [];
        } else if(q.type === 'proof-completion'){
          const sel = qDiv.querySelector(`input[name="${nameKey}"]:checked`);
          if(!sel){ fb.textContent = 'pick a continuation'; fb.style.color = 'var(--mute)'; return; }
          raw = parseInt(sel.value, 10);
        } else if(q.type === 'matching'){
          raw = matchingWidget ? matchingWidget.getSelection() : [];
        } else if(q.type === 'spot-the-error'){
          raw = spotTheErrorWidget ? spotTheErrorWidget.getSelection() : -1;
        } else if(q.type === 'construction'){
          raw = constructionWidget ? constructionWidget.getSelection() : null;
        } else if(q.type === 'guess-my-rule'){
          raw = guessMyRuleWidget ? guessMyRuleWidget.getSelection() : [];
        }
        const ok = grade(q, raw);
        if(ok){
          fb.textContent = '✓ correct';
          fb.style.color = 'var(--green)';
        } else if(q.type === 'numeric'){
          const tol = q.tol ?? 1e-6;
          fb.textContent = numericFeedback(num(raw), q.answer, tol);
          fb.style.color = 'var(--pink)';
        } else if(q.type === 'complex'){
          const tol = q.tol ?? 1e-3;
          fb.textContent = complexFeedback(num(raw.re), num(raw.im), q.answer, tol);
          fb.style.color = 'var(--pink)';
        } else if(q.type === 'multi-select'){
          fb.textContent = multiSelectFeedback(raw, q.answer);
          fb.style.color = 'var(--pink)';
        } else if(q.type === 'ordering'){
          fb.textContent = orderingFeedback(raw, q.answer) || '✗ try again';
          fb.style.color = 'var(--pink)';
        } else if(q.type === 'proof-completion'){
          fb.textContent = proofCompletionFeedback(raw, q);
          fb.style.color = 'var(--pink)';
        } else if(q.type === 'matching'){
          fb.textContent = matchingFeedback(raw, q.answer);
          fb.style.color = 'var(--pink)';
        } else if(q.type === 'spot-the-error'){
          fb.textContent = spotTheErrorFeedback(raw, q) || '✗ try again';
          fb.style.color = 'var(--pink)';
        } else if(q.type === 'construction'){
          fb.textContent = constructionFeedback(raw, q.target);
          fb.style.color = 'var(--pink)';
        } else if(q.type === 'guess-my-rule'){
          fb.textContent = guessMyRuleFeedback(raw, q);
          fb.style.color = 'var(--pink)';
        } else {
          fb.textContent = '✗ try again';
          fb.style.color = 'var(--pink)';
        }
        if(ok){
          passed.add(i);
          explainEl.style.display = 'block';
          typeset(explainEl);
          if(!fired && passed.size === questions.length){
            fired = true;
            onAllCorrect();
          }
        }
      });

      typeset(qDiv);
    });
  }

  // ---- "Next up" panel ------------------------------------------------------
  // After v1 mastery, surface 1–3 concepts that just became `ready` because
  // the just-mastered concept was their last blocking prereq. We compute via
  // window.__MVConcepts (the bundle) — if it isn't loaded, bail silently.
  function computeNextUp(justMasteredId){
    const bundle = global.__MVConcepts || global.MVConcepts;
    if(!bundle || !bundle.index || !bundle.topics) return [];
    const topics = bundle.index.topics.map(t => bundle.topics[t]).filter(Boolean);
    // Build a quick lookup: id → {concept, topicId, topicPage, topicTitle}.
    const byId = new Map();
    for(const t of topics){
      for(const c of (t.concepts || [])){
        byId.set(c.id, { c, topicId: t.topic, topicPage: t.page, topicTitle: t.title });
      }
    }
    const self = byId.get(justMasteredId);
    if(!self) return [];
    const out = [];
    const prog = global.MVProgress;
    for(const [id, info] of byId){
      if(id === justMasteredId) continue;
      const prereqs = info.c.prereqs || [];
      if(!prereqs.includes(justMasteredId)) continue;
      // Must not already be v1-mastered.
      if(prog && prog.isMastered(id, 'v1')) continue;
      // All OTHER prereqs must be v1-mastered.
      let allOthersOk = true;
      for(const p of prereqs){
        if(p === justMasteredId) continue;
        if(!prog || !prog.isMastered(p, 'v1')){ allOthersOk = false; break; }
      }
      if(!allOthersOk) continue;
      out.push(info);
      if(out.length >= 3) break;
    }
    return out;
  }

  function renderNextUp(hostEl, justMasteredId){
    hostEl.innerHTML = '';
    const nexts = computeNextUp(justMasteredId);
    if(nexts.length === 0) return;
    const items = nexts.map(info => {
      const href = `./${info.topicPage}#${info.c.anchor || ''}`;
      return `<li style="margin:.2rem 0">
        <a href="${href}" style="color:var(--cyan);text-decoration:none">
          <b>${info.c.title}</b></a>
        <span style="color:var(--mute);font-size:.85rem"> · ${info.topicTitle}</span>
      </li>`;
    }).join('');
    hostEl.innerHTML = `
      <div class="nextup" style="margin-top:.8rem;padding:.6rem .85rem;
        border:1px solid var(--line);border-radius:8px;
        background:color-mix(in srgb, var(--cyan) 6%, transparent)">
        <div style="color:var(--cyan);font-weight:600;margin-bottom:.25rem">Next up</div>
        <div style="color:var(--mute);font-size:.85rem;margin-bottom:.35rem">
          These concepts just unlocked.
        </div>
        <ul style="list-style:disc;padding-left:1.2rem;margin:.2rem 0">${items}</ul>
      </div>
    `;
    typeset(hostEl);
  }

  function renderQuiz(host, conceptId, quiz){
    host.classList.add('widget');
    host.innerHTML = `
      <div class="hd">
        <div class="ttl">Quiz · ${quiz.title}</div>
        <div class="hint" data-role="badge"></div>
      </div>
      <div data-role="v1-tier"></div>
      <div data-role="hard-gate" style="margin-top:1rem"></div>
      <div data-role="hard-tier" class="hard" style="display:none;margin-top:.4rem;
        border:1px solid var(--violet);border-radius:8px;padding:.6rem .8rem;
        background:color-mix(in srgb, var(--violet) 8%, transparent)"></div>
      <div data-role="expert-gate" style="margin-top:1rem"></div>
      <div data-role="expert-tier" class="expert" style="display:none;margin-top:.4rem;
        border:1px solid var(--pink);border-radius:8px;padding:.6rem .8rem;
        background:color-mix(in srgb, var(--pink) 8%, transparent)"></div>
      <div data-role="nextup"></div>
    `;

    // Quiz titles can carry KaTeX (e.g. "The de Rham complex $\\Omega^\\bullet$").
    // Tier hosts get typeset after their own render passes; the header is set
    // here once and never touched again, so it needs an explicit pass.
    const ttlEl = host.querySelector('.hd .ttl');
    if(ttlEl) typeset(ttlEl);

    const v1Host       = host.querySelector('[data-role="v1-tier"]');
    const hardGate     = host.querySelector('[data-role="hard-gate"]');
    const hardHost     = host.querySelector('[data-role="hard-tier"]');
    const expertGate   = host.querySelector('[data-role="expert-gate"]');
    const expertHost   = host.querySelector('[data-role="expert-tier"]');
    const nextupHost   = host.querySelector('[data-role="nextup"]');
    const hasHard      = Array.isArray(quiz.hard)   && quiz.hard.length > 0;
    const hasExpert    = Array.isArray(quiz.expert) && quiz.expert.length > 0;

    function setBadge(){
      const badge = host.querySelector('[data-role="badge"]');
      const v1Done     = !!(global.MVProgress && global.MVProgress.isMastered(conceptId, 'v1'));
      const hardDone   = !!(global.MVProgress && global.MVProgress.isMastered(conceptId, 'hard'));
      const expertDone = !!(global.MVProgress && global.MVProgress.isMastered(conceptId, 'expert'));
      if(expertDone){
        badge.innerHTML = '<span style="color:var(--pink)">✓✓✓ expert-tier mastered</span>';
      } else if(hardDone){
        badge.innerHTML = '<span style="color:var(--violet)">✓✓ hard-tier mastered</span>'
          + (hasExpert ? ' <span style="color:var(--mute)">· expert tier available</span>' : '');
      } else if(v1Done){
        badge.innerHTML = '<span style="color:var(--green)">✓ mastered</span>'
          + (hasHard ? ' <span style="color:var(--mute)">· harder tier available</span>' : '');
      } else {
        badge.textContent = '';
      }
    }

    function mountExpertTier(){
      if(!hasExpert) return;
      expertHost.style.display = '';
      expertHost.innerHTML = `
        <div class="hd" style="margin-bottom:.3rem">
          <div class="ttl" style="color:var(--pink)">
            Expert tier
            <span style="display:inline-block;margin-left:.4rem;padding:1px 7px;
              border-radius:999px;background:var(--pink);color:#111;font-size:.72rem;
              font-weight:600;letter-spacing:.02em">expert</span>
          </div>
          <div class="hint" style="color:var(--mute)">synthesis · deep connections</div>
        </div>
        <div data-role="expert-qs"></div>
      `;
      const qs = expertHost.querySelector('[data-role="expert-qs"]');
      renderTier(qs, conceptId, 'expert', quiz.expert, () => {
        if(global.MVProgress) global.MVProgress.setMastered(conceptId, 'expert', true);
        setBadge();
      });
    }

    function mountExpertGate(){
      if(!hasExpert){ expertGate.innerHTML = ''; return; }
      const expertDone = !!(global.MVProgress && global.MVProgress.isMastered(conceptId, 'expert'));
      if(expertDone){
        expertGate.innerHTML = '';
        mountExpertTier();
        return;
      }
      expertGate.innerHTML = `
        <button data-role="unlock-expert" style="background:var(--panel2);
          color:var(--pink);border:1px solid var(--pink);border-radius:6px;
          padding:.45rem .8rem;font-family:inherit;font-size:.92rem;cursor:pointer">
          Expert tier unlocked — start ›
        </button>
        <span class="small" style="color:var(--mute);margin-left:.5rem">
          (counts toward expert-tier mastery)
        </span>
      `;
      expertGate.querySelector('[data-role="unlock-expert"]').addEventListener('click', () => {
        expertGate.innerHTML = '';
        mountExpertTier();
      });
    }

    function mountHardTier(){
      if(!hasHard) return;
      hardHost.style.display = '';
      hardHost.innerHTML = `
        <div class="hd" style="margin-bottom:.3rem">
          <div class="ttl" style="color:var(--violet)">
            Harder tier
            <span style="display:inline-block;margin-left:.4rem;padding:1px 7px;
              border-radius:999px;background:var(--violet);color:#111;font-size:.72rem;
              font-weight:600;letter-spacing:.02em">harder</span>
          </div>
          <div class="hint" style="color:var(--mute)">chains ideas · counterexamples</div>
        </div>
        <div data-role="hard-qs"></div>
      `;
      const qs = hardHost.querySelector('[data-role="hard-qs"]');
      renderTier(qs, conceptId, 'hard', quiz.hard, () => {
        if(global.MVProgress) global.MVProgress.setMastered(conceptId, 'hard', true);
        setBadge();
        mountExpertGate();
      });
    }

    function mountHardGate(){
      if(!hasHard){ hardGate.innerHTML = ''; return; }
      const hardDone = !!(global.MVProgress && global.MVProgress.isMastered(conceptId, 'hard'));
      if(hardDone){
        // already unlocked & mastered — just show the hard tier directly.
        hardGate.innerHTML = '';
        mountHardTier();
        mountExpertGate();
        return;
      }
      hardGate.innerHTML = `
        <button data-role="unlock-hard" style="background:var(--panel2);
          color:var(--violet);border:1px solid var(--violet);border-radius:6px;
          padding:.45rem .8rem;font-family:inherit;font-size:.92rem;cursor:pointer">
          Harder tier unlocked — start ›
        </button>
        <span class="small" style="color:var(--mute);margin-left:.5rem">
          (counts toward hard-tier mastery on the pathway)
        </span>
      `;
      hardGate.querySelector('[data-role="unlock-hard"]').addEventListener('click', () => {
        hardGate.innerHTML = '';
        mountHardTier();
      });
    }

    // Render v1 tier.
    renderTier(v1Host, conceptId, 'v1', quiz.questions, () => {
      if(global.MVProgress) global.MVProgress.setMastered(conceptId, 'v1', true);
      setBadge();
      mountHardGate();
      renderNextUp(nextupHost, conceptId);
    });

    // If v1 is already mastered from a prior session, expose the hard gate
    // and show the "next up" block.
    const v1Already = !!(global.MVProgress && global.MVProgress.isMastered(conceptId, 'v1'));
    if(v1Already){
      mountHardGate();
      renderNextUp(nextupHost, conceptId);
    }
    setBadge();
  }

  async function init(topicId){
    const placeholders = document.querySelectorAll('.quiz[data-concept]');
    if(placeholders.length === 0) return;
    // Prefer the precompiled bundle (works from file://); fall back to fetch for dev servers.
    let bank = global.MVQuizBank?.[topicId];
    if(!bank){
      try { bank = await fetch(`./quizzes/${topicId}.json`).then(r=>r.json()); }
      catch(e){
        placeholders.forEach(ph => ph.innerHTML =
          `<div class="bad">could not load ./quizzes/${topicId}.json — run <code>node scripts/build-quizzes-bundle.mjs</code> or serve over http://</div>`);
        return;
      }
    }
    placeholders.forEach(ph => {
      const id = ph.getAttribute('data-concept');
      const quiz = bank.quizzes?.[id];
      if(!quiz){ ph.innerHTML = `<div class="bad">no quiz for <code>${id}</code></div>`; return; }
      renderQuiz(ph, id, quiz);
    });
  }

  global.MVQuiz = { init, grade,
    // Exposed for tests/inspection; not part of the stable page API.
    _numericFeedback: numericFeedback,
    _complexFeedback: complexFeedback,
    _multiSelectFeedback: multiSelectFeedback,
    _orderingFeedback: orderingFeedback,
    _proofCompletionFeedback: proofCompletionFeedback,
    _matchingFeedback: matchingFeedback,
    _spotTheErrorFeedback: spotTheErrorFeedback,
    _constructionFeedback: constructionFeedback,
    _guessMyRuleFeedback: guessMyRuleFeedback,
    _firstSentence: firstSentence,
    _hintTextOf: hintTextOf,
    _computeNextUp: computeNextUp };
})(window);
