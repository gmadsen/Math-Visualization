# knot-polynomials-alexander

Bespoke widget for the knot-polynomials topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Catalog viewer that displays factored Laurent-form Alexander polynomials for selected knots (unknot, trefoil, figure-eight, 5_1, 5_2). One-off because the polynomial labels are typeset KaTeX strings keyed to each knot.

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
{ "type": "widget",        "slug": "knot-polynomials-alexander", "params": { ... } },
{ "type": "widget-script", "slug": "knot-polynomials-alexander", "params": { ... } }
```

Both blocks carry the same `params` object.
