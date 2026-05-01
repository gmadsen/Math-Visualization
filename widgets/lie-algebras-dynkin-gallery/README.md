# lie-algebras-dynkin-gallery

Bespoke widget for the lie-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke clickable gallery of Dynkin diagrams covering the four classical series A_n, B_n, C_n, D_n plus the five exceptions E_6, E_7, E_8, F_4, G_2, with a readout giving each algebra's name and rank/dimension. Bespoke because the gallery is a fixed enumerated classification that no shared widget can synthesize.

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
{ "type": "widget",        "slug": "lie-algebras-dynkin-gallery", "params": { ... } },
{ "type": "widget-script", "slug": "lie-algebras-dynkin-gallery", "params": { ... } }
```

Both blocks carry the same `params` object.
