// cocartesian-fibrations-edge-scrubber widget — bespoke passthrough registry entry.
//
// Exports two pure string-returning functions:
//
//   renderMarkup(params)  -> verbatim host <div class="widget" ...>
//   renderScript(params)  -> verbatim <script>…</script> bytes
//
// The widget body is rendered by a page-global library (or is purely
// declarative SVG) — the bytes are irreducibly per-widget, so this
// module carries them as ARTIFACT params (`bodyMarkup`, `bodyScript`) and
// returns them verbatim. A non-HTML frontend that consumes the schema
// would discard these artifacts and re-render from its own data model.

export function renderMarkup(params) {
  return params.bodyMarkup;
}

export function renderScript(params) {
  return params.bodyScript || '';
}
