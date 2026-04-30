# automorphic-eisenstein-residue

Bespoke widget for the automorphic-forms-adelic topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Eisenstein-residue scrubber for the automorphic-forms-adelic topic. A slider over the spectral parameter s drives an SVG that shows the constant term of an Eisenstein series along the line Re(s) = sigma, exposing the simple pole at s = 1 that produces the residual spectrum. The single-slider-plus-pole-plot residue-illustration layout is specific to spectral decomposition and does not fit parametric-plot.

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
{ "type": "widget",        "slug": "automorphic-eisenstein-residue", "params": { ... } },
{ "type": "widget-script", "slug": "automorphic-eisenstein-residue", "params": { ... } }
```

Both blocks carry the same `params` object.
