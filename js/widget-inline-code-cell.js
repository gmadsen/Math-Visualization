// Inline code cell widget. A tiny in-page JS REPL: textarea pre-loaded with
// `config.initialCode`, a Run button, and an output area. Clicking Run sends
// the code to a sandboxed Web Worker (built from a Blob URL) that prepends a
// math prelude, evaluates the user code via `(new Function(code))()`,
// captures `console.log` and the final expression value, and posts the
// result back. A 2-second hard timeout calls `worker.terminate()` if user
// code hangs.
//
// The worker has no DOM access and no parent globals (Workers run in a
// separate scope); we additionally delete `fetch`, `importScripts`, and
// `XMLHttpRequest` from `self` inside the boot script so user code can't
// make network requests.
//
// Usage (called from a topic page):
//
//   MVInlineCodeCell.init('#w-sandbox', {
//     title: 'Number-theory sandbox',
//     hint:  'edit · Run · executes in a Web Worker (2s cap)',
//     initialCode: 'console.log(primes(50));\nfactor(360)',
//     prelude: 'math',     // 'math' (default and only option today)
//     rows: 8,             // textarea rows, 4..24
//     runLabel: 'Run'
//   });
//
// Dependencies: none. Plain DOM. Uses theme tokens (var(--panel2),
// var(--ink), var(--green), var(--pink), var(--yellow), var(--mute)).

