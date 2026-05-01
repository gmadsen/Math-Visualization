# calabi-yau-hodge-diamond

Bespoke widget for the calabi-yau-manifolds topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Renders a Calabi-Yau Hodge diamond from sliders on h^{1,1} and h^{2,1} or one-click examples (quintic, mirror quintic, K3, elliptic curve), enforcing the diamond's symmetries automatically. Bespoke because the layout combines a CY-specific corner pattern, dimension-aware row hiding, and example-button preset state that no generic table widget captures.

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
{ "type": "widget",        "slug": "calabi-yau-hodge-diamond", "params": { ... } },
{ "type": "widget-script", "slug": "calabi-yau-hodge-diamond", "params": { ... } }
```

Both blocks carry the same `params` object.
