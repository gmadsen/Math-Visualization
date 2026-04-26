# grothendieck-topologies-sites-giraud

Bespoke registry entry for a script-less widget on `grothendieck-topologies-sites.html`. Carries
the widget's full `<div class="widget" id="…">…</div>` markup verbatim as an
artifact string so the byte-identical round-trip gate passes. There is no
paired `<script>` driving the widget — the markup alone is the full payload.

See [../README.md](../README.md) for the registry contract and the
bespoke-vs-shared distinction.

## Params

See [`schema.json`](./schema.json) for the authoritative shape.

| field | type | purpose |
|---|---|---|
| `widgetId` | string | DOM id of the outer `<div class="widget">` wrapper (mirrored inside `bodyMarkup`). |
| `bodyMarkup` | string (artifact) | Verbatim widget HTML (full outer div). |

## Usage

Embed a single `widget` block into `content/grothendieck-topologies-sites.json` (no
widget-script sibling, since the widget is script-less). A portable
React/Three.js consumer would discard the artifact and re-implement the
widget in its own renderer.
