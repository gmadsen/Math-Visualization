# gcb-tate-pairing-table

Bespoke widget for the galois-cohomology-and-brauer topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for §5 of galois-cohomology-and-brauer: choose an odd prime p and two square-classes a-bar, b-bar in Q_p^x/(Q_p^x)^2, the SVG renders the Hilbert-symbol/Tate-pairing table and the readout reports the cup-product class in H^2(Q_p, mu_2). Shape: triple selects + bespoke SVG table + readout + prose. Doesn't fit any shared slug.

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
{ "type": "widget",        "slug": "gcb-tate-pairing-table", "params": { ... } },
{ "type": "widget-script", "slug": "gcb-tate-pairing-table", "params": { ... } }
```

Both blocks carry the same `params` object.
