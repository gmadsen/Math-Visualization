# numerical-quadrature-error

Bespoke widget for the numerical-analysis topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Quadrature error vs. number of panels: compares trapezoidal and Simpson convergence rates on a log-log plot.

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
{ "type": "widget",        "slug": "numerical-quadrature-error", "params": { ... } },
{ "type": "widget-script", "slug": "numerical-quadrature-error", "params": { ... } }
```

Both blocks carry the same `params` object.
