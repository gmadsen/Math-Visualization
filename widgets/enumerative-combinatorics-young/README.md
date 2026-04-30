# enumerative-combinatorics-young

Bespoke widget for the enumerative-combinatorics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Young-diagram drawer: click to add or remove a box; the partition stays left- and top-justified. Hands-on entry into integer partitions and a stepping stone toward conjugation, hook-length, and Robinson-Schensted.

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
{ "type": "widget",        "slug": "enumerative-combinatorics-young", "params": { ... } },
{ "type": "widget-script", "slug": "enumerative-combinatorics-young", "params": { ... } }
```

Both blocks carry the same `params` object.
