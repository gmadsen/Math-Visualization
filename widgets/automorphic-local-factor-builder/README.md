# automorphic-local-factor-builder

Bespoke widget for the automorphic-forms-adelic topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke local-Euler-factor builder for the automorphic-forms-adelic topic. A range slider over s combined with per-place toggle controls assembles partial Euler products place by place to display L(s, pi). The slider-plus-toggle-list-plus-product-readout layout is specific to assembling automorphic L-functions and does not fit parametric-plot.

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
{ "type": "widget",        "slug": "automorphic-local-factor-builder", "params": { ... } },
{ "type": "widget-script", "slug": "automorphic-local-factor-builder", "params": { ... } }
```

Both blocks carry the same `params` object.
