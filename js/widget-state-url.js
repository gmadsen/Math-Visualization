/* widget-state-url.js — generic URL-hash-based widget-state encoder.
 *
 * Public API (attached to window.MVStateURL):
 *
 *   MVStateURL.register(widgetId, spec)
 *     spec = {
 *       inputs:    [selector, ...],   // <input>, <select>, <textarea> elements (query strings)
 *       onRestore: function(state){}  // called on page load if the hash encodes state for this widget
 *     }
 *
 *   MVStateURL.registerObject(widgetId, { get, set })
 *     For non-input state (e.g. 3D yaw/pitch). Call MVStateURL.flush(widgetId)
 *     whenever state changes and the encoder will push a new hash (debounced).
 *
 *   MVStateURL.flush(widgetId)
 *     Schedule a debounced hash update for a widget whose state changed
 *     outside the input-event flow.
 *
 *   MVStateURL.currentURL()
 *     location.href — handy for copy-link buttons.
 *
 *   MVStateURL.addShareButton(widgetElement, {label}) — (optional helper)
 *     Inserts a small "link" button into the widget's .hd header that copies
 *     the current location.href to the clipboard. Silently no-ops if .hd
 *     is missing.
 *
 * URL format:
 *   #w-<widgetId>=<key1>,<val1>|<key2>,<val2>
 *   multiple widgets joined by "&"        →  #w-foo=a,1|b,2&w-bar=c,3
 *   values equal to the input's defaultValue are skipped (clean URL at defaults).
 *   keys are the selector strings verbatim; values are URI-encoded.
 */
