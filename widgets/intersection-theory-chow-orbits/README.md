# intersection-theory-chow-orbits

Bespoke registry entry for the `w-chow-orbits` widget on
`intersection-theory-chow.html`. Carries the widget's full `<div class="widget" id="…">…</div>`
markup and its driving `<script>` tag verbatim as artifact strings so the
byte-identical round-trip gate passes. The widget closes over topic-specific
data shapes that don't generalize to a shared family slug, so the bytes are
preserved as-is rather than re-encoded into structured params.

See [../README.md](../README.md) for the registry contract and the
bespoke-vs-shared distinction.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id of the outer `<div class="widget">` wrapper (mirrored inside `bodyMarkup`). |
| `bodyMarkup` | string (artifact) | Verbatim widget HTML (full outer div). |
| `bodyScript` | string (artifact) | Verbatim `<script>…</script>` bytes. |

## Usage

Embed two blocks (widget + widget-script) into `content/intersection-theory-chow.json`,
both carrying the same params object. A portable React/Three.js consumer
would discard the artifacts and re-implement the widget in its own renderer.
