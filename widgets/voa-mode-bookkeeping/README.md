# voa-mode-bookkeeping

Bespoke widget for the vertex-operator-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Mode-bookkeeping widget for the vertex-operator-algebras topic: lets the reader explore how Y(a,z) expands into modes a_(n) and how brackets reshuffle them.

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
{ "type": "widget",        "slug": "voa-mode-bookkeeping", "params": { ... } },
{ "type": "widget-script", "slug": "voa-mode-bookkeeping", "params": { ... } }
```

Both blocks carry the same `params` object.
