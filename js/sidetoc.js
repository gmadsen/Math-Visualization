/* sidebar TOC builder + active-section highlighting.
 *
 * Populates the empty <aside class="sidetoc"> scaffold every page ships with.
 * Two source modes:
 *   1. nav.toc-mirror (default for topic pages, tours, latex-cheatsheet, most
 *      capstones): clone the anchor links inside <nav class="toc">.
 *   2. main > section[id] scan (capstone-style story pages without a top-nav
 *      anchor list): walk the section ids directly.
 *
 * The aside's title text defaults to "On this page". Pass data-title="…" on
 * the aside to override (tours.html uses "Tours").
 *
 * Self-initializes on DOMContentLoaded — no init call required.
 */
(function(){
  function buildFromNav(aside, topnav){
    const srcs = [...topnav.querySelectorAll('a[href^="#"]')];
    if(!srcs.length) return null;
    const ol = document.createElement('ol');
    const sectionEntries = [];
    srcs.forEach(src => {
      const href = src.getAttribute('href');
      const id = href.slice(1);
      const target = document.getElementById(id);
      if(!target) return;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = href;
      const clone = src.cloneNode(true);
      clone.querySelectorAll('.katex-mathml').forEach(n => n.remove());
      a.textContent = clone.textContent.replace(/[\u00a0]/g, ' ').replace(/\s+/g, ' ').trim();
      li.appendChild(a);
      ol.appendChild(li);
      sectionEntries.push({a, s: target});
    });
    return sectionEntries.length ? { ol, sectionEntries } : null;
  }

  function buildFromSections(aside){
    const sections = [...document.querySelectorAll('main > section[id]')];
    if(!sections.length) return null;
    const ol = document.createElement('ol');
    const sectionEntries = [];
    for(const s of sections){
      const h = s.querySelector('h1, h2');
      if(!h) continue;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + s.id;
      a.textContent = h.textContent.trim();
      li.appendChild(a);
      ol.appendChild(li);
      sectionEntries.push({a, s});
    }
    return sectionEntries.length ? { ol, sectionEntries } : null;
  }

  function build(){
    const aside = document.querySelector('aside.sidetoc');
    if(!aside) return;
    const topnav = document.querySelector('nav.toc');
    const built = (topnav && buildFromNav(aside, topnav)) || buildFromSections(aside);
    if(!built) return;
    const titleText = aside.getAttribute('data-title') || 'On this page';
    const title = document.createElement('div');
    title.className = 'sidetoc-title';
    title.textContent = titleText;
    aside.appendChild(title);
    aside.appendChild(built.ol);
    const links = [...aside.querySelectorAll('a')];
    const sections = built.sectionEntries;
    function update(){
      const threshold = 140;
      let activeLink = sections[0].a;
      for(const {a, s} of sections){
        if(s.getBoundingClientRect().top <= threshold) activeLink = a;
      }
      links.forEach(x => x.classList.remove('active'));
      activeLink.classList.add('active');
    }
    update();
    let raf = 0;
    function schedule(){
      if(raf) return;
      raf = requestAnimationFrame(() => { raf = 0; update(); });
    }
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule, {passive: true});

    // Below 1180px viewport, per-page CSS hides aside.sidetoc and lets the
    // top-nav inline anchor list take over. That flood is unusable on
    // long topics. notebook.css promotes the sidetoc to a slide-in drawer;
    // we wire the toggle here so any topic page picks it up automatically.
    setupDrawer(aside);
  }

  function setupDrawer(aside){
    const topnav = document.querySelector('nav.toc');
    if(!topnav) return;

    // Inject the toggle button. Anchored to the right of nav.toc; CSS keeps
    // it hidden above 1180px.
    let toggle = topnav.querySelector('.sidetoc-drawer-toggle');
    if(!toggle){
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'sidetoc-drawer-toggle';
      toggle.setAttribute('aria-label', 'Open sections');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', aside.id || 'sidetoc-aside');
      if(!aside.id) aside.id = 'sidetoc-aside';
      toggle.textContent = 'Sections';
      topnav.appendChild(toggle);
    }

    // Backdrop element shared with the drawer.
    let backdrop = document.querySelector('.sidetoc-backdrop');
    if(!backdrop){
      backdrop = document.createElement('div');
      backdrop.className = 'sidetoc-backdrop';
      document.body.appendChild(backdrop);
    }

    let lastFocused = null;
    function open(){
      lastFocused = document.activeElement;
      aside.classList.add('is-drawer-open');
      backdrop.classList.add('is-active');
      document.body.classList.add('sidetoc-locked');
      toggle.setAttribute('aria-expanded', 'true');
      // Focus into the drawer so SR / keyboard users land inside the panel.
      const firstLink = aside.querySelector('a');
      if(firstLink){ try { firstLink.focus({preventScroll: true}); } catch(_) {} }
    }
    function close(){
      aside.classList.remove('is-drawer-open');
      backdrop.classList.remove('is-active');
      document.body.classList.remove('sidetoc-locked');
      toggle.setAttribute('aria-expanded', 'false');
      // Restore focus to the toggle so keyboard tab order resumes naturally.
      if(lastFocused && typeof lastFocused.focus === 'function'){
        try { lastFocused.focus({preventScroll: true}); } catch(_) {}
      } else {
        try { toggle.focus({preventScroll: true}); } catch(_) {}
      }
      lastFocused = null;
    }
    function isOpen(){ return aside.classList.contains('is-drawer-open'); }

    toggle.addEventListener('click', () => {
      if(isOpen()) close(); else open();
    });
    backdrop.addEventListener('click', close);
    aside.addEventListener('click', (e) => {
      // Close after the user picks a section so they're not staring at the drawer.
      if(e.target && e.target.tagName === 'A') close();
    });
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && isOpen()) close();
    });
    // Crossing the breakpoint upward: reset drawer state. Always clear the
    // body lock — even if isOpen() reads false, a stale `sidetoc-locked` from
    // any other code path (or a disrupted close) shouldn't leave the page
    // un-scrollable. Reuses the same rAF schedule() throttle as the scroll
    // handler.
    let resizeRaf = 0;
    function onResize(){
      if(resizeRaf) return;
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        if(window.innerWidth > 1180){
          if(isOpen()) close();
          document.body.classList.remove('sidetoc-locked');
        }
      });
    }
    window.addEventListener('resize', onResize, {passive: true});
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
