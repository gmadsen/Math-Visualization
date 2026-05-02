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
    window.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', update);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
