# morse-sphere-vs-rp2

Bespoke widget for the morse-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Morse-count comparison between the 2-sphere and the real projective plane illustrating how Euler characteristic constrains critical-point counts for the morse-theory topic. Specific to this paired application, so it does not fit a shared slug.

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
{ "type": "widget",        "slug": "morse-sphere-vs-rp2", "params": { ... } },
{ "type": "widget-script", "slug": "morse-sphere-vs-rp2", "params": { ... } }
```

Both blocks carry the same `params` object.
