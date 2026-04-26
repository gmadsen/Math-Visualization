// infinity-topoi-geometric-morphism widget — bespoke registry entry.
//
// Clickable adjunction diagram $f^* \dashv f_*$ with the two triangle identities, used in §4 of infinity-topoi.html (#geometric-morphisms-infty). Clicking an arrow ($f^*$, $f_*$, $\eta$, $\varepsilon$) or one of the triangle identities (T1, T2) updates a readout explaining its role.
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
