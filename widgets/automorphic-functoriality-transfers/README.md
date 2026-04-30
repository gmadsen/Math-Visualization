# automorphic-functoriality-transfers

Bespoke widget for the automorphic-forms-adelic topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke functoriality-transfer picker for the automorphic-forms-adelic topic. Reader clicks a transfer arrow rho from L-group LH to LG in an SVG of the L-group correspondence diagram; the readout reports the induced action on Satake parameters. The clickable-arrow-on-L-group-correspondence diagram is specific to Langlands functoriality and does not fit clickable-diagram or clickable-graph.

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
{ "type": "widget",        "slug": "automorphic-functoriality-transfers", "params": { ... } },
{ "type": "widget-script", "slug": "automorphic-functoriality-transfers", "params": { ... } }
```

Both blocks carry the same `params` object.
