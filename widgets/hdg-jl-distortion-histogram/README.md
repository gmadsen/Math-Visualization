# hdg-jl-distortion-histogram

Bespoke widget for the high-dimensional-geometry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for §3 Johnson–Lindenstrauss on the high-dimensional-geometry topic — sliders over n (source dim), k (target dim), N (number of pairs) drive a histogram of pairwise distortion ratios under a random Gaussian projection. SVG + multiple sliders + histogram readout is the bespoke shape.

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
{ "type": "widget",        "slug": "hdg-jl-distortion-histogram", "params": { ... } },
{ "type": "widget-script", "slug": "hdg-jl-distortion-histogram", "params": { ... } }
```

Both blocks carry the same `params` object.
