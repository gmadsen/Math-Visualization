# hdg-talagrand-deviation

Bespoke widget for the high-dimensional-geometry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for §4 Talagrand's inequality on the high-dimensional-geometry topic — slider over n + resample button comparing Hamming-Lipschitz vs convex-Lipschitz deviation tails on the hypercube via Monte Carlo, drawn as side-by-side histograms in an SVG with a readout summary.

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
{ "type": "widget",        "slug": "hdg-talagrand-deviation", "params": { ... } },
{ "type": "widget-script", "slug": "hdg-talagrand-deviation", "params": { ... } }
```

Both blocks carry the same `params` object.
