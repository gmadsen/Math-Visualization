# algebraic-spaces-morphisms-diagram

Clickable diagram of morphisms of algebraic spaces $f\colon X \to Y$ — étale, smooth, proper, separated — and how to check each property via étale charts, used in §4 of algebraic-spaces.html (#morphisms).

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

Embed two blocks (widget + widget-script) into `content/algebraic-spaces.json`,
both carrying the same params object.
