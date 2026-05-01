# mirror-quintic-periods

Bespoke widget for the mirror-symmetry topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Period-integral plot for the mirror quintic family; sliding the complex modulus z traces the holomorphic period Pi_0(z) and exposes the singular conifold-point behaviour.

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
{ "type": "widget",        "slug": "mirror-quintic-periods", "params": { ... } },
{ "type": "widget-script", "slug": "mirror-quintic-periods", "params": { ... } }
```

Both blocks carry the same `params` object.
