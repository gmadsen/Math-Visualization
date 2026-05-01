# crypto-totient-units

Bespoke widget for the mathematics-and-cryptography topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Euler totient and unit group explorer

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
{ "type": "widget",        "slug": "crypto-totient-units", "params": { ... } },
{ "type": "widget-script", "slug": "crypto-totient-units", "params": { ... } }
```

Both blocks carry the same `params` object.
