# designs-fisher-incidence

Bespoke widget for the designs topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke incidence-matrix N visualizer for the Fisher inequality section: step through points to spotlight a row of N and the matching column of N N^T. Surfaces the diagonal block lambda I + (r - lambda) J that proves b >= v.

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
{ "type": "widget",        "slug": "designs-fisher-incidence", "params": { ... } },
{ "type": "widget-script", "slug": "designs-fisher-incidence", "params": { ... } }
```

Both blocks carry the same `params` object.
