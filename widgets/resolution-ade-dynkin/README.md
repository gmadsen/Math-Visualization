# resolution-ade-dynkin

Bespoke widget for the resolution-of-singularities topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

ADE Dynkin types of surface du Val singularities — pick A_n/D_n/E_6/E_7/E_8 and view its dual graph

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
{ "type": "widget",        "slug": "resolution-ade-dynkin", "params": { ... } },
{ "type": "widget-script", "slug": "resolution-ade-dynkin", "params": { ... } }
```

Both blocks carry the same `params` object.
