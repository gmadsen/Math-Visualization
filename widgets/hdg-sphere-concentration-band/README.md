# hdg-sphere-concentration-band

Bespoke widget for the high-dimensional-geometry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for §1 sphere concentration on the high-dimensional-geometry topic — slider over dimension n drives an SVG plot of the Lévy concentration tail bound 2 exp(-(n-1) t^2 / 2) collapsing toward t=0, with a readout reporting the tail at a fixed t. The single-slider + svg + readout shape is shared by several siblings on this page but the tail-formula plot logic is bespoke.

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
{ "type": "widget",        "slug": "hdg-sphere-concentration-band", "params": { ... } },
{ "type": "widget-script", "slug": "hdg-sphere-concentration-band", "params": { ... } }
```

Both blocks carry the same `params` object.
