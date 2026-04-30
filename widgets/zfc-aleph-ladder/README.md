# zfc-aleph-ladder

Bespoke widget for the zfc-and-ordinals topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke aleph-ladder ladder display tracing aleph_0 through aleph_omega for the zfc-and-ordinals topic. Encodes the cardinal successor + limit construction at a level of granularity unique to the page.

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
{ "type": "widget",        "slug": "zfc-aleph-ladder", "params": { ... } },
{ "type": "widget-script", "slug": "zfc-aleph-ladder", "params": { ... } }
```

Both blocks carry the same `params` object.
