# probabilistic-method-concentration

Bespoke widget for the probabilistic-method topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke tail-bound comparator for S_n = X_1 + ... + X_n with Bernoulli(1/2) summands: slide n and t; see Markov vs Chebyshev vs Hoeffding vs the exact tail side by side. Concrete entry into how concentration tightens with stronger hypotheses.

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
{ "type": "widget",        "slug": "probabilistic-method-concentration", "params": { ... } },
{ "type": "widget-script", "slug": "probabilistic-method-concentration", "params": { ... } }
```

Both blocks carry the same `params` object.
