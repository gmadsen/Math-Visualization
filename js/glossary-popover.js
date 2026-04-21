// Glossary popover for auto-inserted inline concept links.
//
// Every anchor carrying `data-auto-inline-link="1"` is enriched by
// scripts/audit-inline-links.mjs with:
//   data-concept-id="<id>"   canonical concept id
//   data-blurb="<blurb>"     HTML-escaped 1–2 sentence summary
// This script attaches delegated listeners to those anchors and shows a
// floating mini-card with:
//   • title           (from window.__MVConcepts if available, else anchor text)
//   • blurb           (from data-blurb)
//   • mastery pill    (read via MVProgress; same 5-pip colour scheme as the
//                      index drawer: locked / ready / v1 / hard / expert)
//   • "Open →" link   (anchor's own href)
//
// Interaction model:
//   Desktop (hover-capable pointers):
//     pointerenter on anchor → 150 ms delay → show
//     pointerleave           → 150 ms grace → hide  (pointer can move into
//                                                    popover without dismiss)
//   Touch / coarse pointers:
//     first tap              → preventDefault + show popover
//     second tap on same     → navigate normally
//     tap outside            → dismiss
//
// Palette tokens only. No external deps. Safe to load on every topic page —
// bails out as a no-op when there are no auto-inline-link anchors.
(function () {
  'use strict';

  var HOVER_SHOW_DELAY = 150;
  var HOVER_HIDE_DELAY = 150;
  var POPOVER_WIDTH = 300;
  var VIEWPORT_PAD = 8;
  var GAP = 8; // gap between anchor and popover edge

  // ───────────────────────────────────────────────────────────────────────
  // State.

  var popoverEl = null;       // the floating div (lazily created)
  var currentAnchor = null;   // anchor the popover is attached to
  var showTimer = null;
  var hideTimer = null;
  var armedForNavAnchor = null; // touch-mode: the anchor whose next tap navigates
  var pointerLike = null;     // most recent pointer event type ('mouse' | 'touch' | 'pen')

  // ───────────────────────────────────────────────────────────────────────
  // Stylesheet (injected once).

  function ensureStyle() {
    if (document.getElementById('mv-glossary-popover-style')) return;
    var st = document.createElement('style');
    st.id = 'mv-glossary-popover-style';
    st.textContent = [
      '.mv-glossary-popover{position:fixed;z-index:9999;max-width:' + POPOVER_WIDTH + 'px;',
      '  width:max-content;min-width:220px;background:var(--panel);',
      '  border:1px solid var(--line);border-radius:8px;',
      '  padding:0.7rem 0.85rem 0.75rem;color:var(--ink);',
      '  font-size:0.86rem;line-height:1.4;',
      '  box-shadow:0 8px 24px rgba(0,0,0,0.45);',
      '  opacity:0;pointer-events:none;',
      '  transition:opacity 120ms ease}',
      '.mv-glossary-popover.open{opacity:1;pointer-events:auto}',
      '.mv-glossary-popover .mvgp-title{font-weight:600;color:#fff;',
      '  font-size:0.95rem;margin:0 0 0.35rem;line-height:1.3}',
      '.mv-glossary-popover .mvgp-blurb{margin:0 0 0.6rem;color:var(--mute);',
      '  font-size:0.84rem;line-height:1.45}',
      '.mv-glossary-popover .mvgp-foot{display:flex;align-items:center;',
      '  justify-content:space-between;gap:10px;',
      '  border-top:1px solid var(--line);padding-top:0.5rem;margin-top:0.1rem}',
      '.mv-glossary-popover .mvgp-pill{display:inline-flex;align-items:center;gap:6px;',
      '  color:var(--mute);font-family:ui-monospace,Menlo,monospace;',
      '  font-size:0.72rem;letter-spacing:0.02em}',
      '.mv-glossary-popover .mvgp-pip{width:10px;height:10px;border-radius:50%;',
      '  background:transparent;border:1.6px solid var(--mute);box-sizing:border-box}',
      '.mv-glossary-popover .mvgp-pip.ready{background:var(--blue);border-color:var(--blue)}',
      '.mv-glossary-popover .mvgp-pip.v1{background:var(--green);border-color:var(--green)}',
      '.mv-glossary-popover .mvgp-pip.hard{background:var(--violet);border-color:var(--violet)}',
      '.mv-glossary-popover .mvgp-pip.expert{background:var(--yellow);border-color:var(--yellow)}',
      '.mv-glossary-popover .mvgp-pip.locked{background:transparent;',
      '  border-color:var(--mute);opacity:0.55}',
      '.mv-glossary-popover .mvgp-open{color:var(--blue);text-decoration:none;',
      '  font-size:0.82rem;white-space:nowrap}',
      '.mv-glossary-popover .mvgp-open:hover{color:var(--cyan)}'
    ].join('\n');
    document.head.appendChild(st);
  }

  // ───────────────────────────────────────────────────────────────────────
  // Concept-map lookup. Optional: enriches popover title with the canonical
  // concept title. Falls back to anchor text if the bundle isn't loaded on
  // this page.

  var conceptsById = null;
  function getConceptById(id) {
    if (!id) return null;
    if (conceptsById) return conceptsById.get(id) || null;
    var mv = window.__MVConcepts;
    if (!mv || !mv.topics) {
      conceptsById = new Map();
      return null;
    }
    conceptsById = new Map();
    try {
      for (var topicKey in mv.topics) {
        if (!Object.prototype.hasOwnProperty.call(mv.topics, topicKey)) continue;
        var t = mv.topics[topicKey];
        var list = (t && t.concepts) || [];
        for (var i = 0; i < list.length; i++) {
          var c = list[i];
          if (c && c.id) conceptsById.set(c.id, c);
        }
      }
    } catch (_) {}
    return conceptsById.get(id) || null;
  }

  // ───────────────────────────────────────────────────────────────────────
  // Mastery state → pip class + label. Matches the index.html drawer legend.

  function stateFor(id) {
    if (!id) return { state: 'locked', v1: false, hard: false, expert: false };
    try {
      if (window.MVProgress && typeof window.MVProgress.stateOf === 'function') {
        var concepts = getConceptsMap();
        return window.MVProgress.stateOf(id, concepts);
      }
    } catch (_) {}
    return { state: 'locked', v1: false, hard: false, expert: false };
  }

  // Build a Map<id, {prereqs}> from window.__MVConcepts, cached on first use.
  // MVProgress.stateOf consults it to compute locked/ready. If the bundle
  // isn't loaded, we pass null — stateOf gracefully returns 'locked' for
  // unknown concepts, which is fine (we still report v1/hard/expert correctly
  // from storage, and a missing-prereq concept would show as locked, matching
  // the drawer's behaviour).
  var _conceptsMap = null;
  function getConceptsMap() {
    if (_conceptsMap) return _conceptsMap;
    var mv = window.__MVConcepts;
    if (!mv || !mv.topics) return (_conceptsMap = new Map());
    _conceptsMap = new Map();
    for (var topicKey in mv.topics) {
      if (!Object.prototype.hasOwnProperty.call(mv.topics, topicKey)) continue;
      var list = (mv.topics[topicKey].concepts) || [];
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (c && c.id) {
          _conceptsMap.set(c.id, { prereqs: Array.isArray(c.prereqs) ? c.prereqs : [] });
        }
      }
    }
    return _conceptsMap;
  }

  function pipClassOf(st) {
    if (st.expert) return 'expert';
    if (st.hard)   return 'hard';
    if (st.v1)     return 'v1';
    if (st.state === 'ready') return 'ready';
    return 'locked';
  }
  function pipLabelOf(st) {
    if (st.expert) return 'expert';
    if (st.hard)   return 'hard';
    if (st.v1)     return 'v1 mastered';
    if (st.state === 'ready') return 'ready';
    return 'locked';
  }

  // ───────────────────────────────────────────────────────────────────────
  // Popover construction / positioning.

  function ensurePopover() {
    if (popoverEl) return popoverEl;
    ensureStyle();
    var el = document.createElement('div');
    el.className = 'mv-glossary-popover';
    el.setAttribute('role', 'tooltip');
    el.id = 'mv-glossary-popover';
    // Keep open while pointer is inside the popover itself.
    el.addEventListener('pointerenter', function () {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    });
    el.addEventListener('pointerleave', function (ev) {
      // Only chase-dismiss for mouse-like pointers.
      if (ev.pointerType === 'touch') return;
      scheduleHide();
    });
    document.body.appendChild(el);
    popoverEl = el;
    return el;
  }

  function renderPopover(anchor) {
    var el = ensurePopover();
    var id = anchor.getAttribute('data-concept-id') || '';
    var blurb = anchor.getAttribute('data-blurb') || '';
    var href = anchor.getAttribute('href') || '#';
    var fallbackTitle = (anchor.textContent || '').trim() || id;
    var canonical = getConceptById(id);
    var title = (canonical && canonical.title) || fallbackTitle;

    var st = stateFor(id);
    var pipCls = pipClassOf(st);
    var pipLbl = pipLabelOf(st);

    // Build via DOM so blurb text stays as text (no re-parsing of the
    // data-blurb attribute's contents).
    el.innerHTML = '';
    var titleEl = document.createElement('div');
    titleEl.className = 'mvgp-title';
    titleEl.textContent = title;
    el.appendChild(titleEl);

    if (blurb) {
      var blurbEl = document.createElement('p');
      blurbEl.className = 'mvgp-blurb';
      blurbEl.textContent = blurb;
      el.appendChild(blurbEl);
    }

    var foot = document.createElement('div');
    foot.className = 'mvgp-foot';
    var pill = document.createElement('span');
    pill.className = 'mvgp-pill';
    var pip = document.createElement('span');
    pip.className = 'mvgp-pip ' + pipCls;
    pip.setAttribute('aria-hidden', 'true');
    var lbl = document.createElement('span');
    lbl.textContent = pipLbl;
    pill.appendChild(pip);
    pill.appendChild(lbl);
    foot.appendChild(pill);

    var openLink = document.createElement('a');
    openLink.className = 'mvgp-open';
    openLink.href = href;
    openLink.textContent = 'Open →';
    foot.appendChild(openLink);
    el.appendChild(foot);

    return el;
  }

  function positionPopover(el, anchor) {
    // Anchor rect in viewport coords; popover is position:fixed.
    var rect = anchor.getBoundingClientRect();
    var vw = window.innerWidth || document.documentElement.clientWidth;
    var vh = window.innerHeight || document.documentElement.clientHeight;

    // Reset so measurement reflects intrinsic size.
    el.style.left = '0px';
    el.style.top = '0px';
    el.style.maxWidth = POPOVER_WIDTH + 'px';
    var pw = el.offsetWidth;
    var ph = el.offsetHeight;

    // Default: below anchor, left-aligned with the anchor's left edge.
    var left = rect.left;
    var top = rect.bottom + GAP;

    // Clamp horizontally.
    if (left + pw + VIEWPORT_PAD > vw) left = vw - pw - VIEWPORT_PAD;
    if (left < VIEWPORT_PAD) left = VIEWPORT_PAD;

    // Flip above if it would overflow the bottom.
    if (top + ph + VIEWPORT_PAD > vh) {
      var above = rect.top - GAP - ph;
      if (above >= VIEWPORT_PAD) {
        top = above;
      } else {
        // Neither side has room; pin to viewport and clamp.
        top = Math.max(VIEWPORT_PAD, Math.min(top, vh - ph - VIEWPORT_PAD));
      }
    }

    el.style.left = left + 'px';
    el.style.top = top + 'px';
  }

  function show(anchor) {
    if (!anchor) return;
    if (currentAnchor && currentAnchor !== anchor) hideImmediately();
    var el = renderPopover(anchor);
    positionPopover(el, anchor);
    el.classList.add('open');
    currentAnchor = anchor;
    try { anchor.setAttribute('aria-describedby', 'mv-glossary-popover'); } catch (_) {}
  }

  function hideImmediately() {
    if (!popoverEl) return;
    popoverEl.classList.remove('open');
    if (currentAnchor) {
      try { currentAnchor.removeAttribute('aria-describedby'); } catch (_) {}
    }
    currentAnchor = null;
    armedForNavAnchor = null;
  }

  function scheduleShow(anchor) {
    if (showTimer) clearTimeout(showTimer);
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    showTimer = setTimeout(function () {
      showTimer = null;
      show(anchor);
    }, HOVER_SHOW_DELAY);
  }
  function scheduleHide() {
    if (showTimer) { clearTimeout(showTimer); showTimer = null; }
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      hideTimer = null;
      hideImmediately();
    }, HOVER_HIDE_DELAY);
  }

  // ───────────────────────────────────────────────────────────────────────
  // Delegated listeners.

  function isTargetAnchor(ev) {
    var t = ev.target;
    if (!t || typeof t.closest !== 'function') return null;
    return t.closest('a[data-auto-inline-link="1"]');
  }

  function onPointerEnter(ev) {
    var a = isTargetAnchor(ev);
    if (!a) return;
    pointerLike = ev.pointerType || 'mouse';
    if (ev.pointerType === 'touch') return; // touch uses click flow
    scheduleShow(a);
  }

  function onPointerLeave(ev) {
    var a = isTargetAnchor(ev);
    if (!a) return;
    if (ev.pointerType === 'touch') return;
    scheduleHide();
  }

  function onClick(ev) {
    var a = isTargetAnchor(ev);
    if (!a) {
      // Outside-click on popover-or-anchor → dismiss.
      if (popoverEl && popoverEl.classList.contains('open')) {
        // Preserve clicks that land inside the popover itself (e.g. "Open →").
        if (ev.target && typeof ev.target.closest === 'function' &&
            ev.target.closest('.mv-glossary-popover')) {
          return;
        }
        hideImmediately();
      }
      return;
    }

    // If the coarsest pointer interaction on this anchor just fired
    // (touch/pen), treat the first click as "reveal the popover" and block
    // navigation. A second click on the same anchor navigates normally.
    //
    // We conservatively treat any click on an anchor while the popover is
    // NOT yet open-on-this-anchor as "reveal-first" on coarse pointers.
    var isCoarse = (pointerLike === 'touch' || pointerLike === 'pen') ||
                   (window.matchMedia && window.matchMedia('(hover: none)').matches);

    if (isCoarse) {
      if (armedForNavAnchor === a) {
        // Second tap: let navigation proceed.
        return;
      }
      // First tap: show popover, arm for next tap.
      ev.preventDefault();
      show(a);
      armedForNavAnchor = a;
    }
    // On non-coarse (mouse) pointers, let the click navigate as usual; the
    // popover is a hover-only aid there.
  }

  function onScrollOrResize() {
    if (currentAnchor && popoverEl && popoverEl.classList.contains('open')) {
      positionPopover(popoverEl, currentAnchor);
    }
  }

  function onKey(ev) {
    if (ev.key === 'Escape' && popoverEl && popoverEl.classList.contains('open')) {
      hideImmediately();
    }
  }

  function init() {
    // Bail out early if the page has no auto-inline-link anchors. The
    // listeners are cheap (delegated) but skipping keeps the footprint even
    // smaller on pages with no candidates.
    if (!document.querySelector('a[data-auto-inline-link="1"]')) return;

    document.addEventListener('pointerenter', onPointerEnter, true);
    document.addEventListener('pointerleave', onPointerLeave, true);
    document.addEventListener('click', onClick, true);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    document.addEventListener('keydown', onKey);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
