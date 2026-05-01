# symplectic-form-pairing

Bespoke widget for the symplectic-manifolds topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Drag two vectors to compare an alternating 2-form to a symmetric inner product. The alternating reading sweeps signed parallelogram area while the symmetric reading sums squared lengths, isolating the algebraic feature that distinguishes a symplectic form.

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
{ "type": "widget",        "slug": "symplectic-form-pairing", "params": { ... } },
{ "type": "widget-script", "slug": "symplectic-form-pairing", "params": { ... } }
```

Both blocks carry the same `params` object.
