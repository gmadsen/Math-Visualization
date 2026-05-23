// hodge-theory-mixed-weight widget — bespoke semantic registry entry.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// Pure functions of params. The script embeds `examples` as JSON and rebuilds
// the weight-graded stack from it, so a non-HTML frontend can drive its own
// renderer from params alone (validated against ./schema.json).

import { escapeHtml } from '../_shared/escape.mjs';

export function renderMarkup(params) {
  const { widgetId, title, hint, examples } = params;
  const hintHtml = hint ? `<div class="hint">${escapeHtml(hint)}</div>` : '';
  const options = examples
    .map((e, i) => `      <option value="${escapeHtml(e.id)}"${i === 0 ? ' selected' : ''}>${escapeHtml(e.label)}</option>`)
    .join('\n');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${escapeHtml(title)}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${widgetId}-sel">example</label>\n` +
    `    <select id="${widgetId}-sel">\n${options}\n    </select>\n` +
    `  </div>\n` +
    `  <svg id="${widgetId}-svg" viewBox="0 0 540 230" width="540" height="230" role="img" aria-label="Weight-graded pieces of the chosen example"><title>Weight filtration: pure graded pieces stacked by weight</title></svg>\n` +
    `  <div class="readout" id="${widgetId}-out"></div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, examples } = params;
  const data = JSON.stringify(examples);
  return (
    `<script>\n` +
    `/* hodge-theory-mixed-weight widget: ${widgetId} */\n` +
    `(function(){\n` +
    `  var DATA = ${data};\n` +
    `  var byId = {}; DATA.forEach(function(e){ byId[e.id] = e; });\n` +
    `  var sel = document.getElementById('${widgetId}-sel');\n` +
    `  var svg = document.getElementById('${widgetId}-svg');\n` +
    `  var out = document.getElementById('${widgetId}-out');\n` +
    `  if(!sel || !svg || !out) return;\n` +
    `  var NS = 'http://www.w3.org/2000/svg';\n` +
    `  var COLORS = ['--cyan','--green','--yellow','--violet','--pink','--blue','--orange'];\n` +
    `  function mk(tag, attrs, text){ var e = document.createElementNS(NS, tag); for(var k in attrs){ e.setAttribute(k, attrs[k]); } if(text!=null) e.textContent = text; return e; }\n` +
    `  function draw(){\n` +
    `    var ex = byId[sel.value] || DATA[0];\n` +
    `    while(svg.firstChild) svg.removeChild(svg.firstChild);\n` +
    `    var pieces = ex.pieces.slice().sort(function(a,b){ return b.weight - a.weight; }); // highest weight on top\n` +
    `    var W = 540, top = 44, bh = Math.min(46, (200 - top) / pieces.length - 8), gap = 8, bw = 300, bx = (W-bw)/2;\n` +
    `    svg.appendChild(mk('text', {x:W/2, y:24, 'text-anchor':'middle', 'font-size':12.5, fill:'var(--mute)', 'font-style':'italic'}, ex.space + ':  weight-graded pieces (each pure of its weight)'));\n` +
    `    for(var i=0;i<pieces.length;i++){\n` +
    `      var pc = pieces[i], y = top + i*(bh+gap);\n` +
    `      var col = 'var(' + COLORS[((pc.weight % COLORS.length) + COLORS.length) % COLORS.length] + ')';\n` +
    `      svg.appendChild(mk('rect', {x:bx, y:y, width:bw, height:bh, rx:6, fill:'color-mix(in srgb, '+col+' 14%, var(--panel))', stroke:col, 'stroke-width':1.4}));\n` +
    `      svg.appendChild(mk('text', {x:bx+14, y:y+bh/2+5, 'text-anchor':'start', 'font-size':13, 'font-weight':'600', fill:col}, 'gr\\u1d42\\u2099  n = ' + pc.weight));\n` +
    `      svg.appendChild(mk('text', {x:bx+bw-14, y:y+bh/2+5, 'text-anchor':'end', 'font-size':12, fill:'var(--ink)'}, pc.label + '   (dim ' + pc.dim + ')'));\n` +
    `    }\n` +
    `    var totalDim = pieces.reduce(function(a,b){ return a + b.dim; }, 0);\n` +
    `    var wset = {}; pieces.forEach(function(pc){ wset[pc.weight] = 1; }); var nWeights = Object.keys(wset).length;\n` +
    `    var mixed = nWeights > 1; // mixedness = more than one distinct weight, not more than one row\n` +
    `    var lines = [];\n` +
    `    lines.push(ex.space + '   total dim = ' + totalDim + (mixed ? '   (genuinely MIXED: ' + nWeights + ' weights)' : '   (PURE: a single weight)'));\n` +
    `    lines.push('weight filtration W\\u2022 :  each graded piece gr\\u1d42\\u2099 = W\\u2099 / W\\u2099\\u208b\\u2081 is a pure Hodge structure of weight n');\n` +
    `    if(ex.note){ lines.push(''); lines.push(ex.note); }\n` +
    `    out.textContent = lines.join('\\n');\n` +
    `  }\n` +
    `  sel.addEventListener('change', draw);\n` +
    `  draw();\n` +
    `})();\n` +
    `</script>`
  );
}
