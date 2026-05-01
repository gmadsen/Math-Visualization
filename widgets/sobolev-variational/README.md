# sobolev-variational

Bespoke widget for the sobolev-spaces-distributions topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke energy-minimization visualizer: approximate u in J(v) = (1/2) ||grad v||^2 - integral f v by u_a = a sin(pi x / L); find the optimal a. Concrete one-parameter ansatz that makes the variational principle tactile.

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
{ "type": "widget",        "slug": "sobolev-variational", "params": { ... } },
{ "type": "widget-script", "slug": "sobolev-variational", "params": { ... } }
```

Both blocks carry the same `params` object.
