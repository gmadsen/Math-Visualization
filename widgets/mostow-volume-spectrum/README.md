# mostow-volume-spectrum

Bespoke widget for the mostow-rigidity topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §6 hyperbolic volume spectrum figure on the mostow-rigidity topic — an SVG number line marks the well-ordered set of closed hyperbolic 3-manifold volumes (Weeks manifold, etc.) demonstrating that volume is a topological invariant via Mostow.

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
{ "type": "widget",        "slug": "mostow-volume-spectrum", "params": { ... } },
{ "type": "widget-script", "slug": "mostow-volume-spectrum", "params": { ... } }
```

Both blocks carry the same `params` object.
