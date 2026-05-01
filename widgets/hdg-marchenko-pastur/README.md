# hdg-marchenko-pastur

Bespoke widget for the high-dimensional-geometry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for §6 Marchenko–Pastur on the high-dimensional-geometry topic — sliders over aspect ratio λ = p/n and dimension n + resample button drive a histogram of empirical eigenvalues of an n×n sample covariance with n samples, overlaid against the Marchenko–Pastur density on [(1-√λ)^2, (1+√λ)^2]. Two sliders + button + svg + readout.

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
{ "type": "widget",        "slug": "hdg-marchenko-pastur", "params": { ... } },
{ "type": "widget-script", "slug": "hdg-marchenko-pastur", "params": { ... } }
```

Both blocks carry the same `params` object.
