# computability-rec-vs-re-venn

Bespoke widget for the computability-and-decidability topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Venn-style diagram showing recursive sets as a strict subset of recursively enumerable sets, with clickable example placements (halting, complement, decidable predicates). Bespoke because the labelled regions and example callouts encode the specific recursive-vs-r.e. taxonomy.

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
{ "type": "widget",        "slug": "computability-rec-vs-re-venn", "params": { ... } },
{ "type": "widget-script", "slug": "computability-rec-vs-re-venn", "params": { ... } }
```

Both blocks carry the same `params` object.
