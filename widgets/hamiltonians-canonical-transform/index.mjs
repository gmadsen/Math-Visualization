// hamiltonians-canonical-transform widget — bespoke registry entry for the §3
// canonical-transformations preview on the `hamiltonians-classical-mechanics`
// topic.
//
// The widget renders one .row that holds BOTH a <select> (map family:
// rotation, shear, squeeze, plus a non-canonical control case) AND an
// <input type="range"> parameter slider — sharing the row distinguishes this
// shape from parametric-plot's separate-row layout, so it warrants a bespoke
// slug. The bespoke draw logic (applying a 2x2 linear map to a unit square)
// rides in `bodyScript` as an artifact.
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>

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

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint,
    viewBox, svgWidth, svgHeight, ariaLabel,
    pick, slider, outputInitial, } = params;

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
    `    <label for="${slider.id}">${slider.label}</label>\n` +
    `    <input id="${slider.id}" type="range" min="${slider.min}" max="${slider.max}" value="${slider.value}" />\n` +
    `  </div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}" aria-label="${ariaLabel}"></svg>\n` +
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
