// group-schemes-hopf-duality widget — bespoke registry entry.
//
// Clickable Cartier-duality diagram between affine commutative group schemes and Hopf algebras, used in §3 of group-schemes.html (#hopf-algebra).
//
// renderMarkup wraps the bodyMarkup artifact in the standard
//   <div class="widget" id="…">…</div>
// shell; renderScript returns the bodyScript artifact verbatim (including
// the leading newline + <script> tags and the trailing </script>) so the
// byte-identical round-trip gate passes. A portable React/Three.js consumer
// would discard both artifacts and re-implement the widget in its own
// renderer.

export function renderMarkup(params) {
  const { widgetId, bodyMarkup } = params;
  return `<div class="widget" id="${widgetId}">\n${bodyMarkup}\n</div>`;
}

export function renderScript(params) {
  const { bodyScript } = params;
  return bodyScript;
}
