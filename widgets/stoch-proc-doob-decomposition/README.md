# stoch-proc-doob-decomposition

Bespoke widget for the stochastic-processes-and-martingales topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Doob decomposition of S_n^2 into a martingale plus a predictable increasing process. Reader steps the walk and watches the two pieces separate.

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
{ "type": "widget",        "slug": "stoch-proc-doob-decomposition", "params": { ... } },
{ "type": "widget-script", "slug": "stoch-proc-doob-decomposition", "params": { ... } }
```

Both blocks carry the same `params` object.
