# extremal-combinatorics-kst

Bespoke widget for the extremal-combinatorics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Kovari-Sos-Turan exponent 2 - 1/s visualizer: slide s and watch the upper bound on K_{s,t}-free graphs shrink toward the n^2 ceiling but never reach it. Concrete touchpoint for the bipartite extremal regime.

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
{ "type": "widget",        "slug": "extremal-combinatorics-kst", "params": { ... } },
{ "type": "widget-script", "slug": "extremal-combinatorics-kst", "params": { ... } }
```

Both blocks carry the same `params` object.
