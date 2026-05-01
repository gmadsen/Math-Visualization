# general-relativity-kerr

Bespoke widget for the general-relativity topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Kerr-metric explorer for the spinning black hole: slide the spin parameter a; watch the inner and outer horizons (r_pm = M plus minus sqrt(M^2 - a^2)) merge at extremality and the ergosphere appear outside the outer horizon.

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
{ "type": "widget",        "slug": "general-relativity-kerr", "params": { ... } },
{ "type": "widget-script", "slug": "general-relativity-kerr", "params": { ... } }
```

Both blocks carry the same `params` object.
