# ant-pnt-comparison

Bespoke widget for the analytic-number-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke comparison plot of $\pi(x)$ vs $x/\log x$ vs $\mathrm{Li}(x)$ with a slider over $x$ for the analytic-number-theory topic. The triple overlay with sieved prime counting and live error readouts is too specific to the prime number theorem to fit any shared plotting slug.

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
{ "type": "widget",        "slug": "ant-pnt-comparison", "params": { ... } },
{ "type": "widget-script", "slug": "ant-pnt-comparison", "params": { ... } }
```

Both blocks carry the same `params` object.
