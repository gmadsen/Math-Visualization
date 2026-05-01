# mostow-boundary-orbit

Bespoke widget for the mostow-rigidity topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke widget for the §4 boundary action and orbit density figure on the mostow-rigidity topic — a step button advances Γ-action iterates on a draggable starting point on S^{n-1}, illustrating ergodicity by orbit-closure density.

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
{ "type": "widget",        "slug": "mostow-boundary-orbit", "params": { ... } },
{ "type": "widget-script", "slug": "mostow-boundary-orbit", "params": { ... } }
```

Both blocks carry the same `params` object.
