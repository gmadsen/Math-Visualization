# resolution-cusp-node-visualizer

Bespoke widget for the resolution-of-singularities topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Cusp/node visualizer for plane curve singularities — toggles between cusp y^2=x^3 and node y^2=x^2(x+1) with Jacobian readout

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
{ "type": "widget",        "slug": "resolution-cusp-node-visualizer", "params": { ... } },
{ "type": "widget-script", "slug": "resolution-cusp-node-visualizer", "params": { ... } }
```

Both blocks carry the same `params` object.
