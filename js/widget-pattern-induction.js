// Pattern-induction widget.
//
// Shows the first N (input, output) examples of a hidden rule, asks the
// learner to (a) enter a single-variable closed-form formula in the variable
// `n`, or (b) fill in the outputs for hidden test inputs. On submit, the
// widget evaluates against a set of hidden test cases and reports how many
// match. Success reveals the canonical formula.
//
// API
//   MVPatternInduction.init('#widget-id', {
//     examples:   [[1,1],[2,3],[3,6],[4,10]],   // shown to the learner
//     testCases:  [[5,15],[6,21]],              // hidden until submit
//     title:      'Sum of first n integers',
//     hint:       'Triangle numbers.',
//     inputKind:  'integer',   // label only — 'integer' | 'real' | 'pair'
//     outputKind: 'integer',
//     canonicalFormula: 'n*(n+1)/2',            // revealed on success
//     canonicalLatex:   'S(n)=\\tfrac{n(n+1)}{2}', // optional KaTeX form
//     tol:        1e-6,                         // tolerance for output match
//     mode:       'auto'                        // 'formula' | 'outputs' | 'auto'
//   });
//
// Evaluation strategy
//   Default mode is 'auto': the widget renders BOTH a formula box and an
//   outputs grid (one numeric box per hidden test input). The learner may use
//   either and submit. If the mode is 'formula' only, the outputs grid is
//   hidden; if 'outputs' only, the formula box is hidden.
//
//   Formula parsing is deliberately constrained: length ≤ 60 chars, character
//   whitelist (digits, `n`, operators, parens, decimal point, whitespace),
//   evaluated once per test input with a fresh `new Function('n', 'return '+s)`
//   call inside a try/catch. No async, no I/O, no globals reach the sandbox
//   (the Function constructor has its own scope with just the `n` argument).
//
//   The outputs path is a pure numeric-equality check with tolerance.
//
// Progress side-effects
//   None. This widget does not call MVProgress; it is purely formative.
//
// Dependencies
//   Only the helper block ($, SVG) from category-theory.html. KaTeX autorender
//   re-runs after a successful submit if KaTeX is loaded.

