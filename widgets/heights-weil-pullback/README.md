# heights-weil-pullback

Bespoke widget for the heights-arithmetic-geometry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Weil-height pullback tracer for the heights-arithmetic-geometry topic — four numeric inputs (degree d, point P, plus parameters) feeding a multi-line readout that compares h(f(P)) to d * h(P) and shows the bounded discrepancy O(1). The four-input + comparison readout shape is one-off and doesn't fit a shared slider/stepper slug.

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
{ "type": "widget",        "slug": "heights-weil-pullback", "params": { ... } },
{ "type": "widget-script", "slug": "heights-weil-pullback", "params": { ... } }
```

Both blocks carry the same `params` object.
