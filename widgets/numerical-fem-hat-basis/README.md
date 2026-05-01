# numerical-fem-hat-basis

Bespoke widget for the numerical-analysis topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Mesh refinement and hat-basis visualizer for 1D finite elements: shows piecewise-linear approximation as mesh resolution increases.

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
{ "type": "widget",        "slug": "numerical-fem-hat-basis", "params": { ... } },
{ "type": "widget-script", "slug": "numerical-fem-hat-basis", "params": { ... } }
```

Both blocks carry the same `params` object.
