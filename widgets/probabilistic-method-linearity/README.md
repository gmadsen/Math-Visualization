# probabilistic-method-linearity

Bespoke widget for the probabilistic-method topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke independence-number bound for G(n, 1/2) via linearity of expectation: slide n; find the smallest k with binom(n,k) 2^{-binom(k,2)} < 1, giving alpha(G) < k almost surely.

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
{ "type": "widget",        "slug": "probabilistic-method-linearity", "params": { ... } },
{ "type": "widget-script", "slug": "probabilistic-method-linearity", "params": { ... } }
```

Both blocks carry the same `params` object.
