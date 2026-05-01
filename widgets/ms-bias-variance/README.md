# ms-bias-variance

Bespoke widget for the mathematical-statistics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bias-variance tradeoff explorer with sliders over sample size and shrinkage.

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
{ "type": "widget",        "slug": "ms-bias-variance", "params": { ... } },
{ "type": "widget-script", "slug": "ms-bias-variance", "params": { ... } }
```

Both blocks carry the same `params` object.
