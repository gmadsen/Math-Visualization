# morse-smale-saddle

Bespoke widget for the morse-theory topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke visualizer of the stable and unstable manifolds of a saddle critical point illustrating the Morse-Smale transversality condition for the morse-theory topic. Specific to saddle-pair geometry, so it does not fit a shared slug.

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
{ "type": "widget",        "slug": "morse-smale-saddle", "params": { ... } },
{ "type": "widget-script", "slug": "morse-smale-saddle", "params": { ... } }
```

Both blocks carry the same `params` object.
