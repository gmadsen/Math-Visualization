# large-dev-rate-gallery

Bespoke widget for the large-deviations topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Rate-function gallery: switch among canonical I(x) shapes (Gaussian, exponential, Bernoulli) to compare their convex profiles and zeros.

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
{ "type": "widget",        "slug": "large-dev-rate-gallery", "params": { ... } },
{ "type": "widget-script", "slug": "large-dev-rate-gallery", "params": { ... } }
```

Both blocks carry the same `params` object.
