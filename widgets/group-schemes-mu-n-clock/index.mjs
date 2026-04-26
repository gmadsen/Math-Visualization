// group-schemes-mu-n-clock widget — bespoke registry entry.
//
// Modular-arithmetic clock visualizing $\mu_n(\mathbb{C}) = \{\zeta : \zeta^n = 1\}$ as the $n$-th roots of unity under multiplication, used in §2 of group-schemes.html (#examples-Ga-Gm).
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
