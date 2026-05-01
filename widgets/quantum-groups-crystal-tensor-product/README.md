# quantum-groups-crystal-tensor-product

Bespoke widget for the quantum-groups topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Crystal-graph tensor product visualization for sl_2

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
{ "type": "widget",        "slug": "quantum-groups-crystal-tensor-product", "params": { ... } },
{ "type": "widget-script", "slug": "quantum-groups-crystal-tensor-product", "params": { ... } }
```

Both blocks carry the same `params` object.
