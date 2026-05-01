# symplectic-darboux-moser

Bespoke widget for the symplectic-manifolds topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Slider drives a Moser deformation interpolating between two symplectic forms on the same disk; readout reports area and shows that the same coordinates serve every form along the path, illustrating Darboux's theorem.

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
{ "type": "widget",        "slug": "symplectic-darboux-moser", "params": { ... } },
{ "type": "widget-script", "slug": "symplectic-darboux-moser", "params": { ... } }
```

Both blocks carry the same `params` object.
