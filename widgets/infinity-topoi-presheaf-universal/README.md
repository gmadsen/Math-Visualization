# infinity-topoi-presheaf-universal

Bespoke proof-scrubber walkthrough of the universal property of $\mathcal{P}(C) = \mathrm{Fun}(C^{\mathrm{op}}, \mathcal{S})$ as the free cocompletion of a small $\infty$-category, used in §1 of infinity-topoi.html (#presheaf-infty-topos). The widget mounts an empty host div and the page-global MVProofScrubber library builds chrome inside it.

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
