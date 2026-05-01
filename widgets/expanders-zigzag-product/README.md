# expanders-zigzag-product

Bespoke widget for the expanders topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke schematic of the zigzag product G zig zag H for the expanders topic. Click presets to switch between the inner graph H and watch the resulting expander graph G zig zag H form via the H-cloud + outer-edge construction; readout reports vertex/edge counts.

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
{ "type": "widget",        "slug": "expanders-zigzag-product", "params": { ... } },
{ "type": "widget-script", "slug": "expanders-zigzag-product", "params": { ... } }
```

Both blocks carry the same `params` object.
