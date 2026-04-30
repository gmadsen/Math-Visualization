# fol-dlo-quantifier-elimination

Bespoke widget for the first-order-logic-and-completeness topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke quantifier-elimination demo in dense linear orders for the first-order-logic-and-completeness topic. Steps through the QE algorithm on sample DLO formulas, which doesn't fit any shared slug.

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
{ "type": "widget",        "slug": "fol-dlo-quantifier-elimination", "params": { ... } },
{ "type": "widget-script", "slug": "fol-dlo-quantifier-elimination", "params": { ... } }
```

Both blocks carry the same `params` object.
