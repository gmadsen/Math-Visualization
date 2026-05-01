# voa-character-coeffs

Bespoke widget for the vertex-operator-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Leading q-coefficients of the moonshine module character: the reader steps through low orders of Tr(q^(L_0-c/24)) on V-natural to see the j-function shape emerge.

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
{ "type": "widget",        "slug": "voa-character-coeffs", "params": { ... } },
{ "type": "widget-script", "slug": "voa-character-coeffs", "params": { ... } }
```

Both blocks carry the same `params` object.
