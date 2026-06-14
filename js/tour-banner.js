/*
 * tour-banner.js — a sticky "you're on a guided tour" banner for topic pages.
 *
 * Loaded (deferred) on every topic page that is a tour stop. It does NOTHING
 * unless the reader arrived via a tour, which it detects two ways:
 *   1. URL `?tour=<id>&stop=<n>` — what the banner's own prev/next links use,
 *      so the position is shareable/bookmarkable.
 *   2. A one-shot `sessionStorage['mvnb.tourHandoff']` set by tours.html when a
 *      stop link is clicked — so the entry click doesn't need to rewrite all of
 *      tours.html's hrefs.
 *
 * On a hit it lazy-loads tours-data.js (window.MV_TOURS, generated from
 * tours.html by scripts/build-tours-data.mjs), finds the current page's stop in
 * the tour, and renders a fixed bottom bar: tour title · "stop N of M" ·
 * ← prev / next → · dismiss. Self-contained: injects its own CSS, uses the
 * page's color tokens, and KaTeX-typesets the tour title if KaTeX is present.
 */
(function () {
  'use strict';

  function here() { return location.pathname.split('/').pop() || 'index.html'; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function ctxFromUrl() {
    var p = new URLSearchParams(location.search);
    var tour = p.get('tour');
    if (!tour) return null;
    var stop = parseInt(p.get('stop'), 10);
    return { tour: tour, stop: isFinite(stop) ? stop : null };
  }
  function ctxFromHandoff() {
    try {
      var raw = sessionStorage.getItem('mvnb.tourHandoff');
      if (!raw) return null;
      sessionStorage.removeItem('mvnb.tourHandoff'); // one-shot
      var h = JSON.parse(raw);
      if (h && h.page === here()) {
        return { tour: h.tour, stop: typeof h.stop === 'number' ? h.stop : null };
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  // Always read (and consume) the one-shot handoff, even when the URL already
  // carries ?tour= — otherwise an abandoned handoff could survive the session
  // and re-fire later on its matching page. URL context still wins.
  var fromUrl = ctxFromUrl();
  var fromHandoff = ctxFromHandoff();
  var ctx = fromUrl || fromHandoff;
  if (!ctx) return; // not on a tour — stay invisible

  ensureToursData(function (tours) {
    var tour = null;
    for (var i = 0; i < tours.length; i++) { if (tours[i].id === ctx.tour) { tour = tours[i]; break; } }
    if (!tour) return;
    var page = here();
    var idx = -1;
    if (ctx.stop != null && tour.stops[ctx.stop] && tour.stops[ctx.stop].page === page) idx = ctx.stop;
    if (idx < 0) { for (var j = 0; j < tour.stops.length; j++) { if (tour.stops[j].page === page) { idx = j; break; } } }
    if (idx < 0) return; // this page isn't a stop in that tour
    whenBody(function () { renderBanner(tour, idx); });
  });

  function whenBody(cb) {
    if (document.body) cb();
    else document.addEventListener('DOMContentLoaded', cb, { once: true });
  }

  function ensureToursData(cb) {
    if (window.MV_TOURS) return cb(window.MV_TOURS);
    var s = document.createElement('script');
    s.src = './tours-data.js';
    s.onload = function () { if (window.MV_TOURS) cb(window.MV_TOURS); };
    s.onerror = function () { /* give up silently */ };
    (document.head || document.documentElement).appendChild(s);
  }

  function stopUrl(tour, i) {
    var s = tour.stops[i];
    return './' + s.page + '?tour=' + encodeURIComponent(tour.id) + '&stop=' + i + (s.anchor ? '#' + s.anchor : '');
  }

  function renderBanner(tour, idx) {
    if (document.getElementById('mv-tour-banner')) return;
    injectStyles();
    var n = tour.stops.length;
    var prevUrl = idx > 0 ? stopUrl(tour, idx - 1) : null;
    var nextUrl = idx < n - 1 ? stopUrl(tour, idx + 1) : null;
    var bar = document.createElement('div');
    bar.id = 'mv-tour-banner';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Guided tour navigation');
    if (tour.color) bar.style.setProperty('--mtb-accent', 'var(--' + tour.color + ')');
    bar.innerHTML =
      '<span class="mtb-tour">📍 <a href="./tours.html#' + esc(tour.id) + '">' + esc(tour.title) + '</a></span>'
      + '<span class="mtb-pos">stop ' + (idx + 1) + ' of ' + n + '</span>'
      + '<span class="mtb-nav">'
      + (prevUrl ? '<a class="mtb-btn" href="' + prevUrl + '" rel="prev">← prev</a>'
        : '<span class="mtb-btn disabled">← prev</span>')
      + (nextUrl ? '<a class="mtb-btn" href="' + nextUrl + '" rel="next">next →</a>'
        : '<span class="mtb-btn disabled">next →</span>')
      + '</span>'
      + '<button class="mtb-close" type="button" aria-label="Dismiss tour banner">✕</button>';
    document.body.appendChild(bar);
    bar.querySelector('.mtb-close').addEventListener('click', function () { bar.remove(); });
    if (window.renderMathInElement) {
      try { window.renderMathInElement(bar, { delimiters: [{ left: '$', right: '$', display: false }], throwOnError: false }); }
      catch (e) { /* ignore */ }
    }
  }

  function injectStyles() {
    if (document.getElementById('mv-tour-banner-css')) return;
    var css = document.createElement('style');
    css.id = 'mv-tour-banner-css';
    css.textContent =
      '#mv-tour-banner{position:fixed;left:0;right:0;bottom:0;z-index:60;display:flex;align-items:center;gap:1rem;'
      + 'padding:.5rem 1rem;background:color-mix(in srgb, var(--panel,#161b24) 95%, transparent);'
      + 'border-top:2px solid var(--mtb-accent, var(--cyan,#7de0d6));backdrop-filter:blur(8px);'
      + 'font-size:.85rem;color:var(--ink,#e6edf3);box-shadow:0 -2px 14px rgba(0,0,0,.28)}'
      + '#mv-tour-banner .mtb-tour{font-weight:600}'
      + '#mv-tour-banner .mtb-tour a{color:var(--mtb-accent, var(--cyan,#7de0d6));text-decoration:none}'
      + '#mv-tour-banner .mtb-tour a:hover{text-decoration:underline}'
      + '#mv-tour-banner .mtb-pos{color:var(--mute,#8c9aa6);font-variant-numeric:tabular-nums}'
      + '#mv-tour-banner .mtb-nav{margin-left:auto;display:flex;gap:.5rem}'
      + '#mv-tour-banner .mtb-btn{padding:.25rem .7rem;border:1px solid var(--line,#2a3140);border-radius:6px;'
      + 'color:var(--ink,#e6edf3);text-decoration:none;font-weight:500;white-space:nowrap}'
      + '#mv-tour-banner a.mtb-btn:hover{border-color:var(--mtb-accent, var(--cyan,#7de0d6));color:var(--mtb-accent, var(--cyan,#7de0d6))}'
      + '#mv-tour-banner .mtb-btn.disabled{opacity:.4}'
      + '#mv-tour-banner .mtb-close{background:none;border:none;color:var(--mute,#8c9aa6);cursor:pointer;font-size:1rem;line-height:1;padding:0 .3rem}'
      + '#mv-tour-banner .mtb-close:hover{color:var(--ink,#e6edf3)}'
      + '@media (max-width:720px){#mv-tour-banner{flex-wrap:wrap;gap:.35rem .8rem;font-size:.8rem;padding:.45rem .8rem}}';
    (document.head || document.documentElement).appendChild(css);
  }
})();
