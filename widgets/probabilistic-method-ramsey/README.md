# probabilistic-method-ramsey

Bespoke widget for the probabilistic-method topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Ramsey union-bound calculator: slide n and k; watch when binom(n,k) 2^{1-binom(k,2)} drops below 1, certifying R(k,k) > n. The lower-bound proof rendered as a one-slider exploration.

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
{ "type": "widget",        "slug": "probabilistic-method-ramsey", "params": { ... } },
{ "type": "widget-script", "slug": "probabilistic-method-ramsey", "params": { ... } }
```

Both blocks carry the same `params` object.
