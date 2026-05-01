# zfc-ordinal-calculator

Bespoke widget for the zfc-and-ordinals topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke ordinal arithmetic calculator demonstrating non-commutativity of ordinal addition and multiplication for the zfc-and-ordinals topic. Encodes ordinal-specific evaluation rules not shared with cardinal arithmetic.

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
{ "type": "widget",        "slug": "zfc-ordinal-calculator", "params": { ... } },
{ "type": "widget-script", "slug": "zfc-ordinal-calculator", "params": { ... } }
```

Both blocks carry the same `params` object.
