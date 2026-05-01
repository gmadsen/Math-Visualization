# hdg-dvoretzky-section

Bespoke widget for the high-dimensional-geometry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for §2 Dvoretzky's theorem on the high-dimensional-geometry topic — slider over dimension n + resample button generate a random 2-D section of the n-dimensional cube ℓ^∞_n, drawing it in an SVG and reporting the radius spread; visually demonstrates the section becoming circular. Slider+button+svg+readout in one widget.

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
{ "type": "widget",        "slug": "hdg-dvoretzky-section", "params": { ... } },
{ "type": "widget-script", "slug": "hdg-dvoretzky-section", "params": { ... } }
```

Both blocks carry the same `params` object.
