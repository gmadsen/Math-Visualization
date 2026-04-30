# morse-torus-height

Bespoke widget for the morse-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke height-function visualizer that highlights the four critical points of the standard torus embedding for the morse-theory topic. Tied to a specific torus + slider readout, so it does not fit a shared parametric-plot or surface-viewer slug.

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
{ "type": "widget",        "slug": "morse-torus-height", "params": { ... } },
{ "type": "widget-script", "slug": "morse-torus-height", "params": { ... } }
```

Both blocks carry the same `params` object.
