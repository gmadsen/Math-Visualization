# gcb-hasse-counterexample-gallery

Bespoke widget for the galois-cohomology-and-brauer topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for §6 of galois-cohomology-and-brauer: pick a classical Hasse-principle counterexample (Selmer 3X^3+4Y^3+5Z^3=0, Lind, Reichardt, a Brauer-Manin quartic), click to render local invariants per place v as colored boxes summing to a nonzero class in Q/Z. Shape: select + button + bespoke SVG invariant grid + readout + prose. Doesn't fit any shared slug.

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
{ "type": "widget",        "slug": "gcb-hasse-counterexample-gallery", "params": { ... } },
{ "type": "widget-script", "slug": "gcb-hasse-counterexample-gallery", "params": { ... } }
```

Both blocks carry the same `params` object.
