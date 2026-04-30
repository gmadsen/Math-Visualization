# morse-cw-cells

Bespoke widget for the morse-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke pairing widget that matches each critical point of a Morse function on the torus to its CW cell of the same index for the morse-theory topic. Specific to the index-to-cell correspondence, so it does not fit a shared slug.

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
{ "type": "widget",        "slug": "morse-cw-cells", "params": { ... } },
{ "type": "widget-script", "slug": "morse-cw-cells", "params": { ... } }
```

Both blocks carry the same `params` object.
