# aca-hartogs-shell

Bespoke widget for the advanced-complex-analysis topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

See [`schema.json`](./schema.json) for the description.

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
{ "type": "widget",        "slug": "aca-hartogs-shell", "params": { ... } },
{ "type": "widget-script", "slug": "aca-hartogs-shell", "params": { ... } }
```

Both blocks carry the same `params` object.
