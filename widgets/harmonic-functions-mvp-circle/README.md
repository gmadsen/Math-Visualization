# harmonic-functions-mvp-circle

Bespoke widget for the harmonic-functions topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Heatmap of a candidate u with a draggable disk; reads off u at the center vs. the circle average. Demonstrates the mean value property as a numerical equality for harmonic functions.

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
{ "type": "widget",        "slug": "harmonic-functions-mvp-circle", "params": { ... } },
{ "type": "widget-script", "slug": "harmonic-functions-mvp-circle", "params": { ... } }
```

Both blocks carry the same `params` object.
