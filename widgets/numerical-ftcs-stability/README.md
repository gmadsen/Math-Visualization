# numerical-ftcs-stability

Bespoke widget for the numerical-analysis topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

FTCS heat scheme stability explorer: visualizes stable vs. unstable regimes via the CFL parameter.

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
{ "type": "widget",        "slug": "numerical-ftcs-stability", "params": { ... } },
{ "type": "widget-script", "slug": "numerical-ftcs-stability", "params": { ... } }
```

Both blocks carry the same `params` object.
