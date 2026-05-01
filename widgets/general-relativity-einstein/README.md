# general-relativity-einstein

Bespoke widget for the general-relativity topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke Einstein-equation toy for general-relativity: pick a stress-energy ansatz (vacuum, dust, perfect fluid) and watch which side of G_{mu nu} = 8 pi T_{mu nu} drives the geometry. Concrete pedagogical scaffold for 'matter tells space how to curve.'

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
{ "type": "widget",        "slug": "general-relativity-einstein", "params": { ... } },
{ "type": "widget-script", "slug": "general-relativity-einstein", "params": { ... } }
```

Both blocks carry the same `params` object.
