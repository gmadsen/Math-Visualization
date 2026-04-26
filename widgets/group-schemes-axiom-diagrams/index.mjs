// group-schemes-axiom-diagrams widget — bespoke registry entry.
//
// Clickable commutative diagrams for the three group-scheme axioms (associativity, identity, inverse) as morphisms of schemes, used in §1 of group-schemes.html (#group-scheme-definition). Click a diagram to read off its diagrammatic meaning.
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
