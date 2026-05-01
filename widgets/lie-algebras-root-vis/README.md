# lie-algebras-root-vis

Bespoke widget for the lie-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke gallery toggling among the three rank-2 irreducible root systems A_2, B_2, G_2, drawing roots and Weyl chambers in the plane with annotations for each system's identification (sl_3, so_5, exceptional). Bespoke because the diagram is a classification-fixed three-button switch no shared slug encodes.

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
{ "type": "widget",        "slug": "lie-algebras-root-vis", "params": { ... } },
{ "type": "widget-script", "slug": "lie-algebras-root-vis", "params": { ... } }
```

Both blocks carry the same `params` object.
