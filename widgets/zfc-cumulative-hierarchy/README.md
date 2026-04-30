# zfc-cumulative-hierarchy

Bespoke widget for the zfc-and-ordinals topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke stage-by-stage cumulative hierarchy V_alpha visualizer for the zfc-and-ordinals topic. Specific to ZFC's iterated power-set construction, with no reuse outside this page.

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
{ "type": "widget",        "slug": "zfc-cumulative-hierarchy", "params": { ... } },
{ "type": "widget-script", "slug": "zfc-cumulative-hierarchy", "params": { ... } }
```

Both blocks carry the same `params` object.
