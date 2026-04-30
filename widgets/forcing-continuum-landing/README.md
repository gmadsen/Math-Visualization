# forcing-continuum-landing

Bespoke widget for the forcing-and-independence topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Where the continuum 2^aleph_0 can land under different forcing extensions

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
{ "type": "widget",        "slug": "forcing-continuum-landing", "params": { ... } },
{ "type": "widget-script", "slug": "forcing-continuum-landing", "params": { ... } }
```

Both blocks carry the same `params` object.
