# gcb-central-extension-browser

Bespoke widget for the galois-cohomology-and-brauer topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for §3 of galois-cohomology-and-brauer: pick a representative central extension (V_4, C_4, Q_8 Schur cover, binary alternating, Heisenberg), the SVG draws the short exact sequence and labels the cocycle class. Shape: select + bespoke SVG of an extension diagram + readout + prose. Doesn't fit any shared slug.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (controls, SVG, readouts). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body. |

## Usage

```json
{ "type": "widget",        "slug": "gcb-central-extension-browser", "params": { ... } },
{ "type": "widget-script", "slug": "gcb-central-extension-browser", "params": { ... } }
```

Both blocks carry the same `params` object.
