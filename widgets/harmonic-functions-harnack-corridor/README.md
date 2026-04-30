# harmonic-functions-harnack-corridor

Bespoke widget for the harmonic-functions topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Plot of a positive harmonic function with the Harnack two-point ratio bounds rendered as a corridor over a chosen compact subset. Reveals how positivity forces a uniform comparability factor depending only on the geometry.

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
{ "type": "widget",        "slug": "harmonic-functions-harnack-corridor", "params": { ... } },
{ "type": "widget-script", "slug": "harmonic-functions-harnack-corridor", "params": { ... } }
```

Both blocks carry the same `params` object.
