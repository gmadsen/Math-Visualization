// heyting-algebras-toposes-heyting-clickable widget — bespoke registry entry. Pure passthrough of the
// authored HTML + script bytes so the byte-identical round-trip gate passes.
//
// renderMarkup(params) -> params.bodyMarkup (full <div class="widget" …>…</div>)
// renderScript(params) -> params.bodyScript (verbatim)
//
// A portable React/Three.js consumer would discard both artifacts and
// re-implement the widget from the schema alone.

export function renderMarkup(params) {
  return params.bodyMarkup;
}

export function renderScript(params) {
  return params.bodyScript;
}
