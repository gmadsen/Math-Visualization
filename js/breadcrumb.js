// Compact breadcrumb strip for topic pages.
//
// Reads window.__MV_SECTION_MAP (injected at build time by
// scripts/inject-breadcrumb.mjs from index.html), derives the current topic
// slug from location.pathname, and populates the <div class="breadcrumb">
// mount point inside <nav class="toc"> with:
//
//   · <Section> · ← Prev · Next →
//
// Prev/next are the alphabetically-adjacent topics within the same section
// (matching the card order in index.html). Omitted at section boundaries.
//
// Styling stays inside the file (tiny CSS block) and uses existing palette
// tokens — no raw hex. The strip inherits nav.toc's font-size and color
// cascade so it blends with the "← Notebook" link.
(function () {
  function currentSlug() {
    var path = (typeof location !== 'undefined' && location.pathname) || '';
    var parts = path.split('/');
    var last = parts[parts.length - 1] || '';
    last = last.replace(/^\.\//, '');
    var m = last.match(/^(.+)\.html$/);
    return m ? m[1] : null;
  }

  function ensureStyle() {
    if (document.getElementById('mv-breadcrumb-style')) return;
    var st = document.createElement('style');
    st.id = 'mv-breadcrumb-style';
    st.textContent = [
      '.breadcrumb{display:inline-flex;align-items:center;gap:.55rem;',
      'color:var(--mute);font-size:inherit;flex-wrap:wrap}',
      '.breadcrumb .bc-sep{color:var(--line);user-select:none}',
      '.breadcrumb .bc-section{color:var(--mute)}',
      '.breadcrumb a{color:var(--mute);text-decoration:none}',
      '.breadcrumb a:hover{color:var(--violet)}',
      // Section TOC wrapper. display:contents keeps anchors as direct flex
      // children of nav.toc on wide and tablet screens, preserving the
      // existing inline layout. On narrow screens (<=720px) the wrapper
      // becomes a collapsible panel toggled via .toc-open on nav.toc.
      '.toc-sections{display:contents}',
      // Toggle button hidden by default; surfaces only on narrow screens.
      '.toc-toggle{display:none;align-items:center;gap:.25rem;',
      'background:transparent;border:1px solid var(--line);border-radius:6px;',
      'padding:.2rem .55rem;font:inherit;font-size:.82rem;color:var(--mute);',
      'cursor:pointer;line-height:1.3}',
      '.toc-toggle:hover{color:var(--ink);border-color:var(--mute)}',
      '.toc-toggle .toc-toggle-arrow{transition:transform 160ms ease;display:inline-block}',
      'nav.toc.toc-open .toc-toggle .toc-toggle-arrow{transform:rotate(180deg)}',
      '@media (max-width:720px){',
      // Tighten the sticky bar so it doesn't dominate the viewport.
      '  nav.toc{gap:.5rem .8rem;padding:.45rem .75rem;font-size:.88rem;',
      '    align-items:center}',
      '  nav.toc > a[href$="index.html"]{flex:0 0 auto}',
      '  .breadcrumb{font-size:.82rem;gap:.4rem;flex:1 1 auto;min-width:0}',
      // Slightly tighter controls cluster.
      '  .mv-theme-slot{display:inline-flex;align-items:center;gap:.35rem;flex-wrap:wrap}',
      '  .mv-theme-slot .mv-theme-toggle,',
      '  .mv-theme-slot .mv-display-toggle{padding:3px 7px;font-size:.92rem}',
      // Surface the toggle, hide the section list by default.
      '  .toc-toggle{display:inline-flex;flex:0 0 auto;margin-left:auto}',
      '  .toc-sections{display:none;flex:1 1 100%}',
      '  nav.toc.toc-open .toc-sections{display:flex;flex-wrap:wrap;',
      '    gap:.4rem .9rem;padding:.55rem 0 .25rem;margin-top:.3rem;',
      '    border-top:1px solid var(--line);max-height:50vh;overflow-y:auto;',
      '    -webkit-overflow-scrolling:touch}',
      '  nav.toc.toc-open .toc-sections > a{padding:.15rem 0}',
      '}',
    ].join('');
    document.head.appendChild(st);
  }

  // Wrap the section anchor links (href="#…") inside <nav class="toc"> in a
  // single <div class="toc-sections"> so we can collapse/expand the whole list
  // as a unit on narrow viewports. Idempotent: bails out if the wrapper
  // already exists. Preserves DOM order — the wrapper takes the position of
  // the first anchor, and all subsequent anchors are appended into it.
  function wrapSectionLinks(nav) {
    if (!nav || nav.querySelector(':scope > .toc-sections')) return null;
    var anchors = [];
    var children = nav.children;
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (c.tagName !== 'A') continue;
      var href = c.getAttribute('href') || '';
      if (href.charAt(0) === '#') anchors.push(c);
    }
    if (anchors.length === 0) return null;
    var wrap = document.createElement('div');
    wrap.className = 'toc-sections';
    nav.insertBefore(wrap, anchors[0]);
    for (var j = 0; j < anchors.length; j++) {
      wrap.appendChild(anchors[j]);
    }
    return wrap;
  }

  // Build the "Sections ▾" toggle and append it to <nav class="toc">. Wired
  // to flip the .toc-open class on the nav. Auto-collapses when the user
  // taps a section link or grows the viewport past the mobile breakpoint
  // (so the panel never strands open on rotate). Idempotent.
  function ensureToggle(nav, wrap) {
    if (!nav || !wrap) return;
    if (nav.querySelector(':scope > .toc-toggle')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toc-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', wrap.id || '');
    btn.setAttribute('aria-label', 'Show section list');
    var lbl = document.createElement('span');
    lbl.textContent = 'Sections';
    var arr = document.createElement('span');
    arr.className = 'toc-toggle-arrow';
    arr.setAttribute('aria-hidden', 'true');
    arr.textContent = '▾'; // ▾
    btn.appendChild(lbl);
    btn.appendChild(document.createTextNode(' '));
    btn.appendChild(arr);
    nav.appendChild(btn);

    function setOpen(open) {
      if (open) nav.classList.add('toc-open');
      else nav.classList.remove('toc-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      setOpen(!nav.classList.contains('toc-open'));
    });
    // Collapse after picking a section so the user lands on content.
    var anchors = wrap.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function () { setOpen(false); });
    }
    // If the viewport widens past the mobile breakpoint, drop the open
    // state — desktop layout doesn't use it and a stale class would leave
    // the panel artifacts visible until the next toggle.
    if (window.matchMedia) {
      try {
        var mq = window.matchMedia('(max-width: 720px)');
        var onChange = function () { if (!mq.matches) setOpen(false); };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
      } catch (e) { /* ignore */ }
    }
  }

  function setupResponsiveNav() {
    var nav = document.querySelector('nav.toc');
    if (!nav) return;
    var wrap = wrapSectionLinks(nav);
    if (wrap) ensureToggle(nav, wrap);
  }

  function render() {
    var mount = document.querySelector('nav.toc .breadcrumb');
    if (!mount) return;
    var map = window.__MV_SECTION_MAP;
    if (!map || typeof map !== 'object') return;
    var slug = currentSlug();
    if (!slug) return;
    var entry = map[slug];
    if (!entry) return;
    ensureStyle();
    // clear any previous content (re-render safety)
    while (mount.firstChild) mount.removeChild(mount.firstChild);

    function sep() {
      var s = document.createElement('span');
      s.className = 'bc-sep';
      s.textContent = '·';
      return s;
    }
    function label(text, cls) {
      var s = document.createElement('span');
      if (cls) s.className = cls;
      s.textContent = text;
      return s;
    }
    function link(href, text) {
      var a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      return a;
    }

    mount.appendChild(sep());
    mount.appendChild(label(entry.section || '', 'bc-section'));

    if (entry.prev) {
      var prevEntry = map[entry.prev];
      var prevTitle = (prevEntry && prevEntry.title) || entry.prev;
      mount.appendChild(sep());
      mount.appendChild(link('./' + entry.prev + '.html', '← ' + prevTitle));
    }
    if (entry.next) {
      var nextEntry = map[entry.next];
      var nextTitle = (nextEntry && nextEntry.title) || entry.next;
      mount.appendChild(sep());
      mount.appendChild(link('./' + entry.next + '.html', nextTitle + ' →'));
    }
  }

  function init() {
    // Always inject the style + responsive plumbing — the breadcrumb mount
    // can be missing (no section map entry) but the section-link panel still
    // needs the mobile collapse on every topic page.
    ensureStyle();
    setupResponsiveNav();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