(function (global) {
  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === 'class') e.className = attrs[k];
        else if (k === 'style') e.setAttribute('style', attrs[k]);
        else if (k === 'text') e.textContent = attrs[k];
        else e.setAttribute(k, attrs[k]);
      }
    }
    if (children) {
      for (const c of children) {
        if (c == null) continue;
        e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      }
    }
    return e;
  }

  // -------------------------------------------------------------------------
  // Preludes. Each is a JS source string prepended to the user's code inside
  // the worker. Adding a new prelude requires updating both this table and
  // the schema's `prelude` enum.
  // -------------------------------------------------------------------------
  const PRELUDES = {
    math: `
function gcd(a, b){
  a = Math.abs(a|0); b = Math.abs(b|0);
  while (b){ const t = b; b = a % b; a = t; }
  return a;
}
function mod(a, n){
  n = n|0;
  return ((a % n) + n) % n;
}
function isPrime(n){
  n = n|0;
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2){ if (n % i === 0) return false; }
  return true;
}
function factor(n){
  n = Math.abs(n|0);
  const out = [];
  if (n < 2) return out;
  let p = 2;
  while (p * p <= n){
    if (n % p === 0){
      let k = 0;
      while (n % p === 0){ n = (n / p)|0; k++; }
      out.push([p, k]);
    }
    p = p === 2 ? 3 : p + 2;
  }
  if (n > 1) out.push([n, 1]);
  return out;
}
function primes(N){
  N = N|0;
  if (N < 2) return [];
  const sieve = new Uint8Array(N + 1);
  const out = [];
  for (let i = 2; i <= N; i++){
    if (!sieve[i]){
      out.push(i);
      for (let j = i * i; j <= N; j += i) sieve[j] = 1;
    }
  }
  return out;
}
function pow(base, exp, m){
  base = base|0; exp = exp|0;
  if (m === undefined || m === null){
    // unbounded integer power; defer to ** for moderate exponents
    return Math.pow(base, exp);
  }
  m = m|0;
  if (m === 1) return 0;
  let result = 1;
  base = ((base % m) + m) % m;
  while (exp > 0){
    if (exp & 1) result = (result * base) % m;
    exp = exp >>> 1;
    base = (base * base) % m;
  }
  return result;
}
`,
  };

  // -------------------------------------------------------------------------
  // Worker boot script. Receives { code } via postMessage, evaluates it with
  // captured console.log and the value of the final expression (if any),
  // and posts back { type: 'result', logs, value } or
  // { type: 'error', message, stack }.
  //
  // Built as a string (not an inline function) so we can include the prelude
  // verbatim and hand it to a Blob URL.
  // -------------------------------------------------------------------------
  function buildWorkerSource(preludeKey) {
    const prelude = PRELUDES[preludeKey] || PRELUDES.math;
    return `
// --- sandbox: strip network capability ----------------------------------
try { delete self.fetch; } catch(_){}
try { delete self.importScripts; } catch(_){}
try { delete self.XMLHttpRequest; } catch(_){}
try { delete self.WebSocket; } catch(_){}

// --- console capture -----------------------------------------------------
const __logs = [];
function __fmt(v){
  if (typeof v === 'string') return v;
  try { return JSON.stringify(v); } catch(_){ return String(v); }
}
self.console = {
  log:   (...a) => __logs.push({ level:'log',   parts: a.map(__fmt) }),
  info:  (...a) => __logs.push({ level:'info',  parts: a.map(__fmt) }),
  warn:  (...a) => __logs.push({ level:'warn',  parts: a.map(__fmt) }),
  error: (...a) => __logs.push({ level:'error', parts: a.map(__fmt) }),
};

// --- prelude -------------------------------------------------------------
${prelude}

// --- run -----------------------------------------------------------------
self.onmessage = function(ev){
  const code = (ev && ev.data && ev.data.code) || '';
  let value;
  try {
    // Wrap the user code so the final expression's value is returned.
    // Strategy: split on the last semicolon-or-newline-separated statement.
    // Easiest robust path: prefix with "return " on the last non-blank line
    // if it doesn't already start with a control keyword. If that throws a
    // syntax error, fall back to running the original code unwrapped.
    const wrapped = (function(){
      const lines = code.split(/\\r?\\n/);
      // find last non-blank, non-comment-only line
      let idx = -1;
      for (let i = lines.length - 1; i >= 0; i--){
        const trimmed = lines[i].replace(/\\/\\/.*$/, '').trim();
        if (trimmed.length === 0) continue;
        idx = i; break;
      }
      if (idx < 0) return code;
      const last = lines[idx];
      const stripped = last.replace(/\\/\\/.*$/, '').trim();
      // Don't try to add return in front of these starters.
      if (/^(return|throw|var|let|const|function|class|if|for|while|do|switch|try|\\{|\\})/.test(stripped)) {
        return code;
      }
      // Drop a trailing semicolon so 'return X;' parses.
      const noSemi = last.replace(/;\\s*$/, '');
      lines[idx] = 'return (' + noSemi + ')';
      return lines.join('\\n');
    })();
    try {
      value = (new Function(wrapped))();
    } catch (wrapErr) {
      if (wrapErr instanceof SyntaxError){
        // Fall back: run the original code with no expression capture.
        (new Function(code))();
        value = undefined;
      } else {
        throw wrapErr;
      }
    }
  } catch (err) {
    self.postMessage({
      type: 'error',
      message: (err && err.message) || String(err),
      stack:   (err && err.stack) || '',
    });
    return;
  }
  self.postMessage({
    type: 'result',
    logs: __logs,
    value: __fmt(value),
    hasValue: value !== undefined,
  });
};
`;
  }

  // -------------------------------------------------------------------------
  // Output rendering helpers.
  // -------------------------------------------------------------------------
  function renderOutput(outEl, payload) {
    outEl.innerHTML = '';
    if (payload.type === 'error') {
      const e = el('div', {
        style: [
          'color:var(--pink)',
          'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
          'font-size:.85rem',
          'white-space:pre-wrap',
          'line-height:1.45',
        ].join(';'),
      });
      e.textContent = (payload.message || 'error') +
        (payload.stack ? '\n' + payload.stack : '');
      outEl.appendChild(e);
      return;
    }
    if (payload.type === 'timeout') {
      const e = el('div', {
        style: [
          'color:var(--pink)',
          'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
          'font-size:.85rem',
        ].join(';'),
      });
      e.textContent = 'timeout: code ran longer than 2 s and was terminated.';
      outEl.appendChild(e);
      return;
    }
    // result
    for (const entry of payload.logs || []) {
      const color = entry.level === 'error' ? 'var(--pink)'
                  : entry.level === 'warn'  ? 'var(--yellow)'
                  : 'var(--ink)';
      const line = el('div', {
        style: [
          'color:' + color,
          'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
          'font-size:.85rem',
          'white-space:pre-wrap',
          'line-height:1.4',
        ].join(';'),
      });
      line.textContent = entry.parts.join(' ');
      outEl.appendChild(line);
    }
    if (payload.hasValue) {
      const v = el('div', {
        style: [
          'color:var(--green)',
          'font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
          'font-size:.85rem',
          'white-space:pre-wrap',
          'line-height:1.4',
          'margin-top:.25rem',
          'border-top:1px dashed var(--line)',
          'padding-top:.25rem',
        ].join(';'),
      });
      v.textContent = '⇒ ' + payload.value;
      outEl.appendChild(v);
    }
    if (!(payload.logs && payload.logs.length) && !payload.hasValue) {
      const v = el('div', {
        style: 'color:var(--mute);font-style:italic;font-size:.85rem',
      });
      v.textContent = '(no output)';
      outEl.appendChild(v);
    }
  }

  // -------------------------------------------------------------------------
  // init() — public entry point. Mounts the widget into the host element and
  // returns a small handle ({ run, dispose, get code() }) for tests.
  // -------------------------------------------------------------------------
  function init(selector, opts) {
    const root = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!root) return null;

    opts = opts || {};
    const title = opts.title || 'Inline code cell';
    const hint  = opts.hint  || 'edit · Run · sandboxed Web Worker, 2s cap';
    const initialCode = typeof opts.initialCode === 'string'
      ? opts.initialCode : '// type JS here\n';
    const preludeKey = (opts.prelude && PRELUDES[opts.prelude]) ? opts.prelude : 'math';
    const rows = Math.min(24, Math.max(4, opts.rows || 8));
    const runLabel = opts.runLabel || 'Run';

    root.classList.add('widget');
    root.innerHTML = '';

    const hd = el('div', { class: 'hd' }, [
      el('div', { class: 'ttl' }, [title]),
      el('div', { class: 'hint' }, [hint]),
    ]);
    root.appendChild(hd);

    const ta = el('textarea', {
      class: 'icc-editor',
      rows: String(rows),
      spellcheck: 'false',
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      'aria-label': 'JavaScript editor',
      style: [
        'width:100%',
        'box-sizing:border-box',
        'background:var(--panel2)',
        'color:var(--ink)',
        'border:1px solid var(--line)',
        'border-radius:6px',
        'padding:.6rem .7rem',
        'font:.88rem/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace',
        'resize:vertical',
        'tab-size:2',
        '-moz-tab-size:2',
        'white-space:pre',
      ].join(';'),
    });
    ta.value = initialCode;
    root.appendChild(ta);

    const runBtn = el('button', {
      type: 'button',
      class: 'icc-run',
      'aria-label': runLabel,
      style: [
        'background:var(--yellow)',
        'color:#111',
        'border:none',
        'border-radius:6px',
        'padding:.4rem 1rem',
        'font:inherit',
        'font-weight:600',
        'cursor:pointer',
        'min-width:5rem',
      ].join(';'),
    }, [runLabel]);
    const status = el('span', {
      class: 'icc-status small',
      style: 'color:var(--mute);font-family:ui-monospace,monospace;font-size:.82rem',
    });
    const controls = el('div', {
      class: 'row',
      style: 'display:flex;gap:.6rem;align-items:center;margin:.5rem 0 .55rem',
    }, [runBtn, status]);
    root.appendChild(controls);

    const outLabel = el('div', {
      style: 'color:var(--mute);font-size:.78rem;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.25rem',
    }, ['output']);
    const out = el('div', {
      class: 'icc-output readout',
      style: [
        'background:var(--panel2)',
        'border:1px solid var(--line)',
        'border-radius:6px',
        'padding:.55rem .7rem',
        'min-height:3.2em',
        'max-height:18em',
        'overflow:auto',
      ].join(';'),
    });
    const initMsg = el('div', {
      style: 'color:var(--mute);font-style:italic;font-size:.85rem',
    });
    initMsg.textContent = 'press Run to execute';
    out.appendChild(initMsg);
    root.appendChild(outLabel);
    root.appendChild(out);

    // Worker source + Blob URL are built once per init. Each Run spawns a
    // fresh Worker from this URL so a previous run's state can't leak.
    const workerSrc = buildWorkerSource(preludeKey);
    let blobUrl = null;
    try {
      blobUrl = URL.createObjectURL(new Blob([workerSrc], { type: 'application/javascript' }));
    } catch (_) {
      // Blob/URL unavailable (very old browsers). Fall back: render an
      // explanatory error and disable the Run button.
      runBtn.disabled = true;
      runBtn.style.opacity = '0.5';
      runBtn.style.cursor = 'not-allowed';
      renderOutput(out, {
        type: 'error',
        message: 'Web Worker unavailable in this browser; sandbox can\'t start.',
        stack: '',
      });
    }

    let activeWorker = null;
    let activeTimer = null;

    function killActive() {
      if (activeTimer) { clearTimeout(activeTimer); activeTimer = null; }
      if (activeWorker) {
        try { activeWorker.terminate(); } catch (_) { /* swallow */ }
        activeWorker = null;
      }
    }

    function run() {
      if (!blobUrl) return;
      killActive();
      status.textContent = 'running…';
      status.style.color = 'var(--mute)';
      const code = ta.value;
      let w;
      try {
        w = new Worker(blobUrl);
      } catch (err) {
        renderOutput(out, {
          type: 'error',
          message: 'failed to spawn Worker: ' + ((err && err.message) || err),
          stack: '',
        });
        status.textContent = 'error';
        status.style.color = 'var(--pink)';
        return;
      }
      activeWorker = w;
      const started = Date.now();
      w.onmessage = (ev) => {
        if (w !== activeWorker) return; // stale
        killActive();
        const ms = Date.now() - started;
        renderOutput(out, ev.data);
        if (ev.data && ev.data.type === 'error') {
          status.textContent = 'error · ' + ms + 'ms';
          status.style.color = 'var(--pink)';
        } else {
          status.textContent = 'ok · ' + ms + 'ms';
          status.style.color = 'var(--green)';
        }
      };
      w.onerror = (ev) => {
        if (w !== activeWorker) return;
        killActive();
        renderOutput(out, {
          type: 'error',
          message: (ev && ev.message) || 'worker error',
          stack: '',
        });
        status.textContent = 'error';
        status.style.color = 'var(--pink)';
        // suppress default browser logging where possible
        if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
      };
      activeTimer = setTimeout(() => {
        if (w !== activeWorker) return;
        killActive();
        renderOutput(out, { type: 'timeout' });
        status.textContent = 'timeout';
        status.style.color = 'var(--pink)';
      }, 2000);
      try {
        w.postMessage({ code });
      } catch (err) {
        killActive();
        renderOutput(out, {
          type: 'error',
          message: 'failed to send code to worker: ' + ((err && err.message) || err),
          stack: '',
        });
        status.textContent = 'error';
        status.style.color = 'var(--pink)';
      }
    }

    runBtn.addEventListener('click', run);
    // Cmd/Ctrl-Enter from inside the textarea also runs.
    ta.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        run();
      }
    });

    function dispose() {
      killActive();
      if (blobUrl) {
        try { URL.revokeObjectURL(blobUrl); } catch (_) { /* swallow */ }
        blobUrl = null;
      }
    }

    return {
      run,
      dispose,
      get code() { return ta.value; },
      set code(v) { ta.value = v; },
    };
  }

  global.MVInlineCodeCell = { init };
})(typeof window !== 'undefined' ? window : globalThis);
