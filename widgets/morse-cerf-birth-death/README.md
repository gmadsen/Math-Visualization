# morse-cerf-birth-death

Bespoke widget for the morse-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke slider scrubbing the family (x)=x^3-tx$ to show a birth-death pair of critical points appearing and annihilating for the morse-theory topic. Specific to one-parameter Cerf families, so it does not fit a shared slug.

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
{ "type": "widget",        "slug": "morse-cerf-birth-death", "params": { ... } },
{ "type": "widget-script", "slug": "morse-cerf-birth-death", "params": { ... } }
```

Both blocks carry the same `params` object.
