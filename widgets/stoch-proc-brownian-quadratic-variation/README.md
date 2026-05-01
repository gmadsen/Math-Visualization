# stoch-proc-brownian-quadratic-variation

Bespoke widget for the stochastic-processes-and-martingales topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Brownian motion sample path with quadratic variation accumulator showing [B]_t = t.

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
{ "type": "widget",        "slug": "stoch-proc-brownian-quadratic-variation", "params": { ... } },
{ "type": "widget-script", "slug": "stoch-proc-brownian-quadratic-variation", "params": { ... } }
```

Both blocks carry the same `params` object.
