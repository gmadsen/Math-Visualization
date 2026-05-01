# model-theory-equivalence-prober

Bespoke widget for the model-theory-basics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Equivalence prober for the model-theory-basics topic: walks through example sentences distinguishing isomorphic vs elementarily equivalent structures, showing how (Q,<) and (R,<) satisfy the same first-order theory despite differing in cardinality.

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
{ "type": "widget",        "slug": "model-theory-equivalence-prober", "params": { ... } },
{ "type": "widget-script", "slug": "model-theory-equivalence-prober", "params": { ... } }
```

Both blocks carry the same `params` object.
