# modular-curves-genus-growth

Bespoke widget for the [`modular-curves`](../../modular-curves.html) topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke genus-formula visualizer on the modular-curves topic — a slider drags N from 1 to 50 and the SVG plots the genus g(X₀(N)) as a histogram together with the cusp/elliptic-point summands ν₂, ν₃, ν_∞ that feed Riemann–Hurwitz, with genus-zero levels highlighted. The annotated histogram with formula breakdown is too specific for a shared slug.

## Params

See [`schema.json`](./schema.json) for the authoritative shape. Summary:

| field            | kind        | purpose |
|---|---|---|
| `widgetId`       | fundamental | DOM id for the outer `<div class="widget">`. |
| `title`          | fundamental | Header title (rendered inside a `<span class="ttl">`). |
| `hint`           | fundamental | Header hint (rendered inside a `<span class="hint">`). |
| `bodyMarkup`     | *artifact*  | Verbatim inner-body HTML (controls, SVG, readouts). |
| `sectionComment` | *artifact*  | Optional `/* ... */` banner above the IIFE. |
| `bodyScript`     | *artifact*  | Verbatim IIFE body. |

## Usage

```json
{ "type": "widget",        "slug": "modular-curves-genus-growth", "params": { ... } },
{ "type": "widget-script", "slug": "modular-curves-genus-growth", "params": { ... } }
```

Both blocks carry the same `params` object.
