// algebraic-spaces-definition-diagram widget — bespoke registry entry.
//
// Clickable diagram of Knutson's definition of an algebraic space as a sheaf $X$ on $\mathrm{Sch}_{\text{ét}}$ with an étale surjection $U \to X$ from a scheme such that $U \times_X U$ is a scheme, used in §3 of algebraic-spaces.html (#definition).
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
