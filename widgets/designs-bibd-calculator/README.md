# designs-bibd-calculator

Bespoke widget for the designs topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke balanced incomplete block design parameter calculator for the designs topic. Type (v, k, lambda); the readout reports r = lambda(v-1)/(k-1), b = vr/k, and flags impossibility when divisibility fails or Fisher's inequality is violated.

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
{ "type": "widget",        "slug": "designs-bibd-calculator", "params": { ... } },
{ "type": "widget-script", "slug": "designs-bibd-calculator", "params": { ... } }
```

Both blocks carry the same `params` object.
