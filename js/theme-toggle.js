// theme-toggle.js — runtime switch between dark (default), light, and
// high-contrast palettes. The button cycles dark → light → contrast → dark.
//
// Storage key: "mvnb.theme" ∈ {"dark","light","contrast"}. Default is dark (absent key).
// When light: document.documentElement.dataset.theme = "light" → css/theme-light.css
// overrides the palette custom properties.
//
// Public API (on window.MVTheme):
//   MVTheme.get()                     → "dark" | "light" | "contrast"
//   MVTheme.set(mode)                 → force-set one of the three modes
//   MVTheme.toggle()                  → advance the cycle, persist; returns new mode
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
  var MODES = ['dark', 'light', 'contrast'];

  // KaTeX copy-friendliness: KaTeX renders each `$…$` block as a wrapper
  // .katex containing both .katex-mathml (semantic, with the LaTeX source
  // and a MathML annotation) and .katex-html (visual). The mathml subtree
  // is `aria-hidden="true"` AND visually hidden via clip-path, but
  // `user-select` is not constrained — so plaintext copy from a rendered
  // page picks up `V♮V^\naturalV♮` instead of `V♮`. A one-time stylesheet
  // injection makes the mathml subtree non-selectable, so copy/paste sees
  // only the visible rendered text. We do this in JS rather than a static
  // <style> block because theme-toggle.js is the one script every topic
  // page loads in <head> — patching the corpus is a no-op here.
  try {
    var s = document.createElement('style');
    s.setAttribute('data-mvnb', 'katex-copy-fix');
    s.textContent =
      '.katex-mathml{user-select:none;-webkit-user-select:none;' +
      '-moz-user-select:none;-ms-user-select:none;}';
    (document.head || document.documentElement).appendChild(s);
  } catch (e) { /* nothing useful to do */ }

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
    // 'light' and 'contrast' are data-theme values (with CSS palette overrides);
    // 'dark' is the default and carries no attribute.
    if (mode === 'light' || mode === 'contrast') {
      html.setAttribute('data-theme', mode);
    } else {
      html.removeAttribute('data-theme');
    }
  }

  function get() {
    // Read from the DOM (source of truth at runtime) rather than storage so
    // anything that mutated data-theme directly is honored.
    var t = document.documentElement.getAttribute('data-theme');
    return (t === 'light' || t === 'contrast') ? t : 'dark';
  }

  function nextMode(mode) {
    return MODES[(MODES.indexOf(mode) + 1) % MODES.length];
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
    // Cycle dark → light → contrast → dark.
    return set(nextMode(get()));
  }

  // The button labels the mode it will switch TO next in the cycle, so the
  // word is a verb-like cue ("Light", "Contrast", "Dark") rather than naming
  // the current state.
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function labelFor(mode) {
    return cap(nextMode(mode));
  }
  function titleFor(mode) {
    return 'Switch to ' + nextMode(mode) + ' theme';
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
  if (stored) apply(stored); // safeRead only returns a valid MODES value
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
  // 4. KaTeX FOUC mitigation. Synchronously add the `katex-pending` class so
  //    css/notebook.css's `html.katex-pending main { opacity:0 }` rule kicks
  //    in before first paint — must happen here, not in an async sub-script.
  //    The reveal logic (MutationObserver waiting for the first .katex node,
  //    window.load fallback, 1500ms safety) lives in js/katex-fouc.js, which
  //    we load as a sibling so the per-page footprint stays at one <script>.
  // --------------------------------------------------------------------------
  try { document.documentElement.classList.add('katex-pending'); } catch (_) {}
  try {
    var foucScript = document.createElement('script');
    // Resolve katex-fouc.js as a sibling of this script's own URL, so pages
    // nested one directory deeper (sections/, examples/) still load it
    // correctly. A previous hard-coded `./js/katex-fouc.js` left the
    // section/*.html pages stuck behind the FOUC opacity:0 forever.
    // Prefer document.currentScript (set during synchronous script execution).
    // Fall back to scanning <script> tags for theme-toggle.js so we still get
    // the right relative URL if currentScript is unavailable for any reason
    // (e.g. older cached bundle injecting this script dynamically).
    var ownSrc = (document.currentScript && document.currentScript.src) || '';
    if (!ownSrc) {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        var s = scripts[i].src || '';
        if (/theme-toggle\.js(?:\?|$)/.test(s)) { ownSrc = s; break; }
      }
    }
    foucScript.src = ownSrc
      ? ownSrc.replace(/[^\/]+$/, 'katex-fouc.js')
      : './js/katex-fouc.js';
    foucScript.async = false;
    // Belt-and-suspenders: if the FOUC-reveal script ever 404s for any reason
    // (path-resolution miss, deploy mid-flight, CDN drop), don't leave the
    // page wedged at opacity:0 forever. This soft-fallback cost is one
    // extra event listener per page load.
    foucScript.onerror = function () {
      try { document.documentElement.classList.remove('katex-pending'); } catch (__) {}
    };
    (document.head || document.documentElement).appendChild(foucScript);
  } catch (_) { /* defensive — FOUC is a polish layer, not load-bearing */
    try { document.documentElement.classList.remove('katex-pending'); } catch (_) {}
  }

  // --------------------------------------------------------------------------
  // 5. Expose API.
  // --------------------------------------------------------------------------
  window.MVTheme = {
    get: get,
    set: set,
    toggle: toggle,
    createToggleButton: createToggleButton
  };
})();
