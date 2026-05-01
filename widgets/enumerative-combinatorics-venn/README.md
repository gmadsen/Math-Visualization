# enumerative-combinatorics-venn

Bespoke widget for the enumerative-combinatorics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke three-set Venn-diagram count visualiser: toggle each region of an A,B,C Venn diagram and check the inclusion-exclusion bookkeeping live. Makes |A union B union C| = |A| + |B| + |C| - |A cap B| - ... + |A cap B cap C| operational instead of axiomatic.

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
{ "type": "widget",        "slug": "enumerative-combinatorics-venn", "params": { ... } },
{ "type": "widget-script", "slug": "enumerative-combinatorics-venn", "params": { ... } }
```

Both blocks carry the same `params` object.
