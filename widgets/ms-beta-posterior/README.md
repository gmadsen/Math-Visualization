# ms-beta-posterior

Bespoke widget for the mathematical-statistics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Beta posterior update from Bernoulli observations with prior controls.

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
{ "type": "widget",        "slug": "ms-beta-posterior", "params": { ... } },
{ "type": "widget-script", "slug": "ms-beta-posterior", "params": { ... } }
```

Both blocks carry the same `params` object.
