# stochastic-calc-girsanov-density

Bespoke widget for the stochastic-calculus topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Visualize Girsanov change of measure: density of B_T under P versus Q for chosen drift theta.

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
{ "type": "widget",        "slug": "stochastic-calc-girsanov-density", "params": { ... } },
{ "type": "widget-script", "slug": "stochastic-calc-girsanov-density", "params": { ... } }
```

Both blocks carry the same `params` object.
