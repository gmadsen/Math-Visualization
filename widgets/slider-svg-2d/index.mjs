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
function renderControl(c) {
  if (c.type === 'slider') {
    const stepAttr = (typeof c.step === 'number') ? ` step="${c.step}"` : '';
    return `<label>${c.label}<input id="${c.id}" type="range" min="${c.min}" max="${c.max}"${stepAttr} value="${c.value}"></label>`;
  }
  if (c.type === 'button') {
    return `<button id="${c.id}">${c.text}</button>`;
  }
  if (c.type === 'span') {
    const cls = c.class || 'small';
    const text = c.text || '';
    return `<span id="${c.id}" class="${cls}">${text}</span>`;
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
  const { title, hint, controls, svg, readout } = params;
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
  const svgInner = `<title>${escapeHtml(title)}</title>`;

  return (
    `<div class="widget">\n` +
    `  <div class="hd"><div class="ttl">${title}</div><div class="hint">${hint}</div></div>\n` +
    `  <div class="row">\n` +
    `    ${controlsMarkup}\n` +
    `  </div>\n` +
    `  <svg id="${svg.id}" viewBox="${svg.viewBox}" width="${svg.width}" height="${svg.height}">${svgInner}</svg>` +
    readoutMarkup + '\n' +
    `</div>`
  );
}

export function renderScript(params) {
  if (!params || typeof params.bodyScript !== 'string') {
    throw new TypeError('slider-svg-2d: params.bodyScript must be a string');
  }
  return params.bodyScript;
}