(function(){
  'use strict';
  if (typeof window === 'undefined') return;

  var DEBOUNCE_MS = 200;
  var registry = Object.create(null);       // widgetId -> { kind, ... }
  var flushTimers = Object.create(null);    // widgetId -> timer handle
  var restored = false;

  function encodeState(pairs){
    // pairs: array of [key, value]
    return pairs.map(function(p){
      return encodeURIComponent(p[0]) + ',' + encodeURIComponent(p[1]);
    }).join('|');
  }

  function decodeState(encoded){
    // returns a map { key -> value }; tolerant of empty/malformed input
    var out = Object.create(null);
    if (!encoded) return out;
    encoded.split('|').forEach(function(chunk){
      if (!chunk) return;
      var i = chunk.indexOf(',');
      if (i < 0) return;
      var k = chunk.slice(0, i);
      var v = chunk.slice(i + 1);
      try { k = decodeURIComponent(k); } catch(_){}
      try { v = decodeURIComponent(v); } catch(_){}
      out[k] = v;
    });
    return out;
  }

  function readHashMap(){
    // returns { widgetId -> encodedChunk }
    var h = (typeof location !== 'undefined' && location.hash) ? location.hash.replace(/^#/, '') : '';
    var map = Object.create(null);
    if (!h) return map;
    h.split('&').forEach(function(seg){
      if (!seg) return;
      var m = /^w-([^=]+)=(.*)$/.exec(seg);
      if (!m) return;
      try { map[decodeURIComponent(m[1])] = m[2]; } catch(_){ map[m[1]] = m[2]; }
    });
    return map;
  }

  function writeHashMap(map){
    var segs = [];
    Object.keys(map).forEach(function(id){
      var enc = map[id];
      if (enc == null || enc === '') return;  // omit empty (all-defaults) widgets
      segs.push('w-' + encodeURIComponent(id) + '=' + enc);
    });
    var hash = segs.length ? '#' + segs.join('&') : '';
    if (typeof history !== 'undefined' && history.replaceState) {
      var url = location.pathname + location.search + hash;
      try { history.replaceState(history.state, '', url); return; } catch(_){}
    }
    // fallback: mutate location.hash directly
    try { location.hash = hash.replace(/^#/, ''); } catch(_){}
  }

  function getInputValue(el){
    if (!el) return null;
    if (el.type === 'checkbox') return el.checked ? '1' : '0';
    if (el.type === 'radio')    return el.checked ? '1' : '0';
    return (el.value == null) ? '' : String(el.value);
  }

  function setInputValue(el, v){
    if (!el || v == null) return;
    if (el.type === 'checkbox' || el.type === 'radio') {
      el.checked = (v === '1' || v === 'true' || v === 'on');
    } else {
      el.value = v;
    }
    // fire change/input so widget code observers react
    try { el.dispatchEvent(new Event('input',  { bubbles: true })); } catch(_){}
    try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch(_){}
  }

  function inputDefault(el){
    if (!el) return null;
    if (el.type === 'checkbox' || el.type === 'radio') {
      return el.defaultChecked ? '1' : '0';
    }
    // defaultValue reflects the HTML attribute; for <select>, walk options for defaultSelected
    if (el.tagName === 'SELECT') {
      for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].defaultSelected) return el.options[i].value;
      }
      return el.options.length ? el.options[0].value : '';
    }
    return el.defaultValue != null ? String(el.defaultValue) : '';
  }

  function snapshotInputs(entry){
    var pairs = [];
    entry.inputs.forEach(function(sel){
      var el = document.querySelector(sel);
      if (!el) return;
      var cur = getInputValue(el);
      var def = inputDefault(el);
      if (cur === def) return;   // skip defaults → clean URL
      pairs.push([sel, cur]);
    });
    return encodeState(pairs);
  }

  function restoreInputs(entry, stateMap){
    // Write values first, then call onRestore once.
    var touched = Object.create(null);
    entry.inputs.forEach(function(sel){
      if (stateMap[sel] != null) {
        var el = document.querySelector(sel);
        if (el) { setInputValue(el, stateMap[sel]); touched[sel] = stateMap[sel]; }
      }
    });
    if (typeof entry.onRestore === 'function') {
      try { entry.onRestore(touched); } catch(err){ /* swallow; page must not crash */ }
    }
  }

  function flushWidget(widgetId){
    var entry = registry[widgetId];
    if (!entry) return;
    var map = readHashMap();
    var encoded;
    if (entry.kind === 'inputs') {
      encoded = snapshotInputs(entry);
    } else if (entry.kind === 'object') {
      try {
        var state = entry.get();
        if (state && typeof state === 'object') {
          var pairs = Object.keys(state).map(function(k){ return [k, String(state[k])]; });
          encoded = encodeState(pairs);
        } else {
          encoded = '';
        }
      } catch(_){ encoded = ''; }
    }
    map[widgetId] = encoded || '';
    writeHashMap(map);
  }

  function scheduleFlush(widgetId){
    clearTimeout(flushTimers[widgetId]);
    flushTimers[widgetId] = setTimeout(function(){ flushWidget(widgetId); }, DEBOUNCE_MS);
  }

  function register(widgetId, spec){
    if (!widgetId || !spec) return;
    var entry = {
      kind: 'inputs',
      inputs: (spec.inputs || []).slice(),
      onRestore: spec.onRestore || null
    };
    registry[widgetId] = entry;

    // Wire change/input listeners
    entry.inputs.forEach(function(sel){
      var el = document.querySelector(sel);
      if (!el) return;
      var handler = function(){ scheduleFlush(widgetId); };
      el.addEventListener('input',  handler);
      el.addEventListener('change', handler);
    });

    // Restore from current hash (if present)
    var map = readHashMap();
    if (map[widgetId] != null) {
      restoreInputs(entry, decodeState(map[widgetId]));
    }
    restored = true;
  }

  function registerObject(widgetId, spec){
    if (!widgetId || !spec || typeof spec.get !== 'function') return;
    var entry = {
      kind: 'object',
      get: spec.get,
      set: typeof spec.set === 'function' ? spec.set : null
    };
    registry[widgetId] = entry;

    var map = readHashMap();
    if (map[widgetId] != null && entry.set) {
      var decoded = decodeState(map[widgetId]);
      // coerce numerics where plausible
      var coerced = Object.create(null);
      Object.keys(decoded).forEach(function(k){
        var v = decoded[k];
        var n = Number(v);
        coerced[k] = (isFinite(n) && v !== '' && /^-?\d/.test(v)) ? n : v;
      });
      try { entry.set(coerced); } catch(_){}
    }
    restored = true;
  }

  function addShareButton(widgetEl, opts){
    if (!widgetEl) return null;
    var hd = widgetEl.querySelector('.hd');
    if (!hd) return null;
    // idempotent: don't insert twice
    if (hd.querySelector('.mv-share-btn')) return hd.querySelector('.mv-share-btn');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mv-share-btn';
    btn.textContent = (opts && opts.label) || 'Share link';
    btn.title = 'Copy link to this widget state';
    btn.style.cssText = [
      'margin-left:auto',
      'background:var(--panel2,#1c2230)',
      'color:var(--ink,#e8ecf1)',
      'border:1px solid var(--line,#2a3242)',
      'border-radius:6px',
      'padding:0.15rem 0.55rem',
      'font-size:0.85rem',
      'cursor:pointer'
    ].join(';');
    btn.addEventListener('click', function(){
      var url = (typeof location !== 'undefined') ? location.href : '';
      var done = function(){
        var prev = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function(){ btn.textContent = prev; }, 1200);
      };
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, done);
      } else {
        // fallback: temporary textarea
        try {
          var ta = document.createElement('textarea');
          ta.value = url; document.body.appendChild(ta);
          ta.select(); document.execCommand('copy');
          document.body.removeChild(ta); done();
        } catch(_){}
      }
    });
    // Make .hd a flex container if it isn't already so the button sits at the right.
    try {
      var disp = getComputedStyle ? getComputedStyle(hd).display : '';
      if (disp !== 'flex') hd.style.display = 'flex';
      if (!hd.style.alignItems) hd.style.alignItems = 'center';
      if (!hd.style.gap) hd.style.gap = '0.5rem';
    } catch(_){}
    hd.appendChild(btn);
    return btn;
  }

  window.MVStateURL = {
    register: register,
    registerObject: registerObject,
    flush: scheduleFlush,
    currentURL: function(){ return (typeof location !== 'undefined') ? location.href : ''; },
    addShareButton: addShareButton,
    _debug: { registry: registry, readHashMap: readHashMap, writeHashMap: writeHashMap }
  };
})();
