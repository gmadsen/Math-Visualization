# fol-model-checker

Bespoke widget for the first-order-logic-and-completeness topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke binary-relation model checker for the first-order-logic-and-completeness topic. Lets the reader toggle edges in a tiny structure and watch a chosen FOL formula's truth value, which doesn't fit any shared evaluator slug.

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
{ "type": "widget",        "slug": "fol-model-checker", "params": { ... } },
{ "type": "widget-script", "slug": "fol-model-checker", "params": { ... } }
```

Both blocks carry the same `params` object.
