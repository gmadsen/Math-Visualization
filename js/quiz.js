// Quiz widget. Renders into <div class="quiz" data-concept="..."></div> placeholders.
// Reads quizzes/<topic>.json. On all-correct, calls MVProgress.setMastered.
//
// Question types (JSON):
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

  function renderQuiz(host, conceptId, quiz){
    host.classList.add('widget');
    host.innerHTML = `
      <div class="hd">
        <div class="ttl">Quiz · ${quiz.title}</div>
        <div class="hint" data-role="badge"></div>
      </div>
      <div data-role="qs"></div>
    `;
    const qsEl = host.querySelector('[data-role="qs"]');
    const passed = new Set();

    quiz.questions.forEach((q, i) => {
      const qDiv = document.createElement('div');
      qDiv.style.cssText = 'border-top:1px solid var(--line);padding:.7rem 0;margin-top:.4rem';

      let inputHTML = '';
      if(q.type === 'mcq'){
        inputHTML = q.choices.map((c,j) =>
          `<label style="display:block;margin:.25rem 0;cursor:pointer">
             <input type="radio" name="q-${conceptId}-${i}" value="${j}" style="margin-right:.4rem"> ${c}
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
      qsEl.appendChild(qDiv);

      const fb = qDiv.querySelector('[data-role="fb"]');
      const explainEl = qDiv.querySelector('[data-role="explain"]');
      qDiv.querySelector('[data-role="check"]').addEventListener('click', () => {
        let raw;
        if(q.type === 'mcq'){
          const sel = qDiv.querySelector(`input[name="q-${conceptId}-${i}"]:checked`);
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
          updateBadge();
        }
      });

      typeset(qDiv);
    });

    function updateBadge(){
      const badge = host.querySelector('[data-role="badge"]');
      const total = quiz.questions.length;
      if(passed.size === total){
        if(global.MVProgress) global.MVProgress.setMastered(conceptId, true);
        badge.innerHTML = '<span style="color:var(--green)">✓ mastered</span>';
      } else {
        badge.textContent = `${passed.size} / ${total}`;
      }
    }

    if(global.MVProgress?.isMastered(conceptId)){
      host.querySelector('[data-role="badge"]').innerHTML =
        '<span style="color:var(--green)">✓ already mastered — retake to refresh</span>';
    } else {
      updateBadge();
    }
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
