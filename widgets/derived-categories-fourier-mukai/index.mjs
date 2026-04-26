// derived-categories-fourier-mukai widget — bespoke passthrough registry entry.
//
// Exports two pure string-returning functions:
//
//   renderMarkup(params)  -> verbatim host <div class="widget" ...>…</div>
//   renderScript(params)  -> verbatim <script>…</script> bytes (or '' if absent)
//
// The widget body is irreducibly idiosyncratic (closures, scoped helpers,
// page-global library hooks), so its bytes are carried as ARTIFACT params
// (`bodyMarkup`, `bodyScript`) and returned verbatim. A non-HTML frontend
// that consumes the schema would discard these artifacts and re-render
// from its own data model.

export function renderMarkup(params) {
  return params.bodyMarkup;
}

export function renderScript(params) {
  return params.bodyScript || '';
}
