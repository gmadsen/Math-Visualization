# spectral-graph-theory-fiedler

Bespoke widget for the spectral-graph-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Fiedler-vector explorer: pick a graph; the second-smallest Laplacian eigenvector colors vertices on a continuous gradient. Heuristic for graph partitioning by sign of the Fiedler vector.

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
{ "type": "widget",        "slug": "spectral-graph-theory-fiedler", "params": { ... } },
{ "type": "widget-script", "slug": "spectral-graph-theory-fiedler", "params": { ... } }
```

Both blocks carry the same `params` object.
