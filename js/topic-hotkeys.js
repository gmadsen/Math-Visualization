// Topic-page keyboard shortcuts.
//
// Loaded on every topic page via inject-breadcrumb.mjs. Provides three
// hotkeys to speed up navigation through a topic:
//
//   q   — jump to the next unanswered quiz (first `.quiz` widget whose
//         data-concept is not yet v1-mastered). Scrolls into view and
//         briefly flashes a highlight so the eye can find it.
//   n   — scroll to the next <section> with an id (curriculum order).
//   p   — scroll to the previous <section> with an id.
//   ?   — toggle a compact help overlay listing all shortcuts.
//         Escape dismisses the overlay.
//
// Keys are ignored while focus is in any <input>, <textarea>, or <select>,
// so typing in a numeric-answer field (or a form anywhere on the page)
// never accidentally triggers navigation.
//
// Emits `data-topic-hotkeys="on"` on <body> when initialised so the
// cross-page consistency audit can verify the loader is wired.
//
// Palette tokens only (via CSS variables). No external deps.
(function () {
  'use strict';

  if (typeof document === 'undefined') return;

  // ---------------------------------------------------------------------
  // Focus guard — never steal keys from form fields.

  function typingInFormField(target) {
    if (!target) return false;
    var tag = (target.tagName || '').toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    // contenteditable regions (KaTeX doesn't use them, but be safe).
    if (target.isContentEditable) return true;
    return false;
  }

  // ---------------------------------------------------------------------
  // q — next unanswered quiz.

  function isMastered(conceptId) {
    try {
      if (window.MVProgress && typeof window.MVProgress.isMastered === 'function') {
        return !!window.MVProgress.isMastered(conceptId);
      }
    } catch (_) { /* ignore */ }
    return false;
  }

  function flashHighlight(el) {
    if (!el) return;
    var prev = el.style.boxShadow;
    var prevTransition = el.style.transition;
    el.style.transition = 'box-shadow 0.25s ease-in-out';
    el.style.boxShadow = '0 0 0 3px var(--yellow)';
    setTimeout(function () {
      el.style.boxShadow = prev;
      // restore the previous transition after the reverse animation.
      setTimeout(function () { el.style.transition = prevTransition; }, 300);
    }, 900);
  }

  function jumpToNextUnansweredQuiz() {
    var quizzes = document.querySelectorAll('.quiz[data-concept]');
    for (var i = 0; i < quizzes.length; i++) {
      var q = quizzes[i];
      var id = q.getAttribute('data-concept');
      if (!id) continue;
      if (!isMastered(id)) {
        try {
          q.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (_) {
          q.scrollIntoView();
        }
        flashHighlight(q);
        return true;
      }
    }
    return false;
  }

  // ---------------------------------------------------------------------
  // n / p — adjacent sections.

  function allSectionsWithId() {
    var out = [];
    var nodes = document.querySelectorAll('section[id]');
    for (var i = 0; i < nodes.length; i++) out.push(nodes[i]);
    return out;
  }

  // Pick the "current" section as the one whose top is closest to (but
  // not below) the viewport's vertical middle. Falls back to the first
  // section if none match (e.g. user is above the first section).
  function currentSectionIndex(sections) {
    if (!sections.length) return -1;
    var target = window.innerHeight ? window.innerHeight * 0.35 : 200;
    var bestIdx = 0;
    var bestDelta = Infinity;
    for (var i = 0; i < sections.length; i++) {
      var rect = sections[i].getBoundingClientRect();
      // Prefer the last section whose top is at or above the target line.
      if (rect.top <= target) {
        var delta = target - rect.top;
        if (delta < bestDelta) {
          bestDelta = delta;
          bestIdx = i;
        }
      }
    }
    return bestIdx;
  }

  function jumpToAdjacentSection(direction) {
    var sections = allSectionsWithId();
    if (!sections.length) return false;
    var idx = currentSectionIndex(sections);
    var targetIdx = idx + (direction > 0 ? 1 : -1);
    if (targetIdx < 0 || targetIdx >= sections.length) return false;
    var target = sections[targetIdx];
    try {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (_) {
      target.scrollIntoView();
    }
    // Update the URL hash so deep-link copy-paste works.
    if (target.id && typeof history !== 'undefined' && history.replaceState) {
      try { history.replaceState(null, '', '#' + target.id); } catch (_) { /* ignore */ }
    }
    return true;
  }

  // ---------------------------------------------------------------------
  // ? — help overlay.

  var overlayEl = null;

  function ensureOverlayStyle() {
    if (document.getElementById('mv-hotkey-help-style')) return;
    var st = document.createElement('style');
    st.id = 'mv-hotkey-help-style';
    st.textContent = [
      '#mv-hotkey-help{position:fixed;inset:0;z-index:9998;',
      '  display:none;align-items:center;justify-content:center;',
      '  background:rgba(0,0,0,0.55);backdrop-filter:blur(2px)}',
      '#mv-hotkey-help.open{display:flex}',
      '#mv-hotkey-help .card{background:var(--panel);color:var(--ink);',
      '  border:1px solid var(--line);border-radius:10px;',
      '  padding:1.1rem 1.3rem 1.2rem;min-width:280px;max-width:420px;',
      '  box-shadow:0 12px 32px rgba(0,0,0,0.5);font-size:0.92rem;',
      '  line-height:1.5}',
      '#mv-hotkey-help h3{margin:0 0 0.6rem;color:var(--yellow);',
      '  font-size:1.02rem;border-bottom:1px solid var(--line);',
      '  padding-bottom:0.35rem}',
      '#mv-hotkey-help ul{list-style:none;margin:0;padding:0}',
      '#mv-hotkey-help li{display:flex;gap:0.8rem;padding:0.3rem 0;',
      '  align-items:baseline}',
      '#mv-hotkey-help kbd{background:var(--panel2);color:var(--ink);',
      '  border:1px solid var(--line);border-radius:4px;',
      '  padding:2px 7px;font-family:inherit;font-size:0.86rem;',
      '  min-width:1.3rem;text-align:center;display:inline-block}',
      '#mv-hotkey-help .desc{color:var(--mute);flex:1}',
      '#mv-hotkey-help .dismiss{color:var(--mute);font-size:0.82rem;',
      '  margin-top:0.8rem;text-align:right}'
    ].join('');
    document.head.appendChild(st);
  }

  function buildOverlay() {
    ensureOverlayStyle();
    var root = document.createElement('div');
    root.id = 'mv-hotkey-help';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Keyboard shortcuts');
    root.innerHTML =
      '<div class="card">' +
        '<h3>Keyboard shortcuts</h3>' +
        '<ul>' +
          '<li><kbd>q</kbd><span class="desc">Next unanswered quiz</span></li>' +
          '<li><kbd>n</kbd><span class="desc">Next section</span></li>' +
          '<li><kbd>p</kbd><span class="desc">Previous section</span></li>' +
          '<li><kbd>?</kbd><span class="desc">Toggle this help</span></li>' +
          '<li><kbd>Esc</kbd><span class="desc">Dismiss</span></li>' +
        '</ul>' +
        '<div class="dismiss">Press <kbd>?</kbd> or <kbd>Esc</kbd> to close</div>' +
      '</div>';
    // Click outside the card dismisses.
    root.addEventListener('click', function (ev) {
      if (ev.target === root) hideOverlay();
    });
    document.body.appendChild(root);
    return root;
  }

  function showOverlay() {
    if (!overlayEl) overlayEl = buildOverlay();
    overlayEl.classList.add('open');
  }

  function hideOverlay() {
    if (overlayEl) overlayEl.classList.remove('open');
  }

  function toggleOverlay() {
    if (!overlayEl) overlayEl = buildOverlay();
    if (overlayEl.classList.contains('open')) hideOverlay();
    else showOverlay();
  }

  // ---------------------------------------------------------------------
  // Key dispatcher.

  function onKeydown(ev) {
    if (ev.defaultPrevented) return;
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (typingInFormField(ev.target)) return;

    var key = ev.key;
    // Shift+/ on a US layout produces '?'.
    if (key === '?') {
      ev.preventDefault();
      toggleOverlay();
      return;
    }
    if (key === 'Escape' || key === 'Esc') {
      if (overlayEl && overlayEl.classList.contains('open')) {
        ev.preventDefault();
        hideOverlay();
      }
      return;
    }

    // Ignore modifier variants (Shift+q is fine — we treat key lowercase).
    var lower = key.length === 1 ? key.toLowerCase() : key;
    if (lower === 'q') {
      ev.preventDefault();
      jumpToNextUnansweredQuiz();
    } else if (lower === 'n') {
      ev.preventDefault();
      jumpToAdjacentSection(+1);
    } else if (lower === 'p') {
      ev.preventDefault();
      jumpToAdjacentSection(-1);
    }
  }

  function init() {
    document.addEventListener('keydown', onKeydown);
    if (document.body) {
      document.body.setAttribute('data-topic-hotkeys', 'on');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
