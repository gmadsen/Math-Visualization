# mostow-rigidity-dial

Bespoke widget for the mostow-rigidity topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §1 rigidity-dial figure on the mostow-rigidity topic — sliders for dimension n and a deformation parameter feed an SVG that flips between rigid (n>=3) and flexible (n=2) regimes with a textual readout of where deformation can live.

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
{ "type": "widget",        "slug": "mostow-rigidity-dial", "params": { ... } },
{ "type": "widget-script", "slug": "mostow-rigidity-dial", "params": { ... } }
```

Both blocks carry the same `params` object.
