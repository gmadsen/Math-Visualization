# calabi-yau-syz-fibration

Bespoke widget for the calabi-yau-manifolds topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Illustrates the SYZ picture of a Calabi-Yau as a special-Lagrangian torus fibration over a base interval, with a slider that translates the base point and redraws the fiber torus T^n. Bespoke because the fibration diagram (base interval, distinguished fiber, torus mesh) is purpose-drawn for the SYZ exposition.

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
{ "type": "widget",        "slug": "calabi-yau-syz-fibration", "params": { ... } },
{ "type": "widget-script", "slug": "calabi-yau-syz-fibration", "params": { ... } }
```

Both blocks carry the same `params` object.
