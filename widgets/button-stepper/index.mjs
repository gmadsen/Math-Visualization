// button-stepper widget — SHARED renderer for the button-stepper-svg and
// button-stepper-text families (~47 widgets: SVG host + multiple <button>
// elements wired to step/reset/next/prev/custom actions, no ranges/selects).
//
// Exports two pure string-returning functions:
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Both are pure functions of params (no I/O). A portable (React / SSR /
// whatever) frontend can ignore renderScript entirely and drive its own
// rendering from `buttons`, `layout`, `steps`/`stepCount` — `bodyScript` is
// an ARTIFACT carried only so the vanilla-HTML renderer can round-trip the
// original inline source byte-for-byte.
//
// Data model summary (see ./schema.json for the authoritative shape):
//
//   widgetId        — outer <div class="widget"> id.
//   title, hint?    — header text in <div class="hd">.
//   svgId?, viewBox?, readoutId?
//                   — convenience mirrors of the primary SVG / readout ids.
//                     The vanilla renderer reads geometry from `layout`; these
//                     fields exist so a portable consumer can side-step the
//                     layout array when one primary SVG + one readout suffice.
//   buttons?        — flat list of every <button> annotated with an `action`
//                     intent ('step' | 'reset' | 'next' | 'prev' | <custom>).
//                     Portable frontends can build UI from this alone.
//   stepCount?      — linear-stepper state size (step indices 0..n-1).
//   steps?          — optional sequence of named states (opaque to the
//                     renderer; the widget's bodyScript keys off them).
//   sectionComment? — text inserted as /* <here> */ between <script> and the
//                     IIFE open, so the original source's section banner
//                     (e.g. "SECTION 2 widget" padded with '=' bars) survives.
//   bodyScript      — ARTIFACT. JS body that sits between `(function(){` and
//                     `})();`. Preserved byte-for-byte.
//   layout          — ordered list of inner-widget blocks rendered after the
//                     .hd header. Four block kinds: 'svg', 'row', 'readout',
//                     'raw'. See renderLayoutBlock below for exact byte shape.

// -- Markup helpers -----------------------------------------------------------

function renderButtonAttrs(btn) {
  // Attribute order observed in the corpus, and the order this helper emits:
  //   id="…"  OR  data-…="…"     (mutually-permitted; if both are set, id
  //                               comes first — no widget in the current
  //                               corpus needs both, so this is conservative)
  //   class="…"                  (when className is set)
  const parts = [];
  if (btn.id) parts.push(`id="${btn.id}"`);
  if (btn.dataAttr) parts.push(`${btn.dataAttr.name}="${btn.dataAttr.value}"`);
  if (btn.className) parts.push(`class="${btn.className}"`);
  return parts.length ? ' ' + parts.join(' ') : '';
}

function renderButton(btn, indent) {
  // <indent><button<attrs>>label</button>
  return `${indent}<button${renderButtonAttrs(btn)}>${btn.label}</button>`;
}

function renderRowBlock(block) {
  // Three sub-shapes observed in the corpus:
  //   (a) empty w/ id — <div class="row" id="X"></div>
  //   (b) label + buttons — label on its own line, buttons each on their own
  //   (c) buttons only — each button on its own line
  //
  // When a `row` block carries neither `label` nor `buttons`, it renders as
  // the (a) shape (id-only empty row). Without an id and without content,
  // that's an invalid block; schema requires at least one meaningful field.
  const hasLabel = typeof block.label === 'string' && block.label.length > 0;
  const buttons = Array.isArray(block.buttons) ? block.buttons : [];

  const idAttr = block.id ? ` id="${block.id}"` : '';

  if (!hasLabel && buttons.length === 0) {
    // Empty row — e.g. w-top's <div class="row" id="top-grid"></div>.
    return `  <div class="row"${idAttr}></div>`;
  }

  const lines = [];
  lines.push(`  <div class="row"${idAttr}>`);
  if (hasLabel) lines.push(`    <label>${block.label}</label>`);
  for (const btn of buttons) lines.push(renderButton(btn, '    '));
  lines.push(`  </div>`);
  return lines.join('\n');
}

function renderSvgBlock(block, widgetTitle) {
  // <svg id="…" viewBox="…" width="…" height="…"><title>…</title></svg>
  // titleText defaults to the widget's own title.
  const titleText = typeof block.titleText === 'string'
    ? block.titleText
    : widgetTitle;
  return (
    `  <svg id="${block.id}" viewBox="${block.viewBox}" ` +
    `width="${block.width}" height="${block.height}">` +
    `<title>${titleText}</title></svg>`
  );
}

function renderReadoutBlock(block) {
  const content = typeof block.content === 'string' ? block.content : '';
  return `  <div class="readout" id="${block.id}">${content}</div>`;
}

function renderRawBlock(block) {
  // Artifact escape hatch. The schema guarantees `html` is a string. We
  // prepend two spaces (the standard inner-widget indent) and emit verbatim.
  // The body may contain newlines of its own.
  return `  ${block.html}`;
}

function renderLayoutBlock(block, widgetTitle) {
  switch (block.kind) {
    case 'svg':     return renderSvgBlock(block, widgetTitle);
    case 'row':     return renderRowBlock(block);
    case 'readout': return renderReadoutBlock(block);
    case 'raw':     return renderRawBlock(block);
    default:
      throw new Error(`button-stepper: unknown layout kind "${block.kind}"`);
  }
}

// -- Public API ---------------------------------------------------------------

function renderTitleTag(title, titleTag) {
  const tag = titleTag === 'span' ? 'span' : 'div';
  return `<${tag} class="ttl">${title}</${tag}>`;
}

function renderHintTag(hint, hintTag) {
  if (typeof hint !== 'string' || hint.length === 0) return '';
  const tag = hintTag === 'span' ? 'span' : 'div';
  return `<${tag} class="hint">${hint}</${tag}>`;
}

export function renderMarkup(params) {
  const { widgetId, title, hint, layout, titleTag, hintTag, trailingExplainer } = params;

  const hintHtml = renderHintTag(hint, hintTag);

  const blocks = Array.isArray(layout) ? layout : [];
  const bodyLines = blocks.map(b => renderLayoutBlock(b, title));

  const trailingLine = typeof trailingExplainer === 'string'
    ? `  <p class="small">${trailingExplainer}</p>\n`
    : '';

  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd">${renderTitleTag(title, titleTag)}${hintHtml}</div>\n` +
    (bodyLines.length ? bodyLines.join('\n') + '\n' : '') +
    trailingLine +
    `</div>`
  );
}

export function renderScript(params) {
  const { sectionComment, bodyScript } = params;

  const commentLine = typeof sectionComment === 'string' && sectionComment.length > 0
    ? `/* ${sectionComment} */\n`
    : '';

  return (
    `<script>\n` +
    commentLine +
    `(function(){\n` +
    `${bodyScript}\n` +
    `})();\n` +
    `</script>`
  );
}
