# zfc-choice-picker

Bespoke widget for the zfc-and-ordinals topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke choice-function picker illustrating the axiom of choice on a small indexed family of nonempty sets for the zfc-and-ordinals topic. Specific to the AC pedagogy and not reused elsewhere.

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
{ "type": "widget",        "slug": "zfc-choice-picker", "params": { ... } },
{ "type": "widget-script", "slug": "zfc-choice-picker", "params": { ... } }
```

Both blocks carry the same `params` object.
