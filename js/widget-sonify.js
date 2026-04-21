// Parameter-driven sonification widget. Maps a slider to a sine tone whose
// pitch and gain are user-supplied functions of the parameter.
//
// API:
//   MVSonify.init('#widget-id', {
//     title:        'Frequency of a theta series partial',
//     hint:         'Adjust q; pitch tracks the coefficient magnitude.',
//     paramRange:   [0, 1],        // [min, max]
//     step:         0.01,
//     initial:      0.5,           // optional; defaults to mid-range
//     computePitch: (q) => 220 + 200 * q,                 // Hz
//     computeGain:  (q) => Math.min(0.5, q),              // 0..1
//     display:      (q) => `q = ${q.toFixed(2)}`          // readout string
//   });
//
// Web Audio is feature-detected. If absent, the widget renders with a
// disabled Play button and an explanatory message.
//
// Auto-stop semantics:
//   - tab/page hidden (visibilitychange)
//   - widget scrolled out of view (IntersectionObserver)
//   - window blur (auto-stop so background tabs don't keep buzzing)
//   - beforeunload
//
// Palette tokens only.
(function (global) {
  'use strict';

  var AudioCtx = global.AudioContext || global.webkitAudioContext || null;
  var HAS_WEB_AUDIO = !!AudioCtx;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function clampGain(g) {
    if (!Number.isFinite(g)) return 0;
    return Math.max(0, Math.min(0.6, g));
  }

  function render(el, opts) {
    opts = opts || {};
    var title = opts.title || 'Sonification';
    var hint = opts.hint || 'Adjust the parameter and press Play.';
    var range = opts.paramRange || [0, 1];
    var step = opts.step || 0.01;
    var initial = (typeof opts.initial === 'number') ? opts.initial : (range[0] + range[1]) / 2;
    var pitchFn = opts.computePitch || function (q) { return 220 + 200 * q; };
    var gainFn = opts.computeGain || function () { return 0.2; };
    var dispFn = opts.display || function (q) { return String(q); };

    el.classList.add('widget');
    el.innerHTML =
      '<div class="hd">' +
        '<div class="ttl">' + escapeHtml(title) + '</div>' +
        '<div class="hint">' + escapeHtml(hint) + '</div>' +
      '</div>' +
      '<div class="row">' +
        '<button class="mv-sonify-play">Play</button>' +
        '<input type="range" class="mv-sonify-slider" ' +
               'min="' + range[0] + '" max="' + range[1] + '" ' +
               'step="' + step + '" value="' + initial + '">' +
      '</div>' +
      '<div class="readout mv-sonify-out" ' +
        'style="margin-top:.4rem"></div>' +
      '<div class="small mv-sonify-msg" ' +
        'style="color:var(--mute);font-size:.82rem;margin-top:.35rem"></div>';

    var playBtn = el.querySelector('.mv-sonify-play');
    var slider = el.querySelector('.mv-sonify-slider');
    var outEl = el.querySelector('.mv-sonify-out');
    var msgEl = el.querySelector('.mv-sonify-msg');

    function updateReadout() {
      var q = parseFloat(slider.value);
      var f = 0, g = 0;
      try { f = pitchFn(q); } catch (_) {}
      try { g = gainFn(q); } catch (_) {}
      outEl.textContent = dispFn(q) + '    pitch ≈ ' + (Number.isFinite(f) ? f.toFixed(1) : '–')
        + ' Hz    gain ≈ ' + (Number.isFinite(g) ? clampGain(g).toFixed(2) : '–');
    }
    updateReadout();
    slider.addEventListener('input', function () {
      updateReadout();
      if (state.playing) applyParams();
    });

    if (!HAS_WEB_AUDIO) {
      playBtn.disabled = true;
      playBtn.title = 'Web Audio API not available in this browser';
      msgEl.textContent = 'Web Audio API unavailable — audio is disabled. Readout still tracks the parameter.';
      return;
    }

    // Audio state. Lazily create AudioContext on first Play because most
    // browsers require a user gesture.
    var state = {
      ctx: null,
      osc: null,
      gainNode: null,
      playing: false
    };

    function applyParams() {
      if (!state.playing) return;
      var q = parseFloat(slider.value);
      var f = 220, g = 0;
      try { f = pitchFn(q); } catch (_) {}
      try { g = gainFn(q); } catch (_) {}
      if (!Number.isFinite(f) || f <= 0) f = 20;
      state.osc.frequency.setTargetAtTime(f, state.ctx.currentTime, 0.02);
      state.gainNode.gain.setTargetAtTime(clampGain(g), state.ctx.currentTime, 0.02);
    }

    function start() {
      if (state.playing) return;
      try {
        if (!state.ctx) state.ctx = new AudioCtx();
        if (state.ctx.state === 'suspended') state.ctx.resume();
        state.osc = state.ctx.createOscillator();
        state.osc.type = 'sine';
        state.gainNode = state.ctx.createGain();
        state.gainNode.gain.value = 0;
        state.osc.connect(state.gainNode).connect(state.ctx.destination);
        state.osc.start();
        state.playing = true;
        playBtn.textContent = 'Stop';
        playBtn.classList.add('active');
        applyParams();
      } catch (e) {
        msgEl.textContent = 'Audio startup failed: ' + (e && e.message ? e.message : e);
      }
    }

    function stop() {
      if (!state.playing) return;
      try {
        // Quick ramp to zero to avoid a click.
        state.gainNode.gain.setTargetAtTime(0, state.ctx.currentTime, 0.01);
        var osc = state.osc;
        setTimeout(function () { try { osc.stop(); osc.disconnect(); } catch (_) {} }, 80);
      } catch (_) {}
      state.osc = null;
      state.gainNode = null;
      state.playing = false;
      playBtn.textContent = 'Play';
      playBtn.classList.remove('active');
    }

    playBtn.addEventListener('click', function () {
      state.playing ? stop() : start();
    });

    // Auto-stop wiring. Keep references so we can cleanly detach on removal,
    // though a notebook page typically lives as long as the tab.
    function onHide() { if (document.hidden) stop(); }
    function onBlur() { stop(); }
    function onBeforeUnload() { stop(); }
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('blur', onBlur);
    window.addEventListener('beforeunload', onBeforeUnload);

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) stop();
        });
      }, { threshold: 0 });
      io.observe(el);
    }
  }

  var MVSonify = {
    init: function (selector, opts) {
      var el = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;
      if (!el) return null;
      render(el, opts || {});
      return el;
    },
    hasWebAudio: function () { return HAS_WEB_AUDIO; }
  };

  global.MVSonify = MVSonify;
})(typeof window !== 'undefined' ? window : this);
