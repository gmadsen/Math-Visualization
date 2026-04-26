# algebraic-spaces-definition-diagram

Clickable diagram of Knutson's definition of an algebraic space as a sheaf $X$ on $\mathrm{Sch}_{\text{ét}}$ with an étale surjection $U \to X$ from a scheme such that $U \times_X U$ is a scheme, used in §3 of algebraic-spaces.html (#definition).

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
