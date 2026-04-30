# probabilistic-method-threshold

Bespoke widget for the probabilistic-method topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke triangle-threshold demo for G(n,p): slide np across 1; watch E[X_T] and the simulated triangle count. The np = 1 transition for triangle-existence is rendered tangibly via expectation vs. realized counts.

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
{ "type": "widget",        "slug": "probabilistic-method-threshold", "params": { ... } },
{ "type": "widget-script", "slug": "probabilistic-method-threshold", "params": { ... } }
```

Both blocks carry the same `params` object.
