# matroid-dual-explorer

Bespoke widget for the §5 dual matroid on the
[`matroid-theory`](../../matroid-theory.html#duality) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §5 dual-matroid explorer on the matroid-theory topic — two preset buttons toggling between $U_{2,4}$ and $M(K_4)$ minus an edge, an SVG that draws the dual matroid $M^*$ for the chosen example, and a readout reporting its bases, rank, and cocircuits. The shape (preset toggle row + SVG + readout) is bespoke; this slug captures it as one unit and keeps the dual computation and SVG layout opaque in the bodyScript artifact.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title. |
| `hint`           | fundamental | Header hint. |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (two-button preset row, SVG host, readout, trailing <div class="small"> note). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body — maintains the current preset, computes the dual matroid (bases, rank, cocircuits) and redraws the SVG, updates the readout. |

## Usage

```json
{ "type": "widget",        "slug": "matroid-dual-explorer", "params": { ... } },
{ "type": "widget-script", "slug": "matroid-dual-explorer", "params": { ... } }
```

Both blocks carry the same `params` object.
