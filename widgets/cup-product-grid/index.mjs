// cup-product-grid widget — shared registry renderer for the "click-multiply"
// gesture: a graded ring's multiplication table (the cup product). The reader
// picks a space and clicks a cell of the basis x basis grid; the engine shows
// the product, the degrees adding, the graded-commutativity sign (-1)^{pq}
// linking the cell to its transpose, and products that vanish shown as 0.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the grid, the ring dropdown, cell selection + highlight
// (incl. the transpose/sign partner), and the readout. The rings (basis +
// product rule) are author-supplied via ring(ci) in bodyScript.
//
// Pure DOM/table rendering — jsdom-safe (no getScreenCTM/rAF).

export function renderMarkup(params) {
  const { widgetId, gridId, outputId, selectId, title, hint } = params;
  const resetLabel = params.resetLabel || '↺ Clear';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  const cases = Array.isArray(params.cases) ? params.cases : [];
  const opts = cases.map((c, i) => `<option value="${i}">${c.label}</option>`).join('');
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <div class="row">\n` +
    `    <label for="${selectId}">space:</label>\n` +
    `    <select id="${selectId}">${opts}</select>\n` +
    `    <button id="${widgetId}-clear" type="button">${resetLabel}</button>\n` +
    `  </div>\n` +
    `  <div id="${gridId}" class="cup-grid" style="overflow-x:auto"></div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, gridId, outputId, selectId, bodyScript } = params;
  const cases = Array.isArray(params.cases) ? params.cases : [];
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const host=$('#${gridId}'), out=$('#${outputId}'), sel=$('#${selectId}');\n` +
    `  const CASES=${JSON.stringify(cases)};\n` +
    `  // ---- author hook: ring(ci) -> { basis:[{name,deg}], prod(i,j) } ----\n` +
    bodyScript + `\n` +
    `  var ci=0, selI=-1, selJ=-1;\n` +
    `  function termHtml(t){ if(t==null) return '0'; var c=t.c, nm=R.basis[t.k].name;\n` +
    `    if(c===1) return nm; if(c===-1) return '\\u2212'+nm; return (c<0?'\\u2212':'')+Math.abs(c)+nm; }\n` +
    `  var R=null;\n` +
    `  function load(){ R=ring(ci); selI=-1; selJ=-1; render(); }\n` +
    `  function render(){\n` +
    `    var m=R.basis.length;\n` +
    `    var h='<table style=\\"border-collapse:collapse;font-size:13px;margin:6px auto;font-variant-numeric:tabular-nums\\"><thead><tr>';\n` +
    `    h+='<th style=\\"padding:4px 9px;color:var(--mute)\\">\\u2323</th>';\n` +
    `    for(var j=0;j<m;j++){ h+='<th style=\\"padding:4px 9px;border-bottom:1px solid var(--line);color:var(--cyan)\\">'+R.basis[j].name+'<span style=\\"color:var(--mute);font-size:10px\\"> ('+R.basis[j].deg+')</span></th>'; }\n` +
    `    h+='</tr></thead><tbody>';\n` +
    `    for(var i=0;i<m;i++){ h+='<tr><th style=\\"padding:4px 9px;border-right:1px solid var(--line);text-align:right;color:var(--cyan)\\">'+R.basis[i].name+'<span style=\\"color:var(--mute);font-size:10px\\"> ('+R.basis[i].deg+')</span></th>';\n` +
    `      for(var j=0;j<m;j++){ var t=R.prod(i,j); var isSel=(i===selI&&j===selJ); var isPartner=(i===selJ&&j===selI&&!(selI===selJ));\n` +
    `        var bg=isSel?'color-mix(in srgb,var(--cyan) 26%,transparent)':(isPartner?'color-mix(in srgb,var(--pink) 18%,transparent)':'transparent');\n` +
    `        var fg=(t==null)?'var(--mute)':'var(--ink)';\n` +
    `        h+='<td data-i=\\"'+i+'\\" data-j=\\"'+j+'\\" style=\\"padding:4px 11px;text-align:center;cursor:pointer;background:'+bg+';color:'+fg+'\\">'+termHtml(t)+'</td>'; }\n` +
    `      h+='</tr>'; }\n` +
    `    h+='</tbody></table>'; host.innerHTML=h;\n` +
    `    [].forEach.call(host.querySelectorAll('td[data-i]'),function(td){ td.addEventListener('click',function(){ selI=+td.getAttribute('data-i'); selJ=+td.getAttribute('data-j'); render(); }); });\n` +
    `    writeOut();\n` +
    `  }\n` +
    `  function writeOut(){ var rl=CASES[ci].ringLabel? (' &nbsp;\\u00b7&nbsp; <span style=\\"color:var(--mute)\\">'+CASES[ci].ringLabel+'</span>'):'';\n` +
    `    if(selI<0){ out.innerHTML='click a cell to read off a cup product \\u03b1\\u2323\\u03b2'+rl; return; }\n` +
    `    var A=R.basis[selI], B=R.basis[selJ], t=R.prod(selI,selJ), tT=R.prod(selJ,selI);\n` +
    `    var sign=(((A.deg*B.deg)%2)===0)?'+':'\\u2212';\n` +
    `    var comm = (selI===selJ)?'' : ' &nbsp;\\u00b7&nbsp; graded-commutativity: '+B.name+'\\u2323'+A.name+' = '+(sign==='+'?'+':'\\u2212')+'('+A.name+'\\u2323'+B.name+') = '+termHtml(tT)+' &nbsp;<span style=\\"color:var(--mute)\\">[sign ('+'\\u22121)^{'+A.deg+'\\u00b7'+B.deg+'} = '+sign+'1]</span>';\n` +
    `    var prodStr='<b style=\\"color:'+((t==null)?'var(--mute)':'var(--cyan)')+'\\">'+A.name+' \\u2323 '+B.name+' = '+termHtml(t)+'</b>';\n` +
    `    var degStr=' &nbsp;\\u00b7&nbsp; degrees add: '+A.deg+' + '+B.deg+' = '+(A.deg+B.deg)+(t==null?' (but this lands above the top dimension / is killed by a relation, so the product is 0)':'');\n` +
    `    out.innerHTML=prodStr+degStr+comm+rl;\n` +
    `  }\n` +
    `  sel.addEventListener('change',function(){ ci=+sel.value; load(); });\n` +
    `  var cb=$('#${widgetId}-clear'); if(cb) cb.addEventListener('click',function(){ selI=-1; selJ=-1; render(); });\n` +
    `  load();\n` +
    `})();\n` +
    `</script>`
  );
}
