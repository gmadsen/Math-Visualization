# clickable-graph

Shared widget module for the `clickable-graph` family — **9 widgets across 8
topics** that all share the same UX signature: an SVG host with clickable
elements (nodes, regions, arrows) instead of sliders / selects / buttons. The
user clicks (or, in a few widgets, drags) directly on the SVG diagram and the
readout updates.

Examples in the corpus: `w-adele @ adeles-and-ideles`, `w-clsvis @
class-field-theory`, `w-compare @ functor-of-points`, `w-chain @
modularity-and-flt`, `w-scale @ probability-theory`, `w-charts @
projective-plane`, `w-classgroup @ quadratic-forms-genus-theory`, and `w-spec`
+ `w-glue @ schemes`.

See [../README.md](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction. This module is on the
shared side.

## What it does

Every member of the family follows the same shell:

- one `<svg>` host with a `viewBox`, where the diagram is drawn,
- zero form controls in the markup (no `<select>`, no `<input>`, no
  `<button>`),
- an optional `<div class="readout">` beside the SVG that reflects the last
  click,
- a driving IIFE that attaches a `click` (or `pointerdown`) handler to the
  SVG or to individual `<g>` hotspots, and responds by one of three UX
  contracts captured in `clickAction`:

  - `"highlight"` — permanently highlights the clicked node + its transitive
    dependency set, recolors edges accordingly; re-clicking the same node
    clears the highlight.
  - `"toggle"` — flips a node's selection on/off; multiple nodes may be
    active at once.
  - `"reveal"` — exposes extra data (reasoning text, alternate viewpoint) for
    the clicked node; typically a single-selection UX.

Because the driving logic is highly idiosyncratic per widget (transitive
closure, stereographic projection, drag handling, bespoke painters), the JS
body is carried verbatim in the `bodyScript` artifact field. A portable
consumer (React, SSR, any non-HTML frontend) can ignore `bodyScript` and
drive its own renderer from the structured `nodes` / `edges` / `readoutMap`
/ `clickAction` fields — the schema alone carries enough information to
reconstruct the highlight / toggle / reveal UX.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field                | type                     | purpose |
|---|---|---|
| `widgetId`           | string                   | DOM id for the outer `<div class="widget">` wrapper. |
| `svgId`              | string                   | DOM id for the host `<svg>` element. |
| `viewBox`            | string                   | SVG `viewBox` attribute (e.g. `"0 0 820 400"`). |
| `svgWidthAttr`       | string (optional, *artifact*) | Raw `width=…` attr value on the `<svg>`; omitted when absent. |
| `svgHeightAttr`      | string (optional, *artifact*) | Raw `height=…` attr value on the `<svg>`; omitted when absent. |
| `title`              | string                   | Display title rendered in `.hd > .ttl` and the SVG `<title>`. |
| `hint`               | string (optional)        | Short hint rendered next to the title. |
| `nodes`              | array (optional)         | Clickable vertices: `[{id, label?, x?, y?, kind?}]`. |
| `edges`              | array (optional)         | Directed edges between nodes: `[{id?, src, tgt, label?, curve?, kind?}]`. |
| `initialSelection`   | string (optional)        | Pre-selected node id on mount. |
| `clickAction`        | `"highlight"\|"toggle"\|"reveal"` | Required UX contract. |
| `readoutId`          | string (optional)        | DOM id for the `<div class="readout">` companion. |
| `initialReadoutHtml` | string (optional, *artifact*) | Raw HTML placed inside the readout on first render. |
| `readoutMap`         | object (optional)        | Portable `{<nodeId>: readoutText}` — the string displayed per selection. |
| `bodyScript`         | string (*artifact*)      | Required. Verbatim body of the driving IIFE. |
| `sectionComment`     | string (optional, *artifact*) | Optional JS block comment placed immediately after `<script>`. |

Fields marked *artifact* are source-byte preservation aids: they let
`renderScript` reproduce the legacy inline source byte-for-byte through the
round-trip gate (`scripts/test-roundtrip.mjs`). A portable consumer ignores
them and regenerates behavior from the structured data alone.

## Usage

Embed the widget by adding two blocks to `content/<topic>.json`:

```json
{ "type": "widget",        "slug": "clickable-graph", "params": { ... } },
{ "type": "widget-script", "slug": "clickable-graph", "params": { ... } }
```

Both blocks carry the **same** `params` object (the markup renderer uses the
markup-relevant fields, the script renderer uses `bodyScript` /
`sectionComment`).

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the
params against this widget's schema, and `node scripts/rebuild.mjs` for the
full chain (including the byte-identical round-trip gate).
