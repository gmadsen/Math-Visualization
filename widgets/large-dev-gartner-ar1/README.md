# large-dev-gartner-ar1

Bespoke widget for the large-deviations topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

AR(1) Gartner-Ellis: tune the persistence parameter and watch how dependence reshapes the rate function I(x).

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
{ "type": "widget",        "slug": "large-dev-gartner-ar1", "params": { ... } },
{ "type": "widget-script", "slug": "large-dev-gartner-ar1", "params": { ... } }
```

Both blocks carry the same `params` object.
