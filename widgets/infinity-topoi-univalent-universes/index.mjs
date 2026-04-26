// infinity-topoi-univalent-universes widget — bespoke registry entry.
//
// Clickable diagram of universe hierarchy + univalence axiom in homotopy type theory, used in §6 of infinity-topoi.html (#internal-logic). Click a piece (universe, type former, identity type, univalence) to reveal its meaning.
//
// renderMarkup emits an empty host div — the page-global library (or the
// IIFE inside bodyScript) builds the widget chrome inside it at runtime.
// renderScript returns the bodyScript artifact verbatim (including the
// leading newline + <script> tags and the trailing </script>) so the
// byte-identical round-trip gate passes. A portable React/Three.js consumer
// would discard the artifact and re-implement the widget in its own
// renderer.

export function renderMarkup(params) {
  const { widgetId } = params;
  return `<div class="widget" id="${widgetId}"></div>`;
}

export function renderScript(params) {
  const { bodyScript } = params;
  return bodyScript;
}
