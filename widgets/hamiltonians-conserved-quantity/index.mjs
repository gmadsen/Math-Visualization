// hamiltonians-conserved-quantity widget — bespoke registry entry for the §4
// conserved-quantity tracker on the `hamiltonians-classical-mechanics` topic.
//
// The widget renders one .row containing TWO `<select>`s side by side
// (System: oscillator / central / gravity, and Track: H / p / L), plus an SVG
// host showing the tracked quantity along a flow integration. The
// two-pickers-on-one-row layout is unique on the page; the bespoke
// integration + plotting logic rides in `bodyScript` as artifact.
//
// Exports:
//   renderMarkup(params) -> <div class="widget"> ... </div>
//   renderScript(params) -> <script>\n(function(){ ... })();\n</script>

function renderHintHtml(hint) {
  return hint ? `<div class="hint">${hint}</div>` : '';
}

function renderPickOptions(options) {
  return options
    .map(o => {
      const sel = o.selected ? ' selected' : '';
      return `      <option value="${o.value}"${sel}>${o.label}</option>`;
    })
    .join('\n');
}

function renderPickRowEntries(picks) {
  // Each pick contributes `<label>...</label>\n<select>\n  options\n</select>`
  // emitted at the .row's inner indent (4 spaces). All picks share one .row.
  const lines = [];
  for (const p of picks) {
    lines.push(`    <label for="${p.id}">${p.label}</label>`);
    lines.push(`    <select id="${p.id}">`);
    lines.push(renderPickOptions(p.options));
    lines.push(`    </select>`);
  }
  return lines.join('\n');
}

export function renderMarkup(params) {
  const { widgetId, svgId, outputId, title, hint,
    viewBox, svgWidth, svgHeight, ariaLabel,
    picks, outputInitial, } = params;

  return (
    `<div class="widget"` + (widgetId ? ` id="${widgetId}"` : "") + `>\n` +
    `  <div class="hd">\n` +
    `    <div class="ttl">${title}</div>\n` +
    `    ${renderHintHtml(hint)}\n` +
    `  </div>\n` +
    `  <div class="row">\n` +
    `${renderPickRowEntries(picks)}\n` +
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
