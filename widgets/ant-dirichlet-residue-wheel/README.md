# ant-dirichlet-residue-wheel

Bespoke widget for the analytic-number-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke residue-class wheel showing primes mod $q$ distributed around a circular arrangement for the analytic-number-theory topic. The wheel layout with per-residue density readouts is specific to Dirichlet's theorem and not a generic clock or modular-arithmetic widget.

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
{ "type": "widget",        "slug": "ant-dirichlet-residue-wheel", "params": { ... } },
{ "type": "widget-script", "slug": "ant-dirichlet-residue-wheel", "params": { ... } }
```

Both blocks carry the same `params` object.
