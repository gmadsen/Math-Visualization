# group-schemes-etale-connected-decomposition

Graph rendering of the étale/connected decomposition $1 \to G^\circ \to G \to \pi_0(G) \to 1$ for finite group schemes over a field, used in §4 of group-schemes.html (#etale-vs-connected).

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

Embed two blocks (widget + widget-script) into `content/group-schemes.json`,
both carrying the same params object.
