# mostow-boundary-extension

Bespoke widget for the mostow-rigidity topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §3 quasi-isometry → boundary map figure on the mostow-rigidity topic — a slider tunes bulk distortion and the SVG shows how the induced boundary map of the disk's circle remains quasiconformal even as the bulk wobbles.

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
{ "type": "widget",        "slug": "mostow-boundary-extension", "params": { ... } },
{ "type": "widget-script", "slug": "mostow-boundary-extension", "params": { ... } }
```

Both blocks carry the same `params` object.
