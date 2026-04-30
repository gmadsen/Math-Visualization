# spectral-graph-theory-clustering

Bespoke widget for the spectral-graph-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke spectral-embedding demo for spectral clustering: project graph vertices into R^k via the bottom k Laplacian eigenvectors; k-means in the embedded space recovers natural clusters.

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
{ "type": "widget",        "slug": "spectral-graph-theory-clustering", "params": { ... } },
{ "type": "widget-script", "slug": "spectral-graph-theory-clustering", "params": { ... } }
```

Both blocks carry the same `params` object.
