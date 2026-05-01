# knot-polynomials-reidemeister

Bespoke widget for the knot-polynomials topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Before/after comparison of the three Reidemeister moves (R1 twist, R2 poke, R3 slide). One-off because each move's pre/post diagrams are hand-tuned SVG with specific crossing geometry.

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
{ "type": "widget",        "slug": "knot-polynomials-reidemeister", "params": { ... } },
{ "type": "widget-script", "slug": "knot-polynomials-reidemeister", "params": { ... } }
```

Both blocks carry the same `params` object.
