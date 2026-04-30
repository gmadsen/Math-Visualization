# spectral-graph-theory-bipartite

Bespoke widget for the spectral-graph-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke bipartite-graph spectrum visualizer: a graph is bipartite iff its adjacency spectrum is symmetric about 0. Toggle bipartiteness and watch the spectrum invert/reflect.

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
{ "type": "widget",        "slug": "spectral-graph-theory-bipartite", "params": { ... } },
{ "type": "widget-script", "slug": "spectral-graph-theory-bipartite", "params": { ... } }
```

Both blocks carry the same `params` object.
