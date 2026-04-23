// surface-viewer widget — SHARED widget module for the 3d-viewer family.
// Covers parametric-surface and polyhedron viewers that rotate under drag via
// the page-global `make3DDraggable` / `proj3` helpers (differential-geometry,
// lie-groups, and — eventually — dynamical-systems, riemannian-geometry,
// smooth-manifolds).
//
// Two interactions:
//
//   "standard" — header + single `.row` of mixed selects/sliders + SVG host
//                + readout. Used by w-defect, w-geo, w-gb, w-poly, w-hol on
//                differential-geometry.
//
//   "bare"     — opaque `bodyMarkup` artifact (full widget inner HTML as a
//                string). Used for widgets whose layout is too idiosyncratic
//                for the structured markup (e.g. w-su2path's nested SVG +
//                matrix readout row).
//
// Both exports are pure string-returning functions. renderMarkup + renderScript
// are called by scripts/render-topic.mjs; their concatenation is byte-identical
// to the original inline bytes.
//
// The IIFE body (the real work: ODE integrators, wireframe construction, SVG
// path building, readout formatting) is carried verbatim as `bodyScript`. It is
// an ARTIFACT — portable React / react-three-fiber consumers discard it and
// drive their own renderer from the structural params (svgId, viewBox,
// controls, initialYaw/Pitch, meshDensity).
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script>\n/* … */\n(function(){ … })();\n</script>

function renderHintHtml(hint) {
  return hint ? `<div class="hint">${hint}</div>` : '';
}

function renderSliderInControls(s) {
  // w-defect / w-geo / w-hol style: plain <label for=id> + <input type=range>.
  // No echo span (the 3d-viewer family never uses slider-value spans — the
  // draw() routine writes everything to the readout instead).
  const forAttr = s.labelFor === false ? '' : ` for="${s.id}"`;
  return (
    `    <label${forAttr}>${s.label}</label>\n` +
    `    <input type="range" id="${s.id}" min="${s.min}" max="${s.max}" value="${s.init}" step="${s.step}">`
  );
}

function renderSelectInControls(sel) {
  const opts = sel.options.map(o => {
    const selAttr = o.selected ? ' selected' : '';
    return `      <option value="${o.value}"${selAttr}>${o.label}</option>`;
  }).join('\n');
  return (
    `    <label>${sel.label}</label>\n` +
    `    <select id="${sel.id}">\n` +
    `${opts}\n` +
    `    </select>`
  );
}

function renderControlsRow(controls) {
  if (!controls || controls.length === 0) return null;
  const parts = controls.map(c => {
    if (c.kind === 'slider') return renderSliderInControls(c);
    if (c.kind === 'select') return renderSelectInControls(c);
    throw new Error(`surface-viewer: unknown control kind "${c.kind}"`);
  });
  return `  <div class="row">\n${parts.join('\n')}\n  </div>`;
}

function renderStandardMarkup(params) {
  const {
    widgetId, svgId, title, viewBox, svgWidth, svgStyle, svgTitle,
    outputId, readoutInitial, controls,
  } = params;
  const hintHtml = renderHintHtml(params.hint);
  const svgTitleText = svgTitle ?? title;
  const readoutInner = readoutInitial ?? '';

  const lines = [];
  lines.push(`<div class="widget" id="${widgetId}">`);
  lines.push(`  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>`);
  const controlsRow = renderControlsRow(controls);
  if (controlsRow) lines.push(controlsRow);
  lines.push(
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" style="${svgStyle}"><title>${svgTitleText}</title></svg>`
  );
  lines.push(`  <div class="readout" id="${outputId}">${readoutInner}</div>`);
  lines.push(`</div>`);
  return lines.join('\n');
}

function renderBareMarkup(params) {
  // Full inner HTML of the widget wrapper is carried verbatim.
  return `<div class="widget" id="${params.widgetId}">\n${params.bodyMarkup}\n</div>`;
}

export function renderMarkup(params) {
  if (params.interaction === 'standard') return renderStandardMarkup(params);
  if (params.interaction === 'bare')     return renderBareMarkup(params);
  throw new Error(`surface-viewer: unknown interaction "${params.interaction}"`);
}

function renderScriptCommon(params) {
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
  if (params.interaction === 'standard' || params.interaction === 'bare') {
    return renderScriptCommon(params);
  }
  throw new Error(`surface-viewer: unknown interaction "${params.interaction}"`);
}
