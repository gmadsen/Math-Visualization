// Concept-lineage mini-DAG strip.
//
// Rendered near the top of every topic page inside the
// <div id="mv-lineage-mount"> injected by inject-breadcrumb.mjs. The
// strip has three columns:
//
//   Prereqs     |   This topic    |   Consumers
//   -----------     -------------     ------------
//   up to 5          up to 5          up to 5
//   pill links       concept titles   pill links
//
// "Prereqs" = concepts from *other* topics that are direct prereqs of
// some concept on this page. "Consumers" = concepts from *other* topics
// that directly prereq some concept on this page. Both lists dedup by
// concept id; in-topic edges are shown only as the centre column.
//
// Reads window.__MVConcepts (emitted by concepts/bundle.js). If the
// bundle isn't loaded or the current page isn't a registered topic, the
// strip hides itself gracefully and the page looks unchanged.
//
// Palette tokens only. Plain HTML pills (no SVG — the requirement says
// "compact strip" and pills give us crisp text without worrying about
// text sizing inside an SVG on mobile).
(function () {
  'use strict';

  if (typeof document === 'undefined') return;

  var MAX_PER_COLUMN = 5;

  function currentSlug() {
    var path = (typeof location !== 'undefined' && location.pathname) || '';
    var parts = path.split('/');
    var last = parts[parts.length - 1] || '';
    last = last.replace(/^\.\//, '');
    var m = last.match(/^(.+)\.html$/);
    return m ? m[1] : null;
  }

  // Walk window.__MVConcepts.topics and build two lookup maps:
  //   conceptById[id] = { id, title, topic, anchor, prereqs: [...] }
  //   consumersById[id] = [ <id of concept that prereqs id> ... ]
  function buildIndex(mvc) {
    var byId = {};
    var consumers = {};
    if (!mvc || !mvc.topics) return { byId: byId, consumers: consumers };
    var topics = mvc.topics;
    for (var topicSlug in topics) {
      if (!Object.prototype.hasOwnProperty.call(topics, topicSlug)) continue;
      var entry = topics[topicSlug];
      if (!entry || !entry.concepts) continue;
      for (var i = 0; i < entry.concepts.length; i++) {
        var c = entry.concepts[i];
        if (!c || !c.id) continue;
        byId[c.id] = {
          id: c.id,
          title: c.title || c.id,
          topic: topicSlug,
          anchor: c.anchor || '',
          prereqs: Array.isArray(c.prereqs) ? c.prereqs.slice() : []
        };
      }
    }
    for (var id in byId) {
      var prereqs = byId[id].prereqs;
      for (var j = 0; j < prereqs.length; j++) {
        var pre = prereqs[j];
        if (!byId[pre]) continue;
        (consumers[pre] = consumers[pre] || []).push(id);
      }
    }
    return { byId: byId, consumers: consumers };
  }

  function ownConceptIds(mvc, slug) {
    var out = [];
    if (!mvc || !mvc.topics || !mvc.topics[slug]) return out;
    var concepts = mvc.topics[slug].concepts || [];
    for (var i = 0; i < concepts.length; i++) {
      if (concepts[i] && concepts[i].id) out.push(concepts[i].id);
    }
    return out;
  }

  // Lineage: direct prereqs from *other* topics, and direct consumers
  // from *other* topics. Dedup by concept id, preserve first-seen order.
  function computeLineage(index, slug, ownIds) {
    var ownSet = {};
    for (var i = 0; i < ownIds.length; i++) ownSet[ownIds[i]] = true;

    var prereqs = [];
    var prereqSeen = {};
    var consumers = [];
    var consumerSeen = {};

    for (var k = 0; k < ownIds.length; k++) {
      var id = ownIds[k];
      var c = index.byId[id];
      if (!c) continue;
      // Direct prereqs (cross-topic only).
      for (var p = 0; p < c.prereqs.length; p++) {
        var pre = c.prereqs[p];
        var preEntry = index.byId[pre];
        if (!preEntry) continue;
        if (preEntry.topic === slug) continue;
        if (prereqSeen[pre]) continue;
        prereqSeen[pre] = true;
        prereqs.push(preEntry);
      }
      // Direct consumers (cross-topic only).
      var cs = index.consumers[id] || [];
      for (var q = 0; q < cs.length; q++) {
        var consId = cs[q];
        var consEntry = index.byId[consId];
        if (!consEntry) continue;
        if (consEntry.topic === slug) continue;
        if (consumerSeen[consId]) continue;
        consumerSeen[consId] = true;
        consumers.push(consEntry);
      }
    }
    return {
      prereqs: prereqs.slice(0, MAX_PER_COLUMN),
      consumers: consumers.slice(0, MAX_PER_COLUMN)
    };
  }

  function ownColumn(mvc, slug) {
    var out = [];
    if (!mvc || !mvc.topics || !mvc.topics[slug]) return out;
    var concepts = mvc.topics[slug].concepts || [];
    for (var i = 0; i < concepts.length && out.length < MAX_PER_COLUMN; i++) {
      var c = concepts[i];
      if (!c || !c.id) continue;
      out.push({
        id: c.id,
        title: c.title || c.id,
        topic: slug,
        anchor: c.anchor || ''
      });
    }
    return out;
  }

  function ensureStyle() {
    if (document.getElementById('mv-lineage-style')) return;
    var st = document.createElement('style');
    st.id = 'mv-lineage-style';
    st.textContent = [
      '.lineage-strip{position:relative;margin:0.8rem 0 1.2rem;padding:0.7rem 0.85rem;',
      '  background:var(--panel);border:1px solid var(--line);',
      '  border-radius:8px;display:grid;',
      '  grid-template-columns:1fr auto 1fr auto 1fr;gap:0.6rem 0.9rem;',
      '  align-items:start;font-size:0.86rem;line-height:1.35}',
      '.lineage-strip[hidden]{display:none}',
      '.lineage-strip .lineage-close{position:absolute;top:4px;right:6px;',
      '  background:transparent;border:0;color:var(--mute);cursor:pointer;',
      '  font-size:1rem;line-height:1;padding:4px 6px;border-radius:4px;',
      '  transition:color 120ms ease, background 120ms ease}',
      '.lineage-strip .lineage-close:hover{color:var(--ink);background:var(--panel2)}',
      '.lineage-show{margin:0.4rem 0 1rem;font-size:0.78rem;color:var(--mute);',
      '  background:transparent;border:0;padding:0;cursor:pointer;',
      '  text-decoration:underline dotted;text-underline-offset:3px}',
      '.lineage-show:hover{color:var(--ink)}',
      '.lineage-strip .col{min-width:0}',
      '.lineage-strip .col-head{color:var(--mute);font-size:0.78rem;',
      '  text-transform:uppercase;letter-spacing:0.06em;',
      '  margin:0 0 0.4rem;border-bottom:1px solid var(--line);',
      '  padding-bottom:0.25rem}',
      '.lineage-strip .pills{display:flex;flex-wrap:wrap;gap:0.3rem}',
      '.lineage-strip .pill{display:inline-block;background:var(--panel2);',
      '  border:1px solid var(--line);border-radius:999px;',
      '  padding:2px 10px;font-size:0.82rem;color:var(--ink);',
      '  text-decoration:none;max-width:100%;white-space:nowrap;',
      '  overflow:hidden;text-overflow:ellipsis}',
      '.lineage-strip a.pill:hover{color:var(--yellow);',
      '  border-color:var(--yellow)}',
      '.lineage-strip .pill.center{color:var(--yellow);',
      '  border-color:var(--yellow);background:transparent}',
      '.lineage-strip .arrow{color:var(--mute);font-size:1.1rem;',
      '  align-self:center;user-select:none}',
      '@media (max-width:720px){',
      '  .lineage-strip{grid-template-columns:1fr;gap:0.5rem}',
      '  .lineage-strip .arrow{display:none}',
      '}'
    ].join('');
    document.head.appendChild(st);
  }

  function renderColumn(heading, items, opts) {
    opts = opts || {};
    var col = document.createElement('div');
    col.className = 'col';
    var h = document.createElement('div');
    h.className = 'col-head';
    h.textContent = heading;
    col.appendChild(h);
    var pills = document.createElement('div');
    pills.className = 'pills';
    for (var i = 0; i < items.length; i++) {
      var c = items[i];
      var href = './' + c.topic + '.html' + (c.anchor ? '#' + c.anchor : '');
      var pill;
      if (opts.inert) {
        pill = document.createElement('span');
        pill.className = 'pill center';
      } else {
        pill = document.createElement('a');
        pill.className = 'pill';
        pill.href = href;
      }
      pill.title = c.title + ' (' + c.topic + ')';
      pill.textContent = c.title;
      pills.appendChild(pill);
    }
    col.appendChild(pills);
    return col;
  }

  function arrowCell() {
    var a = document.createElement('div');
    a.className = 'arrow';
    a.setAttribute('aria-hidden', 'true');
    a.textContent = '→';
    return a;
  }

  var HIDE_KEY = 'mvnb.lineage.hidden';

  function isHidden() {
    try { return window.localStorage && localStorage.getItem(HIDE_KEY) === '1'; }
    catch (_) { return false; }
  }
  function setHidden(v) {
    try {
      if (!window.localStorage) return;
      if (v) localStorage.setItem(HIDE_KEY, '1');
      else localStorage.removeItem(HIDE_KEY);
    } catch (_) {}
  }

  function renderShowLink(mount) {
    ensureStyle();
    while (mount.firstChild) mount.removeChild(mount.firstChild);
    mount.className = '';
    mount.hidden = false;
    mount.removeAttribute('style');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lineage-show';
    btn.textContent = 'show concept lineage';
    btn.addEventListener('click', function () {
      setHidden(false);
      render();
    });
    mount.appendChild(btn);
  }

  // The mount markup (inside `<nav class="toc">`, from inject-breadcrumb)
  // predates this widget. Leaving it inside a `position: sticky` nav means
  // when the strip expands it just thickens the sticky bar and overlaps the
  // content below (main has a fixed 4rem top-padding assuming a thin nav).
  // Relocate the mount out of the sticky nav into normal document flow,
  // right before <main>, so the strip pushes content down instead of
  // covering it.
  function relocateMount(mount) {
    if (!mount || mount.dataset.mvLineageRelocated === '1') return;
    var main = document.querySelector('main');
    var nav = mount.closest('nav.toc') || mount.closest('nav');
    if (!main || !nav) return;
    // Only move if the mount is currently inside the sticky nav.
    if (!nav.contains(mount)) return;
    nav.removeChild(mount);
    // Insert just before <main>, giving it a natural block slot that scrolls
    // with the document rather than overlapping from the sticky nav.
    main.parentNode.insertBefore(mount, main);
    mount.dataset.mvLineageRelocated = '1';
  }

  function render() {
    var mount = document.getElementById('mv-lineage-mount');
    if (!mount) return;
    relocateMount(mount);
    var mvc = window.__MVConcepts;
    if (!mvc || !mvc.topics) {
      mount.hidden = true;
      return;
    }
    var slug = currentSlug();
    if (!slug || !mvc.topics[slug]) {
      mount.hidden = true;
      return;
    }
    var index = buildIndex(mvc);
    var ownIds = ownConceptIds(mvc, slug);
    var lineage = computeLineage(index, slug, ownIds);
    var own = ownColumn(mvc, slug);

    // If there's nothing on either side, don't bother showing the strip.
    if (lineage.prereqs.length === 0 && lineage.consumers.length === 0) {
      mount.hidden = true;
      return;
    }

    if (isHidden()) {
      renderShowLink(mount);
      return;
    }

    ensureStyle();
    mount.className = 'lineage-strip';
    mount.hidden = false;
    // Clear any previous render.
    while (mount.firstChild) mount.removeChild(mount.firstChild);

    mount.appendChild(renderColumn('Prereqs', lineage.prereqs));
    mount.appendChild(arrowCell());
    mount.appendChild(renderColumn('This topic', own, { inert: true }));
    mount.appendChild(arrowCell());
    mount.appendChild(renderColumn('Consumers', lineage.consumers));

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'lineage-close';
    close.setAttribute('aria-label', 'hide concept lineage');
    close.title = 'hide (restore from the link that appears in its place)';
    close.textContent = '×';
    close.addEventListener('click', function () {
      setHidden(true);
      renderShowLink(mount);
    });
    mount.appendChild(close);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
