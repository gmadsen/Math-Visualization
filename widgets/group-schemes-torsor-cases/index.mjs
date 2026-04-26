// group-schemes-torsor-cases widget — bespoke registry entry.
//
// Curated case library of $G$-torsors (trivial, étale-locally trivial, non-trivial in $H^1_{\text{ét}}$) used in §6 of group-schemes.html (#torsors). Selecting a case updates a readout describing its triviality status and reference cohomology class.
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
