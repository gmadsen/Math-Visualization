# harmonic-functions-perron-supremum

Bespoke widget for the harmonic-functions topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Family of subharmonic candidates inside a disk with their pointwise supremum tracked in real time. Demonstrates the Perron construction: the sup of an admissible subharmonic family solves the Dirichlet problem.

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
{ "type": "widget",        "slug": "harmonic-functions-perron-supremum", "params": { ... } },
{ "type": "widget-script", "slug": "harmonic-functions-perron-supremum", "params": { ... } }
```

Both blocks carry the same `params` object.
