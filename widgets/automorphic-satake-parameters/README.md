# automorphic-satake-parameters

Bespoke widget for the automorphic-forms-adelic topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Satake parameter explorer for the automorphic-forms-adelic topic. A slider for the Hecke eigenvalue a_p combined with two select dropdowns for the local component drives an SVG that places the unique-up-to-swap Satake parameters (alpha_p, beta_p) on the unit circle. The slider-plus-two-selects-plus-circle-diagram tri-input layout is specific to the Satake correspondence and does not fit parametric-plot.

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
{ "type": "widget",        "slug": "automorphic-satake-parameters", "params": { ... } },
{ "type": "widget-script", "slug": "automorphic-satake-parameters", "params": { ... } }
```

Both blocks carry the same `params` object.
