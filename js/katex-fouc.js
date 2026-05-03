// katex-fouc.js — hide raw `$…$` text until KaTeX auto-render finishes.
//
// Companion to css/notebook.css's `html.katex-pending main { opacity: 0 }`
// rule: this script adds `katex-pending` synchronously on load and removes
// it once KaTeX has actually settled. Three signals trigger removal, in
// order of preference:
//
//   1. MutationObserver sees the first .katex element appear in the DOM
//      (KaTeX renders raw text into <span class="katex">…). Most accurate;
//      fires within milliseconds of auto-render starting.
//   2. window.load — every subresource finished, KaTeX must have run by now.
//   3. 1500ms safety timer — covers KaTeX failures, ad-blockers, no-network.
//
// If JS fails to run at all, no class is added → no opacity:0 → page renders
// normally. Defensive try/catch wraps every entry point so the FOUC mechanism
// can never lock the page blank.
//
// Loaded by js/theme-toggle.js on the 143 pages that have it, and by a
// direct <script> tag on the 5 pages that don't (capstone-{bsd,flt,satotate}-
// story, search, widgets).

(function () {
  try {
    var html = document.documentElement;
    // The pending class is normally added synchronously by js/theme-toggle.js
    // BEFORE this script loads — that's the whole point: get opacity:0 onto
    // <html> before first paint. classList.add is idempotent, so re-adding
    // here is a no-op for the common case and a safety net for pages that
    // load this script directly without theme-toggle.
    //
    // An earlier version returned early when the class was already present;
    // that skipped the reveal triggers below and left every theme-toggle.js
    // page stuck at opacity:0 forever (only the top-nav was visible, since
    // <main> + section.hero are hidden by the FOUC rule). Don't reinstate.
    html.classList.add('katex-pending');

    var revealed = false;
    function reveal() {
      if (revealed) return;
      revealed = true;
      try {
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(function () { html.classList.remove('katex-pending'); });
        } else {
          html.classList.remove('katex-pending');
        }
      } catch (_) {
        try { html.classList.remove('katex-pending'); } catch (__) {}
      }
    }

    // Signal 1: first .katex element rendered. Cheapest "actually done" check.
    try {
      if (typeof MutationObserver === 'function') {
        var observer = new MutationObserver(function () {
          if (document.querySelector('.katex')) {
            observer.disconnect();
            reveal();
          }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
      }
    } catch (_) {}

    // Signal 2: window.load — backstop for pages with no KaTeX content.
    function onLoad() { reveal(); }
    if (document.readyState === 'complete') {
      reveal();
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }

    // Signal 3: 1500ms safety timer.
    setTimeout(reveal, 1500);
  } catch (e) {
    try { document.documentElement.classList.remove('katex-pending'); } catch (_) {}
  }
})();
