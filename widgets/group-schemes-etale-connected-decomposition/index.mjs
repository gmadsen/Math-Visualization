// group-schemes-etale-connected-decomposition widget — bespoke registry entry.
//
// Graph rendering of the étale/connected decomposition $1 \to G^\circ \to G \to \pi_0(G) \to 1$ for finite group schemes over a field, used in §4 of group-schemes.html (#etale-vs-connected).
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
