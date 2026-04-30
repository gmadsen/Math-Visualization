# probabilistic-method-alterations

Bespoke widget for the probabilistic-method topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke alterations-method demo: draw G(n, 1/2), sample S, delete a vertex per edge; watch a true independent set emerge. Concrete instance of the 'sample then prune' alteration trick.

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
{ "type": "widget",        "slug": "probabilistic-method-alterations", "params": { ... } },
{ "type": "widget-script", "slug": "probabilistic-method-alterations", "params": { ... } }
```

Both blocks carry the same `params` object.
