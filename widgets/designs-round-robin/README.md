# designs-round-robin

Bespoke widget for the designs topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke round-robin tournament scheduler via the circle method: step through rounds for n teams (odd n) where each pair meets exactly once. Concrete combinatorial design with a graphical generation rule.

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
{ "type": "widget",        "slug": "designs-round-robin", "params": { ... } },
{ "type": "widget-script", "slug": "designs-round-robin", "params": { ... } }
```

Both blocks carry the same `params` object.
