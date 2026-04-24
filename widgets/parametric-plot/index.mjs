// parametric-plot widget — SHARED widget module absorbing the largest
// structural family in the corpus: slider-plot (81) + slider-plot-actions
// (~23) + select-slider-plot (55). Dispatches on params.interaction:
//
//   "single-mode"  — bare slider-plot: header, SVG host, 1+ range sliders
//                    each with an echo <span class="small">, optional action
//                    buttons (reset/apply/…), and a readout div. Absorbs
//                    slider-plot and slider-plot-actions. Used here by
//                    w-germ / w-chain / w-mono on analytic-continuation.
//
//   "multi-mode"   — select-slider-plot: adds a <select> over `pick.options`
//                    that swaps slider ranges / initial values + draw logic
//                    per mode. The pick row sits above the slider rows.
//
// Both exports are pure string-returning functions. The site's
// render-topic.mjs calls renderMarkup + renderScript; their concatenation is
// byte-identical to the original inline bytes in each absorbed topic HTML.
//
// Per-widget draw logic (reading sliders, computing geometry, drawing into
// SVG, writing the readout) is too varied to generalize losslessly across
// ~160 widgets. It is carried verbatim as `bodyScript` (ARTIFACT) — an
// opaque JS statement sequence that runs inside the IIFE wrapper. A portable
// consumer (React / Three.js / whatever) ignores `bodyScript` entirely and
// drives its own renderer from the structural params (sliders, modes, etc.)
// plus — eventually — per-widget structured `draw` descriptors. For now the
// artifact string preserves byte-identity without committing to a DSL for
// 160 bespoke formulas.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script>\n/* … */\n(function(){ … })();\n</script>

function renderHintHtml(hint, hintTag) {
  if (!hint) return '';
  const tag = hintTag === 'span' ? 'span' : 'div';
  return `<${tag} class="hint">${hint}</${tag}>`;
}

function renderSliderRow(s) {
  // Produces (with leading 2-space indent at the <div> but no trailing \n):
  // Default form (labelWraps absent/false):
  //   <div class="row">
  //     <label for="sid">label</label>
  //     <input type="range" id="sid" min="m" max="M" step="s" value="v">
  //     <span class="small" id="sid-out">init</span>     ← optional
  //   </div>
  // Label-wrapping form (labelWraps true):
  //   <div class="row">
  //     <label>label <input type="range" id="sid" min="m" max="M" step="s" value="v"></label>
  //     <span class="small" id="sid-out">init</span>     ← optional
  //   </div>
  const lines = [];
  lines.push(`  <div class="row">`);
  const inputTag =
    `<input type="range" id="${s.id}" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.init}">`;
  if (s.labelWraps) {
    lines.push(`    <label>${s.label} ${inputTag}</label>`);
  } else {
    lines.push(`    <label for="${s.id}">${s.label}</label>`);
    lines.push(`    ${inputTag}`);
  }
  if (s.outId) {
    lines.push(
      `    <span class="small" id="${s.outId}">${s.initReadout ?? ''}</span>`
    );
  }
  lines.push(`  </div>`);
  return lines.join('\n');
}

function renderPickRow(pick) {
  const opts = pick.options
    .map(o => {
      const sel = o.selected ? ' selected' : '';
      return `      <option value="${o.value}"${sel}>${o.label}</option>`;
    })
    .join('\n');
  return (
    `  <div class="row">\n` +
    `    <label for="${pick.id}">${pick.label}</label>\n` +
    `    <select id="${pick.id}">\n` +
    `${opts}\n` +
    `    </select>\n` +
    `  </div>`
  );
}

function renderButtonsRow(buttons) {
  if (!buttons || buttons.length === 0) return null;
  const btnLines = buttons.map(
    b => `    <button id="${b.id}">${b.label}</button>`
  );
  return (
    `  <div class="row">\n` +
    `${btnLines.join('\n')}\n` +
    `  </div>`
  );
}

function renderReadoutDiv(outputId, outputInitial) {
  const init = outputInitial ?? '&nbsp;';
  return `  <div class="readout" id="${outputId}">${init}</div>`;
}

function renderTitleTag(title, titleTag) {
  const tag = titleTag === 'span' ? 'span' : 'div';
  return `<${tag} class="ttl">${title}</${tag}>`;
}

function renderHeaderAndSvg(params) {
  const {
    widgetId, svgId, title, viewBox, svgWidth, svgHeight, svgTitle, titleTag, hintTag, hdHtml,
  } = params;
  const hintHtml = renderHintHtml(params.hint, hintTag);
  const svgTitleText = svgTitle ?? title;
  const hdLine = typeof hdHtml === 'string'
    ? `  <div class="hd">${hdHtml}</div>\n`
    : `  <div class="hd">${renderTitleTag(title, titleTag)}${hintHtml}</div>\n`;
  return (
    `<div class="widget" id="${widgetId}">\n` +
    hdLine +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}"><title>${svgTitleText}</title></svg>`
  );
}

function renderTrailingExplainer(params) {
  return typeof params.trailingExplainer === 'string'
    ? `  <p class="small">${params.trailingExplainer}</p>\n`
    : '';
}

function renderSingleMarkup(params) {
  const head = renderHeaderAndSvg(params);
  const rows = [];
  for (const s of params.sliders) rows.push(renderSliderRow(s));
  const btnRow = renderButtonsRow(params.buttons);
  if (btnRow) rows.push(btnRow);
  rows.push(renderReadoutDiv(params.outputId, params.outputInitial));
  return `${head}\n${rows.join('\n')}\n${renderTrailingExplainer(params)}</div>`;
}

function renderMultiMarkup(params) {
  const head = renderHeaderAndSvg(params);
  const rows = [];
  rows.push(renderPickRow(params.pick));
  if (params.sliders) {
    for (const s of params.sliders) rows.push(renderSliderRow(s));
  }
  const btnRow = renderButtonsRow(params.buttons);
  if (btnRow) rows.push(btnRow);
  rows.push(renderReadoutDiv(params.outputId, params.outputInitial));
  return `${head}\n${rows.join('\n')}\n${renderTrailingExplainer(params)}</div>`;
}

export function renderMarkup(params) {
  if (params.interaction === 'single-mode') return renderSingleMarkup(params);
  if (params.interaction === 'multi-mode')  return renderMultiMarkup(params);
  throw new Error(`parametric-plot: unknown interaction "${params.interaction}"`);
}

function renderScriptCommon(params) {
  // <script>\n/* <sectionComment> */\n(function(){\n<bodyScript>\n})();\n</script>
  // sectionComment is optional; when absent, no /* */ line is emitted.
  const { sectionComment, bodyScript } = params;
  const commentLine = sectionComment ? `/* ${sectionComment} */\n` : '';
  return (
    `<script>\n` +
    commentLine +
    `(function(){\n` +
    `${bodyScript}\n` +
    `})();\n` +
    `</script>`
  );
}

export function renderScript(params) {
  if (params.interaction === 'single-mode' || params.interaction === 'multi-mode') {
    return renderScriptCommon(params);
  }
  throw new Error(`parametric-plot: unknown interaction "${params.interaction}"`);
}
