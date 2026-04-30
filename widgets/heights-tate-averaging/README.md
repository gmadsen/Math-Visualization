# heights-tate-averaging

Bespoke widget for the heights-arithmetic-geometry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Tate-averaging visualizer for the heights-arithmetic-geometry topic — two numeric inputs (point P and iteration depth N) drive an SVG plot of h_L([n]P)/n^2 across n=1..N, showing the convergence to the canonical height. The svg+two-input combo with running-quotient plot is bespoke and doesn't fit a shared parametric-plot slug because the iteration is integer-valued and discrete.

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
{ "type": "widget",        "slug": "heights-tate-averaging", "params": { ... } },
{ "type": "widget-script", "slug": "heights-tate-averaging", "params": { ... } }
```

Both blocks carry the same `params` object.
