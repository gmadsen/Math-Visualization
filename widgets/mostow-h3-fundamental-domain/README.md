# mostow-h3-fundamental-domain

Bespoke widget for the mostow-rigidity topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §2 H^3 fundamental-domain figure on the mostow-rigidity topic — a slider over the trace parameter deforms a Dirichlet polyhedron in the upper half-space model and the SVG shows face identifications of the resulting hyperbolic 3-manifold.

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
{ "type": "widget",        "slug": "mostow-h3-fundamental-domain", "params": { ... } },
{ "type": "widget-script", "slug": "mostow-h3-fundamental-domain", "params": { ... } }
```

Both blocks carry the same `params` object.
