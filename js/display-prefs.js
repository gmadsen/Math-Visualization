// display-prefs.js — reader-side toggle to hide widgets and/or quizzes so a
// topic page becomes a pure-prose reading experience.
//
// Storage key: "mvnb.display" = JSON { widgetsHidden: boolean, quizzesHidden: boolean }.
// Both default false (absent key or malformed → both false).
// When widgetsHidden → <html data-hide-widgets>; a tiny CSS rule
//   html[data-hide-widgets] .widget { display: none !important; }
// hides every .widget block. Same for quizzesHidden / data-hide-quizzes.
//
// Public API (on window.MVDisplay):
//   MVDisplay.toggleWidgets()  → flip widgetsHidden, persist, dispatch event
//   MVDisplay.toggleQuizzes()  → flip quizzesHidden, persist, dispatch event
//   MVDisplay.showAll()        → clear both flags
//   MVDisplay.current()        → { widgetsHidden, quizzesHidden }
//
// A single 'mvdisplay:change' CustomEvent fires on document whenever state
// changes so any mounted buttons stay in sync. `storage` events keep multiple
// open tabs in sync too (cross-tab), mirroring theme-toggle.js.
//
// Auto-mounts a 📖 toggle button into the first .mv-display-slot; if no slot
// is present, appends a button to the first .mv-theme-slot as a fallback so
// the control still appears in the top-nav next to the theme toggle.
//
// This script should load synchronously in <head> (or as close to it as
// possible) so the initial data-hide-widgets / data-hide-quizzes attributes
// are applied BEFORE paint, avoiding a flash of full-layout content on pages
// loaded with a "hide" preference.

