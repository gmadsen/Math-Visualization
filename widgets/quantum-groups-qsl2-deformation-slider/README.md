# quantum-groups-qsl2-deformation-slider

Bespoke widget for the quantum-groups topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

q-deformation slider for U_q(sl_2)

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
{ "type": "widget",        "slug": "quantum-groups-qsl2-deformation-slider", "params": { ... } },
{ "type": "widget-script", "slug": "quantum-groups-qsl2-deformation-slider", "params": { ... } }
```

Both blocks carry the same `params` object.
