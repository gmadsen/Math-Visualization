# probabilistic-method-existence

Bespoke widget for the probabilistic-method topic.

See [`../README.md`](../README.md) for the registry contract.

## What it does

Bespoke 'existence by averaging' demonstrator: draw random tournaments and watch the average over many trials beat the worst case. Concrete instance of the probabilistic method's central move.

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
{ "type": "widget",        "slug": "probabilistic-method-existence", "params": { ... } },
{ "type": "widget-script", "slug": "probabilistic-method-existence", "params": { ... } }
```

Both blocks carry the same `params` object.
