// hamiltonians-flow-portrait widget — bespoke registry entry for the §2
// Hamiltonian flow portrait on the `hamiltonians-classical-mechanics` topic.
//
// The widget is the topic's signature interactive: a phase-space portrait
// that lets the reader pick a Hamiltonian, see its vector field, and click
// anywhere in the field to launch a trajectory under H. The combination of
// select + click-on-SVG + step/clear buttons + an inline `<span class="small">`
// trailing the buttons doesn't fit any shared slug — clickable-graph rejects
// form controls in markup, parametric-plot has no click-on-SVG semantics — so
// this slug captures it as one unit and keeps the bespoke draw + trajectory
// integrator opaque in the bodyScript artifact.
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>
//
// Both are pure functions of params (no I/O). A portable consumer ignores
// `bodyScript` and drives its own field+trajectory renderer from
// {pick.options, buttons, ariaLabel} plus its own integrator.

import { escapeHtml } from '../_shared/escape.mjs';

function renderHintHtml(hint) {
  return hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
}

function renderPickOptions(options) {
  return options
    .map(o => {
      const sel = o.selected ? ' selected' : '';
      return `      <option value="${o.value}"${sel}>${o.label}</option>`;
    })
    .join('\n');
}

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint,
    viewBox, svgWidth, svgHeight, ariaLabel,
    pick, buttons, buttonsTrailing, outputInitial, } = params;

  const buttonsHtml = buttons
    .map(b => `    <button id="${b.id}">${b.label}</button>`)
    .join('\n');

  const trailingLine = buttonsTrailing ? `\n    ${buttonsTrailing}` : '';

  return (
    `<div class="widget"` + (widgetId ? ` id="${widgetId}"` : "") + `>\n` +
    `  <div class="hd">\n` +
    `    <div class="ttl">${escapeHtml(title)}</div>\n` +
    `    ${renderHintHtml(hint)}\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `    <label for="${pick.id}">${pick.label}</label>\n` +
    `    <select id="${pick.id}">\n` +
    `${renderPickOptions(pick.options)}\n` +
    `    </select>\n` +
    `  </div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" aria-label="${ariaLabel}"></svg>\n` +
    `  <div class="row">\n` +
    `${buttonsHtml}${trailingLine}\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">${outputInitial}</div>\n` +
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
