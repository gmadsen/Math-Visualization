# k-theory-grothendieck-builder

Bespoke widget for the k-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Reader builds elements of K^0(X) by adding/subtracting line bundles on a curve, P^1, or P^2 — interactive Grothendieck-group construction.

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
{ "type": "widget",        "slug": "k-theory-grothendieck-builder", "params": { ... } },
{ "type": "widget-script", "slug": "k-theory-grothendieck-builder", "params": { ... } }
```

Both blocks carry the same `params` object.
