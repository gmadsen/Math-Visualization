# variational-sphere-geodesic

Bespoke widget for the variational-methods topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Geodesic on the sphere — minimise arc-length between two fixed points; reader perturbs an interpolating curve and sees the great-circle arc emerge as the energy minimiser.

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
{ "type": "widget",        "slug": "variational-sphere-geodesic", "params": { ... } },
{ "type": "widget-script", "slug": "variational-sphere-geodesic", "params": { ... } }
```

Both blocks carry the same `params` object.
