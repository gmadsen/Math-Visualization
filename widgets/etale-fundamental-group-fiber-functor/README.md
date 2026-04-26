# etale-fundamental-group-fiber-functor

Bespoke registry entry for a widget on `etale-fundamental-group.html`. Carries the
widget's full `<div class="widget" id="…">…</div>` markup and its driving
`<script>` tag verbatim as artifact strings so the byte-identical round-trip
gate passes. The widget closes over topic-specific data shapes that don't
generalize to a shared family slug, so the bytes are preserved as-is rather
than re-encoded into structured params.

See [../README.md](../README.md) for the registry contract and the
bespoke-vs-shared distinction.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id of the outer `<div class="widget">` wrapper (mirrored inside `bodyMarkup`). |
| `bodyMarkup` | string (artifact) | Verbatim widget HTML (full outer div). |
| `bodyScript` | string (artifact) | Verbatim driving-script bytes. May include a leading newline or other separating whitespace before the opening `<script>`. |

## Usage

Embed two blocks (widget + widget-script) into `content/etale-fundamental-group.json`,
both carrying the same params object. A portable React/Three.js consumer
would discard the artifacts and re-implement the widget in its own renderer.
