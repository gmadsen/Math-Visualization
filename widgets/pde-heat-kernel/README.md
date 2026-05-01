# pde-heat-kernel

Bespoke widget for the partial-differential-equations topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke heat-kernel evolution illustration for the §2 heat equation section on the partial-differential-equations topic — a time slider drives Gaussian-kernel convolution against a piecewise initial datum and the SVG renders the resulting smoothed profile. The initial-data picker + time slider + curve plot doesn't fit a shared slug.

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
{ "type": "widget",        "slug": "pde-heat-kernel", "params": { ... } },
{ "type": "widget-script", "slug": "pde-heat-kernel", "params": { ... } }
```

Both blocks carry the same `params` object.
