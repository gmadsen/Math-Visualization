# probabilistic-method-lll

Bespoke widget for the probabilistic-method topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Lovasz Local Lemma feasibility scanner: slide k and d; the green region is where e p (d+1) <= 1 with p = 2^{-k}, so the LLL guarantees a satisfying assignment for k-SAT with d-bounded dependence.

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
{ "type": "widget",        "slug": "probabilistic-method-lll", "params": { ... } },
{ "type": "widget-script", "slug": "probabilistic-method-lll", "params": { ... } }
```

Both blocks carry the same `params` object.
