# stoch-proc-convergence-regimes

Bespoke widget for the stochastic-processes-and-martingales topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Two convergence regimes for martingales: bounded-in-L^1 a.s. convergence vs. L^2-bounded L^2 convergence.

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
{ "type": "widget",        "slug": "stoch-proc-convergence-regimes", "params": { ... } },
{ "type": "widget-script", "slug": "stoch-proc-convergence-regimes", "params": { ... } }
```

Both blocks carry the same `params` object.
