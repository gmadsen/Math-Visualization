# numerical-fp-cancellation

Bespoke widget for the numerical-analysis topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Catastrophic cancellation visualizer: shows precision loss when subtracting nearby floating-point numbers.

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
{ "type": "widget",        "slug": "numerical-fp-cancellation", "params": { ... } },
{ "type": "widget-script", "slug": "numerical-fp-cancellation", "params": { ... } }
```

Both blocks carry the same `params` object.
