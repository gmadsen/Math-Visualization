// First-visit onboarding overlay.
//
// On first load of index.html, pathway.html, or progress.html, render a
// centered card over a dim backdrop that walks the learner through the
// notebook's core interactions in four steps (welcome, pathway, quizzes,
// progress). Dismissable via Skip / Escape / finishing the last step.
// Remembers dismissal in localStorage under the key `mvnb.onboarding.shown`,
// so it never fires again once a user has seen (or skipped) it.
//
// If `MVProgress.clearAll()` is called (the documented way to wipe mastery),
// we also clear the onboarding flag so a returning "fresh start" learner sees
// the tour again. This is done by wrapping `MVProgress.clearAll` with a
// no-touch override from outside progress.js.
//
// Palette: uses existing :root tokens (--bg, --panel, --ink, --mute, --line,
// --cyan, --violet). No raw hex.

(function () {
  var KEY = 'mvnb.onboarding.shown';
  var STYLE_ID = 'mv-onboarding-style';
  var ROOT_ID = 'mv-onboarding-root';

  var STEPS = [
    {
      title: 'Welcome',
      body: 'This is an interactive graduate math notebook — each topic is a single page of prose, live widgets, and quizzes you can poke at directly.'
    },
    {
      title: 'Explore the pathway',
      body: 'Pick a capstone on the <strong>pathway</strong> page to see its full prerequisite tree. Concepts light up <em>locked → ready → mastered</em> as you progress.'
    },
    {
      title: 'Answer the quizzes',
      body: 'Each concept ends with a short quiz. Passing it marks the concept mastered and unlocks what comes next. Hints are one click away via the <strong>?</strong> button.'
    },
    {
      title: 'Track your progress',
      body: 'Visit the <strong>progress</strong> page to see totals by section and earn mastery ribbons. Everything is stored locally in your browser.'
    }
  ];

  function alreadyShown() {
    try { return localStorage.getItem(KEY) === '1'; } catch (_) { return false; }
  }
  function markShown() {
    try { localStorage.setItem(KEY, '1'); } catch (_) {}
  }
  function clearFlag() {
    try { localStorage.removeItem(KEY); } catch (_) {}
  }

  // Wrap MVProgress.clearAll so a reset also re-enables the tour. We do this
  // from outside progress.js so that file stays untouched.
  function wrapClearAll() {
    if (!window.MVProgress || typeof window.MVProgress.clearAll !== 'function') return;
    if (window.MVProgress.__onboardingWrapped) return;
    var orig = window.MVProgress.clearAll;
    window.MVProgress.clearAll = function () {
      var r = orig.apply(this, arguments);
      clearFlag();
      return r;
    };
    window.MVProgress.__onboardingWrapped = true;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent =
      '.mv-onb-backdrop{position:fixed;inset:0;z-index:9998;' +
      'background:color-mix(in srgb, var(--bg) 78%, black);' +
      'opacity:0;transition:opacity 220ms ease;' +
      'display:flex;align-items:center;justify-content:center;padding:1rem}' +
      '.mv-onb-backdrop.mv-show{opacity:1}' +
      '.mv-onb-card{width:100%;max-width:420px;background:var(--panel);' +
      'border:1px solid var(--line);border-radius:12px;' +
      'box-shadow:0 18px 48px rgba(0,0,0,0.55);' +
      'padding:1.5rem 1.6rem 1.2rem;color:var(--ink);' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,sans-serif;' +
      'transform:translateY(14px) scale(0.985);opacity:0;' +
      'transition:transform 240ms cubic-bezier(.2,.8,.2,1), opacity 220ms ease}' +
      '.mv-onb-backdrop.mv-show .mv-onb-card{transform:translateY(0) scale(1);opacity:1}' +
      '.mv-onb-eyebrow{font-size:0.7rem;letter-spacing:0.16em;text-transform:uppercase;' +
      'color:var(--cyan);font-family:ui-monospace,Menlo,monospace;margin:0 0 0.5rem}' +
      '.mv-onb-title{font-size:1.25rem;font-weight:600;color:#fff;margin:0 0 0.55rem;' +
      'letter-spacing:-0.01em}' +
      '.mv-onb-body{color:var(--ink);font-size:0.96rem;line-height:1.55;margin:0 0 1.15rem}' +
      '.mv-onb-body strong{color:#fff}' +
      '.mv-onb-body em{color:var(--mute);font-style:normal;' +
      'font-family:ui-monospace,Menlo,monospace;font-size:0.88em}' +
      '.mv-onb-dots{display:flex;gap:6px;justify-content:center;margin:0 0 1rem}' +
      '.mv-onb-dot{width:7px;height:7px;border-radius:50%;background:var(--line);' +
      'transition:background 160ms ease, transform 160ms ease}' +
      '.mv-onb-dot.mv-active{background:var(--cyan);transform:scale(1.25)}' +
      '.mv-onb-row{display:flex;gap:0.5rem;align-items:center;justify-content:space-between}' +
      '.mv-onb-row .mv-onb-left{display:flex;gap:0.4rem;align-items:center}' +
      '.mv-onb-btn{appearance:none;-webkit-appearance:none;' +
      'font:inherit;cursor:pointer;border-radius:7px;padding:0.5rem 0.95rem;' +
      'font-size:0.9rem;font-weight:500;line-height:1.1;' +
      'border:1px solid var(--line);background:transparent;color:var(--mute);' +
      'transition:color 140ms ease, background 140ms ease, border-color 140ms ease}' +
      '.mv-onb-btn:hover{color:var(--ink);background:var(--panel2);' +
      'border-color:var(--line)}' +
      '.mv-onb-btn.mv-accent{color:var(--bg);background:var(--cyan);' +
      'border-color:var(--cyan);font-weight:600}' +
      '.mv-onb-btn.mv-accent:hover{background:color-mix(in srgb, var(--cyan) 88%, white);' +
      'color:var(--bg)}' +
      '.mv-onb-btn:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}';
    document.head.appendChild(st);
  }

  function render() {
    ensureStyle();

    var root = document.createElement('div');
    root.id = ROOT_ID;
    root.className = 'mv-onb-backdrop';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-labelledby', 'mv-onb-title');

    var card = document.createElement('div');
    card.className = 'mv-onb-card';

    var eyebrow = document.createElement('p');
    eyebrow.className = 'mv-onb-eyebrow';
    eyebrow.textContent = 'Welcome tour';

    var title = document.createElement('h2');
    title.id = 'mv-onb-title';
    title.className = 'mv-onb-title';

    var body = document.createElement('p');
    body.className = 'mv-onb-body';

    var dots = document.createElement('div');
    dots.className = 'mv-onb-dots';
    for (var i = 0; i < STEPS.length; i++) {
      var d = document.createElement('span');
      d.className = 'mv-onb-dot';
      dots.appendChild(d);
    }

    var row = document.createElement('div');
    row.className = 'mv-onb-row';

    var left = document.createElement('div');
    left.className = 'mv-onb-left';
    var skipBtn = document.createElement('button');
    skipBtn.type = 'button';
    skipBtn.className = 'mv-onb-btn';
    skipBtn.textContent = 'Skip';
    left.appendChild(skipBtn);

    var right = document.createElement('div');
    right.className = 'mv-onb-left';
    var backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'mv-onb-btn';
    backBtn.textContent = 'Back';
    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'mv-onb-btn mv-accent';
    nextBtn.textContent = 'Next';
    right.appendChild(backBtn);
    right.appendChild(nextBtn);

    row.appendChild(left);
    row.appendChild(right);

    card.appendChild(eyebrow);
    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(dots);
    card.appendChild(row);
    root.appendChild(card);
    document.body.appendChild(root);

    var idx = 0;
    var closed = false;

    function paint() {
      var step = STEPS[idx];
      title.textContent = step.title;
      body.innerHTML = step.body;
      var dotEls = dots.querySelectorAll('.mv-onb-dot');
      for (var i = 0; i < dotEls.length; i++) {
        if (i === idx) dotEls[i].classList.add('mv-active');
        else dotEls[i].classList.remove('mv-active');
      }
      backBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
      nextBtn.textContent = (idx === STEPS.length - 1) ? 'Done' : 'Next';
    }

    function close(viaFinish) {
      if (closed) return;
      closed = true;
      markShown();
      document.removeEventListener('keydown', onKey);
      root.classList.remove('mv-show');
      // let the fade-out play, then remove
      setTimeout(function () {
        if (root.parentNode) root.parentNode.removeChild(root);
      }, 240);
    }

    function onKey(ev) {
      if (ev.key === 'Escape') {
        ev.preventDefault();
        close(false);
      }
    }

    skipBtn.addEventListener('click', function () { close(false); });
    backBtn.addEventListener('click', function () {
      if (idx > 0) { idx -= 1; paint(); }
    });
    nextBtn.addEventListener('click', function () {
      if (idx < STEPS.length - 1) { idx += 1; paint(); }
      else close(true);
    });
    document.addEventListener('keydown', onKey);

    paint();
    // trigger entry transitions
    requestAnimationFrame(function () {
      root.classList.add('mv-show');
    });
  }

  function maybeStart() {
    wrapClearAll();
    if (alreadyShown()) return;
    if (document.getElementById(ROOT_ID)) return; // safety: don't double-mount
    setTimeout(render, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', maybeStart);
  } else {
    maybeStart();
  }
})();
