// expanders-vertex-expansion widget — bespoke registry entry for the
// vertex-expansion explorer on the `expanders` topic.
//
// The widget combines three controls that no shared slug currently absorbs as
// one gesture:
//
//   - a <select> picking the graph family (cycle / Petersen / hypercube / K_5),
//   - an action <button> that clears the selected set S,
//   - a clickable <svg> diagram whose vertices toggle in/out of S on click,
//
// with a <div class="readout"> reporting |N(S)| / |S|. clickable-graph has the
// click-on-SVG gesture but rejects form controls in markup; parametric-plot
// has form controls but no click-on-SVG semantics. So this slug captures the
// triple as a single unit and keeps the bodyScript opaque (it does the per-
// graph layout, the highlight pass, and the |N(S)|/|S| computation).
//
// Exports:
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script>\n(function(){ ... })();\n</script>
//
// Both are pure functions of params (no I/O). A portable consumer (React /
// SSR / any-frontend) ignores `bodyScript` and drives its own renderer from
// the structured `pick.options` and `buttons` fields plus its own graph
// layouts.

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
  const {
    widgetId, svgId, outputId,
    title, hint, viewBox, svgWidth, svgHeight, svgTitle,
    pick, buttons, outputInitial,
  } = params;

  const svgTitleText = svgTitle ?? title;
  const outInit = outputInitial ?? '&nbsp;';

  const buttonsHtml = (buttons ?? [])
    .map(b => `    <button id="${b.id}">${b.label}</button>`)
    .join('\n');

  const buttonsLine = buttonsHtml ? `\n${buttonsHtml}` : '';

  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${renderHintHtml(hint)}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${pick.id}">${pick.label}</label>\n` +
    `    <select id="${pick.id}">\n` +
    `${renderPickOptions(pick.options)}\n` +
    `    </select>${buttonsLine}\n` +
    `  </div>\n` +
    `  <svg id="${svgId}" viewBox="${viewBox}" width="${svgWidth}" height="${svgHeight}"><title>${svgTitleText}</title></svg>\n` +
    `  <div class="readout" id="${outputId}">${outInit}</div>\n` +
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
