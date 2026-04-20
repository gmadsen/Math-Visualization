// Quiz widget. Renders into <div class="quiz" data-concept="..."></div> placeholders.
// Reads quizzes/<topic>.json. On all-correct, calls MVProgress.setMastered.
//
// Two-tier schema:
//   {
//     "<concept-id>": {
//       "title": "...",
//       "questions": [ ... ],   // v1 tier (required)
//       "hard":      [ ... ]    // optional harder tier, unlocked after v1 mastered
//     }
//   }
//
// Question types (JSON) — same shape in both tiers:
//   { type: "mcq",     q: "...", choices: ["a","b","c"], answer: 1, explain: "..." }
//   { type: "numeric", q: "...", answer: 5,        tol: 1e-6,  explain: "..." }
//   { type: "complex", q: "...", answer: [re, im], tol: 1e-3,  explain: "..." }
(function(global){
  function num(s){ return parseFloat(String(s).trim()); }

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
    return false;
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
      }

      qDiv.innerHTML = `
        <div style="margin-bottom:.5rem"><b>Q${i+1}.</b> ${q.q}</div>
        <div>${inputHTML}</div>
        <div class="row" style="margin-top:.5rem">
          <button data-role="check">check</button>
          <span data-role="fb" style="font-size:.9rem"></span>
        </div>
        <div data-role="explain" class="ok" style="display:none;margin-top:.5rem">${q.explain || ''}</div>
      `;
      container.appendChild(qDiv);

      const fb = qDiv.querySelector('[data-role="fb"]');
      const explainEl = qDiv.querySelector('[data-role="explain"]');
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
        }
        const ok = grade(q, raw);
        fb.textContent = ok ? '✓ correct' : '✗ try again';
        fb.style.color = ok ? 'var(--green)' : 'var(--pink)';
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
    `;

    const v1Host    = host.querySelector('[data-role="v1-tier"]');
    const gateHost  = host.querySelector('[data-role="hard-gate"]');
    const hardHost  = host.querySelector('[data-role="hard-tier"]');
    const hasHard   = Array.isArray(quiz.hard) && quiz.hard.length > 0;

    function setBadge(){
      const badge = host.querySelector('[data-role="badge"]');
      const v1Done   = !!(global.MVProgress && global.MVProgress.isMastered(conceptId, 'v1'));
      const hardDone = !!(global.MVProgress && global.MVProgress.isMastered(conceptId, 'hard'));
      if(hardDone){
        badge.innerHTML = '<span style="color:var(--violet)">✓✓ hard-tier mastered</span>';
      } else if(v1Done){
        badge.innerHTML = '<span style="color:var(--green)">✓ mastered</span>'
          + (hasHard ? ' <span style="color:var(--mute)">· harder tier available</span>' : '');
      } else {
        badge.textContent = '';
      }
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
      });
    }

    function mountHardGate(){
      if(!hasHard){ gateHost.innerHTML = ''; return; }
      const hardDone = !!(global.MVProgress && global.MVProgress.isMastered(conceptId, 'hard'));
      if(hardDone){
        // already unlocked & mastered — just show the hard tier directly.
        gateHost.innerHTML = '';
        mountHardTier();
        return;
      }
      gateHost.innerHTML = `
        <button data-role="unlock-hard" style="background:var(--panel2);
          color:var(--violet);border:1px solid var(--violet);border-radius:6px;
          padding:.45rem .8rem;font-family:inherit;font-size:.92rem;cursor:pointer">
          Harder tier unlocked — start ›
        </button>
        <span class="small" style="color:var(--mute);margin-left:.5rem">
          (counts toward hard-tier mastery on the pathway)
        </span>
      `;
      gateHost.querySelector('[data-role="unlock-hard"]').addEventListener('click', () => {
        gateHost.innerHTML = '';
        mountHardTier();
      });
    }

    // Render v1 tier.
    renderTier(v1Host, conceptId, 'v1', quiz.questions, () => {
      if(global.MVProgress) global.MVProgress.setMastered(conceptId, 'v1', true);
      setBadge();
      mountHardGate();
    });

    // If v1 is already mastered from a prior session, expose the hard gate.
    const v1Already = !!(global.MVProgress && global.MVProgress.isMastered(conceptId, 'v1'));
    if(v1Already) mountHardGate();
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

  global.MVQuiz = { init, grade };
})(window);
