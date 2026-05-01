# general-relativity-schwarzschild

Bespoke widget for the general-relativity topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Schwarzschild-solution explorer: slide the Schwarzschild radius r_s; watch the metric's coordinate singularity at r = r_s and the curvature singularity at r = 0. Surfaces the geometry around a non-rotating black hole.

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
{ "type": "widget",        "slug": "general-relativity-schwarzschild", "params": { ... } },
{ "type": "widget-script", "slug": "general-relativity-schwarzschild", "params": { ... } }
```

Both blocks carry the same `params` object.
