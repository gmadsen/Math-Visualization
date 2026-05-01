# forcing-cohen-real

Bespoke widget for the forcing-and-independence topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Building a Cohen real bit by bit by extending finite binary conditions

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
{ "type": "widget",        "slug": "forcing-cohen-real", "params": { ... } },
{ "type": "widget-script", "slug": "forcing-cohen-real", "params": { ... } }
```

Both blocks carry the same `params` object.
