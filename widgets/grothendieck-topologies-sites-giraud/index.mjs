// grothendieck-topologies-sites-giraud widget — bespoke registry entry. Script-less: the page
// renders the markup verbatim and the topic JSON does not emit a paired
// widget-script block. renderScript exists so the registry contract is
// uniform but is unreachable for this slug.
//
// renderMarkup(params) -> params.bodyMarkup (full <div class="widget" …>…</div>)
//
// A portable React/Three.js consumer would discard the artifact and
// re-implement the widget from the schema alone.

export function renderMarkup(params) {
  return params.bodyMarkup;
}

export function renderScript(_params) {
  return '';
}
