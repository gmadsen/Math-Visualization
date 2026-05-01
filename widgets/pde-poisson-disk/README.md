# pde-poisson-disk

Bespoke widget for the partial-differential-equations topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Dirichlet-problem-on-the-disk illustration for the §4 Laplace equation section on the partial-differential-equations topic — boundary data is set on the unit circle and the Poisson kernel reconstructs the harmonic interior, visualized as a colored disk SVG. The boundary-data input + Poisson-kernel evaluation + heatmap render doesn't fit a shared slug.

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
{ "type": "widget",        "slug": "pde-poisson-disk", "params": { ... } },
{ "type": "widget-script", "slug": "pde-poisson-disk", "params": { ... } }
```

Both blocks carry the same `params` object.
