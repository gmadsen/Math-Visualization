# calabi-yau-mirror-swap

Bespoke widget for the calabi-yau-manifolds topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Sweeps a continuous mirror map t in [0,1] that morphs the quintic's Hodge diamond into its mirror's, swapping h^{1,1} and h^{2,1} entries continuously for visual effect. Bespoke because the side-by-side diamond morph and the interpolated central rows encode the mirror correspondence as a one-off pedagogical animation.

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
{ "type": "widget",        "slug": "calabi-yau-mirror-swap", "params": { ... } },
{ "type": "widget-script", "slug": "calabi-yau-mirror-swap", "params": { ... } }
```

Both blocks carry the same `params` object.
