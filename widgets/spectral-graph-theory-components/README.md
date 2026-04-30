# spectral-graph-theory-components

Bespoke widget for the spectral-graph-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Laplacian-kernel demo: drag/click bridges to disconnect; the multiplicity of L's zero eigenvalue equals the number of connected components. Builds dim ker L = c live.

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
{ "type": "widget",        "slug": "spectral-graph-theory-components", "params": { ... } },
{ "type": "widget-script", "slug": "spectral-graph-theory-components", "params": { ... } }
```

Both blocks carry the same `params` object.
