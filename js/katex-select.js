// katex-select.js — enhance <select> elements whose <option> labels contain
// KaTeX-delimited math ($...$). Native <select> popups are drawn by the OS
// and can't contain rendered HTML, so the options stay as plain literal
// source ($\omega = dx$) until a custom dropdown replaces them.
//
// Auto-detection: on DOMContentLoaded (or on KatexSelect.scan() afterwards),
// every <select> whose any option's innerHTML contains a $…$ chunk is
// enhanced. The native <select> stays in the DOM (hidden, positioned
// off-screen but focusable) so existing change listeners keep firing and
// form semantics are preserved. Clicks on custom options update the native
// <select> via .selectedIndex and dispatch a synthetic 'change' event.

(function(global){
  const STYLE_ID = 'ks-styles';
  const MARK = 'ksEnhanced';

  function injectStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const css = `
      .ks-wrap{position:relative;display:inline-block;vertical-align:middle}
      .ks-wrap > select.ks-source{position:absolute;left:0;top:0;width:1px;height:1px;
        opacity:0;pointer-events:none;overflow:hidden;clip:rect(0 0 0 0);margin:0;padding:0;border:0}
      .ks-button{background:var(--panel2,#1c2230);border:1px solid var(--line,#2a3242);
        color:var(--ink,#e8ecf1);padding:3px 10px 3px 10px;border-radius:6px;cursor:pointer;
        font:inherit;font-size:0.92em;display:inline-flex;align-items:center;gap:10px;
        min-width:140px;max-width:520px;text-align:left;line-height:1.35}
      .ks-button:hover,.ks-button:focus-visible{border-color:var(--cyan,#7de0d6);outline:none}
      .ks-button .ks-label{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ks-button .ks-label .katex{font-size:1em}
      .ks-caret{color:var(--mute,#9aa4b2);font-size:0.75em;flex-shrink:0}
      .ks-popup{position:absolute;top:calc(100% + 4px);left:0;z-index:200;
        background:var(--panel,#161b24);border:1px solid var(--line,#2a3242);border-radius:8px;
        padding:4px;min-width:100%;max-height:min(60vh,440px);overflow-y:auto;
        box-shadow:0 8px 24px rgba(0,0,0,0.45);display:none}
      .ks-popup.ks-open{display:block}
      .ks-option{padding:6px 10px;border-radius:5px;cursor:pointer;color:var(--ink,#e8ecf1);
        white-space:nowrap;line-height:1.45;font-size:0.92em;
        border-left:2px solid transparent}
      .ks-option:hover,.ks-option.ks-active{background:var(--panel2,#1c2230)}
      .ks-option.ks-selected{background:color-mix(in srgb, var(--cyan,#7de0d6) 18%, transparent);
        border-left-color:var(--cyan,#7de0d6)}
      .ks-option .katex{font-size:1em}
      .ks-optgroup{padding:8px 10px 4px;font-size:0.74em;letter-spacing:0.12em;
        text-transform:uppercase;color:var(--mute,#9aa4b2);font-weight:600;
        border-top:1px solid var(--line,#2a3242);margin-top:4px;cursor:default;
        user-select:none}
      .ks-optgroup:first-child{border-top:none;margin-top:0}
    `;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = css;
    document.head.appendChild(s);
  }

  function renderTexInto(el, tex){
    if(global.katex && typeof global.katex.render === 'function'){
      try {
        global.katex.render(tex, el, { throwOnError: false, displayMode: false });
        return;
      } catch(_){}
    }
    el.textContent = tex;
  }

  // Split raw option innerHTML into text/html segments and $…$ TeX segments,
  // render accordingly into `target`.
  function renderMixed(target, raw){
    target.innerHTML = '';
    // Greedy $…$ splitter; handles the usual inline-math delimiters used
    // throughout the notebook. No display-mode ($$…$$) expected in options.
    const parts = raw.split(/(\$[^$]+\$)/g);
    for(const part of parts){
      if(!part) continue;
      if(part.length >= 2 && part.charCodeAt(0) === 36 && part.charCodeAt(part.length - 1) === 36){
        const tex = part.slice(1, -1);
        const span = document.createElement('span');
        renderTexInto(span, tex);
        target.appendChild(span);
      } else {
        // Preserve HTML entities (e.g. &nbsp;) by routing through a temp node.
        const tmp = document.createElement('span');
        tmp.innerHTML = part;
        while(tmp.firstChild) target.appendChild(tmp.firstChild);
      }
    }
  }

  function hasTeX(sel){
    for(const o of sel.options){
      if(/\$[^$]+\$/.test(o.innerHTML)) return true;
    }
    return false;
  }

  function enhance(sel){
    if(sel.dataset[MARK] === '1') return;
    if(!hasTeX(sel)) return;
    sel.dataset[MARK] = '1';

    const wrap = document.createElement('div');
    wrap.className = 'ks-wrap';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ks-button';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');

    const label = document.createElement('span');
    label.className = 'ks-label';
    const caret = document.createElement('span');
    caret.className = 'ks-caret';
    caret.textContent = '▾';
    btn.appendChild(label);
    btn.appendChild(caret);

    const popup = document.createElement('div');
    popup.className = 'ks-popup';
    popup.setAttribute('role', 'listbox');

    // Walk the <select>'s children so <optgroup> boundaries become visible
    // section headers in the custom popup. The native <select> treats
    // optgroups as labelled separators; the previous flat-list rendering
    // dropped them entirely, which lost the capstone-by-section grouping
    // on pathway.html. `items[]` only holds clickable option divs so the
    // keyboard-navigation logic below can stay index-based against
    // `sel.options[i]`.
    const items = [];
    let optIdx = 0;
    function appendOptionDiv(o){
      const item = document.createElement('div');
      item.className = 'ks-option';
      item.setAttribute('role', 'option');
      item.dataset.idx = String(optIdx);
      item.tabIndex = -1;
      renderMixed(item, o.innerHTML);
      if(optIdx === sel.selectedIndex) item.classList.add('ks-selected');
      items.push(item);
      popup.appendChild(item);
      optIdx++;
    }
    for(const child of Array.from(sel.children)){
      const tag = child.tagName;
      if(tag === 'OPTGROUP'){
        const header = document.createElement('div');
        header.className = 'ks-optgroup';
        header.setAttribute('role', 'presentation');
        // Optgroup labels are plain text per HTML spec — no math allowed —
        // so textContent is safe.
        header.textContent = child.label || '';
        popup.appendChild(header);
        for(const opt of Array.from(child.children)){
          if(opt.tagName === 'OPTION') appendOptionDiv(opt);
        }
      } else if(tag === 'OPTION'){
        appendOptionDiv(child);
      }
    }

    function setSelected(i){
      if(i < 0 || i >= items.length) return;
      sel.selectedIndex = i;
      items.forEach((it, j) => it.classList.toggle('ks-selected', i === j));
      renderMixed(label, sel.options[i].innerHTML);
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function open(){
      popup.classList.add('ks-open');
      btn.setAttribute('aria-expanded', 'true');
      const cur = items[sel.selectedIndex] || items[0];
      if(cur){ items.forEach(it => it.classList.remove('ks-active')); cur.classList.add('ks-active'); }
    }
    function close(){
      popup.classList.remove('ks-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function toggle(){ popup.classList.contains('ks-open') ? close() : open(); }

    btn.addEventListener('click', (e) => { e.preventDefault(); toggle(); });
    btn.addEventListener('keydown', (e) => {
      if(e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' '){
        e.preventDefault(); open();
      }
    });

    items.forEach((item, i) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        setSelected(i);
        close();
        btn.focus();
      });
      item.addEventListener('mouseenter', () => {
        items.forEach(it => it.classList.remove('ks-active'));
        item.classList.add('ks-active');
      });
    });

    popup.addEventListener('keydown', (e) => {
      const active = popup.querySelector('.ks-option.ks-active') || items[sel.selectedIndex];
      let idx = items.indexOf(active);
      if(e.key === 'ArrowDown'){ e.preventDefault(); idx = Math.min(items.length - 1, idx + 1); }
      else if(e.key === 'ArrowUp'){ e.preventDefault(); idx = Math.max(0, idx - 1); }
      else if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); setSelected(idx); close(); btn.focus(); return; }
      else if(e.key === 'Escape'){ e.preventDefault(); close(); btn.focus(); return; }
      else { return; }
      items.forEach(it => it.classList.remove('ks-active'));
      items[idx].classList.add('ks-active');
      items[idx].scrollIntoView({ block: 'nearest' });
    });

    document.addEventListener('click', (e) => {
      if(!wrap.contains(e.target)) close();
    });

    // Insert custom UI before the native select, then move the native select
    // into the wrap so form submission still carries the right value.
    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(btn);
    wrap.appendChild(popup);
    wrap.appendChild(sel);
    sel.classList.add('ks-source');
    sel.setAttribute('aria-hidden', 'true');
    sel.tabIndex = -1;

    // Initial button label.
    renderMixed(label, sel.options[sel.selectedIndex].innerHTML);
  }

  let scanPending = false;
  function scan(){
    scanPending = false;
    injectStyles();
    if(!global.katex || typeof global.katex.render !== 'function'){
      // KaTeX still loading — try again shortly.
      if(!scanPending){ scanPending = true; setTimeout(scan, 80); }
      return;
    }
    document.querySelectorAll('select').forEach(enhance);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();

  global.KatexSelect = { enhance, scan };
})(typeof window !== 'undefined' ? window : this);
