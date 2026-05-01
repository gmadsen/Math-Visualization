# lie-algebras-weight-diagram

Bespoke widget for the lie-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke weight-diagram explorer for the irreducible sl_2 representation V_n: a slider sets n in 0..8, and clicking a weight reveals the e/f raising-lowering action plus the Casimir scalar n(n+2)/2. Bespoke because the layout is a one-dimensional weight string with bespoke click-to-explain action arrows tied to sl_2 specifically.

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
{ "type": "widget",        "slug": "lie-algebras-weight-diagram", "params": { ... } },
{ "type": "widget-script", "slug": "lie-algebras-weight-diagram", "params": { ... } }
```

Both blocks carry the same `params` object.
