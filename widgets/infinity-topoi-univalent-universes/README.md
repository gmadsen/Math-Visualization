# infinity-topoi-univalent-universes

Clickable diagram of universe hierarchy + univalence axiom in homotopy type theory, used in §6 of infinity-topoi.html (#internal-logic). Click a piece (universe, type former, identity type, univalence) to reveal its meaning.

This is a **bespoke** registry entry: the widget script is irreducibly
idiosyncratic (per-widget closures, narrative strings, custom hit geometry)
and is carried verbatim as the `bodyScript` artifact. Both are
preserved byte-for-byte so the round-trip gate passes; a portable
React/Three.js consumer would discard the artifact and re-implement
the widget in its own renderer.

See [../README.md](../README.md) for the registry contract and the
bespoke-vs-shared distinction.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id for the empty host `<div class="widget">`. |
| `bodyScript` | string (artifact) | Verbatim `<script>…</script>` bytes (with leading newline). Preserved byte-for-byte. |

## Usage

Embed two blocks (widget + widget-script) into `content/infinity-topoi.json`,
both carrying the same params object.
