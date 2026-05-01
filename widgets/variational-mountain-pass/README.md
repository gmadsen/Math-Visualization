# variational-mountain-pass

Bespoke widget for the variational-methods topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Mountain-pass picture — reader scrubs a path between two basins on a 2D landscape and reads off the maximum along the path; the infimum over paths picks out the saddle (mountain-pass) critical value.

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
{ "type": "widget",        "slug": "variational-mountain-pass", "params": { ... } },
{ "type": "widget-script", "slug": "variational-mountain-pass", "params": { ... } }
```

Both blocks carry the same `params` object.
