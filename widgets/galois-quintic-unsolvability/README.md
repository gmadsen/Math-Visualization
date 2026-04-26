# galois-quintic-unsolvability

Bespoke proof-scrubber walkthrough used in `galois.html` §6 (`#quintic`). The
widget mounts an empty host div, then the page-global `MVProofScrubber`
library builds the slider / play / SVG diagram / readout chrome at runtime.
Each of the seven proof steps is rendered by a closure over a shared
`drawFrame(svg, opts)` helper; the closures emit live SVG nodes via a scoped
`S(tag, attrs)` factory rather than dropping in static SVG-fragment strings.

This is **not** a candidate for the shared `proof-scrubber` slug because
that slug expects pure-data steps (`{title, body, svgInner: "<svg-string>"}`)
and would lose the keyboard-arrow navigation hook plus the shared draw
helper. Carrying the entire IIFE as a `bodyScript` artifact is the only way
to preserve both runtime behaviour and byte-identical round-trip.

See [../README.md](../README.md) for the registry contract and the
bespoke-vs-shared distinction.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the empty host `<div class="widget">`. The library reads this selector and builds chrome inside it. |
| `bodyScript` | string (artifact) | Verbatim script bytes including the leading `\n<script>` and trailing `</script>`. Contains the IIFE that builds the SVG helper, NODES/EDGES tables, the per-step `render(svg)` closures, keyboard wiring, and the `MVProofScrubber.init` call. Preserved byte-for-byte. |

## Usage

Embed the widget by adding two blocks to `content/galois.json`:

```json
{ "type": "widget",        "slug": "galois-quintic-unsolvability", "params": { "widgetId": "w-quintic-scrub", "bodyScript": "…" } },
{ "type": "widget-script", "slug": "galois-quintic-unsolvability", "params": { "widgetId": "w-quintic-scrub", "bodyScript": "…" } }
```

A portable React/Three.js consumer would discard `bodyScript` and re-encode
the seven proof steps in its own renderer.
