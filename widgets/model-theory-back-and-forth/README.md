# model-theory-back-and-forth

Bespoke widget for the model-theory-basics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Cantor's back-and-forth widget for the model-theory-basics topic: animates round-by-round construction of a partial isomorphism between two countable dense linear orders without endpoints, the prototypical proof technique that elementary equivalence + countability + saturation forces isomorphism.

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
{ "type": "widget",        "slug": "model-theory-back-and-forth", "params": { ... } },
{ "type": "widget-script", "slug": "model-theory-back-and-forth", "params": { ... } }
```

Both blocks carry the same `params` object.
