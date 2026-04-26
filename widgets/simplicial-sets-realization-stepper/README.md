# simplicial-sets-realization-stepper

Five-step prev/next walkthrough of the geometric realization |Δ²|. Used in §3 of simplicial-sets-and-nerve.html.

This is a **bespoke** registry entry: the widget's inner markup and script
body are both irreducibly idiosyncratic (per-step draw closures, custom hit
geometry, narrative explanation strings), so they are carried as
`bodyMarkup` and `bodyScript` artifacts. Both are preserved byte-for-byte
so the round-trip gate passes; a portable React/Three.js consumer would
discard the artifacts and re-implement the diagram in its own renderer.

See [../README.md](../README.md) for the registry contract and the
bespoke-vs-shared distinction.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `bodyMarkup` | string (artifact) | Verbatim inner HTML for the widget body. |
| `bodyScript` | string (artifact) | Verbatim `<script>…</script>` bytes (with leading newline). |

## Usage

Embed two blocks (widget + widget-script) into `content/simplicial-sets-and-nerve.json`,
both carrying the same params object.
