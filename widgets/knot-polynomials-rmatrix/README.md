# knot-polynomials-rmatrix

Bespoke widget for the knot-polynomials topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Live readout of the U_q(sl_2) R-matrix on the standard 2-dim rep as q varies along a slider. One-off because the 4x4 entry layout and q-dependence are specific to this quantum group.

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
{ "type": "widget",        "slug": "knot-polynomials-rmatrix", "params": { ... } },
{ "type": "widget-script", "slug": "knot-polynomials-rmatrix", "params": { ... } }
```

Both blocks carry the same `params` object.
