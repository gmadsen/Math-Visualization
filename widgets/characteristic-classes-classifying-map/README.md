# characteristic-classes-classifying-map

Bespoke widget for the characteristic-classes topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke bundle-to-classifying-map browser for the characteristic-classes topic — clicking a curated bundle preset shows the corresponding map to (n)$ along with the pulled-back universal Chern generators. The bundle-card grid plus paired classifying-map SVG plus generator readout doesn't fit clickable-diagram or counterexample-explorer.

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
{ "type": "widget",        "slug": "characteristic-classes-classifying-map", "params": { ... } },
{ "type": "widget-script", "slug": "characteristic-classes-classifying-map", "params": { ... } }
```

Both blocks carry the same `params` object.
