# stochastic-calc-ito-formula-bsq

Bespoke widget for the stochastic-calculus topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Compare B_t^2 and the naive 2 integral B dB to expose the missing dt drift from Ito's formula.

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
{ "type": "widget",        "slug": "stochastic-calc-ito-formula-bsq", "params": { ... } },
{ "type": "widget-script", "slug": "stochastic-calc-ito-formula-bsq", "params": { ... } }
```

Both blocks carry the same `params` object.
