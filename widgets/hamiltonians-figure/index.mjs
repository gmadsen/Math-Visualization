// hamiltonians-figure widget — shared registry entry covering the 6 widgets
// on the `hamiltonians-classical-mechanics` topic.
//
// Replaces the per-widget hamiltonians-canonical-transform /
// hamiltonians-conserved-quantity / hamiltonians-flow-portrait /
// hamiltonians-kam-tori / hamiltonians-kepler-orbits /
// hamiltonians-phase-space-cell slugs by absorbing their common chrome
// (header + SVG + readout, with control rows on either side of the SVG)
// into structured params and isolating the per-widget physics into the
// `bodyScript` artifact.
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>
//
// A portable consumer can drive the chrome from {svg, output, preRows,
// postRows} alone; only the integrator + draw routines inside bodyScript
// need a re-implementation per-widget.

import { escapeHtml } from '../_shared/escape.mjs';

function renderHintHtml(hint) {
  return hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
}

function renderPickOptions(options) {
  return options
    .map(o => {
      const sel = o.selected ? ' selected' : '';
      const trailing = typeof o.trailing === 'string' ? o.trailing : '';
      return `      <option value="${o.value}"${sel}${trailing}>${o.label}</option>`;
    })
    .join('\n');
}

function renderControl(c) {
  if (c.kind === 'pick') {
    return [
      `    <label for="${c.id}">${c.label}</label>`,
      `    <select id="${c.id}">`,
      renderPickOptions(c.options),
      `    </select>`,
    ].join('\n');
  }
  if (c.kind === 'slider') {
    return [
      `    <label for="${c.id}">${c.label}</label>`,
      `    <input id="${c.id}" type="range" min="${c.min}" max="${c.max}" value="${c.value}" />`,
    ].join('\n');
  }
  if (c.kind === 'button') {
    return `    <button id="${c.id}">${c.label}</button>`;
  }
  throw new Error(`hamiltonians-figure: unknown control kind "${c.kind}"`);
}

function renderRow(row) {
  const controlsHtml = row.controls.map(renderControl).join('\n');
  const trailingLine = row.trailing ? `\n    ${row.trailing}` : '';
  return (
    `  <div class="row">\n` +
    `${controlsHtml}${trailingLine}\n` +
    `  </div>\n`
  );
}

export function renderMarkup(params) {
  const { widgetId, title, hint, svg, output } = params;
  const preRows = params.preRows || [];
  const postRows = params.postRows || [];

  const preRowsHtml = preRows.map(renderRow).join('');
  const postRowsHtml = postRows.map(renderRow).join('');

  return (
    `<div class="widget"` + (widgetId ? ` id="${widgetId}"` : '') + `>\n` +
    `  <div class="hd">\n` +
    `    <div class="ttl">${escapeHtml(title)}</div>\n` +
    `    ${renderHintHtml(hint)}\n` +
    `  </div>\n` +
    `${preRowsHtml}` +
    `  <svg id="${svg.id}" viewBox="${svg.viewBox}" width="${svg.width}" height="${svg.height}" aria-label="${svg.ariaLabel}"></svg>\n` +
    `${postRowsHtml}` +
    `  <div class="readout" id="${output.id}">${output.initial}</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
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
