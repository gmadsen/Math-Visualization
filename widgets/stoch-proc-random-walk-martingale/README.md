# stoch-proc-random-walk-martingale

Bespoke widget for the stochastic-processes-and-martingales topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Random-walk martingale demo for the discrete-martingales section. Reader steps a simple random walk and watches conditional-expectation flatness.

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
{ "type": "widget",        "slug": "stoch-proc-random-walk-martingale", "params": { ... } },
{ "type": "widget-script", "slug": "stoch-proc-random-walk-martingale", "params": { ... } }
```

Both blocks carry the same `params` object.
