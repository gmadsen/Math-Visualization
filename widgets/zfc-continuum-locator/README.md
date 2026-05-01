# zfc-continuum-locator

Bespoke widget for the zfc-and-ordinals topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke continuum-hypothesis locator placing 2^aleph_0 on the aleph hierarchy under different model assumptions for the zfc-and-ordinals topic. Encodes CH-specific independence-result intuition not generalizable.

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
{ "type": "widget",        "slug": "zfc-continuum-locator", "params": { ... } },
{ "type": "widget-script", "slug": "zfc-continuum-locator", "params": { ... } }
```

Both blocks carry the same `params` object.
