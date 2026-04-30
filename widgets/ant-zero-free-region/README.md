# ant-zero-free-region

Bespoke widget for the analytic-number-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke critical strip visualization with the classical zero-free region carved out of the right half-plane for the analytic-number-theory topic. The shape of the De la Vallée Poussin region against the critical line is too specific to fit a generic complex-domain plotter.

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
{ "type": "widget",        "slug": "ant-zero-free-region", "params": { ... } },
{ "type": "widget-script", "slug": "ant-zero-free-region", "params": { ... } }
```

Both blocks carry the same `params` object.
