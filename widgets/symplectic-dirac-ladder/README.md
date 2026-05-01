# symplectic-dirac-ladder

Bespoke widget for the symplectic-manifolds topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Click rows in a side-by-side table to highlight matched classical Poisson brackets and quantum commutators, illustrating the Dirac correspondence between Poisson algebras and operator algebras.

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
{ "type": "widget",        "slug": "symplectic-dirac-ladder", "params": { ... } },
{ "type": "widget-script", "slug": "symplectic-dirac-ladder", "params": { ... } }
```

Both blocks carry the same `params` object.
