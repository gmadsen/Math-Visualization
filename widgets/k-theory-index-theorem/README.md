# k-theory-index-theorem

Bespoke widget for the k-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Pick an elliptic operator (Dirac, signature, Dolbeault) and read the Atiyah-Singer index pairing visualized as an integral on the manifold.

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
{ "type": "widget",        "slug": "k-theory-index-theorem", "params": { ... } },
{ "type": "widget-script", "slug": "k-theory-index-theorem", "params": { ... } }
```

Both blocks carry the same `params` object.
