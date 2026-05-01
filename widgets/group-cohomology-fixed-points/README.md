# group-cohomology-fixed-points

Bespoke widget for the group-cohomology topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke fixed-points calculator that lets the reader pick a small group action and read off ^0=M^G$ by inspection. Tied to the topic's specific menu of toy modules, so not generalizable to a shared slug.

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
{ "type": "widget",        "slug": "group-cohomology-fixed-points", "params": { ... } },
{ "type": "widget-script", "slug": "group-cohomology-fixed-points", "params": { ... } }
```

Both blocks carry the same `params` object.
