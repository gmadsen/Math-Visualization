// Inline executable JS code cell widget.
//
// Renders a learner-editable <textarea> with a Run button. Clicking Run
// evaluates the body inside `new Function(body)()` and shows the returned
// value (or console.log output, or thrown error) below.
//
// API:
//   MVCodeCell.init('#widget-id', {
//     initialCode: 'function legendre(a,p){ /* ... */ }\n\nreturn legendre(5,23);',
//     title:       'Legendre symbol',
//     hint:        'Edit and click Run. Returns 1 or -1.',
//     maxLines:    15,       // textarea rows; default 12
//     timeoutMs:   500       // coarse deadline via tight poll-loop; default 500
//   });
//
// Security posture (best-effort, not a sandbox):
//   - Pure computation only: the cell is executed in non-strict mode via
//     `new Function(body)()` from this file's closure, so it has ambient access
//     to `window` and friends like any inline <script> would. This is a
//     learner affordance, not an untrusted-code sandbox — the whole page is
//     static same-origin content.
//   - Async is blocked by lexical rejection: if the source contains `await`,
//     `async`, `setTimeout`, `setInterval`, `fetch`, `import`, `Worker`,
//     `requestAnimationFrame`, or `XMLHttpRequest`, Run refuses with an
//     explanatory error. This keeps the textarea aimed at synchronous math.
//   - A wall-clock deadline (default 500ms) is enforced by patching a cheap
//     counter onto the source: every `for`/`while` gets a deadline check
//     injected so tight infinite loops abort instead of hanging the page.
//     A SyntaxError'd patch falls back to the raw source with a single
//     deadline reference, which catches only the slow-loop case.
//   - `console.log` is captured into the readout. The user's original
//     `window.console` is restored on exit (even on throw).
//
// Palette tokens only. Minimal chrome: textarea, Run, Reset, Output.
(function (global) {
  'use strict';

  // Block common async / I/O words as a bare token. Allows tokens like
  // `myAwait` or an identifier ending in "import".
  var BLOCKED = [
    'await', 'async', 'setTimeout', 'setInterval', 'fetch',
    'import', 'Worker', 'requestAnimationFrame', 'XMLHttpRequest'
  ];
  var BLOCK_RE = new RegExp('\\b(' + BLOCKED.join('|') + ')\\b');

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Inject a deadline-check at the head of every for/while body so that
  // infinite loops terminate. We also seed a single top-level deadline
  // declaration so the check is always in scope.
  function instrumentLoops(src, deadlineVar) {
    var patched = 'var ' + deadlineVar + '_tick=0;\n' + src;
    // Replace `for(...){` and `while(...){` with a bail-out guard.
    // Intentionally cheap: we don't parse — we just count iterations per loop.
    var check = 'if((++' + deadlineVar + '_tick & 1023) === 0 && Date.now() > '
              + deadlineVar + '){ throw new Error("code cell timeout"); } ';
    patched = patched.replace(
      /\b(for|while)\s*\(([^{]*?)\)\s*\{/g,
      function (m, kw, args) { return kw + '(' + args + '){ ' + check; }
    );
    return patched;
  }

  function runCode(source, opts) {
    var timeoutMs = (opts && opts.timeoutMs) || 500;
    var out = { log: [], value: undefined, error: null, elapsedMs: 0 };
    // Lexical denylist.
    var bad = source.match(BLOCK_RE);
    if (bad) {
      out.error = 'Disallowed token: "' + bad[1]
                + '" — code cells run synchronous JS only.';
      return out;
    }
    // Capture console.log into our buffer.
    var originalLog = global.console.log;
    var originalWarn = global.console.warn;
    var originalError = global.console.error;
    function stringify(x) {
      if (x === undefined) return 'undefined';
      if (x === null) return 'null';
      if (typeof x === 'string') return x;
      try { return JSON.stringify(x); } catch (_) { return String(x); }
    }
    function capture(prefix) {
      return function () {
        var parts = [];
        for (var i = 0; i < arguments.length; i++) parts.push(stringify(arguments[i]));
        out.log.push((prefix ? prefix + ' ' : '') + parts.join(' '));
      };
    }
    global.console.log = capture('');
    global.console.warn = capture('[warn]');
    global.console.error = capture('[error]');

    var deadline = '__mv_deadline_' + Math.random().toString(36).slice(2, 8);
    var start = Date.now();
    var instrumented;
    try {
      instrumented = instrumentLoops(source, deadline);
    } catch (_) {
      instrumented = 'var ' + deadline + '_tick=0;\n' + source;
    }
    // Guard with a top-level deadline variable and wrap the body so that
    // `return` at the top level is legal.
    var wrapped =
      'var ' + deadline + ' = Date.now() + ' + timeoutMs + ';\n' +
      '(function(){\n' + instrumented + '\n})();';
    // The user's code itself uses plain `return <value>`; we capture that via
    // an outer IIFE that returns whatever the inner returned.
    var userReturn =
      'var ' + deadline + ' = Date.now() + ' + timeoutMs + ';\n' +
      'return (function(){\n' + instrumented + '\n}).call(this);';

    try {
      // `new Function(body)()` executes body as a function body, so top-level
      // `return <value>` works exactly as promised in the API.
      var fn = new Function(userReturn);
      out.value = fn();
    } catch (e) {
      out.error = (e && e.message) ? e.message : String(e);
    } finally {
      global.console.log = originalLog;
      global.console.warn = originalWarn;
      global.console.error = originalError;
      out.elapsedMs = Date.now() - start;
    }
    return out;
  }

  function render(el, opts) {
    opts = opts || {};
    var initial = opts.initialCode || '';
    var title = opts.title || 'Code cell';
    var hint = opts.hint || 'Edit the code and click Run.';
    var rows = Math.max(3, opts.maxLines || 12);
    var timeoutMs = opts.timeoutMs || 500;

    el.classList.add('widget');
    el.innerHTML =
      '<div class="hd">' +
        '<div class="ttl">' + escapeHtml(title) + '</div>' +
        '<div class="hint">' + escapeHtml(hint) + '</div>' +
      '</div>' +
      '<textarea class="mv-code-cell-ta" spellcheck="false" rows="' + rows + '" ' +
        'style="width:100%;background:#0b0f16;color:var(--ink);' +
        'border:1px solid var(--line);border-radius:6px;' +
        'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;' +
        'font-size:.92rem;padding:.55rem .7rem;line-height:1.45;resize:vertical;' +
        'tab-size:2"></textarea>' +
      '<div class="row" style="margin-top:.5rem">' +
        '<button class="mv-code-cell-run">Run</button>' +
        '<button class="mv-code-cell-reset">Reset</button>' +
        '<span class="small mv-code-cell-status" style="color:var(--mute);font-size:.85rem"></span>' +
      '</div>' +
      '<div class="readout mv-code-cell-out" style="margin-top:.5rem"></div>';

    var ta = el.querySelector('.mv-code-cell-ta');
    var runBtn = el.querySelector('.mv-code-cell-run');
    var resetBtn = el.querySelector('.mv-code-cell-reset');
    var statusEl = el.querySelector('.mv-code-cell-status');
    var outEl = el.querySelector('.mv-code-cell-out');
    ta.value = initial;

    function formatValue(v) {
      if (v === undefined) return '';
      if (typeof v === 'string') return v;
      try { return JSON.stringify(v, null, 2); } catch (_) { return String(v); }
    }

    function doRun() {
      var res = runCode(ta.value, { timeoutMs: timeoutMs });
      var parts = [];
      if (res.log.length) parts.push(res.log.join('\n'));
      if (res.value !== undefined) {
        parts.push((parts.length ? '\n' : '') + '// → ' + formatValue(res.value));
      }
      if (res.error) {
        parts.push((parts.length ? '\n' : '') + 'error: ' + res.error);
        outEl.style.borderLeft = '3px solid var(--pink)';
      } else {
        outEl.style.borderLeft = '';
      }
      outEl.textContent = parts.join('') || '(no output)';
      statusEl.textContent = res.elapsedMs + ' ms';
    }

    function doReset() {
      ta.value = initial;
      outEl.textContent = '';
      outEl.style.borderLeft = '';
      statusEl.textContent = '';
    }

    runBtn.addEventListener('click', doRun);
    resetBtn.addEventListener('click', doReset);
    ta.addEventListener('keydown', function (e) {
      // Ctrl/Cmd-Enter runs the cell.
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        doRun();
      }
    });
  }

  var MVCodeCell = {
    init: function (selector, opts) {
      var el = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;
      if (!el) return null;
      render(el, opts || {});
      return el;
    },
    // Exposed for tests.
    _runCode: runCode
  };

  global.MVCodeCell = MVCodeCell;
})(typeof window !== 'undefined' ? window : this);
