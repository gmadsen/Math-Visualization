# spectral-graph-theory-adjacency

Bespoke widget for the spectral-graph-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke A, D, L = D - A inspector for spectral-graph-theory: pick a small graph; the matrices update side by side. Concrete entry into the three matrices that govern spectral-graph machinery.

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
{ "type": "widget",        "slug": "spectral-graph-theory-adjacency", "params": { ... } },
{ "type": "widget-script", "slug": "spectral-graph-theory-adjacency", "params": { ... } }
```

Both blocks carry the same `params` object.
