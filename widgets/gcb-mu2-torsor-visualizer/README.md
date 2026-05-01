# gcb-mu2-torsor-visualizer

Bespoke widget for the galois-cohomology-and-brauer topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for §2 of galois-cohomology-and-brauer: pick a square-class twist d in Q^x/(Q^x)^2, see the corresponding principal mu_2-torsor over Spec Q rendered as an etale double cover (two sheets, swapped by Galois). Shape: select + bespoke SVG bundle diagram + readout + bracketing prose. Doesn't fit any shared slug.

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
{ "type": "widget",        "slug": "gcb-mu2-torsor-visualizer", "params": { ... } },
{ "type": "widget-script", "slug": "gcb-mu2-torsor-visualizer", "params": { ... } }
```

Both blocks carry the same `params` object.
