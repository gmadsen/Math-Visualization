# pde-classifier

Bespoke widget for the partial-differential-equations topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke discriminant calculator for the §1 classification figure on the partial-differential-equations topic — sliders for second-order PDE coefficients (A, B, C) feed a discriminant readout that classifies the equation as elliptic / parabolic / hyperbolic, with a small SVG diagramming characteristic curves. The slider-trio + classifier readout + characteristic-curve sketch combination doesn't fit any shared slug.

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
{ "type": "widget",        "slug": "pde-classifier", "params": { ... } },
{ "type": "widget-script", "slug": "pde-classifier", "params": { ... } }
```

Both blocks carry the same `params` object.
