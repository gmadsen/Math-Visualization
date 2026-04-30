# designs-fano-plane

Bespoke widget for the designs topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke clickable Fano plane (PG(2, 2)): clicking a line highlights its three collinear points; clicking two points highlights their joining line. Concrete instance of the smallest projective plane and a stepping stone to the [7,4,3] Hamming code via Fano lines.

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
{ "type": "widget",        "slug": "designs-fano-plane", "params": { ... } },
{ "type": "widget-script", "slug": "designs-fano-plane", "params": { ... } }
```

Both blocks carry the same `params` object.
