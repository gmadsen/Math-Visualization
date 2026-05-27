// slider-svg-2d — shared renderer for the standard "slider(s) + SVG + readout"
// interactive widget pattern. Replaces ~140 verbatim-renderer slugs across
// the corpus by pulling chrome (controls, SVG container, readout) into
// typed params. Each widget's draw logic remains in `params.script`.
//
// See widgets/slider-svg-2d/schema.json for the param contract.
// See widgets/slider-svg-2d/README.md for the migration recipe.

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Renders one control element. Order-sensitive — the caller joins the
// outputs with "\n    " (4-space indent + newline) so the .row block
// matches the prior verbatim formatting.
//
// Sliders support two markup shapes (per-control `format` field):
//
//   "nested" (default, spectral-theory style):
//     <label>{label}<input id="{id}" type="range" min=… max=… [step=…] value=…></label>
//
//   "separate" (kahler-geometry / spectral-methods-data / mathematical-biology):
//     <label for="{id}">{label}</label>
//     <input type="range" id="{id}" min=… max=… [step=…] value=…>
//
// The two forms render identically in the browser but differ at the byte
// level — preserve per-control so corpus migration roundtrips cleanly.
// Input attribute order differs too: nested writes `id, type, …`;
// separate writes `type, id, …` (the corpus convention for sibling
// inputs). `labelAttrs` is a verbatim attribute string (with leading
// space) spliced into the `<label …>` opening tag if present.
function renderControl(c) {
  if (c.type === 'slider') {
    // step accepted as number OR string (string preserves `.0` suffix
    // from source HTML so byte-identical migration roundtrips work).
    // Use `c.step != null` rather than typeof check so both forms emit.
    const stepAttr = (c.step != null && c.step !== '') ? ` step="${c.step}"` : '';
    const labelAttrs = (typeof c.labelAttrs === 'string') ? c.labelAttrs : '';
    const format = c.format || 'nested';
    if (format === 'separate') {
      return (
        `<label${labelAttrs} for="${c.id}">${c.label}</label>\n` +
        `    <input type="range" id="${c.id}" min="${c.min}" max="${c.max}"${stepAttr} value="${c.value}">`
      );
    }
    return `<label${labelAttrs}>${c.label}<input id="${c.id}" type="range" min="${c.min}" max="${c.max}"${stepAttr} value="${c.value}"></label>`;
  }
  if (c.type === 'button') {
    const classAttr = (typeof c.class === 'string') ? ` class="${c.class}"` : '';
    return `<button id="${c.id}"${classAttr}>${c.text}</button>`;
  }
  if (c.type === 'span') {
    // Three states (preserves spectral-theory backcompat while enabling
    // kahler-geometry style):
    //   - `class` undefined        → emit `class="small"` (corpus default,
    //                                 matches PR #228 spectral-theory entries)
    //   - `class` === ""           → emit no class attribute
    //                                 (kahler-geometry style)
    //   - `class` === non-empty    → emit `class="{value}"` verbatim
    let classAttr;
    if (c.class === undefined) classAttr = ' class="small"';
    else if (c.class === '')   classAttr = '';
    else                       classAttr = ` class="${c.class}"`;
    const text = c.text || '';
    return `<span id="${c.id}"${classAttr}>${text}</span>`;
  }
  if (c.type === 'select') {
    // Dropdown control: `<label for="ID">LABEL</label>` (when label present)
    // followed by `<select id="ID">{optionsHtml}</select>`. `optionsHtml` is the
    // VERBATIM inner markup (the `<option>` run, exactly as authored — inline or
    // multi-line/indented) so byte-identical roundtrip holds across the corpus's
    // varied option layouts. The migrate tool allowlists it to `<option>`-only.
    // KaTeX in option labels renders via the page's js/katex-select.js shim
    // (already loaded on pages with working LaTeX-in-<option> selects).
    const opts = typeof c.optionsHtml === 'string' ? c.optionsHtml : '';
    const styleAttr = (typeof c.style === 'string') ? ` style="${c.style}"` : '';
    const sel = `<select id="${c.id}"${styleAttr}>${opts}</select>`;
    if (c.format === 'nested') {
      // Nested form: `<label>LABEL<select …>…</select></label>` (the label text
      // and select are one element). c.label is the verbatim text before <select>.
      return `<label>${c.label || ''}${sel}</label>`;
    }
    // Separate form (default): `<label for=ID>LABEL</label>` then `<select id=ID>`.
    const labelPart = (typeof c.label === 'string' && c.label !== '')
      ? `<label for="${c.id}">${c.label}</label>\n    `
      : '';
    return `${labelPart}${sel}`;
  }
  throw new Error(`slider-svg-2d: unknown control type "${c.type}"`);
}

// Derive the readout-div id from the SVG id if the caller passed
// `readout: true`. Convention: SVG id is `{prefix}-svg`, readout id is
// `{prefix}-readout`. If the SVG id doesn't end with `-svg`, the caller
// must use the object form of `readout` to specify the id explicitly.
function readoutIdFromSvg(svgId) {
  if (svgId.endsWith('-svg')) return svgId.slice(0, -4) + '-readout';
  throw new Error(
    `slider-svg-2d: readout=true requires svg.id to end with "-svg" so the readout id can be derived. Got "${svgId}". Use readout: { "id": "…" } to specify explicitly.`
  );
}

