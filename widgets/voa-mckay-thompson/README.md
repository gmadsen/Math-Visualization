# voa-mckay-thompson

Bespoke widget for the vertex-operator-algebras topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

McKay-Thompson series viewer: the reader picks a Monster conjugacy class and sees the corresponding T_g(q) Hauptmodul, illustrating monstrous moonshine class-by-class.

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
{ "type": "widget",        "slug": "voa-mckay-thompson", "params": { ... } },
{ "type": "widget-script", "slug": "voa-mckay-thompson", "params": { ... } }
```

Both blocks carry the same `params` object.
