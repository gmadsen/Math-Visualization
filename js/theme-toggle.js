// theme-toggle.js — runtime switch between dark (default) and light palette.
//
// Storage key: "mvnb.theme" ∈ {"dark","light"}. Default is dark (absent key).
// When light: document.documentElement.dataset.theme = "light" → css/theme-light.css
// overrides the palette custom properties.
//
// Public API (on window.MVTheme):
//   MVTheme.get()                     → "light" | "dark"
//   MVTheme.set(mode)                 → force-set "light" or "dark"
//   MVTheme.toggle()                  → flip and persist; returns new mode
//   MVTheme.createToggleButton(opts?) → returns a <button> wired to toggle()
//
// The button's label updates to reflect current mode; caller decides where to
// append it. A single 'mvtheme:change' CustomEvent fires on document when the
// mode changes so multiple buttons stay in sync.
//
// This script should load synchronously in <head> (or as close to it as
// possible) so the initial data-theme attribute is applied BEFORE paint,
// avoiding a flash of dark content on pages loaded with light preference.

(function () {
  var STORAGE_KEY = 'mvnb.theme';
  var MODES = ['dark', 'light'];

  function safeRead() {
    try {
      var v = window.localStorage.getItem(STORAGE_KEY);
      return MODES.indexOf(v) >= 0 ? v : null;
    } catch (e) {
      return null;
    }
  }

  function safeWrite(mode) {
    try { window.localStorage.setItem(STORAGE_KEY, mode); } catch (e) { /* private mode */ }
  }

  function apply(mode) {
    var html = document.documentElement;
    if (mode === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
  }

  function get() {
    // Read from the DOM (source of truth at runtime) rather than storage so
    // anything that mutated data-theme directly is honored.
    return document.documentElement.getAttribute('data-theme') === 'light'
      ? 'light'
      : 'dark';
  }

  function set(mode) {
    if (MODES.indexOf(mode) < 0) mode = 'dark';
    var prev = get();
    apply(mode);
    safeWrite(mode);
    if (prev !== mode) {
      try {
        document.dispatchEvent(new CustomEvent('mvtheme:change', { detail: { mode: mode } }));
      } catch (e) { /* IE compat not needed but be defensive */ }
    }
    return mode;
  }

  function toggle() {
    return set(get() === 'light' ? 'dark' : 'light');
  }

  // Label the button with a glyph (sun for light-mode = "switch to dark",
  // moon for dark-mode = "switch to light") plus a short word so it's legible
  // without relying on emoji rendering.
  function labelFor(mode) {
    // mode is current; button says what it'll switch TO.
    return mode === 'light' ? 'Dark' : 'Light';
  }
  function titleFor(mode) {
    return mode === 'light'
      ? 'Switch to dark theme'
      : 'Switch to light theme';
  }

  function createToggleButton(opts) {
    opts = opts || {};
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mv-theme-toggle';
    if (opts.className) btn.className += ' ' + opts.className;
    btn.setAttribute('aria-label', 'Toggle color theme');
    var mode = get();
    btn.textContent = labelFor(mode);
    btn.title = titleFor(mode);
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      toggle();
    });
    // Keep this button in sync if another button (or code) flips the theme.
    document.addEventListener('mvtheme:change', function (ev) {
      var m = (ev && ev.detail && ev.detail.mode) || get();
      btn.textContent = labelFor(m);
      btn.title = titleFor(m);
    });
    return btn;
  }

  // --------------------------------------------------------------------------
  // 1. Apply stored preference synchronously (before paint, ideally).
  // --------------------------------------------------------------------------
  var stored = safeRead();
  if (stored === 'light') apply('light');
  else if (stored === 'dark') apply('dark');
  // Otherwise: no preference stored → leave dark (default). We do NOT
  // auto-switch based on prefers-color-scheme; we only log a suggestion once.

  // --------------------------------------------------------------------------
  // 2. Observe prefers-color-scheme as a hint only.
  // --------------------------------------------------------------------------
  if (stored == null && window.matchMedia) {
    try {
      var mq = window.matchMedia('(prefers-color-scheme: light)');
      if (mq && mq.matches) {
        // One-shot console hint. Do not switch automatically — the design brief
        // explicitly says "don't auto-switch; just log or offer suggestion".
        if (window.console && console.info) {
          console.info('[MVTheme] Your system prefers light mode. Call MVTheme.set("light") or click the theme toggle to switch.');
        }
      }
    } catch (e) { /* ignore */ }
  }

  // --------------------------------------------------------------------------
  // 3. Auto-mount into any <span class="mv-theme-slot"></span> placeholders.
  //    inject-breadcrumb.mjs drops a slot inside nav.toc on every topic page;
  //    shared pages (index/pathway/progress/review/latex-cheatsheet) include
  //    a slot manually in their top-nav. This keeps the per-page HTML edits
  //    to a single empty span regardless of layout.
  // --------------------------------------------------------------------------
  function mountSlots() {
    var slots = document.querySelectorAll('.mv-theme-slot');
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      if (slot.getAttribute('data-mv-theme-mounted') === '1') continue;
      slot.appendChild(createToggleButton());
      slot.setAttribute('data-mv-theme-mounted', '1');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountSlots);
  } else {
    mountSlots();
  }

  // --------------------------------------------------------------------------
  // 4. Expose API.
  // --------------------------------------------------------------------------
  window.MVTheme = {
    get: get,
    set: set,
    toggle: toggle,
    createToggleButton: createToggleButton
  };
})();
