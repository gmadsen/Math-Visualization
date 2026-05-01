# extremal-combinatorics-turan

Bespoke widget for the extremal-combinatorics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Turan-graph T(n, r) visualizer for extremal-combinatorics: drag n and r sliders to see how parts and edges scale; the readout reports the maximum edge count (1 - 1/r) n^2/2 plus the achieving partition.

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
{ "type": "widget",        "slug": "extremal-combinatorics-turan", "params": { ... } },
{ "type": "widget-script", "slug": "extremal-combinatorics-turan", "params": { ... } }
```

Both blocks carry the same `params` object.
