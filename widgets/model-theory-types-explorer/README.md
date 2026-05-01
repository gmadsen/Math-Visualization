# model-theory-types-explorer

Bespoke widget for the model-theory-basics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Types explorer for the model-theory-basics topic: lets the reader pick a parameter set and a candidate formula list to test whether it forms a (consistent) complete type, illustrating the Stone space of types over a model.

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
{ "type": "widget",        "slug": "model-theory-types-explorer", "params": { ... } },
{ "type": "widget-script", "slug": "model-theory-types-explorer", "params": { ... } }
```

Both blocks carry the same `params` object.
