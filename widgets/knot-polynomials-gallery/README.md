# knot-polynomials-gallery

Bespoke widget for the knot-polynomials topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Click-through gallery of canonical knot diagrams (unknot, right trefoil, figure-eight, Hopf link). One-off because the diagrams are hand-drawn SVG paths with crossing under-strands hardcoded per knot.

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
{ "type": "widget",        "slug": "knot-polynomials-gallery", "params": { ... } },
{ "type": "widget-script", "slug": "knot-polynomials-gallery", "params": { ... } }
```

Both blocks carry the same `params` object.
