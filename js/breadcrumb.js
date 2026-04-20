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
    st.textContent =
      '.breadcrumb{display:inline-flex;align-items:center;gap:.55rem;' +
      'color:var(--mute);font-size:inherit;flex-wrap:wrap}' +
      '.breadcrumb .bc-sep{color:var(--line);user-select:none}' +
      '.breadcrumb .bc-section{color:var(--mute)}' +
      '.breadcrumb a{color:var(--mute);text-decoration:none}' +
      '.breadcrumb a:hover{color:var(--violet)}';
    document.head.appendChild(st);
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
