# knot-polynomials-bracket

Bespoke widget for the knot-polynomials topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Step-through walkthrough of the Kauffman bracket state sum on the trefoil — eight states with running A/B-smoothing total. One-off because each state's circle configuration is hardcoded geometry.

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
{ "type": "widget",        "slug": "knot-polynomials-bracket", "params": { ... } },
{ "type": "widget-script", "slug": "knot-polynomials-bracket", "params": { ... } }
```

Both blocks carry the same `params` object.
