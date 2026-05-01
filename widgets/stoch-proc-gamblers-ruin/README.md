# stoch-proc-gamblers-ruin

Bespoke widget for the stochastic-processes-and-martingales topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Gambler's ruin / optional-stopping illustration. Reader picks parameters and watches the stopping-time distribution and exit probabilities accumulate.

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
{ "type": "widget",        "slug": "stoch-proc-gamblers-ruin", "params": { ... } },
{ "type": "widget-script", "slug": "stoch-proc-gamblers-ruin", "params": { ... } }
```

Both blocks carry the same `params` object.
