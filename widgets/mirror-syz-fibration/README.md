# mirror-syz-fibration

Bespoke widget for the mirror-symmetry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

SYZ dual torus fibration explorer: dragging along the base of a special-Lagrangian T^3 fibration shows the fibre and its dual torus, illustrating the conjectural pointwise mirror construction.

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
{ "type": "widget",        "slug": "mirror-syz-fibration", "params": { ... } },
{ "type": "widget-script", "slug": "mirror-syz-fibration", "params": { ... } }
```

Both blocks carry the same `params` object.
