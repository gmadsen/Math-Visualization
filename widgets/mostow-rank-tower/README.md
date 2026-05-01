# mostow-rank-tower

Bespoke widget for the mostow-rigidity topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §5 rank-vs-rigidity tower figure on the mostow-rigidity topic — a static SVG ladder showing how the rigidity statement strengthens with rank from rank-1 (Mostow) up to higher-rank (Margulis arithmeticity).

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
{ "type": "widget",        "slug": "mostow-rank-tower", "params": { ... } },
{ "type": "widget-script", "slug": "mostow-rank-tower", "params": { ... } }
```

Both blocks carry the same `params` object.
