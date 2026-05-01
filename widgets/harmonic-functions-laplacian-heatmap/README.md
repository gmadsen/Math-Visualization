# harmonic-functions-laplacian-heatmap

Bespoke widget for the harmonic-functions topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Side-by-side heatmaps of u(x,y) and its Laplacian Δu, with a function selector. Shows that harmonic ⇔ uniformly-zero Δu heatmap.

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
{ "type": "widget",        "slug": "harmonic-functions-laplacian-heatmap", "params": { ... } },
{ "type": "widget-script", "slug": "harmonic-functions-laplacian-heatmap", "params": { ... } }
```

Both blocks carry the same `params` object.
