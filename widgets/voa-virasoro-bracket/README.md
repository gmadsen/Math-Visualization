# voa-virasoro-bracket

Bespoke widget for the vertex-operator-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Virasoro bracket calculator for the vertex-operator-algebras topic: the reader picks two L_m, L_n modes and watches the [L_m,L_n] bracket reduce to (m-n)L_(m+n) plus a central charge term.

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
{ "type": "widget",        "slug": "voa-virasoro-bracket", "params": { ... } },
{ "type": "widget-script", "slug": "voa-virasoro-bracket", "params": { ... } }
```

Both blocks carry the same `params` object.
