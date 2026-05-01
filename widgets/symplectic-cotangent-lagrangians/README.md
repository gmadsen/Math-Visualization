# symplectic-cotangent-lagrangians

Bespoke widget for the symplectic-manifolds topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Click closed 1-forms on the cotangent bundle of the circle to render their graphs as Lagrangian curves wrapping the cylinder, illustrating that closed 1-forms parametrize Lagrangian sections of T*S^1.

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
{ "type": "widget",        "slug": "symplectic-cotangent-lagrangians", "params": { ... } },
{ "type": "widget-script", "slug": "symplectic-cotangent-lagrangians", "params": { ... } }
```

Both blocks carry the same `params` object.
