# calabi-yau-canonical-degree

Bespoke widget for the calabi-yau-manifolds topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Visualizes the adjunction formula K_X = O(d-n-1)|_X for hypersurfaces in P^n: sliders for ambient dimension n and degree d highlight when d=n+1 makes K_X trivial. Bespoke because the diagram pairs a custom 1D bundle-degree axis with a live Calabi-Yau verdict that no shared widget renders.

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
{ "type": "widget",        "slug": "calabi-yau-canonical-degree", "params": { ... } },
{ "type": "widget-script", "slug": "calabi-yau-canonical-degree", "params": { ... } }
```

Both blocks carry the same `params` object.
