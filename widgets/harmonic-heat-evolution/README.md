# harmonic-heat-evolution

Bespoke widget for the harmonic-analysis-fourier topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke heat-equation evolution: u(t,x) = (K_t * f)(x) where K_t is the heat kernel. Sliding t evolves an initial spike toward a Gaussian. The convolution-with-fundamental-solution motif appears throughout PDE; here it's pinned to a single concrete kernel.

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
{ "type": "widget",        "slug": "harmonic-heat-evolution", "params": { ... } },
{ "type": "widget-script", "slug": "harmonic-heat-evolution", "params": { ... } }
```

Both blocks carry the same `params` object.
