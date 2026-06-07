// algorithm-stepper widget — shared registry renderer for the "step-state"
// gesture: where button-stepper shows static prebuilt frames, this drives an
// author transition function over evolving STATE and renders the running trace
// as a table — press Step and one more row appears, the latest highlighted,
// with an invariant readout.
//
//   renderMarkup(params)  -> <div class="widget" id="..."> ... </div>
//   renderScript(params)  -> <script> ... </script>
//
// The renderer owns the Step / Run / Reset controls, the state history, the
// table rendering + highlight, and halt detection. The author supplies
// initial() / step(state) / row(state) and optional note(state) via bodyScript.
//
// Pure DOM/table rendering — jsdom-safe (no getScreenCTM/rAF).

export function renderMarkup(params) {
  const { widgetId, tableId, outputId, title, hint } = params;
  const stepLabel = params.stepLabel || 'Step ▸';
  const runLabel = params.runLabel || 'Run ⏭';
  const resetLabel = params.resetLabel || '↺ Reset';
  const hintHtml = hint ? `<div class="hint">${hint}</div>` : '';
  return (
    `<div class="widget" id="${widgetId}">\n` +
    `  <div class="hd"><div class="ttl">${title}</div>${hintHtml}</div>\n` +
    `  <div id="${tableId}" class="algo-trace" style="overflow-x:auto"></div>\n` +
    `  <div class="row">\n` +
    `    <button id="${widgetId}-step" type="button">${stepLabel}</button>\n` +
    `    <button id="${widgetId}-run" type="button">${runLabel}</button>\n` +
    `    <button id="${widgetId}-reset" type="button">${resetLabel}</button>\n` +
    `  </div>\n` +
    `  <div class="readout" id="${outputId}">&nbsp;</div>\n` +
    `</div>`
  );
}

export function renderScript(params) {
  const { widgetId, tableId, outputId, bodyScript, maxSteps = 40 } = params;
  const columns = Array.isArray(params.columns) ? params.columns : [];
  return (
    `<script>\n` +
    `(function(){\n` +
    `  const host=$('#${tableId}'), out=$('#${outputId}');\n` +
    `  const COLS=${JSON.stringify(columns)}, MAX=${maxSteps};\n` +
    `  // ---- author hooks: initial()/step(state)/row(state) required; note(state) optional ----\n` +
    bodyScript + `\n` +
    `  var hasNote=(typeof note==='function');\n` +
    `  var states=[], halted=false, haltReason=null;   // haltReason: 'done' (step returned null) | 'cap' (hit maxSteps)\n` +
    `  function reset(){ states=[initial()]; halted=false; haltReason=null; render(); }\n` +
    `  function doStep(){ if(halted) return false; var nx=step(states[states.length-1]);\n` +
    `    if(nx==null){ halted=true; haltReason='done'; render(); return false; }\n` +
    `    states.push(nx); if(states.length-1>=MAX){ halted=true; haltReason='cap'; } render(); return true; }\n` +
    `  function run(){ var guard=0; while(doStep() && guard++<MAX){} }\n` +
    `  function cell(c){ return '<td style=\\"padding:3px 10px;text-align:right;font-variant-numeric:tabular-nums\\">'+c+'</td>'; }\n` +
    `  function render(){\n` +
    `    var h='<table style=\\"border-collapse:collapse;font-size:13px;margin:0 auto\\"><thead><tr>';\n` +
    `    for(var c=0;c<COLS.length;c++){ h+='<th style=\\"padding:3px 10px;text-align:right;color:var(--mute);border-bottom:1px solid var(--line)\\">'+COLS[c]+'</th>'; }\n` +
    `    h+='</tr></thead><tbody>';\n` +
    `    for(var i=0;i<states.length;i++){ var last=(i===states.length-1);\n` +
    `      h+='<tr style=\\"'+(last?'background:color-mix(in srgb,var(--cyan) 16%,transparent)':'')+'\\">';\n` +
    `      var r=row(states[i]); for(var k=0;k<COLS.length;k++){ h+=cell(r[k]!=null?r[k]:''); } h+='</tr>'; }\n` +
    `    h+='</tbody></table>'; host.innerHTML=h;\n` +
    `    var ns=states.length-1, status;\n` +
    `    if(haltReason==='done') status='<b style=\\"color:var(--green)\\">finished</b> after '+ns+' step'+(ns===1?'':'s')+' \\u2014 the algorithm halted';\n` +
    `    else if(haltReason==='cap') status='stopped at the <b>step cap</b> ('+MAX+') \\u2014 this run did not terminate within the cap';\n` +
    `    else status=ns+' step'+(ns===1?'':'s')+' \\u00b7 press <b>Step</b>';\n` +
    `    var nt = hasNote ? note(states[states.length-1]) : '';\n` +
    `    out.innerHTML = status + (nt?(' &nbsp;\\u00b7&nbsp; '+nt):'');\n` +
    `    var sb=$('#${widgetId}-step'), rnb=$('#${widgetId}-run'); if(sb) sb.disabled=halted; if(rnb) rnb.disabled=halted;\n` +
    `  }\n` +
    `  var sb=$('#${widgetId}-step'); if(sb) sb.addEventListener('click',doStep);\n` +
    `  var rnb=$('#${widgetId}-run'); if(rnb) rnb.addEventListener('click',run);\n` +
    `  var rb=$('#${widgetId}-reset'); if(rb) rb.addEventListener('click',reset);\n` +
    `  reset();\n` +
    `})();\n` +
    `</script>`
  );
}
