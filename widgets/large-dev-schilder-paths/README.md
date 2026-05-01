# large-dev-schilder-paths

Bespoke widget for the large-deviations topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Schilder + Freidlin-Wentzell: sketch sample paths and read off the action functional that governs their large-deviation cost.

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
{ "type": "widget",        "slug": "large-dev-schilder-paths", "params": { ... } },
{ "type": "widget-script", "slug": "large-dev-schilder-paths", "params": { ... } }
```

Both blocks carry the same `params` object.
