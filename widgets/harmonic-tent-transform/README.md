# harmonic-tent-transform

Bespoke widget for the harmonic-analysis-fourier topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke f vs f-hat illustrator: drag a width slider on a tent function and watch its Fourier transform widen as the original narrows. The reciprocal scaling is the entire pedagogical point of this section. Doesn't fit parametric-plot because the dual-pane (f / hat-f) layout with shared axis cursor is bespoke.

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
{ "type": "widget",        "slug": "harmonic-tent-transform", "params": { ... } },
{ "type": "widget-script", "slug": "harmonic-tent-transform", "params": { ... } }
```

Both blocks carry the same `params` object.
