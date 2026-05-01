# mirror-stable-map

Bespoke widget for the mirror-symmetry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Schematic of a stable map from a genus-zero source (a chain of P^1s) to a Calabi-Yau threefold; a slider scales the source-curve degree and redraws both source bouquet and image-curve oscillation count.

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
{ "type": "widget",        "slug": "mirror-stable-map", "params": { ... } },
{ "type": "widget-script", "slug": "mirror-stable-map", "params": { ... } }
```

Both blocks carry the same `params` object.
