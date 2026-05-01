# k-theory-low-k-groups

Bespoke widget for the k-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Choose a sample ring (Z, F_q, fields) and inspect K_0, K_1, K_2 — concrete low K-groups via Quillen's plus construction.

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
{ "type": "widget",        "slug": "k-theory-low-k-groups", "params": { ... } },
{ "type": "widget-script", "slug": "k-theory-low-k-groups", "params": { ... } }
```

Both blocks carry the same `params` object.
