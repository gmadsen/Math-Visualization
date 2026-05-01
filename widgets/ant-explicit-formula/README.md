# ant-explicit-formula

Bespoke widget for the analytic-number-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke truncated explicit formula visualization showing zeta zeros and the partial sum approximating $\psi(x)$ for the analytic-number-theory topic. The dual zero-strip and oscillation panel is purpose-built for the explicit formula and not reusable as a generic plot.

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
{ "type": "widget",        "slug": "ant-explicit-formula", "params": { ... } },
{ "type": "widget-script", "slug": "ant-explicit-formula", "params": { ... } }
```

Both blocks carry the same `params` object.
