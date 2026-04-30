# morse-gradient-flow

Bespoke widget for the morse-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke gradient-flow visualizer that draws negative-gradient trajectories of a Morse function on the torus connecting saddles to extrema for the morse-theory topic. Specific to the torus flow used to compute Morse homology, so it does not fit a shared slug.

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
{ "type": "widget",        "slug": "morse-gradient-flow", "params": { ... } },
{ "type": "widget-script", "slug": "morse-gradient-flow", "params": { ... } }
```

Both blocks carry the same `params` object.
