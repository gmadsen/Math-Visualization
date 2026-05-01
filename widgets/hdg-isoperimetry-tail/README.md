# hdg-isoperimetry-tail

Bespoke widget for the high-dimensional-geometry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for §5 Gaussian isoperimetry on the high-dimensional-geometry topic — slider over dimension n drives an SVG comparison of the Gaussian halfspace tail Φ(-t) vs the spherical cap measure σ({x : x_1 > t}) on S^{n-1}, with a readout showing the absolute difference. Single slider + svg + readout.

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
{ "type": "widget",        "slug": "hdg-isoperimetry-tail", "params": { ... } },
{ "type": "widget-script", "slug": "hdg-isoperimetry-tail", "params": { ... } }
```

Both blocks carry the same `params` object.
