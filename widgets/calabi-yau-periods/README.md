# calabi-yau-periods

Bespoke widget for the calabi-yau-manifolds topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Animates the period integrals int_A Omega and int_B Omega over A- and B-cycles of a 1-parameter elliptic family as the modular parameter tau varies. Bespoke because the visualization fuses a parallelogram lattice, oriented A/B cycles, and live tau-dependent period readouts into a single coordinated frame.

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
{ "type": "widget",        "slug": "calabi-yau-periods", "params": { ... } },
{ "type": "widget-script", "slug": "calabi-yau-periods", "params": { ... } }
```

Both blocks carry the same `params` object.
