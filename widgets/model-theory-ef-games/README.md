# model-theory-ef-games

Bespoke widget for the model-theory-basics topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Ehrenfeucht–Fraïssé games widget for the model-theory-basics topic: simulates a duplicator/spoiler game on two structures over n rounds, providing the combinatorial bound on quantifier rank needed to distinguish them.

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
{ "type": "widget",        "slug": "model-theory-ef-games", "params": { ... } },
{ "type": "widget-script", "slug": "model-theory-ef-games", "params": { ... } }
```

Both blocks carry the same `params` object.
