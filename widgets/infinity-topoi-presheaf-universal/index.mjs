// infinity-topoi-presheaf-universal widget — bespoke registry entry.
//
// Bespoke proof-scrubber walkthrough of the universal property of $\mathcal{P}(C) = \mathrm{Fun}(C^{\mathrm{op}}, \mathcal{S})$ as the free cocompletion of a small $\infty$-category, used in §1 of infinity-topoi.html (#presheaf-infty-topos). The widget mounts an empty host div and the page-global MVProofScrubber library builds chrome inside it.
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
