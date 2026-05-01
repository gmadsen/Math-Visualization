# resolution-tower-of-blowups

Bespoke widget for the resolution-of-singularities topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Resolution as an iterated tower of blow-ups — steps through successive blow-ups until smooth

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
{ "type": "widget",        "slug": "resolution-tower-of-blowups", "params": { ... } },
{ "type": "widget-script", "slug": "resolution-tower-of-blowups", "params": { ... } }
```

Both blocks carry the same `params` object.
