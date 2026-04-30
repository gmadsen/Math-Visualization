# gcb-cyclic-algebra-tester

Bespoke widget for the galois-cohomology-and-brauer topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for §4 of galois-cohomology-and-brauer: choose a base field (R, Q_3, Q_5, C), enter integers a, b, click compute to test whether the cyclic algebra (a,b)_n is split or the quaternion class in Br(K). Shape: paired field/n selects + a/b numeric inputs + button + readout + prose. Doesn't fit any shared slug.

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
{ "type": "widget",        "slug": "gcb-cyclic-algebra-tester", "params": { ... } },
{ "type": "widget-script", "slug": "gcb-cyclic-algebra-tester", "params": { ... } }
```

Both blocks carry the same `params` object.
