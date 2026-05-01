# symplectic-floer-intersections

Bespoke widget for the symplectic-manifolds topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Drag a Lagrangian circle around the torus and count intersections with a fixed reference circle, comparing the actual count to the homological lower bound enforced by Floer theory under Hamiltonian isotopy.

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
{ "type": "widget",        "slug": "symplectic-floer-intersections", "params": { ... } },
{ "type": "widget-script", "slug": "symplectic-floer-intersections", "params": { ... } }
```

Both blocks carry the same `params` object.
