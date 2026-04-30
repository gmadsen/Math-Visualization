# morse-handle-decomp

Bespoke widget for the morse-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke sublevel-set sweep that builds a torus by handle attachment as the slider crosses each critical value for the morse-theory topic. Specific to handle-by-handle assembly, so it does not fit a shared slug.

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
{ "type": "widget",        "slug": "morse-handle-decomp", "params": { ... } },
{ "type": "widget-script", "slug": "morse-handle-decomp", "params": { ... } }
```

Both blocks carry the same `params` object.
