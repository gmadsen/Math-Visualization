// galois-quintic-unsolvability widget — bespoke registry entry for the
// MVProofScrubber-driven walkthrough in galois.html §6 (#quintic).
//
// Exports two pure string-returning functions:
//
//   renderMarkup(params)  -> <div class="widget" id="..."></div>
//   renderScript(params)  -> verbatim <script>…</script> bytes
//
// renderMarkup emits an empty host div — the page-global MVProofScrubber
// library builds the chrome (slider, play button, step chips, SVG, readout)
// at init time inside it. renderScript returns the `bodyScript` artifact
// verbatim; that artifact already includes the leading newline + <script>
// tags and the trailing </script>, so the round-trip is byte-identical.
//
// Why bespoke (rather than reusing the shared `proof-scrubber` slug):
// the script's per-step `render(svg)` callbacks close over a shared
// `drawFrame(svg, opts)` helper and emit live SVG nodes via a scoped
// `S(tag, attrs)` factory. The shared `proof-scrubber` slug expects
// pure-data steps (`{title, body, svgInner}`), where each diagram is a
// static SVG-fragment string. Refactoring the closures into per-step
// SVG strings would change the runtime behaviour (no shared helper, no
// keyboard nav) and the byte output. Carrying the IIFE as a bodyScript
// artifact preserves both.

export function renderMarkup(params) {
  const { widgetId } = params;
  return `<div class="widget" id="${widgetId}"></div>`;
}

export function renderScript(params) {
  const { bodyScript } = params;
  return bodyScript;
}
