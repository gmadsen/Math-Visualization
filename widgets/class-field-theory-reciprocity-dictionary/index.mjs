// class-field-theory-reciprocity-dictionary widget — bespoke registry entry
// for the static "reciprocity dictionary" two-column display used in
// class-field-theory.html §9 (#beyond).
//
// renderMarkup wraps the bodyMarkup artifact in the standard
//   <div class="widget" id="…">…</div>
// shell; renderScript returns '' because this widget has no driving script
// (the original inline block stored `script: null`).
//
// The bodyMarkup carries the exact bytes of the widget body — the .hd
// header, the .dict grid entries, and the trailing .small footnote — so the
// byte-identical round-trip gate passes. A portable React/Three.js consumer
// would parse the bodyMarkup into a structured `{rows: [{lhs, rhs}], note}`
// shape and re-render in its own component if required.

export function renderMarkup(params) {
  const { widgetId, bodyMarkup } = params;
  return `<div class="widget" id="${widgetId}">\n${bodyMarkup}\n</div>`;
}

export function renderScript(_params) {
  return '';
}
