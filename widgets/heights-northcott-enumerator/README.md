# heights-northcott-enumerator

Bespoke widget for the heights-arithmetic-geometry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Northcott enumeration for the heights-arithmetic-geometry topic — a single bound-N input that triggers an enumeration of all points of P^1(Q) with H <= N, displaying the count and the actual reduced fractions. The shape (one input + multi-line enumerated list readout with finiteness commentary) is bespoke and doesn't fit a shared widget.

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
{ "type": "widget",        "slug": "heights-northcott-enumerator", "params": { ... } },
{ "type": "widget-script", "slug": "heights-northcott-enumerator", "params": { ... } }
```

Both blocks carry the same `params` object.
