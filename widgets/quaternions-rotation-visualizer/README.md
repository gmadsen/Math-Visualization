# quaternions-rotation-visualizer

Bespoke widget for the quaternions-octonions-and-division-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Interactive 3D cube rotated by the quaternion sandwich rho_q(v)=qvq^{-1} about a chosen axis (i, j, k, or diagonal). Slider scrubs the rotation angle.

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
{ "type": "widget",        "slug": "quaternions-rotation-visualizer", "params": { ... } },
{ "type": "widget-script", "slug": "quaternions-rotation-visualizer", "params": { ... } }
```

Both blocks carry the same `params` object.
