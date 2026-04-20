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
      if(q.type === 'ordering'){
        const orderHost = qDiv.querySelector('[data-role="order-host"]');
        orderingWidget = renderOrdering(orderHost, q, nameKey);
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
    _firstSentence: firstSentence,
    _hintTextOf: hintTextOf,
    _computeNextUp: computeNextUp };
})(window);
