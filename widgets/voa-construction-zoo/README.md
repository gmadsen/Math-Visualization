# voa-construction-zoo

Bespoke widget for the vertex-operator-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

VOA construction zoo: the reader browses canonical VOA constructions (lattice VOAs, affine vertex algebras, free-field, orbifolds, the Monster module) and sees their defining data side by side.

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
{ "type": "widget",        "slug": "voa-construction-zoo", "params": { ... } },
{ "type": "widget-script", "slug": "voa-construction-zoo", "params": { ... } }
```

Both blocks carry the same `params` object.
