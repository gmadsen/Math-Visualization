// infinity-topoi-giraud-axioms widget — bespoke registry entry.
//
// Clickable list of the four $\infty$-Giraud axioms (presentability, universal coproducts, descent for groupoid objects, effective groupoids) used in §3 of infinity-topoi.html (#giraud-infty). Click an axiom to see its statement and a sketch of how presheaf $\infty$-topoi satisfy it.
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