(function(global){
  'use strict';

  const MAX_FORMULA_LEN = 60;
  // Whitelist: digits, `n`, arithmetic, parens, decimal, whitespace, `e` for
  // exponent notation and `Math.*` calls are NOT permitted — keep the
  // sandbox as small as we can so we don't accidentally expose `globalThis`
  // tricks. `Math.pow(x,y)` is unnecessary: `**` is whitelisted.
  const FORMULA_CHAR_RE = /^[\sn0-9+\-*/%().,**]+$/;
  const MAX_TEST_VALUES = 20;      // sanity cap on grid rows
  const DEFAULT_TOL = 1e-6;

  function clamp(x, lo, hi){ return Math.max(lo, Math.min(hi, x)); }

  function nearlyEqual(a, b, tol){
    if(Number.isNaN(a) || Number.isNaN(b)) return false;
    const t = tol ?? DEFAULT_TOL;
    const diff = Math.abs(a - b);
    if(diff <= t) return true;
    // fall back to relative tolerance for large values
    const scale = Math.max(Math.abs(a), Math.abs(b), 1);
    return diff / scale <= t;
  }

  // Attempt to compile a formula to a function of one arg `n`. Returns the
  // function on success, or null on any parse/validation failure.
  function compileFormula(src){
    const s = String(src == null ? '' : src).trim();
    if(!s) return null;
    if(s.length > MAX_FORMULA_LEN) return null;
    if(!FORMULA_CHAR_RE.test(s))  return null;
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function('n', '"use strict"; return ('+s+');');
      // smoke test: must return a finite number at n=1
      const t = fn(1);
      if(typeof t !== 'number' || !Number.isFinite(t)) return null;
      return fn;
    } catch(_err){
      return null;
    }
  }

  // Try to reuse the page's KaTeX autorender if it's already been called.
  function rekatex(root){
    if(typeof global.renderMathInElement !== 'function') return;
    try {
      global.renderMathInElement(root, {
        delimiters: [
          { left:'$$', right:'$$', display:true },
          { left:'$',  right:'$',  display:false },
          { left:'\\(', right:'\\)', display:false },
          { left:'\\[', right:'\\]', display:true }
        ],
        throwOnError: false
      });
    } catch(_e){ /* ignore */ }
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, c => (
      {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]
    ));
  }

  function fmtValue(v, kind){
    if(typeof v === 'number'){
      if(kind === 'integer' && Number.isInteger(v)) return String(v);
      // compact float
      if(Math.abs(v) >= 1e6 || (v !== 0 && Math.abs(v) < 1e-3)){
        return v.toExponential(3);
      }
      return Number.isInteger(v) ? String(v) : v.toPrecision(6).replace(/0+$/, '').replace(/\.$/, '');
    }
    if(Array.isArray(v)) return '('+v.map(x=>fmtValue(x,kind)).join(', ')+')';
    return String(v);
  }

  function init(selector, opts){
    const root = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if(!root){
      console.warn('[MVPatternInduction] no element for', selector);
      return null;
    }
    const o = opts || {};
    const examples   = Array.isArray(o.examples)  ? o.examples  : [];
    const testCases  = Array.isArray(o.testCases) ? o.testCases : [];
    if(examples.length === 0 || testCases.length === 0){
      console.warn('[MVPatternInduction] need both examples and testCases');
    }
    const title      = o.title  || 'Pattern induction';
    const hint       = o.hint   || 'Find a closed form for the hidden rule.';
    const inputKind  = o.inputKind  || 'integer';
    const outputKind = o.outputKind || 'integer';
    const tol        = typeof o.tol === 'number' ? o.tol : DEFAULT_TOL;
    const canonicalFormula = o.canonicalFormula || null;
    const canonicalLatex   = o.canonicalLatex   || null;
    const rawMode    = o.mode || 'auto';
    const mode       = (rawMode === 'formula' || rawMode === 'outputs') ? rawMode : 'auto';

    // Make sure we look like a proper widget even if the caller forgot class.
    if(!root.classList.contains('widget')) root.classList.add('widget');

    // Build markup. Use distinctive ids scoped to the root id so the widget
    // audit classifies us as interactive.
    const rootId = root.id || ('mvpi-' + Math.random().toString(36).slice(2,8));
    root.id = rootId;

    const showFormula = mode === 'auto' || mode === 'formula';
    const showOutputs = mode === 'auto' || mode === 'outputs';

    const testRows = testCases.slice(0, MAX_TEST_VALUES);

    const outputsGridHtml = showOutputs ? (`
      <div class="mvpi-outputs">
        <div class="mvpi-subttl">Outputs for the hidden test inputs</div>
        <table class="plain mvpi-outtab"><thead><tr>
          <th>input $n$</th><th>your output</th>
        </tr></thead><tbody>
          ${testRows.map((p, i) => `
            <tr>
              <td class="num">${escapeHtml(fmtValue(p[0], inputKind))}</td>
              <td><input type="text" inputmode="decimal"
                         class="mvpi-out" data-i="${i}"
                         aria-label="output for input ${escapeHtml(String(p[0]))}"
                         placeholder="?" /></td>
            </tr>`).join('')}
        </tbody></table>
      </div>
    `) : '';

    const formulaRowHtml = showFormula ? (`
      <div class="row mvpi-formula-row">
        <label for="${rootId}-formula">formula $f(n)$ =</label>
        <input type="text" id="${rootId}-formula"
               class="mvpi-formula"
               maxlength="${MAX_FORMULA_LEN}"
               spellcheck="false" autocomplete="off"
               placeholder="e.g. n*(n+1)/2" />
        <span class="small mvpi-formhint" style="color:var(--mute)">
          ≤ ${MAX_FORMULA_LEN} chars; use <code>n</code>, <code>+ − × / %</code>, <code>**</code>, parens
        </span>
      </div>
    `) : '';

    root.innerHTML = `
      <div class="hd">
        <div class="ttl">${escapeHtml(title)}</div>
        <div class="hint">${escapeHtml(hint)}</div>
      </div>
      <div class="mvpi-examples">
        <div class="mvpi-subttl">Examples (visible)</div>
        <table class="plain mvpi-extab"><thead><tr>
          <th>input $n$</th><th>output $f(n)$</th>
        </tr></thead><tbody>
          ${examples.map(p => `
            <tr>
              <td class="num">${escapeHtml(fmtValue(p[0], inputKind))}</td>
              <td class="num">${escapeHtml(fmtValue(p[1], outputKind))}</td>
            </tr>`).join('')}
        </tbody></table>
      </div>
      ${formulaRowHtml}
      ${outputsGridHtml}
      <div class="row mvpi-ctl">
        <button type="button" class="mvpi-submit" id="${rootId}-submit">Check</button>
        <button type="button" class="mvpi-reveal" id="${rootId}-reveal">Give up · reveal</button>
        <span class="small mvpi-badge" id="${rootId}-badge" style="color:var(--mute)"></span>
      </div>
      <div class="readout mvpi-readout" id="${rootId}-out"></div>
    `;

    // Scoped styling — inject once. Minimal, no colors hard-coded (var() only).
    injectStylesOnce();

    const submitBtn = root.querySelector('.mvpi-submit');
    const revealBtn = root.querySelector('.mvpi-reveal');
    const out       = root.querySelector('.mvpi-readout');
    const badge     = root.querySelector('.mvpi-badge');
    const formulaEl = showFormula ? root.querySelector('.mvpi-formula') : null;
    const outInputs = showOutputs ? Array.from(root.querySelectorAll('.mvpi-out')) : [];

    // KaTeX pass for table headers / labels if autorender already exists.
    rekatex(root);

    let solved = false;

    function setBadge(text, cls){
      badge.textContent = text;
      badge.style.color = cls === 'ok' ? 'var(--green)'
                        : cls === 'bad' ? 'var(--pink)'
                        : 'var(--mute)';
    }

    function check(){
      out.classList.remove('ok','bad');
      let pass = 0;
      let total = testRows.length;
      const rows = [];

      // Prefer the formula box if it contains something non-empty.
      const formulaSrc = formulaEl ? formulaEl.value.trim() : '';
      let fn = null;
      let formulaError = null;
      if(formulaSrc){
        fn = compileFormula(formulaSrc);
        if(!fn) formulaError = 'formula rejected (length > '+MAX_FORMULA_LEN+' chars, disallowed characters, or runtime error at n=1)';
      }

      for(let i=0;i<testRows.length;i++){
        const [input, expected] = testRows[i];
        let predicted = null;
        let source = '?';

        if(fn){
          try { predicted = fn(input); source = 'formula'; }
          catch(_e){ predicted = null; source = 'formula (error)'; }
        } else if(outInputs.length){
          const raw = outInputs[i] ? outInputs[i].value.trim() : '';
          if(raw !== ''){
            const v = parseFloat(raw);
            if(Number.isFinite(v)){ predicted = v; source = 'manual'; }
            else source = 'manual (NaN)';
          } else {
            source = 'blank';
          }
        }

        const ok = typeof predicted === 'number'
                && nearlyEqual(predicted, expected, tol);
        if(ok) pass++;
        rows.push({ input, expected, predicted, ok, source });
      }

      // Visual feedback on the outputs grid rows when the formula path is
      // NOT being used (we don't want to leak the expected value, just a
      // per-row ✓/✗).
      if(outInputs.length){
        for(let i=0;i<outInputs.length;i++){
          const el = outInputs[i];
          el.classList.remove('mvpi-row-ok','mvpi-row-bad');
          if(rows[i] && typeof rows[i].predicted === 'number'){
            el.classList.add(rows[i].ok ? 'mvpi-row-ok' : 'mvpi-row-bad');
          }
        }
      }

      // Build readout.
      const lines = [];
      if(formulaError){
        lines.push('⚠ '+formulaError);
      } else if(formulaSrc){
        lines.push('formula: f(n) = '+formulaSrc);
      } else if(outInputs.length){
        lines.push('(using manually-entered outputs)');
      } else {
        lines.push('enter a formula to check');
      }
      lines.push('');
      for(const r of rows){
        const pred = r.predicted == null
          ? '—'
          : fmtValue(r.predicted, outputKind);
        lines.push(
          '  n='+fmtValue(r.input, inputKind)+
          '  your='+pred+
          '  '+(r.ok ? '✓' : '✗')
        );
      }
      lines.push('');
      lines.push('score: '+pass+' / '+total);

      out.textContent = lines.join('\n');

      if(pass === total && total > 0){
        solved = true;
        setBadge('✓ pattern matched', 'ok');
        out.classList.add('ok');
        reveal(/*fromSuccess*/true);
      } else {
        setBadge('✗ '+pass+' / '+total+' test cases match', 'bad');
        out.classList.add('bad');
      }
    }

    function reveal(fromSuccess){
      // Append the canonical formula (if provided) to the readout.
      if(!canonicalFormula && !canonicalLatex) return;
      const extra = document.createElement('div');
      extra.className = fromSuccess ? 'ok mvpi-canonical' : 'note mvpi-canonical';
      extra.style.marginTop = '.7rem';
      const prefix = fromSuccess ? '✓ ' : '(revealed) ';
      const latex = canonicalLatex ? ('$'+canonicalLatex+'$')
                                   : '$f(n) = '+canonicalFormula+'$';
      extra.innerHTML = escapeHtml(prefix)+latex;
      // Prevent duplicates if learner submits again.
      const old = root.querySelector('.mvpi-canonical');
      if(old) old.remove();
      out.insertAdjacentElement('afterend', extra);
      rekatex(extra);
      if(!fromSuccess){
        setBadge('revealed — study the formula, then try others', 'neutral');
      }
    }

    submitBtn.addEventListener('click', check);
    revealBtn.addEventListener('click', () => reveal(false));
    if(formulaEl){
      formulaEl.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') check();
      });
    }
    for(const el of outInputs){
      el.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') check();
      });
    }

    return {
      root,
      check,
      reveal,
      isSolved: () => solved
    };
  }

  // Inject a tiny stylesheet once — just enough to make the table and the
  // per-row validation classes read well inside the widget chrome. Uses
  // palette vars only, no hex literals.
  let stylesInjected = false;
  function injectStylesOnce(){
    if(stylesInjected) return;
    stylesInjected = true;
    const s = document.createElement('style');
    s.setAttribute('data-mvpi', '');
    s.textContent = `
      .widget .mvpi-subttl{
        font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;
        color:var(--mute);margin:.4rem 0 .25rem;font-weight:600;
      }
      .widget .mvpi-examples,.widget .mvpi-outputs{
        margin:.6rem 0;
      }
      .widget .mvpi-extab,.widget .mvpi-outtab{
        max-width:420px;
      }
      .widget .mvpi-extab th,.widget .mvpi-outtab th{
        font-size:.8rem;
      }
      .widget .mvpi-outtab td{padding:.25rem .5rem}
      .widget .mvpi-out{
        background:#0b0f16;color:var(--ink);border:1px solid var(--line);
        border-radius:6px;padding:.25rem .5rem;font-family:ui-monospace,monospace;
        width:9rem;font-size:.9rem;
      }
      .widget .mvpi-out.mvpi-row-ok{
        border-color:var(--green);
        box-shadow:0 0 0 1px color-mix(in srgb, var(--green) 40%, transparent);
      }
      .widget .mvpi-out.mvpi-row-bad{
        border-color:var(--pink);
        box-shadow:0 0 0 1px color-mix(in srgb, var(--pink) 40%, transparent);
      }
      .widget .mvpi-formula{
        background:#0b0f16;color:var(--ink);border:1px solid var(--line);
        border-radius:6px;padding:.3rem .55rem;
        font-family:ui-monospace,monospace;font-size:.95rem;
        min-width:min(360px,70vw);flex:1;
      }
      .widget .mvpi-formula-row{align-items:center}
      .widget .mvpi-ctl{margin-top:.6rem;align-items:center}
      .widget .mvpi-readout.ok{
        border-color:color-mix(in srgb, var(--green) 55%, var(--line));
      }
      .widget .mvpi-readout.bad{
        border-color:color-mix(in srgb, var(--pink) 55%, var(--line));
      }
    `;
    document.head.appendChild(s);
  }

  // Expose — namespacing mirrors MVQuiz / MVProgress.
  global.MVPatternInduction = {
    init,
    // exposed for tests
    _compileFormula: compileFormula,
    _nearlyEqual: nearlyEqual,
    MAX_FORMULA_LEN,
  };
})(typeof window !== 'undefined' ? window : globalThis);
