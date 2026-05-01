# model-theory-signature-explorer

Bespoke widget for the model-theory-basics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Signature explorer for the model-theory-basics topic: lets the reader pick a signature (groups, rings, posets, graphs) and inspect its function and relation arities, illustrating how a signature determines what it means to be a structure for L.

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
{ "type": "widget",        "slug": "model-theory-signature-explorer", "params": { ... } },
{ "type": "widget-script", "slug": "model-theory-signature-explorer", "params": { ... } }
```

Both blocks carry the same `params` object.
