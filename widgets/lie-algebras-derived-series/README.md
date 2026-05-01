# lie-algebras-derived-series

Bespoke widget for the lie-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke step-through of the derived series g^(0) >= g^(1) >= ... for three concrete sample algebras (Borel b_2, Heisenberg n_3, sl_2), letting the reader watch which collapse to zero (solvable) and which stabilize. Bespoke because no shared slug renders a labelled descending-chain animation tied to specific Lie-algebra examples.

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
{ "type": "widget",        "slug": "lie-algebras-derived-series", "params": { ... } },
{ "type": "widget-script", "slug": "lie-algebras-derived-series", "params": { ... } }
```

Both blocks carry the same `params` object.
