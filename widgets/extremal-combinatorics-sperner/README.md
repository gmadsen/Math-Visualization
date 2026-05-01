# extremal-combinatorics-sperner

Bespoke widget for the extremal-combinatorics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Boolean-lattice antichain assembler for Sperner's theorem: click subsets of [n] to build an antichain; the LYM sum sum_S 1/binom(n,|S|) updates live and shows when LYM is saturated by a level.

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
{ "type": "widget",        "slug": "extremal-combinatorics-sperner", "params": { ... } },
{ "type": "widget-script", "slug": "extremal-combinatorics-sperner", "params": { ... } }
```

Both blocks carry the same `params` object.
