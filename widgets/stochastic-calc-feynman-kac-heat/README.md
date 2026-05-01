# stochastic-calc-feynman-kac-heat

Bespoke widget for the stochastic-calculus topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Heat-equation solution as a Brownian-motion expectation: Monte-Carlo estimate vs analytic Gaussian.

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
{ "type": "widget",        "slug": "stochastic-calc-feynman-kac-heat", "params": { ... } },
{ "type": "widget-script", "slug": "stochastic-calc-feynman-kac-heat", "params": { ... } }
```

Both blocks carry the same `params` object.
