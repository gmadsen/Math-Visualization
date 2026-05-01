# knot-polynomials-homfly

Bespoke widget for the knot-polynomials topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Skein-tree expansion of the trefoil under the HOMFLY skein relation, resolving one crossing per click into an L_- / L_0 linear combination. One-off because the tree topology and per-node diagrams are bespoke.

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
{ "type": "widget",        "slug": "knot-polynomials-homfly", "params": { ... } },
{ "type": "widget-script", "slug": "knot-polynomials-homfly", "params": { ... } }
```

Both blocks carry the same `params` object.
