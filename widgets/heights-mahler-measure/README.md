# heights-mahler-measure

Bespoke widget for the heights-arithmetic-geometry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Mahler-measure calculator for the heights-arithmetic-geometry topic — a single textarea-style input takes integer polynomial coefficients, and a 'compute' button triggers a multi-line readout showing the leading coefficient, the roots, and M(p) = |a_d| * prod(max(1,|alpha_i|)). The free-form coefficient-list input + root-by-root breakdown readout is bespoke and doesn't fit a shared input/readout slug.

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
{ "type": "widget",        "slug": "heights-mahler-measure", "params": { ... } },
{ "type": "widget-script", "slug": "heights-mahler-measure", "params": { ... } }
```

Both blocks carry the same `params` object.