export function renderMarkup(params) {
  if (!params) throw new TypeError('slider-svg-2d: params is required');
  const { title, hint, controls, svg, readout, widgetId, wrapperHasId, trailingProse } = params;
  if (typeof title !== 'string') throw new TypeError('slider-svg-2d: title must be a string');
  if (typeof hint  !== 'string') throw new TypeError('slider-svg-2d: hint must be a string');
  if (!Array.isArray(controls) || controls.length === 0) {
    throw new TypeError('slider-svg-2d: controls must be a non-empty array');
  }
  if (!svg || typeof svg.id !== 'string') throw new TypeError('slider-svg-2d: svg.id is required');

  let readoutMarkup = '';
  if (readout === true) {
    readoutMarkup = `\n  <div class="readout" id="${readoutIdFromSvg(svg.id)}"></div>`;
  } else if (readout && typeof readout === 'object') {
    const cls = readout.class || 'readout';
    readoutMarkup = `\n  <div class="${cls}" id="${readout.id}"></div>`;
  }

  const controlsMarkup = controls.map(renderControl).join('\n    ');
  // SVG <title> text gets HTML-escaped (the original verbatim markup
  // routed titles through DOM-API setters that escape `'` to `&#39;` etc.).
  // The header .ttl text is emitted as-is to match the existing pages,
  // which is fine because it's the literal author-written string.
  //
  // Override the SVG title via `svg.title` if present (corpus convention:
  // many widgets give the SVG a more specific accessibility name than the
  // page header — e.g. header `$(p,q)$-bigrading explorer` vs SVG title
  // `bidegree summands`). Falls back to the header title when omitted.
  const svgTitleText = (typeof svg.title === 'string') ? svg.title : title;
  const svgInner = `<title>${escapeHtml(svgTitleText)}</title>`;

  // SVG open-tag attributes. `width`/`height` are optional: modern responsive
  // widgets size purely from `viewBox` + CSS `max-width:100%`, so forcing px
  // attributes would pin the aspect ratio and distort on narrow screens. When
  // present they're emitted (legacy convention); when absent they're omitted.
  // `role`/`ariaLabel` round-trip the accessibility hints some pages set on the
  // SVG in addition to `<title>`. Order is fixed (id viewBox width height role
  // aria-label) so output is deterministic.
  const svgAttrs = `id="${svg.id}" viewBox="${svg.viewBox}"` +
    (svg.width  != null ? ` width="${svg.width}"` : '') +
    (svg.height != null ? ` height="${svg.height}"` : '') +
    (svg.role ? ` role="${svg.role}"` : '') +
    (svg.ariaLabel != null ? ` aria-label="${escapeHtml(svg.ariaLabel)}"` : '') +
    // `style` is emitted verbatim (machine CSS, not human text — no HTML-escaping,
    // matching the source attribute exactly). Round-trips inline SVG styling some
    // widgets set directly on the element: a dark plotting canvas, a border, or
    // `cursor:crosshair` (the affordance for click-to-place widgets like ec-gl).
    (svg.style != null ? ` style="${svg.style}"` : '');

  // Wrapper id: opt-in via `wrapperHasId: true`. Two distinct uses of
  // widgetId across the corpus require this split:
  //
  //   1. spectral-theory style: widgetId is metadata-only — used by
  //      widget-script-block `ref` binding (see render-doc.mjs
  //      buildWidgetById) to attach the trailing <script> to its
  //      widget. The wrapper carries NO id. Set wrapperHasId: false
  //      (or omit) so the renderer doesn't emit it on the wrapper.
  //
  //   2. kahler-geometry style: widgetId IS the wrapper id, used by
  //      per-page CSS / scripts. The widget-script block has inline
  //      html (not ref-bound). Set wrapperHasId: true.
  //
  // The two semantics couldn't be auto-distinguished at this layer —
  // a single widget might serve both purposes simultaneously, and the
  // renderer doesn't have access to sibling blocks. Explicit opt-in
  // keeps the contract per-widget and unambiguous.
  const wrapperIdAttr = (wrapperHasId && typeof widgetId === 'string' && widgetId !== '')
    ? ` id="${widgetId}"`
    : '';

  // Trailing prose: optional `<p class="small">…</p>` between readout
  // and closing wrapper, matching the corpus convention where a few
  // widgets carry an explanatory caption inside the widget block.
  //
  // SECURITY: trailingProse is rendered as HTML, NOT escaped — corpus
  // captions contain `<em>`/`<a>`/`<code>` formatting and KaTeX `$…$`
  // expressions that must reach the browser un-escaped. Source MUST be
  // trusted (hand-authored corpus content extracted from topic HTML).
  // If you ever wire this renderer to a user-input field (widget
  // authoring UI, etc.), HTML-escape `trailingProse` upstream BEFORE
  // it reaches this function or you get an XSS surface. SFH flagged
  // this on PR #243; the migrate script also asserts at most one
  // `<p class="small">` to prevent multi-paragraph capture corruption.
  const trailingMarkup = (typeof trailingProse === 'string' && trailingProse !== '')
    ? `\n  <p class="small">${trailingProse}</p>`
    : '';

  return (
    `<div class="widget"${wrapperIdAttr}>\n` +
    `  <div class="hd"><div class="ttl">${title}</div><div class="hint">${hint}</div></div>\n` +
    `  <div class="row">\n` +
    `    ${controlsMarkup}\n` +
    `  </div>\n` +
    `  <svg ${svgAttrs}>${svgInner}</svg>` +
    readoutMarkup +
    trailingMarkup + '\n' +
    `</div>`
  );
}

export function renderScript(params) {
  if (!params || typeof params.bodyScript !== 'string') {
    throw new TypeError('slider-svg-2d: params.bodyScript must be a string');
  }
  return params.bodyScript;
}
