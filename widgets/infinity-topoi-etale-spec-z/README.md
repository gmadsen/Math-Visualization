# infinity-topoi-etale-spec-z

Clickable diagram of the étale $\infty$-topos of $\mathrm{Spec}\,\mathbb{Z}$ — closed points, generic point, geometric points, and étale neighbourhoods — used in §7 of infinity-topoi.html (#etale-infty-topos).

This is a **bespoke** registry entry: the widget script is irreducibly
idiosyncratic (per-widget closures, narrative strings, custom hit geometry)
and is carried verbatim as the `bodyMarkup` + `bodyScript` artifact pair. Both are
preserved byte-for-byte so the round-trip gate passes; a portable
React/Three.js consumer would discard the artifacts and re-implement
the widget in its own renderer.

See [../README.md](../README.md) for the registry contract and the
bespoke-vs-shared distinction.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the outer `<div class="widget">` wrapper. |
| `bodyMarkup` | string (artifact) | Verbatim inner HTML for the widget body. Preserved byte-for-byte. |
| `bodyScript` | string (artifact) | Verbatim `<script>…</script>` bytes (with leading newline). Preserved byte-for-byte. |

## Usage

Embed two blocks (widget + widget-script) into `content/infinity-topoi.json`,
both carrying the same params object.
