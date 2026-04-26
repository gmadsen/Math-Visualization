// simplicial-sets-delta-generators widget — bespoke registry entry.
//
// Clickable diagram of cofaces dⁱ (inject, miss i) and codegeneracies sⁱ (surject, double i) between four columns [0],[1],[2],[3]. Used in §1 of simplicial-sets-and-nerve.html.
//
// renderMarkup wraps the bodyMarkup artifact in the standard
//   <div class="widget" id="…">…</div>
// shell; renderScript returns the bodyScript artifact verbatim (including
// the leading newline + <script> tags and the trailing </script>) so the
// byte-identical round-trip gate passes. A portable React/Three.js consumer
// would discard both artifacts and re-implement the diagram in its own
// renderer.

export function renderMarkup(params) {
  const { widgetId, bodyMarkup } = params;
  return `<div class="widget" id="${widgetId}">\n${bodyMarkup}\n</div>`;
}

export function renderScript(params) {
  const { bodyScript } = params;
  return bodyScript;
}
