# information-bsc-capacity

Bespoke widget for the information-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Binary symmetric channel capacity C(p) = 1 - h(p) with probability slider.

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
{ "type": "widget",        "slug": "information-bsc-capacity", "params": { ... } },
{ "type": "widget-script", "slug": "information-bsc-capacity", "params": { ... } }
```

Both blocks carry the same `params` object.
