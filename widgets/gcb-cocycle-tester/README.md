# gcb-cocycle-tester

Bespoke widget for the galois-cohomology-and-brauer topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for §1 of galois-cohomology-and-brauer: pick a candidate value of phi(sigma) in Q(i)^* from a dropdown of norm-one and non-norm-one targets, then click test-and-trivialise. The widget reports whether phi extends to a 1-cocycle (norm-one check) and, if so, exhibits an explicit Hilbert-90 witness alpha with sigma(alpha)/alpha = phi(sigma). Shape: select + button + multi-line readout, with bracketing prose rows. Doesn't fit any shared slug.

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
{ "type": "widget",        "slug": "gcb-cocycle-tester", "params": { ... } },
{ "type": "widget-script", "slug": "gcb-cocycle-tester", "params": { ... } }
```

Both blocks carry the same `params` object.
