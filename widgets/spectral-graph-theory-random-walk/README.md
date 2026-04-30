# spectral-graph-theory-random-walk

Bespoke widget for the spectral-graph-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke random-walk mixing demo: simulate a walk on a small graph; the distribution converges at a rate governed by the spectral gap (1 - lambda_2 of the normalized adjacency). Concrete entry into Markov-chain mixing via spectral methods.

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
{ "type": "widget",        "slug": "spectral-graph-theory-random-walk", "params": { ... } },
{ "type": "widget-script", "slug": "spectral-graph-theory-random-walk", "params": { ... } }
```

Both blocks carry the same `params` object.
