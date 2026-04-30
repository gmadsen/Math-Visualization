# heights-naive-calculator

Bespoke widget for the heights-arithmetic-geometry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke naive-height reducer for the heights-arithmetic-geometry topic — three integer inputs for projective coordinates plus a 'compute' button, with a multi-line readout that shows the gcd-reduced representative and the resulting H = max(|x_i|). The mixed three-input row + readout shape with embedded gcd reasoning doesn't fit a shared slider/stepper slug.

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
{ "type": "widget",        "slug": "heights-naive-calculator", "params": { ... } },
{ "type": "widget-script", "slug": "heights-naive-calculator", "params": { ... } }
```

Both blocks carry the same `params` object.
