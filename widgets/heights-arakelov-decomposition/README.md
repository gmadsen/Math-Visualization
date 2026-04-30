# heights-arakelov-decomposition

Bespoke widget for the heights-arithmetic-geometry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Arakelov local-global decomposition for the heights-arithmetic-geometry topic — two numeric inputs (rational point coordinates) plus a 'decompose' button trigger a per-place breakdown showing each finite-prime contribution -log|x|_p alongside the archimedean log max(|A|,|B|), then verifies the Artin-Whaples product formula. The per-place tabular readout with running sum check is bespoke and doesn't fit any shared widget.

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
{ "type": "widget",        "slug": "heights-arakelov-decomposition", "params": { ... } },
{ "type": "widget-script", "slug": "heights-arakelov-decomposition", "params": { ... } }
```

Both blocks carry the same `params` object.
