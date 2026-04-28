# expanders-vertex-expansion

Bespoke widget for the **vertex expansion explorer** (`w-expand`) on the
[`expanders`](../../expanders.html) topic.

See [`../README.md`](../README.md) for the registry contract (schema + pure
render functions) and the bespoke-vs-shared distinction. This module is on
the bespoke side — the gesture combo is unique on the page and isn't
absorbed by any existing shared slug.

## What it does

The widget combines three controls with a single behavioral story:

- a `<select>` picking the graph family (cycle, Petersen, 3-cube, $K_5$),
- an action `<button>` that clears the selected set $S$,
- a clickable `<svg>` of the graph layout: clicking a vertex toggles it
  in/out of $S$, and the readout shows $|N(S)|/|S|$.

`clickable-graph` covers click-on-SVG selection but rejects form controls in
markup; `parametric-plot` carries form controls but has no click-on-SVG
semantics. Rather than stretch either, this slug captures the triple as one
unit. The driving JS is opaque (per-graph layouts, the highlight pass, and
the $|N(S)|/|S|$ computation) so it travels in the `bodyScript` artifact
field.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | type                | purpose |
|---|---|---|
| `widgetId`       | string              | DOM id for the outer `<div class="widget">`. |
| `svgId`          | string              | DOM id for the host `<svg>`. |
| `outputId`       | string              | DOM id for the `<div class="readout">`. |
| `title`          | string              | Header title; also `<title>` of the `<svg>`. |
| `hint`           | string (optional)   | Short hint rendered next to the title. |
| `viewBox`        | string              | SVG `viewBox` (e.g. `"0 0 720 320"`). |
| `svgWidth`       | string \| number    | SVG `width` attr. |
| `svgHeight`      | string \| number    | SVG `height` attr. |
| `svgTitle`       | string (optional)   | Override for the `<title>` text inside the SVG. |
| `outputInitial`  | string (optional)   | Initial inner HTML of the readout (default `&nbsp;`). |
| `pick`           | object              | Graph chooser `<select>`: `{id, label, options:[{value,label,selected?}]}`. |
| `buttons`        | array               | Action buttons (e.g. clear): `[{id, label}]`. |
| `sectionComment` | string (optional, *artifact*) | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | string (*artifact*) | Verbatim IIFE body — wires controls + click handlers, computes $|N(S)|$. |

Fields marked *artifact* are source-byte preservation aids; portable
consumers ignore them and regenerate behavior from the structured fields
alone.

## Usage

Embed the widget by adding two blocks to `content/<topic>.json`:

```json
{ "type": "widget",        "slug": "expanders-vertex-expansion", "params": { ... } },
{ "type": "widget-script", "slug": "expanders-vertex-expansion", "params": { ... } }
```

Both blocks carry the **same** `params` object.

Then run `node scripts/rebuild.mjs --only widget-params` to AJV-validate the
params, and `node scripts/rebuild.mjs` for the full chain (including the
byte-identical round-trip gate).