(function () {
  var STORAGE_KEY = 'mvnb.display';

  function safeRead() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw == null) return { widgetsHidden: false, quizzesHidden: false };
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return { widgetsHidden: false, quizzesHidden: false };
      }
      return {
        widgetsHidden: parsed.widgetsHidden === true,
        quizzesHidden: parsed.quizzesHidden === true,
      };
    } catch (e) {
      return { widgetsHidden: false, quizzesHidden: false };
    }
  }

  function safeWrite(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* private mode */ }
  }

  function apply(state) {
    var html = document.documentElement;
    if (state.widgetsHidden) html.setAttribute('data-hide-widgets', '');
    else html.removeAttribute('data-hide-widgets');
    if (state.quizzesHidden) html.setAttribute('data-hide-quizzes', '');
    else html.removeAttribute('data-hide-quizzes');
  }

  function current() {
    // Read from the DOM (runtime source of truth), not storage.
    var html = document.documentElement;
    return {
      widgetsHidden: html.hasAttribute('data-hide-widgets'),
      quizzesHidden: html.hasAttribute('data-hide-quizzes'),
    };
  }

  function setState(next, origin) {
    var prev = current();
    apply(next);
    safeWrite(next);
    if (prev.widgetsHidden !== next.widgetsHidden || prev.quizzesHidden !== next.quizzesHidden) {
      try {
        document.dispatchEvent(new CustomEvent('mvdisplay:change', {
          detail: {
            widgetsHidden: next.widgetsHidden,
            quizzesHidden: next.quizzesHidden,
            origin: origin || 'api',
          },
        }));
      } catch (e) { /* defensive */ }
    }
    return next;
  }

  function toggleWidgets() {
    var s = current();
    return setState({ widgetsHidden: !s.widgetsHidden, quizzesHidden: s.quizzesHidden }, 'toggleWidgets');
  }

  function toggleQuizzes() {
    var s = current();
    return setState({ widgetsHidden: s.widgetsHidden, quizzesHidden: !s.quizzesHidden }, 'toggleQuizzes');
  }

  function showAll() {
    return setState({ widgetsHidden: false, quizzesHidden: false }, 'showAll');
  }

  function titleForWidgets(state) {
    return (state.widgetsHidden ? 'widgets hidden' : 'widgets shown') +
      ' — click to toggle · esc: show all';
  }

  function titleForQuizzes(state) {
    return (state.quizzesHidden ? 'quizzes hidden' : 'quizzes shown') +
      ' — click to toggle · esc: show all';
  }

  // Two glyphs: the widget wrench and the question/quiz bubble. When a kind
  // is hidden, its button gets .mv-display-toggle--off so CSS can dim it.
  var WIDGETS_GLYPH = '🔧';
  var QUIZZES_GLYPH = '❓';

  function createWidgetToggle(opts) {
    opts = opts || {};
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mv-display-toggle mv-display-toggle--widgets';
    if (opts.className) btn.className += ' ' + opts.className;
    btn.setAttribute('aria-label', 'Toggle widgets visibility');
    btn.textContent = WIDGETS_GLYPH;
    var s = current();
    btn.title = titleForWidgets(s);
    if (s.widgetsHidden) btn.classList.add('mv-display-toggle--off');
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      toggleWidgets();
    });
    document.addEventListener('mvdisplay:change', function () {
      var now = current();
      btn.title = titleForWidgets(now);
      btn.classList.toggle('mv-display-toggle--off', now.widgetsHidden);
    });
    return btn;
  }

  function createQuizToggle(opts) {
    opts = opts || {};
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mv-display-toggle mv-display-toggle--quizzes';
    if (opts.className) btn.className += ' ' + opts.className;
    btn.setAttribute('aria-label', 'Toggle quizzes visibility');
    btn.textContent = QUIZZES_GLYPH;
    var s = current();
    btn.title = titleForQuizzes(s);
    if (s.quizzesHidden) btn.classList.add('mv-display-toggle--off');
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      toggleQuizzes();
    });
    document.addEventListener('mvdisplay:change', function () {
      var now = current();
      btn.title = titleForQuizzes(now);
      btn.classList.toggle('mv-display-toggle--off', now.quizzesHidden);
    });
    return btn;
  }

  // Back-compat: the slot mounter still calls createToggleButton to produce
  // a pair. Returns a container with both buttons.
  function createToggleButton(opts) {
    opts = opts || {};
    var wrap = document.createElement('span');
    wrap.className = 'mv-display-toggles';
    if (opts.className) wrap.className += ' ' + opts.className;
    wrap.appendChild(createWidgetToggle());
    wrap.appendChild(createQuizToggle());
    return wrap;
  }

  // --------------------------------------------------------------------------
  // 1. Apply stored preference synchronously (before paint, ideally).
  // --------------------------------------------------------------------------
  var stored = safeRead();
  apply(stored);

  // --------------------------------------------------------------------------
  // 2. Escape key → show all. Only acts when at least one flag is set so we
  //    don't steal Escape from forms/modals unnecessarily.
  // --------------------------------------------------------------------------
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape' && ev.keyCode !== 27) return;
    var s = current();
    if (!s.widgetsHidden && !s.quizzesHidden) return;
    // Don't steal from input fields.
    var t = ev.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    showAll();
  });

  // --------------------------------------------------------------------------
  // 3. Cross-tab sync via storage events.
  // --------------------------------------------------------------------------
  window.addEventListener('storage', function (ev) {
    if (!ev || ev.key !== STORAGE_KEY) return;
    var next = safeRead();
    apply(next);
    try {
      document.dispatchEvent(new CustomEvent('mvdisplay:change', {
        detail: {
          widgetsHidden: next.widgetsHidden,
          quizzesHidden: next.quizzesHidden,
          origin: 'storage',
        },
      }));
    } catch (e) { /* ignore */ }
  });

  // --------------------------------------------------------------------------
  // 4. Auto-mount into .mv-display-slot (preferred) or .mv-theme-slot
  //    (fallback — appends next to the theme toggle).
  // --------------------------------------------------------------------------
  function mountSlots() {
    var slots = document.querySelectorAll('.mv-display-slot');
    var mounted = 0;
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      if (slot.getAttribute('data-mv-display-mounted') === '1') continue;
      slot.appendChild(createToggleButton());
      slot.setAttribute('data-mv-display-mounted', '1');
      mounted++;
    }
    if (mounted === 0) {
      // Fallback: append to the first .mv-theme-slot so the button still
      // appears in the top-nav alongside the theme toggle.
      var themeSlot = document.querySelector('.mv-theme-slot');
      if (themeSlot && themeSlot.getAttribute('data-mv-display-mounted') !== '1') {
        themeSlot.appendChild(createToggleButton());
        themeSlot.setAttribute('data-mv-display-mounted', '1');
      }
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountSlots);
  } else {
    mountSlots();
  }

  // --------------------------------------------------------------------------
  // 5. Expose API.
  // --------------------------------------------------------------------------
  window.MVDisplay = {
    toggleWidgets: toggleWidgets,
    toggleQuizzes: toggleQuizzes,
    showAll: showAll,
    current: current,
    createToggleButton: createToggleButton, // back-compat; returns both
    createWidgetToggle: createWidgetToggle,
    createQuizToggle: createQuizToggle,
  };
})();
