# group-cohomology-coboundary-calculator

Bespoke widget for the group-cohomology topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke coboundary \varphi$ calculator for the group-cohomology topic. Operates on free-form cochain entries specific to the introductory bar-resolution example, so it is not a fit for any shared form-evaluator slug.

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
{ "type": "widget",        "slug": "group-cohomology-coboundary-calculator", "params": { ... } },
{ "type": "widget-script", "slug": "group-cohomology-coboundary-calculator", "params": { ... } }
```

Both blocks carry the same `params` object.
