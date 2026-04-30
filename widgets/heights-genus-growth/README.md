# heights-genus-growth

Bespoke widget for the heights-arithmetic-geometry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Faltings/genus-growth indicator for the heights-arithmetic-geometry topic — a single genus-g slider that updates a qualitative readout describing the expected rational-point behaviour (genus 0 = infinite, genus 1 = finitely generated, genus >= 2 = finite by Faltings). The slider+qualitative-prose-readout shape is bespoke and meaningfully different from numeric stepper slugs.

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
{ "type": "widget",        "slug": "heights-genus-growth", "params": { ... } },
{ "type": "widget-script", "slug": "heights-genus-growth", "params": { ... } }
```

Both blocks carry the same `params` object.
