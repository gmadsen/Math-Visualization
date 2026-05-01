# voa-axiom-map

Bespoke widget for the vertex-operator-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Axiom dependency map for the vertex-operator-algebras topic: clickable graph showing which VOA axioms imply or constrain which others.

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
{ "type": "widget",        "slug": "voa-axiom-map", "params": { ... } },
{ "type": "widget-script", "slug": "voa-axiom-map", "params": { ... } }
```

Both blocks carry the same `params` object.
